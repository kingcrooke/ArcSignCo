import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FONTS = path.join(__dirname, '../../public/fonts')

export const COLORS = {
  bg: '#0a0f14',
  gold: '#e8b923',
  white: '#f4f7fb',
  muted: '#8fa3b8',
  panel: 'rgba(18, 24, 32, 0.92)',
  row: 'rgba(22, 30, 42, 0.94)',
  pollDark: '#2d343c',
  coral: '#e07a6a',
}

export function fontFaces() {
  const anton = path.join(FONTS, 'Anton-Regular.ttf')
  const bebas = path.join(FONTS, 'BebasNeue-Regular.ttf')
  const inter = path.join(FONTS, 'Inter-Variable.ttf')
  return `
@font-face { font-family: 'Anton'; src: url('file://${anton}') format('truetype'); font-weight: 400; }
@font-face { font-family: 'Bebas Neue'; src: url('file://${bebas}') format('truetype'); font-weight: 400; }
@font-face { font-family: 'Inter'; src: url('file://${inter}') format('truetype'); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1080px; height: 1350px; overflow: hidden; background: ${COLORS.bg}; color: ${COLORS.white};
  font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
.slide { position: relative; width: 1080px; height: 1350px; }
.bebas { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.02em; }
.anton { font-family: 'Anton', sans-serif; text-transform: uppercase; }
.inter { font-family: 'Inter', sans-serif; }
.inter-semibold { font-family: 'Inter', sans-serif; font-weight: 600; }
.kicker { font-size: 26px; color: ${COLORS.gold}; line-height: 1.35; }
.kicker-line { height: 2px; background: rgba(143, 163, 184, 0.35); margin-top: 10px; width: 100%; }
.footer { position: absolute; left: 72px; right: 72px; bottom: 28px; display: flex; justify-content: space-between;
  font-size: 22px; color: ${COLORS.muted}; }
`
}

export function wrapHtml(body, extraCss = '') {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${fontFaces()}${extraCss}</style></head><body>${body}</body></html>`
}

export function fileUrl(p) {
  return `file://${path.resolve(p)}`
}
