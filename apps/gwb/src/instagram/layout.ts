import { IG } from './fonts'
import type { TextBox } from './overflowCheck'

export interface StackItem {
  text: string
  font: string
  size: number
  color: string
  label: string
  lineHeightMult?: number
}

export function measureStack(
  ctx: CanvasRenderingContext2D,
  items: StackItem[],
): { totalHeight: number; boxes: TextBox[] } {
  const boxes: TextBox[] = []
  let y = 0
  for (const item of items) {
    const lh = item.lineHeightMult ?? 1.25
    ctx.font = `${item.size}px ${item.font}`
    const lines = wrapText(ctx, item.text, IG.width - IG.margin * 2)
    const lineH = item.size * lh
    const blockH = lines.length * lineH
    const maxW = Math.max(
      ...lines.map((l) => ctx.measureText(l).width),
      0,
    )
    boxes.push({
      x: (IG.width - maxW) / 2,
      y,
      width: maxW,
      height: blockH,
      label: item.label,
    })
    y += blockH + IG.gap
  }
  return { totalHeight: y - IG.gap, boxes }
}

export function drawCenteredStack(
  ctx: CanvasRenderingContext2D,
  items: StackItem[],
  offsetY = 0,
): TextBox[] {
  const { totalHeight } = measureStack(ctx, items)
  const startY = (IG.height - totalHeight) / 2 + offsetY
  let y = startY
  const drawn: TextBox[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const lh = item.lineHeightMult ?? 1.25
    ctx.font = `${item.size}px ${item.font}`
    ctx.fillStyle = item.color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    const lines = wrapText(ctx, item.text, IG.width - IG.margin * 2)
    const lineH = item.size * lh
    const maxW = Math.max(
      ...lines.map((l) => ctx.measureText(l).width),
      0,
    )
    const x = IG.width / 2
    lines.forEach((line, li) => {
      ctx.fillText(line, x, y + li * lineH)
    })
    drawn.push({
      x: x - maxW / 2,
      y,
      width: maxW,
      height: lines.length * lineH,
      label: item.label,
    })
    y += lines.length * lineH + IG.gap
  }
  return drawn
}

export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = w
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines.length ? lines : ['']
}
