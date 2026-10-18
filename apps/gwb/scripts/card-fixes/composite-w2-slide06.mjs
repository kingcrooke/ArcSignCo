/**
 * w2-slide-06: base + hero (620-1080 × 0-1220) + SVG fades; footer on top.
 */
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { w2Slide06BaseHtml } from './rebuild/report-templates.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'rebuild/output')
const SLIDE_SOURCES = path.join(__dirname, '../slide-sources')
const HERO_SRC = path.join(__dirname, 'generated', 'eric-DAL-4-w2.jpg')

const HERO_LEFT = 620
const HERO_WIDTH = 1080 - HERO_LEFT
const HERO_TOP = 0
const HERO_HEIGHT = 1220
const BG = { r: 10, g: 15, b: 20 }
const LEFT_FADE_X0 = 620
const LEFT_FADE_X1 = 780
const BOTTOM_FADE_Y0 = 820
const BOTTOM_FADE_Y1 = 1180
const HERO_SCALE = 1.1
const HERO_CROP_LEFT = 0.36
const HERO_CROP_TOP = 0.05
const HERO_INSET_SCALE = 0.92
const HERO_INSET_X = 8

function luma(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b
}

async function heroBuffer() {
  const meta = await sharp(HERO_SRC).metadata()
  const sw = meta.width
  const sh = meta.height
  const innerW = Math.round(HERO_WIDTH * HERO_INSET_SCALE)
  const innerH = Math.round(HERO_HEIGHT * HERO_INSET_SCALE)
  const scale = Math.max(innerW / sw, innerH / sh) * HERO_SCALE
  const scaledW = Math.ceil(sw * scale)
  const scaledH = Math.ceil(sh * scale)
  const cropLeft = Math.min(
    Math.max(0, Math.floor(scaledW * HERO_CROP_LEFT)),
    scaledW - innerW,
  )
  const cropTop = Math.min(
    Math.max(0, Math.floor(scaledH * HERO_CROP_TOP)),
    scaledH - innerH,
  )
  const resized = await sharp(HERO_SRC)
    .resize(scaledW, scaledH, { fit: 'fill' })
    .extract({ left: cropLeft, top: cropTop, width: innerW, height: innerH })
    .png()
    .toBuffer()
  const padLeft = HERO_INSET_X
  const padTop = Math.round((HERO_HEIGHT - innerH) / 2)
  return sharp({
    create: {
      width: HERO_WIDTH,
      height: HERO_HEIGHT,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: resized, left: padLeft, top: padTop }])
    .png()
    .toBuffer()
}

async function leftFadeOverlay() {
  const pad = 24
  const overlayW = LEFT_FADE_X1 - LEFT_FADE_X0 + pad * 2
  const overlayH = 1350
  const gradW = LEFT_FADE_X1 - LEFT_FADE_X0
  const svg = `<svg width="${overlayW}" height="${overlayH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lf" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#0a0f14" stop-opacity="1"/>
        <stop offset="100%" stop-color="#0a0f14" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect x="${pad}" y="0" width="${gradW + pad}" height="${overlayH}" fill="url(#lf)"/>
  </svg>`
  return { buf: await sharp(Buffer.from(svg)).png().toBuffer(), left: LEFT_FADE_X0 - pad }
}

async function bottomFadeOverlay() {
  const padY = 80
  const y0 = BOTTOM_FADE_Y0 - padY
  const h = 1350 - y0
  const g0 = BOTTOM_FADE_Y0 - y0
  const g1 = BOTTOM_FADE_Y1 - y0
  const svg = `<svg width="${HERO_WIDTH}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bf" x1="0" y1="${g0}" x2="0" y2="${g1}" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#0a0f14" stop-opacity="0"/>
        <stop offset="1" stop-color="#0a0f14" stop-opacity="1"/>
      </linearGradient>
    </defs>
    <rect width="${HERO_WIDTH}" height="${h}" fill="url(#bf)"/>
    <rect y="${g1}" width="${HERO_WIDTH}" height="${h - g1}" fill="#0a0f14"/>
  </svg>`
  return { buf: await sharp(Buffer.from(svg)).png().toBuffer(), top: y0, left: HERO_LEFT }
}

