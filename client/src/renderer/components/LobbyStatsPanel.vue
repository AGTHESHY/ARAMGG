<template>
  <section v-if="visible" class="lobby-panel">
    <header class="panel-header">
      <div class="title-lockup">
        <Users class="panel-icon" />
        <div>
          <p class="section-kicker">Lobby</p>
          <h3>组队大厅战绩</h3>
        </div>
      </div>
      <span class="status-pill" :class="statusClass">{{ statusLabel }}</span>
    </header>

    <div v-if="loading" class="empty-state">
      <LoaderCircle class="empty-icon spinning" />
      <span>正在查询队友战绩...</span>
    </div>

    <div v-else-if="!hasData" class="empty-state">
      <CircleDashed class="empty-icon" />
      <span>{{ emptyMessage }}</span>
    </div>

    <div v-else class="member-list">
      <article
        v-for="member in members"
        :key="member.puuid"
        class="member-card"
        :class="particleEffects ? tierClass(member.winRate) : ''"
      >
        <div class="member-head">
          <strong class="member-name">{{ member.name }}</strong>
          <span class="member-score" v-if="member.score != null">{{ member.score.toFixed(1) }}</span>
        </div>
        <div class="member-stats">
          <div class="stat-block">
            <span class="stat-label">胜率</span>
            <strong :class="rateClass(member.winRate)">{{ formatRate(member.winRate) }}</strong>
            <small v-if="member.games">{{ member.wins }}/{{ member.games }}</small>
          </div>
          <div class="stat-block">
            <span class="stat-label">KDA</span>
            <strong :class="kdaClass(member.kda)">{{ formatKda(member.kda) }}</strong>
            <small v-if="member.games">{{ formatAvg(member.avgKills) }}/{{ formatAvg(member.avgDeaths) }}/{{ formatAvg(member.avgAssists) }}</small>
          </div>
        </div>
        <div v-if="particleEffects" class="tier-indicator" :class="tierClass(member.winRate)"></div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Users, LoaderCircle, CircleDashed } from 'lucide-vue-next'
import type { ElectronEventMap } from '../../shared/ipc-contract.ts'
import { electronAPI, hasElectronAPI } from '../native/electron-api.ts'

type Payload = ElectronEventMap['lobby-stats-updated'][0]
const payload = ref<Payload | null>(null)
const visible = ref(false)
const loading = ref(false)
const particleEffects = ref(true)

const loadParticleEffectsPref = async () => {
  if (!hasElectronAPI()) return
  try {
    const value = await electronAPI.store.get('teammateWinrate.particleEffects')
    particleEffects.value = value != null ? Boolean(value) : true
  } catch {
    // keep default
  }
}

const members = computed(() => payload.value?.members || [])
const hasData = computed(() => members.value.length > 0)
const statusClass = computed(() => {
  if (loading.value) return 'loading'
  if (hasData.value) return 'ready'
  return 'idle'
})
const statusLabel = computed(() => {
  if (loading.value) return '查询中'
  if (hasData.value) return '已更新'
  return '等待组队'
})
const emptyMessage = computed(() => {
  if (!hasElectronAPI()) return 'API 不可用'
  return '未在组队大厅或无队友数据'
})

function formatRate(value: number | null): string {
  return value == null ? '—' : `${Math.round(value * 100)}%`
}

function formatKda(value: number | null): string {
  return value == null ? '—' : value.toFixed(2)
}

function formatAvg(value: number): string {
  return value.toFixed(1)
}

function rateClass(value: number | null): string {
  if (value == null) return 'unknown'
  if (value >= 0.6) return 'high'
  if (value >= 0.5) return 'normal'
  return 'low'
}

function kdaClass(value: number | null): string {
  if (value == null) return 'unknown'
  if (value >= 5) return 'high'
  if (value >= 3) return 'normal'
  return 'low'
}

