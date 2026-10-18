/**
 * Compare vs-w5-m2/m4 chrome to origin/main (panel region masked out).
 */
import { execSync } from 'node:child_process'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GWB = path.join(__dirname, '..', '..')
const TMP = '/tmp/gwb-main-vs-ref'
const MASK = { left: 44, top: 250, width: 992, height: 650 }

async function extractMain(id) {
  const out = path.join(TMP, `${id}-main.jpg`)
  execSync(
    `git show origin/main:apps/gwb/public/slides/${id}.full.jpg > ${out}`,
    { cwd: path.join(GWB, '..', '..') },
  )
  return out
}

async function meanDiffOutsideMask(livePath, candPath) {
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
  const { left, top, width, height } = MASK
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const inPanel = x >= left && x < left + width && y >= top && y < top + height
      if (inPanel) continue
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
  await mkdir(TMP, { recursive: true })
  const ids = ['vs-w5-m2', 'vs-w5-m4']
  let fail = false
  for (const id of ids) {
    const mainJpg = await extractMain(id)
    const cand = path.join(GWB, 'scripts/slide-sources', `${id}.png`)
    const mean = await meanDiffOutsideMask(mainJpg, cand)
    console.log(id, 'chrome mean diff outside panels:', mean.toFixed(3))
    if (mean > 2.5) {
      fail = true
      console.error(id, 'FAIL chrome threshold 2.5')
    }
  }
  if (fail) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
