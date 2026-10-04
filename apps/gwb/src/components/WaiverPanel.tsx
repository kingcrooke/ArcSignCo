import { useMemo, useState } from 'react'
import { playerLabel } from '../lib/playersCache'
import type { ManagerWaiverRow, WaiverBoard, WaiverMove } from '../lib/waiverWire'
import { HIT_LINE, MIN_ROSTERED_PICKUPS } from '../lib/waiverWire'
import type { PlayersMap } from '../lib/types'
import { WaiverCumulativeChart, WaiverEfficiencyChart } from './WaiverCharts'

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

function managerName(board: WaiverBoard, rosterId: number): string {
  return board.managers.find((m) => m.rosterId === rosterId)?.displayName ?? `Roster ${rosterId}`
}

export function WaiverPanel({
  board,
  players,
  deferralNote,
  loadError,
}: {
  board: WaiverBoard
  players: PlayersMap
  deferralNote: string | null
  loadError: string | null
}) {
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

  const name = (id: string) => playerLabel(id, players)

  return (
    <div id="waiver-wire-panel" className="space-y-8">
      {loadError && (
        <p className="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-200">
          Waiver moves didn’t load. {loadError}
        </p>
      )}
      {deferralNote && (
        <p className="rounded-lg border border-amber-600/40 bg-amber-950/30 px-3 py-2 text-sm text-amber-100">
          {deferralNote} Moves from Week {board.selectedWeek} are still in the log.
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ChampionCard board={board} />
        <CellarCard board={board} />
        <PickupCard board={board} name={name} managerName={(id) => managerName(board, id)} />
        <DropCard board={board} name={name} managerName={(id) => managerName(board, id)} />
      </div>

      <section>
        <h3 className="mb-2 text-lg font-semibold">
          Week {board.selectedWeek} on the wire
        </h3>
        {board.selectedWeekComplete ? (
          <WeeklyBoard board={board} />
        ) : (
          <p className="text-sm text-[var(--gwb-muted)]">
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
          <p className="mt-1 text-xs text-[var(--gwb-muted)]">
            Waiver Efficiency Score is net started points divided by rostered pickups.
            The badge needs {MIN_ROSTERED_PICKUPS} rostered pickups. A hit is a start of{' '}
            {HIT_LINE}+ points. Kickers and defenses count.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <figure className="rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] p-3">
            <figcaption className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--gwb-muted)]">
              Efficiency through Week {board.scoringThrough}
            </figcaption>
            <WaiverEfficiencyChart
              managers={board.managers}
              scoringThrough={board.scoringThrough}
            />
            <p className="mt-2 text-xs text-[var(--gwb-muted)]">
              Filled bars are in the championship pool. Hollow bars are under{' '}
              {MIN_ROSTERED_PICKUPS} rostered pickups.
            </p>
          </figure>
          <figure className="rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] p-3">
            <figcaption className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--gwb-muted)]">
              Cumulative started points
            </figcaption>
            <WaiverCumulativeChart
              managers={board.managers}
              scoringThrough={board.scoringThrough}
            />
          </figure>
        </div>
        <SeasonBoard board={board} />
      </section>

      <section>
        <h3 className="mb-2 text-lg font-semibold">Move log</h3>
        <div className="mb-3 flex flex-wrap gap-2">
          <select
            aria-label="Filter moves by manager"
            className="rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-2 py-2 text-sm"
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
            className="rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-2 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
          >
            <option value="all">All statuses</option>
            <option value="complete">Complete</option>
            <option value="failed">Failed</option>
          </select>
          <select
            aria-label="Filter moves by type"
            className="rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-2 py-2 text-sm"
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
                ? 'border-[var(--gwb-accent)] text-[var(--gwb-accent)]'
                : 'border-[var(--gwb-border)] text-[var(--gwb-muted)]'
            }`}
            onClick={() => setAllWeeks((v) => !v)}
          >
            {allWeeks ? 'Showing all weeks' : `Week ${board.selectedWeek} only`}
          </button>
        </div>
        {moves.length === 0 ? (
          <p className="text-sm text-[var(--gwb-muted)]">
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

function ChampionCard({ board }: { board: WaiverBoard }) {
  const c = board.champion
  return (
    <article className="rounded-xl border border-[var(--gwb-accent)] bg-[var(--gwb-surface)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gwb-accent)]">
        Waiver Wire Champion
      </p>
      {c ? (
        <>
          <h3 className="mt-1 font-['Anton'] text-3xl uppercase leading-none">
            {c.displayName}
          </h3>
          <p className="mt-1 text-sm text-[var(--gwb-muted)]">{c.teamName}</p>
          <p className="mt-3 font-['Anton'] text-4xl tabular-nums text-[var(--gwb-accent)]">
            {pts(c.wes)}
          </p>
          <p className="mt-1 text-xs text-[var(--gwb-muted)]">
            {c.rosteredPickups} rostered pickups · net {pts(c.netWaiverPoints)} · through
            Week {board.scoringThrough}
          </p>
        </>
      ) : (
        <p className="mt-2 text-sm text-[var(--gwb-muted)]">
          No manager has {MIN_ROSTERED_PICKUPS} rostered pickups through Week{' '}
          {board.scoringThrough}.
        </p>
      )}
    </article>
  )
}

function CellarCard({ board }: { board: WaiverBoard }) {
  const c = board.cellar
  return (
    <article className="rounded-xl border border-red-900/50 bg-red-950/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-200">
        Waiver Wire Cellar
      </p>
      {c ? (
        <>
          <h3 className="mt-1 font-['Anton'] text-3xl uppercase leading-none text-red-100">
            {c.displayName}
          </h3>
          <p className="mt-1 text-sm text-red-200/80">{c.teamName}</p>
          <p className="mt-3 font-['Anton'] text-4xl tabular-nums text-red-200">
            {pts(c.wes)}
          </p>
          <p className="mt-1 text-xs text-red-200/70">
            Last in the pool · net {pts(c.netWaiverPoints)} · through Week{' '}
            {board.scoringThrough}
          </p>
        </>
      ) : (
        <p className="mt-2 text-sm text-red-200/80">
          The cellar chip appears once two managers are in the pool.
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
    <article className="rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gwb-muted)]">
        Pickup of the Week
      </p>
      {!board.selectedWeekComplete ? (
        <p className="mt-2 text-sm text-[var(--gwb-muted)]">
          Week {board.selectedWeek} is still scoring.
        </p>
      ) : p ? (
        <>
          <h3 className="mt-1 text-xl font-semibold">{name(p.playerId)}</h3>
          <p className="text-sm text-[var(--gwb-muted)]">{managerName(p.rosterId)}</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-[var(--gwb-accent)]">
            {pts(p.points)}
          </p>
          <p className="text-xs text-[var(--gwb-muted)]">Started in Week {p.week}</p>
        </>
      ) : (
        <p className="mt-2 text-sm text-[var(--gwb-muted)]">
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
    <article className="rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gwb-muted)]">
        Worst Drop
      </p>
      {!board.selectedWeekComplete ? (
        <p className="mt-2 text-sm text-[var(--gwb-muted)]">
          Week {board.selectedWeek} is still scoring.
        </p>
      ) : d && d.startedByRosterId != null ? (
        <>
          <h3 className="mt-1 text-xl font-semibold">{name(d.playerId)}</h3>
          <p className="mt-1 text-sm">
            Dropped by {managerName(d.rosterId)}
          </p>
          <p className="text-sm text-[var(--gwb-muted)]">
            Started by {managerName(d.startedByRosterId)} for {pts(d.points)}
          </p>
        </>
      ) : (
        <p className="mt-2 text-sm text-[var(--gwb-muted)]">
          No dropped player started for someone else in Week {board.selectedWeek}.
        </p>
      )}
    </article>
  )
}

function WeeklyBoard({ board }: { board: WaiverBoard }) {
  return (
    <>
      <div className="space-y-2 sm:hidden">
        {board.weeklyRanking.map((r, i) => (
          <article
            key={r.rosterId}
            className="rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2.5"
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-medium">
                <span className="mr-2 text-[var(--gwb-accent)]">{i + 1}</span>
                {r.displayName}
              </p>
              <p className="tabular-nums font-semibold">{pts(r.weeklyNet)}</p>
            </div>
            <p className="mt-1 text-xs text-[var(--gwb-muted)]">
              Started {pts(r.weeklyStarted)} · drop regret {pts(r.weeklyRegret)}
            </p>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-xl border border-[var(--gwb-border)] sm:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--gwb-surface)] text-xs uppercase tracking-wider text-[var(--gwb-muted)]">
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
              <tr key={r.rosterId} className="border-t border-[var(--gwb-border)] odd:bg-[#0d1319]">
                <td className="px-3 py-2.5 font-semibold text-[var(--gwb-accent)]">{i + 1}</td>
                <td className="px-3 py-2.5">
                  <div className="font-medium">{r.displayName}</div>
                  <div className="text-xs text-[var(--gwb-muted)]">{r.teamName}</div>
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

function SeasonBoard({ board }: { board: WaiverBoard }) {
  return (
    <>
      <div className="space-y-2 sm:hidden">
        {board.managers.map((r) => (
          <SeasonCard key={r.rosterId} row={r} />
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-xl border border-[var(--gwb-border)] sm:block">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="bg-[var(--gwb-surface)] text-xs uppercase tracking-wider text-[var(--gwb-muted)]">
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
              <th className="px-3 py-2 text-right">Priority</th>
            </tr>
          </thead>
          <tbody>
            {board.managers.map((r) => (
              <tr
                key={r.rosterId}
                className={`border-t border-[var(--gwb-border)] odd:bg-[#0d1319] ${
                  board.champion?.rosterId === r.rosterId
                    ? 'outline outline-2 -outline-offset-2 outline-[var(--gwb-accent)]'
                    : board.cellar?.rosterId === r.rosterId
                      ? 'outline outline-2 -outline-offset-2 outline-red-400/70'
                      : ''
                }`}
              >
                <td className="px-3 py-2.5 font-semibold text-[var(--gwb-accent)]">
                  {r.poolRank ?? '—'}
                </td>
                <td className="px-3 py-2.5">
                  <div className="font-medium">
                    {r.displayName}{' '}
                    {!r.eligible && (
                      <span className="ml-1 rounded bg-[var(--gwb-border)] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-[var(--gwb-muted)]">
                        Small sample
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[var(--gwb-muted)]">{r.teamName}</div>
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
                <td className="px-3 py-2.5 text-right tabular-nums">{r.waiverPriority ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function SeasonCard({ row }: { row: ManagerWaiverRow }) {
  return (
    <article className="rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">
            {row.poolRank != null && (
              <span className="mr-2 text-[var(--gwb-accent)]">{row.poolRank}</span>
            )}
            {row.displayName}
          </p>
          <p className="text-xs text-[var(--gwb-muted)]">{row.teamName}</p>
          {!row.eligible && (
            <p className="mt-1 text-[10px] uppercase tracking-wide text-[var(--gwb-muted)]">
              Small sample
            </p>
          )}
        </div>
        <p className="font-['Anton'] text-2xl tabular-nums text-[var(--gwb-accent)]">{pts(row.wes)}</p>
      </div>
      <p className="mt-2 text-xs text-[var(--gwb-muted)]">
        Started {pts(row.startedPoints)} · {row.pickupCount} pickups · net {pts(row.netWaiverPoints)} ·{' '}
        {row.failedClaims} failed
      </p>
      <p className="mt-1 text-xs text-[var(--gwb-muted)]">
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
    <li className="rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2.5 text-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-medium">
          {added && <span>Added {added}</span>}
          {added && dropped && <span className="text-[var(--gwb-muted)]"> · </span>}
          {dropped && <span>Dropped {dropped}</span>}
          {!added && !dropped && <span>Roster move</span>}
        </p>
        {move.status === 'failed' ? (
          <span className="text-xs uppercase tracking-wide text-red-200">Failed</span>
        ) : move.pending ? (
          <span className="text-xs uppercase tracking-wide text-amber-200">Pending</span>
        ) : (
          <span className="tabular-nums text-[var(--gwb-accent)]">
            {move.startedPoints == null ? '' : `${pts(move.startedPoints)} started`}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-[var(--gwb-muted)]">
        {who} · Week {move.leg} · {move.type === 'free_agent' ? 'Free agent' : 'Waiver'} · {when} ET
      </p>
      {move.status === 'failed' && move.notes && (
        <p className="mt-1 text-xs text-[var(--gwb-muted)]">{move.notes}</p>
      )}
    </li>
  )
}
