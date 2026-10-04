import type { TeamInfo } from '../lib/types'

export function TeamAvatar({
  team,
  size = 'md',
}: {
  team: TeamInfo | undefined
  size?: 'sm' | 'md'
}) {
  const dim = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  const initials = teamInitials(team)
  if (team?.avatarUrl) {
    return (
      <img
        src={team.avatarUrl}
        alt=""
        className={`${dim} shrink-0 rounded-full border border-[var(--gwb-border)] object-cover`}
      />
    )
  }
  return (
    <div
      className={`${dim} flex shrink-0 items-center justify-center rounded-full border border-[var(--gwb-border)] bg-[#243040] text-xs font-semibold text-[var(--gwb-muted)]`}
    >
      {initials}
    </div>
  )
}

function teamInitials(team: TeamInfo | undefined): string {
  if (!team?.teamName) return '?'
  const parts = team.teamName.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return team.teamName.slice(0, 2).toUpperCase()
}
