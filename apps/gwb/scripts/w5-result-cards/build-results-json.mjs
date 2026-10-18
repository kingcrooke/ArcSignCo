import { writeFileSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadWeekMatchupFacts } from '../lib/sleeper-week-facts.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const vsMeta = JSON.parse(
  readFileSync(path.join(__dirname, '../w5-matchup-cards/matchups.json'), 'utf8'),
)

function lastName(full) {
  if (!full) return ''
  const parts = String(full).trim().split(/\s+/)
  return parts[parts.length - 1] ?? full
}

function buildTagline(r, matchRow, players) {
  const wQb = matchRow.starters?.[0]
    ? players[matchRow.starters[0]]
    : null
  const lQb = r.loserStartingQb
  const wTop = r.winnerTopScorer

  if (r.winner === 'Crooke') {
    return `Lamar vs ${lastName(r.loserStartingQb.name)} • ${r.loser}'s first loss of the season`
  }

  const wQbName =
    r.winner === 'Crooke'
      ? 'Lamar'
      : lastName(wQb?.full_name ?? r.winnerJersey.name)
  const lQbName = lastName(lQb.name)

  if (r.id === 'results-w5-m2') {
    return `${wQbName} vs ${lQbName} • ${lastName(wTop.name)} ${wTop.points.toFixed(1)}`
  }
  if (r.id === 'results-w5-m6') {
    return `${wQbName} vs ${lQbName} • ${lastName(wTop.name)} ${wTop.points.toFixed(1)}`
  }
  return `${wQbName} vs ${lQbName} • ${lastName(wTop.name)} ${wTop.points.toFixed(1)} pts`
}

const { results, matchups, players } = await loadWeekMatchupFacts(5)
const byNum = new Map(vsMeta.map((m) => [m.matchupNum, m]))
const matchByRoster = new Map()
for (const m of matchups) matchByRoster.set(m.roster_id, m)

const rosterIdByManager = {
  Danny: 1,
  Mauricio: 2,
  Narking: 3,
  Kayser: 4,
  Eric: 5,
  Hady: 6,
  Steven: 7,
  Crooke: 8,
  Manny: 9,
  Jamil: 10,
  Frankie: 11,
  Matt: 12,
}

const out = results.map((r) => {
  const vs = byNum.get(r.matchupNum)
  const winRoster = rosterIdByManager[r.winner]
  const matchRow = matchByRoster.get(winRoster)
  const headline = `FINAL: ${r.winner.toUpperCase()} TAKES IT`
  return {
    ...r,
    headline,
    bowlTitle: vs?.title ?? `WEEK 5 • MATCH ${r.matchupNum}`,
    tagline: buildTagline(r, matchRow, players),
    winnerPointsDisplay: r.winnerPoints.toFixed(1),
    loserPointsDisplay: r.loserPoints.toFixed(1),
  }
})

writeFileSync(path.join(__dirname, 'results.json'), JSON.stringify(out, null, 2))
writeFileSync(
  path.join(__dirname, 'taglines.json'),
  JSON.stringify(out.map((r) => ({ id: r.id, tagline: r.tagline })), null, 2),
)
console.log('wrote results.json', out.length, 'cards')
