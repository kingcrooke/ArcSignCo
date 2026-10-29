/**
 * Normalize Fuse 1000×1400 PNGs in slide-sources to 1080×1350 (letterbox #0B0D13).
 * Usage: node scripts/letterbox-fuse-sources.mjs [basename ...]
 */
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SOURCES = path.join(__dirname, 'slide-sources')
const TARGET_W = 1080
const TARGET_H = 1350
const BG = { r: 11, g: 13, b: 19, alpha: 1 }

const DEFAULT_BASENAMES = [
  ...[1, 2, 3, 4, 5, 6, 7].flatMap((w) =>
    [1, 2, 3, 4, 5, 6].map((m) => `results-w${w}-m${m}`),
  ),
  ...[1, 2, 3, 4, 5, 6].map((m) => `vs-w6-m${m}`),
  ...[1, 2, 3, 4, 5, 6].map((m) => `vs-w7-m${m}`),
  ...[1, 2, 3, 4, 5, 6].map((m) => `vs-w8-m${m}`),
]

async function letterboxOne(basename) {
  const input = path.join(SOURCES, `${basename}.png`)
  const resized = await sharp(input).resize({ height: TARGET_H }).png().toBuffer()
  const meta = await sharp(resized).metadata()
  const w = meta.width ?? 0
  if (w > TARGET_W) {
    throw new Error(`${basename}: scaled width ${w} exceeds ${TARGET_W}`)
  }
  const padLeft = Math.floor((TARGET_W - w) / 2)
  const padRight = TARGET_W - w - padLeft
  await sharp(resized)
    .extend({
      top: 0,
      bottom: 0,
      left: padLeft,
      right: padRight,
      background: BG,
    })
    .png()
    .toFile(input)
  const out = await sharp(input).metadata()
  if (out.width !== TARGET_W || out.height !== TARGET_H) {
    throw new Error(`${basename}: expected ${TARGET_W}×${TARGET_H}, got ${out.width}×${out.height}`)
  }
  console.log('letterboxed', basename, `${w}→${TARGET_W}×${TARGET_H}`)
}

async function main() {
  const args = process.argv.slice(2).filter(Boolean)
  const basenames = args.length ? args : DEFAULT_BASENAMES
  for (const basename of basenames) {
    await letterboxOne(basename)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
