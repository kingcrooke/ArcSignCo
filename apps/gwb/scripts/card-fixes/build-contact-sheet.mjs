/**
 * Old (main) vs new contact sheet for changed cards/slides.
 * Writes gwb-card-fixes-old-vs-new-1.png, -2.png, … each under 4MB.
 */
import { execSync } from 'node:child_process'
import { mkdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GWB = path.join(__dirname, '..', '..')
const REPO = path.join(GWB, '..', '..')
const ARTIFACT_DIR = '/opt/cursor/artifacts'
const TMP = '/tmp/gwb-card-fix-old'
const MAX_BYTES = 4 * 1024 * 1024

const CHANGES = [
  ['vs-w5-m2', 'Manny jersey: Kirk Cousins #8 LV (Raiders black/silver)'],
  ['vs-w5-m4', 'Hady jersey: Drake Maye #10 NE'],
  ['vs-m1-narking-steven', 'Steven QB: Darnold #14 SEA'],
  ['vs-m2-kayser-frankie', 'Kayser Stafford #9 LAR; Frankie Goff #16 DET (readable)'],
  ['vs-m3-hadi-manny', 'HADI pill kept; Kyler #1 MIN art'],
  ['vs-m4-jamil-matt', 'Jamil QB: Hurts #1 PHI'],
  ['vs-m5-mauricio-eric', 'Mauricio QB: Bryce Young #9 CAR'],
  ['vs-m6-danny-crooke', 'Danny QB: Lawrence #16 JAX'],
  ['results-w1-m1', 'Mauricio winner: Likely #9 NYG'],
  ['results-w1-m2', 'HADI headline kept; Maye #10 NE loser'],
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

function chunk(arr, size) {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

async function renderPart(partIndex, rows, tileW, tileH, labelH, width) {
  const rowH = tileH + labelH + 8
  const height = rows.length * rowH + 60
  const composites = []
  let y = 50
  for (const [id, note] of rows) {
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
    `<svg width="${width}" height="48"><text x="8" y="32" fill="#fff" font-family="sans-serif" font-size="22">GWB card fixes part ${partIndex} — main (left) vs branch (right)</text></svg>`,
  )
  const outPath = path.join(ARTIFACT_DIR, `gwb-card-fixes-old-vs-new-${partIndex}.png`)
  let quality = 92
  let buf = await sharp({
    create: { width, height, channels: 3, background: { r: 14, g: 16, b: 20 } },
  })
    .composite([{ input: header, top: 0, left: 0 }, ...composites])
    .png({ compressionLevel: 9, quality })
    .toBuffer()
  while (buf.length > MAX_BYTES && quality > 50) {
    quality -= 8
    buf = await sharp(buf).png({ compressionLevel: 9, quality }).toBuffer()
  }
  await writeFile(outPath, buf)
  const bytes = (await stat(outPath)).size
  console.log('Wrote', outPath, bytes)
  if (bytes > MAX_BYTES) {
    console.warn('Part', partIndex, 'still exceeds 4MB')
  }
  return outPath
}

async function main() {
  await mkdir(TMP, { recursive: true })
  const tileW = 480
  const tileH = 600
  const labelH = 44
  const width = tileW * 2 + 24
  const parts = chunk(CHANGES, 9)
  const written = []
  for (let i = 0; i < parts.length; i++) {
    written.push(await renderPart(i + 1, parts[i], tileW, tileH, labelH, width))
  }
  console.log(JSON.stringify(written, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
