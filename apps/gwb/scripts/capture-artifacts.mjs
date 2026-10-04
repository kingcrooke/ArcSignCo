import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = '/opt/cursor/artifacts/screenshots'
const BASE =
  process.env.PREVIEW_URL || 'http://127.0.0.1:4317/gwb-fe006a16/'

async function shot(page, name, width) {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 120_000 })
  await page.waitForSelector('nav[aria-label="Sections"]', { timeout: 120_000 })
  const path = join(OUT, `${name}-${width}.png`)
  await page.screenshot({ path, fullPage: true })
  console.log('wrote', path)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()

  for (const w of [1280, 390]) {
    await shot(page, 'gwb-nav-no-ig', w)
  }

  for (const week of [1, 2, 3, 4]) {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 120_000 })
    await page.getByLabel('NFL Week').selectOption(String(week))
    await page.waitForSelector('table', { timeout: 120_000 })
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
      await page.screenshot({
        path: join(OUT, `gwb-standings-week${week}-${width}.png`),
        fullPage: true,
      })
      console.log('standings week', week, width)
    }
  }

  for (const week of [1, 2, 3, 4]) {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 120_000 })
    await page.getByLabel('NFL Week').selectOption(String(week))
    await page.getByRole('button', { name: 'Mulligans' }).click()
    await page.waitForSelector('#mulligans-section', { timeout: 120_000 })
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
      await page.screenshot({
        path: join(OUT, `gwb-mulligans-week${week}-${width}.png`),
        fullPage: true,
      })
      console.log('mulligans week', week, width)
    }
  }

  for (const week of [1, 2, 3]) {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 120_000 })
    await page.getByLabel('NFL Week').selectOption(String(week))
    await page.getByRole('button', { name: 'Graphics' }).click()
    const report = page.locator(`#graphics-week-${week}-report`)
    await report.waitFor({ timeout: 120_000 })
    await report.scrollIntoViewIfNeeded()
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
      await report.screenshot({
        path: join(OUT, `gwb-report-week${week}-${width}.png`),
      })
      console.log('report week', week, width)
    }
  }

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
