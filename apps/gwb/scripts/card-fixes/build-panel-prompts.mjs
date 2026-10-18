/**
 * Build panel-prompts.json for card-fixes img2img (dual-ref: pose + W5 granite tone).
 * Run: node scripts/card-fixes/build-panel-prompts.mjs
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXES = JSON.parse(await readFile(path.join(__dirname, 'panel-fixes.json'), 'utf8'))
const FACTS = JSON.parse(await readFile(path.join(__dirname, 'sleeper-facts.json'), 'utf8'))

const REF91 = path.join(__dirname, '../w6-matchup-cards/refs-91')
const REFW5 = path.join(__dirname, '../w6-matchup-cards/refs-w5')
const REFCROP = path.join(__dirname, '../w5-matchup-cards/ref-crops')

/** Unique pose per panelId — preview confident; result winner hyped / loser dejected */
const POSES = {
  'mauricio-NYG-9-w1': 'fist pump skyward, mouth open celebrating',
  'hady-NE-10-w1': 'head down, shoulders slumped, dejected walk-off',
  'narking-NO-6-w1': 'hands on helmet, frustrated stare at ground',
  'danny-DEN-10-w1': 'kneeling on one knee, disappointed',
  'steven-CHI-4-w1': 'beating chest, roaring winner',
  'frankie-CIN-9-w1': 'arms limp at sides, blank stare loss',
  'manny-CHI-18-w1': 'pointing at scoreboard, hyped winner',
  'eric-DAL-4-w1': 'turning away from camera, dejected',
  'mauricio-LAC-10-w2': 'palms up “why me” loser',
  'kayser-LAR-9-w2': 'victory flex both arms high',
  'danny-JAX-16-w2': 'dejected slumped shoulders, Jacksonville teal jersey number 16 visible',
  'steven-NO-12-w2': 'confident smirk, hand on hip',
  'matt-BUF-17-w2': 'headshake, arms crossed loser',
  'jamil-PHI-1-w2': 'slumped on bench posture',
  'eric-DAL-4-w2': 'spiking invisible football celebration',
  'frankie-CIN-9-w2': 'hands on knees catching breath loss',
  'narking-SF-13-w3': 'stare at turf, bitter loss',
  'danny-JAX-16-w3': 'walking off field back turned',
  'steven-SEA-14-w3': 'crowd wave one arm raised winner',
  'mauricio-CAR-9-w3': 'disbelief hands on head loser',
  'kayser-LAR-9-w3': 'confident quarterback pre-throw windup winner',
  'eric-ATL-5-w3': 'jumping chest bump solo celebration',
  'matt-BUF-17-w3': 'frustrated helmet off at hip loser',
  'steven-SEA-14-w4': 'intense stare-down, arms at sides preview',
  'kayser-LAR-9-w4': 'adjusting chin strap, locked-in preview',
  'frankie-DET-16-w4': 'football at chest two-hand grip, calm focus preview',
  'hady-MIN-1-w4': 'pointing forward commanding preview',
  'jamil-PHI-1-w4': 'ready stance knees bent preview',
  'mauricio-CAR-9-w4': 'cracking neck side to side preview',
  'danny-JAX-16-w4': 'football tucked under arm forward lean preview',
  'manny-LV-8-w5': 'overhand throw motion, eyes downfield preview',
  'hady-NE-10-w5': 'stone-faced stare-down preview, calm eyes',
  'narking-SF-13-w4': 'arms crossed skeptical preview stance',
  'manny-KC-15-w4': 'confident smirk preview, chin up',
  'matt-BUF-17-w4': 'tense ready stance preview',
  'eric-DAL-4-w4': 'arms crossed chin up preview, no pointing gesture',
  'crooke-BAL-8-w4': 'Lamar swagger preview, football in one hand',
  'danny-JAX-16-w5': 'forward lean tuck and run preview',
  'frankie-DET-16-w5': 'slumped shoulders preview loser energy',
  'steven-CHI-4-w1': 'roaring hyped winner, chest out, no brown fur tint',
  'steven-NO-12-w2': 'fist pump hyped winner celebration',
  'manny-CHI-18-w1': 'arms raised hyped winner shouting, no city signs or text in background',
  'eric-DAL-4-w1': 'slumped shoulders dejected loser',
  'frankie-CIN-9-w2': 'dejected kneeling loser, Bengals orange jersey clear',
  'frankie-DET-16-w4': 'holding ball at chest, number 16 large high-contrast on chest',
  'matt-BUF-17-w2': 'dejected arms at sides away from chest, number 17 large on jersey front',
  'kayser-LAR-9-w3': 'victory pose winner, smooth stone skin no shaggy fur',
  'danny-JAX-16-w3': 'walking away dejected, smooth stone skin no fur',
}

