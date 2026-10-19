import { managerLabel } from './teams'
import type {
  PlayersMap,
  SleeperLeague,
  SleeperTransaction,
  TeamInfo,
} from './types'

const ET = 'America/New_York'

export interface TradeAsset {
  label: string
  playerId?: string
}

export interface TradeSide {
  rosterId: number
  userId: string
  managerName: string
  received: TradeAsset[]
  sent: TradeAsset[]
}

export interface TradeLogEntry {
  transactionId: string
  leagueId: string
  season: string
  week: number
  /** "Week N", or "Offseason" when the trade closed before the season started. */
  weekLabel: string
  completedAtMs: number
  dateLabel: string
  sideA: TradeSide
  sideB: TradeSide
}

export interface TradeLogResult {
  trades: TradeLogEntry[]
  priorSeasonsIncluded: string[]
  priorSeasonsFailed: boolean
}

function formatTradeDate(ms: number): string {
  return new Date(ms).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: ET,
  })
}

function playerLabel(playerId: string, players: PlayersMap | null): string {
  const name = players?.[playerId]?.full_name?.trim()
  if (name) return name
  if (/^[A-Z]{2,4}$/.test(playerId)) return `${playerId} DEF`
  return ''
}

/** Thursday night opener, Eastern. Trades before this are offseason. */
const WEEK1_KICKOFF_MS: Record<string, number> = {
  '2019': Date.parse('2019-09-05T20:20:00-04:00'),
  '2020': Date.parse('2020-09-10T20:20:00-04:00'),
  '2021': Date.parse('2021-09-09T20:20:00-04:00'),
  '2022': Date.parse('2022-09-08T20:20:00-04:00'),
  '2023': Date.parse('2023-09-07T20:20:00-04:00'),
  '2024': Date.parse('2024-09-05T20:20:00-04:00'),
  '2025': Date.parse('2025-09-04T20:20:00-04:00'),
  '2026': Date.parse('2026-09-10T20:20:00-04:00'),
}

function etMonthYear(ms: number): { year: number; month: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: ET,
    year: 'numeric',
    month: 'numeric',
  }).formatToParts(new Date(ms))
  const year = Number(parts.find((p) => p.type === 'year')?.value)
  const month = Number(parts.find((p) => p.type === 'month')?.value)
  return { year, month }
}

/**
 * Offseason when the trade closed before that season's Week 1 kickoff,
 * or Sleeper filed it as leg 1 with a date before September.
 */
export function isOffseasonTrade(
  week: number,
  completedAtMs: number,
  season: string,
): boolean {
  if (!completedAtMs) return false
  const seasonYear = Number.parseInt(season, 10)
  const { year, month } = etMonthYear(completedAtMs)
  if (Number.isFinite(seasonYear) && year < seasonYear) return true
  if (
    Number.isFinite(seasonYear) &&
    year === seasonYear &&
    month < 9 &&
    (week === 1 || week === 0)
  ) {
    return true
  }
  const kickoff = WEEK1_KICKOFF_MS[season]
  if (kickoff != null && completedAtMs < kickoff) return true
  return false
}

export function tradeWeekLabel(
  week: number,
  completedAtMs: number,
  season: string,
): string {
  if (isOffseasonTrade(week, completedAtMs, season)) return 'Offseason'
  return `Week ${week}`
}

function pickLabel(
  pick: { season: string; round: number; roster_id: number },
  teams: Map<number, TeamInfo>,
): string {
  const yr = pick.season?.slice(-2) ?? '?'
  const owner = teams.get(pick.roster_id)
  const nick = owner ? managerLabel(owner, pick.roster_id) : `R${pick.roster_id}`
  return `${yr} Rd ${pick.round} (${nick})`
}

