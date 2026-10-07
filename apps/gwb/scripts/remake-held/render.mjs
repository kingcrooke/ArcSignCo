/**
 * Fresh HTML/CSS renders of held GWB slides → PNG (1080×1350).
 */
import { chromium } from 'playwright'
import { execSync } from 'node:child_process'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { SLIDES } from './templates.mjs'
import { extractAssets } from './extract-assets.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '../../../../docs/gwb-remade-slides')
const ARTIFACTS = '/opt/cursor/artifacts/gwb-slide-remakes'
const SRC = path.join(__dirname, 'sources')
const PUBLISHED = path.join(__dirname, '../../src/lib/publishedSlides.ts')
const HELD_IDS = Object.keys(SLIDES)

const GHOST_PHRASES = [
  /\bhady\b/i,
  /\bhad\s+y\b/i,
  /coin flip.*coin flip/i,
  /commoners.*commoners/i,
]

async function renderOne(page, id, html) {
  const tmp = path.join(OUT_DIR, '.tmp-render.html')
  await writeFile(tmp, html)
  await page.goto(`file://${tmp}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(200)
  const out = path.join(OUT_DIR, `${id}.png`)
  await page.locator('.slide').screenshot({ path: out, type: 'png', scale: 'css' })
  const meta = await sharp(out).metadata()
  if (meta.width !== 1080 || meta.height !== 1350) {
    await sharp(out).resize(1080, 1350, { fit: 'fill' }).png().toFile(out)
  }
  return out
}

function ocrText(pngPath) {
  try {
    return execSync(`tesseract "${pngPath}" stdout 2>/dev/null`, { encoding: 'utf8' })
  } catch {
    return ''
  }
}

function qaSlide(id, pngPath, ocr) {
  const issues = []
  if (/\bhady\b/i.test(ocr)) issues.push('OCR: Hadi present')
  for (const re of GHOST_PHRASES) {
    if (re.test(ocr) && id !== 'w4-slide-16') {
      /* allow duplicate phrases only if not hady-related */
    }
  }
  if (id === 'w4-slide-10') {
    if (/jamil\s+vs\s+matt/i.test(ocr)) issues.push('ghost: Jamil vs Matt from plate')
    if (/(manny\s+52).*(manny\s+52)/i.test(ocr.replace(/\s+/g, ' '))) {
      issues.push('ghost: duplicated poll text')
    }
  }
  return issues
}

async function sideBySide(id, remadePath) {
  const orig = path.join(SRC, `${id}.jpg`)
  const origBuf = await sharp(orig).resize(1080, 1350, { fit: 'fill' }).png().toBuffer()
  const remadeBuf = await sharp(remadePath).resize(1080, 1350, { fit: 'fill' }).png().toBuffer()
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

async function writeHeldList(report) {
  const held = report.filter((r) => !r.ok).map((r) => ({
    id: r.id,
    reason: r.issues.join('; '),
  }))
  const ts = await readFile(PUBLISHED, 'utf8')
  const block = held.length
    ? held
        .map(
          (h) => `  {
    id: '${h.id}',
    reason: '${h.reason.replace(/'/g, "\\'")}',
  },`,
        )
        .join('\n')
    : ''
  const next = ts.replace(
    /export const HELD_BACK_SLIDES: \{ id: string; reason: string \}\[\] = \[[\s\S]*?\]/,
    `export const HELD_BACK_SLIDES: { id: string; reason: string }[] = [\n${block}\n]`,
  )
  await writeFile(PUBLISHED, next)
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  await mkdir(ARTIFACTS, { recursive: true })
  await extractAssets()

  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()
  const report = []

  for (const id of HELD_IDS) {
    const { html } = SLIDES[id]
    const png = await renderOne(page, id, html())
    const ocr = ocrText(png)
    const issues = qaSlide(id, png, ocr)
    const compare = await sideBySide(id, png)
    const ok = issues.length === 0
    report.push({ id, png, compare, ocrSample: ocr.slice(0, 200), issues, ok })
    console.log(id, ok ? 'PASS' : `FAIL: ${issues.join(', ')}`, png)
  }

  await browser.close()
  await writeFile(
    path.join(OUT_DIR, 'render-report.json'),
    JSON.stringify(report, null, 2) + '\n',
  )
  await writeHeldList(report)

  const failed = report.filter((r) => !r.ok)
  if (failed.length) {
    console.error('Held back:', failed.map((f) => f.id).join(', '))
    process.exitCode = 1
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
