export const LEAGUE_ID = '1389375326257184768'
export const LEAGUE_NAME = 'GWB'
export const SLEEPER_API = 'https://api.sleeper.app/v1'

export const PLAYERS_CACHE_KEY = 'gwb_players_nfl_v1'

/** Frankie's 0-9 winless start (2015) — longest in league lore. */
export const FRANKIE_ZONE_RECORD = {
  holderUserId: '475847480039174144',
  holderName: 'Frankie',
  lossesWithoutWin: 9,
  season: 2015,
  /** First loss count that renames the zone (0-10). A winless manager must go over in ten. */
  renameAtLosses: 10,
} as const

/** Sleeper user_id → short name for zone branding. */
export const ZONE_MANAGER_SHORT_NAMES: Record<string, string> = {
  [FRANKIE_ZONE_RECORD.holderUserId]: FRANKIE_ZONE_RECORD.holderName,
}
