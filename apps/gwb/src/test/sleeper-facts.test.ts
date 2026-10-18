import { execSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const appRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

describe('card-fixes sleeper-facts', () => {
  it('passes commissioner jersey assertions', async () => {
    execSync('node scripts/card-fixes/sleeper-facts.mjs', {
      cwd: appRoot,
      stdio: 'pipe',
    })
    const raw = await readFile(
      path.join(appRoot, 'scripts/card-fixes/sleeper-facts.json'),
      'utf8',
    )
    const facts = JSON.parse(raw) as {
      previews: {
        w5: Array<{
          id: string
          left: { jersey: { name: string; number: number; team: string } }
          right: { jersey: { name: string; number: number; team: string } }
        }>
      }
      margins: { w4: Array<{ margin: number }> }
    }
    const w5m2 = facts.previews.w5.find((x) => x.id === 'vs-w5-m2')!
    expect(w5m2.right.jersey).toMatchObject({
      name: 'Kirk Cousins',
      number: 8,
      team: 'LV',
    })
    const w5m4 = facts.previews.w5.find((x) => x.id === 'vs-w5-m4')!
    expect(w5m4.left.jersey).toMatchObject({
      name: 'Drake Maye',
      number: 10,
      team: 'NE',
    })
    expect(facts.margins.w4[0].margin).toBeCloseTo(6.77, 2)
  })
})
