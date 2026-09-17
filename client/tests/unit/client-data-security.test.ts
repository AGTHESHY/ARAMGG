import { describe, expect, it } from 'vitest'
import path from 'node:path'
import {
  getAllowedClientDataOrigins,
  normalizeClientDataPath,
  resolveClientDataFilePath,
  resolveTrustedClientDataUrl,
} from '../../src/shared/client-data-security.ts'

describe('client data path security', () => {
  it('normalizes safe logical paths', () => {
    expect(normalizeClientDataPath('champion-shards\\0.json')).toBe('champion-shards/0.json')
  })

  it.each([
    '',
    '/absolute.json',
    'C:\\outside.json',
    '../outside.json',
    'champion-shards/../../outside.json',
    'champion-shards/.. /outside.json',
    'champion-shards//0.json',
    'champion-shards/NUL.json',
    'champion-shards/0.json:metadata',
    'https://evil.example/data.json',
  ])('rejects unsafe logical path %s', (candidate) => {
    expect(() => normalizeClientDataPath(candidate)).toThrow()
  })

  it('resolves safe files beneath their version directory', () => {
    const root = path.resolve('tmp', 'client-data-version')
    const resolved = resolveClientDataFilePath(root, 'champion-shards/0.json')
    expect(path.relative(root, resolved)).toBe(path.join('champion-shards', '0.json'))
  })
})

describe('client data URL security', () => {
  it('accepts the configured API origin and explicit HTTPS allowlist entries', () => {
    expect(resolveTrustedClientDataUrl(
      '/api/client/v1/config',
      'https://data.example',
      'https://cdn.example'
    )).toBe('https://data.example/api/client/v1/config')
    expect(resolveTrustedClientDataUrl(
      'https://cdn.example/client/manifest.json',
      'https://data.example',
      'https://cdn.example'
    )).toBe('https://cdn.example/client/manifest.json')
    expect(getAllowedClientDataOrigins('https://data.example', 'https://cdn.example'))
      .toEqual(new Set(['https://data.example', 'https://cdn.example']))
  })

  it('rejects cross-origin and insecure production URLs', () => {
    expect(() => resolveTrustedClientDataUrl(
      'https://evil.example/manifest.json',
      'https://data.example'
    )).toThrow(/not allowed/)
    expect(() => resolveTrustedClientDataUrl(
      'http://data.example/manifest.json',
      'https://data.example',
      'http://data.example'
    )).toThrow(/HTTPS/)
  })

  it('allows HTTP only for an explicitly configured localhost origin', () => {
    expect(resolveTrustedClientDataUrl('/config', 'http://localhost:4173'))
      .toBe('http://localhost:4173/config')
  })
})
