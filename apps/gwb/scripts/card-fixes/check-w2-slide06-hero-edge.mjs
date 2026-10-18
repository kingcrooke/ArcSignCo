/**
 * After rendering w2-slide-06, ensure no hard horizontal edge in y=850–950 on the right hero column.
 */
import { chromium } from 'playwright'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { REPORT_SLIDES } from './rebuild/report-templates.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'rebuild/output/w2-slide-06-edge-check.png')

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
  let maxJump = 0
  for (let y = 850; y < 950; y++) {
    for (let x = x0; x < w; x++) {
      const i = (y * w + x) * 3
      const iPrev = ((y - 1) * w + x) * 3
      const jump =
        Math.abs(data[i] - data[iPrev]) +
        Math.abs(data[i + 1] - data[iPrev + 1]) +
        Math.abs(data[i + 2] - data[iPrev + 2])
      if (jump > maxJump) maxJump = jump
    }
  }
  console.log('max row-to-row RGB jump in hero band y=850-950:', maxJump)
  if (maxJump > 120) {
    console.error('FAIL: possible hard horizontal edge')
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
