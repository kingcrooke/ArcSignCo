import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { COLORS, MARGIN, fileUrl, wrapHtml } from '../remake-held/shared-css.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const RESULT_ASSETS = path.join(__dirname, '../w5-result-cards/assets')

export function loadReport() {
  return JSON.parse(readFileSync(path.join(__dirname, 'report-data.json'), 'utf8'))
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
}

function pickHeroSide(slide) {
  return slide.heroSide === 'loser' ? 'loser' : 'winner'
}

function heroPair(heroId, side = 'winner') {
  if (!heroId) return null
  const pick = side === 'loser' ? 'loser' : 'winner'
  return {
    winner: fileUrl(path.join(RESULT_ASSETS, `${heroId}-winner.jpg`)),
    loser: fileUrl(path.join(RESULT_ASSETS, `${heroId}-loser.jpg`)),
    focus: fileUrl(path.join(RESULT_ASSETS, `${heroId}-${pick}.jpg`)),
  }
}

const cssBase = `
.slide { background: ${COLORS.bg}; }
.hdr { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 48px; z-index: 3; }
.title-split { margin-top: 20px; font-size: 62px; line-height: 1.1; }
.title-split .gold { color: ${COLORS.gold}; }
.body-block {
  position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; z-index: 3;
  font-size: 26px; line-height: 1.45; color: #c8d4e0; font-weight: 600;
}
.body-block p { margin-bottom: 10px; }
.footnote {
  position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; bottom: 72px; z-index: 3;
  text-align: center; font-size: 22px; color: ${COLORS.muted}; letter-spacing: 0.06em;
}
.bg-hero {
  position: absolute; inset: 0; z-index: 1;
}
.bg-hero img { width: 100%; height: 100%; object-fit: cover; object-position: center 18%; transform: scale(1.08); }
.bg-scrim { position: absolute; inset: 0; z-index: 2; background: linear-gradient(180deg, rgba(10,15,20,0.92) 0%, rgba(10,15,20,0.55) 42%, rgba(10,15,20,0.88) 100%); }
.dual-cards { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 320px; height: 520px; z-index: 3; display: flex; gap: 24px; justify-content: center; }
.dual-cards .card {
  width: 420px; height: 100%; border-radius: 16px; overflow: hidden; border: 3px solid ${COLORS.gold};
  box-shadow: 0 12px 40px rgba(0,0,0,0.45);
}
.dual-cards .card.dim { border-color: #4a5058; }
.dual-cards img { width: 100%; height: 100%; object-fit: cover; object-position: center 14%; transform: scale(1.05); }
.info-stack {
  position: absolute; left: 96px; right: 96px; top: 868px; z-index: 3;
  background: rgba(18, 24, 32, 0.96); border-left: 4px solid ${COLORS.gold}; padding: 22px 28px;
}
.info-stack p { font-size: 24px; color: #b8c4d0; line-height: 1.42; margin-top: 8px; font-weight: 600; }
.stat-grid {
  position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 280px; z-index: 3;
  display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
}
.stat-box {
  background: rgba(18, 24, 32, 0.96); padding: 22px 24px; border-top: 3px solid ${COLORS.gold};
}
.stat-box .label { font-size: 24px; color: ${COLORS.muted}; letter-spacing: 0.08em; }
.stat-box .value { margin-top: 10px; font-size: 30px; color: ${COLORS.white}; line-height: 1.2; }
.stat-box .sub { margin-top: 8px; font-size: 22px; color: ${COLORS.gold}; }
.list-panel {
  position: absolute; left: 88px; right: 88px; top: 248px; z-index: 3;
  background: rgba(18, 24, 32, 0.96); padding: 18px 22px; max-height: 880px; overflow: hidden;
}
.row { display: flex; gap: 16px; font-size: 26px; font-weight: 600; color: #b8c4d0; padding: 12px 6px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.row .n { color: ${COLORS.gold}; min-width: 44px; }
.row .name { color: ${COLORS.white}; flex: 1; }
.row .pts { color: ${COLORS.gold}; text-align: right; min-width: 100px; }
.cover-text { position: absolute; left: ${MARGIN}px; top: 48px; width: 620px; z-index: 3; padding-right: 20px; }
.cover-hero {
  position: absolute; right: 0; top: 0; width: 420px; height: 1350px; z-index: 2; overflow: hidden;
}
.cover-hero img { width: 100%; height: 100%; object-fit: cover; object-position: center 12%; transform: scale(1.1); }
.cover-hero .veil { position: absolute; inset: 0; background: linear-gradient(90deg, ${COLORS.bg} 0%, transparent 35%); }
`

function footer(pageNum) {
  return `<div class="footer inter"><span>gwb_fantasy_football</span><span class="bebas">${pageNum}/16</span></div>`
}

function titleBlock(slide) {
  const gold = slide.titleGold
    ? `<br/><span class="gold anton">${esc(slide.titleGold)}</span>`
    : ''
  return `<h1 class="title-split anton">${esc(slide.title)}${gold}</h1>`
}

