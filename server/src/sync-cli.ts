import { readFile } from 'node:fs/promises'
import { createRuntime } from './runtime.js'
import { AramggDeveloperApi, UpstreamError } from './upstream.js'
import { localeSchema } from './schema.js'
import { ZodError } from 'zod'

let close: (() => Promise<void>) | undefined
try {
  const keyFile = process.env.OWNER_API_KEY_FILE
  if (!keyFile) throw new UpstreamError('OWNER_API_KEY_FILE_REQUIRED')
  const ownerKeys = (await readFile(keyFile, 'utf8')).split(/\r?\n/).map(value => value.trim()).filter(Boolean)
  if (ownerKeys.length === 0) throw new UpstreamError('OWNER_API_KEY_REQUIRED')
  const runtime = await createRuntime()
  close = async () => { await runtime.accounts?.close(); await runtime.catalog.close() }
  const limit = Number.parseInt(process.env.SYNC_CREDIT_LIMIT ?? '200', 10)
  if (!Number.isInteger(limit) || limit < 0 || limit > 200) throw new UpstreamError('INVALID_SYNC_CREDIT_LIMIT')
  const locale = localeSchema.parse(process.env.SYNC_LOCALE ?? 'zh-CN')
  const cacheDir = process.env.SYNC_CACHE_DIR ?? 'data/upstream-cache'
  const publish = (snapshot: unknown) => runtime.snapshots.publish(snapshot)
  let finalResult: Awaited<ReturnType<AramggDeveloperApi['syncFormal']>> | undefined
  let source = 'owner'
  let sourceIndex = 0

  for (const [index, key] of ownerKeys.entries()) {
    const api = new AramggDeveloperApi(key, locale, cacheDir, fetch, limit)
    finalResult = await api.syncFormal(publish)
    sourceIndex = index + 1
    if (finalResult.snapshotPublished) break
  }
  if (!finalResult?.snapshotPublished && runtime.accounts) {
    source = 'shared'
    for (const [index, candidate] of (await runtime.accounts.candidates()).entries()) {
      const allowance = Math.min(limit, candidate.dailyLimit - candidate.usedToday)
      if (allowance < 2) continue
      const api = new AramggDeveloperApi(candidate.key, locale, cacheDir, fetch, allowance)
      finalResult = await api.syncFormal(publish)
      await runtime.accounts.recordUsage(candidate.id, finalResult.creditsRequestedThisRun)
      sourceIndex = index + 1
      if (finalResult.snapshotPublished) break
    }
  }
  console.log(JSON.stringify({ ...finalResult, credentialSource: source, credentialIndex: sourceIndex }))
} catch (error) {
  const details = error instanceof ZodError
    ? error.issues.slice(0, 5).map(issue => ({ path: issue.path.join('.'), code: issue.code }))
    : undefined
  console.error(JSON.stringify({ status: 'failed', code: error instanceof UpstreamError ? error.code : 'SYNC_VALIDATION_OR_STORAGE_ERROR', details }))
  process.exitCode = 1
} finally {
  await close?.()
}
