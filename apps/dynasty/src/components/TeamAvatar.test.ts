import { describe, expect, it } from 'vitest'
import { avatarUrlChain } from './TeamAvatar'
import type { TeamInfo } from '../lib/types'

describe('avatarUrlChain', () => {
  it('orders custom, league, then global URLs', () => {
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
    expect(chain[0]).toBe(team.leagueAvatarUrl)
    expect(chain[1]).toBe(team.globalAvatarUrl)
  })
})
