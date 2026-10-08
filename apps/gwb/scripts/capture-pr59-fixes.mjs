import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = '/opt/cursor/artifacts/screenshots'
const BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:4317/gwb-fe006a16/'

const VIEWS = [
  { tab: 'Trades', id: '#trade-log-panel', name: 'gwb-trades' },
  { tab: 'Graphics', week: 5, id: '#graphics-week-5-matchups', name: 'gwb-share-cards' },
  { tab: 'Live', week: 5, id: '#live-scoreboard-panel', name: 'gwb-live-flip' },
  { tab: 'Timeline', id: '#season-timeline-panel', name: 'gwb-timeline' },
]

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()

  for (const view of VIEWS) {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 180_000 })
    await page.waitForSelector('nav[aria-label="Sections"]', { timeout: 180_000 })
    if (view.week) {
      await page.getByLabel('NFL Week').selectOption(String(view.week))
    }
    await page.getByRole('button', { name: view.tab, exact: true }).click()
    await page.waitForSelector(view.id, { timeout: 180_000 })
    if (view.tab === 'Trades') {
      await page.waitForFunction(
        () => !document.querySelector('#trade-log-panel')?.textContent?.includes('Loading trade history'),
        { timeout: 180_000 },
      )
    }
    if (view.name === 'gwb-share-cards') {
      await page.waitForFunction(
        () => {
          const imgs = document.querySelectorAll('#graphics-week-5-matchups img')
          if (imgs.length < 6) return false
          return [...imgs].every((img) => img.naturalWidth > 0)
        },
        { timeout: 180_000 },
      )
    }
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
      const path = join(OUT, `${view.name}-${width}.png`)
      await page.screenshot({ path, fullPage: true })
      console.log('wrote', path)
    }
  }

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
