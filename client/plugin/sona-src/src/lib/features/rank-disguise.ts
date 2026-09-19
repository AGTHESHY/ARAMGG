import { logger } from '@/index'
import { store } from '@/lib/store'

// ==================== 段位伪装 ====================

export async function applyRankDisguise() {
  const queue = store.get('rankQueue')
  const tier = store.get('rankTier')
  const division = store.get('rankDivision')

  try {
    const res = await fetch('/lol-chat/v1/me')
    if (!res.ok) { logger.error('[RankDisguise] 获取聊天状态失败'); return }
    const me = await res.json()
    me.lol.rankedLeagueTier = tier
    me.lol.rankedLeagueDivision = division
    me.lol.rankedLeagueQueue = queue
    const putRes = await fetch('/lol-chat/v1/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(me),
    })
    if (putRes.ok) {
      logger.info('[RankDisguise] 段位伪装已应用 ✓ %s %s %s', queue, tier, division)
    } else {
      logger.error('[RankDisguise] 应用失败:', await putRes.text())
    }
  } catch (err) {
    logger.error('[RankDisguise] 应用异常:', err)
  }
}

async function removeRankDisguise() {
  try {
    const res = await fetch('/lol-chat/v1/me')
    if (!res.ok) return
    const me = await res.json()
    me.lol.rankedLeagueTier = ''
    me.lol.rankedLeagueDivision = ''
    me.lol.rankedLeagueQueue = ''
    const putRes = await fetch('/lol-chat/v1/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(me),
    })
    if (putRes.ok) logger.info('[RankDisguise] 已恢复真实段位 ✓')
  } catch (err) {
    logger.error('[RankDisguise] 恢复失败:', err)
  }
}

export function updateRankDisguise(enabled: boolean) {
  if (enabled) {
    applyRankDisguise()
  } else {
    removeRankDisguise()
  }
}
