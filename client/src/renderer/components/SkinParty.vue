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
          :alt="member.summonerName"
          class="party-champion-icon"
          @error="onImgError"
        />
        <div class="party-info">
          <strong class="party-name">{{ member.summonerName || '玩家 ' + member.cellId }}</strong>
          <span class="party-skin" v-if="member.selectedSkinId && member.selectedSkinId > 0">
            皮肤 #{{ member.selectedSkinId }}
          </span>
          <span class="party-skin none" v-else>
            未选择皮肤
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

let pollTimer: ReturnType<typeof setInterval> | null = null

const getChampionIcon = (championId: number) => getChampionSquareIconUrl(championId)

const getSkinImage = (championId: number, skinId: number): string => {
  const skinNum = skinId - championId * 1000
  const alias = ''
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${alias}_${skinNum}.jpg`
}

const onImgError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.style.opacity = '0.2'
}

const loadPartySkins = async () => {
  loading.value = true
  error.value = ''
  try {
    const result = await electronAPI.lcu.getPartySkins()
    if (result.success) {
      members.value = (result.members || []) as unknown as PartyMember[]
    } else {
      error.value = result.error || '无法获取队友皮肤信息'
    }
  } catch {
    error.value = '连接客户端失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPartySkins()
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

.party-skin {
  font-size: 11px;
  color: #e6c58e;
}

.party-skin.none {
  color: #55606a;
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
