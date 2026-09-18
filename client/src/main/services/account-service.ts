import { safeStorage } from 'electron'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { getConfigDir } from '../modules/app-paths.ts'
import { deleteDeveloperKey, getDeveloperKey, getDeveloperKeyStatus, saveDeveloperKey } from './developer-key-service.ts'

const sessionFile = () => path.join(getConfigDir(), 'account-session.bin')
const configuredOrigin = process.env.ARAMGG_ACCOUNT_API_ORIGIN
  || import.meta.env?.ARAMGG_ACCOUNT_API_ORIGIN
  || 'https://aramgg.38-92-15-80.sslip.io'

export interface AccountStatus {
  signedIn: boolean
  secureTransport: boolean
  serviceOrigin: string
  localKey: { configured: boolean; usable: boolean }
  sharedKey: {
    configured: boolean
    shareEnabled: boolean
    dailyShareLimit?: number
    creditsUsedToday?: number
    fingerprint?: string
    lastUsedAt?: string | null
    status?: string
  } | null
  serviceError?: string
}

type Session = { token: string; email: string; expiresAt: number }
type AccountRequestInit = {
  method?: string
  body?: string
  headers?: Record<string, string>
}

function origin() {
  return new URL(configuredOrigin).origin
}

function isSecureTransport(value = origin()) {
  const url = new URL(value)
  return url.protocol === 'https:' || ['127.0.0.1', 'localhost', '::1'].includes(url.hostname)
}

function assertSecureTransport() {
  if (!isSecureTransport()) throw new Error('SECURE_CONNECTION_REQUIRED')
}

async function readSession(): Promise<Session | null> {
  try {
    const encrypted = await readFile(sessionFile())
    if (!safeStorage.isEncryptionAvailable()) throw new Error('SECURE_STORAGE_UNAVAILABLE')
    const parsed = JSON.parse(safeStorage.decryptString(encrypted)) as Session
    if (!parsed.token || !parsed.email || parsed.expiresAt <= Date.now()) {
      await rm(sessionFile(), { force: true })
      return null
    }
    return parsed
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw error
  }
}

async function writeSession(session: Session) {
  if (!safeStorage.isEncryptionAvailable()) throw new Error('SECURE_STORAGE_UNAVAILABLE')
  await mkdir(getConfigDir(), { recursive: true })
  await writeFile(sessionFile(), safeStorage.encryptString(JSON.stringify(session)), { mode: 0o600 })
}

async function request(pathname: string, init: AccountRequestInit = {}, token?: string) {
  assertSecureTransport()
  const response = await fetch(new URL(pathname, `${origin()}/`), {
    ...init,
    signal: AbortSignal.timeout(12_000),
    headers: {
      accept: 'application/json',
      ...(init.body ? { 'content-type': 'application/json' } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })
  const body = response.status === 204 ? null : await response.json().catch(() => null) as Record<string, unknown> | null
  if (!response.ok) throw new Error(String(body?.error || `HTTP_${response.status}`))
  return body
}

async function authenticate(mode: 'register' | 'login', rawEmail: unknown, rawPassword: unknown) {
  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : ''
  const password = typeof rawPassword === 'string' ? rawPassword : ''
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('INVALID_EMAIL')
  if (password.length < 10 || password.length > 128) throw new Error('INVALID_PASSWORD')
  const result = await request(`/api/account/v1/${mode}`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  const token = String(result?.token || '')
  const expiresInDays = Number(result?.expiresInDays || 30)
  if (!token) throw new Error('INVALID_SERVER_RESPONSE')
  await writeSession({ token, email, expiresAt: Date.now() + expiresInDays * 86_400_000 })
  return getAccountStatus()
}

export const registerAccount = (email: unknown, password: unknown) => authenticate('register', email, password)
export const loginAccount = (email: unknown, password: unknown) => authenticate('login', email, password)

export async function logoutAccount() {
  await rm(sessionFile(), { force: true })
  return getAccountStatus()
}

export async function getAccountStatus(): Promise<AccountStatus> {
  const [session, localKey] = await Promise.all([readSession(), getDeveloperKeyStatus()])
  const base: AccountStatus = {
    signedIn: !!session,
    secureTransport: isSecureTransport(),
    serviceOrigin: origin(),
    localKey,
    sharedKey: null,
  }
  if (!session) return base
  try {
    base.sharedKey = await request('/api/account/v1/shared-key', {}, session.token) as AccountStatus['sharedKey']
  } catch (error) {
    const code = error instanceof Error ? error.message : String(error)
    if (code === 'INVALID_SESSION' || code === 'AUTHENTICATION_REQUIRED') {
      await rm(sessionFile(), { force: true })
      base.signedIn = false
    } else {
      base.serviceError = code
    }
  }
  return base
}

export async function saveAccountKey(rawKey: unknown, rawShareEnabled: unknown, rawDailyLimit: unknown) {
  const shareEnabled = rawShareEnabled === true
  const dailyShareLimit = Number(rawDailyLimit)
  await saveDeveloperKey(rawKey)
  if (!shareEnabled) return getAccountStatus()

  const session = await readSession()
  if (!session) throw new Error('AUTHENTICATION_REQUIRED')
  if (!Number.isInteger(dailyShareLimit) || dailyShareLimit < 2 || dailyShareLimit > 200) {
    throw new Error('INVALID_DAILY_LIMIT')
  }
  const apiKey = await getDeveloperKey()
  await request('/api/account/v1/shared-key', {
    method: 'PUT',
    body: JSON.stringify({ apiKey, shareEnabled: true, dailyShareLimit }),
  }, session.token)
  return getAccountStatus()
}

export async function updateAccountSharing(rawEnabled: unknown, rawDailyLimit: unknown) {
  const session = await readSession()
  if (!session) throw new Error('AUTHENTICATION_REQUIRED')
  const apiKey = await getDeveloperKey()
  const dailyShareLimit = Number(rawDailyLimit)
  await request('/api/account/v1/shared-key', {
    method: 'PUT',
    body: JSON.stringify({ apiKey, shareEnabled: rawEnabled === true, dailyShareLimit }),
  }, session.token)
  return getAccountStatus()
}

export async function revokeAccountKey() {
  const session = await readSession()
  if (session) await request('/api/account/v1/shared-key', { method: 'DELETE' }, session.token)
  await deleteDeveloperKey()
  return getAccountStatus()
}
