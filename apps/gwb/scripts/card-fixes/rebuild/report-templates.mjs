import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { COLORS, MARGIN, fileUrl, wrapHtml } from '../../remake-held/shared-css.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CARD_ASSETS = path.join(__dirname, '..', 'assets')
const W5_ASSETS = path.join(__dirname, '../../w5-result-cards/assets')

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
.bg-hero { position: absolute; inset: 0; z-index: 1; }
.bg-hero img { width: 100%; height: 100%; object-fit: cover; object-position: center 18%; transform: scale(1.08); }
.bg-scrim { position: absolute; inset: 0; z-index: 2; background: linear-gradient(180deg, rgba(10,15,20,0.92) 0%, rgba(10,15,20,0.55) 42%, rgba(10,15,20,0.9) 100%); }
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
  position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 300px; z-index: 3;
  display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
}
.stat-box {
  background: rgba(18, 24, 32, 0.96); padding: 22px 24px; border-top: 3px solid ${COLORS.gold};
}
.stat-box .label { font-size: 24px; color: ${COLORS.muted}; letter-spacing: 0.08em; }
.stat-box .value { margin-top: 10px; font-size: 36px; color: ${COLORS.white}; line-height: 1.2; }
.stat-box .sub { margin-top: 8px; font-size: 22px; color: ${COLORS.gold}; }
.cover-text { position: absolute; left: ${MARGIN}px; top: 48px; width: 620px; z-index: 3; padding-right: 20px; }
.w2-06-hero {
  position: absolute; inset: 0; z-index: 1; overflow: hidden;
}
.w2-06-hero img {
  width: 100%; height: 100%; object-fit: cover; object-position: center 8%; transform: scale(1.02);
}
.w2-06-scrim {
  position: absolute; inset: 0; z-index: 2;
  background: linear-gradient(180deg, rgba(10,15,20,0.88) 0%, rgba(10,15,20,0.45) 38%, rgba(10,15,20,0.55) 62%, rgba(8,10,14,0.92) 100%);
}
.w2-06-content { position: relative; z-index: 3; }
.margin-hero {
  position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 520px; z-index: 3;
  text-align: center; font-size: 96px; color: ${COLORS.gold}; line-height: 1;
}
`

function footer(pageNum) {
  return `<div class="footer inter"><span>gwb_fantasy_football</span><span class="bebas">${pageNum}</span></div>`
}

function titleBlock(title, titleGold) {
  const gold = titleGold
    ? `<br/><span class="gold anton">${titleGold}</span>`
    : ''
  return `<h1 class="title-split anton">${title}${gold}</h1>`
}

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
}

export function w1Slide09() {
  const left = fileUrl(path.join(CARD_ASSETS, 'results-w1-m3-winner.jpg'))
  const right = fileUrl(path.join(CARD_ASSETS, 'results-w1-m3-loser.jpg'))
  return wrapHtml(
    `<div class="slide">
  <div class="hdr">
    <div class="kicker bebas">${esc('GWB · WEEK 1 · FINAL REPORT')}</div>
    <div class="kicker-line"></div>
    ${titleBlock('MATT 175.08', 'DEF. NARKING 158.17')}
  </div>
  <div class="dual-cards">
    <div class="card"><img src="${left}" alt=""/></div>
    <div class="card dim"><img src="${right}" alt=""/></div>
  </div>
  <div class="info-stack inter-semibold">
    <p>Matt — "Buried by Toe Burrow" — 175.08</p>
    <p>Narking — "Put em down Jeanty" — 158.17</p>
    <p>158 wasted. Fourth-highest score, still 0-1.</p>
  </div>
  ${footer('9/16')}
</div>`,
    cssBase,
  )
}

export function w2Slide06() {
  const hero = fileUrl(path.join(__dirname, '..', 'generated', 'eric-DAL-4-w2.jpg'))
  const body = [
    'Eric is 1-1.',
    "The man who drafted like a different sport is undefeated. Amon-Ra's 37.2 Thursday did the heavy lifting.",
    'Frankie: 0-2.',
    'Joe Money has become Joe Problems.',
  ]
    .map((line) => `<p>${esc(line)}</p>`)
    .join('')
  return wrapHtml(
    `<div class="slide w2-06-content">
  <div class="w2-06-hero"><img src="${hero}" alt=""/></div>
  <div class="w2-06-scrim"></div>
  <div class="cover-text">
    <div class="kicker bebas">${esc('GWB · WEEK 2 · FINAL REPORT')}</div>
    <div class="kicker-line"></div>
    ${titleBlock('2-0 AND', 'UNEXPLAINED')}
  </div>
  <div class="body-block inter-semibold" style="top:300px;width:560px;max-width:58%">${body}</div>
  ${footer('6/16')}
</div>`,
    cssBase,
  )
}

export const REPORT_SLIDES = {
  'w1-slide-09': w1Slide09,
  'w2-slide-06': w2Slide06,
}
