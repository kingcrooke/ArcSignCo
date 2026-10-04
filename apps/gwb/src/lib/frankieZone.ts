import {
  FRANKIE_ZONE_RECORD,
  ZONE_MANAGER_SHORT_NAMES,
} from './constants'
import { recordLabel } from './standings'
import type {
  SleeperMatchup,
  StandingRow,
  TeamInfo,
} from './types'

export const ZONE_PATH_STEPS = [1, 2, 3, 4, 5, 6, 7, 8] as const

export type ZoneLoreQuote = {
  quote: string
  recapId: string
  week: number
}

/** Curated commissioner-recap lines (week order). Text must exist in commissioner-recaps.json. */
export const ZONE_LORE_QUOTES: ZoneLoreQuote[] = [
  {
    week: 3,
    recapId: 'recap-10',
    quote: 'The Frankie Zone is in full survival mode.',
  },
  {
    week: 3,
    recapId: 'recap-13',
    quote: 'The Frankie Zone has officially received statehood.',
  },
  {
    week: 3,
    recapId: 'recap-12',
    quote: 'Automatic first down for the Frankie Zone.',
  },
  {
    week: 4,
    recapId: 'recap-14',
    quote: 'Frankie IS STILL TRYING TO ESCAPE THE ZONE',
  },
  {
    week: 4,
    recapId: 'recap-14',
    quote: 'The Frankie Zone becomes a UNESCO World Heritage Site.',
  },
]

export type ZoneResident = {
  rosterId: number
  displayName: string
  teamName: string
  wins: number
  losses: number
  pointsFor: number
  record: string
  lossesToRecord: number
  nextOpponent: ZoneNextOpponent | null
}

export type ZoneNextOpponent = {
  rosterId: number
  displayName: string
  teamName: string
  record: string
  week: number
}

export type ZoneEscape = {
  rosterId: number
  teamName: string
  displayName: string
  week: number
  points: number
  opponentLabel: string
  line: string
}

export type ZoneCollision = {
  week: number
  weeksUntil: number
  rosterA: number
  rosterB: number
  labelA: string
  labelB: string
  featured?: boolean
}

export type FrankieZoneView = {
  zoneName: string
  heroTitle: string
  tabLabel: string
  censusLine: string
  weekInProgressNote: string | null
  residents: ZoneResident[]
  escapes: ZoneEscape[]
  collisions: ZoneCollision[]
  isEmpty: boolean
  throughWeek: number
}

export function managerZoneName(
  userId: string,
  displayName: string,
): string {
  return ZONE_MANAGER_SHORT_NAMES[userId] ?? displayName.split(/\s+/)[0] ?? displayName
}

export function zoneHeroTitle(zoneName: string): string {
  return `THE ${zoneName.toUpperCase()} ZONE`
}

export function zoneTabLabel(zoneName: string): string {
  return `${zoneName} Zone`
}

function winsThroughWeek(
  rosterId: number,
  matchupsByWeek: Map<number, SleeperMatchup[]>,
  throughWeek: number,
): number {
  let wins = 0
  for (let week = 1; week <= throughWeek; week++) {
    const outcome = matchupOutcomeForWeek(rosterId, week, matchupsByWeek)
    if (outcome === 'W') wins++
  }
  return wins
}

function lossesThroughWeek(
  rosterId: number,
  matchupsByWeek: Map<number, SleeperMatchup[]>,
  throughWeek: number,
): number {
  let losses = 0
  for (let week = 1; week <= throughWeek; week++) {
    const outcome = matchupOutcomeForWeek(rosterId, week, matchupsByWeek)
    if (outcome === 'L') losses++
  }
  return losses
}

function matchupOutcomeForWeek(
  rosterId: number,
  week: number,
  matchupsByWeek: Map<number, SleeperMatchup[]>,
): 'W' | 'L' | 'T' | null {
  const matchups = matchupsByWeek.get(week)
  if (!matchups?.length) return null
  const mine = matchups.find((m) => m.roster_id === rosterId)
  if (!mine) return null
  const opp = matchups.find(
    (m) => m.matchup_id === mine.matchup_id && m.roster_id !== rosterId,
  )
  if (!opp) return null
  if (mine.points === 0 && opp.points === 0) {
    const played = mine.starters?.some((_, i) => (mine.starters_points[i] ?? 0) > 0)
    if (!played) return null
  }
  if (mine.points > opp.points) return 'W'
  if (opp.points > mine.points) return 'L'
  return 'T'
}

