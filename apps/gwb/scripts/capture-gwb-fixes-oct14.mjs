import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = '/opt/cursor/artifacts/gwb-fixes-oct14'

async function capture(base, label, page) {
  const consoleErrors = []
  page.on('pageerror', (e) => consoleErrors.push(String(e)))
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })

  await page.goto(`${base}?tab=standings&week=6`, {
    waitUntil: 'networkidle',
    timeout: 120_000,
  })
  await page.waitForSelector('nav[aria-label="Sections"]', { timeout: 120_000 })
  for (const [name, width] of [
    ['standings-header', 1280],
    ['standings-header', 390],
  ]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
    await page.screenshot({
      path: join(OUT, `${label}-${name}-${width}.png`),
      fullPage: false,
    })
  }

  await page.getByRole('button', { name: /Frankie/i }).click()
  await page.waitForSelector('#frankie-zone-section', { timeout: 60_000 })
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.screenshot({
    path: join(OUT, `${label}-frankie-zone-1280.png`),
    fullPage: true,
  })

  await page.goto(`${base}?tab=recaps&week=6`, {
    waitUntil: 'networkidle',
    timeout: 120_000,
  })
  await page.waitForSelector('h2', { timeout: 60_000 })
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.screenshot({
    path: join(OUT, `${label}-recaps-week6-1280.png`),
    fullPage: true,
  })

  await page.goto(`${base}?tab=waiver&week=5`, {
    waitUntil: 'networkidle',
    timeout: 120_000,
  })
  await page.waitForSelector('#waiver-wire-panel', { timeout: 60_000 })
  await page.screenshot({
    path: join(OUT, `${label}-waiver-1280.png`),
    fullPage: true,
  })

  if (consoleErrors.length) {
    console.warn(label, 'console errors:', consoleErrors)
  } else {
    console.log(label, 'no console errors')
  }
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const before = await browser.newPage()
  const after = await browser.newPage()
  await capture('https://gwb2026.netlify.app/gwb-fe006a16/', 'before', before)
  await capture('http://127.0.0.1:5173/gwb-fe006a16/', 'after', after)
  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
