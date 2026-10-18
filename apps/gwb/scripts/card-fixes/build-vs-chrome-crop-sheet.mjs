/**
 * Side-by-side crop sheet: live m1 vs rendered m2 (top / mid / bottom).
 */
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { cardHtml } from '../w5-matchup-cards/template.mjs'
import { mergeMatchup } from './render-w5-m2-m4-main.mjs'
import { panelImagePath } from './rebuild/panel-paths.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GWB = path.join(__dirname, '..', '..')
const LIVE = path.join(GWB, '..', '..', 'gwb-fe006a16', 'slides', 'vs-w5-m1.full.jpg')
const OUT = path.join(__dirname, 'vs-w5-chrome-crop-sheet.jpg')

const STRIPS = [
  { name: 'top', top: 0, height: 340 },
  { name: 'mid', top: 880, height: 320 },
  { name: 'bottom', top: 1180, height: 170 },
]

async function renderM2() {
  const m = mergeMatchup('vs-w5-m2')
  const html = cardHtml(m, panelImagePath('vs-w5-m2', 'left'), panelImagePath('vs-w5-m2', 'right'))
  const tmp = path.join(GWB, 'scripts/w5-matchup-cards/output', '.crop-m2.html')
  await mkdir(path.dirname(tmp), { recursive: true })
  await writeFile(tmp, html)
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
  await page.goto(`file://${path.resolve(tmp)}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400)
  const png = path.join(GWB, 'scripts/w5-matchup-cards/output', 'crop-m2.png')
  await page.locator('.slide').screenshot({ path: png, type: 'png', scale: 'css' })
  await browser.close()
  return png
}

async function main() {
  const m2 = await renderM2()
  const liveBuf = await sharp(LIVE).resize(1080, 1350).png().toBuffer()
  const m2Buf = await sharp(m2).resize(1080, 1350).png().toBuffer()
  const composites = []
  let y = 40
  for (const s of STRIPS) {
    const label = Buffer.from(
      `<svg width="2200" height="36"><text x="20" y="26" fill="#d4af37" font-family="sans-serif" font-size="22">${s.name} — live m1 (left) vs render m2 (right)</text></svg>`,
    )
    composites.push({ input: label, top: y - 36, left: 0 })
    const [l, r] = await Promise.all([
      sharp(liveBuf).extract({ left: 0, top: s.top, width: 1080, height: s.height }).png().toBuffer(),
      sharp(m2Buf).extract({ left: 0, top: s.top, width: 1080, height: s.height }).png().toBuffer(),
    ])
    composites.push({ input: l, top: y, left: 0 })
    composites.push({ input: r, top: y, left: 1100 })
    y += s.height + 56
  }
  await sharp({
    create: { width: 2200, height: y + 20, channels: 3, background: { r: 12, g: 14, b: 18 } },
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
