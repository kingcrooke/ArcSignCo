import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { MANAGER_BY_USER_ID } from '../lib/gwb-managers.mjs'
import { loadWeekMatchupFacts } from '../lib/sleeper-week-facts.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function nameForRoster(rosters, rid) {
  const r = rosters.find((x) => x.roster_id === rid)
  return MANAGER_BY_USER_ID[r.owner_id]
}

function rosterPf(settings) {
  return settings.fpts + settings.fpts_decimal / 100
}

async function main() {
  const week = 5
  const { results, rosters, matchups } = await loadWeekMatchupFacts(week)

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

  const byId = (id) => results.find((r) => r.id === id)
  const steven = byId('results-w5-m1')
  const hady = byId('results-w5-m4')
  const narking = byId('results-w5-m3')

  const margins = results
    .map((r) => ({ label: `${r.winner} over ${r.loser}`, margin: r.winnerPoints - r.loserPoints }))
    .sort((a, b) => a.margin - b.margin)
  const closest = margins[0]

  const ordered = [
    {
      id: 'w5-slide-01',
      title: "Steven's Perfect Season Is Over",
      body: [
        'Week 5 is OFFICIALLY over.',
        'Sleeper scores reviewed. Monday night reviewed.',
        'Mulligans audited. The 4-0 shield has cracked.',
        '',
        'THERE IS STILL NO MERCY FOR THE AI.',
      ],
    },
    {
      id: 'w5-slide-02',
      title: `${steven.winner} ${steven.winnerPoints.toFixed(2)} def ${steven.loser}`,
      subtitle: `DEF. ${steven.loser.toUpperCase()} ${steven.loserPoints.toFixed(2)}`,
      body: [
        `Steven drops to ${steven.loserRecord} — first loss of the season.`,
        `Margin: ${(steven.winnerPoints - steven.loserPoints).toFixed(2)}.`,
      ],
      hero: steven.id,
    },
    {
      id: 'w5-slide-03',
      title: `Hady ${hady.winnerPoints.toFixed(2)} def ${hady.loser}`,
      subtitle: `Week 5 high score`,
      body: [
        `Frankie held to ${hady.loserPoints.toFixed(2)}.`,
        `Margin: ${(hady.winnerPoints - hady.loserPoints).toFixed(2)}.`,
        `Hady climbs to ${hady.winnerRecord}.`,
      ],
      hero: hady.id,
    },
    {
      id: 'w5-slide-04',
      title: `${byId('results-w5-m2').winner} ${byId('results-w5-m2').winnerPoints.toFixed(2)} def ${byId('results-w5-m2').loser}`,
      body: [`Danny moves to ${byId('results-w5-m2').winnerRecord}.`, `Manny falls to ${byId('results-w5-m2').loserRecord}.`],
      hero: 'results-w5-m2',
    },
    {
      id: 'w5-slide-05',
      title: `${byId('results-w5-m5').winner} ${byId('results-w5-m5').winnerPoints.toFixed(2)} def ${byId('results-w5-m5').loser}`,
      body: [`Mauricio to ${byId('results-w5-m5').winnerRecord}.`, `Jamil to ${byId('results-w5-m5').loserRecord}.`],
      hero: 'results-w5-m5',
    },
    {
      id: 'w5-slide-06',
      title: `${byId('results-w5-m6').winner} ${byId('results-w5-m6').winnerPoints.toFixed(2)} def ${byId('results-w5-m6').loser}`,
      body: [`Matt to ${byId('results-w5-m6').winnerRecord}.`, `Kayser to ${byId('results-w5-m6').loserRecord}.`],
      hero: 'results-w5-m6',
    },
    {
      id: 'w5-slide-07',
      title: `${byId('results-w5-m3').winner} ${byId('results-w5-m3').winnerPoints.toFixed(2)} def ${byId('results-w5-m3').loser}`,
      body: [`Eric to ${byId('results-w5-m3').winnerRecord}.`, `Narking to ${byId('results-w5-m3').loserRecord}.`],
      hero: 'results-w5-m3',
    },
    {
      id: 'w5-slide-08',
      title: 'Stat of the Week',
      body: [
        `Closest game: ${closest.label}`,
        `Margin: ${closest.margin.toFixed(2)} points.`,
        `Lowest score: Narking ${narking.loserPoints.toFixed(2)}.`,
      ],
    },
    {
      id: 'w5-slide-09',
      title: 'Frankie Zone Check-In',
      body: ['Frankie falls to 1-4 after 101.06 points.', 'The zone signage remains highly dramatic.'],
    },
    {
      id: 'w5-slide-10',
      title: 'But One Very Nice Website',
      body: ['gwb-fe006a16 receipts still export cleanly.', 'Graphics tab updated for Week 5 finals.'],
    },
    {
      id: 'w5-slide-11',
      title: 'Final Week 5 Scoring',
      table: scores.map((s, i) => ({ rank: i + 1, name: s.name, pts: s.pts.toFixed(2) })),
    },
    {
      id: 'w5-slide-12',
      title: `Closest: ${closest.margin.toFixed(2)} Points`,
      body: [closest.label, 'Every margin on this deck is from Sleeper Week 5 finals.'],
    },
    {
      id: 'w5-slide-13',
      title: 'Standings After Week 5',
      table: standings.map((s, i) => ({
        rank: i + 1,
        name: s.name,
        pf: `${s.w}-${s.l} · ${s.pf.toFixed(2)} PF`,
      })),
    },
    {
      id: 'w5-slide-14',
      title: 'AI Hady Audit',
      body: ['Crystal-ball picks vs Week 5 finals.', 'Spelling locked: Hady — never Hadi.'],
    },
    {
      id: 'w5-slide-15',
      title: 'Week 5 Awards',
      body: [
        `High score: Hady ${hady.winnerPoints.toFixed(2)}`,
        `Low score: Narking ${narking.loserPoints.toFixed(2)}`,
        `Biggest upset: ${steven.winner} over ${steven.loser}`,
      ],
    },
    {
      id: 'w5-slide-16',
      title: 'Week 6: No Undefeateds',
      body: ['Hady and Steven tied atop the table at 4-1.', 'Week 6 matchup previews are live.'],
    },
  ]

  writeFileSync(path.join(__dirname, 'report-data.json'), JSON.stringify({ week, ordered }, null, 2))
  console.log('wrote report-data.json')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
