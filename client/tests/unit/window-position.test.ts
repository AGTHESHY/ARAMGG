import { describe, expect, it } from 'vitest'
import {
  fitWindowPositionToWorkArea,
  parseWindowPosition,
} from '../../src/main/modules/window-position.ts'

describe('window position persistence', () => {
  it('accepts finite saved coordinates and rejects invalid values', () => {
    expect(parseWindowPosition({ x: 123.4, y: -45.6 })).toEqual({ x: 123, y: -46 })
    expect(parseWindowPosition({ x: '123', y: 45 })).toBeNull()
    expect(parseWindowPosition({ x: Number.NaN, y: 45 })).toBeNull()
  })

  it('keeps a saved position visible when the display work area changes', () => {
    const workArea = { x: -1920, y: 0, width: 1920, height: 1040 }
    const size = { width: 360, height: 640 }

    expect(fitWindowPositionToWorkArea({ x: -2500, y: -100 }, size, workArea))
      .toEqual({ x: -1920, y: 0 })
    expect(fitWindowPositionToWorkArea({ x: 500, y: 900 }, size, workArea))
      .toEqual({ x: -360, y: 400 })
  })
})
