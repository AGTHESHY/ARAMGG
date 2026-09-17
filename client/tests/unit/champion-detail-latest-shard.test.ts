import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mkdtemp, mkdir, rm, writeFile } from 'fs/promises'
import os from 'os'
import path from 'path'

let tempRoot = ''
let originalCwd = ''
const LOCAL_FIRST_ASSERTION_TIMEOUT_MS = 3_000

async function awaitLocalFirstResult<T>(promise: Promise<T>, failureMessage: string): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null

  try {
    return await Promise.race([
      promise,
      new Promise<never>((_resolve, reject) => {
        timeout = setTimeout(() => reject(new Error(failureMessage)), LOCAL_FIRST_ASSERTION_TIMEOUT_MS)
      }),
    ])
  } finally {
    if (timeout) {
      clearTimeout(timeout)
    }
  }
}

async function writeJson(filePath: string, payload: any): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(filePath, JSON.stringify(payload), 'utf8')
}

function manifest(files: string[]): any {
  return {
    files: files.map((filePath) => ({ path: filePath })),
  }
}

function shardIndex(dataVersion: string): any {
  return {
    dataVersion,
    shards: [
      {
        id: 1,
        path: 'champion-shards/1.json',
        championIds: [5, 6, 7, 8],
      },
    ],
  }
}

function oldVladimirShard(): any {
  return {
    champions: {
      8: {
        champion: { id: 8, name: 'Vladimir' },
        build: {
          coreItems: [{ items: [6653, 3020, 4645] }],
        },
        builds: [
          {
            queueId: 450,
            stats: { games: 1200, wins: 600, winRate: 0.5 },
            tags: { damage: 'AP' },
            coreItems: [{ items: [6653, 3020, 4645] }],
          },
        ],
        augments: [
          {
            id: 1205,
            stats: { games: 900, wins: 540, winRate: 0.6, pickRate: 0.12 },
          },
        ],
      },
    },
  }
}

function latestVladimirShard(): any {
  return {
    champions: {
      8: {
        champion: { id: 8, name: 'Vladimir' },
        builds: [
          {
            queueId: 450,
            stats: { games: 6535, wins: 3400, winRate: 0.52 },
            tags: { damage: 'AP' },
            coreItems: [{ items: [6653, 3020, 4645] }],
          },
        ],
        augments: [
          {
            id: 1205,
            stats: { games: 1900, wins: 1045, winRate: 0.55, pickRate: 0.2 },
          },
        ],
      },
    },
  }
}

function latestVladimirRankedWithoutAugmentWinRatesShard(): any {
  return {
    champions: {
      8: {
        champion: { id: 8, name: 'Vladimir' },
        augments: [
          { id: 1205, stats: { rank: 2, total: 3, tier: 2, games: null, wins: null, winRate: null, pickRate: 0.5 } },
          { id: 1103, stats: { rank: 1, total: 3, tier: 1, games: null, wins: null, winRate: null, pickRate: 0.01 } },
          { id: 1180, stats: { rank: 3, total: 3, tier: 1, games: null, wins: null, winRate: null, pickRate: 0.2 } },
        ],
      },
    },
  }
}

async function seedData(): Promise<void> {
  const dataRoot = path.join(tempRoot, 'data')
  const activeVersionDir = path.join(dataRoot, 'versions', '16.12.1')
  const latestVersionDir = path.join(dataRoot, 'versions', '16.12.2')
  const activeFiles = [
    'augments.json',
    'champions.json',
    'items.json',
    'manifest.json',
    'champion-shards/index.json',
    'champion-shards/1.json',
  ]
  const latestFiles = [
    'manifest.json',
    'champion-shards/1.json',
  ]

  await writeJson(path.join(dataRoot, 'current.json'), {
    schemaVersion: 3,
    dataVersion: '16.12.1',
    gamePatch: '16.12',
    manifest: '/api/client/v1/data/16.12.1/manifest.json',
  })
  await writeJson(path.join(activeVersionDir, 'manifest.json'), manifest(activeFiles))
  await writeJson(path.join(activeVersionDir, 'augments.json'), {
    augments: [
      {
        id: 1205,
        name: 'Deft',
        rarity: 'gold',
        iconUrl: '/augment/deft.png',
      },
    ],
  })
  await writeJson(path.join(activeVersionDir, 'champions.json'), { champions: [] })
  await writeJson(path.join(activeVersionDir, 'items.json'), { items: [] })
  await writeJson(path.join(activeVersionDir, 'champion-shards', 'index.json'), shardIndex('16.12.1'))
  await writeJson(path.join(activeVersionDir, 'champion-shards', '1.json'), oldVladimirShard())

  await writeJson(path.join(latestVersionDir, 'manifest.json'), manifest(latestFiles))
  await writeJson(path.join(latestVersionDir, 'champion-shards', '1.json'), latestVladimirShard())
}

