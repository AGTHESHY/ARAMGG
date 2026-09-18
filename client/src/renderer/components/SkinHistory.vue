<template>
  <div class="skin-history">
    <div class="random-section">
      <p class="section-desc">随机选择皮肤或炫彩，需要在选人阶段使用。</p>

      <!-- Settings row -->
      <div class="settings-row">
        <div class="settings-group">
          <span class="settings-label">范围</span>
          <div class="radio-group">
            <label class="radio-item">
              <input
                v-model="randomSettings.scope"
                type="radio"
                value="owned"
                @change="saveSettings"
              />
              <span>仅已拥有</span>
            </label>
            <label class="radio-item">
              <input
                v-model="randomSettings.scope"
                type="radio"
                value="all"
                @change="saveSettings"
              />
              <span>全部皮肤</span>
            </label>
          </div>
        </div>
        <div class="settings-group">
          <span class="settings-label">英雄</span>
          <div class="radio-group">
            <label class="radio-item">
              <input
                v-model="randomSettings.championFilter"
                type="radio"
                value="current"
                @change="saveSettings"
              />
              <span>当前英雄</span>
            </label>
            <label class="radio-item">
              <input
                v-model="randomSettings.championFilter"
                type="radio"
                value="any"
                @change="saveSettings"
              />
              <span>任意英雄</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Random buttons -->
      <div class="random-buttons">
        <button
          class="random-button"
          type="button"
          :disabled="randomizing"
          @click="randomSelectSkin"
        >
          <RefreshCw class="random-icon" :class="{ spinning: randomizing }" />
          <span>{{ randomizing ? '随机中...' : '随机皮肤' }}</span>
        </button>
        <button
          class="random-button"
          type="button"
          :disabled="randomizing"
          @click="randomSelectChroma"
        >
 <RefreshCw class="random-icon" :class="{ spinning: randomizing }" />
          <span>{{ randomizing ? '随机中...' : '随机炫彩' }}</span>
        </button>
      </div>

      <div v-if="randomStatus" class="random-status" :class="{ success: randomStatus.includes('已设置') || randomStatus.includes('已替换') }">
        {{ randomStatus }}
      </div>
      <div v-if="lastRandomSkin" class="last-random-display">
        <img
          v-if="lastRandomSkin.imageUrl"
          :src="lastRandomSkin.imageUrl"
          :alt="lastRandomSkin.skinName"
          class="last-random-image"
          @error="onImgError"
        />
        <div class="last-random-info">
          <strong>{{ lastRandomSkin.skinName }}</strong>
          <small>
            {{ lastRandomSkin.championName }}
            <span v-if="lastRandomSkin.chromaId" class="chroma-badge">炫彩 #{{ lastRandomSkin.chromaId }}</span>
          </small>
        </div>
      </div>
    </div>

    <div class="history-section">
      <div class="history-header">
        <h5>历史选择</h5>
        <button
          v-if="history.length > 0"
          class="clear-history"
          type="button"
          @click="clearHistory"
        >
          清除
        </button>
      </div>
      <div v-if="history.length === 0" class="history-empty">
        <span>暂无历史记录</span>
      </div>
      <div v-else class="history-list">
        <div
          v-for="item in history"
          :key="item.skinId + '-' + (item.chromaId ?? 0)"
          class="history-item"
        >
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            :alt="item.skinName"
            class="history-image"
            loading="lazy"
            @error="onImgError"
          />
          <div class="history-info">
            <div class="history-name-row">
              <strong>{{ item.skinName }}</strong>
              <span v-if="item.chromaId" class="chroma-badge">炫彩</span>
              <span class="source-badge" :class="'source-' + item.source">{{ sourceLabel(item.source) }}</span>
            </div>
            <small>{{ item.championName }}</small>
            <span class="history-time">{{ formatTime(item.timestamp) }}</span>
          </div>
          <button
            class="history-resel"
            type="button"
            @click="reselectSkin(item)"
          >
            重新选择
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { RefreshCw } from 'lucide-vue-next'
import { electronAPI } from '../native/electron-api.ts'
import type { SkinHistoryEntry, SkinRandomSettings, SkinChromaData } from '../../shared/ipc-contract.ts'

