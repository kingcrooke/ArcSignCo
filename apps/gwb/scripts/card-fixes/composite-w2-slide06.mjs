/**
 * w2-slide-06: base + hero flush to top/right + 4-edge fades on hero alpha rect.
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
const BG_HEX = '#0a0f14'
const FADE = { left: 160, right: 40, top: 60, bottomFrac: 0.35, outside: 2 }

export function luma(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b
}

export function alphaBoundsRgba(data, w, h, ch, offsetX, offsetY, alphaMin = 12) {
  let x0 = w
  let y0 = h
  let x1 = -1
  let y1 = -1
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * ch
      const a = ch === 4 ? data[i + 3] : 255
      if (a < alphaMin) continue
      const lx = offsetX + x
      const ly = offsetY + y
      x0 = Math.min(x0, lx)
      y0 = Math.min(y0, ly)
      x1 = Math.max(x1, lx)
      y1 = Math.max(y1, ly)
    }
  }
  if (x1 < x0) return null
  return { left: x0, top: y0, right: x1 + 1, bottom: y1 + 1 }
}

async function heroLayer() {
  const meta = await sharp(HERO_SRC).metadata()
  const sw = meta.width
  const sh = meta.height
  const extractW = Math.min(sw, Math.floor(sw * 0.86))
  const extractLeft = Math.floor(sw * 0.08)
  const padL = 182
  const padR = 52
  const innerW = HERO_WIDTH - padL - padR
  const innerH = Math.round(HERO_HEIGHT * 0.84)
  const buf = await sharp(HERO_SRC)
    .extract({ left: extractLeft, top: 0, width: extractW, height: sh })
    .resize(innerW, innerH, { fit: 'cover', position: 'top' })
    .extend({
      top: 0,
      bottom: HERO_HEIGHT - innerH,
      left: padL,
      right: padR,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()
  const rect = {
    left: HERO_LEFT,
    top: HERO_TOP,
    right: HERO_LEFT + HERO_WIDTH,
    bottom: HERO_TOP + HERO_HEIGHT,
  }
  return { buf, rect, drawLeft: HERO_LEFT, drawTop: HERO_TOP }
}

async function fadeOverlays(rect) {
  const { left, top, right, bottom } = rect
  const w = right - left
  const h = bottom - top
  const o = FADE.outside
  const bottomH = Math.round(h * FADE.bottomFrac)
  const svgW = 1080
  const svgH = 1350
  const shapes = []
  const lf0 = left - o - FADE.left
  const lf1 = left - o
  shapes.push(
    `<linearGradient id="gl" x1="${lf0}" y1="0" x2="${lf1}" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${BG_HEX}" stop-opacity="1"/>
      <stop offset="1" stop-color="${BG_HEX}" stop-opacity="0"/>
    </linearGradient>`,
  )
  shapes.push(`<rect x="${lf0}" y="${top - o - FADE.top}" width="${FADE.left + o}" height="${h + o * 2 + FADE.top + bottomH}" fill="url(#gl)"/>`)

  const rf0 = right + o
  const rf1 = right + o + FADE.right
  shapes.push(
    `<linearGradient id="gr" x1="${rf0}" y1="0" x2="${rf1}" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${BG_HEX}" stop-opacity="0"/>
      <stop offset="1" stop-color="${BG_HEX}" stop-opacity="1"/>
    </linearGradient>`,
  )
  shapes.push(`<rect x="${rf0}" y="${top - o - FADE.top}" width="${FADE.right + o}" height="${h + o * 2 + FADE.top + bottomH}" fill="url(#gr)"/>`)

  const tf0 = top - o - FADE.top
  const tf1 = top - o
  shapes.push(
    `<linearGradient id="gt" x1="0" y1="${tf0}" x2="0" y2="${tf1}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${BG_HEX}" stop-opacity="1"/>
      <stop offset="1" stop-color="${BG_HEX}" stop-opacity="0"/>
    </linearGradient>`,
  )
  shapes.push(`<rect x="${left - o - FADE.left}" y="${tf0}" width="${w + FADE.left + FADE.right + o * 2}" height="${FADE.top + o}" fill="url(#gt)"/>`)

  const bf0 = bottom + o
  const bf1 = bottom + o + bottomH
  shapes.push(
    `<linearGradient id="gb" x1="0" y1="${bf0}" x2="0" y2="${bf1}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${BG_HEX}" stop-opacity="0"/>
      <stop offset="1" stop-color="${BG_HEX}" stop-opacity="1"/>
    </linearGradient>`,
  )
  shapes.push(`<rect x="${left - o - FADE.left}" y="${bf0}" width="${w + FADE.left + FADE.right + o * 2}" height="${bottomH + o}" fill="url(#gb)"/>`)
  shapes.push(
    `<rect x="${left - o - FADE.left}" y="${bf1}" width="${w + FADE.left + FADE.right + o * 2}" height="${1350 - bf1}" fill="${BG_HEX}"/>`,
  )

  const svg = `<svg width="${svgW}" height="${svgH}" xmlns="http://www.w3.org/2000/svg">
    <defs>${shapes.filter((s) => s.startsWith('<linear')).join('')}</defs>
    ${shapes.filter((s) => s.startsWith('<rect')).join('')}
  </svg>`
  return sharp(Buffer.from(svg)).png().toBuffer()
}

export function perimeterMaxStep(data, w, ch, rect) {
  const lum = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= 1350) return null
    const i = (y * w + x) * ch
    return luma(data[i], data[i + 1], data[i + 2])
  }
  const { left, top, right, bottom } = rect
  const d = 3
  const loop = []
  for (let x = left - d; x < right + d; x++) loop.push([x, top - d])
  for (let y = top - d; y < bottom + d; y++) loop.push([right + d - 1, y])
  for (let x = right + d - 2; x >= left - d; x--) loop.push([x, bottom + d - 1])
  for (let y = bottom + d - 2; y >= top - d; y--) loop.push([left - d, y])
  const vals = loop.map(([x, y]) => lum(x, y)).filter((v) => v != null)
  let maxStep = 0
  let maxAt = 0
  for (let i = 1; i < vals.length; i++) {
    const step = Math.abs(vals[i] - vals[i - 1])
    if (step > maxStep) {
      maxStep = step
      maxAt = i
    }
  }
  return { maxStep, maxAt }
}

export function printW2Slide06SelfCheck(data, w, ch, heroRect) {
  const rgb = (x, y) => {
    const i = (y * w + x) * ch
    return [data[i], data[i + 1], data[i + 2]]
  }
  console.log('--- w2-slide-06 self-check ---')
  console.log('hero alpha rect:', JSON.stringify(heroRect))

  const { maxStep, maxAt } = perimeterMaxStep(data, w, ch, heroRect)
  console.log('max perimeter adjacent luma step:', maxStep.toFixed(2), 'at', maxAt)

  let hornL = 9999
  let hornR = -1
  for (let y = 140; y < 520; y++) {
    for (let x = 620; x < 1080; x++) {
      if (luma(...rgb(x, y)) > 72) {
        hornL = Math.min(hornL, x)
        hornR = Math.max(hornR, x)
      }
    }
  }
  console.log('horn tip span (luma>72, y140-519):', hornL, '-', hornR)

  let footerInk = 0
  for (let y = 1240; y < 1320; y++) {
    for (let x = 880; x < 1060; x++) {
      const [r, g, b] = rgb(x, y)
      if (r + g + b > 120) footerInk++
    }
  }
  console.log('footer 6/16 ink pixels:', footerInk)

  const hornsOk = hornL >= 800 && hornR <= 1030 && hornR > 880
  const fail = maxStep > 8 || footerInk < 80 || !hornsOk
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

  const { buf: heroBuf, rect: heroRect, drawLeft, drawTop } = await heroLayer()
  const fadeBuf = await fadeOverlays(heroRect)

  const composed = await sharp(basePng)
    .composite([
      { input: heroBuf, left: drawLeft, top: drawTop },
      { input: fadeBuf, left: 0, top: 0 },
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
  const ok = printW2Slide06SelfCheck(data, info.width, info.channels, heroRect)
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
