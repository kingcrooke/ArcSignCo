/**
 * Render vs-w5-m2 / m4 with origin/main template + live-card-copy data (same path as m1 would use).
 */
import { chromium } from 'playwright'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { cardHtml, loadMatchups } from '../w5-matchup-cards/template.mjs'
import { previewFromCopy } from './rebuild/preview-from-copy.mjs'
import { panelImagePath } from './rebuild/panel-paths.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '../w5-matchup-cards/output')
const SLIDE_SOURCES = path.join(__dirname, '../slide-sources')
const IDS = process.argv.slice(2).length ? process.argv.slice(2) : ['vs-w5-m2', 'vs-w5-m4']

function mergeMatchup(id) {
  const base = loadMatchups().find((x) => x.id === id)
  const c = previewFromCopy(id)
  const barLeft = c.barLeftPct ?? c.left?.pct ?? base.left.pct
  return {
    ...base,
    title: c.bowlTitle ?? base.title,
    tagline: c.tagline ?? base.tagline,
    recordLine: c.recordLine,
    footerRight: c.footerRight,
    barLeftPct: barLeft,
    leftPctLabel: c.leftPctLabel,
    rightPctLabel: c.rightPctLabel,
    left: { ...base.left, pct: barLeft },
    right: { ...base.right, pct: 100 - barLeft },
  }
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
  for (const id of IDS) {
    const m = mergeMatchup(id)
    const left = panelImagePath(id, 'left')
    const right = panelImagePath(id, 'right')
    const html = cardHtml(m, left, right)
    const tmp = path.join(OUT, `.tmp-${id}.html`)
    await writeFile(tmp, html)
    await page.goto(`file://${path.resolve(tmp)}`, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(300)
    const png = path.join(OUT, `${id}.png`)
    await page.locator('.slide').screenshot({ path: png, type: 'png', scale: 'css' })
    await sharp(png).resize(1080, 1350, { fit: 'fill' }).png().toFile(path.join(SLIDE_SOURCES, `${id}.png`))
    console.log('rendered', id)
  }
  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
