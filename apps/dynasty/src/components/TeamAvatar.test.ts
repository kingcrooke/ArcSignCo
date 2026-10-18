import { describe, expect, it } from 'vitest'
import { avatarUrlChain } from './TeamAvatar'
import type { TeamInfo } from '../lib/types'

describe('avatarUrlChain', () => {
  it('prefers custom webp and png before Sleeper URLs', () => {
    const team: TeamInfo = {
      rosterId: 6,
      userId: 'u6',
      displayName: 'kingCrooke',
      teamName: 'A-Lamb-e que tengo hambre',
      leagueAvatarUrl:
        'https://sleepercdn.com/uploads/a424f67048ec1529090467248862e347.jpg',
      globalAvatarUrl:
        'https://sleepercdn.com/avatars/thumbs/62a2c6c30f25f61d197e4a08fbc03d1d',
      avatarUrl:
        'https://sleepercdn.com/uploads/a424f67048ec1529090467248862e347.jpg',
    }
    const chain = avatarUrlChain(team)
    expect(chain[0]).toContain('avatars/roster-06.webp')
    expect(chain[1]).toContain('avatars/roster-06.png')
    expect(chain[2]).toBe(team.leagueAvatarUrl)
    expect(chain[3]).toBe(team.globalAvatarUrl)
  })

  it('uses excited mood assets when set', () => {
    const team: TeamInfo = {
      rosterId: 5,
      userId: 'u5',
      displayName: 'Chase',
      teamName: 'Chase’n Dubs',
      leagueAvatarUrl: null,
      globalAvatarUrl: null,
      avatarUrl: null,
    }
    const chain = avatarUrlChain(team, 'excited')
    expect(chain[0]).toContain('avatars/roster-05-excited.webp')
    expect(chain[1]).toContain('avatars/roster-05-excited.png')
  })

  it('falls back to base mood asset when hype is unset', () => {
    const team: TeamInfo = {
      rosterId: 1,
      userId: 'u1',
      displayName: 'Santagua',
      teamName: 'Saints & Sinners',
      leagueAvatarUrl: null,
      globalAvatarUrl: null,
      avatarUrl: null,
    }
    const chain = avatarUrlChain(team, 'hype')
    expect(chain[0]).toContain('avatars/roster-01.webp')
  })
})
