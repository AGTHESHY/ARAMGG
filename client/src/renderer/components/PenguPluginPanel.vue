<template>
  <section class="pengu-plugin-panel">
    <div class="section-header">
      <p class="section-kicker">客户端战绩注入 (Pengu Loader)</p>
    </div>

    <div class="pengu-status-card">
      <div class="status-row">
        <div class="status-item">
          <span>Pengu Loader</span>
          <strong :class="{ ok: penguInstalled, no: !penguInstalled }">
            {{ penguInstalled ? '已安装' : '未安装' }}
          </strong>
        </div>
        <div class="status-item">
          <span>ARAMGG 插件</span>
          <strong :class="{ ok: pluginInstalled, no: !pluginInstalled }">
            {{ pluginInstalled ? '已安装' : '未安装' }}
          </strong>
        </div>
      </div>

      <div v-if="penguPath" class="status-path">
        <span>路径: {{ penguPath }}</span>
      </div>

      <div v-if="!penguInstalled" class="pengu-hint">
        <p>需要先安装 Pengu Loader 才能将战绩直接注入英雄联盟客户端。</p>
        <a href="#" class="pengu-link" @click.prevent="openPenguSite">
          下载 Pengu Loader
        </a>
      </div>

      <div class="pengu-actions">
        <button
          v-if="penguInstalled && !pluginInstalled"
          class="pengu-btn primary"
          type="button"
          :disabled="installing"
          @click="installPlugin"
        >
          <Download v-if="!installing" class="btn-icon" />
          <RefreshCw v-else class="btn-icon spinning" />
          <span>{{ installing ? '安装中...' : '安装插件' }}</span>
        </button>

        <button
          v-if="penguInstalled && pluginInstalled"
          class="pengu-btn"
          type="button"
          @click="uninstallPlugin"
        >
          <span>卸载插件</span>
        </button>

        <button
          v-if="penguInstalled"
          class="pengu-btn"
          type="button"
          @click="openPluginsFolder"
        >
          <span>打开插件目录</span>
        </button>

        <button
          class="pengu-btn"
          type="button"
          @click="refreshStatus"
        >
          <RefreshCw class="btn-icon" />
          <span>刷新</span>
        </button>
      </div>

      <div v-if="message" class="pengu-message" :class="{ error: messageError }">
        {{ message }}
      </div>

      <div v-if="penguInstalled && pluginInstalled" class="pengu-activated">
        <p>插件已就绪。重启英雄联盟客户端后，大厅和选人阶段将自动显示队友战绩（胜率、KDA、评分）。</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Download, RefreshCw } from 'lucide-vue-next'
import { electronAPI } from '../native/electron-api'

const penguInstalled = ref(false)
const pluginInstalled = ref(false)
const penguPath = ref('')
const installing = ref(false)
const message = ref('')
const messageError = ref(false)

const refreshStatus = async () => {
  try {
    const result = await electronAPI.penguPlugin.getStatus()
    if (result.success && result.data) {
      penguInstalled.value = result.data.penguInstalled
      pluginInstalled.value = result.data.pluginInstalled
      penguPath.value = result.data.penguPath || ''
    }
  } catch (e) {
    message.value = '检查状态失败'
    messageError.value = true
  }
}

const installPlugin = async () => {
  installing.value = true
  message.value = ''
  messageError.value = false
  try {
    const result = await electronAPI.penguPlugin.installPlugin()
    if (result.success) {
      message.value = '插件安装成功！请重启英雄联盟客户端以激活。'
      messageError.value = false
      await refreshStatus()
    } else {
      message.value = result.error || '安装失败'
      messageError.value = true
    }
  } catch (e) {
    message.value = '安装失败'
    messageError.value = true
  } finally {
    installing.value = false
  }
}

const uninstallPlugin = async () => {
  message.value = ''
  messageError.value = false
  try {
    const result = await electronAPI.penguPlugin.uninstallPlugin()
    if (result.success) {
      message.value = '插件已卸载。'
      messageError.value = false
      await refreshStatus()
    } else {
      message.value = result.error || '卸载失败'
      messageError.value = true
    }
  } catch (e) {
    message.value = '卸载失败'
    messageError.value = true
  }
}

const openPluginsFolder = async () => {
  await electronAPI.penguPlugin.openPluginsFolder()
}

const openPenguSite = () => {
  if (typeof window !== 'undefined' && window.open) {
    window.open('https://github.com/PenguLoader/PenguLoader/releases', '_blank')
  }
}

onMounted(() => {
  void refreshStatus()
})
</script>

<style scoped>
.pengu-plugin-panel {
  padding: 0 0 16px 0;
}

.section-header {
  margin-bottom: 12px;
}

.section-kicker {
  font-size: 13px;
  font-weight: 600;
  color: var(--lol-gold, #c8aa6e);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pengu-status-card {
  background: rgba(1, 10, 19, 0.6);
  border: 1px solid rgba(200, 170, 110, 0.15);
  border-radius: 6px;
  padding: 16px;
}

.status-row {
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.status-item span {
  font-size: 11px;
  color: var(--lol-text-dim, #a09b8c);
}

.status-item strong {
  font-size: 14px;
}

.status-item strong.ok {
  color: #5bbd72;
}

.status-item strong.no {
  color: #e74c3c;
}

.status-path {
  font-size: 11px;
  color: var(--lol-text-dim, #a09b8c);
  margin-bottom: 12px;
  word-break: break-all;
}

.pengu-hint {
  background: rgba(231, 76, 60, 0.08);
  border: 1px solid rgba(231, 76, 60, 0.2);
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 12px;
}

.pengu-hint p {
  font-size: 12px;
  color: var(--lol-text-dim, #a09b8c);
  margin: 0 0 8px 0;
}

.pengu-link {
  color: var(--lol-gold, #c8aa6e);
  font-size: 12px;
  text-decoration: none;
}

.pengu-link:hover {
  text-decoration: underline;
}

.pengu-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pengu-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(200, 170, 110, 0.1);
  border: 1px solid rgba(200, 170, 110, 0.25);
  border-radius: 4px;
  color: var(--lol-gold, #c8aa6e);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.pengu-btn:hover:not(:disabled) {
  background: rgba(200, 170, 110, 0.2);
  border-color: rgba(200, 170, 110, 0.4);
}

.pengu-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pengu-btn.primary {
  background: rgba(91, 189, 114, 0.15);
  border-color: rgba(91, 189, 114, 0.3);
  color: #5bbd72;
}

.btn-icon {
  width: 14px;
  height: 14px;
}

.btn-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.pengu-message {
  margin-top: 12px;
  font-size: 12px;
  color: #5bbd72;
}

.pengu-message.error {
  color: #e74c3c;
}

.pengu-activated {
  margin-top: 12px;
  padding: 12px;
  background: rgba(91, 189, 114, 0.08);
  border: 1px solid rgba(91, 189, 114, 0.2);
  border-radius: 4px;
}

.pengu-activated p {
  font-size: 12px;
  color: var(--lol-text-dim, #a09b8c);
  margin: 0;
}
</style>
