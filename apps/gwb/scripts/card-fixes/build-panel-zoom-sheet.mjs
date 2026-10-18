import { execSync } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const OUT = '/opt/cursor/artifacts/gwb-panel-zooms'
const REPO = '/workspace'
const PANELS = [
  ['results-w2-m3', 'loser', 'Danny JAX 16'],
  ['results-w2-m6', 'loser', 'Frankie CIN 9'],
  ['results-w1-m5', 'winner', 'Steven CHI 4'],
  ['results-w3-m3', 'winner', 'Steven SEA 14'],
  ['vs-m4-jamil-matt', 'left', 'Jamil PHI 1'],
  ['vs-m5-mauricio-eric', 'left', 'Mauricio CAR 9'],
  ['vs-m6-danny-crooke', 'left', 'Danny JAX'],
  ['vs-m6-danny-crooke', 'right', 'Crooke BAL 8'],
  ['results-w1-m6', 'winner', 'Manny CHI 18'],
  ['results-w2-m4', 'loser', 'Matt BUF 17'],
  ['vs-m2-kayser-frankie', 'left', 'Kayser'],
  ['vs-m4-jamil-matt', 'left', 'Jamil'],
  ['vs-m5-mauricio-eric', 'left', 'Mauricio'],
  ['vs-w5-m4', 'left', 'Hady'],
  ['results-w1-m1', 'loser', 'keeper Crooke'],
  ['results-w1-m2', 'winner', 'keeper Kayser'],
]

async function panelPath(cardId, side) {
  const { panelImagePath } = await import('./rebuild/panel-paths.mjs')
  return panelImagePath(cardId, side === 'left' || side === 'right' ? side : side)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const tiles = []
  for (const [cardId, side, label] of PANELS) {
    const s = side === 'loser' || side === 'winner' ? side : side
    const p = await panelPath(cardId, s)
    const buf = await sharp(p).resize(400, 500, { fit: 'cover' }).jpeg({ quality: 85 }).toBuffer()
    const out = path.join(OUT, `${cardId}-${s}.jpg`)
    await writeFile(out, buf)
    tiles.push({ buf, label })
  }
  const cols = 4
  const w = 420
  const h = 540
  const rows = Math.ceil(tiles.length / cols)
  const composites = []
  tiles.forEach((t, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    composites.push({ input: t.buf, left: col * w + 10, top: row * h + 10 })
  })
  const sheet = await sharp({
    create: {
      width: cols * w + 20,
      height: rows * h + 20,
      channels: 3,
      background: '#0a0c10',
    },
  })
    .composite(composites)
    .png()
    .toBuffer()
  await writeFile(path.join(OUT, 'panel-zoom-sheet.png'), sheet)
  console.log('wrote', path.join(OUT, 'panel-zoom-sheet.png'))
}

main()