function layoutCover(slide, pageNum) {
  const heroes = heroPair(slide.hero, pickHeroSide(slide))
  const body = (slide.body ?? [])
    .map((line) => (line ? `<p>${esc(line)}</p>` : '<p>&nbsp;</p>'))
    .join('')
  const heroImg = heroes?.focus ?? ''
  const heroSide = heroImg
    ? `<div class="cover-hero"><img src="${heroImg}" alt=""/><div class="veil"></div></div>`
    : ''
  const kicker = slide.kicker
    ? `<div class="kicker bebas">${esc(slide.kicker)}</div><div class="kicker-line"></div>`
    : `<div class="kicker bebas">GWB · WEEK 5 · FINAL REPORT</div><div class="kicker-line"></div>`

  const listBody =
    slide.body?.length > 4
      ? `<div class="body-block inter-semibold" style="top:340px;right:${MARGIN}px;width:620px">${body}</div>`
      : `<div class="body-block inter-semibold" style="top:280px;width:580px">${body}</div>`

  return wrapHtml(
    `<div class="slide">
  ${heroSide}
  <div class="cover-text">
    ${kicker}
    ${titleBlock(slide)}
  </div>
  ${listBody}
  ${slide.footnote ? `<div class="footnote bebas">${esc(slide.footnote)}</div>` : ''}
  ${footer(pageNum)}
</div>`,
    cssBase,
  )
}

function layoutMatchup(slide, pageNum) {
  const heroes = heroPair(slide.hero)
  const body = (slide.body ?? []).map((line) => `<p>${esc(line)}</p>`).join('')
  const cards = heroes
    ? `<div class="dual-cards">
    <div class="card"><img src="${heroes.winner}" alt=""/></div>
    <div class="card dim"><img src="${heroes.loser}" alt=""/></div>
  </div>`
    : ''
  return wrapHtml(
    `<div class="slide">
  <div class="hdr">
    <div class="kicker bebas">${esc(slide.kicker ?? 'GWB · WEEK 5')}</div>
    <div class="kicker-line"></div>
    ${titleBlock(slide)}
  </div>
  ${cards}
  <div class="info-stack inter-semibold">${body}</div>
  ${slide.footnote ? `<div class="footnote bebas">${esc(slide.footnote)}</div>` : ''}
  ${footer(pageNum)}
</div>`,
    cssBase,
  )
}

function layoutStat(slide, pageNum) {
  const heroes = heroPair(slide.hero, pickHeroSide(slide))
  const bg = heroes
    ? `<div class="bg-hero"><img src="${heroes.focus}" alt=""/></div><div class="bg-scrim"></div>`
    : ''
  const boxes = (slide.statBoxes ?? [])
    .map(
      (b) =>
        `<div class="stat-box inter-semibold"><div class="label bebas">${esc(b.label)}</div><div class="value bebas">${esc(b.value)}</div>${b.sub ? `<div class="sub">${esc(b.sub)}</div>` : ''}</div>`,
    )
    .join('')
  const body = (slide.body ?? [])
    .map((line) => (line ? `<p>${esc(line)}</p>` : ''))
    .join('')
  return wrapHtml(
    `<div class="slide">
  ${bg}
  <div class="hdr">
    <div class="kicker bebas">${esc(slide.kicker ?? 'GWB · WEEK 5')}</div>
    <div class="kicker-line"></div>
    ${titleBlock(slide)}
  </div>
  ${boxes ? `<div class="stat-grid">${boxes}</div>` : ''}
  <div class="body-block inter-semibold" style="top:${boxes ? 560 : 300}px">${body}</div>
  ${slide.footnote ? `<div class="footnote bebas">${esc(slide.footnote)}</div>` : ''}
  ${footer(pageNum)}
</div>`,
    cssBase,
  )
}

function layoutTable(slide, pageNum) {
  const rows = (slide.table ?? [])
    .map(
      (row) =>
        `<div class="row inter-semibold"><span class="n bebas">${row.rank}</span><span class="name">${esc(row.name)}</span><span class="pts bebas">${esc(row.pf ?? row.pts)}</span></div>`,
    )
    .join('')
  return wrapHtml(
    `<div class="slide">
  <div class="hdr">
    <div class="kicker bebas">GWB · WEEK 5 · FINAL REPORT</div>
    <div class="kicker-line"></div>
    ${titleBlock(slide)}
  </div>
  <div class="list-panel">${rows}</div>
  ${slide.footnote ? `<div class="footnote bebas">${esc(slide.footnote)}</div>` : ''}
  ${footer(pageNum)}
</div>`,
    cssBase,
  )
}

export function slideHtml(slide, pageNum) {
  switch (slide.layout) {
    case 'cover':
      return layoutCover(slide, pageNum)
    case 'matchup':
      return layoutMatchup(slide, pageNum)
    case 'stat':
      return layoutStat(slide, pageNum)
    case 'table':
      return layoutTable(slide, pageNum)
    default:
      return layoutStat(slide, pageNum)
  }
}
