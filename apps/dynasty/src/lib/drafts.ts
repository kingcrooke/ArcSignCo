import { managerDisplayName } from './nicknames'
import type {
  SleeperDraft,
  SleeperDraftPick,
  SleeperTradedPick,
  SleeperTransaction,
  TeamInfo,
} from './types'
import type { TradeLogEntry } from './trades'

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
  fromRosterId: number
  toRosterId: number
  tradeSeason: string
  tradeWeek: number
  dateLabel: string
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

export function futurePickOwnership(
  tradedPicks: SleeperTradedPick[],
  teams: Map<number, TeamInfo>,
  baseSeason: string,
  yearsAhead = 3,
): FuturePickRow[] {
  const allowed = new Set(futurePickSeasons(baseSeason, yearsAhead))
  const rows: FuturePickRow[] = []
  for (const pick of tradedPicks) {
    if (!allowed.has(pick.season)) continue
    const original = teams.get(pick.roster_id)
    const owner = teams.get(pick.owner_id)
    rows.push({
      season: pick.season,
      round: pick.round,
      originalRosterId: pick.roster_id,
      ownerRosterId: pick.owner_id,
      originalLabel: original
        ? managerDisplayName(original.userId, original.displayName)
        : `R${pick.roster_id}`,
      ownerLabel: owner
        ? managerDisplayName(owner.userId, owner.displayName)
        : `R${pick.owner_id}`,
    })
  }
  return rows.sort((a, b) => {
    if (a.season !== b.season) return Number(a.season) - Number(b.season)
    if (a.round !== b.round) return a.round - b.round
    return a.originalRosterId - b.originalRosterId
  })
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
          fromRosterId: parsed.fromRosterId ?? side.rosterId,
          toRosterId: side.rosterId,
          tradeSeason: trade.season,
          tradeWeek: trade.week,
          dateLabel: trade.dateLabel,
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

export function picksOwnedByRoster(
  tradedPicks: SleeperTradedPick[],
  teams: Map<number, TeamInfo>,
  rosterId: number,
  baseSeason: string,
  yearsAhead = 3,
): FuturePickRow[] {
  return futurePickOwnership(
    tradedPicks,
    teams,
    baseSeason,
    yearsAhead,
  ).filter((r) => r.ownerRosterId === rosterId)
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
      })
    }
  }
  return rows.sort(
    (a, b) =>
      Number(b.tradeSeason) - Number(a.tradeSeason) || b.tradeWeek - a.tradeWeek,
  )
}
