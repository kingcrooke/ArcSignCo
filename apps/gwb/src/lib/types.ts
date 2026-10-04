export interface SleeperUser {
  user_id: string
  display_name: string
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

export interface SleeperTransaction {
  type: string
  status: string
  status_updated: number
  created?: number
  leg: number
  roster_ids?: number[]
  adds: Record<string, number> | null
  drops: Record<string, number> | null
  settings?: {
    waiver_bid?: number
    seq?: number
    priority?: number
  } | null
  metadata?: { notes?: string } | null
  waiver_budget?: { sender: number; receiver: number; amount: number }[]
  transaction_id?: string
}

export interface SleeperLeague {
  league_id: string
  name: string
  season: string
  status: string
  settings: {
    leg: number
    last_scored_leg?: number
    playoff_week_start?: number
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
  teamName: string
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
  benchMiss: { name: string; points: number; starterPoints: number } | null
}
