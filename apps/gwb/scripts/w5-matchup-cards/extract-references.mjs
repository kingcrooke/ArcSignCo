/**
 * Crop inner panel art from approved v5 vs-* slides for style reference.
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SLIDES = path.join(__dirname, '../../../../gwb-fe006a16/slides')
const OUT = path.join(__dirname, 'ref-crops')

const SOURCES = [
  ['vs-m1-narking-steven', 'left', 'narking'],
  ['vs-m1-narking-steven', 'right', 'steven'],
  ['vs-m2-kayser-frankie', 'left', 'kayser'],
  ['vs-m2-kayser-frankie', 'right', 'frankie'],
  ['vs-m3-hadi-manny', 'left', 'hady'],
  ['vs-m3-hadi-manny', 'right', 'manny'],
  ['vs-m4-jamil-matt', 'left', 'jamil'],
  ['vs-m4-jamil-matt', 'right', 'matt'],
  ['vs-m5-mauricio-eric', 'left', 'mauricio'],
  ['vs-m5-mauricio-eric', 'right', 'eric'],
  ['vs-m6-danny-crooke', 'left', 'danny'],
  ['vs-m6-danny-crooke', 'right', 'crooke'],
]

const LEFT = { left: 88, top: 318, width: 420, height: 620 }
const RIGHT = { left: 572, top: 318, width: 420, height: 620 }

async function main() {
  await mkdir(OUT, { recursive: true })
  for (const [base, side, name] of SOURCES) {
    const input = path.join(SLIDES, `${base}.full.jpg`)
    const region = side === 'left' ? LEFT : RIGHT
    const out = path.join(OUT, `${name}.jpg`)
    await sharp(input).extract(region).jpeg({ quality: 92 }).toFile(out)
    console.log('wrote', out)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
