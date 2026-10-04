import { describe, expect, it } from 'vitest'
import { mulliganForRoster, mulliganLabel } from './mulligans'

describe('mulligans', () => {
  it('marks Danny and Mauricio as used with notes', () => {
    expect(mulliganForRoster(11).used).toBe(true)
    expect(mulliganLabel(mulliganForRoster(11))).toContain('Week 4 swap')
    expect(mulliganForRoster(12).used).toBe(true)
    expect(mulliganLabel(mulliganForRoster(12))).toContain('Week 1')
  })

  it('leaves other rosters available', () => {
    expect(mulliganForRoster(8).used).toBe(false)
    expect(mulliganLabel(mulliganForRoster(8))).toBe('Available')
  })
})
