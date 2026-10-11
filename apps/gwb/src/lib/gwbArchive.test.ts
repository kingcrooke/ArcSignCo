import { describe, expect, it } from 'vitest'
import {
  archiveMemberKeyForUserId,
  finalsAppearancesForUserId,
  titleCountForUserId,
  titlesLeaderboard,
  wallDisplayName,
} from './gwbArchive'

describe('gwbArchive', () => {
  it('maps Jesus to Crooke via user_id', () => {
    expect(archiveMemberKeyForUserId('427930731889565696')).toBe('jesus')
    expect(wallDisplayName('jesus')).toBe('Crooke')
  })

  it('counts full-history titles', () => {
    expect(titleCountForUserId('401754707162333184')).toBe(2) // Danny
    expect(titleCountForUserId('427930731889565696')).toBe(1) // Crooke
    expect(titleCountForUserId('427945970563559424')).toBe(4) // Narking
    expect(titleCountForUserId('420639669546385408')).toBe(2) // Eric
    expect(titleCountForUserId('475825464573685760')).toBe(1) // Steven
    expect(titleCountForUserId('475828957426479104')).toBe(1) // Manny
    expect(titleCountForUserId('429316063394541568')).toBe(1) // Hady
  })

  it('leaderboard orders Narking first with four titles', () => {
    const board = titlesLeaderboard()
    expect(board[0].displayName).toBe('Narking')
    expect(board[0].titles).toBe(4)
    expect(board[0].titleYears).toEqual([2016, 2018, 2019, 2024])
  })

  it('tracks Danny finals appearances', () => {
    expect(finalsAppearancesForUserId('401754707162333184')).toBe(6)
  })

  it('maps Mauricio to archive history (Moe in STATS)', () => {
    expect(archiveMemberKeyForUserId('429321092230815744')).toBe('mauricio')
    expect(wallDisplayName('mauricio')).toBe('Mauricio')
    expect(titleCountForUserId('429321092230815744')).toBe(1)
    const board = titlesLeaderboard()
    expect(board.some((e) => e.displayName === 'Moe')).toBe(false)
    expect(board.find((e) => e.key === 'mauricio')).toMatchObject({
      displayName: 'Mauricio',
      titles: 1,
      titleYears: [2014],
      formerMember: false,
    })
  })
})
