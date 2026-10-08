import { useMemo } from 'react'
import {
  formatMulliganLedgerLine,
  mulliganForRosterThroughWeek,
  mulliganStatusParts,
} from '../lib/mulligans'
import { managerNickname } from '../lib/nicknames'
import { playerDisplayName } from '../lib/matchupBoard'
import { formatTradeAssetList, type TradeLogEntry } from '../lib/trades'
import type { PlayersMap, SleeperRoster, StandingRow, TeamInfo } from '../lib/types'
import { TeamAvatar } from './TeamAvatar'

export function ManagerPanel({
  rosterId,
  onRosterChange,
  teams,
  rosters,
  standings,
  trades,
  players,
  statusThroughWeek,
}: {
  rosterId: number
  onRosterChange: (id: number) => void
  teams: Map<number, TeamInfo>
  rosters: SleeperRoster[]
  standings: StandingRow[]
  trades: TradeLogEntry[]
  players: PlayersMap | null
  statusThroughWeek: number
}) {
  const rosterIds = useMemo(
    () => [...teams.keys()].sort((a, b) => a - b),
    [teams],
  )
  const team = teams.get(rosterId)
  const row = standings.find((r) => r.rosterId === rosterId)
  const roster = rosters.find((r) => r.roster_id === rosterId)
  const mulligan = mulliganForRosterThroughWeek(rosterId, statusThroughWeek)
  const mulliganParts = mulliganStatusParts(rosterId, statusThroughWeek)
  const managerTrades = trades.filter(
    (t) => t.sideA.rosterId === rosterId || t.sideB.rosterId === rosterId,
  )

  return (
    <div className="space-y-4" id="manager-panel">
      <label className="block text-sm">
        <span className="text-[var(--gwb-muted)]">Manager</span>
        <select
          className="mt-1 w-full rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2"
          value={rosterId}
          onChange={(e) => onRosterChange(Number(e.target.value))}
          aria-label="Select manager"
        >
          {rosterIds.map((id) => (
            <option key={id} value={id}>
              {managerNickname(id, teams.get(id)?.displayName ?? '')}
            </option>
          ))}
        </select>
      </label>

      {team && (
        <div className="flex items-center gap-3">
          <TeamAvatar team={team} size="md" />
          <div>
            <h3 className="text-xl font-semibold">
              {managerNickname(rosterId, team.displayName)}
            </h3>
            <p className="text-sm text-[var(--gwb-muted)]">{team.teamName}</p>
          </div>
        </div>
      )}

      {row && (
        <p className="rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2 text-sm">
          Record{' '}
          <span className="font-semibold tabular-nums">
            {row.wins}-{row.losses}
            {row.ties ? `-${row.ties}` : ''}
          </span>
          · PF {row.pointsFor.toFixed(2)} · PA {row.pointsAgainst.toFixed(2)}
        </p>
      )}

      <section>
        <h4 className="mb-2 text-sm font-semibold uppercase text-[var(--gwb-accent)]">
          Mulligan
        </h4>
        {mulliganParts.used ? (
          <div className="space-y-1 text-sm">
            <p>Used Week {mulliganParts.week}</p>
            <p className="text-xs text-[var(--gwb-muted)]">{mulliganParts.outLine}</p>
            <p className="text-xs text-[var(--gwb-muted)]">{mulliganParts.inLine}</p>
            <p className="text-xs text-[var(--gwb-muted)]">{mulliganParts.netLine}</p>
          </div>
        ) : (
          <p className="text-sm">Chip still available.</p>
        )}
        {mulligan && (
          <p className="mt-2 text-xs text-[var(--gwb-muted)]">
            {formatMulliganLedgerLine(mulligan)}
          </p>
        )}
      </section>

      <section>
        <h4 className="mb-2 text-sm font-semibold uppercase text-[var(--gwb-accent)]">
          Roster
        </h4>
        {!roster?.players?.length ? (
          <p className="text-sm text-[var(--gwb-muted)]">Roster not loaded.</p>
        ) : (
          <ul className="grid gap-1 text-sm sm:grid-cols-2" role="list">
            {roster.players.map((pid) => (
              <li key={pid} className="truncate text-[var(--gwb-muted)]">
                {players ? playerDisplayName(pid, players) : pid}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h4 className="mb-2 text-sm font-semibold uppercase text-[var(--gwb-accent)]">
          Trades
        </h4>
        {!managerTrades.length ? (
          <p className="text-sm text-[var(--gwb-muted)]">No trades involving this manager.</p>
        ) : (
          <ul className="space-y-2 text-sm" role="list">
            {managerTrades.map((t) => {
              const self = t.sideA.rosterId === rosterId ? t.sideA : t.sideB
              const other = t.sideA.rosterId === rosterId ? t.sideB : t.sideA
              return (
                <li
                  key={t.transactionId}
                  className="rounded-lg border border-[var(--gwb-border)] px-3 py-2"
                >
                  <p className="font-medium">
                    Week {t.week} vs {other.managerName}
                  </p>
                  <p className="text-xs text-[var(--gwb-muted)]">
                    Got {formatTradeAssetList(self.received)} · Sent{' '}
                    {formatTradeAssetList(self.sent)}
                  </p>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
