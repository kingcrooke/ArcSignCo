/**
 * QA: contact sheet, OCR banned strings, framing report summary.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { createWorker } from 'tesseract.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CARDS = path.join(__dirname, '../slide-sources')
const ARTIFACTS = '/opt/cursor/artifacts/gwb-w5-matchup-qa'
const FRAMING = path.join(__dirname, 'framing-report.json')

const IDS = [1, 2, 3, 4, 5, 6].map((n) => `vs-w5-m${n}`)

async function ocr(pathname) {
  const worker = await createWorker('eng')
  const {
    data: { text },
  } = await worker.recognize(pathname)
  await worker.terminate()
  return text
}

function bannedHits(text) {
  const hits = []
  if (/\bhadi\b/i.test(text)) hits.push('Hadi')
  if (/\bWINNER\b/i.test(text)) hits.push('WINNER')
  if (/\bLOSER\b/i.test(text)) hits.push('LOSER')
  if (/(?:^|\s)W(?:\s|$)/m.test(text) && !/\bVS\b/.test(text)) {
    // center W badge only — allow VS
  }
  if (/\bWINNER\b|\bLOSER\b/i.test(text)) {
    /* already */
  }
  // isolated W in OCR often from VS; flag explicit winner marker
  if (/\bFINAL:\b/i.test(text) || /\bFINAL\s+.*TAKES\b/i.test(text)) hits.push('FINAL-results')
  if (/(?:^|\n)\s*W\s*(?:\n|$)/i.test(text)) hits.push('W-badge')
  return hits
}

async function contactSheet() {
  const tileW = 540
  const tileH = 675
  const cols = 3
  const rows = 2
  const pad = 16
  const width = cols * tileW + (cols + 1) * pad
  const height = rows * tileH + (rows + 1) * pad + 40
  const composites = []
  let i = 0
  for (const id of IDS) {
    const src = path.join(CARDS, `${id}.png`)
    const buf = await sharp(src).resize(tileW, tileH, { fit: 'cover' }).png().toBuffer()
    const col = i % cols
    const row = Math.floor(i / cols)
    composites.push({
      input: buf,
      left: pad + col * (tileW + pad),
      top: pad + 40 + row * (tileH + pad),
    })
    i++
  }
  const label = Buffer.from(
    `<svg width="${width}" height="40"><text x="16" y="28" fill="#d4af37" font-family="sans-serif" font-size="22">GWB Week 5 Matchup Cards — QA Contact Sheet</text></svg>`,
  )
  const out = path.join(ARTIFACTS, 'w5-matchup-contact-sheet.png')
  await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 12, g: 14, b: 18 },
    },
  })
    .composite([{ input: label, top: 0, left: 0 }, ...composites])
    .png()
    .toFile(out)
  return out
}

async function main() {
  await mkdir(ARTIFACTS, { recursive: true })
  const ocrReport = []
  for (const id of IDS) {
    const png = path.join(CARDS, `${id}.png`)
    const text = await ocr(png)
    const hits = bannedHits(text)
    ocrReport.push({ id, banned: hits, sample: text.slice(0, 400) })
  }
  const sheet = await contactSheet()
  const framing = JSON.parse(await readFile(FRAMING, 'utf8'))
  const report = { ocrReport, contactSheet: sheet, framing }
  const out = path.join(ARTIFACTS, 'qa-report.json')
  await writeFile(out, JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify(report, null, 2))
  const fail = ocrReport.filter((r) => r.banned.length)
  if (fail.length) process.exitCode = 1
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
