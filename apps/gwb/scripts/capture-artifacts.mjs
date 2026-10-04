import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = '/opt/cursor/artifacts/screenshots'
const BASE =
  process.env.PREVIEW_URL || 'http://127.0.0.1:4317/gwb-fe006a16/'

async function shot(page, name, width) {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 120_000 })
  await page.waitForSelector('table', { timeout: 120_000 })
  const path = join(OUT, `${name}-${width}.png`)
  await page.screenshot({ path, fullPage: true })
  console.log('wrote', path)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()

  for (const w of [1280, 390]) {
    await shot(page, 'standings', w)
  }

  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForSelector('table', { timeout: 120_000 })
  await page.getByRole('button', { name: 'Power' }).click()
  for (const w of [1280, 390]) {
    await page.setViewportSize({ width: w, height: w === 390 ? 844 : 900 })
    await page.screenshot({
      path: join(OUT, `power-${w}.png`),
      fullPage: true,
    })
  }

  await page.getByRole('button', { name: 'Recaps' }).click()
  await page.waitForSelector('summary', { timeout: 30_000 })
  const firstRecap = page.locator('details').first()
  if (!(await firstRecap.getAttribute('open'))) {
    await firstRecap.locator('summary').click()
  }
  for (const w of [1280, 390]) {
    await page.setViewportSize({ width: w, height: w === 390 ? 844 : 900 })
    await page.screenshot({
      path: join(OUT, `gwb-recaps-${w}.png`),
      fullPage: true,
    })
    console.log('recaps', w)
  }

  await page.getByRole('button', { name: 'IG' }).click()
  for (const w of [1280, 390]) {
    await page.setViewportSize({ width: w, height: w === 390 ? 844 : 900 })
    await page.screenshot({
      path: join(OUT, `graphics-${w}.png`),
      fullPage: true,
    })
  }

  await page.getByRole('button', { name: 'Download standings PNG' }).click()
  await page.waitForTimeout(2000)

  await browser.close()
  await writeFile(
    join(OUT, 'README.txt'),
    'Page screenshots at 1280 and 390px. IG PNGs generated via in-browser download during manual QA script.\n',
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
