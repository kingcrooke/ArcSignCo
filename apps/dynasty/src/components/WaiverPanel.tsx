import { useMemo, useState } from 'react'
import { playerLabel } from '../lib/playersCache'
import type { ManagerWaiverRow, WaiverBoard, WaiverMove } from '../lib/waiverWire'
import {
  HIT_LINE,
  MIN_ROSTERED_PICKUPS,
  pickupChampionStory,
} from '../lib/waiverWire'
import type { PlayersMap, TeamInfo } from '../lib/types'
import { WaiverCumulativeChart, WaiverEfficiencyChart } from './WaiverCharts'
import { TeamAvatar } from './TeamAvatar'

const TIME = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

function pts(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return '—'
  return n.toFixed(2)
}

function hitLabel(row: ManagerWaiverRow): string {
  if (!row.hitWeeks) return '—'
  return `${row.hitHits}/${row.hitWeeks}`
}

function nicknameRow(row: ManagerWaiverRow): ManagerWaiverRow {
  return {
    ...row,
    displayName: row.teamName || row.displayName,
    teamName: `${row.teamName} · @${row.displayName}`,
  }
}

function nicknameBoard(board: WaiverBoard): WaiverBoard {
  return {
    ...board,
    managers: board.managers.map(nicknameRow),
    weeklyRanking: board.weeklyRanking.map(nicknameRow),
    champion: board.champion ? nicknameRow(board.champion) : null,
    cellar: board.cellar ? nicknameRow(board.cellar) : null,
  }
}

function managerName(board: WaiverBoard, rosterId: number): string {
  return board.managers.find((m) => m.rosterId === rosterId)?.displayName ?? `Roster ${rosterId}`
}