export function printW2Slide06SelfCheck(data, w, ch) {
  const rgb = (buf, x, y) => {
    const i = (y * w + x) * ch
    return [buf[i], buf[i + 1], buf[i + 2]]
  }
  console.log('--- w2-slide-06 self-check ---')
  let maxStep = 0
  let maxAt = 0
  const rows = []
  for (let y = 600; y <= 1220; y += 10) {
    let sum = 0
    let n = 0
    for (let x = 760; x <= 1060; x++) {
      sum += luma(...rgb(data, x, y))
      n++
    }
    rows.push({ y, mean: sum / n })
  }
  console.log('row-mean luma (x760-1060, every 10px y600-1220):')
  for (const r of rows) console.log(`  y=${r.y}: ${r.mean.toFixed(1)}`)
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].y < 900) continue
    if (rows[i].mean > 40 || rows[i - 1].mean > 40) continue
    const d = Math.abs(rows[i].mean - rows[i - 1].mean)
    if (d > maxStep) {
      maxStep = d
      maxAt = rows[i].y
    }
  }
  console.log('max adjacent row-mean step (fade tail y>=900, mean<=40):', maxStep.toFixed(2), 'at y~', maxAt)

  const cols = []
  let maxColStep = 0
  let maxColAt = 0
  for (let x = 600; x <= 1080; x += 10) {
    cols.push({ x, l: luma(...rgb(data, x, 400)) })
  }
  console.log('column luma at y=400 (x600-1080, every 10px):')
  for (const c of cols) console.log(`  x=${c.x}: ${c.l.toFixed(1)}`)
  for (let i = 1; i < cols.length; i++) {
    const d = Math.abs(cols[i].l - cols[i - 1].l)
    if (d > maxColStep) {
      maxColStep = d
      maxColAt = cols[i].x
    }
  }
  console.log('max adjacent column step at y=400:', maxColStep.toFixed(2), 'at x~', maxColAt)

  let hornL = 9999
  let hornR = -1
  for (let y = 140; y < 520; y++) {
    for (let x = 620; x < 1080; x++) {
      if (luma(...rgb(data, x, y)) > 72) {
        hornL = Math.min(hornL, x)
        hornR = Math.max(hornR, x)
      }
    }
  }
  console.log('horn ink span (luma>72, y140-519):', hornL, '-', hornR)

  let footerInk = 0
  for (let y = 1240; y < 1320; y++) {
    for (let x = 880; x < 1060; x++) {
      const [r, g, b] = rgb(data, x, y)
      if (r + g + b > 120) footerInk++
    }
  }
  console.log('footer 6/16 ink pixels (x880-1060,y1240-1320):', footerInk)

  const hornsOk = hornL >= 660 && hornR <= 1060 && hornR > 900
  const fail = maxStep > 6 || footerInk < 80 || !hornsOk
  if (fail) console.error('FAIL w2-slide-06 self-check')
  return !fail
}

export async function renderW2Slide06Composite(page) {
  const html = w2Slide06BaseHtml()
  const tmp = path.join(OUT, '.tmp-w2-slide-06-base.html')
  await mkdir(OUT, { recursive: true })
  await writeFile(tmp, html)
  await page.goto(`file://${path.resolve(tmp)}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400)
  const basePng = path.join(OUT, 'w2-slide-06-base.png')
  await page.locator('.slide').screenshot({ path: basePng, type: 'png', scale: 'css' })

  const [heroBuf, leftFade, bottomFade] = await Promise.all([
    heroBuffer(),
    leftFadeOverlay(),
    bottomFadeOverlay(),
  ])

  const composed = await sharp(basePng)
    .composite([
      { input: heroBuf, left: HERO_LEFT, top: HERO_TOP },
      { input: leftFade.buf, left: leftFade.left, top: 0 },
      { input: bottomFade.buf, left: bottomFade.left, top: bottomFade.top },
    ])
    .png()
    .toBuffer()

  const footerStrip = await sharp(basePng).extract({ left: 0, top: 1220, width: 1080, height: 130 }).png().toBuffer()

  const outPng = path.join(OUT, 'w2-slide-06.png')
  await sharp(composed)
    .composite([{ input: footerStrip, left: 0, top: 1220 }])
    .removeAlpha()
    .png()
    .toFile(outPng)

  const { data, info } = await sharp(outPng).raw().toBuffer({ resolveWithObject: true })
  const ok = printW2Slide06SelfCheck(data, info.width, info.channels)
  if (!ok) throw new Error('w2-slide-06 self-check failed')

  await sharp(outPng).resize(1080, 1350, { fit: 'fill' }).png().toFile(path.join(SLIDE_SOURCES, 'w2-slide-06.png'))
  console.log('wrote w2-slide-06')
  return outPng
}

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
  await renderW2Slide06Composite(page)
  await browser.close()
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
if (isMain) main().catch((e) => { console.error(e); process.exit(1) })
