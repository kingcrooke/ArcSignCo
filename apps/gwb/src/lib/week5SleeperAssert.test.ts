import { describe, expect, it } from 'vitest'
import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..')

describe('Week 5 Sleeper assertions', () => {
  it('matches live Sleeper scores, records, and jersey targets', () => {
    const out = execSync('node scripts/week5-sleeper-assert.mjs', {
      cwd: root,
      encoding: 'utf8',
    })
    expect(out).toContain('Week 5 Sleeper assertions OK')
  })
})
