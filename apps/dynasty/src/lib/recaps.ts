import { biggestBenchMiss } from './benchMiss'
import { parsePostedAt } from './datetime'
import type {
  MatchupRecap,
  PlayersMap,
  SleeperMatchup,
  StandingRow,
  TeamInfo,
} from './types'

const BLOWOUT_MARGIN = 40
const UPSET_RANK_GAP = 3

function playerPlainName(id: string, players: PlayersMap): string {
  const p = players[id]
  return p?.full_name?.trim() || 'Player'
}

function topStarter(
  m: SleeperMatchup,
  players: PlayersMap,
): { name: string; points: number } | null {
  let best: { name: string; points: number } | null = null
  m.starters.forEach((pid, i) => {
    const pts = m.starters_points[i] ?? 0
    if (!best || pts > best.points) {
      best = { name: playerPlainName(pid, players), points: pts }
    }
  })
  return best
}

function preWeekRank(
  rosterId: number,
  standings: StandingRow[],
): number {
  return standings.find((s) => s.rosterId === rosterId)?.rank ?? 99
}

function buildScorerLines(
  teamAName: string,
  teamBName: string,
  aPts: number,
  bPts: number,
  topA: { name: string; points: number } | null,
  topB: { name: string; points: number } | null,
): string[] {
  const aWins = aPts >= bPts
  const lines: string[] = []
  const wTop = aWins ? topA : topB
  const wTeam = aWins ? teamAName : teamBName
  const lTop = aWins ? topB : topA
  const lTeam = aWins ? teamBName : teamAName
  if (wTop) lines.push(`${wTeam}: ${wTop.name} ${wTop.points.toFixed(1)}`)
  if (lTop) lines.push(`${lTeam}: ${lTop.name} ${lTop.points.toFixed(1)}`)
  return lines
}

function buildStarsLine(lines: string[]): string | undefined {
  if (!lines.length) return undefined
  if (lines.length === 1) return `Top scorer — ${lines[0]}`
  return `Top scorers — ${lines.join(' · ')}`
}

function displayMargin(aPts: number, bPts: number): string {
  const a = Math.round(aPts * 10) / 10
  const b = Math.round(bPts * 10) / 10
  return Math.abs(a - b).toFixed(1)
}

function buildNarrative(
  aName: string,
  bName: string,
  aPts: number,
  bPts: number,
  tags: string[],
  isLive: boolean,
): string {
  const leader = aPts >= bPts ? aName : bName
  const trailer = aPts >= bPts ? bName : aName
  const margin = displayMargin(aPts, bPts)
  if (isLive) {
    return `${leader} is leading ${trailer} by ${margin} points.`
  }
  const tagLine = tags.length ? ` ${tags.join(' · ')}.` : ''
  return `${leader} topped ${trailer} by ${margin} points.${tagLine}`
}

export interface BuildWeekRecapsOptions {
  rosterPositions: string[]
  preWeekStandings: StandingRow[]
  isWeekFinal: boolean
}

export function buildWeekRecaps(
  matchups: SleeperMatchup[],
  teams: Map<number, TeamInfo>,
  players: PlayersMap,
  options: BuildWeekRecapsOptions,
): MatchupRecap[] {
  const { rosterPositions, preWeekStandings, isWeekFinal } = options
  const byMatch = new Map<number, SleeperMatchup[]>()
  for (const m of matchups) {
    const list = byMatch.get(m.matchup_id) ?? []
    list.push(m)
    byMatch.set(m.matchup_id, list)
  }

  const recaps: MatchupRecap[] = []
  for (const [matchupId, pair] of byMatch) {
    if (pair.length < 2) continue
    const [a, b] = pair
    const teamA = teams.get(a.roster_id)
    const teamB = teams.get(b.roster_id)
    const margin = Math.abs(a.points - b.points)
    const winnerRosterId = a.points >= b.points ? a.roster_id : b.roster_id
    const tags: string[] = []
    if (isWeekFinal && margin >= BLOWOUT_MARGIN) tags.push('Blowout')
    if (isWeekFinal) {
      const rankA = preWeekRank(a.roster_id, preWeekStandings)
      const rankB = preWeekRank(b.roster_id, preWeekStandings)
      const winnerRank = a.points >= b.points ? rankA : rankB
      const loserRank = a.points >= b.points ? rankB : rankA
      if (winnerRank - loserRank >= UPSET_RANK_GAP) tags.push('Upset')
    }

    const topA = topStarter(a, players)
    const topB = topStarter(b, players)
    const scorerLines = buildScorerLines(
      teamA?.teamName ?? 'Team A',
      teamB?.teamName ?? 'Team B',
      a.points,
      b.points,
      topA,
      topB,
    )

    recaps.push({
      matchupId,
      teamA: {
        rosterId: a.roster_id,
        teamName: teamA?.teamName ?? `Team ${a.roster_id}`,
        points: a.points,
        topScorer: topA,
        benchMiss: biggestBenchMiss(a, rosterPositions, players),
      },
      teamB: {
        rosterId: b.roster_id,
        teamName: teamB?.teamName ?? `Team ${b.roster_id}`,
        points: b.points,
        topScorer: topB,
        benchMiss: biggestBenchMiss(b, rosterPositions, players),
      },
      margin,
      winnerRosterId,
      tags,
      narrative: buildNarrative(
        teamA?.teamName ?? 'Team A',
        teamB?.teamName ?? 'Team B',
        a.points,
        b.points,
        tags,
        !isWeekFinal,
      ),
      scorerLines,
      starsLine: buildStarsLine(scorerLines),
      isMatchupOfTheWeek: false,
    })
  }

  if (recaps.length) {
    const motw = recaps.reduce((best, r) =>
      r.margin > best.margin ? r : best,
    )
    motw.isMatchupOfTheWeek = true
  }

  return recaps.sort((x, y) => x.matchupId - y.matchupId)
}

