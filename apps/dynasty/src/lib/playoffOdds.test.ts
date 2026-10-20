import { describe, expect, it } from 'vitest'
import {
  MIN_SCORE_SD,
  computePlayoffOdds,
  simulationScoreSd,
} from './playoffOdds'
import type { SleeperMatchup, StandingRow } from './types'

function matchup(rosterId: number, matchupId: number, points = 0): SleeperMatchup {
  return {
    roster_id: rosterId,
    matchup_id: matchupId,
    points,
    starters: [],
    starters_points: [],
    players_points: {},
  }
}

function standing(
  rosterId: number,
  wins: number,
  losses: number,
  pointsFor: number,
): StandingRow {
  return {
    rank: rosterId,
    rosterId,
    teamName: `Team ${rosterId}`,
    displayName: `mgr${rosterId}`,
    wins,
    losses,
    ties: 0,
    pointsFor,
    pointsAgainst: 0,
    streak: '',
  }
}

/** Circle schedule so each team plays once per week. */
function scheduleWeeks(
  teamIds: number[],
  fromWeek: number,
  toWeek: number,
): Map<number, SleeperMatchup[]> {
  const map = new Map<number, SleeperMatchup[]>()
  const fixed = teamIds[0]
  let rotating = teamIds.slice(1)
  const n = teamIds.length
  for (let week = fromWeek; week <= toWeek; week++) {
    const round = [fixed, ...rotating]
    const rows: SleeperMatchup[] = []
    for (let i = 0; i < n / 2; i++) {
      rows.push(
        matchup(round[i], i + 1),
        matchup(round[n - 1 - i], i + 1),
      )
    }
    map.set(week, rows)
    rotating = [rotating[rotating.length - 1], ...rotating.slice(0, -1)]
  }
  return map
}

describe('simulationScoreSd', () => {
  it('uses the league SD when a team has few games', () => {
    expect(simulationScoreSd([100, 100.2], 28)).toBe(28)
    expect(simulationScoreSd([100], 0)).toBe(MIN_SCORE_SD)
  })

  it('uses the team SD once there are enough weeks, with a floor', () => {
    const varied = [90, 110, 80, 130, 100, 120]
    const sd = simulationScoreSd(varied, 8)
    expect(sd).toBeGreaterThan(MIN_SCORE_SD)
    expect(simulationScoreSd([100, 100, 100, 100.1], 40)).toBe(MIN_SCORE_SD)
  })
})

