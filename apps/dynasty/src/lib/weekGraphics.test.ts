import { describe, expect, it } from 'vitest'
import { getWeekGraphicsSections, getWeekGraphicsSlides } from './weekGraphics'

describe('weekGraphics', () => {
  it('week 5 has separate results and matchup sections', () => {
    const sections = getWeekGraphicsSections(5)
    expect(sections.map((s) => s.kind)).toEqual(['results', 'matchups'])
    expect(sections[0].slides).toHaveLength(6)
    expect(sections[1].slides).toHaveLength(6)
    expect(sections[0].slides[0].id).toBe('results-w5-m1')
    expect(sections[1].slides[0].id).toBe('vs-w6-m1')
    expect(sections[1].heading).toBe('Week 6 matchup previews')
    expect(sections[1].previewWeek).toBe(6)
  })

  it('week 6 shows matchup previews only', () => {
    const sections = getWeekGraphicsSections(6)
    expect(sections).toHaveLength(1)
    expect(sections[0].kind).toBe('matchups')
  })

  it('flattens slides in section order', () => {
    const slides = getWeekGraphicsSlides(5)
    expect(slides[0].id).toMatch(/^results-w5/)
    expect(slides[6].id).toMatch(/^vs-w6/)
  })
})
