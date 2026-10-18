/**
 * Side-by-side live (main) vs new PNG for layout proof.
 */
import { execSync } from 'node:child_process'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GWB = path.join(__dirname, '..', '..')
const REPO = path.join(GWB, '..', '..')
const NEW_DIR = path.join(GWB, 'scripts/slide-sources')
const OUT = '/opt/cursor/artifacts/gwb-layout-diff'
const IDS = [
  ...[1, 2, 3, 4, 5, 6].map((m) => `results-w1-m${m}`),
  ...[2, 3, 4, 5, 6].map((m) => `results-w2-m${m}`),
  ...[1, 2, 3, 4, 5].map((m) => `results-w3-m${m}`),
  'vs-m1-narking-steven',
  'vs-m2-kayser-frankie',
  'vs-m3-hadi-manny',
  'vs-m4-jamil-matt',
  'vs-m5-mauricio-eric',
  'vs-m6-danny-crooke',
  'vs-w5-m2',
  'vs-w5-m4',
]

async function oldPng(id) {
  const rel = `apps/gwb/public/slides/${id}.full.jpg`
  const buf = execSync(`git show main:${rel}`, { cwd: REPO })
  const jpg = path.join(OUT, `.old-${id}.jpg`)
  await writeFile(jpg, buf)
  return sharp(jpg).resize(540, 675, { fit: 'cover' }).png().toBuffer()
}

async function main() {
  await mkdir(OUT, { recursive: true })
  for (const id of IDS) {
    const newPath = path.join(NEW_DIR, `${id}.png`)
    const newBuf = await sharp(newPath).resize(540, 675, { fit: 'cover' }).png().toBuffer()
    const oldBuf = await oldPng(id)
    const row = await sharp({
      create: { width: 1080, height: 675, channels: 3, background: '#111' },
    })
      .composite([
        { input: oldBuf, left: 0, top: 0 },
        { input: newBuf, left: 540, top: 0 },
      ])
      .png()
      .toBuffer()
    const out = path.join(OUT, `${id}-live-vs-new.png`)
    await writeFile(out, row)
    console.log('wrote', out)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