export function weekHasMatchups(matchups: SleeperMatchup[] | undefined): boolean {
  if (!matchups?.length) return false
  return matchups.some((m) => m.starters?.length > 0)
}

/** Commissioner chat recap (hidden GWB page). */
export type CommissionerRecapLabel =
  | 'Predictions'
  | 'Waivers'
  | 'Thursday'
  | 'Saturday'
  | 'Sunday'
  | 'Monday Morning'
  | 'Monday Night'
  | 'Final'
  | 'Correction'

export type CommissionerRecap = {
  id: string
  index: number
  title: string
  week: number
  label: CommissionerRecapLabel
  /** ISO date or date-time for chronological sort within a week. */
  postedAt: string
  reconstructed?: boolean
  bodyMarkdown: string
}

const COMMISSIONER_LABEL_ORDER: Record<CommissionerRecapLabel, number> = {
  Waivers: 20,
  Predictions: 30,
  Thursday: 40,
  Saturday: 50,
  Sunday: 60,
  'Monday Morning': 70,
  'Monday Night': 80,
  Final: 90,
  Correction: 100,
}

const CHIP_LABEL: Record<CommissionerRecapLabel, string> = {
  Predictions: 'Predictions',
  Waivers: 'Waivers',
  Thursday: 'Thursday',
  Saturday: 'Saturday',
  Sunday: 'Sunday',
  'Monday Morning': 'Monday',
  'Monday Night': 'Monday Night',
  Final: 'Final',
  Correction: 'Correction',
}

export function commissionerRecapChipLabel(
  label: CommissionerRecapLabel,
): string {
  return CHIP_LABEL[label]
}

export function inferCommissionerRecapLabel(
  title: string,
): CommissionerRecapLabel {
  const t = title.toUpperCase()
  if (t.includes('CORRECTION') || t.includes('AI CORRECTION')) {
    return 'Correction'
  }
  if (t.includes('FINAL REPORT')) return 'Final'
  if (/\bWEEK\s*1\b/.test(t) && t.includes('RECAP')) return 'Final'
  if (t.includes('MULLIGAN WATCH')) return 'Monday Night'
  if (t.includes('MONDAY NIGHT REPORT')) return 'Monday Night'
  if (t.includes('MONDAY MORNING')) return 'Monday Morning'
  if (t.includes('SUNDAY MORNING') || t.includes('SUNDAY CHECK')) {
    return 'Sunday'
  }
  if (t.includes('SATURDAY NIGHT') || t.includes('SATURDAY')) {
    return 'Saturday'
  }
  if (
    t.includes('FRIDAY MORNING') ||
    t.includes('THURSDAY') ||
    t.includes('FRIDAY')
  ) {
    return 'Thursday'
  }
  if (t.includes('WAIVER') || t.includes('POST-WAIVER')) return 'Waivers'
  if (
    t.includes('PREDICTION') ||
    t.includes('CRYSTAL BALL') ||
    t.includes('CHECKPOINT')
  ) {
    return 'Predictions'
  }
  return 'Final'
}

/**
 * Weeks 1–3 read oldest-first (a timeline).
 * From Week 4 on, the newest post is first so a final report sits above
 * earlier posts in that week. A higher index wins remaining ties.
 */
function newestFirstWeek(a: CommissionerRecap, b: CommissionerRecap): boolean {
  return a.week === b.week && a.week >= 4
}

export function compareCommissionerRecaps(
  a: CommissionerRecap,
  b: CommissionerRecap,
): number {
  const newestFirst = newestFirstWeek(a, b)
  const timeA = parsePostedAt(a.postedAt)
  const timeB = parsePostedAt(b.postedAt)
  if (timeA !== timeB) return newestFirst ? timeB - timeA : timeA - timeB
  const orderA = COMMISSIONER_LABEL_ORDER[a.label] ?? 50
  const orderB = COMMISSIONER_LABEL_ORDER[b.label] ?? 50
  if (orderA !== orderB) return newestFirst ? orderB - orderA : orderA - orderB
  return newestFirst ? b.index - a.index : a.index - b.index
}

export function sortCommissionerRecaps(
  recaps: CommissionerRecap[],
): CommissionerRecap[] {
  return [...recaps].sort(compareCommissionerRecaps)
}

export function filterCommissionerRecapsByWeek(
  recaps: CommissionerRecap[],
  week: number,
): CommissionerRecap[] {
  return sortCommissionerRecaps(recaps.filter((r) => r.week === week))
}

function normalizeExcerptLine(line: string): string {
  return line
    .replace(/^#+\s*/, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .trim()
}

/** Plain-text preview for collapsed recap cards (no markdown). */
export function commissionerRecapExcerpt(
  bodyMarkdown: string,
  maxLines = 3,
  title?: string,
): string {
  const titleNorm = title ? normalizeExcerptLine(title).toLowerCase() : ''
  const lines = bodyMarkdown
    .split('\n')
    .map(normalizeExcerptLine)
    .filter(
      (line) =>
        line.length > 0 &&
        line !== '⸻' &&
        !line.startsWith('---') &&
        !/^🦬+$/.test(line),
    )
  const filtered =
    titleNorm && lines[0]?.toLowerCase() === titleNorm ? lines.slice(1) : lines
  return filtered.slice(0, maxLines).join(' ')
}
