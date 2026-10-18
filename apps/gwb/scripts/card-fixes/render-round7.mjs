/**
 * Round 7: composite panel art onto main-branch live cards only.
 * Generators: composite-result-cards.py, composite-preview-cards.py (commit a538c42 lineage).
 */
import { execSync } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GWB = path.join(__dirname, '..', '..')
const ROOT = path.join(GWB, '..', '..')
const SLIDE_SOURCES = path.join(GWB, 'scripts', 'slide-sources')
const CARD = __dirname

/** @see ROUND7-CHANGES.md */
export const TOUCHED_RESULTS = [
  'results-w1-m1',
  'results-w1-m3',
  'results-w1-m4',
  'results-w1-m5',
  'results-w1-m6',
  'results-w2-m2',
  'results-w2-m3',
  'results-w2-m4',
  'results-w2-m5',
  'results-w2-m6',
  'results-w3-m1',
  'results-w3-m3',
  'results-w3-m4',
  'results-w3-m5',
]

export const TOUCHED_PREVIEWS = [
  'vs-m1-narking-steven',
  'vs-m2-kayser-frankie',
  'vs-m3-hadi-manny',
  'vs-m4-jamil-matt',
  'vs-m5-mauricio-eric',
  'vs-m6-danny-crooke',
  'vs-w5-m2',
  'vs-w5-m4',
]

export const REPORT_SLIDES = ['w1-slide-09', 'w2-slide-06']

export const LEFT_AS_LIVE_RESULTS = ['results-w1-m2', 'results-w3-m2']

async function mainFromMainJpg(cardId) {
  const rel = `apps/gwb/public/slides/${cardId}.full.jpg`
  const buf = execSync(`git show main:${rel}`, { cwd: ROOT })
  const tmp = path.join(CARD, '.tmp-main', `${cardId}.jpg`)
  await mkdir(path.dirname(tmp), { recursive: true })
  await writeFile(tmp, buf)
  return tmp
}

async function copyMainToSlideSource(cardId) {
  const tmp = await mainFromMainJpg(cardId)
  const dest = path.join(SLIDE_SOURCES, `${cardId}.png`)
  await sharp(tmp).png().toFile(dest)
  console.log('left as live (main)', dest)
}

async function main() {
  await mkdir(SLIDE_SOURCES, { recursive: true })
  process.env.GWB_ROUND7_RESULTS = TOUCHED_RESULTS.join(',')
  process.env.GWB_ROUND7_PREVIEWS = TOUCHED_PREVIEWS.join(',')
  execSync('python3 scripts/card-fixes/composite-result-cards.py', {
    cwd: GWB,
    stdio: 'inherit',
  })
  execSync('python3 scripts/card-fixes/composite-preview-cards.py', {
    cwd: GWB,
    stdio: 'inherit',
  })
  for (const id of LEFT_AS_LIVE_RESULTS) {
    await copyMainToSlideSource(id)
  }
  for (const id of REPORT_SLIDES) {
    await copyMainToSlideSource(id)
  }
  execSync('python3 scripts/card-fixes/apply-live-text-diff.py', {
    cwd: GWB,
    stdio: 'inherit',
  })
  console.log('round7 render done →', SLIDE_SOURCES)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
