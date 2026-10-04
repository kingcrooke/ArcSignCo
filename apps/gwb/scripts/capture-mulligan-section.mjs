import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = '/opt/cursor/artifacts/screenshots'
const BASE =
  process.env.PREVIEW_URL || 'http://127.0.0.1:4317/gwb-fe006a16/'

async function capture(page, width) {
  await page.setViewportSize({ width, height: width === 390 ? 900 : 900 })
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 120_000 })
  await page.waitForSelector('#mulligans-section', { timeout: 120_000 })
  const section = page.locator('#mulligans-section')
  await section.scrollIntoViewIfNeeded()
  const path = join(OUT, `gwb-mulligans-section-${width}.png`)
  await section.screenshot({ path })
  console.log('wrote', path)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()

  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 120_000 })
  await page.waitForSelector('#mulligans-section', { timeout: 120_000 })
  const text = await page.locator('#mulligans-section').innerText()
  const mustNot = ['Hady', '+7.3', 'pending', 'staged', 'Week 4 swap', '(………)']
  if (/\(\.{3,}\)/.test(text) || text.includes('………')) {
    throw new Error('Dot placeholder still visible in mulligan section')
  }
  for (const token of mustNot) {
    if (text.toLowerCase().includes(token.toLowerCase())) {
      throw new Error(`Forbidden token visible in mulligan section: ${token}`)
    }
  }
  for (const token of [
    'Mauricio',
    'Manny',
    'Malachi Fields',
    'NarkingR',
    'Santagua',
    '+5.3',
    'Hadi',
    '5 used',
  ]) {
    if (!text.includes(token)) {
      throw new Error(`Expected token missing: ${token}`)
    }
  }
  if ((text.match(/Used —/g) || []).length !== 5) {
    throw new Error('Expected exactly 5 Used rows in manager table')
  }

  for (const w of [1280, 390]) {
    await capture(page, w)
  }

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
