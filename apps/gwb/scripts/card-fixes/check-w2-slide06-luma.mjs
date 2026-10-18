/**
 * Self-check w2-slide-06 composited output (fade smoothness + no hero on text column).
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PNG = path.join(__dirname, 'rebuild/output/w2-slide-06.png')
const BASE = path.join(__dirname, 'rebuild/output/w2-slide-06-base.png')
const HERO_LEFT = 640

function luma(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b
}

function rgbAt(data, w, ch, x, y) {
  const i = (y * w + x) * ch
  return [data[i], data[i + 1], data[i + 2]]
}

async function main() {
  const [finalRaw, baseRaw] = await Promise.all([
    sharp(PNG).raw().toBuffer({ resolveWithObject: true }),
    sharp(BASE).raw().toBuffer({ resolveWithObject: true }),
  ])
  const { data, info } = finalRaw
  const base = baseRaw.data
  const w = info.width
  const chF = info.channels
  const chB = baseRaw.info.channels

  let textDiff = 0
  for (let y = 360; y < 410; y++) {
    for (let x = 520; x < HERO_LEFT; x++) {
      const [r1, g1, b1] = rgbAt(data, w, chF, x, y)
      const [r2, g2, b2] = rgbAt(base, w, chB, x, y)
      const d = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2)
      if (d > 3) textDiff++
    }
  }
  console.log(`pixels changed left of hero (x520-${HERO_LEFT - 1}, y360-410):`, textDiff)

  let worstCol = 0
  let worstAt = { x: 0, y: 0 }
  for (let x = HERO_LEFT; x <= 760; x++) {
    for (let y = 851; y < 1150; y++) {
      const [r1, g1, b1] = rgbAt(data, w, chF, x, y)
      const [r0, g0, b0] = rgbAt(data, w, chF, x, y - 1)
      const d = Math.abs(luma(r1, g1, b1) - luma(r0, g0, b0))
      if (d > worstCol) {
        worstCol = d
        worstAt = { x, y }
      }
    }
  }
  console.log('max vertical luma step in hero fade (x640-760, y851-1150):', worstCol.toFixed(1), 'at', worstAt)

  let bandRows = 0
  for (let y = 851; y < 1150; y++) {
    let hits = 0
    for (let x = HERO_LEFT; x <= 760; x++) {
      const [r1, g1, b1] = rgbAt(data, w, chF, x, y)
      const [r0, g0, b0] = rgbAt(data, w, chF, x, y - 1)
      const d = Math.abs(luma(r1, g1, b1) - luma(r0, g0, b0))
      if (d > 10) hits++
    }
    if (hits > 80) bandRows++
  }
  console.log('horizontal band rows in hero fade (>=80 cols with step>10):', bandRows)

  if (textDiff > 0) {
    console.error('FAIL hero overlaps body copy')
    process.exit(1)
  }
  if (bandRows > 4) {
    console.error('FAIL baked fade seam (horizontal band in fade zone)')
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
