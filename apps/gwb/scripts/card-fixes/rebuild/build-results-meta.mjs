/**
 * Build results-w1..w3 meta for HTML rebuild (scores/records from Sleeper + copy overrides).
 */
import { writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadWeekMatchupFacts } from '../../lib/sleeper-week-facts.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'results-meta.json')
const OVERRIDES = JSON.parse(
  await readFile(path.join(__dirname, 'results-copy-overrides.json'), 'utf8'),
)
const HEADLINES = JSON.parse(
  await readFile(path.join(__dirname, '../../../src/content/slide-headlines.json'), 'utf8'),
)

const W4_TITLES = JSON.parse(
  await readFile(path.join(__dirname, '../w4-preview-cards/matchups.json'), 'utf8'),
)

function lastName(full) {
  if (!full) return ''
  const parts = String(full).trim().split(/\s+/)
  return parts[parts.length - 1] ?? full
}

function displayManager(name) {
  if (name === 'Hady') return 'HADY'
  return name.toUpperCase() === name ? name : name
}

function buildTagline(r) {
  const wLast = lastName(r.winnerJersey.name)
  const lLast = lastName(r.loserJersey.name)
  const top = r.winnerTopScorer
  const topLast = lastName(top.name)
  const pts = top.points?.toFixed?.(1) ?? ''
  if (r.winner === 'Crooke') {
    return `Lamar vs ${lLast} • ${topLast} ${pts}`
  }
  return `${wLast} vs ${lLast} • ${topLast} ${pts}`
}

function bowlTitleFor(week, matchupNum) {
  if (week === 4) {
    const row = W4_TITLES.find((m) => m.matchupNum === matchupNum)
    if (row) return row.title
  }
  return `WEEK ${week} • MATCH ${matchupNum}`
}

const TOUCHED = new Set([
  ...[1, 2, 3, 4, 5, 6].map((m) => `results-w1-m${m}`),
  ...[2, 3, 4, 5, 6].map((m) => `results-w2-m${m}`),
  ...[1, 2, 3, 4, 5].map((m) => `results-w3-m${m}`),
])

const all = []
for (const week of [1, 2, 3]) {
  const { results } = await loadWeekMatchupFacts(week)
  for (const r of results) {
    if (!TOUCHED.has(r.id)) continue
    const ov = OVERRIDES[r.id] ?? {}
    const headline = HEADLINES[r.id] ?? `FINAL: ${displayManager(r.winner).toUpperCase()} TAKES IT`
    all.push({
      ...r,
      week,
      headline: headline.replace(/\bHady\b/g, 'HADY'),
      winnerDisplay: displayManager(r.winner),
      loserDisplay: displayManager(r.loser),
      winnerPointsDisplay: r.winnerPoints.toFixed(1),
      loserPointsDisplay: r.loserPoints.toFixed(1),
      bowlTitle: ov.bowlTitle ?? bowlTitleFor(week, r.matchupNum),
      tagline: ov.tagline ?? buildTagline(r),
      caption: ov.caption ?? '',
    })
  }
}

await writeFile(OUT, JSON.stringify(all, null, 2) + '\n')
console.log('wrote', OUT, all.length, 'results')
