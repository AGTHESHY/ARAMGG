import { describe, expect, it } from 'vitest'
import { resolvePerformanceSampleInterval } from '../../src/main/modules/performance-monitor-utils.ts'

describe('performance monitor sampling interval', () => {
  it('uses a low-overhead default for missing or invalid values', () => {
    expect(resolvePerformanceSampleInterval(undefined)).toBe(10000)
    expect(resolvePerformanceSampleInterval('invalid')).toBe(10000)
    expect(resolvePerformanceSampleInterval(0)).toBe(10000)
  })

  it('clamps custom sampling intervals to safe bounds', () => {
    expect(resolvePerformanceSampleInterval(1000)).toBe(5000)
    expect(resolvePerformanceSampleInterval('15000')).toBe(15000)
    expect(resolvePerformanceSampleInterval(120000)).toBe(60000)
  })
})
