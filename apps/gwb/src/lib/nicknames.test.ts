import { describe, expect, it } from 'vitest'
import { managerDisplayName, managerNickname } from './nicknames'

describe('manager nicknames by user_id', () => {
  it('uses chat nickname for current managers', () => {
    expect(managerDisplayName('401754707162333184', 'Santagua')).toBe('Danny')
    expect(managerDisplayName('429316063394541568', 'MaduRaso')).toBe('Hady')
  })

  it('keeps departed managers on their Sleeper display name', () => {
    expect(managerDisplayName('472396632223117312', 'PrimeTime616')).toBe(
      'PrimeTime616',
    )
    expect(managerDisplayName('427945970563559424', 'KingHephesto')).toBe(
      'Narking',
    )
  })

  it('does not map historical roster_id to wrong nickname', () => {
    expect(managerNickname(6, 'PrimeTime616', '472396632223117312')).toBe(
      'PrimeTime616',
    )
    expect(managerNickname(6, 'MaduRaso', '429316063394541568')).toBe('Hady')
  })
})
