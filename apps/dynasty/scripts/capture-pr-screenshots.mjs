import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const OUT = '/opt/cursor/artifacts/dynasty-w5-graphics'
const BASE = process.env.DYNASTY_URL ?? 'http://127.0.0.1:4173/dynasty-1581d86a/'

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

  await page.goto(`${BASE}?week=5&tab=gallery`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(5000)
  await page.screenshot({ path: path.join(OUT, 'graphics-week5.png'), fullPage: true })

  await browser.close()
  console.log('saved', OUT)
}

main()
