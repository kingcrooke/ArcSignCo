import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const M2M4_ASSETS = path.join(__dirname, 'assets-m2-m4')

/** Round-19 panel art only — never read main w5-matchup-cards/assets for m2/m4. */
export function m2m4PanelPath(matchupId, side) {
  return path.join(M2M4_ASSETS, `${matchupId}-${side}.jpg`)
}
