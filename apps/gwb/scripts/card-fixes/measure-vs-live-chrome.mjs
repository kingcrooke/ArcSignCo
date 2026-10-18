/**
 * Mean diff outside panel art + variable copy vs live vs-w5-m1.full.jpg
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
const LIVE_M1 = path.join(GWB, '..', '..', 'gwb-fe006a16', 'slides', 'vs-w5-m1.full.jpg')
const W5 = path.join(GWB, 'scripts/w5-matchup-cards')
const ASSETS = path.join(W5, 'assets')

const PANEL = { left: 38, top: 298, width: 1004, height: 680 }
const TEXT = [
  { left: 0, top: 14, width: 1080, height: 284 },
  { left: 0, top: 978, width: 1080, height: 372 },
]

function masked(x, y) {
  const { left, top, width, height } = PANEL
  if (x >= left && x < left + width && y >= top && y < top + height) return true
  for (const r of TEXT) {
    if (x >= r.left && x < r.left + r.width && y >= r.top && y < r.top + r.height) return true
  }
  return false
}

async function renderPng(page, id, useCopy) {
  const m = useCopy ? mergeMatchup(id) : loadMatchups().find((x) => x.id === id)
  const html = cardHtml(m, path.join(ASSETS, `${id}-left.jpg`), path.join(ASSETS, `${id}-right.jpg`))
  const tmp = path.join(W5, 'output', `.measure-${id}.html`)
  await mkdir(path.dirname(tmp), { recursive: true })
  await writeFile(tmp, html)
  await page.goto(`file://${path.resolve(tmp)}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(350)
  const out = path.join(W5, 'output', `measure-${id}.png`)
  await page.locator('.slide').screenshot({ path: out, type: 'png', scale: 'css' })
  return out
}

async function meanDiff(livePath, candPath) {
  const [lBuf, cBuf] = await Promise.all([
    sharp(livePath).resize(1080, 1350).raw().toBuffer(),
    sharp(candPath).resize(1080, 1350).raw().toBuffer(),
  ])
  const w = 1080
  const h = 1350
  let sum = 0
  let n = 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (masked(x, y)) continue
      const i = (y * w + x) * 3
      sum += Math.abs(lBuf[i] - cBuf[i]) + Math.abs(lBuf[i + 1] - cBuf[i + 1]) + Math.abs(lBuf[i + 2] - cBuf[i + 2])
      n += 3
    }
  }
  return sum / n
}

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
  const m1png = await renderPng(page, 'vs-w5-m1', false)
  const m2png = await renderPng(page, 'vs-w5-m2', true)
  await browser.close()
  const d1 = await meanDiff(LIVE_M1, m1png)
  const d2 = await meanDiff(LIVE_M1, m2png)
  console.log('live m1 vs render m1 (masked):', d1.toFixed(3))
  console.log('live m1 vs render m2 chrome (masked):', d2.toFixed(3))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
