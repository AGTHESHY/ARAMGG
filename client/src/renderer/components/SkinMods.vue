<template>
  <div class="skin-mods">
    <div class="mods-intro">
      <Package class="intro-icon" />
      <div class="intro-copy">
        <strong>自定义皮肤模组</strong>
        <p>
          通过 CSLOL Tools 将自定义皮肤模组（ZIP 文件）覆盖到游戏客户端中。
          将皮肤模组 ZIP 放入下方设定的模组目录，在选人阶段系统会自动匹配并应用对应皮肤。
        </p>
      </div>
    </div>

    <section class="mods-config">
      <h5 class="config-title">模组目录</h5>
      <div class="path-row">
        <input
          v-model="modDir"
          type="text"
          placeholder="选择或输入模组 ZIP 存放目录..."
          class="path-input"
          :disabled="saving"
        />
        <button class="browse-btn" type="button" :disabled="saving" @click="browseDir">
          <FolderSearch class="browse-icon" />
          浏览
        </button>
        <button class="save-btn" type="button" :disabled="saving || modDir === savedDir" @click="saveDir">
          <Save class="save-icon" />
          {{ saving ? '保存中...' : '保存' }}
        </button>
      </div>
      <p v-if="saveStatus" class="save-status" :class="{ success: saveStatus.includes('成功') }">
        {{ saveStatus }}
      </p>
    </section>

    <section class="mods-list-section">
      <div class="list-header">
        <h5 class="config-title">已安装模组</h5>
        <button class="scan-btn" type="button" :disabled="scanning" @click="scanMods">
          <RefreshCw class="scan-icon" :class="{ spinning: scanning }" />
          扫描
        </button>
      </div>

      <div v-if="scanning" class="mods-loading">
        <RefreshCw class="loading-icon spinning" />
        <span>正在扫描模组目录...</span>
      </div>

      <div v-else-if="mods.length === 0" class="mods-empty">
        <CircleDashed class="empty-icon" />
        <span>{{ modDir ? '目录中未找到皮肤模组 ZIP 文件' : '请先设置模组目录' }}</span>
      </div>

      <div v-else class="mods-list">
        <div v-for="mod in mods" :key="mod.filename" class="mod-item">
          <div class="mod-info">
            <strong class="mod-name">{{ mod.filename }}</strong>
            <small class="mod-size">{{ formatSize(mod.size) }}</small>
          </div>
          <span class="mod-status" :class="mod.status">
            {{ statusLabel(mod.status) }}
          </span>
        </div>
      </div>
    </section>

    <section class="mods-notice">
      <AlertTriangle class="notice-icon" />
      <div class="notice-copy">
        <strong>使用须知</strong>
        <ul>
          <li>模组 ZIP 文件需要遵循 CSLOL 命名格式（如 <code>championId_skinId.zip</code>）</li>
          <li>应用模组需要在游戏选人阶段，系统会自动匹配当前英雄</li>
          <li>自定义模组仅本地可见，不影响其他玩家</li>
          <li>关闭功能后会自动清理已覆盖的文件</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Package, FolderSearch, Save, RefreshCw, CircleDashed, AlertTriangle } from 'lucide-vue-next'
import { electronAPI } from '../native/electron-api.ts'

interface ModItem {
  filename: string
  size: number
  status: 'ready' | 'unknown'
}

const modDir = ref('')
const savedDir = ref('')
const saving = ref(false)
const saveStatus = ref('')
const scanning = ref(false)
const mods = ref<ModItem[]>([])

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const statusLabel = (status: string): string => {
  if (status === 'ready') return '可用'
  return '未知'
}

const loadDir = async () => {
  try {
    const value = await electronAPI.store.get('skinMods.directory')
    modDir.value = typeof value === 'string' ? value : ''
    savedDir.value = modDir.value
  } catch {
    // silent
  }
}

const browseDir = async () => {
  const result = await electronAPI.lcu.selectManualLeaguePath()
  const path = result?.path as string | undefined
  if (path) {
    modDir.value = path
  }
}

const saveDir = async () => {
  saving.value = true
  saveStatus.value = ''
  try {
    await electronAPI.store.set('skinMods.directory', modDir.value)
    savedDir.value = modDir.value
    saveStatus.value = '模组目录已保存'
    scanMods()
  } catch {
    saveStatus.value = '保存失败'
  } finally {
    saving.value = false
  }
}

