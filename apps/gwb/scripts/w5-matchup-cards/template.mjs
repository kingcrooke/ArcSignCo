import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FONTS = path.join(__dirname, '../fonts-local')

/** Live vs-w5-m1 chrome (gold top bar, asymmetric frames/pills, thick odds bar). */
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
@font-face { font-family: 'Inter'; src: url('file://${FONTS}/Inter-SemiBold.ttf'); font-weight: 600; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #0a0a0a; }
.slide {
  width: 1080px; height: 1350px;
  background: #0a0a0a;
  color: #fff;
  font-family: 'Anton', sans-serif;
  position: relative;
  overflow: hidden;
}
.top-bar {
  position: absolute; left: 0; right: 0; top: 0; height: 14px;
  background: linear-gradient(180deg, #f0c84a 0%, #d4af37 55%, #b8922a 100%);
  z-index: 10;
}
.header {
  padding: 30px 56px 0;
}
.kicker {
  font-family: 'Bebas', sans-serif;
  font-size: 30px;
  letter-spacing: 0.14em;
  color: #d4af37;
  margin-bottom: 8px;
}
.kicker-line {
  height: 2px; width: 100%;
  background: linear-gradient(90deg, #d4af37 0%, rgba(212,175,55,0.12) 100%);
  margin-bottom: 16px;
}
.headline {
  font-size: 78px;
  line-height: 0.95;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.headline .vs {
  font-size: 50px;
  color: #b8bcc4;
  margin: 0 0.12em;
  text-transform: lowercase;
  font-weight: 400;
}
.records {
  font-family: 'Bebas', sans-serif;
  font-size: 34px;
  letter-spacing: 0.08em;
  color: #d4af37;
  margin-bottom: 4px;
}
.panels {
  position: relative;
  margin: 92px 44px 0;
  height: 628px;
  display: flex;
  gap: 24px;
  justify-content: center;
  align-items: stretch;
}
.panel {
  width: 478px;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  background: #0c0e12;
}
.panel-left {
  border: 3px solid #d4af37;
  box-shadow: 0 0 32px rgba(212,175,55,0.28), inset 0 0 0 1px rgba(0,0,0,0.5);
}
.panel-right {
  border: 3px solid #3d4450;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.55);
}
.panel img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center 10%;
  display: block;
}
.pill {
  position: absolute;
  font-family: 'Bebas', sans-serif;
  font-size: 26px;
  letter-spacing: 0.08em;
  padding: 7px 16px;
  border-radius: 999px;
  background: rgba(8,8,10,0.88);
  z-index: 2;
  text-transform: uppercase;
}
.pill-left {
  top: 16px; left: 16px;
  border: 2px solid #d4af37;
  color: #d4af37;
}
.pill-right {
  top: 16px; right: 16px; left: auto;
  border: 2px solid #e87898;
  color: #f0b8c8;
  background: rgba(12,8,10,0.9);
}
.vs-badge {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 132px;
  height: 132px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #f5dc6a, #d4af37 52%, #9a7a18);
  border: 6px solid #1a1408;
  box-shadow: 0 0 36px rgba(212,175,55,0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 52px;
  color: #0a0806;
  z-index: 6;
}
.mid {
  text-align: center;
  margin-top: 22px;
  padding: 0 56px;
}
.bowl {
  font-size: 54px;
  letter-spacing: 0.06em;
  color: #d4af37;
  margin-bottom: 18px;
  line-height: 1.05;
}
.pct-row {
  display: flex;
  justify-content: space-between;
  font-family: 'Inter', sans-serif;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
  letter-spacing: 0.02em;
  text-transform: none;
}
.pct-left { color: #d4af37; }
.pct-right { color: #f0f2f5; }
.bar {
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  background: #1e242c;
  display: flex;
}
.bar-fill { background: linear-gradient(90deg, #efcc55, #c9a227); height: 100%; }
.tagline {
  margin-top: 16px;
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: none;
  color: #8a9099;
  line-height: 1.35;
}
.footer {
  position: absolute;
  left: 56px;
  right: 56px;
  bottom: 38px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-family: 'Inter', sans-serif;
}
.footer-left {
  font-size: 22px;
  color: #4a5058;
  font-weight: 600;
}
.footer-right {
  font-family: 'Bebas', sans-serif;
  font-size: 30px;
  letter-spacing: 0.1em;
  color: #f4f6f8;
}
</style>
</head>
<body>
<div class="slide">
  <div class="top-bar"></div>
  <div class="header">
    <div class="kicker">GWB • WEEK ${week}</div>
    <div class="kicker-line"></div>
    <div class="headline">${m.left.name} <span class="vs">vs</span> ${m.right.name}</div>
    <div class="records">${recordLine}</div>
  </div>
  <div class="panels">
    <div class="panel panel-left">
      <div class="pill pill-left">${m.left.name} ${m.left.record}</div>
      <img src="file://${leftImg}" alt=""/>
    </div>
    <div class="vs-badge">VS</div>
    <div class="panel panel-right">
      <div class="pill pill-right">${m.right.name} ${m.right.record}</div>
      <img src="file://${rightImg}" alt=""/>
    </div>
  </div>
  <div class="mid">
    <div class="bowl">${m.title}</div>
    <div class="pct-row">
      <span class="pct-left">${pctLeft}</span>
      <span class="pct-right">${pctRight}</span>
    </div>
    <div class="bar">
      <div class="bar-fill" style="width: ${barLeft}%"></div>
    </div>
    <div class="tagline">${m.tagline}</div>
  </div>
  <div class="footer">
    <span class="footer-left">gwb_fantasy_football</span>
    <span class="footer-right">${footerRight}</span>
  </div>
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
