import { managerLabel } from './teams'
import type {
  SleeperDraft,
  SleeperDraftPick,
  SleeperTradedPick,
  SleeperTransaction,
  TeamInfo,
} from './types'
import { tradeWeekLabel, type TradeLogEntry } from './trades'

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
  weekLabel: string
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
    // A pick that sits with its original owner is not a traded pick.
    if (pick.owner_id === pick.roster_id) continue
    const original = teams.get(pick.roster_id)
    const owner = teams.get(pick.owner_id)
    rows.push({
      season: pick.season,
      round: pick.round,
      originalRosterId: pick.roster_id,
      ownerRosterId: pick.owner_id,
      originalLabel: original
        ? managerLabel(original, pick.roster_id)
        : `R${pick.roster_id}`,
      ownerLabel: owner
        ? managerLabel(owner, pick.owner_id)
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
          originalRosterId: parsed.fromRosterId ?? side.rosterId,
          fromRosterId: parsed.fromRosterId ?? side.rosterId,
          toRosterId: side.rosterId,
          tradeSeason: trade.season,
          tradeWeek: trade.week,
          weekLabel: trade.weekLabel,
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

function pickRow(
  pick: { season: string; round: number; roster_id: number; owner_id: number },
  teams: Map<number, TeamInfo>,
): FuturePickRow {
  const original = teams.get(pick.roster_id)
  const owner = teams.get(pick.owner_id)
  return {
    season: pick.season,
    round: pick.round,
    originalRosterId: pick.roster_id,
    ownerRosterId: pick.owner_id,
    originalLabel: original
      ? managerLabel(original, pick.roster_id)
      : `R${pick.roster_id}`,
    ownerLabel: owner ? managerLabel(owner, pick.owner_id) : `R${pick.owner_id}`,
  }
}

function sortPickRows(rows: FuturePickRow[]): FuturePickRow[] {
  return rows.sort((a, b) => {
    if (a.season !== b.season) return Number(a.season) - Number(b.season)
    if (a.round !== b.round) return a.round - b.round
    return a.originalRosterId - b.originalRosterId
  })
}

/**
 * Picks this roster holds for the next draft years: its own picks it has not
 * traded away, plus picks acquired from other rosters.
 */
export function picksOwnedByRoster(
  tradedPicks: SleeperTradedPick[],
  teams: Map<number, TeamInfo>,
  rosterId: number,
  baseSeason: string,
  yearsAhead = 3,
  draftRounds = 3,
): FuturePickRow[] {
  const seasons = futurePickSeasons(baseSeason, yearsAhead)
  const allowed = new Set(seasons)
  const relevant = tradedPicks.filter((p) => allowed.has(p.season))
  const rows: FuturePickRow[] = []

  for (const season of seasons) {
    for (let round = 1; round <= draftRounds; round++) {
      const moved = relevant.find(
        (p) => p.season === season && p.round === round && p.roster_id === rosterId,
      )
      const stillOwns = !moved || moved.owner_id === rosterId
      if (!stillOwns) continue
      rows.push(
        pickRow(
          { season, round, roster_id: rosterId, owner_id: rosterId },
          teams,
        ),
      )
    }
  }

  for (const pick of relevant) {
    if (pick.owner_id !== rosterId || pick.roster_id === rosterId) continue
    rows.push(pickRow(pick, teams))
  }

  return sortPickRows(rows)
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
        weekLabel: tradeWeekLabel(tx.leg, tx.status_updated, leagueSeason),
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
