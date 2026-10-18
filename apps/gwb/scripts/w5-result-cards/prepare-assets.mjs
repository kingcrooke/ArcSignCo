/**
 * Seed panel JPGs from Week 5 preview art where jerseys match; lighten stone fur ~25%.
 */
import { copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PREVIEW = path.join(__dirname, '../w5-matchup-cards/assets')
const OUT = path.join(__dirname, 'assets')

/** [resultId, winner|loser, source preview file basename side] */
const COPY_MAP = [
  ['results-w5-m1', 'loser', 'vs-w5-m1-left.jpg'],
  ['results-w5-m2', 'loser', 'vs-w5-m2-right.jpg'],
  ['results-w5-m3', 'winner', 'vs-w5-m3-right.jpg'],
  ['results-w5-m3', 'loser', 'vs-w5-m3-left.jpg'],
  ['results-w5-m4', 'winner', 'vs-w5-m4-left.jpg'],
  ['results-w5-m4', 'loser', 'vs-w5-m4-right.jpg'],
  ['results-w5-m5', 'loser', 'vs-w5-m5-right.jpg'],
  ['results-w5-m6', 'loser', 'vs-w5-m6-left.jpg'],
]

async function lighten(inPath, outPath) {
  await sharp(inPath)
    .modulate({ brightness: 1.24, saturation: 0.92 })
    .jpeg({ quality: 92 })
    .toFile(outPath)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  for (const [id, side, srcName] of COPY_MAP) {
    const src = path.join(PREVIEW, srcName)
    const dest = path.join(OUT, `${id}-${side}.jpg`)
    await lighten(src, dest)
    console.log('seeded', dest)
  }
  console.log('Place generated panels as results-w5-mN-winner.jpg for m1,m2,m5,m6')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
