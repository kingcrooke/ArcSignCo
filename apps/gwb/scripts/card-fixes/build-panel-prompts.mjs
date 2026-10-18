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
  'mauricio-NYG-9-w1': 'leaping celebration both arms wide, hyped winner',
  'kayser-BAL-22-w1': 'flexing bicep toward crowd, hyped winner',
  'matt-BUF-17-w1': 'spiking football at feet, hyped winner',
  'jamil-KC-9-w1': 'pointing to sky with index finger, hyped winner',
  'steven-CHI-4-w1': 'chest bump solo pose, hyped winner',
  'manny-CHI-18-w1': 'arms raised shouting to crowd, hyped winner',
  'crooke-BAL-8-w1': 'kneeling on turf one knee, dejected loser',
  'hady-NE-10-w1': 'both hands on head, dejected loser',
  'danny-DEN-10-w1': 'sitting on bench slumped, dejected loser',
  'frankie-CIN-9-w1': 'walking away from camera shoulders low, dejected loser',
  'eric-DAL-4-w1': 'slumped against wall arms crossed, dejected loser',
  'narking-NO-6-w1': 'helmet off held at side, head visible, staring at turf — no lava cracks on skin',
  'narking-SF-13-w2': 'hands on knees bent over, dejected loser',
  'mauricio-LAC-10-w2': 'staring down at turf helmet in hand, dejected loser',
  'kayser-LAR-9-w2': 'victory flex both arms high winner, smooth stone skin no beard',
  'danny-JAX-16-w2': 'clipboard-free empty hands, upright pre-snap winner stance',
  'steven-NO-12-w2': 'hyped winner fist pump, smooth stone no goatee',
  'matt-BUF-17-w2': 'turning away shoulders slumped, dejected loser',
  'jamil-PHI-1-w2': 'sitting on bench head down, dejected loser',
  'frankie-CIN-9-w2': 'anthropomorphic stone buffalo only, no human face, dejected kneeling loser',
  'narking-SF-13-w3': 'arms crossed bitter stare, dejected loser',
  'danny-JAX-16-w3': 'slow walk head down, dejected loser',
  'steven-SEA-14-w3': 'winner pose no signs or text in scene, no goatee',
  'mauricio-CAR-9-w3': 'winner celebration no Seahawks logo on jersey, Panthers only',
  'matt-BUF-17-w3': 'dejected loser no wrong-team logos, Bills only',
  'manny-KC-15-w3': 'sitting on bench elbows on knees, dejected loser',
  'danny-JAX-16-w5': 'confident pre-game forward lean, football tucked, smooth stone no fur',
  'hady-NE-10-w5': 'confident pre-game stare-down, calm neutral eyes, no pink tint or green collar',
  'frankie-DET-16-w5': 'confident pre-game two-hand ball grip, upright posture, no Lions wordmark text',
}

const BACKGROUNDS = {
  'crooke-BAL-8-w1': 'cool blue stadium tunnel lighting',
  'hady-NE-10-w1': 'overcast sideline dusk',
  'danny-DEN-10-w1': 'warm orange sunset end zone',
  'frankie-CIN-9-w1': 'rainy night stadium',
  'eric-DAL-4-w1': 'grey foggy away locker glow',
  'narking-NO-6-w1': 'neutral grey practice field, soft light',
  'mauricio-LAC-10-w2': 'purple twilight sky',
  'jamil-PHI-1-w2': 'green turf under lights',
  'matt-BUF-17-w2': 'snow flurry blue hour',
  'narking-SF-13-w2': 'red tunnel lights',
  'narking-SF-13-w3': 'misty morning field',
  'danny-JAX-16-w3': 'teal aurora dusk',
  'manny-KC-15-w3': 'red end zone glow',
  'danny-JAX-16-w5': 'teal pregame smoke haze',
  'hady-NE-10-w5': 'navy minimalist stadium bokeh',
  'frankie-DET-16-w5': 'silver dome interior lights',
}

export const ROUND10_PANEL_IDS = new Set([
  'mauricio-NYG-9-w1',
  'kayser-BAL-22-w1',
  'matt-BUF-17-w1',
  'jamil-KC-9-w1',
  'steven-CHI-4-w1',
  'manny-CHI-18-w1',
  'crooke-BAL-8-w1',
  'hady-NE-10-w1',
  'danny-DEN-10-w1',
  'frankie-CIN-9-w1',
  'eric-DAL-4-w1',
  'narking-NO-6-w1',
  'narking-SF-13-w2',
  'mauricio-LAC-10-w2',
  'kayser-LAR-9-w2',
  'danny-JAX-16-w2',
  'steven-NO-12-w2',
  'matt-BUF-17-w2',
  'jamil-PHI-1-w2',
  'frankie-CIN-9-w2',
  'narking-SF-13-w3',
  'danny-JAX-16-w3',
  'steven-SEA-14-w3',
  'mauricio-CAR-9-w3',
  'matt-BUF-17-w3',
  'manny-KC-15-w3',
  'danny-JAX-16-w5',
  'hady-NE-10-w5',
  'frankie-DET-16-w5',
])

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
  const bg = BACKGROUNDS[job.panelId] ?? 'distinct stadium lighting from other panels in batch'
  const colors = TEAM_COLORS[team] ?? `${team} NFL jersey correct team colors`
  const numberRule = `ONE bold ${num} printed in jersey fabric once, large on chest, never hidden by arms or hands`
  const stone =
    'Reference B: light smooth stone-gray buffalo skin (PR #96). NO fur, NO mane, NO beard, NO goatee, NO red eyes, NO lava cracks. Full buffalo head and horns visible. NO human faces.'
  const refA =
    'Reference A: manager face/horns likeness and jersey layout. Reference B: fur lightness only.'
  return `${refA} ${stone}. ${colors}. Correct official team logo only once on jersey. ${numberRule}. POSE: ${pose}. BACKGROUND: ${bg}. ${mood(job)}. NO text, wordmarks, signs, badges, clipboards, lanyards, or lettering anywhere. Vertical 3:4 portrait, photoreal illustration, no card frame, full-bleed character.`
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

const round10 = items
  .filter((i) => ROUND10_PANEL_IDS.has(i.panelId))
  .map((i) => ({
    outFile: i.outFile.replace(/^\.\.\//, '').replace(/^assets\//, 'assets/'),
    pose_ref: i.w5_style_ref,
    prompt: i.prompt,
    panelId: i.panelId,
  }))
const pr96 = round10.map((i) => ({
  outFile: i.outFile.startsWith('assets/') || i.outFile.includes('w5-matchup')
    ? i.outFile.replace('../w5-matchup-cards/', '../w5-matchup-cards/')
    : i.outFile,
  pose_ref: i.pose_ref,
  prompt: i.prompt,
}))
for (const job of FIXES.panels) {
  if (!ROUND10_PANEL_IDS.has(job.panelId)) continue
  const entry = pr96.find((p) => p.outFile.endsWith(path.basename(job.outFile)))
  if (entry) entry.outFile = job.outFile.startsWith('..') ? job.outFile.slice(3) : job.outFile
}
await writeFile(
  path.join(__dirname, 'panel-prompts-round10.json'),
  JSON.stringify(
    round10.map((r) => {
      const job = FIXES.panels.find((j) => j.panelId === r.panelId)
      return {
        outFile: job.outFile.replace(/^\.\.\//, ''),
        pose_ref: r.pose_ref,
        prompt: r.prompt,
      }
    }),
    null,
    2,
  ) + '\n',
)
console.log(`Wrote ${round10.length} round10 prompts`)
