/**
 * @name ARAMGG Stats
 * @version 1.0.0
 * @description 将战绩（胜率、KDA、评分）注入英雄联盟客户端大厅和选人阶段
 * @author ARAMGG
 * @link https://github.com/WJZ-P/aramgg
 */

// ==================== 设置 ====================
let pluginSettings = {
  showTeammateWinrate: true,
  showLobbyStats: true,
  showTeammateParticleEffects: true,
}

let settingsPollTimer = null
let settingsFetchInProgress = false

async function loadSettings() {
  if (settingsFetchInProgress) return
  settingsFetchInProgress = true
  try {
    const resp = await fetch('//plugins/aramgg-stats/settings.json', { cache: 'no-store' })
    if (!resp.ok) return
    const parsed = await resp.json()
    const prev = { ...pluginSettings }
    pluginSettings = { ...pluginSettings, ...parsed }
    if (JSON.stringify(prev) !== JSON.stringify(pluginSettings)) {
      log('Settings updated:', pluginSettings)
      applySettingsDiff(prev)
    }
  } catch (e) {
    // settings.json 不存在或无法访问时使用默认值
  } finally {
    settingsFetchInProgress = false
  }
}

function watchSettings() {
  if (settingsPollTimer) clearInterval(settingsPollTimer)
  settingsPollTimer = setInterval(() => loadSettings(), 3000)
}

function applySettingsDiff(prev) {
  if (prev.showLobbyStats !== pluginSettings.showLobbyStats) {
    updateLobbyStats(pluginSettings.showLobbyStats, penguContext)
  }
  if (prev.showTeammateWinrate !== pluginSettings.showTeammateWinrate) {
    updateChampSelectStats(pluginSettings.showTeammateWinrate, penguContext)
  }
  if (prev.showTeammateParticleEffects !== pluginSettings.showTeammateParticleEffects) {
    cleanupInjectedDOM()
    if (champSelectRegistered) tryInjectChampSelectStats()
  }
}

// ==================== 常量 ====================
const STATS_ATTR = 'data-aramgg-stats'
const STATS_TEXT_ATTR = 'data-aramgg-stats-text'
const TIER_ATTR = 'data-aramgg-tier'
const CLICK_ATTR = 'data-aramgg-click'
const PLAYER_KEY_ATTR = 'data-aramgg-player-key'
const FETCH_COUNT = 50

// ==================== 日志 ====================
function log(...args) {
  console.log('[ARAMGG]', ...args)
}
function warn(...args) {
  console.warn('[ARAMGG]', ...args)
}
function error(...args) {
  console.error('[ARAMGG]', ...args)
}

// ==================== LCU API ====================
async function lcuGet(endpoint) {
  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const resp = await fetch(url, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  })
  if (!resp.ok) throw new Error(`LCU ${resp.status} ${resp.statusText}: ${url}`)
  const text = await resp.text()
  return text ? JSON.parse(text) : null
}

async function lcuPost(endpoint, body) {
  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!resp.ok) throw new Error(`LCU POST ${resp.status}: ${url}`)
  return resp.status === 204 ? null : resp.json()
}

// ==================== InjectorManager ====================
const tasks = new Set()
let observer = null
let throttled = false

function register(task) {
  tasks.add(task)
  try { task() } catch (e) { error('Inject task failed:', e) }
}

function unregister(task) {
  tasks.delete(task)
}

function startObserver() {
  if (observer) return
  observer = new MutationObserver(() => {
    if (throttled) return
    throttled = true
    requestAnimationFrame(() => {
      for (const task of tasks) {
        try { task() } catch (e) { error('Inject task failed:', e) }
      }
      throttled = false
    })
  })
  observer.observe(document.body, { childList: true, subtree: true })
  log('DOM observer started')
}

// ==================== 颜色工具 ====================
function getRateColor(rate) {
  if (rate >= 0.6) return '#5bbd72'
  if (rate >= 0.5) return '#c8aa6e'
  return '#e74c3c'
}

function getKdaColor(kda) {
  if (kda >= 4) return '#5bbd72'
  if (kda >= 2.5) return '#c8aa6e'
  return '#e74c3c'
}

function getScoreColor(score) {
  if (score >= 14.5) return '#5bbd72'
  if (score >= 11.2) return '#c8aa6e'
  return '#e74c3c'
}

