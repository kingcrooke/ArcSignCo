/**
 * 2× crop: live m1 full header above m2 header (stacked).
 */
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { cardHtml } from '../w5-matchup-cards/template-m2-m4-live-chrome.mjs'
import { m2m4PanelPath } from '../w5-matchup-cards/m2-m4-panel-path.mjs'
import { mergeMatchup } from './render-w5-m2-m4-main.mjs'
import { W5_SCRATCH } from '../w5-matchup-cards/scratch-path.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GWB = path.join(__dirname, '..', '..')
const LIVE = path.join(GWB, '..', '..', 'gwb-fe006a16', 'slides', 'vs-w5-m1.full.jpg')
const OUT = path.join(__dirname, 'vs-w5-header-crop-2x.jpg')

const HEADER_TOP = 48
const HEADER_H = 235

async function renderM2(page) {
  const m = mergeMatchup('vs-w5-m2')
  const html = cardHtml(m, m2m4PanelPath('vs-w5-m2', 'left'), m2m4PanelPath('vs-w5-m2', 'right'))
  const tmp = path.join(W5_SCRATCH, '.header-crop-m2.html')
  await mkdir(W5_SCRATCH, { recursive: true })
  await writeFile(tmp, html)
  await page.goto(`file://${path.resolve(tmp)}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400)
  const png = path.join(W5_SCRATCH, 'header-crop-m2.png')
  await page.locator('.slide').screenshot({ path: png, type: 'png', scale: 'css' })
  return png
}

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
  const m2 = await renderM2(page)
  await browser.close()

  const scale = 2
  const stripW = 1080 * scale
  const stripH = HEADER_H * scale
  const liveStrip = await sharp(LIVE)
    .resize(1080, 1350, { fit: 'fill' })
    .extract({ left: 0, top: HEADER_TOP, width: 1080, height: HEADER_H })
    .resize(stripW, stripH, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer()
  const m2Strip = await sharp(m2)
    .resize(1080, 1350, { fit: 'fill' })
    .extract({ left: 0, top: HEADER_TOP, width: 1080, height: HEADER_H })
    .resize(stripW, stripH, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer()

  const label = Buffer.from(
    `<svg width="${stripW}" height="36"><text x="16" y="26" fill="#d4af37" font-family="sans-serif" font-size="22">live m1 header (top) vs m2 render (bottom) @2x</text></svg>`,
  )
  await sharp({
    create: { width: stripW, height: stripH * 2 + 56, channels: 3, background: { r: 8, g: 10, b: 14 } },
  })
    .composite([
      { input: label, top: 0, left: 0 },
      { input: liveStrip, top: 40, left: 0 },
      { input: m2Strip, top: 40 + stripH + 16, left: 0 },
    ])
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(OUT)
  console.log('wrote', OUT)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
