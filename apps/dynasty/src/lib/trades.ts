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
  completedAtMs: number
  dateLabel: string
  /** "Week N" or "Offseason" when the trade predates Week 1 kickoff. */
  weekLabel: string
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

function pickLabel(
  pick: { season: string; round: number; roster_id: number },
  teams: Map<number, TeamInfo>,
): string {
  const yr = pick.season?.slice(-2) ?? '?'
  const owner = teams.get(pick.roster_id)
  const nick = owner ? managerLabel(owner, pick.roster_id) : `R${pick.roster_id}`
  return `${yr} Rd ${pick.round} (${nick})`
}

function etYearMonth(ms: number): { year: number; month: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: ET,
    year: 'numeric',
    month: 'numeric',
  }).formatToParts(new Date(ms))
  return {
    year: Number(parts.find((p) => p.type === 'year')?.value),
    month: Number(parts.find((p) => p.type === 'month')?.value),
  }
}

/**
 * Offseason when the trade landed before that season's first NFL week.
 * Sleeper often files those as leg 1 with a pre-September timestamp.
 */
export function isOffseasonTrade(
  season: string,
  week: number,
  completedAtMs: number,
): boolean {
  if (!completedAtMs) return false
  const seasonYear = Number(season)
  if (!Number.isFinite(seasonYear)) return false
  const { year, month } = etYearMonth(completedAtMs)
  if (year < seasonYear) return true
  if (year === seasonYear && month < 9) return true
  if (week <= 1 && year === seasonYear && month < 9) return true
  return false
}

export function tradePeriodLabel(
  season: string,
  week: number,
  completedAtMs: number,
): string {
  if (isOffseasonTrade(season, week, completedAtMs)) return 'Offseason'
  return `Week ${week}`
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
    // roster_id is the original owner. previous_owner_id gives the pick;
    // owner_id receives it.
    const label = pickLabel(pick, teams)
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
    completedAtMs,
    dateLabel: completedAtMs ? formatTradeDate(completedAtMs) : '',
    weekLabel: tradePeriodLabel(league.season, tx.leg, completedAtMs),
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
