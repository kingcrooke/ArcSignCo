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
  'results-w1-m2', 'results-w1-m3', 'results-w1-m6',
  'results-w2-m2', 'results-w2-m3', 'results-w2-m4', 'results-w2-m5', 'results-w2-m6',
  'results-w3-m1', 'results-w3-m2', 'results-w3-m3', 'results-w3-m4', 'results-w3-m5',
]
const REPORT_IDS = ['w1-slide-09', 'w2-slide-06']

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
  const { cardHtml } = await import('../w5-matchup-cards/template.mjs')
  const { previewFromCopy } = await import('./rebuild/preview-from-copy.mjs')
  const { loadMatchups } = await import('../w5-matchup-cards/template.mjs')

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })

  for (const id of RESULT_IDS) {
    const r = resultFromCopy(id)
    await renderHtml(page, resultHtml(r, panelImagePath(id, 'winner'), panelImagePath(id, 'loser')), id)
  }

  for (const id of ['vs-w5-m2', 'vs-w5-m4']) {
    const base = loadMatchups().find((x) => x.id === id)
    const c = previewFromCopy(id)
    const barLeft = c.barLeftPct ?? base.left.pct
    const m = {
      ...base,
      title: c.bowlTitle,
      tagline: c.tagline,
      recordLine: c.recordLine,
      footerRight: c.footerRight,
      barLeftPct: barLeft,
      leftPctLabel: c.leftPctLabel,
      rightPctLabel: c.rightPctLabel,
      left: { ...base.left, pct: barLeft },
      right: { ...base.right, pct: 100 - barLeft },
    }
    await renderHtml(
      page,
      cardHtml(m, panelImagePath(id, 'left'), panelImagePath(id, 'right')),
      id,
    )
  }

  for (const id of REPORT_IDS) {
    await renderHtml(page, REPORT_SLIDES[id](), id)
  }

  await browser.close()
}

main().catch((e) => { console.error(e); process.exit(1) })
