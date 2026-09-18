<template>
  <section v-if="visible" class="teammate-overlay">
    <header><strong>队友近期胜率</strong><span>当前模式 · 最近 50 局</span></header>
    <div class="teammate-list">
      <article v-for="entry in payload?.entries" :key="entry.cellId">
        <span class="name">{{ entry.name }}</span>
        <strong :class="rateClass(entry.winRate)">{{ formatRate(entry.winRate) }}</strong>
        <small v-if="entry.games">{{ entry.wins }}/{{ entry.games }}</small>
        <small v-else>暂无数据</small>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import type { ElectronEventMap } from '../../shared/ipc-contract.ts'
import { electronAPI } from '../native/electron-api.ts'

type Payload = ElectronEventMap['teammate-winrate-updated'][0]
const payload = ref<Payload | null>(null)
const visible = ref(false)

function formatRate(value: number | null): string {
  return value == null ? '—' : `${Math.round(value * 100)}%`
}

function rateClass(value: number | null): string {
  if (value == null) return 'unknown'
  if (value >= 0.55) return 'high'
  if (value < 0.45) return 'low'
  return 'normal'
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
.teammate-overlay { width: 100%; height: 100%; padding: 12px 16px; color: #e9dfc5; background: linear-gradient(135deg, rgba(7, 13, 20, .97), rgba(18, 34, 45, .96)); border: 1px solid #806b3c; border-radius: 10px; box-sizing: border-box; pointer-events: none; }
header { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
header strong { color:#d6b86a; font-size:15px; } header span { color:#8998a4; font-size:12px; }
.teammate-list { display:grid; grid-template-columns:repeat(4, minmax(0, 1fr)); gap:8px; }
article { min-width:0; padding:9px 10px; background:rgba(255,255,255,.045); border-left:3px solid #536a78; border-radius:4px; display:grid; grid-template-columns:1fr auto; gap:3px 8px; }
.name { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:13px; } article strong { font-size:17px; }
small { color:#8998a4; font-size:11px; }.high{color:#58c990}.normal{color:#d6b86a}.low{color:#ef7474}.unknown{color:#8998a4}
</style>
