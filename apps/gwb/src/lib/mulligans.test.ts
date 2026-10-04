import { describe, expect, it } from 'vitest'
import {
  formatMulliganLedgerLine,
  mulliganForRoster,
  mulliganLabel,
  mulliganLedgerEntries,
  mulliganStatusForRoster,
  MULLIGAN_LEDGER_ENTRIES,
} from './mulligans'

describe('mulligans', () => {
  it('lists all five confirmed uses in ledger order', () => {
    expect(mulliganLedgerEntries()).toHaveLength(5)
    expect(MULLIGAN_LEDGER_ENTRIES).toHaveLength(5)
  })

  it('marks rosters 1, 2, 3, 9, 12 as used and leaves others available', () => {
    for (const id of [1, 2, 3, 9, 12]) {
      expect(mulliganStatusForRoster(id).used).toBe(true)
    }
    expect(mulliganLabel(mulliganStatusForRoster(1))).toContain('Bateman')
    expect(mulliganLabel(mulliganStatusForRoster(12))).toContain('Week 2')
    expect(mulliganLabel(mulliganStatusForRoster(12))).toContain('DJ Moore')
    expect(mulliganStatusForRoster(11).used).toBe(false)
    expect(mulliganLabel(mulliganStatusForRoster(11))).toBe('Available')
    expect(mulliganLabel(mulliganStatusForRoster(8))).toBe('Available')
  })

  it('uses Hadi, +5.3, Mauricio note, and Matt failed tag', () => {
    const narking = mulliganForRoster(3)!
    const danny = mulliganForRoster(1)!
    const mauricio = mulliganForRoster(2)!
    const matt = mulliganForRoster(12)!
    expect(formatMulliganLedgerLine(narking)).toContain('+5.3')
    expect(formatMulliganLedgerLine(narking)).not.toContain('+7.3')
    expect(formatMulliganLedgerLine(danny)).toContain('Hadi')
    expect(formatMulliganLedgerLine(mauricio)).toContain(
      'Won anyway; the swap actually cost 0.9.',
    )
    expect(formatMulliganLedgerLine(matt)).toContain('The first failed mulligan.')
    expect(JSON.stringify(MULLIGAN_LEDGER_ENTRIES)).not.toMatch(/Hady/i)
    expect(JSON.stringify(MULLIGAN_LEDGER_ENTRIES)).not.toContain('+7.3')
  })
})
