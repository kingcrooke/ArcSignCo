import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = '/opt/cursor/artifacts/gwb-ideas'
const BASE =
  process.env.PREVIEW_URL ||
  'https://deploy-preview-55--arcsign.netlify.app/gwb-fe006a16/'

async function gotoReady(page) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 180_000 })
  await page.waitForSelector('nav[aria-label="Sections"]', { timeout: 180_000 })
  await page.waitForTimeout(2500)
}

async function shot(page, name, width, fullPage = true) {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
  const path = join(OUT, `${name}-${width}.png`)
  await page.screenshot({ path, fullPage })
  console.log('wrote', path)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()

  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))

  await gotoReady(page)
  for (const w of [1280, 390]) await shot(page, 'idea18-standings-seed-allplay', w)

  await gotoReady(page)
  await page.getByRole('button', { name: 'Live' }).click()
  await page.waitForSelector('#live-scoreboard-panel', { timeout: 120_000 })
  for (const w of [1280, 390]) await shot(page, 'idea15-live-projections', w)

  await gotoReady(page)
  await page.getByRole('button', { name: 'Graphics' }).click()
  await page.waitForSelector('#graphics-week-5-matchups', { timeout: 120_000 })
  for (const w of [1280, 390]) await shot(page, 'idea15-graphics-projections', w)

  await gotoReady(page)
  await page.getByRole('button', { name: 'Graphics' }).click()
  await page.getByRole('button', { name: /Open Steven vs Crooke/i }).click()
  await page.waitForSelector('button:has-text("Save image")', { timeout: 60_000 })
  for (const w of [1280, 390]) {
    await page.setViewportSize({ width: w, height: w === 390 ? 844 : 900 })
    await page.screenshot({
      path: join(OUT, `idea14-lightbox-save-${w}.png`),
    })
  }

  await gotoReady(page)
  await page.getByRole('button', { name: /Frankie/i }).click()
  await page.waitForSelector('#fz-slides-heading', { timeout: 120_000 })
  for (const w of [1280, 390]) await shot(page, 'idea17-frankie-archive-empty', w)

  await gotoReady(page)
  await page.getByRole('button', { name: /Waiver/i }).click()
  await page.waitForSelector('#waiver-wire-panel', { timeout: 120_000 })
  for (const w of [1280, 390]) await shot(page, 'idea19-waiver-story-adds', w)

  await gotoReady(page)
  await page.getByRole('button', { name: 'Mulligans' }).click()
  await page.getByLabel('NFL Week').selectOption('4')
  await page.waitForSelector('#mulligans-section', { timeout: 120_000 })
  for (const w of [1280, 390]) await shot(page, 'idea16-mulligan-crooke-nicknames', w)

  await browser.close()
  if (errors.length) {
    console.error('console errors', errors)
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
