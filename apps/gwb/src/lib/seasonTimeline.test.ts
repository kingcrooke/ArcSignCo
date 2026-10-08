import { describe, expect, it } from 'vitest'
import { MULLIGAN_LEDGER_ENTRIES } from './mulligans'
import {
  buildSeasonTimeline,
  TIMELINE_MULLIGAN_ENTRY_IDS,
} from './seasonTimeline'

describe('season timeline mulligans', () => {
  it('only includes commissioner timeline mulligans', () => {
    const events = buildSeasonTimeline({
      season: '2026',
      matchupsByWeek: new Map(),
      teams: new Map(),
      mulliganEntries: MULLIGAN_LEDGER_ENTRIES,
      trades: [],
      weekCloses: new Map(),
    })
    const mulls = events.filter((e) => e.kind === 'mulligan')
    expect(mulls).toHaveLength(TIMELINE_MULLIGAN_ENTRY_IDS.size)
    const headlines = mulls.map((e) => e.headline).join(' ')
    expect(headlines).toContain('Mauricio')
    expect(headlines).toContain('Narking')
    expect(headlines).toContain('Danny')
    expect(headlines).toContain('Kayser')
    expect(headlines).not.toContain('Crooke')
    expect(headlines).not.toContain('Manny')
    expect(headlines).not.toContain('Matt')
  })
})
