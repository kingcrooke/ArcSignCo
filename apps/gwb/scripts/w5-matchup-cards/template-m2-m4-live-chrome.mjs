import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FONTS = path.join(__dirname, '../fonts-local')

/** Live vs-w5-m1 chrome — used only for vs-w5-m2 / vs-w5-m4 renders. */
export function cardHtml(m, leftImg, rightImg) {
  const week = m.week ?? 5
  const leftPct = m.left.pct
  const rightPct = m.right.pct
  const recordLine =
    m.recordLine ??
    `${m.left.name} (${m.left.record})   vs   ${m.right.name} (${m.right.record})`
  const barLeft = m.barLeftPct ?? leftPct
  const pctLeft = m.leftPctLabel ?? `${cap(m.left.name)} ${leftPct}%`
  const pctRight = m.rightPctLabel ?? `${cap(m.right.name)} ${rightPct}%`
  const footerRight = m.footerRight ?? `VS • M${m.matchupNum}`

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
@font-face { font-family: 'Anton'; src: url('file://${FONTS}/Anton-Regular.ttf'); }
@font-face { font-family: 'Bebas'; src: url('file://${FONTS}/BebasNeue-Regular.ttf'); }
@font-face { font-family: 'Montserrat'; src: url('file://${FONTS}/Montserrat-Bold.ttf'); font-weight: 700; }
@font-face { font-family: 'Inter'; src: url('file://${FONTS}/Inter-Regular.ttf'); font-weight: 400; }
@font-face { font-family: 'Inter'; src: url('file://${FONTS}/Inter-SemiBold.ttf'); font-weight: 600; }
@font-face { font-family: 'Inter'; src: url('file://${FONTS}/Inter-Bold.ttf'); font-weight: 700; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #030406; }
.slide {
  width: 1080px; height: 1350px;
  background: #030406;
  color: #fff;
  font-family: 'Anton', sans-serif;
  position: relative;
  overflow: hidden;
}
.top-bar {
  position: absolute; left: 0; right: 0; top: 0; height: 14px;
  background: linear-gradient(180deg, #e8c84a 0%, #d4af37 55%, #b8922a 100%);
  z-index: 10;
}
.kicker {
  position: absolute; left: 67px; right: 67px; top: 52px;
  font-family: 'Bebas', sans-serif;
  font-size: 32px;
  line-height: 1;
  letter-spacing: 0.12em;
  color: #d4af37;
  text-transform: uppercase;
}
.kicker-line {
  position: absolute; left: 67px; right: 67px; top: 98px;
  height: 2px;
  background: #4a5058;
}
.headline {
  position: absolute; left: 67px; right: 67px; top: 147px;
  font-family: 'Anton', sans-serif;
  font-size: 84px;
  line-height: 0.85;
  letter-spacing: 0.015em;
  text-transform: uppercase;
}
.headline .vs {
  font-size: 52px;
  color: #c9c9c9;
  margin: 0 0.15em;
  text-transform: lowercase;
  font-weight: 400;
}
.records {
  position: absolute; left: 67px; right: 67px; top: 240px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 30px;
  line-height: 0.96;
  letter-spacing: 0.02em;
  white-space: pre;
  color: #d4af37;
  text-transform: none;
}
.panels {
  position: absolute; left: 67px; top: 275px;
  width: 946px; height: 668px;
}
.panel {
  position: absolute; top: 0;
  width: 486px; height: 668px;
  border-radius: 18px;
  overflow: hidden;
  background: #0c0e12;
}
.panel-left { left: 0; border: 4px solid #d4af37;
  box-shadow: 0 0 40px rgba(212,175,55,0.45), 0 0 80px rgba(212,175,55,0.18), inset 0 0 0 1px rgba(0,0,0,0.5);
}
.panel-right { left: 508px; border: 4px solid #3a4048;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.55);
}
.panel img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center 12%;
  display: block;
}
.pill {
  position: absolute;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 26px;
  letter-spacing: 0.14em;
  padding: 8px 18px;
  border-radius: 999px;
  background: rgba(8,8,10,0.88);
  z-index: 2;
  text-transform: uppercase;
}
.pill-left { top: 16px; left: 16px; border: 2px solid #d4af37; color: #d4af37; }
.pill-right { top: 16px; right: 16px; border: 2px solid #e87898; color: #f0b8c8; background: rgba(12,8,10,0.9); }
.vs-badge {
  position: absolute;
  left: 540px; top: 649px;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  width: 207px; height: 207px;
  border-radius: 50%;
  background: #d4af37;
  box-shadow: inset 0 0 0 2px #1c1608;
  display: flex; align-items: center; justify-content: center;
  font-size: 72px; line-height: 1;
  color: #0a0806;
  z-index: 6;
}
.bowl {
  position: absolute; left: 67px; right: 67px; top: 1038px;
  text-align: center;
  font-size: 51px;
  line-height: 0.98;
  letter-spacing: 0.05em;
  color: #d4af37;
}
.pct-left {
  position: absolute; left: 67px;   top: 1108px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 38px;
  line-height: 1;
  letter-spacing: 0.02em;
  color: #d4af37;
}
.pct-right {
  position: absolute; right: 67px; top: 1108px;
  white-space: nowrap;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 38px;
  line-height: 1;
  letter-spacing: 0.02em;
  color: #f0f2f5;
  text-align: right;
}
.bar {
  position: absolute; left: 67px; right: 67px; top: 1156px;
  height: 32px;
  border-radius: 4px;
  overflow: hidden;
  background: #1e242c;
  display: flex;
}
.bar-fill { background: #d4af37; height: 100%; }
.footer-clause {
  position: absolute; left: 67px; right: 67px; top: 1211px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 28px;
  font-weight: 400;
  line-height: 1;
  color: #a8aeb6;
}
.footer-left {
  position: absolute; left: 67px; top: 1263px;
  font-family: 'Inter', sans-serif;
  font-size: 28px;
  color: #a8aeb6;
  font-weight: 400;
}
.footer-right {
  position: absolute; right: 67px; top: 1263px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 30px;
  letter-spacing: 0.16em;
  color: #f4f6f8;
  text-transform: uppercase;
}
</style>
</head>
<body>
<div class="slide">
  <div class="top-bar"></div>
  <div class="kicker">GWB • WEEK ${week}</div>
  <div class="kicker-line"></div>
  <div class="headline">${m.left.name} <span class="vs">vs</span> ${m.right.name}</div>
  <div class="records">${recordLine}</div>
  <div class="panels">
    <div class="panel panel-left">
      <div class="pill pill-left">${m.left.name} ${m.left.record}</div>
      <img src="file://${leftImg}" alt=""/>
    </div>
    <div class="panel panel-right">
      <div class="pill pill-right">${m.right.name} ${m.right.record}</div>
      <img src="file://${rightImg}" alt=""/>
    </div>
  </div>
  <div class="vs-badge">VS</div>
  <div class="bowl">${m.title}</div>
  <div class="pct-left">${pctLeft}</div>
  <div class="pct-right">${pctRight}</div>
  <div class="bar"><div class="bar-fill" style="width: ${barLeft}%"></div></div>
  <div class="footer-clause">${m.tagline}</div>
  <div class="footer-left">gwb_fantasy_football</div>
  <div class="footer-right">${footerRight}</div>
</div>
</body>
</html>`
}

function cap(s) {
  return s.charAt(0) + s.slice(1).toLowerCase()
}

export function loadMatchups() {
  return JSON.parse(readFileSync(path.join(__dirname, 'matchups.json'), 'utf8'))
}
