export type PublishedSlide = {
  id: string
  title: string
  basename: string
  width: number
  height: number
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
