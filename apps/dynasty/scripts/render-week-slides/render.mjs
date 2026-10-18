/**
 * Render Dynasty week slides (1080×1350) from slide-data.json → scripts/slide-sources/*.png
 */
import { chromium } from 'playwright'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { matchSlide, resultSlide } from './templates.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '../slide-sources')
const DATA_PATH = path.join(__dirname, 'slide-data.json')

async function renderOne(page, id, html) {
  const tmp = path.join(OUT_DIR, `.tmp-${id}.html`)
  await writeFile(tmp, html)
  await page.goto(`file://${tmp}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(250)
  const out = path.join(OUT_DIR, `${id}.png`)
  await page.locator('.slide').screenshot({ path: out, type: 'png', scale: 'css' })
  const meta = await sharp(out).metadata()
  if (meta.width !== 1080 || meta.height !== 1350) {
    await sharp(out).resize(1080, 1350, { fit: 'fill' }).png().toFile(out)
  }
  return out
}

async function main() {
  const raw = await readFile(DATA_PATH, 'utf8')
  const data = JSON.parse(raw)
  const standings = data.standingsAfterWeek5

  const onlyResults = process.argv.includes('--results-only')

  const jobs = []
  for (const row of data.resultsWeek5) {
    jobs.push({
      id: row.id,
      html: resultSlide({ ...row, week: 5 }, standings),
    })
  }
  if (!onlyResults) {
    for (const row of data.matchupsWeek6) {
      jobs.push({
        id: row.id,
        html: matchSlide({ ...row, week: 6 }, standings),
      })
    }
  }

  await mkdir(OUT_DIR, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })

  const report = []
  for (const job of jobs) {
    const png = await renderOne(page, job.id, job.html)
    const meta = await sharp(png).metadata()
    report.push({ id: job.id, png, width: meta.width, height: meta.height })
    console.log('rendered', job.id, meta.width, meta.height)
  }

  await browser.close()
  await writeFile(
    path.join(OUT_DIR, 'render-report-w5-w6.json'),
    JSON.stringify(report, null, 2),
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
