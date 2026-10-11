import { regularSeasonLastWeek } from './frankieZone'
import { managerDisplayName } from './nicknames'
import type { LeagueTradeBundle } from './sleeperApi'
import { rosterPointsFor, rosterPointsAgainst } from './teams'
import { sortStandingRows, recordLabel } from './standings'
import type {
  SleeperBracketMatch,
  SleeperLeague,
  SleeperRoster,
  TeamInfo,
} from './types'

export interface ManagerSeasonFinish {
  season: string
  leagueId: string
  leagueName: string
  rosterId: number
  userId: string
  displayName: string
  wins: number
  losses: number
  ties: number
  pointsFor: number
  regularSeasonRank: number
  playoffResult: string
  championUserId: string
  championDisplayName: string
  roster: SleeperRoster
  rosterPositions: string[]
  unavailable: boolean
}

export interface LeagueSeasonSummary {
  season: string
  leagueId: string
  leagueName: string
  status: string
  championRosterId: number | null
  championUserId: string
  championDisplayName: string
  byUserId: Map<string, ManagerSeasonFinish>
  byRosterId: Map<number, ManagerSeasonFinish>
  unavailable: boolean
}

function regularSeasonFromRecord(
  roster: SleeperRoster,
  regLastWeek: number,
): { wins: number; losses: number; ties: number } {
  const rec = roster.metadata?.record?.trim()
  if (rec) {
    const slice = rec.slice(0, regLastWeek)
    let wins = 0
    let losses = 0
    let ties = 0
    for (const c of slice) {
      if (c === 'W') wins++
      else if (c === 'L') losses++
      else if (c === 'T') ties++
    }
    return { wins, losses, ties }
  }
  return {
    wins: roster.settings.wins ?? 0,
    losses: roster.settings.losses ?? 0,
    ties: roster.settings.ties ?? 0,
  }
}

function championRosterId(
  league: SleeperLeague,
  bracket: SleeperBracketMatch[] | null,
): number | null {
  if (league.status !== 'complete') return null
  const meta = league.metadata?.latest_league_winner_roster_id
  if (meta) {
    const n = Number(meta)
    if (!Number.isNaN(n) && n > 0) return n
  }
  if (!bracket?.length) return null
  const final = bracket.find((m) => m.p === 1)
  if (final?.w) return final.w
  const maxRound = Math.max(...bracket.map((m) => m.r))
  const lastRound = bracket.filter((m) => m.r === maxRound && m.w)
  if (lastRound.length === 1 && lastRound[0].w) return lastRound[0].w
  return null
}

function playoffResultLabel(
  rosterId: number,
  bracket: SleeperBracketMatch[] | null,
  playoffTeams: number,
  regularRank: number,
  championId: number | null,
  seasonComplete: boolean,
): string {
  if (!seasonComplete) return ''
  if (regularRank > playoffTeams) return 'Missed playoffs'
  if (championId === rosterId) return 'Champion'
  if (!bracket?.length) return 'Playoffs (bracket unavailable)'

  const final = bracket.find((m) => m.p === 1)
  if (final) {
    if (final.w === rosterId) return 'Champion'
    if (final.t1 === rosterId || final.t2 === rosterId) return 'Runner-up'
  }

  const third = bracket.find((m) => m.p === 3)
  if (third) {
    if (third.w === rosterId) return '3rd place'
    if (third.t1 === rosterId || third.t2 === rosterId) return '4th place'
  }

  const fifth = bracket.find((m) => m.p === 5)
  if (fifth) {
    if (fifth.w === rosterId) return '5th place'
    if (fifth.t1 === rosterId || fifth.t2 === rosterId) return '6th place'
  }

  const played = bracket.filter(
    (m) => m.t1 === rosterId || m.t2 === rosterId,
  )
  if (!played.length) return 'Missed playoffs'

  const lost = played.filter((m) => m.w && m.w !== rosterId)
  if (lost.length) {
    const deepest = lost.reduce((a, b) => (a.r >= b.r ? a : b))
    if (deepest.r >= 3) return 'Semifinal exit'
    if (deepest.r === 2) return 'Quarterfinal exit'
    return 'Playoff exit'
  }

  return 'Playoffs'
}

