/**
 * Crop sheet: live m1 | render m2 | render m4 (top / mid / bottom aligned).
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
const OUT = path.join(__dirname, 'vs-w5-chrome-crop-sheet.jpg')
const W5OUT = W5_SCRATCH

const STRIPS = [
  { name: 'top', top: 0, height: 340 },
  { name: 'mid', top: 880, height: 320 },
  { name: 'bottom', top: 1180, height: 170 },
]

async function renderId(page, id) {
  const m = mergeMatchup(id)
  const html = cardHtml(m, m2m4PanelPath(id, 'left'), m2m4PanelPath(id, 'right'))
  const tmp = path.join(W5OUT, `.crop-${id}.html`)
  await mkdir(W5OUT, { recursive: true })
  await writeFile(tmp, html)
  await page.goto(`file://${path.resolve(tmp)}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400)
  const png = path.join(W5OUT, `crop-${id}.png`)
  await page.locator('.slide').screenshot({ path: png, type: 'png', scale: 'css' })
  return png
}

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
  const m2 = await renderId(page, 'vs-w5-m2')
  const m4 = await renderId(page, 'vs-w5-m4')
  await browser.close()

  const liveBuf = await sharp(LIVE).resize(1080, 1350).png().toBuffer()
  const m2Buf = await sharp(m2).resize(1080, 1350).png().toBuffer()
  const m4Buf = await sharp(m4).resize(1080, 1350).png().toBuffer()
  const cols = [
    { label: 'live m1', buf: liveBuf },
    { label: 'm2', buf: m2Buf },
    { label: 'm4', buf: m4Buf },
  ]
  const composites = []
  let y = 40
  const colW = 1080
  const gap = 20
  const totalW = cols.length * colW + (cols.length - 1) * gap
  for (const s of STRIPS) {
    const label = Buffer.from(
      `<svg width="${totalW}" height="36"><text x="20" y="26" fill="#d4af37" font-family="sans-serif" font-size="22">${s.name} — live m1 | m2 | m4</text></svg>`,
    )
    composites.push({ input: label, top: y - 36, left: 0 })
    for (let c = 0; c < cols.length; c++) {
      const strip = await sharp(cols[c].buf)
        .extract({ left: 0, top: s.top, width: colW, height: s.height })
        .png()
        .toBuffer()
      composites.push({ input: strip, top: y, left: c * (colW + gap) })
    }
    y += s.height + 56
  }
  await sharp({
    create: { width: totalW, height: y + 20, channels: 3, background: { r: 12, g: 14, b: 18 } },
  })
    .composite(composites)
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(OUT)
  console.log('wrote', OUT)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
