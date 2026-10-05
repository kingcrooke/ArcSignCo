export const LEAGUE_ID = '1389375326257184768'

/** League-facing nicknames keyed by Sleeper roster_id (mirrors apps/gwb/src/lib/nicknames.ts). */
export const NICKNAME_BY_ROSTER = {
  1: 'Danny',
  2: 'Mauricio',
  3: 'Narking',
  4: 'Kayser',
  5: 'Eric',
  6: 'Hadi',
  7: 'Steven',
  8: 'Crooke',
  9: 'Manny',
  10: 'Jamil',
  11: 'Frankie',
  12: 'Matt',
}

/** Typical Sunday kickoff bucket by NFL team (approximate; no play-by-play from Sleeper). */
export const TEAM_KICKOFF_BUCKET = {
  BUF: 'early',
  MIA: 'early',
  NE: 'early',
  NYJ: 'early',
  BAL: 'early',
  CIN: 'early',
  CLE: 'early',
  PIT: 'early',
  HOU: 'early',
  IND: 'early',
  JAX: 'early',
  TEN: 'early',
  DEN: 'late',
  KC: 'late',
  LV: 'late',
  LAC: 'late',
  DAL: 'early',
  NYG: 'early',
  PHI: 'early',
  WAS: 'early',
  CHI: 'early',
  DET: 'early',
  GB: 'early',
  MIN: 'early',
  ATL: 'early',
  CAR: 'early',
  NO: 'early',
  TB: 'early',
  ARI: 'late',
  LAR: 'late',
  SF: 'late',
  SEA: 'late',
}

export const BUCKET_ORDER = ['projected', 'early', 'late', 'night', 'final']
