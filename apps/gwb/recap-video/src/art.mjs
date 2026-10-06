import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function loadArtManifest(manifestPath) {
  const raw = await readFile(manifestPath, 'utf8')
  return JSON.parse(raw)
}

/** Resolve portrait URL path for winner/loser (placeholder or custom). */
export function resolvePortraitUrls(manifest) {
  const placeholder = manifest.placeholder?.portrait ?? 'assets/buffalo-neutral.svg'
  const winner = manifest.mode === 'custom' && manifest.winner?.portrait ? manifest.winner.portrait : placeholder
  const loser = manifest.mode === 'custom' && manifest.loser?.portrait ? manifest.loser.portrait : placeholder
  return { winner, loser, mode: manifest.mode ?? 'placeholder' }
}

export const DEFAULT_JERSEY_STYLES = {
  winner: { number: '11', bodyColor: '#1a2a44', numberColor: '#3dba4c', label: 'navy / green' },
  loser: { number: '16', bodyColor: '#0d6b6b', numberColor: '#f4f5f7', label: 'teal' },
}
