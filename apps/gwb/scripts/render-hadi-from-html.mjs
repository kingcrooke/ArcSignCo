/**
 * Render selected GWB slides from remake-held HTML → slide-sources PNG.
 *
 *   node scripts/render-hadi-from-html.mjs vs-w5-m4 results-w2-m1 ...
 */
import { chromium } from 'playwright'
import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { SLIDES } from './remake-held/templates.mjs'
import { extractAssets } from './remake-held/extract-assets.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appRoot = path.join(__dirname, '..')
const SOURCES = path.join(appRoot, 'scripts/slide-sources')
const ORIG = path.join(SOURCES, '_orig-main-jpg')
const REM_SRC = path.join(__dirname, 'remake-held/sources')

async function ensureRemakeSources(ids) {
  await mkdir(REM_SRC, { recursive: true })
  for (const id of ids) {
    const from = path.join(ORIG, `${id}.jpg`)
    await copyFile(from, path.join(REM_SRC, `${id}.jpg`))
  }
  const plate = path.join(appRoot, 'public/slides/w4-slide-09.full.jpg')
  await copyFile(plate, path.join(REM_SRC, 'w4-plate-matchup.jpg')).catch(() => {})
  if (ids.includes('vs-m3-hadi-manny')) {
    const legacy = path.join(ORIG, 'vs-m3-hadi-manny.jpg')
    await copyFile(legacy, path.join(REM_SRC, 'vs-m3-hadi-manny.jpg')).catch(() => {})
  }
}

async function renderOne(page, id, html) {
  const tmp = path.join(SOURCES, `.tmp-${id}.html`)
  await writeFile(tmp, html)
  await page.goto(`file://${tmp}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(250)
  const out = path.join(SOURCES, `${id}.png`)
  await page.locator('.slide').screenshot({ path: out, type: 'png', scale: 'css' })
  const meta = await sharp(out).metadata()
  if (meta.width !== 1080 || meta.height !== 1350) {
    await sharp(out).resize(1080, 1350, { fit: 'fill' }).png().toFile(out)
  }
  return out
}

async function main() {
  const ids = process.argv.slice(2).filter(Boolean)
  if (!ids.length) {
    console.error('Usage: node scripts/render-hadi-from-html.mjs <slide-id> ...')
    process.exit(1)
  }
  for (const id of ids) {
    if (!SLIDES[id]) {
      console.error('No template for', id)
      process.exit(1)
    }
  }

  await mkdir(SOURCES, { recursive: true })
  await ensureRemakeSources(ids)
  await extractAssets()

  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 1,
  })

  for (const id of ids) {
    const png = await renderOne(page, id, SLIDES[id].html())
    console.log('rendered', id, png)
  }

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
