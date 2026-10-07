import ledgerJson from '../content/mulligan-ledger.json'
import { managerNickname } from './nicknames'
import type { NflState, SleeperLeague } from './types'
import { isWeekLive, lastCompletedWeek } from './weeks'

/** One mulligan per manager per season (league rule). */
export interface MulliganStatus {
  rosterId: number
  used: boolean
  usedDetail?: string
}

export interface MulliganPlayerSwap {
  name: string
  position: string
  points: number
  note?: string
  team?: string
  pointsPending?: boolean
  sleeperPlayerId?: string
}

export interface MulliganLedgerEntry {
  id: string
  week: number
  rosterId: number
  manager: string
  managerShort?: string
  team: string
  out: MulliganPlayerSwap
  in: MulliganPlayerSwap
  netImpact: number
  /** When IN was already starting, net ≠ IN − OUT; use this for all displayed nets. */
  netImpactOverride?: number
  netImpactPending?: boolean
  scoreWith: number
  scoreWithout: number
  opponentScore: number
  opponentLabel: string
  opponentRosterId?: number
  won: boolean
  flipped: boolean
  resultPending?: boolean
  footnote?: string
}

export interface MulliganLiveContext {
  playerPoints?: Record<string, number>
}

interface MulliganLedgerFile {
  throughWeek: number
  weekNote: string
  entries: MulliganLedgerEntry[]
}

const ledgerData = ledgerJson as MulliganLedgerFile

export const MULLIGAN_LEDGER_ENTRIES: MulliganLedgerEntry[] = ledgerData.entries

export const MULLIGAN_LEDGER_META = {
  throughWeek: ledgerData.throughWeek,
  weekNote: ledgerData.weekNote,
}

export function mulliganLedgerEntries(): MulliganLedgerEntry[] {
  return [...MULLIGAN_LEDGER_ENTRIES].sort(
    (a, b) => a.week - b.week || a.rosterId - b.rosterId,
  )
}

export function mulliganForRoster(rosterId: number): MulliganLedgerEntry | undefined {
  return MULLIGAN_LEDGER_ENTRIES.find((e) => e.rosterId === rosterId)
}

export function mulliganForRosterThroughWeek(
  rosterId: number,
  throughWeek: number,
): MulliganLedgerEntry | undefined {
  return MULLIGAN_LEDGER_ENTRIES.find(
    (e) => e.rosterId === rosterId && e.week <= throughWeek,
  )
}

export function mulliganStatusForRoster(
  rosterId: number,
  throughWeek = Number.POSITIVE_INFINITY,
): MulliganStatus {
  const entry = mulliganForRosterThroughWeek(rosterId, throughWeek)
  if (!entry) {
    return { rosterId, used: false }
  }
  return {
    rosterId,
    used: true,
    usedDetail: `Week ${entry.week} — ${formatSwapSummary(entry)}`,
  }
}

export function mulliganLiveContextForEntry(
  entry: MulliganLedgerEntry,
  playerPoints?: Record<string, number>,
): MulliganLiveContext | undefined {
  if (!entry.in.pointsPending || !playerPoints) return undefined
  return { playerPoints }
}

export function mulliganEntriesForWeek(week: number): MulliganLedgerEntry[] {
  return MULLIGAN_LEDGER_ENTRIES.filter((e) => e.week === week).sort(
    (a, b) => a.rosterId - b.rosterId,
  )
}

export function mulligansUsedThroughWeek(throughWeek: number): number {
  return MULLIGAN_LEDGER_ENTRIES.filter((e) => e.week <= throughWeek).length
}

export function mulligansFlippedThroughWeek(throughWeek: number): number {
  return MULLIGAN_LEDGER_ENTRIES.filter(
    (e) => e.week <= throughWeek && e.flipped,
  ).length
}

export function resolveInSwapPoints(
  swap: MulliganPlayerSwap,
  ctx?: MulliganLiveContext,
): number | null {
  if (!swap.pointsPending) return swap.points
  const id = swap.sleeperPlayerId
  if (ctx?.playerPoints && id && id in ctx.playerPoints) {
    return ctx.playerPoints[id]
  }
  return null
}

