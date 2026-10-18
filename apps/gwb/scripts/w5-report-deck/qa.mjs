import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SLIDES = path.join(__dirname, '../../public/slides')
const ARTIFACTS = '/opt/cursor/artifacts'

async function main() {
  await mkdir(ARTIFACTS, { recursive: true })
  const tiles = []
  for (let i = 1; i <= 16; i++) {
    const id = `w5-slide-${String(i).padStart(2, '0')}`
    const img = path.join(SLIDES, `${id}.full.jpg`)
    const label = Buffer.from(
      `<svg width="360" height="48"><text x="180" y="32" font-family="sans-serif" font-size="22" fill="white" text-anchor="middle">${id}</text></svg>`,
    )
    const tile = await sharp(img)
      .resize(360, 450, { fit: 'cover' })
      .extend({ top: 0, bottom: 48, background: '#111' })
      .composite([{ input: label, top: 450, left: 0 }])
      .png()
      .toBuffer()
    tiles.push(tile)
  }
  const cols = 4
  const rows = []
  for (let r = 0; r < 4; r++) {
    const composites = tiles.slice(r * cols, r * cols + cols).map((t, c) => ({
      input: t,
      left: c * 360,
      top: 0,
    }))
    rows.push(
      await sharp({
        create: { width: 1440, height: 498, channels: 3, background: '#111' },
      })
        .composite(composites)
        .png()
        .toBuffer(),
    )
  }
  const out = path.join(ARTIFACTS, 'gwb-w5-report-contact-sheet.png')
  await sharp({
    create: { width: 1440, height: 1992, channels: 3, background: '#111' },
  })
    .composite(rows.map((row, i) => ({ input: row, top: i * 498, left: 0 })))
    .png()
    .toFile(out)
  console.log('wrote', out)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
