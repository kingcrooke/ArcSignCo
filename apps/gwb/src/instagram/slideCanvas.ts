import { IG, loadIgFonts } from './fonts'
import type { TextBox } from './overflowCheck'
import { checkSlideOverflow, combineOverflowResults } from './overflowCheck'
import { checkRowHorizontalOverlap } from './tableGrid'
import { wrapText } from './layout'

export interface SlideHeader {
  hero: string
  label: string
}

export function createIgContext(): CanvasRenderingContext2D {
  const canvas = document.createElement('canvas')
  canvas.width = IG.width
  canvas.height = IG.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unsupported')
  ctx.fillStyle = IG.bg
  ctx.fillRect(0, 0, IG.width, IG.height)
  return ctx
}

export function canvasToBlob(ctx: CanvasRenderingContext2D): Promise<Blob> {
  return new Promise((resolve, reject) => {
    ctx.canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG failed'))), 'image/png')
  })
}

function measureHeader(_header: SlideHeader): {
  heroH: number
  labelH: number
  total: number
} {
  const heroH = IG.heroSize * 1.32
  const labelH = IG.labelSize * 1.28
  const total = heroH + IG.gap + labelH
  return { heroH, labelH, total }
}

function drawHeader(
  ctx: CanvasRenderingContext2D,
  header: SlideHeader,
  topY: number,
): TextBox[] {
  const boxes: TextBox[] = []
  const cx = IG.width / 2
  const contentW = IG.width - IG.margin * 2

  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.font = `${IG.heroSize}px Anton`
  ctx.fillStyle = IG.accent
  const heroLines = wrapText(ctx, header.hero, contentW)
  const heroLh = IG.heroSize * 1.32
  let y = topY
  heroLines.forEach((line, i) => {
    ctx.fillText(line, cx, y + i * heroLh)
  })
  const heroW = Math.max(...heroLines.map((l) => ctx.measureText(l).width), 0)
  boxes.push({
    x: cx - heroW / 2,
    y: topY,
    width: heroW,
    height: heroLines.length * heroLh,
    label: 'hero',
  })
  y += heroLines.length * heroLh + IG.gap

  ctx.font = `${IG.labelSize}px "Bebas Neue"`
  ctx.fillStyle = IG.text
  const labelLines = wrapText(ctx, header.label, contentW)
  const labelLh = IG.labelSize * 1.28
  labelLines.forEach((line, i) => {
    ctx.fillText(line, cx, y + i * labelLh)
  })
  const labelW = Math.max(...labelLines.map((l) => ctx.measureText(l).width), 0)
  boxes.push({
    x: cx - labelW / 2,
    y,
    width: labelW,
    height: labelLines.length * labelLh,
    label: 'label',
  })
  return boxes
}

export interface TableRowLayout {
  rowHeight: number
  bodySize: number
  rowGap: number
}

export function fitTableLayout(rowCount: number): TableRowLayout {
  const header = measureHeader({ hero: 'STANDINGS', label: 'AFTER WEEK 12' })
  const maxBody = IG.height - IG.margin * 2
  for (let bodySize = 36; bodySize >= 28; bodySize -= 2) {
    const rowGap = Math.round(bodySize * 0.45)
    const rowHeight = bodySize * 1.28 + rowGap
    const total = header.total + IG.gap + rowCount * rowHeight - rowGap
    if (total <= maxBody) {
      return { rowHeight, bodySize, rowGap }
    }
  }
  const bodySize = 28
  const rowGap = 12
  return { rowHeight: bodySize * 1.28 + rowGap, bodySize, rowGap }
}

export function maxRowsPerStandingsSlide(): number {
  const layout = fitTableLayout(12)
  const header = measureHeader({ hero: 'STANDINGS', label: 'AFTER WEEK 12' })
  const maxBody = IG.height - IG.margin * 2
  const available = maxBody - header.total - IG.gap
  return Math.max(6, Math.floor(available / layout.rowHeight))
}

export async function renderTableSlide(
  header: SlideHeader,
  drawRows: (
    ctx: CanvasRenderingContext2D,
    startY: number,
    layout: TableRowLayout,
  ) => TextBox[],
  rowCount: number,
): Promise<{ blob: Blob; overflow: { ok: boolean; issues: string[] } }> {
  await loadIgFonts()
  const ctx = createIgContext()
  const layout = fitTableLayout(rowCount)
  const headerM = measureHeader(header)
  const rowsH = rowCount * layout.rowHeight - layout.rowGap
  const stackH = headerM.total + IG.gap + rowsH
  const topY = (IG.height - stackH) / 2

  const boxes = drawHeader(ctx, header, topY)
  const rowBoxes = drawRows(ctx, topY + headerM.total + IG.gap, layout)
  boxes.push(...rowBoxes)
  const overflow = combineOverflowResults(
    checkSlideOverflow(boxes),
    checkRowHorizontalOverlap(rowBoxes),
  )
  return { blob: await canvasToBlob(ctx), overflow }
}

export function truncateToWidth(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string {
  if (ctx.measureText(text).width <= maxWidth) return text
  let t = text
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxWidth) {
    t = t.slice(0, -1)
  }
  return `${t}…`
}
