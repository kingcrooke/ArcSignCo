import { chromium } from 'playwright'
import { copyFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = '/opt/cursor/artifacts/screenshots'
const BASE =
  process.env.PREVIEW_URL ||
  'https://deploy-preview-91--arcsign.netlify.app/gwb-fe006a16/'

const CARDS = [
  { n: 1, title: 'Crooke vs Manny' },
  { n: 2, title: 'Eric vs Steven' },
  { n: 3, title: 'Danny vs Frankie' },
  { n: 4, title: 'Narking vs Jamil' },
  { n: 5, title: 'Hady vs Matt' },
  { n: 6, title: 'Mauricio vs Kayser' },
]

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

  await page.goto(`${BASE}?week=6`, {
    waitUntil: 'networkidle',
    timeout: 180_000,
  })
  await page.waitForSelector('nav[aria-label="Sections"]', { timeout: 180_000 })
  await page.getByRole('button', { name: 'Graphics', exact: true }).click()
  await page.waitForSelector('#graphics-week-6-matchups', { timeout: 180_000 })
  const matchups = page.locator('#graphics-week-6-matchups')
  await matchups.scrollIntoViewIfNeeded()
  for (let pass = 0; pass < 8; pass++) {
    await page.evaluate(() => window.scrollBy(0, 400))
    await page.waitForTimeout(400)
  }
  await page.waitForFunction(
    () => {
      const imgs = document.querySelectorAll('#graphics-week-6-matchups img')
      if (imgs.length < 6) return false
      return [...imgs].every((img) => img.naturalWidth > 0)
    },
    { timeout: 180_000 },
  )

  const weekView = join(OUT, 'gwb-week6-graphics-matchups-1280.png')
  await page.screenshot({ path: weekView, fullPage: true })
  console.log('wrote', weekView)

  for (const { n, title } of CARDS) {
    const btn = page.locator(
      `#graphics-week-6-matchups button[aria-label="Open ${title}"]`,
    )
    await btn.click()
    await page.waitForSelector('[role="dialog"] img', { timeout: 60_000 })
    const dialogImg = page.locator('[role="dialog"] img').first()
    await dialogImg.waitFor({ state: 'visible' })
    const cardPath = join(OUT, `gwb-week6-card-m${n}.png`)
    await dialogImg.screenshot({ path: cardPath })
    console.log('wrote', cardPath)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(200)
  }

  await browser.close()

  for (const { n } of CARDS) {
    const src = join(
      new URL('../slide-sources', import.meta.url).pathname,
      `vs-w6-m${n}.png`,
    )
    const dest = join(OUT, `gwb-week6-card-m${n}-source.png`)
    try {
      await copyFile(src, dest)
    } catch {
      /* optional */
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
