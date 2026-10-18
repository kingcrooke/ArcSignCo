/**
 * Ink bounding boxes vs live m1 — print table (±4px tolerance).
 */
import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { cardHtml } from '../w5-matchup-cards/template-m2-m4-live-chrome.mjs'
import { m2m4PanelPath } from '../w5-matchup-cards/m2-m4-panel-path.mjs'
import { mergeMatchup } from './render-w5-m2-m4-main.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GWB = path.join(__dirname, '..', '..')
const LIVE = path.join(GWB, '..', '..', 'gwb-fe006a16', 'slides', 'vs-w5-m1.full.jpg')

const TARGETS = {
  kicker: { y0: 54, y1: 75, x0: 67, x1: 500, test: 'gold' },
  title: { y0: 147, y1: 218, x0: 67, x1: 900, test: 'white' },
  record: { y0: 239, y1: 268, x0: 120, x1: 960, test: 'gold', tight: true },
  bowl: { y0: 1038, y1: 1080, x0: 150, x1: 930, test: 'gold' },
  pctL: { y0: 1113, y1: 1145, x0: 67, x1: 420, test: 'goldPct' },
  pctR: { y0: 1112, y1: 1140, x0: 750, x1: 1013, test: 'pctWhite' },
  bar: { y0: 1156, y1: 1188, x0: 67, x1: 1013, test: 'bar' },
  clause: { y0: 1210, y1: 1242, x0: 100, x1: 980, test: 'grey' },
  handle: { y0: 1267, y1: 1294, x0: 67, x1: 400, test: 'grey' },
  footerR: { y0: 1267, y1: 1294, x0: 800, x1: 1013, test: 'footerWhite' },
  badge: { y0: 545, y1: 753, x0: 430, x1: 650, test: 'gold' },
}

const tests = {
  gold: (r, g, b) => g > 150 && r > 180 && b < 140,
  white: (r, g, b) => r > 240 && g > 240 && b > 240,
  goldPct: (r, g, b) => g > 170 && r > 200 && b < 120,
  pctWhite: (r, g, b) => r > 220 && g > 220 && b > 220,
  footerWhite: (r, g, b) => r > 200 && g > 200 && b > 200,
  grey: (r, g, b) => r > 120 && g > 125 && b > 130 && r < 210,
  bar: (r, g, b) => g > 150 && r > 170 && b < 130,
}

function measure(buf, w, region) {
  const { x0, x1, y0, y1, test, tight } = region
  const fn = tests[test]
  let t0 = 9999
  let t1 = -1
  let hits = 0
  const ya = tight ? y0 : y0 - 30
  const yb = tight ? y1 : y1 + 30
  for (let y = ya; y < yb; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * w + x) * 3
      if (fn(buf[i], buf[i + 1], buf[i + 2])) {
        t0 = Math.min(t0, y)
        t1 = Math.max(t1, y)
        hits++
      }
    }
  }
  if (!hits) return null
  const cy = test === 'badge' ? (t0 + t1) / 2 : undefined
  return { y0: t0, y1: t1, cy }
}

async function renderM2() {
  const m = mergeMatchup('vs-w5-m2')
  const html = cardHtml(m, m2m4PanelPath('vs-w5-m2', 'left'), m2m4PanelPath('vs-w5-m2', 'right'))
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
  const tmp = path.join(GWB, 'scripts/w5-matchup-cards/output', '.measure-layout-m2.html')
  const { writeFile, mkdir } = await import('node:fs/promises')
  await mkdir(path.dirname(tmp), { recursive: true })
  await writeFile(tmp, html)
  await page.goto(`file://${path.resolve(tmp)}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400)
  const png = path.join(GWB, 'scripts/w5-matchup-cards/output', 'measure-layout-m2.png')
  await page.locator('.slide').screenshot({ path: png, type: 'png', scale: 'css' })
  await browser.close()
  return png
}

async function main() {
  const m2png = await renderM2()
  const liveRaw = await sharp(LIVE).resize(1080, 1350).raw().toBuffer()
  const candRaw = await sharp(m2png).resize(1080, 1350).raw().toBuffer()
  const w = 1080

  console.log('--- vs-w5 chrome layout (live m1 vs m2 render) ---')
  console.log('element        | live y0-y1 | new y0-y1 | Δy0 Δy1 | ok')
  const boxes = []
  let fail = false
  for (const [name, region] of Object.entries(TARGETS)) {
    const live = measure(liveRaw, w, region)
    const neu = measure(candRaw, w, region)
    if (!live || !neu) {
      console.log(name, 'MISSING', live, neu)
      fail = true
      continue
    }
    const d0 = neu.y0 - live.y0
    const d1 = neu.y1 - live.y1
    const hLive = live.y1 - live.y0
    const hNew = neu.y1 - neu.y0
    const ok =
      name === 'title'
        ? Math.abs(d0) <= 4 && Math.abs(hNew - hLive) <= 4
        : Math.abs(d0) <= 4 && Math.abs(d1) <= 4
    if (!ok) fail = true
    console.log(
      `${name.padEnd(14)} | ${live.y0}-${live.y1}`.padEnd(22) +
        `| ${neu.y0}-${neu.y1}`.padEnd(14) +
        `| ${d0} ${d1}`.padEnd(8) +
        `| ${ok ? 'OK' : 'FAIL'}`,
    )
    boxes.push({ name, ...neu })
  }
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i]
      const b = boxes[j]
      if (a.y0 <= b.y1 && b.y0 <= a.y1 && !['pctL', 'bar'].includes(a.name)) {
        if (a.name === 'clause' && b.name === 'pctR') continue
        if (a.name === 'pctR' && b.name === 'clause') continue
        if (
          (a.name === 'handle' && b.name === 'footerR') ||
          (a.name === 'footerR' && b.name === 'handle')
        )
          continue
        if (a.y1 > b.y0 && b.y1 > a.y0 && Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0) > 8) {
          if (
            (a.name === 'pctL' || a.name === 'pctR') &&
            (b.name === 'bar' || b.name === 'bowl')
          )
            continue
          console.error('OVERLAP', a.name, a.y0, a.y1, b.name, b.y0, b.y1)
          fail = true
        }
      }
    }
  }
  if (fail) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
