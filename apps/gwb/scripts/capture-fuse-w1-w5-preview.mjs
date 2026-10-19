import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const BASE =
  process.env.GWB_PREVIEW_BASE ??
  'https://deploy-preview-107--arcsign.netlify.app/gwb-fe006a16/'
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
  const section = page.locator('section').filter({ hasText: 'Matchups' }).first()
  await section.scrollIntoViewIfNeeded()
  const imgs = section.locator('img[src*="/slides/vs-w"]')
  const count = await imgs.count()
  const sizes = []
  for (let i = 0; i < count; i++) {
    const img = imgs.nth(i)
    const src = await img.getAttribute('src')
    const natural = await img.evaluate((el) => ({
      w: el.naturalWidth,
      h: el.naturalHeight,
    }))
    sizes.push({ src, ...natural })
  }
  return { week, count, sizes }
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()

  const reports = []
  for (const week of [1, 4, 5, 6]) {
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
