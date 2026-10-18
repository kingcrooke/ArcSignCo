/**
 * Map live-card-copy.json + results-meta → result-template fields.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const META = JSON.parse(readFileSync(path.join(__dirname, 'results-meta.json'), 'utf8'))
const COPY = JSON.parse(readFileSync(path.join(__dirname, 'live-card-copy.json'), 'utf8'))

const metaById = new Map(META.map((r) => [r.id, r]))

const DISPLAY_OVERRIDE = {
  'results-w1-m6': { winner: 'MNNY' },
  'results-w2-m5': { winner: 'MNNY' },
}

function parsePill(pill) {
  const m = String(pill).trim().match(/^(.+?)\s+([\d]+-[\d]+)$/)
  if (!m) return { name: pill, record: '' }
  return { name: m[1], record: m[2] }
}

function scoreFromScoreline(scoreline) {
  const m = String(scoreline).match(
    /^(\S+)\s+([\d.]+)\s+—\s+([\d.]+)\s+(\S+)\s*$/,
  )
  if (!m) return null
  return {
    winnerPts: m[2],
    loserPts: m[3],
    winnerName: m[1],
    loserName: m[4],
  }
}

export function resultFromCopy(cardId) {
  const c = COPY[cardId]
  const m = metaById.get(cardId)
  if (!c || !m) throw new Error(`missing copy/meta for ${cardId}`)

  const wPill = parsePill(c.winnerPill)
  const lPill = parsePill(c.loserPill)
  const scores = scoreFromScoreline(c.scoreline)
  const ov = DISPLAY_OVERRIDE[cardId] ?? {}

  const winnerDisplay = ov.winner ?? wPill.name
  const loserDisplay = lPill.name

  const winnerPoints = scores?.winnerPts ?? m.winnerPointsDisplay
  const loserPoints = scores?.loserPts ?? m.loserPointsDisplay

  return {
    week: c.week,
    matchupNum: m.matchupNum,
    headline: c.finalLine,
    winner: m.winner,
    loser: m.loser,
    winnerDisplay,
    loserDisplay,
    winnerRecord: wPill.record,
    loserRecord: lPill.record,
    winnerPoints: parseFloat(winnerPoints),
    loserPoints: parseFloat(loserPoints),
    winnerPointsDisplay: winnerPoints,
    loserPointsDisplay: loserPoints,
    bowlTitle: c.midTitle,
    tagline: c.tagline ?? m.tagline ?? '',
    caption: c.caption ?? m.caption ?? '',
  }
}
