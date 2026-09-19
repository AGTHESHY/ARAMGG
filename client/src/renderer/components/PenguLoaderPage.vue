<template>
  <div class="pengu-loader-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">Pengu Loader</h2>
      <p class="page-subtitle">英雄联盟客户端增强插件管理器</p>
    </div>

    <!-- 页签导航 -->
    <div class="tab-bar">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'loader' }"
        type="button"
        @click="activeTab = 'loader'"
      >
        <Zap class="tab-icon" />
        <span>Loader</span>
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'plugins' }"
        type="button"
        @click="activeTab = 'plugins'"
      >
        <Puzzle class="tab-icon" />
        <span>Plugins</span>
      </button>
    </div>

    <!-- ==================== Loader 页签 ==================== -->
    <div v-show="activeTab === 'loader'" class="tab-content">
      <!-- 运行状态 -->
      <div class="status-card">
        <div class="card-header">
          <h3>运行状态</h3>
          <button class="refresh-btn" type="button" @click="refreshStatus">
            <RefreshCw class="btn-icon" :class="{ spinning: loading }" />
          </button>
        </div>

        <div class="status-grid">
          <div class="status-item">
            <div class="status-icon" :class="{ ok: penguInstalled, no: !penguInstalled }">
              <HardDrive />
            </div>
            <div class="status-info">
              <span class="status-label">Pengu Loader 核心</span>
              <strong class="status-value">
                {{ penguInstalled ? '已安装' : '未安装' }}
              </strong>
            </div>
          </div>

          <div class="status-item">
            <div class="status-icon" :class="{ ok: injectionActive, no: !injectionActive }">
              <Zap />
            </div>
            <div class="status-info">
              <span class="status-label">自动加载</span>
              <strong class="status-value">
                {{ injectionActive ? '已启用' : '未启用' }}
              </strong>
            </div>
          </div>
        </div>

        <div v-if="penguPath" class="path-row">
          <span class="path-label">安装路径</span>
          <span class="path-value">{{ penguPath }}</span>
        </div>

        <div v-if="penguInstalled" class="injection-hint">
          <p v-if="injectionActive" class="hint-text ok">
            自动加载已启用。启动英雄联盟客户端时将自动加载核心和插件。如果客户端已经运行，需要重启客户端才能生效。
          </p>
          <p v-else class="hint-text warn">
            自动加载未启用。点击下方按钮启用，启用后每次启动客户端将自动加载插件，无需重复操作。
          </p>
        </div>

        <!-- 注入开关 -->
        <div v-if="penguInstalled" class="injection-row">
          <div class="injection-info">
            <span class="injection-label">客户端注入 (IFEO)</span>
            <span class="injection-status" :class="{ active: injectionActive, inactive: !injectionActive }">
              {{ injectionActive ? '已启用' : '未启用' }}
            </span>
          </div>
          <button
            class="toggle-injection-btn"
            :class="{ on: injectionActive }"
            type="button"
            :disabled="togglingInjection"
            @click="toggleInjection"
          >
            <RefreshCw v-if="togglingInjection" class="btn-icon spinning" />
            <span>{{ togglingInjection ? '...' : (injectionActive ? '关闭注入' : '开启注入') }}</span>
          </button>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="action-card">
        <h3>快捷操作</h3>
        <div class="action-buttons">
          <button
            v-if="!penguInstalled && penguBundled"
            class="action-btn primary"
            type="button"
            :disabled="installing"
            @click="installPenguLoader"
          >
            <Download v-if="!installing" class="btn-icon" />
            <RefreshCw v-else class="btn-icon spinning" />
            <span>{{ installing ? '安装中...' : '一键安装 Pengu Loader' }}</span>
          </button>

          <button
            v-if="penguInstalled"
            class="action-btn"
            type="button"
            @click="openPluginsFolder"
          >
            <FolderOpen class="btn-icon" />
            <span>打开插件目录</span>
          </button>
        </div>

        <div v-if="message" class="message-bar" :class="{ error: messageError }">
          {{ message }}
        </div>
      </div>

      <!-- Pengu Loader 设置 -->
      <div v-if="penguInstalled && config" class="settings-card">
        <div class="card-header">
          <h3>Loader 设置</h3>
        </div>

        <!-- 插件目录 -->
        <div class="setting-group">
          <h4 class="setting-group-title">插件目录</h4>
          <div class="setting-row clickable" @click="openPluginsFolder">
            <FolderOpen class="setting-icon" />
            <span class="setting-value">{{ config.app.plugins_dir || './plugins' }}</span>
          </div>
        </div>

        <!-- LOL 客户端路径 -->
        <div class="setting-group">
          <h4 class="setting-group-title">
            LOL 客户端路径
            <span v-if="config.app.activation_mode === 0" class="setting-hint">(Universal 模式下不需要)</span>
          </h4>
          <div class="setting-row-with-action">
            <div class="setting-row" :class="{ disabled: config.app.activation_mode === 0 }">
              <Gamepad2 class="setting-icon" />
              <span class="setting-value">{{ config.app.league_dir || '(未选择)' }}</span>
            </div>
            <button
              class="action-btn small"
              type="button"
              :disabled="detectingLeague"
              @click="autoDetectLeague"
            >
              <RefreshCw v-if="detectingLeague" class="btn-icon spinning" />
              <Search v-else class="btn-icon" />
              <span>{{ detectingLeague ? '检测中...' : '自动检测' }}</span>
            </button>
          </div>
        </div>

        <!-- 激活模式 -->
        <div class="setting-group">
          <h4 class="setting-group-title">激活模式</h4>
          <div class="radio-list">
            <label class="radio-option" :class="{ checked: config.app.activation_mode === 0 }">
              <input
                type="radio"
                name="activation_mode"
                :value="0"
                :checked="config.app.activation_mode === 0"
                @change="setConfig('app', 'activation_mode', 0)"
              />
              <span class="radio-indicator"></span>
              <div class="radio-content">
                <span class="radio-caption">Universal</span>
                <span class="radio-message">应用到所有英雄联盟客户端（含正式服和 PBE）</span>
              </div>
            </label>
            <label class="radio-option" :class="{ checked: config.app.activation_mode === 1 }">
              <input
                type="radio"
                name="activation_mode"
                :value="1"
                :checked="config.app.activation_mode === 1"
                @change="setConfig('app', 'activation_mode', 1)"
              />
              <span class="radio-indicator"></span>
              <div class="radio-content">
                <span class="radio-caption">Targeted</span>
                <span class="radio-message">应用到指定的英雄联盟客户端。如果 Universal 模式下遇到权限拒绝，请使用此模式</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- 客户端设置 -->
      <div v-if="penguInstalled && config" class="settings-card">
        <div class="card-header">
          <h3>客户端设置</h3>
        </div>
        <p class="settings-note">*这些选项在客户端内生效，需要重启客户端才能生效。</p>

        <!-- 热键 -->
        <div class="setting-group">
          <h4 class="setting-group-title">热键</h4>
          <label class="check-option">
            <input
              type="checkbox"
              :checked="config.client.use_hotkeys"
              @change="setConfig('client', 'use_hotkeys', !config.client.use_hotkeys)"
            />
            <span class="checkbox-indicator"></span>
            <div class="check-content">
              <span class="check-caption">启用热键</span>
              <span class="check-message">允许 Pengu 在客户端中捕获快捷键执行以下功能</span>
            </div>
          </label>
          <div class="hotkey-list" :class="{ disabled: !config.client.use_hotkeys }">
            <div class="hotkey-item">
              <kbd>Ctrl Shift R</kbd>
              <span>重载客户端</span>
            </div>
            <div class="hotkey-item">
              <kbd>Ctrl Shift Enter</kbd>
              <span>重启 UX</span>
            </div>
            <div class="hotkey-item" :class="{ disabled: !config.client.use_devtools }">
              <kbd>Ctrl Shift I</kbd>
              <span>/</span>
              <kbd>F12</kbd>
              <span>打开开发者工具</span>
            </div>
          </div>
        </div>

        <!-- 优化 -->
        <div class="setting-group">
          <h4 class="setting-group-title">优化</h4>
          <label class="check-option">
            <input
              type="checkbox"
              :checked="config.client.optimized_client"
              @change="setConfig('client', 'optimized_client', !config.client.optimized_client)"
            />
            <span class="checkbox-indicator"></span>
            <div class="check-content">
              <span class="check-caption">客户端优化</span>
              <span class="check-message">启用缓存并禁用客户端中一些不必要的内容。此选项不会导致连接问题。</span>
            </div>
          </label>
          <label class="check-option">
            <input
              type="checkbox"
              :checked="config.client.super_potato"
              @change="setConfig('client', 'super_potato', !config.client.super_potato)"
            />
            <span class="checkbox-indicator"></span>
            <div class="check-content">
              <span class="check-caption">超级土豆模式</span>
              <span class="check-message">禁用所有动画和过渡效果，同时减少客户端的输入延迟。</span>
            </div>
          </label>
          <label class="check-option">
            <input
              type="checkbox"
              :checked="config.client.silent_mode"
              @change="setConfig('client', 'silent_mode', !config.client.silent_mode)"
            />
            <span class="checkbox-indicator"></span>
            <div class="check-content">
              <span class="check-caption">静默模式</span>
              <span class="check-message">匹配成功时抑制所有通知和闪烁前台窗口。</span>
            </div>
          </label>
        </div>

        <!-- 开发者 -->
        <div class="setting-group">
          <h4 class="setting-group-title">开发者</h4>
          <label class="check-option">
            <input
              type="checkbox"
              :checked="config.client.use_devtools"
              @change="setConfig('client', 'use_devtools', !config.client.use_devtools)"
            />
            <span class="checkbox-indicator"></span>
            <div class="check-content">
              <span class="check-caption">开发者工具</span>
              <span class="check-message">允许打开 Chrome DevTools 调试 UX 和插件。</span>
            </div>
          </label>
          <label class="check-option">
            <input
              type="checkbox"
              :checked="config.client.insecure_mode"
              @change="setConfig('client', 'insecure_mode', !config.client.insecure_mode)"
            />
            <span class="checkbox-indicator"></span>
            <div class="check-content">
              <span class="check-caption">不安全模式</span>
              <span class="check-message">禁用所有 Web 安全特性，如 CORS 和 CSP。</span>
            </div>
          </label>
          <label class="check-option">
            <input
              type="checkbox"
              :checked="config.client.use_riotclient"
              @change="setConfig('client', 'use_riotclient', !config.client.use_riotclient)"
            />
            <span class="checkbox-indicator"></span>
            <div class="check-content">
              <span class="check-caption">RiotClient API</span>
              <span class="check-message">允许通过 'riotclient' 域访问 RiotClient API。</span>
            </div>
          </label>
          <label class="check-option">
            <input
              type="checkbox"
              :checked="config.client.use_proxy"
              @change="setConfig('client', 'use_proxy', !config.client.use_proxy)"
            />
            <span class="checkbox-indicator"></span>
            <div class="check-content">
              <span class="check-caption">允许代理</span>
              <span class="check-message">允许 UX 请求流量通过网络代理。</span>
            </div>
          </label>
        </div>
      </div>
    </div>

    <!-- ==================== Plugins 页签 ==================== -->
    <div v-show="activeTab === 'plugins'" class="tab-content">
      <div v-if="!penguInstalled" class="empty-state">
        <Puzzle class="empty-icon" />
        <p>Pengu Loader 未安装</p>
        <span>请先在 Loader 页面安装 Pengu Loader</span>
      </div>

      <template v-else>
        <!-- 插件列表头 -->
        <div class="plugins-header">
          <h3>已安装插件 ({{ plugins.length }})</h3>
          <div class="plugins-actions">
            <button class="action-btn small" type="button" @click="refreshPlugins">
              <RefreshCw class="btn-icon" :class="{ spinning: loadingPlugins }" />
              <span>刷新</span>
            </button>
            <button class="action-btn small" type="button" @click="openPluginsFolder">
              <FolderOpen class="btn-icon" />
              <span>打开目录</span>
            </button>
          </div>
        </div>

        <!-- 加载中 -->
        <div v-if="loadingPlugins" class="loading-state">
          <RefreshCw class="btn-icon spinning" />
          <span>加载中...</span>
        </div>

        <!-- 空列表 -->
        <div v-else-if="plugins.length === 0" class="empty-state">
          <Puzzle class="empty-icon" />
          <p>还没有插件</p>
          <span>将插件放入插件目录后点击刷新</span>
        </div>

        <!-- 插件网格 -->
        <div v-else class="plugin-grid">
          <div
            v-for="plugin in plugins"
            :key="plugin.hash"
            class="plugin-card"
            :class="{ enabled: plugin.enabled, builtin: plugin.builtin }"
          >
            <div class="plugin-card-header">
              <label class="plugin-checkbox">
                <input
                  type="checkbox"
                  :checked="plugin.enabled"
                  @change="togglePlugin(plugin)"
                />
                <span class="checkbox-indicator sm"></span>
              </label>
              <h4 class="plugin-name">{{ plugin.name }}</h4>
              <span v-if="plugin.builtin" class="plugin-badge builtin-badge">内置</span>
            </div>
            <p v-if="plugin.description" class="plugin-desc">{{ plugin.description }}</p>
            <div class="plugin-meta">
              <span v-if="plugin.author" class="plugin-author">{{ plugin.author }}</span>
              <span class="plugin-path">@plugins/{{ plugin.path }}</span>
            </div>
          </div>
        </div>

        <div class="plugins-footer">
          <div class="footer-section">
            <p class="footer-text">看不到你的插件？</p>
            <button class="action-btn small" type="button" @click="refreshPlugins">
              <RefreshCw class="btn-icon" />
              <span>重新加载</span>
            </button>
          </div>
          <div class="footer-section">
            <p class="footer-text">需要更多插件？</p>
            <button class="action-btn small" type="button" @click="openPluginsFolder">
              <FolderOpen class="btn-icon" />
              <span>打开目录</span>
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Zap,
  Puzzle,
  RefreshCw,
  Download,
  FolderOpen,
  HardDrive,
  Search,
  Gamepad2,
} from 'lucide-vue-next'
import { electronAPI } from '../native/electron-api'