function getTierConfig(winRate) {
  if (winRate >= 0.7) return { id: 'blazing', boxShadow: '0 0 15px rgba(255,51,0,0.5)' }
  if (winRate >= 0.6) return { id: 'strong', boxShadow: '0 0 8px rgba(74,158,255,0.35)' }
  if (winRate >= 0.5) return { id: 'normal', boxShadow: '0 0 6px rgba(160,155,140,0.25)' }
  if (winRate >= 0.4) return { id: 'shaky', boxShadow: '' }
  return { id: 'dizzy', boxShadow: '' }
}

// ==================== 战绩获取与计算 ====================
async function fetchMatchHistory(puuid) {
  try {
    const data = await lcuGet(`/lol-match-history/v1/products/lol/${puuid}/matches?begIndex=0&endIndex=${FETCH_COUNT - 1}`)
    return data?.games?.games ?? []
  } catch (e) {
    warn(`Failed to fetch match history for ${puuid}:`, e)
    return []
  }
}

function findParticipant(game, puuid) {
  const identities = game.participantIdentities || []
  const identity = identities.find(id => id?.player?.puuid === puuid)
  if (!identity) return null
  const pid = identity.participantId
  return (game.participants || []).find(p => p?.participantId === pid) || null
}

function getParticipantStats(participant) {
  if (!participant) return null
  const stats = participant.stats || participant
  return {
    kills: stats.kills || 0,
    deaths: stats.deaths || 0,
    assists: stats.assists || 0,
    win: stats.win || false,
  }
}

function calculateStats(games, puuid, queueId) {
  let total = 0, wins = 0, kills = 0, deaths = 0, assists = 0

  for (const game of games) {
    if (queueId && game.queueId !== queueId) continue
    const participant = findParticipant(game, puuid)
    const stats = getParticipantStats(participant)
    if (!stats) continue
    total++
    if (stats.win) wins++
    kills += stats.kills
    deaths += stats.deaths
    assists += stats.assists
  }

  if (total === 0) return null

  const winRate = wins / total
  const kda = deaths === 0 ? kills + assists : (kills + assists) / deaths
  const avgK = kills / total
  const avgD = deaths / total
  const avgA = assists / total

  const score = 6.0 + winRate * 5.0 + Math.min(kda, 6) * 0.8

  return { winRate, kda, score, total, wins, avgK, avgD, avgA }
}

// ==================== 大厅战绩注入 ====================
let lobbyStatsMap = new Map()
let lobbyHistoryMap = new Map()
let lobbyQueueId = 0
let lobbyRegistered = false
let lobbySocketUnsub = null

function indexLobby(lobby) {
  const nextMap = new Map()
  lobbyQueueId = lobby?.gameConfig?.queueId ?? 0
  for (const member of lobby?.members ?? []) {
    const info = {
      puuid: member.puuid,
      summonerId: member.summonerId,
      name: member.summonerName || `Summoner ${member.summonerId}`,
    }
    if (member.puuid) nextMap.set(`puuid:${member.puuid}`, info)
    if (member.summonerId) nextMap.set(`summoner:${member.summonerId}`, info)
  }
  lobbyHistoryMap = nextMap
}

function getRegaliaMemberInfo(regalia) {
  const puuid = regalia.getAttribute('puuid') || ''
  const summonerId = Number(regalia.getAttribute('summoner-id') || 0)
  return lobbyHistoryMap.get(`puuid:${puuid}`)
    ?? lobbyHistoryMap.get(`summoner:${summonerId}`)
    ?? null
}

function ensureStatsOverlay(identity) {
  let overlay = identity.querySelector(`[${STATS_ATTR}]`)
  if (overlay) return overlay
  overlay = document.createElement('div')
  overlay.setAttribute(STATS_ATTR, 'true')
  overlay.style.cssText = [
    'position:absolute', 'top:12px', 'left:50%', 'transform:translateX(-50%)',
    'display:flex', 'align-items:center', 'gap:4px', 'padding:3px 7px',
    'background:rgba(1,10,19,0.72)', 'border:1px solid rgba(200,170,110,0.28)',
    'border-radius:3px', 'font-size:10.5px', 'line-height:1', 'font-weight:700',
    'white-space:nowrap', 'pointer-events:none', 'box-shadow:0 2px 8px rgba(0,0,0,0.28)',
  ].join(';')
  identity.appendChild(overlay)
  return overlay
}

