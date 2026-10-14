import { groupMatchupPairs } from './matchupBoard'
import type { SleeperMatchup, StandingRow } from './types'

export const PLAYOFF_ODDS_METHOD_NOTE =
  'Estimate: each remaining scheduled matchup simulated 2,000× on the real Sleeper schedule. Win chance blends points-per-game (55%) with record so far (45%); playoff seeding uses projected wins, with season points for as the tiebreaker. Top six make playoffs.'

export interface PlayoffOddsRow {
  rosterId: number
  displayName: string
  teamName: string
  wins: number
  losses: number
  pointsFor: number
  playoffPct: number
}

function avgPointsPerGame(row: StandingRow, gamesPlayed: number): number {
  if (gamesPlayed <= 0) return row.pointsFor
  return row.pointsFor / gamesPlayed
}

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

function winRate(row: StandingRow): number {
  const games = row.wins + row.losses + row.ties
  if (games <= 0) return 0.5
  return (row.wins + row.ties * 0.5) / games
}

function logisticWinProb(scoreDiff: number, scale: number): number {
  return 1 / (1 + Math.pow(10, -scoreDiff / scale))
}

function matchupHomeWinProb(
  home: StandingRow,
  away: StandingRow,
  homePpg: number,
  awayPpg: number,
): number {
  const byPpg = logisticWinProb(homePpg - awayPpg, 22)
  const byRecord = logisticWinProb((winRate(home) - winRate(away)) * 100, 18)
  return byPpg * 0.55 + byRecord * 0.45
}

function simulateWeekOutcomes(
  pairs: {
    home: number
    away: number
    homePpg: number
    awayPpg: number
    homeRow: StandingRow
    awayRow: StandingRow
  }[],
  rng: () => number,
): Map<number, { w: number; l: number; pf: number }> {
  const delta = new Map<number, { w: number; l: number; pf: number }>()
  for (const p of pairs) {
    const homeWinP = matchupHomeWinProb(
      p.homeRow,
      p.awayRow,
      p.homePpg,
      p.awayPpg,
    )
    const homeWins = rng() < homeWinP
    const noiseH = (rng() - 0.5) * 18
    const noiseA = (rng() - 0.5) * 18
    const homeScore = Math.max(0, p.homePpg + noiseH)
    const awayScore = Math.max(0, p.awayPpg + noiseA)
    const bump = (rid: number, w: number, l: number, pf: number) => {
      const cur = delta.get(rid) ?? { w: 0, l: 0, pf: 0 }
      delta.set(rid, { w: cur.w + w, l: cur.l + l, pf: cur.pf + pf })
    }
    if (homeWins) {
      bump(p.home, 1, 0, homeScore)
      bump(p.away, 0, 1, awayScore)
    } else {
      bump(p.away, 1, 0, awayScore)
      bump(p.home, 0, 1, homeScore)
    }
  }
  return delta
}

function rankForPlayoffs(
  rows: { rosterId: number; wins: number; pf: number }[],
): number[] {
  const sorted = [...rows].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins
    return b.pf - a.pf
  })
  return sorted.map((r) => r.rosterId)
}

export function computePlayoffOdds({
  standings,
  matchupsByWeek,
  throughWeek,
  playoffTeams,
  regularSeasonLastWeek,
  simulations = 2000,
}: {
  standings: StandingRow[]
  matchupsByWeek: Map<number, SleeperMatchup[]>
  throughWeek: number
  playoffTeams: number
  regularSeasonLastWeek: number
  simulations?: number
}): PlayoffOddsRow[] {
  const ppg = new Map<number, number>()
  for (const row of standings) {
    const gamesPlayed = Math.max(1, row.wins + row.losses + row.ties)
    ppg.set(row.rosterId, avgPointsPerGame(row, gamesPlayed))
  }

  const standingByRoster = new Map(standings.map((r) => [r.rosterId, r]))
  const futurePairs: {
    home: number
    away: number
    homePpg: number
    awayPpg: number
    homeRow: StandingRow
    awayRow: StandingRow
  }[] = []
  for (let week = throughWeek + 1; week <= regularSeasonLastWeek; week++) {
    const rows = matchupsByWeek.get(week)
    if (!rows?.length) continue
    for (const { home, away } of groupMatchupPairs(rows)) {
      const homeRow = standingByRoster.get(home.roster_id)
      const awayRow = standingByRoster.get(away.roster_id)
      if (!homeRow || !awayRow) continue
      futurePairs.push({
        home: home.roster_id,
        away: away.roster_id,
        homePpg: ppg.get(home.roster_id) ?? 100,
        awayPpg: ppg.get(away.roster_id) ?? 100,
        homeRow,
        awayRow,
      })
    }
  }

  const madePlayoffs = new Map<number, number>()
  for (const row of standings) madePlayoffs.set(row.rosterId, 0)

  for (let sim = 0; sim < simulations; sim++) {
    const rng = seededRandom(1000 + sim)
    const totals = new Map<number, { wins: number; losses: number; pf: number }>()
    for (const row of standings) {
      totals.set(row.rosterId, {
        wins: row.wins,
        losses: row.losses,
        pf: row.pointsFor,
      })
    }
    const weekDelta = simulateWeekOutcomes(futurePairs, rng)
    for (const [rid, d] of weekDelta) {
      const t = totals.get(rid)
      if (!t) continue
      t.wins += d.w
      t.losses += d.l
      t.pf += d.pf
    }
    const ranked = rankForPlayoffs(
      standings.map((r) => {
        const t = totals.get(r.rosterId)!
        return { rosterId: r.rosterId, wins: t.wins, pf: r.pointsFor }
      }),
    )
    const playoffSet = new Set(ranked.slice(0, playoffTeams))
    for (const rid of playoffSet) {
      madePlayoffs.set(rid, (madePlayoffs.get(rid) ?? 0) + 1)
    }
  }

  return standings.map((row) => ({
    rosterId: row.rosterId,
    displayName: row.displayName,
    teamName: row.teamName,
    wins: row.wins,
    losses: row.losses,
    pointsFor: row.pointsFor,
    playoffPct: (madePlayoffs.get(row.rosterId) ?? 0) / simulations,
  }))
}
