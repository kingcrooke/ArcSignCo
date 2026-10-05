import bestGamesJson from '../content/best-games.json'
import {
  resolveMulliganNetImpact,
  type MulliganLedgerEntry,
} from './mulligans'
import { groupMatchupPairs } from './matchupBoard'
import type { NflState, SleeperLeague, SleeperMatchup } from './types'
import { isWeekLive, lastCompletedWeek } from './weeks'

export type BestGameBadge = 'Nail-biter' | 'Shootout' | 'Upset' | 'Mulligan'

export interface GameScoreBreakdown {
  closeness: number
  shootout: number
  upsetUnits: number
  upsetBonus: number
  mulliganBonus: number
  composite: number
  margin: number
  combinedPoints: number
}

export interface RankedBestGame {
  rank: number
  week: number
  matchupId: number
  matchupKey: string
  home: SleeperMatchup
  away: SleeperMatchup
  winnerRosterId: number
  loserRosterId: number
  breakdown: GameScoreBreakdown
  badges: BestGameBadge[]
}

export interface BestGameContentEntry {
  week: number
  matchupKey: string
  videoUrl?: string
  thumbnail?: string
  status: 'draft' | 'live'
  highlights: string[]
}

interface BestGamesFile {
  entries: BestGameContentEntry[]
}

const content = bestGamesJson as BestGamesFile

export const BEST_GAMES_CONTENT: BestGameContentEntry[] = content.entries

export function makeMatchupKey(week: number, matchupId: number): string {
  return `${week}-${matchupId}`
}

export function contentForMatchup(
  matchupKey: string,
): BestGameContentEntry | undefined {
  return BEST_GAMES_CONTENT.find((e) => e.matchupKey === matchupKey)
}

export function youtubeEmbedUrl(videoUrl: string): string | null {
  try {
    const u = new URL(videoUrl)
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.replace(/^\//, '').split('/')[0]
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}`
      const embed = /^\/embed\/([^/?]+)/.exec(u.pathname)
      if (embed) return `https://www.youtube.com/embed/${embed[1]}`
    }
  } catch {
    return null
  }
  return null
}

interface WinLoss {
  wins: number
  losses: number
}

function recordsBeforeWeek(
  matchupsByWeek: Map<number, SleeperMatchup[]>,
  throughWeekExclusive: number,
): Map<number, WinLoss> {
  const records = new Map<number, WinLoss>()
  for (let week = 1; week < throughWeekExclusive; week++) {
    const matchups = matchupsByWeek.get(week)
    if (!matchups?.length) continue
    for (const { home, away } of groupMatchupPairs(matchups)) {
      const ha = records.get(home.roster_id) ?? { wins: 0, losses: 0 }
      const aa = records.get(away.roster_id) ?? { wins: 0, losses: 0 }
      if (home.points > away.points) {
        ha.wins++
        aa.losses++
      } else if (away.points > home.points) {
        aa.wins++
        ha.losses++
      }
      records.set(home.roster_id, ha)
      records.set(away.roster_id, aa)
    }
  }
  return records
}

function mulligansInMatchup(
  week: number,
  homeRosterId: number,
  awayRosterId: number,
  ledger: MulliganLedgerEntry[],
): MulliganLedgerEntry[] {
  return ledger.filter(
    (e) =>
      e.week === week &&
      (e.rosterId === homeRosterId || e.rosterId === awayRosterId),
  )
}

function swapChangedWinner(entry: MulliganLedgerEntry): boolean {
  const wouldWin = entry.scoreWithout > entry.opponentScore
  return wouldWin !== entry.won
}

export function computeMulliganBonus(
  margin: number,
  entries: MulliganLedgerEntry[],
): number {
  if (!entries.length) return 0
  let bonus = 0
  let closeGameBonus = false
  for (const entry of entries) {
    if (entry.flipped) bonus += 30
    const net = resolveMulliganNetImpact(entry)
    if (net !== null && margin < Math.abs(net) && swapChangedWinner(entry)) {
      bonus += 20
    }
  }
  if (margin < 15 && entries.length > 0) closeGameBonus = true
  if (closeGameBonus) bonus += 10
  return bonus
}

