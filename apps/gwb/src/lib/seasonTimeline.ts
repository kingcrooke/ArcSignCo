import { groupMatchupPairs } from './matchupBoard'
import { managerNickname } from './nicknames'
import type { MulliganLedgerEntry } from './mulligans'

/** Mulligans shown on the season timeline (commissioner-confirmed only). */
export const TIMELINE_MULLIGAN_ENTRY_IDS = new Set([
  'w1-mauricio',
  'w3-narking',
  'w3-danny',
  'w4-kayser',
])
import type { TradeLogEntry } from './trades'
import type { SleeperMatchup, TeamInfo } from './types'

export type TimelineEventKind = 'win' | 'loss' | 'tie' | 'mulligan' | 'trade'

export interface TimelineEvent {
  id: string
  kind: TimelineEventKind
  dateMs: number
  dateLabel: string
  week: number | null
  headline: string
  detail?: string
}

const ET = 'America/New_York'

function formatDay(ms: number): string {
  return new Date(ms).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: ET,
  })
}

function weekCloseMs(
  week: number,
  weekCloses: Map<number, number>,
): number {
  const close = weekCloses.get(week)
  if (close && close > 0) return close
  return week * 1_000_000
}

export function buildSeasonTimeline({
  season,
  matchupsByWeek,
  teams,
  mulliganEntries,
  trades,
  weekCloses,
}: {
  season: string
  matchupsByWeek: Map<number, SleeperMatchup[]>
  teams: Map<number, TeamInfo>
  mulliganEntries: MulliganLedgerEntry[]
  trades: TradeLogEntry[]
  weekCloses: Map<number, number>
}): TimelineEvent[] {
  const events: TimelineEvent[] = []

  for (let week = 1; week <= 18; week++) {
    const rows = matchupsByWeek.get(week)
    if (!rows?.length) continue
    const dateMs = weekCloseMs(week, weekCloses)
    const dateLabel = formatDay(dateMs)
    for (const { home, away } of groupMatchupPairs(rows)) {
      if (home.points <= 0 && away.points <= 0) continue
      const pairs = [
        { m: home, opp: away },
        { m: away, opp: home },
      ]
      for (const { m, opp } of pairs) {
        const name = managerNickname(m.roster_id, teams.get(m.roster_id)?.displayName ?? '')
        const oppName = managerNickname(opp.roster_id, teams.get(opp.roster_id)?.displayName ?? '')
        let kind: TimelineEventKind = 'tie'
        let headline = `${name} tied ${oppName}`
        if (m.points > opp.points) {
          kind = 'win'
          headline = `${name} beat ${oppName}`
        } else if (m.points < opp.points) {
          kind = 'loss'
          headline = `${name} lost to ${oppName}`
        }
        events.push({
          id: `w${week}-m${m.matchup_id}-r${m.roster_id}`,
          kind,
          dateMs,
          dateLabel,
          week,
          headline,
          detail: `${m.points.toFixed(2)}–${opp.points.toFixed(2)} · Week ${week}`,
        })
      }
    }
  }

  for (const entry of mulliganEntries) {
    if (!TIMELINE_MULLIGAN_ENTRY_IDS.has(entry.id)) continue
    const name =
      entry.managerShort ??
      managerNickname(entry.rosterId, entry.manager)
    events.push({
      id: `mulligan-${entry.rosterId}-w${entry.week}`,
      kind: 'mulligan',
      dateMs: entry.week * 1_000_000 + 500,
      dateLabel: `Week ${entry.week}`,
      week: entry.week,
      headline: `${name} used mulligan`,
      detail: entry.opponentLabel
        ? `vs ${entry.opponentLabel}${entry.flipped ? ' · flipped result' : ''}`
        : undefined,
    })
  }

  for (const trade of trades) {
    if (trade.season !== season) continue
    events.push({
      id: `trade-${trade.transactionId}`,
      kind: 'trade',
      dateMs: trade.completedAtMs,
      dateLabel: trade.dateLabel,
      week: trade.week,
      headline: `${trade.sideA.managerName} ↔ ${trade.sideB.managerName}`,
      detail: `${trade.season} · Week ${trade.week} trade`,
    })
  }

  return events.sort((a, b) => b.dateMs - a.dateMs)
}
