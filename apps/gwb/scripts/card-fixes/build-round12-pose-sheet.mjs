import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const prompts = JSON.parse(await readFile(path.join(__dirname, 'panel-prompts-round12.json'), 'utf8'))
const CARD = __dirname

function weekOf(id) {
  const m = id.match(/-w(\d+)$/)
  return m ? Number(m[1]) : 5
}

const byWeek = new Map()
for (const p of prompts) {
  const w = weekOf(p.panelId)
  if (!byWeek.has(w)) byWeek.set(w, [])
  byWeek.get(w).push(p)
}

let y = 50
const composites = []
for (const w of [...byWeek.keys()].sort((a, b) => a - b)) {
  composites.push({
    input: Buffer.from(
      `<svg width="1300" height="30"><text x="16" y="22" fill="#d4af37" font-size="18" font-family="sans-serif">Week ${w}</text></svg>`,
    ),
    top: y,
    left: 0,
  })
  y += 34
  let col = 0
  for (const p of byWeek.get(w)) {
    const img = path.join(CARD, p.outFile)
    const thumb = await sharp(img).resize(190, 190, { fit: 'cover' }).jpeg({ quality: 85 }).toBuffer()
    const x = 16 + col * 200
    composites.push({ input: thumb, top: y, left: x })
    composites.push({
      input: Buffer.from(
        `<svg width="190" height="24"><text x="0" y="16" fill="#999" font-size="9" font-family="monospace">${p.panelId}</text></svg>`,
      ),
      top: y + 192,
      left: x,
    })
    col++
    if (col >= 6) {
      col = 0
      y += 220
    }
  }
  if (col) y += 230
}

const out = path.join(__dirname, 'round12-pose-by-week.jpg')
await sharp({
  create: { width: 1300, height: y + 40, channels: 3, background: { r: 10, g: 12, b: 16 } },
})
  .composite(composites)
  .jpeg({ quality: 88 })
  .toFile(out)
console.log('wrote', out)