function renderStatsOverlay(identity, stats) {
  const overlay = ensureStatsOverlay(identity)
  const nextText = stats
    ? `胜率 ${Math.round(stats.winRate * 100)}%|KDA ${stats.kda >= 99 ? 'Perfect' : stats.kda.toFixed(2)}|评分 ${stats.score.toFixed(1)}`
    : '战绩加载中...'
  if (overlay.getAttribute(STATS_TEXT_ATTR) === nextText) return
  overlay.setAttribute(STATS_TEXT_ATTR, nextText)
  if (!stats) {
    overlay.innerHTML = '<span style="color:#a09b8c">战绩加载中...</span>'
    return
  }
  overlay.innerHTML = [
    `<span style="color:${getRateColor(stats.winRate)}">胜率 ${Math.round(stats.winRate * 100)}%</span>`,
    '<span style="color:#5c5b57">|</span>',
    `<span style="color:${getKdaColor(stats.kda)}">KDA ${stats.kda >= 99 ? 'Perfect' : stats.kda.toFixed(2)}</span>`,
    '<span style="color:#5c5b57">|</span>',
    `<span style="color:${getScoreColor(stats.score)}">评分 ${stats.score.toFixed(1)}</span>`,
  ].join('')
}

function tryInjectLobbyStats() {
  const elements = document.querySelectorAll('lol-regalia-parties-v2-element[puuid], lol-regalia-parties-v2-element[summoner-id]')
  if (elements.length === 0) return true
  elements.forEach(node => {
    const regalia = node
    const info = getRegaliaMemberInfo(regalia)
    if (!info?.puuid) return
    const identity = regalia.querySelector('.player-identity-container')
    if (!identity) return
    if (!identity.style.position) identity.style.position = 'relative'
    renderStatsOverlay(identity, lobbyStatsMap.get(info.puuid))
  })
  return true
}

async function refreshLobbyStats() {
  const members = [...new Map(
    [...lobbyHistoryMap.values()].filter(m => m.puuid).map(m => [m.puuid, m])
  ).values()]
  const nextStats = new Map()
  await Promise.all(members.map(async member => {
    try {
      const games = await fetchMatchHistory(member.puuid)
      const stats = calculateStats(games, member.puuid, lobbyQueueId)
      if (stats) nextStats.set(member.puuid, stats)
    } catch (e) {
      warn(`Lobby stats failed for ${member.name}:`, e)
    }
  }))
  if (!lobbyRegistered) return
  lobbyStatsMap = nextStats
  tryInjectLobbyStats()
}

async function refreshLobbyMap() {
  try {
    const lobby = await lcuGet('/lol-lobby/v2/lobby')
    if (!lobbyRegistered) return
    indexLobby(lobby)
    tryInjectLobbyStats()
    void refreshLobbyStats()
  } catch {
    indexLobby(null)
    lobbyStatsMap.clear()
  }
}

function updateLobbyStats(enabled, context) {
  if (enabled && !lobbyRegistered) {
    lobbyRegistered = true
    register(tryInjectLobbyStats)
    if (context?.socket) {
      lobbySocketUnsub = context.socket.observe('/lol-lobby/v2/lobby', (event) => {
        if (event.eventType === 'Delete') {
          indexLobby(null)
          lobbyStatsMap.clear()
          return
        }
        void refreshLobbyMap()
      })
    }
    void refreshLobbyMap().then(() => {
      if (lobbyRegistered) log('Lobby stats enabled')
    })
  } else if (!enabled && lobbyRegistered) {
    lobbyRegistered = false
    unregister(tryInjectLobbyStats)
    if (lobbySocketUnsub) { lobbySocketUnsub(); lobbySocketUnsub = null }
    indexLobby(null)
    lobbyStatsMap.clear()
    document.querySelectorAll(`[${STATS_ATTR}]`).forEach(n => n.remove())
    log('Lobby stats disabled')
  }
}

