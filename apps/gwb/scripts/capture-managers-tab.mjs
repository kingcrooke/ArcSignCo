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

  const wall = page.locator('#champions-wall')
  for (const w of WIDTHS) {
    await shotLocator(page, wall, 'gwb-managers-champions-wall', w)
  }

  const select = page.getByLabel('Select manager')

  await select.selectOption({ label: 'Crooke' })
  await page.waitForTimeout(1500)
  const crookeHero = page.locator('#manager-hero')
  for (const w of WIDTHS) {
    await shotLocator(page, crookeHero, 'gwb-managers-crooke-hero', w)
  }
  const crookeSeasons = page.locator('#manager-seasons-section')
  for (const w of WIDTHS) {
    await shotLocator(page, crookeSeasons, 'gwb-managers-crooke-pre2019-seasons', w)
  }

  await select.selectOption({ label: 'Danny' })
  await page.waitForTimeout(1500)
  const dannyHero = page.locator('#manager-hero')
  for (const w of WIDTHS) {
    await shotLocator(page, dannyHero, 'gwb-managers-danny-hero', w)
  }

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
