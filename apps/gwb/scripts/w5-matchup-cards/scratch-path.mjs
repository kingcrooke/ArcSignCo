import os from 'node:os'
import path from 'node:path'

/** Ephemeral Playwright/HTML scratch — never commit under the repo. */
export const W5_SCRATCH = path.join(os.tmpdir(), 'gwb-w5-matchup')
