import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { COLORS, fileUrl, wrapHtml } from './shared-css.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS = path.join(__dirname, 'assets')
const SRC = path.join(__dirname, 'sources')

const cssVs = `
.slide { background: #000; }
.header { padding: 48px 72px 0; }
.kicker-row { display:flex; gap: 12px; align-items: baseline; }
.hero { margin-top: 24px; display:flex; align-items: baseline; gap: 20px; font-size: 72px; line-height: 1.15; color: ${COLORS.white}; }
.hero .vs { font-size: 72px; }
.records { margin-top: 16px; font-size: 24px; color: ${COLORS.gold}; display: flex; gap: 28px; align-items: center; }
.cards-wrap { position: relative; margin: 32px 72px 0; height: 700px; }
.cards { display: flex; justify-content: center; gap: 28px; }
.card { position: relative; width: 436px; height: 652px; border-radius: 16px; overflow: hidden; }
.card img { width: 100%; height: 100%; object-fit: cover; display:block; }
.badge { position: absolute; top: 12px; padding: 8px 18px; border-radius: 999px; background: ${COLORS.gold}; color: #111;
  font-size: 22px; line-height: 1; z-index: 2; }
.badge.left { left: 12px; }
.badge.right { right: 12px; }
.vs-badge { position: absolute; left: 50%; top: 48%; transform: translate(-50%, -50%); width: 92px; height: 92px;
  border-radius: 50%; background: ${COLORS.gold}; display: flex; align-items: center; justify-content: center;
  font-size: 38px; color: #111; z-index: 5; box-shadow: 0 6px 24px rgba(0,0,0,0.55); }
.sneaky { text-align: center; margin-top: 24px; font-size: 30px; color: ${COLORS.gold}; letter-spacing: 0.04em; }
.poll { margin: 20px 72px 0; }
.poll-labels { display: flex; justify-content: space-between; font-size: 30px; margin-bottom: 10px; }
.poll-labels .l { color: ${COLORS.gold}; }
.poll-labels .r { color: ${COLORS.white}; }
.poll-bar { display: flex; height: 36px; border-radius: 1px; overflow: hidden; }
.poll-bar .a { width: 52%; background: ${COLORS.gold}; }
.poll-bar .b { width: 48%; background: ${COLORS.pollDark}; }
.detail { text-align: center; margin-top: 16px; font-size: 22px; color: ${COLORS.muted}; }
`

export function vsM3HadiManny() {
  const left = fileUrl(path.join(ASSETS, 'vs-m3-left-card.png'))
  const right = fileUrl(path.join(ASSETS, 'vs-m3-right-card.png'))
  return wrapHtml(
    `<div class="slide">
  <div class="header">
    <div class="kicker bebas">GWB &nbsp;•&nbsp; WEEK 4</div>
    <div class="kicker-line"></div>
    <h1 class="hero anton"><span>HADI</span><span class="vs">vs</span><span>MANNY</span></h1>
    <div class="records bebas"><span>HADI (2-1)</span><span>vs</span><span>MANNY (2-1)</span></div>
  </div>
  <div class="cards-wrap">
    <div class="cards">
      <div class="card"><img src="${left}" alt="" /><span class="badge left bebas">HADI 2-1</span></div>
      <div class="card"><img src="${right}" alt="" /><span class="badge right bebas">MANNY 2-1</span></div>
    </div>
    <div class="vs-badge bebas">VS</div>
  </div>
  <div class="sneaky bebas">SNEAKY GAME OF THE WEEK</div>
  <div class="poll">
    <div class="poll-labels bebas"><span class="l">Manny 52%</span><span class="r">Hadi 48%</span></div>
    <div class="poll-bar"><div class="a"></div><div class="b"></div></div>
  </div>
  <p class="detail inter">Mahomes QB3 vs Kyler QB14 &nbsp;•&nbsp; JSN + Bowers back</p>
  <div class="footer inter"><span>gwb_fantasy_football</span><span>VS &nbsp;•&nbsp; M3</span></div>
</div>`,
    cssVs,
  )
}