describe('latest champion shard detail loading', () => {
  beforeEach(async () => {
    vi.resetModules()
    vi.unstubAllGlobals()
    originalCwd = process.cwd()
    tempRoot = await mkdtemp(path.join(os.tmpdir(), 'aramgg-data-loader-'))
    process.chdir(tempRoot)
    await seedData()

    vi.doMock('../../src/main/modules/app-paths.ts', () => ({
      getAppDataDir: () => tempRoot,
      getLogDir: () => path.join(tempRoot, 'logs'),
    }))

    vi.stubGlobal('fetch', vi.fn(async (input: any) => {
      const url = String(input)
      if (url.endsWith('/api/client/v1/config')) {
        return {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => ({
            dataVersion: '16.12.1',
            gamePatch: '16.12',
            manifest: '/api/client/v1/data/16.12.1/manifest.json',
          }),
        }
      }

      if (url.endsWith('/api/client/v1/data/16.12.2/manifest.json')) {
        return {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => manifest(['manifest.json', 'champion-shards/1.json']),
        }
      }

      throw new Error(`Unexpected fetch: ${url}`)
    }))
  })

  afterEach(async () => {
    process.chdir(originalCwd)
    vi.unstubAllGlobals()
    vi.resetModules()
    if (tempRoot) {
      await rm(tempRoot, { recursive: true, force: true })
      tempRoot = ''
    }
  })

  it('uses a newer cached champion shard when the newer version is not fully activated', async () => {
    const { loadChampionBuild, clearCache } = await import('../../src/main/data-loader.ts')

    try {
      const build = await loadChampionBuild(8)

      expect(build?.builds).toHaveLength(1)
      expect(build.builds[0].games).toBe(6535)
      expect(build.coreItems[0].itemIds).toEqual(['6653', '3020', '4645'])
    } finally {
      clearCache()
    }
  })

  it('returns local champion detail without waiting for a slow remote version check', async () => {
    await rm(path.join(tempRoot, 'data', 'versions', '16.12.2'), { recursive: true, force: true })

    let releaseConfig: (() => void) | null = null
    const configResponse = new Promise<any>((resolve) => {
      releaseConfig = () => resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({
          dataVersion: '16.12.1',
          gamePatch: '16.12',
          manifest: '/api/client/v1/data/16.12.1/manifest.json',
        }),
      })
    })

    vi.stubGlobal('fetch', vi.fn(async (input: any) => {
      const url = String(input)
      if (url.endsWith('/api/client/v1/config')) {
        return configResponse
      }

      throw new Error(`Unexpected fetch: ${url}`)
    }))

    const { loadChampionBuild, clearCache } = await import('../../src/main/data-loader.ts')
    let buildPromise: Promise<any> | null = null

    try {
      buildPromise = loadChampionBuild(8)
      const build = await awaitLocalFirstResult(
        buildPromise,
        'Champion detail waited for remote config'
      )

      expect(build?.builds).toHaveLength(1)
      expect(build.builds[0].games).toBe(1200)
    } finally {
      releaseConfig?.()
      await buildPromise?.catch(() => null)
      clearCache()
    }
  })

  it('returns local augment popup data without waiting for a slow remote version check', async () => {
    await rm(path.join(tempRoot, 'data', 'versions', '16.12.2'), { recursive: true, force: true })

    let releaseConfig: (() => void) | null = null
    const configResponse = new Promise<any>((resolve) => {
      releaseConfig = () => resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({
          dataVersion: '16.12.1',
          gamePatch: '16.12',
          manifest: '/api/client/v1/data/16.12.1/manifest.json',
        }),
      })
    })

    vi.stubGlobal('fetch', vi.fn(async (input: any) => {
      const url = String(input)
      if (url.endsWith('/api/client/v1/config')) {
        return configResponse
      }

      throw new Error(`Unexpected fetch: ${url}`)
    }))

    const { getChampionDetailData, clearCache } = await import('../../src/main/data-loader.ts')
    let detailPromise: Promise<any> | null = null

    try {
      detailPromise = getChampionDetailData(8)
      const detail = await awaitLocalFirstResult(
        detailPromise,
        'Augment popup data waited for remote config'
      )

      expect(detail.augmentBase.map((augment: any) => augment.id)).toEqual([1205])
      expect(detail.augments['1205'].win_rate).toBe(0.6)
      expect(detail.builds).toHaveLength(1)
      expect(detail.championName.nameCN).toBe('Vladimir')
    } finally {
      releaseConfig?.()
      await detailPromise?.catch(() => null)
      clearCache()
    }
  })

  it('uses the API rank when the latest data has no augment win rate', async () => {
    const activeVersionDir = path.join(tempRoot, 'data', 'versions', '16.12.1')
    const latestVersionDir = path.join(tempRoot, 'data', 'versions', '16.12.2')
    await writeJson(path.join(activeVersionDir, 'augments.json'), {
      augments: [
        { id: 1205, name: 'Deft', rarity: 'gold', iconUrl: '/augment/deft.png' },
        { id: 1103, name: 'Scoped Weapons', rarity: 'silver', iconUrl: '/augment/scoped.png' },
        { id: 1180, name: 'Infernal Conduit', rarity: 'prismatic', iconUrl: '/augment/infernal.png' },
      ],
    })
    await writeJson(
      path.join(latestVersionDir, 'champion-shards', '1.json'),
      latestVladimirRankedWithoutAugmentWinRatesShard(),
    )

    const {
      clearCache,
      getChampionAugmentStats,
      loadChampionAugments,
    } = await import('../../src/main/data-loader.ts')

    try {
      const recommendations = await getChampionAugmentStats(8)
      const stats = await loadChampionAugments(8)

      expect(recommendations.map((augment: any) => augment.augmentId)).toEqual([1103, 1205, 1180])
      expect(recommendations.map((augment: any) => augment.rank)).toEqual([1, 2, 3])
      expect(recommendations.map((augment: any) => augment.recommendScore)).toEqual([1, 0.5, 0])
      expect(recommendations.every((augment: any) => augment.winRate === null)).toBe(true)
      expect(stats['1103'].win_rate).toBeNull()
      expect(stats['1103'].rank).toBe(1)
    } finally {
      clearCache()
    }
  })
})
