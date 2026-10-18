/**
 * Run origin/main w5-matchup-cards render for vs-w5-m2 and vs-w5-m4 only.
 * Panel JPEGs must live in scripts/w5-matchup-cards/assets/{id}-left|right.jpg
 */
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { cardHtml, loadMatchups } from '../w5-matchup-cards/template.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const W5 = path.join(__dirname, '..', 'w5-matchup-cards')
const ASSETS = path.join(W5, 'assets')
const OUT = path.join(W5, 'output')
const SLIDE_SOURCES = path.join(__dirname, '..', 'slide-sources')
const ONLY = new Set(['vs-w5-m2', 'vs-w5-m4'])

async function renderOne(page, m) {
  const leftImg = path.join(ASSETS, `${m.id}-left.jpg`)
  const rightImg = path.join(ASSETS, `${m.id}-right.jpg`)
  const html = cardHtml(m, leftImg, rightImg)
  const tmp = path.join(OUT, `.tmp-${m.id}.html`)
  await writeFile(tmp, html)
  await page.goto(`file://${path.resolve(tmp)}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(250)
  const png = path.join(OUT, `${m.id}.png`)
  await page.locator('.slide').screenshot({ path: png, type: 'png', scale: 'css' })
  const meta = await sharp(png).metadata()
  if (meta.width !== 1080 || meta.height !== 1350) {
    await sharp(png).resize(1080, 1350, { fit: 'fill' }).png().toFile(png)
  }
  await sharp(png).png().toFile(path.join(SLIDE_SOURCES, `${m.id}.png`))
  console.log('rendered', m.id)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const matchups = loadMatchups().filter((m) => ONLY.has(m.id))
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
  for (const m of matchups) await renderOne(page, m)
  await browser.close()
}

main().catch((e) => { console.error(e); process.exit(1) })
