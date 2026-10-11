import archiveJson from '../content/gwb-archive.json'
import type { LeagueSeasonSummary, ManagerSeasonFinish } from './managerSeasons'

export type ArchiveMemberKey = keyof typeof archiveJson.members

export interface ArchiveChampionRow {
  season: string
  champion: ArchiveMemberKey | string
  championRecord: string | null
  championSeed: string | null
  runnerUp: ArchiveMemberKey | string
  runnerUpRecord: string | null
  runnerUpSeed: string | null
  finalScore: string | null
  scoreConflictNote?: string
}

export interface ArchiveMember {
  displayName: string
  wallDisplayName?: string
  archiveName?: string
  sleeperDisplayName?: string
  userId: string | null
  joined: number | null
  currentMember: boolean
  formerMember?: boolean
  titleYears: number[]
  playoffYears: number[]
  finalsWins: number
  finalsLosses: number
  allTimeRecord: { wins: number; losses: number } | null
}

const archive = archiveJson as {
  champions: ArchiveChampionRow[]
  members: Record<string, ArchiveMember>
}

export const GWB_CHAMPIONS: ArchiveChampionRow[] = archive.champions
export const GWB_ARCHIVE_MEMBERS = archive.members

const KEY_BY_USER_ID = new Map<string, ArchiveMemberKey>()
for (const [key, m] of Object.entries(archive.members)) {
  if (m.userId) KEY_BY_USER_ID.set(m.userId, key as ArchiveMemberKey)
}

export function archiveMemberKeyForUserId(userId: string): ArchiveMemberKey | null {
  return KEY_BY_USER_ID.get(userId) ?? null
}

export function archiveMemberForUserId(userId: string): ArchiveMember | null {
  const key = archiveMemberKeyForUserId(userId)
  if (!key) return null
  return archive.members[key] ?? null
}

export function wallDisplayName(key: string): string {
  const m = archive.members[key]
  if (!m) return key
  return m.wallDisplayName ?? m.displayName
}

export function isFormerMemberKey(key: string): boolean {
  const m = archive.members[key]
  return Boolean(m?.formerMember) || (m != null && !m.currentMember && m.userId == null)
}

function parseRecord(rec: string | null): { wins: number; losses: number } | null {
  if (!rec) return null
  const m = rec.match(/^(\d+)-(\d+)$/)
  if (!m) return null
  return { wins: Number(m[1]), losses: Number(m[2]) }
}

function seedToRank(seed: string | null): number | null {
  if (!seed) return null
  const m = seed.match(/^(\d+)/)
  return m ? Number(m[1]) : null
}

function playoffResultForYear(
  memberKey: ArchiveMemberKey,
  year: number,
): string {
  const row = archive.champions.find((c) => c.season === String(year))
  if (row?.champion === memberKey) return 'Champion'
  if (row?.runnerUp === memberKey) return 'Runner-up'
  const member = archive.members[memberKey]
  if (member?.playoffYears.includes(year)) return 'Playoffs'
  return 'Missed playoffs'
}

export interface ArchiveManagerSeasonRow {
  season: string
  source: 'archive'
  wins: number | null
  losses: number | null
  ties: number
  regularSeasonRank: number | null
  playoffResult: string
  leagueName: string
  championDisplayName: string
  runnerUpDisplayName: string | null
  finalScore: string | null
}

function championDisplayForKey(key: string): string {
  return wallDisplayName(key)
}

