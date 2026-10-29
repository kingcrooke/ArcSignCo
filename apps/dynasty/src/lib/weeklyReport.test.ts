import { describe, expect, it } from 'vitest'
import {
  getWeeklyReport,
  reportMatchupsBySleeperId,
  weeklyReportEmptyMessage,
} from './weeklyReport'

describe('weekly reports', () => {
  it('has a Sleeper-backed report for 2026 weeks 1–7 and none after', () => {
    for (const week of [1, 2, 3, 4, 5, 6, 7]) {
      const report = getWeeklyReport(2026, week)
      expect(report?.week).toBe(week)
      expect(report?.leagueId).toBe('1312077668782473216')
      expect(report?.source).toBe('sleeper')
      expect(report?.matchups).toHaveLength(6)
      expect(report?.standings).toHaveLength(12)
      expect(report?.highScore?.name).toBeTruthy()
      expect(report?.lowScore?.points).toBeGreaterThan(0)
      expect(report?.closest?.margin).toBeGreaterThan(0)
      expect(report?.blowout?.margin).toBeGreaterThanOrEqual(report?.closest?.margin ?? 0)
      expect(report?.topPlayer?.started).toBe(true)
      expect(report?.topPlayer?.name).toBeTruthy()
      for (const game of report?.matchups ?? []) {
        expect(game.recap).toContain(game.winner.name)
        expect(game.recap).toContain(game.winner.topScorers[0]?.name ?? '')
        expect(game.winner.score).toBeGreaterThanOrEqual(game.loser.score)
        for (const side of [game.winner, game.loser]) {
          expect(side.topScorers.length).toBeGreaterThan(0)
          expect(side.topScorers.every((p) => p.started)).toBe(true)
        }
      }
    }
    expect(getWeeklyReport(2026, 8)).toBeNull()
    expect(getWeeklyReport(2025, 5)).toBeNull()
    expect(weeklyReportEmptyMessage(8)).toBe("Week 8 report isn't posted yet.")
  })

  it('records week 5 lines that match Sleeper scores', () => {
    const report = getWeeklyReport('2026', 5)
    expect(report?.highScore).toMatchObject({ name: 'Wolf Pack', points: 178.4 })
    const chase = report?.matchups.find((g) =>
      [g.winner.name, g.loser.name].includes('Chase’n Dubs'),
    )
    expect(chase?.winner.name).toBe('Chase’n Dubs')
    expect(chase?.winner.score).toBe(121.78)
    expect(chase?.loser.name).toBe('BigBlue')
    expect(chase?.loser.score).toBe(104.96)
    expect(chase?.upset).toBe(false)
    const love = report?.matchups.find((g) => g.winner.name === 'Love Thy Nabers')
    expect(love?.loser.name).toBe('MahomiesRidley4MooreJeffe')
    expect(love?.upset).toBe(true)
    expect(report?.topPlayer).toMatchObject({
      name: 'Jaylen Warren',
      points: 40.8,
      manager: 'Saints & Sinners',
      started: true,
    })
    expect(report?.trades).toEqual([])
    const week1 = getWeeklyReport('2026', 1)
    const week1Players = (week1?.trades ?? []).flatMap((t) =>
      t.sides.flatMap((s) => [...s.receivedPlayers, ...s.sentPlayers]),
    )
    expect(week1Players).not.toContain('Brock Bowers')
    expect(week1Players).not.toContain('Tucker Kraft')
  })

  it('records week 6 final scores and the top starter', () => {
    const report = getWeeklyReport('2026', 6)
    expect(report?.highScore).toMatchObject({ name: 'Love Thy Nabers', points: 143.9 })
    expect(report?.lowScore).toMatchObject({ name: 'Chalupa Batman', points: 67.02 })
    expect(report?.topPlayer).toMatchObject({
      name: 'Trevor Lawrence',
      points: 35.34,
      manager: 'A-Lamb-e que tengo hambre',
      started: true,
    })
    const line = (winner: string, w: number, loser: string, l: number) => {
      const game = report?.matchups.find(
        (g) => g.winner.name === winner && g.loser.name === loser,
      )
      expect(game?.winner.score).toBe(w)
      expect(game?.loser.score).toBe(l)
      expect(game?.winner.topScorers.every((p) => p.started)).toBe(true)
      expect(game?.loser.topScorers.every((p) => p.started)).toBe(true)
    }
    line('Saints & Sinners', 127.94, 'Chalupa Batman', 67.02)
    line('BigBlue', 137.72, 'Nix in 5', 116.08)
    line('ramonguaraguao', 129.7, 'Wolf Pack', 99.32)
    line('Chase’n Dubs', 117.32, 'MahomiesRidley4MooreJeffe', 109.46)
    line('A-Lamb-e que tengo hambre', 128.44, 'Rubuilding', 69.44)
    line('Love Thy Nabers', 143.9, 'Team Name Hoes', 103.18)
  })

  it('records week 7 final scores and league highlights', () => {
    const report = getWeeklyReport('2026', 7)
    expect(report?.highScore).toMatchObject({ name: 'Nix in 5', points: 168.88 })
    expect(report?.lowScore).toMatchObject({ name: 'Rubuilding', points: 68.52 })
    expect(report?.topPlayer).toMatchObject({
      name: 'Tony Pollard',
      points: 36.5,
      rosterId: 6,
      started: true,
    })
    expect(report?.closest?.margin).toBe(0.1)
    expect(report?.closest?.matchupId).toBe(2)
    expect(report?.blowout?.margin).toBe(53.22)
    expect(report?.blowout?.matchupId).toBe(5)
    const line = (winner: string, w: number, loser: string, l: number) => {
      const game = report?.matchups.find(
        (g) => g.winner.name === winner && g.loser.name === loser,
      )
      expect(game?.winner.score).toBe(w)
      expect(game?.loser.score).toBe(l)
    }
    line('Chase’n Dubs', 163.82, 'A-Lamb-e que tengo hambre', 151.72)
    line('MahomiesRidley4MooreJeffe', 68.62, 'Rubuilding', 68.52)
    line('Love Thy Nabers', 141.22, 'Wolf Pack', 96.48)
    line('ramonguaraguao', 135.98, 'Team Name Hoes', 119.7)
    line('Nix in 5', 168.88, 'Saints & Sinners', 115.66)
    line('Chalupa Batman', 151.68, 'BigBlue', 139.18)
  })

  it('sorts every week by Sleeper matchup_id, matching graphics m1..m6', () => {
    for (const week of [1, 2, 3, 4, 5, 6, 7]) {
      const report = getWeeklyReport(2026, week)!
      const ordered = reportMatchupsBySleeperId(report.matchups)
      expect(ordered.map((g) => g.matchupId)).toEqual([1, 2, 3, 4, 5, 6])
    }
    const week6 = reportMatchupsBySleeperId(getWeeklyReport(2026, 6)!.matchups)
    const matchup5 = week6.find((g) => g.matchupId === 5)
    expect([matchup5?.winner.name, matchup5?.loser.name].sort()).toEqual([
      'Chalupa Batman',
      'Saints & Sinners',
    ])
    expect(getWeeklyReport(2026, 6)!.matchups.map((g) => g.matchupId)).not.toEqual([
      1, 2, 3, 4, 5, 6,
    ])
  })
})
