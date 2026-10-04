import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = '/opt/cursor/artifacts/screenshots'
const BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:4317/gwb-fe006a16/'

async function openSlidesTab(page) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 120_000 })
  await page.waitForSelector('nav[aria-label="Sections"]', { timeout: 120_000 })
  await page.getByRole('button', { name: 'Slides' }).click()
  await page.waitForSelector('h3:has-text("Week 4 Report")', { timeout: 120_000 })
}

async function waitForGalleryImages(page) {
  const thumbs = page.locator('section ul li button img')
  const count = await thumbs.count()
  for (let i = 0; i < count; i++) {
    await thumbs.nth(i).scrollIntoViewIfNeeded()
  }
  await page.evaluate(async () => {
    const imgs = Array.from(
      document.querySelectorAll('section ul li button img'),
    )
    await Promise.all(
      imgs.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete && img.naturalWidth > 0) {
              resolve(undefined)
              return
            }
            img.addEventListener('load', () => resolve(undefined), {
              once: true,
            })
            img.addEventListener('error', () => resolve(undefined), {
              once: true,
            })
          }),
      ),
    )
    await Promise.all(
      imgs.map(async (img) => {
        if (typeof img.decode === 'function') {
          try {
            await img.decode()
          } catch {
            /* ignore */
          }
        }
      }),
    )
  })
}

async function waitForLightboxImage(page) {
  const img = page.locator('[role="dialog"] img').first()
  await img.waitFor({ state: 'visible', timeout: 30_000 })
  await img.evaluate((el) =>
    new Promise((resolve, reject) => {
      const done = () => {
        if (el.naturalWidth > 0) resolve(undefined)
        else reject(new Error('image has zero natural size'))
      }
      if (el.complete) done()
      else {
        el.addEventListener('load', done, { once: true })
        el.addEventListener('error', () => reject(new Error('image error')), {
          once: true,
        })
      }
    }),
  )
  await img.evaluate(async (el) => {
    if (typeof el.decode === 'function') await el.decode()
  })
  await page.waitForTimeout(200)
}

async function captureSlides(page, width) {
  const height = width === 390 ? 844 : 900
  await page.setViewportSize({ width, height })
  await openSlidesTab(page)
  await waitForGalleryImages(page)
  await page.screenshot({
    path: join(OUT, `gwb-slides-gallery-${width}.png`),
    fullPage: true,
  })
  console.log('gallery', width)

  await page.locator('section ul li button').first().click()
  await page.waitForSelector('[role="dialog"]', { timeout: 10_000 })
  await waitForLightboxImage(page)
  await page.screenshot({
    path: join(OUT, `gwb-slides-lightbox-${width}.png`),
    fullPage: false,
  })
  console.log('lightbox', width)
  await page.getByRole('button', { name: 'Close slide viewer' }).click()
}

async function verifyMobileScroll(page) {
  await page.setViewportSize({ width: 390, height: 844 })
  await openSlidesTab(page)
  const thumbs = page.locator('section ul li button img')
  const count = await thumbs.count()
  let loaded = 0
  for (let i = 0; i < count; i++) {
    await thumbs.nth(i).scrollIntoViewIfNeeded()
    await thumbs.nth(i).evaluate((el) =>
      new Promise((resolve) => {
        if (el.complete && el.naturalWidth > 0) resolve(undefined)
        else el.addEventListener('load', () => resolve(undefined), { once: true })
      }),
    )
    const nw = await thumbs.nth(i).evaluate((el) => el.naturalWidth)
    if (nw > 0) loaded++
  }
  if (loaded !== count) {
    throw new Error(`mobile scroll: only ${loaded}/${count} thumbs loaded`)
  }
  console.log('mobile scroll ok', loaded)
}

async function copyFixedMasters() {
  const { copyFile } = await import('node:fs/promises')
  const fixedDir = new URL('../../../docs/gwb-fixed-slides/', import.meta.url)
  const names = [
    'w4-slide-10.png',
    'w4-slide-14.png',
    'w4-slide-16.png',
    'vs-m3-hadi-manny.png',
  ]
  for (const name of names) {
    const src = new URL(name, fixedDir)
    const dest = join(OUT, `gwb-fixed-${name}`)
    await copyFile(src, dest)
    console.log('fixed master', dest)
  }
}

async function main() {
  await mkdir(OUT, { recursive: true })
  await copyFixedMasters()
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await verifyMobileScroll(page)
  for (const w of [390, 1280]) {
    await captureSlides(page, w)
  }
  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
