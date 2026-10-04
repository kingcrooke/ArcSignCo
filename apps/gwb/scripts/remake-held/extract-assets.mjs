/**
 * Extract player-card art (no badge text) from pre-repair source JPGs.
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC = path.join(__dirname, 'sources')
const OUT = path.join(__dirname, 'assets')

async function crop(name, input, region) {
  const out = path.join(OUT, name)
  await sharp(path.join(SRC, input))
    .extract(region)
    .png()
    .toFile(out)
  console.log('wrote', out)
}

async function main() {
  await mkdir(OUT, { recursive: true })

  await crop('vs-m3-left-card.png', 'vs-m3-hadi-manny.jpg', {
    left: 72,
    top: 368,
    width: 436,
    height: 652,
  })
  await crop('vs-m3-right-card.png', 'vs-m3-hadi-manny.jpg', {
    left: 572,
    top: 368,
    width: 436,
    height: 652,
  })

  await crop('w4-06-hero.png', 'w4-slide-06.jpg', {
    left: 420,
    top: 120,
    width: 660,
    height: 1230,
  })
  await crop('w4-16-hero.png', 'w4-slide-16.jpg', {
    left: 0,
    top: 0,
    width: 1080,
    height: 420,
  })
  await crop('w4-14-bg.png', 'w4-slide-14.jpg', {
    left: 0,
    top: 0,
    width: 1080,
    height: 1350,
  })
  await crop('w4-10-bg.png', 'w4-slide-10.jpg', {
    left: 0,
    top: 200,
    width: 1080,
    height: 900,
  })

  const resultCrops = [
    ['results-w1-m2-winner.png', 'results-w1-m2.jpg', { left: 72, top: 440, width: 480, height: 520 }],
    ['results-w1-m2-loser.png', 'results-w1-m2.jpg', { left: 548, top: 480, width: 440, height: 460 }],
    ['results-w2-m1-winner.png', 'results-w2-m1.jpg', { left: 72, top: 440, width: 480, height: 520 }],
    ['results-w2-m1-loser.png', 'results-w2-m1.jpg', { left: 548, top: 480, width: 440, height: 460 }],
    ['results-w3-m2-winner.png', 'results-w3-m2.jpg', { left: 72, top: 440, width: 480, height: 520 }],
    ['results-w3-m2-loser.png', 'results-w3-m2.jpg', { left: 548, top: 480, width: 440, height: 460 }],
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
