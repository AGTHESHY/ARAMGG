import { createI18n } from 'vue-i18n'
import { messages, type AppLocale } from './messages'

export const DEFAULT_APP_LOCALE: AppLocale = 'zh-CN'
export const SUPPORTED_APP_LOCALES = Object.freeze(Object.keys(messages) as AppLocale[])

export function normalizeAppLocale(locale: unknown): AppLocale {
  const value = String(locale || '').trim()
  if ((SUPPORTED_APP_LOCALES as readonly string[]).includes(value)) {
    return value as AppLocale
  }

  const lower = value.toLowerCase()
  if (lower === 'zh-tw' || lower === 'zh-hk' || lower === 'zh-hant') {
    return 'zh-TW'
  }
  if (lower.startsWith('en')) {
    return 'en-US'
  }

  return DEFAULT_APP_LOCALE
}

export const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_APP_LOCALE,
  fallbackLocale: DEFAULT_APP_LOCALE,
  messages,
})

export function setAppLocale(locale: unknown): AppLocale {
  const normalized = normalizeAppLocale(locale)
  i18n.global.locale.value = normalized
  if (typeof document !== 'undefined') {
    document.documentElement.lang = normalized
    document.title = translate('display.brand')
  }
  return normalized
}

export function translate(key: string, params?: Record<string, unknown>): string {
  return String(i18n.global.t(key, params || {}))
}