export function WaiverPanel({
  board: sourceBoard,
  teams,
  players,
  deferralNote,
  loadError,
}: {
  board: WaiverBoard
  teams: Map<number, TeamInfo>
  players: PlayersMap | null
  deferralNote: string | null
  loadError: string | null
}) {
  const board = useMemo(() => nicknameBoard(sourceBoard), [sourceBoard])
  const [managerId, setManagerId] = useState<number | 'all'>('all')
  const [status, setStatus] = useState<'all' | 'complete' | 'failed'>('all')
  const [kind, setKind] = useState<'all' | 'waiver' | 'free_agent'>('all')
  const [allWeeks, setAllWeeks] = useState(false)

  const moves = useMemo(() => {
    return board.moves.filter((m) => {
      if (!allWeeks && m.leg !== board.selectedWeek) return false
      if (managerId !== 'all' && m.rosterId !== managerId) return false
      if (status !== 'all' && m.status !== status) return false
      if (kind !== 'all' && m.type !== kind) return false
      return true
    })
  }, [allWeeks, board.moves, board.selectedWeek, kind, managerId, status])

  const name = (id: string) => playerLabel(id, players ?? {})

  return (
    <div id="waiver-wire-panel" className="space-y-8">
      {loadError && (
        <p className="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-200">
          Waiver moves didn’t load. {loadError}
        </p>
      )}
      {players == null && (
        <p className="text-sm text-[var(--dyn-muted)]">Loading player names…</p>
      )}
      {deferralNote && (
        <p className="dynasty-deferral">
          {deferralNote} Moves from Week {board.selectedWeek} are still in the log.
        </p>
      )}

      <WeeklyAddsStrip
        board={board}
        teams={teams}
        name={name}
        managerName={(id) => managerName(board, id)}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ChampionCard board={board} teams={teams} />
        <CellarCard board={board} teams={teams} />
        <PickupCard board={board} name={name} managerName={(id) => managerName(board, id)} />
        <DropCard board={board} name={name} managerName={(id) => managerName(board, id)} />
      </div>

      <section>
        <h3 className="mb-2 text-lg font-semibold">
          Week {board.selectedWeek} on the wire
        </h3>
        {board.selectedWeekComplete ? (
          <WeeklyBoard board={board} teams={teams} />
        ) : (
          <p className="text-sm text-[var(--dyn-muted)]">
            Week {board.selectedWeek} is still scoring. Weekly started points, Pickup of
            the Week, and Worst Drop land when the week is final.
          </p>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">
            Season through Week {board.scoringThrough}
          </h3>
          <p className="mt-1 text-xs text-[var(--dyn-muted)]">
            Waiver Wire Champion is the manager with the most completed waiver and
            free-agent adds (trades and commissioner moves excluded). Tiebreak: FAAB
            spent, then name. WES below is net started points divided by rostered
            pickups ({MIN_ROSTERED_PICKUPS}+ for the efficiency pool). A hit is a start
            of {HIT_LINE}+ points.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <figure className="rounded-xl border border-[var(--dyn-border)] bg-[var(--dyn-surface)] p-3">
            <figcaption className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--dyn-muted)]">
              Efficiency through Week {board.scoringThrough}
            </figcaption>
            <WaiverEfficiencyChart
              managers={board.managers}
              scoringThrough={board.scoringThrough}
            />
            <p className="mt-2 text-xs text-[var(--dyn-muted)]">
              Filled bars are managers with {MIN_ROSTERED_PICKUPS}+ rostered pickups
              (WES pool). Hollow bars are below that sample size.
            </p>
          </figure>
          <figure className="rounded-xl border border-[var(--dyn-border)] bg-[var(--dyn-surface)] p-3">
            <figcaption className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--dyn-muted)]">
              Cumulative started points
            </figcaption>
            <WaiverCumulativeChart
              managers={board.managers}
              scoringThrough={board.scoringThrough}
            />
          </figure>
        </div>
        <SeasonBoard board={board} teams={teams} />
      </section>

      <section>
        <h3 className="mb-2 text-lg font-semibold">Move log</h3>
        <div className="mb-3 flex flex-wrap gap-2">
          <select
            aria-label="Filter moves by manager"
            className="rounded-lg border border-[var(--dyn-border)] bg-[var(--dyn-surface)] px-2 py-2 text-sm"
            value={managerId}
            onChange={(e) =>
              setManagerId(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
          >
            <option value="all">All managers</option>
            {board.managers.map((m) => (
              <option key={m.rosterId} value={m.rosterId}>
                {m.displayName}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter moves by status"
            className="rounded-lg border border-[var(--dyn-border)] bg-[var(--dyn-surface)] px-2 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
          >
            <option value="all">All statuses</option>
            <option value="complete">Complete</option>
            <option value="failed">Failed</option>
          </select>
          <select
            aria-label="Filter moves by type"
            className="rounded-lg border border-[var(--dyn-border)] bg-[var(--dyn-surface)] px-2 py-2 text-sm"
            value={kind}
            onChange={(e) => setKind(e.target.value as typeof kind)}
          >
            <option value="all">Waivers and free agents</option>
            <option value="waiver">Waivers</option>
            <option value="free_agent">Free agents</option>
          </select>
          <button
            type="button"
            className={`rounded-lg border px-3 py-2 text-sm ${
              allWeeks
                ? 'border-[var(--dyn-accent)] text-[var(--dyn-accent)]'
                : 'border-[var(--dyn-border)] text-[var(--dyn-muted)]'
            }`}
            onClick={() => setAllWeeks((v) => !v)}
          >
            {allWeeks ? 'Showing all weeks' : `Week ${board.selectedWeek} only`}
          </button>
        </div>
        {moves.length === 0 ? (
          <p className="text-sm text-[var(--dyn-muted)]">
            No moves {allWeeks ? 'match these filters' : `in Week ${board.selectedWeek}`}.
          </p>
        ) : (
          <ul className="space-y-2">
            {moves.map((m) => (
              <MoveRow
                key={m.id}
                move={m}
                who={managerName(board, m.rosterId)}
                name={name}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function WeeklyAddsStrip({
  board,
  teams,
  name,
  managerName,
}: {
  board: WaiverBoard
  teams: Map<number, TeamInfo>
  name: (id: string) => string
  managerName: (id: number) => string
}) {
  const adds = board.moves.filter(
    (m) =>
      m.leg === board.selectedWeek &&
      m.status === 'complete' &&
      m.adds.length > 0,
  )
  if (!adds.length) return null

  const showPending = !board.selectedWeekComplete

  return (
    <section aria-labelledby="waiver-week-adds-heading">
      <h3
        id="waiver-week-adds-heading"
        className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--dyn-muted)]"
      >
        This week&apos;s adds
      </h3>
      <ul className="flex gap-2 overflow-x-auto pb-1" role="list">
        {adds.map((m) => (
          <li
            key={m.id}
            className="min-w-[9.5rem] shrink-0 rounded-lg border border-[var(--dyn-border)] bg-[var(--dyn-surface)] px-3 py-2 text-xs"
          >
            <div className="flex items-center gap-2">
              {teams.get(m.rosterId) && (
                <TeamAvatar team={teams.get(m.rosterId)!} size="sm" />
              )}
              <p className="font-medium">{managerName(m.rosterId)}</p>
            </div>
            <p className="mt-0.5 text-[var(--dyn-muted)]">
              +{m.adds.map(name).join(', ')}
            </p>
            {showPending && m.pending ? (
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--dyn-accent-bright)]">
                Not yet scored
              </p>
            ) : m.startedPoints != null ? (
              <p className="mt-1 tabular-nums text-[var(--dyn-accent)]">
                {pts(m.startedPoints)} started
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}

function ChampionCard({
  board,
  teams,
}: {
  board: WaiverBoard
  teams: Map<number, TeamInfo>
}) {
  const c = board.champion
  const team = c ? teams.get(c.rosterId) : undefined
  return (
    <article className="rounded-xl border border-[var(--dyn-accent)] bg-[var(--dyn-surface)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--dyn-accent)]">
        Waiver Wire Champion
      </p>
      {c ? (
        <>
          {team && (
            <div className="mt-2">
              <TeamAvatar team={team} size="md" />
            </div>
          )}
          <h3 className="mt-1 font-['Anton'] text-3xl uppercase leading-none">
            {c.displayName}
          </h3>
          <p className="mt-1 text-sm text-[var(--dyn-muted)]">{c.teamName}</p>
          <p className="mt-3 font-['Anton'] text-4xl tabular-nums text-[var(--dyn-accent)]">
            {c.pickupCount}
          </p>
          <p className="mt-1 text-sm text-[var(--dyn-muted)]">completed pickups</p>
          <p className="mt-2 text-xs text-[var(--dyn-muted)]">
            {pickupChampionStory(c)} · through Week {board.scoringThrough}
          </p>
        </>
      ) : (
        <p className="mt-2 text-sm text-[var(--dyn-muted)]">
          No waiver or free-agent pickups through Week {board.scoringThrough}.
        </p>
      )}
    </article>
  )
}

function CellarCard({
  board,
  teams,
}: {
  board: WaiverBoard
  teams: Map<number, TeamInfo>
}) {
  const c = board.cellar
  const team = c ? teams.get(c.rosterId) : undefined
  return (
    <article className="rounded-xl border border-red-900/50 bg-red-950/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-200">
        Waiver Wire Cellar
      </p>
      {c ? (
        <>
          {team && (
            <div className="mt-2">
              <TeamAvatar team={team} size="md" />
            </div>
          )}
          <h3 className="mt-1 font-['Anton'] text-3xl uppercase leading-none text-red-100">
            {c.displayName}
          </h3>
          <p className="mt-1 text-sm text-red-200/80">{c.teamName}</p>
          <p className="mt-3 font-['Anton'] text-4xl tabular-nums text-red-200">
            {c.pickupCount}
          </p>
          <p className="mt-1 text-sm text-red-200/80">completed pickups</p>
          <p className="mt-1 text-xs text-red-200/70">
            Fewest pickups · {pickupChampionStory(c)} · through Week{' '}
            {board.scoringThrough}
          </p>
        </>
      ) : (
        <p className="mt-2 text-sm text-red-200/80">
          The cellar chip appears once at least two managers have pickups.
        </p>
      )}
    </article>
  )
}

function PickupCard({
  board,
  name,
  managerName,
}: {
  board: WaiverBoard
  name: (id: string) => string
  managerName: (id: number) => string
}) {
  const p = board.pickupOfWeek
  return (
    <article className="rounded-xl border border-[var(--dyn-border)] bg-[var(--dyn-surface)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--dyn-muted)]">
        Pickup of the Week
      </p>
      {!board.selectedWeekComplete ? (
        <p className="mt-2 text-sm text-[var(--dyn-muted)]">
          Week {board.selectedWeek} is still scoring.
        </p>
      ) : p ? (
        <>
          <h3 className="mt-1 text-xl font-semibold">{name(p.playerId)}</h3>
          <p className="text-sm text-[var(--dyn-muted)]">{managerName(p.rosterId)}</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-[var(--dyn-accent)]">
            {pts(p.points)}
          </p>
          <p className="text-xs text-[var(--dyn-muted)]">Started in Week {p.week}</p>
        </>
      ) : (
        <p className="mt-2 text-sm text-[var(--dyn-muted)]">
          No pickup started in Week {board.selectedWeek}.
        </p>
      )}
    </article>
  )
}

function DropCard({
  board,
  name,
  managerName,
}: {
  board: WaiverBoard
  name: (id: string) => string
  managerName: (id: number) => string
}) {
  const d = board.worstDropOfWeek
  return (
    <article className="rounded-xl border border-[var(--dyn-border)] bg-[var(--dyn-surface)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--dyn-muted)]">
        Worst Drop
      </p>
      {!board.selectedWeekComplete ? (
        <p className="mt-2 text-sm text-[var(--dyn-muted)]">
          Week {board.selectedWeek} is still scoring.
        </p>
      ) : d && d.startedByRosterId != null ? (
        <>
          <h3 className="mt-1 text-xl font-semibold">{name(d.playerId)}</h3>
          <p className="mt-1 text-sm">
            Dropped by {managerName(d.rosterId)}
          </p>
          <p className="text-sm text-[var(--dyn-muted)]">
            Started by {managerName(d.startedByRosterId)} for {pts(d.points)}
          </p>
        </>
      ) : (
        <p className="mt-2 text-sm text-[var(--dyn-muted)]">
          No dropped player started for someone else in Week {board.selectedWeek}.
        </p>
      )}
    </article>
  )
}

function WeeklyBoard({
  board,
  teams,
}: {
  board: WaiverBoard
  teams: Map<number, TeamInfo>
}) {
  return (
    <>
      <div className="space-y-2 sm:hidden">
        {board.weeklyRanking.map((r, i) => (
          <article
            key={r.rosterId}
            className="rounded-xl border border-[var(--dyn-border)] bg-[var(--dyn-surface)] px-3 py-2.5"
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="flex items-center gap-2 font-medium">
                <span className="text-[var(--dyn-accent)]">{i + 1}</span>
                {teams.get(r.rosterId) && (
                  <TeamAvatar team={teams.get(r.rosterId)!} size="sm" />
                )}
                {r.displayName}
              </p>
              <p className="tabular-nums font-semibold">{pts(r.weeklyNet)}</p>
            </div>
            <p className="mt-1 text-xs text-[var(--dyn-muted)]">
              Started {pts(r.weeklyStarted)} · drop regret {pts(r.weeklyRegret)}
            </p>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-xl border border-[var(--dyn-border)] sm:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--dyn-surface)] text-xs uppercase tracking-wider text-[var(--dyn-muted)]">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Manager</th>
              <th className="px-3 py-2 text-right">Started</th>
              <th className="px-3 py-2 text-right">Drop regret</th>
              <th className="px-3 py-2 text-right">Net</th>
            </tr>
          </thead>
          <tbody>
            {board.weeklyRanking.map((r, i) => (
              <tr key={r.rosterId} className="border-t border-[var(--dyn-border)] odd:bg-[#0d1319]">
                <td className="px-3 py-2.5 font-semibold text-[var(--dyn-accent)]">{i + 1}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    {teams.get(r.rosterId) && (
                      <TeamAvatar team={teams.get(r.rosterId)!} size="sm" />
                    )}
                    <div>
                      <div className="font-medium">{r.displayName}</div>
                      <div className="text-xs text-[var(--dyn-muted)]">{r.teamName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums">{pts(r.weeklyStarted)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{pts(r.weeklyRegret)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums font-semibold">{pts(r.weeklyNet)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function SeasonBoard({
  board,
  teams,
}: {
  board: WaiverBoard
  teams: Map<number, TeamInfo>
}) {
  return (
    <>
      <div className="space-y-2 sm:hidden">
        {board.managers.map((r) => (
          <SeasonCard key={r.rosterId} row={r} teams={teams} />
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-xl border border-[var(--dyn-border)] sm:block">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="bg-[var(--dyn-surface)] text-xs uppercase tracking-wider text-[var(--dyn-muted)]">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Manager</th>
              <th className="px-3 py-2 text-right">WES</th>
              <th className="px-3 py-2 text-right">Started</th>
              <th className="px-3 py-2 text-right">Bench</th>
              <th className="px-3 py-2 text-right">Pickups</th>
              <th className="px-3 py-2 text-right">Rostered</th>
              <th className="px-3 py-2 text-right">Pts/pickup</th>
              <th className="px-3 py-2 text-right">Hit</th>
              <th className="px-3 py-2 text-right">Net</th>
              <th className="px-3 py-2 text-right">Regret</th>
              <th className="px-3 py-2 text-right">Failed</th>
              <th className="px-3 py-2 text-right">FAAB left</th>
              <th className="px-3 py-2 text-right">FAAB spent</th>
              <th className="px-3 py-2 text-right">Priority</th>
            </tr>
          </thead>
          <tbody>
            {board.managers.map((r) => (
              <tr
                key={r.rosterId}
                className={`border-t border-[var(--dyn-border)] odd:bg-[#0d1319] ${
                  board.champion?.rosterId === r.rosterId
                    ? 'outline outline-2 -outline-offset-2 outline-[var(--dyn-accent)]'
                    : board.cellar?.rosterId === r.rosterId
                      ? 'outline outline-2 -outline-offset-2 outline-red-400/70'
                      : ''
                }`}
              >
                <td className="px-3 py-2.5 font-semibold text-[var(--dyn-accent)]">
                  {r.poolRank ?? '—'}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    {teams.get(r.rosterId) && (
                      <TeamAvatar team={teams.get(r.rosterId)!} size="sm" />
                    )}
                    <div>
                      <div className="font-medium">
                        {r.displayName}{' '}
                        {!r.eligible && (
                          <span className="ml-1 rounded bg-[var(--dyn-border)] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-[var(--dyn-muted)]">
                            Small sample
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[var(--dyn-muted)]">{r.teamName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums font-semibold">{pts(r.wes)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{pts(r.startedPoints)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{pts(r.benchPoints)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{r.pickupCount}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{r.rosteredPickups}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{pts(r.pointsPerPickup)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{hitLabel(r)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{pts(r.netWaiverPoints)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{pts(r.dropRegret)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{r.failedClaims}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">${r.faabRemaining}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">${r.faabSpent}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{r.waiverPriority ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function SeasonCard({
  row,
  teams,
}: {
  row: ManagerWaiverRow
  teams: Map<number, TeamInfo>
}) {
  const team = teams.get(row.rosterId)
  return (
    <article className="rounded-xl border border-[var(--dyn-border)] bg-[var(--dyn-surface)] px-3 py-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-2">
          {team && <TeamAvatar team={team} size="sm" />}
          <div>
          <p className="font-medium">
            {row.poolRank != null && (
              <span className="mr-2 text-[var(--dyn-accent)]">{row.poolRank}</span>
            )}
            {row.displayName}
          </p>
          <p className="text-xs text-[var(--dyn-muted)]">{row.teamName}</p>
          {!row.eligible && (
            <p className="mt-1 text-[10px] uppercase tracking-wide text-[var(--dyn-muted)]">
              Small sample
            </p>
          )}
          </div>
        </div>
        <p className="font-['Anton'] text-2xl tabular-nums text-[var(--dyn-accent)]">{pts(row.wes)}</p>
      </div>
      <p className="mt-2 text-xs text-[var(--dyn-muted)]">
        Started {pts(row.startedPoints)} · {row.pickupCount} pickups · net {pts(row.netWaiverPoints)} ·{' '}
        {row.failedClaims} failed · FAAB ${row.faabRemaining} left (${row.faabSpent} spent)
      </p>
      <p className="mt-1 text-xs text-[var(--dyn-muted)]">
        Bench {pts(row.benchPoints)} · {pts(row.pointsPerPickup)} / pickup · hit {hitLabel(row)} ·
        regret {pts(row.dropRegret)} · priority {row.waiverPriority ?? '—'}
      </p>
    </article>
  )
}

function MoveRow({
  move,
  who,
  name,
}: {
  move: WaiverMove
  who: string
  name: (id: string) => string
}) {
  const when = TIME.format(new Date(move.statusUpdated))
  const added = move.adds.map(name).join(', ')
  const dropped = move.drops.map(name).join(', ')
  return (
    <li className="rounded-xl border border-[var(--dyn-border)] bg-[var(--dyn-surface)] px-3 py-2.5 text-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-medium">
          {added && <span>Added {added}</span>}
          {added && dropped && <span className="text-[var(--dyn-muted)]"> · </span>}
          {dropped && <span>Dropped {dropped}</span>}
          {!added && !dropped && <span>Roster move</span>}
        </p>
        {move.status === 'failed' ? (
          <span className="text-xs uppercase tracking-wide text-red-200">Failed</span>
        ) : move.pending ? (
          <span className="text-xs uppercase tracking-wide text-[var(--dyn-accent-bright)]">Not yet scored</span>
        ) : (
          <span className="tabular-nums text-[var(--dyn-accent)]">
            {move.startedPoints == null ? '' : `${pts(move.startedPoints)} started`}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-[var(--dyn-muted)]">
        {who} · Week {move.leg} · {move.type === 'free_agent' ? 'Free agent' : 'Waiver'} · {when} ET
      </p>
      {move.status === 'failed' && move.notes && (
        <p className="mt-1 text-xs text-[var(--dyn-muted)]">{move.notes}</p>
      )}
    </li>
  )
}
