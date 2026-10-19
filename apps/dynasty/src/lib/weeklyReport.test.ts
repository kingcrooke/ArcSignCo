import { describe, expect, it } from 'vitest'
import { getWeeklyReport, weeklyReportEmptyMessage } from './weeklyReport'

describe('weekly reports', () => {
  it('has a Sleeper-backed report for 2026 weeks 1–5 and none after', () => {
    for (const week of [1, 2, 3, 4, 5]) {
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
      expect(report?.topPlayer?.name).toBeTruthy()
      for (const game of report?.matchups ?? []) {
        expect(game.recap).toContain(game.winner.name)
        expect(game.recap).toContain(game.winner.topScorers[0]?.name ?? '')
        expect(game.winner.score).toBeGreaterThanOrEqual(game.loser.score)
      }
    }
    expect(getWeeklyReport(2026, 6)).toBeNull()
    expect(getWeeklyReport(2026, 7)).toBeNull()
    expect(getWeeklyReport(2025, 5)).toBeNull()
    expect(weeklyReportEmptyMessage(6)).toBe("Week 6 report isn't posted yet.")
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
    expect(report?.topPlayer?.name).toBe('Drake Maye')
    expect(report?.trades).toEqual([])
  })
})
