/**
 * Contact sheet of every Round 10 regenerated panel JPEG.
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CARD = __dirname
const prompts = JSON.parse(
  await readFile(path.join(__dirname, 'panel-prompts-round10.json'), 'utf8'),
)
const OUT = path.join(__dirname, 'round10-panel-contact.jpg')
const tile = 220
const cols = 5
const rows = Math.ceil(prompts.length / cols)
const width = cols * tile + 40
const height = rows * (tile + 36) + 60

const composites = []
let i = 0
for (const p of prompts) {
  const col = i % cols
  const row = Math.floor(i / cols)
  const imgPath = path.join(CARD, p.outFile)
  const thumb = await sharp(imgPath).resize(tile, tile, { fit: 'cover' }).jpeg({ quality: 85 }).toBuffer()
  const label = Buffer.from(
    `<svg width="${tile}" height="32"><text x="4" y="22" fill="#ccc" font-family="sans-serif" font-size="11">${path.basename(p.outFile)}</text></svg>`,
  )
  composites.push({ input: thumb, left: 20 + col * tile, top: 40 + row * (tile + 36) })
  composites.push({ input: label, left: 20 + col * tile, top: 40 + row * (tile + 36) + tile + 4 })
  i++
}

const title = Buffer.from(
  `<svg width="${width}" height="36"><text x="20" y="26" fill="#d4af37" font-family="sans-serif" font-size="20">Round 10 regenerated panels (PR #96)</text></svg>`,
)
await sharp({
  create: { width, height, channels: 3, background: { r: 12, g: 14, b: 18 } },
})
  .composite([{ input: title, left: 0, top: 0 }, ...composites])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(OUT)
console.log('wrote', OUT, prompts.length, 'panels')
