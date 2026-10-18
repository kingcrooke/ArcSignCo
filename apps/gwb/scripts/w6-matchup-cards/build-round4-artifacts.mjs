import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { execSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS = path.join(__dirname, 'assets')
const CARDS = path.join(__dirname, '../slide-sources')
const REF_W5 = path.join(__dirname, 'refs-w5/results-w5-m1-winner.jpg')
const OUT = '/opt/cursor/artifacts'
const REF_91 = '741e20d'
const REF_92 = 'af18e0d'

function gitShow(commit, file) {
  return execSync(`git -C /workspace show ${commit}:apps/gwb/scripts/w6-matchup-cards/assets/${file}`, {
    encoding: 'buffer',
    maxBuffer: 10 * 1024 * 1024,
  })
}

async function resizePanel(buf, w, h) {
  return sharp(buf).resize(w, h, { fit: 'cover', position: 'centre' }).jpeg({ quality: 92 }).toBuffer()
}

async function threeWay() {
  const pw = 280
  const ph = 380
  const pad = 12
  const labelH = 28
  const cols = 3
  const rows = 7
  const width = pad + cols * (pw + pad)
  const height = pad + rows * (labelH + ph + pad)
  const composites = []
  const headers = ['PR #91', 'NEW (R4)', 'PR #92']
  for (let c = 0; c < cols; c++) {
    const svg = Buffer.from(
      `<svg width="${pw}" height="${labelH}"><text x="0" y="20" fill="#c9a227" font-family="sans-serif" font-size="16" font-weight="bold">${headers[c]}</text></svg>`,
    )
    composites.push({ input: svg, left: pad + c * (pw + pad), top: pad })
  }
  for (let r = 0; r < 6; r++) {
    const m = r + 1
    const file = `vs-w6-m${m}-left.jpg`
    const rowTop = pad + labelH + pad + r * (labelH + ph + pad)
    const rowLabel = Buffer.from(
      `<svg width="${width}" height="${labelH}"><text x="8" y="20" fill="#eee" font-family="sans-serif" font-size="15">m${m} left panel</text></svg>`,
    )
    composites.push({ input: rowLabel, left: 0, top: rowTop })
    const sources = [
      gitShow(REF_91, file),
      await readFile(path.join(ASSETS, file)),
      gitShow(REF_92, file),
    ]
    for (let c = 0; c < 3; c++) {
      const tile = await resizePanel(sources[c], pw, ph)
      composites.push({
        input: tile,
        left: pad + c * (pw + pad),
        top: rowTop + labelH,
      })
    }
  }
  const toneRow = pad + 6 * (labelH + ph + pad) + labelH
  const toneLabel = Buffer.from(
    `<svg width="${width}" height="${labelH}"><text x="8" y="20" fill="#eee" font-family="sans-serif" font-size="15">Tone: W6 NEW m1-left vs W5 result m1-winner panel</text></svg>`,
  )
  composites.push({ input: toneLabel, left: 0, top: toneRow })
  const w6m1 = await readFile(path.join(ASSETS, 'vs-w6-m1-left.jpg'))
  const w5m1 = await readFile(REF_W5)
  const halfW = Math.floor((width - 3 * pad) / 2)
  composites.push({ input: await resizePanel(w6m1, halfW, ph), left: pad, top: toneRow + labelH })
  composites.push({
    input: await resizePanel(w5m1, halfW, ph),
    left: pad + halfW + pad,
    top: toneRow + labelH,
  })
  const outPath = path.join(OUT, 'gwb-w6-three-way.png')
  await sharp({
    create: { width, height, channels: 3, background: { r: 18, g: 20, b: 24 } },
  })
    .composite(composites)
    .png()
    .toFile(outPath)
  return outPath
}

/** 2× zoom: crop central chest/number region from normalized 944×1280 panel */
async function zoomLeft(matchId, outName) {
  const src = path.join(ASSETS, `vs-w6-${matchId}-left.jpg`)
  const meta = await sharp(src).metadata()
  const W = meta.width ?? 944
  const H = meta.height ?? 1280
  const cropW = Math.round(W / 2)
  const cropH = Math.round(H / 2)
  const left = Math.round((W - cropW) / 2)
  const top = Math.round(H * 0.22)
  const outPath = path.join(OUT, outName)
  await sharp(src)
    .extract({ left, top, width: cropW, height: cropH })
    .resize(cropW * 2, cropH * 2, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toFile(outPath)
  return outPath
}

async function cardShots() {
  const out = []
  for (let n = 1; n <= 6; n++) {
    const id = `vs-w6-m${n}`
    const dest = path.join(OUT, `gwb-w6-lighter-card-m${n}.png`)
    await sharp(path.join(CARDS, `${id}.png`))
      .resize(1080, 1350)
      .png()
      .toFile(dest)
    out.push(dest)
  }
  return out
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
  for (let n = 1; n <= 6; n++) {
    const src = path.join(CARDS, `vs-w6-m${n}.png`)
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
    `<svg width="${width}" height="40"><text x="16" y="28" fill="#d4af37" font-family="sans-serif" font-size="22">GWB Week 6 — R4 regenerated panels</text></svg>`,
  )
  const out = path.join(OUT, 'gwb-w6-matchup-contact-sheet.png')
  await sharp({
    create: { width, height, channels: 3, background: { r: 12, g: 14, b: 18 } },
  })
    .composite([{ input: label, top: 0, left: 0 }, ...composites])
    .png()
    .toFile(out)
  return out
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const report = {
    threeWay: await threeWay(),
    zoomM1: await zoomLeft('m1', 'gwb-w6-zoom-m1.png'),
    zoomM6: await zoomLeft('m6', 'gwb-w6-zoom-m6.png'),
    cards: await cardShots(),
    contactSheet: await contactSheet(),
  }
  await writeFile(path.join(OUT, 'round4-artifacts.json'), JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify(report, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