// ==================== 选人阶段战绩注入 ====================
let floorStats = []
let statsByPuuid = new Map()
let statsByObfuscatedPuuid = new Map()
let currentChampSelectSignature = ''
let currentChampSelectQueueId = 0
let champSelectRegistered = false
let champSelectPhaseUnsub = null
let champSelectUpdateUnsub = null
let champSelectInjectedRefs = []

function resolveChampSelectPuuid(player) {
  if (player.puuid) return player.puuid
  if (player.nameVisibilityType !== 'HIDDEN' || !player.obfuscatedPuuid) return ''
  return deobfuscatePuuid(player.obfuscatedPuuid)
}

function deobfuscatePuuid(obfuscated) {
  if (!obfuscated) return ''
  try {
    let result = ''
    for (let i = 0; i < obfuscated.length; i++) {
      result += String.fromCharCode(obfuscated.charCodeAt(i) ^ 0x2a)
    }
    return result
  } catch { return '' }
}

function getAnalyzablePlayers(session) {
  return (session?.myTeam || []).filter(p => Boolean(p.puuid) || Boolean(p.obfuscatedPuuid))
}

function getPlayerKey(player) {
  if (player.puuid) return `puuid:${player.puuid}`
  if (player.obfuscatedPuuid) return `obfuscated-puuid:${player.obfuscatedPuuid}`
  return `cell:${player.cellId}`
}

function getTeamSignature(session) {
  return getAnalyzablePlayers(session).map(p => `${getPlayerKey(p)}:${p.cellId}`).join('|')
}

function getCachedStats(player, floor) {
  const cached = (player.puuid ? statsByPuuid.get(player.puuid) : null)
    ?? (player.obfuscatedPuuid ? statsByObfuscatedPuuid.get(player.obfuscatedPuuid) : null)
  if (cached) return { ...cached, floor, gameName: player.gameName || cached.gameName, tagLine: player.tagLine || cached.tagLine }
  return {
    floor, summonerId: player.summonerId, puuid: resolveChampSelectPuuid(player),
    obfuscatedPuuid: player.obfuscatedPuuid, gameName: player.gameName, tagLine: player.tagLine,
    winRate: null, wins: 0, total: 0, avgK: 0, avgD: 0, avgA: 0, kdaNum: 0, score: 0,
  }
}

function buildFloorStatsFromSession(session) {
  return getAnalyzablePlayers(session).map((p, i) => getCachedStats(p, i + 1))
}

function cleanupInjectedDOM() {
  for (const ref of champSelectInjectedRefs) {
    ref.statsDiv?.remove()
    if (ref.clickHandler) ref.iconContainer?.removeEventListener('click', ref.clickHandler, true)
    if (ref.iconContainer) {
      ref.iconContainer.style.filter = ''
      ref.iconContainer.style.boxShadow = ''
      ref.iconContainer.removeAttribute(TIER_ATTR)
      ref.iconContainer.removeAttribute(CLICK_ATTR)
      ref.iconContainer.removeAttribute(PLAYER_KEY_ATTR)
      ref.iconContainer.style.cursor = ''
    }
    if (ref.playerDetails) {
      ref.playerDetails.removeAttribute(STATS_ATTR)
      ref.playerDetails.style.cursor = ''
    }
    if (ref.summonerContainer) ref.summonerContainer.style.overflow = ''
  }
  champSelectInjectedRefs = []
}

