/**
 * Old (main) vs new contact sheet for changed cards/slides.
 */
import { execSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GWB = path.join(__dirname, '..', '..')
const REPO = path.join(GWB, '..', '..')
const ARTIFACT = '/opt/cursor/artifacts/gwb-card-fixes-old-vs-new.png'
const TMP = '/tmp/gwb-card-fix-old'

const CHANGES = [
  ['vs-w5-m2', 'Manny jersey: Kirk Cousins #8 LV'],
  ['vs-w5-m4', 'Hady jersey: Drake Maye #10 NE'],
  ['vs-m1-narking-steven', 'Steven QB: Darnold #14 SEA'],
  ['vs-m2-kayser-frankie', 'Kayser QB: Stafford #9 LAR'],
  ['vs-m3-hadi-manny', 'Hady QB: Kyler #1 MIN'],
  ['vs-m4-jamil-matt', 'Jamil QB: Hurts #1 PHI'],
  ['vs-m5-mauricio-eric', 'Mauricio QB: Bryce Young #9 CAR'],
  ['vs-m6-danny-crooke', 'Danny QB: Lawrence #16 JAX'],
  ['results-w1-m1', 'Mauricio winner: Likely #9 NYG'],
  ['results-w1-m2', 'Hady loser: Maye #10 NE'],
  ['results-w1-m3', 'Narking loser: Shough #6 NO'],
  ['results-w1-m4', 'Danny loser: Nix #10 DEN'],
  ['results-w1-m5', 'Steven/Frankie jerseys'],
  ['results-w1-m6', 'Manny/Eric jerseys'],
  ['results-w2-m2', 'Mauricio loser QB + Purdy caption'],
  ['results-w2-m3', 'Kayser/Danny jerseys'],
  ['results-w2-m4', 'Steven/Matt jerseys (#17 visible)'],
  ['results-w2-m5', 'Jamil Hurts #1 PHI loser'],
  ['results-w2-m6', 'Eric/Frankie jerseys'],
  ['results-w3-m1', 'Narking Purdy #13 SF loser'],
  ['results-w3-m2', 'Danny Lawrence #16 JAX loser'],
  ['results-w3-m3', 'Steven/Mauricio jerseys'],
  ['results-w3-m4', 'Kayser Stafford #9 winner'],
  ['results-w3-m5', 'Eric/Matt jerseys (#17 visible)'],
  ['w1-slide-09', 'Narking 158.17 fourth-highest (not third)'],
  ['w2-slide-06', 'Eric 1-1; Amon-Ra 37.2'],
  ['w4-slide-12', 'Closest game Hady–Manny 6.77; no contradiction'],
]

async function oldImage(id) {
  const gitPath = `apps/gwb/public/slides/${id}.full.jpg`
  const out = path.join(TMP, `${id}-old.jpg`)
  try {
    execSync(`git show main:${gitPath}`, { cwd: REPO, stdio: ['ignore', 'pipe', 'ignore'] })
    const buf = execSync(`git show main:${gitPath}`, { cwd: REPO })
    await writeFile(out, buf)
    return out
  } catch {
    return path.join(GWB, 'public/slides', `${id}.full.jpg`)
  }
}

async function newImage(id) {
  const src = path.join(GWB, 'scripts/slide-sources', `${id}.png`)
  const out = path.join(TMP, `${id}-new.jpg`)
  await sharp(src).jpeg({ quality: 88 }).toFile(out)
  return out
}

async function main() {
  await mkdir(TMP, { recursive: true })
  const tileW = 480
  const tileH = 600
  const labelH = 44
  const rowH = tileH + labelH + 8
  const width = tileW * 2 + 24
  const height = CHANGES.length * rowH + 60
  const composites = []
  let y = 50
  for (const [id, note] of CHANGES) {
    const oldP = await oldImage(id)
    const newP = await newImage(id)
    const oldBuf = await sharp(oldP).resize(tileW, tileH, { fit: 'cover' }).jpeg().toBuffer()
    const newBuf = await sharp(newP).resize(tileW, tileH, { fit: 'cover' }).jpeg().toBuffer()
    composites.push({ input: oldBuf, left: 8, top: y })
    composites.push({ input: newBuf, left: tileW + 16, top: y })
    const label = Buffer.from(
      `<svg width="${width}" height="${labelH}"><text x="8" y="30" fill="#e8c547" font-family="sans-serif" font-size="18">${id} — ${note}</text></svg>`,
    )
    composites.push({ input: label, left: 0, top: y + tileH + 4 })
    y += rowH
  }
  const header = Buffer.from(
    `<svg width="${width}" height="48"><text x="8" y="32" fill="#fff" font-family="sans-serif" font-size="22">GWB card fixes — main (left) vs branch (right)</text></svg>`,
  )
  await sharp({
    create: { width, height, channels: 3, background: { r: 14, g: 16, b: 20 } },
  })
    .composite([{ input: header, top: 0, left: 0 }, ...composites])
    .png()
    .toFile(ARTIFACT)
  console.log('Wrote', ARTIFACT)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
