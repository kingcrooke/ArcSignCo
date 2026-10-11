import { describe, expect, it } from 'vitest'
import { getTeamName, isGarbageTeamName, managerLabel } from './teams'
import type { TeamInfo } from './types'
import type { SleeperUser } from './types'

describe('team names', () => {
  it('falls back from punctuation-only team_name to display_name', () => {
    const user: SleeperUser = {
      user_id: '1',
      display_name: 'Mnny',
      metadata: { team_name: '………' },
    }
    expect(isGarbageTeamName('………')).toBe(true)
    expect(getTeamName(user, 9)).toBe('Mnny')
  })

  it('managerLabel prefers team_name from Sleeper', () => {
    const team: TeamInfo = {
      rosterId: 1,
      userId: 'u1',
      displayName: 'Santagua',
      teamName: 'Dynasty Kings',
      leagueAvatarUrl: null,
      globalAvatarUrl: null,
      avatarUrl: null,
    }
    expect(managerLabel(team, 1)).toBe('Dynasty Kings')
  })

  it('trims trailing spaces on team_name', () => {
    const user: SleeperUser = {
      user_id: '2',
      display_name: 'MaduRaso',
      metadata: { team_name: 'El Campeon de la Liga ' },
    }
    expect(getTeamName(user, 6)).toBe('El Campeon de la Liga')
  })
})
