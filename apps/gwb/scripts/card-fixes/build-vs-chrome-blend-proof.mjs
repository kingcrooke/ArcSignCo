/**
 * 50/50 blend: live vs-w5-m1.full.jpg vs rendered vs-w5-m2 (chrome proof for PR).
 */
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { cardHtml } from '../w5-matchup-cards/template.mjs'
import { mergeMatchup } from './render-w5-m2-m4-main.mjs'
import { panelImagePath } from './rebuild/panel-paths.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GWB = path.join(__dirname, '..', '..')
const LIVE_M1 = path.join(GWB, '..', '..', 'gwb-fe006a16', 'slides', 'vs-w5-m1.full.jpg')
const OUT = path.join(__dirname, 'vs-w5-m1-m2-chrome-blend.jpg')

async function main() {
  const m = mergeMatchup('vs-w5-m2')
  const html = cardHtml(m, panelImagePath('vs-w5-m2', 'left'), panelImagePath('vs-w5-m2', 'right'))
  const tmp = path.join(GWB, 'scripts/w5-matchup-cards/output', '.blend-m2.html')
  await mkdir(path.dirname(tmp), { recursive: true })
  await writeFile(tmp, html)
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
  await page.goto(`file://${path.resolve(tmp)}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(350)
  const m2png = path.join(GWB, 'scripts/w5-matchup-cards/output', 'blend-m2.png')
  await page.locator('.slide').screenshot({ path: m2png, type: 'png', scale: 'css' })
  await browser.close()

  const [live, cand] = await Promise.all([
    sharp(LIVE_M1).resize(1080, 1350).ensureAlpha().raw().toBuffer(),
    sharp(m2png).resize(1080, 1350).ensureAlpha().raw().toBuffer(),
  ])
  const blended = Buffer.alloc(live.length)
  for (let i = 0; i < live.length; i += 4) {
    blended[i] = Math.round(live[i] * 0.5 + cand[i] * 0.5)
    blended[i + 1] = Math.round(live[i + 1] * 0.5 + cand[i + 1] * 0.5)
    blended[i + 2] = Math.round(live[i + 2] * 0.5 + cand[i + 2] * 0.5)
    blended[i + 3] = 255
  }
  await sharp(blended, { raw: { width: 1080, height: 1350, channels: 4 } })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(OUT)
  console.log('wrote', OUT)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
