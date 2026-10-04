import { IG } from './fonts'

export interface TextBox {
  x: number
  y: number
  width: number
  height: number
  label: string
}

export interface OverflowResult {
  ok: boolean
  issues: string[]
}

function intersects(a: TextBox, b: TextBox): boolean {
  return !(
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  )
}

export function checkSlideOverflow(boxes: TextBox[]): OverflowResult {
  const issues: string[] = []
  const pad = IG.margin

  for (const box of boxes) {
    if (box.x < pad) issues.push(`${box.label}: clipped left`)
    if (box.y < pad) issues.push(`${box.label}: clipped top`)
    if (box.x + box.width > IG.width - pad) {
      issues.push(`${box.label}: clipped right`)
    }
    if (box.y + box.height > IG.height - pad) {
      issues.push(`${box.label}: clipped bottom`)
    }
  }

  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      if (intersects(boxes[i], boxes[j])) {
        issues.push(
          `Overlap: ${boxes[i].label} and ${boxes[j].label}`,
        )
      }
    }
  }

  return { ok: issues.length === 0, issues }
}

export function combineOverflowResults(
  ...results: OverflowResult[]
): OverflowResult {
  const issues = results.flatMap((r) => r.issues)
  return { ok: results.every((r) => r.ok), issues }
}
