/**
 * Write hashed slide variants from repair masters + remove legacy/orphan assets.
 *
 *   node scripts/publish-hashed-slides.mjs
 */
import { readFile, rm, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appRoot = path.join(__dirname, '..')
const manifestPath = path.join(appRoot, 'src/content/slide-asset-basenames.json')
const sources = path.join(appRoot, 'scripts/slide-sources')
const outDir = path.join(appRoot, 'public/slides')

const ORPHAN_PREFIXES = ['vs-m3-hadi-manny']

const MAX_BYTES = 600 * 1024
const FULL_WIDTH = 1080
const THUMB_WIDTH = 540
const WEBP_QUALITY = 80

async function writeUnderBudget(bufferFn, outPath, label) {
  let quality = 82
  let buf = await bufferFn(quality)
  while (buf.length > MAX_BYTES && quality > 50) {
    quality -= 4
    buf = await bufferFn(quality)
  }
  if (buf.length > MAX_BYTES) {
    throw new Error(`${label}: ${outPath} is ${buf.length} bytes (max ${MAX_BYTES})`)
  }
  await sharp(buf).toFile(outPath)
}

async function publishOne(inputPath, basename) {
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

  const files = [
    `${basename}.full.webp`,
    `${basename}.full.jpg`,
    `${basename}.thumb.webp`,
    `${basename}.thumb.jpg`,
  ]

  await fullResize.clone().webp({ quality: WEBP_QUALITY, effort: 4 }).toFile(
    path.join(outDir, files[0]),
  )
  await writeUnderBudget(
    (q) => fullResize.clone().jpeg({ quality: q, mozjpeg: true }).toBuffer(),
    path.join(outDir, files[1]),
    basename,
  )
  await thumbResize.clone().webp({ quality: WEBP_QUALITY, effort: 4 }).toFile(
    path.join(outDir, files[2]),
  )
  await writeUnderBudget(
    (q) => thumbResize.clone().jpeg({ quality: q, mozjpeg: true }).toBuffer(),
    path.join(outDir, files[3]),
    basename,
  )

  console.log('published', basename, files.join(', '))
}

async function removeLegacy(logicalId, hashed) {
  const names = await readdir(outDir)
  for (const name of names) {
    if (name.startsWith(`${logicalId}.`) && !name.startsWith(`${hashed}.`)) {
      await rm(path.join(outDir, name))
      console.log('removed legacy', name)
    }
  }
}

async function removeOrphans() {
  const names = await readdir(outDir)
  for (const prefix of ORPHAN_PREFIXES) {
    for (const name of names) {
      if (name.startsWith(`${prefix}.`)) {
        await rm(path.join(outDir, name))
        console.log('removed orphan', name)
      }
    }
  }
}

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  for (const [logicalId, hashed] of Object.entries(manifest)) {
    const master = path.join(sources, `${logicalId}.png`)
    await publishOne(master, hashed)
    await removeLegacy(logicalId, hashed)
  }
  await removeOrphans()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
