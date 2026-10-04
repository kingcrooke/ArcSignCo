import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = '/opt/cursor/artifacts'
const BASE =
  process.env.PREVIEW_URL ||
  'https://deploy-preview-34--arcsign.netlify.app/gwb-fe006a16/'

const TABS = [
  { id: 'standings', label: 'Standings' },
  { id: 'gallery', label: 'Graphics' },
  { id: 'recaps', label: 'Recaps' },
  { id: 'mulligans', label: 'Mulligans' },
  { id: 'frankie', label: /Frankie/ },
]

async function shot(page, name, width) {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
  const path = join(OUT, `${name}-${width}.png`)
  await page.screenshot({ path, fullPage: true })
  console.log('wrote', path)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()

  const audioBefore = []
  page.on('request', (req) => {
    if (req.url().includes('/audio/')) audioBefore.push(req.url())
  })

  await page.setViewportSize({ width: 1280, height: 900 })
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 120_000 })
  await page.getByRole('heading', { name: /Standings/ }).waitFor({ timeout: 120_000 })
  const bundle = await page.locator('script[type="module"]').first().getAttribute('src')
  console.log('bundle:', bundle)
  console.log('audio requests before tap:', audioBefore.length)

  for (const tab of TABS) {
    if (tab.id === 'frankie') {
      await page.getByLabel('NFL Week').selectOption('3')
      await page.waitForTimeout(400)
    }
    await page.getByRole('button', { name: tab.label }).click()
    await page.waitForTimeout(800)
    if (tab.id === 'recaps') {
      await page.waitForTimeout(1500)
    }
    if (tab.id === 'frankie') {
      await page.locator('#frankie-zone-section').waitFor({ timeout: 60_000 })
      await page.waitForTimeout(600)
    }
    for (const w of [1280, 390]) {
      await shot(page, `preview-${tab.id}`, w)
    }
  }

  await page.getByRole('button', { name: /Sound/ }).click()
  await page.waitForTimeout(500)
  for (const w of [1280, 390]) {
    await shot(page, 'preview-sound-toggle', w)
  }

  // Deep link
  await page.goto(`${BASE}?week=3&tab=gallery&slide=w3-slide-16`, {
    waitUntil: 'networkidle',
  })
  await page.waitForSelector('[role="dialog"]', { timeout: 30_000 })
  await shot(page, 'preview-deeplink-slide', 1280)

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
