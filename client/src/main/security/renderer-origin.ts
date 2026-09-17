const trustedRendererOrigins = new Set<string>()

function isLocalRendererHost(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
}

function parseRendererUrl(value: unknown): URL | null {
  try {
    return new URL(String(value || ''))
  } catch {
    return null
  }
}

export function registerTrustedRendererOrigin(value: unknown): string {
  const url = parseRendererUrl(value)
  if (!url || !['http:', 'https:'].includes(url.protocol) || !isLocalRendererHost(url.hostname)) {
    throw new Error(`Renderer origin is not trusted: ${String(value || '')}`)
  }

  trustedRendererOrigins.add(url.origin)
  return url.origin
}

export function isTrustedRendererUrl(value: unknown): boolean {
  const url = parseRendererUrl(value)
  return Boolean(
    url &&
    isLocalRendererHost(url.hostname) &&
    trustedRendererOrigins.has(url.origin)
  )
}

export function clearTrustedRendererOrigins(): void {
  trustedRendererOrigins.clear()
}
