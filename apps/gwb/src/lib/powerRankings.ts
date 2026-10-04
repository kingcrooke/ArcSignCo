import { rosterPointsFor } from './teams'
import type { TeamInfo } from './types'
import type {
  PowerRankingRow,
  SleeperMatchup,
  SleeperRoster,
} from './types'

const WEIGHTS = {
  recentForm: 0.3,
  pointsFor: 0.25,
  allPlay: 0.25,
  efficiency: 0.2,
}

export const POWER_RANKING_FORMULA = `GWB Power Score (0–100) = 30% recent form + 25% points-for rate + 25% all-play win% + 20% lineup efficiency.

• Recent form: win% over the last 3 scored weeks (or fewer early in the season).
• Points-for rate: team PF per game vs league average PF per game that week.
• All-play: each week, % of league rosters you would have beaten with that week's score.
• Lineup efficiency: season ratio of actual points scored to optimal lineup (starters chosen from full roster each week using Sleeper matchup player points).`

function weeksForForm(throughWeek: number): number[] {
  const n = Math.min(3, throughWeek)
  return Array.from({ length: n }, (_, i) => throughWeek - i).filter((w) => w >= 1)
}

function headToHeadWinsByWeek(
  matchupsByWeek: Map<number, SleeperMatchup[]>,
): Map<number, Map<number, number>> {
  const result = new Map<number, Map<number, number>>()
  for (const [week, matchups] of matchupsByWeek) {
    const wins = new Map<number, number>()
    for (const m of matchups) {
      const opp = matchups.find(
        (o) => o.matchup_id === m.matchup_id && o.roster_id !== m.roster_id,
      )
      if (!opp) continue
      if (m.points > opp.points) wins.set(m.roster_id, 1)
      else if (m.points < opp.points) wins.set(m.roster_id, 0)
      else wins.set(m.roster_id, 0.5)
    }
    result.set(week, wins)
  }
  return result
}

function allPlayWinPct(
  rosterId: number,
  matchupsByWeek: Map<number, SleeperMatchup[]>,
): number {
  let wins = 0
  let games = 0
  for (const [, matchups] of matchupsByWeek) {
    const me = matchups.find((m) => m.roster_id === rosterId)
    if (!me || me.points === 0 && !me.starters?.length) continue
    for (const other of matchups) {
      if (other.roster_id === rosterId) continue
      games++
      if (me.points > other.points) wins++
      else if (me.points === other.points) wins += 0.5
    }
  }
  return games ? wins / games : 0.5
}

function lineupEfficiency(
  rosterId: number,
  matchupsByWeek: Map<number, SleeperMatchup[]>,
  starterSlots: number,
): number {
  let actual = 0
  let optimal = 0
  for (const [, matchups] of matchupsByWeek) {
    const m = matchups.find((x) => x.roster_id === rosterId)
    if (!m?.players_points) continue
    const pts = Object.values(m.players_points).filter((p) => p != null)
    if (!pts.length) continue
    const sorted = [...pts].sort((a, b) => b - a)
    const top = sorted.slice(0, starterSlots).reduce((s, v) => s + v, 0)
    optimal += top
    actual += m.points
  }
  if (optimal <= 0) return 0.85
  return Math.min(1, actual / optimal)
}

export function computePowerRankings(
  rosters: SleeperRoster[],
  teams: Map<number, TeamInfo>,
  matchupsByWeek: Map<number, SleeperMatchup[]>,
  throughWeek: number,
  starterSlots = 10,
  previous?: PowerRankingRow[],
): PowerRankingRow[] {
  const weeks = [...matchupsByWeek.keys()].sort((a, b) => a - b)
  const lastWeek = weeks.length ? weeks[weeks.length - 1] : throughWeek
  const formWeeks = weeksForForm(lastWeek).filter((w) => matchupsByWeek.has(w))
  const h2h = headToHeadWinsByWeek(matchupsByWeek)

  const leaguePfPerGame: number[] = []
  for (const w of weeks) {
    const ms = matchupsByWeek.get(w)!
    const avg =
      ms.reduce((s, m) => s + m.points, 0) / Math.max(ms.length, 1)
    leaguePfPerGame.push(avg)
  }
  const leagueAvgPf =
    leaguePfPerGame.length
      ? leaguePfPerGame.reduce((a, b) => a + b, 0) / leaguePfPerGame.length
      : 120

  const scored = rosters.map((r) => {
    const rosterId = r.roster_id
    const pfPerGame = rosterPointsFor(r.settings) / Math.max(lastWeek, 1)
    const pfRate = Math.min(1.25, pfPerGame / leagueAvgPf) / 1.25

    let formWins = 0
    let formGames = 0
    for (const w of formWeeks) {
      const wmap = h2h.get(w)
      if (!wmap?.has(rosterId)) continue
      formGames++
      formWins += wmap.get(rosterId) ?? 0
    }
    const recentForm = formGames ? formWins / formGames : 0.5

    const allPlay = allPlayWinPct(rosterId, matchupsByWeek)
    const efficiency = lineupEfficiency(
      rosterId,
      matchupsByWeek,
      starterSlots,
    )

    const score =
      100 *
      (WEIGHTS.recentForm * recentForm +
        WEIGHTS.pointsFor * pfRate +
        WEIGHTS.allPlay * allPlay +
        WEIGHTS.efficiency * efficiency)

    const t = teams.get(rosterId)
    return {
      rosterId,
      teamName: t?.teamName ?? `Team ${rosterId}`,
      score,
      recentForm,
      pointsForRate: pfRate,
      allPlayWinPct: allPlay,
      lineupEfficiency: efficiency,
    }
  })

  scored.sort((a, b) => b.score - a.score)
  const prevRank = new Map(previous?.map((p) => [p.rosterId, p.rank]))

  return scored.map((row, i) => {
    const rank = i + 1
    const old = prevRank.get(row.rosterId)
    return {
      rank,
      rosterId: row.rosterId,
      teamName: row.teamName,
      score: Math.round(row.score * 10) / 10,
      recentForm: row.recentForm,
      pointsForRate: row.pointsForRate,
      allPlayWinPct: row.allPlayWinPct,
      lineupEfficiency: row.lineupEfficiency,
      movement: old != null ? old - rank : null,
    }
  })
}
