import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { LEAGUE_ID, MANAGER_BY_USER_ID } from '../lib/gwb-managers.mjs'
import { fetchJson, loadWeekMatchupFacts, loadPlayersNfl } from '../lib/sleeper-week-facts.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SLEEPER = 'https://api.sleeper.app/v1'

const ROSTER = {
  Danny: 1,
  Mauricio: 2,
  Narking: 3,
  Kayser: 4,
  Eric: 5,
  Hady: 6,
  Steven: 7,
  Crooke: 8,
  Manny: 9,
  Jamil: 10,
  Frankie: 11,
  Matt: 12,
}

function nameForRoster(rosters, rid) {
  const r = rosters.find((x) => x.roster_id === rid)
  return MANAGER_BY_USER_ID[r.owner_id]
}

function rosterPf(settings) {
  return settings.fpts + settings.fpts_decimal / 100
}

function playerLabel(players, pid) {
  const p = players[pid] ?? {}
  const num = p.number != null ? `#${p.number}` : ''
  return `${p.full_name ?? pid} ${num}`.trim()
}

function lastName(full) {
  if (!full) return ''
  const parts = String(full).trim().split(/\s+/)
  return parts[parts.length - 1] ?? full
}

function startingQbLastName(matchups, players, rosterId) {
  const m = matchups.find((x) => x.roster_id === rosterId)
  const pid = m?.starters?.[0]
  const p = players[pid]
  return lastName(p?.full_name ?? pid)
}