describe('computePlayoffOdds', () => {
  it('keeps current seeding when no games remain', () => {
    const standings = [1, 2, 3, 4, 5, 6, 7, 8].map((id, i) =>
      standing(id, 8 - i, i, 1000 - i),
    )
    const rows = computePlayoffOdds({
      standings,
      matchupsByWeek: new Map(),
      throughWeek: 14,
      playoffTeams: 6,
      regularSeasonLastWeek: 14,
      simulations: 50,
    })
    for (const row of rows) {
      expect(row.playoffPct).toBe(row.rosterId <= 6 ? 1 : 0)
    }
  })

  it('gives 2-4 teams a real chance with eight games left', () => {
    const ids = Array.from({ length: 12 }, (_, i) => i + 1)
    // Week-6 shape: two 5-1s, four 4-2s, four 2-4s, two 1-5s, with real score spreads.
    const profiles: Record<number, { mean: number; sd: number; wins: number; losses: number }> = {
      1: { mean: 135.2, sd: 28.4, wins: 5, losses: 1 },
      2: { mean: 148.0, sd: 22.8, wins: 4, losses: 2 },
      3: { mean: 139.5, sd: 19.4, wins: 5, losses: 1 },
      4: { mean: 134.8, sd: 31.3, wins: 4, losses: 2 },
      5: { mean: 129.8, sd: 11.2, wins: 4, losses: 2 },
      6: { mean: 127.7, sd: 30.3, wins: 4, losses: 2 },
      7: { mean: 121.5, sd: 35.7, wins: 2, losses: 4 },
      8: { mean: 119.3, sd: 38.0, wins: 2, losses: 4 },
      9: { mean: 116.8, sd: 18.7, wins: 2, losses: 4 },
      10: { mean: 110.9, sd: 23.8, wins: 2, losses: 4 },
      11: { mean: 122.2, sd: 17.3, wins: 1, losses: 5 },
      12: { mean: 115.9, sd: 14.0, wins: 1, losses: 5 },
    }
    const offsets = [-30, -10, 0, 5, 15, 20]
    const offsetSd = Math.sqrt(
      offsets.reduce((sum, n) => sum + n * n, 0) / (offsets.length - 1),
    )
    const past = scheduleWeeks(ids, 1, 6)
    for (let week = 1; week <= 6; week++) {
      for (const row of past.get(week) ?? []) {
        const profile = profiles[row.roster_id]
        row.points = profile.mean + offsets[week - 1] * (profile.sd / offsetSd)
      }
    }
    const future = scheduleWeeks(ids, 7, 14)
    const matchupsByWeek = new Map<number, SleeperMatchup[]>([...past, ...future])
    const standings = ids.map((id) =>
      standing(id, profiles[id].wins, profiles[id].losses, profiles[id].mean * 6),
    )
    const rows = computePlayoffOdds({
      standings,
      matchupsByWeek,
      throughWeek: 6,
      playoffTeams: 6,
      regularSeasonLastWeek: 14,
    })
    const byId = new Map(rows.map((r) => [r.rosterId, r.playoffPct]))
    const sum = rows.reduce((s, r) => s + r.playoffPct, 0)
    expect(sum).toBeCloseTo(6, 5)
    const distinct = new Set(rows.map((r) => Math.round(r.playoffPct * 100)))
    expect(distinct.size).toBeGreaterThan(4)
    const bubble = [7, 8, 9, 10].map((id) => byId.get(id) ?? 0)
    for (const pct of bubble) {
      expect(pct).toBeGreaterThan(0)
      expect(pct).toBeLessThan(0.9)
    }
    expect(Math.max(...bubble)).toBeGreaterThan(0.1)
    expect(byId.get(2) ?? 0).toBeGreaterThan(byId.get(10) ?? 1)
  })

  it('splits one remaining game between equal teams', () => {
    const scores = [80, 120, 90, 110]
    const past = new Map<number, SleeperMatchup[]>()
    for (let week = 1; week <= scores.length; week++) {
      past.set(week, [
        matchup(1, 1, scores[week - 1]),
        matchup(2, 1, scores[week - 1]),
      ])
    }
    past.set(5, [matchup(1, 1, 0), matchup(2, 1, 0)])
    const rows = computePlayoffOdds({
      standings: [standing(1, 2, 2, 400), standing(2, 2, 2, 400)],
      matchupsByWeek: past,
      throughWeek: 4,
      playoffTeams: 1,
      regularSeasonLastWeek: 5,
      simulations: 2000,
    })
    for (const row of rows) {
      expect(row.playoffPct).toBeGreaterThan(0.35)
      expect(row.playoffPct).toBeLessThan(0.65)
    }
  })

  it('stays at 0% when a team is mathematically eliminated', () => {
    const ids = [1, 2, 3, 4, 5, 6, 7]
    const future = scheduleWeeks(
      ids.length % 2 === 0 ? ids : [...ids, 8],
      14,
      14,
    )
    const standings = [
      ...[1, 2, 3, 4, 5, 6].map((id) => standing(id, 12, 1, 1500 - id)),
      standing(7, 0, 13, 900),
      standing(8, 6, 7, 1100),
    ]
    const rows = computePlayoffOdds({
      standings,
      matchupsByWeek: future,
      throughWeek: 13,
      playoffTeams: 6,
      regularSeasonLastWeek: 14,
      simulations: 200,
    })
    expect(rows.find((r) => r.rosterId === 7)?.playoffPct).toBe(0)
    expect(rows.find((r) => r.rosterId === 1)?.playoffPct).toBe(1)
  })
})
