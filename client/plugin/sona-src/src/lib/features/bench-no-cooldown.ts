import { logger } from '@/index'
import { lcu } from '@/lib/lcu'
import { injector } from '@/lib/InjectorManager'

// ==================== 大乱斗无CD换英雄 ====================

const BENCH_HIJACK_ATTR = 'data-sona-bench-hijacked'

/**
 * 从 champion-bench-item 的 background-image 中提取英雄 ID
 * URL 格式: url('/lol-game-data/assets/v1/champion-icons/102.png')
 */
function extractChampionId(item: Element): number | null {
  const iconEl = item.querySelector('.bench-champion-background') as HTMLElement | null
  if (!iconEl) return null
  const bg = iconEl.style.backgroundImage || ''
  const match = bg.match(/champion-icons\/(\d+)\.png/)
  return match ? Number(match[1]) : null
}

/**
 * 注入任务：
 * 1. 移除 on-cooldown 类名和遮罩（视觉）
 * 2. 接管点击事件，直接调 LCU API 换英雄（逻辑）
 */
function tryHijackBenchItems(): boolean {
  const container = document.querySelector('.bench-container')
  if (!container) return true

  // 视觉：移除 on-cooldown 类名和遮罩
  container.querySelectorAll('[class*="on-cooldown"]').forEach((el) => {
    const toRemove = Array.from(el.classList).filter((c) => c.startsWith('on-cooldown'))
    toRemove.forEach((c) => el.classList.remove(c))
    const mask = el.querySelector('.cooldown-mask')
    if (mask instanceof HTMLElement) mask.style.display = 'none'
  })

  // 逻辑：接管未被接管的 bench item 的点击事件
  container.querySelectorAll(`.champion-bench-item:not([${BENCH_HIJACK_ATTR}])`).forEach((item) => {
    // 跳过空位和锁定位
    if (item.classList.contains('empty-bench-item') || item.classList.contains('locked-out')) return

    item.setAttribute(BENCH_HIJACK_ATTR, 'true')

    item.addEventListener('click', (e) => {
      const championId = extractChampionId(item)
      if (!championId) return  // 无法识别英雄，放行原逻辑

      e.stopPropagation()
      e.stopImmediatePropagation()
      e.preventDefault()

      lcu.benchSwap(championId)
        .then(() => logger.info('Bench swap → champion %d ✓', championId))
        .catch((err) => logger.error('Bench swap failed:', err))
    }, true)
  })

  return true
}

let benchNoCooldownRegistered = false

export function updateBenchNoCooldown(enabled: boolean) {
  if (enabled && !benchNoCooldownRegistered) {
    injector.register(tryHijackBenchItems)
    benchNoCooldownRegistered = true
    logger.info('Bench no-cooldown enabled ✓')
  } else if (!enabled && benchNoCooldownRegistered) {
    injector.unregister(tryHijackBenchItems)
    benchNoCooldownRegistered = false
    logger.info('Bench no-cooldown disabled')
  }
}
