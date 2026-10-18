/**
 * Compare vs-w5-m2/m4 chrome to live baked vs-w5-m1.full.jpg (mask panels + copy).
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GWB = path.join(__dirname, '..', '..')
const LIVE_M1 = path.join(GWB, '..', '..', 'gwb-fe006a16', 'slides', 'vs-w5-m1.full.jpg')

const PANEL_MASK = { left: 38, top: 298, width: 1004, height: 680 }
const TEXT_MASKS = [
  { left: 0, top: 14, width: 1080, height: 284 },
  { left: 0, top: 978, width: 1080, height: 372 },
]

function masked(x, y) {
  const { left, top, width, height } = PANEL_MASK
  if (x >= left && x < left + width && y >= top && y < top + height) return true
  for (const r of TEXT_MASKS) {
    if (x >= r.left && x < r.left + r.width && y >= r.top && y < r.top + r.height) return true
  }
  return false
}

async function meanOutsideMask(refPath, candPath) {
  const [lBuf, cBuf] = await Promise.all([
    sharp(refPath).resize(1080, 1350).ensureAlpha().raw().toBuffer(),
    sharp(candPath).resize(1080, 1350).ensureAlpha().raw().toBuffer(),
  ])
  const w = 1080
  const h = 1350
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
  let fail = false
  for (const id of ['vs-w5-m2', 'vs-w5-m4']) {
    const cand = path.join(GWB, 'scripts/slide-sources', `${id}.png`)
    const mean = await meanOutsideMask(LIVE_M1, cand)
    console.log(id, 'chrome vs live m1 jpg (masked):', mean.toFixed(3))
    if (mean > 8) {
      fail = true
      console.error(id, 'FAIL')
    }
  }
  if (fail) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
