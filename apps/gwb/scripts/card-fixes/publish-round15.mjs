import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GWB = path.join(__dirname, '..', '..')
const run = (cmd) => execSync(cmd, { cwd: GWB, stdio: 'inherit' })

const ONLY =
  'vs-w5-m2,vs-w5-m4,results-w2-m3,results-w2-m6,results-w3-m2,results-w3-m3,results-w3-m4,results-w3-m5,w2-slide-06'

run('node scripts/card-fixes/bake-w2-slide06-hero.mjs')
run('node scripts/card-fixes/render-w5-m2-m4-main.mjs')
run('node scripts/card-fixes/build-vs-chrome-crop-sheet.mjs')
run('node scripts/card-fixes/verify-vs-w5-m1-chrome.mjs')
run('node scripts/card-fixes/render-round15-results.mjs')
run('node scripts/card-fixes/check-w2-slide06-luma.mjs')
run(`node scripts/optimize-published-slides.mjs --only=${ONLY}`)
run(`node scripts/card-fixes/sync-published-slides.mjs --only=${ONLY}`)
