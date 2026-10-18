/**
 * Re-fetch Sleeper Week 5 and assert scores, records, and jersey targets.
 * Exits non-zero on mismatch (run in CI / before render).
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadWeekMatchupFacts } from './lib/sleeper-week-facts.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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

  const resultsJson = JSON.parse(
    readFileSync(path.join(__dirname, 'w5-result-cards/results.json'), 'utf8'),
  )
  for (const r of resultsJson) {
    if (!r.headline?.startsWith('FINAL: ') || !r.headline.endsWith(' TAKES IT')) {
      errors.push(`${r.id} headline format: ${r.headline}`)
    }
    if (r.headline !== `FINAL: ${r.winner.toUpperCase()} TAKES IT`) {
      errors.push(`${r.id} headline must be all-caps winner: ${r.headline}`)
    }
    if (r.id === 'results-w5-m1' && !r.tagline.startsWith('Lamar vs ')) {
      errors.push(`m1 tagline must start with Lamar vs: ${r.tagline}`)
    }
    if (r.tagline.includes('Stroud') && r.id === 'results-w5-m1') {
      errors.push(`m1 tagline must not reference Stroud: ${r.tagline}`)
    }
  }

  const reportPath = path.join(__dirname, 'w5-report-deck/report-data.json')
  try {
    const reportRaw = readFileSync(reportPath, 'utf8')
    const report = JSON.parse(reportRaw)
    const { reportFacts, ordered } = report
    const hady = results.find((r) => r.winner === 'Hady')
    const narking = results.find((r) => r.loser === 'Narking')
    const margins = results
      .map((r) => r.winnerPoints - r.loserPoints)
      .sort((a, b) => a - b)
    if (!approx(reportFacts.highScore, hady.winnerPoints)) {
      errors.push(`report highScore ${reportFacts.highScore} !== ${hady.winnerPoints}`)
    }
    if (!approx(reportFacts.lowScore, narking.loserPoints)) {
      errors.push(`report lowScore ${reportFacts.lowScore} !== ${narking.loserPoints}`)
    }
    if (!approx(reportFacts.closestMargin, margins[0])) {
      errors.push(`report closestMargin ${reportFacts.closestMargin} !== ${margins[0]}`)
    }
    if (!approx(reportFacts.blowoutMargin, margins[margins.length - 1])) {
      errors.push(
        `report blowoutMargin ${reportFacts.blowoutMargin} !== ${margins[margins.length - 1]}`,
      )
    }
    if (!approx(reportFacts.topBench, 45.19)) {
      errors.push(`report topBench (Jordan Love) must be 45.19, got ${reportFacts.topBench}`)
    }
    if (!approx(reportFacts.topBenchBurrow, 40.73)) {
      errors.push(`report Frankie bench Burrow must be 40.73, got ${reportFacts.topBenchBurrow}`)
    }
    if (!approx(reportFacts.frankieStarterQbPts, 39.26)) {
      errors.push(
        `report Frankie starter QB (Goff) must be 39.26, got ${reportFacts.frankieStarterQbPts}`,
      )
    }
    const slide08 = ordered?.find((s) => s.id === 'w5-slide-08')
    const slide14 = ordered?.find((s) => s.id === 'w5-slide-14')
    const loveSub = slide08?.statBoxes?.[0]?.sub ?? ''
    if (!loveSub.startsWith('45.19')) {
      errors.push(`w5-slide-08 top bench must show 45.19, got ${loveSub}`)
    }
    const slide08Body = slide08?.body ?? []
    const loveLine = `Eric left Jordan Love's 45.19 on the bench and still won.`
    const burrowLine = `Frankie sat Joe Burrow's 40.73. It wouldn't have saved him.`
    if (slide08Body[0] !== loveLine || slide08Body[1] !== burrowLine) {
      errors.push(`w5-slide-08 body copy mismatch: ${JSON.stringify(slide08Body)}`)
    }
    if (String(reportRaw).includes('49.16')) {
      errors.push('report-data.json must not contain incorrect 49.16 bench score')
    }
    const goffBox = slide14?.statBoxes?.[1]
    if (goffBox?.value !== '39.26' || goffBox?.sub !== 'FRANKIE starter') {
      errors.push(
        `w5-slide-14 Goff box must be 39.26 / FRANKIE starter, got ${JSON.stringify(goffBox)}`,
      )
    }
    const forbidden = /website|receipt|AI Hady|spelling|export cleanly|build process/i
    if (forbidden.test(reportRaw)) {
      errors.push('report-data.json contains forbidden meta/build copy')
    }
  } catch (e) {
    errors.push(`report-data.json: ${e.message}`)
  }

  if (errors.length) {
    console.error('Week 5 Sleeper assertions FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'))
    process.exit(1)
  }
  console.log('Week 5 Sleeper assertions OK (%d matchups)', results.length)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
