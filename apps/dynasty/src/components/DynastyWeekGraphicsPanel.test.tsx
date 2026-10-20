import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DynastyWeekGraphicsPanel } from './DynastyWeekGraphicsPanel'

describe('DynastyWeekGraphicsPanel empty week', () => {
  it('links a week with no cards or report to the latest content week', () => {
    const onSelectWeek = vi.fn()
    render(
      <DynastyWeekGraphicsPanel
        season="2026"
        week={7}
        weekComplete={false}
        latestContentWeek={6}
        onSelectWeek={onSelectWeek}
      />,
    )
    const links = screen.getAllByRole('button', { name: 'View Week 6' })
    expect(links.length).toBeGreaterThan(0)
    expect(screen.getByText(/Week 7 cards aren't posted yet/)).toBeInTheDocument()
    fireEvent.click(links[0])
    expect(onSelectWeek).toHaveBeenCalledWith(6)
  })

  it('does not offer a jump link on a week that already has cards', () => {
    render(
      <DynastyWeekGraphicsPanel
        season="2026"
        week={6}
        weekComplete
        teams={new Map()}
        latestContentWeek={6}
        onSelectWeek={() => {}}
      />,
    )
    expect(screen.queryByRole('button', { name: /View Week/ })).toBeNull()
  })
})