export function resolveMulliganNetImpact(
  entry: MulliganLedgerEntry,
  ctx?: MulliganLiveContext,
): number | null {
  if (entry.netImpactPending || entry.in.pointsPending) {
    const inPts = resolveInSwapPoints(entry.in, ctx)
    if (inPts === null) return null
    return inPts - entry.out.points
  }
  if (entry.netImpactOverride !== undefined) return entry.netImpactOverride
  return entry.netImpact
}

function formatSwapPoints(
  swap: MulliganPlayerSwap,
  ctx?: MulliganLiveContext,
): string {
  if (swap.pointsPending) {
    const live = resolveInSwapPoints(swap, ctx)
    if (live !== null) return `${formatScore(live)} (live)`
    return 'pending'
  }
  return formatScore(swap.points)
}

function formatNetImpact(
  entry: MulliganLedgerEntry,
  ctx?: MulliganLiveContext,
): string {
  const net = resolveMulliganNetImpact(entry, ctx)
  if (net === null) return 'pending'
  return formatSignedImpact(net)
}

function resolveScoreWith(
  entry: MulliganLedgerEntry,
  ctx?: MulliganLiveContext,
): number {
  const net = resolveMulliganNetImpact(entry, ctx)
  if (net === null) return entry.scoreWith
  return entry.scoreWithout + net
}

export type MulliganStatusParts =
  | { used: false }
  | {
      used: true
      week: number
      outLine: string
      inLine: string
      netLine: string
    }

/** Stacked status copy: name block, then OUT / IN / net on their own lines. */
export function mulliganStatusParts(
  rosterId: number,
  throughWeek = Number.POSITIVE_INFINITY,
): MulliganStatusParts {
  const entry = mulliganForRosterThroughWeek(rosterId, throughWeek)
  if (!entry) return { used: false }
  const outNote = entry.out.note ? ` (${entry.out.note})` : ''
  return {
    used: true,
    week: entry.week,
    outLine: `OUT ${entry.out.name} ${formatScore(entry.out.points)}${outNote}`,
    inLine: `IN ${entry.in.name} ${formatSwapPoints(entry.in)}`,
    netLine: `Net ${formatNetImpact(entry)}`,
  }
}

export type MulliganReceiptParts = {
  manager: string
  outLine: string
  inLine: string
  netLine: string
  resultLine: string
  versusLine: string
  withoutLine: string
  flipLine: string
  footnote?: string
}

/** Week-detail card copy, one fact per line. */
function receiptManagerName(entry: MulliganLedgerEntry): string {
  return managerNickname(
    entry.rosterId,
    entry.managerShort ?? entry.manager,
  )
}

function receiptOpponentName(entry: MulliganLedgerEntry): string {
  if (entry.opponentRosterId != null) {
    return managerNickname(entry.opponentRosterId, entry.opponentLabel)
  }
  return entry.opponentLabel
}

export function mulliganReceiptParts(
  entry: MulliganLedgerEntry,
  ctx?: MulliganLiveContext,
): MulliganReceiptParts {
  const manager = receiptManagerName(entry)
  const opponent = receiptOpponentName(entry)
  const outNote = entry.out.note ? ` (${entry.out.note})` : ''
  const result = entry.resultPending ? 'TBD' : entry.won ? 'W' : 'L'
  const scoreWith = resolveScoreWith(entry, ctx)
  const resultVerb = entry.resultPending
    ? 'Result TBD'
    : entry.won
      ? 'Won'
      : 'Lost'
  const vsWord = entry.resultPending || entry.won ? 'vs' : 'to'
  const flip = entry.flipped ? 'Flipped the result' : 'No flip'
  return {
    manager,
    outLine: `OUT ${entry.out.name} ${formatScore(entry.out.points)}${outNote}`,
    inLine: `IN ${entry.in.name} ${formatSwapPoints(entry.in, ctx)}`,
    netLine: `Net ${formatNetImpact(entry, ctx)}`,
    resultLine: `${result} ${formatScore(scoreWith)}–${formatScore(entry.opponentScore)}`,
    versusLine: `${resultVerb} ${vsWord} ${opponent}`,
    withoutLine: `Would've been ${formatScore(entry.scoreWithout)} without it`,
    flipLine: flip,
    footnote: entry.footnote,
  }
}

