/**
 * Re-fetch Sleeper Week 5 and assert scores, records, and jersey targets.
 * Exits non-zero on mismatch (run in CI / before render).
 */
import { loadWeekMatchupFacts } from './lib/sleeper-week-facts.mjs'

/** Commissioner brief jerseys (Sleeper matchup_id order m1–m6). */
const SLEEPER_JERSEYS = {
  'Crooke-Steven': { w: ['Lamar Jackson', 8, 'BAL'], l: ['Sam Darnold', 14, 'SEA'] },
  'Danny-Manny': { w: ['Christian Watson', 9, 'GB'], l: ['Kirk Cousins', 8, 'LV'] },
  'Eric-Narking': { w: ['Dak Prescott', 4, 'DAL'], l: ['Brock Purdy', 13, 'SF'] },
  'Hady-Frankie': { w: ['Drake Maye', 10, 'NE'], l: ['Jared Goff', 16, 'DET'] },
  'Mauricio-Jamil': { w: ['Jaylen Warren', 30, 'PIT'], l: ['Jalen Hurts', 1, 'PHI'] },
  'Matt-Kayser': { w: ['Jahmyr Gibbs', 0, 'DET'], l: ['Matthew Stafford', 9, 'LAR'] },
}

const STANDINGS_AFTER = {
  Hady: '4-1',
  Steven: '4-1',
  Mauricio: '3-2',
  Jamil: '3-2',
  Eric: '3-2',
  Kayser: '3-2',
  Danny: '2-3',
  Manny: '2-3',
  Matt: '2-3',
  Crooke: '2-3',
  Narking: '1-4',
  Frankie: '1-4',
}

function approx(a, b, eps = 0.011) {
  return Math.abs(a - b) <= eps
}

function jerseyMatch(j, [name, num, team]) {
  return j.name === name && j.team === team && Number(j.number) === num
}

async function main() {
  const { results, rosters } = await loadWeekMatchupFacts(5)
  const errors = []

  // Sleeper truth by matchup_id (m1..m6)
  const sleeperByM = new Map(results.map((r) => [r.matchupNum, r]))

  const sleeperExpected = [
    { m: 1, winner: 'Crooke', loser: 'Steven', w: 159.29, l: 120.77 },
    { m: 2, winner: 'Danny', loser: 'Manny', w: 176.78, l: 122.18 },
    { m: 3, winner: 'Eric', loser: 'Narking', w: 145.67, l: 95.86 },
    { m: 4, winner: 'Hady', loser: 'Frankie', w: 212.33, l: 101.06 },
    { m: 5, winner: 'Mauricio', loser: 'Jamil', w: 204.16, l: 143.54 },
    { m: 6, winner: 'Matt', loser: 'Kayser', w: 176.87, l: 150.26 },
  ]

  for (const exp of sleeperExpected) {
    const row = sleeperByM.get(exp.m)
    if (!row) {
      errors.push(`missing matchup ${exp.m}`)
      continue
    }
    if (row.winner !== exp.winner || row.loser !== exp.loser) {
      errors.push(
        `m${exp.m} pairing: got ${row.winner} vs ${row.loser}, expected ${exp.winner} vs ${exp.loser}`,
      )
    }
    if (!approx(row.winnerPoints, exp.w) || !approx(row.loserPoints, exp.l)) {
      errors.push(
        `m${exp.m} scores: got ${row.winnerPoints}-${row.loserPoints}, expected ${exp.w}-${exp.l}`,
      )
    }
  }

  for (const r of results) {
    const key = `${r.winner}-${r.loser}`
    const brief = SLEEPER_JERSEYS[key]
    if (!brief) {
      errors.push(`no jersey brief for Sleeper pair ${key}`)
      continue
    }
    if (!jerseyMatch(r.winnerJersey, brief.w)) {
      errors.push(
        `${key} winner jersey: got ${JSON.stringify(r.winnerJersey)}, expected ${brief.w}`,
      )
    }
    if (!jerseyMatch(r.loserJersey, brief.l)) {
      errors.push(
        `${key} loser jersey: got ${JSON.stringify(r.loserJersey)}, expected ${brief.l}`,
      )
    }
  }

  for (const r of results) {
    const w = STANDINGS_AFTER[r.winner]
    const l = STANDINGS_AFTER[r.loser]
    if (w !== r.winnerRecord) {
      errors.push(`${r.winner} record ${r.winnerRecord} !== standings ${w}`)
    }
    if (l !== r.loserRecord) {
      errors.push(`${r.loser} record ${r.loserRecord} !== standings ${l}`)
    }
  }

  if (errors.length) {
    console.error('Week 5 Sleeper assertions FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'))
    process.exit(1)
  }
  console.log('Week 5 Sleeper assertions OK (%d matchups)', results.length)
  console.log(JSON.stringify(results, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
