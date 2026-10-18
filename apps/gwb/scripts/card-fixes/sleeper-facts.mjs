/**
 * Sleeper-derived jersey facts for GWB card fixes (league 1389375326257184768).
 * Run: node scripts/card-fixes/sleeper-facts.mjs
 * Writes sleeper-facts.json and validates hard assertions from commissioner brief.
 */
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LEAGUE_ID = '1389375326257184768'
const API = 'https://api.sleeper.app/v1'
const OUT = path.join(__dirname, 'sleeper-facts.json')

/** roster_id → display short name used on cards */
const ROSTER_SHORT = {
  1: 'Danny',
  2: 'Mauricio',
  3: 'Narking',
  4: 'Kayser',
  5: 'Eric',
  6: 'Hady',
  7: 'Steven',
  8: 'Crooke',
  9: 'Manny',
  10: 'Jamil',
  11: 'Frankie',
  12: 'Matt',
}

const CROOKE_LAMAR = { playerId: '4881', name: 'Lamar Jackson', number: 8, team: 'BAL' }

/** Result card order per week (left winner roster id, right loser) — matches weekGraphics titles */
/** [winnerRosterId, loserRosterId] per results-wN-m1..m6 (matches weekGraphics.ts) */
const RESULT_PAIRINGS = {
  1: [[2, 8], [4, 6], [12, 3], [10, 1], [7, 11], [9, 5]],
  2: [[6, 8], [3, 2], [4, 1], [7, 12], [9, 10], [5, 11]],
  3: [[8, 3], [6, 1], [7, 2], [4, 9], [5, 12], [10, 11]],
}

const W4_PREVIEW_PAIRINGS = [
  [3, 7],
  [4, 11],
  [6, 9],
  [10, 12],
  [2, 5],
  [1, 8],
]

