import type { ChampSelectSnapshot, TeamMember } from '../../../shared/ipc-contract.ts'
import type LCUService from '../lcu/lcu-service.ts'
import { normalizeGame } from './local-match-history-service.ts'
import { SgpMatchHistoryService } from './sgp-match-history-service.ts'

export interface TeammateWinrateEntry {
  cellId: number
  name: string
  championId: number
  wins: number
  games: number
  winRate: number | null
}

export interface TeammateWinratePayload {
  queueId: number
  entries: TeammateWinrateEntry[]
  updatedAt: number
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function memberPuuid(member: TeamMember): string {
  const value = text(member.puuid)
  return /^[a-zA-Z0-9_-]{8,128}$/.test(value) ? value : ''
}

export async function queryTeammateWinrates(
  lcuService: LCUService,
  snapshot: ChampSelectSnapshot,
  count = 50,
): Promise<TeammateWinratePayload> {
  const queueId = Number(snapshot.champSelectSession?.queueId) || 0
  const currentSummoner = await lcuService.getCurrentSummoner()
  const platformId = text(currentSummoner?.platformId || currentSummoner?.currentPlatformId).toUpperCase()
  const teammates = snapshot.myTeam.filter(member => member.cellId !== snapshot.localPlayerCellId)
  const sgp = new SgpMatchHistoryService(lcuService)
  const updatedAt = Date.now()
  const entries = await Promise.all(teammates.map(async member => {
    const puuid = memberPuuid(member)
    const name = text(member.gameName) || text(member.summonerName) || `队友 ${member.cellId + 1}`
    const base = { cellId: member.cellId, name, championId: Number(member.championId) || 0 }
    if (!puuid) return { ...base, wins: 0, games: 0, winRate: null }
    try {
      const rawGames = await sgp.getSummaries(puuid, platformId, 0, count, queueId)
      let games = 0
      let wins = 0
      for (const raw of rawGames) {
        const game = normalizeGame(raw, platformId, updatedAt)
        const participant = game?.participants.find(item => item.puuid === puuid)
        if (!game || !participant || game.endOfGameResult.startsWith('Abort_') || participant.gameEndedInEarlySurrender) continue
        games += 1
        if (participant.win) wins += 1
      }
      return { ...base, wins, games, winRate: games ? wins / games : null }
    } catch {
      return { ...base, wins: 0, games: 0, winRate: null }
    }
  }))
  return { queueId, entries, updatedAt }
}