function buildOneSeason(
  bundle: LeagueTradeBundle,
): LeagueSeasonSummary | null {
  const { league, rosters, teams } = bundle
  const regLast = regularSeasonLastWeek(
    league.settings.playoff_week_start ?? 15,
  )
  const playoffTeams = league.settings.playoff_teams ?? 6
  const seasonComplete = league.status === 'complete'
  const champRoster = championRosterId(league, bundle.winnersBracket)

  const regRows = sortStandingRows(
    rosters.map((r) => {
      const t = teams.get(r.roster_id)
      const reg = regularSeasonFromRecord(r, regLast)
      return {
        rosterId: r.roster_id,
        teamName: t?.teamName ?? `Team ${r.roster_id}`,
        displayName: t?.displayName ?? '',
        wins: reg.wins,
        losses: reg.losses,
        ties: reg.ties,
        pointsFor: rosterPointsFor(r.settings),
        pointsAgainst: rosterPointsAgainst(r.settings),
        streak: '',
      }
    }),
  )

  const rankByRoster = new Map(
    regRows.map((r) => [r.rosterId, r.rank]),
  )

  let championUserId = ''
  let championDisplayName = seasonComplete ? 'unavailable' : ''
  if (seasonComplete && champRoster != null) {
    const champTeam = teams.get(champRoster)
    championUserId = champTeam?.userId ?? ''
    championDisplayName = champTeam
      ? managerDisplayName(champTeam.userId, champTeam.displayName)
      : 'unavailable'
  }

  const byUserId = new Map<string, ManagerSeasonFinish>()
  const byRosterId = new Map<number, ManagerSeasonFinish>()

  for (const r of rosters) {
    const t = teams.get(r.roster_id)
    if (!t?.userId) continue
    const regRank = rankByRoster.get(r.roster_id) ?? 0
    const finish: ManagerSeasonFinish = {
      season: league.season,
      leagueId: league.league_id,
      leagueName: league.name,
      rosterId: r.roster_id,
      userId: t.userId,
      displayName: managerDisplayName(t.userId, t.displayName),
      wins: r.settings.wins ?? 0,
      losses: r.settings.losses ?? 0,
      ties: r.settings.ties ?? 0,
      pointsFor: rosterPointsFor(r.settings),
      regularSeasonRank: regRank,
      playoffResult: playoffResultLabel(
        r.roster_id,
        bundle.winnersBracket,
        playoffTeams,
        regRank,
        champRoster,
        seasonComplete,
      ),
      championUserId,
      championDisplayName,
      roster: r,
      rosterPositions: league.roster_positions ?? [],
      unavailable: false,
    }
    byUserId.set(t.userId, finish)
    byRosterId.set(r.roster_id, finish)
  }

  return {
    season: league.season,
    leagueId: league.league_id,
    leagueName: league.name,
    status: league.status,
    championRosterId: champRoster,
    championUserId,
    championDisplayName,
    byUserId,
    byRosterId,
    unavailable: false,
  }
}

export function buildLeagueSeasonSummaries(
  bundles: LeagueTradeBundle[],
): LeagueSeasonSummary[] {
  const summaries: LeagueSeasonSummary[] = []
  for (const bundle of bundles) {
    const s = buildOneSeason(bundle)
    if (s) summaries.push(s)
  }
  summaries.sort((a, b) => Number(b.season) - Number(a.season))
  return summaries
}

export function inProgressSeasonLine(
  season: string,
  standing: {
    rank: number
    wins: number
    losses: number
    ties: number
    pointsFor: number
  } | null,
): string {
  if (!standing) return `${season} · in progress`
  const t = standing.ties ? `-${standing.ties}` : ''
  return `${season} · in progress · #${standing.rank} · ${standing.wins}-${standing.losses}${t} · ${standing.pointsFor.toFixed(1)} PF`
}

