import { groupMatchupPairs } from './matchupBoard'
import type { SleeperMatchup, StandingRow } from './types'

export const PLAYOFF_ODDS_METHOD_NOTE =
  'Estimate: remaining regular-season matchups simulated 2,000× using each team’s average points per game so far; top six by wins (then points for) make playoffs.'

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

function simulateWeekScores(
  pairs: { home: number; away: number; homePpg: number; awayPpg: number }[],
  rng: () => number,
): Map<number, { w: number; l: number; pf: number }> {
  const delta = new Map<number, { w: number; l: number; pf: number }>()
  for (const p of pairs) {
    const noiseH = (rng() - 0.5) * 24
    const noiseA = (rng() - 0.5) * 24
    const homeScore = Math.max(0, p.homePpg + noiseH)
    const awayScore = Math.max(0, p.awayPpg + noiseA)
    const bump = (rid: number, w: number, l: number, pf: number) => {
      const cur = delta.get(rid) ?? { w: 0, l: 0, pf: 0 }
      delta.set(rid, { w: cur.w + w, l: cur.l + l, pf: cur.pf + pf })
    }
    if (homeScore > awayScore) {
      bump(p.home, 1, 0, homeScore)
      bump(p.away, 0, 1, awayScore)
    } else if (awayScore > homeScore) {
      bump(p.away, 1, 0, awayScore)
      bump(p.home, 0, 1, homeScore)
    } else {
      bump(p.home, 0, 0, homeScore)
      bump(p.away, 0, 0, awayScore)
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
  const gamesPlayed = Math.max(1, throughWeek)
  const ppg = new Map<number, number>()
  for (const row of standings) {
    ppg.set(row.rosterId, avgPointsPerGame(row, gamesPlayed))
  }

  const futurePairs: {
    home: number
    away: number
    homePpg: number
    awayPpg: number
  }[] = []
  for (let week = throughWeek + 1; week <= regularSeasonLastWeek; week++) {
    const rows = matchupsByWeek.get(week)
    if (!rows?.length) continue
    for (const { home, away } of groupMatchupPairs(rows)) {
      futurePairs.push({
        home: home.roster_id,
        away: away.roster_id,
        homePpg: ppg.get(home.roster_id) ?? 100,
        awayPpg: ppg.get(away.roster_id) ?? 100,
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
    const weekDelta = simulateWeekScores(futurePairs, rng)
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
        return { rosterId: r.rosterId, wins: t.wins, pf: t.pf }
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
