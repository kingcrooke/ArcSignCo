import type {
  SleeperMatchup,
  SleeperRoster,
  SleeperTransaction,
  TeamInfo,
} from './types'

/** Championship pool: fewer rostered pickups stays on the board without the badge. */
export const MIN_ROSTERED_PICKUPS = 3
/** A started player-week at or above this line counts as a hit. */
export const HIT_LINE = 10

const COUNTED_TYPES = new Set(['waiver', 'free_agent'])

export interface WaiverAddResult {
  playerId: string
  rosterId: number
  time: number
  leg: number
  type: string
  transactionId: string
  started: number
  bench: number
  startWeeks: number
  hit10: number
  weeks: number[]
}

export interface WaiverMove {
  id: string
  leg: number
  rosterId: number
  type: string
  status: 'complete' | 'failed'
  statusUpdated: number
  adds: string[]
  drops: string[]
  notes: string | null
  /** Started points credited to the add through the scoring window. Null when the move did not add anyone, or the claim failed. */
  startedPoints: number | null
  pending: boolean
}

export interface WeekCallout {
  week: number
  playerId: string
  points: number
  rosterId: number
  /** Set on a worst-drop callout: the roster that started the player. */
  startedByRosterId?: number
}

export interface ManagerWaiverRow {
  rosterId: number
  displayName: string
  teamName: string
  waiverPriority: number | null
  pickupCount: number
  rosteredPickups: number
  pendingPickups: number
  startedPoints: number
  benchPoints: number
  pointsPerPickup: number | null
  hitHits: number
  hitWeeks: number
  hitRate: number | null
  netWaiverPoints: number
  dropRegret: number
  failedClaims: number
  wes: number | null
  eligible: boolean
  poolRank: number | null
  bestPickup: { playerId: string; points: number } | null
  /** Started pickup points in the selected week. Null when that week is not final. */
  weeklyStarted: number | null
  weeklyRegret: number | null
  weeklyNet: number | null
  cumulativeStarted: number[]
}

export interface WaiverBoard {
  scoringThrough: number
  selectedWeek: number
  selectedWeekComplete: boolean
  managers: ManagerWaiverRow[]
  champion: ManagerWaiverRow | null
  cellar: ManagerWaiverRow | null
  pickupOfWeek: WeekCallout | null
  worstDropOfWeek: WeekCallout | null
  moves: WaiverMove[]
  /** Weekly net ranking for a completed selected week. Empty when the week is live. */
  weeklyRanking: ManagerWaiverRow[]
}

interface AddAcc extends WaiverAddResult {
  weeklyStarted: Map<number, number>
  weeklyBench: Map<number, number>
}

interface DropAcc {
  playerId: string
  rosterId: number
  time: number
  leg: number
  transactionId: string
  regretByWeek: Map<number, number>
}

function pointsOf(m: SleeperMatchup, playerId: string): number {
  const raw = m.players_points?.[playerId]
  return typeof raw === 'number' && Number.isFinite(raw) ? raw : 0
}

function rostered(m: SleeperMatchup | undefined, playerId: string): boolean {
  return !!m?.players?.includes(playerId)
}

function started(m: SleeperMatchup, playerId: string): boolean {
  return playerId !== '0' && (m.starters ?? []).includes(playerId)
}

function txRosterId(t: SleeperTransaction): number | null {
  const id = t.roster_ids?.[0]
  return typeof id === 'number' ? id : null
}

/** Latest waiver-batch timestamp for each completed leg. In-progress legs are omitted. */
export function waiverSeasonStory(row: ManagerWaiverRow): string {
  const net = row.netWaiverPoints
  const sign = net >= 0 ? '+' : '−'
  return `${row.rosteredPickups} rostered pickups · net ${sign}${Math.abs(net).toFixed(2)} points`
}

