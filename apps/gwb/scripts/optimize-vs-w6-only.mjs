import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', 'public', 'slides')
const SRC = path.join(__dirname, 'slide-sources')
const MAX_BYTES = 600 * 1024
const FULL_WIDTH = 1080
const THUMB_WIDTH = 540
const WEBP_QUALITY = 80

async function writeUnderBudget(bufferFn, outPath) {
  let quality = 82
  let buf = await bufferFn(quality)
  while (buf.length > MAX_BYTES && quality > 50) {
    quality -= 4
    buf = await bufferFn(quality)
  }
  await sharp(buf).toFile(outPath)
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
  const thumbResize = sharp(inputPath).resize({ width: THUMB_WIDTH, withoutEnlargement: true })
  const fullWebp = path.join(OUT_DIR, `${basename}.full.webp`)
  const fullJpg = path.join(OUT_DIR, `${basename}.full.jpg`)
  const thumbWebp = path.join(OUT_DIR, `${basename}.thumb.webp`)
  const thumbJpg = path.join(OUT_DIR, `${basename}.thumb.jpg`)
  await fullResize.clone().webp({ quality: WEBP_QUALITY, effort: 4 }).toFile(fullWebp)
  await writeUnderBudget(
    (q) => fullResize.clone().jpeg({ quality: q, mozjpeg: true }).toBuffer(),
    fullJpg,
  )
  await thumbResize.clone().webp({ quality: WEBP_QUALITY, effort: 4 }).toFile(thumbWebp)
  await writeUnderBudget(
    (q) => thumbResize.clone().jpeg({ quality: q, mozjpeg: true }).toBuffer(),
    thumbJpg,
  )
  console.log('ok', basename)
}

await mkdir(OUT_DIR, { recursive: true })
for (const n of [1, 2, 3, 4, 5, 6]) {
  const basename = `vs-w6-m${n}`
  await processOne(path.join(SRC, `${basename}.png`), basename)
}