interface PluginInfo {
  name: string
  description?: string
  author?: string
  link?: string
  path: string
  entryPath: string
  hash: number
  enabled: boolean
  builtin: boolean
}

interface PenguConfigData {
  app: {
    language?: string
    plugins_dir?: string
    league_dir?: string
    disabled_plugins?: string
    activation_mode?: number
  }
  client: {
    use_hotkeys?: boolean
    optimized_client?: boolean
    silent_mode?: boolean
    super_potato?: boolean
    insecure_mode?: boolean
    use_devtools?: boolean
    use_riotclient?: boolean
    use_proxy?: boolean
  }
}

const activeTab = ref<'loader' | 'plugins'>('loader')
const loading = ref(false)
const loadingPlugins = ref(false)
const penguInstalled = ref(false)
const penguBundled = ref(false)
const penguPath = ref('')
const installing = ref(false)
const injectionActive = ref(false)
const togglingInjection = ref(false)
const detectingLeague = ref(false)
const message = ref('')
const messageError = ref(false)

const plugins = ref<PluginInfo[]>([])
const config = ref<PenguConfigData | null>(null)

const refreshStatus = async () => {
  loading.value = true
  message.value = ''
  messageError.value = false
  try {
    const result = await electronAPI.penguPlugin.getStatus()
    if (result.success && result.data) {
      penguInstalled.value = result.data.penguInstalled
      penguBundled.value = result.data.penguBundled ?? false
      penguPath.value = result.data.penguPath || ''

      if (penguInstalled.value) {
        const injection = await electronAPI.penguPlugin.getInjection()
        if (injection.success && injection.data) {
          injectionActive.value = injection.data.active ?? false
        }
        await loadConfig()
      }
    }
  } catch {
    message.value = '检查状态失败'
    messageError.value = true
  } finally {
    loading.value = false
  }
}

