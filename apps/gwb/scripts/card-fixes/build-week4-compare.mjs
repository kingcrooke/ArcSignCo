/**
 * Side-by-side: main (live) vs branch proposed for W4 preview cards + w4-slide-12.
 * Output: week4-compare/<id>-current-vs-proposed.jpg and ALL.jpg (each < 1.5MB).
 */
import { execSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO = path.join(__dirname, '..', '..', '..')
const GWB = path.join(__dirname, '..', '..')
const OUT = path.join(__dirname, 'week4-compare')
const MAX_BYTES = 1.5 * 1024 * 1024

const IDS = [
  'vs-m1-narking-steven',
  'vs-m2-kayser-frankie',
  'vs-m3-hadi-manny',
  'vs-m4-jamil-matt',
  'vs-m5-mauricio-eric',
  'vs-m6-danny-crooke',
  'w4-slide-12',
]

async function loadCurrent(id) {
  const rel = `apps/gwb/public/slides/${id}.full.jpg`
  const buf = execSync(`git show origin/main:${rel}`, { cwd: REPO })
  return buf
}

async function loadProposed(id) {
  const png = path.join(GWB, 'scripts/slide-sources', `${id}.png`)
  return readFile(png)
}

async function writeUnderBudget(buf, outPath) {
  let quality = 88
  let out = await sharp(buf).jpeg({ quality, mozjpeg: true }).toBuffer()
  while (out.length > MAX_BYTES && quality > 55) {
    quality -= 5
    out = await sharp(buf).jpeg({ quality, mozjpeg: true }).toBuffer()
  }
  if (out.length > MAX_BYTES) {
    const meta = await sharp(buf).metadata()
    const scale = Math.sqrt(MAX_BYTES / out.length) * 0.95
    out = await sharp(buf)
      .resize(Math.round((meta.width ?? 1080) * scale))
      .jpeg({ quality: 78, mozjpeg: true })
      .toBuffer()
  }
  await writeFile(outPath, out)
  return out.length
}

async function pairSheet(currentBuf, proposedBuf, label) {
  const tileW = 520
  const tileH = 650
  const labelH = 44
  const cur = await sharp(currentBuf).resize(tileW, tileH, { fit: 'inside' }).jpeg().toBuffer()
  const prop = await sharp(proposedBuf).resize(tileW, tileH, { fit: 'inside' }).jpeg().toBuffer()
  const width = tileW * 2 + 60
  const height = tileH + labelH + 20
  const svg = Buffer.from(
    `<svg width="${width}" height="${labelH}">
      <text x="30" y="30" fill="#d4af37" font-family="sans-serif" font-size="22">LIVE (main)</text>
      <text x="${tileW + 50}" y="30" fill="#8af" font-family="sans-serif" font-size="22">PROPOSED (PR #95)</text>
      <text x="${width / 2}" y="30" text-anchor="middle" fill="#ccc" font-size="18">${label}</text>
    </svg>`,
  )
  return sharp({
    create: { width, height, channels: 3, background: { r: 14, g: 16, b: 20 } },
  })
    .composite([
      { input: svg, top: 0, left: 0 },
      { input: cur, top: labelH + 10, left: 20 },
      { input: prop, top: labelH + 10, left: tileW + 40 },
    ])
    .png()
    .toBuffer()
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const rowBuffers = []
  for (const id of IDS) {
    const current = await loadCurrent(id)
    const proposed = await loadProposed(id)
    const sheet = await pairSheet(current, proposed, id)
    const out = path.join(OUT, `${id}-current-vs-proposed.jpg`)
    const bytes = await writeUnderBudget(sheet, out)
    console.log('wrote', out, bytes)
    rowBuffers.push({ sheet, id })
  }

  const colW = 1100
  let y = 20
  const composites = []
  let totalH = 20
  for (const { sheet, id } of rowBuffers) {
    const meta = await sharp(sheet).metadata()
    const h = meta.height ?? 700
    composites.push({ input: sheet, top: y, left: 20 })
    y += h + 16
    totalH = y + 20
  }
  const allBuf = await sharp({
    create: { width: colW + 40, height: totalH, channels: 3, background: { r: 10, g: 12, b: 16 } },
  })
    .composite(composites)
    .png()
    .toBuffer()
  const allPath = path.join(OUT, 'ALL.jpg')
  const allBytes = await writeUnderBudget(allBuf, allPath)
  console.log('wrote', allPath, allBytes)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
