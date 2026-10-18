import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SLIDES = path.join(__dirname, '../../public/slides')
const ARTIFACTS = '/opt/cursor/artifacts'
const IDS = [1, 2, 3, 4, 5, 6].map((n) => `results-w5-m${n}`)

async function contactSheet() {
  await mkdir(ARTIFACTS, { recursive: true })
  const labeled = []
  for (const id of IDS) {
    const img = path.join(SLIDES, `${id}.full.jpg`)
    const tile = await sharp(img)
      .resize(540, 675, { fit: 'inside', background: '#111' })
      .extend({
        top: 0,
        bottom: 0,
        left: 0,
        right: 540 - 540,
        background: '#111',
      })
      .toBuffer()
    const withLabel = await sharp({
      create: { width: 540, height: 735, channels: 3, background: '#111' },
    })
      .composite([
        { input: tile, top: 0, left: 0 },
        {
          input: Buffer.from(
            `<svg width="540" height="60"><text x="270" y="40" font-family="sans-serif" font-size="28" fill="#d4af37" text-anchor="middle">${id}</text></svg>`,
          ),
          top: 675,
          left: 0,
        },
      ])
      .png()
      .toBuffer()
    labeled.push(withLabel)
  }
  const out = path.join(ARTIFACTS, 'gwb-w5-results-contact-sheet.png')
  await sharp({
    create: { width: 1080, height: 735 * 3, channels: 3, background: '#111' },
  })
    .composite([
      { input: labeled[0], left: 0, top: 0 },
      { input: labeled[1], left: 540, top: 0 },
      { input: labeled[2], left: 0, top: 735 },
      { input: labeled[3], left: 540, top: 735 },
      { input: labeled[4], left: 0, top: 1470 },
      { input: labeled[5], left: 540, top: 1470 },
    ])
    .png()
    .toFile(out)
  console.log('wrote', out)
}

contactSheet().catch((e) => {
  console.error(e)
  process.exit(1)
})