function tryInjectChampSelectStats() {
  const wrappers = document.querySelectorAll('.party.visible .summoner-wrapper.visible.left')
  if (wrappers.length === 0 || floorStats.length === 0) return true

  const mismatched = Array.from(wrappers).some((wrapper, i) => {
    const iconContainer = wrapper.querySelector('.champion-icon-container')
    const stat = floorStats[i]
    if (!stat) return false
    const expectedKey = stat.obfuscatedPuuid ? `obfuscated-puuid:${stat.obfuscatedPuuid}` : `puuid:${stat.puuid}`
    const existingKey = iconContainer?.getAttribute(PLAYER_KEY_ATTR)
    return existingKey && existingKey !== expectedKey
  })

  if (mismatched) cleanupInjectedDOM()

  wrappers.forEach((wrapper, i) => {
    const stat = floorStats[i]
    if (!stat) return
    const playerKey = stat.obfuscatedPuuid ? `obfuscated-puuid:${stat.obfuscatedPuuid}` : `puuid:${stat.puuid}`

    const iconContainer = wrapper.querySelector('.champion-icon-container')
    if (iconContainer && stat.winRate != null) {
      const winRate = stat.winRate
      iconContainer.setAttribute(PLAYER_KEY_ATTR, playerKey)

      if (!iconContainer.hasAttribute(TIER_ATTR)) {
        iconContainer.setAttribute(TIER_ATTR, 'true')
        iconContainer.style.position = 'relative'
        iconContainer.style.overflow = 'visible'
        iconContainer.style.borderRadius = '50%'
        if (pluginSettings.showTeammateParticleEffects) {
          const config = getTierConfig(winRate)
          if (config.boxShadow) iconContainer.style.boxShadow = config.boxShadow
        }
      }

      if (!iconContainer.hasAttribute(CLICK_ATTR) && stat.puuid) {
        iconContainer.setAttribute(CLICK_ATTR, 'true')
        iconContainer.style.cursor = 'pointer'
        const boundKey = playerKey
        const clickHandler = (e) => {
          const target = e.target
          if (target instanceof Element && target.closest('.swap-button-component, .swap-button-btn')) return
          e.stopPropagation()
          e.preventDefault()
        }
        iconContainer.addEventListener('click', clickHandler, true)
      }
    }

    const playerDetails = wrapper.querySelector('.player-details')
    if (playerDetails && !playerDetails.querySelector(`[${STATS_ATTR}]`) && stat.winRate != null) {
      playerDetails.style.position = 'relative'
      playerDetails.style.overflow = 'visible'
      const summonerContainer = playerDetails.closest('.summoner-container')
      if (summonerContainer) summonerContainer.style.overflow = 'visible'

      const winRate = stat.winRate
      const kdaStr = stat.kdaNum >= 99 ? 'Perfect' : stat.kdaNum.toFixed(1)
      const winColor = winRate >= 0.55 ? '#5bbd72' : winRate >= 0.45 ? '#c8aa6e' : '#e74c3c'
      const kdaColor = stat.kdaNum >= 5 ? '#5bbd72' : stat.kdaNum >= 3 ? '#c8aa6e' : '#e74c3c'

      const statsDiv = document.createElement('div')
      statsDiv.setAttribute(STATS_ATTR, 'true')
      statsDiv.style.cssText = 'position:absolute;left:0;top:100%;display:flex;align-items:center;font-size:11px;line-height:1;white-space:nowrap;margin-top:2px;'

      const winSpan = document.createElement('span')
      winSpan.style.cssText = `color:${winColor};font-weight:bold;display:inline-block;min-width:90px;`
      winSpan.textContent = `${(winRate * 100).toFixed(0)}% (${stat.wins}胜/${stat.total - stat.wins}负)`

      const kdaSpan = document.createElement('span')
      kdaSpan.style.cssText = `color:${kdaColor};margin-left:8px;font-weight:bold;text-shadow:0 0 4px rgba(200,170,110,0.6);`
      kdaSpan.textContent = `KDA ${kdaStr}`

      statsDiv.appendChild(winSpan)
      statsDiv.appendChild(kdaSpan)
      playerDetails.appendChild(statsDiv)

      champSelectInjectedRefs.push({
        statsDiv, iconContainer, summonerContainer, playerDetails,
        clickHandler: null,
      })
    }
  })
  return true
}

function registerTierInjection() {
  if (!champSelectRegistered) {
    register(tryInjectChampSelectStats)
    champSelectRegistered = true
  }
}

function unregisterTierInjection() {
  if (champSelectRegistered) {
    unregister(tryInjectChampSelectStats)
    champSelectRegistered = false
  }
  floorStats = []
  statsByPuuid.clear()
  statsByObfuscatedPuuid.clear()
  currentChampSelectSignature = ''
  currentChampSelectQueueId = 0
  cleanupInjectedDOM()
}

