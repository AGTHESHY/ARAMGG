import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import {
  getClientDataUrlPathname,
  normalizeClientDataPath,
  resolveClientDataFilePath,
  resolveTrustedClientDataUrl,
} from '../src/shared/client-data-security.ts'

const DATA_API_ORIGIN = process.env.ARAMGG_DATA_API_ORIGIN || 'https://aramgg.38-92-15-80.sslip.io'
const DATA_ALLOWED_ORIGINS = process.env.ARAMGG_DATA_ALLOWED_ORIGINS || ''
const DATA_API_PREFIX = '/api/client/v1'
const DATA_API_CONFIG_PATH = `${DATA_API_PREFIX}/config`
const OUTPUT_DIR = process.env.ARAMGG_CLIENT_DATA_DIR || path.join('resources', 'client-data')
const DOWNLOAD_CONCURRENCY = parsePositiveInteger(process.env.ARAMGG_CLIENT_DATA_CONCURRENCY, 3)
const REQUEST_TIMEOUT_MS = parsePositiveInteger(process.env.ARAMGG_CLIENT_DATA_TIMEOUT_MS, 120000)
const REQUEST_RETRY_COUNT = parsePositiveInteger(process.env.ARAMGG_CLIENT_DATA_RETRIES, 5)
const RETRY_BASE_DELAY_MS = parsePositiveInteger(process.env.ARAMGG_CLIENT_DATA_RETRY_DELAY_MS, 1500)
const RETRY_MAX_DELAY_MS = parsePositiveInteger(process.env.ARAMGG_CLIENT_DATA_RETRY_MAX_DELAY_MS, 10000)
const PROGRESS_LOG_INTERVAL_MS = parsePositiveInteger(
  process.env.ARAMGG_CLIENT_DATA_PROGRESS_INTERVAL_MS,
  15000
)

export const DEFAULT_CLIENT_DATA_LOCALE = 'zh-CN'
export const SUPPORTED_CLIENT_DATA_LOCALES = ['zh-CN', 'en-US', 'zh-TW']

const REQUIRED_DATA_PATHS = new Set([
  'augments.json',
  'champions.json',
  'items.json',
  'manifest.json',
  'champion-shards/index.json',
])