export function archiveSeasonRowsForMember(
  memberKey: ArchiveMemberKey,
): ArchiveManagerSeasonRow[] {
  const member = archive.members[memberKey]
  if (!member) return []

  const rows: ArchiveManagerSeasonRow[] = []
  for (let year = 2012; year <= 2018; year++) {
    const season = String(year)
    const champRow = archive.champions.find((c) => c.season === season)
    let wins: number | null = null
    let losses: number | null = null
    let rank: number | null = null

    if (champRow?.champion === memberKey) {
      const rec = parseRecord(champRow.championRecord)
      if (rec) {
        wins = rec.wins
        losses = rec.losses
      }
      rank = seedToRank(champRow.championSeed)
    } else if (champRow?.runnerUp === memberKey) {
      const rec = parseRecord(champRow.runnerUpRecord)
      if (rec) {
        wins = rec.wins
        losses = rec.losses
      }
      rank = seedToRank(champRow.runnerUpSeed)
    }

    const playoffResult = playoffResultForYear(memberKey, year)
    rows.push({
      season,
      source: 'archive',
      wins,
      losses,
      ties: 0,
      regularSeasonRank: rank,
      playoffResult,
      leagueName: 'GWB (archive)',
      championDisplayName: champRow
        ? championDisplayForKey(champRow.champion)
        : 'unknown',
      runnerUpDisplayName: champRow?.runnerUp
        ? championDisplayForKey(champRow.runnerUp)
        : null,
      finalScore: champRow?.finalScore ?? null,
    })
  }
  rows.sort((a, b) => Number(b.season) - Number(a.season))
  return rows
}

export interface TitlesLeaderboardEntry {
  key: string
  displayName: string
  titles: number
  titleYears: number[]
  formerMember: boolean
}

export function titlesLeaderboard(): TitlesLeaderboardEntry[] {
  const entries: TitlesLeaderboardEntry[] = []
  for (const [key, m] of Object.entries(archive.members)) {
    const years = m.titleYears ?? []
    if (!years.length && key === 'juan') continue
    if (!years.length && !m.currentMember && !m.formerMember) continue
    if (!years.length) continue
    entries.push({
      key,
      displayName: wallDisplayName(key),
      titles: years.length,
      titleYears: [...years].sort((a, b) => a - b),
      formerMember: isFormerMemberKey(key),
    })
  }
  entries.sort((a, b) => b.titles - a.titles || a.displayName.localeCompare(b.displayName))
  return entries
}

export function titleCountForUserId(userId: string): number {
  const key = archiveMemberKeyForUserId(userId)
  if (!key) return 0
  return archive.members[key]?.titleYears.length ?? 0
}

export function finalsAppearancesForUserId(userId: string): number {
  const key = archiveMemberKeyForUserId(userId)
  if (!key) return 0
  let count = 0
  for (const c of archive.champions) {
    if (c.champion === key || c.runnerUp === key) count++
  }
  return count
}

export function playoffTripCountForUserId(
  userId: string,
  sleeperFinished: ManagerSeasonFinish[],
): number {
  const key = archiveMemberKeyForUserId(userId)
  if (!key) return 0
  const member = archive.members[key]
  const years = new Set<number>(member?.playoffYears ?? [])

  for (const s of sleeperFinished) {
    const y = Number(s.season)
    if (y >= 2019 && s.playoffResult && s.playoffResult !== 'Missed playoffs') {
      years.add(y)
    } else if (y >= 2019 && s.playoffResult === 'Missed playoffs') {
      years.delete(y)
    }
  }

  return years.size
}

export function bestFinishForUserId(
  _userId: string,
  sleeperFinished: ManagerSeasonFinish[],
  archiveRows: ArchiveManagerSeasonRow[],
): string {
  const FINISH_RANK: Record<string, number> = {
    Champion: 1,
    'Runner-up': 2,
    '3rd place': 3,
    '4th place': 4,
    '5th place': 5,
    '6th place': 6,
    Playoffs: 7,
    'Semifinal exit': 7,
    'Quarterfinal exit': 8,
    'Playoff exit': 9,
    'Missed playoffs': 10,
  }
  let bestRank = 99
  let best = '—'

  const consider = (result: string) => {
    if (!result) return
    const r = FINISH_RANK[result] ?? 99
    if (r < bestRank) {
      bestRank = r
      best = result
    }
  }

  for (const s of archiveRows) consider(s.playoffResult)
  for (const s of sleeperFinished) consider(s.playoffResult)

  return best
}

export function mergedDisplaySeasons(
  userId: string,
  sleeperFinished: ManagerSeasonFinish[],
): Array<
  | { kind: 'sleeper'; row: ManagerSeasonFinish }
  | { kind: 'archive'; row: ArchiveManagerSeasonRow }
