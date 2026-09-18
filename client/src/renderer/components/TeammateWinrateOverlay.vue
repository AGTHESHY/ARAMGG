<template>
  <section v-if="visible" class="teammate-overlay floating-overlay">
    <header>
      <strong>队友战绩</strong>
      <span>当前模式 · 最近 50 局</span>
    </header>
    <div class="teammate-list">
      <article
        v-for="entry in payload?.entries"
        :key="entry.cellId"
        class="teammate-card"
        :class="tierClass(entry.winRate)"
        @click="onTeammateClick(entry)"
      >
        <div class="tier-glow" :class="tierClass(entry.winRate)"></div>
        <div class="card-head">
          <span class="name">{{ entry.name }}</span>
          <span class="score" v-if="entry.score != null">{{ entry.score.toFixed(1) }}</span>
        </div>
        <div class="card-stats">
          <div class="stat">
            <span class="stat-label">胜率</span>
            <strong :class="rateClass(entry.winRate)">{{ formatRate(entry.winRate) }}</strong>
            <small v-if="entry.games">{{ entry.wins }}/{{ entry.games }}</small>
            <small v-else>暂无</small>
          </div>
          <div class="stat">
            <span class="stat-label">KDA</span>
            <strong :class="kdaClass(entry.kda)">{{ formatKda(entry.kda) }}</strong>
            <small v-if="entry.games">{{ formatAvg(entry.avgKills) }}/{{ formatAvg(entry.avgDeaths) }}/{{ formatAvg(entry.avgAssists) }}</small>
            <small v-else>暂无</small>
          </div>
        </div>
        <div v-if="entry.championId" class="champion-hint">
          <span>英雄 ID: {{ entry.championId }}</span>
        </div>
      </article>
    </div>
    <div v-if="swapping" class="swap-feedback">
      <LoaderCircle class="spinning" :size="12" />
      <span>正在查询战绩...</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { LoaderCircle } from 'lucide-vue-next'
import type { ElectronEventMap } from '../../shared/ipc-contract.ts'
import { electronAPI, hasElectronAPI } from '../native/electron-api.ts'

type Payload = ElectronEventMap['teammate-winrate-updated'][0]
type Entry = Payload['entries'][number]

const payload = ref<Payload | null>(null)
const visible = ref(false)
const swapping = ref(false)

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

async function onTeammateClick(entry: Entry) {
  if (!hasElectronAPI() || swapping.value) return
  swapping.value = true
  try {
    await electronAPI.matchHistory.queryCurrent(entry.name || String(entry.cellId))
  } catch {
    // silently ignore — the match history panel handles its own error display
  } finally {
    swapping.value = false
  }
}

const unsubscribeUpdate = electronAPI.events.on('teammate-winrate-updated', data => {
  payload.value = data
  visible.value = data.entries.length > 0
})
const unsubscribePhase = electronAPI.events.on('game-phase-changed', data => {
  if (data.phase !== 'ChampSelect') visible.value = false
})

onBeforeUnmount(() => { unsubscribeUpdate(); unsubscribePhase() })
</script>

<style scoped>
.teammate-overlay {
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

.teammate-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.teammate-card {
  position: relative;
  min-width: 0;
  padding: 9px 10px;
  background: rgba(255,255,255,.045);
  border: 1px solid rgba(60,74,71,.34);
  border-radius: 4px;
  display: grid;
  gap: 6px;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 150ms ease-out, background 150ms ease-out;
}
.teammate-card:hover {
  background: rgba(255,255,255,.07);
  border-color: rgba(226,192,143,.32);
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

.teammate-card.tier-blazing { border-color: rgba(255,85,0,.5); box-shadow: 0 0 6px rgba(255,51,0,.25); }
.teammate-card.tier-strong  { border-color: rgba(74,158,255,.4); box-shadow: 0 0 6px rgba(74,158,255,.18); }

.card-head { display: flex; align-items: center; justify-content: space-between; gap: 6px; position: relative; z-index: 1; }
.name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; font-weight: 700; }
.score { color: #e2c384; font-size: 16px; font-weight: 900; }

.card-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; position: relative; z-index: 1; }
.stat { display: grid; gap: 1px; }
.stat-label { color: #859491; font-size: 9px; font-weight: 800; }
.stat strong { font-size: 14px; }
.stat small { color: #8998a4; font-size: 9px; }

.champion-hint { position: relative; z-index: 1; }
.champion-hint span { color: #6a7a7c; font-size: 9px; }

.swap-feedback {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #8998a4;
  font-size: 10px;
}
.spinning { animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.high { color: #58c990; }
.normal { color: #d6b86a; }
.low { color: #ef7474; }
.unknown { color: #8998a4; }
</style>
