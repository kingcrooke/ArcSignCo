/**
 * Per-week pose contact sheet for Round 11 regenerated panels.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CARD = __dirname
const prompts = JSON.parse(await readFile(path.join(__dirname, 'panel-prompts-round11.json'), 'utf8'))

function weekOf(panelId) {
  const m = panelId.match(/-w(\d+)$/)
  return m ? Number(m[1]) : 5
}

const byWeek = new Map()
for (const p of prompts) {
  const w = weekOf(p.panelId)
  if (!byWeek.has(w)) byWeek.set(w, [])
  byWeek.get(w).push(p)
}

const tile = 200
const cols = 6
let yOff = 0
const composites = []
const title = Buffer.from(
  `<svg width="1400" height="40"><text x="20" y="28" fill="#d4af37" font-family="sans-serif" font-size="22">Round 11 poses by week</text></svg>`,
)
composites.push({ input: title, top: 0, left: 0 })
yOff = 50

for (const w of [...byWeek.keys()].sort((a, b) => a - b)) {
  const label = Buffer.from(
    `<svg width="1400" height="32"><text x="20" y="24" fill="#fff" font-family="sans-serif" font-size="18">Week ${w}</text></svg>`,
  )
  composites.push({ input: label, top: yOff, left: 0 })
  yOff += 36
  let col = 0
  for (const p of byWeek.get(w)) {
    const img = path.join(CARD, p.outFile)
    const thumb = await sharp(img).resize(tile, tile, { fit: 'cover' }).jpeg({ quality: 85 }).toBuffer()
    const cap = Buffer.from(
      `<svg width="${tile}" height="28"><text x="2" y="18" fill="#aaa" font-size="9" font-family="monospace">${p.panelId}</text></svg>`,
    )
    const x = 20 + col * (tile + 8)
    composites.push({ input: thumb, top: yOff, left: x })
    composites.push({ input: cap, top: yOff + tile + 2, left: x })
    col++
    if (col >= cols) {
      col = 0
      yOff += tile + 36
    }
  }
  if (col > 0) yOff += tile + 40
}

const height = yOff + 40
const out = path.join(__dirname, 'round11-pose-by-week.jpg')
await sharp({
  create: { width: 1400, height, channels: 3, background: { r: 10, g: 12, b: 16 } },
})
  .composite(composites)
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(out)
console.log('wrote', out)