const localeAliases = new Map([
  ['zh', 'zh-CN'],
  ['zh-cn', 'zh-CN'],
  ['zh-hans', 'zh-CN'],
  ['zh-sg', 'zh-CN'],
  ['cn', 'zh-CN'],
  ['en', 'en-US'],
  ['en-us', 'en-US'],
  ['en-gb', 'en-US'],
  ['us', 'en-US'],
  ['zh-tw', 'zh-TW'],
  ['zh-hant', 'zh-TW'],
  ['zh-hk', 'zh-TW'],
  ['zh-mo', 'zh-TW'],
  ['tw', 'zh-TW'],
])

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value || '', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function formatBytes(value) {
  const bytes = Number(value || 0)
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function formatDuration(value) {
  const totalSeconds = Math.max(0, Math.floor(Number(value || 0) / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
}

function tryNormalizeLocale(value) {
  const normalized = String(value || '')
    .trim()
    .replace(/_/g, '-')
    .toLowerCase()

  return localeAliases.get(normalized) || null
}

function getApiUrl(resourcePath) {
  const p = resourcePath.startsWith('/') ? resourcePath : `${DATA_API_PREFIX}/${resourcePath}`
  return resolveTrustedClientDataUrl(p, DATA_API_ORIGIN, DATA_ALLOWED_ORIGINS)
}

function normalizeDataPath(value) {
  return normalizeClientDataPath(value)
}

function sanitizePathPart(value) {
  return String(value).replace(/[^a-zA-Z0-9._-]/g, '_')
}

function resolveVersionResourcePath(dataVersion, resourcePath) {
  if (/^https?:\/\//i.test(resourcePath) || resourcePath.startsWith('/')) {
    return resourcePath
  }

  return `${DATA_API_PREFIX}/data/${encodeURIComponent(dataVersion)}/${normalizeDataPath(resourcePath)}`
}

function isBundledDataPath(dataPath) {
  const normalizedPath = normalizeDataPath(dataPath)
  return REQUIRED_DATA_PATHS.has(normalizedPath) || normalizedPath.startsWith('champion-shards/')
}

export function getLocalePointerFileName(locale) {
  return locale === DEFAULT_CLIENT_DATA_LOCALE ? 'current.json' : `current.${locale}.json`
}

export function getLocaleVersionRelativePath(locale, dataVersion) {
  return locale === DEFAULT_CLIENT_DATA_LOCALE
    ? path.join('versions', sanitizePathPart(dataVersion))
    : path.join('versions', sanitizePathPart(locale), sanitizePathPart(dataVersion))
}

function getLocaleVersionsRoot(locale) {
  return locale === DEFAULT_CLIENT_DATA_LOCALE
    ? path.join(OUTPUT_DIR, 'versions')
    : path.join(OUTPUT_DIR, 'versions', sanitizePathPart(locale))
}

function isLocaleDirectoryName(value) {
  return tryNormalizeLocale(value) != null
}

export function shouldPruneVersionDirectory(locale, entryName, activeDataVersion) {
  if (entryName === sanitizePathPart(activeDataVersion)) {
    return false
  }

  return locale !== DEFAULT_CLIENT_DATA_LOCALE || !isLocaleDirectoryName(entryName)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getRetryDelay(attempt) {
  const exponentialDelay = RETRY_BASE_DELAY_MS * 2 ** (attempt - 1)
  const jitter = Math.floor(Math.random() * 250)
  return Math.min(RETRY_MAX_DELAY_MS, exponentialDelay) + jitter
}

async function fetchTextOnce(resourcePath) {
  const url = getApiUrl(resourcePath)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      headers: { accept: 'application/json' },
      signal: controller.signal,
    })

    if (!response.ok) {
      const error = new Error(`${response.status} ${response.statusText}: ${url}`)
      error.status = response.status
      throw error
    }

    return await response.text()
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error(`Timed out after ${REQUEST_TIMEOUT_MS}ms: ${url}`)
    }

    if (error?.status) {
      throw error
    }

    throw new Error(`Failed to fetch ${url}: ${error.message}`)
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchText(resourcePath, options = {}) {
  let lastError = null
  const expectedBytes = Number(options.expectedBytes || 0)
  const label = options.label || String(resourcePath)

  for (let attempt = 1; attempt <= REQUEST_RETRY_COUNT; attempt += 1) {
    try {
      const content = await fetchTextOnce(resourcePath)
      const actualBytes = Buffer.byteLength(content)

      if (expectedBytes > 0 && actualBytes !== expectedBytes) {
        throw new Error(
          `Size mismatch for ${label}: expected ${expectedBytes} bytes, got ${actualBytes}`
        )
      }

      return content
    } catch (error) {
      lastError = error
      if (error?.status === 404) {
        break
      }

      if (attempt < REQUEST_RETRY_COUNT) {
        const delay = getRetryDelay(attempt)
        console.warn(
          `[client-data] retry ${attempt}/${REQUEST_RETRY_COUNT} in ${delay}ms: ${error.message}`
        )
        await sleep(delay)
      }
    }
  }

  throw lastError
}

async function fetchJson(resourcePath) {
  return JSON.parse(await fetchText(resourcePath))
}

async function readJsonFile(filePath) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'))
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return null
    }

    throw error
  }
}

function getManifestFileEntries(manifest) {
  if (Array.isArray(manifest?.files)) {
    return manifest.files
  }

  if (manifest?.files && typeof manifest.files === 'object') {
    return Object.entries(manifest.files).map(([filePath, value]) => ({
      path: filePath,
      ...(value && typeof value === 'object' ? value : {}),
    }))
  }

  return []
}

