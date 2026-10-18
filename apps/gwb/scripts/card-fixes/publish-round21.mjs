import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GWB = path.join(__dirname, '..', '..')
const run = (cmd) => execSync(cmd, { cwd: GWB, stdio: 'inherit' })

const ONLY = 'vs-w5-m2,vs-w5-m4,w2-slide-06'

run('node scripts/card-fixes/render-w5-m2-m4-main.mjs')
run('node scripts/card-fixes/verify-vs-w5-m2-m4-panels.mjs')
run('node scripts/card-fixes/measure-vs-chrome-layout.mjs')
run('node scripts/card-fixes/build-vs-chrome-crop-sheet.mjs')
run('node scripts/card-fixes/composite-w2-slide06.mjs')
run(`node scripts/optimize-published-slides.mjs --only=${ONLY}`)
run(`node scripts/card-fixes/sync-published-slides.mjs --only=${ONLY}`)
