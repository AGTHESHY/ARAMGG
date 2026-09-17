import { afterEach, describe, expect, it, vi } from 'vitest'

describe('localized augment OCR loading', () => {
  afterEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('does not wait for background locales before matching the current language', async () => {
    const never = new Promise<any>(() => {})
    const loadLocale = vi.fn(async (locale: string) => {
      if (locale !== 'zh-CN') {
        return never
      }

      return {
        locale,
        dataVersion: '16.13.3-zh',
        augments: [{
          id: 1001,
          name: 'Scoped Weapons',
          rarity: 'kGold',
          iconPath: null,
        }],
      }
    })

    vi.doMock('../../src/main/data-loader.ts', () => ({
      DEFAULT_DATA_LOCALE: 'zh-CN',
      SUPPORTED_DATA_LOCALES: [
        { code: 'zh-CN' },
        { code: 'en-US' },
        { code: 'zh-TW' },
      ],
      getDataLocale: () => 'zh-CN',
      loadAugmentBaseForOcrLocale: loadLocale,
      tryNormalizeDataLocale: () => null,
    }))
    vi.doMock('../../src/main/services/lcu/process-auth-discovery.ts', () => ({
      discoverLcuAuthFromProcess: vi.fn(async () => [null, null]),
    }))

    const { matchAugmentDatabase, shutdownImageAnalyzer } = await import('../../src/main/image-analyzer.ts')
    try {
      const result = await Promise.race([
        matchAugmentDatabase('Scoped Weapons'),
        new Promise((_resolve, reject) => {
          setTimeout(() => reject(new Error('OCR waited for background locales')), 100)
        }),
      ])

      expect(result).toMatchObject([{ id: '1001', name: 'Scoped Weapons' }])
      expect(loadLocale).toHaveBeenCalledWith('zh-CN')
      expect(loadLocale).toHaveBeenCalledWith('en-US')
      expect(loadLocale).toHaveBeenCalledWith('zh-TW')
    } finally {
      await shutdownImageAnalyzer()
    }
  })
})
