import { describe, expect, it } from 'vitest'
import {
  getWeekGraphicsSections,
  getWeekGraphicsSlides,
  weekGraphicsEmptyMessage,
} from './weekGraphics'

describe('weekGraphics manifest', () => {
  it('lists results for 2026 weeks 1–4', () => {
    for (const week of [1, 2, 3, 4]) {
      const sections = getWeekGraphicsSections(2026, week)
      expect(sections).toHaveLength(1)
      expect(sections[0].kind).toBe('results')
      expect(sections[0].slides).toHaveLength(6)
      expect(sections[0].slides[0].id).toBe(`results-w${week}-m1`)
    }
  })

  it('week 5 has results and week 6 matchup previews', () => {
    const sections = getWeekGraphicsSections('2026', 5)
    expect(sections.map((s) => s.kind)).toEqual(['results', 'matchups'])
    expect(sections[0].slides).toHaveLength(6)
    expect(sections[1].slides).toHaveLength(6)
    expect(sections[0].slides[0].id).toBe('results-w5-m1')
    expect(sections[1].slides[0].id).toBe('vs-w6-m1')
    expect(sections[1].heading).toBe('Week 6 matchup previews')
    expect(sections[1].previewWeek).toBe(6)
  })

  it('week 6 shows matchup cards only', () => {
    const sections = getWeekGraphicsSections(2026, 6)
    expect(sections).toHaveLength(1)
    expect(sections[0].kind).toBe('matchups')
    expect(sections[0].heading).toBe('Matchups')
    expect(sections[0].previewWeek).toBeUndefined()
  })

  it('flattens slides in section order', () => {
    const slides = getWeekGraphicsSlides(2026, 5)
    expect(slides[0].id).toMatch(/^results-w5/)
    expect(slides[6].id).toMatch(/^vs-w6/)
  })

  it('empty state for 2026 week 7 and 2025 week 5', () => {
    expect(getWeekGraphicsSections(2026, 7)).toEqual([])
    expect(getWeekGraphicsSections(2025, 5)).toEqual([])
    expect(weekGraphicsEmptyMessage(7)).toBe("Week 7 cards aren't posted yet.")
    expect(weekGraphicsEmptyMessage(5)).toBe("Week 5 cards aren't posted yet.")
  })

  it('does not throw for week 18 or season 2019', () => {
    expect(() => getWeekGraphicsSections(2026, 18)).not.toThrow()
    expect(() => getWeekGraphicsSections(2019, 5)).not.toThrow()
    expect(getWeekGraphicsSections(2019, 18)).toEqual([])
    expect(getWeekGraphicsSlides(2019, 1)).toEqual([])
  })
})
