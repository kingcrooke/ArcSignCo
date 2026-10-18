/**
 * Match live vs-w5-m1 chrome: keep m1 pixels outside panel + mid/footer text bands;
 * paste panels and per-card text from rendered candidate.
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GWB = path.join(__dirname, '..', '..')
const LIVE_M1 = path.join(GWB, 'public/slides/vs-w5-m1.full.jpg')

const LEFT = { left: 54, top: 268, width: 472, height: 640 }
const RIGHT = { left: 554, top: 268, width: 472, height: 640 }
const MID = { left: 0, top: 920, width: 1080, height: 280 }
const HEADER = { left: 0, top: 0, width: 1080, height: 260 }

export async function composeFromM1Chrome(candidatePng, outPng) {
  const [m1, cand] = await Promise.all([
    sharp(LIVE_M1).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
    sharp(candidatePng).resize(1080, 1350).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
  ])
  const w = m1.info.width
  const h = m1.info.height
  const out = Buffer.from(m1.data)
  const inRect = (x, y, r) =>
    x >= r.left && x < r.left + r.width && y >= r.top && y < r.top + r.height

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      const useCand =
        inRect(x, y, LEFT) || inRect(x, y, RIGHT) || inRect(x, y, MID) || inRect(x, y, HEADER)
      if (useCand) {
        out[i] = cand.data[i]
        out[i + 1] = cand.data[i + 1]
        out[i + 2] = cand.data[i + 2]
        out[i + 3] = 255
      }
    }
  }
  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile(outPng)
}

async function main() {
  const id = process.argv[2] || 'vs-w5-m2'
  const cand = path.join(GWB, 'scripts/w5-matchup-cards/output', `${id}.png`)
  const out = path.join(GWB, 'scripts/slide-sources', `${id}.png`)
  await composeFromM1Chrome(cand, out)
  console.log('composed', out, 'from m1 chrome')
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
if (isMain) main().catch((e) => { console.error(e); process.exit(1) })
