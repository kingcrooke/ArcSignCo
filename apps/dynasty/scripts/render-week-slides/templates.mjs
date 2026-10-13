import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { COLORS, MARGIN, fileUrl, wrapHtml } from './shared-css.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const AVATARS = path.join(__dirname, '../../public/avatars')

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function avatarUrl(rosterId) {
  const id = String(rosterId).padStart(2, '0')
  return fileUrl(path.join(AVATARS, `roster-${id}.png`))
}

function recordLabel(standings, rosterId) {
  const row = standings[String(rosterId)]
  if (!row) return '—'
  const [w, l, t] = row
  return t ? `${w}-${l}-${t}` : `${w}-${l}`
}

function heroFontSize(left, right) {
  const total = left.trim().length + right.trim().length
  if (total > 44) return 44
  if (total > 34) return 52
  if (total > 26) return 58
  return 64
}

function heroPair(left, right, sizePx) {
  return `<span>${esc(left.trim())}</span><span class="vs">vs</span><span>${esc(right.trim())}</span>`
}

const cssMatch = `
.hdr { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 56px; text-align: center; }
.hero { margin-top: 28px; display: flex; flex-wrap: wrap; align-items: baseline; justify-content: center; gap: 14px 18px;
  line-height: 1.26; color: ${COLORS.white}; max-width: 968px; margin-left: auto; margin-right: auto; text-align: center; }
.hero .vs { color: ${COLORS.muted}; font-size: 0.88em; }
.records { margin-top: 24px; font-size: 28px; color: ${COLORS.accentBright}; display: flex; flex-direction: column;
  justify-content: center; gap: 10px; align-items: center; line-height: 1.38; max-width: 968px; margin-left: auto; margin-right: auto; }
.card { position: absolute; top: 400px; width: 420px; height: 680px; border-radius: 20px; overflow: hidden;
  background: ${COLORS.panel}; border: 2px solid rgba(168, 85, 247, 0.35); }
.card.left { left: ${MARGIN}px; }
.card.right { right: ${MARGIN}px; }
.card img { width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; }
.badge { position: absolute; top: 18px; padding: 10px 18px; border-radius: 999px; background: ${COLORS.accent}; color: #0a0f14;
  font-size: 22px; line-height: 1.2; z-index: 3; max-width: 90%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.badge.left { left: 16px; }
.badge.right { right: 16px; }
.vs-badge {
  position: absolute; left: 50%; top: 700px; transform: translateX(-50%); width: 96px; height: 96px; border-radius: 50%;
  background: ${COLORS.accent}; color: #0a0f14; z-index: 4;
  display: flex; align-items: center; justify-content: center; font-size: 38px;
  border: 3px solid ${COLORS.bg};
}
.preview { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 1100px; text-align: center;
  font-size: 32px; color: ${COLORS.accent}; line-height: 1.35; }
`

export function matchSlide(cfg, standings) {
  const leftImg = avatarUrl(cfg.homeRoster)
  const rightImg = avatarUrl(cfg.awayRoster)
  const leftRec = recordLabel(standings, cfg.homeRoster)
  const rightRec = recordLabel(standings, cfg.awayRoster)
  const heroSize = heroFontSize(cfg.homeName, cfg.awayName)
  return wrapHtml(
    `<div class="slide">
  <div class="hdr">
    <div class="kicker bebas">DYNASTY &nbsp;•&nbsp; WEEK ${cfg.week}</div>
    <div class="kicker-line"></div>
    <h1 class="hero anton" style="font-size:${heroSize}px">${heroPair(cfg.homeName, cfg.awayName, heroSize)}</h1>
    <div class="records bebas">
      <div>${esc(cfg.homeName.trim())} (${leftRec})</div>
      <div>vs ${esc(cfg.awayName.trim())} (${rightRec})</div>
    </div>
  </div>
  <div class="card left"><img src="${leftImg}" alt="" /><span class="badge left bebas">${esc(cfg.homeName.trim())} ${leftRec}</span></div>
  <div class="vs-badge bebas">VS</div>
  <div class="card right"><img src="${rightImg}" alt="" /><span class="badge right bebas">${esc(cfg.awayName.trim())} ${rightRec}</span></div>
  <div class="preview bebas">WEEK ${cfg.week} PREVIEW</div>
  <div class="footer inter"><span>Dynasty of Champions</span><span>VS &nbsp;•&nbsp; M${cfg.match}</span></div>
</div>`,
    cssMatch,
  )
}

