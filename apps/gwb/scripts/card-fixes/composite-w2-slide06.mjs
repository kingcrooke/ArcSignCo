/**
 * Render w2-slide-06 without hero, composite hero, then #0a0f14 gradient fades.
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

const HERO_LEFT = 640
const HERO_WIDTH = 1080 - HERO_LEFT
const HERO_HEIGHT = 1350
const BG = { r: 10, g: 15, b: 20 }
const LEFT_FADE_W = 280

function luma(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b
}

function smoothstep(t) {
  const x = Math.max(0, Math.min(1, t))
  return x * x * (3 - 2 * x)
}

async function heroBuffer() {
  const { width: sw, height: sh } = await sharp(HERO_SRC).metadata()
  const cropW = Math.min(640, sw)
  const left = Math.max(0, Math.floor(sw * 0.12))
  const resized = await sharp(HERO_SRC)
    .extract({ left, top: 0, width: cropW, height: sh })
    .resize(HERO_WIDTH, HERO_HEIGHT, { fit: 'cover', position: 'top' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { data, info } = resized
  const w = info.width
  const h = info.height
  const ch = info.channels
  const bottomStart = h * 0.7
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * ch
      let a = data[i + 3] / 255
      if (x < LEFT_FADE_W) a *= smoothstep(x / LEFT_FADE_W)
      if (y >= bottomStart) a *= 1 - smoothstep((y - bottomStart) / (h - bottomStart))
      data[i + 3] = Math.round(a * 255)
    }
  }
  return sharp(data, { raw: { width: w, height: h, channels: ch } }).png().toBuffer()
}

async function leftFadeOverlay() {
  const svg = `<svg width="${LEFT_FADE_W}" height="${HERO_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lf" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="rgb(${BG.r},${BG.g},${BG.b})" stop-opacity="1"/>
        <stop offset="100%" stop-color="rgb(${BG.r},${BG.g},${BG.b})" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="${LEFT_FADE_W}" height="${HERO_HEIGHT}" fill="url(#lf)"/>
  </svg>`
  return sharp(Buffer.from(svg)).png().toBuffer()
}

async function bottomFadeOverlay() {
  const fadeTop = Math.floor(HERO_HEIGHT * 0.7)
  const fadeH = HERO_HEIGHT - fadeTop
  const svg = `<svg width="${HERO_WIDTH}" height="${fadeH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bf" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgb(${BG.r},${BG.g},${BG.b})" stop-opacity="0"/>
        <stop offset="100%" stop-color="rgb(${BG.r},${BG.g},${BG.b})" stop-opacity="1"/>
      </linearGradient>
    </defs>
    <rect width="${HERO_WIDTH}" height="${fadeH}" fill="url(#bf)"/>
  </svg>`
  return sharp(Buffer.from(svg)).png().toBuffer()
}

export function printW2Slide06LumaCheck(data, w, ch) {
  const rgb = (x, y) => {
    const i = (y * w + x) * ch
    return [data[i], data[i + 1], data[i + 2]]
  }
  console.log('--- w2-slide-06 luma self-check ---')
  const row = 600
  let maxHoriz = 0
  let maxHorizAt = { x: 0, y: row }
  for (let x = 630; x < 820; x++) {
    const d = Math.abs(luma(...rgb(x + 1, row)) - luma(...rgb(x, row)))
    if (d > maxHoriz) {
      maxHoriz = d
      maxHorizAt = { x, y: row }
    }
  }
  console.log('max horizontal luma step along y=600 (x630-820):', maxHoriz.toFixed(2), 'at x', maxHorizAt.x)

  const xCol = 760
  const fadeY0 = Math.floor(HERO_HEIGHT * 0.7)
  let maxVert = 0
  let maxVertAt = { x: xCol, y: fadeY0 }
  for (let y = Math.max(800, fadeY0); y < 1080; y++) {
    const d = Math.abs(luma(...rgb(xCol, y)) - luma(...rgb(xCol, y - 1)))
    if (d > maxVert) {
      maxVert = d
      maxVertAt = { x: xCol, y }
    }
  }
  console.log('max vertical luma step along x=760 (y800-1080):', maxVert.toFixed(2), 'at y', maxVertAt.y)

  const samples = [630, 660, 700, 740, 780, 820]
  const lum = samples.map((x) => luma(...rgb(x, row)).toFixed(1))
  console.log(`luma y=${row} x=[${samples.join(',')}]:`, lum.join(', '))

  const fail = maxHoriz > 8 || maxVert > 8
  if (fail) console.error('FAIL luma step > 8')
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
  const fadeTop = Math.floor(HERO_HEIGHT * 0.7)

  const outPng = path.join(OUT, 'w2-slide-06.png')
  await sharp(basePng)
    .composite([
      { input: heroBuf, left: HERO_LEFT, top: 0 },
      { input: leftFade, left: HERO_LEFT, top: 0 },
      { input: leftFade, left: HERO_LEFT - 80, top: 0, blend: 'over' },
      { input: bottomFade, left: HERO_LEFT, top: fadeTop },
      { input: bottomFade, left: HERO_LEFT, top: fadeTop - 24, blend: 'over' },
    ])
    .removeAlpha()
    .png()
    .toFile(outPng)

  const { data, info } = await sharp(outPng).raw().toBuffer({ resolveWithObject: true })
  const ok = printW2Slide06LumaCheck(data, info.width, info.channels)
  if (!ok) throw new Error('w2-slide-06 luma self-check failed')

  await sharp(outPng).resize(1080, 1350, { fit: 'fill' }).png().toFile(path.join(SLIDE_SOURCES, 'w2-slide-06.png'))
  console.log('wrote w2-slide-06 (composited hero + fades)')
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
