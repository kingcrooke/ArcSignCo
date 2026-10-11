import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = '/opt/cursor/artifacts'
const BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/'

async function main() {
  const label = process.env.SHOT_LABEL || 'frankie-zone'
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${BASE}?week=4&tab=frankie`, {
    waitUntil: 'networkidle',
    timeout: 120_000,
  })
  await page.locator('#frankie-zone-section').waitFor({ timeout: 120_000 })
  await page.waitForTimeout(2000)
  const path = join(OUT, `${label}-390.png`)
  await page.screenshot({ path, fullPage: true })
  console.log('wrote', path)
  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
