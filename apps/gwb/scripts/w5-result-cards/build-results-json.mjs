import { writeFileSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadWeekMatchupFacts } from '../lib/sleeper-week-facts.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const vsMeta = JSON.parse(
  readFileSync(path.join(__dirname, '../w5-matchup-cards/matchups.json'), 'utf8'),
)

const { results } = await loadWeekMatchupFacts(5)
const byNum = new Map(vsMeta.map((m) => [m.matchupNum, m]))

const out = results.map((r) => {
  const vs = byNum.get(r.matchupNum)
  const headline =
    r.winner === 'Hady'
      ? 'FINAL: Hady TAKES IT'
      : `FINAL: ${r.winner.toUpperCase()} TAKES IT`
  return {
    ...r,
    headline,
    bowlTitle: vs?.title ?? `WEEK 5 • MATCH ${r.matchupNum}`,
    tagline: vs?.tagline ?? '',
    winnerPointsDisplay: r.winnerPoints.toFixed(1),
    loserPointsDisplay: r.loserPoints.toFixed(1),
  }
})

writeFileSync(path.join(__dirname, 'results.json'), JSON.stringify(out, null, 2))
console.log('wrote results.json', out.length, 'cards')
