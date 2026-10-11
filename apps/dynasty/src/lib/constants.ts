import deployConfig from '../../deploy.config.json' with { type: 'json' }

export const LEAGUE_ID = deployConfig.currentLeagueId
export const CURRENT_LEAGUE_ID = deployConfig.currentLeagueId
export const LEAGUE_NAME = deployConfig.leagueName
export const DEPLOY_SLUG = deployConfig.deploySlug
export const SLEEPER_API = 'https://api.sleeper.app/v1'

export const PLAYERS_CACHE_KEY = 'dynasty_players_nfl_v1'

export type LeagueSeasonEntry = {
  season: string
  leagueId: string
}

export const LEAGUE_SEASONS: LeagueSeasonEntry[] = deployConfig.seasons

export function leagueIdForSeason(season: string): string | undefined {
  return LEAGUE_SEASONS.find((s) => s.season === season)?.leagueId
}

export function defaultSeason(): string {
  return LEAGUE_SEASONS[0]?.season ?? '2026'
}
