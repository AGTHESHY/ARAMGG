// @vitest-environment happy-dom

import { flushPromises, mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, ref } from 'vue'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { ElectronAPI } from '../../src/shared/ipc-contract.ts'
import { usePostGameShare } from '../../src/renderer/composables/use-post-game-share.ts'

afterEach(() => {
  vi.useRealTimers()
  delete window.electronAPI
})

describe('post-game share preferences', () => {
  it('keeps automatic posters closed while preserving manually available poster data', async () => {
    vi.useFakeTimers()
    const listeners = new Map<string, (...args: unknown[]) => void>()
    const getLatest = vi.fn().mockResolvedValue({ success: true })

    window.electronAPI = {
      store: {
        get: vi.fn().mockResolvedValue(false),
        set: vi.fn().mockResolvedValue(undefined),
        delete: vi.fn().mockResolvedValue(undefined),
      },
      postGameShare: {
        getLatest,
      },
      events: {
        on: vi.fn((channel, callback) => {
          listeners.set(channel, callback as (...args: unknown[]) => void)
          return () => listeners.delete(channel)
        }),
      },
    } as unknown as ElectronAPI

    const Host = defineComponent({
      setup() {
        return usePostGameShare(ref(null))
      },
      template: '<span data-open>{{ showPostGameShare }}</span>',
    })
    const i18n = createI18n({
      legacy: false,
      locale: 'zh-CN',
      messages: { 'zh-CN': {} },
    })
    const wrapper = mount(Host, { global: { plugins: [i18n] } })
    const poster = {
      status: 'ready',
      stats: { kills: 10, deaths: 2, assists: 18 },
    }

    await flushPromises()
    listeners.get('game-ended')?.()
    await flushPromises()
    vi.advanceTimersByTime(1500)
    await flushPromises()
    expect(getLatest).toHaveBeenCalledTimes(1)

    listeners.get('post-game-share-ready')?.(poster)
    await flushPromises()
    expect(wrapper.get('[data-open]').text()).toBe('false')

    wrapper.vm.setPostGameShareAutoShowEnabled(true)
    listeners.get('post-game-share-ready')?.(poster)
    await flushPromises()
    expect(wrapper.get('[data-open]').text()).toBe('true')

    wrapper.unmount()
  })

  it('does not restore or show the main window when post-game data is ready', async () => {
    const source = await readFile(
      path.join(process.cwd(), 'src/main/modules/app-config.ts'),
      'utf8',
    )
    const notificationBlock = source.slice(
      source.indexOf('async function prepareAndNotifyPostGameShare'),
      source.indexOf('async function resolveInProgressChampion'),
    )

    expect(notificationBlock).not.toContain('.restore()')
    expect(notificationBlock).not.toContain('.show()')
    expect(notificationBlock).not.toContain('.showInactive()')
  })
})
