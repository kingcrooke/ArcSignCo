import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const OUT =
  process.env.DYNASTY_SCREENSHOTS_OUT ??
  '/opt/cursor/artifacts/dynasty-visual-mobile'
const BASE = process.env.DYNASTY_URL ?? 'http://127.0.0.1:4173/dynasty-1581d86a/'

const TAB_SHOTS = [
  { tab: 'standings', file: 'standings' },
  { tab: 'live', file: 'live' },
  { tab: 'gallery', file: 'graphics', week: 9 },
  { tab: 'waiver', file: 'waiver' },
  { tab: 'awards', file: 'awards' },
  { tab: 'bestgames', file: 'bestgames' },
]

async function shot(page, viewport, suffix, query) {
  await page.setViewportSize(viewport)
  await page.goto(`${BASE}?${query}`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(12_000)
  await page.screenshot({
    path: path.join(OUT, `${suffix}.png`),
    fullPage: true,
  })
}

async function shotPickerClip(page, viewport, suffix) {
  await page.setViewportSize(viewport)
  await page.goto(`${BASE}?season=2026&week=9&tab=standings`, {
    waitUntil: 'domcontentloaded',
  })
  await page.waitForTimeout(12_000)
  const pickers = page.locator('[data-testid="dynasty-pickers"]')
  await pickers.waitFor({ state: 'visible' })
  const box = await pickers.boundingBox()
  if (!box) throw new Error('picker row not found')
  await page.screenshot({
    path: path.join(OUT, `pickers-${suffix}.png`),
    clip: {
      x: Math.max(0, box.x - 8),
      y: Math.max(0, box.y - 8),
      width: box.width + 16,
      height: box.height + 16,
    },
  })
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()

  await shotPickerClip(page, { width: 360, height: 800 }, '360')
  await shotPickerClip(page, { width: 1280, height: 900 }, '1280')

  for (const { tab, file, week } of TAB_SHOTS) {
    const weekParam = week ?? 9
    const query = `season=2026&week=${weekParam}&tab=${tab}`
    for (const [label, viewport] of [
      ['360', { width: 360, height: 800 }],
      ['1280', { width: 1280, height: 900 }],
    ]) {
      await shot(page, viewport, `${file}-${label}`, query)
    }
  }

  await browser.close()
  console.log('saved', OUT)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
