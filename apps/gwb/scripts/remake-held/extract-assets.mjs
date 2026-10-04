/**
 * Extract art crops and text-free background plates.
 */
import sharp from 'sharp'
import { mkdir, copyFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC = path.join(__dirname, 'sources')
const OUT = path.join(__dirname, 'assets')
const PUB = path.join(__dirname, '../../public/slides')

async function crop(name, input, region) {
  const out = path.join(OUT, name)
  await sharp(path.join(SRC, input))
    .extract(region)
    .png()
    .toFile(out)
  console.log('wrote', out)
}

/** Blurred full-bleed plate so baked slide text is not readable. */
async function blurPlate(name, inputPath, { blur = 16, brightness = 0.5 } = {}) {
  const out = path.join(OUT, name)
  let pipe = sharp(inputPath).resize(1080, 1350, { fit: 'cover', position: 'centre' })
  if (blur > 0) pipe = pipe.blur(blur)
  if (brightness !== 1) pipe = pipe.modulate({ brightness })
  await pipe.jpeg({ quality: 88 }).toFile(out)
  console.log('wrote', out)
}

/** Top + bottom ruin strips without center list text (w4-14). */
async function ruinStripsPlate() {
  const src = path.join(SRC, 'w4-slide-14.jpg')
  const top = await sharp(src).extract({ left: 0, top: 0, width: 1080, height: 220 }).toBuffer()
  const bottom = await sharp(src)
    .extract({ left: 0, top: 1130, width: 1080, height: 220 })
    .toBuffer()
  const mid = await sharp({
    create: { width: 1080, height: 910, channels: 3, background: { r: 10, g: 15, b: 20 } },
  })
    .jpeg()
    .toBuffer()
  const out = path.join(OUT, 'w4-14-plate.jpg')
  await sharp({
    create: { width: 1080, height: 1350, channels: 3, background: { r: 10, g: 15, b: 20 } },
  })
    .composite([
      { input: top, top: 0, left: 0 },
      { input: mid, top: 220, left: 0 },
      { input: bottom, top: 1130, left: 0 },
    ])
    .jpeg({ quality: 90 })
    .toFile(out)
  console.log('wrote', out)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  await mkdir(SRC, { recursive: true })

  const w409 = path.join(PUB, 'w4-slide-09.full.jpg')
  await copyFile(w409, path.join(SRC, 'w4-plate-matchup.jpg')).catch(() => {})

  await crop('vs-m3-left-card.png', 'vs-m3-hadi-manny.jpg', {
    left: 76,
    top: 420,
    width: 428,
    height: 600,
  })
  await crop('vs-m3-right-card.png', 'vs-m3-hadi-manny.jpg', {
    left: 576,
    top: 420,
    width: 428,
    height: 600,
  })

  await crop('w4-06-hero.png', 'w4-slide-06.jpg', {
    left: 400,
    top: 100,
    width: 680,
    height: 1250,
  })

  await crop('w4-16-bull.png', 'w4-slide-16.jpg', {
    left: 0,
    top: 200,
    width: 1080,
    height: 320,
  })

  await blurPlate('w4-10-plate.jpg', path.join(SRC, 'w4-plate-matchup.jpg'), {
    blur: 42,
    brightness: 0.32,
  })
  await ruinStripsPlate()

  const resultCrops = [
    ['results-w1-m2-winner.png', 'results-w1-m2.jpg', { left: 56, top: 360, width: 520, height: 560 }],
    ['results-w1-m2-loser.png', 'results-w1-m2.jpg', { left: 540, top: 400, width: 480, height: 500 }],
    ['results-w2-m1-winner.png', 'results-w2-m1.jpg', { left: 56, top: 360, width: 520, height: 560 }],
    ['results-w2-m1-loser.png', 'results-w2-m1.jpg', { left: 540, top: 400, width: 480, height: 500 }],
    ['results-w3-m2-winner.png', 'results-w3-m2.jpg', { left: 56, top: 360, width: 520, height: 560 }],
    ['results-w3-m2-loser.png', 'results-w3-m2.jpg', { left: 540, top: 400, width: 480, height: 500 }],
  ]
  for (const [name, src, region] of resultCrops) {
    await crop(name, src, region)
  }
}

export async function extractAssets() {
  await main()
}

if (process.argv[1]?.includes('extract-assets.mjs')) {
  extractAssets().catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