function getManifestEntryLogicalPath(entry) {
  const directPath = String(entry?.path || entry?.logicalPath || '').trim()
  if (directPath) {
    return normalizeDataPath(directPath)
  }

  const urlPath = normalizeDataPath(
    getClientDataUrlPathname(entry?.url || '', DATA_API_ORIGIN)
  )
  for (const marker of ['champion-shards/', 'champions/']) {
    const markerIndex = urlPath.indexOf(marker)
    if (markerIndex >= 0) {
      return urlPath.slice(markerIndex)
    }
  }

  for (const fileName of ['augments.json', 'champions.json', 'items.json', 'manifest.json']) {
    if (urlPath.endsWith(`/${fileName}`) || urlPath === fileName) {
      return fileName
    }
  }

  return urlPath
}

async function writeTextFile(filePath, content) {
  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(filePath, content, 'utf8')
}

async function isExistingFileComplete(filePath, file) {
  try {
    const fileStat = await stat(filePath)
    return file.bytes > 0 ? fileStat.size === file.bytes : fileStat.size > 0
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return false
    }

    throw error
  }
}

async function isExistingBundleComplete(versionDir, files) {
  for (const file of files) {
    if (!(await isExistingFileComplete(resolveClientDataFilePath(versionDir, file.path), file))) {
      return false
    }
  }

  return true
}

async function downloadBundleFile(versionDir, file, manifestText) {
  const filePath = resolveClientDataFilePath(versionDir, file.path)

  if (await isExistingFileComplete(filePath, file)) {
    return { reused: true }
  }

  const content = file.path === 'manifest.json'
    ? manifestText
    : await fetchText(file.url, {
        expectedBytes: file.bytes,
        label: file.path,
      })

  await writeTextFile(filePath, content)
  return { reused: false }
}

async function pruneInactiveVersions(locale, activeDataVersion) {
  const versionsRoot = getLocaleVersionsRoot(locale)
  const activeDirName = sanitizePathPart(activeDataVersion)

  let entries = []
  try {
    entries = await readdir(versionsRoot, { withFileTypes: true })
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return
    }

    throw error
  }

  await Promise.all(entries
    .filter((entry) => (
      entry.isDirectory() &&
      shouldPruneVersionDirectory(locale, entry.name, activeDirName)
    ))
    .map((entry) => rm(path.join(versionsRoot, entry.name), { recursive: true, force: true })))
}

async function runLimited(items, limit, worker) {
  let nextIndex = 0
  const workers = Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, async () => {
    while (nextIndex < items.length) {
      const item = items[nextIndex]
      nextIndex += 1
      await worker(item)
    }
  })

  await Promise.all(workers)
}

function getConfigCandidates(locale) {
  if (locale === DEFAULT_CLIENT_DATA_LOCALE) {
    return [DATA_API_CONFIG_PATH]
  }

  return [
    `${DATA_API_CONFIG_PATH}?locale=${encodeURIComponent(locale)}`,
    `${DATA_API_CONFIG_PATH}?lang=${encodeURIComponent(locale)}`,
    `${DATA_API_CONFIG_PATH}?language=${encodeURIComponent(locale)}`,
    `${DATA_API_PREFIX}/${encodeURIComponent(locale)}/config`,
    `${DATA_API_CONFIG_PATH}/${encodeURIComponent(locale)}`,
  ]
}

async function loadLocaleConfig(locale) {
  let lastError = null
  let localeMismatchError = null

  for (const configPath of getConfigCandidates(locale)) {
    try {
      const config = await fetchJson(configPath)
      const declaredLocale = tryNormalizeLocale(config?.locale)
      if (declaredLocale === locale || (locale === DEFAULT_CLIENT_DATA_LOCALE && !declaredLocale)) {
        return config
      }

      localeMismatchError = new Error(
        `Config locale mismatch for ${locale}: received ${declaredLocale || 'missing'}`
      )
    } catch (error) {
      lastError = error
      if (error?.status !== 404) {
        throw error
      }
    }
  }

  throw localeMismatchError || lastError || new Error(`No client data config found for ${locale}`)
}

