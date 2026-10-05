/* global window, document, requestAnimationFrame */

const TIMING = {
  intro: [0, 5],
  faceoff: [5, 12],
  scorebar: [12, 30],
  performers: [30, 38],
  swings: [38, 46],
  final: [46, 54],
}

function applyJersey(panelEl, numEl, jersey) {
  panelEl.style.backgroundColor = jersey.bodyColor
  numEl.textContent = jersey.number
  numEl.style.color = jersey.numberColor
}

function applyPortrait(el, url) {
  if (!el || !url) return
  el.style.backgroundImage = `url('${url}')`
}

function applyArtToCard(prefix, config, side) {
  const jersey = config.matchup[side].jersey
  const portraitUrl = config.art.portraits[side === 'winner' ? 'winner' : 'loser']
  applyPortrait(document.getElementById(`${prefix}portrait-${side === 'winner' ? 'w' : 'l'}`), portraitUrl)
  applyJersey(
    document.getElementById(`${prefix}jersey-panel-${side === 'winner' ? 'w' : 'l'}`),
    document.getElementById(`${prefix}jersey-num-${side === 'winner' ? 'w' : 'l'}`),
    jersey,
  )
}

function activateScene(id) {
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

function updateScorebar(config, tickIndex, ids) {
  const tick = config.scoreTicks[tickIndex]
  if (!tick) return
  const w = config.matchup.winner
  const l = config.matchup.loser
  document.getElementById(ids.label).textContent = tick.label
  document.getElementById(ids.note).textContent = tick.note
  document.getElementById(ids.w).textContent = `${w.nickname} ${tick.winnerDisplay}`
  document.getElementById(ids.l).textContent = `${tick.loserDisplay} ${l.nickname}`
  const total = tick.winnerPoints + tick.loserPoints
  const pct = total > 0 ? (tick.winnerPoints / total) * 100 : 50
  document.getElementById(ids.fill).style.width = `${pct}%`
}

function applyConfig(config) {
  window.__RECAP_CONFIG__ = config
  document.getElementById('intro-week').textContent = `WEEK ${config.meta.week}`
  const names = [config.matchup.winner.nickname, config.matchup.loser.nickname].sort()
  document.getElementById('intro-matchup').textContent = `${names[0]} vs ${names[1]}`

  document.getElementById('faceoff-w-record').textContent =
    `${config.matchup.winner.nickname} ${config.matchup.winner.recordBefore}`
  document.getElementById('faceoff-l-record').textContent =
    `${config.matchup.loser.nickname} ${config.matchup.loser.recordBefore}`

  applyArtToCard('', config, 'winner')
  applyArtToCard('', config, 'loser')
  applyArtToCard('final-', config, 'winner')
  applyArtToCard('final-', config, 'loser')

  document.getElementById('final-eyebrow').textContent = `GWB • WEEK ${config.meta.week}`
  document.getElementById('final-headline').textContent = config.copy.headline
  document.getElementById('final-scoreline').textContent = config.copy.scoreline
  document.getElementById('final-tagline').textContent = config.matchup.tagline
  document.getElementById('final-caption').textContent = config.copy.caption
  document.getElementById('final-results').textContent = `RESULTS • ${config.meta.matchupKey}`
  document.getElementById('final-w-record').textContent =
    `${config.matchup.winner.nickname} ${config.matchup.winner.recordAfter}`
  document.getElementById('final-l-record').textContent =
    `${config.matchup.loser.nickname} ${config.matchup.loser.recordAfter}`

  renderPerformers(config)
  renderSwings(config)
  updateScorebar(config, 0, {
    label: 'tick-label',
    note: 'tick-note',
    w: 'score-w',
    l: 'score-l',
    fill: 'score-fill',
  })
}

function sceneAtTime(t) {
  for (const [id, [a, b]] of Object.entries(TIMING)) {
    if (t >= a && t < b) return id
  }
  return 'final'
}

function onFrame(t, config) {
  const scene = sceneAtTime(t)
  activateScene(scene)

  const faceoffCards = document.querySelectorAll('#scene-faceoff .char-card')
  const finalCards = document.querySelectorAll('#scene-final .char-card')
  const faceoffMedal = document.getElementById('faceoff-medallion')
  const finalMedal = document.getElementById('final-medallion')

  if (scene === 'faceoff') {
    const show = t > 6
    faceoffCards.forEach((c) => c.classList.toggle('show', show))
    faceoffMedal.classList.toggle('show', t > 8)
    finalMedal.classList.remove('show')
  } else if (scene === 'final') {
    finalCards.forEach((c) => c.classList.add('show'))
    finalMedal.classList.add('show')
    faceoffMedal.classList.remove('show')
  } else {
    faceoffMedal.classList.remove('show')
  }

  if (scene === 'scorebar') {
    const local = t - TIMING.scorebar[0]
    const span = TIMING.scorebar[1] - TIMING.scorebar[0]
    const idx = Math.min(config.scoreTicks.length - 1, Math.floor((local / span) * config.scoreTicks.length))
    updateScorebar(config, idx, {
      label: 'tick-label',
      note: 'tick-note',
      w: 'score-w',
      l: 'score-l',
      fill: 'score-fill',
    })
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
    const w = config.matchup.winner
    const l = config.matchup.loser
    const last = config.scoreTicks[config.scoreTicks.length - 1]
    document.getElementById('final-score-w').textContent = `${w.nickname} ${w.pointsDisplay}`
    document.getElementById('final-score-l').textContent = `${l.pointsDisplay} ${l.nickname}`
    const total = last.winnerPoints + last.loserPoints
    document.getElementById('final-score-fill').style.width = `${(last.winnerPoints / total) * 100}%`
  }
}

function startRecapPlayback(config) {
  applyConfig(config)
  const duration = config.timing?.durationSec ?? 54
  const start = performance.now()

  return new Promise((resolve) => {
    function frame() {
      const elapsed = (performance.now() - start) / 1000
      const tick = Math.min(elapsed, duration)
      onFrame(tick, config)
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
