/**
 * Re-render only Round 10 touched slides (not W4/W5 results/W6).
 */
import { chromium } from 'playwright'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { panelImagePath } from './rebuild/panel-paths.mjs'
import { resultHtml } from './rebuild/result-template.mjs'
import { resultFromCopy } from './rebuild/copy-to-result.mjs'
import { cardHtml as w5CardHtml } from '../w5-matchup-cards/template.mjs'
import { previewFromCopy } from './rebuild/preview-from-copy.mjs'
import { renderReportSlides } from './rebuild/render-report-slides.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'rebuild/output')
const SLIDE_SOURCES = path.join(__dirname, '../slide-sources')

const RESULT_IDS = [
  'results-w1-m1',
  'results-w1-m2',
  'results-w1-m3',
  'results-w1-m4',
  'results-w1-m5',
  'results-w1-m6',
  'results-w2-m2',
  'results-w2-m3',
  'results-w2-m4',
  'results-w2-m5',
  'results-w2-m6',
  'results-w3-m1',
  'results-w3-m2',
  'results-w3-m3',
  'results-w3-m4',
  'results-w3-m5',
]
const PREVIEW_IDS = ['vs-w5-m2', 'vs-w5-m4']
const REPORT_IDS = ['w1-slide-09', 'w2-slide-06']

async function renderHtml(page, html, basename) {
  const tmp = path.join(OUT, `.tmp-${basename}.html`)
  await writeFile(tmp, html)
  await page.goto(`file://${tmp}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(350)
  const png = path.join(OUT, `${basename}.png`)
  await page.locator('.slide').screenshot({ path: png, type: 'png', scale: 'css' })
  const meta = await sharp(png).metadata()
  if (meta.width !== 1080 || meta.height !== 1350) {
    await sharp(png).resize(1080, 1350, { fit: 'fill' }).png().toFile(png)
  }
  const dest = path.join(SLIDE_SOURCES, `${basename}.png`)
  await sharp(png).png().toFile(dest)
  console.log('wrote', dest)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })

  for (const id of RESULT_IDS) {
    const r = resultFromCopy(id)
    const wImg = panelImagePath(id, 'winner')
    const lImg = panelImagePath(id, 'loser')
    await renderHtml(page, resultHtml(r, wImg, lImg), id)
  }

  for (const id of REPORT_IDS) {
    const { REPORT_SLIDES } = await import('./rebuild/report-templates.mjs')
    const fn = REPORT_SLIDES[id]
    if (!fn) throw new Error(`no report ${id}`)
    await renderHtml(page, fn(), id)
  }

  for (const id of PREVIEW_IDS) {
    const m = previewFromCopy(id)
    const left = panelImagePath(id, 'left')
    const right = panelImagePath(id, 'right')
    await renderHtml(page, w5CardHtml(m, left, right), id)
  }

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
