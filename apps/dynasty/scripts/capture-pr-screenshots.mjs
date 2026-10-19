import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const OUT =
  process.env.DYNASTY_SCREENSHOTS_OUT ??
  '/opt/cursor/artifacts/dynasty-w5-graphics'
const BASE = process.env.DYNASTY_URL ?? 'http://127.0.0.1:4173/dynasty-1581d86a/'

async function captureGallery(page, week, filename) {
  await page.goto(`${BASE}?week=${week}&tab=gallery`, {
    waitUntil: 'domcontentloaded',
  })
  await page.waitForTimeout(5000)
  await page.screenshot({ path: path.join(OUT, filename), fullPage: true })
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await page.goto(`${BASE}?week=5&tab=standings`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(10000)
  await page.screenshot({ path: path.join(OUT, 'standings-week5.png'), fullPage: true })

  await page.goto(`${BASE}?week=5&tab=live`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(10000)
  await page.screenshot({ path: path.join(OUT, 'live-week5.png'), fullPage: true })

  await page.goto(`${BASE}?week=5&tab=waiver`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(12000)
  await page.screenshot({ path: path.join(OUT, 'waiver-week5-champion.png'), fullPage: true })

  for (const week of [1, 2, 3, 4, 5]) {
    await captureGallery(page, week, `graphics-week${week}-results.png`)
  }
  await captureGallery(page, 6, 'graphics-week6-matchups.png')

  await browser.close()
  console.log('saved', OUT)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
