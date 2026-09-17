import { safeStorage } from 'electron'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { getConfigDir } from '../modules/app-paths.ts'

const keyFile = () => path.join(getConfigDir(), 'developer-key.bin')
const keyPattern = /^hx_live_[a-zA-Z0-9]+$/

export async function getDeveloperKeyStatus() {
  try {
    const encrypted = await readFile(keyFile())
    if (!safeStorage.isEncryptionAvailable()) return { configured: true, usable: false }
    const key = safeStorage.decryptString(encrypted)
    return { configured: keyPattern.test(key), usable: keyPattern.test(key) }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { configured: false, usable: false }
    throw error
  }
}

export async function saveDeveloperKey(value: unknown) {
  const key = typeof value === 'string' ? value.trim() : ''
  if (!keyPattern.test(key)) throw new Error('INVALID_DEVELOPER_KEY')
  if (!safeStorage.isEncryptionAvailable()) throw new Error('SECURE_STORAGE_UNAVAILABLE')
  await mkdir(getConfigDir(), { recursive: true })
  await writeFile(keyFile(), safeStorage.encryptString(key), { mode: 0o600 })
  return { configured: true, usable: true }
}

export async function deleteDeveloperKey() {
  await rm(keyFile(), { force: true })
  return { configured: false, usable: false }
}
