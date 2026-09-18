<template>
  <div class="skin-party">
    <div class="party-toolbar">
      <p class="party-desc">查看当前选人阶段队友选择的皮肤，可与你的皮肤选择进行搭配参考。</p>
      <button class="refresh-btn" type="button" :disabled="loading" @click="loadPartySkins">
        <RefreshCw class="refresh-icon" :class="{ spinning: loading }" />
        <span>刷新</span>
      </button>
    </div>

    <div v-if="loading" class="party-loading">
      <RefreshCw class="loading-icon spinning" />
      <span>正在查询队友皮肤...</span>
    </div>

    <div v-else-if="error" class="party-error">
      <span>{{ error }}</span>
    </div>

    <div v-else-if="members.length === 0" class="party-empty">
      <CircleDashed class="empty-icon" />
      <span>当前不在选人阶段，或队友尚未选择英雄</span>
    </div>

    <div v-else class="party-grid">
      <div
        v-for="member in members"
        :key="member.cellId"
        class="party-card"
      >
        <img
          :src="getChampionIcon(member.championId)"
          :alt="getChampionName(member.championId)"
          class="party-champion-icon"
          @error="onImgError"
        />
        <div class="party-info">
          <strong class="party-name">{{ member.summonerName || '玩家 ' + member.cellId }}</strong>
          <span class="party-champion">{{ getChampionName(member.championId) }}</span>
          <span class="party-skin" v-if="member.selectedSkinId && member.selectedSkinId > 0">
            {{ getSkinName(member.championId, member.selectedSkinId) }}
          </span>
          <span class="party-skin none" v-else>
            未选择皮肤
          </span>
          <span
            v-if="getChromaId(member) > 0"
            class="party-chroma"
          >
            炫彩 #{{ getChromaId(member) }}
          </span>
          <div v-if="member.selectedSkinId && member.selectedSkinId > 0" class="party-skin-image">
            <img
              :src="getSkinImage(member.championId, member.selectedSkinId)"
              :alt="member.summonerName + ' 皮肤'"
              class="skin-splash"
              @error="onImgError"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RefreshCw, CircleDashed } from 'lucide-vue-next'
import { electronAPI } from '../native/electron-api.ts'
import { getChampionSquareIconUrl } from '../service/cdn'

interface PartyMember {
  cellId: number
  championId: number
  selectedSkinId: number
  summonerId: number
  summonerName: string
  [key: string]: unknown
}

const members = ref<PartyMember[]>([])
const loading = ref(false)
const error = ref('')

// championId -> { name, alias }
const champions = ref<Map<number, { name: string; alias: string }>>(new Map())
// championId -> skinId -> skinName
const skinCache = ref<Map<number, Map<number, string>>>(new Map())

let pollTimer: ReturnType<typeof setInterval> | null = null
let isLoading = false

const getChampionIcon = (championId: number) => getChampionSquareIconUrl(championId)

const getChampionName = (championId: number): string => {
  const champ = champions.value.get(championId)
  return champ ? champ.name : ''
}

const getSkinName = (championId: number, skinId: number): string => {
  const skins = skinCache.value.get(championId)
  if (skins) {
    const name = skins.get(skinId)
    if (name) return name
  }
  return `皮肤 #${skinId}`
}

const getChromaId = (member: PartyMember): number => {
  const raw = (member.selectedChromaId ?? member.chromaId) as unknown
  const v = typeof raw === 'number' ? raw : Number(raw)
  return Number.isFinite(v) && v > 0 ? v : 0
}

