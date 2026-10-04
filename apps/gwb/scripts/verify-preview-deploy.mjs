import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = '/opt/cursor/artifacts/screenshots'
const PREVIEW =
  process.env.PREVIEW_URL ||
  'https://deploy-preview-30--arcsign.netlify.app/gwb-fe006a16/'
const ORIGIN = new URL(PREVIEW).origin
const BASE_PATH = '/gwb-fe006a16/'

async function curlCheck(url) {
  const res = await fetch(url, { redirect: 'follow' })
  return res.status
}

async function verifyBundle() {
  const html = await (await fetch(PREVIEW)).text()
  const jsMatch = html.match(/assets\/index-[^"]+\.js/)
  if (!jsMatch) throw new Error('No JS bundle in index.html')
  const jsUrl = `${ORIGIN}${BASE_PATH}${jsMatch[0]}`
  const js = await (await fetch(jsUrl)).text()
  if (!js.includes('Mulligan')) throw new Error('Bundle missing Mulligan')
  const igTabMarkers = [
    'Instagram graphics',
    'Download standings PNG',
    '{id:"ig"',
    "id:'ig'",
    'label:"IG"',
  ]
  for (const marker of igTabMarkers) {
    if (js.includes(marker)) throw new Error(`Bundle still contains IG UI marker: ${marker}`)
  }
  console.log('bundle ok', jsMatch[0])
  return jsMatch[0]
}

async function verifySlides() {
  const weeks = [1, 2, 3]
  const fails = []
  for (const w of weeks) {
    for (let i = 1; i <= 16; i++) {
      const id = `w${w}-slide-${String(i).padStart(2, '0')}`
      for (const variant of ['thumb', 'full']) {
        for (const ext of ['webp', 'jpg']) {
          const url = `${ORIGIN}${BASE_PATH}slides/${id}.${variant}.${ext}`
          const status = await curlCheck(url)
          if (status !== 200) fails.push(`${url} → ${status}`)
        }
      }
    }
  }
  if (fails.length) {
    throw new Error(`Slide assets failed:\n${fails.slice(0, 8).join('\n')}\n…${fails.length} total`)
  }
  console.log('all w1–w3 slide webp/jpg assets return 200')
}

async function waitForApp(page) {
  await page.goto(PREVIEW, { waitUntil: 'domcontentloaded', timeout: 180_000 })
  await page.waitForSelector('nav.gwb-section-tabs', { timeout: 180_000 })
  await page
    .getByText('Loading GWB league data')
    .waitFor({ state: 'detached', timeout: 180_000 })
    .catch(() => {})
}

async function scrollReportColumn(page, week) {
  await waitForApp(page)
  await page.getByLabel('NFL Week').selectOption(String(week))
  await page.getByRole('button', { name: 'Graphics', exact: true }).click()
  const report = page.locator(`#graphics-week-${week}-report`)
  await report.waitFor({ timeout: 120_000 })
  await report.scrollIntoViewIfNeeded()
  const imgs = report.locator('img')
  const count = await imgs.count()
  if (count < 16) throw new Error(`Week ${week} report: expected 16 imgs, got ${count}`)
  for (let i = 0; i < count; i++) {
    await imgs.nth(i).scrollIntoViewIfNeeded()
    await page.waitForTimeout(150)
  }
  await page.waitForTimeout(500)
}

async function shot(page, name, width, fn) {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
  await fn()
  const path = join(OUT, `${name}-${width}.png`)
  await page.screenshot({ path, fullPage: true })
  console.log('wrote', path)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const bundle = await verifyBundle()
  await verifySlides()

  const browser = await chromium.launch()
  const page = await browser.newPage()

  for (const width of [1280, 390]) {
    await shot(page, 'gwb-preview-nav-standings', width, async () => {
      await waitForApp(page)
      await page.getByRole('button', { name: 'Standings', exact: true }).click()
    })
    await shot(page, 'gwb-preview-nav-mulligans', width, async () => {
      await page.getByRole('button', { name: 'Mulligans', exact: true }).click()
    })
  }

  for (const week of [1, 4]) {
    for (const width of [1280, 390]) {
      await shot(page, `gwb-preview-standings-week${week}`, width, async () => {
        await waitForApp(page)
        await page.getByLabel('NFL Week').selectOption(String(week))
        await page.getByRole('button', { name: 'Standings', exact: true }).click()
        await page.waitForSelector('table tbody tr', { timeout: 120_000 })
      })
    }
  }

  for (const week of [1, 4]) {
    for (const width of [1280, 390]) {
      await shot(page, `gwb-preview-mulligans-week${week}`, width, async () => {
        await waitForApp(page)
        await page.getByLabel('NFL Week').selectOption(String(week))
        await page.getByRole('button', { name: 'Mulligans', exact: true }).click()
        await page.waitForSelector('#mulligans-section', { timeout: 120_000 })
      })
    }
  }

  for (const week of [1, 2, 3]) {
    for (const width of [1280, 390]) {
      await shot(page, `gwb-preview-report-week${week}`, width, async () => {
        await scrollReportColumn(page, week)
      })
    }
  }

  await browser.close()
  await writeFile(
    join(OUT, 'gwb-preview-verify.txt'),
    `bundle: ${bundle}\npreview: ${PREVIEW}\n`,
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
