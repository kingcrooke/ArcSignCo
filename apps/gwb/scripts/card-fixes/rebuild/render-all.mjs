/**
 * Render touched cards with production templates (W4/W5 preview + result cards).
 */
import { chromium } from 'playwright'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { panelImagePath } from './panel-paths.mjs'
import { resultHtml } from './result-template.mjs'
import { resultFromCopy } from './copy-to-result.mjs'
import { cardHtml as w5CardHtml } from '../../w5-matchup-cards/template.mjs'
import { previewFromCopy } from './preview-from-copy.mjs'
import { renderReportSlides } from './render-report-slides.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'output')
const SLIDE_SOURCES = path.join(__dirname, '../../slide-sources')
const COPY = JSON.parse(await readFile(path.join(__dirname, 'live-card-copy.json'), 'utf8'))
const W4_ASSETS = path.join(__dirname, '..', 'w4-preview-assets')
const W5_ASSETS = path.join(__dirname, '..', '..', 'w5-matchup-cards', 'assets')

const RESULT_IDS = Object.keys(COPY).filter((k) => k.startsWith('results-'))
const PREVIEW_IDS = Object.keys(COPY).filter(
  (k) => k.startsWith('vs-m') || k.startsWith('vs-w5'),
)

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
  return dest
}

async function main() {
  await mkdir(OUT, { recursive: true })
  await mkdir(SLIDE_SOURCES, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })

  for (const id of RESULT_IDS) {
    const r = resultFromCopy(id)
    const wImg = panelImagePath(id, 'winner')
    const lImg = panelImagePath(id, 'loser')
    const dest = await renderHtml(page, resultHtml(r, wImg, lImg), id)
    console.log('result', dest)
  }

  await renderReportSlides(page)

  for (const id of PREVIEW_IDS) {
    const m = previewFromCopy(id)
    const left = panelImagePath(id, 'left')
    const right = panelImagePath(id, 'right')
    const dest = await renderHtml(page, w5CardHtml(m, left, right), id)
    console.log('preview', dest)
  }

  await browser.close()
  console.log('done →', SLIDE_SOURCES)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
