import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FONTS = path.join(__dirname, '../../fonts-local')
const FACTS = JSON.parse(readFileSync(path.join(__dirname, '../sleeper-facts.json'), 'utf8'))

const baseCss = `
@font-face { font-family: 'Anton'; src: url('file://${FONTS}/Anton-Regular.ttf'); }
@font-face { font-family: 'Bebas'; src: url('file://${FONTS}/BebasNeue-Regular.ttf'); }
@font-face { font-family: 'Inter'; src: url('file://${FONTS}/Inter-SemiBold.ttf'); font-weight: 600; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #080c10; }
.slide {
  width: 1080px; height: 1350px;
  background: linear-gradient(180deg, #0d1118 0%, #080a0f 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}
.kicker {
  font-family: 'Bebas', sans-serif;
  font-size: 32px;
  letter-spacing: 0.12em;
  color: #d4af37;
}
.kicker-line {
  height: 2px; width: 100%; margin: 8px 0 18px;
  background: linear-gradient(90deg, #d4af37 0%, rgba(212,175,55,0.15) 100%);
}
.hero {
  font-family: 'Anton', sans-serif;
  font-size: 68px;
  line-height: 1.1;
  margin-top: 12px;
}
.body {
  margin-top: 28px;
  font-size: 28px;
  line-height: 1.45;
  color: #c8d4e0;
  font-weight: 600;
}
.body p { margin-bottom: 12px; }
.footer {
  position: absolute; left: 56px; right: 56px; bottom: 42px;
  display: flex; justify-content: space-between;
  font-family: 'Bebas', sans-serif;
  font-size: 24px;
  color: #4a5058;
}
.footer .r { color: #e8e8e8; font-size: 28px; }
.pad { padding: 48px 56px 0; }
`

function wrap(body, extraCss = '') {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>${baseCss}${extraCss}</style></head><body>${body}</body></html>`
}

export function w1Slide09() {
  return wrap(`
<div class="slide">
  <div class="pad">
    <div class="kicker">GWB | WEEK 1 | SCOREBOARD</div>
    <div class="kicker-line"></div>
    <h1 class="hero">MATT <span style="color:#d4af37">175.08</span></h1>
    <div class="body">
      <p>Narking's 158.17 was the <strong style="color:#fff">fourth-highest</strong> Week 1 score in league history.</p>
      <p>Not third-highest — Matt's eruption still owns the podium.</p>
    </div>
  </div>
  <div class="footer"><span>gwb_fantasy_football</span><span class="r">9/16</span></div>
</div>`)
}

export function w2Slide06() {
  return wrap(`
<div class="slide">
  <div class="pad">
    <div class="kicker">GWB | WEEK 2 | UNEXPLAINED</div>
    <div class="kicker-line"></div>
    <h1 class="hero">ERIC IS 1-1 AFTER WEEK 2</h1>
    <div class="body">
      <p>Not undefeated — Eric split after losing to Manny.</p>
      <p>Amon-Ra St. Brown scored <strong style="color:#fff">37.2</strong> in Week 2 (not 44.00).</p>
    </div>
  </div>
  <div class="footer"><span>gwb_fantasy_football</span><span class="r">6/16</span></div>
</div>`)
}

export function w4Slide12() {
  const closest = FACTS.margins.w4[0]
  const margin = closest.margin.toFixed(2)
  const w = closest.winner === 'Hady' ? 'HADY' : closest.winner.toUpperCase()
  const l = closest.loser.toUpperCase()
  return wrap(
    `
<div class="slide">
  <div class="pad" style="text-align:center">
    <div class="kicker">GWB | WEEK 4 | STAT OF THE WEEK</div>
    <div class="kicker-line"></div>
    <p class="kicker" style="font-size:36px;color:#8a9099;margin-top:24px">STAT OF THE WEEK</p>
    <h1 class="hero" style="font-size:52px;margin-top:20px">${w} ${closest.winnerPts.toFixed(2)}</h1>
    <h1 class="hero" style="font-size:52px;margin-top:8px">${l} ${closest.loserPts.toFixed(2)}</h1>
    <p class="hero" style="color:#d4af37;font-size:72px;margin-top:16px">${margin}</p>
    <div class="body" style="text-align:left;margin-top:32px">
      <p>Closest game of Week 4: ${closest.winner === 'Hady' ? 'HADY' : closest.winner} over ${closest.loser} by ${margin}.</p>
      <p>Mauricio edged Narking by 0.03 in total points — not the same as matchup margin.</p>
      <p>Biggest blowout: Steven over Narking by 39.35.</p>
    </div>
  </div>
  <div class="footer"><span>gwb_fantasy_football</span><span class="r">12/16</span></div>
</div>`,
    `.hero { text-align: center; }`,
  )
}

export const REPORT_SLIDES = {
  'w1-slide-09': w1Slide09,
  'w2-slide-06': w2Slide06,
  'w4-slide-12': w4Slide12,
}
