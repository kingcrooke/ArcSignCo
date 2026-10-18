/**
 * Mask panel interiors and compare preview chrome to live vs-w5-m1.
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GWB = path.join(__dirname, '..', '..')
const LIVE = path.join(GWB, 'public/slides/vs-w5-m1.full.jpg')
const CANDIDATE = path.join(GWB, 'scripts/slide-sources/vs-w5-m2.png')
const OUT = '/opt/cursor/artifacts/gwb-vs-chrome-diff.png'

const MASK = { left: 44, top: 200, width: 992, height: 700 }

async function maskPanels(input) {
  const img = sharp(input)
  const meta = await img.metadata()
  const w = meta.width ?? 1080
  const h = meta.height ?? 1350
  const overlay = Buffer.from(
    `<svg width="${w}" height="${h}"><rect x="${MASK.left}" y="${MASK.top}" width="${MASK.width}" height="${MASK.height}" fill="#1a1a1a"/></svg>`,
  )
  return sharp(input).composite([{ input: overlay, top: 0, left: 0 }]).png().toBuffer()
}

async function main() {
  const [a, b] = await Promise.all([maskPanels(LIVE), maskPanels(CANDIDATE)])
  const diff = await sharp(a)
    .ensureAlpha()
    .composite([{ input: b, blend: 'difference' }])
    .raw()
    .toBuffer({ resolveWithObject: true })
  let sum = 0
  for (let i = 0; i < diff.data.length; i += 4) {
    sum += diff.data[i] + diff.data[i + 1] + diff.data[i + 2]
  }
  const mean = sum / (diff.data.length / 4) / 3
  const meta = await sharp(a).metadata()
  const w = meta.width ?? 1080
  await sharp({
    create: { width: w * 2 + 40, height: meta.height ?? 1350, channels: 3, background: '#111' },
  })
    .composite([{ input: a, left: 0, top: 0 }, { input: b, left: w + 40, top: 0 }])
    .toFile(OUT)
  console.log('chrome mean diff (masked panels):', mean.toFixed(2), 'artifact', OUT)
  if (mean > 18) process.exitCode = 1
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