async function applyChampSelectStats() {
  try {
    unregisterTierInjection()
    const session = await lcuGet('/lol-champ-select/v1/session')
    if (!session?.myTeam) return
    const queueId = session.queueId || 0
    currentChampSelectQueueId = queueId
    const players = getAnalyzablePlayers(session)

    const stats = await Promise.all(players.map(async (player, i) => {
      const puuid = resolveChampSelectPuuid(player)
      if (!puuid) return {
        floor: i + 1, summonerId: player.summonerId, puuid: '',
        obfuscatedPuuid: player.obfuscatedPuuid, gameName: player.gameName, tagLine: player.tagLine,
        winRate: null, wins: 0, total: 0, avgK: 0, avgD: 0, avgA: 0, kdaNum: 0, score: 0,
      }
      try {
        const games = await fetchMatchHistory(puuid)
        const s = calculateStats(games, puuid, queueId)
        if (!s) return {
          floor: i + 1, summonerId: player.summonerId, puuid,
          obfuscatedPuuid: player.obfuscatedPuuid, gameName: player.gameName, tagLine: player.tagLine,
          winRate: null, wins: 0, total: 0, avgK: 0, avgD: 0, avgA: 0, kdaNum: 0, score: 0,
        }
        return {
          floor: i + 1, summonerId: player.summonerId, puuid,
          obfuscatedPuuid: player.obfuscatedPuuid, gameName: player.gameName, tagLine: player.tagLine,
          ...s,
        }
      } catch {
        return {
          floor: i + 1, summonerId: player.summonerId, puuid,
          obfuscatedPuuid: player.obfuscatedPuuid, gameName: player.gameName, tagLine: player.tagLine,
          winRate: null, wins: 0, total: 0, avgK: 0, avgD: 0, avgA: 0, kdaNum: 0, score: 0,
        }
      }
    }))

    floorStats = stats
    statsByPuuid.clear()
    statsByObfuscatedPuuid.clear()
    for (const s of stats) {
      if (s.puuid) statsByPuuid.set(s.puuid, s)
      if (s.obfuscatedPuuid) statsByObfuscatedPuuid.set(s.obfuscatedPuuid, s)
    }
    currentChampSelectSignature = stats.map(s => s.obfuscatedPuuid ? `obfuscated-puuid:${s.obfuscatedPuuid}` : `puuid:${s.puuid}`).join('|')
    registerTierInjection()
    log(`Champ select stats ready, ${stats.length} players, queueId=${queueId}`)
  } catch (e) {
    error('Champ select stats failed:', e)
  }
}

function onChampSelectUpdate(event) {
  if (event.eventType !== 'Update') return
  if (statsByPuuid.size === 0 && statsByObfuscatedPuuid.size === 0) return
  const session = event.data
  if (!session?.myTeam) return
  const nextSig = getTeamSignature(session)
  if (nextSig === currentChampSelectSignature) return
  log('Detected team order change, rebuilding stats binding')
  cleanupInjectedDOM()
  floorStats = buildFloorStatsFromSession(session)
  currentChampSelectSignature = nextSig
  tryInjectChampSelectStats()
}

function updateChampSelectStats(enabled, context) {
  if (enabled && !champSelectPhaseUnsub) {
    champSelectPhaseUnsub = context?.socket?.observe('/lol-gameflow/v1/gameflow-phase', (event) => {
      const phase = event.data
      if (phase === 'ChampSelect') {
        unregisterTierInjection()
        void applyChampSelectStats()
      } else {
        unregisterTierInjection()
      }
    })
    champSelectUpdateUnsub = context?.socket?.observe('/lol-champ-select/v1/session', onChampSelectUpdate)
    log('Champ select stats enabled')
  } else if (!enabled && champSelectPhaseUnsub) {
    champSelectPhaseUnsub?.()
    champSelectPhaseUnsub = null
    if (champSelectUpdateUnsub) { champSelectUpdateUnsub(); champSelectUpdateUnsub = null }
    unregisterTierInjection()
    log('Champ select stats disabled')
  }
}

// ==================== 插件入口 ====================
let penguContext = null

export function init(context) {
  penguContext = context
  log('Plugin initializing...')
}

export async function load() {
  log('Plugin loading...')
  await loadSettings()
  watchSettings()
  startObserver()
  if (pluginSettings.showLobbyStats) {
    updateLobbyStats(true, penguContext)
  }
  if (pluginSettings.showTeammateWinrate) {
    updateChampSelectStats(true, penguContext)
  }
  log('Plugin loaded, settings:', pluginSettings)
}
