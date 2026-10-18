/**
 * Panel tone sheet: each touched panel beside results-w5-m1-winner reference.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { panelImagePath } from './rebuild/panel-paths.mjs'

const OUT = '/opt/cursor/artifacts/gwb-panel-tone-vs-w5m1.png'
const REF = '/workspace/apps/gwb/scripts/w5-result-cards/assets/results-w5-m1-winner.jpg'

const CARDS = [
  ['results-w1-m1', 'winner'],
  ['results-w1-m1', 'loser'],
  ['results-w1-m2', 'winner'],
  ['results-w1-m2', 'loser'],
  ['results-w1-m3', 'winner'],
  ['results-w1-m3', 'loser'],
  ['results-w1-m4', 'winner'],
  ['results-w1-m4', 'loser'],
  ['results-w1-m5', 'winner'],
  ['results-w1-m5', 'loser'],
  ['results-w1-m6', 'winner'],
  ['results-w1-m6', 'loser'],
  ['results-w2-m2', 'winner'],
  ['results-w2-m2', 'loser'],
  ['results-w2-m3', 'winner'],
  ['results-w2-m3', 'loser'],
  ['results-w2-m4', 'winner'],
  ['results-w2-m4', 'loser'],
  ['results-w2-m5', 'winner'],
  ['results-w2-m5', 'loser'],
  ['results-w2-m6', 'winner'],
  ['results-w2-m6', 'loser'],
  ['results-w3-m1', 'winner'],
  ['results-w3-m1', 'loser'],
  ['results-w3-m2', 'winner'],
  ['results-w3-m2', 'loser'],
  ['results-w3-m3', 'winner'],
  ['results-w3-m3', 'loser'],
  ['results-w3-m4', 'winner'],
  ['results-w3-m4', 'loser'],
  ['results-w3-m5', 'winner'],
  ['results-w3-m5', 'loser'],
  ['vs-m1-narking-steven', 'left'],
  ['vs-m1-narking-steven', 'right'],
  ['vs-m6-danny-crooke', 'right'],
  ['vs-w5-m4', 'left'],
]

async function main() {
  await mkdir(path.dirname(OUT), { recursive: true })
  const refBuf = await sharp(REF).resize(280, 350, { fit: 'cover' }).jpeg().toBuffer()
  const cols = 4
  const tileW = 580
  const tileH = 380
  const rows = Math.ceil(CARDS.length / cols)
  const composites = []
  for (let i = 0; i < CARDS.length; i++) {
    const [id, side] = CARDS[i]
    const p = await panelImagePath(id, side)
    const panel = await sharp(p).resize(280, 350, { fit: 'cover' }).jpeg().toBuffer()
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = col * tileW + 10
    const y = row * tileH + 10
    composites.push({ input: refBuf, left: x, top: y })
    composites.push({ input: panel, left: x + 290, top: y })
  }
  await sharp({
    create: {
      width: cols * tileW + 20,
      height: rows * tileH + 20,
      channels: 3,
      background: { r: 12, g: 14, b: 18 },
    },
  })
    .composite(composites)
    .jpeg({ quality: 88 })
    .toFile(OUT)
  console.log('Wrote', OUT)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
