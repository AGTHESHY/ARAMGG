export const SONA_SERVICE_BASE_URL = 'https://sona-service.vercel.app'
export const SONA_SERVICE_CLIENT_HEADER = 'X-Sona-Client'
export const SONA_SERVICE_CLIENT_HEADER_PREFIX = '­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­'

function wrapCorsProxy(targetUrl: string): string {
  return `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`
}

interface SonaAvatarResponse {
  ok: boolean
  puuid?: string
  url?: string
  avatar?: {
    url?: string
    displayUrl?: string
  }
  error?: string
}

interface SonaAvatarBatchResponse {
  ok: boolean
  avatars?: Record<string, {
    url?: string
    displayUrl?: string
  }>
  error?: string
}

export function createSonaServiceHeaders(headers?: HeadersInit): Headers {
  const nextHeaders = new Headers(headers)
  nextHeaders.set(SONA_SERVICE_CLIENT_HEADER, `${SONA_SERVICE_CLIENT_HEADER_PREFIX}${crypto.randomUUID()}`)
  return nextHeaders
}

export function fetchSonaService(input: RequestInfo | URL, init: RequestInit = {}) {
  const proxiedInput = typeof input === 'string' || input instanceof URL
    ? wrapCorsProxy(String(input))
    : input

  return fetch(proxiedInput, {
    ...init,
    headers: createSonaServiceHeaders(init.headers),
  })
}

export async function getSonaAvatarUrl(puuid: string): Promise<string | null> {
  const url = `${SONA_SERVICE_BASE_URL}/api/avatar?puuid=${encodeURIComponent(puuid)}`
  const response = await fetchSonaService(url)

  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error(`Sona avatar query failed: ${response.status} ${response.statusText}`)
  }

  const body = await response.json() as SonaAvatarResponse
  return body.avatar?.url || body.avatar?.displayUrl || body.url || null
}

export async function getSonaAvatarUrls(puuids: string[]): Promise<Record<string, string>> {
  const uniquePuuids = [...new Set(puuids.map((puuid) => puuid.trim().toLowerCase()).filter(Boolean))]
  if (uniquePuuids.length === 0) return {}

  const response = await fetchSonaService(`${SONA_SERVICE_BASE_URL}/api/avatars`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ puuids: uniquePuuids }),
  })
  const body = await response.json().catch(() => null) as SonaAvatarBatchResponse | null

  if (!response.ok) {
    throw new Error(body?.error || `Sona avatar batch query failed: ${response.status} ${response.statusText}`)
  }

  const avatars = body?.avatars ?? {}
  return Object.fromEntries(
    Object.entries(avatars)
      .map(([puuid, avatar]) => [puuid.toLowerCase(), avatar.url || avatar.displayUrl || ''])
      .filter((entry): entry is [string, string] => Boolean(entry[1])),
  )
}

export async function uploadSonaAvatar(puuid: string, image: Blob): Promise<string> {
  const url = `${SONA_SERVICE_BASE_URL}/api/avatar?puuid=${encodeURIComponent(puuid)}`
  const response = await fetchSonaService(url, {
    method: 'POST',
    headers: {
      'Content-Type': image.type || 'image/png',
    },
    body: image,
  })
  const body = await response.json().catch(() => null) as SonaAvatarResponse | null

  if (!response.ok) {
    throw new Error(body?.error || `Sona avatar upload failed: ${response.status} ${response.statusText}`)
  }

  const avatarUrl = body?.url || body?.avatar?.url || body?.avatar?.displayUrl
  if (!avatarUrl) {
    throw new Error('Sona avatar upload response missing url.')
  }

  return avatarUrl
}
