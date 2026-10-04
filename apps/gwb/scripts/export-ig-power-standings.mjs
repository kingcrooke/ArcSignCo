import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = '/opt/cursor/artifacts/screenshots'
const BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:4317'

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 120_000 })
  await page.waitForSelector('table', { timeout: 120_000 })
  await page.getByRole('button', { name: 'IG' }).click()

  const standingsDl = page.waitForEvent('download', { timeout: 60_000 })
  await page.getByRole('button', { name: 'Download standings PNG' }).click()
  await (await standingsDl).saveAs(join(OUT, 'ig-standings.png'))
  console.log('wrote ig-standings.png')

  const powerDl = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download power PNG' }).click()
  await (await powerDl).saveAs(join(OUT, 'ig-power.png'))
  console.log('wrote ig-power.png')

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
