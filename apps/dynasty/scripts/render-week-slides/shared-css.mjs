import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FONTS = path.join(__dirname, '../fonts-local')

export const COLORS = {
  bg: '#0a0f14',
  surface: '#121a22',
  accent: '#a855f7',
  accentBright: '#c084fc',
  white: '#f4f7fb',
  muted: '#8fa3b8',
  panel: '#161e28',
  pollDark: '#2d343c',
}

/** Instagram feed side margin (~56px). */
export const MARGIN = 56

export function fontFaces() {
  const anton = path.join(FONTS, 'Anton-Regular.ttf')
  const bebas = path.join(FONTS, 'BebasNeue-Regular.ttf')
  const interReg = path.join(FONTS, 'Inter-Regular.ttf')
  const interSemi = path.join(FONTS, 'Inter-SemiBold.ttf')
  return `
@font-face { font-family: 'Anton'; src: url('file://${anton}') format('truetype'); font-weight: 400; }
@font-face { font-family: 'Bebas Neue'; src: url('file://${bebas}') format('truetype'); font-weight: 400; }
@font-face { font-family: 'Inter'; src: url('file://${interReg}') format('truetype'); font-weight: 400; }
@font-face { font-family: 'Inter'; src: url('file://${interSemi}') format('truetype'); font-weight: 600; }
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { width: 1080px; height: 1350px; overflow: hidden; }
body {
  width: 1080px; height: 1350px; overflow: hidden; margin: 0;
  background: ${COLORS.bg}; color: ${COLORS.white};
  font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased;
  position: relative;
}
.slide { position: relative; width: 1080px; height: 1350px; overflow: hidden; background: ${COLORS.bg}; }
.bebas { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.03em; line-height: 1.35; }
.anton { font-family: 'Anton', sans-serif; text-transform: uppercase; letter-spacing: 0.01em; line-height: 1.22; }
.inter { font-family: 'Inter', sans-serif; }
.inter-semibold { font-family: 'Inter', sans-serif; font-weight: 600; }
.kicker { font-size: 28px; color: ${COLORS.accent}; line-height: 1.35; }
.kicker-line { height: 2px; background: rgba(143, 163, 184, 0.35); margin-top: 14px; width: 100%; }
.footer {
  position: absolute; left: ${MARGIN}px; right: ${MARGIN}px; bottom: 28px;
  display: flex; justify-content: space-between; align-items: center;
  font-size: 22px; color: ${COLORS.muted}; z-index: 20;
}
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
