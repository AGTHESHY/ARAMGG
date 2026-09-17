import { createHash, randomUUID } from 'node:crypto'
import { mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'
import type { Catalog, SnapshotRecord } from './catalog.js'
import { filePathSchema, localeSchema, validateSnapshot, versionSchema, type Locale } from './schema.js'

const hash = (data: Buffer | string) => createHash('sha256').update(data).digest('hex')
const manifestSchema = z.object({
  locale: localeSchema, dataVersion: versionSchema,
  files: z.array(z.object({ path: filePathSchema, bytes: z.number().int().positive(), sha256: z.string().regex(/^[a-f0-9]{64}$/) })).min(1),
})

export class Snapshots {
  constructor(private root: string, readonly catalog: Catalog) {}
  private directory(locale: Locale, version: string): string {
    return path.join(this.root, 'snapshots', localeSchema.parse(locale), versionSchema.parse(version))
  }
  async publish(raw: unknown): Promise<{ created: boolean; record: SnapshotRecord }> {
    const input = validateSnapshot(raw)
    return this.catalog.exclusive(input.locale, async () => {
      const existing = await this.catalog.find(input.locale, input.dataVersion)
      // Existing versions are immutable; also do not undo an intentional rollback.
      if (existing) return { created: false, record: existing }
      const record: SnapshotRecord = {
        locale: input.locale, dataVersion: input.dataVersion, gamePatch: input.gamePatch,
        source: input.source, generatedAt: new Date().toISOString(),
      }
      const directory = this.directory(input.locale, input.dataVersion)
      const staging = path.join(this.root, 'staging', randomUUID())
      await mkdir(staging, { recursive: true })
      try {
        const files = []
        for (const [logicalPath, payload] of Object.entries(input.files).sort(([a], [b]) => a.localeCompare(b))) {
          const body = JSON.stringify(payload) + '\n'
          const destination = path.join(staging, logicalPath)
          await mkdir(path.dirname(destination), { recursive: true })
          await writeFile(destination, body, { flag: 'wx' })
          files.push({ path: logicalPath, url: `/api/client/v1/data/${input.dataVersion}/${input.locale}/${logicalPath}`, bytes: Buffer.byteLength(body), sha256: hash(body) })
        }
        await writeFile(path.join(staging, 'manifest.json'), JSON.stringify({ schemaVersion: 1, ...record, files }) + '\n', { flag: 'wx' })
        await this.verifyDirectory(staging, record)
        await mkdir(path.dirname(directory), { recursive: true })
        // A crash after rename leaves an unpublished directory. Remove only such
        // orphans while holding the locale lock; registered snapshots are never overwritten.
        await rm(directory, { recursive: true, force: true })
        await rename(staging, directory)
        await this.catalog.publish(record)
        return { created: true, record }
      } finally { await rm(staging, { recursive: true, force: true }) }
    })
  }
  private async verifyDirectory(directory: string, record: SnapshotRecord): Promise<void> {
    const manifest = manifestSchema.parse(JSON.parse(await readFile(path.join(directory, 'manifest.json'), 'utf8')))
    if (manifest.locale !== record.locale || manifest.dataVersion !== record.dataVersion) throw new Error('Manifest identity mismatch')
    const files: Record<string, unknown> = {}
    for (const entry of manifest.files) {
      if (entry.path in files) throw new Error('Duplicate manifest path')
      const body = await readFile(path.join(directory, entry.path))
      if (body.length !== entry.bytes || hash(body) !== entry.sha256) throw new Error('Snapshot checksum mismatch')
      files[entry.path] = JSON.parse(body.toString('utf8'))
    }
    validateSnapshot({ ...record, files })
  }
  async rollback(locale: Locale, version: string): Promise<void> {
    localeSchema.parse(locale)
    versionSchema.parse(version)
    await this.catalog.exclusive(locale, async () => {
      const record = await this.catalog.find(locale, version)
      if (!record) throw new Error('Snapshot does not exist')
      await this.verifyDirectory(this.directory(locale, version), record)
      await this.catalog.activate(locale, version)
    })
  }
  async read(locale: Locale, version: string, logicalPath: string): Promise<{ body: Buffer; etag: string } | null> {
    localeSchema.parse(locale)
    versionSchema.parse(version)
    if (logicalPath !== 'manifest.json') filePathSchema.parse(logicalPath)
    if (!await this.catalog.find(locale, version)) return null
    try {
      const body = await readFile(path.join(this.directory(locale, version), logicalPath))
      return { body, etag: `"${hash(body)}"` }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
      throw error
    }
  }
  async syncStatus(locale: Locale): Promise<unknown | null> {
    localeSchema.parse(locale)
    const directory = path.join(this.root, 'upstream-cache', locale)
    try {
      const versions = await readdir(directory)
      const statuses = await Promise.all(versions.map(async version => {
        versionSchema.parse(version)
        try { return JSON.parse(await readFile(path.join(directory, version, 'sync-status.json'), 'utf8')) as { updatedAt?: string } }
        catch (error) {
          if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
          throw error
        }
      }))
      return statuses.filter(status => status !== null).sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))[0] ?? null
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
      throw error
    }
  }
}