export function formatMulliganReceipt(
  entry: MulliganLedgerEntry,
  ctx?: MulliganLiveContext,
): string {
  const manager = receiptManagerName(entry)
  const outNote = entry.out.note ? ` (${entry.out.note})` : ''
  const result = entry.resultPending ? 'TBD' : entry.won ? 'W' : 'L'
  const scoreWith = resolveScoreWith(entry, ctx)
  return (
    `${manager} · OUT ${entry.out.name} ${formatScore(entry.out.points)}${outNote} → ` +
    `IN ${entry.in.name} ${formatSwapPoints(entry.in, ctx)} · ` +
    `Net ${formatNetImpact(entry, ctx)} · ${result} ${formatScore(scoreWith)}–${formatScore(entry.opponentScore)}`
  )
}

export function mulliganLabel(status: MulliganStatus): string {
  if (!status.used) return 'Available'
  return status.usedDetail ? `Used — ${status.usedDetail}` : 'Used'
}

function formatScore(n: number): string {
  return n.toFixed(2)
}

function formatSignedImpact(n: number): string {
  const sign = n >= 0 ? '+' : '−'
  return `${sign}${formatScore(Math.abs(n))}`
}

function formatSwapSummary(
  entry: MulliganLedgerEntry,
  ctx?: MulliganLiveContext,
): string {
  return `${entry.out.name} → ${entry.in.name} (${formatNetImpact(entry, ctx)})`
}

export function mulliganStatusThroughWeek(
  standingsThroughWeek: number,
  selectedWeek: number,
): number {
  const ledgerWeek = MULLIGAN_LEDGER_META.throughWeek
  return Math.max(
    standingsThroughWeek,
    Math.min(selectedWeek, ledgerWeek),
  )
}

export function mulligansDeferralNote(
  selectedWeek: number,
  league: SleeperLeague,
  nflState: NflState,
  standingsThroughWeek: number,
): string | null {
  if (!isWeekLive(selectedWeek, league, nflState)) return null
  const mulliganThrough = mulliganStatusThroughWeek(
    standingsThroughWeek,
    selectedWeek,
  )
  const scoredThrough = lastCompletedWeek(league, nflState)
  if (mulliganThrough > scoredThrough) {
    return `Week ${selectedWeek} in progress. Mulligan status live through Week ${mulliganThrough}.`
  }
  return `Week ${selectedWeek} in progress, mulligan status through Week ${mulliganThrough}.`
}

export function formatMulliganLedgerLine(
  entry: MulliganLedgerEntry,
  ctx?: MulliganLiveContext,
): string {
  const manager = entry.managerShort
    ? `${entry.manager} / ${entry.managerShort}`
    : entry.manager
  const outNote = entry.out.note ? ` (${entry.out.note})` : ''
  const scoreWith = resolveScoreWith(entry, ctx)
  const matchup = `${formatScore(scoreWith)}–${formatScore(entry.opponentScore)}`
  const resultVerb = entry.resultPending
    ? 'Result TBD'
    : entry.won
      ? 'Won'
      : 'Lost'
  const vsWord = entry.resultPending || entry.won ? 'vs' : 'to'
  const flip = entry.flipped ? 'Flipped result' : 'No flip'
  const tail = entry.footnote ? ` · ${entry.footnote}` : ''
  const outTeam = entry.out.team ? ` ${entry.out.team}` : ''
  const inTeam = entry.in.team ? ` ${entry.in.team}` : ''
  return (
    `W${entry.week} · ${manager} (${entry.team}) · ` +
    `OUT ${entry.out.name} ${entry.out.position}${outTeam} ${formatScore(entry.out.points)}${outNote} → ` +
    `IN ${entry.in.name} ${entry.in.position}${inTeam} ${formatSwapPoints(entry.in, ctx)} · ` +
    `Net ${formatNetImpact(entry, ctx)} · ` +
    `${resultVerb} ${matchup} ${vsWord} ${receiptOpponentName(entry)} ` +
    `(would've been ${formatScore(entry.scoreWithout)} without it) · ${flip}${tail}`
  )
}
