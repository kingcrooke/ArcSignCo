import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = '/opt/cursor/artifacts/screenshots'
const BASE =
  process.env.PREVIEW_URL || 'http://127.0.0.1:4317/gwb-fe006a16/'

const WIDTHS = [1280, 390]

async function openManagers(page) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 180_000 })
  await page.waitForSelector('nav[aria-label="Sections"]', { timeout: 120_000 })
  await page.getByRole('button', { name: 'Managers' }).click()
  await page.waitForSelector('#manager-panel', { timeout: 120_000 })
  await page.waitForTimeout(4000)
}

async function shotLocator(page, locator, name, width) {
  const height = width === 390 ? 844 : 900
  await page.setViewportSize({ width, height })
  await locator.scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  const path = join(OUT, `${name}-${width}.png`)
  await locator.screenshot({ path })
  console.log('wrote', path)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()

  await openManagers(page)
  await page.getByLabel('Select manager').selectOption({ label: 'Danny' })
  await page.waitForTimeout(2000)

  const past = page.locator('#manager-past-rosters-section')
  const pastSelect = page.getByLabel('Select past season roster')
  if (await pastSelect.count()) {
    const options = await pastSelect.locator('option').allTextContents()
    const y2020 = options.find((o) => o.startsWith('2020'))
    if (y2020) {
      const val = y2020.split(' · ')[0]
      await pastSelect.selectOption(val)
      await page.waitForTimeout(800)
      for (const w of WIDTHS) {
        await shotLocator(page, past, 'gwb-managers-past-roster', w)
      }
    }
  }

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
