import { readFile } from 'node:fs/promises'
import { AramggDeveloperApi, UpstreamError } from './upstream.js'
import { localeSchema } from './schema.js'

try {
  const keyFile = process.env.OWNER_API_KEY_FILE
  if (!keyFile) throw new UpstreamError('OWNER_API_KEY_FILE_REQUIRED')
  const key = (await readFile(keyFile, 'utf8')).trim()
  const api = new AramggDeveloperApi(key, localeSchema.parse(process.env.PROBE_LOCALE ?? 'zh-CN'), process.env.PROBE_CACHE_DIR ?? 'data/upstream-probe')
  console.log(JSON.stringify(await api.probe()))
} catch (error) {
  console.error(JSON.stringify({ status: 'failed', code: error instanceof UpstreamError ? error.code : 'PROBE_VALIDATION_OR_STORAGE_ERROR' }))
  process.exitCode = 1
}
