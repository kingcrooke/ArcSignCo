import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FONTS = path.join(__dirname, '../../public/fonts')

export const COLORS = {
  bg: '#0a0f14',
  gold: '#e8b923',
  white: '#f4f7fb',
  muted: '#8fa3b8',
  panel: '#121820',
  row: '#161e28',
  pollDark: '#2d343c',
  coral: '#e07a6a',
  orange: '#d4882a',
}

export const MARGIN = 72

export function fontFaces() {
  const anton = path.join(FONTS, 'Anton-Regular.ttf')
  const bebas = path.join(FONTS, 'BebasNeue-Regular.ttf')
  const inter = path.join(FONTS, 'Inter-Variable.ttf')
  return `
@font-face { font-family: 'Anton'; src: url('file://${anton}') format('truetype'); font-weight: 400; }
@font-face { font-family: 'Bebas Neue'; src: url('file://${bebas}') format('truetype'); font-weight: 400; }
@font-face { font-family: 'Inter'; src: url('file://${inter}') format('truetype'); font-weight: 100 900; }
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { width: 1080px; height: 1350px; overflow: hidden; }
body {
  width: 1080px; height: 1350px; overflow: hidden; margin: 0;
  background: ${COLORS.bg}; color: ${COLORS.white};
  font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased;
  position: relative;
}
.slide { position: relative; width: 1080px; height: 1350px; overflow: hidden; }
.bebas { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.03em; }
.anton { font-family: 'Anton', sans-serif; text-transform: uppercase; letter-spacing: 0.01em; }
.inter { font-family: 'Inter', sans-serif; }
.inter-semibold { font-family: 'Inter', sans-serif; font-weight: 600; }
.kicker { font-size: 28px; color: ${COLORS.gold}; line-height: 1.35; }
.kicker-line { height: 2px; background: rgba(143, 163, 184, 0.35); margin-top: 12px; width: 100%; }
.footer {
  position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; bottom: 24px;
  display: flex; justify-content: space-between; align-items: center;
  font-size: 22px; color: ${COLORS.muted}; z-index: 20;
}
.footer-zone { padding-bottom: 72px; }
`
}

export function wrapHtml(body, extraCss = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=1080, height=1350, initial-scale=1, maximum-scale=1, user-scalable=no">
<style>${fontFaces()}${extraCss}</style>
</head>
<body>${body}</body></html>`
}

export function fileUrl(p) {
  return `file://${path.resolve(p)}`
}
