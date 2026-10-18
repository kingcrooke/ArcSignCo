import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { REPORT_SLIDES } from './report-templates.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'output')
const SLIDE_SOURCES = path.join(__dirname, '../../slide-sources')

async function renderOne(page, id, html) {
  const tmp = path.join(OUT, `.tmp-${id}.html`)
  await writeFile(tmp, html)
  await page.goto(`file://${tmp}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(350)
  const png = path.join(OUT, `${id}.png`)
  await page.locator('.slide').screenshot({ path: png, type: 'png', scale: 'css' })
  const meta = await sharp(png).metadata()
  if (meta.width !== 1080 || meta.height !== 1350) {
    await sharp(png).resize(1080, 1350, { fit: 'fill' }).png().toFile(png)
  }
  const dest = path.join(SLIDE_SOURCES, `${id}.png`)
  await sharp(png).png().toFile(dest)
  console.log('report', dest)
}

export async function renderReportSlides(page) {
  for (const [id, fn] of Object.entries(REPORT_SLIDES)) {
    await renderOne(page, id, fn())
  }
}

async function main() {
  await mkdir(OUT, { recursive: true })
  await mkdir(SLIDE_SOURCES, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
  await renderReportSlides(page)
  await browser.close()
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
if (isMain) {
  main().catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
