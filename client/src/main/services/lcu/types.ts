/**
 * LCU (League Client Update) 服务类型定义
 * 主进程和渲染进程共享
 */

/** LCU 认证结果 */
export interface LCUAuthResult {
  token: string
  port: string
  url: string
}

/** LCU 连接配置 */
export interface LCUAuthConfig {
  auth: {
    username: 'riot'
    password: string
  }
}

/** LCU API URL 集合 */
export interface LCUUrls {
  authToken: string
  curSession: string
  curPerk: string
  perks: string
  currentSummoner: string
  itemSets: string
  position1: string
  position2: string
  gameflowPhase: string
  gameflowSession: string
  lobby: string
  ownedSkins: string
  championData: string
  ownedChampions: string
  mySelection: string
  regionLocale: string
  championList: string
  ownedEmotes: string
  ownedWardSkins: string
  ownedRegalia: string
  champSelectSession: string
  summonerEmote: string
  currentSelection: string
}

/** 皮肤信息 */
export interface SkinInfo {
  skinId: number
  championId: number
  skinName: string
  isBase: boolean
  chromas: ChromaInfo[]
  [key: string]: unknown
}

/** 炫彩信息 */
export interface ChromaInfo {
  id: number
  name: string
  colors: string[]
  chromaPath: string
  skinId: number
  [key: string]: unknown
}

/** 英雄简要信息 */
export interface ChampionBrief {
  id: number
  name: string
  alias: string
  title: string
  squarePortraitPath: string
  [key: string]: unknown
}

/** 装饰物品信息 */
export interface DecorationItem {
  id: number
  name: string
  inventoryType: string
  itemId: number
  iconPath?: string
  [key: string]: unknown
}

/** 选人阶段成员信息 */
export interface ChampSelectMember {
  cellId: number
  championId: number
  selectedSkinId: number
  summonerId: number
  summonerName: string
  [key: string]: unknown
}

/** 只读选人快照状态 */
export type ChampSelectSnapshotStatus =
  | 'unavailable'
  | 'not-in-champ-select'
  | 'empty'
  | 'ready'

/** 游戏流程阶段 */
export type GameflowPhase =
  | 'None'
  | 'Lobby'
  | 'Matchmaking'
  | 'CheckedIntoGame'
  | 'ReadyCheck'
  | 'ChampSelect'
  | 'GameStart'
  | 'InProgress'
  | 'WaitingForStats'
  | 'PreEndOfGame'
  | 'EndOfGame'

/** 选人会话中的队员信息 */
export interface TeamMember {
  cellId: number
  championId: number
  summonerId?: number
  spell1Id?: number
  spell2Id?: number
  championPickIntent?: number
  [key: string]: unknown
}

/** 选人会话中的操作信息 */
export interface ChampSelectAction {
  actorCellId: number
  championId: number
  type: string
  completed: boolean
  id?: number
  [key: string]: unknown
}

/** 大乱斗 bench 英雄信息 */
export interface ChampSelectBenchChampion {
  championId: number
  isPriority?: boolean
  [key: string]: unknown
}

/** 选人计时器信息 */
export interface ChampSelectTimer {
  adjustedTimeLeftInPhase?: number
  internalNowInEpochMs?: number
  phase?: string
  totalTimeInPhase?: number
  [key: string]: unknown
}

/** 选人会话数据 */
export interface ChampSelectSession {
  localPlayerCellId: number
  myTeam: TeamMember[]
  theirTeam: TeamMember[]
  actions: ChampSelectAction[][]
  benchEnabled?: boolean
  benchChampions?: ChampSelectBenchChampion[]
  timer?: ChampSelectTimer
  errorCode?: string
  [key: string]: unknown
}

/** 标准化后的只读选人快照 */
export interface ChampSelectSnapshot {
  connected: boolean
  gameflowPhase: GameflowPhase | null
  isInChampSelect: boolean
  champSelectSession: ChampSelectSession | null
  localPlayerCellId: number | null
  selfChampionId: number | null
  benchEnabled: boolean
  benchChampions: ChampSelectBenchChampion[]
  myTeam: TeamMember[]
  actions: ChampSelectAction[][]
  timer: ChampSelectTimer | null
  status: ChampSelectSnapshotStatus
  reason: string | null
  updatedAt: number
}

/** 符文页数据 */
export interface PerkPage {
  id: number
  name: string
  current: boolean
  isDeletable: boolean
  selectedPerkIds: number[]
  primaryStyleId: number
  subStyleId: number
}

/** LCU 服务缓存配置 */
export interface LCUCacheConfig {
  tokenCacheDuration: number
  failCooldown: number
}

/** 获取英雄ID的结果 */
export interface ChampionIdResult {
  success: boolean
  championId: number | null
  error?: string
}

/** 组队大厅成员信息 */
export interface LobbyMember {
  puuid?: string
  summonerId?: number
  summonerName?: string
  gameName?: string
  riotId?: string
  [key: string]: unknown
}

/** 组队大厅信息 */
export interface LobbyData {
  members?: LobbyMember[]
  queueId?: number
  [key: string]: unknown
}

/** Token 加载结果（三元组） */
export type TokenLoadResult = [
  token: string | null,
  port: string | null,
  urlWithAuth: string | null,
]
