import pg from 'pg'
import { AsyncLocalStorage } from 'node:async_hooks'
import type { Locale } from './schema.js'

export interface SnapshotRecord {
  locale: Locale
  dataVersion: string
  gamePatch: string
  source: 'demo' | 'aramgg'
  generatedAt: string
}
export interface Catalog {
  current(locale: Locale): Promise<SnapshotRecord | null>
  find(locale: Locale, version: string): Promise<SnapshotRecord | null>
  publish(record: SnapshotRecord): Promise<void>
  activate(locale: Locale, version: string): Promise<void>
  exclusive<T>(locale: Locale, fn: () => Promise<T>): Promise<T>
  ready(): Promise<void>
  close(): Promise<void>
}

export class PostgresCatalog implements Catalog {
  private pool: pg.Pool
  private context = new AsyncLocalStorage<pg.PoolClient>()
  private get database(): pg.Pool | pg.PoolClient { return this.context.getStore() ?? this.pool }
  constructor(url: string) {
    this.pool = new pg.Pool({ connectionString: url, max: 10, connectionTimeoutMillis: 5000 })
  }
  async initialize(): Promise<void> {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS snapshots (
        locale TEXT NOT NULL, version TEXT NOT NULL, record JSONB NOT NULL,
        PRIMARY KEY (locale, version)
      );
      CREATE TABLE IF NOT EXISTS current_snapshots (
        locale TEXT PRIMARY KEY, version TEXT NOT NULL,
        FOREIGN KEY (locale, version) REFERENCES snapshots(locale, version)
      );
    `)
  }
  async current(locale: Locale): Promise<SnapshotRecord | null> {
    const result = await this.database.query('SELECT s.record FROM snapshots s JOIN current_snapshots c USING (locale, version) WHERE c.locale = $1', [locale])
    return result.rows[0]?.record ?? null
  }
  async find(locale: Locale, version: string): Promise<SnapshotRecord | null> {
    const result = await this.database.query('SELECT record FROM snapshots WHERE locale = $1 AND version = $2', [locale, version])
    return result.rows[0]?.record ?? null
  }
  async publish(record: SnapshotRecord): Promise<void> {
    const shared = this.context.getStore()
    const connection = shared ?? await this.pool.connect()
    try {
      await connection.query('BEGIN')
      await connection.query('INSERT INTO snapshots(locale, version, record) VALUES($1, $2, $3)', [record.locale, record.dataVersion, record])
      await connection.query('INSERT INTO current_snapshots(locale, version) VALUES($1, $2) ON CONFLICT(locale) DO UPDATE SET version = EXCLUDED.version', [record.locale, record.dataVersion])
      await connection.query('COMMIT')
    } catch (error) {
      await connection.query('ROLLBACK')
      throw error
    } finally { if (!shared) connection.release() }
  }
  async activate(locale: Locale, version: string): Promise<void> {
    await this.database.query('INSERT INTO current_snapshots(locale, version) VALUES($1, $2) ON CONFLICT(locale) DO UPDATE SET version = EXCLUDED.version', [locale, version])
  }
  async exclusive<T>(locale: Locale, fn: () => Promise<T>): Promise<T> {
    const connection = await this.pool.connect()
    // A session advisory lock serializes publishing and rollback across processes.
    let broken = false
    try {
      await connection.query('SELECT pg_advisory_lock(731821, hashtext($1))', [locale])
      return await this.context.run(connection, fn)
    } finally {
      try { await connection.query('SELECT pg_advisory_unlock(731821, hashtext($1))', [locale]) }
      catch { broken = true }
      connection.release(broken)
    }
  }
  async ready(): Promise<void> { await this.pool.query('SELECT 1') }
  async close(): Promise<void> { await this.pool.end() }
}
