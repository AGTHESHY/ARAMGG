import path from 'node:path'
import { PostgresCatalog } from './catalog.js'
import { Snapshots } from './snapshots.js'

export async function createRuntime() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required')
  const catalog = new PostgresCatalog(process.env.DATABASE_URL)
  try { await catalog.initialize() }
  catch (error) { await catalog.close(); throw error }
  return { catalog, snapshots: new Snapshots(path.resolve(process.env.DATA_DIR ?? 'data'), catalog) }
}