const cssW4Matchup = `
.slide { background: ${COLORS.bg}; position:relative; }
.bg-art { position:absolute; left:0; right:0; top:180px; height:900px; background-size:cover; background-position:center;
  opacity:0.22; filter: blur(3px) brightness(0.6); }
.content { position: relative; z-index: 1; padding: 48px 72px; }
.title { margin-top: 24px; font-size: 58px; line-height: 1.15; color: ${COLORS.white}; }
.info-card { margin-top: 28px; background: #121820; border-left: 4px solid ${COLORS.white};
  padding: 28px 32px; max-width: 936px; }
.info-card h3 { font-size: 28px; margin-bottom: 8px; }
.info-card p { font-size: 22px; color: ${COLORS.muted}; line-height: 1.45; margin-top: 6px; }
.info-card + .info-card { margin-top: 18px; }
.poll { margin-top: 32px; max-width: 936px; }
.poll-labels { display: flex; justify-content: space-between; font-size: 28px; margin-bottom: 8px; }
.poll-bar { display: flex; height: 34px; }
.poll-bar .a { background: #d4882a; width:52%; }
.poll-bar .b { background: ${COLORS.pollDark}; width:48%; }
.orange { color: #d4882a; font-size: 26px; line-height: 1.5; margin-top: 24px; max-width: 936px; }
`

export function w4Slide10() {
  const bg = fileUrl(path.join(ASSETS, 'w4-10-bg.png'))
  return wrapHtml(
    `<div class="slide">
  <div class="bg-art" style="background-image:url('${bg}')"></div>
  <div class="content">
    <div class="kicker bebas">GWB | WEEK 4 | MATCHUP 3</div>
    <div class="kicker-line"></div>
    <h1 class="title anton">HADI vs MANNY</h1>
    <div class="info-card inter-semibold">
      <h3 class="bebas" style="color:${COLORS.white}">HADI (2-1)</h3>
      <p>"El Campeon de la Liga"</p>
      <p>Kyler, JSN, Bowers, Pickens, Skattebo.</p>
      <p>Quietly getting healthier.</p>
    </div>
    <div class="info-card inter-semibold">
      <h3 class="bebas" style="color:${COLORS.white}">MANNY (2-1)</h3>
      <p>"The Corporation"</p>
      <p>Mahomes (QB3), Cook, Davante, Kelce, Tet.</p>
      <p>Huge QB edge. Shaky flex depth.</p>
    </div>
    <div class="poll">
      <div class="poll-labels bebas"><span style="color:#d4882a">Manny 52%</span><span>Hadi 48%</span></div>
      <div class="poll-bar"><div class="a"></div><div class="b"></div></div>
    </div>
    <p class="orange inter-semibold">Sneaky Game of the Week. Coin flip.<br/>Winner to 3-1. Loser joins the commoners.</p>
    <div class="footer inter"><span>gwb_fantasy_football</span><span>10/16</span></div>
  </div>
</div>`,
    cssW4Matchup,
  )
}

const cssW4TextBg = `
.slide { background: ${COLORS.bg}; position:relative; }
.hero-art { position:absolute; right:0; top:0; width: 58%; height: 100%; object-fit: cover; object-position: center top; }
.text-panel { position:relative; z-index:2; width: 58%; min-height: 100%; background: ${COLORS.bg}; padding: 48px 56px 48px 72px; }
.hero { font-size: 72px; line-height: 1.12; margin-top: 28px; }
.hero .y { color: ${COLORS.gold}; }
.body { margin-top: 36px; font-size: 28px; line-height: 1.42; color: #c8d4e0; font-weight: 600; }
.body p { margin-bottom: 10px; }
`

export function w4Slide06() {
  const hero = fileUrl(path.join(ASSETS, 'w4-06-hero.png'))
  return wrapHtml(
    `<div class="slide">
  <img class="hero-art" src="${hero}" alt="" />
  <div class="text-panel">
    <div class="kicker bebas">GWB | WEEK 4 | EL CAMPEON</div>
    <div class="kicker-line"></div>
    <h1 class="hero anton"><span style="color:${COLORS.white}">BOWERS</span><br/><span class="y">IS BACK</span></h1>
    <div class="body inter-semibold">
      <p>Brock Bowers returned from the knee</p>
      <p>procedure and immediately went:</p>
      <p>10 catches. 116 yards. 1 TD.</p>
      <p>&nbsp;</p>
      <p>Hadi goes from AJ Barner...</p>
      <p>back to an elite tight end!</p>
      <p>Ranked around top-15 overall FLEX -</p>
      <p>absurd for a tight end.</p>
      <p>JSN still a top-two FLEX.</p>
      <p>El Campeon quietly getting healthier.</p>
      <p>Nobody say anything.</p>
    </div>
    <div class="footer inter"><span>gwb_fantasy_football</span><span>6/16</span></div>
  </div>
</div>`,
    cssW4TextBg,
  )
}

