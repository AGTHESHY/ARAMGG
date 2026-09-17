import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import pg from 'pg'
import { randomUUID } from 'node:crypto'
import { buildApp } from '../src/app.js'
import { PostgresCatalog, type Catalog, type SnapshotRecord } from '../src/catalog.js'
import { demoSnapshot } from '../src/demo.js'
import type { Locale } from '../src/schema.js'
import { Snapshots } from '../src/snapshots.js'

class MemoryCatalog implements Catalog {
  records = new Map<string, SnapshotRecord>()
  pointers = new Map<Locale, string>()
  private tail = Promise.resolve()
  async current(locale: Locale) { return this.find(locale, this.pointers.get(locale) ?? '') }
  async find(locale: Locale, version: string) { return this.records.get(`${locale}:${version}`) ?? null }
  async publish(record: SnapshotRecord) { this.records.set(`${record.locale}:${record.dataVersion}`, record); this.pointers.set(record.locale, record.dataVersion) }
  async activate(locale: Locale, version: string) { this.pointers.set(locale, version) }
  async exclusive<T>(_locale: Locale, fn: () => Promise<T>) {
    const result = this.tail.then(fn)
    this.tail = result.then(() => {}, () => {})
    return result
  }
  async ready() {}
  async close() {}
}

async function setup(t: import('node:test').TestContext) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'mayhem-test-'))
  const catalog = new MemoryCatalog()
  const snapshots = new Snapshots(root, catalog)
  const app = buildApp(snapshots)
  t.after(async () => { await app.close(); await rm(root, { recursive: true, force: true }) })
  return { root, catalog, snapshots, app }
}

test('empty service is live but never fabricates a data version', async t => {
  const { app } = await setup(t)
  assert.equal((await app.inject('/health/live')).statusCode, 200)
  assert.equal((await app.inject('/health/ready')).json().dataReady, false)
  assert.equal((await app.inject('/api/client/v1/config')).statusCode, 503)
})

test('publishes three locale-specific snapshots with immutable files and conditional HTTP reads', async t => {
  const { snapshots, app } = await setup(t)
  for (const locale of ['zh-CN', 'en-US', 'zh-TW'] as const) {
    await snapshots.publish(demoSnapshot(locale))
    const config = (await app.inject(`/api/client/v1/${locale}/config`)).json()
    assert.equal(config.locale, locale)
    assert.equal(config.source, 'demo')
    assert.equal(config.client.autoUpdateEnabled, false)
    const manifest = await app.inject(config.manifest)
    assert.equal(manifest.statusCode, 200)
    assert.equal(manifest.json().files.length, 5)
    const file = await app.inject(manifest.json().files[0].url)
    assert.equal(file.statusCode, 200)
    assert.match(file.headers['cache-control'] as string, /immutable/)
    assert.equal((await app.inject({ url: manifest.json().files[0].url, headers: { 'if-none-match': file.headers.etag as string } })).statusCode, 304)
  }
  assert.equal((await app.inject('/api/client/v1/data/demo.1/champion-shards/0.json')).statusCode, 200)
  assert.equal((await app.inject('/api/client/v1/config?locale=en-US')).json().locale, 'en-US')
  assert.equal((await app.inject('/api/client/v1/fr-FR/config')).statusCode, 400)
})

test('rejects missing shards, invalid stats and path traversal without advancing current', async t => {
  const { snapshots, catalog, app } = await setup(t)
  await snapshots.publish(demoSnapshot('zh-CN'))
  const missing = demoSnapshot('zh-CN', 'demo.2')
  delete missing.files['champion-shards/0.json']
  await assert.rejects(snapshots.publish(missing))
  const traversal = demoSnapshot('zh-CN', 'demo.2')
  traversal.files['../escape.json'] = {}
  await assert.rejects(snapshots.publish(traversal))
  const invalid = demoSnapshot('zh-CN', 'demo.2')
  invalid.files['champions.json'] = { champions: [{ id: 8, name: 'bad', stats: { games: 1, wins: 2, winRate: 0.5 } }] }
  await assert.rejects(snapshots.publish(invalid))
  assert.equal((await catalog.current('zh-CN'))?.dataVersion, 'demo.1')
  assert.equal((await app.inject('/api/client/v1/data/demo.1/zh-CN/%2e%2e%2fsecret.json')).statusCode, 400)
})

test('duplicate publication is idempotent and rollback survives another publication attempt', async t => {
  const { snapshots, catalog } = await setup(t)
  const results = await Promise.all(Array.from({ length: 12 }, () => snapshots.publish(demoSnapshot('zh-CN'))))
  assert.equal(results.filter(r => r.created).length, 1)
  await snapshots.publish(demoSnapshot('zh-CN', 'demo.2'))
  await snapshots.rollback('zh-CN', 'demo.1')
  assert.equal((await snapshots.publish(demoSnapshot('zh-CN', 'demo.2'))).created, false)
  assert.equal((await catalog.current('zh-CN'))?.dataVersion, 'demo.1')
})

test('rollback verifies file hashes and keeps the previous pointer on corruption', async t => {
  const { snapshots, catalog, root } = await setup(t)
  await snapshots.publish(demoSnapshot('zh-CN'))
  await snapshots.publish(demoSnapshot('zh-CN', 'demo.2'))
  await writeFile(path.join(root, 'snapshots/zh-CN/demo.1/items.json'), '{}')
  await assert.rejects(snapshots.rollback('zh-CN', 'demo.1'), /checksum/)
  assert.equal((await catalog.current('zh-CN'))?.dataVersion, 'demo.2')
})

test('PostgreSQL serializes publishers from separate service instances', { skip: !process.env.TEST_DATABASE_URL }, async t => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'mayhem-pg-test-'))
  const admin = new pg.Pool({ connectionString: process.env.TEST_DATABASE_URL! })
  const schema = `test_${randomUUID().replaceAll('-', '')}`
  await admin.query(`CREATE SCHEMA ${schema}`)
  const url = new URL(process.env.TEST_DATABASE_URL!)
  url.searchParams.set('options', `-c search_path=${schema}`)
  const first = new PostgresCatalog(url.toString())
  const second = new PostgresCatalog(url.toString())
  t.after(async () => {
    await first.close(); await second.close()
    await admin.query(`DROP SCHEMA ${schema} CASCADE`)
    await admin.end()
    await rm(root, { recursive: true, force: true })
  })
  await first.initialize()
  await second.initialize()
  const stores = [new Snapshots(root, first), new Snapshots(root, second)]
  const version = `test.${Date.now()}`
  const results = await Promise.all(Array.from({ length: 24 }, (_, i) => stores[i % 2]!.publish(demoSnapshot('en-US', version))))
  assert.equal(results.filter(r => r.created).length, 1)
  assert.equal((await first.current('en-US'))?.dataVersion, version)
})
