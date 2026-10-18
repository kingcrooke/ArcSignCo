/**
 * vs-w5-m2/m4 via live chrome template (9621cb7) + live-card-copy merge.
 */
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { cardHtml, loadMatchups } from '../w5-matchup-cards/template-m2-m4-live-chrome.mjs'
import { previewFromCopy } from './rebuild/preview-from-copy.mjs'
import { panelImagePath } from './rebuild/panel-paths.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const W5 = path.join(__dirname, '..', 'w5-matchup-cards')
const OUT = path.join(W5, 'output')
const SLIDE_SOURCES = path.join(__dirname, '..', 'slide-sources')
const ONLY = new Set(['vs-w5-m2', 'vs-w5-m4'])

export function mergeMatchup(id) {
  const base = loadMatchups().find((x) => x.id === id)
  if (!base) throw new Error(`no matchup ${id}`)
  const c = previewFromCopy(id)
  const barLeft = c.barLeftPct ?? base.left.pct
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

async function renderOne(page, id) {
  const m = mergeMatchup(id)
  const leftImg = panelImagePath(id, 'left')
  const rightImg = panelImagePath(id, 'right')
  const html = cardHtml(m, leftImg, rightImg)
  const tmp = path.join(OUT, `.tmp-${id}.html`)
  await writeFile(tmp, html)
  await page.goto(`file://${path.resolve(tmp)}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(300)
  const png = path.join(OUT, `${id}.png`)
  await page.locator('.slide').screenshot({ path: png, type: 'png', scale: 'css' })
  const meta = await sharp(png).metadata()
  if (meta.width !== 1080 || meta.height !== 1350) {
    await sharp(png).resize(1080, 1350, { fit: 'fill' }).png().toFile(png)
  }
  await sharp(png).png().toFile(path.join(SLIDE_SOURCES, `${id}.png`))
  console.log('rendered', id)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
  for (const id of ONLY) await renderOne(page, id)
  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
