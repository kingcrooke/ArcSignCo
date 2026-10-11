/**
 * Tiny UI stingers (WebAudio-style) as short MP3 files when Freesound is unavailable.
 */
import { spawnSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio')
mkdirSync(outDir, { recursive: true })

function synth(file, filter) {
  const dest = path.join(outDir, file)
  const r = spawnSync(
    'ffmpeg',
    ['-y', '-f', 'lavfi', '-i', filter, '-t', '0.08', '-ac', '1', '-ar', '44100', '-b:a', '32k', dest],
    { stdio: 'inherit' },
  )
  if (r.status !== 0) process.exit(r.status ?? 1)
}

synth('click.mp3', 'sine=frequency=1800:duration=0.04')
synth('buzzer.mp3', 'sine=frequency=180:duration=0.35')

console.log('Wrote click.mp3 and buzzer.mp3 to', outDir)
