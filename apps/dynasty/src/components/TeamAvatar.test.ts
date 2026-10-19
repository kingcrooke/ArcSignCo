import { describe, expect, it } from 'vitest'
import { avatarUrlChain } from './TeamAvatar'
import type { TeamInfo } from '../lib/types'

const SANTAGUA = '401754707162333184'
const NIX = '735615874752483328'
const CHASE = '427906596501213184'
const CROOKE = '427930731889565696'

function team(partial: Partial<TeamInfo> & Pick<TeamInfo, 'rosterId' | 'userId'>): TeamInfo {
  return {
    displayName: 'Manager',
    teamName: 'Team',
    leagueAvatarUrl: null,
    globalAvatarUrl: null,
    avatarUrl: null,
    ...partial,
  }
}

describe('avatarUrlChain', () => {
  it('prefers the current owner cartoon before Sleeper URLs', () => {
    const row = team({
      rosterId: 6,
      userId: CROOKE,
      displayName: 'kingCrooke',
      teamName: 'A-Lamb-e que tengo hambre',
      leagueAvatarUrl:
        'https://sleepercdn.com/uploads/a424f67048ec1529090467248862e347.jpg',
      globalAvatarUrl:
        'https://sleepercdn.com/avatars/thumbs/62a2c6c30f25f61d197e4a08fbc03d1d',
      avatarUrl:
        'https://sleepercdn.com/uploads/a424f67048ec1529090467248862e347.jpg',
    })
    const chain = avatarUrlChain(row)
    expect(chain[0]).toContain('avatars/roster-06.webp')
    expect(chain[1]).toContain('avatars/roster-06.png')
    expect(chain[2]).toBe(row.leagueAvatarUrl)
    expect(chain[3]).toBe(row.globalAvatarUrl)
  })

  it('resolves by user id when the roster slot has changed', () => {
    const row = team({ rosterId: 99, userId: CROOKE })
    expect(avatarUrlChain(row)[0]).toContain('avatars/roster-06.webp')
  })

  it('chains base assets after mood for missing file fallback', () => {
    const row = team({
      rosterId: 2,
      userId: NIX,
      displayName: 'FantasyThanos6',
      teamName: 'Nix in 5',
    })
    const chain = avatarUrlChain(row, 'excited')
    expect(chain[0]).toContain('avatars/roster-02-excited.webp')
    expect(chain[2]).toContain('avatars/roster-02.webp')
  })

  it('uses excited mood assets when set', () => {
    const row = team({
      rosterId: 5,
      userId: CHASE,
      displayName: 'SeasonUnderdogs',
      teamName: 'Chase’n Dubs',
    })
    const chain = avatarUrlChain(row, 'excited')
    expect(chain[0]).toContain('avatars/roster-05-excited.webp')
    expect(chain[1]).toContain('avatars/roster-05-excited.png')
  })

  it('falls back to base mood asset when hype is unset', () => {
    const row = team({
      rosterId: 1,
      userId: SANTAGUA,
      displayName: 'Santagua',
      teamName: 'Saints & Sinners',
    })
    const chain = avatarUrlChain(row, 'hype')
    expect(chain[0]).toContain('avatars/roster-01.webp')
  })

  it('does not give past-season roster slots the current cartoons', () => {
    const dream = team({
      rosterId: 2,
      userId: 'dreamcrushers05-2019',
      displayName: 'Dreamcrushers05',
      teamName: 'Dreamcrushers05',
      leagueAvatarUrl: 'https://sleepercdn.com/uploads/dream.jpg',
    })
    const james = team({
      rosterId: 10,
      userId: 'jamesd47-2019',
      displayName: 'JamesD47',
      teamName: 'JamesD47',
      globalAvatarUrl: 'https://sleepercdn.com/avatars/thumbs/james',
    })
    const emptyOwner = team({
      rosterId: 2,
      userId: '',
      displayName: 'Open',
      teamName: 'Open seat',
    })
    expect(avatarUrlChain(dream).join(' ')).not.toContain('roster-02')
    expect(avatarUrlChain(dream)[0]).toBe(dream.leagueAvatarUrl)
    expect(avatarUrlChain(james).join(' ')).not.toContain('roster-10')
    expect(avatarUrlChain(james)[0]).toBe(james.globalAvatarUrl)
    expect(avatarUrlChain(emptyOwner)).toEqual([])
  })
})