const cssW4List = `
.slide { background: ${COLORS.bg}; position:relative; }
.bg-strip { position:absolute; left:0; right:0; height: 280px; background-size:cover; background-position:center top; opacity:0.35; }
.bg-strip.bottom { top:auto; bottom:0; height: 220px; background-position:center bottom; }
.content { position:relative; z-index:1; padding: 48px 72px; }
.title-band { margin-top: 12px; }
.center-title { font-size: 64px; color: ${COLORS.gold}; line-height: 1.2; }
.list { margin: 24px auto 0; max-width: 840px; background: #121820; padding: 20px 24px; }
.row { display:flex; gap: 16px; font-size: 28px; font-weight: 600; color: #b8c4d0; padding: 14px 8px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.row:last-child { border-bottom: none; }
.row .n { color: ${COLORS.gold}; min-width: 36px; }
.row .p { color: ${COLORS.white}; flex: 1; }
.note { margin-top: 36px; font-size: 26px; color: #9aa8b8; line-height: 1.45; font-weight: 600; max-width: 720px; }
`

export function w4Slide14() {
  const bg = fileUrl(path.join(ASSETS, 'w4-14-bg.png'))
  const rows = [
    ['1', 'Josh Allen', 'Matt'],
    ['2', 'Lamar', 'Crooke'],
    ['3', 'Mahomes', 'Manny'],
    ['4', 'Lawrence', 'Danny'],
    ['5', 'Hurts', 'Jamil'],
    ['6', 'Goff', 'Frankie'],
    ['7', 'Purdy', 'Narking'],
    ['9', 'Dak', 'Eric'],
    ['11', 'Bryce', 'Mauricio'],
    ['14', 'Kyler', 'Hadi'],
  ]
  const rowsHtml = rows
    .map(
      ([n, p, o]) =>
        `<div class="row inter-semibold"><span class="n">${n}</span><span class="p">${p}</span><span>- ${o}</span></div>`,
    )
    .join('')
  return wrapHtml(
    `<div class="slide">
  <div class="bg-strip bottom" style="background-image:url('${bg}')"></div>
  <div class="content">
    <div class="kicker bebas">GWB | WEEK 4 | QB HEAT CHECK</div>
    <div class="kicker-line"></div>
    <div class="title-band"><h1 class="center-title anton">QB HEAT CHECK</h1></div>
    <div class="list">${rowsHtml}</div>
    <div class="note inter-semibold">
      <p>Darnold isn't top-tier this week...</p>
      <p>after 47.89 GWB points, I'm not telling</p>
      <p>that man what to do.</p>
    </div>
    <div class="footer inter"><span>gwb_fantasy_football</span><span>14/16</span></div>
  </div>
</div>`,
    cssW4List,
  )
}

const cssW4Picks = `
.slide { background: ${COLORS.bg}; position:relative; }
.top-band { padding: 48px 72px 0; border-bottom: 1px solid rgba(143,163,184,0.2); padding-bottom: 20px; margin-bottom: 8px; }
.body-panel { padding: 8px 72px 40px; position:relative; z-index:1; }
.picks-title { font-size: 64px; margin-top: 4px; color: ${COLORS.white}; }
.pick-row { margin-top: 14px; background: #161e28; padding: 14px 18px; font-size: 28px; font-weight: 600; }
.pick-row .g { color: ${COLORS.gold}; }
.coral { color: ${COLORS.coral}; font-size: 26px; line-height: 1.45; margin-top: 28px; font-weight: 600; max-width: 900px; }
.closing { margin-top: 20px; font-size: 28px; line-height: 1.42; color: #e8e8e8; font-weight: 600; max-width: 900px; }
`

