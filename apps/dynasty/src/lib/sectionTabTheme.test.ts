import { describe, expect, it } from 'vitest'
import { SECTION_TAB_IDS } from './sectionTabTheme'

describe('sectionTabTheme', () => {
  it('lists all nine workflow tabs', () => {
    expect(SECTION_TAB_IDS).toHaveLength(9)
    expect(SECTION_TAB_IDS).toEqual([
      'standings',
      'live',
      'drafts',
      'gallery',
      'waiver',
      'bestgames',
      'trades',
      'awards',
      'managers',
    ])
  })
})
