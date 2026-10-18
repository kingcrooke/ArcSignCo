/**
 * After rendering w2-slide-06: no dark-to-bright seam in hero band; no hero bleed into text column.
 */
import { chromium } from 'playwright'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { REPORT_SLIDES } from './rebuild/report-templates.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'rebuild/output/w2-slide-06-edge-check.png')
const BG_LUM = 70

async function main() {
  const html = REPORT_SLIDES['w2-slide-06']()
  const tmp = path.join(__dirname, 'rebuild/output/.tmp-w2-slide06-edge.html')
  await writeFile(tmp, html)
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
  await page.goto(`file://${path.resolve(tmp)}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400)
  await page.locator('.slide').screenshot({ path: OUT, type: 'png', scale: 'css' })
  await browser.close()

  const { data, info } = await sharp(OUT).raw().toBuffer({ resolveWithObject: true })
  const w = info.width
  const x0 = Math.floor(w * 0.48)
  let seamHits = 0
  for (let y = 850; y < 950; y++) {
    for (let x = x0; x < w; x++) {
      const i = (y * w + x) * 3
      const p = ((y - 1) * w + x) * 3
      const lum = data[i] + data[i + 1] + data[i + 2]
      const lumP = data[p] + data[p + 1] + data[p + 2]
      if (lumP < BG_LUM && lum > 320) seamHits++
    }
  }
  console.log('dark-to-bright seam pixels in hero band y=850-950:', seamHits)

  let textOverlap = 0
  for (let y = 280; y < 520; y++) {
    for (let x = 80; x < Math.floor(w * 0.48); x++) {
      const i = (y * w + x) * 3
      const lum = data[i] + data[i + 1] + data[i + 2]
      if (lum > 520) textOverlap++
    }
  }
  console.log('very bright non-text-column bleed pixels:', textOverlap)
  if (seamHits > 12) {
    console.error('FAIL: hard horizontal seam (bg to hero)')
    process.exit(1)
  }
  if (textOverlap > 12000) {
    console.error('FAIL: hero overlaps text column')
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
