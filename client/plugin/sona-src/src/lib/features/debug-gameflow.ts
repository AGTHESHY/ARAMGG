import { logger } from '@/index'
import { lcu, LcuEventUri } from '@/lib/lcu'
import type { LCUEventMessage, GameflowPhase } from '@/lib/lcu'

// ==================== 调试：Gameflow 阶段日志 ====================

let debugGameflowUnsub: (() => void) | null = null

const PHASE_LABELS: Partial<Record<GameflowPhase, string>> = {
  ReadyCheck: '匹配确认',
  ChampSelect: '英雄选择',
  GameStart: '游戏启动',
  InProgress: '对局进行中',
  Reconnect: '重新连接',
  WaitingForStats: '等待结算',
  PreEndOfGame: '结算准备',
  EndOfGame: '对局结束',
}

export function updateDebugGameflow(enabled: boolean) {
  if (enabled && !debugGameflowUnsub) {
    debugGameflowUnsub = lcu.observe(LcuEventUri.GAMEFLOW_PHASE_CHANGE, (event: LCUEventMessage) => {
      const phase = event.data as GameflowPhase
      const label = PHASE_LABELS[phase]

      logger.info('Gameflow phase → %s%s', phase, label ? ` (${label})` : '')

      if (!label) return

      lcu.getGameflowSession()
        .then((session) => {
          logger.info('=== %s ===', label)
          logger.info('游戏模式: %s | 队列: %s (ID: %d)', session.gameData.queue.gameMode, session.gameData.queue.name, session.gameData.queue.id)
          logger.info('对局 ID: %d | 自定义: %s', session.gameData.gameId, session.gameData.isCustomGame)
          logger.info('地图: %s (ID: %d)', session.map.name, session.map.id)
          logger.info('我方队伍:', session.gameData.teamOne)
          logger.info('对方队伍:', session.gameData.teamTwo)
          if (phase === 'InProgress') {
            logger.info('游戏客户端: running=%s, server=%s:%d', session.gameClient.running, session.gameClient.serverIp, session.gameClient.serverPort)
          }
          logger.info('完整 session: %o', session)

          // 英雄选择阶段：拉取 champ select session 打印队友信息
          if (phase === 'ChampSelect') {
            lcu.getChampSelectSession()
              .then((champSelect) => {
                logger.info('--- 英雄选择详情 ---')
                logger.info('本地玩家 cellId: %d', champSelect.localPlayerCellId)
                champSelect.myTeam.forEach((p, i) => {
                  logger.info('我方 #%d → summonerId: %d, championId: %d, cellId: %d, position: %s', i + 1, p.summonerId, p.championId, p.cellId, p.assignedPosition || '无')
                })
                champSelect.theirTeam.forEach((p, i) => {
                  logger.info('对方 #%d → summonerId: %d, championId: %d, cellId: %d, position: %s', i + 1, p.summonerId, p.championId, p.cellId, p.assignedPosition || '无')
                })
                logger.info('完整 champSelect: %o', champSelect)
              })
              .catch((err) => logger.error('获取英雄选择详情失败:', err))
          }
        })
        .catch((err) => logger.error('获取 %s 对局信息失败:', label, err))
    })
    logger.info('Debug gameflow logging enabled ✓')
  } else if (!enabled && debugGameflowUnsub) {
    debugGameflowUnsub()
    debugGameflowUnsub = null
    logger.info('Debug gameflow logging disabled')
  }
}