> {
  const key = archiveMemberKeyForUserId(userId)
  const archiveRows = key ? archiveSeasonRowsForMember(key) : []

  const merged: Array<
    | { kind: 'sleeper'; row: ManagerSeasonFinish }
    | { kind: 'archive'; row: ArchiveManagerSeasonRow }
  > = []

  for (const ar of archiveRows) {
    merged.push({ kind: 'archive', row: ar })
  }
  for (const sr of sleeperFinished) {
    merged.push({ kind: 'sleeper', row: sr })
  }
  merged.sort((a, b) => {
    const sa = a.kind === 'archive' ? a.row.season : a.row.season
    const sb = b.kind === 'archive' ? b.row.season : b.row.season
    return Number(sb) - Number(sa)
  })
  return merged
}

function pre2019RecordEstimate(
  member: ArchiveMember,
  sleeperFinished: ManagerSeasonFinish[],
): { wins: number; losses: number } {
  if (!member.allTimeRecord) return { wins: 0, losses: 0 }
  let wins = member.allTimeRecord.wins
  let losses = member.allTimeRecord.losses
  for (const s of sleeperFinished) {
    const y = Number(s.season)
    if (y >= 2019 && y <= 2024) {
      wins -= s.wins
      losses -= s.losses
    }
  }
  return { wins: Math.max(0, wins), losses: Math.max(0, losses) }
}

export function careerRecordLabel(
  userId: string,
  sleeperFinished: ManagerSeasonFinish[],
  currentStanding: { wins: number; losses: number; ties: number } | null,
): string {
  const member = archiveMemberForUserId(userId)
  let wins = 0
  let losses = 0
  let ties = 0

  if (member?.allTimeRecord) {
    const pre = pre2019RecordEstimate(member, sleeperFinished)
    wins = pre.wins
    losses = pre.losses
    for (const s of sleeperFinished) {
      if (Number(s.season) >= 2019) {
        wins += s.wins
        losses += s.losses
        ties += s.ties
      }
    }
  } else {
    for (const s of sleeperFinished) {
      wins += s.wins
      losses += s.losses
      ties += s.ties
    }
  }

  if (currentStanding) {
    wins += currentStanding.wins
    losses += currentStanding.losses
    ties += currentStanding.ties
  }

  const t = ties ? `-${ties}` : ''
  return `${wins}-${losses}${t}`
}

export function archiveFinishSummaryLine(row: ArchiveManagerSeasonRow): string {
  const parts: string[] = []
  if (row.regularSeasonRank) parts.push(`#${row.regularSeasonRank} reg`)
  if (row.wins != null && row.losses != null) {
    parts.push(`${row.wins}-${row.losses}`)
  }
  parts.push(row.playoffResult)
  if (
    row.finalScore &&
    (row.playoffResult === 'Champion' || row.playoffResult === 'Runner-up')
  ) {
    parts.push(`Final ${row.finalScore}`)
  }
  return parts.join(' · ')
}

/** Champions wall rows 2012–2025; 2019+ champion keys may be overridden by Sleeper when complete. */
export function championsWallRows(
  summaries: LeagueSeasonSummary[],
): ArchiveChampionRow[] {
  return GWB_CHAMPIONS.map((row) => {
    const copy = { ...row }
    const y = Number(copy.season)
    if (y < 2019) return copy
    const summary = summaries.find(
      (s) => s.season === copy.season && s.status === 'complete',
    )
    if (!summary?.championUserId) return copy
    const key = archiveMemberKeyForUserId(summary.championUserId)
    if (key) copy.champion = key
    return copy
  })
}

export const ARCHIVE_CONFLICTS: string[] = [
  '2023 final score: archive STATS 136.72–135.71 vs WhatsApp-corrected 137.72–136.71 (Eric still champion)',
  'Eric WhatsApp "2010 champ" vs archive 2013 — kept 2013',
  'Moe title year: chat 2013 vs archive 2014 — kept 2014',
]

export const ARCHIVE_MAPPING_FAILS: string[] = [
  'Juan (2012 runner-up): not mapped to a Sleeper user_id',
  'Marcos: departed member, no current Sleeper user_id on roster',
]