const getSkinImage = (championId: number, skinId: number): string => {
  const skinNum = skinId - championId * 1000
  const champ = champions.value.get(championId)
  const alias = champ ? champ.alias : ''
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${alias}_${skinNum}.jpg`
}

const onImgError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.style.opacity = '0.2'
}

const loadChampions = async () => {
  if (champions.value.size > 0) return
  try {
    const result = await electronAPI.lcu.getChampionList()
    if (result.success && result.champions) {
      const map = new Map<number, { name: string; alias: string }>()
      for (const c of result.champions) {
        map.set(c.id, { name: c.name, alias: c.alias })
      }
      champions.value = map
    }
  } catch {
    // silent
  }
}

const ensureSkinData = async (championId: number) => {
  if (skinCache.value.has(championId)) return
  try {
    const result = await electronAPI.lcu.getChampionSkins(championId)
    if (result.success && result.data && result.data.skins) {
      const skinMap = new Map<number, string>()
      for (const skin of result.data.skins) {
        if (skin.skinName) skinMap.set(skin.skinId, skin.skinName)
      }
      const next = new Map(skinCache.value)
      next.set(championId, skinMap)
      skinCache.value = next
    }
  } catch {
    // silent
  }
}

const refreshSkinDataForMembers = async () => {
  const uniqueChampionIds = new Set<number>()
  for (const m of members.value) {
    if (m.selectedSkinId && m.selectedSkinId > 0) {
      uniqueChampionIds.add(m.championId)
    }
  }
  await Promise.all(Array.from(uniqueChampionIds).map((id) => ensureSkinData(id)))
}

const loadPartySkins = async () => {
  if (isLoading) return
  isLoading = true
  loading.value = true
  error.value = ''
  try {
    if (champions.value.size === 0) {
      await loadChampions()
    }
    const result = await electronAPI.lcu.getPartySkins()
    if (result.success) {
      members.value = (result.members || []) as unknown as PartyMember[]
      await refreshSkinDataForMembers()
    } else {
      error.value = result.error || '无法获取队友皮肤信息'
    }
  } catch {
    error.value = '连接客户端失败'
  } finally {
    loading.value = false
    isLoading = false
  }
}

onMounted(async () => {
  await loadChampions()
  await loadPartySkins()
  pollTimer = setInterval(loadPartySkins, 3000)
})

onBeforeUnmount(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>

<style scoped>
.skin-party {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.party-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.party-desc {
  margin: 0;
  font-size: 12px;
  color: #71818d;
  max-width: 400px;
  line-height: 1.5;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid rgba(226, 195, 132, 0.2);
  background: transparent;
  color: #80909d;
  font-size: 12px;
  cursor: pointer;
  border-radius: 2px;
  flex-shrink: 0;
  transition: color 150ms ease, border-color 150ms ease;
}

.refresh-btn:hover:not(:disabled) {
  color: #e6c58e;
  border-color: rgba(226, 195, 132, 0.4);
}

.refresh-icon {
  width: 14px;
  height: 14px;
}

.spinning {
  animation: spin 800ms linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.party-loading,
.party-error,
.party-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 200px;
  color: #71818d;
  font-size: 13px;
}

.party-error {
  color: #d97070;
}

.loading-icon,
.empty-icon {
  width: 16px;
  height: 16px;
}

.party-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}

.party-card {
  display: flex;
  gap: 10px;
  padding: 10px;
  border: 1px solid rgba(226, 195, 132, 0.1);
  background: rgba(7, 19, 27, 0.5);
  border-radius: 2px;
  transition: border-color 150ms ease;
}

.party-card:hover {
  border-color: rgba(226, 195, 132, 0.25);
}

.party-champion-icon {
  width: 48px;
  height: 48px;
  border-radius: 2px;
  object-fit: cover;
  flex-shrink: 0;
}

.party-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.party-name {
  font-size: 12px;
  color: #edf5fb;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.party-champion {
  font-size: 11px;
  color: #80909d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.party-skin {
  font-size: 11px;
  color: #e6c58e;
}

.party-skin.none {
  color: #55606a;
}

.party-chroma {
  display: inline-block;
  align-self: flex-start;
  font-size: 10px;
  color: #b9a3d6;
  padding: 1px 6px;
  border: 1px solid rgba(185, 163, 214, 0.25);
  background: rgba(185, 163, 214, 0.06);
  border-radius: 2px;
}

.party-skin-image {
  margin-top: 4px;
}

.skin-splash {
  width: 100%;
  max-width: 140px;
  height: 60px;
  object-fit: cover;
  border-radius: 2px;
}
</style>
