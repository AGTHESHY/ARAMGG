import { injector } from '@/lib/InjectorManager'

const SOCIAL_SCREEN_SELECTOR = 'div.screen-root[data-screen-name="social"]'
const GLASS_ATTR = 'data-sona-social-glass'
const STYLE_ATTR = 'data-sona-social-glass-style'

export interface BeautifyGlassConfig {
  blur: number
  opacity: number
}

let glassConfig: BeautifyGlassConfig = {
  blur: 14,
  opacity: 28,
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function getSocialGlassStyleText(): string {
  const blur = clamp(glassConfig.blur, 0, 40)
  const opacity = clamp(glassConfig.opacity, 0, 100) / 100

  return `
    div.screen-root[data-screen-name="social"][${GLASS_ATTR}="true"] {
      background: transparent !important;
    }

    div.screen-root[data-screen-name="social"][${GLASS_ATTR}="true"] .lol-social-sidebar.ember-view {
      background: rgba(1, 10, 19, ${opacity}) !important;
      backdrop-filter: blur(${blur}px) !important;
      -webkit-backdrop-filter: blur(${blur}px) !important;
      box-shadow: inset 1px 0 0 rgba(200, 170, 110, 0.12) !important;
    }
  `
}

function refreshSocialGlassStyles() {
  document.querySelectorAll<HTMLStyleElement>(`style[${STYLE_ATTR}]`).forEach((style) => {
    style.textContent = getSocialGlassStyleText()
  })
}

function ensureSocialGlassStyle(socialScreen: HTMLElement) {
  let style = socialScreen.querySelector<HTMLStyleElement>(`style[${STYLE_ATTR}]`)
  if (!style) {
    style = document.createElement('style')
    style.setAttribute(STYLE_ATTR, 'true')
    socialScreen.prepend(style)
  }

  style.textContent = getSocialGlassStyleText()
}

function tryApplySocialSidebarGlass(): boolean {
  const socialScreen = document.querySelector<HTMLElement>(SOCIAL_SCREEN_SELECTOR)
  if (!socialScreen) return true

  socialScreen.setAttribute(GLASS_ATTR, 'true')
  socialScreen.style.setProperty('background', 'transparent', 'important')
  ensureSocialGlassStyle(socialScreen)

  return true
}

let socialGlassRegistered = false

export function initSocialSidebarGlass() {
  if (socialGlassRegistered) return

  socialGlassRegistered = true
  injector.register(tryApplySocialSidebarGlass)
}

export function updateSocialSidebarGlassConfig(config: BeautifyGlassConfig) {
  glassConfig = config
  refreshSocialGlassStyles()
  if (socialGlassRegistered) {
    tryApplySocialSidebarGlass()
  }
}
