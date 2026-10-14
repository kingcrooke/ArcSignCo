import { useEffect, useMemo } from 'react'
import { picksOwnedByRoster } from '../lib/drafts'
import {
  finishedSeasonsForManager,
  finishSummaryLine,
  inProgressSeasonLine,
  seasonsForManager,
  type LeagueSeasonSummary,
} from '../lib/managerSeasons'
import { playerDisplayName } from '../lib/matchupBoard'
import { managerLabel } from '../lib/teams'
import { buildPastRosterRows } from '../lib/seasonNflTeams'
import type { TradeLogEntry } from '../lib/trades'
import type {
  PlayersMap,
  SleeperRoster,
  SleeperTradedPick,
  StandingRow,
  TeamInfo,
} from '../lib/types'
import { TradeLogPanel } from './TradeLogPanel'
import { TeamAvatar } from './TeamAvatar'

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--dyn-border)] bg-[var(--dyn-bg)] px-3 py-2 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--dyn-muted)]">
        {label}
      </p>
      <p className="mt-0.5 font-['Bebas_Neue'] text-xl leading-none tracking-wide text-[var(--dyn-accent)]">
        {value}
      </p>
    </div>
  )
}

export function DynastyManagerPanel({
  rosterId,
  onRosterChange,
  teams,
  rosters,
  standings,
  players,
  ensurePlayers,
  playersLoading,
  leagueSeasonSummaries,
  currentSeason,
  allTrades,
  tradedPicks,
  tradePriorSeasonsFailed,
}: {
  rosterId: number
  onRosterChange: (id: number) => void
  teams: Map<number, TeamInfo>
  rosters: SleeperRoster[]
  standings: StandingRow[]
  players: PlayersMap | null
  ensurePlayers: () => void
  playersLoading: boolean
  leagueSeasonSummaries: LeagueSeasonSummary[]
  currentSeason: string
  allTrades: TradeLogEntry[]
  tradedPicks: SleeperTradedPick[]
  tradePriorSeasonsFailed: boolean
}) {
  const rosterIds = useMemo(
    () => [...teams.keys()].sort((a, b) => a - b),
    [teams],
  )
  const team = teams.get(rosterId)
  const userId = team?.userId ?? ''
  const row = standings.find((r) => r.rosterId === rosterId)
  const roster = rosters.find((r) => r.roster_id === rosterId)

  const finishedSeasons = useMemo(
    () => finishedSeasonsForManager(leagueSeasonSummaries, userId),
    [leagueSeasonSummaries, userId],
  )

  const pastSeasons = useMemo(
    () => seasonsForManager(leagueSeasonSummaries, userId, currentSeason),
    [leagueSeasonSummaries, userId, currentSeason],
  )

  const managerTrades = useMemo(
    () =>
      allTrades.filter(
        (t) => t.sideA.rosterId === rosterId || t.sideB.rosterId === rosterId,
      ),
    [allTrades, rosterId],
  )

  const futurePicks = useMemo(
    () =>
      picksOwnedByRoster(tradedPicks, teams, rosterId, currentSeason, 3),
    [tradedPicks, teams, rosterId, currentSeason],
  )

  const careerWins = finishedSeasons.reduce((s, f) => s + f.wins, 0)
  const careerLosses = finishedSeasons.reduce((s, f) => s + f.losses, 0)
  const titles = finishedSeasons.filter((f) => f.playoffResult === 'Champion').length

  useEffect(() => {
    ensurePlayers()
  }, [ensurePlayers])

  const taxi = roster?.taxi ?? []

  return (
    <div className="space-y-8" id="manager-panel">
      <label className="block text-sm">
        <span className="text-[var(--dyn-muted)]">Pick a manager</span>
        <select
          className="mt-1 w-full rounded-lg border border-[var(--dyn-border)] bg-[var(--dyn-surface)] px-3 py-2 text-base"
          value={rosterId}
          onChange={(e) => onRosterChange(Number(e.target.value))}
          aria-label="Select manager"
        >
          {rosterIds.map((id) => {
            const t = teams.get(id)
            return (
              <option key={id} value={id}>
                {managerLabel(t, id)}
              </option>
            )
          })}
        </select>
      </label>

      {team && (
        <section className="overflow-hidden rounded-xl border border-[var(--dyn-border)] bg-gradient-to-br from-[var(--dyn-surface)] to-[var(--dyn-bg)]">
          <div className="border-b border-[var(--dyn-border)] px-4 py-4">
            <div className="flex items-start gap-3">
              <TeamAvatar team={team} size="md" />
              <div className="min-w-0 flex-1">
                <h4 className="font-['Anton'] text-3xl uppercase leading-none">
                  {managerLabel(team, rosterId)}
                </h4>
                <p className="mt-1 font-['Bebas_Neue'] text-lg text-[var(--dyn-muted)]">
                  {team.teamName}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <StatPill
                label="Career"
                value={`${careerWins}-${careerLosses}`}
              />
              <StatPill label="Titles" value={String(titles)} />
              <StatPill
                label="This season"
                value={row ? `${row.wins}-${row.losses}` : '—'}
              />
              <StatPill label="Trades" value={String(managerTrades.length)} />
            </div>
            {row && (
              <p className="mt-3 text-sm text-[var(--dyn-muted)]">
                {inProgressSeasonLine(currentSeason, row)}
              </p>
            )}
          </div>

          <div className="space-y-4 px-4 py-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--dyn-muted)]">
                Taxi squad
              </p>
              {!taxi.length ? (
                <p className="mt-1 text-sm text-[var(--dyn-muted)]">No taxi players.</p>
              ) : (
                <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2" role="list">
                  {taxi.map((pid) => (
                    <li key={pid} className="truncate">
                      {players ? playerDisplayName(pid, players) : pid}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--dyn-muted)]">
                Future picks owned (next 3 years)
              </p>
              {futurePicks.length === 0 ? (
                <p className="mt-1 text-sm text-[var(--dyn-muted)]">None on file.</p>
              ) : (
                <ul className="mt-2 space-y-1 text-sm" role="list">
                  {futurePicks.map((p) => (
                    <li key={`${p.season}-${p.round}-${p.originalRosterId}`}>
                      <span className="text-[var(--dyn-accent-bright)]">
                        {p.season} Rd {p.round}
                      </span>
                      <span className="text-[var(--dyn-muted)]">
                        {' '}
                        (from {p.originalLabel})
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      <section>
        <h3 className="mb-2 font-['Bebas_Neue'] text-2xl tracking-wide text-[var(--dyn-accent)]">
          All-season history
        </h3>
        <ul className="space-y-2 text-sm" role="list">
          {pastSeasons.map((finish) => (
            <li
              key={finish.season}
              className="rounded-lg border border-[var(--dyn-border)] bg-[var(--dyn-surface)] px-3 py-2"
            >
              <span className="font-semibold">{finish.season}</span>
              <span className="text-[var(--dyn-muted)]">
                {' '}
                · {finishSummaryLine(finish)}
              </span>
            </li>
          ))}
        </ul>
        {pastSeasons[0] && players && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase text-[var(--dyn-muted)]">
              Past roster snapshot ({pastSeasons[0].season})
            </p>
            <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2" role="list">
              {buildPastRosterRows(pastSeasons[0], players).map((line) => (
                <li key={line.id} className="truncate text-[var(--dyn-muted)]">
                  {line.name} ({line.pos}
                  {line.nfl ? ` · ${line.nfl}` : ''})
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-lg font-semibold">Trade history</h3>
        <TradeLogPanel
          trades={managerTrades}
          teams={teams}
          priorSeasonsIncluded={[]}
          priorSeasonsFailed={tradePriorSeasonsFailed}
          playersLoading={playersLoading}
          highlightDraftPicks
        />
      </section>
    </div>
  )
}
