export type Unsubscribe = () => void

export type AppStoreKey =
  | 'lastSelectedChampionId'
  | 'itemSets.autoApplyAram'
  | 'championInsight.showDetails'
  | 'championInsight.hideOnGameStart'
  | 'championInsight.alwaysOnTop'
  | 'augments.showTopOverlay'
  | 'augments.showSidePanel'
  | 'postGameShare.autoShow'
  | 'ui.activeNavSection'
  | 'ui.sidebarCollapsed'
  | 'teammateWinrate.enabled'
  | 'teammateWinrate.particleEffects'
  | 'lobbyStats.enabled'
  | 'aramBenchSwap.enabled'
  | 'skinMods.directory'
  | 'skinMemory'
  | 'skinHistory'
  | 'skinRandomSettings'

export type SupportedDataLocale = 'zh-CN' | 'zh-TW' | 'en-US'

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

export type ChampSelectSnapshotStatus =
  | 'unavailable'
  | 'not-in-champ-select'
  | 'empty'
  | 'ready'

export interface LooseRecord {
  [key: string]: unknown
}

export interface OperationResult extends LooseRecord {
  success: boolean
  error?: string
}

export interface AccountStatus {
  signedIn: boolean
  secureTransport: boolean
  serviceOrigin: string
  localKey: { configured: boolean; usable: boolean }
  sharedKey: {
    configured: boolean
    shareEnabled: boolean
    dailyShareLimit?: number
    creditsUsedToday?: number
    fingerprint?: string
    lastUsedAt?: string | null
    status?: string
  } | null
  serviceError?: string
}

/** A locally collected champion + augment/item outcome aggregate. */
export interface LocalMatchHistoryStat extends LooseRecord {
  championId: number
  championName?: string
  subjectId: number
  subjectName?: string
  samples: number
  wins: number
  winRate: number
}

export interface LocalMatchHistoryRecentMatch extends LooseRecord {
  gameId: number
  gameCreation: number
  gameMode: string
  queueId: number
  championId: number
  championName?: string
  kills: number
  deaths: number
  assists: number
  win: boolean
  subteamPlacement: number | null
}

export interface LocalMatchHistoryOverview extends LooseRecord {
  /** LCU platform/shard, e.g. HN10, NA1, KR. Statistics never mix platforms. */
  platformId: string | null
  gameCount: number
  playerCount: number
  hextechAramGameCount: number
  availableMatchedPlayerCount: number
  pendingUploadCount: number
}

export interface LocalMatchHistorySummary extends LooseRecord {
  updatedAt: number
  currentPlayer: {
    name: string
  } | null
  overview: LocalMatchHistoryOverview
  recentMatches: LocalMatchHistoryRecentMatch[]
  augmentStats: LocalMatchHistoryStat[]
  itemStats: LocalMatchHistoryStat[]
}

export interface LocalMatchHistorySummaryResult extends OperationResult {
  data: LocalMatchHistorySummary
}

export interface HextechAramMatchHistoryAsset extends LooseRecord {
  id: number
  name?: string
  iconUrl?: string
}

export type HextechAramMatchResult = 'win' | 'loss' | 'remake'

export interface HextechAramMatchHistoryMatch extends LooseRecord {
  gameId: number
  gameCreation: number
  gameDuration: number
  gameVersion: string
  championId: number
  championName?: string
  championIconUrl?: string
  kills: number
  deaths: number
  assists: number
  result: HextechAramMatchResult
  augments: HextechAramMatchHistoryAsset[]
  items: HextechAramMatchHistoryAsset[]
}

export interface HextechAramMatchHistoryPage extends LooseRecord {
  playerName: string
  platformId: string
  queriedAt: number
  startIndex: number
  count: number
  returnedCount: number
  queueId: number
  validGameCount: number
  wins: number
  winRate: number | null
  hasPrevious: boolean
  hasMore: boolean
  matches: HextechAramMatchHistoryMatch[]
}

export interface HextechAramMatchHistoryQuery extends LooseRecord {
  startIndex?: number
  count?: number
  queueId?: number
}

