import { describe, expect, it } from 'vitest'
import { readFileSync } from 'fs'
import { execFileSync } from 'child_process'
import { detectAugmentRerollButtons } from '../../src/main/image-analyzer.ts'

function readTrackedFixture(path) {
  try {
    return readFileSync(path)
  } catch (error) {
    if (!['EACCES', 'EPERM'].includes(error?.code)) {
      throw error
    }

    return execFileSync('git', ['show', `HEAD:${path}`])
  }
}

describe('augment reroll button gate', () => {
  it('detects active and disabled reroll buttons in demo augment screens', async () => {
    for (const demo of ['docs/demo1.png', 'docs/demo2.png', 'docs/demo3.png', 'docs/demo4.png']) {
      const result = await detectAugmentRerollButtons(readTrackedFixture(demo))

      expect(result.visible, demo).toBe(true)
      expect(result.activeSlots.length, demo).toBeGreaterThanOrEqual(2)
    }
  })
})
