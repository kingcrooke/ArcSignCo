import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { COLORS, MARGIN, wrapHtml, fileUrl } from '../../remake-held/shared-css.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const cssPreview = `
.slide { background: #000; }
.hdr { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 48px; }
.hero { margin-top: 22px; font-size: 72px; line-height: 1.18; color: ${COLORS.white}; font-family: 'Anton', sans-serif; text-transform: uppercase; }
.hero .vs { font-size: 72px; }
.records { margin-top: 18px; font-size: 26px; color: ${COLORS.gold}; display: flex; gap: 30px; align-items: center; font-family: 'Bebas Neue', sans-serif; }
.card { position: absolute; top: 276px; width: 400px; height: 720px; border-radius: 18px; overflow: hidden; background: #111; z-index: 1; }
.card.left { left: ${MARGIN}px; }
.card.right { left: 608px; }
.card-art { position: absolute; inset: 0; overflow: hidden; }
.card-art img { width: 100%; height: 100%; object-fit: cover; object-position: center 8%; display: block; }
.badge { position: absolute; top: 18px; padding: 10px 18px; border-radius: 999px; background: ${COLORS.gold}; color: #111;
  font-size: 22px; line-height: 1; z-index: 3; font-family: 'Bebas Neue', sans-serif; }
.badge.left { left: 16px; }
.badge.right { right: 16px; }
.vs-badge {
  position: absolute; left: 494px; top: 600px; width: 92px; height: 92px; border-radius: 50%;
  background: ${COLORS.gold}; color: #111; z-index: 4;
  display: flex; align-items: center; justify-content: center; font-size: 36px; font-family: 'Bebas Neue', sans-serif;
}
.sneaky { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 1048px; text-align: center; font-size: 34px; color: ${COLORS.gold}; font-family: 'Bebas Neue', sans-serif; }
.poll { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 1108px; }
.poll-labels { display: flex; justify-content: space-between; font-size: 32px; margin-bottom: 10px; font-family: 'Bebas Neue', sans-serif; }
.poll-labels .l { color: ${COLORS.gold}; }
.poll-labels .r { color: ${COLORS.white}; }
.poll-bar { display: flex; height: 34px; overflow: hidden; }
.poll-bar .a { background: ${COLORS.gold}; }
.poll-bar .b { background: ${COLORS.pollDark}; }
.detail { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 1228px; text-align: center; font-size: 24px; color: ${COLORS.muted}; font-family: 'Inter', sans-serif; font-weight: 600; }
`

export function previewHtml(copy, leftImg, rightImg) {
  const w = copy.week
  const m = copy.matchupNum
  const barA = copy.barLeftPct
  const barB = 100 - barA
  const leftSrc = fileUrl(leftImg)
  const rightSrc = fileUrl(rightImg)
  const parts = copy.headline.split(/\s+vs\s+/i)
  const leftName = parts[0] ?? copy.headline
  const rightName = parts[1] ?? ''

  return wrapHtml(
    `<div class="slide">
  <div class="hdr">
    <div class="kicker bebas">GWB &nbsp;•&nbsp; WEEK ${w}</div>
    <div class="kicker-line"></div>
    <h1 class="hero anton"><span>${leftName}</span><span class="vs">vs</span><span>${rightName}</span></h1>
    <div class="records bebas">${copy.recordLine}</div>
  </div>
  <div class="card left">
    <div class="card-art"><img src="${leftSrc}" alt="" /></div>
    <span class="badge left bebas">${copy.leftPill}</span>
  </div>
  <div class="vs-badge bebas">VS</div>
  <div class="card right">
    <div class="card-art"><img src="${rightSrc}" alt="" /></div>
    <span class="badge right bebas">${copy.rightPill}</span>
  </div>
  <div class="sneaky bebas">${copy.bowlTitle}</div>
  <div class="poll">
    <div class="poll-labels bebas"><span class="l">${copy.leftPctLabel}</span><span class="r">${copy.rightPctLabel}</span></div>
    <div class="poll-bar"><div class="a" style="width:${barA}%"></div><div class="b" style="width:${barB}%"></div></div>
  </div>
  <p class="detail inter-semibold">${copy.tagline}</p>
  <div class="footer inter"><span>gwb_fantasy_football</span><span>${copy.footerRight}</span></div>
</div>`,
    cssPreview,
  )
}

const cssResult = `
.slide { background: #080c10; }
.hdr { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 48px; text-align: center; }
.final { font-size: 62px; line-height: 1.18; margin-top: 22px; font-family: 'Anton', sans-serif; color: ${COLORS.white}; }
.scoreline { margin-top: 14px; font-size: 36px; color: ${COLORS.gold}; letter-spacing: 0.04em; font-family: 'Bebas Neue', sans-serif; }
.cards { position: absolute; left: 0; right: 0; top: 268px; height: 700px; }
.winner {
  position: absolute; left: 56px; top: 0; width: 440px; height: 680px; border-radius: 16px;
  border: 3px solid rgba(232,185,35,0.5); z-index: 1; background: #111; overflow: hidden;
}
.loser {
  position: absolute; left: 584px; top: 40px; width: 440px; height: 620px; border-radius: 16px;
  border: 2px solid #3a4454; z-index: 1; background: #111; overflow: hidden;
}
.card-art { position: absolute; left: 0; right: 0; top: 0; bottom: 64px; overflow: hidden; }
.card-art img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
.medal {
  position: absolute; left: 502px; top: 300px; width: 76px; height: 76px; border-radius: 50%;
  background: ${COLORS.gold}; color: #111; font-size: 44px; z-index: 4;
  display: flex; align-items: center; justify-content: center; font-family: 'Bebas Neue', sans-serif;
}
.tag { position: absolute; padding: 8px 18px; border-radius: 999px; font-family: 'Bebas Neue', sans-serif; font-size: 24px; z-index: 4; }
.tag.wt { top: 16px; left: 16px; background: ${COLORS.gold}; color: #111; }
.tag.lt { top: 16px; left: 16px; background: #2a3340; color: ${COLORS.white}; }
.tag.wb { bottom: 16px; right: 16px; background: ${COLORS.gold}; color: #111; }
.tag.lb { bottom: 16px; right: 16px; background: #3a4454; color: ${COLORS.white}; }
.mid { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 998px; text-align: center; }
.mid h2 { font-size: 38px; color: ${COLORS.gold}; font-family: 'Bebas Neue', sans-serif; }
.scores { display: flex; justify-content: space-between; margin-top: 14px; font-size: 28px; font-family: 'Bebas Neue', sans-serif; color: ${COLORS.white}; }
.scores .g { color: ${COLORS.gold}; }
.bar { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 1092px; height: 30px; display: flex; overflow: hidden; border-radius: 2px; }
.bar .w { background: ${COLORS.gold}; }
.bar .l { background: #2d343c; }
.caption { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 1138px; text-align: center; font-size: 24px; color: ${COLORS.muted}; font-family: 'Inter', sans-serif; font-weight: 600; }
`

function parseScores(scoreline) {
  const m = scoreline.match(/([\d.]+)\s*—\s*([\d.]+)/)
  if (!m) return { w: 50, l: 50, wScore: '', lScore: '' }
  const wScore = scoreline.split('—')[0].trim().split(/\s+/).pop()
  const lScore = m[2]
  const a = parseFloat(wScore)
  const b = parseFloat(lScore)
  const total = a + b
  const barWin = Math.round((a / total) * 100)
  return { barWin, barLose: 100 - barWin, wScore, lScore }
}

export function resultHtml(copy, winnerImg, loserImg) {
  const { barWin, barLose, wScore, lScore } = parseScores(copy.scoreline)
  const wImg = fileUrl(winnerImg)
  const lImg = fileUrl(loserImg)
  const scoreParts = copy.scoreline.split('—')
  const wLabel = scoreParts[0]?.trim() ?? ''
  const lLabel = scoreParts[1]?.trim() ?? ''

  return wrapHtml(
    `<div class="slide">
  <div class="hdr">
    <div class="kicker bebas">GWB &nbsp;•&nbsp; WEEK ${copy.week}</div>
    <div class="kicker-line"></div>
    <h1 class="final anton">${copy.finalLine}</h1>
    <p class="scoreline bebas">${copy.scoreline}</p>
  </div>
  <div class="cards">
    <div class="winner">
      <div class="card-art"><img src="${wImg}" alt="" /></div>
      <span class="tag wt">${copy.winnerPill}</span>
      <span class="tag wb">WINNER</span>
    </div>
    <div class="medal bebas">W</div>
    <div class="loser">
      <div class="card-art"><img src="${lImg}" alt="" /></div>
      <span class="tag lt">${copy.loserPill}</span>
      <span class="tag lb">LOSER</span>
    </div>
  </div>
  <div class="mid">
    <h2 class="bebas">${copy.midTitle}</h2>
    <div class="scores bebas"><span class="g">${wLabel}</span><span>${lLabel}</span></div>
  </div>
  <div class="bar"><div class="w" style="width:${barWin}%"></div><div class="l" style="width:${barLose}%"></div></div>
  <p class="caption inter-semibold">${copy.caption}</p>
  <div class="footer inter"><span>gwb_fantasy_football</span><span>RESULTS &nbsp;•&nbsp; ${copy.matchup}</span></div>
</div>`,
    cssResult,
  )
}