const loadConfig = async () => {
  try {
    const result = await electronAPI.penguPlugin.getConfig()
    if (result.success && result.data) {
      config.value = result.data as unknown as PenguConfigData
    }
  } catch {
    // ignore
  }
}

const setConfig = async (section: string, key: string, value: any) => {
  try {
    const result = await electronAPI.penguPlugin.setConfig(section, key, value)
    if (result.success) {
      await loadConfig()
    }
  } catch {
    // ignore
  }
}

const toggleInjection = async () => {
  togglingInjection.value = true
  message.value = ''
  messageError.value = false
  try {
    const result = injectionActive.value
      ? await electronAPI.penguPlugin.disableInjection()
      : await electronAPI.penguPlugin.enableInjection()

    if (result.success) {
      injectionActive.value = !injectionActive.value
      if (injectionActive.value) {
        message.value = '自动加载已启用，正在重启英雄联盟客户端...'
        const restart = await electronAPI.penguPlugin.restartClient()
        if (restart.success) {
          message.value = '自动加载已启用，英雄联盟客户端已重启，插件将自动加载。'
        } else {
          message.value = '自动加载已启用。请手动重启英雄联盟客户端以使插件生效。'
        }
      } else {
        message.value = '自动加载已关闭。下次启动客户端将不再加载插件。'
      }
    } else {
      message.value = result.error || '操作失败'
      messageError.value = true
    }
  } catch {
    message.value = '操作失败'
    messageError.value = true
  } finally {
    togglingInjection.value = false
  }
}

