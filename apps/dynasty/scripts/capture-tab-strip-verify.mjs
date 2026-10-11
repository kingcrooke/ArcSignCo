import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = '/opt/cursor/artifacts/screenshots'
const BASE =
  process.env.PREVIEW_URL || 'http://127.0.0.1:4317/gwb-fe006a16/'

const WIDTHS = [1280, 390]

async function waitForApp(page) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 180_000 })
  await page.waitForSelector('nav.gwb-section-tabs', { timeout: 180_000 })
  await page
    .getByText('Loading GWB league data')
    .waitFor({ state: 'detached', timeout: 180_000 })
    .catch(() => {})
}

async function assertNoRemovedTabs(page) {
  const h2h = await page.getByRole('button', { name: 'H2H', exact: true }).count()
  const timeline = await page
    .getByRole('button', { name: 'Timeline', exact: true })
    .count()
  if (h2h > 0 || timeline > 0) {
    throw new Error(`Removed tabs still visible (H2H=${h2h}, Timeline=${timeline})`)
  }
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
    await waitForApp(page)
    await assertNoRemovedTabs(page)
    const nav = page.locator('nav.gwb-section-tabs')
    const path = join(OUT, `gwb-tab-strip-${width}.png`)
    await nav.screenshot({ path })
    console.log('wrote', path)
  }

  await waitForApp(page)
  await page.getByRole('button', { name: 'Managers' }).click()
  await page.waitForSelector('#manager-panel', { timeout: 120_000 })
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
    const path = join(OUT, `gwb-managers-tab-${width}.png`)
    await page.locator('#manager-panel').screenshot({ path })
    console.log('wrote', path)
  }

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
