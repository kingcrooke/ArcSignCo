/**
 * Build per-tab MP3 loops from verified CC0 OpenGameArt sources.
 * Downloads to OS temp (not committed), trims, loudnorm to -16 LUFS / TP -1.
 */
import { spawnSync } from 'node:child_process'
import { createWriteStream, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pipeline } from 'node:stream/promises'

const outDir = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'public', 'audio')
mkdirSync(outDir, { recursive: true })

export const TAB_SOURCES = [
  {
    out: 'loop-standings.mp3',
    title: 'Just a Minute',
    page: 'https://opengameart.org/content/just-a-minute',
    license: 'CC0 1.0',
    author: 'iamoneabe',
    url: 'https://opengameart.org/sites/default/files/justaminute.mp3',
    maxSec: 40,
    startSec: 0,
  },
  {
    out: 'loop-live.mp3',
    title: 'StarShooter v2.1',
    page: 'https://opengameart.org/content/starshooter',
    license: 'CC0 1.0',
    author: 'Centurion_of_war',
    url: 'https://opengameart.org/sites/default/files/starshooterv2.1.ogg',
    maxSec: 36,
    startSec: 8,
  },
  {
    out: 'loop-drafts.mp3',
    title: 'Fast fun action techno loop 1',
    page: 'https://opengameart.org/content/fast-fun-action-techno-loop-1',
    license: 'CC0 1.0',
    author: 'annandistance',
    url: 'https://opengameart.org/sites/default/files/fast_techno_action_loop.ogg',
    maxSec: 32,
    startSec: 0,
  },
  {
    out: 'loop-gallery.mp3',
    title: 'Ocean Trance',
    page: 'https://opengameart.org/content/ocean-trance',
    license: 'CC0 1.0',
    author: 'MintoDog',
    url: 'https://opengameart.org/sites/default/files/ocean_trance_bpm140.ogg',
    maxSec: 40,
    startSec: 12,
  },
  {
    out: 'loop-waiver.mp3',
    title: 'Cynic Battle Loop',
    page: 'https://opengameart.org/content/cynic-battle-loop',
    license: 'CC0 1.0',
    author: 'Ferk (loop); Alex Smith / cynicmusic (original)',
    url: 'https://opengameart.org/sites/default/files/cynicbattleloop.ogg',
    maxSec: 36,
    startSec: 0,
  },
  {
    out: 'loop-bestgames.mp3',
    title: 'Jamsi Race 8',
    page: 'https://opengameart.org/content/jamsi-race-8',
    license: 'CC0 1.0',
    author: 'Tozan',
    url: 'https://opengameart.org/sites/default/files/jamsirace8.ogg',
    maxSec: 32,
    startSec: 0,
  },
  {
    out: 'loop-trades.mp3',
    title: 'Parasite (looped)',
    page: 'https://opengameart.org/content/parasite',
    license: 'CC0 1.0',
    author: 'Kistol',
    url: 'https://opengameart.org/sites/default/files/Parasite%20%28looped%29.ogg',
    maxSec: 38,
    startSec: 45,
  },
  {
    out: 'loop-awards.mp3',
    title: 'Invincible (Loop)',
    page: 'https://opengameart.org/content/8bit-action-jingle-mini-loop',
    license: 'CC0 1.0',
    author: 'MintoDog',
    zipPath: 'mp3_8bit Action Jingle & Mini Loop/Invincible (Loop)_BPM155.mp3',
    maxSec: 32,
    startSec: 0,
  },
  {
    out: 'loop-managers.mp3',
    title: 'Chill lofi inspired (loop edit)',
    page: 'https://opengameart.org/content/chill-lofi-inspired-loop-edit',
    license: 'CC0 1.0',
    author: 'qubodup (loop edit); omfgdude (original)',
    url: 'https://opengameart.org/sites/default/files/chilllofir-loop.ogg',
    maxSec: 40,
    startSec: 0,
  },
]

const ZIP_AWARDS =
  'https://opengameart.org/sites/default/files/mp3_8bit_action_jingle_mini_loop.zip'

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    stdio: opts.silent ? 'pipe' : 'inherit',
    encoding: opts.silent ? 'utf-8' : undefined,
  })
  if (r.status !== 0) {
    if (opts.silent) console.error(r.stderr)
    process.exit(r.status ?? 1)
  }
  return r
}

async function download(url, dest) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed ${url}: ${res.status}`)
  await pipeline(res.body, createWriteStream(dest))
}

async function ensureSource(spec, workDir) {
  if (spec.zipPath) {
    const zip = join(workDir, 'awards.zip')
    await download(ZIP_AWARDS, zip)
    run('unzip', ['-o', '-q', zip, spec.zipPath, '-d', workDir])
    return join(workDir, spec.zipPath)
  }
  const name = decodeURIComponent(spec.url.split('/').pop() ?? 'source.bin')
  const dest = join(workDir, name)
  await download(spec.url, dest)
  return dest
}

function trimAndPrep(input, trimmed, spec) {
  const ss = spec.startSec ?? 0
  const t = spec.maxSec ?? 32
  run('ffmpeg', [
    '-y',
    '-ss',
    String(ss),
    '-i',
    input,
    '-t',
    String(t),
    '-ar',
    '44100',
    '-ac',
    '2',
    trimmed,
  ])
}

function measureLoudness(input) {
  const r = run(
    'ffmpeg',
    [
      '-i',
      input,
      '-af',
      'loudnorm=I=-16:TP=-1.0:LRA=11:print_format=json',
      '-f',
      'null',
      '-',
    ],
    { silent: true },
  )
  const text = r.stderr ?? ''
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error(`loudnorm measure failed for ${input}`)
  return JSON.parse(match[0])
}

function loudnormApply(input, output, m) {
  run('ffmpeg', [
    '-y',
    '-i',
    input,
    '-af',
    `loudnorm=I=-16:TP=-1.0:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true:print_format=summary`,
    '-ar',
    '44100',
    '-ac',
    '2',
    '-b:a',
    '128k',
    output,
  ])
}

const workRoot = mkdtempSync(join(tmpdir(), 'dynasty-loops-'))
const loudnessReport = []

try {
  for (const spec of TAB_SOURCES) {
    const dir = join(workRoot, spec.out.replace('.mp3', ''))
    mkdirSync(dir, { recursive: true })
    console.log('\n===', spec.out, '←', spec.title)
    const src = await ensureSource(spec, dir)
    const trimmed = join(dir, 'trim.wav')
    const dest = join(outDir, spec.out)
    trimAndPrep(src, trimmed, spec)
    const measured = measureLoudness(trimmed)
    loudnormApply(trimmed, dest, measured)
    const final = measureLoudness(dest)
    const integratedLufs = Number(final.output_i)
    const truePeakDbtp = Number(final.output_tp)
    loudnessReport.push({
      file: spec.out,
      integrated_lufs: integratedLufs,
      true_peak_dbtp: truePeakDbtp,
    })
    console.log(
      `  LUFS ${integratedLufs.toFixed(2)}  TP ${truePeakDbtp.toFixed(2)} dBTP`,
    )
  }

  writeFileSync(
    join(outDir, 'loop-loudness.json'),
    JSON.stringify(loudnessReport, null, 2),
  )
  console.log('\nWrote', join(outDir, 'loop-loudness.json'))
} finally {
  rmSync(workRoot, { recursive: true, force: true })
}