/** First week a team reaches `lossCount` losses with zero wins (completed weeks only). */
export function firstWeekAtLossCount(
  rosterId: number,
  lossCount: number,
  matchupsByWeek: Map<number, SleeperMatchup[]>,
  throughWeek: number,
): number | null {
  for (let week = 1; week <= throughWeek; week++) {
    const wins = winsThroughWeek(rosterId, matchupsByWeek, week)
    const losses = lossesThroughWeek(rosterId, matchupsByWeek, week)
    if (wins === 0 && losses >= lossCount) return week
  }
  return null
}

export function resolveZoneName(
  standings: StandingRow[],
  teams: Map<number, TeamInfo>,
  matchupsByWeek: Map<number, SleeperMatchup[]>,
  throughWeek: number,
): string {
  const threshold = FRANKIE_ZONE_RECORD.renameAtLosses
  let best: { week: number; name: string } | null = null
  for (const row of standings) {
    if (row.wins > 0) continue
    if (row.losses < threshold) continue
    const team = teams.get(row.rosterId)
    const name = managerZoneName(team?.userId ?? '', row.displayName)
    const week =
      firstWeekAtLossCount(
        row.rosterId,
        threshold,
        matchupsByWeek,
        throughWeek,
      ) ?? throughWeek
    if (!best || week < best.week) best = { week, name }
  }
  return best?.name ?? FRANKIE_ZONE_RECORD.holderName
}

export function buildEscapeLog(
  matchupsByWeek: Map<number, SleeperMatchup[]>,
  teams: Map<number, TeamInfo>,
  throughWeek: number,
): ZoneEscape[] {
  const escapes: ZoneEscape[] = []
  for (const team of teams.values()) {
    let prevWins = 0
    for (let week = 1; week <= throughWeek; week++) {
      const wins = winsThroughWeek(team.rosterId, matchupsByWeek, week)
      if (prevWins === 0 && wins === 1) {
        const lossesBefore =
          week <= 1
            ? 0
            : lossesThroughWeek(team.rosterId, matchupsByWeek, week - 1)
        if (lossesBefore < 1) {
          prevWins = wins
          continue
        }
        const matchups = matchupsByWeek.get(week)
        const mine = matchups?.find((m) => m.roster_id === team.rosterId)
        const opp = matchups?.find(
          (m) =>
            mine &&
            m.matchup_id === mine.matchup_id &&
            m.roster_id !== team.rosterId,
        )
        const oppInfo = opp ? teams.get(opp.roster_id) : undefined
        const oppLabel =
          oppInfo?.displayName ?? oppInfo?.teamName ?? 'opponent'
        const pts = mine?.points ?? 0
        escapes.push({
          rosterId: team.rosterId,
          teamName: team.teamName,
          displayName: team.displayName,
          week,
          points: pts,
          opponentLabel: oppLabel,
          line: `${team.teamName} escaped W${week} · ${pts.toFixed(2)} vs ${oppLabel}`,
        })
      }
      prevWins = wins
    }
  }
  return escapes.sort((a, b) => a.week - b.week || a.teamName.localeCompare(b.teamName))
}

export function pairingsForWeek(
  matchups: SleeperMatchup[],
): Map<number, number> {
  const pairs = new Map<number, number>()
  const byMatch = new Map<number, SleeperMatchup[]>()
  for (const m of matchups) {
    const list = byMatch.get(m.matchup_id) ?? []
    list.push(m)
    byMatch.set(m.matchup_id, list)
  }
  for (const pair of byMatch.values()) {
    if (pair.length !== 2) continue
    pairs.set(pair[0].roster_id, pair[1].roster_id)
    pairs.set(pair[1].roster_id, pair[0].roster_id)
  }
  return pairs
}

export function findNextOpponent(
  rosterId: number,
  scheduleByWeek: Map<number, Map<number, number>>,
  standingsByRoster: Map<number, StandingRow>,
  fromWeek: number,
  maxWeek = 18,
): ZoneNextOpponent | null {
  for (let week = fromWeek; week <= maxWeek; week++) {
    const pairs = scheduleByWeek.get(week)
    const oppId = pairs?.get(rosterId)
    if (oppId == null) continue
    const opp = standingsByRoster.get(oppId)
    return {
      rosterId: oppId,
      displayName: opp?.displayName ?? `Roster ${oppId}`,
      teamName: opp?.teamName ?? `Team ${oppId}`,
      record: opp ? recordLabel(opp) : '—',
      week,
    }
  }
  return null
}

