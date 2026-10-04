const FONT_URLS = {
  anton: '/fonts/Anton-Regular.ttf',
  bebas: '/fonts/BebasNeue-Regular.ttf',
  inter: '/fonts/Inter-Variable.ttf',
}

let loaded = false

export async function loadIgFonts(): Promise<void> {
  if (loaded) return
  const faces = [
    new FontFace('Anton', `url(${FONT_URLS.anton})`),
    new FontFace('Bebas Neue', `url(${FONT_URLS.bebas})`),
    new FontFace('Inter', `url(${FONT_URLS.inter})`),
  ]
  await Promise.all(
    faces.map(async (f) => {
      const face = await f.load()
      document.fonts.add(face)
    }),
  )
  await document.fonts.ready
  loaded = true
}

export const IG = {
  width: 1080,
  height: 1350,
  margin: 56,
  heroSize: 108,
  labelSize: 48,
  bodySize: 34,
  gap: 28,
  bg: '#0a0f14',
  accent: '#e8b923',
  text: '#f4f7fb',
  muted: '#8fa3b8',
}
