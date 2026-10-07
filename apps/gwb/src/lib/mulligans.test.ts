import { describe, expect, it } from 'vitest'
import {
  formatMulliganLedgerLine,
  formatMulliganReceipt,
  mulliganReceiptParts,
  mulliganStatusParts,
  mulliganEntriesForWeek,
  mulliganForRoster,
  mulliganLabel,
  mulliganLedgerEntries,
  mulliganStatusForRoster,
  mulliganStatusThroughWeek,
  mulligansDeferralNote,
  mulligansUsedThroughWeek,
  MULLIGAN_LEDGER_ENTRIES,
} from './mulligans'
import league from '../test/fixtures/league.json'
import state from '../test/fixtures/state-nfl.json'
import type { NflState, SleeperLeague } from './types'

describe('mulligans', () => {
  it('lists all seven confirmed uses in ledger order', () => {
    expect(mulliganLedgerEntries()).toHaveLength(7)
    expect(MULLIGAN_LEDGER_ENTRIES).toHaveLength(7)
  })

  it('marks rosters 1, 2, 3, 4, 8, 9, 12 as used and leaves others available', () => {
    for (const id of [1, 2, 3, 4, 8, 9, 12]) {
      expect(mulliganStatusForRoster(id).used).toBe(true)
    }
    expect(mulliganLabel(mulliganStatusForRoster(4))).toContain('Used')
    expect(mulliganLabel(mulliganStatusForRoster(4))).toContain('Rashee Rice')
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
    expect(formatMulliganLedgerLine(narking)).toContain('+5.30')
    expect(formatMulliganLedgerLine(narking)).toContain('131.40')
    expect(formatMulliganLedgerLine(danny)).toContain('Hadi')
    expect(formatMulliganLedgerLine(mauricio)).toContain(
      'Won anyway; the swap actually cost 0.9.',
    )
    expect(formatMulliganLedgerLine(mulliganForRoster(9)!)).toContain('Manny (Mnny)')
    expect(formatMulliganLedgerLine(mulliganForRoster(9)!)).not.toContain('………')
    expect(JSON.stringify(MULLIGAN_LEDGER_ENTRIES)).not.toMatch(/Hady/i)
    expect(danny.opponentLabel).toBe('Hadi')
    expect(narking.netImpactOverride).toBe(5.3)
    expect(mulliganLabel(mulliganStatusForRoster(3))).toContain('+5.30')
  })

  it('splits status and receipts onto separate lines', () => {
    const mauricio = mulliganStatusParts(2, 3)
    expect(mauricio.used).toBe(true)
    if (!mauricio.used) return
    expect(mauricio.week).toBe(1)
    expect(mauricio.outLine).toBe('OUT A.J. Brown 5.60')
    expect(mauricio.inLine).toBe('IN Tre Tucker 4.70')
    expect(mauricio.netLine).toBe('Net −0.90')
    expect(mauricio.outLine).not.toContain('IN')

    const crooke = mulliganReceiptParts(mulliganForRoster(8)!)
    expect(crooke.manager).toBe('Crooke')
    expect(crooke.outLine).toContain('Parker Washington')
    expect(crooke.inLine).toContain('Mike Evans')
    expect(crooke.netLine).toBe('Net +10.60')
    expect(crooke.resultLine).toBe('L 121.27–163.91')
    expect(crooke.versusLine).toContain('Danny')
    expect(crooke.outLine).not.toContain('Net')
    expect(crooke.resultLine).not.toContain('OUT')
  })

  it('shows Crooke week 4 swap with final Evans points and loss vs Danny', () => {
    const crooke = mulliganForRoster(8)!
    expect(crooke.week).toBe(4)
    expect(formatMulliganReceipt(crooke)).toContain('12.60')
    expect(formatMulliganReceipt(crooke)).toContain('+10.60')
    expect(formatMulliganReceipt(crooke)).toContain('L 121.27–163.91')
    expect(formatMulliganReceipt(crooke)).not.toContain('pending')
    expect(formatMulliganReceipt(crooke)).not.toContain('live')
    expect(mulliganReceiptParts(crooke).versusLine).toContain('Danny')
    expect(formatMulliganLedgerLine(crooke)).toContain('Lost')
  })

  it('shows Kayser week 4 swap as final loss vs Turn Your Head And Goff (no flip)', () => {
    const kayser = mulliganForRoster(4)!
    expect(kayser.id).toBe('w4-kayser')
    expect(kayser.week).toBe(4)
    expect(kayser.won).toBe(false)
    expect(kayser.flipped).toBe(false)
    expect(kayser.resultPending).toBeUndefined()
    expect(kayser.netImpact).toBe(5.2)
    expect(kayser.scoreWith).toBe(128.44)
    expect(kayser.scoreWithout).toBe(123.24)
    expect(kayser.opponentScore).toBe(144.8)
    expect(formatMulliganReceipt(kayser)).toContain('Brycen Tremayne')
    expect(formatMulliganReceipt(kayser)).toContain('+5.20')
    expect(formatMulliganReceipt(kayser)).toContain('L 128.44–144.80')
    expect(formatMulliganLedgerLine(kayser)).toContain('WR KC')
    expect(formatMulliganLedgerLine(kayser)).toContain('WR CAR')
    expect(formatMulliganLedgerLine(kayser)).toContain('Lost')
    expect(formatMulliganLedgerLine(kayser)).toContain('No flip')
    expect(formatMulliganLedgerLine(kayser)).toContain(
      'Vele dropped 17.4 on MNF; lost by 16.36 even with the +5.2.',
    )
    expect(mulliganEntriesForWeek(4).map((e) => e.managerShort)).toEqual([
      'Kayser',
      'Crooke',
    ])
  })

  it('respects throughWeek for status and week filters for results', () => {
    expect(mulligansUsedThroughWeek(1)).toBe(1)
    expect(mulligansUsedThroughWeek(2)).toBe(3)
    expect(mulligansUsedThroughWeek(3)).toBe(5)
    expect(mulligansUsedThroughWeek(4)).toBe(7)
    expect(mulliganStatusForRoster(9, 1).used).toBe(false)
    expect(mulliganStatusForRoster(9, 2).used).toBe(true)
    expect(mulliganStatusForRoster(8, 3).used).toBe(false)
    expect(mulliganStatusForRoster(8, 4).used).toBe(true)
    expect(mulliganEntriesForWeek(2)).toHaveLength(2)
    expect(mulliganEntriesForWeek(4)).toHaveLength(2)
    expect(mulliganStatusForRoster(4, 3).used).toBe(false)
    expect(mulliganStatusForRoster(4, 4).used).toBe(true)
  })

  it('extends mulligan status through the ledger week while standings defer', () => {
    expect(mulliganStatusThroughWeek(3, 4)).toBe(4)
    expect(mulliganStatusThroughWeek(4, 4)).toBe(4)
    expect(mulliganStatusThroughWeek(3, 2)).toBe(3)
  })

  it('uses live mulligan deferral copy when ledger week is in progress', () => {
    const liveLeague = {
      ...(league as SleeperLeague),
      settings: { ...league.settings, leg: 4, last_scored_leg: 3 },
    }
    const liveState = { ...(state as NflState), week: 4, display_week: 4 }
    expect(
      mulligansDeferralNote(4, liveLeague, liveState, 3),
    ).toBe('Week 4 in progress. Mulligan status live through Week 4.')
  })
})
