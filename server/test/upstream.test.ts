import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { AramggDeveloperApi } from '../src/upstream.js'

async function setup(t: import('node:test').TestContext, mode = 'ok') {
  const root = await mkdtemp(path.join(os.tmpdir(), 'mayhem-probe-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const calls: Array<{ url: string; method: string }> = []
  let credits = 200
  const meta = { locale: 'zh-CN', dataVersion: '16.18.2', gamePatch: '16.18' }
  const transport = (async (url: string, init: RequestInit) => {
    const resource = url.replace('https://data.dtodo.cn/api/v1/zh-CN/', '')
    calls.push({ url, method: init.method! })
    if (resource === 'config.json') return Response.json(meta)
    assert.equal((init.headers as Record<string, string>).Authorization, 'Bearer hx_live_test')
    assert.equal(init.redirect, 'error')
    if (mode === 'unauthorized') return new Response('SECRET response should never be logged', { status: 401 })
    if (init.method === 'HEAD') return new Response(null, { headers: { 'x-credits-remaining': String(credits), 'x-credits-cost': '0' } })
    if (mode === 'network') throw new Error('SECRET transport error')
    credits -= resource.startsWith('champions/') ? 2 : 1
    const data = resource.startsWith('champions/') ? { champion: { id: 8, name: 'Vladimir' }, builds: [], augments: [] } : [{ id: 8, name: 'fixture', stats: { games: null, wins: null } }]
    return Response.json({ meta: mode === 'version' ? { ...meta, dataVersion: '16.18.1' } : meta, data }, { headers: { 'x-credits-remaining': String(credits) } })
  }) as typeof fetch
  return { api: new AramggDeveloperApi('hx_live_test', 'zh-CN', root, transport), root, calls, transport }
}

test('probe uses five credits at most, preserves missing stats and never publishes partial data', async t => {
  const { api, root, calls, transport } = await setup(t)
  const result = await api.probe()
  assert.equal(result.creditsRequestedThisRun, 5)
  assert.equal(result.creditsRemaining, 195)
  assert.equal(result.snapshotPublished, false)
  const repeat = await new AramggDeveloperApi('hx_live_test', 'zh-CN', root, transport).probe()
  assert.equal(repeat.creditsRequestedThisRun, 0)
  assert.equal(calls.filter(c => c.method === 'GET' && !c.url.endsWith('config.json')).length, 4)
})

test('probe rejects mixed versions', async t => {
  const { api } = await setup(t, 'version')
  await assert.rejects(api.probe(), /UPSTREAM_VERSION_OR_LOCALE_MISMATCH/)
})

test('upstream failures never expose response bodies or retry billable requests', async t => {
  const { api, calls } = await setup(t, 'network')
  await assert.rejects(api.probe(), error => error instanceof Error && error.message === 'UPSTREAM_NETWORK_ERROR')
  assert.equal(calls.length, 3)
  const denied = await setup(t, 'unauthorized')
  await assert.rejects(denied.api.probe(), /UPSTREAM_HTTP_401/)
})

test('formal sync saves resumable progress and does not publish an incomplete version', async t => {
  const { root, transport } = await setup(t)
  let published = false
  const api = new AramggDeveloperApi('hx_live_test', 'zh-CN', root, transport, 3)
  const result = await api.syncFormal(async () => { published = true; return { created: true } })
  assert.equal(result.state, 'downloading')
  assert.equal(result.cachedChampionDetails, 0)
  assert.equal(result.remainingChampionDetails, 1)
  assert.equal(result.creditsRequestedThisRun, 3)
  assert.equal(published, false)
})
