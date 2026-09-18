import type LCUService from '../lcu/lcu-service.ts'
import type { LobbyData, LobbyMember } from '../lcu/types.ts'
import { normalizeGame } from './local-match-history-service.ts'
import { SgpMatchHistoryService } from './sgp-match-history-service.ts'

export interface LobbyMemberStats {
  puuid: string
  name: string
  wins: number
  games: number
  winRate: number | null
  avgKills: number
  avgDeaths: number
  avgAssists: number
  kda: number | null
  score: number | null
}

export interface LobbyStatsPayload {
  queueId: number
  members: LobbyMemberStats[]
  updatedAt: number
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function memberPuuid(member: LobbyMember): string {
  const value = text(member.puuid)
  return /^[a-zA-Z0-9_-]{8,128}$/.test(value) ? value : ''
}

function memberName(member: LobbyMember): string {
  return text(member.gameName) || text(member.summonerName) || text(member.riotId) || '未知玩家'
}

function computeKda(kills: number, deaths: number, assists: number): number | null {
  if (deaths === 0) {
    return kills + assists > 0 ? kills + assists : null
  }
  return (kills + assists) / deaths
}

function computeScore(winRate: number | null, kda: number | null): number | null {
  if (winRate == null && kda == null) return null
  const wr = winRate ?? 0.5
  const k = kda ?? 3.0
  const raw = wr * 10 + k * 1.2
  return Math.max(3.0, Math.min(16.0, Math.round(raw * 10) / 10))
}

export async function queryLobbyMemberStats(
  lcuService: LCUService,
  lobby: LobbyData,
  count = 50,
): Promise<LobbyStatsPayload> {
  const queueId = Number(lobby.queueId) || 0
  const currentSummoner = await lcuService.getCurrentSummoner()
  const platformId = text(currentSummoner?.platformId || currentSummoner?.currentPlatformId).toUpperCase()
  const members = Array.isArray(lobby.members) ? lobby.members : []
  const sgp = new SgpMatchHistoryService(lcuService)
  const updatedAt = Date.now()

  const stats = await Promise.all(members.map(async member => {
    const puuid = memberPuuid(member)
    const name = memberName(member)
    const base = { puuid, name, avgKills: 0, avgDeaths: 0, avgAssists: 0 }
    if (!puuid) return { ...base, wins: 0, games: 0, winRate: null, kda: null, score: null }
    try {
      const rawGames = await sgp.getSummaries(puuid, platformId, 0, count, queueId)
      let games = 0
      let wins = 0
      let totalKills = 0
      let totalDeaths = 0
      let totalAssists = 0
      for (const raw of rawGames) {
        const game = normalizeGame(raw, platformId, updatedAt)
        const participant = game?.participants.find(item => item.puuid === puuid)
        if (!game || !participant || game.endOfGameResult.startsWith('Abort_') || participant.gameEndedInEarlySurrender) continue
        games += 1
        if (participant.win) wins += 1
        totalKills += Number(participant.kills) || 0
        totalDeaths += Number(participant.deaths) || 0
        totalAssists += Number(participant.assists) || 0
      }
      const avgKills = games ? totalKills / games : 0
      const avgDeaths = games ? totalDeaths / games : 0
      const avgAssists = games ? totalAssists / games : 0
      const winRate = games ? wins / games : null
      const kda = computeKda(avgKills, avgDeaths, avgAssists)
      const score = computeScore(winRate, kda)
      return { ...base, wins, games, winRate, avgKills, avgDeaths, avgAssists, kda, score }
    } catch {
      return { ...base, wins: 0, games: 0, winRate: null, kda: null, score: null }
    }
  }))

  return { queueId, members: stats, updatedAt }
}