export function w4Slide16() {
  const picks = [
    '<span class="g">Crooke</span> over Danny',
    '<span class="g">Eric</span> over Mauricio - barely',
    '<span class="g">Steven</span> over Narking',
    '<span class="g">Kayser</span> over Frankie',
    '<span class="g">Manny</span> over Hadi - coin flip',
    '<span class="g">Matt</span> over Jamil - coin flip',
  ]
  return wrapHtml(
    `<div class="slide">
  <div class="top-band">
    <div class="kicker bebas">GWB | WEEK 4 | CROOKE'S PICKS</div>
    <div class="kicker-line"></div>
  </div>
  <div class="body-panel">
    <h1 class="picks-title anton">THE PICKS</h1>
    ${picks.map((p) => `<div class="pick-row inter-semibold">${p}</div>`).join('')}
    <div class="coral inter-semibold">
      <p>Upset watch: Narking over Steven.</p>
      <p>Purdy dropped 50.3, Kittle 26.2, Jeanty due for TD regression.</p>
      <p>If it happens...</p>
      <p style="margin-top:12px">God help us all:</p>
    </div>
    <div class="closing inter-semibold">
      <p>Steven is the final boss. Kayser refuses</p>
      <p>the Bottom 6. Jamil robbed the wire.</p>
      <p>Week 4 hasn't started and we're already</p>
      <p>fighting. GWB is exactly where it needs</p>
      <p>to be.</p>
    </div>
    <div class="footer inter"><span>gwb_fantasy_football</span><span>16/16</span></div>
  </div>
</div>`,
    cssW4Picks,
  )
}

const cssResult = `
.slide { background: #080c10; }
.header { padding: 48px 72px 0; text-align: center; }
.final { font-size: 56px; line-height: 1.2; margin-top: 24px; }
.scoreline { margin-top: 12px; font-size: 32px; color: ${COLORS.gold}; letter-spacing: 0.04em; }
.cards { position: relative; height: 720px; margin-top: 12px; }
.winner { position:absolute; left: 56px; top: 0; width: 500px; height: 640px; border-radius: 16px; overflow:hidden;
  box-shadow: 0 0 40px rgba(232,185,35,0.22); z-index: 2; border: 3px solid rgba(232,185,35,0.45); }
.loser { position:absolute; right: 56px; top: 56px; width: 440px; height: 560px; border-radius: 16px; overflow:hidden;
  z-index: 1; border: 2px solid #3a4454; }
.winner img, .loser img { width:100%; height:100%; object-fit: cover; }
.medal { position:absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); width: 76px; height: 76px; border-radius:50%;
  background: ${COLORS.gold}; color:#111; font-family:'Bebas Neue'; font-size: 42px; display:flex; align-items:center; justify-content:center; z-index:4; }
.tag { position:absolute; padding: 8px 16px; border-radius: 999px; font-family:'Bebas Neue'; font-size: 22px; z-index:3; }
.tag.wt { top: 14px; left: 14px; background: ${COLORS.gold}; color:#111; }
.tag.lt { top: 14px; left: 14px; background: #2a3340; color: ${COLORS.white}; }
.tag.wb { bottom: 14px; right: 14px; background: ${COLORS.gold}; color:#111; }
.tag.lb { bottom: 14px; right: 14px; background: #3a4454; color: ${COLORS.white}; }
.mid { text-align:center; padding: 0 72px; margin-top: 4px; }
.mid h2 { font-size: 36px; color: ${COLORS.gold}; }
.scores { display:flex; justify-content:space-between; margin-top: 12px; font-size: 26px; }
.scores .g { color: ${COLORS.gold}; }
.bar { margin: 12px 72px 0; height: 28px; display:flex; border-radius: 2px; overflow:hidden; }
.bar .w { background: ${COLORS.gold}; }
.bar .l { background: #2d343c; }
.caption { text-align:center; margin-top: 16px; font-size: 22px; color: ${COLORS.muted}; }
`

