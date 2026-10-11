import { describe, expect, it } from 'vitest'
import { buildTeamMap } from './teams'
import type { SleeperRoster, SleeperUser } from './types'

describe('league vs global avatars', () => {
  it('prefers metadata.avatar URL over user.avatar hash', () => {
    const users: SleeperUser[] = [
      {
        user_id: 'u6',
        display_name: 'kingCrooke',
        avatar: '62a2c6c30f25f61d197e4a08fbc03d1d',
        metadata: {
          team_name: 'A-Lamb-e que tengo hambre',
          avatar:
            'https://sleepercdn.com/uploads/a424f67048ec1529090467248862e347.jpg',
        },
      },
    ]
    const rosters: SleeperRoster[] = [
      {
        roster_id: 6,
        owner_id: 'u6',
        players: [],
        starters: [],
        settings: {
          wins: 0,
          losses: 0,
          ties: 0,
          fpts: 0,
          fpts_decimal: 0,
          fpts_against: 0,
          fpts_against_decimal: 0,
          ppts: 0,
          ppts_decimal: 0,
        },
      },
    ]
    const teams = buildTeamMap(users, rosters)
    const t = teams.get(6)!
    expect(t.teamName).toBe('A-Lamb-e que tengo hambre')
    expect(t.leagueAvatarUrl).toBe(
      'https://sleepercdn.com/uploads/a424f67048ec1529090467248862e347.jpg',
    )
    expect(t.globalAvatarUrl).toBe(
      'https://sleepercdn.com/avatars/thumbs/62a2c6c30f25f61d197e4a08fbc03d1d',
    )
    expect(t.avatarUrl).toBe(t.leagueAvatarUrl)
  })
})
