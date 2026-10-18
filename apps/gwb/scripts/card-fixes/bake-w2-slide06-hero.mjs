/**
 * True RGBA hero for w2-slide-06 (smooth alpha ramps; composited in render step).
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC = path.join(__dirname, 'generated', 'eric-DAL-4-w2.jpg')
const OUT = path.join(__dirname, 'assets', 'w2-slide-06-hero.png')
const LEFT_FADE_PX = 120

function smoothstep(t) {
  const x = Math.max(0, Math.min(1, t))
  return x * x * (3 - 2 * x)
}

async function main() {
  const { data, info } = await sharp(SRC).rotate().ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  })
  const { width: w, height: h, channels } = info
  const out = Buffer.alloc(w * h * 4)
  const bottomStart = h * 0.7
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * channels
      const o = (y * w + x) * 4
      let a = 1
      if (x < LEFT_FADE_PX) a *= smoothstep(x / LEFT_FADE_PX)
      if (y >= bottomStart) a *= 1 - smoothstep((y - bottomStart) / (h - bottomStart))
      out[o] = data[i]
      out[o + 1] = data[i + 1]
      out[o + 2] = data[i + 2]
      out[o + 3] = Math.round(a * 255)
    }
  }
  await sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toFile(OUT)
  console.log('wrote', OUT, `${w}x${h}`, 'RGBA')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
