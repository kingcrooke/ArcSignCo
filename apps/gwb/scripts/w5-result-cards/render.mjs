import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { loadResults, resultHtml } from './template.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS = path.join(__dirname, 'assets')
const OUT = path.join(__dirname, 'output')
const SLIDE_SOURCES = path.join(__dirname, '../slide-sources')

async function renderOne(page, r) {
  const winnerImg = path.join(ASSETS, `${r.id}-winner.jpg`)
  const loserImg = path.join(ASSETS, `${r.id}-loser.jpg`)
  const html = resultHtml(r, winnerImg, loserImg)
  const tmp = path.join(OUT, `.tmp-${r.id}.html`)
  await writeFile(tmp, html)
  await page.goto(`file://${tmp}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(250)
  const png = path.join(OUT, `${r.id}.png`)
  await page.locator('.slide').screenshot({ path: png, type: 'png', scale: 'css' })
  const meta = await sharp(png).metadata()
  if (meta.width !== 1080 || meta.height !== 1350) {
    await sharp(png).resize(1080, 1350, { fit: 'fill' }).png().toFile(png)
  }
  const dest = path.join(SLIDE_SOURCES, `${r.id}.png`)
  await sharp(png).png().toFile(dest)
  return dest
}

async function main() {
  await mkdir(OUT, { recursive: true })
  await mkdir(SLIDE_SOURCES, { recursive: true })
  const results = loadResults()
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
  for (const r of results) {
    const dest = await renderOne(page, r)
    console.log('rendered', dest)
  }
  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
