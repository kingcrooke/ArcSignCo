import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { panelImagePath } from './rebuild/panel-paths.mjs'
import { resultHtml } from './rebuild/result-template.mjs'
import { resultFromCopy } from './rebuild/copy-to-result.mjs'
import { REPORT_SLIDES } from './rebuild/report-templates.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'rebuild/output')
const SLIDE_SOURCES = path.join(__dirname, '../slide-sources')

const RESULT_IDS = [
  'results-w2-m3',
  'results-w2-m6',
  'results-w3-m2',
  'results-w3-m3',
  'results-w3-m4',
  'results-w3-m5',
]

async function renderHtml(page, html, basename) {
  const tmp = path.join(OUT, `.tmp-${basename}.html`)
  await writeFile(tmp, html)
  await page.goto(`file://${path.resolve(tmp)}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(350)
  const png = path.join(OUT, `${basename}.png`)
  await page.locator('.slide').screenshot({ path: png, type: 'png', scale: 'css' })
  await sharp(png).resize(1080, 1350, { fit: 'fill' }).png().toFile(path.join(SLIDE_SOURCES, `${basename}.png`))
  console.log('wrote', basename)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
  for (const id of RESULT_IDS) {
    const r = resultFromCopy(id)
    await renderHtml(page, resultHtml(r, panelImagePath(id, 'winner'), panelImagePath(id, 'loser')), id)
  }
  await renderHtml(page, REPORT_SLIDES['w2-slide-06'](), 'w2-slide-06')
  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
