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
  scoreWith: number
  scoreWithout: number
  opponentScore: number
  opponentLabel: string
  won: boolean
  flipped: boolean
  footnote?: string
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

export function mulliganEntriesForWeek(week: number): MulliganLedgerEntry[] {
  return MULLIGAN_LEDGER_ENTRIES.filter((e) => e.week === week).sort(
    (a, b) => a.rosterId - b.rosterId,
  )
}

export function mulligansUsedThroughWeek(throughWeek: number): number {
  return MULLIGAN_LEDGER_ENTRIES.filter((e) => e.week <= throughWeek).length
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

function formatSwapSummary(entry: MulliganLedgerEntry): string {
  return `${entry.out.name} → ${entry.in.name} (${formatSignedImpact(entry.netImpact)})`
}

export function formatMulliganLedgerLine(entry: MulliganLedgerEntry): string {
  const manager = entry.managerShort
    ? `${entry.manager} / ${entry.managerShort}`
    : entry.manager
  const outNote = entry.out.note ? ` (${entry.out.note})` : ''
  const matchup = `${formatScore(entry.scoreWith)}–${formatScore(entry.opponentScore)}`
  const resultVerb = entry.won ? 'Won' : 'Lost'
  const vsWord = entry.won ? 'vs' : 'to'
  const flip = entry.flipped ? 'Flipped result' : 'No flip'
  const tail = entry.footnote ? ` · ${entry.footnote}` : ''
  return (
    `W${entry.week} · ${manager} (${entry.team}) · ` +
    `OUT ${entry.out.name} ${entry.out.position} ${formatScore(entry.out.points)}${outNote} → ` +
    `IN ${entry.in.name} ${entry.in.position} ${formatScore(entry.in.points)} · ` +
    `Net ${formatSignedImpact(entry.netImpact)} · ` +
    `${resultVerb} ${matchup} ${vsWord} ${entry.opponentLabel} ` +
    `(would've been ${formatScore(entry.scoreWithout)} without it) · ${flip}${tail}`
  )
}
