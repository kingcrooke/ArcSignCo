/** One mulligan per manager per season (league rule). */
export interface MulliganStatus {
  rosterId: number
  used: boolean
  usedDetail?: string
}

/** Confirmed mulligan uses only — do not mark others without evidence. */
export const MULLIGAN_USED_BY_ROSTER: Record<number, string> = {
  11: 'Week 4 swap (counts as mulligan)', // Danny · GetThePapers2x
  12: 'Week 1 (barely worked)', // Mauricio · SeasonUnderdogs
}

export function mulliganForRoster(rosterId: number): MulliganStatus {
  const usedDetail = MULLIGAN_USED_BY_ROSTER[rosterId]
  return {
    rosterId,
    used: Boolean(usedDetail),
    usedDetail,
  }
}

export function mulliganLabel(status: MulliganStatus): string {
  if (!status.used) return 'Available'
  return status.usedDetail ? `Used — ${status.usedDetail}` : 'Used'
}
