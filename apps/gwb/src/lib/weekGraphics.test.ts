import { describe, expect, it } from 'vitest'
import { getWeekGraphicsSections } from './weekGraphics'

describe('getWeekGraphicsSections week 4', () => {
  it('lists Results and Report only for a finished week', () => {
    const sections = getWeekGraphicsSections(4)
    expect(sections.map((s) => s.kind)).toEqual(['results', 'report'])
    expect(sections.map((s) => s.heading)).toEqual(['Results', 'Report'])
    expect(sections.find((s) => s.kind === 'results')?.slides).toHaveLength(6)
    expect(sections.find((s) => s.kind === 'report')?.slides).toHaveLength(16)
    expect(
      sections.flatMap((s) => s.slides).some((s) => s.id.startsWith('vs-')),
    ).toBe(false)
  })

  it('keeps finished weeks 1–3 on results and report only', () => {
    for (const week of [1, 2, 3]) {
      const sections = getWeekGraphicsSections(week)
      expect(sections.map((s) => s.kind)).toEqual(['results', 'report'])
      expect(sections.find((s) => s.kind === 'results')?.slides).toHaveLength(6)
    }
  })

  it('publishes the sixteen Week 4 recap slides in order', () => {
    const report = getWeekGraphicsSections(4).find((s) => s.kind === 'report')
    expect(report?.slides.map((s) => [s.id, s.title])).toEqual([
      ['w4-slide-01', 'The Frankie Zone Has Been Evacuated'],
      ['w4-slide-02', 'Steven 180.56 def Narking'],
      ['w4-slide-03', 'Mauricio 141.24 def Eric'],
      ['w4-slide-04', 'Frankie 144.80 def Kayser'],
      ['w4-slide-05', 'Danny 163.91 def Crooke'],
      ['w4-slide-06', 'Hadi 141.65 def Manny'],
      ['w4-slide-07', 'Jamil 162.83 def Matt'],
      ['w4-slide-08', 'Kayser Mulligan #7: Good Mulligan, Lost Anyway'],
      ['w4-slide-09', 'Frankie Zone Temporarily Closed'],
      ['w4-slide-10', 'But One Very Nice Website'],
      ['w4-slide-11', 'Final Week 4 Scoring'],
      ['w4-slide-12', 'Stat of the Week: 0.03'],
      ['w4-slide-13', 'Standings After Week 4'],
      ['w4-slide-14', 'AI Hadi Got Cooked'],
      ['w4-slide-15', 'Week 4 Awards'],
      ['w4-slide-16', 'Week 5: We Run It Back'],
    ])
  })

  it('lists Matchups only for upcoming Week 5', () => {
    const sections = getWeekGraphicsSections(5)
    expect(sections.map((s) => s.kind)).toEqual(['matchups'])
    expect(sections.map((s) => s.heading)).toEqual(['Matchups'])
    expect(sections[0]?.slides.map((s) => [s.id, s.basename, s.title])).toEqual([
      ['vs-w5-m1', 'vs-w5-m1', 'Steven vs Crooke'],
      ['vs-w5-m2', 'vs-w5-m2', 'Danny vs Manny'],
      ['vs-w5-m3', 'vs-w5-m3', 'Narking vs Eric'],
      ['vs-w5-m4', 'vs-w5-m4', 'Hadi vs Frankie'],
      ['vs-w5-m5', 'vs-w5-m5', 'Mauricio vs Jamil'],
      ['vs-w5-m6', 'vs-w5-m6', 'Kayser vs Matt'],
    ])
  })

  it('publishes the six final result cards with approved headlines', () => {
    const results = getWeekGraphicsSections(4).find((s) => s.kind === 'results')
    expect(results?.slides.map((s) => [s.id, s.title])).toEqual([
      ['results-w4-m1', 'FINAL: STEVEN TAKES IT'],
      ['results-w4-m2', 'FINAL: FRANKIE TAKES IT'],
      ['results-w4-m3', 'FINAL: Hadi TAKES IT'],
      ['results-w4-m4', 'FINAL: JAMIL TAKES IT'],
      ['results-w4-m5', 'FINAL: MAURICIO TAKES IT'],
      ['results-w4-m6', 'FINAL: DANNY TAKES IT'],
    ])
  })
})
