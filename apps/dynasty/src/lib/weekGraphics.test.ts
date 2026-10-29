import { describe, expect, it } from 'vitest'
import {
  getWeekGraphicsSections,
  getWeekGraphicsSlides,
  latestGraphicsContentWeek,
  resolveGraphicsWeek,
  weekGraphicsEmptyMessage,
  weekHasPublishedGraphics,
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

  it('week 6 has results and week 7 matchup previews', () => {
    const sections = getWeekGraphicsSections(2026, 6)
    expect(sections.map((s) => s.kind)).toEqual(['results', 'matchups'])
    expect(sections[0].slides).toHaveLength(6)
    expect(sections[1].slides).toHaveLength(6)
    expect(sections[0].slides.map((s) => s.id)).toEqual([
      'results-w6-m1',
      'results-w6-m2',
      'results-w6-m3',
      'results-w6-m4',
      'results-w6-m5',
      'results-w6-m6',
    ])
    expect(sections[0].slides[0].title).toBe(
      'Chase’n Dubs 117.32 - MahomiesRidley4MooreJeffe 109.46',
    )
    expect(sections[0].slides[5].title).toBe('Nix in 5 116.08 - BigBlue 137.72')
    expect(sections[1].slides[0].id).toBe('vs-w7-m1')
    expect(sections[1].slides[0].title).toBe(
      'Chase’n Dubs vs A-Lamb-e que tengo hambre',
    )
    expect(sections[1].heading).toBe('Week 7 matchup previews')
    expect(sections[1].previewWeek).toBe(7)
  })

  it('week 7 has results and week 8 matchup previews', () => {
    const sections = getWeekGraphicsSections(2026, 7)
    expect(sections.map((s) => s.kind)).toEqual(['results', 'matchups'])
    expect(sections[0].slides.map((s) => s.id)).toEqual([
      'results-w7-m1',
      'results-w7-m2',
      'results-w7-m3',
      'results-w7-m4',
      'results-w7-m5',
      'results-w7-m6',
    ])
    expect(sections[1].slides.map((s) => s.id)).toEqual([
      'vs-w8-m1',
      'vs-w8-m2',
      'vs-w8-m3',
      'vs-w8-m4',
      'vs-w8-m5',
      'vs-w8-m6',
    ])
    expect(sections[1].heading).toBe('Week 8 matchup previews')
    expect(sections[1].previewWeek).toBe(8)
  })

  it('week 8 shows matchup cards only', () => {
    const sections = getWeekGraphicsSections(2026, 8)
    expect(sections).toHaveLength(1)
    expect(sections[0].kind).toBe('matchups')
    expect(sections[0].heading).toBe('Matchups')
    expect(sections[0].previewWeek).toBeUndefined()
    expect(sections[0].slides.map((s) => s.id)).toEqual([
      'vs-w8-m1',
      'vs-w8-m2',
      'vs-w8-m3',
      'vs-w8-m4',
      'vs-w8-m5',
      'vs-w8-m6',
    ])
    expect(sections[0].slides[5].title).toBe('BigBlue vs Love Thy Nabers')
  })

  it('flattens slides in section order', () => {
    const week5 = getWeekGraphicsSlides(2026, 5)
    expect(week5[0].id).toMatch(/^results-w5/)
    expect(week5[6].id).toMatch(/^vs-w6/)
    const week6 = getWeekGraphicsSlides(2026, 6)
    expect(week6[0].id).toMatch(/^results-w6/)
    expect(week6[6].id).toMatch(/^vs-w7/)
    const week7 = getWeekGraphicsSlides(2026, 7)
    expect(week7[0].id).toMatch(/^results-w7/)
    expect(week7[6].id).toMatch(/^vs-w8/)
  })

  it('empty state for 2026 week 9 and 2025 week 5', () => {
    expect(getWeekGraphicsSections(2026, 9)).toEqual([])
    expect(getWeekGraphicsSections(2025, 5)).toEqual([])
    expect(weekGraphicsEmptyMessage(9)).toBe("Week 9 cards aren't posted yet.")
    expect(weekGraphicsEmptyMessage(5)).toBe("Week 5 cards aren't posted yet.")
  })

  it('defaults the graphics week to the latest week with a report or cards', () => {
    expect(latestGraphicsContentWeek(2026)).toBe(8)
    expect(weekHasPublishedGraphics(2026, 7)).toBe(true)
    expect(weekHasPublishedGraphics(2026, 8)).toBe(true)
    expect(weekHasPublishedGraphics(2026, 9)).toBe(false)
    expect(latestGraphicsContentWeek(2025)).toBeNull()
    expect(
      resolveGraphicsWeek({
        selectedWeek: 7,
        pinnedWeek: null,
        season: 2026,
      }),
    ).toBe(7)
    expect(
      resolveGraphicsWeek({
        selectedWeek: 5,
        pinnedWeek: null,
        season: 2026,
      }),
    ).toBe(5)
    expect(
      resolveGraphicsWeek({
        selectedWeek: 9,
        pinnedWeek: null,
        season: 2026,
      }),
    ).toBe(8)
  })

  it('keeps an explicit empty week so the empty state can link back', () => {
    expect(
      resolveGraphicsWeek({
        selectedWeek: 6,
        pinnedWeek: 9,
        season: 2026,
      }),
    ).toBe(9)
    expect(
      resolveGraphicsWeek({
        selectedWeek: 7,
        pinnedWeek: null,
        season: 2019,
      }),
    ).toBe(7)
  })

  it('does not throw for week 18 or season 2019', () => {
    expect(() => getWeekGraphicsSections(2026, 18)).not.toThrow()
    expect(() => getWeekGraphicsSections(2019, 5)).not.toThrow()
    expect(getWeekGraphicsSections(2019, 18)).toEqual([])
    expect(getWeekGraphicsSlides(2019, 1)).toEqual([])
  })
})