const cssResult = `
.hdr { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 56px; text-align: center; }
.final { font-size: 56px; line-height: 1.22; margin-top: 28px; color: ${COLORS.white}; }
.scoreline { margin-top: 18px; font-size: 34px; color: ${COLORS.accentBright}; letter-spacing: 0.03em; line-height: 1.35; }
.cards { position: absolute; left: 0; right: 0; top: 300px; height: 720px; }
.winner {
  position: absolute; left: ${MARGIN}px; top: 0; width: 440px; height: 680px; border-radius: 18px;
  border: 3px solid rgba(168, 85, 247, 0.65); z-index: 1; background: ${COLORS.panel};
}
.loser {
  position: absolute; right: ${MARGIN}px; top: 48px; width: 440px; height: 620px; border-radius: 18px;
  border: 2px solid #3a4454; z-index: 1; background: ${COLORS.panel};
}
.card-art { position: absolute; left: 0; right: 0; top: 0; bottom: 72px; overflow: hidden; }
.card-art img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
.medal {
  position: absolute; left: 50%; top: 320px; transform: translateX(-50%); width: 80px; height: 80px; border-radius: 50%;
  background: ${COLORS.accent}; color: #0a0f14; font-size: 42px; z-index: 2;
  display: flex; align-items: center; justify-content: center;
}
.tag { position: absolute; padding: 8px 18px; border-radius: 999px; font-family: 'Bebas Neue'; font-size: 22px; z-index: 4; line-height: 1.2; }
.tag.wt { top: 16px; left: 16px; background: ${COLORS.accent}; color: #0a0f14; }
.tag.lt { top: 16px; left: 16px; background: #2a3340; color: ${COLORS.white}; }
.tag.wb { bottom: 16px; right: 16px; background: ${COLORS.accent}; color: #0a0f14; }
.tag.lb { bottom: 16px; right: 16px; background: #3a4454; color: ${COLORS.white}; }
.mid { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 1020px; text-align: center; }
.mid h2 { font-size: 36px; color: ${COLORS.accent}; line-height: 1.3; }
.scores { display: flex; justify-content: space-between; margin-top: 16px; font-size: 28px; line-height: 1.35; gap: 12px; }
.scores .g { color: ${COLORS.accentBright}; }
.bar { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 1120px; height: 28px; display: flex; overflow: hidden; border-radius: 4px; }
.bar .w { background: ${COLORS.accent}; }
.bar .l { background: #2d343c; }
`

export function resultSlide(cfg, standings) {
  const homeWon = cfg.winnerRoster === cfg.homeRoster
  const winnerRoster = homeWon ? cfg.homeRoster : cfg.awayRoster
  const loserRoster = homeWon ? cfg.awayRoster : cfg.homeRoster
  const winnerName = homeWon ? cfg.homeName : cfg.awayName
  const loserName = homeWon ? cfg.awayName : cfg.homeName
  const wScore = (homeWon ? cfg.homePts : cfg.awayPts).toFixed(2)
  const lScore = (homeWon ? cfg.awayPts : cfg.homePts).toFixed(2)
  const total = cfg.homePts + cfg.awayPts
  const barWin = Math.round((Number(wScore) / total) * 100)
  const barLose = 100 - barWin
  const wImg = avatarUrl(winnerRoster)
  const lImg = avatarUrl(loserRoster)
  const wRec = recordLabel(standings, winnerRoster)
  const lRec = recordLabel(standings, loserRoster)
  const finalShort = winnerName.trim().length > 22
    ? `FINAL: ${winnerName.trim().split(/\s+/)[0].toUpperCase()} WINS`
    : `FINAL: ${winnerName.trim().toUpperCase()} WINS`

  return wrapHtml(
    `<div class="slide">
  <div class="hdr">
    <div class="kicker bebas">DYNASTY &nbsp;•&nbsp; WEEK ${cfg.week}</div>
    <div class="kicker-line"></div>
    <h1 class="final anton">${esc(finalShort)}</h1>
    <p class="scoreline bebas">${esc(winnerName.trim())} ${wScore} - ${lScore} ${esc(loserName.trim())}</p>
  </div>
  <div class="cards">
    <div class="winner">
      <div class="card-art"><img src="${wImg}" alt="" /></div>
      <span class="tag wt">${esc(winnerName.trim())} ${wRec}</span>
      <span class="tag wb">WINNER</span>
    </div>
    <div class="medal bebas">W</div>
    <div class="loser">
      <div class="card-art"><img src="${lImg}" alt="" /></div>
      <span class="tag lt">${esc(loserName.trim())} ${lRec}</span>
      <span class="tag lb">LOSS</span>
    </div>
  </div>
  <div class="mid">
    <h2 class="bebas">WEEK ${cfg.week} &nbsp;•&nbsp; MATCH ${cfg.match}</h2>
    <div class="scores bebas"><span class="g">${esc(winnerName.trim())} ${wScore}</span><span>${lScore} ${esc(loserName.trim())}</span></div>
  </div>
  <div class="bar"><div class="w" style="width:${barWin}%"></div><div class="l" style="width:${barLose}%"></div></div>
  <div class="footer inter"><span>Dynasty of Champions</span><span>RESULTS &nbsp;•&nbsp; M${cfg.match}</span></div>
</div>`,
    cssResult,
  )
}
