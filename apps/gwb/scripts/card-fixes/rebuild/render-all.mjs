/**
 * Render touched cards from live-card-copy.json + live-templates (match main layout).
 */
import { chromium } from 'playwright'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'
import sharp from 'sharp'
import { panelImagePath } from './panel-paths.mjs'
import { previewHtml, resultHtml } from './live-templates.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'output')
const SLIDE_SOURCES = path.join(__dirname, '../../slide-sources')
const COPY = JSON.parse(await readFile(path.join(__dirname, 'live-card-copy.json'), 'utf8'))

const RESULT_IDS = Object.keys(COPY).filter((k) => k.startsWith('results-'))
const PREVIEW_IDS = Object.keys(COPY).filter((k) => k.startsWith('vs-'))

async function renderHtml(page, html, basename) {
  const tmp = path.join(OUT, `.tmp-${basename}.html`)
  await writeFile(tmp, html)
  await page.goto(`file://${tmp}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(300)
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

async function main() {
  await mkdir(OUT, { recursive: true })
  await mkdir(SLIDE_SOURCES, { recursive: true })

  const gwbRoot = path.join(__dirname, '..', '..', '..')
  execSync('python3 scripts/card-fixes/rebuild/render-report-live.py', {
    cwd: gwbRoot,
    stdio: 'inherit',
  })

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })

  for (const id of RESULT_IDS) {
    const c = COPY[id]
    const wImg = panelImagePath(id, 'winner')
    const lImg = panelImagePath(id, 'loser')
    const dest = await renderHtml(page, resultHtml(c, wImg, lImg), id)
    console.log('result', dest)
  }

  for (const id of PREVIEW_IDS) {
    const c = COPY[id]
    const left = panelImagePath(id, 'left')
    const right = panelImagePath(id, 'right')
    const dest = await renderHtml(page, previewHtml(c, left, right), id)
    console.log('preview', dest)
  }

  await browser.close()
  console.log('done →', SLIDE_SOURCES)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