export function weekCloses(
  transactions: SleeperTransaction[],
  scoringThrough: number,
): Map<number, number> {
  const closes = new Map<number, number>()
  for (let leg = 1; leg <= scoringThrough; leg++) {
    let max = -1
    for (const t of transactions) {
      if (t.type !== 'waiver' || t.leg !== leg) continue
      if (typeof t.status_updated === 'number' && t.status_updated > max) {
        max = t.status_updated
      }
    }
    if (max >= 0) closes.set(leg, max)
  }
  return closes
}

function comparePool(a: ManagerWaiverRow, b: ManagerWaiverRow): number {
  const aw = a.wes ?? Number.NEGATIVE_INFINITY
  const bw = b.wes ?? Number.NEGATIVE_INFINITY
  if (bw !== aw) return bw - aw
  if (b.netWaiverPoints !== a.netWaiverPoints) {
    return b.netWaiverPoints - a.netWaiverPoints
  }
  const ah = a.hitRate ?? -1
  const bh = b.hitRate ?? -1
  if (bh !== ah) return bh - ah
  return a.failedClaims - b.failedClaims
}

export function computeWaiverBoard(input: {
  transactions: SleeperTransaction[]
  matchupsByWeek: Map<number, SleeperMatchup[]>
  teams: Map<number, TeamInfo>
  rosters: SleeperRoster[]
  scoringThrough: number
  selectedWeek: number
  selectedWeekComplete: boolean
}): WaiverBoard {
  const {
    transactions,
    matchupsByWeek,
    teams,
    rosters,
    scoringThrough,
    selectedWeek,
    selectedWeekComplete,
  } = input

  const closes = weekCloses(transactions, scoringThrough)
  const horizonClose = closes.get(scoringThrough)

  const matchups = new Map<number, Map<number, SleeperMatchup>>()
  for (let w = 1; w <= scoringThrough; w++) {
    const rows = matchupsByWeek.get(w)
    if (!rows?.length) continue
    matchups.set(w, new Map(rows.map((m) => [m.roster_id, m])))
  }

  const adds: AddAcc[] = []
  const drops: DropAcc[] = []
  const failedByRoster = new Map<number, number>()
  const moves: WaiverMove[] = []

  transactions.forEach((t, index) => {
    if (!COUNTED_TYPES.has(t.type)) return
    const rosterId = txRosterId(t)
    if (rosterId == null) return
    const status = t.status === 'failed' ? 'failed' : t.status === 'complete' ? 'complete' : null
    if (!status) return
    const addIds = Object.keys(t.adds ?? {})
    const dropIds = Object.keys(t.drops ?? {})
    const id = t.transaction_id ?? `${t.leg}-${t.status_updated}-${index}`
    const pending =
      status === 'complete' &&
      addIds.length > 0 &&
      horizonClose != null &&
      t.status_updated >= horizonClose

    if (status === 'failed') {
      failedByRoster.set(rosterId, (failedByRoster.get(rosterId) ?? 0) + 1)
    }

    moves.push({
      id,
      leg: t.leg,
      rosterId,
      type: t.type,
      status,
      statusUpdated: t.status_updated,
      adds: addIds,
      drops: dropIds,
      notes: t.metadata?.notes ?? null,
      startedPoints: null,
      pending,
    })

    if (status !== 'complete') return
    for (const playerId of addIds) {
      adds.push({
        playerId,
        rosterId,
        time: t.status_updated,
        leg: t.leg,
        type: t.type,
        transactionId: id,
        started: 0,
        bench: 0,
        startWeeks: 0,
        hit10: 0,
        weeks: [],
        weeklyStarted: new Map(),
        weeklyBench: new Map(),
      })
    }
    for (const playerId of dropIds) {
      drops.push({
        playerId,
        rosterId,
        time: t.status_updated,
        leg: t.leg,
        transactionId: id,
        regretByWeek: new Map(),
      })
    }
  })

  const addsByKey = new Map<string, AddAcc[]>()
  for (const add of adds) {
    const key = `${add.rosterId}:${add.playerId}`
    const list = addsByKey.get(key)
    if (list) list.push(add)
    else addsByKey.set(key, [add])
  }
  for (const list of addsByKey.values()) {
    list.sort((a, b) => a.time - b.time)
  }

  const weekPickupCandidates: WeekCallout[] = []

  for (const [key, list] of addsByKey) {
    const rosterId = Number(key.split(':')[0])
    const playerId = key.slice(key.indexOf(':') + 1)
    for (const [week, byRoster] of matchups) {
      const close = closes.get(week)
      if (close == null) continue
      const row = byRoster.get(rosterId)
      if (!rostered(row, playerId) || !row) continue
      const cands = list.filter((a) => a.time < close)
      if (!cands.length) continue
      const owner = cands[cands.length - 1]
      const pts = pointsOf(row, playerId)
      owner.weeks.push(week)
      if (started(row, playerId)) {
        owner.started += pts
        owner.startWeeks += 1
        if (pts >= HIT_LINE) owner.hit10 += 1
        owner.weeklyStarted.set(week, (owner.weeklyStarted.get(week) ?? 0) + pts)
        weekPickupCandidates.push({
          week,
          playerId,
          points: pts,
          rosterId,
        })
      } else {
        owner.bench += pts
        owner.weeklyBench.set(week, (owner.weeklyBench.get(week) ?? 0) + pts)
      }
    }
  }

  const weekDropCandidates: WeekCallout[] = []
  for (const drop of drops) {
    for (const [week, byRoster] of matchups) {
      const close = closes.get(week)
      if (close == null || !(drop.time < close)) continue
      const orig = byRoster.get(drop.rosterId)
      if (rostered(orig, drop.playerId)) continue
      for (const [otherId, row] of byRoster) {
        if (otherId === drop.rosterId) continue
        if (!started(row, drop.playerId)) continue
        const pts = pointsOf(row, drop.playerId)
        drop.regretByWeek.set(week, (drop.regretByWeek.get(week) ?? 0) + pts)
        weekDropCandidates.push({
          week,
          playerId: drop.playerId,
          points: pts,
          rosterId: drop.rosterId,
          startedByRosterId: otherId,
        })
      }
    }
  }

  const startedByTx = new Map<string, number>()
  for (const add of adds) {
    startedByTx.set(
      add.transactionId,
      (startedByTx.get(add.transactionId) ?? 0) + add.started,
    )
  }
  for (const move of moves) {
    if (move.status === 'complete' && move.adds.length) {
      move.startedPoints = startedByTx.get(move.id) ?? 0
    }
  }

  const priorityByRoster = new Map<number, number | null>()
  for (const r of rosters) {
    const pos = r.settings.waiver_position
    priorityByRoster.set(r.roster_id, typeof pos === 'number' ? pos : null)
  }

  const rosterIds = new Set<number>([
    ...teams.keys(),
    ...adds.map((a) => a.rosterId),
    ...drops.map((d) => d.rosterId),
  ])

  const rows: ManagerWaiverRow[] = []
  for (const rosterId of rosterIds) {
    const team = teams.get(rosterId)
    const windowAdds =
      horizonClose == null
        ? []
        : adds.filter((a) => a.rosterId === rosterId && a.time < horizonClose)
    const rosteredAdds = windowAdds.filter((a) => a.weeks.length > 0)
    const pendingPickups = adds.filter(
      (a) =>
        a.rosterId === rosterId &&
        horizonClose != null &&
        a.time >= horizonClose,
    ).length
    const startedPoints = windowAdds.reduce((s, a) => s + a.started, 0)
    const benchPoints = windowAdds.reduce((s, a) => s + a.bench, 0)
    const hitHits = windowAdds.reduce((s, a) => s + a.hit10, 0)
    const hitWeeks = windowAdds.reduce((s, a) => s + a.startWeeks, 0)
    const myDrops = drops.filter((d) => d.rosterId === rosterId)
    const dropRegret = myDrops.reduce((s, d) => {
      let n = 0
      for (const pts of d.regretByWeek.values()) n += pts
      return s + n
    }, 0)
    const net = startedPoints - dropRegret
    const wes = rosteredAdds.length ? net / rosteredAdds.length : null
    const best = rosteredAdds.reduce<AddAcc | null>((top, a) => {
      if (!top || a.started > top.started) return a
      return top
    }, null)

    const cumulative: number[] = []
    let run = 0
    for (let w = 1; w <= scoringThrough; w++) {
      for (const a of windowAdds) run += a.weeklyStarted.get(w) ?? 0
      cumulative.push(run)
    }

    let weeklyStarted: number | null = null
    let weeklyRegret: number | null = null
    let weeklyNet: number | null = null
    if (selectedWeekComplete && selectedWeek >= 1 && selectedWeek <= scoringThrough) {
      weeklyStarted = windowAdds.reduce(
        (s, a) => s + (a.weeklyStarted.get(selectedWeek) ?? 0),
        0,
      )
      weeklyRegret = myDrops.reduce(
        (s, d) => s + (d.regretByWeek.get(selectedWeek) ?? 0),
        0,
      )
      weeklyNet = weeklyStarted - weeklyRegret
    }

    rows.push({
      rosterId,
      displayName: team?.displayName ?? `Roster ${rosterId}`,
      teamName: team?.teamName ?? `Roster ${rosterId}`,
      waiverPriority: priorityByRoster.get(rosterId) ?? null,
      pickupCount: windowAdds.length,
      rosteredPickups: rosteredAdds.length,
      pendingPickups,
      startedPoints,
      benchPoints,
      pointsPerPickup: windowAdds.length ? startedPoints / windowAdds.length : null,
      hitHits,
      hitWeeks,
      hitRate: hitWeeks ? hitHits / hitWeeks : null,
      netWaiverPoints: net,
      dropRegret,
      failedClaims: failedByRoster.get(rosterId) ?? 0,
      wes,
      eligible: rosteredAdds.length >= MIN_ROSTERED_PICKUPS,
      poolRank: null,
      bestPickup: best ? { playerId: best.playerId, points: best.started } : null,
      weeklyStarted,
      weeklyRegret,
      weeklyNet,
      cumulativeStarted: cumulative,
    })
  }

  const eligible = rows.filter((r) => r.eligible).sort(comparePool)
  eligible.forEach((r, i) => {
    r.poolRank = i + 1
  })
  const ineligible = rows.filter((r) => !r.eligible).sort(comparePool)
  const managers = [...eligible, ...ineligible]

  const weeklyRanking =
    selectedWeekComplete && selectedWeek >= 1 && selectedWeek <= scoringThrough
      ? [...managers].sort((a, b) => {
          const an = a.weeklyNet ?? 0
          const bn = b.weeklyNet ?? 0
          if (bn !== an) return bn - an
          return (b.weeklyStarted ?? 0) - (a.weeklyStarted ?? 0)
        })
      : []

  const pickupOfWeek = selectedWeekComplete
    ? weekPickupCandidates
        .filter((c) => c.week === selectedWeek)
        .sort((a, b) => b.points - a.points)[0] ?? null
    : null

  const worstDropOfWeek = selectedWeekComplete
    ? weekDropCandidates
        .filter((c) => c.week === selectedWeek && c.points > 0)
        .sort((a, b) => b.points - a.points)[0] ?? null
    : null

  moves.sort((a, b) => b.statusUpdated - a.statusUpdated)

  return {
    scoringThrough,
    selectedWeek,
    selectedWeekComplete,
    managers,
    champion: eligible[0] ?? null,
    cellar: eligible.length >= 2 ? eligible[eligible.length - 1] : null,
    pickupOfWeek,
    worstDropOfWeek,
    moves,
    weeklyRanking,
  }
}
