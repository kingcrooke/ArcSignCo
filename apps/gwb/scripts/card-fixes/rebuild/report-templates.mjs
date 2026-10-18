import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FONTS = path.join(__dirname, '../../fonts-local')

const baseCss = `
@font-face { font-family: 'Anton'; src: url('file://${FONTS}/Anton-Regular.ttf'); }
@font-face { font-family: 'Bebas'; src: url('file://${FONTS}/BebasNeue-Regular.ttf'); }
@font-face { font-family: 'Inter'; src: url('file://${FONTS}/Inter-SemiBold.ttf'); font-weight: 600; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #080c10; }
.slide {
  width: 1080px; height: 1350px;
  background: radial-gradient(ellipse 120% 80% at 50% 40%, #1a2230 0%, #0a0e14 55%, #06080c 100%);
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
  line-height: 1.05;
  margin-top: 8px;
}
.hero .gold { color: #d4af37; }
.hero .dim { font-size: 42px; color: #c8d0d8; font-weight: 400; }
.body {
  margin-top: 28px;
  font-size: 28px;
  line-height: 1.45;
  color: #e8eef4;
  font-weight: 600;
}
.body p { margin-bottom: 14px; }
.score-stack {
  margin-top: 36px;
  background: rgba(12, 16, 22, 0.92);
  border-radius: 4px;
  overflow: hidden;
  max-width: 920px;
}
.score-row {
  display: grid;
  grid-template-columns: 6px 1fr auto;
  gap: 0 16px;
  align-items: center;
  padding: 18px 22px 18px 0;
  font-size: 26px;
  font-weight: 600;
}
.score-row.win { border-left: 6px solid #d4af37; }
.score-row.lose { border-left: 6px solid #c45c5c; color: #d0d8e0; }
.score-row .team { color: #fff; }
.score-row .tag { color: #d4af37; font-size: 22px; margin-left: 8px; }
.score-row.lose .tag { color: #e8a0a0; }
.score-row .pts { font-family: 'Anton', sans-serif; font-size: 36px; color: #d4af37; }
.score-row.lose .pts { color: #fff; }
.caption-line {
  margin-top: 28px;
  font-size: 28px;
  color: #e8eef4;
  font-weight: 600;
}
.stat-center {
  text-align: center;
  padding: 48px 56px 0;
}
.stat-center .label {
  font-family: 'Bebas', sans-serif;
  font-size: 36px;
  letter-spacing: 0.14em;
  color: #8a9099;
  margin-top: 12px;
}
.stat-center .line {
  font-family: 'Anton', sans-serif;
  font-size: 52px;
  margin-top: 28px;
}
.stat-center .margin {
  font-family: 'Anton', sans-serif;
  font-size: 96px;
  color: #d4af37;
  margin-top: 24px;
  line-height: 1;
}
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
    <div class="kicker">GWB | WEEK 1 | FINAL REPORT</div>
    <div class="kicker-line"></div>
    <h1 class="hero"><span class="gold">MATT 175.08</span> <span class="dim">def. Narking 158.17</span></h1>
    <div class="score-stack">
      <div class="score-row win">
        <span></span>
        <div><span class="team">Matt</span><span class="tag">"Buried by Toe Burrow"</span></div>
        <span class="pts">175.08</span>
      </div>
      <div class="score-row lose">
        <span></span>
        <div><span class="team">Narking</span><span class="tag">"Put em down Jeanty"</span></div>
        <span class="pts">158.17</span>
      </div>
    </div>
    <p class="caption-line">158 wasted. fourth-highest score, still 0-1.</p>
  </div>
  <div class="footer"><span>gwb_fantasy_football</span><span class="r">9/16</span></div>
</div>`)
}

export function w2Slide06() {
  return wrap(`
<div class="slide">
  <div class="pad">
    <div class="kicker">GWB | WEEK 2 | FINAL REPORT</div>
    <div class="kicker-line"></div>
    <h1 class="hero">2-0 AND <span class="gold">UNEXPLAINED</span></h1>
    <div class="body">
      <p>Eric is 1-1.</p>
      <p>The man who drafted like a different sport is undefeated. Amon-Ra's 37.2 Thursday did the heavy lifting.</p>
      <p>Frankie: 0-2.</p>
      <p>Joe Money has become Joe Problems.</p>
    </div>
  </div>
  <div class="footer"><span>gwb_fantasy_football</span><span class="r">6/16</span></div>
</div>`)
}

export function w4Slide12() {
  return wrap(`
<div class="slide">
  <div class="stat-center">
    <div class="kicker">GWB | WEEK 4 | FINAL REPORT</div>
    <div class="kicker-line"></div>
    <p class="label">STAT OF THE WEEK</p>
    <p class="line">HADY 141.65</p>
    <p class="line">MANNY 134.88</p>
    <p class="margin">6.77</p>
  </div>
  <div class="footer"><span>gwb_fantasy_football</span><span class="r">12/16</span></div>
</div>`)
}

export const REPORT_SLIDES = {
  'w1-slide-09': w1Slide09,
  'w2-slide-06': w2Slide06,
  'w4-slide-12': w4Slide12,
}
