/**
 * Generate WebP + JPG full/thumb variants for Dynasty published slides.
 * Source PNGs: scripts/slide-sources/<basename>.png
 */
import { mkdir, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', 'public', 'slides')
const SOURCES = path.join(__dirname, 'slide-sources')
const MAX_BYTES = 600 * 1024
const FULL_WIDTH = 1080
const THUMB_WIDTH = 540
const WEBP_QUALITY = 80

const DEFAULT_BASENAMES = [
  ...[1, 2, 3, 4, 5].flatMap((w) =>
    [1, 2, 3, 4, 5, 6].map((m) => `results-w${w}-m${m}`),
  ),
  ...[1, 2, 3, 4, 5, 6].map((m) => `vs-w6-m${m}`),
]

async function findSource(basename) {
  const files = await readdir(SOURCES)
  const match = files.find(
    (f) => f === `${basename}.png` || f.startsWith(`${basename}.`),
  )
  return match ? path.join(SOURCES, match) : null
}

async function writeUnderBudget(bufferFn, outPath, label) {
  let quality = 82
  let buf = await bufferFn(quality)
  while (buf.length > MAX_BYTES && quality > 50) {
    quality -= 4
    buf = await bufferFn(quality)
  }
  if (buf.length > MAX_BYTES) {
    throw new Error(
      `${label}: ${outPath} is ${buf.length} bytes (max ${MAX_BYTES})`,
    )
  }
  await sharp(buf).toFile(outPath)
  return { bytes: buf.length, quality }
}

async function processOne(inputPath, basename) {
  const meta = await sharp(inputPath).metadata()
  const height = meta.height ?? 1350
  const width = meta.width ?? 1080

  const fullResize = sharp(inputPath).resize({
    width: FULL_WIDTH,
    height: Math.round((FULL_WIDTH / width) * height),
    fit: 'inside',
    withoutEnlargement: true,
  })

  const thumbResize = sharp(inputPath).resize({
    width: THUMB_WIDTH,
    withoutEnlargement: true,
  })

  const fullWebp = path.join(OUT_DIR, `${basename}.full.webp`)
  const fullJpg = path.join(OUT_DIR, `${basename}.full.jpg`)
  const thumbWebp = path.join(OUT_DIR, `${basename}.thumb.webp`)
  const thumbJpg = path.join(OUT_DIR, `${basename}.thumb.jpg`)

  await fullResize
    .clone()
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toFile(fullWebp)

  await writeUnderBudget(
    (q) => fullResize.clone().jpeg({ quality: q, mozjpeg: true }).toBuffer(),
    fullJpg,
    basename,
  )

  await thumbResize
    .clone()
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toFile(thumbWebp)

  await writeUnderBudget(
    (q) => thumbResize.clone().jpeg({ quality: q, mozjpeg: true }).toBuffer(),
    thumbJpg,
    `${basename} thumb`,
  )

  console.log('optimized', basename)
}

async function main() {
  const onlyArg = process.argv.find((a) => a.startsWith('--only='))
  const only = onlyArg
    ? onlyArg
        .slice('--only='.length)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : null
  const basenames = (only?.length ? only : DEFAULT_BASENAMES).filter(Boolean)

  await mkdir(OUT_DIR, { recursive: true })

  for (const basename of basenames) {
    const input = await findSource(basename)
    if (!input) {
      console.error(`Missing source for ${basename}`)
      process.exitCode = 1
      continue
    }
    await processOne(input, basename)
  }

  if (process.exitCode) process.exit(process.exitCode)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
