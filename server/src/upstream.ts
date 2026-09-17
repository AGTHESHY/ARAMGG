import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { localeSchema, versionSchema, type Locale } from './schema.js'

const origin = 'https://data.dtodo.cn'
const upstreamLocales = { 'zh-CN': 'zh-CN', 'en-US': 'en', 'zh-TW': 'zh-TW' } as const
const configSchema = z.object({ locale: z.string(), dataVersion: versionSchema, gamePatch: z.string().min(1) })
const envelopeSchema = z.object({ meta: configSchema.passthrough(), data: z.unknown() })
const rowSchema = z.object({ id: z.number().int().positive(), name: z.string() }).passthrough()
const detailSchema = z.object({ champion: rowSchema, builds: z.array(z.unknown()), augments: z.array(z.unknown()) }).passthrough()

export class UpstreamError extends Error {
  constructor(readonly code: string) { super(code) }
}

// Errors deliberately omit headers, response bodies and keys. No automatic retry:
// an ambiguous network failure might already have consumed upstream credits.
export class AramggDeveloperApi {
  private prefix: string
  private apiLocale: string
  private spent = 0
  private remaining: number | null = null
  constructor(private key: string, private locale: Locale, private cacheRoot: string, private transport: typeof fetch = fetch) {
    this.apiLocale = upstreamLocales[localeSchema.parse(locale)]
    this.prefix = `${origin}/api/v1/${this.apiLocale}/`
    if (!/^hx_live_[a-zA-Z0-9]+$/.test(key)) throw new UpstreamError('INVALID_KEY_FORMAT')
  }
  private async request(resource: string, method: 'GET' | 'HEAD', paid = false): Promise<Response> {
    let response: Response
    try {
      response = await this.transport(this.prefix + resource, {
        method, redirect: 'error', signal: AbortSignal.timeout(30000),
        headers: paid ? { Authorization: `Bearer ${this.key}` } : {},
      })
    } catch { throw new UpstreamError('UPSTREAM_NETWORK_ERROR') }
    const remaining = response.headers.get('x-credits-remaining')
    if (remaining !== null && Number.isFinite(Number(remaining))) this.remaining = Number(remaining)
    if (!response.ok) {
      await response.body?.cancel()
      throw new UpstreamError(`UPSTREAM_HTTP_${response.status}`)
    }
    return response
  }
  private async json(response: Response): Promise<unknown> {
    const reader = response.body?.getReader()
    if (!reader) throw new UpstreamError('EMPTY_UPSTREAM_RESPONSE')
    const chunks: Uint8Array[] = []
    let length = 0
    try {
      for (;;) {
        const next = await reader.read()
        if (next.done) break
        length += next.value.length
        if (length > 16 * 1024 * 1024) { await reader.cancel(); throw new UpstreamError('UPSTREAM_RESPONSE_TOO_LARGE') }
        chunks.push(next.value)
      }
      return JSON.parse(Buffer.concat(chunks).toString('utf8'))
    } catch (error) {
      if (error instanceof UpstreamError) throw error
      throw new UpstreamError('INVALID_UPSTREAM_JSON')
    }
  }
  private async config() {
    const parsed = configSchema.safeParse(await this.json(await this.request('config.json', 'GET')))
    if (!parsed.success || parsed.data.locale !== this.apiLocale) throw new UpstreamError('UPSTREAM_CONFIG_MISMATCH')
    return parsed.data
  }
  private verifyEnvelope(raw: unknown, version: string) {
    const parsed = envelopeSchema.safeParse(raw)
    if (!parsed.success || parsed.data.meta.locale !== this.apiLocale || parsed.data.meta.dataVersion !== version) throw new UpstreamError('UPSTREAM_VERSION_OR_LOCALE_MISMATCH')
    return parsed.data
  }
  private async resource(name: string, version: string, cost: number) {
    if (!/^(champions|augments|items)\.json$|^champions\/[1-9][0-9]*\.json$/.test(name)) throw new UpstreamError('INVALID_RESOURCE')
    const directory = path.join(this.cacheRoot, this.locale, versionSchema.parse(version))
    const file = path.join(directory, name)
    try {
      const raw: unknown = JSON.parse(await readFile(file, 'utf8'))
      return this.verifyEnvelope(raw, version)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw new UpstreamError('INVALID_PROBE_CACHE')
    }
    if (this.spent + cost > 5 || (this.remaining !== null && this.remaining < cost)) throw new UpstreamError('PROBE_CREDIT_LIMIT')
    this.spent += cost
    const envelope = this.verifyEnvelope(await this.json(await this.request(name, 'GET', true)), version)
    await mkdir(path.dirname(file), { recursive: true })
    const temporary = `${file}.${randomUUID()}.tmp`
    await writeFile(temporary, JSON.stringify(envelope), { mode: 0o600, flag: 'wx' })
    await rename(temporary, file)
    return envelope
  }
  async probe() {
    const config = await this.config()
    const head = await this.request('champions.json', 'HEAD', true)
    await head.body?.cancel()
    const creditsBefore = this.remaining
    const champions = z.array(rowSchema).min(1).parse((await this.resource('champions.json', config.dataVersion, 1)).data)
    const augments = z.array(rowSchema).min(1).parse((await this.resource('augments.json', config.dataVersion, 1)).data)
    const items = z.array(rowSchema).min(1).parse((await this.resource('items.json', config.dataVersion, 1)).data)
    const championId = champions[0]!.id
    const detail = detailSchema.parse((await this.resource(`champions/${championId}.json`, config.dataVersion, 2)).data)
    if (detail.champion.id !== championId) throw new UpstreamError('UPSTREAM_CHAMPION_MISMATCH')
    const finalConfig = await this.config()
    if (finalConfig.dataVersion !== config.dataVersion) throw new UpstreamError('UPSTREAM_CHANGED_DURING_PROBE')
    return {
      status: 'ok', scope: 'connectivity-probe', snapshotPublished: false,
      locale: this.locale, dataVersion: config.dataVersion, gamePatch: config.gamePatch,
      champions: champions.length, augments: augments.length, items: items.length,
      testedChampionId: championId, builds: detail.builds.length, championAugments: detail.augments.length,
      creditsBefore, creditsRemaining: this.remaining, creditsRequestedThisRun: this.spent,
      estimatedFullLocaleCredits: 3 + champions.length * 2,
    }
  }
}
