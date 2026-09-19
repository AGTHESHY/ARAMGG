import { createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { logger } from '@/index'
import { injector } from '@/lib/InjectorManager'
import { ProfileBackgroundPicker } from '@/components/ui/ProfileBackgroundPicker'

// ==================== 生涯背景自定义 ====================

const SONA_PROFILE_BG_ATTR = 'data-sona-profile-bg-hijacked'

/** 生涯背景弹窗的独立 React root */
let profileBgRoot: Root | null = null
let profileBgContainer: HTMLDivElement | null = null

function showProfileBgPicker() {
  if (!profileBgContainer) {
    profileBgContainer = document.createElement('div')
    profileBgContainer.id = 'sona-profile-bg-root'
    document.body.appendChild(profileBgContainer)
    profileBgRoot = createRoot(profileBgContainer)
  }

  const close = () => {
    profileBgRoot?.render(
      createElement(ProfileBackgroundPicker, { open: false, onClose: close }),
    )
  }

  profileBgRoot!.render(
    createElement(ProfileBackgroundPicker, { open: true, onClose: close }),
  )
}

function cleanupProfileBg() {
  if (profileBgRoot) {
    profileBgRoot.unmount()
    profileBgRoot = null
  }
  if (profileBgContainer) {
    profileBgContainer.remove()
    profileBgContainer = null
  }
}

/**
 * 注入任务：在生涯界面接管原生皮肤选择按钮的点击事件
 * 检测 style-profile-skin-picker-button，拦截点击后拉起自定义 Modal
 */
function tryHijackProfileSkinButton(): boolean {
  const btn = document.querySelector('.style-profile-skin-picker-button') as HTMLElement | null
  if (!btn) return true

  if (btn.hasAttribute(SONA_PROFILE_BG_ATTR)) return true

  btn.setAttribute(SONA_PROFILE_BG_ATTR, 'true')

  btn.addEventListener('click', (e) => {
    e.stopPropagation()
    e.stopImmediatePropagation()
    e.preventDefault()
    showProfileBgPicker()
    logger.info('[ProfileBg] 拦截原生按钮点击，打开自定义弹窗')
  }, true)

  logger.info('[ProfileBg] 已接管皮肤选择按钮 ✓')
  return true
}

let profileBgRegistered = false

export function updateCustomProfileBg(enabled: boolean) {
  if (enabled && !profileBgRegistered) {
    injector.register(tryHijackProfileSkinButton)
    profileBgRegistered = true
    logger.info('Custom profile background enabled ✓')
  } else if (!enabled && profileBgRegistered) {
    injector.unregister(tryHijackProfileSkinButton)
    profileBgRegistered = false
    cleanupProfileBg()
    // 清除接管标记，让原生行为恢复
    document.querySelectorAll(`[${SONA_PROFILE_BG_ATTR}]`).forEach((el) => {
      el.removeAttribute(SONA_PROFILE_BG_ATTR)
    })
    logger.info('Custom profile background disabled')
  }
}
