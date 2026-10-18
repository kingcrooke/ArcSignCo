/**
 * Bake bottom + left fades into w2-slide-06 hero (opaque composite onto slide bg).
 * Playwright screenshots ignore CSS mask and often ignore PNG alpha on <img>.
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC = path.join(__dirname, 'generated', 'eric-DAL-4-w2.jpg')
const OUT = path.join(__dirname, 'assets', 'w2-slide-06-hero.png')
const BG = { r: 10, g: 15, b: 20 }

async function main() {
  const rotated = sharp(SRC).rotate()
  const meta = await rotated.metadata()
  const cropH = Math.floor(meta.height * 0.92)
  const { data, info } = await rotated
    .extract({ left: 0, top: 0, width: meta.width, height: cropH })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width: w, height: h, channels } = info
  const out = Buffer.alloc(w * h * 4)
  const bottomStart = h * 0.7
  const softenStart = h * 0.5
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * channels
      const o = (y * w + x) * 4
      let a = 1
      if (y >= softenStart && y < bottomStart) {
        const t = (y - softenStart) / (bottomStart - softenStart)
        a *= 1 - t * 0.55
      }
      if (y >= bottomStart) {
        const t = (y - bottomStart) / (h - bottomStart)
        const eased = t * t * (3 - 2 * t)
        a *= 1 - eased
      }
      const leftFade = Math.min(1, Math.pow(x / (w * 0.24), 1.4))
      a *= leftFade
      for (let c = 0; c < 3; c++) {
        out[o + c] = Math.round(data[i + c] * a + BG[['r', 'g', 'b'][c]] * (1 - a))
      }
      out[o + 3] = 255
    }
  }
  await sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toFile(OUT)
  console.log('wrote', OUT, `${w}x${h}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