function tierClass(value: number | null): string {
  if (value == null) return 'tier-none'
  if (value >= 0.7) return 'tier-blazing'
  if (value >= 0.6) return 'tier-strong'
  if (value >= 0.5) return 'tier-normal'
  if (value >= 0.4) return 'tier-shaky'
  return 'tier-dizzy'
}

const unsubscribeStats = electronAPI.events.on('lobby-stats-updated', data => {
  payload.value = data
  visible.value = data.members.length > 0
  loading.value = false
})

const unsubscribePhase = electronAPI.events.on('game-phase-changed', data => {
  if (data.phase !== 'Lobby') {
    visible.value = false
    loading.value = false
  } else {
    loading.value = true
  }
})

onBeforeUnmount(() => { unsubscribeStats(); unsubscribePhase() })
onMounted(loadParticleEffectsPref)
</script>

<style scoped>
.lobby-panel {
  border: 1px solid rgba(60, 74, 71, 0.42);
  border-radius: 4px;
  padding: 14px;
  background: rgba(31, 43, 53, 0.42);
  color: #d7e4f1;
  overflow: hidden;
}
.panel-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.title-lockup { display: flex; align-items: center; gap: 10px; min-width: 0; }
.panel-icon { width: 18px; height: 18px; color: #e2c384; }
.section-kicker { margin: 0 0 3px; color: #e2c384; font-size: 10px; font-weight: 900; }
h3 { margin: 0; color: #d7e4f1; font-size: 15px; font-weight: 900; }
.status-pill { display: inline-flex; align-items: center; min-height: 24px; padding: 0 9px; border: 1px solid rgba(60,74,71,.46); border-radius: 4px; background: rgba(4,15,24,.42); color: #bacac6; font-size: 11px; font-weight: 900; white-space: nowrap; }
.status-pill.ready { border-color: rgba(226,192,143,.32); background: rgba(194,156,109,.12); color: #e2c08f; }
.status-pill.loading, .status-pill.idle { color: #859491; }
.empty-state { min-height: 74px; display: flex; align-items: center; justify-content: center; gap: 8px; border: 1px solid rgba(60,74,71,.28); border-radius: 4px; background: rgba(4,15,24,.32); color: #859491; font-size: 12px; font-weight: 800; }
.empty-icon { width: 15px; height: 15px; }
.spinning { animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.member-list { display: grid; gap: 8px; }
.member-card { position: relative; display: grid; grid-template-columns: 1fr; gap: 8px; padding: 10px 12px; border: 1px solid rgba(60,74,71,.34); border-radius: 4px; background: rgba(17,29,38,.52); overflow: hidden; }
.member-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.member-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #d7e4f1; font-size: 13px; font-weight: 900; }
.member-score { flex: 0 0 auto; color: #e2c384; font-size: 18px; font-weight: 900; }
.member-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.stat-block { display: grid; gap: 2px; }
.stat-label { color: #859491; font-size: 10px; font-weight: 900; }
.stat-block strong { font-size: 16px; }
.stat-block small { color: #8998a4; font-size: 10px; }
.tier-indicator { position: absolute; left: 0; top: 0; bottom: 0; width: 3px; }
.tier-blazing { background: linear-gradient(180deg, #ff3300, #ffaa00); box-shadow: 0 0 8px rgba(255,51,0,.4); }
.tier-strong { background: linear-gradient(180deg, #4a9eff, #7ec8ff); box-shadow: 0 0 8px rgba(74,158,255,.3); }
.tier-normal { background: linear-gradient(180deg, #a09b8c, #5c6b73); }
.tier-shaky { background: linear-gradient(180deg, #8b6914, #a07828); }
.tier-dizzy { background: linear-gradient(180deg, #8b00ff, #4a0080); }
.tier-none { background: rgba(60,74,71,.3); }
.high { color: #58c990; }
.normal { color: #d6b86a; }
.low { color: #ef7474; }
.unknown { color: #8998a4; }
</style>
