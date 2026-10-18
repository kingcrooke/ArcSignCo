/**
 * Render w2-slide-06 without hero, composite RGBA hero at x>=640 via sharp.
 */
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { w2Slide06BaseHtml } from './rebuild/report-templates.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'rebuild/output')
const SLIDE_SOURCES = path.join(__dirname, '../slide-sources')
const HERO_RGBA = path.join(__dirname, 'assets', 'w2-slide-06-hero.png')

/** Left edge of hero; baked PNG left fade is fully transparent at x=0 so fade begins at slide x = HERO_LEFT. */
const HERO_LEFT = 640
const HERO_WIDTH = 1080 - HERO_LEFT
const HERO_HEIGHT = 1350

export async function renderW2Slide06Composite(page) {
  const html = w2Slide06BaseHtml()
  const tmp = path.join(OUT, '.tmp-w2-slide-06-base.html')
  await mkdir(OUT, { recursive: true })
  await writeFile(tmp, html)
  await page.goto(`file://${path.resolve(tmp)}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400)
  const basePng = path.join(OUT, 'w2-slide-06-base.png')
  await page.locator('.slide').screenshot({ path: basePng, type: 'png', scale: 'css' })

  const heroBuf = await sharp(HERO_RGBA)
    .resize(HERO_WIDTH, HERO_HEIGHT, { fit: 'cover', position: 'right top' })
    .ensureAlpha()
    .png()
    .toBuffer()

  const outPng = path.join(OUT, 'w2-slide-06.png')
  await sharp(basePng)
    .composite([{ input: heroBuf, left: HERO_LEFT, top: 0 }])
    .removeAlpha()
    .png()
    .toFile(outPng)

  await sharp(outPng).resize(1080, 1350, { fit: 'fill' }).png().toFile(path.join(SLIDE_SOURCES, 'w2-slide-06.png'))
  console.log('wrote w2-slide-06 (composited hero)')
  return outPng
}

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
  await renderW2Slide06Composite(page)
  await browser.close()
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
if (isMain) main().catch((e) => { console.error(e); process.exit(1) })
