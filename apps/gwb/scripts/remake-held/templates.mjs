import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { COLORS, MARGIN, fileUrl, wrapHtml } from './shared-css.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS = path.join(__dirname, 'assets')
const SRC = path.join(__dirname, 'sources')

const cssVs = `
.slide { background: #000; }
.hdr { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 48px; }
.hero { margin-top: 22px; display: flex; align-items: baseline; gap: 22px; font-size: 72px; line-height: 1.18; color: ${COLORS.white}; }
.hero .vs { font-size: 72px; }
.records { margin-top: 18px; font-size: 26px; color: ${COLORS.gold}; display: flex; gap: 30px; align-items: center; }
.card { position: absolute; top: 276px; width: 400px; height: 720px; border-radius: 18px; overflow: hidden; background: #111; }
.card.left { left: ${MARGIN}px; }
.card.right { left: 608px; }
.card img { width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; }
.badge { position: absolute; top: 18px; padding: 10px 18px; border-radius: 999px; background: ${COLORS.gold}; color: #111;
  font-size: 22px; line-height: 1; z-index: 3; }
.badge.left { left: 16px; }
.badge.right { right: 16px; }
.vs-badge {
  position: absolute; left: 494px; top: 600px; width: 92px; height: 92px; border-radius: 50%;
  background: ${COLORS.gold}; color: #111; z-index: 4;
  display: flex; align-items: center; justify-content: center; font-size: 36px;
}
.sneaky { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 1048px; text-align: center; font-size: 34px; color: ${COLORS.gold}; }
.poll { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 1108px; }
.poll-labels { display: flex; justify-content: space-between; font-size: 32px; margin-bottom: 10px; }
.poll-labels .l { color: ${COLORS.gold}; }
.poll-labels .r { color: ${COLORS.white}; }
.poll-bar { display: flex; height: 34px; overflow: hidden; }
.poll-bar .a { width: 52%; background: ${COLORS.gold}; }
.poll-bar .b { width: 48%; background: ${COLORS.pollDark}; }
.detail { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 1228px; text-align: center; font-size: 24px; color: ${COLORS.muted}; }
`

