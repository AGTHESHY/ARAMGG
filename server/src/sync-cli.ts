import { readFile } from 'node:fs/promises'
import { createRuntime } from './runtime.js'
import { AramggDeveloperApi, UpstreamError } from './upstream.js'
import { localeSchema } from './schema.js'

let close: (() => Promise<void>) | undefined
try {
  const keyFile = process.env.OWNER_API_KEY_FILE
  if (!keyFile) throw new UpstreamError('OWNER_API_KEY_FILE_REQUIRED')
  const key = (await readFile(keyFile, 'utf8')).trim()
  const runtime = await createRuntime()
  close = () => runtime.catalog.close()
  const limit = Number.parseInt(process.env.SYNC_CREDIT_LIMIT ?? '200', 10)
  if (!Number.isInteger(limit) || limit < 0 || limit > 200) throw new UpstreamError('INVALID_SYNC_CREDIT_LIMIT')
  const api = new AramggDeveloperApi(
    key,
    localeSchema.parse(process.env.SYNC_LOCALE ?? 'zh-CN'),
    process.env.SYNC_CACHE_DIR ?? 'data/upstream-cache',
    fetch,
    limit,
  )
  console.log(JSON.stringify(await api.syncFormal(snapshot => runtime.snapshots.publish(snapshot))))
} catch (error) {
  console.error(JSON.stringify({ status: 'failed', code: error instanceof UpstreamError ? error.code : 'SYNC_VALIDATION_OR_STORAGE_ERROR' }))
  process.exitCode = 1
} finally {
  await close?.()
}
