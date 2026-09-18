<template>
  <div class="skin-history">
    <div class="random-section">
      <p class="section-desc">从已拥有的皮肤中随机选择一个，需要在选人阶段使用。</p>
      <button
        class="random-button"
        type="button"
        :disabled="randomizing || ownedSkinIds.length === 0"
        @click="randomSelect"
      >
        <RefreshCw class="random-icon" :class="{ spinning: randomizing }" />
        <span>{{ randomizing ? '随机中...' : '随机皮肤' }}</span>
      </button>
      <div v-if="randomStatus" class="random-status" :class="{ success: randomStatus.includes('已设置') }">
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
          <small>{{ lastRandomSkin.championName }}</small>
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
          :key="item.skinId"
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
            <strong>{{ item.skinName }}</strong>
            <small>{{ item.championName }}</small>
            <span class="history-time">{{ formatTime(item.timestamp) }}</span>
          </div>
          <button
            class="history-resel"
            type="button"
            @click="reselectSkin(item.skinId)"
          >
            重新选择
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RefreshCw } from 'lucide-vue-next'
import { electronAPI } from '../native/electron-api.ts'

interface HistoryItem {
  skinId: number
  skinName: string
  championName: string
  championAlias: string
  championId: number
  imageUrl: string
  timestamp: number
}

const ownedSkinIds = ref<number[]>([])
const champions = ref<Map<number, { name: string; alias: string }>>(new Map())
const history = ref<HistoryItem[]>([])
const randomizing = ref(false)
const randomStatus = ref('')
const lastRandomSkin = ref<HistoryItem | null>(null)

const STORAGE_KEY = 'skinHistory'

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
      history.value = JSON.parse(raw)
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

const addToHistory = (skinId: number, championId: number, skinName: string) => {
  const champ = champions.value.get(championId)
  if (!champ) return

  const item: HistoryItem = {
    skinId,
    skinName,
    championName: champ.name,
    championAlias: champ.alias,
    championId,
    imageUrl: getSkinImageUrl(skinId, championId, champ.alias),
    timestamp: Date.now(),
  }

  history.value = [item, ...history.value.filter((h) => h.skinId !== skinId)].slice(0, 20)
  saveHistory()
}

const randomSelect = async () => {
  if (ownedSkinIds.value.length === 0) return
  randomizing.value = true
  randomStatus.value = ''

  try {
    const randomSkinId = ownedSkinIds.value[Math.floor(Math.random() * ownedSkinIds.value.length)]
    const result = await electronAPI.lcu.setMySelectionSkin(randomSkinId)

    if (result.success) {
      randomStatus.value = '随机皮肤已设置，请在选人阶段使用'
      const championId = Math.floor(randomSkinId / 1000)
      const champ = champions.value.get(championId)
      if (champ) {
        const item: HistoryItem = {
          skinId: randomSkinId,
          skinName: `皮肤 #${randomSkinId}`,
          championName: champ.name,
          championAlias: champ.alias,
          championId,
          imageUrl: getSkinImageUrl(randomSkinId, championId, champ.alias),
          timestamp: Date.now(),
        }
        lastRandomSkin.value = item
        addToHistory(randomSkinId, championId, item.skinName)
      }
    } else {
      randomStatus.value = result.error || '设置失败，请确认处于选人阶段'
    }
  } catch {
    randomStatus.value = '设置皮肤失败'
  } finally {
    randomizing.value = false
  }
}

const reselectSkin = async (skinId: number) => {
  try {
    const result = await electronAPI.lcu.setMySelectionSkin(skinId)
    if (result.success) {
      randomStatus.value = '皮肤已重新设置'
      const item = history.value.find((h) => h.skinId === skinId)
      if (item) {
        addToHistory(skinId, item.championId, item.skinName)
      }
    } else {
      randomStatus.value = result.error || '设置失败，请确认处于选人阶段'
    }
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
  align-self: flex-start;
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

.history-info strong {
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
