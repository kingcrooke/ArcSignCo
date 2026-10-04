import { describe, expect, it } from 'vitest'
import { checkRowHorizontalOverlap } from './tableGrid'
import type { TextBox } from './overflowCheck'

describe('checkRowHorizontalOverlap', () => {
  it('flags horizontal overlap on the same row', () => {
    const boxes: TextBox[] = [
      { x: 50, y: 400, width: 40, height: 36, label: 'rank' },
      { x: 70, y: 400, width: 30, height: 36, label: 'move' },
    ]
    const r = checkRowHorizontalOverlap(boxes)
    expect(r.ok).toBe(false)
    expect(r.issues[0]).toMatch(/Row overlap/)
  })

  it('passes when columns are separated', () => {
    const boxes: TextBox[] = [
      { x: 50, y: 400, width: 20, height: 36, label: 'rank' },
      { x: 120, y: 400, width: 28, height: 36, label: 'move' },
      { x: 166, y: 400, width: 200, height: 36, label: 'team' },
    ]
    expect(checkRowHorizontalOverlap(boxes).ok).toBe(true)
  })
})
