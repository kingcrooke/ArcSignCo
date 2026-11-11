import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = '/opt/cursor/artifacts/gwb-visual-redesign'
const BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:4318/'

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setViewportSize({ width: 360, height: 780 })
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 120_000 })
  await page.waitForSelector('nav.gwb-section-tabs', { timeout: 120_000 })
  await page
    .getByText('Loading GWB league data')
    .waitFor({ state: 'detached', timeout: 120_000 })
    .catch(() => {})
  const path = join(OUT, 'tab-bar-scroll-before-360px.png')
  await page.locator('nav.gwb-section-tabs').screenshot({ path })
  console.log('wrote', path)
  await browser.close()
}

main()