const TEAM_COLORS = {
  NYG: 'New York Giants blue jersey white number',
  NE: 'New England Patriots navy jersey red-white-blue number',
  NO: 'New Orleans Saints black jersey gold number',
  DEN: 'Denver Broncos orange jersey navy number',
  CHI: 'Chicago Bears navy jersey orange number',
  CIN: 'Cincinnati Bengals orange jersey black number',
  DAL: 'Dallas Cowboys white jersey blue number',
  LAC: 'Los Angeles Chargers powder blue jersey',
  LAR: 'Los Angeles Rams royal blue jersey gold trim',
  JAX: 'Jacksonville Jaguars teal jersey white number',
  BUF: 'Buffalo Bills royal blue jersey red-white number',
  PHI: 'Philadelphia Eagles midnight green jersey white number',
  SF: 'San Francisco 49ers red jersey gold number',
  SEA: 'Seattle Seahawks navy jersey green number',
  CAR: 'Carolina Panthers black jersey blue number',
  ATL: 'Atlanta Falcons black jersey red number',
  MIN: 'Minnesota Vikings purple jersey gold number',
  DET: 'Detroit Lions Honolulu blue jersey silver number',
  LV: 'Las Vegas Raiders black jersey silver number',
  BAL: 'Baltimore Ravens purple jersey white number',
}

const W5_TONE = 'results-w5-m2-winner.jpg'

function isResult(cardId) {
  return cardId.startsWith('results-')
}

function isPreview(cardId) {
  return cardId.startsWith('vs-')
}

function mood(job) {
  if (!isResult(job.cardId)) return 'confident pre-game preview energy'
  return job.side === 'winner' ? 'hyped winner celebration' : 'dejected loser body language'
}

function refAFor(job) {
  const key = job.managerKey
  const crop = path.join(REFCROP, `${key}.jpg`)
  return crop
}

function outFilename(job) {
  if (job.outFile.includes('w5-matchup')) {
    return path.basename(job.outFile)
  }
  if (job.outFile.startsWith('w4-preview')) {
    return path.basename(job.outFile)
  }
  return `${job.panelId}.jpg`
}

function pickW5Ref(job) {
  const week = job.panelId.match(/-w(\d+)$/)?.[1] ?? '5'
  const n = (job.managerKey.length + week.charCodeAt(0)) % 6
  const sides = ['winner', 'loser']
  const side = sides[n % 2]
  const m = ((job.jersey?.number ?? 1) % 6) + 1
  return `results-w5-m${m}-${side}.jpg`
}

function promptFor(job) {
  const team = job.jersey.team
  const num = job.jersey.number
  const pose = POSES[job.panelId] ?? 'three-quarter athletic stance, distinct from arms-crossed'
  const colors = TEAM_COLORS[team] ?? `${team} NFL jersey correct team colors`
  const numberRule = `ONE bold ${num} printed in jersey fabric once, large on chest, never hidden by arms or hands`
  const stone =
    'Reference B: light weathered granite stone-gray SKIN with subtle red crack glow (PR #94 tone). NO fur, NO mane, NO beard, NO brown tint on skin. Full head and horns in frame, full-panel vertical portrait.'
  const refA =
    'Reference A: manager face/horns likeness and jersey layout. Reference B: fur lightness only.'
  return `${refA} ${stone}. ${colors}. Correct official team logo only. ${numberRule}. POSE: ${pose}. ${mood(job)}. NO text, signs, stadium words, extra background numbers, or lettering anywhere. Vertical 3:4 portrait, photoreal illustration, no card frame, full-bleed character.`
}

const items = []
for (const job of FIXES.panels) {
  const file = outFilename(job)
  items.push({
    panelId: job.panelId,
    cardId: job.cardId,
    side: job.side,
    file,
    outFile: job.outFile,
    refA: refAFor(job),
    refB: path.join(REFW5, pickW5Ref(job)),
    w5_style_ref: pickW5Ref(job),
    pose: POSES[job.panelId],
    prompt: promptFor(job),
  })
}

const out = path.join(__dirname, 'panel-prompts.json')
await writeFile(out, JSON.stringify(items, null, 2) + '\n')
console.log(`Wrote ${items.length} prompts to ${out}`)
