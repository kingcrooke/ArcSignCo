/**
 * Mask panel regions; compare vs-w5-m2/m4 chrome to vs-w5-m1 (same template).
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GWB = path.join(__dirname, '..', '..')
const REF = path.join(GWB, 'scripts/slide-sources/vs-w5-m1.png')
const PANEL_MASK = { left: 44, top: 250, width: 992, height: 650 }
/** Header copy + mid bowl/odds/tagline vary per card; compare shared chrome only. */
const TEXT_MASKS = [
  { left: 0, top: 120, width: 1080, height: 140 },
  { left: 0, top: 900, width: 1080, height: 300 },
]

function masked(x, y) {
  const { left, top, width, height } = PANEL_MASK
  if (x >= left && x < left + width && y >= top && y < top + height) return true
  for (const r of TEXT_MASKS) {
    if (x >= r.left && x < r.left + r.width && y >= r.top && y < r.top + r.height) return true
  }
  return false
}

async function meanOutsideMask(livePath, candPath) {
  const live = sharp(livePath).ensureAlpha()
  const cand = sharp(candPath).ensureAlpha()
  const meta = await live.metadata()
  const w = meta.width ?? 1080
  const h = meta.height ?? 1350
  const [lBuf, cBuf] = await Promise.all([
    live.raw().toBuffer(),
    cand.resize(w, h).raw().toBuffer(),
  ])
  let sum = 0
  let n = 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (masked(x, y)) continue
      const i = (y * w + x) * 4
      sum +=
        Math.abs(lBuf[i] - cBuf[i]) +
        Math.abs(lBuf[i + 1] - cBuf[i + 1]) +
        Math.abs(lBuf[i + 2] - cBuf[i + 2])
      n += 3
    }
  }
  return sum / n
}

async function main() {
  for (const id of ['vs-w5-m2', 'vs-w5-m4']) {
    const cand = path.join(GWB, 'scripts/slide-sources', `${id}.png`)
    const mean = await meanOutsideMask(REF, cand)
    console.log(id, 'chrome vs m1 outside panels:', mean.toFixed(3))
    if (mean > 4) {
      console.error(id, 'FAIL threshold 4')
      process.exitCode = 1
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
