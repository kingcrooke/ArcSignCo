import { managerLabel } from './teams'
import { tradePeriodLabel, type TradeLogEntry } from './trades'
import type {
  SleeperDraft,
  SleeperDraftPick,
  SleeperTradedPick,
  SleeperTransaction,
  TeamInfo,
} from './types'

export interface DraftBoard {
  draft: SleeperDraft
  picks: SleeperDraftPick[]
  rounds: number
}

export interface FuturePickRow {
  season: string
  round: number
  originalRosterId: number
  ownerRosterId: number
  originalLabel: string
  ownerLabel: string
}

export interface TradedPickHistoryRow {
  season: string
  round: number
  /** Original owner of the pick (Sleeper roster_id). */
  originalRosterId: number
  fromRosterId: number
  toRosterId: number
  tradeSeason: string
  tradeWeek: number
  dateLabel: string
  /** "Week N" or "Offseason". */
  periodLabel: string
}

export function buildDraftBoards(
  drafts: SleeperDraft[],
  picksByDraftId: Map<string, SleeperDraftPick[]>,
): DraftBoard[] {
  return drafts
    .map((draft) => {
      const picks = picksByDraftId.get(draft.draft_id) ?? []
      const rounds =
        draft.settings?.rounds ??
        (picks.length
          ? Math.max(...picks.map((p) => p.round))
          : 3)
      return { draft, picks, rounds }
    })
    .sort((a, b) => Number(b.draft.season) - Number(a.draft.season))
}

export function picksByRound(
  picks: SleeperDraftPick[],
  round: number,
): SleeperDraftPick[] {
  return picks
    .filter((p) => p.round === round)
    .sort((a, b) => a.pick_no - b.pick_no)
}

export function futurePickSeasons(
  baseSeason: string,
  count = 3,
): string[] {
  const start = Number.parseInt(baseSeason, 10)
  if (Number.isNaN(start)) return []
  return Array.from({ length: count }, (_, i) => String(start + i + 1))
}

function pickRow(
  season: string,
  round: number,
  originalRosterId: number,
  ownerRosterId: number,
  teams: Map<number, TeamInfo>,
): FuturePickRow {
  const original = teams.get(originalRosterId)
  const owner = teams.get(ownerRosterId)
  return {
    season,
    round,
    originalRosterId,
    ownerRosterId,
    originalLabel: original
      ? managerLabel(original, originalRosterId)
      : `R${originalRosterId}`,
    ownerLabel: owner ? managerLabel(owner, ownerRosterId) : `R${ownerRosterId}`,
  }
}

function sortPickRows(rows: FuturePickRow[]): FuturePickRow[] {
  return rows.sort((a, b) => {
    if (a.season !== b.season) return Number(a.season) - Number(b.season)
    if (a.round !== b.round) return a.round - b.round
    return a.originalRosterId - b.originalRosterId
  })
}

function picksInWindow(
  tradedPicks: SleeperTradedPick[],
  baseSeason: string,
  yearsAhead: number,
  draftRounds: number,
): SleeperTradedPick[] {
  const allowed = new Set(futurePickSeasons(baseSeason, yearsAhead))
  return tradedPicks.filter(
    (pick) =>
      allowed.has(pick.season) &&
      pick.round >= 1 &&
      pick.round <= draftRounds,
  )
}

/**
 * Picks that changed hands over the next draft years.
 * A pick whose current owner is still the original owner is omitted
 * ("originally Wolf Pack → now Wolf Pack").
 */
export function futurePickOwnership(
  tradedPicks: SleeperTradedPick[],
  teams: Map<number, TeamInfo>,
  baseSeason: string,
  yearsAhead = 3,
  draftRounds = 3,
): FuturePickRow[] {
  const rows: FuturePickRow[] = []
  for (const pick of picksInWindow(tradedPicks, baseSeason, yearsAhead, draftRounds)) {
    if (pick.owner_id === pick.roster_id) continue
    rows.push(pickRow(pick.season, pick.round, pick.roster_id, pick.owner_id, teams))
  }
  return sortPickRows(rows)
}