function assetsForRoster(
  rosterId: number,
  tx: SleeperTransaction,
  players: PlayersMap | null,
  teams: Map<number, TeamInfo>,
): { received: TradeAsset[]; sent: TradeAsset[] } {
  const received: TradeAsset[] = []
  const sent: TradeAsset[] = []

  if (tx.adds) {
    for (const [pid, rid] of Object.entries(tx.adds)) {
      if (rid !== rosterId) continue
      const label = playerLabel(pid, players)
      if (label) received.push({ label, playerId: pid })
    }
  }
  if (tx.drops) {
    for (const [pid, rid] of Object.entries(tx.drops)) {
      if (rid !== rosterId) continue
      const label = playerLabel(pid, players)
      if (label) sent.push({ label, playerId: pid })
    }
  }
  for (const pick of tx.draft_picks ?? []) {
    const label = pickLabel(pick, teams)
    // owner_id is the receiver; previous_owner_id is the giver.
    // roster_id stays the original team and is only used in the label.
    if (pick.owner_id === rosterId) received.push({ label })
    if (pick.previous_owner_id === rosterId) sent.push({ label })
  }
  for (const wb of tx.waiver_budget ?? []) {
    if (wb.receiver === rosterId) {
      received.push({ label: `$${wb.amount} FAAB` })
    }
    if (wb.sender === rosterId) {
      sent.push({ label: `$${wb.amount} FAAB` })
    }
  }

  return { received, sent }
}

function sideFromRoster(
  rosterId: number,
  tx: SleeperTransaction,
  teams: Map<number, TeamInfo>,
  players: PlayersMap | null,
): TradeSide {
  const team = teams.get(rosterId)
  const { received, sent } = assetsForRoster(rosterId, tx, players, teams)
  const userId = team?.userId ?? ''
  return {
    rosterId,
    userId,
    managerName: managerLabel(team, rosterId),
    received,
    sent,
  }
}

export function buildTradeLogEntry(
  tx: SleeperTransaction,
  league: SleeperLeague,
  teams: Map<number, TeamInfo>,
  players: PlayersMap | null,
): TradeLogEntry | null {
  if (tx.type !== 'trade' || tx.status !== 'complete') return null
  const rosterIds = tx.roster_ids ?? []
  if (rosterIds.length < 2) return null
  const [a, b] = rosterIds
  const completedAtMs = tx.status_updated || tx.created || 0
  const sideA = sideFromRoster(a, tx, teams, players)
  const sideB = sideFromRoster(b, tx, teams, players)
  const hasAssets =
    sideA.received.length ||
    sideA.sent.length ||
    sideB.received.length ||
    sideB.sent.length
  const hasRaw =
    (tx.adds && Object.keys(tx.adds).length > 0) ||
    (tx.drops && Object.keys(tx.drops).length > 0) ||
    (tx.draft_picks?.length ?? 0) > 0 ||
    (tx.waiver_budget?.length ?? 0) > 0
  if (!hasAssets && !hasRaw) return null
  if (!hasAssets && hasRaw && !players) return null
  return {
    transactionId: tx.transaction_id ?? `${league.league_id}-${completedAtMs}`,
    leagueId: league.league_id,
    season: league.season,
    week: tx.leg,
    weekLabel: tradeWeekLabel(tx.leg, completedAtMs, league.season),
    completedAtMs,
    dateLabel: completedAtMs ? formatTradeDate(completedAtMs) : '',
    sideA,
    sideB,
  }
}

export function mergeTradeLogs(entries: TradeLogEntry[]): TradeLogEntry[] {
  return [...entries].sort((a, b) => {
    if (b.completedAtMs !== a.completedAtMs) return b.completedAtMs - a.completedAtMs
    if (b.season !== a.season) return Number(b.season) - Number(a.season)
    return b.week - a.week
  })
}

export function tradeCountBySeason(trades: TradeLogEntry[]): Map<string, number> {
  const map = new Map<string, number>()
  for (const t of trades) {
    map.set(t.season, (map.get(t.season) ?? 0) + 1)
  }
  return map
}

export function formatTradeAssetList(assets: TradeAsset[]): string {
  if (!assets.length) return '—'
  return assets.map((a) => a.label).join(', ')
}
