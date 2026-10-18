/**
 * Panel art: assets match 74a66a1; rendered panel crops match published m2/m4.
 */
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { m2m4PanelPath } from '../w5-matchup-cards/m2-m4-panel-path.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GWB = path.join(__dirname, '..', '..')
const REF_SHA = '74a66a1'
const CAND = path.join(GWB, 'scripts/w5-matchup-cards/output')

const PANEL_TOP = 275
const LEFT = { left: 67, top: PANEL_TOP, width: 486, height: 668 }
const RIGHT = { left: 575, top: PANEL_TOP, width: 486, height: 668 }

function gitMd5(refPath) {
  const out = execFileSync('git', ['show', `${REF_SHA}:${refPath}`], { encoding: 'buffer' })
  return createHash('md5').update(out).digest('hex')
}

async function meanRegion(bufA, bufB, region) {
  const { left, top, width, height } = region
  const [a, b] = await Promise.all([
    sharp(bufA).extract({ left, top, width, height }).raw().toBuffer(),
    sharp(bufB).extract({ left, top, width, height }).raw().toBuffer(),
  ])
  let sum = 0
  for (let i = 0; i < a.length; i++) sum += Math.abs(a[i] - b[i])
  return sum / a.length
}

async function main() {
  let fail = false
  for (const id of ['vs-w5-m2', 'vs-w5-m4']) {
    for (const side of ['left', 'right']) {
      const rel = `apps/gwb/scripts/w5-matchup-cards/assets/${id}-${side}.jpg`
      const local = m2m4PanelPath(id, side)
      const a = gitMd5(rel)
      const localMd5 = createHash('md5').update(readFileSync(local)).digest('hex')
      if (a !== localMd5) {
        console.error(id, side, 'asset MD5 mismatch')
        fail = true
      } else console.log(id, side, 'asset MD5 OK')
    }
  }

  const m2 = (await import('./render-w5-m2-m4-main.mjs')).mergeMatchup('vs-w5-m2')
  const m4 = (await import('./render-w5-m2-m4-main.mjs')).mergeMatchup('vs-w5-m4')
  console.log('bowl m2:', m2.title, '| m4:', m4.title)
  if (m2.title !== 'RECESSION WATCH' || m4.title !== 'NO REST FOR THE POOR') fail = true

  for (const id of ['vs-w5-m2', 'vs-w5-m4']) {
    const refJpg = execFileSync('git', ['show', `${REF_SHA}:gwb-fe006a16/slides/${id}.full.jpg`])
    const refBuf = await sharp(refJpg).resize(1080, 1350).png().toBuffer()
    const candBuf = await sharp(path.join(CAND, `${id}.png`)).png().toBuffer()
    const dL = await meanRegion(refBuf, candBuf, LEFT)
    const dR = await meanRegion(refBuf, candBuf, RIGHT)
    console.log(id, 'panel crop diff vs 74a66a1 published — left:', dL.toFixed(2), 'right:', dR.toFixed(2))
    if (dL > 22 || dR > 22) {
      console.error(id, 'FAIL panel crop drift vs round-19 publish')
      fail = true
    }
  }
  if (fail) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
