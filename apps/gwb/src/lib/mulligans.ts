import ledgerJson from '../content/mulligan-ledger.json'

/** One mulligan per manager per season (league rule). */
export interface MulliganStatus {
  rosterId: number
  used: boolean
  usedDetail?: string
}

export type MulliganVisibility = 'published' | 'pending'

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
  visibility: MulliganVisibility
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

export function publishedMulliganEntries(): MulliganLedgerEntry[] {
  return MULLIGAN_LEDGER_ENTRIES.filter((e) => e.visibility === 'published').sort(
    (a, b) => a.week - b.week || a.rosterId - b.rosterId,
  )
}

export function pendingMulliganEntries(): MulliganLedgerEntry[] {
  return MULLIGAN_LEDGER_ENTRIES.filter((e) => e.visibility === 'pending')
}

export function publishedMulliganForRoster(
  rosterId: number,
): MulliganLedgerEntry | undefined {
  return publishedMulliganEntries().find((e) => e.rosterId === rosterId)
}

export function mulliganForRoster(rosterId: number): MulliganStatus {
  const entry = publishedMulliganForRoster(rosterId)
  if (!entry) {
    return { rosterId, used: false }
  }
  return {
    rosterId,
    used: true,
    usedDetail: `Week ${entry.week} — ${formatSwapSummary(entry)}`,
  }
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
  const matchup = entry.won
    ? `${formatScore(entry.scoreWith)}–${formatScore(entry.opponentScore)}`
    : `${formatScore(entry.opponentScore)}–${formatScore(entry.scoreWith)}`
  const resultVerb = entry.won ? 'Won' : 'Lost'
  const vsWord = entry.won ? 'vs' : 'to'
  const flip = entry.flipped ? 'Flipped result' : 'No flip'
  return (
    `W${entry.week} · ${manager} (${entry.team}) · ` +
    `OUT ${entry.out.name} ${entry.out.position} ${formatScore(entry.out.points)}${outNote} → ` +
    `IN ${entry.in.name} ${entry.in.position} ${formatScore(entry.in.points)} · ` +
    `Net ${formatSignedImpact(entry.netImpact)} · ` +
    `${resultVerb} ${matchup} ${vsWord} ${entry.opponentLabel} ` +
    `(would've been ${formatScore(entry.scoreWithout)} without it) · ${flip}`
  )
}
