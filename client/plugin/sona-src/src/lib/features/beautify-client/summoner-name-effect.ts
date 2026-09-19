import { logger } from '@/index'
import { deobfuscateChampSelectPuuid } from '@/lib/champ-select-puuid'
import { injector } from '@/lib/InjectorManager'
import { lcu, LcuEventUri } from '@/lib/lcu'
import type { ChampSelectSession, ChatFriend, GameflowPhase, LCUEventMessage, Lobby } from '@/lib/lcu'
import type { SonaConfig } from '@/lib/store'
import {
  clearNameGradientFromStatusMessage,
  decodeSonaStatusPayload,
  writeNameGradientToStatusMessage,
  type SummonerNameGradientEffect,
} from '@/lib/features/beautify-client/avatar-status-sync'

const PROFILE_NAME_SELECTOR = 'span.player-name__game-name'
const CHAMP_SELECT_NAME_SELECTOR = '.party.visible .summoner-wrapper.visible .player-name-wrapper'
const FRIEND_NAME_SELECTORS = [
  '.lol-social-lower-pane-container lol-social-roster-member .member-name',
  '.lol-social-lower-pane-container [class*="lol-social-roster-member"] .member-name',
]
const FRIEND_NAME_SELECTOR = FRIEND_NAME_SELECTORS.join(', ')
const PLAYER_NAME_SELECTORS = [PROFILE_NAME_SELECTOR, CHAMP_SELECT_NAME_SELECTOR, ...FRIEND_NAME_SELECTORS]
const PLAYER_NAME_SELECTOR = PLAYER_NAME_SELECTORS.join(', ')
const FRIENDS_URI = '/lol-chat/v1/friends'
const EFFECT_ATTR = 'data-sona-name-gradient'
const STYLE_ID = 'sona-summoner-name-effect-style'
const START_COLOR_VAR = '--sona-name-gradient-start'
const END_COLOR_VAR = '--sona-name-gradient-end'
const ANGLE_VAR = '--sona-name-gradient-angle'

type SummonerNameEffectConfig = SonaConfig['beautifySummonerNameEffect']

interface ChampSelectPlayerIdentity {
  isSelf: boolean
  puuid: string
  summonerId: string
  names: string[]
}

let config: SummonerNameEffectConfig = {
  enabled: false,
  startColor: '#c8aa6e',
  endColor: '#4a9eff',
  angle: 90,
}
let registered = false
let ownPuuid = ''
let ownSummonerId = ''
let ownNames = new Set<string>()
let effectsByPuuid = new Map<string, SummonerNameGradientEffect>()
let effectsBySummonerId = new Map<string, SummonerNameGradientEffect>()
let effectsByFriendId = new Map<string, SummonerNameGradientEffect>()
let effectsByName = new Map<string, SummonerNameGradientEffect>()
let champSelectPlayersByCellId = new Map<string, ChampSelectPlayerIdentity>()
let champSelectMyTeamOrder: ChampSelectPlayerIdentity[] = []
let champSelectTheirTeamOrder: ChampSelectPlayerIdentity[] = []
let lobbyPlayersByName = new Map<string, ChampSelectPlayerIdentity>()
let friendsUnsub: (() => void) | null = null
let ownStatusUnsub: (() => void) | null = null
let champSelectUnsub: (() => void) | null = null
let lobbyUnsub: (() => void) | null = null
let gameflowUnsub: (() => void) | null = null
let friendRefreshTimer: number | null = null
let lobbyRefreshTimer: number | null = null
let statusSyncTimer: number | null = null
let ownIdentityRetryTimer: number | null = null
let startupProbeTimer: number | null = null
let friendRefreshPromise: Promise<void> | null = null
let lobbyRefreshPromise: Promise<void> | null = null
let statusSyncPromise: Promise<void> | null = null
let ownIdentityPromise: Promise<void> | null = null
let identityMutationObserver: MutationObserver | null = null
let identityMutationFrame: number | null = null
let ownIdentityAttempt = 0
let startupProbeAttempt = 0
let lastDomScanSignature = ''
let lastChampSelectSignature = ''
let lastLobbySignature = ''
const styledElements = new Set<HTMLElement>()

function normalize(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase()
}

function normalizeId(value: string | number | null | undefined): string {
  const normalized = String(value ?? '').trim()
  return normalized && normalized !== '0' ? normalized : ''
}