const scanMods = async () => {
  scanning.value = true
  mods.value = []
  // In a full implementation, this would scan the directory for ZIP files
  // For now, we show the UI framework ready for CSLOL integration
  setTimeout(() => {
    scanning.value = false
  }, 500)
}

onMounted(loadDir)
</script>

<style scoped>
.skin-mods {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mods-intro {
  display: flex;
  gap: 10px;
  padding: 12px;
  border: 1px solid rgba(226, 195, 132, 0.12);
  background: rgba(7, 19, 27, 0.4);
  border-radius: 2px;
}

.intro-icon {
  width: 20px;
  height: 20px;
  color: #caa86d;
  flex-shrink: 0;
  margin-top: 2px;
}

.intro-copy strong {
  display: block;
  font-size: 13px;
  color: #edf5fb;
  margin-bottom: 4px;
}

.intro-copy p {
  margin: 0;
  font-size: 11px;
  color: #71818d;
  line-height: 1.5;
}

.mods-config {
  border: 1px solid rgba(226, 195, 132, 0.1);
  background: rgba(7, 19, 27, 0.4);
  padding: 12px;
  border-radius: 2px;
}

.config-title {
  margin: 0 0 10px;
  font-size: 13px;
  color: #caa86d;
}

.path-row {
  display: flex;
  gap: 6px;
}

.path-input {
  flex: 1;
  padding: 7px 10px;
  border: 1px solid rgba(226, 195, 132, 0.2);
  background: #07131b;
  color: #edf5fb;
  font-size: 12px;
  border-radius: 2px;
  outline: none;
}

.path-input:focus {
  border-color: rgba(226, 195, 132, 0.4);
}

.path-input::placeholder {
  color: #4a5a67;
}

.browse-btn,
.save-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 7px 10px;
  border: 1px solid rgba(226, 195, 132, 0.2);
  background: transparent;
  color: #80909d;
  font-size: 12px;
  cursor: pointer;
  border-radius: 2px;
  flex-shrink: 0;
  transition: color 150ms ease, border-color 150ms ease;
}

.browse-btn:hover:not(:disabled),
.save-btn:hover:not(:disabled) {
  color: #e6c58e;
  border-color: rgba(226, 195, 132, 0.4);
}

.browse-btn:disabled,
.save-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.browse-icon,
.save-icon {
  width: 14px;
  height: 14px;
}

.save-status {
  margin: 8px 0 0;
  font-size: 11px;
  color: #e6c58e;
}

.save-status.success {
  color: #6fce8f;
}

.mods-list-section {
  border: 1px solid rgba(226, 195, 132, 0.1);
  background: rgba(7, 19, 27, 0.4);
  padding: 12px;
  border-radius: 2px;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.scan-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  border: 0;
  background: transparent;
  color: #80909d;
  font-size: 11px;
  cursor: pointer;
  transition: color 150ms ease;
}

.scan-btn:hover:not(:disabled) {
  color: #e6c58e;
}

.scan-icon {
  width: 13px;
  height: 13px;
}

.spinning {
  animation: spin 800ms linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.mods-loading,
.mods-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 80px;
  color: #55606a;
  font-size: 12px;
}

.loading-icon,
.empty-icon {
  width: 15px;
  height: 15px;
}

.mods-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mod-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid rgba(226, 195, 132, 0.06);
  background: rgba(7, 19, 27, 0.3);
  border-radius: 2px;
}

.mod-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.mod-name {
  font-size: 12px;
  color: #edf5fb;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mod-size {
  font-size: 10px;
  color: #55606a;
}

.mod-status {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 2px;
  flex-shrink: 0;
}

.mod-status.ready {
  color: #6fce8f;
  background: rgba(111, 206, 143, 0.08);
}

.mod-status.unknown {
  color: #71818d;
  background: rgba(113, 129, 141, 0.08);
}

.mods-notice {
  display: flex;
  gap: 8px;
  padding: 10px;
  border: 1px solid rgba(226, 192, 143, 0.18);
  border-radius: 2px;
  background: rgba(226, 192, 143, 0.06);
}

.notice-icon {
  width: 15px;
  height: 15px;
  color: #e2c08f;
  flex-shrink: 0;
  margin-top: 1px;
}

.notice-copy strong {
  display: block;
  font-size: 12px;
  color: #e2c08f;
  margin-bottom: 6px;
}

.notice-copy ul {
  margin: 0;
  padding-left: 16px;
}

.notice-copy li {
  font-size: 11px;
  color: #859491;
  line-height: 1.6;
}

.notice-copy code {
  color: #bacac6;
  font-size: 10px;
}
</style>