export function vsM3HadiManny() {
  const left = fileUrl(path.join(ASSETS, 'vs-m3-left-card.png'))
  const right = fileUrl(path.join(ASSETS, 'vs-m3-right-card.png'))
  return wrapHtml(
    `<div class="slide">
  <div class="hdr">
    <div class="kicker bebas">GWB &nbsp;•&nbsp; WEEK 4</div>
    <div class="kicker-line"></div>
    <h1 class="hero anton"><span>Hadi</span><span class="vs">vs</span><span>MANNY</span></h1>
    <div class="records bebas"><span>Hadi (2-1)</span><span>vs</span><span>MANNY (2-1)</span></div>
  </div>
  <div class="card left"><img src="${left}" alt="" /><span class="badge left bebas">Hadi 2-1</span></div>
  <div class="vs-badge bebas">VS</div>
  <div class="card right"><img src="${right}" alt="" /><span class="badge right bebas">MANNY 2-1</span></div>
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
.slide { position: relative; }
.bg { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0.32; }
.scrim { position: absolute; inset: 0; background: rgba(8, 12, 18, 0.78); }
.hdr { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 48px; z-index: 2; }
.title { margin-top: 22px; font-size: 58px; line-height: 1.12; color: ${COLORS.white}; }
.info-card {
  position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; z-index: 2;
  background: rgba(18, 24, 32, 0.96); border-left: 4px solid ${COLORS.white};
  padding: 26px 30px;
}
.info-card h3 { font-size: 30px; margin-bottom: 10px; }
.info-card p { font-size: 24px; color: ${COLORS.muted}; line-height: 1.45; margin-top: 8px; }
.card-a { top: 268px; }
.card-b { top: 458px; }
.poll { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 678px; z-index: 2; }
.poll-labels { display: flex; justify-content: space-between; font-size: 30px; margin-bottom: 10px; }
.poll-bar { display: flex; height: 34px; }
.poll-bar .a { background: ${COLORS.orange}; width: 52%; }
.poll-bar .b { background: ${COLORS.pollDark}; width: 48%; }
.orange {
  position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 748px; z-index: 2;
  color: ${COLORS.orange}; font-size: 28px; line-height: 1.48;
}
`

export function w4Slide10() {
  const bg = fileUrl(path.join(ASSETS, 'w4-10-plate.jpg'))
  return wrapHtml(
    `<div class="slide" style="background:${COLORS.bg}">
  <div class="bg" style="background-image:url('${bg}')"></div>
  <div class="scrim"></div>
  <div class="hdr">
    <div class="kicker bebas">GWB | WEEK 4 | MATCHUP 3</div>
    <div class="kicker-line"></div>
    <h1 class="title anton">Hadi vs MANNY</h1>
  </div>
  <div class="info-card card-a inter-semibold">
    <h3 class="bebas" style="color:${COLORS.white}">Hadi (2-1)</h3>
    <p>"El Campeon de la Liga"</p>
    <p>Kyler, JSN, Bowers, Pickens, Skattebo.</p>
    <p>Quietly getting healthier.</p>
  </div>
  <div class="info-card card-b inter-semibold">
    <h3 class="bebas" style="color:${COLORS.white}">MANNY (2-1)</h3>
    <p>"The Corporation"</p>
    <p>Mahomes (QB3), Cook, Davante, Kelce, Tet.</p>
    <p>Huge QB edge. Shaky flex depth.</p>
  </div>
  <div class="poll">
    <div class="poll-labels bebas"><span style="color:${COLORS.orange}">Manny 52%</span><span>Hadi 48%</span></div>
    <div class="poll-bar"><div class="a"></div><div class="b"></div></div>
  </div>
  <div class="orange inter-semibold">
    Sneaky Game of the Week. Coin flip.<br/>
    Winner to 3-1. Loser joins the commoners.
  </div>
  <div class="footer inter"><span>gwb_fantasy_football</span><span>10/16</span></div>
</div>`,
    cssW4Matchup,
  )
}

const cssW4TextBg = `
.slide { position: relative; background: ${COLORS.bg}; }
.sky { position: absolute; top: 0; right: 0; width: 280px; height: 1350px; object-fit: cover; object-position: center; }
.text { position: absolute; left: ${MARGIN}px; top: 48px; width: 680px; z-index: 2; background: ${COLORS.bg}; padding-right: 24px; }
.hero { font-size: 72px; line-height: 1.12; margin-top: 22px; }
.body { margin-top: 34px; font-size: 28px; line-height: 1.42; color: #c8d4e0; font-weight: 600; }
.body p { margin-bottom: 10px; }
`

export function w4Slide06() {
  const sky = fileUrl(path.join(ASSETS, 'w4-06-sky.png'))
  return wrapHtml(
    `<div class="slide">
  <img class="sky" src="${sky}" alt="" />
  <div class="text">
    <div class="kicker bebas">GWB | WEEK 4 | EL CAMPEON</div>
    <div class="kicker-line"></div>
    <h1 class="hero anton"><span style="color:${COLORS.white}">BOWERS</span><br/><span style="color:${COLORS.gold}">IS BACK</span></h1>
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
  </div>
  <div class="footer inter"><span>gwb_fantasy_football</span><span>6/16</span></div>
</div>`,
    cssW4TextBg,
  )
}

const cssW4List = `
.slide { position: relative; background: ${COLORS.bg}; }
.hdr { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 48px; z-index: 2; }
.center-title { margin-top: 22px; font-size: 64px; color: ${COLORS.gold}; line-height: 1.15; }
.list {
  position: absolute; left: 120px; right: 120px; top: 248px; z-index: 2;
  background: rgba(18, 24, 32, 0.96); padding: 22px 26px;
}
.row { display: flex; gap: 18px; font-size: 28px; font-weight: 600; color: #b8c4d0; padding: 14px 8px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.row:last-child { border-bottom: none; }
.row .n { color: ${COLORS.gold}; min-width: 40px; }
.row .p { color: ${COLORS.white}; flex: 1; }
.note {
  position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 1038px; z-index: 2;
  font-size: 26px; color: #c8d4e0; line-height: 1.45; font-weight: 600;
}
`

export function w4Slide14() {
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
  <div class="hdr">
    <div class="kicker bebas">GWB | WEEK 4 | QB HEAT CHECK</div>
    <div class="kicker-line"></div>
    <h1 class="center-title anton">QB HEAT CHECK</h1>
  </div>
  <div class="list">${rowsHtml}</div>
  <div class="note inter-semibold">
    <p>Darnold isn't top-tier this week...</p>
    <p>after 47.89 GWB points, I'm not telling</p>
    <p>that man what to do.</p>
  </div>
  <div class="footer inter"><span>gwb_fantasy_football</span><span>14/16</span></div>
</div>`,
    cssW4List,
  )
}

const cssW4Picks = `
.slide { position: relative; background: ${COLORS.bg}; }
.hdr { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 48px; z-index: 2; }
.picks-title { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 148px; font-size: 64px; color: ${COLORS.white}; z-index: 2; }
.pick-row {
  position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; z-index: 2;
  background: #161e28; padding: 14px 18px; font-size: 28px; font-weight: 600;
}
.pick-row .g { color: ${COLORS.gold}; }
.r1 { top: 248px; } .r2 { top: 312px; } .r3 { top: 376px; } .r4 { top: 440px; } .r5 { top: 504px; } .r6 { top: 568px; }
.coral {
  position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 660px; z-index: 2;
  color: ${COLORS.coral}; font-size: 26px; line-height: 1.4; font-weight: 600;
}
.closing {
  position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 900px; z-index: 2;
  font-size: 28px; line-height: 1.4; color: #e8e8e8; font-weight: 600;
}
`

export function w4Slide16() {
  const picks = [
    ['r1', '<span class="g">Crooke</span> over Danny'],
    ['r2', '<span class="g">Eric</span> over Mauricio - barely'],
    ['r3', '<span class="g">Steven</span> over Narking'],
    ['r4', '<span class="g">Kayser</span> over Frankie'],
    ['r5', '<span class="g">Manny</span> over Hadi - coin flip'],
    ['r6', '<span class="g">Matt</span> over Jamil - coin flip'],
  ]
  return wrapHtml(
    `<div class="slide">
  <div class="hdr">
    <div class="kicker bebas">GWB | WEEK 4 | CROOKE'S PICKS</div>
    <div class="kicker-line"></div>
  </div>
  <h1 class="picks-title anton">THE PICKS</h1>
  ${picks.map(([cls, html]) => `<div class="pick-row inter-semibold ${cls}">${html}</div>`).join('')}
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
</div>`,
    cssW4Picks,
  )
}

const cssResult = `
.slide { background: #080c10; }
.hdr { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 48px; text-align: center; }
.final { font-size: 62px; line-height: 1.18; margin-top: 22px; }
.scoreline { margin-top: 14px; font-size: 36px; color: ${COLORS.gold}; letter-spacing: 0.04em; }
.cards { position: absolute; left: 0; right: 0; top: 268px; height: 700px; }
.winner {
  position: absolute; left: 56px; top: 0; width: 440px; height: 680px; border-radius: 16px;
  border: 3px solid rgba(232,185,35,0.5); z-index: 1; background: #111;
}
.loser {
  position: absolute; left: 584px; top: 40px; width: 440px; height: 620px; border-radius: 16px;
  border: 2px solid #3a4454; z-index: 1; background: #111;
}
.card-art { position: absolute; left: 0; right: 0; top: 0; bottom: 64px; overflow: hidden; }
.card-art img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
.medal {
  position: absolute; left: 502px; top: 300px; width: 76px; height: 76px; border-radius: 50%;
  background: ${COLORS.gold}; color: #111; font-size: 44px; z-index: 2;
  display: flex; align-items: center; justify-content: center;
}
.tag { position: absolute; padding: 8px 18px; border-radius: 999px; font-family: 'Bebas Neue'; font-size: 24px; z-index: 4; }
.tag.wt { top: 16px; left: 16px; background: ${COLORS.gold}; color: #111; }
.tag.lt { top: 16px; left: 16px; background: #2a3340; color: ${COLORS.white}; }
.tag.wb { bottom: 16px; right: 16px; background: ${COLORS.gold}; color: #111; }
.tag.lb { bottom: 16px; right: 16px; background: #3a4454; color: ${COLORS.white}; }
.mid { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 998px; text-align: center; }
.mid h2 { font-size: 38px; color: ${COLORS.gold}; }
.scores { display: flex; justify-content: space-between; margin-top: 14px; font-size: 28px; }
.scores .g { color: ${COLORS.gold}; }
.bar { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 1092px; height: 30px; display: flex; overflow: hidden; border-radius: 2px; }
.bar .w { background: ${COLORS.gold}; }
.bar .l { background: #2d343c; }
.caption { position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; top: 1138px; text-align: center; font-size: 24px; color: ${COLORS.muted}; }
`

function resultSlide(cfg) {
  const wImg = fileUrl(path.join(ASSETS, cfg.winnerImg))
  const lImg = fileUrl(path.join(ASSETS, cfg.loserImg))
  return wrapHtml(
    `<div class="slide">
  <div class="hdr">
    <div class="kicker bebas">GWB &nbsp;•&nbsp; WEEK ${cfg.week}</div>
    <div class="kicker-line"></div>
    <h1 class="final anton">${cfg.finalLine}</h1>
    <p class="scoreline bebas">${cfg.scoreline}</p>
  </div>
  <div class="cards">
    <div class="winner">
      <div class="card-art"><img src="${wImg}" alt="" /></div>
      <span class="tag wt">${cfg.winnerBadge}</span>
      <span class="tag wb">WINNER</span>
    </div>
    <div class="medal bebas">W</div>
    <div class="loser">
      <div class="card-art"><img src="${lImg}" alt="" /></div>
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
        scoreline: 'KAYSER 138.7 — 119.4 Hadi',
        winnerImg: 'results-w1-m2-winner.png',
        loserImg: 'results-w1-m2-loser.png',
        winnerBadge: 'KAYSER 1-0',
        loserBadge: 'Hadi 0-1',
        winner: 'KAYSER',
        loser: 'Hadi',
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
        finalLine: 'FINAL: Hadi TAKES IT',
        scoreline: 'Hadi 151.0 — 123.7 CROOKE',
        winnerImg: 'results-w2-m1-winner.png',
        loserImg: 'results-w2-m1-loser.png',
        winnerBadge: 'Hadi 1-1',
        loserBadge: 'CROOKE 0-2',
        winner: 'Hadi',
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
        finalLine: 'FINAL: Hadi TAKES IT',
        scoreline: 'Hadi 132.0 — 121.7 DANNY',
        winnerImg: 'results-w3-m2-winner.png',
        loserImg: 'results-w3-m2-loser.png',
        winnerBadge: 'Hadi 2-1',
        loserBadge: 'DANNY 0-3',
        winner: 'Hadi',
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
