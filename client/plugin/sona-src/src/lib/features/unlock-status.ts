import { logger } from '@/index'
import { injector } from '@/lib/InjectorManager'

// ==================== 解锁自定义签名 ====================

function tryUnlockStatusInput(): boolean {
  const statusEl = document.querySelector('.lower-details .status.disabled')
  if (!statusEl) return true

  statusEl.classList.remove('disabled')
  logger.info('Status input unlocked ✓')
  return true
}

let statusUnlockRegistered = false

export function updateUnlockStatus(enabled: boolean) {
  if (enabled && !statusUnlockRegistered) {
    injector.register(tryUnlockStatusInput)
    statusUnlockRegistered = true
    logger.info('Unlock status enabled ✓')
  } else if (!enabled && statusUnlockRegistered) {
    injector.unregister(tryUnlockStatusInput)
    statusUnlockRegistered = false
    logger.info('Unlock status disabled')
  }
}
