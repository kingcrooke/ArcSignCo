import { managerNickname } from './nicknames'
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
  const nick = owner
    ? managerNickname(pick.roster_id, owner.displayName)
    : `R${pick.roster_id}`
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
    if (pick.roster_id === rosterId) {
      received.push({ label: pickLabel(pick, teams) })
    }
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
  return {
    rosterId,
    managerName: managerNickname(rosterId, team?.displayName ?? `Team ${rosterId}`),
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
  if (
    !sideA.received.length &&
    !sideA.sent.length &&
    !sideB.received.length &&
    !sideB.sent.length
  ) {
    return null
  }
  return {
    transactionId: tx.transaction_id ?? `${league.league_id}-${completedAtMs}`,
    leagueId: league.league_id,
    season: league.season,
    week: tx.leg,
    completedAtMs,
    dateLabel: completedAtMs ? formatTradeDate(completedAtMs) : '',
    sideA,
    sideB,
  }
}

export function mergeTradeLogs(entries: TradeLogEntry[]): TradeLogEntry[] {
  return [...entries].sort((a, b) => {
    if (b.completedAtMs !== a.completedAtMs) return b.completedAtMs - a.completedAtMs
    return b.week - a.week
  })
}

export function formatTradeAssetList(assets: TradeAsset[]): string {
  if (!assets.length) return '—'
  return assets.map((a) => a.label).join(', ')
}
