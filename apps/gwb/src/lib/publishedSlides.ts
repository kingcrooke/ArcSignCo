import assetBasenames from '../content/slide-asset-basenames.json'

export type PublishedSlide = {
  id: string
  title: string
  basename: string
  width: number
  height: number
}

const basenameOverrides = assetBasenames as Record<string, string>

/** CDN filename stem for a slide (hashed when repaired). */
export function publishSlideBasename(logicalId: string): string {
  return basenameOverrides[logicalId] ?? logicalId
}

/** Slides withheld from the gallery (fresh-render QA failures). */
export const HELD_BACK_SLIDES: { id: string; reason: string }[] = [

]

const base = import.meta.env.BASE_URL

export function slideAssetUrl(
  basename: string,
  variant: 'full' | 'thumb',
  ext: 'webp' | 'jpg',
) {
  return `${base}slides/${basename}.${variant}.${ext}`
}
