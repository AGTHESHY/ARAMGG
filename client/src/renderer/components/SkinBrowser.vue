<template>
  <div class="skin-browser">
    <div class="browser-toolbar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索英雄..."
        class="search-input"
      />
      <button
        class="refresh-button"
        type="button"
        title="刷新数据"
        :disabled="loading"
        @click="loadData"
      >
        <RefreshCw class="refresh-icon" :class="{ spinning: loading }" />
      </button>
    </div>

    <div v-if="selectStatus" class="select-status" :class="{ success: selectStatus.includes('已设置') }">
      {{ selectStatus }}
    </div>
    <div v-if="runtimeState" class="runtime-status" :class="runtimeState.phase">
      <div>
        <strong>本地替换：</strong>{{ runtimeState.message }}
        <span v-if="runtimeState.phase === 'downloading'">（{{ runtimeState.progress }}%）</span>
      </div>
      <button
        v-if="runtimeState.supported && runtimeState.phase === 'missing-dependency'"
        class="runtime-action"
        type="button"
        @click="importRuntimeDll"
      >导入 cslol-dll.dll</button>
      <button
        v-if="runtimeState.selection"
        class="runtime-action secondary"
        type="button"
        @click="clearLocalSkin"
      >取消本地替换</button>
    </div>

    <!-- Champion grid -->
    <div v-if="!selectedChampion" class="champion-section">
      <div v-if="loading" class="browser-loading">
        <RefreshCw class="loading-icon spinning" />
        <span>加载英雄列表中...</span>
      </div>
      <div v-else-if="error" class="browser-error">
        <span>{{ error }}</span>
      </div>
      <div v-else-if="filteredChampions.length === 0" class="browser-empty">
        <span>未找到匹配的英雄</span>
      </div>
      <div v-else class="champion-grid">
        <button
          v-for="champ in filteredChampions"
          :key="champ.id"
          class="champion-card"
          type="button"
          @click="selectChampion(champ)"
        >
          <img
            :src="getChampionIcon(champ.id)"
            :alt="champ.name"
            class="champion-card-icon"
            loading="lazy"
            @error="onImgError"
          />
          <span class="champion-card-name">{{ champ.name }}</span>
        </button>
      </div>
    </div>

    <!-- Skin list for selected champion -->
    <div v-else class="skin-section">
      <div class="skin-section-header">
        <button class="back-button" type="button" @click="backToChampions">
          <ChevronLeft class="back-icon" />
          <span>返回英雄列表</span>
        </button>
        <h4 class="selected-champion-title">
          {{ selectedChampion.name }}
          <small v-if="selectedChampion.title">{{ selectedChampion.title }}</small>
        </h4>
      </div>

      <div v-if="loadingSkins" class="browser-loading">
        <RefreshCw class="loading-icon spinning" />
        <span>加载皮肤数据中...</span>
      </div>
      <div v-else-if="skins.length === 0" class="browser-empty">
        <span>未找到皮肤数据</span>
      </div>
      <div v-else class="skin-grid">
        <div
          v-for="skin in skins"
          :key="skin.skinId"
          class="skin-card"
          :class="{
            owned: ownedSkins.has(skin.skinId),
            'not-owned': !ownedSkins.has(skin.skinId),
            'last-used': isLastUsedSkin(skin),
          }"
        >
          <div class="skin-image-wrapper">
            <img
              :src="getSkinImageUrl(skin)"
              :alt="skin.skinName"
              class="skin-image"
              loading="lazy"
              @error="onImgError"
            />
            <span v-if="ownedSkins.has(skin.skinId)" class="owned-badge">已拥有</span>
            <span v-if="isUltimateSkin(skin)" class="ultimate-badge">
              <Crown class="ultimate-icon" />
              终极皮肤
            </span>
            <span v-else-if="skin.rarity" class="rarity-badge">{{ getRarityLabel(skin.rarity) }}</span>
            <span v-if="isLastUsedSkin(skin)" class="last-used-badge">
              <Sparkles class="last-used-icon" />
              上次使用
            </span>
          </div>
          <div class="skin-info">
            <strong class="skin-name">{{ skin.skinName || '默认皮肤' }}</strong>

            <div v-if="getFormVariations(skin).length > 0" class="form-variations">
              <span
                v-for="(formName, idx) in getFormVariations(skin)"
                :key="idx"
                class="form-chip"
              >{{ formName }}</span>
            </div>

            <div v-if="skin.chromas && skin.chromas.length > 0" class="chroma-list">
              <button
                v-for="chroma in skin.chromas"
                :key="chroma.id"
                class="chroma-dot"
                :class="{ selected: isChromaSelected(skin.skinId, chroma.id) }"
                :style="getChromaStyle(chroma)"
                :title="chroma.name"
                :disabled="selectingChromaId === chroma.id"
                @click="selectChroma(skin, chroma)"
              ></button>
              <small v-if="skin.chromas.length > 1" class="chroma-count">{{ skin.chromas.length }} 炫彩</small>
            </div>
            <button
              v-if="ownedSkins.has(skin.skinId)"
              class="skin-select-button"
              type="button"
              :disabled="selectingSkinId === skin.skinId"
              @click="selectSkin(skin.skinId)"
            >
              {{ selectingSkinId === skin.skinId ? '应用中...' : '选择此皮肤' }}
            </button>
            <button
              v-else
              class="skin-select-button local"
              type="button"
              :disabled="selectingSkinId === skin.skinId || !runtimeState?.supported"
              @click="selectLocalSkin(skin)"
            >
              {{ selectingSkinId === skin.skinId ? '准备中...' : runtimeState?.supported ? '本地替换' : '仅 Windows 可用' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { SkinRuntimeState, SkinMemoryEntry, ChampionMonitorState } from '../../shared/ipc-contract.ts'
import { RefreshCw, ChevronLeft, Crown, Sparkles } from 'lucide-vue-next'
import { electronAPI } from '../native/electron-api.ts'
import { getChampionSquareIconUrl } from '../service/cdn'

interface ChampionBrief {
  id: number
  name: string
  alias: string
  title: string
  squarePortraitPath: string
}

interface ChromaData {
  id: number
  name: string
  colors: string[]
  chromaPath: string
  skinId: number
}

interface SkinData {
  skinId: number
  championId: number
  skinName: string
  isBase: boolean
  chromas: ChromaData[]
  splashPath?: string
  tilePath?: string
  cardPath?: string
  uncenteredCropPath?: string
  rarity?: string
  [key: string]: unknown
}

const champions = ref<ChampionBrief[]>([])
const ownedSkins = ref<Set<number>>(new Set())
const selectedChampion = ref<ChampionBrief | null>(null)
const skins = ref<SkinData[]>([])
const searchQuery = ref('')
const loading = ref(false)
const loadingSkins = ref(false)
const error = ref('')
const selectingSkinId = ref<number | null>(null)
const selectStatus = ref('')
const runtimeState = ref<SkinRuntimeState | null>(null)
const skinMemory = ref<Record<number, SkinMemoryEntry>>({})
const selectedChroma = ref<{ skinId: number; chromaId: number } | null>(null)
const selectingChromaId = ref<number | null>(null)
let unsubscribeRuntime: (() => void) | null = null
let unsubscribeChampionMonitor: (() => void) | null = null

const filteredChampions = computed(() => {
  if (!searchQuery.value.trim()) return champions.value
  const q = searchQuery.value.toLowerCase().trim()
  return champions.value.filter(
    (c) => c.name.toLowerCase().includes(q) || c.alias.toLowerCase().includes(q)
  )
})

const lastUsedSkin = computed<SkinMemoryEntry | null>(() => {
  if (!selectedChampion.value) return null
  return skinMemory.value[selectedChampion.value.id] || null
})

const getChampionIcon = (id: number) => getChampionSquareIconUrl(id)

const getSkinImageUrl = (skin: SkinData): string => {
  if (!selectedChampion.value) return ''
  const skinNum = skin.skinId - selectedChampion.value.id * 1000
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${selectedChampion.value.alias}_${skinNum}.jpg`
}

const getChromaStyle = (chroma: ChromaData) => {
  if (chroma.colors && chroma.colors.length > 0) {
    if (chroma.colors.length === 1) {
      return { background: chroma.colors[0] }
    }
    return {
      background: `linear-gradient(135deg, ${chroma.colors.join(', ')})`,
    }
  }
  return { background: '#3a4a55' }
}

const getRarityLabel = (rarity: string): string => {
  const rarityMap: Record<string, string> = {
    BUDGET: '折扣',
    STANDARD: '标准',
    LIMITED: '限定',
    LEGENDARY: '传说',
    EPIC: '史诗',
    MYTHIC: '神话',
    ULTIMATE: '终极',
    TIER_LEGENDARY: '传说',
    TIER_EPIC: '史诗',
    TIER_MYTHIC: '神话',
    TIER_ULTIMATE: '终极',
  }
  return rarityMap[rarity] || rarity
}

const isUltimateSkin = (skin: SkinData): boolean => {
  return skin.rarity === 'ULTIMATE' || skin.rarity === 'TIER_ULTIMATE'
}

const isLastUsedSkin = (skin: SkinData): boolean => {
  return lastUsedSkin.value?.skinId === skin.skinId
}

const isChromaSelected = (skinId: number, chromaId: number): boolean => {
  return selectedChroma.value?.skinId === skinId && selectedChroma.value?.chromaId === chromaId
}

const getFormVariations = (skin: SkinData): string[] => {
  const forms: string[] = []
  const formChanges = skin.formChanges
  if (Array.isArray(formChanges)) {
    for (const form of formChanges) {
      if (form && typeof form === 'object') {
        const record = form as Record<string, unknown>
        const name = record.formName || record.name || record.label || record.formChangeName
        if (name) forms.push(String(name))
      } else if (typeof form === 'string') {
        forms.push(form)
      }
    }
  }
  if (forms.length === 0) {
    const tiers = skin.tiers
    if (Array.isArray(tiers)) {
      for (const tier of tiers) {
        if (tier && typeof tier === 'object') {
          const record = tier as Record<string, unknown>
          const name = record.tierName || record.name || record.label
          if (name) forms.push(String(name))
        } else if (typeof tier === 'string') {
          forms.push(tier)
        }
      }
    }
  }
  return forms
}

const onImgError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.style.opacity = '0.25'
}

const loadData = async () => {
  loading.value = true
  error.value = ''
  selectStatus.value = ''

  try {
    const [champResult, skinsResult] = await Promise.all([
      electronAPI.lcu.getChampionList(),
      electronAPI.lcu.getOwnedSkins(),
    ])

    if (champResult.success && champResult.champions) {
      champions.value = champResult.champions.sort((a, b) =>
        a.name.localeCompare(b.name, 'zh-CN')
      )
    } else {
      error.value = champResult.error || '无法获取英雄列表，请确保游戏客户端已启动'
    }

    if (skinsResult.success && skinsResult.skinIds) {
      ownedSkins.value = new Set(skinsResult.skinIds)
    }
  } catch {
    error.value = '连接客户端失败，请确保游戏客户端已启动'
  } finally {
    loading.value = false
  }
}

const saveSkinMemory = (skin: SkinData, chromaId?: number) => {
  if (!selectedChampion.value) return
  const entry: SkinMemoryEntry = {
    championId: selectedChampion.value.id,
    skinId: skin.skinId,
    chromaId,
    skinName: skin.skinName || '默认皮肤',
    championAlias: selectedChampion.value.alias,
    timestamp: Date.now(),
  }
  const updated = { ...skinMemory.value, [selectedChampion.value.id]: entry }
  skinMemory.value = updated
  void electronAPI.store.set('skinMemory', updated)
}

const selectChampion = async (champ: ChampionBrief) => {
  selectedChampion.value = champ
  loadingSkins.value = true
  skins.value = []
  selectStatus.value = ''
  selectedChroma.value = null

  try {
    const result = await electronAPI.lcu.getChampionSkins(champ.id)
    if (result.success && result.data?.skins) {
      skins.value = result.data.skins as unknown as SkinData[]
      const memory = skinMemory.value[champ.id]
      if (memory?.chromaId) {
        selectedChroma.value = { skinId: memory.skinId, chromaId: memory.chromaId }
      }
    }
  } catch {
    // silent
  } finally {
    loadingSkins.value = false
  }
}

const backToChampions = () => {
  selectedChampion.value = null
  skins.value = []
  selectStatus.value = ''
  selectedChroma.value = null
}

const selectSkin = async (skinId: number) => {
  selectingSkinId.value = skinId
  selectStatus.value = ''

  try {
    const result = await electronAPI.lcu.setMySelectionSkin(skinId)
    if (result.success) {
      selectStatus.value = '皮肤已设置，请在选人阶段使用'
      const skin = skins.value.find((s) => s.skinId === skinId)
      if (skin) saveSkinMemory(skin)
    } else {
      selectStatus.value = result.error || '设置皮肤失败，请确认处于选人阶段'
    }
  } catch {
    selectStatus.value = '设置皮肤失败，请确认处于选人阶段'
  } finally {
    selectingSkinId.value = null
  }
}

const selectChroma = async (skin: SkinData, chroma: ChromaData) => {
  if (selectingChromaId.value !== null) return
  selectingChromaId.value = chroma.id
  selectStatus.value = ''

  try {
    const result = await electronAPI.lcu.setMySelectionChroma(skin.skinId, chroma.id)
    if (result.success) {
      selectedChroma.value = { skinId: skin.skinId, chromaId: chroma.id }
      selectStatus.value = `炫彩已设置：${chroma.name || ''}`
      saveSkinMemory(skin, chroma.id)
    } else {
      selectStatus.value = result.error || '设置炫彩失败，请确认处于选人阶段'
    }
  } catch {
    selectStatus.value = '设置炫彩失败，请确认处于选人阶段'
  } finally {
    selectingChromaId.value = null
  }
}

const selectLocalSkin = async (skin: SkinData) => {
  if (!selectedChampion.value) return
  selectingSkinId.value = skin.skinId
  runtimeState.value = await electronAPI.skinRuntime.prepare({
    championId: selectedChampion.value.id,
    championName: selectedChampion.value.name,
    skinId: skin.skinId,
    skinName: skin.skinName || '默认皮肤',
  })
  selectingSkinId.value = null
  saveSkinMemory(skin)
}

const importRuntimeDll = async () => {
  const result = await electronAPI.skinRuntime.importDll()
  if (result.data) runtimeState.value = result.data
  else if (result.error && result.error !== '已取消导入') selectStatus.value = result.error
}

const clearLocalSkin = async () => {
  runtimeState.value = await electronAPI.skinRuntime.clear()
}

const autoSwitchToCurrentChampion = async () => {
  try {
    const result = await electronAPI.lcu.getChampionId()
    if (result.success && result.championId) {
      const champ = champions.value.find((c) => c.id === result.championId)
      if (champ) {
        await selectChampion(champ)
      }
    }
  } catch {
    // silent
  }
}

const onChampionChanged = (state: ChampionMonitorState) => {
  if (!state.selectedChampionId) return
  if (selectedChampion.value?.id === state.selectedChampionId) return
  const champ = champions.value.find((c) => c.id === state.selectedChampionId)
  if (champ) {
    void selectChampion(champ)
  }
}

onMounted(async () => {
  await loadData()

  const memory = await electronAPI.store.get('skinMemory')
  if (memory && typeof memory === 'object') {
    skinMemory.value = memory as Record<number, SkinMemoryEntry>
  }

  await autoSwitchToCurrentChampion()

  runtimeState.value = await electronAPI.skinRuntime.getState()
  unsubscribeRuntime = electronAPI.events.on('skin-runtime-changed', (value) => {
    runtimeState.value = value
  })
  unsubscribeChampionMonitor = electronAPI.events.on('champion-monitor-changed', onChampionChanged)
})
onUnmounted(() => {
  unsubscribeRuntime?.()
  unsubscribeChampionMonitor?.()
})
</script>

<style scoped>
.skin-browser {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.browser-toolbar {
  display: flex;
  gap: 8px;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid rgba(226, 195, 132, 0.2);
  background: #07131b;
  color: #edf5fb;
  font-size: 13px;
  border-radius: 2px;
  outline: none;
  transition: border-color 150ms ease;
}

.search-input:focus {
  border-color: rgba(226, 195, 132, 0.5);
}

.search-input::placeholder {
  color: #4a5a67;
}

.refresh-button {
  border: 1px solid rgba(226, 195, 132, 0.2);
  background: #07131b;
  color: #80909d;
  padding: 7px 10px;
  cursor: pointer;
  border-radius: 2px;
  display: flex;
  align-items: center;
  transition: color 150ms ease, border-color 150ms ease;
}

.refresh-button:hover:not(:disabled) {
  color: #e6c58e;
  border-color: rgba(226, 195, 132, 0.4);
}

.refresh-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-icon {
  width: 15px;
  height: 15px;
}

.refresh-icon.spinning {
  animation: spin 800ms linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.select-status {
  padding: 8px 12px;
  font-size: 12px;
  color: #e6c58e;
  background: rgba(226, 195, 132, 0.08);
  border: 1px solid rgba(226, 195, 132, 0.2);
  border-radius: 2px;
}

.runtime-status {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  font-size: 12px;
  color: #9eb0bd;
  background: rgba(30, 53, 66, 0.55);
  border: 1px solid rgba(126, 157, 176, 0.22);
}

.runtime-status.error, .runtime-status.missing-dependency { color: #e8b16f; border-color: rgba(232, 177, 111, .35); }
.runtime-status.active, .runtime-status.prepared { color: #6fce8f; border-color: rgba(111, 206, 143, .3); }
.runtime-action { margin-left: auto; border: 1px solid rgba(226,195,132,.4); background: #142531; color: #e6c58e; padding: 5px 9px; cursor: pointer; }
.runtime-action.secondary { margin-left: 0; color: #9eb0bd; }
.skin-select-button.local { border-color: rgba(114, 172, 211, .45); color: #94c9eb; }

.select-status.success {
  color: #6fce8f;
  background: rgba(111, 206, 143, 0.08);
  border-color: rgba(111, 206, 143, 0.2);
}

.browser-loading,
.browser-error,
.browser-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 200px;
  color: #71818d;
  font-size: 13px;
}

.browser-error {
  color: #d97070;
}

.loading-icon {
  width: 16px;
  height: 16px;
}

.loading-icon.spinning {
  animation: spin 800ms linear infinite;
}

/* Champion grid */
.champion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
  gap: 8px;
}

.champion-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px;
  border: 1px solid rgba(226, 195, 132, 0.1);
  background: rgba(7, 19, 27, 0.6);
  cursor: pointer;
  border-radius: 2px;
  transition: border-color 150ms ease, background 150ms ease;
}

.champion-card:hover {
  border-color: rgba(226, 195, 132, 0.4);
  background: rgba(38, 53, 65, 0.6);
}

.champion-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 2px;
  object-fit: cover;
}

.champion-card-name {
  font-size: 11px;
  color: #aab8c2;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 64px;
}

/* Skin section */
.skin-section-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid rgba(226, 195, 132, 0.2);
  background: transparent;
  color: #80909d;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 12px;
  border-radius: 2px;
  transition: color 150ms ease, border-color 150ms ease;
}

.back-button:hover {
  color: #e6c58e;
  border-color: rgba(226, 195, 132, 0.4);
}

.back-icon {
  width: 14px;
  height: 14px;
}

.selected-champion-title {
  margin: 0;
  font-size: 14px;
  color: #edf5fb;
}

.selected-champion-title small {
  color: #71818d;
  font-weight: normal;
  margin-left: 4px;
}

/* Skin grid */
.skin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.skin-card {
  border: 1px solid rgba(226, 195, 132, 0.12);
  background: rgba(7, 19, 27, 0.6);
  border-radius: 2px;
  overflow: hidden;
  transition: border-color 150ms ease;
}

.skin-card:hover {
  border-color: rgba(226, 195, 132, 0.3);
}

.skin-card.owned {
  border-color: rgba(111, 206, 143, 0.15);
}

.skin-card.owned:hover {
  border-color: rgba(111, 206, 143, 0.35);
}

.skin-card.not-owned {
  opacity: 0.72;
}

.skin-card.last-used {
  border-color: rgba(148, 201, 235, 0.35);
  box-shadow: 0 0 8px rgba(148, 201, 235, 0.1);
}

.skin-image-wrapper {
  position: relative;
  aspect-ratio: 16 / 9;
  background: #0a1620;
  overflow: hidden;
}

.skin-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 200ms ease;
}

.skin-card:hover .skin-image {
  transform: scale(1.03);
}

.owned-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  padding: 2px 6px;
  font-size: 10px;
  color: #6fce8f;
  background: rgba(7, 19, 27, 0.85);
  border: 1px solid rgba(111, 206, 143, 0.3);
  border-radius: 2px;
}

.rarity-badge {
  position: absolute;
  bottom: 6px;
  left: 6px;
  padding: 2px 6px;
  font-size: 10px;
  color: #caa86d;
  background: rgba(7, 19, 27, 0.85);
  border: 1px solid rgba(226, 195, 132, 0.2);
  border-radius: 2px;
}

.ultimate-badge {
  position: absolute;
  top: 6px;
  left: 6px;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: bold;
  color: #e6c58e;
  background: linear-gradient(135deg, rgba(226, 195, 132, 0.2), rgba(7, 19, 27, 0.9));
  border: 1px solid rgba(226, 195, 132, 0.55);
  border-radius: 2px;
  text-shadow: 0 0 6px rgba(226, 195, 132, 0.4);
}

.ultimate-icon {
  width: 11px;
  height: 11px;
}

.last-used-badge {
  position: absolute;
  bottom: 6px;
  right: 6px;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px;
  font-size: 10px;
  color: #94c9eb;
  background: rgba(7, 19, 27, 0.85);
  border: 1px solid rgba(148, 201, 235, 0.4);
  border-radius: 2px;
}

.last-used-icon {
  width: 11px;
  height: 11px;
}

.skin-info {
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skin-name {
  font-size: 12px;
  color: #edf5fb;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.form-variations {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.form-chip {
  padding: 2px 6px;
  font-size: 10px;
  color: #caa86d;
  background: rgba(226, 195, 132, 0.08);
  border: 1px solid rgba(226, 195, 132, 0.15);
  border-radius: 2px;
}

.chroma-list {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.chroma-dot {
  width: 12px;
  height: 12px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  cursor: pointer;
  display: inline-block;
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  transition: transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
}

.chroma-dot:hover:not(:disabled) {
  transform: scale(1.25);
  border-color: rgba(226, 195, 132, 0.6);
}

.chroma-dot.selected {
  border-color: #e6c58e;
  box-shadow: 0 0 0 2px rgba(226, 195, 132, 0.55);
  transform: scale(1.15);
}

.chroma-dot:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chroma-count {
  font-size: 10px;
  color: #71818d;
  margin-left: 2px;
}

.skin-select-button {
  margin-top: 2px;
  padding: 5px 10px;
  border: 1px solid rgba(226, 195, 132, 0.3);
  background: rgba(226, 195, 132, 0.08);
  color: #e6c58e;
  font-size: 11px;
  cursor: pointer;
  border-radius: 2px;
  transition: background 150ms ease, border-color 150ms ease;
}

.skin-select-button:hover:not(:disabled) {
  background: rgba(226, 195, 132, 0.15);
  border-color: rgba(226, 195, 132, 0.5);
}

.skin-select-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.not-owned-label {
  font-size: 11px;
  color: #55606a;
  padding: 4px 0;
}
</style>
