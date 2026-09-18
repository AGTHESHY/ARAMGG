<template>
  <section class="skin-center-panel">
    <header class="panel-header">
      <div class="title-lockup">
        <p class="section-kicker">Skin Center</p>
        <h3>皮肤中心</h3>
      </div>
    </header>

    <nav class="skin-subnav">
      <button
        v-for="tab in subTabs"
        :key="tab.id"
        class="subnav-item"
        :class="{ active: activeTab === tab.id }"
        type="button"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </nav>

    <div class="skin-subcontent">
      <SkinBrowser v-if="activeTab === 'browser'" />
      <SkinMods v-else-if="activeTab === 'mods'" />
      <SkinHistory v-else-if="activeTab === 'random'" />
      <SkinParty v-else-if="activeTab === 'party'" />
      <ClientDecorations v-else-if="activeTab === 'decorations'" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SkinBrowser from './SkinBrowser.vue'
import SkinMods from './SkinMods.vue'
import SkinHistory from './SkinHistory.vue'
import SkinParty from './SkinParty.vue'
import ClientDecorations from './ClientDecorations.vue'

const subTabs = [
  { id: 'browser', label: '皮肤与炫彩' },
  { id: 'mods', label: '自定义模组' },
  { id: 'random', label: '随机与历史' },
  { id: 'party', label: '组队共享' },
  { id: 'decorations', label: '客户端装饰' },
] as const

const activeTab = ref<typeof subTabs[number]['id']>('browser')
</script>

<style scoped>
.skin-center-panel {
  padding: 16px;
  border: 1px solid rgba(226, 195, 132, .2);
  background: rgba(7, 20, 29, .78);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.panel-header h3 {
  margin: 3px 0 0;
  font-size: 15px;
  color: #edf5fb;
}

.section-kicker {
  margin: 0;
  color: #caa86d;
  font-size: 10px;
  letter-spacing: .14em;
}

.skin-subnav {
  display: flex;
  gap: 4px;
  padding: 3px;
  margin-bottom: 16px;
  background: #07131b;
  flex-wrap: wrap;
}

.subnav-item {
  border: 0;
  background: transparent;
  color: #80909d;
  padding: 7px 14px;
  cursor: pointer;
  font-size: 12px;
  transition: background 120ms ease, color 120ms ease;
  border-radius: 2px;
}

.subnav-item.active {
  background: #263541;
  color: #e6c58e;
}

.subnav-item:hover:not(.active) {
  color: #aab8c2;
}

.skin-subcontent {
  min-height: 400px;
}

.placeholder-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #71818d;
  font-size: 13px;
}
</style>
