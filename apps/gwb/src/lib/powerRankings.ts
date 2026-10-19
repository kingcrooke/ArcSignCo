import { computeAllPlayThroughWeek, formatAllPlayRecord } from './allPlay'
import { computeStandingsThroughWeek } from './standings'
import type { SleeperMatchup, StandingRow, TeamInfo } from './types'

export const POWER_RANKINGS_METHOD_NOTE =
  '40% all-play record, 25% actual record, 20% points per game, 15% last-3-weeks scoring. Updated after each week is final.'

export interface PowerRankingRow {
  rosterId: number
  displayName: string
  teamName: string
  rank: number
  prevRank: number | null
  movement: number | null
  score: number
  wins: number
  losses: number
  ties: number
  allPlayPct: number
  allPlayLabel: string
  winPct: number
  ppg: number
  last3Ppg: number
  pointsFor: number
}

function pct(wins: number, losses: number, ties: number): number {
  const games = wins + losses + ties
  if (games <= 0) return 0
  return (wins + ties * 0.5) / games
}

function minMaxNorm(value: number, min: number, max: number): number {
  if (max <= min) return 1
  return (value - min) / (max - min)
}

function meanWeeklyPoints(
  rosterId: number,
  matchupsByWeek: Map<number, SleeperMatchup[]>,
  fromWeek: number,
  throughWeek: number,
): number {
  let total = 0
  let weeks = 0
  for (let w = fromWeek; w <= throughWeek; w++) {
    const matchups = matchupsByWeek.get(w)
    const row = matchups?.find((m) => m.roster_id === rosterId)
    if (!row) continue
    total += row.points
    weeks += 1
  }
  return weeks > 0 ? total / weeks : 0
}

function buildTable(
  standings: StandingRow[],
  matchupsByWeek: Map<number, SleeperMatchup[]>,
  throughWeek: number,
): PowerRankingRow[] {
  if (throughWeek <= 0 || standings.length === 0) return []

  const allPlay = computeAllPlayThroughWeek(matchupsByWeek, throughWeek)
  const last3From = Math.max(1, throughWeek - 2)

  const raw = standings.map((row) => {
    const games = row.wins + row.losses + row.ties
    const ap = allPlay.get(row.rosterId) ?? { wins: 0, losses: 0, ties: 0 }
    const ppg = games > 0 ? row.pointsFor / games : 0
    const last3Ppg = meanWeeklyPoints(
      row.rosterId,
      matchupsByWeek,
      last3From,
      throughWeek,
    )
    return {
      rosterId: row.rosterId,
      displayName: row.displayName,
      teamName: row.teamName,
      wins: row.wins,
      losses: row.losses,
      ties: row.ties,
      pointsFor: row.pointsFor,
      allPlayPct: pct(ap.wins, ap.losses, ap.ties),
      allPlayLabel: formatAllPlayRecord(ap),
      winPct: pct(row.wins, row.losses, row.ties),
      ppg,
      last3Ppg,
    }
  })

  const ppgs = raw.map((r) => r.ppg)
  const last3s = raw.map((r) => r.last3Ppg)
  const ppgMin = Math.min(...ppgs)
  const ppgMax = Math.max(...ppgs)
  const l3Min = Math.min(...last3s)
  const l3Max = Math.max(...last3s)

  const scored = raw.map((r) => {
    const composite =
      0.4 * r.allPlayPct +
      0.25 * r.winPct +
      0.2 * minMaxNorm(r.ppg, ppgMin, ppgMax) +
      0.15 * minMaxNorm(r.last3Ppg, l3Min, l3Max)
    return {
      ...r,
      score: composite * 100,
    }
  })

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return b.pointsFor - a.pointsFor
  })

  return scored.map((r, i) => ({
    rosterId: r.rosterId,
    displayName: r.displayName,
    teamName: r.teamName,
    rank: i + 1,
    prevRank: null,
    movement: null,
    score: r.score,
    wins: r.wins,
    losses: r.losses,
    ties: r.ties,
    allPlayPct: r.allPlayPct,
    allPlayLabel: r.allPlayLabel,
    winPct: r.winPct,
    ppg: r.ppg,
    last3Ppg: r.last3Ppg,
    pointsFor: r.pointsFor,
  }))
}

function attachMovement(
  current: PowerRankingRow[],
  previous: PowerRankingRow[],
): PowerRankingRow[] {
  const prevRank = new Map(previous.map((r) => [r.rosterId, r.rank]))
  return current.map((r) => {
    const pr = prevRank.get(r.rosterId) ?? null
    const movement = pr != null ? pr - r.rank : null
    return { ...r, prevRank: pr, movement }
  })
}

export function computePowerRankings({
  matchupsByWeek,
  teams,
  throughWeek,
}: {
  matchupsByWeek: Map<number, SleeperMatchup[]>
  teams: Map<number, TeamInfo>
  throughWeek: number
}): PowerRankingRow[] {
  const standings = computeStandingsThroughWeek(
    matchupsByWeek,
    teams,
    throughWeek,
  )
  const current = buildTable(standings, matchupsByWeek, throughWeek)
  if (throughWeek <= 1) return current
  const prevStandings = computeStandingsThroughWeek(
    matchupsByWeek,
    teams,
    throughWeek - 1,
  )
  const previous = buildTable(prevStandings, matchupsByWeek, throughWeek - 1)
  return attachMovement(current, previous)
}
