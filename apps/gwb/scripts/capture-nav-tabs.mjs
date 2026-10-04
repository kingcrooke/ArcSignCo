import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = '/opt/cursor/artifacts/screenshots'
const PREVIEW =
  process.env.PREVIEW_URL ||
  'https://deploy-preview-30--arcsign.netlify.app/gwb-fe006a16/'

const TAB_LABELS = ['Standings', 'Mulligans', 'Power', 'Recaps', 'Graphics']

async function waitForApp(page) {
  await page.goto(PREVIEW, { waitUntil: 'domcontentloaded', timeout: 180_000 })
  await page.waitForSelector('nav.gwb-section-tabs', { timeout: 180_000 })
  await page
    .getByText('Loading GWB league data')
    .waitFor({ state: 'detached', timeout: 180_000 })
    .catch(() => {})
}

async function assertSingleActiveTab(page, label) {
  const active = page.locator('nav.gwb-section-tabs button.gwb-section-tab--active')
  const count = await active.count()
  if (count !== 1) {
    throw new Error(`Expected 1 .gwb-section-tab--active, found ${count}`)
  }
  const text = (await active.innerText()).trim()
  if (text !== label) {
    throw new Error(`Active tab should be ${label}, got ${text}`)
  }
  const inactiveGold = await page
    .locator('nav.gwb-section-tabs button.gwb-section-tab:not(.gwb-section-tab--active)')
    .evaluateAll((nodes) =>
      nodes.filter((n) => {
        const bg = getComputedStyle(n).backgroundColor
        return bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent'
      }).length,
    )
  if (inactiveGold > 0) {
    throw new Error(`${inactiveGold} inactive tab(s) still have a filled background`)
  }
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()

  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
    for (const label of TAB_LABELS) {
      await waitForApp(page)
      await page.getByRole('button', { name: label, exact: true }).click()
      await assertSingleActiveTab(page, label)
      const slug = label.toLowerCase()
      const nav = page.locator('nav.gwb-section-tabs')
      const path = join(OUT, `gwb-preview-nav-active-${slug}-${width}.png`)
      await nav.screenshot({ path })
      console.log('wrote', path)
    }
  }

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
