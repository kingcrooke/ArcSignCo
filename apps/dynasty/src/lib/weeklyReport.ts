import reports2026 from '../data/weekly-reports/2026.json'

export interface ReportScorer {
  playerId: string
  name: string
  points: number
  started: boolean
}

export interface ReportSide {
  rosterId: number
  userId: string
  name: string
  score: number
  recordAfter?: string | null
  topScorers: ReportScorer[]
}

export interface ReportMatchup {
  matchupId: number
  margin: number
  upset: boolean
  tie: boolean
  recap: string
  winner: ReportSide
  loser: ReportSide
}

export interface ReportScoreLine {
  rosterId: number
  userId: string
  name: string
  points: number
}

export interface ReportStanding {
  rank: number
  rosterId: number
  userId: string
  name: string
  wins: number
  losses: number
  ties: number
  pointsFor: number
}

export interface ReportWaiver {
  transactionId: string
  type: string
  rosterId: number | null
  userId: string
  manager: string
  faab: number | null
  adds: { playerId: string; name: string }[]
  drops: { playerId: string; name: string }[]
}

export interface ReportTrade {
  transactionId: string
  statusUpdated: number
  sides: {
    rosterId: number
    userId: string
    manager: string
    receivedPlayers: string[]
    sentPlayers: string[]
    receivedPicks: string[]
  }[]
}

export interface WeeklyReport {
  season: string
  leagueId: string
  week: number
  source: string
  matchups: ReportMatchup[]
  highScore: ReportScoreLine | null
  lowScore: ReportScoreLine | null
  closest: {
    margin: number
    winnerName: string
    winnerScore: number
    loserName: string
    loserScore: number
    matchupId: number
  } | null
  blowout: {
    margin: number
    winnerName: string
    winnerScore: number
    loserName: string
    loserScore: number
    matchupId: number
  } | null
  topPlayer: {
    playerId: string
    name: string
    points: number
    started: boolean
    rosterId: number
    userId: string
    manager: string
  } | null
  mostBench: ReportScoreLine | null
  bestGame: {
    matchupId: number
    winnerName: string
    winnerScore: number
    loserName: string
    loserScore: number
    margin: number
    upset: boolean
  } | null
  standings: ReportStanding[]
  waivers: ReportWaiver[]
  trades: ReportTrade[]
}

type ReportFile = { season: string; leagueId: string; weeks: Record<string, WeeklyReport> }

const BY_SEASON: Record<string, ReportFile> = {
  '2026': reports2026 as ReportFile,
}

/** Stored Sleeper report for a completed week, or null when none has been generated. */
export function getWeeklyReport(
  season: string | number,
  week: number,
): WeeklyReport | null {
  const file = BY_SEASON[String(season)]
  if (!file) return null
  return file.weeks[String(week)] ?? null
}

export function weeklyReportEmptyMessage(week: number): string {
  return `Week ${week} report isn't posted yet.`
}