export function computeGameBreakdown(
  home: SleeperMatchup,
  away: SleeperMatchup,
  week: number,
  recordsBefore: Map<number, WinLoss>,
  ledger: MulliganLedgerEntry[],
): GameScoreBreakdown {
  const margin = Math.abs(home.points - away.points)
  const combinedPoints = home.points + away.points
  const closeness = Math.max(0, 40 - margin)
  const shootout = combinedPoints / 5

  const winner =
    home.points >= away.points ? home.roster_id : away.roster_id
  const loser = winner === home.roster_id ? away.roster_id : home.roster_id
  const winnerRec = recordsBefore.get(winner) ?? { wins: 0, losses: 0 }
  const loserRec = recordsBefore.get(loser) ?? { wins: 0, losses: 0 }
  const upsetUnits = Math.max(0, winnerRec.losses - loserRec.wins)
  const upsetBonus = 12 * upsetUnits

  const mulliganEntries = mulligansInMatchup(
    week,
    home.roster_id,
    away.roster_id,
    ledger,
  )
  const mulliganBonus = computeMulliganBonus(margin, mulliganEntries)

  const composite = closeness + shootout + upsetBonus + mulliganBonus

  return {
    closeness,
    shootout,
    upsetUnits,
    upsetBonus,
    mulliganBonus,
    composite,
    margin,
    combinedPoints,
  }
}

export function badgesForBreakdown(
  breakdown: GameScoreBreakdown,
): BestGameBadge[] {
  const badges: BestGameBadge[] = []
  if (breakdown.margin <= 10) badges.push('Nail-biter')
  if (breakdown.combinedPoints >= 270) badges.push('Shootout')
  if (breakdown.upsetBonus > 0) badges.push('Upset')
  if (breakdown.mulliganBonus > 0) badges.push('Mulligan')
  return badges
}

export function rankBestGames(
  matchupsByWeek: Map<number, SleeperMatchup[]>,
  league: SleeperLeague,
  nflState: NflState,
  ledger: MulliganLedgerEntry[],
  limit = 6,
): RankedBestGame[] {
  const completedThrough = lastCompletedWeek(league, nflState)
  const candidates: Omit<RankedBestGame, 'rank'>[] = []

  for (let week = 1; week <= completedThrough; week++) {
    if (isWeekLive(week, league, nflState)) continue
    const matchups = matchupsByWeek.get(week)
    if (!matchups?.length) continue
    const recordsBefore = recordsBeforeWeek(matchupsByWeek, week)
    for (const { matchupId, home, away } of groupMatchupPairs(matchups)) {
      const breakdown = computeGameBreakdown(
        home,
        away,
        week,
        recordsBefore,
        ledger,
      )
      const winnerRosterId =
        home.points >= away.points ? home.roster_id : away.roster_id
      const loserRosterId =
        winnerRosterId === home.roster_id ? away.roster_id : home.roster_id
      candidates.push({
        week,
        matchupId,
        matchupKey: makeMatchupKey(week, matchupId),
        home,
        away,
        winnerRosterId,
        loserRosterId,
        breakdown,
        badges: badgesForBreakdown(breakdown),
      })
    }
  }

  candidates.sort((a, b) => {
    if (b.breakdown.composite !== a.breakdown.composite) {
      return b.breakdown.composite - a.breakdown.composite
    }
    if (a.breakdown.margin !== b.breakdown.margin) {
      return a.breakdown.margin - b.breakdown.margin
    }
    return b.breakdown.combinedPoints - a.breakdown.combinedPoints
  })

  return candidates.slice(0, limit).map((g, i) => ({ ...g, rank: i + 1 }))
}
