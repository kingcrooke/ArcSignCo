import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GWB = path.join(__dirname, '..', '..')
const run = (cmd) => execSync(cmd, { cwd: GWB, stdio: 'inherit' })

const ONLY =
  'vs-w5-m2,vs-w5-m4,results-w2-m3,results-w2-m5,results-w2-m6,results-w3-m2,results-w3-m3,results-w3-m4,w2-slide-06'

run('node scripts/card-fixes/render-round14.mjs')
run(`node scripts/optimize-published-slides.mjs --only=${ONLY}`)
run(`node scripts/card-fixes/sync-published-slides.mjs --only=${ONLY}`)
run('node scripts/card-fixes/build-round14-pose-sheet.mjs')
