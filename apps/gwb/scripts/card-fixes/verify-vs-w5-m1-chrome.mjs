/**
 * Compare vs-w5-m2/m4 chrome to vs-w5-m1 rendered with the same template (mask text + panels).
 */
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { cardHtml, loadMatchups } from '../w5-matchup-cards/template.mjs'
import { mergeMatchup } from './render-w5-m2-m4-main.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GWB = path.join(__dirname, '..', '..')
const W5 = path.join(GWB, 'scripts/w5-matchup-cards')
const ASSETS = path.join(W5, 'assets')
const OUT = path.join(W5, 'output')

const PANEL_MASK = { left: 44, top: 250, width: 992, height: 650 }
const TEXT_MASKS = [
  { left: 0, top: 120, width: 1080, height: 140 },
  { left: 0, top: 900, width: 1080, height: 300 },
  { left: 720, top: 1270, width: 360, height: 80 },
]

function masked(x, y) {
  const { left, top, width, height } = PANEL_MASK
  if (x >= left && x < left + width && y >= top && y < top + height) return true
  for (const r of TEXT_MASKS) {
    if (x >= r.left && x < r.left + r.width && y >= r.top && y < r.top + r.height) return true
  }
  return false
}

async function renderM1Ref(page) {
  const m = loadMatchups().find((x) => x.id === 'vs-w5-m1')
  const html = cardHtml(
    m,
    path.join(ASSETS, 'vs-w5-m1-left.jpg'),
    path.join(ASSETS, 'vs-w5-m1-right.jpg'),
  )
  await mkdir(OUT, { recursive: true })
  const tmp = path.join(OUT, '.tmp-verify-m1.html')
  await writeFile(tmp, html)
  await page.goto(`file://${path.resolve(tmp)}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(300)
  const png = path.join(OUT, 'verify-m1-ref.png')
  await page.locator('.slide').screenshot({ path: png, type: 'png', scale: 'css' })
  return png
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
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
  const ref = await renderM1Ref(page)
  await browser.close()

  let fail = false
  for (const id of ['vs-w5-m2', 'vs-w5-m4']) {
    const m = mergeMatchup(id)
    const cand = path.join(GWB, 'scripts/slide-sources', `${id}.png`)
    const mean = await meanOutsideMask(ref, cand)
    console.log(id, 'chrome vs m1 template ref (masked):', mean.toFixed(3))
    if (mean > 4.8) {
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
