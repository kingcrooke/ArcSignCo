/**
 * Per-week old (main) vs new contact sheets, each part < 4MB.
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
const TMP = '/tmp/gwb-week-sheets'
const MAX_BYTES = 4 * 1024 * 1024

const WEEKS = {
  1: ['results-w1-m1', 'results-w1-m2', 'results-w1-m3', 'results-w1-m4', 'results-w1-m5', 'results-w1-m6', 'w1-slide-09'],
  2: ['results-w2-m2', 'results-w2-m3', 'results-w2-m4', 'results-w2-m5', 'results-w2-m6', 'w2-slide-06'],
  3: ['results-w3-m1', 'results-w3-m2', 'results-w3-m3', 'results-w3-m4', 'results-w3-m5'],
  4: [
    'vs-m1-narking-steven',
    'vs-m2-kayser-frankie',
    'vs-m3-hadi-manny',
    'vs-m4-jamil-matt',
    'vs-m5-mauricio-eric',
    'vs-m6-danny-crooke',
    'w4-slide-12',
  ],
  5: ['vs-w5-m2', 'vs-w5-m4'],
}

async function oldImage(id) {
  const gitPath = `apps/gwb/public/slides/${id}.full.jpg`
  const out = path.join(TMP, `${id}-old.jpg`)
  const buf = execSync(`git show main:${gitPath}`, { cwd: REPO })
  await writeFile(out, buf)
  return out
}

async function newImage(id) {
  const src = path.join(GWB, 'scripts/slide-sources', `${id}.png`)
  const out = path.join(TMP, `${id}-new.jpg`)
  await sharp(src).jpeg({ quality: 88 }).toFile(out)
  return out
}

async function renderWeek(week, ids) {
  const tileW = 420
  const tileH = 525
  const labelH = 36
  const rowH = tileH + labelH + 8
  const width = tileW * 2 + 60
  let part = 1
  let composites = []
  let y = 50
  let height = 60

  const flush = async () => {
    if (!composites.length) return
    const out = path.join(ARTIFACT_DIR, `gwb-week-${week}-old-vs-new-${part}.png`)
    await sharp({
      create: { width, height, channels: 3, background: { r: 18, g: 18, b: 22 } },
    })
      .composite(composites)
      .png({ compressionLevel: 9 })
      .toFile(out)
    const bytes = (await stat(out)).size
    console.log('Wrote', out, bytes)
    if (bytes > MAX_BYTES) console.warn('WARN over 4MB', out)
    part++
    composites = []
    y = 50
    height = 60
  }

  for (const id of ids) {
    const oldP = await oldImage(id)
    const newP = await newImage(id)
    if (y + rowH > 3200) {
      await flush()
    }
    height = Math.max(height, y + rowH + 20)
    const oldBuf = await sharp(oldP).resize(tileW, tileH, { fit: 'cover' }).toBuffer()
    const newBuf = await sharp(newP).resize(tileW, tileH, { fit: 'cover' }).toBuffer()
    composites.push(
      { input: oldBuf, left: 30, top: y },
      { input: newBuf, left: 30 + tileW + 20, top: y },
      {
        input: Buffer.from(
          `<svg width="${width}" height="${labelH}"><text x="30" y="26" fill="#e8b923" font-size="18" font-family="sans-serif">main: ${id}</text><text x="${30 + tileW + 20}" y="26" fill="#8ae" font-size="18" font-family="sans-serif">new: ${id}</text></svg>`,
        ),
        top: y + tileH + 4,
        left: 0,
      },
    )
    y += rowH
  }
  await flush()
}

await mkdir(ARTIFACT_DIR, { recursive: true })
await mkdir(TMP, { recursive: true })
for (const [week, ids] of Object.entries(WEEKS)) {
  await renderWeek(week, ids)
}
