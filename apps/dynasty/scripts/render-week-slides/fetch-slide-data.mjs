/**
 * Pull weeks 1–4 (and refresh 5–6) result/matchup rows from Sleeper.
 * Pairs by matchup_id; asserts roster → owner_id; writes slide-data.json + UI manifest.
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LEAGUE = '1312077668782473216'
const API = 'https://api.sleeper.app/v1'
const DATA_PATH = path.join(__dirname, 'slide-data.json')
const MANIFEST_PATH = path.join(
  __dirname,
  '../../src/data/week-result-slides.json',
)

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`)
  return res.json()
}

function teamName(user) {
  return (user?.metadata?.team_name ?? user?.display_name ?? '').trim()
}

function round2(n) {
  return Math.round(n * 100) / 100
}

function buildTeams(users, rosters) {
  const byUser = new Map(users.map((u) => [u.user_id, u]))
  const teams = new Map()
  const ownerByRoster = new Map()

  for (const r of rosters) {
    if (!r.owner_id) {
      throw new Error(`Roster ${r.roster_id} missing owner_id`)
    }
    const u = byUser.get(r.owner_id)
    if (!u) {
      throw new Error(
        `Roster ${r.roster_id} owner_id ${r.owner_id} not in league users`,
      )
    }
    ownerByRoster.set(r.roster_id, r.owner_id)
    teams.set(r.roster_id, {
      rosterId: r.roster_id,
      userId: r.owner_id,
      teamName: teamName(u),
      displayName: (u.display_name ?? '').trim(),
    })
  }
  return { teams, ownerByRoster, byUser }
}

function pairMatchups(matchups, week) {
  if (matchups.length !== 12) {
    throw new Error(`Week ${week}: expected 12 matchup rows, got ${matchups.length}`)
  }
  const byId = new Map()
  for (const m of matchups) {
    if (!ownerByRosterRef.has(m.roster_id)) {
      throw new Error(`Week ${week}: unknown roster_id ${m.roster_id}`)
    }
    const list = byId.get(m.matchup_id) ?? []
    list.push(m)
    byId.set(m.matchup_id, list)
  }
  if (byId.size !== 6) {
    throw new Error(`Week ${week}: expected 6 matchup_id groups, got ${byId.size}`)
  }
  const pairs = []
  for (const [matchupId, list] of byId) {
    if (list.length !== 2) {
      throw new Error(
        `Week ${week} matchup_id ${matchupId}: expected 2 rosters, got ${list.length}`,
      )
    }
    const sorted = [...list].sort((a, b) => a.roster_id - b.roster_id)
    pairs.push({ matchupId, home: sorted[0], away: sorted[1] })
  }
  pairs.sort((a, b) => a.matchupId - b.matchupId)
  return pairs
}

/** Set during buildTeams for pairMatchups asserts */
let ownerByRosterRef = new Map()

function resultsFromPairs(pairs, week, nameForRoster) {
  return pairs.map((p, i) => {
    const match = i + 1
    const homePts = round2(p.home.points)
    const awayPts = round2(p.away.points)
    let winnerRoster
    if (p.home.points > p.away.points) winnerRoster = p.home.roster_id
    else if (p.away.points > p.home.points) winnerRoster = p.away.roster_id
    else throw new Error(`Week ${week} M${match}: tie ${homePts}-${awayPts} not supported`)

    return {
      id: `results-w${week}-m${match}`,
      match,
      matchupId: p.matchupId,
      homeRoster: p.home.roster_id,
      awayRoster: p.away.roster_id,
      homeOwner: ownerByRosterRef.get(p.home.roster_id),
      awayOwner: ownerByRosterRef.get(p.away.roster_id),
      homeName: nameForRoster(p.home.roster_id),
      awayName: nameForRoster(p.away.roster_id),
      homePts,
      awayPts,
      winnerRoster,
    }
  })
}

