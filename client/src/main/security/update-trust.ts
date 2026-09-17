const LOCALHOST_NAMES = new Set(['localhost', '127.0.0.1', '::1'])

function normalizeFeedOrigin(value: string, allowDevLocalhost: boolean): string {
  const url = new URL(value)
  const isAllowedDevHttp =
    allowDevLocalhost &&
    url.protocol === 'http:' &&
    LOCALHOST_NAMES.has(url.hostname)

  if (url.protocol !== 'https:' && !isAllowedDevHttp) {
    throw new Error(`自动更新源必须使用 HTTPS: ${url.origin}`)
  }

  return url.origin
}

export function parseTrustedUpdateOrigins(
  values: readonly string[],
  allowDevLocalhost = false
): Set<string> {
  const origins = new Set<string>()
  for (const value of values) {
    const candidate = String(value || '').trim()
    if (candidate) {
      origins.add(normalizeFeedOrigin(candidate, allowDevLocalhost))
    }
  }
  return origins
}

export function parseTrustedPublisherNames(values: readonly string[]): string[] {
  return [...new Set(values.map((value) => String(value || '').trim()).filter(Boolean))]
}

export function normalizeTrustedUpdateFeedUrl(
  value: unknown,
  trustedOrigins: ReadonlySet<string>,
  allowDevLocalhost = false
): string {
  if (typeof value !== 'string' || !value.trim()) {
    return ''
  }

  const url = new URL(value.trim())
  normalizeFeedOrigin(url.origin, allowDevLocalhost)
  if (!trustedOrigins.has(url.origin)) {
    throw new Error(`自动更新源不在受信任白名单中: ${url.origin}`)
  }

  if (/\/latest\.ya?ml$/i.test(url.pathname)) {
    url.pathname = url.pathname.replace(/\/latest\.ya?ml$/i, '/')
  } else if (!url.pathname.endsWith('/')) {
    url.pathname = `${url.pathname}/`
  }

  url.search = ''
  url.hash = ''
  return url.toString()
}
