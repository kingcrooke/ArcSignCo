/**
 * Fresh HTML/CSS renders of held GWB slides → PNG (1080×1350).
 */
import { chromium } from 'playwright'
import { execSync } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { SLIDES } from './templates.mjs'
import { extractAssets } from './extract-assets.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '../../../../docs/gwb-remade-slides')
const ARTIFACTS = '/opt/cursor/artifacts/gwb-slide-remakes'
const SRC = path.join(__dirname, 'sources')
const HELD_IDS = Object.keys(SLIDES)

async function renderOne(page, id, html) {
  const tmp = path.join(OUT_DIR, '.tmp-render.html')
  await writeFile(tmp, html)
  await page.setViewportSize({ width: 1080, height: 1350 })
  await page.goto(`file://${tmp}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(300)
  const out = path.join(OUT_DIR, `${id}.png`)
  await page.locator('.slide').screenshot({ path: out, type: 'png' })
  return out
}

function ocrHasHady(pngPath) {
  try {
    const text = execSync(`tesseract "${pngPath}" stdout 2>/dev/null`, {
      encoding: 'utf8',
    })
    return /\bhady\b/i.test(text)
  } catch {
    return false
  }
}

async function sideBySide(id, remadePath) {
  const orig = path.join(SRC, `${id}.jpg`)
  const origBuf = await sharp(orig).resize(1080, 1350, { fit: 'fill' }).png().toBuffer()
  const remadeBuf = await sharp(remadePath).png().toBuffer()
  const out = path.join(ARTIFACTS, `${id}-compare.png`)
  const w = 1080
  const h = 1350
  const pad = 20
  await sharp({
    create: {
      width: w * 2 + pad * 3,
      height: h + pad * 2 + 48,
      channels: 3,
      background: { r: 24, g: 24, b: 24 },
    },
  })
    .composite([
      { input: origBuf, left: pad, top: pad + 40 },
      { input: remadeBuf, left: w + pad * 2, top: pad + 40 },
      {
        input: Buffer.from(
          `<svg width="${w * 2 + pad * 3}" height="48"><text x="20" y="32" fill="#e8b923" font-family="sans-serif" font-size="22">original (held source)</text><text x="${w + pad * 2 + 20}" y="32" fill="#e8b923" font-family="sans-serif" font-size="22">remake</text></svg>`,
        ),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toFile(out)
  return out
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  await mkdir(ARTIFACTS, { recursive: true })

  await extractAssets()

  const browser = await chromium.launch()
  const page = await browser.newPage()
  const report = []

  for (const id of HELD_IDS) {
    const { html } = SLIDES[id]
    const png = await renderOne(page, id, html())
    const hady = ocrHasHady(png)
    const compare = await sideBySide(id, png)
    report.push({ id, png, hady, compare, ok: !hady })
    console.log(id, hady ? 'FAIL OCR' : 'OK OCR', png)
  }

  await browser.close()
  await writeFile(
    path.join(OUT_DIR, 'render-report.json'),
    JSON.stringify(report, null, 2) + '\n',
  )

  const failed = report.filter((r) => !r.ok)
  if (failed.length) {
    console.error('OCR found Hady on:', failed.map((f) => f.id).join(', '))
    process.exitCode = 1
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
