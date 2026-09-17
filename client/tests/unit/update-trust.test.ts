import { describe, expect, it } from 'vitest'
import {
  normalizeTrustedUpdateFeedUrl,
  parseTrustedPublisherNames,
  parseTrustedUpdateOrigins,
} from '../../src/main/security/update-trust.ts'

describe('automatic update trust policy', () => {
  it('normalizes an allowlisted HTTPS feed directory', () => {
    const origins = parseTrustedUpdateOrigins(['https://updates.example'])
    expect(normalizeTrustedUpdateFeedUrl(
      'https://updates.example/windows/latest.yml?cache=1',
      origins
    )).toBe('https://updates.example/windows/')
  })

  it('rejects a remote-configured origin outside the built-in trust roots', () => {
    const origins = parseTrustedUpdateOrigins(['https://updates.example'])
    expect(() => normalizeTrustedUpdateFeedUrl(
      'https://attacker.example/windows/',
      origins
    )).toThrow(/白名单/)
  })

  it('allows localhost HTTP only for explicit development checks', () => {
    const origins = parseTrustedUpdateOrigins(['http://localhost:4173'], true)
    expect(normalizeTrustedUpdateFeedUrl('http://localhost:4173/feed', origins, true))
      .toBe('http://localhost:4173/feed/')
    expect(() => parseTrustedUpdateOrigins(['http://localhost:4173']))
      .toThrow(/HTTPS/)
  })

  it('deduplicates configured publisher certificate names', () => {
    expect(parseTrustedPublisherNames(['ARAMGG LLC', ' ARAMGG LLC ', '']))
      .toEqual(['ARAMGG LLC'])
  })
})
