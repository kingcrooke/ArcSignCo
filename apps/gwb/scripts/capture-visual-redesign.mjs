import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = '/opt/cursor/artifacts/gwb-visual-redesign'
const BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:4317/gwb-fe006a16/'

const TABS = [
  { name: 'Standings', file: 'standings' },
  { name: 'Graphics', file: 'gallery' },
  { name: 'Recaps', file: 'recaps' },
  { name: 'Live', file: 'live' },
  { name: 'Managers', file: 'managers' },
  { name: 'Mulligans', file: 'mulligans' },
]

async function waitForApp(page) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 180_000 })
  await page.waitForSelector('nav.gwb-section-tabs', { timeout: 180_000 })
  await page
    .getByText('Loading GWB league data')
    .waitFor({ state: 'detached', timeout: 180_000 })
    .catch(() => {})
}

async function assertNoHorizontalOverflow(page) {
  return page.evaluate(() => {
    const el = document.documentElement
    return {
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      overflow: el.scrollWidth > el.clientWidth + 2,
    }
  })
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()

  for (const width of [1280, 360]) {
    await page.setViewportSize({ width, height: width === 360 ? 780 : 900 })
    await waitForApp(page)

    const navPath = join(OUT, `tab-bar-wrap-${width}px.png`)
    await page.locator('nav.gwb-section-tabs').screenshot({ path: navPath })
    console.log('wrote', navPath)

    const overflow = await assertNoHorizontalOverflow(page)
    console.log(`overflow @ ${width}px:`, overflow)
    if (overflow.overflow) {
      throw new Error(`Horizontal overflow at ${width}px`)
    }

    for (const tab of TABS) {
      await page.getByRole('button', { name: tab.name, exact: tab.name !== 'Live' }).click()
      await page.waitForTimeout(400)
      const path = join(OUT, `${tab.file}-${width}px.png`)
      await page.screenshot({ path, fullPage: false })
      console.log('wrote', path)
      const tabOverflow = await assertNoHorizontalOverflow(page)
      if (tabOverflow.overflow) {
        console.warn(`overflow on tab ${tab.file} @ ${width}px`, tabOverflow)
      }
    }
  }

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
