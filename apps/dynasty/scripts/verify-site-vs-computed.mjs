/**
 * Compare local Dynasty build text to computed_505e.json (standings, W5 scores, FAAB, adds).
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const COMPUTED = JSON.parse(
  await readFile(
    '/home/ubuntu/.cursor/projects/workspace/uploads/computed_505e.json',
    'utf8',
  ),
)

const LEAGUE = '1312077668782473216'
const BASE = process.env.DYNASTY_URL ?? 'http://127.0.0.1:4173/dynasty-1581d86a/'

async function sleeperTeamNames() {
  const users = await fetch(
    `https://api.sleeper.app/v1/league/${LEAGUE}/users`,
  ).then((r) => r.json())
  const rosters = await fetch(
    `https://api.sleeper.app/v1/league/${LEAGUE}/rosters`,
  ).then((r) => r.json())
  const byUser = new Map(users.map((u) => [u.user_id, u]))
  const names = new Map()
  for (const r of rosters) {
    const u = byUser.get(r.owner_id)
    const name = (u?.metadata?.team_name ?? u?.display_name ?? '').trim()
    names.set(r.roster_id, name)
  }
  return names
}

async function main() {
  const teamByRoster = await sleeperTeamNames()
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(`${BASE}?week=5&tab=standings`, {
    waitUntil: 'domcontentloaded',
    timeout: 120000,
  })
  await page.waitForTimeout(8000)
  const bodyText = await page.locator('body').innerText()

  const report = { url: BASE, mismatches: [], notes: [] }

  for (const [team, [w, l, t, pf]] of Object.entries(COMPUTED.standings)) {
    const key = team.trim()
    const record = t ? `${w}-${l}-${t}` : `${w}-${l}`
    if (!bodyText.includes(key)) {
      report.mismatches.push({ kind: 'standings-team-missing', team: key })
      continue
    }
    const pfStr = pf.toFixed(2)
    if (!bodyText.includes(pfStr) && !bodyText.includes(pf.toFixed(1))) {
      report.mismatches.push({
        kind: 'standings-pf',
        team: key,
        expectedPf: pfStr,
      })
    }
  }

  for (const row of COMPUTED.w5) {
    const [, home, hp, away, ap] = row
    const hpStr = hp.toFixed(2)
    const apStr = ap.toFixed(2)
    if (!bodyText.includes(hpStr) || !bodyText.includes(apStr)) {
      report.mismatches.push({
        kind: 'week5-score',
        match: row[0],
        home: home.trim(),
        away: away.trim(),
        hp: hpStr,
        ap: apStr,
      })
    }
  }

  for (const [team, faab] of Object.entries(COMPUTED.faab)) {
    const key = team.trim()
    if (!bodyText.includes(String(faab))) {
      report.notes.push({ kind: 'faab-check-weak', team: key, faab })
    }
  }

  await page.goto(`${BASE}?week=5&tab=waiver`, {
    waitUntil: 'domcontentloaded',
    timeout: 120000,
  })
  await page.waitForTimeout(8000)
  const waiverText = await page.locator('body').innerText()
  const rubuildingAdds = COMPUTED.adds.Rubuilding ?? COMPUTED.adds['Rubuilding']
  report.waiverPageSnippet = waiverText.slice(0, 2500)
  report.rubuildingAddsFromComputed = rubuildingAdds
  report.rubuildingOnPage = waiverText.includes('Rubuilding')
  report.pickup63OnPage = waiverText.includes('63')

  await page.goto(`${BASE}?week=5&tab=gallery`, {
    waitUntil: 'domcontentloaded',
  })
  await page.waitForTimeout(3000)
  const galleryText = await page.locator('body').innerText()
  report.graphicsHasResults = galleryText.includes('Results')
  report.graphicsHasMatchups = galleryText.includes('Matchups')
  report.graphicsHasW5Title = galleryText.includes('121.78') || galleryText.includes('172.38')

  await browser.close()
  console.log(JSON.stringify(report, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
