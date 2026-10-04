/**
 * Generate WebP + JPG fallbacks and 540px thumbnails for published GWB slides.
 * Source PNGs: pass paths or place masters in scripts/slide-sources/.
 *
 *   node scripts/optimize-published-slides.mjs /path/to/w4-slide-01.png ...
 */
import { mkdir, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', 'public', 'slides')
const MAX_BYTES = 600 * 1024
const FULL_WIDTH = 1080
const THUMB_WIDTH = 540
const WEBP_QUALITY = 80

const RESULTS_BASENAMES = [1, 2, 3].flatMap((w) =>
  [1, 2, 3, 4, 5, 6].map((m) => `results-w${w}-m${m}`),
)

const REPORT_WEEKS = [1, 2, 3, 4]

const SLIDE_BASENAMES = [
  ...REPORT_WEEKS.flatMap((w) =>
    Array.from({ length: 16 }, (_, i) =>
      `w${w}-slide-${String(i + 1).padStart(2, '0')}`,
    ),
  ),
  'vs-m1-narking-steven',
  'vs-m2-kayser-frankie',
  'vs-m3-hadi-manny',
  'vs-m4-jamil-matt',
  'vs-m5-mauricio-eric',
  'vs-m6-danny-crooke',
  ...RESULTS_BASENAMES,
]

async function findSourceForBasename(basename, searchDirs) {
  for (const dir of searchDirs) {
    try {
      const files = await readdir(dir)
      const match = files.find(
        (f) => f.startsWith(basename) && /\.(png|jpe?g)$/i.test(f),
      )
      if (match) return path.join(dir, match)
    } catch {
      /* dir missing */
    }
  }
  return null
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

  const fullJpgInfo = await writeUnderBudget(
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

  const sizes = await Promise.all(
    [fullWebp, fullJpg, thumbWebp, thumbJpg].map(async (p) => ({
      file: path.basename(p),
      bytes: (await stat(p)).size,
    })),
  )

  console.log(basename, fullJpgInfo, sizes)
}

async function main() {
  const cliSources = process.argv.slice(2).filter((a) => !a.startsWith('-'))
  const weeksArg = process.argv.find((a) => a.startsWith('--weeks='))
  const weeks = weeksArg
    ? weeksArg
        .slice('--weeks='.length)
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => n > 0)
    : null
  const basenames = weeks?.length
    ? weeks.flatMap((w) =>
        Array.from({ length: 16 }, (_, i) =>
          `w${w}-slide-${String(i + 1).padStart(2, '0')}`,
        ),
      )
    : SLIDE_BASENAMES
  const searchDirs = [
    path.join(__dirname, '../../../docs/gwb-remade-slides'),
    path.join(__dirname, '../../../docs/gwb-results-cards'),
    path.join(__dirname, '../../../docs/gwb-fixed-slides'),
    path.join(__dirname, 'slide-sources'),
    '/home/ubuntu/.cursor/projects/workspace/uploads',
  ]

  await mkdir(OUT_DIR, { recursive: true })

  for (const basename of basenames) {
    const explicit = cliSources.find((p) => path.basename(p).includes(basename))
    const input =
      explicit ?? (await findSourceForBasename(basename, searchDirs))
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
