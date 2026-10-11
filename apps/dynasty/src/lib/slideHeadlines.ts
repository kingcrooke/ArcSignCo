import headlines from '../content/slide-headlines.json'

const byBasename = headlines as Record<string, string>

export function slideHeadline(basename: string, fallback: string): string {
  const raw = byBasename[basename]?.trim()
  if (!raw || raw === basename) return fallback
  if (/^Slide \d+$/i.test(raw)) return fallback
  return raw
}
