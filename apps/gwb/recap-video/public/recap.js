/* global window, document, requestAnimationFrame */

const TIMING = {
  intro: [0, 5],
  faceoff: [5, 12],
  scorebar: [12, 30],
  performers: [30, 38],
  swings: [38, 46],
  final: [46, 54],
}

function teamColorClass(team) {
  const t = (team || '').toUpperCase()
  return `team-colors-${t.length === 2 || t.length === 3 ? t : 'default'}`
}

function setJersey(el, jersey) {
  el.textContent = `#${jersey.number || '—'}`
  el.className = `jersey-badge ${teamColorClass(jersey.team)}`
  el.title = jersey.player
}

function activateScene(id, t) {
  document.querySelectorAll('.scene').forEach((s) => {
    s.classList.toggle('active', s.id === `scene-${id}`)
  })
}

function renderPerformers(config) {
  const wCol = document.querySelector('#performers-winner')
  const lCol = document.querySelector('#performers-loser')
  wCol.innerHTML = `<h3>${config.matchup.winner.nickname} TOP 3</h3>`
  lCol.innerHTML = `<h3>${config.matchup.loser.nickname} TOP 3</h3>`
  config.matchup.winner.topPerformers.forEach((p) => {
    const row = document.createElement('div')
    row.className = 'performer-row'
    row.innerHTML = `<span>${p.name}</span><span class="pts">${p.points.toFixed(1)}</span>`
    wCol.appendChild(row)
  })
  config.matchup.loser.topPerformers.forEach((p) => {
    const row = document.createElement('div')
    row.className = 'performer-row'
    row.innerHTML = `<span>${p.name}</span><span class="pts">${p.points.toFixed(1)}</span>`
    lCol.appendChild(row)
  })
}

function renderSwings(config) {
  const list = document.querySelector('#swing-lines')
  list.innerHTML = ''
  config.copy.swingLines.forEach((line) => {
    const el = document.createElement('div')
    el.className = 'swing-line'
    el.textContent = line
    list.appendChild(el)
  })
}

function updateScorebar(config, tickIndex) {
  const tick = config.scoreTicks[tickIndex]
  if (!tick) return
  document.getElementById('tick-label').textContent = tick.label
  document.getElementById('tick-note').textContent = tick.note
  const w = config.matchup.winner
  const l = config.matchup.loser
  document.getElementById('score-w').textContent = `${w.nickname} ${tick.winnerPoints.toFixed(1)}`
  document.getElementById('score-l').textContent = `${tick.loserPoints.toFixed(1)} ${l.nickname}`
  const total = tick.winnerPoints + tick.loserPoints
  const pct = total > 0 ? (tick.winnerPoints / total) * 100 : 50
  document.getElementById('score-fill').style.width = `${pct}%`
}

function applyConfig(config) {
  window.__RECAP_CONFIG__ = config
  document.getElementById('intro-week').textContent = `WEEK ${config.meta.week}`
  const names = [config.matchup.winner.nickname, config.matchup.loser.nickname].sort()
  document.getElementById('intro-matchup').textContent = `${names[0]} vs ${names[1]}`
  document.getElementById('faceoff-w-record').textContent = `${config.matchup.winner.nickname} ${config.matchup.winner.recordBefore}`
  document.getElementById('faceoff-l-record').textContent = `${config.matchup.loser.nickname} ${config.matchup.loser.recordBefore}`
  setJersey(document.getElementById('jersey-w'), config.matchup.winner.jersey)
  setJersey(document.getElementById('jersey-l'), config.matchup.loser.jersey)
  setJersey(document.getElementById('final-jersey-w'), config.matchup.winner.jersey)
  setJersey(document.getElementById('final-jersey-l'), config.matchup.loser.jersey)

  document.getElementById('final-eyebrow').textContent = `GWB • WEEK ${config.meta.week}`
  document.getElementById('final-headline').textContent = config.copy.headline
  document.getElementById('final-header-score').textContent = config.copy.headerScore
  document.getElementById('final-tagline').textContent = config.matchup.tagline
  document.getElementById('final-subtitle').textContent = config.copy.subtitleFinal
  document.getElementById('final-results').textContent = `RESULTS • ${config.meta.matchupKey}`
  document.getElementById('final-w-record').textContent = `${config.matchup.winner.nickname} ${config.matchup.winner.recordBefore}`
  document.getElementById('final-l-record').textContent = `${config.matchup.loser.nickname} ${config.matchup.loser.recordBefore}`

  renderPerformers(config)
  renderSwings(config)
  updateScorebar(config, 0)
}

function sceneAtTime(t) {
  for (const [id, [a, b]] of Object.entries(TIMING)) {
    if (t >= a && t < b) return id
  }
  return 'final'
}

function onFrame(t, config) {
  const scene = sceneAtTime(t)
  activateScene(scene, t)

  if (scene === 'faceoff' || scene === 'final') {
    const show = t > (scene === 'faceoff' ? 6 : 47)
    document.querySelectorAll('.char-card').forEach((c) => c.classList.toggle('show', show))
    document.getElementById('w-medallion').classList.toggle('show', t > (scene === 'faceoff' ? 8 : 48))
  }

  if (scene === 'scorebar') {
    const local = t - TIMING.scorebar[0]
    const span = TIMING.scorebar[1] - TIMING.scorebar[0]
    const idx = Math.min(config.scoreTicks.length - 1, Math.floor((local / span) * config.scoreTicks.length))
    updateScorebar(config, idx)
  }

  if (scene === 'performers') {
    const rows = document.querySelectorAll('.performer-row')
    const local = t - TIMING.performers[0]
    rows.forEach((row, i) => {
      row.classList.toggle('show', local > i * 0.7 + 0.3)
    })
  }

  if (scene === 'swings') {
    const lines = document.querySelectorAll('.swing-line')
    const local = t - TIMING.swings[0]
    lines.forEach((line, i) => {
      line.classList.toggle('show', local > i * 1.8 + 0.4)
    })
  }

  if (scene === 'final') {
    updateScorebar(config, config.scoreTicks.length - 1)
    const w = config.matchup.winner
    const l = config.matchup.loser
    document.getElementById('final-score-w').textContent = `${w.nickname} ${w.points.toFixed(1)}`
    document.getElementById('final-score-l').textContent = `${l.points.toFixed(1)} ${l.nickname}`
    const total = w.points + l.points
    document.getElementById('final-score-fill').style.width = `${(w.points / total) * 100}%`
  }
}

function startRecapPlayback(config) {
  applyConfig(config)
  const duration = config.timing?.durationSec ?? 54
  const start = performance.now()

  return new Promise((resolve) => {
    function frame() {
      const elapsed = (performance.now() - start) / 1000
      const t = Math.min(elapsed, duration)
      onFrame(t, config)
      if (elapsed < duration + 0.05) requestAnimationFrame(frame)
      else resolve()
    }
    requestAnimationFrame(frame)
  })
}

window.startRecapPlayback = startRecapPlayback
if (window.__RECAP_BOOT__) {
  startRecapPlayback(window.__RECAP_BOOT__)
}
