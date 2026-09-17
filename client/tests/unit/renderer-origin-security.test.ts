import { afterEach, describe, expect, it } from 'vitest'
import {
  clearTrustedRendererOrigins,
  isTrustedRendererUrl,
  registerTrustedRendererOrigin,
} from '../../src/main/security/renderer-origin.ts'

afterEach(() => {
  clearTrustedRendererOrigins()
})

describe('trusted renderer origins', () => {
  it('accepts registered local renderer routes', () => {
    registerTrustedRendererOrigin('http://127.0.0.1:42100')
    expect(isTrustedRendererUrl('http://127.0.0.1:42100/#/display')).toBe(true)
    expect(isTrustedRendererUrl('http://127.0.0.1:42101/#/display')).toBe(false)
  })

  it('rejects remote and non-http renderer origins', () => {
    expect(() => registerTrustedRendererOrigin('https://example.com')).toThrow(/not trusted/)
    expect(() => registerTrustedRendererOrigin('file:///renderer/index.html')).toThrow(/not trusted/)
  })
})