const autoDetectLeague = async () => {
  detectingLeague.value = true
  message.value = ''
  messageError.value = false
  try {
    const result = await electronAPI.penguPlugin.detectLeague()
    if (result.success) {
      message.value = `检测到客户端路径: ${result.data?.leaguePath ?? ''}`
      await loadConfig()
    } else {
      message.value = result.error || '未找到英雄联盟客户端'
      messageError.value = true
    }
  } catch {
    message.value = '检测失败'
    messageError.value = true
  } finally {
    detectingLeague.value = false
  }
}

const refreshPlugins = async () => {
  loadingPlugins.value = true
  try {
    const result = await electronAPI.penguPlugin.getPlugins()
    if (result.success && result.data) {
      plugins.value = result.data as unknown as PluginInfo[]
    } else {
      plugins.value = []
    }
  } catch {
    plugins.value = []
  } finally {
    loadingPlugins.value = false
  }
}

const installPenguLoader = async () => {
  installing.value = true
  message.value = ''
  messageError.value = false
  try {
    const result = await electronAPI.penguPlugin.installPlugin()
    if (result.success) {
      message.value = 'Pengu Loader 安装成功！'
      await refreshStatus()
      await refreshPlugins()
    } else {
      message.value = result.error || '安装失败'
      messageError.value = true
    }
  } catch {
    message.value = '安装失败'
    messageError.value = true
  } finally {
    installing.value = false
  }
}