function getManifestCandidates(config, dataVersion, locale) {
  const candidates = [config.manifest || '']
  if (locale !== DEFAULT_CLIENT_DATA_LOCALE) {
    candidates.push(
      `${DATA_API_PREFIX}/data/${encodeURIComponent(dataVersion)}/${encodeURIComponent(locale)}/manifest.json`,
      `${DATA_API_PREFIX}/data/${encodeURIComponent(locale)}/${encodeURIComponent(dataVersion)}/manifest.json`,
      `${DATA_API_PREFIX}/data/${encodeURIComponent(dataVersion)}/manifest.${encodeURIComponent(locale)}.json`
    )
  }
  candidates.push(`${DATA_API_PREFIX}/data/${encodeURIComponent(dataVersion)}/manifest.json`)
  return [...new Set(candidates.filter(Boolean))]
}

async function loadLocaleManifest(config, dataVersion, locale) {
  let lastError = null
  let localeMismatchError = null

  for (const manifestPath of getManifestCandidates(config, dataVersion, locale)) {
    try {
      const manifestText = await fetchText(manifestPath)
      const manifest = JSON.parse(manifestText)
      const declaredLocale = tryNormalizeLocale(manifest?.locale)
      if (declaredLocale === locale || (locale === DEFAULT_CLIENT_DATA_LOCALE && !declaredLocale)) {
        return { manifest, manifestText, manifestPath }
      }

      localeMismatchError = new Error(
        `Manifest locale mismatch for ${locale}: received ${declaredLocale || 'missing'}`
      )
    } catch (error) {
      lastError = error
      if (error?.status !== 404) {
        throw error
      }
    }
  }

  throw localeMismatchError || lastError || new Error(`No client data manifest found for ${locale}/${dataVersion}`)
}

function createPointer(config, locale, dataVersion, manifestPath, files, existingPointer) {
  const shardCount = files.filter((file) => (
    file.path.startsWith('champion-shards/') &&
    file.path.endsWith('.json') &&
    file.path !== 'champion-shards/index.json'
  )).length
  const totalBytes = files.reduce((sum, file) => sum + (file.bytes || 0), 0)

  return {
    schemaVersion: 3,
    locale,
    dataVersion,
    gamePatch: config.gamePatch || '',
    generatedAt: config.generatedAt || '',
    bundledFileCount: files.length,
    bundledShardCount: shardCount,
    bundledBytes: totalBytes,
    manifest: config.manifest || manifestPath,
    activatedAt: existingPointer?.activatedAt || new Date().toISOString(),
  }
}

