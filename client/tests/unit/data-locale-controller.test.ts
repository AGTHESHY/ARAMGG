import { describe, expect, it, vi } from 'vitest'
import { changeDataLocale } from '../../src/main/modules/data-locale-controller.ts'

describe('data locale change transaction', () => {
  it('prepares the exact locale before persisting, activating, and notifying', async () => {
    const calls: string[] = []
    const result = await changeDataLocale('en-US', {
      prepare: vi.fn(async (locale) => {
        calls.push(`prepare:${locale}`)
        return { locale, dataVersion: '16.13.3-en' }
      }),
      persist: vi.fn((locale) => calls.push(`persist:${locale}`)),
      activate: vi.fn((locale) => calls.push(`activate:${locale}`)),
      notify: vi.fn(({ locale }) => calls.push(`notify:${locale}`)),
    })

    expect(result).toEqual({ locale: 'en-US', dataVersion: '16.13.3-en' })
    expect(calls).toEqual([
      'prepare:en-US',
      'persist:en-US',
      'activate:en-US',
      'notify:en-US',
    ])
  })

  it('does not mutate state when preparation fails or falls back to another locale', async () => {
    const persist = vi.fn()
    const activate = vi.fn()
    const notify = vi.fn()

    await expect(changeDataLocale('en-US', {
      prepare: vi.fn(async () => ({ locale: 'zh-CN', dataVersion: '16.13.3' })),
      persist,
      activate,
      notify,
    })).rejects.toThrow('effective locale is zh-CN')

    expect(persist).not.toHaveBeenCalled()
    expect(activate).not.toHaveBeenCalled()
    expect(notify).not.toHaveBeenCalled()
  })
})
