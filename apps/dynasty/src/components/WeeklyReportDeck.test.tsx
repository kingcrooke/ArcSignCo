import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getWeeklyReport } from '../lib/weeklyReport'
import { WeeklyReportDeck } from './WeeklyReportDeck'

describe('WeeklyReportDeck matchup labels', () => {
  it('labels Week 6 Saints & Sinners vs Chalupa Batman as Matchup 5', () => {
    const report = getWeeklyReport(2026, 6)
    expect(report).not.toBeNull()
    render(<WeeklyReportDeck report={report!} teams={new Map()} />)

    expect(
      screen.getAllByText(/Dynasty · Week 6 · Matchup \d/).map((el) => el.textContent),
    ).toEqual([
      'Dynasty · Week 6 · Matchup 1',
      'Dynasty · Week 6 · Matchup 2',
      'Dynasty · Week 6 · Matchup 3',
      'Dynasty · Week 6 · Matchup 4',
      'Dynasty · Week 6 · Matchup 5',
      'Dynasty · Week 6 · Matchup 6',
    ])

    const card = screen.getByText('Dynasty · Week 6 · Matchup 5').closest('article')
    expect(card).toHaveTextContent('Saints & Sinners')
    expect(card).toHaveTextContent('Chalupa Batman')
  })
})
