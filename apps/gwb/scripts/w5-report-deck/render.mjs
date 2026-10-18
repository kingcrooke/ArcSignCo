import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { loadReport, slideHtml } from './templates.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'output')
const SLIDE_SOURCES = path.join(__dirname, '../slide-sources')

async function main() {
  const { ordered } = loadReport()
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
  for (let i = 0; i < ordered.length; i++) {
    const slide = ordered[i]
    const html = slideHtml(slide, i + 1)
    const tmp = path.join(OUT, `.tmp-${slide.id}.html`)
    await writeFile(tmp, html)
    await page.goto(`file://${tmp}`, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(200)
    const png = path.join(OUT, `${slide.id}.png`)
    await page.locator('.slide').screenshot({ path: png, type: 'png', scale: 'css' })
    const dest = path.join(SLIDE_SOURCES, `${slide.id}.png`)
    await sharp(png).resize(1080, 1350, { fit: 'fill' }).png().toFile(dest)
    console.log('rendered', dest)
  }
  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
