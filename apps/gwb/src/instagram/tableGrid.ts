import type { TextBox } from './overflowCheck'

/** Fixed column anchors on 1080px canvas (shared by standings + power). */
export const TABLE_GRID = {
  rankRight: 130,
  moveLeft: 160,
  moveMaxWidth: 90,
  moveRight: 250,
  teamLeft: 290,
  scoreRight: 1000,
}

export function scoreRightX(): number {
  return TABLE_GRID.scoreRight
}

export function teamMaxWidthForPower(): number {
  return TABLE_GRID.scoreRight - TABLE_GRID.teamLeft - 100
}

/** Standings-only columns (no movement column). */
export const STANDINGS_GRID = {
  rankRight: 130,
  teamLeft: 170,
  recordRight: 820,
  scoreRight: 1000,
}

export interface CellDraw {
  text: string
  font: string
  color: string
  align: 'left' | 'right' | 'center'
  x: number
  y: number
  maxWidth?: number
  label: string
  rowHeight: number
}

/** Measure bounding box using the same rules as canvas fillText. */
export function measureTextBox(
  ctx: CanvasRenderingContext2D,
  cell: Omit<CellDraw, 'color' | 'label'> & { label?: string },
): TextBox {
  ctx.font = cell.font
  let text = cell.text
  if (cell.maxWidth && ctx.measureText(text).width > cell.maxWidth) {
    while (text.length > 1 && ctx.measureText(`${text}…`).width > cell.maxWidth) {
      text = text.slice(0, -1)
    }
    text = `${text}…`
  }
  const width = ctx.measureText(text).width
  let x = cell.x
  if (cell.align === 'right') x = cell.x - width
  else if (cell.align === 'center') x = cell.x - width / 2
  return {
    x,
    y: cell.y,
    width,
    height: cell.rowHeight,
    label: cell.label ?? 'cell',
  }
}

export function drawCell(
  ctx: CanvasRenderingContext2D,
  cell: CellDraw,
): TextBox {
  const box = measureTextBox(ctx, cell)
  ctx.font = cell.font
  ctx.fillStyle = cell.color
  ctx.textBaseline = 'top'
  ctx.textAlign = cell.align
  let text = cell.text
  if (cell.maxWidth && ctx.measureText(text).width > cell.maxWidth) {
    while (text.length > 1 && ctx.measureText(`${text}…`).width > cell.maxWidth) {
      text = text.slice(0, -1)
    }
    text = `${text}…`
  }
  ctx.fillText(text, cell.x, cell.y)
  return { ...box, label: cell.label }
}

/** Fail if any two boxes on the same row overlap horizontally. */
export function checkRowHorizontalOverlap(boxes: TextBox[]): {
  ok: boolean
  issues: string[]
} {
  const issues: string[] = []
  const rows = new Map<number, TextBox[]>()
  for (const b of boxes) {
    const key = Math.round(b.y)
    const list = rows.get(key) ?? []
    list.push(b)
    rows.set(key, list)
  }
  for (const [, rowBoxes] of rows) {
    for (let i = 0; i < rowBoxes.length; i++) {
      for (let j = i + 1; j < rowBoxes.length; j++) {
        const a = rowBoxes[i]
        const b = rowBoxes[j]
        const yOverlap =
          a.y < b.y + b.height && b.y < a.y + a.height
        if (!yOverlap) continue
        const xOverlap = a.x < b.x + b.width && b.x < a.x + a.width
        if (xOverlap) {
          issues.push(
            `Row overlap: ${a.label} and ${b.label} at y≈${a.y}`,
          )
        }
      }
    }
  }
  return { ok: issues.length === 0, issues }
}

export function mergeOverflow(
  ...results: { ok: boolean; issues: string[] }[]
): { ok: boolean; issues: string[] } {
  const issues = results.flatMap((r) => r.issues)
  return { ok: results.every((r) => r.ok), issues }
}
