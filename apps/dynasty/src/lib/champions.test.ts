import { describe, expect, it } from 'vitest'
import { championsWallRows, titlesLeaderboard } from './champions'
import type { LeagueSeasonSummary, ManagerSeasonFinish } from './managerSeasons'

function finish(
  season: string,
  rosterId: number,
  name: string,
  result: string,
): ManagerSeasonFinish {
  return {
    season,
    leagueId: `L${season}`,
    leagueName: 'Dynasty of Champions',
    rosterId,
    userId: name,
    displayName: `${name} team`,
    sleeperName: name,
    wins: 10,
    losses: 3,
    ties: 0,
    pointsFor: 1500,
    regularSeasonRank: 1,
    playoffResult: result,
    championUserId: '',
    championDisplayName: '',
    roster: {
      roster_id: rosterId,
      owner_id: name,
      players: [],
      starters: [],
      settings: {
        wins: 10,
        losses: 3,
        ties: 0,
        fpts: 1500,
        fpts_decimal: 0,
        fpts_against: 1400,
        fpts_against_decimal: 0,
        ppts: 0,
        ppts_decimal: 0,
      },
    },
    rosterPositions: [],
    unavailable: false,
  }
}

function summary(season: string, champ: string, runner: string): LeagueSeasonSummary {
  const champRow = finish(season, 1, champ, 'Champion')
  const runnerRow = finish(season, 2, runner, 'Runner-up')
  return {
    season,
    leagueId: `L${season}`,
    leagueName: 'Dynasty of Champions',
    status: 'complete',
    championRosterId: 1,
    championUserId: champ,
    championDisplayName: `${champ} team`,
    byUserId: new Map([
      [champ, champRow],
      [runner, runnerRow],
    ]),
    byRosterId: new Map([
      [1, champRow],
      [2, runnerRow],
    ]),
    unavailable: false,
  }
}

describe('champions wall', () => {
  it('lists titles from winners-bracket results and ranks the leaderboard', () => {
    const rows = championsWallRows([
      summary('2026', 'Nobody', 'Yet'),
      summary('2019', 'NutCrusher', 'BigBlue01'),
      summary('2020', 'Santagua', 'LoboSLB'),
      summary('2021', 'LoboSLB', 'Santagua'),
      summary('2022', 'NutCrusher', 'MaduRaso'),
      summary('2023', 'NutCrusher', 'FantasyThanos6'),
      summary('2024', 'ramonguaraguao', 'Yuvraja'),
      summary('2025', 'SeasonUnderdogs', 'kingCrooke'),
    ])
    expect(rows.map((r) => `${r.season} ${r.champion} ${r.runnerUp}`)).toEqual([
      '2019 NutCrusher BigBlue01',
      '2020 Santagua LoboSLB',
      '2021 LoboSLB Santagua',
      '2022 NutCrusher MaduRaso',
      '2023 NutCrusher FantasyThanos6',
      '2024 ramonguaraguao Yuvraja',
      '2025 SeasonUnderdogs kingCrooke',
    ])
    const board = titlesLeaderboard(rows)
    expect(board[0]).toMatchObject({ name: 'NutCrusher', titles: 3 })
    expect(board.slice(1).every((e) => e.titles === 1)).toBe(true)
  })
})
