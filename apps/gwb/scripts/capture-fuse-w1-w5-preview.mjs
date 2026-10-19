import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const BASE =
  process.env.GWB_PREVIEW_BASE ??
  'https://deploy-preview-109--arcsign.netlify.app/gwb-fe006a16/'
const OUT = '/opt/cursor/artifacts/gwb-fuse-w1-w5'

async function shot(page, name, opts = {}) {
  const path = join(OUT, name)
  await page.screenshot({ path, ...opts })
  console.log('wrote', path)
  return path
}

async function verifyWeekMatchups(page, week) {
  await page.goto(`${BASE}?tab=gallery&week=${week}`, {
    waitUntil: 'domcontentloaded',
    timeout: 120_000,
  })
  await page.waitForSelector('text=Matchups', { timeout: 60_000 })
  const section = page.locator(`#graphics-week-${week}-matchups`)
  await section.waitFor({ timeout: 60_000 })
  const items = section.locator('li[data-slide-id^="vs-w"]')
  const count = await items.count()
  const sizes = []
  for (let i = 0; i < count; i++) {
    const item = items.nth(i)
    await item.scrollIntoViewIfNeeded()
    const img = item.locator('img').first()
    await img.waitFor({ state: 'visible', timeout: 30_000 })
    await img.evaluate((el) =>
      new Promise((resolve) => {
        if (el.complete && el.naturalWidth > 0) resolve(undefined)
        else el.addEventListener('load', () => resolve(undefined), { once: true })
      }),
    )
    const src = await img.getAttribute('src')
    const natural = await img.evaluate((el) => ({
      w: el.naturalWidth,
      h: el.naturalHeight,
    }))
    sizes.push({ id: await item.getAttribute('data-slide-id'), src, ...natural })
  }

  let resultsCount = 0
  const results = page.locator(`#graphics-week-${week}-results`)
  if (await results.count()) {
    const rItems = results.locator('li[data-slide-id^="results-w"]')
    resultsCount = await rItems.count()
  }

  return { week, matchupCount: count, matchupSizes: sizes, resultsCount }
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()

  const reports = []
  for (const week of [1, 2, 3, 4, 5, 6]) {
    reports.push(await verifyWeekMatchups(page, week))
  }

  await page.setViewportSize({ width: 1280, height: 900 })
  for (const week of [1, 4, 5]) {
    await page.goto(`${BASE}?tab=gallery&week=${week}`, {
      waitUntil: 'domcontentloaded',
      timeout: 120_000,
    })
    await page.waitForSelector('text=Matchups', { timeout: 60_000 })
    await shot(page, `week${week}-graphics-desktop.png`, { fullPage: true })
  }

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${BASE}?tab=gallery&week=1`, {
    waitUntil: 'domcontentloaded',
    timeout: 120_000,
  })
  await page.waitForSelector('text=Matchups', { timeout: 60_000 })
  const mobilePath = await shot(page, 'week1-graphics-mobile.png', { fullPage: true })

  await writeFile(join(OUT, 'image-verify.json'), JSON.stringify(reports, null, 2))
  console.log(JSON.stringify(reports, null, 2))

  await browser.close()
  console.log('mobile', mobilePath)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
