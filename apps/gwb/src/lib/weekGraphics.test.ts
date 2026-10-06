import { describe, expect, it } from 'vitest'
import { getWeekGraphicsSections } from './weekGraphics'

describe('getWeekGraphicsSections week 4', () => {
  it('lists Results between Matchups and Report', () => {
    const sections = getWeekGraphicsSections(4)
    expect(sections.map((s) => s.kind)).toEqual(['matchups', 'results', 'report'])
    expect(sections.map((s) => s.heading)).toEqual(['Matchups', 'Results', 'Report'])
  })

  it('publishes the six final result cards with approved headlines', () => {
    const results = getWeekGraphicsSections(4).find((s) => s.kind === 'results')
    expect(results?.slides.map((s) => [s.id, s.title])).toEqual([
      ['results-w4-m1', 'FINAL: STEVEN TAKES IT'],
      ['results-w4-m2', 'FINAL: FRANKIE TAKES IT'],
      ['results-w4-m3', 'FINAL: HADI TAKES IT'],
      ['results-w4-m4', 'FINAL: JAMIL TAKES IT'],
      ['results-w4-m5', 'FINAL: MAURICIO TAKES IT'],
      ['results-w4-m6', 'FINAL: DANNY TAKES IT'],
    ])
  })
})
