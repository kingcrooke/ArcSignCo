import { describe, expect, it } from 'vitest'
import { chooseMatchupOfTheWeek } from './matchupOfTheWeek'
import type { MatchupRecap, StandingRow } from './types'

function recap(
  matchupId: number,
  rosterA: number,
  rosterB: number,
  margin = 10,
): MatchupRecap {
  return {
    matchupId,
    teamA: { rosterId: rosterA, teamName: `A${rosterA}`, points: 100, topScorer: null, benchMiss: null },
    teamB: { rosterId: rosterB, teamName: `B${rosterB}`, points: 100 - margin, topScorer: null, benchMiss: null },
    margin,
    winnerRosterId: rosterA,
    tags: [],
    narrative: '',
    scorerLines: [],
    isMatchupOfTheWeek: false,
  }
}

function standings(rows: [number, number, number][]): StandingRow[] {
  return rows.map(([rosterId, wins, losses], i) => ({
    rank: i + 1,
    rosterId,
    teamName: `T${rosterId}`,
    displayName: `M${rosterId}`,
    wins,
    losses,
    ties: 0,
    pointsFor: 500,
    pointsAgainst: 400,
    streak: '',
  }))
}

describe('chooseMatchupOfTheWeek', () => {
  it('uses manual override for week 6 (Eric vs Steven)', () => {
    const recaps = [
      recap(1, 8, 9, 50),
      recap(2, 5, 7, 1),
      recap(4, 3, 10, 2),
    ]
    const st = standings([
      [7, 4, 1],
      [5, 3, 2],
      [3, 3, 2],
      [10, 2, 3],
    ])
    expect(chooseMatchupOfTheWeek(recaps, st, 6)).toBe(2)
  })

  it('picks closest records among top-six seeds when no override', () => {
    const recaps = [recap(1, 5, 7, 40), recap(2, 3, 10, 5)]
    const st = standings([
      [7, 4, 1],
      [5, 3, 2],
      [3, 3, 2],
      [10, 2, 3],
    ])
    expect(chooseMatchupOfTheWeek(recaps, st, 5)).toBe(1)
  })
})
