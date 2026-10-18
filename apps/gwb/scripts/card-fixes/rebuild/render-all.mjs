/**
 * Full HTML/CSS rebuild for touched GWB cards → slide-sources PNG (1080×1350).
 */
import { chromium } from 'playwright'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { panelImagePath } from './panel-paths.mjs'
import { resultHtml } from './result-template.mjs'
import { REPORT_SLIDES } from './report-templates.mjs'
import { cardHtml as w4CardHtml, loadMatchups as loadW4 } from '../w4-preview-cards/template.mjs'
import { cardHtml as w5CardHtml, loadMatchups as loadW5 } from '../../w5-matchup-cards/template.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'output')
const SLIDE_SOURCES = path.join(__dirname, '../../slide-sources')
const META = path.join(__dirname, 'results-meta.json')

const W5_TAGLINE_OVERRIDE = {
  'vs-w5-m2': 'Lawrence vs Cousins • Manny has lost two straight',
}

async function renderHtml(page, html, basename) {
  const tmp = path.join(OUT, `.tmp-${basename}.html`)
  await writeFile(tmp, html)
  await page.goto(`file://${tmp}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(280)
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

async function renderResults(page) {
  const rows = JSON.parse(await readFile(META, 'utf8'))
  for (const r of rows) {
    const wImg = panelImagePath(r.id, 'winner')
    const lImg = panelImagePath(r.id, 'loser')
    const dest = await renderHtml(page, resultHtml(r, wImg, lImg), r.id)
    console.log('result', dest)
  }
}

async function renderW4(page) {
  for (const m of loadW4()) {
    const left = panelImagePath(m.id, 'left')
    const right = panelImagePath(m.id, 'right')
    const dest = await renderHtml(page, w4CardHtml(m, left, right), m.id)
    console.log('w4', dest)
  }
}

async function renderW5(page) {
  const all = loadW5()
  for (const id of ['vs-w5-m2', 'vs-w5-m4']) {
    const m = all.find((x) => x.id === id)
    if (!m) throw new Error(`missing ${id}`)
    const copy = { ...m, tagline: W5_TAGLINE_OVERRIDE[id] ?? m.tagline }
    if (copy.left.name === 'HADY' || copy.left.name === 'Hady') copy.left = { ...copy.left, name: 'HADY' }
    const left = panelImagePath(id, 'left')
    const right = panelImagePath(id, 'right')
    const dest = await renderHtml(page, w5CardHtml(copy, left, right), id)
    console.log('w5', dest)
  }
}

async function renderReports(page) {
  for (const [id, fn] of Object.entries(REPORT_SLIDES)) {
    const dest = await renderHtml(page, fn(), id)
    console.log('report', dest)
  }
}

async function main() {
  await mkdir(OUT, { recursive: true })
  await mkdir(SLIDE_SOURCES, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })

  await renderResults(page)
  await renderW4(page)
  await renderW5(page)
  await renderReports(page)

  await browser.close()
  console.log('rebuild complete →', SLIDE_SOURCES)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
