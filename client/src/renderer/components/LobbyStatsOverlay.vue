<template>
  <section v-if="visible" class="lobby-overlay floating-overlay">
    <header>
      <strong>组队大厅战绩</strong>
      <span>最近 50 局</span>
    </header>
    <div class="member-list">
      <article
        v-for="member in members"
        :key="member.puuid"
        class="member-card"
        :class="particleEffects ? tierClass(member.winRate) : ''"
      >
        <div v-if="particleEffects" class="tier-glow" :class="tierClass(member.winRate)"></div>
        <div class="card-head">
          <span class="name">{{ member.name }}</span>
          <span class="score" v-if="member.score != null">{{ member.score.toFixed(1) }}</span>
        </div>
        <div class="card-stats">
          <div class="stat">
            <span class="stat-label">胜率</span>
            <strong :class="rateClass(member.winRate)">{{ formatRate(member.winRate) }}</strong>
            <small v-if="member.games">{{ member.wins }}/{{ member.games }}</small>
            <small v-else>暂无</small>
          </div>
          <div class="stat">
            <span class="stat-label">KDA</span>
            <strong :class="kdaClass(member.kda)">{{ formatKda(member.kda) }}</strong>
            <small v-if="member.games">{{ formatAvg(member.avgKills) }}/{{ formatAvg(member.avgDeaths) }}/{{ formatAvg(member.avgAssists) }}</small>
            <small v-else>暂无</small>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { ElectronEventMap } from '../../shared/ipc-contract.ts'
import { electronAPI, hasElectronAPI } from '../native/electron-api.ts'

type Payload = ElectronEventMap['lobby-stats-updated'][0]
type Member = Payload['members'][number]

const payload = ref<Payload | null>(null)
const visible = ref(false)
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
})

const unsubscribePhase = electronAPI.events.on('game-phase-changed', data => {
  if (data.phase !== 'Lobby') {
    visible.value = false
    payload.value = null
  }
})

onBeforeUnmount(() => { unsubscribeStats(); unsubscribePhase() })
onMounted(loadParticleEffectsPref)
</script>

<style scoped>
.lobby-overlay {
  width: 100%;
  height: 100%;
  padding: 12px 16px;
  color: #e9dfc5;
  background: linear-gradient(135deg, rgba(7, 13, 20, .97), rgba(18, 34, 45, .96));
  border: 1px solid #806b3c;
  border-radius: 10px;
  box-sizing: border-box;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
header { display: flex; justify-content: space-between; align-items: center; }
header strong { color: #d6b86a; font-size: 14px; }
header span { color: #8998a4; font-size: 11px; }

.member-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  gap: 8px;
}

.member-card {
  position: relative;
  min-width: 0;
  padding: 9px 10px;
  background: rgba(255,255,255,.045);
  border: 1px solid rgba(60,74,71,.34);
  border-radius: 4px;
  display: grid;
  gap: 6px;
  overflow: hidden;
}

.tier-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: .12;
  z-index: 0;
}
.tier-blazing .tier-glow { background: radial-gradient(circle at 50% 0%, rgba(255,51,0,.45), transparent 70%); }
.tier-strong .tier-glow  { background: radial-gradient(circle at 50% 0%, rgba(74,158,255,.35), transparent 70%); }
.tier-normal .tier-glow  { background: radial-gradient(circle at 50% 0%, rgba(160,155,140,.2), transparent 70%); }
.tier-shaky .tier-glow   { background: radial-gradient(circle at 50% 0%, rgba(139,105,20,.25), transparent 70%); }
.tier-dizzy .tier-glow   { background: radial-gradient(circle at 50% 0%, rgba(139,0,255,.3), transparent 70%); }

.member-card.tier-blazing { border-color: rgba(255,85,0,.5); box-shadow: 0 0 6px rgba(255,51,0,.25); }
.member-card.tier-strong  { border-color: rgba(74,158,255,.4); box-shadow: 0 0 6px rgba(74,158,255,.18); }

.card-head { display: flex; align-items: center; justify-content: space-between; gap: 6px; position: relative; z-index: 1; }
.name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; font-weight: 700; }
.score { color: #e2c384; font-size: 16px; font-weight: 900; }

.card-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; position: relative; z-index: 1; }
.stat { display: grid; gap: 1px; }
.stat-label { color: #859491; font-size: 9px; font-weight: 800; }
.stat strong { font-size: 14px; }
.stat small { color: #8998a4; font-size: 9px; }

.high { color: #58c990; }
.normal { color: #d6b86a; }
.low { color: #ef7474; }
.unknown { color: #8998a4; }
</style>
