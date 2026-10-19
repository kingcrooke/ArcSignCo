import { useEffect, useMemo, useState } from 'react'
import { managerNickname } from '../lib/nicknames'
import {
  sleeperAvatarPrimaryUrl,
  sleeperAvatarThumbUrl,
} from '../lib/sleeperAvatar'
import type { TeamInfo } from '../lib/types'

type AvatarPhase = 'primary' | 'fallback' | 'initials'

function resolveAvatarUrls(team: TeamInfo | undefined): {
  primary: string | null
  thumb: string | null
} {
  if (!team) return { primary: null, thumb: null }
  const primary =
    sleeperAvatarPrimaryUrl(
      team.sleeperMetadataAvatar ?? null,
      team.sleeperUserAvatar ?? null,
    ) ?? team.avatarUrl
  const thumb =
    sleeperAvatarThumbUrl(team.sleeperUserAvatar ?? null) ?? team.avatarThumbUrl
  return { primary, thumb }
}

function avatarPhaseForTeam(urls: {
  primary: string | null
  thumb: string | null
}): AvatarPhase {
  if (urls.primary) return 'primary'
  if (urls.thumb) return 'fallback'
  return 'initials'
}

function srcForPhase(
  urls: { primary: string | null; thumb: string | null },
  phase: AvatarPhase,
): string | null {
  if (phase === 'primary') return urls.primary
  if (phase === 'fallback') return urls.thumb
  return null
}

export function TeamAvatar({
  team,
  size = 'md',
}: {
  team: TeamInfo | undefined
  size?: 'sm' | 'md'
}) {
  const dim = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  const initials = teamInitials(team)
  const urls = useMemo(() => resolveAvatarUrls(team), [
    team?.rosterId,
    team?.avatarUrl,
    team?.avatarThumbUrl,
    team?.sleeperMetadataAvatar,
    team?.sleeperUserAvatar,
  ])
  const [phase, setPhase] = useState<AvatarPhase>(() => avatarPhaseForTeam(urls))

  useEffect(() => {
    setPhase(avatarPhaseForTeam(urls))
  }, [urls.primary, urls.thumb])

  const src = srcForPhase(urls, phase)

  if (phase === 'initials' || !src) {
    return (
      <div
        className={`${dim} flex shrink-0 items-center justify-center rounded-full border border-[var(--gwb-border)] bg-[#243040] text-xs font-semibold text-[var(--gwb-muted)]`}
      >
        {initials}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt=""
      referrerPolicy="no-referrer"
      className={`${dim} shrink-0 rounded-full border border-[var(--gwb-border)] object-cover`}
      onError={() => {
        if (
          phase === 'primary' &&
          urls.thumb &&
          urls.thumb !== urls.primary
        ) {
          setPhase('fallback')
          return
        }
        setPhase('initials')
      }}
    />
  )
}

function teamInitials(team: TeamInfo | undefined): string {
  const label = team
    ? managerNickname(team.rosterId, team.displayName, team.userId)
    : ''
  if (!label) return '?'
  const parts = label.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return label.slice(0, 2).toUpperCase()
}