function resultSlide(cfg) {
  const wImg = fileUrl(path.join(ASSETS, cfg.winnerImg))
  const lImg = fileUrl(path.join(ASSETS, cfg.loserImg))
  return wrapHtml(
    `<div class="slide">
  <div class="header">
    <div class="kicker bebas">GWB &nbsp;•&nbsp; WEEK ${cfg.week}</div>
    <div class="kicker-line"></div>
    <h1 class="final anton">${cfg.finalLine}</h1>
    <p class="scoreline bebas">${cfg.scoreline}</p>
  </div>
  <div class="cards">
    <div class="winner">
      <img src="${wImg}" alt="" />
      <span class="tag wt">${cfg.winnerBadge}</span>
      <span class="tag wb">WINNER</span>
    </div>
    <div class="medal bebas">W</div>
    <div class="loser">
      <img src="${lImg}" alt="" />
      <span class="tag lt">${cfg.loserBadge}</span>
      <span class="tag lb">LOSER</span>
    </div>
  </div>
  <div class="mid">
    <h2 class="bebas">${cfg.tagline}</h2>
    <div class="scores bebas"><span class="g">${cfg.winner} ${cfg.wScore}</span><span>${cfg.lScore} ${cfg.loser}</span></div>
  </div>
  <div class="bar"><div class="w" style="width:${cfg.barWin}%"></div><div class="l" style="width:${cfg.barLose}%"></div></div>
  <p class="caption inter">${cfg.note}</p>
  <div class="footer inter"><span>gwb_fantasy_football</span><span>RESULTS &nbsp;•&nbsp; ${cfg.matchup}</span></div>
</div>`,
    cssResult,
  )
}

export const SLIDES = {
  'vs-m3-hadi-manny': { html: vsM3HadiManny },
  'w4-slide-06': { html: w4Slide06 },
  'w4-slide-10': { html: w4Slide10 },
  'w4-slide-14': { html: w4Slide14 },
  'w4-slide-16': { html: w4Slide16 },
  'results-w1-m2': {
    html: () =>
      resultSlide({
        week: 1,
        finalLine: 'FINAL: KAYSER TAKES IT',
        scoreline: 'KAYSER 138.7 — 119.4 HADI',
        winnerImg: 'results-w1-m2-winner.png',
        loserImg: 'results-w1-m2-loser.png',
        winnerBadge: 'KAYSER 1-0',
        loserBadge: 'HADI 0-1',
        winner: 'KAYSER',
        loser: 'HADI',
        wScore: '138.7',
        lScore: '119.4',
        barWin: 54,
        barLose: 46,
        tagline: 'THE SPECIAL ONE STRIKES',
        note: "Kayser 1-0 — Hadi's crown slips in Week 1",
        matchup: 'W1M2',
      }),
  },
  'results-w2-m1': {
    html: () =>
      resultSlide({
        week: 2,
        finalLine: 'FINAL: HADI TAKES IT',
        scoreline: 'HADI 151.0 — 123.7 CROOKE',
        winnerImg: 'results-w2-m1-winner.png',
        loserImg: 'results-w2-m1-loser.png',
        winnerBadge: 'HADI 1-1',
        loserBadge: 'CROOKE 0-2',
        winner: 'HADI',
        loser: 'CROOKE',
        wScore: '151.0',
        lScore: '123.7',
        barWin: 55,
        barLose: 45,
        tagline: 'EL CAMPEON RESPONDS',
        note: 'Hadi evens up at 1-1 — Crooke falls to 0-2',
        matchup: 'W2M1',
      }),
  },
  'results-w3-m2': {
    html: () =>
      resultSlide({
        week: 3,
        finalLine: 'FINAL: HADI TAKES IT',
        scoreline: 'HADI 132.0 — 121.7 DANNY',
        winnerImg: 'results-w3-m2-winner.png',
        loserImg: 'results-w3-m2-loser.png',
        winnerBadge: 'HADI 2-1',
        loserBadge: 'DANNY 1-2',
        winner: 'HADI',
        loser: 'DANNY',
        wScore: '132.0',
        lScore: '121.7',
        barWin: 52,
        barLose: 48,
        tagline: 'EL CAMPEON TO 2-1',
        note: "Danny's negative mulligan — first in GWB history",
        matchup: 'W3M2',
      }),
  },
}
