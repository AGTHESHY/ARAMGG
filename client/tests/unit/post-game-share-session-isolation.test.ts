import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  warn: vi.fn(),
}))

vi.mock('electron', () => ({
  net: { fetch: vi.fn(async () => ({ ok: false, headers: new Headers() })) },
}))
vi.mock('../../src/main/modules/logger.ts', () => ({ default: {
  debug: vi.fn(), info: vi.fn(), warn: mocks.warn, error: vi.fn(),
} }))
vi.mock('../../src/main/modules/app-store.ts', () => ({ default: { get: vi.fn(() => null) } }))
vi.mock('../../src/main/data-loader.ts', () => ({
  getChampionAugmentStats: vi.fn(async () => []),
  loadAugmentDetail: vi.fn(async () => ({
    '100': { id: 100, name: '测试海克斯', rarity: 'silver', iconPath: '' },
  })),
  loadChampionName: vi.fn(async (id: number) => ({ nameCN: `英雄${id}`, nameEN: `Champion${id}`, title: '' })),
  loadChampionRoster: vi.fn(async () => []),
}))

type Deferred<T> = {
  promise: Promise<T>
  resolve: (value: T) => void
  reject: (error: Error) => void
}

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void
  let reject!: (error: Error) => void
  const promise = new Promise<T>((onResolve, onReject) => {
    resolve = onResolve
    reject = onReject
  })
  return { promise, resolve, reject }
}

function payload(gameId: number, championId: number, kills = 10) {
  return {
    gameId,
    gameMode: 'ARAM',
    activePlayer: {
      championId,
      summonerName: `玩家${gameId}`,
      isLocalPlayer: true,
      kills,
      deaths: 2,
      assists: 15,
      augments: [100],
    },
  }
}

function createService(gameId: number, championId: number, eog: Deferred<any>) {
  let eogCalls = 0
  return {
    service: {
      getLiveClientAllGameData: vi.fn(async () => ({ status: 200, data: payload(gameId, championId) })),
      getCurrentSummoner: vi.fn(async () => ({ summonerName: `玩家${gameId}` })),
      getReadOnlyJsonEndpoint: vi.fn(async (endpoint: string) => {
        if (endpoint === '/lol-gameflow/v1/session') {
          return { status: 200, data: { gameId, championId } }
        }
        eogCalls += 1
        if (eogCalls === 1) return eog.promise
        return { status: 404, data: null }
      }),
    },
    getEogCalls: () => eogCalls,
  }
}

describe('post-game share session isolation', () => {
  beforeEach(async () => {
    vi.resetModules()
    mocks.warn.mockClear()
  })

  it('keeps an old session result and cleanup from changing the new session task', async () => {
    const module = await import('../../src/main/services/post-game-share.ts')
    const eogA = deferred<any>()
    const eogB = deferred<any>()
    const a = createService(101, 1, eogA)
    const b = createService(202, 2, eogB)

    module.resetPostGameShareSnapshot('session-a')
    await module.capturePostGameShareSnapshot(a.service as any, 'bind-a', { force: true })
    const taskA = module.preparePostGameSharePosterData(a.service as any, 'finish-a')
    await vi.waitFor(() => expect(a.getEogCalls()).toBe(1))

    module.resetPostGameShareSnapshot('session-b')
    await module.capturePostGameShareSnapshot(b.service as any, 'bind-b', { force: true })
    const taskB = module.preparePostGameSharePosterData(b.service as any, 'finish-b')
    void module.preparePostGameSharePosterData(b.service as any, 'finish-b-duplicate')
    await vi.waitFor(() => expect(b.getEogCalls()).toBe(1))

    eogA.resolve({ status: 200, data: payload(202, 2, 99) })
    const resultA = await taskA
    expect(module.isPostGameShareSessionCurrent(resultA.sessionKey)).toBe(false)
    expect(mocks.warn).toHaveBeenCalledWith(
      '[post-game-share] rejected cross-session snapshot update',
      expect.objectContaining({ expectedGameId: 101, receivedGameId: 202 })
    )

    void module.preparePostGameSharePosterData(b.service as any, 'finish-b-after-a')
    expect(b.getEogCalls()).toBe(1)

    eogB.resolve({ status: 200, data: payload(202, 2, 20) })
    const resultB = await taskB
    expect(module.isPostGameShareSessionCurrent(resultB.sessionKey)).toBe(true)
    expect(resultB.data.champion.id).toBe(2)
    expect(resultB.data.stats.kills).toBe(20)
  })

  it('does not let an old session failure overwrite the current session', async () => {
    const module = await import('../../src/main/services/post-game-share.ts')
    const eogA = deferred<any>()
    const eogB = deferred<any>()
    const a = createService(301, 3, eogA)
    const b = createService(404, 4, eogB)

    module.resetPostGameShareSnapshot('failure-a')
    await module.capturePostGameShareSnapshot(a.service as any, 'bind-a', { force: true })
    const taskA = module.preparePostGameSharePosterData(a.service as any, 'finish-a')
    await vi.waitFor(() => expect(a.getEogCalls()).toBe(1))

    module.resetPostGameShareSnapshot('failure-b')
    await module.capturePostGameShareSnapshot(b.service as any, 'bind-b', { force: true })
    const taskB = module.preparePostGameSharePosterData(b.service as any, 'finish-b')
    await vi.waitFor(() => expect(b.getEogCalls()).toBe(1))

    eogA.reject(new Error('old-session-timeout'))
    const resultA = await taskA
    expect(resultA.success).toBe(false)
    expect(module.isPostGameShareSessionCurrent(resultA.sessionKey)).toBe(false)

    eogB.resolve({ status: 200, data: payload(404, 4, 40) })
    const resultB = await taskB
    expect(resultB.success).toBe(true)
    expect(resultB.data.champion.id).toBe(4)
    expect(resultB.data.stats.kills).toBe(40)
  })

  it('keeps a partial live result when end-of-game data has no verifiable game id', async () => {
    const module = await import('../../src/main/services/post-game-share.ts')
    const eog = deferred<any>()
    const current = createService(505, 5, eog)

    module.resetPostGameShareSnapshot('identity-required')
    await module.capturePostGameShareSnapshot(current.service as any, 'bind-current', { force: true })
    const task = module.preparePostGameSharePosterData(current.service as any, 'finish-current')
    await vi.waitFor(() => expect(current.getEogCalls()).toBe(1))

    const unidentified = payload(505, 5, 99)
    delete (unidentified as { gameId?: number }).gameId
    eog.resolve({ status: 200, data: unidentified })
    const result = await task

    expect(result.data.stats.kills).toBe(10)
    expect(mocks.warn).toHaveBeenCalledWith(
      '[post-game-share] ignored end-of-game result without game identity',
      expect.objectContaining({ expectedGameId: 505 })
    )
  })
})