async function main() {
  const week = 5
  const players = await loadPlayersNfl()
  const { results, rosters, matchups } = await loadWeekMatchupFacts(week)
  const w6 = await fetchJson(`${SLEEPER}/league/${LEAGUE_ID}/matchups/6`)

  const scores = matchups
    .map((m) => ({ name: nameForRoster(rosters, m.roster_id), pts: m.points }))
    .sort((a, b) => b.pts - a.pts)

  const standings = rosters
    .map((r) => ({
      name: MANAGER_BY_USER_ID[r.owner_id],
      w: r.settings.wins,
      l: r.settings.losses,
      pf: rosterPf(r.settings),
    }))
    .sort((a, b) => (b.w !== a.w ? b.w - a.w : b.pf - a.pf))

  const margins = results
    .map((r) => ({
      label: `${r.winner} over ${r.loser}`,
      margin: r.winnerPoints - r.loserPoints,
      winnerPts: r.winnerPoints,
      loserPts: r.loserPoints,
    }))
    .sort((a, b) => a.margin - b.margin)
  const closest = margins[0]
  const blowout = margins[margins.length - 1]

  const benchLeaders = []
  for (const m of matchups) {
    const mgr = nameForRoster(rosters, m.roster_id)
    const starters = new Set(m.starters ?? [])
    for (const [pid, pts] of Object.entries(m.players_points ?? {})) {
      if (!starters.has(pid) && pts > 0) {
        benchLeaders.push({ mgr, pts, label: playerLabel(players, pid) })
      }
    }
  }
  benchLeaders.sort((a, b) => b.pts - a.pts)

  const leagueTop = []
  for (const m of matchups) {
    const mgr = nameForRoster(rosters, m.roster_id)
    const starters = new Set(m.starters ?? [])
    for (const [pid, pts] of Object.entries(m.players_points ?? {})) {
      if (starters.has(pid) && pts > 0) {
        leagueTop.push({ mgr, pts, label: playerLabel(players, pid) })
      }
    }
  }
  leagueTop.sort((a, b) => b.pts - a.pts)

  const steven = results.find((r) => r.loser === 'Steven')
  const hady = results.find((r) => r.winner === 'Hady')
  const narking = results.find((r) => r.loser === 'Narking')
  const m2 = results.find((r) => r.id === 'results-w5-m2')
  const m3 = results.find((r) => r.id === 'results-w5-m3')
  const m5 = results.find((r) => r.id === 'results-w5-m5')
  const m6 = results.find((r) => r.id === 'results-w5-m6')
  const m4 = hady

  const w6Pairs = new Map()
  for (const m of w6) {
    const list = w6Pairs.get(m.matchup_id) ?? []
    list.push(m)
    w6Pairs.set(m.matchup_id, list)
  }
  const w6Lines = []
  for (const mid of [...w6Pairs.keys()].sort((a, b) => a - b)) {
    const [a, b] = w6Pairs.get(mid)
    const na = nameForRoster(rosters, a.roster_id)
    const nb = nameForRoster(rosters, b.roster_id)
    const ra = rosters.find((r) => r.roster_id === a.roster_id).settings
    const rb = rosters.find((r) => r.roster_id === b.roster_id).settings
    w6Lines.push(`${na} (${ra.wins}-${ra.losses}) vs ${nb} (${rb.wins}-${rb.losses})`)
  }

  const ordered = [
    {
      id: 'w5-slide-01',
      layout: 'cover',
      title: 'THE UNDEFEATED RUN',
      titleGold: 'IS OVER',
      body: [
        'Week 5 is OFFICIALLY over.',
        'Sleeper scores reviewed. Monday night reviewed.',
        `Steven falls to ${steven.loserRecord} — first loss of the season.`,
        '',
        'NO MORE PERFECT RECORDS.',
      ],
      hero: steven.id,
      heroSide: 'loser',
      heroManager: 'Steven',
    },
    {
      id: 'w5-slide-02',
      layout: 'matchup',
      kicker: 'MATCHUP 1',
      title: `${steven.winner} ${steven.winnerPoints.toFixed(2)}`,
      titleGold: `DEF. ${steven.loser.toUpperCase()} ${steven.loserPoints.toFixed(2)}`,
      body: [
        `Margin: ${(steven.winnerPoints - steven.loserPoints).toFixed(2)} points.`,
        `${steven.winner} climbs to ${steven.winnerRecord}.`,
        `Steven still leads the league at ${standings.find((s) => s.name === 'Steven').pf.toFixed(2)} PF.`,
      ],
      hero: steven.id,
      heroManager: 'Crooke',
    },
    {
      id: 'w5-slide-03',
      layout: 'matchup',
      kicker: 'WEEK 5 HIGH SCORE',
      title: `HADY ${hady.winnerPoints.toFixed(2)}`,
      titleGold: `DEF. FRANKIE ${hady.loserPoints.toFixed(2)}`,
      body: [
        `Drake Maye ${hady.winnerTopScorer.points.toFixed(2)} in the starting lineup.`,
        `Margin: ${(hady.winnerPoints - hady.loserPoints).toFixed(2)} — biggest blowout of the week.`,
        `HADY moves to ${hady.winnerRecord}.`,
      ],
      hero: hady.id,
      heroManager: 'Hady',
    },
    {
      id: 'w5-slide-04',
      layout: 'matchup',
      kicker: 'MATCHUP 2',
      title: `DANNY ${m2.winnerPoints.toFixed(2)}`,
      titleGold: `DEF. MANNY ${m2.loserPoints.toFixed(2)}`,
      body: [
        `${lastName(m2.winnerTopScorer.name)} ${m2.winnerTopScorer.points.toFixed(1)}.`,
        `${startingQbLastName(matchups, players, ROSTER.Danny)} vs ${startingQbLastName(matchups, players, ROSTER.Manny)} on the stat sheet.`,
        'Danny snaps a two-game skid.',
      ],
      hero: 'results-w5-m2',
      heroManager: 'Danny',
    },
    {
      id: 'w5-slide-05',
      layout: 'matchup',
      kicker: 'MATCHUP 5',
      title: `MAURICIO ${m5.winnerPoints.toFixed(2)}`,
      titleGold: `DEF. JAMIL ${m5.loserPoints.toFixed(2)}`,
      body: [
        `${lastName(m5.winnerTopScorer.name)} ${m5.winnerTopScorer.points.toFixed(1)}.`,
        `${startingQbLastName(matchups, players, ROSTER.Mauricio)} vs ${startingQbLastName(matchups, players, ROSTER.Jamil)} on the stat sheet.`,
      ],
      hero: 'results-w5-m5',
      heroManager: 'Mauricio',
    },
    {
      id: 'w5-slide-06',
      layout: 'matchup',
      kicker: 'MATCHUP 6',
      title: `MATT ${m6.winnerPoints.toFixed(2)}`,
      titleGold: `DEF. KAYSER ${m6.loserPoints.toFixed(2)}`,
      body: [
        `${lastName(m6.winnerTopScorer.name)} ${m6.winnerTopScorer.points.toFixed(1)}.`,
        `${startingQbLastName(matchups, players, ROSTER.Matt)} vs ${startingQbLastName(matchups, players, ROSTER.Kayser)} — Matt gets the W.`,
      ],
      hero: 'results-w5-m6',
      heroManager: 'Matt',
    },
    {
      id: 'w5-slide-07',
      layout: 'matchup',
      kicker: 'MATCHUP 3',
      title: `ERIC ${m3.winnerPoints.toFixed(2)}`,
      titleGold: `DEF. NARKING ${m3.loserPoints.toFixed(2)}`,
      body: [
        `${lastName(m3.winnerTopScorer.name)} ${m3.winnerTopScorer.points.toFixed(2)}.`,
        `${startingQbLastName(matchups, players, ROSTER.Eric)} vs ${startingQbLastName(matchups, players, ROSTER.Narking)}.`,
        `Narking held to ${narking.loserPoints.toFixed(2)} — low mark of the week.`,
      ],
      hero: 'results-w5-m3',
      heroManager: 'Eric',
    },
    {
      id: 'w5-slide-08',
      layout: 'stat',
      kicker: 'BENCH WATCH',
      title: 'LEFT ON THE',
      titleGold: 'PINE',
      statBoxes: [
        { label: 'TOP BENCH', value: `${benchLeaders[0].label}`, sub: `${benchLeaders[0].pts.toFixed(2)} (${benchLeaders[0].mgr})` },
        { label: 'RUNNER UP', value: `${benchLeaders[1].label}`, sub: `${benchLeaders[1].pts.toFixed(2)} (${benchLeaders[1].mgr})` },
      ],
      body: [
        `Frankie left Joe Burrow ${benchLeaders.find((b) => b.mgr === 'Frankie')?.pts.toFixed(2) ?? '40.73'} on the bench.`,
        'GWB rewards the starters. Usually.',
      ],
      footnote: 'BENCH POINTS FROM SLEEPER WEEK 5',
    },
    {
      id: 'w5-slide-09',
      layout: 'stat',
      kicker: 'FRANKIE ZONE',
      title: 'STILL',
      titleGold: 'OPEN',
      body: [
        `Frankie drops to ${m4.loserRecord}.`,
        `Score: ${hady.loserPoints.toFixed(2)} in the HADY rout.`,
        'The zone signage remains fully operational.',
      ],
      hero: 'results-w5-m4',
      heroSide: 'loser',
      heroManager: 'Frankie',
    },
    {
      id: 'w5-slide-10',
      layout: 'stat',
      kicker: 'TOP SCORERS',
      title: 'WEEK 5',
      titleGold: 'LEADERS',
      statBoxes: [
        { label: '#1', value: leagueTop[0].label, sub: `${leagueTop[0].pts.toFixed(2)} (${leagueTop[0].mgr})` },
        { label: '#2', value: leagueTop[1].label, sub: `${leagueTop[1].pts.toFixed(2)} (${leagueTop[1].mgr})` },
      ],
      body: [
        `#3 ${leagueTop[2].label} — ${leagueTop[2].pts.toFixed(2)}`,
        `#4 ${leagueTop[3].label} — ${leagueTop[3].pts.toFixed(2)}`,
      ],
      footnote: 'STARTERS ONLY · SLEEPER WEEK 5',
    },
    {
      id: 'w5-slide-11',
      layout: 'table',
      title: 'FINAL WEEK 5',
      titleGold: 'SCORING',
      table: scores.map((s, i) => ({ rank: i + 1, name: s.name, pts: s.pts.toFixed(2) })),
      footnote:
        scores.length >= 3
          ? `Top 3 separated by ${(scores[0].pts - scores[2].pts).toFixed(2)} points.`
          : '',
    },
    {
      id: 'w5-slide-12',
      layout: 'stat',
      kicker: 'STAT OF THE WEEK',
      title: `CLOSEST: ${closest.margin.toFixed(2)}`,
      titleGold: `BLOWOUT: ${blowout.margin.toFixed(2)}`,
      body: [
        closest.label,
        blowout.label,
        `Low score: Narking ${narking.loserPoints.toFixed(2)}.`,
      ],
      footnote: 'ALL MARGINS FROM SLEEPER FINALS',
    },
    {
      id: 'w5-slide-13',
      layout: 'table',
      title: 'STANDINGS AFTER',
      titleGold: 'WEEK 5',
      table: standings.map((s, i) => ({
        rank: i + 1,
        name: s.name,
        pf: `${s.w}-${s.l} · ${s.pf.toFixed(2)} PF`,
      })),
      footnote: 'HADY and Steven tied atop the table at 4-1.',
    },
    {
      id: 'w5-slide-14',
      layout: 'stat',
      kicker: 'BIGGEST BLOWOUT',
      title: `HADY ${hady.winnerPoints.toFixed(2)}`,
      titleGold: `FRANKIE ${hady.loserPoints.toFixed(2)}`,
      statBoxes: [
        { label: 'MAYE', value: hady.winnerTopScorer.points.toFixed(2), sub: 'HADY starter' },
        {
          label: lastName(hady.loserStartingQb.name).toUpperCase(),
          value: hady.loserPoints.toFixed(2),
          sub: 'FRANKIE total',
        },
      ],
      body: [`Margin: ${(hady.winnerPoints - hady.loserPoints).toFixed(2)} points.`],
      footnote: 'SLEEPER WEEK 5 MATCHUP 4',
    },
    {
      id: 'w5-slide-15',
      layout: 'stat',
      kicker: 'WEEK 5 AWARDS',
      title: 'HIGH / LOW',
      titleGold: 'MARKS',
      statBoxes: [
        { label: 'HIGH', value: hady.winnerPoints.toFixed(2), sub: 'HADY' },
        { label: 'LOW', value: narking.loserPoints.toFixed(2), sub: 'NARKING' },
      ],
      body: [
        `Upset: ${steven.winner} over ${steven.loser}.`,
        `Runner-up score: Mauricio ${m5.winnerPoints.toFixed(2)}.`,
      ],
    },
    {
      id: 'w5-slide-16',
      layout: 'cover',
      title: 'WEEK 6',
      titleGold: 'WE RUN IT BACK',
      body: w6Lines,
      footnote: 'ENTERING RECORDS FROM SLEEPER',
    },
  ]

  const reportFacts = {
    closestMargin: closest.margin,
    blowoutMargin: blowout.margin,
    highScore: hady.winnerPoints,
    lowScore: narking.loserPoints,
    topBench: benchLeaders[0].pts,
    topScorer: leagueTop[0].pts,
  }

  writeFileSync(path.join(__dirname, 'report-data.json'), JSON.stringify({ week, ordered, reportFacts }, null, 2))
  console.log('wrote report-data.json')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