type HistoryItem = SkinHistoryEntry

interface RandomSkinCandidate {
  skinId: number
  championId: number
  skinName: string
  chromas: SkinChromaData[]
  isOwned: boolean
}

const ownedSkinIds = ref<number[]>([])
const champions = ref<Map<number, { name: string; alias: string }>>(new Map())
const history = ref<HistoryItem[]>([])
const randomizing = ref(false)
const randomStatus = ref('')
const lastRandomSkin = ref<HistoryItem | null>(null)

const STORAGE_KEY = 'skinHistory'
const SETTINGS_KEY = 'skinRandomSettings'
const HISTORY_LIMIT = 30

const randomSettings = reactive<SkinRandomSettings>({
  mode: 'skin',
  scope: 'owned',
  championFilter: 'any',
})

const getSkinImageUrl = (skinId: number, championId: number, alias: string): string => {
  const skinNum = skinId - championId * 1000
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${alias}_${skinNum}.jpg`
}

const formatTime = (ts: number): string => {
  const date = new Date(ts)
  const now = Date.now()
  const diff = now - ts
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  return date.toLocaleDateString('zh-CN')
}

const sourceLabel = (source: string): string => {
  switch (source) {
    case 'random': return '随机'
    case 'local': return '本地'
    default: return '手动'
  }
}

const onImgError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.style.opacity = '0.25'
}

const loadData = async () => {
  try {
    const [champResult, skinsResult] = await Promise.all([
      electronAPI.lcu.getChampionList(),
      electronAPI.lcu.getOwnedSkins(),
    ])

    if (champResult.success && champResult.champions) {
      const map = new Map<number, { name: string; alias: string }>()
      for (const c of champResult.champions) {
        map.set(c.id, { name: c.name, alias: c.alias })
      }
      champions.value = map
    }

    if (skinsResult.success && skinsResult.skinIds) {
      ownedSkinIds.value = skinsResult.skinIds
    }
  } catch {
    // silent
  }
}

const loadHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as HistoryItem[]
      history.value = parsed
    }
  } catch {
    history.value = []
  }
}

const saveHistory = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
  } catch {
    // silent
  }
}

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SkinRandomSettings>
      if (parsed.scope) randomSettings.scope = parsed.scope
      if (parsed.championFilter) randomSettings.championFilter = parsed.championFilter
      if (parsed.mode) randomSettings.mode = parsed.mode
    }
  } catch {
    // silent
  }
}

const saveSettings = () => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(randomSettings))
  } catch {
    // silent
  }
}

const addToHistory = (
  skinId: number,
  championId: number,
  skinName: string,
  source: 'manual' | 'random' | 'local',
  chromaId?: number,
) => {
  const champ = champions.value.get(championId)
  if (!champ) return

  const item: HistoryItem = {
    skinId,
    chromaId,
    skinName,
    championName: champ.name,
    championAlias: champ.alias,
    championId,
    imageUrl: getSkinImageUrl(skinId, championId, champ.alias),
    timestamp: Date.now(),
    source,
  }

  history.value = [
    item,
    ...history.value.filter(
      (h) => !(h.skinId === skinId && h.chromaId === chromaId),
    ),
  ].slice(0, HISTORY_LIMIT)
  saveHistory()
}

/**
 * Build the pool of candidate skins based on the current random settings.
 * For the "any champion" scope, a limited number of random champions are
 * tried to avoid excessive API calls.
 */
const getRandomCandidate = async (
  requireChromas: boolean,
): Promise<RandomSkinCandidate | null> => {
  const { scope, championFilter } = randomSettings

  // Determine champion IDs to consider
  let championIds: number[]

  if (championFilter === 'current') {
    const champResult = await electronAPI.lcu.getChampionId()
    if (!champResult.success || !champResult.championId) return null
    championIds = [champResult.championId]
  } else {
    // any champion
    if (scope === 'owned') {
      championIds = [...new Set(ownedSkinIds.value.map((id) => Math.floor(id / 1000)))]
    } else {
      championIds = [...champions.value.keys()]
    }
  }

  if (championIds.length === 0) return null

  // For "owned" + "any", pick a random owned skin and resolve its details
  if (scope === 'owned' && championFilter === 'any') {
    const shuffled = [...championIds].sort(() => Math.random() - 0.5)
    for (const champId of shuffled) {
      const ownedForChamp = ownedSkinIds.value.filter(
        (id) => Math.floor(id / 1000) === champId,
      )
      if (ownedForChamp.length === 0) continue

      // Fetch skins to get names and chromas
      const skinsResult = await electronAPI.lcu.getChampionSkins(champId)
      if (!skinsResult.success || !skinsResult.data) continue

      const available = skinsResult.data.skins.filter(
        (s) =>
          ownedForChamp.includes(s.skinId) &&
          (!requireChromas || (s.chromas && s.chromas.length > 0)),
      )

      if (available.length > 0) {
        const skin = available[Math.floor(Math.random() * available.length)]
        return {
          skinId: skin.skinId,
          championId: champId,
          skinName: skin.skinName,
          chromas: skin.chromas ?? [],
          isOwned: true,
        }
      }
    }
    return null
  }

  // For "current champion" or "all skins", fetch skins for champion(s)
  const shuffledIds = [...championIds].sort(() => Math.random() - 0.5)
  const maxAttempts = Math.min(shuffledIds.length, 10)

  for (let i = 0; i < maxAttempts; i++) {
    const champId = shuffledIds[i]
    const skinsResult = await electronAPI.lcu.getChampionSkins(champId)
    if (!skinsResult.success || !skinsResult.data) continue

    const available = skinsResult.data.skins.filter((s) => {
      if (requireChromas && (!s.chromas || s.chromas.length === 0)) return false
      if (scope === 'owned' && !ownedSkinIds.value.includes(s.skinId)) return false
      return true
    })

    if (available.length > 0) {
      const skin = available[Math.floor(Math.random() * available.length)]
      return {
        skinId: skin.skinId,
        championId: champId,
        skinName: skin.skinName,
        chromas: skin.chromas ?? [],
        isOwned: ownedSkinIds.value.includes(skin.skinId),
      }
    }
  }

  return null
}

const setLastRandom = (candidate: RandomSkinCandidate, chromaId?: number) => {
  const champ = champions.value.get(candidate.championId)
  if (!champ) return

  lastRandomSkin.value = {
    skinId: candidate.skinId,
    chromaId,
    skinName: candidate.skinName,
    championName: champ.name,
    championAlias: champ.alias,
    championId: candidate.championId,
    imageUrl: getSkinImageUrl(candidate.skinId, candidate.championId, champ.alias),
    timestamp: Date.now(),
    source: candidate.isOwned ? 'random' : 'local',
  }
}

const randomSelectSkin = async () => {
  randomizing.value = true
  randomStatus.value = ''

  try {
    const candidate = await getRandomCandidate(false)
    if (!candidate) {
      randomStatus.value =
        randomSettings.championFilter === 'current'
          ? '当前英雄没有可用皮肤'
          : '没有可用皮肤'
      return
    }

    if (candidate.isOwned) {
      const result = await electronAPI.lcu.setMySelectionSkin(candidate.skinId)
      if (!result.success) {
        randomStatus.value = result.error || '设置失败，请确认处于选人阶段'
        return
      }
      randomStatus.value = '随机皮肤已设置，请在选人阶段使用'
    } else {
      const champ = champions.value.get(candidate.championId)
      await electronAPI.skinRuntime.prepare({
        championId: candidate.championId,
        championName: champ?.name ?? '',
        skinId: candidate.skinId,
        skinName: candidate.skinName,
      })
      randomStatus.value = '本地皮肤已替换，请在选人阶段使用'
    }

    setLastRandom(candidate)
    addToHistory(
      candidate.skinId,
      candidate.championId,
      candidate.skinName,
      candidate.isOwned ? 'random' : 'local',
    )
    randomSettings.mode = 'skin'
    saveSettings()
  } catch {
    randomStatus.value = '随机选择失败'
  } finally {
    randomizing.value = false
  }
}

const randomSelectChroma = async () => {
  randomizing.value = true
  randomStatus.value = ''

  try {
    const candidate = await getRandomCandidate(true)
    if (!candidate || candidate.chromas.length === 0) {
      randomStatus.value =
        randomSettings.championFilter === 'current'
          ? '当前英雄没有可用炫彩皮肤'
          : '没有可用炫彩皮肤'
      return
    }

    const randomChroma =
      candidate.chromas[Math.floor(Math.random() * candidate.chromas.length)]

    if (candidate.isOwned) {
      const result = await electronAPI.lcu.setMySelectionChroma(
        candidate.skinId,
        randomChroma.id,
      )
      if (!result.success) {
        randomStatus.value = result.error || '设置失败，请确认处于选人阶段'
        return
      }
      randomStatus.value = '随机炫彩已设置，请在选人阶段使用'
    } else {
      const champ = champions.value.get(candidate.championId)
      await electronAPI.skinRuntime.prepare({
        championId: candidate.championId,
        championName: champ?.name ?? '',
        skinId: candidate.skinId,
        skinName: candidate.skinName,
        chromaId: randomChroma.id,
      })
      randomStatus.value = '本地炫彩已替换，请在选人阶段使用'
    }

    setLastRandom(candidate, randomChroma.id)
    addToHistory(
      candidate.skinId,
      candidate.championId,
      candidate.skinName,
      candidate.isOwned ? 'random' : 'local',
      randomChroma.id,
    )
    randomSettings.mode = 'chroma'
    saveSettings()
  } catch {
    randomStatus.value = '随机选择失败'
  } finally {
    randomizing.value = false
  }
}

const reselectSkin = async (item: HistoryItem) => {
  try {
    if (item.source === 'local') {
      // Local replacement re-select
      await electronAPI.skinRuntime.prepare({
        championId: item.championId,
        championName: item.championName,
        skinId: item.skinId,
        skinName: item.skinName,
        chromaId: item.chromaId,
      })
      randomStatus.value = '本地皮肤已重新替换'
    } else if (item.chromaId !== undefined) {
      const result = await electronAPI.lcu.setMySelectionChroma(
        item.skinId,
        item.chromaId,
      )
      if (!result.success) {
        randomStatus.value = result.error || '设置失败，请确认处于选人阶段'
        return
      }
      randomStatus.value = '炫彩已重新设置'
    } else {
      const result = await electronAPI.lcu.setMySelectionSkin(item.skinId)
      if (!result.success) {
        randomStatus.value = result.error || '设置失败，请确认处于选人阶段'
        return
      }
      randomStatus.value = '皮肤已重新设置'
    }

    addToHistory(
      item.skinId,
      item.championId,
      item.skinName,
      item.source === 'local' ? 'local' : 'manual',
      item.chromaId,
    )
  } catch {
    randomStatus.value = '设置皮肤失败'
  }
}

const clearHistory = () => {
  history.value = []
  saveHistory()
}

onMounted(() => {
  loadData()
  loadHistory()
  loadSettings()
})
</script>

<style scoped>
.skin-history {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.random-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-desc {
  margin: 0;
  font-size: 12px;
  color: #71818d;
}

/* Settings row */
.settings-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  padding: 8px 0;
}

.settings-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.settings-label {
  font-size: 11px;
  color: #55606a;
  white-space: nowrap;
}

.radio-group {
  display: flex;
  gap: 4px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: #80909d;
  cursor: pointer;
  transition: color 150ms ease;
}

.radio-item:hover {
  color: #e6c58e;
}

.radio-item input[type='radio'] {
  accent-color: #e2c384;
  width: 12px;
  height: 12px;
  cursor: pointer;
}

/* Random buttons */
.random-buttons {
  display: flex;
  gap: 10px;
}

.random-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid rgba(226, 195, 132, 0.3);
  background: rgba(226, 195, 132, 0.08);
  color: #e6c58e;
  font-size: 14px;
  cursor: pointer;
  border-radius: 2px;
  transition: background 150ms ease, border-color 150ms ease;
}

.random-button:hover:not(:disabled) {
  background: rgba(226, 195, 132, 0.15);
  border-color: rgba(226, 195, 132, 0.5);
}

.random-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.random-icon {
  width: 16px;
  height: 16px;
}

.random-icon.spinning {
  animation: spin 800ms linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.random-status {
  padding: 8px 12px;
  font-size: 12px;
  color: #e6c58e;
  background: rgba(226, 195, 132, 0.08);
  border: 1px solid rgba(226, 195, 132, 0.2);
  border-radius: 2px;
}

.random-status.success {
  color: #6fce8f;
  background: rgba(111, 206, 143, 0.08);
  border-color: rgba(111, 206, 143, 0.2);
}

.last-random-display {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px;
  border: 1px solid rgba(226, 195, 132, 0.1);
  background: rgba(7, 19, 27, 0.6);
  border-radius: 2px;
}

.last-random-image {
  width: 120px;
  height: 68px;
  object-fit: cover;
  border-radius: 2px;
}

.last-random-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.last-random-info strong {
  font-size: 13px;
  color: #edf5fb;
}

.last-random-info small {
  font-size: 11px;
  color: #71818d;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Chroma badge */
.chroma-badge {
  display: inline-block;
  padding: 1px 5px;
  font-size: 10px;
  color: #c4a4ff;
  background: rgba(196, 164, 255, 0.12);
  border: 1px solid rgba(196, 164, 255, 0.2);
  border-radius: 2px;
}

/* History section */
.history-section {
  border-top: 1px solid rgba(226, 195, 132, 0.12);
  padding-top: 16px;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.history-header h5 {
  margin: 0;
  font-size: 13px;
  color: #caa86d;
}

.clear-history {
  border: 0;
  background: transparent;
  color: #55606a;
  font-size: 11px;
  cursor: pointer;
  transition: color 150ms ease;
}

.clear-history:hover {
  color: #d97070;
}

.history-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  color: #4a5a67;
  font-size: 12px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border: 1px solid rgba(226, 195, 132, 0.08);
  background: rgba(7, 19, 27, 0.4);
  border-radius: 2px;
  transition: border-color 150ms ease;
}

.history-item:hover {
  border-color: rgba(226, 195, 132, 0.2);
}

.history-image {
  width: 80px;
  height: 45px;
  object-fit: cover;
  border-radius: 2px;
  flex-shrink: 0;
}

.history-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.history-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.history-name-row strong {
  font-size: 12px;
  color: #edf5fb;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-info small {
  font-size: 11px;
  color: #80909d;
}

.history-time {
  font-size: 10px;
  color: #55606a;
}

/* Source badge */
.source-badge {
  display: inline-block;
  padding: 1px 5px;
  font-size: 9px;
  border-radius: 2px;
  white-space: nowrap;
  flex-shrink: 0;
}

.source-random {
  color: #e6c58e;
  background: rgba(226, 195, 132, 0.1);
  border: 1px solid rgba(226, 195, 132, 0.15);
}

.source-local {
  color: #c4a4ff;
  background: rgba(196, 164, 255, 0.1);
  border: 1px solid rgba(196, 164, 255, 0.15);
}

.source-manual {
  color: #80909d;
  background: rgba(128, 144, 157, 0.1);
  border: 1px solid rgba(128, 144, 157, 0.15);
}

.history-resel {
  padding: 4px 10px;
  border: 1px solid rgba(226, 195, 132, 0.2);
  background: transparent;
  color: #80909d;
  font-size: 11px;
  cursor: pointer;
  border-radius: 2px;
  flex-shrink: 0;
  transition: color 150ms ease, border-color 150ms ease;
}

.history-resel:hover {
  color: #e6c58e;
  border-color: rgba(226, 195, 132, 0.4);
}
</style>
