import type { Locale, SnapshotInput } from './schema.js'

export function demoSnapshot(locale: Locale, dataVersion = 'demo.1'): SnapshotInput {
  const names = {
    'zh-CN': ['演示英雄（非真实统计）', '演示强化', '演示装备'],
    'en-US': ['Demo champion (synthetic stats)', 'Demo augment', 'Demo item'],
    'zh-TW': ['示範英雄（非真實統計）', '示範強化', '示範裝備'],
  }[locale]
  const stats = { games: 10, wins: 5, winRate: 0.5, pickRate: 0.1 }
  const champion = { id: 8, name: names[0], alias: 'Vladimir', stats }
  return {
    locale, dataVersion, gamePatch: 'demo', source: 'demo',
    files: {
      'champions.json': { champions: [champion] },
      'augments.json': { augments: [{ id: 1001, name: names[1], rarity: 'gold' }] },
      'items.json': { items: [{ id: 6653, name: names[2], description: 'Development fixture only' }] },
      'champion-shards/index.json': { shards: [{ path: 'champion-shards/0.json', championIds: [8] }] },
      'champion-shards/0.json': { champions: { 8: { champion, builds: [{ stats, coreItems: [{ items: [6653] }] }], augments: [{ id: 1001, stats }] } } },
    },
  }
}
