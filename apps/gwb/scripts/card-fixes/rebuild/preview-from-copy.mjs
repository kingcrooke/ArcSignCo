/**
 * Build W5 matchup template fields from live-card-copy.json.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const COPY = JSON.parse(
  readFileSync(path.join(__dirname, 'live-card-copy.json'), 'utf8'),
)

function parsePill(pill) {
  const m = String(pill).trim().match(/^(.+?)\s+([\d]+-[\d]+)$/)
  if (!m) return { name: pill, record: '' }
  return { name: m[1], record: m[2] }
}

export function previewFromCopy(cardId) {
  const c = COPY[cardId]
  if (!c) throw new Error(`missing preview copy for ${cardId}`)
  const left = parsePill(c.leftPill)
  const right = parsePill(c.rightPill)
  const barLeftPct = c.barLeftPct ?? 50
  return {
    week: c.week,
    matchupNum: c.matchupNum,
    title: c.bowlTitle,
    tagline: c.tagline ?? '',
    recordLine: c.recordLine,
    left: { name: left.name, record: left.record, pct: barLeftPct },
    right: { name: right.name, record: right.record, pct: 100 - barLeftPct },
    leftPctLabel: c.leftPctLabel,
    rightPctLabel: c.rightPctLabel,
    barLeftPct: c.barLeftPct,
    footerRight: c.footerRight,
  }
}
