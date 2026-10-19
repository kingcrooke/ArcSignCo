import type { LeagueSeasonSummary } from './managerSeasons'

export interface ChampionWallRow {
  season: string
  champion: string
  runnerUp: string
}

export interface TitleLeader {
  name: string
  titles: number
  years: string[]
}

function sleeperName(
  summary: LeagueSeasonSummary,
  rosterId: number | null | undefined,
): string {
  if (rosterId == null) return ''
  const finish = summary.byRosterId.get(rosterId)
  return finish?.sleeperName?.trim() || finish?.displayName?.trim() || ''
}

/** Champions and runners-up from Sleeper winners brackets, 2019–2025. */
export function championsWallRows(
  summaries: LeagueSeasonSummary[],
): ChampionWallRow[] {
  return summaries
    .filter((s) => {
      const year = Number(s.season)
      return s.status === 'complete' && year >= 2019 && year <= 2025
    })
    .sort((a, b) => Number(a.season) - Number(b.season))
    .map((summary) => {
      const finishes = [...summary.byUserId.values()]
      const champ = finishes.find((f) => f.playoffResult === 'Champion')
      const runner = finishes.find((f) => f.playoffResult === 'Runner-up')
      const champion =
        champ?.sleeperName?.trim() ||
        sleeperName(summary, summary.championRosterId) ||
        summary.championDisplayName ||
        'unavailable'
      const runnerUp =
        runner?.sleeperName?.trim() ||
        sleeperName(summary, runner?.rosterId) ||
        'unavailable'
      return { season: summary.season, champion, runnerUp }
    })
}

export function playoffResultsForLeague(
  summaries: LeagueSeasonSummary[],
  leagueId: string,
): Map<number, string> {
  const map = new Map<number, string>()
  const summary = summaries.find((s) => s.leagueId === leagueId)
  if (!summary) return map
  for (const finish of summary.byRosterId.values()) {
    if (finish.playoffResult) map.set(finish.rosterId, finish.playoffResult)
  }
  return map
}

export function titlesLeaderboard(rows: ChampionWallRow[]): TitleLeader[] {
  const byName = new Map<string, string[]>()
  for (const row of rows) {
    if (!row.champion || row.champion === 'unavailable') continue
    const years = byName.get(row.champion) ?? []
    years.push(row.season)
    byName.set(row.champion, years)
  }
  return [...byName.entries()]
    .map(([name, years]) => ({
      name,
      titles: years.length,
      years,
    }))
    .sort((a, b) => b.titles - a.titles || Number(a.years[0]) - Number(b.years[0]))
}