export async function bundleLocale(locale) {
  const startedAt = Date.now()
  const configPath = getConfigCandidates(locale)[0]
  console.log(`[client-data] [${locale}] fetching config from ${getApiUrl(configPath)}`)
  const config = await loadLocaleConfig(locale)
  const dataVersion = String(config?.dataVersion || '')

  if (!dataVersion) {
    throw new Error(`Remote client data config for ${locale} is missing dataVersion`)
  }

  const { manifest, manifestText, manifestPath } = await loadLocaleManifest(
    config,
    dataVersion,
    locale
  )
  const versionDir = path.join(OUTPUT_DIR, getLocaleVersionRelativePath(locale, dataVersion))
  const entries = getManifestFileEntries(manifest)
    .map((entry) => {
      const logicalPath = getManifestEntryLogicalPath(entry)
      return {
        path: logicalPath,
        url: resolveVersionResourcePath(dataVersion, entry.url || entry.path || logicalPath),
        bytes: Number(entry.bytes || 0),
      }
    })
    .filter((entry) => entry.path && isBundledDataPath(entry.path))

  const manifestEntry = {
    path: 'manifest.json',
    url: manifestPath,
    bytes: Buffer.byteLength(manifestText),
  }
  const filesByPath = new Map([[manifestEntry.path, manifestEntry]])
  for (const entry of entries) {
    filesByPath.set(entry.path, entry)
  }

  const files = [...filesByPath.values()].sort((a, b) => a.path.localeCompare(b.path))
  const pointerPath = path.join(OUTPUT_DIR, getLocalePointerFileName(locale))
  const existingPointer = await readJsonFile(pointerPath)
  const pointer = createPointer(
    config,
    locale,
    dataVersion,
    manifestPath,
    files,
    existingPointer
  )

  console.log(
    `[client-data] [${locale}] dataVersion=${dataVersion} files=${pointer.bundledFileCount} ` +
      `shards=${pointer.bundledShardCount} bytes=${pointer.bundledBytes}`
  )

  if (
    String(existingPointer?.dataVersion || '') === dataVersion &&
    existingPointer?.locale === locale &&
    await isExistingBundleComplete(versionDir, files)
  ) {
    await writeTextFile(pointerPath, JSON.stringify(pointer))
    await pruneInactiveVersions(locale, dataVersion)
    console.log(`[client-data] [${locale}] existing complete bundle reused`)
    return pointer
  }

  await mkdir(versionDir, { recursive: true })
  let downloadedCount = 0
  let reusedCount = 0
  let completedCount = 0
  let completedBytes = 0
  const activeFiles = new Set()
  const totalBytes = files.reduce((sum, file) => sum + Math.max(0, file.bytes || 0), 0)

  const logProgress = (reason, lastFile = '') => {
    const countPercent = files.length > 0 ? (completedCount / files.length) * 100 : 100
    const bytePercent = totalBytes > 0 ? (completedBytes / totalBytes) * 100 : countPercent
    const active = [...activeFiles].join(', ') || 'none'
    const last = lastFile ? ` last=${lastFile}` : ''
    console.log(
      `[client-data] [${locale}] progress ${completedCount}/${files.length} ` +
        `(${bytePercent.toFixed(1)}%) ${formatBytes(completedBytes)}/${formatBytes(totalBytes)} ` +
        `downloaded=${downloadedCount} reused=${reusedCount} active=${active} ` +
        `elapsed=${formatDuration(Date.now() - startedAt)} reason=${reason}${last}`
    )
  }

  logProgress('start')
  const progressTimer = setInterval(() => logProgress('heartbeat'), PROGRESS_LOG_INTERVAL_MS)
  try {
    await runLimited(files, DOWNLOAD_CONCURRENCY, async (file) => {
      activeFiles.add(file.path)
      try {
        const result = await downloadBundleFile(versionDir, file, manifestText)
        if (result.reused) {
          reusedCount += 1
        } else {
          downloadedCount += 1
        }
        completedCount += 1
        completedBytes += Math.max(0, file.bytes || 0)
        activeFiles.delete(file.path)
        if (completedCount % 5 === 0 || completedCount === files.length) {
          logProgress(result.reused ? 'reused' : 'downloaded', file.path)
        }
      } finally {
        activeFiles.delete(file.path)
      }
    })
  } finally {
    clearInterval(progressTimer)
  }

  if (!(await isExistingBundleComplete(versionDir, files))) {
    throw new Error(`Downloaded bundle for ${locale}/${dataVersion} is incomplete`)
  }

  await writeTextFile(pointerPath, JSON.stringify({
    ...pointer,
    activatedAt: new Date().toISOString(),
  }))
  await pruneInactiveVersions(locale, dataVersion)

  console.log(
    `[client-data] [${locale}] bundled ${(pointer.bundledBytes / 1024 / 1024).toFixed(2)} MB ` +
      `downloaded=${downloadedCount} reused=${reusedCount} in ${Date.now() - startedAt}ms`
  )
  return pointer
}

async function main() {
  const startedAt = Date.now()
  console.log(
    `[client-data] preparing locales=${SUPPORTED_CLIENT_DATA_LOCALES.join(',')} ` +
      `concurrency=${DOWNLOAD_CONCURRENCY} timeout=${REQUEST_TIMEOUT_MS}ms retries=${REQUEST_RETRY_COUNT}`
  )

  const pointers = []
  for (const locale of SUPPORTED_CLIENT_DATA_LOCALES) {
    pointers.push(await bundleLocale(locale))
  }

  const totalBytes = pointers.reduce((sum, pointer) => sum + Number(pointer.bundledBytes || 0), 0)
  console.log(
    `[client-data] prepared ${pointers.length} locales (${(totalBytes / 1024 / 1024).toFixed(2)} MB) ` +
      `in ${Date.now() - startedAt}ms`
  )
}

const isMainModule = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMainModule) {
  main().catch((error) => {
    console.error(`[client-data] ${error.message}`)
    process.exit(1)
  })
}
