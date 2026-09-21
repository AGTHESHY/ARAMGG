<template>
  <div class="client-decorations">
    <div class="decor-toolbar">
      <button class="refresh-btn" type="button" :disabled="loading" @click="loadData">
        <RefreshCw class="refresh-icon" :class="{ spinning: loading }" />
        <span>刷新数据</span>
      </button>
    </div>

    <div v-if="loading" class="decor-loading">
      <RefreshCw class="loading-icon spinning" />
      <span>正在加载装饰数据...</span>
    </div>

    <div v-else-if="error" class="decor-error">
      <span>{{ error }}</span>
    </div>

    <template v-else>
      <section class="decor-section">
        <h5 class="section-title">
          <Sparkles class="section-icon" />
          已拥有表情
          <small v-if="emotes.length">({{ emotes.length }})</small>
        </h5>
        <div v-if="emotes.length === 0" class="decor-empty">
          <span>暂无表情数据</span>
        </div>
        <div v-else class="decor-grid">
          <button
            v-for="emote in emotes"
            :key="emote.itemId"
            class="decor-card"
            :class="{ active: selectedEmoteId === emote.itemId }"
            type="button"
            :disabled="settingEmote === emote.itemId"
            @click="setEmote(emote.itemId)"
          >
            <img
              :src="getDecorationIconUrl(emote)"
              :alt="'表情 ' + emote.itemId"
              class="decor-image"
              loading="lazy"
              @error="onImgError"
            />
            <span class="decor-label">#{{ emote.itemId }}</span>
            <span v-if="selectedEmoteId === emote.itemId" class="active-badge">已装备</span>
          </button>
        </div>
      </section>

      <section class="decor-section">
        <h5 class="section-title">
          <Eye class="section-icon" />
          守卫者皮肤
          <small v-if="wardSkins.length">({{ wardSkins.length }})</small>
        </h5>
        <div v-if="wardSkins.length === 0" class="decor-empty">
          <span>暂无守卫者皮肤</span>
        </div>
        <div v-else class="decor-grid">
          <div
            v-for="ward in wardSkins"
            :key="ward.itemId"
            class="decor-card ward"
          >
            <img
              :src="getDecorationIconUrl(ward)"
              :alt="'守卫 ' + ward.itemId"
              class="decor-image"
              loading="lazy"
              @error="onImgError"
            />
            <span class="decor-label">#{{ ward.itemId }}</span>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RefreshCw, Sparkles, Eye } from 'lucide-vue-next'
import { electronAPI } from '../native/electron-api.ts'

interface DecorationItem {
  id: number
  name: string
  inventoryType: string
  itemId: number
  iconPath?: string
  [key: string]: unknown
}

const emotes = ref<DecorationItem[]>([])
const wardSkins = ref<DecorationItem[]>([])
const loading = ref(false)
const error = ref('')
const selectedEmoteId = ref<number | null>(null)
const settingEmote = ref<number | null>(null)

const getDecorationIconUrl = (item: DecorationItem): string => {
  const source = String(item.iconPath || item.iconUrl || item.imagePath || item.image || '')
  if (/^https?:\/\//i.test(source)) return source
  if (source.startsWith('/lol-game-data/')) {
    return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default${source.slice('/lol-game-data'.length)}`
  }
  if (source.startsWith('/')) {
    return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default${source}`
  }
  // Do not manufacture the former 2784-emote-{id} URL: it now returns 404
  // for every item. A missing client icon is represented explicitly instead.
  return ''
}

const onImgError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}

const loadData = async () => {
  loading.value = true
  error.value = ''
  try {
    const result = await electronAPI.lcu.getDecorations()
    if (result.success) {
      emotes.value = (result.emotes || []) as unknown as DecorationItem[]
      wardSkins.value = (result.wardSkins || []) as unknown as DecorationItem[]
    } else {
      error.value = result.error || '无法获取装饰数据，请确保客户端已启动'
    }
  } catch {
    error.value = '连接客户端失败'
  } finally {
    loading.value = false
  }
}

const setEmote = async (emoteId: number) => {
  settingEmote.value = emoteId
  try {
    const result = await electronAPI.lcu.setSummonerEmote(emoteId)
    if (result.success) {
      selectedEmoteId.value = emoteId
    }
  } catch {
    // silent
  } finally {
    settingEmote.value = null
  }
}

onMounted(loadData)
</script>

<style scoped>
.client-decorations {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.decor-toolbar {
  display: flex;
  justify-content: flex-end;
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

.decor-loading,
.decor-error,
.decor-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 120px;
  color: #71818d;
  font-size: 13px;
}

.decor-error {
  color: #d97070;
}

.loading-icon {
  width: 16px;
  height: 16px;
}

.decor-section {
  border: 1px solid rgba(226, 195, 132, 0.1);
  background: rgba(7, 19, 27, 0.4);
  padding: 12px;
  border-radius: 2px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 10px;
  font-size: 13px;
  color: #caa86d;
}

.section-icon {
  width: 14px;
  height: 14px;
}

.section-title small {
  color: #55606a;
  font-weight: normal;
}

.decor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
  gap: 8px;
}

.decor-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px;
  border: 1px solid rgba(226, 195, 132, 0.08);
  background: rgba(7, 19, 27, 0.6);
  border-radius: 2px;
  cursor: pointer;
  transition: border-color 150ms ease, background 150ms ease;
  position: relative;
}

.decor-card:hover {
  border-color: rgba(226, 195, 132, 0.3);
  background: rgba(38, 53, 65, 0.6);
}

.decor-card.active {
  border-color: rgba(111, 206, 143, 0.4);
}

.decor-card:disabled {
  opacity: 0.6;
  cursor: wait;
}

.decor-card.ward {
  cursor: default;
}

.decor-image {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 2px;
}

.decor-label {
  font-size: 10px;
  color: #55606a;
}

.active-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  padding: 1px 4px;
  font-size: 9px;
  color: #6fce8f;
  background: rgba(7, 19, 27, 0.85);
  border-radius: 2px;
}
</style>