export interface HextechAramMatchHistoryQueryResult extends OperationResult {
  data?: HextechAramMatchHistoryPage
}

export interface ClientVersionInfo extends LooseRecord {
  currentVersion?: string
  latestVersion?: string
  dataVersion?: string
  gamePatch?: string
  locale?: SupportedDataLocale
  downloadUrl?: string
  isNewer?: boolean
  severity?: string
  statusText?: string
  changelog?: LooseRecord[]
}

export interface AppUpdateState extends LooseRecord {
  phase?: string
  latestVersion?: string
  manualDownloadUrl?: string
  downloadDeferred?: boolean
  canCheck?: boolean
  canInstall?: boolean
  progress?: {
    percent?: number
    bytesPerSecond?: number
    [key: string]: unknown
  }
}

export interface TeamMember extends LooseRecord {
  cellId: number
  championId: number
  summonerId?: number
  spell1Id?: number
  spell2Id?: number
  championPickIntent?: number
}

export interface ChampSelectAction extends LooseRecord {
  actorCellId: number
  championId: number
  type: string
  completed: boolean
  id?: number
}

export interface ChampSelectBenchChampion extends LooseRecord {
  championId: number
  isPriority?: boolean
}

export interface ChampSelectTimer extends LooseRecord {
  adjustedTimeLeftInPhase?: number
  internalNowInEpochMs?: number
  phase?: string
  totalTimeInPhase?: number
}

export interface ChampSelectSession extends LooseRecord {
  localPlayerCellId: number
  myTeam: TeamMember[]
  theirTeam: TeamMember[]
  actions: ChampSelectAction[][]
  benchEnabled?: boolean
  benchChampions?: ChampSelectBenchChampion[]
  timer?: ChampSelectTimer
  errorCode?: string
}

