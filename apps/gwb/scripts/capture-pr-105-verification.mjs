import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const BASE =
  process.env.GWB_PREVIEW_BASE ??
  'https://deploy-preview-105--arcsign.netlify.app/gwb-fe006a16/'
const OUT = '/opt/cursor/artifacts/gwb-pr-105'

async function shot(page, name, opts = {}) {
  const path = join(OUT, name)
  await page.screenshot({ path, ...opts })
  console.log('wrote', path)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()

  const goto = (url) =>
    page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120_000 })

  await goto(`${BASE}?tab=powerrankings`)
  await page.waitForSelector('#power-rankings-panel', { timeout: 120_000 })
  await page.setViewportSize({ width: 1280, height: 900 })
  await shot(page, 'power-rankings-desktop.png')
  await page.setViewportSize({ width: 390, height: 844 })
  await shot(page, 'power-rankings-mobile.png')

  await goto(`${BASE}?tab=managers`)
  await page.waitForSelector('h2', { timeout: 60_000 })
  await page.setViewportSize({ width: 1280, height: 900 })
  const hady = page.getByText(/2025.*Hady|Hady.*2025|champion/i).first()
  await hady.scrollIntoViewIfNeeded().catch(() => {})
  await shot(page, 'history-2025-hady-desktop.png', { fullPage: true })

  await goto(`${BASE}?tab=recaps&week=4`)
  await page.waitForSelector('text=Crystal ball', { timeout: 60_000 })
  await page.setViewportSize({ width: 1280, height: 900 })
  await shot(page, 'week4-predictions-desktop.png', { fullPage: true })

  await goto(`${BASE}?tab=gallery&week=4`)
  await page.waitForSelector('text=Matchups', { timeout: 60_000 })
  await page.setViewportSize({ width: 1280, height: 900 })
  await shot(page, 'week4-matchups-desktop.png', { fullPage: true })

  await goto(`${BASE}?tab=gallery&week=5`)
  await page.waitForSelector('text=Matchups', { timeout: 60_000 })
  await shot(page, 'week5-matchups-desktop.png', { fullPage: true })

  await goto(`${BASE}?tab=gallery&week=1`)
  await page.waitForSelector('text=We Are So Back', { timeout: 60_000 })
  await page.getByText('We Are So Back').first().scrollIntoViewIfNeeded()
  await shot(page, 'week1-deck-title-desktop.png', { fullPage: true })

  await goto(`${BASE}?tab=mulligans&week=5`)
  await page.waitForSelector('h2', { timeout: 60_000 })
  await shot(page, 'week5-mulligans-desktop.png', { fullPage: true })

  await goto(`${BASE}?tab=gallery&week=5`)
  await page.waitForSelector('text=Report', { timeout: 60_000 })
  await shot(page, 'week5-recap-desktop.png', { fullPage: true })

  await goto(`${BASE}?tab=gallery&week=6`)
  await page.waitForSelector('text=Matchups', { timeout: 60_000 })
  await shot(page, 'week6-muse-matchups-desktop.png', { fullPage: true })

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