function standingsRecordMap(teams, matchupsByWeek, throughWeek) {
  const stats = new Map()
  for (const rosterId of teams.keys()) {
    stats.set(rosterId, { wins: 0, losses: 0, ties: 0 })
  }
  for (let week = 1; week <= throughWeek; week++) {
    const matchups = matchupsByWeek.get(week) ?? []
    const byMatch = new Map()
    for (const m of matchups) {
      const list = byMatch.get(m.matchup_id) ?? []
      list.push(m)
      byMatch.set(m.matchup_id, list)
    }
    for (const pair of byMatch.values()) {
      if (pair.length !== 2) continue
      const [a, b] = pair
      const sa = stats.get(a.roster_id)
      const sb = stats.get(b.roster_id)
      if (!sa || !sb) continue
      if (a.points > b.points) {
        sa.wins++
        sb.losses++
      } else if (b.points > a.points) {
        sb.wins++
        sa.losses++
      } else {
        sa.ties++
        sb.ties++
      }
    }
  }
  const out = {}
  for (const [rosterId, s] of stats) {
    out[String(rosterId)] = s.ties ? [s.wins, s.losses, s.ties] : [s.wins, s.losses, 0]
  }
  return out
}

function slideTitle(row) {
  return `${row.homeName} ${row.homePts.toFixed(2)} - ${row.awayName} ${row.awayPts.toFixed(2)}`
}

function matchupsWeek6FromSleeper(pairs, nameForRoster) {
  return pairs.map((p, i) => ({
    id: `vs-w6-m${i + 1}`,
    match: i + 1,
    matchupId: p.matchupId,
    homeRoster: p.home.roster_id,
    awayRoster: p.away.roster_id,
    homeName: nameForRoster(p.home.roster_id),
    awayName: nameForRoster(p.away.roster_id),
  }))
}

async function main() {
  const [users, rosters] = await Promise.all([
    fetchJson(`${API}/league/${LEAGUE}/users`),
    fetchJson(`${API}/league/${LEAGUE}/rosters`),
  ])

  const { teams, ownerByRoster } = buildTeams(users, rosters)
  ownerByRosterRef = ownerByRoster

  const nameForRoster = (rid) => {
    const t = teams.get(rid)
    if (!t?.teamName) throw new Error(`Missing team name for roster ${rid}`)
    return t.teamName
  }

  const matchupsByWeek = new Map()
  for (let week = 1; week <= 6; week++) {
    const raw = await fetchJson(`${API}/league/${LEAGUE}/matchups/${week}`)
    matchupsByWeek.set(week, raw)
  }

  const existing = JSON.parse(await readFile(DATA_PATH, 'utf8').catch(() => '{}'))

  const data = {
    source: `Sleeper league ${LEAGUE} matchups weeks 1–6 fetched ${new Date().toISOString().slice(0, 10)}`,
    leagueId: LEAGUE,
  }

  for (let week = 1; week <= 5; week++) {
    const pairs = pairMatchups(matchupsByWeek.get(week), week)
    data[`standingsAfterWeek${week}`] = standingsRecordMap(
      teams,
      matchupsByWeek,
      week,
    )
    data[`resultsWeek${week}`] = resultsFromPairs(pairs, week, nameForRoster)
  }

  const w6Pairs = pairMatchups(matchupsByWeek.get(6), 6)
  data.matchupsWeek6 = matchupsWeek6FromSleeper(w6Pairs, nameForRoster)

  // Preserve any extra keys from manual edits
  const merged = { ...existing, ...data }
  await writeFile(DATA_PATH, `${JSON.stringify(merged, null, 2)}\n`)

  const manifest = {}
  for (let week = 1; week <= 5; week++) {
    manifest[String(week)] = merged[`resultsWeek${week}`].map((row) => ({
      id: row.id,
      title: slideTitle(row),
    }))
  }
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`)

  console.log('wrote', DATA_PATH)
  console.log('wrote', MANIFEST_PATH)
  for (let week = 1; week <= 4; week++) {
    console.log(`week ${week} results:`, manifest[String(week)].length)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
