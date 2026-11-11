import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = '/opt/cursor/artifacts/gwb-gallery-order'
const BASE =
  process.env.PREVIEW_URL ||
  'https://deploy-preview-162--arcsign.netlify.app/gwb-fe006a16/'

async function captureWeek(page, week, width) {
  const url = `${BASE}?week=${week}&tab=gallery`
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 180_000 })
  await page.waitForSelector('nav.gwb-section-tabs', { timeout: 180_000 })
  await page
    .getByText('Loading GWB league data')
    .waitFor({ state: 'detached', timeout: 180_000 })
    .catch(() => {})
  await page
    .getByRole('heading', { name: /Week \d+ graphics/i })
    .waitFor({ timeout: 120_000 })
  const path = join(OUT, `gallery-week${week}-${width}px.png`)
  await page.screenshot({ path, fullPage: true })
  console.log('wrote', path)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()

  for (const width of [1280, 360]) {
    await page.setViewportSize({ width, height: width === 360 ? 900 : 1100 })
    await captureWeek(page, 9, width)
    await captureWeek(page, 10, width)
  }

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
