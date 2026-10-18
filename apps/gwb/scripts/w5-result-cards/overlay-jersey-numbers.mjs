/**
 * Composite bold jersey numbers on result panel art (944×1280) for readability.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS = path.join(__dirname, 'assets')

const TEAM = {
  BAL: { fill: '#241773', stroke: '#9E7C0C' },
  SEA: { fill: '#69BE28', stroke: '#002244' },
  GB: { fill: '#FFB612', stroke: '#203731' },
  LV: { fill: '#A5ACAF', stroke: '#000000' },
  DAL: { fill: '#FFFFFF', stroke: '#041E42' },
  SF: { fill: '#AA0000', stroke: '#B3995D' },
  NE: { fill: '#C60C30', stroke: '#002244' },
  DET: { fill: '#B0B7BC', stroke: '#0076B6' },
  PIT: { fill: '#FFB612', stroke: '#101820' },
  PHI: { fill: '#004C54', stroke: '#A5ACAF' },
  LAR: { fill: '#FFA300', stroke: '#003594' },
}

function lastName(full) {
  const parts = String(full ?? '').trim().split(/\s+/)
  return parts[parts.length - 1] || full
}

function svgForNumber(num, team, w, h) {
  const colors = TEAM[team] ?? { fill: '#FFFFFF', stroke: '#111111' }
  const fontSize = Math.round(w * 0.2)
  const stroke = Math.max(4, Math.round(fontSize * 0.09))
  const cx = Math.round(w * 0.52)
  const cy = Math.round(h * 0.56)
  const display = num === 0 ? '0' : String(num)
  return Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle"
        font-family="Arial Black, Helvetica, sans-serif" font-size="${fontSize}" font-weight="900"
        fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="${stroke}" paint-order="stroke">${display}</text>
    </svg>`,
  )
}

async function overlayFile(filePath, jersey) {
  const meta = await sharp(filePath).metadata()
  const w = meta.width ?? 944
  const h = meta.height ?? 1280
  const num = jersey.number
  if (num == null) return
  const svg = svgForNumber(num, jersey.team, w, h)
  const out = await sharp(filePath)
    .composite([{ input: svg, top: 0, left: 0 }])
    .jpeg({ quality: 92 })
    .toBuffer()
  await sharp(out).toFile(filePath)
  console.log('numbered', path.basename(filePath), lastName(jersey.name), `#${num}`, jersey.team)
}

async function main() {
  const results = JSON.parse(readFileSync(path.join(__dirname, 'results.json'), 'utf8'))
  for (const r of results) {
    await overlayFile(path.join(ASSETS, `${r.id}-winner.jpg`), r.winnerJersey)
    await overlayFile(path.join(ASSETS, `${r.id}-loser.jpg`), r.loserJersey)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
