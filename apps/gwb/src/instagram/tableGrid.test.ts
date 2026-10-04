import { describe, expect, it } from 'vitest'
import {
  checkRowHorizontalOverlap,
  measureTextBox,
  TABLE_GRID,
} from './tableGrid'

function mockCtx(widthByText: Record<string, number>, defaultWidth = 12) {
  const ctx = {
    font: '',
    measureText(s: string) {
      return { width: widthByText[s] ?? s.length * defaultWidth }
    },
  }
  return ctx as CanvasRenderingContext2D
}

describe('TABLE_GRID columns', () => {
  it('reserves gap between rank end and move start', () => {
    expect(TABLE_GRID.moveLeft - TABLE_GRID.rankRight).toBe(30)
    expect(TABLE_GRID.teamLeft - TABLE_GRID.moveRight).toBe(40)
  })
})

describe('measureTextBox + row overlap', () => {
  it('fails on old overlapping rank/move layout', () => {
    const ctx = mockCtx({ '10': 36, '▼ 1': 42 })
    const y = 400
    const rowH = 46
    const rankBox = measureTextBox(ctx, {
      text: '10',
      font: '600 36px Inter',
      align: 'right',
      x: TABLE_GRID.rankRight,
      y,
      rowHeight: rowH,
      label: 'rank',
    })
    const badMove = measureTextBox(ctx, {
      text: '▼ 1',
      font: '36px Inter',
      align: 'left',
      x: 118,
      y,
      rowHeight: rowH,
      label: 'move-bad',
    })
    expect(checkRowHorizontalOverlap([rankBox, badMove]).ok).toBe(false)
  })

  it('passes with fixed column anchors', () => {
    const ctx = mockCtx({ '10': 36, '▼ 1': 48, '3.0.4': 72 })
    const y = 400
    const rowH = 46
    const rankBox = measureTextBox(ctx, {
      text: '10',
      font: '600 36px Inter',
      align: 'right',
      x: TABLE_GRID.rankRight,
      y,
      rowHeight: rowH,
      label: 'rank',
    })
    const moveBox = measureTextBox(ctx, {
      text: '▼ 1',
      font: '36px Inter',
      align: 'left',
      x: TABLE_GRID.moveLeft,
      y,
      rowHeight: rowH,
      maxWidth: TABLE_GRID.moveMaxWidth,
      label: 'move',
    })
    const teamBox = measureTextBox(ctx, {
      text: '3.0.4',
      font: '600 36px Inter',
      align: 'left',
      x: TABLE_GRID.teamLeft,
      y,
      rowHeight: rowH,
      label: 'team',
    })
    expect(checkRowHorizontalOverlap([rankBox, moveBox, teamBox]).ok).toBe(true)
    expect(moveBox.x + moveBox.width).toBeLessThanOrEqual(TABLE_GRID.moveRight)
    expect(teamBox.x).toBeGreaterThanOrEqual(TABLE_GRID.teamLeft)
  })
})
