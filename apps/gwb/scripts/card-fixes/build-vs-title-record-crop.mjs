/**
 * 2× crop: live m1 | render m2 for title + record bands.
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
const OUT = path.join(__dirname, 'vs-w5-title-record-crop-2x.jpg')

const BANDS = [
  { name: 'title', top: 120, height: 120 },
  { name: 'record', top: 228, height: 55 },
]

async function renderM2(page) {
  const m = mergeMatchup('vs-w5-m2')
  const html = cardHtml(m, m2m4PanelPath('vs-w5-m2', 'left'), m2m4PanelPath('vs-w5-m2', 'right'))
  const tmp = path.join(W5_SCRATCH, '.title-record-m2.html')
  await mkdir(W5_SCRATCH, { recursive: true })
  await writeFile(tmp, html)
  await page.goto(`file://${path.resolve(tmp)}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400)
  const png = path.join(W5_SCRATCH, 'title-record-m2.png')
  await page.locator('.slide').screenshot({ path: png, type: 'png', scale: 'css' })
  return png
}

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
  const m2 = await renderM2(page)
  await browser.close()

  const liveBuf = await sharp(LIVE).resize(1080, 1350).png().toBuffer()
  const m2Buf = await sharp(m2).resize(1080, 1350).png().toBuffer()
  const scale = 2
  const composites = []
  let y = 36
  for (const band of BANDS) {
    const label = Buffer.from(
      `<svg width="2200" height="32"><text x="16" y="24" fill="#d4af37" font-family="sans-serif" font-size="20">${band.name} — live m1 (left) | m2 render (right) @2x</text></svg>`,
    )
    composites.push({ input: label, top: y - 32, left: 0 })
    const stripH = band.height * scale
    const stripW = 1080 * scale
    const liveStrip = await sharp(liveBuf)
      .extract({ left: 0, top: band.top, width: 1080, height: band.height })
      .resize(stripW, stripH, { kernel: sharp.kernel.lanczos3 })
      .png()
      .toBuffer()
    const m2Strip = await sharp(m2Buf)
      .extract({ left: 0, top: band.top, width: 1080, height: band.height })
      .resize(stripW, stripH, { kernel: sharp.kernel.lanczos3 })
      .png()
      .toBuffer()
    composites.push({ input: liveStrip, top: y, left: 0 })
    composites.push({ input: m2Strip, top: y, left: stripW + 24 })
    y += stripH + 48
  }
  await sharp({
    create: {
      width: 1080 * scale * 2 + 24,
      height: y + 16,
      channels: 3,
      background: { r: 8, g: 10, b: 14 },
    },
  })
    .composite(composites)
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(OUT)
  console.log('wrote', OUT)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
