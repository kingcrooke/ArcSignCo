import { useMemo, useState } from 'react'
import {
  archiveFinishSummaryLine,
  archiveSeasonRowsForMember,
  archiveMemberKeyForUserId,
  bestFinishForUserId,
  careerRecordLabel,
  finalsAppearancesForUserId,
  mergedDisplaySeasons,
  playoffTripCountForUserId,
  titleCountForUserId,
} from '../lib/gwbArchive'
import { ChampionsWall } from './ChampionsWall'
import {
  finishedSeasonsForManager,
  finishSummaryLine,
  inProgressSeasonLine,
  seasonsForManager,
  type LeagueSeasonSummary,
  type ManagerSeasonFinish,
} from '../lib/managerSeasons'
import {
  formatMulliganLedgerLine,
  mulliganForRosterThroughWeek,
  mulliganStatusParts,
} from '../lib/mulligans'
import { managerNickname } from '../lib/nicknames'
import { playerDisplayName } from '../lib/matchupBoard'
import { buildPastRosterRows } from '../lib/seasonNflTeams'
import type { TradeLogEntry, TradeAsset } from '../lib/trades'
import type { PlayersMap, SleeperRoster, StandingRow, TeamInfo } from '../lib/types'
import { TeamAvatar } from './TeamAvatar'

function groupTradesBySeason(trades: TradeLogEntry[]): [string, TradeLogEntry[]][] {
  const map = new Map<string, TradeLogEntry[]>()
  for (const t of trades) {
    const list = map.get(t.season) ?? []
    list.push(t)
    map.set(t.season, list)
  }
  return [...map.entries()].sort((a, b) => Number(b[0]) - Number(a[0]))
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--gwb-border)] bg-[#0d1319] px-3 py-2 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--gwb-muted)]">
        {label}
      </p>
      <p className="mt-0.5 font-['Bebas_Neue'] text-xl leading-none tracking-wide text-[var(--gwb-accent)]">
        {value}
      </p>
    </div>
  )
}

function TradeAssetColumn({ title, assets }: { title: string; assets: TradeAsset[] }) {
  return (
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--gwb-muted)]">
        {title}
      </p>
      <ul className="mt-1 space-y-0.5 text-sm" role="list">
        {assets.length
          ? assets.map((a) => (
              <li key={a.label + (a.playerId ?? '')} className="text-[var(--gwb-text)]">
                {a.label}
              </li>
            ))
          : (
            <li className="text-[var(--gwb-muted)]">—</li>
          )}
      </ul>
    </div>
  )
}

