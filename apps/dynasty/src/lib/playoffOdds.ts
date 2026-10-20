import { groupMatchupPairs } from './matchupBoard'
import type { SleeperMatchup, StandingRow } from './types'

export const PLAYOFF_ODDS_METHOD_NOTE =
  'Estimate: remaining regular-season matchups simulated 2,000×. Each weekly score is drawn from a normal distribution using that team’s average and the standard deviation of its scores so far (league-wide SD when a team has few games, never below a minimum SD). Top six by wins, then points for, make playoffs.'

/** Teams with fewer scored weeks than this use the league-wide SD. */
export const MIN_WEEKS_FOR_TEAM_SD = 3

/** Weekly fantasy scores move by more than a few points; keep a floor so a flat sample cannot lock 100/0. */
export const MIN_SCORE_SD = 15

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

/** Sample standard deviation (n − 1). Returns 0 when a spread cannot be estimated. */
export function sampleStdDev(values: number[]): number {
  if (values.length < 2) return 0
  const mean = values.reduce((sum, n) => sum + n, 0) / values.length
  const variance =
    values.reduce((sum, n) => sum + (n - mean) ** 2, 0) / (values.length - 1)
  return Math.sqrt(variance)
}

/** Completed weekly scores through `throughWeek`, keyed by roster. Skips byes. */
export function weeklyScoresByRoster(
  matchupsByWeek: Map<number, SleeperMatchup[]>,
  throughWeek: number,
): Map<number, number[]> {
  const scores = new Map<number, number[]>()
  for (let week = 1; week <= throughWeek; week++) {
    const rows = matchupsByWeek.get(week)
    if (!rows?.length) continue
    for (const row of rows) {
      if (row.matchup_id == null || !Number.isFinite(row.points)) continue
      const list = scores.get(row.roster_id) ?? []
      list.push(row.points)
      scores.set(row.roster_id, list)
    }
  }
  return scores
}

export function leagueWeeklyScoreSd(scoresByRoster: Map<number, number[]>): number {
  const all: number[] = []
  for (const scores of scoresByRoster.values()) all.push(...scores)
  return sampleStdDev(all)
}

/**
 * SD for one future weekly score.
 * Few games → league-wide SD. Otherwise the team's own SD.
 * Both paths stay at or above {@link MIN_SCORE_SD}.
 */
export function simulationScoreSd(teamScores: number[], leagueSd: number): number {
  const leagueFloor = leagueSd > 0 ? leagueSd : MIN_SCORE_SD
  if (teamScores.length < MIN_WEEKS_FOR_TEAM_SD) {
    return Math.max(leagueFloor, MIN_SCORE_SD)
  }
  return Math.max(sampleStdDev(teamScores), MIN_SCORE_SD)
}

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

/** Standard normal sample (Box–Muller). */
export function sampleStandardNormal(rng: () => number): number {
  const u1 = Math.max(rng(), Number.EPSILON)
  const u2 = rng()
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

function sampleWeeklyScore(mean: number, sd: number, rng: () => number): number {
  return Math.max(0, mean + sampleStandardNormal(rng) * sd)
}

function simulateWeekScores(
  pairs: {
    home: number
    away: number
    homeMean: number
    awayMean: number
    homeSd: number
    awaySd: number
  }[],
  rng: () => number,
): Map<number, { w: number; l: number; pf: number }> {
  const delta = new Map<number, { w: number; l: number; pf: number }>()
  for (const p of pairs) {
    const homeScore = sampleWeeklyScore(p.homeMean, p.homeSd, rng)
    const awayScore = sampleWeeklyScore(p.awayMean, p.awaySd, rng)
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
  const scoresByRoster = weeklyScoresByRoster(matchupsByWeek, throughWeek)
  const leagueSd = leagueWeeklyScoreSd(scoresByRoster)
  const model = new Map<number, { mean: number; sd: number }>()
  for (const row of standings) {
    const scores = scoresByRoster.get(row.rosterId) ?? []
    const played = row.wins + row.losses + row.ties
    const mean = scores.length
      ? scores.reduce((sum, n) => sum + n, 0) / scores.length
      : avgPointsPerGame(row, Math.max(1, played > 0 ? played : gamesPlayed))
    model.set(row.rosterId, {
      mean,
      sd: simulationScoreSd(scores, leagueSd),
    })
  }

  const futurePairs: {
    home: number
    away: number
    homeMean: number
    awayMean: number
    homeSd: number
    awaySd: number
  }[] = []
  for (let week = throughWeek + 1; week <= regularSeasonLastWeek; week++) {
    const rows = matchupsByWeek.get(week)
    if (!rows?.length) continue
    for (const { home, away } of groupMatchupPairs(rows)) {
      const homeModel = model.get(home.roster_id)
      const awayModel = model.get(away.roster_id)
      futurePairs.push({
        home: home.roster_id,
        away: away.roster_id,
        homeMean: homeModel?.mean ?? 100,
        awayMean: awayModel?.mean ?? 100,
        homeSd: homeModel?.sd ?? Math.max(leagueSd, MIN_SCORE_SD),
        awaySd: awayModel?.sd ?? Math.max(leagueSd, MIN_SCORE_SD),
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
