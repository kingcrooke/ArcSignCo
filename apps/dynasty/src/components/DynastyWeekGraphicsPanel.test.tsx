import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DynastyWeekGraphicsPanel } from './DynastyWeekGraphicsPanel'

describe('DynastyWeekGraphicsPanel empty week', () => {
  it('links a week with no cards or report to the latest content week', () => {
    const onSelectWeek = vi.fn()
    render(
      <DynastyWeekGraphicsPanel
        season="2026"
        week={11}
        weekComplete={false}
        latestContentWeek={10}
        onSelectWeek={onSelectWeek}
      />,
    )
    const links = screen.getAllByRole('button', { name: 'View Week 10' })
    expect(links.length).toBeGreaterThan(0)
    expect(screen.getByText(/Week 11 cards aren't posted yet/)).toBeInTheDocument()
    fireEvent.click(links[0])
    expect(onSelectWeek).toHaveBeenCalledWith(10)
  })

  it('wraps long matchup titles under Graphics thumbnails', () => {
    render(
      <DynastyWeekGraphicsPanel
        season="2026"
        week={1}
        weekComplete
        teams={new Map()}
      />,
    )
    const title =
      'A-Lamb-e que tengo hambre 162.96 - MahomiesRidley4MooreJeffe 147.90'
    const caption = screen.getByText(title)
    expect(caption.tagName).toBe('P')
    expect(caption.className).toContain('break-words')
    expect(caption.className).not.toContain('truncate')

    fireEvent.click(screen.getByRole('button', { name: `Open ${title}` }))
    const dialogTitle = screen.getByRole('dialog').querySelector('p')
    expect(dialogTitle?.textContent).toContain(title)
    expect(dialogTitle?.className).toContain('break-words')
    expect(dialogTitle?.className).not.toContain('truncate')
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