const togglePlugin = async (plugin: PluginInfo) => {
  try {
    const result = await electronAPI.penguPlugin.togglePlugin(plugin.hash)
    if (result.success) {
      plugin.enabled = result.data?.enabled ?? false
    }
  } catch {
    // ignore
  }
}

const openPluginsFolder = async () => {
  await electronAPI.penguPlugin.openPluginsFolder()
}

onMounted(async () => {
  await refreshStatus()
  await refreshPlugins()
})
</script>

<style scoped>
.pengu-loader-page {
  padding: 0 0 24px 0;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--lol-text, #f0e6d2);
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 13px;
  color: var(--lol-text-dim, #a09b8c);
  margin: 0;
}

/* 页签栏 */
.tab-bar {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid rgba(200, 170, 110, 0.15);
  margin-bottom: 20px;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--lol-text-dim, #a09b8c);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-bottom: -1px;
}

.tab-btn:hover {
  color: var(--lol-gold, #c8aa6e);
}

.tab-btn.active {
  color: var(--lol-gold, #c8aa6e);
  border-bottom-color: var(--lol-gold, #c8aa6e);
}

.tab-icon {
  width: 16px;
  height: 16px;
}

.tab-content {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 卡片通用样式 */
.status-card,
.action-card,
.settings-card {
  background: rgba(1, 10, 19, 0.6);
  border: 1px solid rgba(200, 170, 110, 0.15);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h3,
.action-card h3,
.settings-card h3 {
  font-size: 15px;
  font-weight: 600;
  color: var(--lol-text, #f0e6d2);
  margin: 0;
}

.refresh-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(200, 170, 110, 0.1);
  border: 1px solid rgba(200, 170, 110, 0.2);
  border-radius: 6px;
  color: var(--lol-gold, #c8aa6e);
  cursor: pointer;
  transition: all 0.15s ease;
}

.refresh-btn:hover {
  background: rgba(200, 170, 110, 0.2);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.btn-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 状态网格 */
.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(200, 170, 110, 0.05);
  border-radius: 6px;
}

.status-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  font-size: 20px;
}

.status-icon.ok {
  background: rgba(91, 189, 114, 0.15);
  color: #5bbd72;
}

.status-icon.no {
  background: rgba(231, 76, 60, 0.15);
  color: #e74c3c;
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.status-label {
  font-size: 12px;
  color: var(--lol-text-dim, #a09b8c);
}

.status-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--lol-text, #f0e6d2);
}

.path-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(200, 170, 110, 0.1);
}

.path-label {
  font-size: 11px;
  color: var(--lol-text-dim, #a09b8c);
}

.path-value {
  font-size: 12px;
  color: var(--lol-text, #f0e6d2);
  font-family: monospace;
  word-break: break-all;
}

/* 注入提示 */
.injection-hint {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(200, 170, 110, 0.1);
}

.hint-text {
  font-size: 12px;
  line-height: 1.6;
  margin: 0;
  padding: 10px 12px;
  border-radius: 6px;
  border-left: 3px solid;
}

.hint-text.ok {
  background: rgba(91, 189, 114, 0.08);
  border-left-color: #5bbd72;
  color: rgba(91, 189, 114, 0.9);
}

.hint-text.warn {
  background: rgba(200, 170, 110, 0.08);
  border-left-color: var(--lol-gold, #c8aa6e);
  color: var(--lol-text-dim, #a09b8c);
}

/* 注入开关 */
.injection-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(200, 170, 110, 0.1);
}

.injection-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.injection-label {
  font-size: 13px;
  color: var(--lol-text, #f0e6d2);
  font-weight: 600;
}

.injection-status {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 10px;
  font-weight: 600;
}

.injection-status.active {
  background: rgba(91, 189, 114, 0.15);
  color: #5bbd72;
}

.injection-status.inactive {
  background: rgba(231, 76, 60, 0.15);
  color: #e74c3c;
}

.toggle-injection-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  background: rgba(91, 189, 114, 0.15);
  border: 1px solid rgba(91, 189, 114, 0.35);
  border-radius: 6px;
  color: #5bbd72;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.toggle-injection-btn:hover:not(:disabled) {
  background: rgba(91, 189, 114, 0.25);
}

.toggle-injection-btn.on {
  background: rgba(231, 76, 60, 0.1);
  border-color: rgba(231, 76, 60, 0.3);
  color: #e74c3c;
}

.toggle-injection-btn.on:hover:not(:disabled) {
  background: rgba(231, 76, 60, 0.2);
}

.toggle-injection-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: rgba(200, 170, 110, 0.1);
  border: 1px solid rgba(200, 170, 110, 0.25);
  border-radius: 6px;
  color: var(--lol-gold, #c8aa6e);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-btn:hover:not(:disabled) {
  background: rgba(200, 170, 110, 0.2);
  border-color: rgba(200, 170, 110, 0.4);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.primary {
  background: rgba(91, 189, 114, 0.15);
  border-color: rgba(91, 189, 114, 0.35);
  color: #5bbd72;
}

.action-btn.primary:hover:not(:disabled) {
  background: rgba(91, 189, 114, 0.25);
}

.action-btn.small {
  padding: 6px 12px;
  font-size: 12px;
}

/* 消息条 */
.message-bar {
  margin-top: 14px;
  padding: 10px 14px;
  background: rgba(91, 189, 114, 0.1);
  border: 1px solid rgba(91, 189, 114, 0.25);
  border-radius: 6px;
  font-size: 13px;
  color: #5bbd72;
}

.message-bar.error {
  background: rgba(231, 76, 60, 0.1);
  border-color: rgba(231, 76, 60, 0.25);
  color: #e74c3c;
}

/* ==================== 设置卡片 ==================== */
.settings-note {
  font-size: 12px;
  color: var(--lol-text-dim, #a09b8c);
  margin: 0 0 16px 0;
  font-style: italic;
}

.setting-group {
  margin-bottom: 24px;
}

.setting-group:last-child {
  margin-bottom: 0;
}

.setting-group-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--lol-text-dim, #a09b8c);
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.setting-hint {
  font-size: 11px;
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
  opacity: 0.6;
}

.setting-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(200, 170, 110, 0.05);
  border-radius: 6px;
  transition: all 0.15s ease;
}

.setting-row.clickable {
  cursor: pointer;
}

.setting-row.clickable:hover {
  background: rgba(200, 170, 110, 0.12);
}

.setting-row.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.setting-icon {
  width: 18px;
  height: 18px;
  color: var(--lol-gold, #c8aa6e);
  flex-shrink: 0;
}

.setting-value {
  font-size: 13px;
  color: var(--lol-text, #f0e6d2);
  font-family: monospace;
  word-break: break-all;
}

.setting-row-with-action {
  display: flex;
  gap: 10px;
  align-items: center;
}

.setting-row-with-action .setting-row {
  flex: 1;
}

/* 单选选项 */
.radio-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: rgba(200, 170, 110, 0.03);
  border: 1px solid rgba(200, 170, 110, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.radio-option:hover {
  background: rgba(200, 170, 110, 0.08);
  border-color: rgba(200, 170, 110, 0.2);
}

.radio-option.checked {
  background: rgba(200, 170, 110, 0.1);
  border-color: rgba(200, 170, 110, 0.35);
}

.radio-option input[type="radio"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.radio-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(200, 170, 110, 0.4);
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.15s ease;
}

.radio-option.checked .radio-indicator {
  border-color: var(--lol-gold, #c8aa6e);
}

.radio-option.checked .radio-indicator::after {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--lol-gold, #c8aa6e);
}

.radio-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.radio-caption {
  font-size: 14px;
  font-weight: 600;
  color: var(--lol-text, #f0e6d2);
}

.radio-message {
  font-size: 12px;
  color: var(--lol-text-dim, #a09b8c);
  line-height: 1.5;
}

/* 复选框选项 */
.check-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 4px;
  cursor: pointer;
}

.check-option input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.checkbox-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(200, 170, 110, 0.4);
  border-radius: 4px;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.15s ease;
}

.checkbox-indicator.sm {
  width: 16px;
  height: 16px;
}

.check-option input[type="checkbox"]:checked ~ .checkbox-indicator {
  background: var(--lol-gold, #c8aa6e);
  border-color: var(--lol-gold, #c8aa6e);
}

.check-option input[type="checkbox"]:checked ~ .checkbox-indicator::after {
  content: '';
  width: 5px;
  height: 9px;
  border: solid #010a13;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) translate(-1px, -1px);
}

.check-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.check-caption {
  font-size: 14px;
  font-weight: 600;
  color: var(--lol-text, #f0e6d2);
}

.check-message {
  font-size: 12px;
  color: var(--lol-text-dim, #a09b8c);
  line-height: 1.5;
}

/* 热键列表 */
.hotkey-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  padding-left: 30px;
  transition: opacity 0.15s ease;
}

.hotkey-list.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.hotkey-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--lol-text-dim, #a09b8c);
}

.hotkey-item.disabled {
  text-decoration: line-through;
  opacity: 0.5;
}

.hotkey-item kbd {
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-family: monospace;
  background: rgba(200, 170, 110, 0.1);
  border: 1px solid rgba(200, 170, 110, 0.2);
  color: var(--lol-text, #f0e6d2);
}

/* ==================== Plugins 页签 ==================== */
.plugins-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.plugins-header h3 {
  font-size: 15px;
  font-weight: 600;
  color: var(--lol-text, #f0e6d2);
  margin: 0;
}

.plugins-actions {
  display: flex;
  gap: 8px;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 48px 20px;
  color: var(--lol-text-dim, #a09b8c);
  font-size: 13px;
}

.plugin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.plugin-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: rgba(1, 10, 19, 0.6);
  border: 1px solid rgba(200, 170, 110, 0.15);
  border-radius: 8px;
  transition: all 0.15s ease;
}

.plugin-card:hover {
  border-color: rgba(200, 170, 110, 0.35);
}

.plugin-card.enabled {
  border-color: rgba(91, 189, 114, 0.3);
}

.plugin-card.builtin {
  border-left: 3px solid var(--lol-gold, #c8aa6e);
}

.plugin-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.plugin-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.plugin-checkbox input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.plugin-checkbox input[type="checkbox"]:checked ~ .checkbox-indicator {
  background: var(--lol-gold, #c8aa6e);
  border-color: var(--lol-gold, #c8aa6e);
}

.plugin-checkbox input[type="checkbox"]:checked ~ .checkbox-indicator::after {
  content: '';
  width: 4px;
  height: 8px;
  border: solid #010a13;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) translate(-1px, -1px);
}

.plugin-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--lol-text, #f0e6d2);
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.plugin-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.builtin-badge {
  background: rgba(200, 170, 110, 0.15);
  color: var(--lol-gold, #c8aa6e);
}

.plugin-desc {
  font-size: 12px;
  color: var(--lol-text-dim, #a09b8c);
  margin: 0;
  line-height: 1.5;
  word-break: break-word;
}

.plugin-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--lol-text-dim, #a09b8c);
  flex-wrap: wrap;
}

.plugin-author {
  color: var(--lol-gold, #c8aa6e);
}

.plugin-path {
  font-family: monospace;
  opacity: 0.7;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 20px;
  text-align: center;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: var(--lol-text-dim, #a09b8c);
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 14px;
  font-weight: 600;
  color: var(--lol-text, #f0e6d2);
  margin: 0 0 4px 0;
}

.empty-state span {
  font-size: 12px;
  color: var(--lol-text-dim, #a09b8c);
}

/* 底部操作区 */
.plugins-footer {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 32px 0;
  gap: 20px;
}

.footer-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.footer-text {
  font-size: 13px;
  color: var(--lol-text-dim, #a09b8c);
  margin: 0;
  opacity: 0.7;
}
</style>
