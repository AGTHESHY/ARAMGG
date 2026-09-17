import path from 'node:path'
import { PostgresCatalog } from './catalog.js'
import { Snapshots } from './snapshots.js'
import { AccountService } from './accounts.js'
import { readFile } from 'node:fs/promises'

export async function createRuntime() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required')
  const catalog = new PostgresCatalog(process.env.DATABASE_URL)
  try { await catalog.initialize() }
  catch (error) { await catalog.close(); throw error }
  let accounts: AccountService | undefined
  if (process.env.KEY_ENCRYPTION_KEY_FILE) {
    const masterKey = Buffer.from((await readFile(process.env.KEY_ENCRYPTION_KEY_FILE, 'utf8')).trim(), 'base64')
    accounts = new AccountService(process.env.DATABASE_URL, masterKey)
    try { await accounts.initialize() }
    catch (error) { await accounts.close(); await catalog.close(); throw error }
  }
  return { catalog, accounts, snapshots: new Snapshots(path.resolve(process.env.DATA_DIR ?? 'data'), catalog) }
}
