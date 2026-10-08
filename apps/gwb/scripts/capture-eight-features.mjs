import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = '/opt/cursor/artifacts/screenshots'
const BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:4317/gwb-fe006a16/'

const VIEWS = [
  { tab: 'Trades', id: '#trade-log-panel', name: 'gwb-trades' },
  { tab: 'H2H', id: '#head-to-head-panel', name: 'gwb-h2h' },
  { tab: 'Awards', id: '#weekly-awards-panel', name: 'gwb-awards' },
  { tab: 'Timeline', id: '#season-timeline-panel', name: 'gwb-timeline' },
  { tab: 'Managers', id: '#manager-panel', name: 'gwb-managers' },
  { tab: 'Standings', id: '#playoff-odds-panel', name: 'gwb-playoff-odds' },
  { tab: 'Live', id: '#live-scoreboard-panel', name: 'gwb-live-flip' },
  { tab: 'Graphics', selector: 'section[id^="graphics-week-"]', name: 'gwb-share-cards' },
]

async function capture(page, name, width) {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
  const path = join(OUT, `${name}-${width}.png`)
  await page.screenshot({ path, fullPage: true })
  console.log('wrote', path)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()

  for (const view of VIEWS) {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 120_000 })
    await page.waitForSelector('nav[aria-label="Sections"]', { timeout: 120_000 })
    await page.getByRole('button', { name: view.tab, exact: true }).click()
    const waitSel = view.id ?? view.selector
    await page.waitForSelector(waitSel, { timeout: 120_000 })
    for (const width of [1280, 390]) {
      await capture(page, view.name, width)
    }
  }

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
