import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mkdtemp, readFile, rm } from 'fs/promises'
import os from 'os'
import path from 'path'

let tempRoot = ''
const previousOrigin = process.env.ARAMGG_DATA_API_ORIGIN
const previousOutputDir = process.env.ARAMGG_CLIENT_DATA_DIR

function response(body: string, status = 200): any {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Not Found',
    text: async () => body,
  }
}

function createLocaleResponses(locale: string, dataVersion: string): Map<string, string> {
  const prefix = `https://mock.local/api/client/v1/data/${dataVersion}`
  const files = new Map<string, string>([
    ['augments.json', JSON.stringify({ augments: [{ id: 1, name: `${locale} augment` }] })],
    ['champions.json', JSON.stringify({ champions: [{ id: 1, name: `${locale} champion` }] })],
    ['items.json', JSON.stringify({ items: [{ id: 1, name: `${locale} item` }] })],
    ['champion-shards/index.json', JSON.stringify({ shards: [{ path: 'champion-shards/0.json' }] })],
    ['champion-shards/0.json', JSON.stringify({ champions: {} })],
  ])
  const manifest = JSON.stringify({
    locale,
    dataVersion,
    files: [...files.entries()].map(([filePath, content]) => ({
      path: filePath,
      url: `/api/client/v1/data/${dataVersion}/${filePath}`,
      bytes: Buffer.byteLength(content),
    })),
  })
  const responses = new Map<string, string>([
    [`${prefix}/manifest.json`, manifest],
  ])
  for (const [filePath, content] of files) {
    responses.set(`${prefix}/${filePath}`, content)
  }
  return responses
}

describe('multi-locale client-data bundle preparation', () => {
  beforeEach(async () => {
    vi.resetModules()
    vi.unstubAllGlobals()
    tempRoot = await mkdtemp(path.join(os.tmpdir(), 'aramgg-client-bundle-'))
    process.env.ARAMGG_DATA_API_ORIGIN = 'https://mock.local'
    process.env.ARAMGG_CLIENT_DATA_DIR = tempRoot
  })

  afterEach(async () => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.resetModules()
    if (previousOrigin == null) {
      delete process.env.ARAMGG_DATA_API_ORIGIN
    } else {
      process.env.ARAMGG_DATA_API_ORIGIN = previousOrigin
    }
    if (previousOutputDir == null) {
      delete process.env.ARAMGG_CLIENT_DATA_DIR
    } else {
      process.env.ARAMGG_CLIENT_DATA_DIR = previousOutputDir
    }
    await rm(tempRoot, { recursive: true, force: true })
  })

  it('writes independent pointers and version directories for every supported locale', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const localeVersions = new Map([
      ['zh-CN', '16.13.3-zh'],
      ['en-US', '16.13.3-en'],
      ['zh-TW', '16.13.3-tw'],
    ])
    const bodies = new Map<string, string>()

    for (const [locale, dataVersion] of localeVersions) {
      const configUrl = locale === 'zh-CN'
        ? 'https://mock.local/api/client/v1/config'
        : `https://mock.local/api/client/v1/config?locale=${locale}`
      bodies.set(configUrl, JSON.stringify({
        locale,
        dataVersion,
        manifest: `/api/client/v1/data/${dataVersion}/manifest.json`,
      }))
      for (const [url, body] of createLocaleResponses(locale, dataVersion)) {
        bodies.set(url, body)
      }
    }

    vi.stubGlobal('fetch', vi.fn(async (input: any) => {
      const url = String(input)
      return bodies.has(url) ? response(bodies.get(url)!) : response('{}', 404)
    }))

    const {
      SUPPORTED_CLIENT_DATA_LOCALES,
      bundleLocale,
      getLocalePointerFileName,
      getLocaleVersionRelativePath,
    } = await import('../../scripts/fetch-client-data.mjs')

    for (const locale of SUPPORTED_CLIENT_DATA_LOCALES) {
      const dataVersion = localeVersions.get(locale)!
      const pointer = await bundleLocale(locale)
      expect(pointer).toMatchObject({ locale, dataVersion, bundledShardCount: 1 })

      const pointerPath = path.join(tempRoot, getLocalePointerFileName(locale))
      const versionDir = path.join(tempRoot, getLocaleVersionRelativePath(locale, dataVersion))
      expect(JSON.parse(await readFile(pointerPath, 'utf8'))).toMatchObject({ locale, dataVersion })
      expect(JSON.parse(await readFile(path.join(versionDir, 'manifest.json'), 'utf8'))).toMatchObject({
        locale,
        dataVersion,
      })
      expect(JSON.parse(await readFile(path.join(versionDir, 'augments.json'), 'utf8')))
        .toMatchObject({ augments: [{ name: `${locale} augment` }] })
    }

    const output = log.mock.calls.flat().join('\n')
    expect(output).toContain('[client-data] [en-US] progress')
    expect(output).toContain('[client-data] [zh-TW] progress 6/6 (100.0%)')
    expect(output).toContain('reason=downloaded')
  })

  it('rejects manifest paths that escape the locale version directory', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    const dataVersion = '16.13.3-malicious'
    const configUrl = 'https://mock.local/api/client/v1/config'
    const manifestUrl = `https://mock.local/api/client/v1/data/${dataVersion}/manifest.json`
    const bodies = new Map<string, string>([
      [configUrl, JSON.stringify({
        locale: 'zh-CN',
        dataVersion,
        manifest: `/api/client/v1/data/${dataVersion}/manifest.json`,
      })],
      [manifestUrl, JSON.stringify({
        locale: 'zh-CN',
        dataVersion,
        files: [{
          path: 'champion-shards/../../../../outside.json',
          url: `/api/client/v1/data/${dataVersion}/outside.json`,
        }],
      })],
    ])

    vi.stubGlobal('fetch', vi.fn(async (input: any) => {
      const url = String(input)
      return bodies.has(url) ? response(bodies.get(url)!) : response('{}', 404)
    }))

    const { bundleLocale } = await import('../../scripts/fetch-client-data.mjs')
    await expect(bundleLocale('zh-CN')).rejects.toThrow(/unsafe segment/)
  })
})
