/**
 * Original loopable tab beds for Dynasty (not shared with GWB).
 * Synthesized offline with FFmpeg lavfi (sine layers + tremolo) — see AUDIO_CREDITS.md.
 */
import { spawnSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio')
mkdirSync(outDir, { recursive: true })

/** @type {{ file: string; duration: number; sines: { f: number; vol: number }[]; pulseHz?: number; noise?: number }}[] */
const LOOPS = [
  {
    file: 'loop-standings.mp3',
    duration: 6,
    sines: [{ f: 92, vol: 0.22 }, { f: 138, vol: 0.12 }],
    pulseHz: 2,
  },
  {
    file: 'loop-live.mp3',
    duration: 6,
    sines: [{ f: 110, vol: 0.2 }, { f: 220, vol: 0.14 }, { f: 330, vol: 0.06 }],
    pulseHz: 3.5,
  },
  {
    file: 'loop-drafts.mp3',
    duration: 8,
    sines: [{ f: 73.42, vol: 0.18 }, { f: 87.31, vol: 0.14 }, { f: 110, vol: 0.1 }],
    pulseHz: 1.2,
  },
  {
    file: 'loop-gallery.mp3',
    duration: 10,
    sines: [{ f: 164.81, vol: 0.12 }, { f: 246.94, vol: 0.08 }, { f: 329.63, vol: 0.05 }],
    pulseHz: 0.8,
  },
  {
    file: 'loop-waiver.mp3',
    duration: 6,
    sines: [{ f: 98, vol: 0.16 }, { f: 147, vol: 0.12 }, { f: 196, vol: 0.1 }],
    pulseHz: 4.2,
    noise: 0.04,
  },
  {
    file: 'loop-bestgames.mp3',
    duration: 6,
    sines: [{ f: 82.41, vol: 0.2 }, { f: 123.47, vol: 0.16 }, { f: 164.81, vol: 0.1 }],
    pulseHz: 2.8,
  },
  {
    file: 'loop-trades.mp3',
    duration: 6,
    sines: [{ f: 130.81, vol: 0.15 }, { f: 196.22, vol: 0.12 }],
    pulseHz: 2.2,
    noise: 0.03,
  },
  {
    file: 'loop-awards.mp3',
    duration: 8,
    sines: [{ f: 146.83, vol: 0.18 }, { f: 185, vol: 0.14 }, { f: 220, vol: 0.1 }, { f: 293.66, vol: 0.06 }],
    pulseHz: 1.6,
  },
  {
    file: 'loop-managers.mp3',
    duration: 10,
    sines: [{ f: 55, vol: 0.14 }, { f: 82.41, vol: 0.1 }, { f: 110, vol: 0.08 }],
    pulseHz: 1,
  },
]

function renderLoop({ file, duration, sines, pulseHz = 2, noise }) {
  const dest = path.join(outDir, file)
  const args = ['-y']
  for (const s of sines) {
    args.push('-f', 'lavfi', '-i', `sine=frequency=${s.f}:duration=${duration}`)
  }
  let idx = sines.length
  if (noise) {
    args.push(
      '-f',
      'lavfi',
      '-i',
      `anoisesrc=color=pink:duration=${duration}:sample_rate=44100`,
    )
  }

  const labeled = sines.map((s, i) => `[${i}:a]volume=${s.vol}[s${i}]`).join(';')
  const mixInputs = sines.map((_, i) => `[s${i}]`).join('')
  let graph = `${labeled};${mixInputs}amix=inputs=${sines.length}:duration=first[mix]`
  if (noise) {
    graph += `;[${idx}:a]highpass=f=400,lowpass=f=4000,volume=${noise}[n];[mix][n]amix=inputs=2:duration=first[mix2];[mix2]`
    idx++
  } else {
    graph += `;[mix]`
  }
  graph += `tremolo=f=${pulseHz}:d=0.35,volume=0.9[out]`

  args.push('-filter_complex', graph, '-map', '[out]', '-t', String(duration), '-ac', '1', '-ar', '44100', '-b:a', '48k', dest)

  const r = spawnSync('ffmpeg', args, { stdio: 'inherit' })
  if (r.status !== 0) process.exit(r.status ?? 1)
  console.log('Wrote', dest)
}

for (const spec of LOOPS) renderLoop(spec)

console.log('Tab loops written to', outDir)