const FINISH_RANK: Record<string, number> = {
  Champion: 1,
  'Runner-up': 2,
  '3rd place': 3,
  '4th place': 4,
  '5th place': 5,
  '6th place': 6,
  'Semifinal exit': 7,
  'Quarterfinal exit': 8,
  'Playoff exit': 9,
  'Missed playoffs': 10,
}

export interface ManagerCareerStats {
  wins: number
  losses: number
  ties: number
  titles: number
  playoffTrips: number
  bestFinish: string
}

export function managerCareerStats(
  finishedSeasons: ManagerSeasonFinish[],
  currentStanding: {
    wins: number
    losses: number
    ties: number
  } | null,
): ManagerCareerStats {
  let wins = 0
  let losses = 0
  let ties = 0
  let titles = 0
  let playoffTrips = 0
  let bestRank = 99
  let bestFinish = '—'

  for (const s of finishedSeasons) {
    wins += s.wins
    losses += s.losses
    ties += s.ties
    if (s.playoffResult === 'Champion') titles++
    if (s.playoffResult && s.playoffResult !== 'Missed playoffs') playoffTrips++
    const r = FINISH_RANK[s.playoffResult] ?? 99
    if (r < bestRank) {
      bestRank = r
      bestFinish = s.playoffResult
    }
  }
  if (currentStanding) {
    wins += currentStanding.wins
    losses += currentStanding.losses
    ties += currentStanding.ties
  }

  return {
    wins,
    losses,
    ties,
    titles,
    playoffTrips,
    bestFinish,
  }
}

export function championBySeason(
  summaries: LeagueSeasonSummary[],
): { season: string; champion: string }[] {
  return summaries
    .filter((s) => s.status === 'complete')
    .sort((a, b) => Number(b.season) - Number(a.season))
    .map((s) => ({
      season: s.season,
      champion: s.championDisplayName || 'unavailable',
    }))
}

export function finishSummaryLine(row: ManagerSeasonFinish): string {
  if (!row.playoffResult) {
    const rec = recordLabel({
      rank: row.regularSeasonRank,
      rosterId: row.rosterId,
      teamName: '',
      displayName: row.displayName,
      wins: row.wins,
      losses: row.losses,
      ties: row.ties,
      pointsFor: row.pointsFor,
      pointsAgainst: 0,
      streak: '',
    })
    return `#${row.regularSeasonRank} reg · ${rec} · ${row.pointsFor.toFixed(1)} PF`
  }
  const rec = recordLabel({
    rank: row.regularSeasonRank,
    rosterId: row.rosterId,
    teamName: '',
    displayName: row.displayName,
    wins: row.wins,
    losses: row.losses,
    ties: row.ties,
    pointsFor: row.pointsFor,
    pointsAgainst: 0,
    streak: '',
  })
  return `#${row.regularSeasonRank} reg · ${rec} · ${row.pointsFor.toFixed(1)} PF · ${row.playoffResult}`
}

export function finishedSeasonsForManager(
  summaries: LeagueSeasonSummary[],
  userId: string,
): ManagerSeasonFinish[] {
  const rows: ManagerSeasonFinish[] = []
  for (const s of summaries) {
    if (s.status !== 'complete') continue
    const row = s.byUserId.get(userId)
    if (row) rows.push(row)
  }
  rows.sort((a, b) => Number(b.season) - Number(a.season))
  return rows
}

export function seasonsForManager(
  summaries: LeagueSeasonSummary[],
  userId: string,
  excludeSeason?: string,
): ManagerSeasonFinish[] {
  const rows: ManagerSeasonFinish[] = []
  for (const s of summaries) {
    if (excludeSeason && s.season === excludeSeason) continue
    if (s.status !== 'complete') continue
    const row = s.byUserId.get(userId)
    if (row) rows.push(row)
  }
  return rows
}

export function lookupTeamDisplay(
  teams: Map<number, TeamInfo>,
  rosterId: number,
): { userId: string; displayName: string } {
  const t = teams.get(rosterId)
  if (!t) return { userId: '', displayName: `Roster ${rosterId}` }
  return {
    userId: t.userId,
    displayName: managerDisplayName(t.userId, t.displayName),
  }
}