export function ManagerPanel({
  rosterId,
  onRosterChange,
  teams,
  rosters,
  standings,
  trades,
  players,
  statusThroughWeek,
  leagueSeasonSummaries,
  currentSeason,
  tradePriorSeasonsFailed,
  tradeHistoryLoading = false,
}: {
  rosterId: number
  onRosterChange: (id: number) => void
  teams: Map<number, TeamInfo>
  rosters: SleeperRoster[]
  standings: StandingRow[]
  trades: TradeLogEntry[]
  players: PlayersMap | null
  statusThroughWeek: number
  leagueSeasonSummaries: LeagueSeasonSummary[]
  currentSeason: string
  tradePriorSeasonsFailed: boolean
  tradeHistoryLoading?: boolean
}) {
  const rosterIds = useMemo(
    () => [...teams.keys()].sort((a, b) => a - b),
    [teams],
  )
  const team = teams.get(rosterId)
  const userId = team?.userId ?? ''
  const row = standings.find((r) => r.rosterId === rosterId)
  const roster = rosters.find((r) => r.roster_id === rosterId)
  const mulligan = mulliganForRosterThroughWeek(rosterId, statusThroughWeek)
  const mulliganParts = mulliganStatusParts(rosterId, statusThroughWeek)

  const finishedSeasons = useMemo(
    () => finishedSeasonsForManager(leagueSeasonSummaries, userId),
    [leagueSeasonSummaries, userId],
  )

  const pastSeasons = useMemo(
    () => seasonsForManager(leagueSeasonSummaries, userId, currentSeason),
    [leagueSeasonSummaries, userId, currentSeason],
  )

  const [pastSeasonKey, setPastSeasonKey] = useState<string>('')

  const selectedPast =
    pastSeasons.find((s) => s.season === pastSeasonKey) ?? pastSeasons[0] ?? null

  const archiveKey = archiveMemberKeyForUserId(userId)
  const archiveRows = useMemo(
    () => (archiveKey ? archiveSeasonRowsForMember(archiveKey) : []),
    [archiveKey],
  )

  const mergedSeasons = useMemo(
    () => mergedDisplaySeasons(userId, finishedSeasons),
    [userId, finishedSeasons],
  )

  const careerRecord = useMemo(
    () =>
      careerRecordLabel(
        userId,
        finishedSeasons,
        row ? { wins: row.wins, losses: row.losses, ties: row.ties } : null,
      ),
    [userId, finishedSeasons, row],
  )

  const titleCount = titleCountForUserId(userId)
  const playoffTrips = playoffTripCountForUserId(userId, finishedSeasons)
  const finalsApps = finalsAppearancesForUserId(userId)
  const bestFinish = bestFinishForUserId(userId, finishedSeasons, archiveRows)

  const managerTrades = trades.filter(
    (t) => t.sideA.rosterId === rosterId || t.sideB.rosterId === rosterId,
  )
  const tradeGroups = useMemo(
    () => groupTradesBySeason(managerTrades),
    [managerTrades],
  )

  function managerFinishForTrade(
    season: string,
    sideRosterId: number,
    sideUserId: string,
  ): ManagerSeasonFinish | undefined {
    const summary = leagueSeasonSummaries.find((s) => s.season === season)
    if (!summary) return undefined
    return (
      summary.byUserId.get(sideUserId) ??
      summary.byRosterId.get(sideRosterId)
    )
  }

  function seasonTradeHeader(season: string): string {
    if (season === currentSeason) {
      return inProgressSeasonLine(currentSeason, row ?? null)
    }
    const summary = leagueSeasonSummaries.find((s) => s.season === season)
    const selfFinish = summary?.byUserId.get(userId)
    const parts: string[] = [summary?.leagueName ?? 'unavailable']
    if (selfFinish) parts.push(`You: ${finishSummaryLine(selfFinish)}`)
    if (summary?.status === 'complete') {
      parts.push(`Champion: ${summary.championDisplayName}`)
    }
    return parts.join(' · ')
  }

  return (
    <div className="space-y-8" id="manager-panel">
      <ChampionsWall leagueSeasonSummaries={leagueSeasonSummaries} />

      <label className="block text-sm">
        <span className="text-[var(--gwb-muted)]">Pick a manager</span>
        <select
          className="mt-1 w-full rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2 text-base"
          value={rosterId}
          onChange={(e) => onRosterChange(Number(e.target.value))}
          aria-label="Select manager"
        >
          {rosterIds.map((id) => {
            const t = teams.get(id)
            return (
              <option key={id} value={id}>
                {managerNickname(id, t?.displayName ?? '', t?.userId)}
              </option>
            )
          })}
        </select>
      </label>

      {team && (
        <section
          id="manager-hero"
          className="overflow-hidden rounded-xl border border-[var(--gwb-border)] bg-gradient-to-br from-[var(--gwb-surface)] to-[#0a0f14]"
          aria-labelledby="manager-profile-heading"
        >
          <div className="border-b border-[var(--gwb-border)] bg-[#0d1319]/80 px-4 py-4">
            <p
              id="manager-profile-heading"
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gwb-accent)]"
            >
              Profile
            </p>
            <div className="mt-2 flex items-start gap-3">
              <TeamAvatar team={team} size="md" />
              <div className="min-w-0 flex-1">
                <h4 className="font-['Anton'] text-3xl uppercase leading-none tracking-wide sm:text-4xl">
                  {managerNickname(rosterId, team.displayName, team.userId)}
                </h4>
                <p className="mt-1 font-['Bebas_Neue'] text-lg tracking-wide text-[var(--gwb-muted)]">
                  {team.teamName}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              <StatPill label="Career" value={careerRecord} />
              <StatPill label="Titles" value={String(titleCount)} />
              <StatPill label="Playoff trips" value={String(playoffTrips)} />
              <StatPill label="Finals apps" value={String(finalsApps)} />
              <StatPill label="Best finish" value={bestFinish} />
            </div>
          </div>

          <div className="space-y-4 px-4 py-4">
            {row && (
              <p className="text-sm text-[var(--gwb-muted)]">
                {inProgressSeasonLine(currentSeason, row)}
              </p>
            )}

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--gwb-muted)]">
                Mulligan ({currentSeason})
              </p>
              {mulliganParts.used ? (
                <div className="mt-1 space-y-0.5 text-sm">
                  <p>Used Week {mulliganParts.week}</p>
                  <p className="text-xs text-[var(--gwb-muted)]">{mulliganParts.outLine}</p>
                  <p className="text-xs text-[var(--gwb-muted)]">{mulliganParts.inLine}</p>
                  <p className="text-xs text-[var(--gwb-muted)]">{mulliganParts.netLine}</p>
                </div>
              ) : (
                <p className="mt-1 text-sm">Chip still in the holster.</p>
              )}
              {mulligan && (
                <p className="mt-2 text-xs text-[var(--gwb-muted)]">
                  {formatMulliganLedgerLine(mulligan)}
                </p>
              )}
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--gwb-muted)]">
                Current roster
              </p>
              {!roster?.players?.length ? (
                <p className="mt-1 text-sm text-[var(--gwb-muted)]">Roster not loaded.</p>
              ) : (
                <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2" role="list">
                  {roster.players.map((pid) => (
                    <li key={pid} className="truncate text-[var(--gwb-muted)]">
                      {players ? playerDisplayName(pid, players) : pid}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      <section id="manager-seasons-section" aria-labelledby="manager-seasons-heading">
        <h3
          id="manager-seasons-heading"
          className="font-['Bebas_Neue'] text-2xl tracking-wide text-[var(--gwb-accent)]"
        >
          Season-by-season
        </h3>
        <p className="mb-3 text-sm text-[var(--gwb-muted)]">
          Pre-2019 rows from the verified archive; 2019+ from Sleeper — seed, record, and playoff result.
        </p>

        {row && (
          <div className="mb-3 rounded-lg border border-[var(--gwb-accent)]/40 bg-[var(--gwb-accent)]/5 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--gwb-accent)]">
              This season
            </p>
            <p className="text-sm font-medium">{inProgressSeasonLine(currentSeason, row)}</p>
          </div>
        )}

        {mergedSeasons.length > 0 ? (
          <ul className="space-y-2" role="list">
            {mergedSeasons.map((entry) => {
              if (entry.kind === 'archive') {
                const s = entry.row
                const isTitle = s.playoffResult === 'Champion'
                const isRunnerUp = s.playoffResult === 'Runner-up'
                return (
                  <li
                    key={`archive-${s.season}`}
                    className={`rounded-lg border px-3 py-2 text-sm ${
                      isTitle
                        ? 'border-[var(--gwb-accent)] bg-[var(--gwb-accent)]/10'
                        : isRunnerUp
                          ? 'border-amber-500/50 bg-amber-500/5'
                          : 'border-[var(--gwb-border)] bg-[var(--gwb-surface)]'
                    }`}
                  >
                    <p className="font-medium">
                      {s.season}
                      {isTitle && (
                        <span className="ml-2 rounded bg-[var(--gwb-accent)] px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#1a1200]">
                          Champ
                        </span>
                      )}
                      {isRunnerUp && (
                        <span className="ml-2 rounded border border-amber-500/60 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-200">
                          Runner-up
                        </span>
                      )}
                      <span className="font-normal text-[var(--gwb-muted)]">
                        {' '}
                        · {s.leagueName}
                      </span>
                      <span className="ml-1 text-[10px] uppercase text-[var(--gwb-muted)]">
                        archive
                      </span>
                    </p>
                    <p className="text-xs text-[var(--gwb-muted)]">
                      {archiveFinishSummaryLine(s)}
                    </p>
                    <p className="text-xs text-[var(--gwb-muted)]">
                      Champion: {s.championDisplayName}
                      {s.runnerUpDisplayName && ` · Runner-up: ${s.runnerUpDisplayName}`}
                    </p>
                  </li>
                )
              }
              const s = entry.row
              const isTitle = s.playoffResult === 'Champion'
              const isRunnerUp = s.playoffResult === 'Runner-up'
              return (
                <li
                  key={`sleeper-${s.season}`}
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    isTitle
                      ? 'border-[var(--gwb-accent)] bg-[var(--gwb-accent)]/10'
                      : isRunnerUp
                        ? 'border-amber-500/50 bg-amber-500/5'
                        : 'border-[var(--gwb-border)] bg-[var(--gwb-surface)]'
                  }`}
                >
                  <p className="font-medium">
                    {s.season}
                    {isTitle && (
                      <span className="ml-2 rounded bg-[var(--gwb-accent)] px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#1a1200]">
                        Champ
                      </span>
                    )}
                    {isRunnerUp && (
                      <span className="ml-2 rounded border border-amber-500/60 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-200">
                        Runner-up
                      </span>
                    )}
                    <span className="font-normal text-[var(--gwb-muted)]">
                      {' '}
                      · {s.leagueName}
                    </span>
                  </p>
                  <p className="text-xs text-[var(--gwb-muted)]">{finishSummaryLine(s)}</p>
                  <p className="text-xs text-[var(--gwb-muted)]">
                    Champion: {s.championDisplayName}
                  </p>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-sm text-[var(--gwb-muted)]">No completed seasons yet.</p>
        )}
      </section>

      <section id="manager-trades-section" aria-labelledby="manager-trades-heading">
        <h3
          id="manager-trades-heading"
          className="font-['Bebas_Neue'] text-2xl tracking-wide text-[var(--gwb-accent)]"
        >
          Trades
        </h3>
        <p className="mb-3 text-sm text-[var(--gwb-muted)]">
          All-time receipts from Sleeper, tagged by season and NFL week.
        </p>
        {tradeHistoryLoading && (
          <p className="mb-2 text-sm text-[var(--gwb-muted)]">
            Loading trade history from prior seasons…
          </p>
        )}
        {tradePriorSeasonsFailed && (
          <p className="mb-2 text-sm text-amber-400">
            Some prior-season trade data is unavailable.
          </p>
        )}
        {!managerTrades.length ? (
          <p className="text-sm text-[var(--gwb-muted)]">Clean trade sheet — no deals yet.</p>
        ) : (
          <div className="space-y-5">
            {tradeGroups.map(([season, seasonTrades]) => (
              <div key={season}>
                <div className="mb-2 border-b border-[var(--gwb-border)] pb-2">
                  <p className="font-['Bebas_Neue'] text-xl tracking-wide">{season} season</p>
                  <p className="text-xs text-[var(--gwb-muted)]">{seasonTradeHeader(season)}</p>
                </div>
                <ul className="space-y-3 text-sm" role="list">
                  {seasonTrades.map((t) => {
                    const self =
                      t.sideA.rosterId === rosterId ? t.sideA : t.sideB
                    const other =
                      t.sideA.rosterId === rosterId ? t.sideB : t.sideA
                    const otherFinish = managerFinishForTrade(
                      season,
                      other.rosterId,
                      other.userId,
                    )
                    const showOtherFinish =
                      season !== currentSeason &&
                      otherFinish?.playoffResult
                    return (
                      <li
                        key={t.transactionId}
                        className="rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] p-3"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[var(--gwb-accent)] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#1a1200]">
                            {season} · Wk {t.week}
                          </span>
                          <span className="text-xs text-[var(--gwb-muted)]">{t.dateLabel}</span>
                        </div>
                        <p className="mt-2 font-medium">vs {other.managerName}</p>
                        {showOtherFinish && (
                          <p className="text-xs text-[var(--gwb-muted)]">
                            Their {season}: {finishSummaryLine(otherFinish)}
                          </p>
                        )}
                        <div className="mt-3 flex flex-col gap-3 border-t border-[var(--gwb-border)] pt-3 sm:flex-row sm:gap-4">
                          <TradeAssetColumn title="Got" assets={self.received} />
                          <TradeAssetColumn title="Sent" assets={self.sent} />
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      {pastSeasons.length > 0 && (
        <section id="manager-past-rosters-section" aria-labelledby="manager-past-rosters-heading">
          <h3
            id="manager-past-rosters-heading"
            className="font-['Bebas_Neue'] text-2xl tracking-wide text-[var(--gwb-accent)]"
          >
            Past rosters
          </h3>
          <p className="mb-3 text-sm text-[var(--gwb-muted)]">
            Final roster from each completed season.
          </p>
          <label className="mb-3 block text-sm">
            <span className="text-[var(--gwb-muted)]">Season</span>
            <select
              className="mt-1 w-full rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2"
              value={selectedPast?.season ?? ''}
              onChange={(e) => setPastSeasonKey(e.target.value)}
              aria-label="Select past season roster"
            >
              {pastSeasons.map((s) => (
                <option key={s.season} value={s.season}>
                  {s.season} · {recordLabelFromFinish(s)}
                </option>
              ))}
            </select>
          </label>
          {selectedPast && (
            <div className="rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] p-3">
              <p className="font-['Bebas_Neue'] text-lg tracking-wide">{selectedPast.season}</p>
              <p className="text-xs text-[var(--gwb-muted)]">
                {finishSummaryLine(selectedPast)}
              </p>
              <div className="mt-3 -mx-3 overflow-x-auto px-3">
                <table className="w-full min-w-[320px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--gwb-border)] text-[10px] uppercase tracking-wide text-[var(--gwb-muted)]">
                      <th className="py-2 pr-2 font-semibold">Player</th>
                      <th className="px-2 py-2 font-semibold">Pos</th>
                      <th className="px-2 py-2 font-semibold">Team</th>
                      <th className="py-2 pl-2 text-right font-semibold">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buildPastRosterRows(selectedPast, players).map((r) => (
                      <tr
                        key={r.id}
                        className="border-b border-[var(--gwb-border)]/60 last:border-0"
                      >
                        <td className="max-w-[140px] truncate py-2 pr-2">{r.name}</td>
                        <td className="whitespace-nowrap px-2 py-2 text-[var(--gwb-muted)]">
                          {r.pos}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-[var(--gwb-muted)]">
                          {r.nfl}
                        </td>
                        <td className="whitespace-nowrap py-2 pl-2 text-right text-xs uppercase">
                          {r.starter ? (
                            <span className="text-[var(--gwb-accent)]">Start</span>
                          ) : (
                            <span className="text-[var(--gwb-muted)]">Bench</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

function recordLabelFromFinish(s: ManagerSeasonFinish): string {
  const t = s.ties ? `-${s.ties}` : ''
  return `${s.wins}-${s.losses}${t} · ${s.playoffResult}`
}
