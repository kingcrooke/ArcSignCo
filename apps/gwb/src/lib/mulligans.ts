import ledgerJson from '../content/mulligan-ledger.json'

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
  netImpactPending?: boolean
  scoreWith: number
  scoreWithout: number
  opponentScore: number
  opponentLabel: string
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
  if (!entry.netImpactPending && !entry.in.pointsPending) return entry.netImpact
  const inPts = resolveInSwapPoints(entry.in, ctx)
  if (inPts === null) return null
  return inPts - entry.out.points
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

export function formatMulliganReceipt(
  entry: MulliganLedgerEntry,
  ctx?: MulliganLiveContext,
): string {
  const manager = entry.managerShort ?? entry.manager
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
    `${resultVerb} ${matchup} ${vsWord} ${entry.opponentLabel} ` +
    `(would've been ${formatScore(entry.scoreWithout)} without it) · ${flip}${tail}`
  )
}
