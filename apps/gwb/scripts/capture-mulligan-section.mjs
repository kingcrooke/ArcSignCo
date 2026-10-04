import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = '/opt/cursor/artifacts/screenshots'
const BASE =
  process.env.PREVIEW_URL || 'http://127.0.0.1:4317/gwb-fe006a16/'

async function capture(width) {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 120_000 })
  await page.getByRole('button', { name: 'Mulligans' }).click()
  await page.waitForSelector('#mulligans-section', { timeout: 120_000 })
  const section = page.locator('#mulligans-section')
  await section.scrollIntoViewIfNeeded()
  const path = join(OUT, `gwb-mulligans-section-${width}.png`)
  await page.screenshot({ path, fullPage: true })
  console.log('wrote', path)

  const text = await section.innerText()
  const mustNot = ['Hady', '+7.3', 'pending', 'staged', 'Week 4 swap', '(………)']
  if (text.includes('………')) {
    throw new Error('Dot placeholder still visible in mulligan section')
  }
  for (const token of mustNot) {
    if (text.includes(token)) {
      throw new Error(`Forbidden token visible in mulligan section: ${token}`)
    }
  }

  await browser.close()
}

async function main() {
  await mkdir(OUT, { recursive: true })
  for (const width of [1280, 390]) {
    await capture(width)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