export function tradedPickHistoryFromTrades(
  trades: TradeLogEntry[],
): TradedPickHistoryRow[] {
  const rows: TradedPickHistoryRow[] = []
  for (const trade of trades) {
    for (const side of [trade.sideA, trade.sideB]) {
      for (const asset of side.received) {
        const parsed = parsePickLabel(asset.label)
        if (!parsed) continue
        rows.push({
          season: parsed.season,
          round: parsed.round,
          originalRosterId: parsed.fromRosterId ?? side.rosterId,
          fromRosterId: parsed.fromRosterId ?? side.rosterId,
          toRosterId: side.rosterId,
          tradeSeason: trade.season,
          tradeWeek: trade.week,
          dateLabel: trade.dateLabel,
          periodLabel: tradePeriodLabel(trade.season, trade.week, trade.completedAtMs),
        })
      }
    }
  }
  return rows.sort((a, b) => {
    if (b.tradeSeason !== a.tradeSeason) return Number(b.tradeSeason) - Number(a.tradeSeason)
    return b.tradeWeek - a.tradeWeek
  })
}

function parsePickLabel(label: string): {
  season: string
  round: number
  fromRosterId?: number
} | null {
  const m = /^(\d{2,4})\s+Rd\s+(\d+)/i.exec(label)
  if (!m) return null
  const yr = m[1].length === 2 ? `20${m[1]}` : m[1]
  return { season: yr, round: Number.parseInt(m[2], 10) }
}

/**
 * Picks this roster holds for the next draft years: its own picks it still
 * has, plus picks acquired in trades. Rounds follow league draft_rounds.
 */
export function picksOwnedByRoster(
  tradedPicks: SleeperTradedPick[],
  teams: Map<number, TeamInfo>,
  rosterId: number,
  baseSeason: string,
  yearsAhead = 3,
  draftRounds = 3,
): FuturePickRow[] {
  const windowPicks = picksInWindow(
    tradedPicks,
    baseSeason,
    yearsAhead,
    draftRounds,
  )
  const byOriginal = new Map<string, SleeperTradedPick>()
  for (const pick of windowPicks) {
    byOriginal.set(`${pick.season}:${pick.round}:${pick.roster_id}`, pick)
  }

  const seasons = futurePickSeasons(baseSeason, yearsAhead)
  const rows: FuturePickRow[] = []
  for (const season of seasons) {
    for (let round = 1; round <= draftRounds; round++) {
      const traded = byOriginal.get(`${season}:${round}:${rosterId}`)
      if (!traded || traded.owner_id === rosterId) {
        rows.push(pickRow(season, round, rosterId, rosterId, teams))
      }
    }
  }
  for (const pick of windowPicks) {
    if (pick.owner_id !== rosterId || pick.roster_id === rosterId) continue
    rows.push(pickRow(pick.season, pick.round, pick.roster_id, pick.owner_id, teams))
  }
  return sortPickRows(rows)
}

export function formatTradedPickHistory(
  row: TradedPickHistoryRow,
  teams: Map<number, TeamInfo>,
): string {
  const original = managerLabel(teams.get(row.originalRosterId), row.originalRosterId)
  const from = managerLabel(teams.get(row.fromRosterId), row.fromRosterId)
  const to = managerLabel(teams.get(row.toRosterId), row.toRosterId)
  return `${row.season} Rd ${row.round} (${original}'s pick) · ${from} → ${to}`
}

export function tradedPickHistoryFromTransactions(
  transactions: SleeperTransaction[],
  leagueSeason: string,
): TradedPickHistoryRow[] {
  const rows: TradedPickHistoryRow[] = []
  for (const tx of transactions) {
    if (tx.type !== 'trade' || tx.status !== 'complete') continue
    for (const pick of tx.draft_picks ?? []) {
      const to = pick.owner_id ?? pick.roster_id
      const from = pick.previous_owner_id ?? pick.roster_id
      rows.push({
        season: pick.season,
        round: pick.round,
        originalRosterId: pick.roster_id,
        fromRosterId: from,
        toRosterId: to,
        tradeSeason: leagueSeason,
        tradeWeek: tx.leg,
        dateLabel: tx.status_updated
          ? new Date(tx.status_updated).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : '',
        periodLabel: tradePeriodLabel(
          leagueSeason,
          tx.leg,
          tx.status_updated || 0,
        ),
      })
    }
  }
  return rows.sort(
    (a, b) =>
      Number(b.tradeSeason) - Number(a.tradeSeason) || b.tradeWeek - a.tradeWeek,
  )
}
