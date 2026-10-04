import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = '/opt/cursor/artifacts/screenshots'
const BASE =
  process.env.PREVIEW_URL ||
  'https://deploy-preview-30--arcsign.netlify.app/gwb-fe006a16/'

async function waitForApp(page) {
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 180_000 })
  await page.waitForSelector('nav.gwb-section-tabs', { timeout: 180_000 })
}

async function assertSingleActiveTab(page, label) {
  const selected = page.locator('nav.gwb-section-tabs button[aria-selected="true"]')
  await selected.waitFor({ timeout: 30_000 })
  const count = await selected.count()
  if (count !== 1) {
    throw new Error(`Expected 1 active tab on ${label}, found ${count}`)
  }
  const name = await selected.innerText()
  if (name.trim() !== label) {
    throw new Error(`Expected active tab ${label}, got ${name.trim()}`)
  }
}

async function shotNav(page, tabLabel, fileBase, width) {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
  await page.getByRole('tab', { name: tabLabel, exact: true }).click()
  await assertSingleActiveTab(page, tabLabel)
  const nav = page.locator('nav.gwb-section-tabs')
  const path = join(OUT, `${fileBase}-${width}.png`)
  await nav.screenshot({ path })
  console.log('wrote', path)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await waitForApp(page)

  for (const tab of ['Standings', 'Mulligans', 'Power', 'Recaps', 'Graphics']) {
    await page.getByRole('tab', { name: tab, exact: true }).click()
    await assertSingleActiveTab(page, tab)
    console.log('ok tab', tab)
  }

  for (const width of [1280, 390]) {
    await shotNav(page, 'Standings', 'gwb-nav-tab-standings', width)
    await shotNav(page, 'Mulligans', 'gwb-nav-tab-mulligans', width)
  }

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