function normalizeCellId(value: string | number | null | undefined): string {
  const normalized = String(value ?? '').trim()
  return /^\d+$/.test(normalized) ? normalized : ''
}

function getEffectSelector(): string {
  return PLAYER_NAME_SELECTORS.map((selector) => `${selector}[${EFFECT_ATTR}]`).join(',\n')
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function normalizeColor(value: string, fallback: string): string {
  const color = value.trim().toLowerCase()
  return /^#[0-9a-f]{6}$/.test(color) ? color : fallback
}

function getOwnEffect(): SummonerNameGradientEffect | null {
  if (!config.enabled) return null
  return {
    startColor: normalizeColor(config.startColor, '#c8aa6e'),
    endColor: normalizeColor(config.endColor, '#4a9eff'),
    angle: clamp(Math.round(Number(config.angle) || 0), 0, 360),
  }
}

function effectsEqual(
  left: SummonerNameGradientEffect | null | undefined,
  right: SummonerNameGradientEffect | null | undefined,
): boolean {
  if (!left || !right) return !left && !right
  return left.startColor === right.startColor
    && left.endColor === right.endColor
    && left.angle === right.angle
}

function ensureEffectStyle() {
  let style = document.getElementById(STYLE_ID)
  if (style) return

  style = document.createElement('style')
  style.id = STYLE_ID

  style.textContent = `
    ${getEffectSelector()} {
      background-image: linear-gradient(
        var(${ANGLE_VAR}, 90deg),
        var(${START_COLOR_VAR}, #c8aa6e) 0%,
        var(${END_COLOR_VAR}, #4a9eff) 50%,
        var(${START_COLOR_VAR}, #c8aa6e) 100%
      ) !important;
      background-size: 200% 100% !important;
      background-repeat: repeat !important;
      background-clip: text !important;
      -webkit-background-clip: text !important;
      color: transparent !important;
      -webkit-text-fill-color: transparent !important;
      animation: sona-name-water-flow 3.6s linear infinite;
      will-change: background-position;
    }

    @keyframes sona-name-water-flow {
      from { background-position: 200% center; }
      to { background-position: 0% center; }
    }
  `
  document.head.appendChild(style)
  logger.debug('[NameEffect] Effect stylesheet attached to document.head')
}

function getComposedAttribute(element: Element, attributeNames: string[]): string {
  let current: Element | null = element

  while (current) {
    for (const attributeName of attributeNames) {
      const value = current.getAttribute(attributeName)
      if (value) return value
    }

    if (current.parentElement) {
      current = current.parentElement
      continue
    }
    const root = current.getRootNode()
    current = root instanceof ShadowRoot ? root.host : null
  }

  return ''
}

function getElementPuuid(element: Element): string {
  return normalize(getComposedAttribute(element, ['puuid', 'data-puuid']))
}

function getElementSummonerId(element: Element): string {
  return normalizeId(getComposedAttribute(element, [
    'summoner-id',
    'data-summoner-id',
    'summonerid',
    'data-summonerid',
  ]))
}

function getElementCellId(element: Element): string {
  return normalizeCellId(getComposedAttribute(element, [
    'cell-id',
    'data-cell-id',
    'cellid',
    'data-cellid',
  ]))
}

function getElementSlotId(element: Element): string {
  return normalizeCellId(getComposedAttribute(element, [
    'slot-id',
    'data-slot-id',
  ]))
}

function getChampSelectIdentityByDomOrder(element: Element): ChampSelectPlayerIdentity | null {
  const wrapper = element.closest('.summoner-wrapper.visible')
  const isTheirTeam = Boolean(wrapper?.classList.contains('right'))
  const orderedPlayers = isTheirTeam ? champSelectTheirTeamOrder : champSelectMyTeamOrder

  if (wrapper) {
    const side = isTheirTeam ? 'right' : 'left'
    const wrappers = Array.from(document.querySelectorAll(`.party.visible .summoner-wrapper.visible.${side}`))
    const index = wrappers.indexOf(wrapper)
    if (index >= 0) return orderedPlayers[index] ?? null
  }

  const slotId = getElementSlotId(element)
  return slotId ? orderedPlayers[Number(slotId)] ?? null : null
}

function getChampSelectIdentityForElement(element: Element): ChampSelectPlayerIdentity | null {
  // Ember 会复用节点并留下旧属性；当前 Session 与 DOM 左右楼层顺序才是最高优先级。
  const orderedIdentity = getChampSelectIdentityByDomOrder(element)
  if (orderedIdentity) return orderedIdentity

  const cellId = getElementCellId(element)
  return cellId ? champSelectPlayersByCellId.get(cellId) ?? null : null
}

function getEffectForIdentity(identity: ChampSelectPlayerIdentity): SummonerNameGradientEffect | null {
  if (identity.isSelf || (identity.puuid && identity.puuid === ownPuuid)
    || (identity.summonerId && identity.summonerId === ownSummonerId)) {
    return getOwnEffect()
  }

  if (identity.puuid) {
    const effect = effectsByPuuid.get(identity.puuid)
    if (effect) return effect
  }
  if (identity.summonerId) {
    const effect = effectsBySummonerId.get(identity.summonerId)
    if (effect) return effect
  }
  for (const name of identity.names) {
    const effect = effectsByName.get(name)
    if (effect) return effect
  }
  return null
}

function getFriendEffectForElement(element: HTMLElement): SummonerNameGradientEffect | null {
  const member = element.closest('lol-social-roster-member, [class*="lol-social-roster-member"]')
  if (!member) return null

  const friendIdAttributes = ['data-friend-id', 'friend-id', 'data-id', 'id']
  for (const attributeName of friendIdAttributes) {
    const friendId = normalize(member.getAttribute(attributeName))
    if (!friendId) continue

    const directEffect = effectsByFriendId.get(friendId)
    if (directEffect) return directEffect

    const puuidFromChatId = friendId.endsWith('@pvp.net') ? friendId.slice(0, -'@pvp.net'.length) : ''
    if (puuidFromChatId) {
      const puuidEffect = effectsByPuuid.get(puuidFromChatId)
      if (puuidEffect) return puuidEffect
    }
  }

  const puuid = getElementPuuid(member)
  if (puuid) {
    const effect = effectsByPuuid.get(puuid)
    if (effect) return effect
  }

  const summonerId = getElementSummonerId(member)
  if (summonerId) {
    const effect = effectsBySummonerId.get(summonerId)
    if (effect) return effect
  }

  // 好友栏稳定展示 gameName；与开黑好友分组使用同一套 DOM 名字匹配兜底。
  const memberName = normalize(element.textContent)
  return memberName ? effectsByName.get(memberName) ?? null : null
}

function getEffectForElement(element: HTMLElement): SummonerNameGradientEffect | null {
  if (element.matches(CHAMP_SELECT_NAME_SELECTOR)) {
    const identity = getChampSelectIdentityForElement(element)
    // 选人阶段禁止继续按节点旧属性/旧文本猜身份，避免 Ember 复用后把好友特效串给陌生人。
    return identity ? getEffectForIdentity(identity) : null
  }

  if (element.matches(FRIEND_NAME_SELECTOR)) {
    return getFriendEffectForElement(element)
  }

  const puuid = getElementPuuid(element)
  if (puuid) {
    if (puuid === ownPuuid) return getOwnEffect()
    const effect = effectsByPuuid.get(puuid)
    if (effect) return effect
  }

  const summonerId = getElementSummonerId(element)
  if (summonerId) {
    if (summonerId === ownSummonerId) return getOwnEffect()
    const effect = effectsBySummonerId.get(summonerId)
    if (effect) return effect
  }

  const name = normalize(element.textContent)
  if (!name) return null
  if (ownNames.has(name)) return getOwnEffect()
  const lobbyIdentity = lobbyPlayersByName.get(name)
  if (lobbyIdentity) {
    const effect = getEffectForIdentity(lobbyIdentity)
    if (effect) return effect
  }
  return effectsByName.get(name) ?? null
}

function clearElementEffect(element: HTMLElement) {
  element.removeAttribute(EFFECT_ATTR)
  element.style.removeProperty(START_COLOR_VAR)
  element.style.removeProperty(END_COLOR_VAR)
  element.style.removeProperty(ANGLE_VAR)
  styledElements.delete(element)
}

function applyElementEffect(element: HTMLElement, effect: SummonerNameGradientEffect) {
  element.setAttribute(EFFECT_ATTR, 'true')
  element.style.setProperty(START_COLOR_VAR, effect.startColor)
  element.style.setProperty(END_COLOR_VAR, effect.endColor)
  element.style.setProperty(ANGLE_VAR, `${effect.angle}deg`)
  styledElements.add(element)
}

function tryApplySummonerNameEffects(): boolean {
  ensureEffectStyle()
  const elements = document.querySelectorAll<HTMLElement>(PLAYER_NAME_SELECTOR)
  let appliedCount = 0

  elements.forEach((element) => {
    const effect = getEffectForElement(element)
    if (effect) {
      applyElementEffect(element, effect)
      appliedCount++
    }
    else if (styledElements.has(element) || element.hasAttribute(EFFECT_ATTR)) clearElementEffect(element)
  })

  Array.from(styledElements).forEach((element) => {
    if (!element.isConnected) styledElements.delete(element)
    else if (!element.matches(PLAYER_NAME_SELECTOR)) clearElementEffect(element)
  })

  const profileNameCount = document.querySelectorAll(PROFILE_NAME_SELECTOR).length
  const champSelectNameCount = document.querySelectorAll(CHAMP_SELECT_NAME_SELECTOR).length
  const friendNameCount = document.querySelectorAll(FRIEND_NAME_SELECTOR).length
  const scanSignature = [
    config.enabled,
    profileNameCount,
    champSelectNameCount,
    appliedCount,
    Boolean(ownPuuid),
    Boolean(ownSummonerId),
    effectsByPuuid.size,
    effectsBySummonerId.size,
    effectsByFriendId.size,
    champSelectPlayersByCellId.size,
    lobbyPlayersByName.size,
    friendNameCount,
  ].join(':')
  if (scanSignature !== lastDomScanSignature) {
    lastDomScanSignature = scanSignature
    logger.debug(
      '[NameEffect] DOM scan: enabled=%s profileTargets=%d champSelectTargets=%d friendTargets=%d applied=%d ownIdentity=%s remotePuuids=%d remoteSummonerIds=%d remoteFriendIds=%d champSelectPlayers=%d lobbyNames=%d',
      config.enabled,
      profileNameCount,
      champSelectNameCount,
      friendNameCount,
      appliedCount,
      ownPuuid && ownSummonerId ? 'ready' : 'waiting',
      effectsByPuuid.size,
      effectsBySummonerId.size,
      effectsByFriendId.size,
      champSelectPlayersByCellId.size,
      lobbyPlayersByName.size,
    )
  }
  return elements.length > 0
}

function indexFriendEffect(friend: ChatFriend, effect: SummonerNameGradientEffect) {
  const friendId = normalize(friend.id)
  if (friendId) effectsByFriendId.set(friendId, effect)

  const puuid = normalize(friend.puuid)
  if (puuid) effectsByPuuid.set(puuid, effect)

  const summonerId = normalizeId(friend.summonerId)
  if (summonerId) effectsBySummonerId.set(summonerId, effect)

  ;[
    friend.gameName,
    friend.name,
    friend.gameName && friend.gameTag ? `${friend.gameName}#${friend.gameTag}` : '',
  ].forEach((name) => {
    const key = normalize(name)
    if (key) effectsByName.set(key, effect)
  })
}

async function refreshFriendEffects() {
  if (friendRefreshPromise) return friendRefreshPromise

  friendRefreshPromise = lcu.getFriends()
    .then((friends) => {
      const nextByPuuid = new Map<string, SummonerNameGradientEffect>()
      const nextBySummonerId = new Map<string, SummonerNameGradientEffect>()
      const nextByFriendId = new Map<string, SummonerNameGradientEffect>()
      const nextByName = new Map<string, SummonerNameGradientEffect>()
      effectsByPuuid = nextByPuuid
      effectsBySummonerId = nextBySummonerId
      effectsByFriendId = nextByFriendId
      effectsByName = nextByName

      let sharedEffectCount = 0
      friends.forEach((friend) => {
        const effect = decodeSonaStatusPayload(friend.statusMessage)?.nameGradient
        if (effect) {
          indexFriendEffect(friend, effect)
          sharedEffectCount++
        }
      })
      logger.debug(
        '[NameEffect] Friend payload refresh: friends=%d effects=%d puuids=%d summonerIds=%d friendIds=%d names=%d',
        friends.length,
        sharedEffectCount,
        effectsByPuuid.size,
        effectsBySummonerId.size,
        effectsByFriendId.size,
        effectsByName.size,
      )
      tryApplySummonerNameEffects()
    })
    .catch((error) => {
      logger.debug('[NameEffect] Friend payload refresh not ready; retrying:', error)
      scheduleFriendRefresh(1500)
    })
    .finally(() => {
      friendRefreshPromise = null
    })

  return friendRefreshPromise
}

function updateLobbyPlayers(lobby: Lobby | null) {
  const nextByName = new Map<string, ChampSelectPlayerIdentity>()

  for (const member of lobby?.members ?? []) {
    const identity: ChampSelectPlayerIdentity = {
      isSelf: normalize(member.puuid) === ownPuuid
        || normalizeId(member.summonerId) === ownSummonerId,
      puuid: normalize(member.puuid),
      summonerId: normalizeId(member.summonerId),
      names: [member.summonerName, member.summonerInternalName]
        .map(normalize)
        .filter(Boolean),
    }
    identity.names.forEach((name) => nextByName.set(name, identity))
  }

  lobbyPlayersByName = nextByName
  const signature = lobby
    ? `${lobby.partyId}:${lobby.members.map((member) => member.puuid || member.summonerId).join('|')}`
    : 'none'
  if (signature !== lastLobbySignature) {
    lastLobbySignature = signature
    logger.debug(
      '[NameEffect] Lobby identities: lobby=%s members=%d namedIndexes=%d',
      lobby ? 'ready' : 'none',
      lobby?.members.length ?? 0,
      nextByName.size,
    )
  }
  tryApplySummonerNameEffects()
}

function refreshLobbyPlayers(): Promise<void> {
  if (lobbyRefreshPromise) return lobbyRefreshPromise

  lobbyRefreshPromise = lcu.getLobby()
    .then(updateLobbyPlayers)
    .catch(() => updateLobbyPlayers(null))
    .finally(() => {
      lobbyRefreshPromise = null
    })
  return lobbyRefreshPromise
}

function scheduleLobbyRefresh(delay = 100) {
  if (lobbyRefreshTimer != null) window.clearTimeout(lobbyRefreshTimer)
  lobbyRefreshTimer = window.setTimeout(() => {
    lobbyRefreshTimer = null
    void refreshLobbyPlayers()
  }, delay)
}

function handleLobbyUpdate(event: LCUEventMessage) {
  if (event.eventType === 'Delete') {
    updateLobbyPlayers(null)
    return
  }

  const lobby = event.data as Lobby | null
  if (lobby?.members) updateLobbyPlayers(lobby)
  else scheduleLobbyRefresh()
}

function handleGameflowPhaseUpdate(event: LCUEventMessage) {
  const phase = event.data as GameflowPhase
  logger.debug('[NameEffect] Gameflow phase changed: %s', phase)
  if (phase === 'Lobby' || phase === 'Matchmaking' || phase === 'ReadyCheck') {
    scheduleLobbyRefresh(0)
  }
  if (phase === 'ChampSelect') {
    void lcu.getChampSelectSession()
      .then(updateChampSelectSession)
      .catch(() => updateChampSelectSession(null))
  } else if (phase === 'None' || phase === 'EndOfGame' || phase === 'PreEndOfGame') {
    updateChampSelectSession(null)
  }
}

function updateChampSelectSession(session: ChampSelectSession | null) {
  const nextByCellId = new Map<string, ChampSelectPlayerIdentity>()
  let nextMyTeamOrder: ChampSelectPlayerIdentity[] = []
  let nextTheirTeamOrder: ChampSelectPlayerIdentity[] = []

  if (session) {
    const toIdentity = (player: ChampSelectSession['myTeam'][number]): ChampSelectPlayerIdentity => {
      const gameName = normalize(player.gameName)
      const riotId = normalize(player.gameName && player.tagLine
        ? `${player.gameName}#${player.tagLine}`
        : '')
      const resolvedPuuid = player.puuid
        || (player.nameVisibilityType === 'HIDDEN'
          ? deobfuscateChampSelectPuuid(player.obfuscatedPuuid)
          : '')
      return {
        isSelf: player.cellId === session.localPlayerCellId,
        puuid: normalize(resolvedPuuid),
        summonerId: normalizeId(player.summonerId),
        names: [gameName, riotId].filter(Boolean),
      }
    }

    nextMyTeamOrder = session.myTeam.map(toIdentity)
    nextTheirTeamOrder = session.theirTeam.map(toIdentity)
    ;[...session.myTeam, ...session.theirTeam].forEach((player) => {
      const cellId = normalizeCellId(player.cellId)
      if (!cellId) return
      nextByCellId.set(cellId, toIdentity(player))
    })
  }

  champSelectPlayersByCellId = nextByCellId
  champSelectMyTeamOrder = nextMyTeamOrder
  champSelectTheirTeamOrder = nextTheirTeamOrder
  const orderSignature = [...nextMyTeamOrder, ...nextTheirTeamOrder]
    .map((player) => player.puuid || player.summonerId || player.names[0] || '-')
    .join('|')
  const signature = session
    ? `${session.gameId}:${session.localPlayerCellId}:${orderSignature}`
    : 'none'
  if (signature !== lastChampSelectSignature) {
    lastChampSelectSignature = signature
    logger.debug(
      '[NameEffect] Champ-select identities: session=%s localCellId=%s players=%d',
      session ? 'ready' : 'none',
      session?.localPlayerCellId ?? '-',
      nextByCellId.size,
    )
  }
  tryApplySummonerNameEffects()
}

function handleChampSelectUpdate(event: LCUEventMessage) {
  if (event.eventType === 'Create' || event.eventType === 'Update') {
    updateChampSelectSession(event.data as ChampSelectSession)
  } else if (event.eventType === 'Delete') {
    updateChampSelectSession(null)
  }
}

function scheduleFriendRefresh(delay = 200) {
  if (friendRefreshTimer != null) window.clearTimeout(friendRefreshTimer)
  friendRefreshTimer = window.setTimeout(() => {
    friendRefreshTimer = null
    void refreshFriendEffects()
  }, delay)
}

function scheduleOwnIdentityRetry() {
  if (ownIdentityRetryTimer != null) return
  const delay = Math.min(500 * (2 ** Math.max(ownIdentityAttempt - 1, 0)), 5000)
  logger.debug('[NameEffect] Own identity not ready; retry scheduled in %dms', delay)
  ownIdentityRetryTimer = window.setTimeout(() => {
    ownIdentityRetryTimer = null
    void loadOwnIdentity()
  }, delay)
}

function loadOwnIdentity(): Promise<void> {
  if (ownIdentityPromise) return ownIdentityPromise

  const attempt = ++ownIdentityAttempt
  logger.debug('[NameEffect] Loading own identity (attempt %d)', attempt)
  ownIdentityPromise = lcu.getSummonerInfo()
    .then((summoner) => {
      const nextPuuid = normalize(summoner.puuid)
      const nextSummonerId = normalizeId(summoner.summonerId)
      const nextNames = new Set([
        summoner.gameName,
        summoner.displayName,
        summoner.internalName,
        summoner.gameName && summoner.tagLine ? `${summoner.gameName}#${summoner.tagLine}` : '',
      ]
        .map(normalize)
        .filter(Boolean))
      if (!nextPuuid || nextNames.size === 0) {
        throw new Error('LCU returned an incomplete current-summoner response')
      }

      ownPuuid = nextPuuid
      ownSummonerId = nextSummonerId
      ownNames = nextNames
      ownIdentityAttempt = 0
      logger.info(
        '[NameEffect] Own identity ready: summonerId=%s names=%d',
        ownSummonerId || 'missing',
        ownNames.size,
      )
      tryApplySummonerNameEffects()
    })
    .catch((error) => {
      logger.debug('[NameEffect] Own identity request failed during client startup:', error)
      scheduleOwnIdentityRetry()
    })
    .finally(() => {
      ownIdentityPromise = null
    })

  return ownIdentityPromise
}

async function syncOwnStatusPayload() {
  if (statusSyncPromise) return statusSyncPromise

  statusSyncPromise = (async () => {
    const effect = getOwnEffect()
    const chatMe = await lcu.getChatMe()
    const currentEffect = decodeSonaStatusPayload(chatMe.statusMessage)?.nameGradient
    if (effectsEqual(effect, currentEffect)) {
      logger.debug('[NameEffect] Status payload already synchronized: %s', effect ? 'enabled' : 'disabled')
      return
    }

    if (effect) await writeNameGradientToStatusMessage(effect)
    else await clearNameGradientFromStatusMessage()
    logger.info('[NameEffect] Status payload updated: %s', effect ? 'enabled' : 'disabled')
  })()
    .catch((error) => {
      logger.debug('[NameEffect] Status payload sync not ready; retrying:', error)
      scheduleStatusSync(1500)
    })
    .finally(() => {
      statusSyncPromise = null
    })

  return statusSyncPromise
}

function scheduleStatusSync(delay = 250) {
  if (statusSyncTimer != null) window.clearTimeout(statusSyncTimer)
  statusSyncTimer = window.setTimeout(() => {
    statusSyncTimer = null
    void syncOwnStatusPayload()
  }, delay)
}

function scheduleIdentityMutationScan() {
  if (identityMutationFrame != null) return
  identityMutationFrame = window.requestAnimationFrame(() => {
    identityMutationFrame = null
    tryApplySummonerNameEffects()
  })
}

function startIdentityMutationObserver() {
  if (identityMutationObserver) return

  identityMutationObserver = new MutationObserver((mutations) => {
    const shouldScan = mutations.some((mutation) => {
      if (mutation.type === 'attributes') {
        if (mutation.attributeName !== 'class') return true

        const target = mutation.target
        return target instanceof Element && (
          target.matches('.party, .summoner-wrapper, .player-name-wrapper, lol-social-roster-member')
          || Boolean(target.closest('.summoner-wrapper, lol-social-roster-member, [class*="lol-social-roster-member"]'))
        )
      }

      const parent = mutation.target.parentElement
      return Boolean(parent?.closest(PLAYER_NAME_SELECTOR))
    })
    if (shouldScan) scheduleIdentityMutationScan()
  })
  identityMutationObserver.observe(document.body, {
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: [
      'puuid',
      'data-puuid',
      'summoner-id',
      'data-summoner-id',
      'summonerid',
      'data-summonerid',
      'cell-id',
      'data-cell-id',
      'cellid',
      'data-cellid',
      'slot-id',
      'data-slot-id',
      'friend-id',
      'data-friend-id',
      'data-id',
      'class',
    ],
  })
  logger.debug('[NameEffect] Identity mutation observer attached')
}

function scheduleStartupProbe() {
  if (startupProbeTimer != null || startupProbeAttempt >= 15) return
  const delay = startupProbeAttempt < 2 ? 500 : 2000
  startupProbeTimer = window.setTimeout(() => {
    startupProbeTimer = null
    startupProbeAttempt++
    const foundTargets = tryApplySummonerNameEffects()
    logger.debug(
      '[NameEffect] Startup probe %d/15: targets=%s styled=%d identity=%s',
      startupProbeAttempt,
      foundTargets ? 'found' : 'missing',
      styledElements.size,
      ownPuuid ? 'ready' : 'waiting',
    )
    scheduleStartupProbe()
  }, delay)
}

export function initSummonerNameEffect() {
  if (registered) return
  registered = true
  logger.info('[NameEffect] Initializing name effects')
  injector.register(tryApplySummonerNameEffects)
  startIdentityMutationObserver()
  friendsUnsub = lcu.observe(FRIENDS_URI, () => scheduleFriendRefresh())
  ownStatusUnsub = lcu.observe(LcuEventUri.CHAT_ME, () => {
    if (!ownPuuid || !ownSummonerId) void loadOwnIdentity()
    scheduleStatusSync(100)
  })
  champSelectUnsub = lcu.observe(LcuEventUri.CHAMP_SELECT, handleChampSelectUpdate)
  lobbyUnsub = lcu.observe(LcuEventUri.LOBBY, handleLobbyUpdate)
  gameflowUnsub = lcu.observe(LcuEventUri.GAMEFLOW_PHASE_CHANGE, handleGameflowPhaseUpdate)
  void loadOwnIdentity()
  void refreshFriendEffects()
  void refreshLobbyPlayers()
  void lcu.getChampSelectSession()
    .then(updateChampSelectSession)
    .catch(() => updateChampSelectSession(null))
  scheduleStatusSync(0)
  scheduleStartupProbe()
}

export function updateSummonerNameEffect(nextConfig: SummonerNameEffectConfig) {
  config = {
    enabled: Boolean(nextConfig.enabled),
    startColor: normalizeColor(nextConfig.startColor, '#c8aa6e'),
    endColor: normalizeColor(nextConfig.endColor, '#4a9eff'),
    angle: clamp(Math.round(Number(nextConfig.angle) || 0), 0, 360),
  }
  logger.debug(
    '[NameEffect] Config updated: enabled=%s colors=%s,%s angle=%d',
    config.enabled,
    config.startColor,
    config.endColor,
    config.angle,
  )
  if (!ownPuuid || !ownSummonerId) void loadOwnIdentity()
  tryApplySummonerNameEffects()
  scheduleStatusSync()
}
