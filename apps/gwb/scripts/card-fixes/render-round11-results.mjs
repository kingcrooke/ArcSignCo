import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { panelImagePath } from './rebuild/panel-paths.mjs'
import { resultHtml } from './rebuild/result-template.mjs'
import { resultFromCopy } from './rebuild/copy-to-result.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'rebuild/output')
const SLIDE_SOURCES = path.join(__dirname, '../slide-sources')

const IDS = [
  'results-w1-m1', 'results-w1-m2', 'results-w1-m3', 'results-w1-m4', 'results-w1-m5', 'results-w1-m6',
  'results-w2-m2', 'results-w2-m3', 'results-w2-m4', 'results-w2-m5', 'results-w2-m6',
  'results-w3-m1', 'results-w3-m2', 'results-w3-m3', 'results-w3-m4', 'results-w3-m5',
]

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
  for (const id of IDS) {
    const r = resultFromCopy(id)
    const html = resultHtml(r, panelImagePath(id, 'winner'), panelImagePath(id, 'loser'))
    const tmp = path.join(OUT, `.tmp-${id}.html`)
    await writeFile(tmp, html)
    await page.goto(`file://${path.resolve(tmp)}`, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(300)
    const png = path.join(OUT, `${id}.png`)
    await page.locator('.slide').screenshot({ path: png, type: 'png', scale: 'css' })
    await sharp(png).resize(1080, 1350, { fit: 'fill' }).png().toFile(path.join(SLIDE_SOURCES, `${id}.png`))
    console.log('result', id)
  }
  await browser.close()
}

main().catch((e) => { console.error(e); process.exit(1) })
