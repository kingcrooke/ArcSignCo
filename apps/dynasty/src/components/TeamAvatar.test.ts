import { describe, expect, it } from 'vitest'
import { avatarUrlChain } from './TeamAvatar'
import type { TeamInfo } from '../lib/types'

describe('avatarUrlChain', () => {
  it('prefers custom webp and png before Sleeper URLs', () => {
    const team: TeamInfo = {
      rosterId: 6,
      userId: '427930731889565696',
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

  it('chains base assets after mood for missing file fallback', () => {
    const team: TeamInfo = {
      rosterId: 2,
      userId: '735615874752483328',
      displayName: 'Nix',
      teamName: 'Nix in 5',
      leagueAvatarUrl: null,
      globalAvatarUrl: null,
      avatarUrl: null,
    }
    const chain = avatarUrlChain(team, 'excited')
    expect(chain[0]).toContain('avatars/roster-02-excited.webp')
    expect(chain[2]).toContain('avatars/roster-02.webp')
  })

  it('uses excited mood assets when set', () => {
    const team: TeamInfo = {
      rosterId: 5,
      userId: '427906596501213184',
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
      userId: '401754707162333184',
      displayName: 'Santagua',
      teamName: 'Saints & Sinners',
      leagueAvatarUrl: null,
      globalAvatarUrl: null,
      avatarUrl: null,
    }
    const chain = avatarUrlChain(team, 'hype')
    expect(chain[0]).toContain('avatars/roster-01.webp')
  })

  it('does not give past-season roster slots the current cartoon', () => {
    const dream: TeamInfo = {
      rosterId: 2,
      userId: 'dreamcrushers05',
      displayName: 'Dreamcrushers05',
      teamName: 'Dreamcrushers05',
      leagueAvatarUrl: null,
      globalAvatarUrl: 'https://sleepercdn.com/avatars/thumbs/dream',
      avatarUrl: null,
    }
    const james: TeamInfo = {
      rosterId: 10,
      userId: 'jamesd47',
      displayName: 'JamesD47',
      teamName: 'JamesD47',
      leagueAvatarUrl: null,
      globalAvatarUrl: null,
      avatarUrl: null,
    }
    expect(avatarUrlChain(dream).join(' ')).not.toContain('roster-02')
    expect(avatarUrlChain(dream)[0]).toBe(dream.globalAvatarUrl)
    expect(avatarUrlChain(james).join(' ')).not.toContain('roster-10')
    expect(avatarUrlChain(james)).toEqual([])
  })
})
