/** Round 14 touched results + w2-slide-06 + W5 m2/m4 (no JPG composite). */
import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GWB = path.join(__dirname, '..', '..')
const run = (cmd) => execSync(cmd, { cwd: GWB, stdio: 'inherit' })

run('node scripts/card-fixes/render-w5-m2-m4-main.mjs')
run('node scripts/card-fixes/verify-vs-w5-m1-chrome.mjs')
run('node scripts/card-fixes/render-round13.mjs')
