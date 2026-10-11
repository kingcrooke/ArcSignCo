import type { SleeperLeague, SleeperRoster } from './types'

export interface FaabSnapshot {
  budget: number
  spent: number
  remaining: number
}

const DEFAULT_FAAB_BUDGET = 100

export function leagueFaabBudget(league: SleeperLeague): number {
  const raw = league.settings?.waiver_budget
  return typeof raw === 'number' && Number.isFinite(raw) ? raw : DEFAULT_FAAB_BUDGET
}

/** Live FAAB from Sleeper roster.settings.waiver_budget_used (per season league). */
export function faabByRoster(
  league: SleeperLeague,
  rosters: SleeperRoster[],
): Map<number, FaabSnapshot> {
  const budget = leagueFaabBudget(league)
  const map = new Map<number, FaabSnapshot>()
  for (const r of rosters) {
    const spent = r.settings.waiver_budget_used ?? 0
    map.set(r.roster_id, {
      budget,
      spent,
      remaining: budget - spent,
    })
  }
  return map
}
