<template>
  <section class="config-card">
    <div class="card-header">
      <Settings class="setting-icon" />
      <h3 class="card-title">战绩偏好</h3>
    </div>

    <div class="card-content">
      <div class="sona-integration-notice">
        <p>战绩显示已整合 Sona 插件，注入 LoL 客户端 DOM 显示。</p>
        <p>在客户端内按 <kbd>F1</kbd> 打开 Sona 设置页可管理详细选项（组队大厅增强、选人阶段战绩等）。</p>
      </div>

      <div
        v-for="item in preferenceItems"
        :key="item.key"
        class="setting-row"
      >
        <div class="setting-copy">
          <strong>{{ item.title }}</strong>
          <span>{{ item.description }}</span>
        </div>

        <button
          class="switch-control"
          type="button"
          role="switch"
          :aria-label="item.title"
          :aria-checked="String(preferences[item.key])"
          :class="{ active: preferences[item.key] }"
          :disabled="savingKey === item.key"
          @click="togglePreference(item.key)"
        >
          <span class="switch-thumb"></span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { Settings } from 'lucide-vue-next'
import { electronAPI, hasElectronAPI } from '../native/electron-api.ts'

const preferenceDefinitions = [
  {
    key: 'showTeammateWinrate',
    storeKey: 'teammateWinrate.enabled',
    defaultValue: true,
    title: '选人阶段队友战绩',
    description: '在英雄选择阶段于客户端内直接显示队友的胜率、KDA 和综合评分。',
  },
  {
    key: 'showLobbyStats',
    storeKey: 'lobbyStats.enabled',
    defaultValue: true,
    title: '组队大厅队友战绩',
    description: '在组队大厅于客户端内直接显示队友最近 50 局的胜率、KDA 和综合评分。',
  },
  {
    key: 'showTeammateParticleEffects',
    storeKey: 'teammateWinrate.particleEffects',
    defaultValue: true,
    title: '队友卡片粒子特效',
    description: '根据队友胜率显示不同等级的粒子光效（炽焰、强袭、稳定、动摇、眩晕），关闭后仅显示基础卡片。',
  },
]

const preferenceItems = computed(() =>
  preferenceDefinitions.map((item) => ({
    ...item,
  }))
)

const preferences = reactive(
  preferenceDefinitions.reduce((result, item) => {
    result[item.key] = item.defaultValue
    return result
  }, {})
)
const savingKey = ref('')
const itemByKey = new Map(preferenceDefinitions.map((item) => [item.key, item]))

const loadPreferences = async () => {
  if (!hasElectronAPI()) {
    return
  }

  for (const item of preferenceDefinitions) {
    try {
      const storedValue = await electronAPI.store.get(item.storeKey)
      if (storedValue == null) {
        await electronAPI.store.set(item.storeKey, item.defaultValue)
        preferences[item.key] = item.defaultValue
        continue
      }

      preferences[item.key] = Boolean(storedValue)
    } catch (error) {
      console.warn('读取战绩偏好失败:', item.storeKey, error)
    }
  }

  await syncPluginSettings()
}

const syncPluginSettings = async () => {
  if (!hasElectronAPI()) {
    return
  }
  try {
    const settings = {}
    for (const item of preferenceDefinitions) {
      settings[item.key] = preferences[item.key]
    }
    await electronAPI.penguPlugin.writeSettings(settings)
  } catch (error) {
    console.warn('同步插件设置失败:', error)
  }
}

const togglePreference = async (key) => {
  const item = itemByKey.get(key)
  if (!item) {
    return
  }

  const nextValue = !preferences[key]
  if (!hasElectronAPI()) {
    preferences[key] = nextValue
    return
  }

  savingKey.value = key
  try {
    await electronAPI.store.set(item.storeKey, nextValue)
    preferences[key] = nextValue
    await electronAPI.penguPlugin.writeSettings({ [item.key]: nextValue })
  } catch (error) {
    console.warn('保存战绩偏好失败:', item.storeKey, error)
    preferences[key] = !nextValue
  } finally {
    savingKey.value = ''
  }
}

onMounted(loadPreferences)
</script>

<style scoped>
.config-card {
  height: auto;
  flex: 0 0 auto;
  background:
    linear-gradient(145deg, rgba(31, 43, 53, 0.62), rgba(7, 10, 13, 0.34));
  border: 1px solid var(--lol-border-soft);
  border-radius: 4px;
  padding: 14px;
  overflow: hidden;
  color: var(--lol-ivory);
  box-shadow: inset 0 0 18px rgba(194, 156, 109, 0.04);
}

.card-header,
.setting-row {
  display: flex;
  align-items: center;
}

.card-header {
  gap: 10px;
  padding: 0 0 12px;
}

.setting-icon {
  width: 16px;
  height: 16px;
  color: var(--lol-gold-2);
}

.card-title {
  margin: 0;
  color: var(--lol-gold-2);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.sona-integration-notice {
  padding: 10px 12px;
  border: 1px solid rgba(200, 170, 110, 0.22);
  border-radius: 3px;
  background: rgba(1, 10, 19, 0.45);
}

.sona-integration-notice p {
  margin: 0;
  color: var(--lol-muted);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.5;
}

.sona-integration-notice p + p {
  margin-top: 4px;
}

.sona-integration-notice kbd {
  display: inline-block;
  padding: 1px 5px;
  border: 1px solid rgba(244, 236, 220, 0.18);
  border-radius: 3px;
  background: rgba(4, 15, 24, 0.64);
  color: var(--lol-gold-2);
  font-size: 10px;
  font-family: monospace;
}

.setting-row {
  justify-content: space-between;
  gap: 14px;
}

.setting-copy {
  min-width: 0;
}

.setting-copy strong {
  display: block;
  color: var(--lol-ivory);
  font-size: 13px;
  font-weight: 900;
  line-height: 1.25;
}

.setting-copy span {
  display: block;
  margin-top: 5px;
  color: var(--lol-muted);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.45;
}

.switch-control {
  position: relative;
  width: 42px;
  height: 24px;
  flex: 0 0 auto;
  padding: 2px;
  border: 1px solid rgba(244, 236, 220, 0.12);
  border-radius: 999px;
  background: rgba(4, 15, 24, 0.64);
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease, transform 0.15s ease-out;
}

.switch-control::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 42px;
  height: 40px;
  transform: translate(-50%, -50%);
}

.switch-control:active:not(:disabled) {
  transform: scale(0.96);
}

.switch-control.active {
  border-color: rgba(226, 192, 143, 0.44);
  background: rgba(194, 156, 109, 0.32);
}

.switch-control:disabled {
  opacity: 0.6;
  cursor: wait;
}

.switch-thumb {
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #bacac6;
  transition: transform 0.18s ease, background 0.18s ease;
}

.switch-control.active .switch-thumb {
  transform: translateX(18px);
  background: #f4ecdc;
}
</style>
