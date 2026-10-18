/**
 * Copy mood PNGs into public/avatars as roster-NN-{excited|crushed}.webp + .png (512×512).
 * Usage: node scripts/install-mood-avatars.mjs <source-dir-with-uploads>
 */
import { copyFile, mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'avatars')
const srcDir = process.argv[2]

if (!srcDir) {
  console.error('Usage: node scripts/install-mood-avatars.mjs <source-dir>')
  process.exit(1)
}

const MOOD_RE =
  /^roster-(\d{2})-(excited|crushed)(?:_[a-z0-9]+)?\.png$/i

await mkdir(outDir, { recursive: true })
const files = await readdir(srcDir)

for (const file of files.sort()) {
  const m = MOOD_RE.exec(file)
  if (!m) continue
  const id = m[1]
  const mood = m[2].toLowerCase()
  const input = path.join(srcDir, file)
  const stem = `roster-${id}-${mood}`
  const webpOut = path.join(outDir, `${stem}.webp`)
  const pngOut = path.join(outDir, `${stem}.png`)
  const img = sharp(input).resize(512, 512, { fit: 'cover' })
  await img.webp({ quality: 86, effort: 4 }).toFile(webpOut)
  await img.clone().png({ compressionLevel: 9 }).toFile(pngOut)
  console.log('Wrote', stem)
}
