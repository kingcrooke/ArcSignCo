#!/usr/bin/env node
/**
 * Render GWB recap MP4 from Sleeper week + matchup_id.
 *
 * Usage:
 *   node bin/render.mjs --week 3 --matchup 2 --out /opt/cursor/artifacts/gwb-recap-w3-m2
 */
import { chromium } from 'playwright'
import { execSync } from 'node:child_process'
import { copyFileSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildRecapConfig } from '../src/buildConfig.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const PUBLIC = path.join(ROOT, 'public')

function parseArgs(argv) {
  const out = { week: 3, matchup: 2, outDir: '/opt/cursor/artifacts/gwb-recap-test', vertical: true, suffix: '' }
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--week') out.week = Number(argv[++i])
    else if (argv[i] === '--matchup') out.matchup = Number(argv[++i])
    else if (argv[i] === '--out') out.outDir = argv[++i]
    else if (argv[i] === '--suffix') out.suffix = argv[++i]
    else if (argv[i] === '--no-vertical') out.vertical = false
  }
  return out
}

function tag(base, suffix) {
  return suffix ? `${base}-${suffix}` : base
}

function run(cmd) {
  execSync(cmd, { stdio: 'inherit' })
}

function latestWebm(dir) {
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.webm'))
    .map((f) => {
      const full = path.join(dir, f)
      return { full, mtime: statSync(full).mtimeMs }
    })
    .sort((a, b) => b.mtime - a.mtime)
  if (!files.length) throw new Error(`No webm in ${dir}`)
  return files[0].full
}

function cleanPlaywrightVideo(parentDir) {
  const videoDir = path.join(parentDir, '.playwright-video')
  rmSync(videoDir, { recursive: true, force: true })
}

async function recordHtml(config, { width, height, durationSec, outWebm }) {
  cleanPlaywrightVideo(path.dirname(outWebm))
  const videoDir = path.join(path.dirname(outWebm), '.playwright-video')
  mkdirSync(videoDir, { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width, height },
    recordVideo: { dir: videoDir, size: { width, height } },
  })
  const page = await context.newPage()
  const htmlPath = path.join(PUBLIC, 'recap.html')
  await page.goto(`file://${htmlPath}`, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForFunction(() => typeof window.startRecapPlayback === 'function')
  await page.evaluate(async (cfg) => {
    window.__RECAP_BOOT__ = cfg
    await window.startRecapPlayback(cfg)
  }, config)
  await page.waitForTimeout(600)
  await context.close()
  await browser.close()

  copyFileSync(latestWebm(videoDir), outWebm)
  return outWebm
}

function postProcess(webmPath, mp4Path, durationSec) {
  const silent = 'anullsrc=channel_layout=stereo:sample_rate=48000'
  run(
    `ffmpeg -y -i "${webmPath}" -f lavfi -i ${silent} -t ${durationSec} -r 30 -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest "${mp4Path}"`,
  )
}

function extractStills(mp4Path, outDir, durationSec, suffix) {
  const marks = [2, 8, 18, 34, 42, 50]
  const frames = []
  for (const sec of marks) {
    if (sec > durationSec) continue
    const name = tag(`still-${String(sec).padStart(2, '0')}s`, suffix) + '.png'
    const out = path.join(outDir, name)
    run(`ffmpeg -y -ss ${sec} -i "${mp4Path}" -frames:v 1 -update 1 "${out}"`)
    frames.push(out)
  }
  return frames
}

async function main() {
  const args = parseArgs(process.argv)
  mkdirSync(args.outDir, { recursive: true })
  cleanPlaywrightVideo(args.outDir)

  const config = await buildRecapConfig({ week: args.week, matchupId: args.matchup })
  const base = `gwb-recap-w${args.week}-m${args.matchup}`
  const tagged = tag(base, args.suffix)

  const configPath = path.join(args.outDir, tag(`recap-w${args.week}-m${args.matchup}`, args.suffix) + '.config.json')
  const timingsPath = path.join(args.outDir, tag('scene-timings', args.suffix) + '.json')
  writeFileSync(configPath, JSON.stringify(config, null, 2))
  writeFileSync(timingsPath, JSON.stringify(config.timing, null, 2))

  const durationSec = config.timing.durationSec
  const webm = path.join(args.outDir, tag('recap-landscape', args.suffix) + '.webm')
  const mp4 = path.join(args.outDir, `${tagged}-1080p.mp4`)

  console.log('Recording landscape…', { week: args.week, matchup: args.matchup })
  await recordHtml(config, { width: 1920, height: 1080, durationSec, outWebm: webm })
  postProcess(webm, mp4, durationSec)

  const poster = path.join(args.outDir, `${tagged}-poster.png`)
  run(`ffmpeg -y -ss ${durationSec - 2} -i "${mp4}" -frames:v 1 -update 1 "${poster}"`)

  const stills = extractStills(mp4, args.outDir, durationSec, args.suffix)

  let verticalMp4 = null
  if (args.vertical) {
    verticalMp4 = path.join(args.outDir, `${tagged}-vertical-1080x1920.mp4`)
    const silent = 'anullsrc=channel_layout=stereo:sample_rate=48000'
    run(
      `ffmpeg -y -i "${mp4}" -f lavfi -i ${silent} -t ${durationSec} -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0b0d12" -r 30 -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest "${verticalMp4}"`,
    )
  }

  const summary = {
    config: configPath,
    timings: timingsPath,
    mp4,
    verticalMp4,
    poster,
    stills,
    scores: {
      winner: config.matchup.winner.nickname,
      winnerPoints: config.matchup.winner.points,
      loser: config.matchup.loser.nickname,
      loserPoints: config.matchup.loser.points,
    },
  }
  writeFileSync(path.join(args.outDir, tag('render-summary', args.suffix) + '.json'), JSON.stringify(summary, null, 2))
  console.log(JSON.stringify(summary, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