export interface ChampSelectSnapshot extends LooseRecord {
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

export interface PerkPage extends LooseRecord {
  id: number
  name: string
  current: boolean
  isDeletable: boolean
  selectedPerkIds: number[]
  primaryStyleId: number
  subStyleId: number
}

export interface AramRecommendationCandidate extends LooseRecord {
  championId: number
  name: string
  source: 'current' | 'bench' | 'teammate'
  sourceLabel: string
  isCurrent: boolean
  winRate: number | null
  pickRate: number | null
  games: number | null
  score: number
  confidence: number
  reasons: string[]
}

export interface AramBenchRecommendation extends LooseRecord {
  readOnly: true
  status: string
  reason: string | null
  gameflowPhase: GameflowPhase | null
  currentChampion: AramRecommendationCandidate | null
  recommendedChampion: AramRecommendationCandidate | null
  candidates: AramRecommendationCandidate[]
  deltaScore: number
  confidence: number
  reasons: string[]
  generatedAt: number
}

export interface LcuStatusResult extends OperationResult {
  active: boolean
}

export interface LcuSessionResult extends OperationResult {
  session: ChampSelectSession | null
}

export interface LcuSnapshotResult extends OperationResult {
  snapshot: ChampSelectSnapshot | null
}

export interface LcuRecommendationResult extends OperationResult {
  recommendation: AramBenchRecommendation
}

export interface LcuPerkListResult extends OperationResult {
  perks: PerkPage[]
}

export interface LcuChampionIdResult extends OperationResult {
  championId: number | null
}

export interface LcuGameflowResult extends OperationResult {
  phase: GameflowPhase | null
}

export interface LocaleInfo extends LooseRecord {
  locale: SupportedDataLocale
  dataVersion?: string
  supportedLocales: ReadonlyArray<{
    code: SupportedDataLocale
    label: string
    nativeLabel: string
  }>
}

export interface OverlayPayload extends LooseRecord {
  championId?: number | null
  championName?: string
  augments?: LooseRecord[]
  dataSource?: string
  timestamp?: number
  error?: string
}

export interface GamePhaseChangedPayload {
  phase: GameflowPhase | null
  prevPhase: GameflowPhase | null
}

export interface ChampionMonitorState {
  phase: GameflowPhase | null
  selectedChampionId: number | null
  lastChampionId: number | null
  revision: number
}

export interface LocaleChangedPayload extends LooseRecord {
  locale: SupportedDataLocale
  dataVersion?: string
}

export interface MatchHistoryUpdatedPayload {
  updatedAt: number
}

export interface TeammateWinrateEntry {
  cellId: number
  name: string
  championId: number
  wins: number
  games: number
  winRate: number | null
  avgKills: number
  avgDeaths: number
  avgAssists: number
  kda: number | null
  score: number | null
}

export interface TeammateWinratePayload {
  queueId: number
  entries: TeammateWinrateEntry[]
  updatedAt: number
}

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

export interface BenchSwapResult extends OperationResult {
  championId?: number
}

export interface SkinChromaData {
  id: number
  name: string
  colors: string[]
  chromaPath: string
  skinId: number
}

export interface SkinData {
  skinId: number
  championId: number
  skinName: string
  isBase: boolean
  chromas: SkinChromaData[]
  cardPath?: string
  tilePath?: string
  splashPath?: string
  uncenteredCropPath?: string
  rarity?: string
  [key: string]: unknown
}

export interface ChampionSkinData {
  championId: number
  championName: string
  skins: SkinData[]
}

export interface OwnedSkinsResult extends OperationResult {
  skinIds?: number[]
}

export interface ChampionListResult extends OperationResult {
  champions?: { id: number; name: string; alias: string; title: string; squarePortraitPath: string }[]
}

export interface ChampionSkinsResult extends OperationResult {
  data?: ChampionSkinData
}

export interface SkinSelectResult extends OperationResult {
  skinId?: number
}

export interface DecorationItemData {
  id: number
  name: string
  inventoryType: string
  itemId: number
  iconPath?: string
  [key: string]: unknown
}

export interface DecorationsResult extends OperationResult {
  emotes?: DecorationItemData[]
  wardSkins?: DecorationItemData[]
}

export interface PartyMemberSkin {
  cellId: number
  championId: number
  selectedSkinId: number
  summonerId: number
  summonerName: string
  [key: string]: unknown
}

export interface PartySkinsResult extends OperationResult {
  members?: PartyMemberSkin[]
}

export interface SkinRuntimeSelection {
  championId: number
  championName: string
  skinId: number
  skinName: string
  chromaId?: number
}

export interface SkinRuntimeState extends LooseRecord {
  supported: boolean
  phase: 'unsupported' | 'missing-dependency' | 'idle' | 'downloading' | 'prepared' | 'applying' | 'active' | 'error'
  progress: number
  message: string
  selection: SkinRuntimeSelection | null
  dependencyDirectory: string
  timing?: { phase: string; ms: number }[]
}

export interface SkinMemoryEntry {
  championId: number
  skinId: number
  chromaId?: number
  skinName: string
  championAlias: string
  timestamp: number
}

export interface SkinHistoryEntry {
  skinId: number
  chromaId?: number
  skinName: string
  championName: string
  championAlias: string
  championId: number
  imageUrl: string
  timestamp: number
  source: 'manual' | 'random' | 'local'
}

export interface SkinRandomSettings {
  mode: 'skin' | 'chroma' | 'both'
  scope: 'owned' | 'all'
  championFilter: 'current' | 'any'
}

export interface LocalModEntry {
  filename: string
  size: number
  championId: number | null
  skinId: number | null
  enabled: boolean
  status: 'ready' | 'disabled' | 'corrupt' | 'unknown'
}

export interface ScanLocalModsResult extends OperationResult {
  mods?: LocalModEntry[]
}

export interface ElectronEventMap {
  fromMain: [payload?: unknown]
  'for-popup': [payload: OverlayPayload]
  'screenshot-taken': [payload: LooseRecord]
  'winrate-updated': [payload: LooseRecord]
  'auto-screenshot-taken': [payload: LooseRecord]
  'game-phase-changed': [payload: GamePhaseChangedPayload]
  'champion-monitor-changed': [payload: ChampionMonitorState]
  'champ-select-start': [payload?: LooseRecord]
  'item-set-auto-apply-completed': [payload: LooseRecord]
  'game-started': [payload?: LooseRecord]
  'game-in-progress': [payload?: LooseRecord]
  'bench-recommendation-preview': [payload: AramBenchRecommendation]
  'augment-detection-started': [payload?: LooseRecord]
  'augment-detected': [payload: OverlayPayload]
  'augment-cleared': [payload?: LooseRecord]
  'game-ended': [payload?: LooseRecord]
  'end-of-game': [payload?: LooseRecord]
  'post-game-share-ready': [payload: LooseRecord]
  'quit-confirm-requested': []
  'app-update-status-changed': [payload: AppUpdateState]
  'locale-changed': [payload: LocaleChangedPayload]
  'match-history-updated': [payload: MatchHistoryUpdatedPayload]
  'teammate-winrate-updated': [payload: TeammateWinratePayload]
  'lobby-stats-updated': [payload: LobbyStatsPayload]
  'bench-swap-result': [payload: BenchSwapResult]
  'skin-runtime-changed': [payload: SkinRuntimeState]
}

export type ElectronEventChannel = keyof ElectronEventMap

export interface ElectronAPI {
  store: {
    get<T = unknown>(key: AppStoreKey): Promise<T | undefined>
    set<T = unknown>(key: AppStoreKey, value: T): Promise<void>
    delete(key: AppStoreKey): Promise<void>
  }
  developerKey: {
    getStatus(): Promise<{ configured: boolean; usable: boolean }>
    save(key: string): Promise<{ configured: boolean; usable: boolean }>
    delete(): Promise<{ configured: boolean; usable: boolean }>
  }
  account: {
    getStatus(): Promise<AccountStatus>
    register(email: string, password: string): Promise<AccountStatus>
    login(email: string, password: string): Promise<AccountStatus>
    logout(): Promise<AccountStatus>
    saveKey(key: string, shareEnabled: boolean, dailyLimit: number): Promise<AccountStatus>
    updateSharing(enabled: boolean, dailyLimit: number): Promise<AccountStatus>
    revokeKey(): Promise<AccountStatus>
  }
  windows: {
    ready(): void
    showPopup(data: OverlayPayload): void
    hidePopup(reason?: string): void
    hideFloating(reason?: string): void
    hideAugmentSidePanel(reason?: string): void
    toggleMain(): void
    confirmQuit(): Promise<OperationResult>
    restart(): void
  }
  appInfo: {
    getVersionInfo(): Promise<OperationResult & { data?: ClientVersionInfo }>
    openLogDirectory(): Promise<OperationResult>
  }
  appUpdate: {
    getState(): Promise<OperationResult & { data?: AppUpdateState }>
    check(): Promise<OperationResult & { data?: AppUpdateState }>
    download(): Promise<OperationResult & { data?: AppUpdateState }>
    install(): Promise<OperationResult & { data?: AppUpdateState }>
  }
  analytics: {
    getStatus(): Promise<LooseRecord>
    setEnabled(enabled: boolean): Promise<LooseRecord>
    track(name: string, properties?: LooseRecord): Promise<LooseRecord>
  }
  locale: {
    get(): Promise<LocaleInfo>
    set(locale: SupportedDataLocale): Promise<LocaleInfo>
  }
  screenshot: {
    capture(): Promise<LooseRecord>
    analyze(imagePathOrBuffer: string | Uint8Array): Promise<LooseRecord>
  }
  winrate: {
    get(data: LooseRecord): Promise<OperationResult & { augments?: LooseRecord[]; timing?: LooseRecord }>
    loadChampionData(championId: number): Promise<OperationResult & { data?: LooseRecord }>
  }
  autoScreenshot: {
    start(config?: LooseRecord): Promise<LooseRecord>
    stop(): Promise<LooseRecord>
    setConfig(config: LooseRecord): Promise<LooseRecord>
    getStats(): Promise<LooseRecord>
    getConfig(): Promise<LooseRecord>
  }
  itemSets: {
    getAramStatus(): Promise<OperationResult>
    installAramChampion(payload: LooseRecord): Promise<OperationResult>
  }
  matchHistory: {
    getLocalSummary(): Promise<LocalMatchHistorySummaryResult>
    queryCurrent(payload?: HextechAramMatchHistoryQuery): Promise<HextechAramMatchHistoryQueryResult>
  }
  skinRuntime: {
    getState(): Promise<SkinRuntimeState>
    prepare(selection: SkinRuntimeSelection): Promise<SkinRuntimeState>
    clear(): Promise<SkinRuntimeState>
    importDll(): Promise<OperationResult & { data?: SkinRuntimeState }>
    scanLocalMods(): Promise<ScanLocalModsResult>
    toggleMod(filename: string, enabled: boolean): Promise<OperationResult>
    deleteMod(filename: string): Promise<OperationResult>
  }
  penguPlugin: {
    getStatus(): Promise<OperationResult & { data?: { penguInstalled: boolean; pluginInstalled: boolean; pluginPath?: string; penguPath?: string } }>
    installPlugin(): Promise<OperationResult & { data?: { pluginPath: string } }>
    uninstallPlugin(): Promise<OperationResult>
    openPluginsFolder(): Promise<OperationResult>
    writeSettings(settings: LooseRecord): Promise<OperationResult>
  }
  lcu: {
    getChampionMonitorState(): Promise<ChampionMonitorState>
    getChampionId(): Promise<LcuChampionIdResult>
    getStatus(): Promise<LcuStatusResult>
    getCurrentSession(): Promise<LcuSessionResult>
    getChampSelectSnapshot(): Promise<LcuSnapshotResult>
    getAramBenchRecommendation(): Promise<LcuRecommendationResult>
    getPerkList(): Promise<LcuPerkListResult>
    applyPerk(data: LooseRecord): Promise<OperationResult>
    getGameflowPhase(): Promise<LcuGameflowResult>
    getManualLeaguePath(): Promise<LooseRecord>
    selectManualLeaguePath(): Promise<LooseRecord>
    validateManualLeaguePath(lolPath: string): Promise<LooseRecord>
    setManualLeaguePath(lolPath: string): Promise<LooseRecord>
    clearManualLeaguePath(): Promise<LooseRecord>
    benchSwap(championId: number): Promise<BenchSwapResult>
    getLobbyStats(): Promise<OperationResult & { data?: LobbyStatsPayload }>
    getOwnedSkins(): Promise<OwnedSkinsResult>
    getChampionList(): Promise<ChampionListResult>
    getChampionSkins(championId: number): Promise<ChampionSkinsResult>
    setMySelectionSkin(skinId: number): Promise<SkinSelectResult>
    setMySelectionChroma(skinId: number, chromaId: number): Promise<SkinSelectResult>
    getDecorations(): Promise<DecorationsResult>
    getPartySkins(): Promise<PartySkinsResult>
    setSummonerEmote(emoteId: number): Promise<OperationResult>
  }
  diagnostics: {
    testShowFloating(data: LooseRecord): Promise<OperationResult>
    testShowRandomFloating(): Promise<OperationResult>
    testShowRandomPopup(): Promise<OperationResult>
    testShowBenchRecommendation(): Promise<OperationResult>
    logRendererError(errorData: LooseRecord): Promise<OperationResult>
    logRendererInfo(data: LooseRecord): void
    testDatabaseLoad(): Promise<OperationResult>
  }
  shell: {
    openExternal(url: string): Promise<OperationResult>
  }
  postGameShare: {
    getLatest(): Promise<OperationResult & { data?: LooseRecord }>
    refresh(): Promise<OperationResult & { data?: LooseRecord }>
    createMock(): Promise<OperationResult & { data?: LooseRecord }>
    copyImage(dataUrl: string): Promise<OperationResult>
    saveImage(dataUrl: string, suggestedFilename?: string): Promise<OperationResult>
  }
  events: {
    on<K extends ElectronEventChannel>(
      channel: K,
      callback: (...args: ElectronEventMap[K]) => void,
    ): Unsubscribe
    once<K extends ElectronEventChannel>(
      channel: K,
      callback: (...args: ElectronEventMap[K]) => void,
    ): Unsubscribe
  }
}
