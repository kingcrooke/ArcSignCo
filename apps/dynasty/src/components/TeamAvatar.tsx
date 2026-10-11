import { useEffect, useState } from 'react'
import managerAvatars from '../data/manager-avatars.json'
import type { TeamInfo } from '../lib/types'

export type AvatarMood = 'base' | 'hype' | 'excited' | 'loss'

type AvatarEntry =
  | string
  | { base?: string; hype?: string; excited?: string; loss?: string }

const customByRoster = managerAvatars as Record<string, AvatarEntry>

function resolveCustomUrl(
  rosterId: number,
  mood: AvatarMood,
): string | null {
  const entry = customByRoster[String(rosterId)]
  if (!entry) return null
  let path = ''
  if (typeof entry === 'string') {
    path = entry.trim()
  } else {
    path =
      (mood === 'hype'
        ? entry.hype
        : mood === 'excited'
          ? entry.excited
          : mood === 'loss'
            ? entry.loss
            : entry.base)?.trim() ?? ''
    if (!path && mood !== 'base') {
      path = entry.base?.trim() ?? ''
    }
  }
  if (!path) return null
  if (path.startsWith('http') || path.startsWith('/')) return path
  const base = import.meta.env.BASE_URL
  const root = base.endsWith('/') ? base : `${base}/`
  return `${root}${path.replace(/^\//, '')}`
}

export function TeamAvatar({
  team,
  size = 'md',
  mood = 'base',
}: {
  team: TeamInfo | undefined
  size?: 'sm' | 'md' | 'lg'
  mood?: AvatarMood
}) {
  const dim =
    size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-24 w-24' : 'h-10 w-10'
  const initials = teamInitials(team)
  const custom = team ? resolveCustomUrl(team.rosterId, mood) : null
  const src = custom ?? team?.avatarUrl ?? null
  const [useInitials, setUseInitials] = useState(!src)

  useEffect(() => {
    setUseInitials(!src)
  }, [src])

  if (useInitials || !src) {
    return (
      <div
        className={`${dim} flex shrink-0 items-center justify-center rounded-full border border-[var(--dyn-border)] bg-[var(--dyn-border)] text-xs font-semibold text-[var(--dyn-muted)]`}
      >
        {initials}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt=""
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
      className={`${dim} shrink-0 rounded-full border border-[var(--dyn-border)] object-cover`}
      onError={() => setUseInitials(true)}
      onLoad={(e) => {
        const img = e.currentTarget
        if (img.naturalWidth < 2 || img.naturalHeight < 2) {
          setUseInitials(true)
          return
        }
        if (imageLooksBlankOrDark(img)) {
          setUseInitials(true)
        }
      }}
    />
  )
}

function imageLooksBlankOrDark(img: HTMLImageElement): boolean {
  try {
    const size = 8
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return false
    ctx.drawImage(img, 0, 0, size, size)
    const { data } = ctx.getImageData(0, 0, size, size)
    let sum = 0
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      sum += (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    }
    const avg = sum / (data.length / 4)
    return avg < 0.08
  } catch {
    return false
  }
}

function teamInitials(team: TeamInfo | undefined): string {
  if (!team?.teamName) return '?'
  const parts = team.teamName.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return team.teamName.slice(0, 2).toUpperCase()
}
