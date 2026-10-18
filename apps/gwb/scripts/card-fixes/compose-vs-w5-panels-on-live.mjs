/**
 * Keep live vs-w5-m2/m4 chrome from origin/main; paste only panel art from script render.
 */
import { execSync } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GWB = path.join(__dirname, '..', '..')
const TMP = '/tmp/gwb-live-vs'
const LEFT = { left: 54, top: 268, width: 472, height: 640 }
const RIGHT = { left: 554, top: 268, width: 472, height: 640 }

async function liveJpg(id) {
  await mkdir(TMP, { recursive: true })
  const out = path.join(TMP, `${id}.jpg`)
  execSync(`git show origin/main:apps/gwb/public/slides/${id}.full.jpg > ${out}`, {
    cwd: path.join(GWB, '..', '..'),
  })
  return out
}

async function pastePanels(id) {
  const live = await liveJpg(id)
  const cand = path.join(GWB, 'scripts/w5-matchup-cards/output', `${id}.png`)
  const dest = path.join(GWB, 'scripts/slide-sources', `${id}.png`)
  const [base, panels] = await Promise.all([
    sharp(live).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
    sharp(cand).resize(1080, 1350).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
  ])
  const w = base.info.width
  const h = base.info.height
  const out = Buffer.from(base.data)
  const inRect = (x, y, r) =>
    x >= r.left && x < r.left + r.width && y >= r.top && y < r.top + r.height

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      if (inRect(x, y, LEFT) || inRect(x, y, RIGHT)) {
        out[i] = panels.data[i]
        out[i + 1] = panels.data[i + 1]
        out[i + 2] = panels.data[i + 2]
        out[i + 3] = 255
      }
    }
  }
  await sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toFile(dest)
  console.log('panel-swap', id, '→', dest)
}

async function main() {
  for (const id of ['vs-w5-m2', 'vs-w5-m4']) await pastePanels(id)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
