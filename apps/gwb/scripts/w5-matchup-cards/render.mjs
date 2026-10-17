/**
 * Render Week 5 matchup cards (1080×1350) via Playwright.
 */
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { cardHtml, loadMatchups } from './template.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS = path.join(__dirname, 'assets')
const OUT = path.join(__dirname, 'output')
const SLIDE_SOURCES = path.join(__dirname, '../slide-sources')

async function renderOne(page, m) {
  const leftImg = path.join(ASSETS, `${m.id}-left.jpg`)
  const rightImg = path.join(ASSETS, `${m.id}-right.jpg`)
  const html = cardHtml(m, leftImg, rightImg)
  const tmp = path.join(OUT, `.tmp-${m.id}.html`)
  await writeFile(tmp, html)
  await page.goto(`file://${tmp}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(250)
  const png = path.join(OUT, `${m.id}.png`)
  await page.locator('.slide').screenshot({ path: png, type: 'png', scale: 'css' })
  const meta = await sharp(png).metadata()
  if (meta.width !== 1080 || meta.height !== 1350) {
    await sharp(png).resize(1080, 1350, { fit: 'fill' }).png().toFile(png)
  }
  const dest = path.join(SLIDE_SOURCES, `${m.id}.png`)
  await sharp(png).png().toFile(dest)
  return { png, dest }
}

async function main() {
  await mkdir(OUT, { recursive: true })
  await mkdir(SLIDE_SOURCES, { recursive: true })
  const matchups = loadMatchups()
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
  for (const m of matchups) {
    const r = await renderOne(page, m)
    console.log('rendered', r.dest)
  }
  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
