import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = '/opt/cursor/artifacts/screenshots'
const BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:4317'

async function saveDownload(download, filename) {
  const path = join(OUT, filename)
  await download.saveAs(path)
  console.log('wrote', path)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 120_000 })
  await page.waitForSelector('table', { timeout: 120_000 })
  await page.getByRole('button', { name: 'IG' }).click()

  const standingsDl = page.waitForEvent('download', { timeout: 60_000 })
  await page.getByRole('button', { name: 'Download standings PNG' }).click()
  await saveDownload(await standingsDl, 'ig-standings.png')

  const powerDl = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download power PNG' }).click()
  await saveDownload(await powerDl, 'ig-power.png')

  const recapDl = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download recap PNG' }).click()
  await saveDownload(await recapDl, 'ig-recap.png')

  await page.getByRole('button', { name: 'Run overflow QA' }).click()
  await page.waitForTimeout(2000)
  await page.screenshot({
    path: join(OUT, 'ig-overflow-qa.png'),
    fullPage: true,
  })

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
