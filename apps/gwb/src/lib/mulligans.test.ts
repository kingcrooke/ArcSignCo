import { describe, expect, it } from 'vitest'
import {
  formatMulliganLedgerLine,
  formatMulliganReceipt,
  mulliganEntriesForWeek,
  mulliganForRoster,
  mulliganLabel,
  mulliganLedgerEntries,
  mulliganStatusForRoster,
  mulliganStatusThroughWeek,
  mulligansUsedThroughWeek,
  MULLIGAN_LEDGER_ENTRIES,
} from './mulligans'

describe('mulligans', () => {
  it('lists all six confirmed uses in ledger order', () => {
    expect(mulliganLedgerEntries()).toHaveLength(6)
    expect(MULLIGAN_LEDGER_ENTRIES).toHaveLength(6)
  })

  it('marks rosters 1, 2, 3, 8, 9, 12 as used and leaves others available', () => {
    for (const id of [1, 2, 3, 8, 9, 12]) {
      expect(mulliganStatusForRoster(id).used).toBe(true)
    }
    expect(mulliganLabel(mulliganStatusForRoster(1))).toContain('Bateman')
    expect(mulliganLabel(mulliganStatusForRoster(12))).toContain('Week 2')
    expect(mulliganLabel(mulliganStatusForRoster(12))).toContain('DJ Moore')
    expect(mulliganLabel(mulliganStatusForRoster(8))).toContain('Washington')
    expect(mulliganStatusForRoster(11).used).toBe(false)
    expect(mulliganLabel(mulliganStatusForRoster(11))).toBe('Available')
  })

  it('uses Hadi, +7.3, Mauricio note, and Matt failed tag', () => {
    const narking = mulliganForRoster(3)!
    const danny = mulliganForRoster(1)!
    const mauricio = mulliganForRoster(2)!
    const matt = mulliganForRoster(12)!
    expect(formatMulliganLedgerLine(narking)).toContain('+7.30')
    expect(formatMulliganLedgerLine(narking)).toContain('129.40')
    expect(formatMulliganLedgerLine(danny)).toContain('Hadi')
    expect(formatMulliganLedgerLine(mauricio)).toContain(
      'Won anyway; the swap actually cost 0.9.',
    )
    expect(formatMulliganLedgerLine(mulliganForRoster(9)!)).toContain('Manny (Mnny)')
    expect(formatMulliganLedgerLine(mulliganForRoster(9)!)).not.toContain('………')
    expect(JSON.stringify(MULLIGAN_LEDGER_ENTRIES)).not.toMatch(/Hady/i)
    expect(narking.netImpact).toBe(7.3)
  })

  it('shows Jesus week 4 swap with pending Evans until live points arrive', () => {
    const jesus = mulliganForRoster(8)!
    expect(jesus.week).toBe(4)
    expect(formatMulliganReceipt(jesus)).toContain('pending')
    expect(formatMulliganReceipt(jesus)).toContain('TBD')
    expect(formatMulliganReceipt(jesus, { playerPoints: { '2216': 6.4 } })).toContain(
      '6.40 (live)',
    )
    expect(formatMulliganReceipt(jesus, { playerPoints: { '2216': 6.4 } })).toContain(
      '+4.40',
    )
  })

  it('respects throughWeek for status and week filters for results', () => {
    expect(mulligansUsedThroughWeek(1)).toBe(1)
    expect(mulligansUsedThroughWeek(2)).toBe(3)
    expect(mulligansUsedThroughWeek(3)).toBe(5)
    expect(mulligansUsedThroughWeek(4)).toBe(6)
    expect(mulliganStatusForRoster(9, 1).used).toBe(false)
    expect(mulliganStatusForRoster(9, 2).used).toBe(true)
    expect(mulliganStatusForRoster(8, 3).used).toBe(false)
    expect(mulliganStatusForRoster(8, 4).used).toBe(true)
    expect(mulliganEntriesForWeek(2)).toHaveLength(2)
    expect(mulliganEntriesForWeek(4)).toHaveLength(1)
  })

  it('extends mulligan status through the ledger week while standings defer', () => {
    expect(mulliganStatusThroughWeek(3, 4)).toBe(4)
    expect(mulliganStatusThroughWeek(4, 4)).toBe(4)
    expect(mulliganStatusThroughWeek(3, 2)).toBe(3)
  })
})
