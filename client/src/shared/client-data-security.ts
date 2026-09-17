import path from 'node:path'

const URI_SCHEME_PATTERN = /^[a-zA-Z][a-zA-Z\d+.-]*:/
const WINDOWS_ABSOLUTE_PATH_PATTERN = /^[a-zA-Z]:($|[\\/])/
const WINDOWS_RESERVED_NAME_PATTERN = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/i

function isLocalhost(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
}

export function normalizeClientDataPath(value: unknown): string {
  const rawPath = String(value ?? '').trim().replace(/\\/g, '/')
  if (!rawPath) {
    throw new Error('Client data path must not be empty')
  }

  if (
    rawPath.includes('\0') ||
    rawPath.startsWith('/') ||
    rawPath.startsWith('//') ||
    WINDOWS_ABSOLUTE_PATH_PATTERN.test(rawPath) ||
    URI_SCHEME_PATTERN.test(rawPath)
  ) {
    throw new Error(`Client data path must be relative: ${rawPath}`)
  }

  const segments = rawPath.split('/')
  if (segments.some((segment) => (
    !segment ||
    segment === '.' ||
    segment === '..' ||
    segment !== segment.trim() ||
    segment.endsWith('.') ||
    segment.includes(':') ||
    WINDOWS_RESERVED_NAME_PATTERN.test(segment)
  ))) {
    throw new Error(`Client data path contains an unsafe segment: ${rawPath}`)
  }

  return segments.join('/')
}

export function resolveClientDataFilePath(rootDir: string, value: unknown): string {
  const normalizedPath = normalizeClientDataPath(value)
  const resolvedRoot = path.resolve(rootDir)
  const resolvedPath = path.resolve(resolvedRoot, ...normalizedPath.split('/'))
  const relativePath = path.relative(resolvedRoot, resolvedPath)

  if (
    !relativePath ||
    relativePath === '..' ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error(`Client data path escapes its root directory: ${normalizedPath}`)
  }

  return resolvedPath
}

function normalizeAllowedOrigin(value: string): string {
  const url = new URL(value)
  const isAllowedHttp = url.protocol === 'http:' && isLocalhost(url.hostname)
  if (url.protocol !== 'https:' && !isAllowedHttp) {
    throw new Error(`Client data origin must use HTTPS: ${url.origin}`)
  }

  return url.origin
}

export function getAllowedClientDataOrigins(
  dataApiOrigin: string,
  additionalOrigins = ''
): Set<string> {
  const origins = new Set<string>([normalizeAllowedOrigin(dataApiOrigin)])
  for (const value of additionalOrigins.split(',')) {
    const candidate = value.trim()
    if (candidate) {
      origins.add(normalizeAllowedOrigin(candidate))
    }
  }

  return origins
}

export function resolveTrustedClientDataUrl(
  resourcePath: unknown,
  dataApiOrigin: string,
  additionalOrigins = ''
): string {
  const rawPath = String(resourcePath ?? '').trim()
  if (!rawPath) {
    throw new Error('Client data URL must not be empty')
  }

  const url = new URL(rawPath, dataApiOrigin)
  const allowedOrigins = getAllowedClientDataOrigins(dataApiOrigin, additionalOrigins)
  if (!allowedOrigins.has(url.origin)) {
    throw new Error(`Client data URL origin is not allowed: ${url.origin}`)
  }

  const isAllowedHttp = url.protocol === 'http:' && isLocalhost(url.hostname)
  if (url.protocol !== 'https:' && !isAllowedHttp) {
    throw new Error(`Client data URL must use HTTPS: ${url.toString()}`)
  }

  return url.toString()
}

export function getClientDataUrlPathname(value: unknown, dataApiOrigin: string): string {
  const rawValue = String(value ?? '').trim()
  if (!rawValue) {
    throw new Error('Client data resource path must not be empty')
  }

  if (URI_SCHEME_PATTERN.test(rawValue) || rawValue.startsWith('/')) {
    return new URL(rawValue, dataApiOrigin).pathname.replace(/^\/+/, '')
  }

  return rawValue
}