const W5_PREVIEW_PAIRINGS = [
  [7, 8],
  [1, 9],
  [3, 5],
  [6, 11],
  [2, 10],
  [4, 12],
]

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} ${res.status}`)
  return res.json()
}

function playerJersey(players, id) {
  const p = players[id]
  if (!p) throw new Error(`missing player ${id}`)
  const team = p.team ?? p.team_abbr ?? ''
  const num = Number(p.number)
  if (!team || Number.isNaN(num)) {
    throw new Error(`bad player record ${id}: team=${team} number=${p.number}`)
  }
  return {
    playerId: id,
    name: p.full_name ?? `${p.first_name} ${p.last_name}`,
    number: num,
    team: team.toUpperCase(),
  }
}

function startingQb(starters, players) {
  const qbId = starters.find((id) => players[id]?.position === 'QB')
  if (!qbId) throw new Error('no QB in starters')
  return playerJersey(players, qbId)
}

function topScorerAmongStarters(starters, playersPoints, players) {
  let best = null
  let bestPts = -1
  for (const id of starters) {
    const pts = playersPoints[id] ?? 0
    if (pts > bestPts) {
      bestPts = pts
      best = id
    }
  }
  if (!best) throw new Error('no top scorer')
  return { ...playerJersey(players, best), points: bestPts }
}

const CROOKE_ROSTER_ID = 8

function jerseyForManager(rosterId, role, week, matchupRow, players) {
  const { starters, players_points: pp } = matchupRow
  if (rosterId === CROOKE_ROSTER_ID) return CROOKE_LAMAR
  if (role === 'preview') {
    return startingQb(starters, players)
  }
  if (role === 'winner') {
    return topScorerAmongStarters(starters, pp, players)
  }
  if (role === 'loser') {
    return startingQb(starters, players)
  }
  throw new Error(`unknown role ${role}`)
}

function buildResultFacts(week, players, matchupsByRoster) {
  const pairings = RESULT_PAIRINGS[week]
  return pairings.map(([wRid, lRid], i) => {
    const m = i + 1
    const wRow = matchupsByRoster.get(wRid)
    const lRow = matchupsByRoster.get(lRid)
    const id = `results-w${week}-m${m}`
    return {
      id,
      week,
      matchup: `W${week}M${m}`,
      winner: { rosterId: wRid, name: ROSTER_SHORT[wRid] },
      loser: { rosterId: lRid, name: ROSTER_SHORT[lRid] },
      winnerJersey: jerseyForManager(wRid, 'winner', week, wRow, players),
      loserJersey: jerseyForManager(lRid, 'loser', week, lRow, players),
      scores: {
        winner: Math.round(wRow.points * 10) / 10,
        loser: Math.round(lRow.points * 10) / 10,
      },
    }
  })
}

function buildPreviewFacts(week, pairings, players, matchupsByRoster, idPrefix) {
  return pairings.map(([lRid, rRid], i) => {
    const m = i + 1
    const id = `${idPrefix}-m${m}`
    const lRow = matchupsByRoster.get(lRid)
    const rRow = matchupsByRoster.get(rRid)
    return {
      id,
      week,
      left: {
        rosterId: lRid,
        name: ROSTER_SHORT[lRid],
        jersey: jerseyForManager(lRid, 'preview', week, lRow, players),
      },
      right: {
        rosterId: rRid,
        name: ROSTER_SHORT[rRid],
        jersey: jerseyForManager(rRid, 'preview', week, rRow, players),
      },
    }
  })
}

/** Commissioner brief spot-checks — stop if Sleeper disagrees */
const ASSERTIONS = [
  {
    card: 'vs-w5-m2-right',
    check: (f) => {
      const m = f.previews.w5.find((x) => x.id === 'vs-w5-m2')
      const j = m.right.jersey
      return j.name === 'Kirk Cousins' && j.number === 8 && j.team === 'LV'
    },
  },
  {
    card: 'vs-w5-m4-left',
    check: (f) => {
      const m = f.previews.w5.find((x) => x.id === 'vs-w5-m4')
      const j = m.left.jersey
      return j.name === 'Drake Maye' && j.number === 10 && j.team === 'NE'
    },
  },
  {
    card: 'results-w1-m3-loser',
    check: (f) => {
      const m = f.results.w1.find((x) => x.id === 'results-w1-m3')
      const j = m.loserJersey
      return j.name === 'Tyler Shough' && j.number === 6 && j.team === 'NO'
    },
  },
]

async function main() {
  const [users, rosters, players] = await Promise.all([
    fetchJson(`${API}/league/${LEAGUE_ID}/users`),
    fetchJson(`${API}/league/${LEAGUE_ID}/rosters`),
    fetchJson(`${API}/players/nfl`),
  ])

  const ownerToRoster = new Map()
  for (const r of rosters) {
    if (r.owner_id) ownerToRoster.set(r.owner_id, r.roster_id)
  }

  const facts = {
    leagueId: LEAGUE_ID,
    generatedAt: new Date().toISOString(),
    rosters: Object.entries(ROSTER_SHORT).map(([rid, name]) => ({
      rosterId: Number(rid),
      name,
      ownerId: rosters.find((r) => r.roster_id === Number(rid))?.owner_id,
    })),
    results: {},
    previews: {},
    margins: {},
  }

  for (const week of [1, 2, 3, 4, 5]) {
    const matchups = await fetchJson(`${API}/league/${LEAGUE_ID}/matchups/${week}`)
    const byRoster = new Map(matchups.map((m) => [m.roster_id, m]))
    if (week <= 3) {
      facts.results[`w${week}`] = buildResultFacts(week, players, byRoster)
    }
    if (week === 4) {
      facts.previews.w4 = buildPreviewFacts(
        4,
        W4_PREVIEW_PAIRINGS,
        players,
        byRoster,
        'vs-m',
      )
      // w4 uses vs-m1..6 naming in optimize script
      facts.previews.w4 = facts.previews.w4.map((row, i) => ({
        ...row,
        id: [
          'vs-m1-narking-steven',
          'vs-m2-kayser-frankie',
          'vs-m3-hadi-manny',
          'vs-m4-jamil-matt',
          'vs-m5-mauricio-eric',
          'vs-m6-danny-crooke',
        ][i],
      }))
    }
    if (week === 5) {
      facts.previews.w5 = buildPreviewFacts(
        5,
        W5_PREVIEW_PAIRINGS,
        players,
        byRoster,
        'vs-w5',
      )
    }
    if (week === 4) {
      const scored = matchups.filter((m) => m.points > 0)
      const pairs = []
      const byMid = new Map()
      for (const m of scored) {
        if (!byMid.has(m.matchup_id)) byMid.set(m.matchup_id, [])
        byMid.get(m.matchup_id).push(m)
      }
      for (const [, pair] of byMid) {
        if (pair.length !== 2) continue
        const [a, b] = pair.sort((x, y) => y.points - x.points)
        pairs.push({
          winner: ROSTER_SHORT[a.roster_id],
          loser: ROSTER_SHORT[b.roster_id],
          margin: Math.round((a.points - b.points) * 100) / 100,
          winnerPts: a.points,
          loserPts: b.points,
        })
      }
      pairs.sort((x, y) => x.margin - y.margin)
      facts.margins.w4 = pairs
    }
  }

  for (const a of ASSERTIONS) {
    if (!a.check(facts)) {
      console.error('ASSERTION FAILED:', a.card)
      process.exit(1)
    }
  }

  await mkdir(__dirname, { recursive: true })
  await writeFile(OUT, JSON.stringify(facts, null, 2) + '\n')
  console.log('Wrote', OUT)
  console.log('Week 4 closest margin:', facts.margins.w4?.[0])
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