export function findZoneCollisions(
  residentIds: Set<number>,
  scheduleByWeek: Map<number, Map<number, number>>,
  teams: Map<number, TeamInfo>,
  fromWeek: number,
  currentWeek: number,
  maxWeek = 18,
): ZoneCollision[] {
  const hits: ZoneCollision[] = []
  for (let week = fromWeek; week <= maxWeek; week++) {
    const pairs = scheduleByWeek.get(week)
    if (!pairs) continue
    const seen = new Set<string>()
    for (const rosterId of residentIds) {
      const oppId = pairs.get(rosterId)
      if (oppId == null || !residentIds.has(oppId)) continue
      const key = [rosterId, oppId].sort().join('-')
      if (seen.has(key)) continue
      seen.add(key)
      const a = teams.get(rosterId)
      const b = teams.get(oppId)
      hits.push({
        week,
        weeksUntil: Math.max(0, week - currentWeek),
        rosterA: rosterId,
        rosterB: oppId,
        labelA: a?.displayName ?? `Roster ${rosterId}`,
        labelB: b?.displayName ?? `Roster ${oppId}`,
      })
    }
  }
  return hits.sort((a, b) => a.week - b.week)
}

export function buildScheduleByWeek(
  matchupsByWeek: Map<number, SleeperMatchup[]>,
): Map<number, Map<number, number>> {
  const schedule = new Map<number, Map<number, number>>()
  for (const [week, matchups] of matchupsByWeek) {
    schedule.set(week, pairingsForWeek(matchups))
  }
  return schedule
}

export function censusSubtitle(
  residentCount: number,
  throughWeek: number,
  weekInProgress: boolean,
  liveWeek: number,
): string {
  const base = `${residentCount} STILL WINLESS · AFTER WEEK ${throughWeek}`
  if (!weekInProgress) return base
  return `${base} · WEEK ${liveWeek} IN PROGRESS`
}

export function pathStatusLine(losses: number, hasNext: boolean): string {
  const record = `0-${losses}`
  return `YOU ARE HERE · ${record}${hasNext ? ' · UP NEXT' : ''}`
}

export function renameMeterLabel(losses: number): string {
  const need = FRANKIE_ZONE_RECORD.renameAtLosses - losses
  if (need <= 0) return 'RECORD BROKEN — ZONE RENAMED'
  if (need === 1) return '1 loss from breaking the record'
  return `${need} losses from breaking the record`
}

export function computeFrankieZoneView(input: {
  standings: StandingRow[]
  teams: Map<number, TeamInfo>
  matchupsByWeek: Map<number, SleeperMatchup[]>
  scheduleByWeek: Map<number, Map<number, number>>
  throughWeek: number
  nflWeek: number
  weekInProgress: boolean
}): FrankieZoneView {
  const {
    standings,
    teams,
    matchupsByWeek,
    scheduleByWeek,
    throughWeek,
    nflWeek,
    weekInProgress,
  } = input

  const zoneName = resolveZoneName(
    standings,
    teams,
    matchupsByWeek,
    throughWeek,
  )
  const residents = standings
    .filter((r) => r.wins === 0)
    .sort((a, b) => b.losses - a.losses || a.pointsFor - b.pointsFor)

  const standingsByRoster = new Map(standings.map((r) => [r.rosterId, r]))
  const nextFromWeek = weekInProgress ? nflWeek : throughWeek + 1
  const residentIds = new Set(residents.map((r) => r.rosterId))

  const residentViews: ZoneResident[] = residents.map((row) => ({
    rosterId: row.rosterId,
    displayName: row.displayName,
    teamName: row.teamName,
    wins: row.wins,
    losses: row.losses,
    pointsFor: row.pointsFor,
    record: recordLabel(row),
    lossesToRecord: Math.max(0, FRANKIE_ZONE_RECORD.renameAtLosses - row.losses),
    nextOpponent: findNextOpponent(
      row.rosterId,
      scheduleByWeek,
      standingsByRoster,
      nextFromWeek,
    ),
  }))

  const escapes = buildEscapeLog(matchupsByWeek, teams, throughWeek)
  const collisions = findZoneCollisions(
    residentIds,
    scheduleByWeek,
    teams,
    nextFromWeek,
    nflWeek,
  )

  return {
    zoneName,
    heroTitle: zoneHeroTitle(zoneName),
    tabLabel: zoneTabLabel(zoneName),
    censusLine: censusSubtitle(
      residents.length,
      throughWeek,
      weekInProgress,
      nflWeek,
    ),
    weekInProgressNote: weekInProgress
      ? `Scores through Week ${throughWeek}; Week ${nflWeek} still in progress.`
      : null,
    residents: residentViews,
    escapes,
    collisions,
    isEmpty: residents.length === 0,
    throughWeek,
  }
}

export function mergeScheduleWeek(
  schedule: Map<number, Map<number, number>>,
  week: number,
  matchups: SleeperMatchup[],
): Map<number, Map<number, number>> {
  const next = new Map(schedule)
  next.set(week, pairingsForWeek(matchups))
  return next
}
