import { describe, expect, it } from 'vitest'
import { readFile } from 'node:fs/promises'

describe('renderer content security policy', () => {
  it('delivers frame-ancestors by response header instead of an unsupported meta directive', async () => {
    const [rendererHtml, viteConfig, windowManager] = await Promise.all([
      readFile(new URL('../../src/renderer/index.html', import.meta.url), 'utf8'),
      readFile(new URL('../../electron.vite.config.mjs', import.meta.url), 'utf8'),
      readFile(new URL('../../src/main/modules/window-manager.ts', import.meta.url), 'utf8'),
    ])
    const metaCsp = rendererHtml.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1]

    expect(metaCsp).toBeTruthy()
    expect(metaCsp).not.toContain('frame-ancestors')
    expect(viteConfig).toContain("'Content-Security-Policy': \"frame-ancestors 'none'\"")
    expect(windowManager).toContain('"frame-ancestors \'none\'"')
  })
})
