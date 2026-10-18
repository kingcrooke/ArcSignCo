import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FONTS = path.join(__dirname, '../../fonts-local')

export function resultHtml(r, winnerImg, loserImg) {
  const total = r.winnerPoints + r.loserPoints
  const barWin = Math.round((r.winnerPoints / total) * 100)
  const wName = r.winnerDisplay ?? r.winner
  const lName = r.loserDisplay ?? r.loser
  const scoreLine = `${String(wName).toUpperCase()} ${r.winnerPointsDisplay} — ${r.loserPointsDisplay} ${String(lName).toUpperCase()}`
  const footerRight = `RESULTS • W${r.week}M${r.matchupNum}`
  const caption = r.caption || r.tagline
  const midTag = r.caption ? r.tagline : ''

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
@font-face { font-family: 'Anton'; src: url('file://${FONTS}/Anton-Regular.ttf'); }
@font-face { font-family: 'Bebas'; src: url('file://${FONTS}/BebasNeue-Regular.ttf'); }
@font-face { font-family: 'Inter'; src: url('file://${FONTS}/Inter-SemiBold.ttf'); font-weight: 600; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #0a0c10; }
.slide {
  width: 1080px; height: 1350px;
  background: linear-gradient(180deg, #0d1118 0%, #080a0f 55%, #06080c 100%);
  color: #fff;
  font-family: 'Anton', sans-serif;
  position: relative;
  overflow: hidden;
}
.header { padding: 44px 56px 0; text-align: center; }
.kicker {
  font-family: 'Bebas', sans-serif;
  font-size: 30px;
  letter-spacing: 0.14em;
  color: #d4af37;
}
.kicker-line {
  height: 2px; width: 100%; margin: 10px 0 16px;
  background: linear-gradient(90deg, rgba(212,175,55,0.15), #d4af37, rgba(212,175,55,0.15));
}
.final { font-size: 64px; line-height: 1.05; letter-spacing: 0.02em; }
.scoreline {
  margin-top: 14px;
  font-family: 'Bebas', sans-serif;
  font-size: 36px;
  color: #d4af37;
  letter-spacing: 0.05em;
}
.cards { position: relative; margin: 28px 44px 0; height: 700px; }
.winner {
  position: absolute; left: 0; top: 0; width: 472px; height: 680px;
  border-radius: 18px; border: 4px solid #d4af37;
  box-shadow: 0 0 28px rgba(212,175,55,0.35);
  overflow: hidden; background: #111; z-index: 2;
}
.loser {
  position: absolute; right: 0; top: 48px; width: 472px; height: 620px;
  border-radius: 18px; border: 3px solid #4a5058;
  overflow: hidden; background: #111; z-index: 1;
}
.art {
  position: absolute; inset: 0;
  overflow: hidden; border-radius: 14px;
}
.art img {
  width: 100%; height: 100%; object-fit: cover; object-position: center 10%;
  display: block; transform: scale(1.06);
}
.pill {
  position: absolute; top: 16px; left: 16px; z-index: 3;
  font-family: 'Bebas', sans-serif; font-size: 26px; letter-spacing: 0.06em;
  padding: 8px 16px; border-radius: 999px;
  background: rgba(0,0,0,0.82); border: 2px solid #d4af37; color: #d4af37;
}
.pill.dim { border-color: #6a7078; color: #e8e8e8; }
.badge {
  position: absolute; bottom: 16px; right: 16px; z-index: 3;
  font-family: 'Bebas', sans-serif; font-size: 24px; letter-spacing: 0.08em;
  padding: 8px 18px; border-radius: 999px;
}
.badge.win { background: #d4af37; color: #0a0806; }
.badge.lose { background: #3a4450; color: #fff; }
.medal {
  position: absolute; left: 50%; top: 300px; transform: translate(-50%, 0);
  width: 96px; height: 96px; border-radius: 50%; z-index: 5;
  background: radial-gradient(circle at 35% 30%, #f0d060, #c9a227 55%, #8a6d12);
  border: 5px solid #1a1408;
  display: flex; align-items: center; justify-content: center;
  font-size: 44px; color: #0a0806;
}
.mid { text-align: center; padding: 20px 56px 0; }
.bowl { font-size: 44px; color: #d4af37; letter-spacing: 0.06em; margin-bottom: 10px; }
.scores {
  display: flex; justify-content: space-between;
  font-family: 'Bebas', sans-serif; font-size: 32px; margin-bottom: 10px;
}
.scores .w { color: #d4af37; }
.bar { height: 14px; border-radius: 8px; overflow: hidden; background: #2a2f38; display: flex; margin: 0 56px; }
.bar-fill { background: linear-gradient(90deg, #e8c547, #b8922a); height: 100%; }
.tagline {
  margin-top: 12px; font-family: 'Bebas', sans-serif; font-size: 24px;
  color: #8a9099; letter-spacing: 0.04em;
}
.caption {
  position: absolute; left: 56px; right: 56px; bottom: 88px;
  text-align: center; font-family: 'Inter', sans-serif; font-size: 22px;
  color: #8a9099; line-height: 1.35;
}
.footer {
  position: absolute; left: 56px; right: 56px; bottom: 40px;
  display: flex; justify-content: space-between;
  font-family: 'Bebas', sans-serif;
}
.footer-left { font-size: 22px; color: #4a5058; }
.footer-right { font-size: 28px; letter-spacing: 0.12em; }
</style>
</head>
<body>
<div class="slide">
  <div class="header">
    <div class="kicker">GWB • WEEK ${r.week}</div>
    <div class="kicker-line"></div>
    <div class="final">${r.headline}</div>
    <div class="scoreline">${scoreLine}</div>
  </div>
  <div class="cards">
    <div class="winner">
      <div class="art"><img src="file://${winnerImg}" alt=""/></div>
      <div class="pill">${wName} ${r.winnerRecord}</div>
      <div class="badge win">WINNER</div>
    </div>
    <div class="medal">W</div>
    <div class="loser">
      <div class="art"><img src="file://${loserImg}" alt=""/></div>
      <div class="pill dim">${lName} ${r.loserRecord}</div>
      <div class="badge lose">LOSER</div>
    </div>
  </div>
  <div class="mid">
    <div class="bowl">${r.bowlTitle}</div>
    <div class="scores">
      <span class="w">${String(wName).toUpperCase()} ${r.winnerPointsDisplay}</span>
      <span>${r.loserPointsDisplay} ${String(lName).toUpperCase()}</span>
    </div>
  </div>
  <div class="bar"><div class="bar-fill" style="width:${barWin}%"></div></div>
  ${midTag ? `<div class="tagline">${midTag}</div>` : ''}
  <div class="caption">${caption}</div>
  <div class="footer">
    <span class="footer-left">gwb_fantasy_football</span>
    <span class="footer-right">${footerRight}</span>
  </div>
</div>
</body>
</html>`
}
