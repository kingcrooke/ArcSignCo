import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const PREVIEW =
  process.env.PREVIEW_URL ??
  'https://deploy-preview-106--arcsign.netlify.app/gwb-fe006a16/'
const OUT = '/opt/cursor/artifacts/screenshots'

async function waitForApp(page) {
  await page.goto(`${PREVIEW}?tab=mulligans&week=6`, {
    waitUntil: 'domcontentloaded',
    timeout: 180_000,
  })
  await page.waitForSelector('nav.gwb-section-tabs', { timeout: 180_000 })
  await page
    .getByText('Loading GWB league data')
    .waitFor({ state: 'detached', timeout: 180_000 })
    .catch(() => {})
  await page.waitForSelector('#mulligans-section', { timeout: 180_000 })
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const html = await (await fetch(PREVIEW)).text()
  const jsMatch = html.match(/assets\/index-[^"]+\.js/)
  if (!jsMatch) throw new Error('No bundle in preview index.html')
  console.log('bundle', jsMatch[0])

  const browser = await chromium.launch()
  const page = await browser.newPage()

  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
    await waitForApp(page)
    const body = await page.locator('#mulligans-section').innerText()
    if (!body.includes('Jamil')) throw new Error('Jamil mulligan not visible')
    if (!body.includes('Ferguson')) throw new Error('Ferguson not visible')
    if (body.includes('pending commish') || body.includes('Called, pending')) {
      throw new Error('Unexpected pending commish copy')
    }
    if (body.includes('TBD') || body.includes('so far')) {
      throw new Error('Expected finalized mulligan copy')
    }
    if (!body.includes('+1.90') && !body.includes('+1.9')) {
      throw new Error('Expected +1.9 net impact')
    }
    if (!body.includes('134.98') || !body.includes('137.59')) {
      throw new Error('Expected final matchup scores')
    }
    if (!body.includes('No flip')) {
      throw new Error('Expected no-flip result line')
    }
    const path = join(OUT, `gwb-w6-mulligan-jamil-${width}.png`)
    await page.screenshot({ path, fullPage: true })
    console.log('wrote', path)
  }

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
