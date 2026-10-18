import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CARD = path.join(__dirname, '..')
const KEEPERS = path.join(__dirname, 'keepers')

const panelFixes = JSON.parse(readFileSync(path.join(CARD, 'panel-fixes.json'), 'utf8'))

/** cardId → side → absolute image path */
const regenMap = new Map()
for (const p of panelFixes.panels) {
  const abs = path.normalize(path.join(CARD, p.outFile))
  const key = `${p.cardId}:${p.side}`
  regenMap.set(key, abs)
}

export function panelImagePath(cardId, side) {
  const key = `${cardId}:${side}`
  if (regenMap.has(key)) {
    const p = regenMap.get(key)
    if (!existsSync(p)) throw new Error(`missing regen panel ${p}`)
    return p
  }
  const keeper = path.join(KEEPERS, `${cardId}-${side}.jpg`)
  if (!existsSync(keeper)) {
    throw new Error(`missing keeper panel ${keeper} — run extract-keeper-panels.py`)
  }
  return keeper
}
