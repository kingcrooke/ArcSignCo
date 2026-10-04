import { describe, expect, it } from 'vitest'
import {
  formatMulliganLedgerLine,
  mulliganForRoster,
  mulliganLabel,
  MULLIGAN_LEDGER_ENTRIES,
  pendingMulliganEntries,
  publishedMulliganEntries,
} from './mulligans'

describe('mulligans', () => {
  it('keeps pending entries in data but out of published views', () => {
    expect(publishedMulliganEntries()).toHaveLength(2)
    expect(pendingMulliganEntries()).toHaveLength(3)
    expect(MULLIGAN_LEDGER_ENTRIES).toHaveLength(5)
  })

  it('marks only published managers as used in standings table', () => {
    expect(mulliganForRoster(1).used).toBe(true)
    expect(mulliganLabel(mulliganForRoster(1))).toContain('Bateman')
    expect(mulliganForRoster(3).used).toBe(true)
    expect(mulliganLabel(mulliganForRoster(3))).toContain('Achane')
    expect(mulliganForRoster(2).used).toBe(false)
    expect(mulliganForRoster(9).used).toBe(false)
    expect(mulliganForRoster(12).used).toBe(false)
    expect(mulliganLabel(mulliganForRoster(8))).toBe('Available')
  })

  it('uses Hadi and +5.3 for published Narking and Danny lines', () => {
    const narking = publishedMulliganEntries().find((e) => e.rosterId === 3)!
    const danny = publishedMulliganEntries().find((e) => e.rosterId === 1)!
    const narkingLine = formatMulliganLedgerLine(narking)
    const dannyLine = formatMulliganLedgerLine(danny)
    expect(narkingLine).toContain('+5.3')
    expect(narkingLine).not.toContain('+7.3')
    expect(dannyLine).toContain('Hadi')
    expect(dannyLine).not.toMatch(/Hady/i)
    expect(JSON.stringify(MULLIGAN_LEDGER_ENTRIES)).not.toMatch(/Hady/i)
    expect(JSON.stringify(MULLIGAN_LEDGER_ENTRIES)).not.toContain('+7.3')
  })
})
