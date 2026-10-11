export interface SleeperUser {
  user_id: string
  display_name: string
  avatar?: string
  metadata?: {
    team_name?: string
    avatar?: string
  }
}

export interface SleeperRoster {
  roster_id: number
  owner_id: string | null
  players: string[]
  starters: string[]
  taxi?: string[] | null
  reserve?: string[] | null
  settings: {
    wins: number
    losses: number
    ties: number
    fpts: number
    fpts_decimal: number
    fpts_against: number
    fpts_against_decimal: number
    ppts: number
    ppts_decimal: number
    waiver_position?: number
    waiver_budget_used?: number
  }
  metadata?: {
    streak?: string
    record?: string
  }
}

export interface SleeperMatchup {
  roster_id: number
  matchup_id: number
  points: number
  starters: string[]
  starters_points: number[]
  players_points: Record<string, number>
  /** Roster that scored this week. Absent on older fixtures. */
  players?: string[]
}

export interface SleeperDraftPickTrade {
  season: string
  round: number
  roster_id: number
  previous_owner_id?: number
  owner_id?: number
}

export interface SleeperDraft {
  draft_id: string
  league_id: string
  season: string
  status: string
  type: string
  settings?: { rounds?: number }
  metadata?: { name?: string }
}

export interface SleeperDraftPick {
  pick_no: number
  round: number
  roster_id: number
  player_id: string | null
  picked_by: string
  draft_slot: number
  metadata?: { years_exp?: string; team?: string; position?: string }
}

export interface SleeperTradedPick {
  season: string
  round: number
  roster_id: number
  owner_id: number
  previous_owner_id: number
}

export interface SleeperTransaction {
  type: string
  status: string
  status_updated: number
  created?: number
  leg: number
  roster_ids?: number[]
  adds: Record<string, number> | null
  drops: Record<string, number> | null
  draft_picks?: SleeperDraftPickTrade[] | null
  settings?: {
    waiver_bid?: number
    seq?: number
    priority?: number
  } | null
  metadata?: { notes?: string } | null
  waiver_budget?: { sender: number; receiver: number; amount: number }[]
  transaction_id?: string
}

export interface SleeperBracketMatch {
  m: number
  r: number
  l?: number
  w?: number
  t1: number
  t2: number
  p?: number
  t1_from?: { w?: number; l?: number }
  t2_from?: { w?: number; l?: number }
}

export interface SleeperLeague {
  league_id: string
  name: string
  season: string
  status: string
  previous_league_id?: string | null
  metadata?: {
    latest_league_winner_roster_id?: string
  }
  settings: {
    leg: number
    last_scored_leg?: number
    playoff_week_start?: number
    playoff_teams?: number
    waiver_budget?: number
  }
  roster_positions: string[]
  scoring_settings: Record<string, number>
}

export interface NflState {
  week: number
  season: string
  season_type: string
  display_week: number
  league_season: string
  season_has_scores: boolean
}

/** Sleeper NFL scoreboard row for a single game in a fantasy week. */
export interface NflWeekGame {
  status: string
  week: number
  metadata?: {
    home_team?: string
    away_team?: string
  }
}

export interface PlayerSlim {
  first_name: string
  last_name: string
  position: string | null
  team: string | null
  full_name: string
}

export type PlayersMap = Record<string, PlayerSlim>

export interface TeamInfo {
  rosterId: number
  userId: string
  displayName: string
  /** From Sleeper metadata.team_name, else display_name (per season /users). */
  teamName: string
  /** League-specific upload URL from metadata.avatar when set. */
  leagueAvatarUrl: string | null
  /** Global Sleeper avatar thumb from user.avatar hash. */
  globalAvatarUrl: string | null
  /** @deprecated Prefer TeamAvatar cascade; kept for simple img fallbacks. */
  avatarUrl: string | null
}

export interface StandingRow {
  rank: number
  rosterId: number
  teamName: string
  displayName: string
  wins: number
  losses: number
  ties: number
  pointsFor: number
  pointsAgainst: number
  streak: string
}

export interface MatchupRecap {
  matchupId: number
  teamA: TeamSideRecap
  teamB: TeamSideRecap
  margin: number
  winnerRosterId: number
  tags: string[]
  narrative: string
  starsLine?: string
  scorerLines?: string[]
  isMatchupOfTheWeek: boolean
}

export interface TeamSideRecap {
  rosterId: number
  teamName: string
  points: number
  topScorer: { name: string; points: number } | null
  benchMiss: { name: string; gain: number; message: string } | null
}
