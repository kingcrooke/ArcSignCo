/**
 * One-off / regen: source PNGs → public/avatars/roster-NN.webp + .png (512×512).
 * Usage: node scripts/optimize-manager-avatars.mjs <dir-with-roster-*.png>
 */
import { readdir, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'avatars')
const srcDir = process.argv[2]

if (!srcDir) {
  console.error('Usage: node scripts/optimize-manager-avatars.mjs <source-dir>')
  process.exit(1)
}

await mkdir(outDir, { recursive: true })
const files = (await readdir(srcDir)).filter((f) => /^roster-\d{2}-.+\.png$/i.test(f))

for (const file of files.sort()) {
  const m = /^roster-(\d{2})-/i.exec(file)
  if (!m) continue
  const id = m[1]
  const input = path.join(srcDir, file)
  const base = `roster-${id}`
  const webpOut = path.join(outDir, `${base}.webp`)
  const pngOut = path.join(outDir, `${base}.png`)
  const img = sharp(input).resize(512, 512, { fit: 'cover' })
  await img.webp({ quality: 86, effort: 4 }).toFile(webpOut)
  await img.png({ compressionLevel: 9 }).toFile(pngOut)
  console.log('Wrote', base)
}
