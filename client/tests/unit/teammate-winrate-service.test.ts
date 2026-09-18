import axios from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ChampSelectSnapshot } from '../../src/shared/ipc-contract.ts'
import type LCUService from '../../src/main/services/lcu/lcu-service.ts'
import { queryTeammateWinrates } from '../../src/main/services/match-history/teammate-winrate-service.ts'

vi.mock('axios', () => ({ default: { get: vi.fn() } }))
vi.mock('../../src/main/modules/logger.ts', () => ({ default: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() } }))

const selfPuuid = '11111111-1111-1111-1111-111111111111'
const teammatePuuid = '22222222-2222-2222-2222-222222222222'

afterEach(() => vi.clearAllMocks())

describe('teammate winrate overlay data', () => {
  it('queries the selected queue and excludes remakes from win rate', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      status: 200, headers: {}, data: { games: [
        { json: { gameId: 1, platformId: 'HN10', queueId: 450, participants: [{ participantId: 1, puuid: teammatePuuid, championId: 1, win: 'Win' }] } },
        { json: { gameId: 2, platformId: 'HN10', queueId: 450, participants: [{ participantId: 1, puuid: teammatePuuid, championId: 1, win: false }] } },
        { json: { gameId: 3, platformId: 'HN10', queueId: 450, endOfGameResult: 'Abort_Early', participants: [{ participantId: 1, puuid: teammatePuuid, championId: 1, win: true }] } },
      ] },
    })
    const lcu = {
      getCurrentSummoner: vi.fn().mockResolvedValue({ platformId: 'HN10' }),
      getEntitlementsAccessToken: vi.fn().mockResolvedValue('token'),
    } as unknown as LCUService
    const snapshot = {
      localPlayerCellId: 0,
      champSelectSession: { queueId: 450 },
      myTeam: [
        { cellId: 0, championId: 2, puuid: selfPuuid },
        { cellId: 1, championId: 1, puuid: teammatePuuid, gameName: '队友甲' },
      ],
    } as unknown as ChampSelectSnapshot

    const result = await queryTeammateWinrates(lcu, snapshot)
    expect(result.entries).toEqual([expect.objectContaining({ name: '队友甲', games: 2, wins: 1, winRate: 0.5 })])
    expect(axios.get).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      params: expect.objectContaining({ tag: 'q_450' }),
    }))
  })
})
