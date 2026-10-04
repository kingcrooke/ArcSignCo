import type { MatchupRecap, PowerRankingRow, StandingRow } from '../lib/types'
import { IG } from './fonts'
import { IG_HASHTAGS, LONG_TEAM_NAMES } from '../lib/constants'
import { recordLabel } from '../lib/standings'
import {
  createIgContext,
  canvasToBlob,
  fitTableLayout,
  maxRowsPerStandingsSlide,
  renderTableSlide,
} from './slideCanvas'
import { checkSlideOverflow, combineOverflowResults } from './overflowCheck'
import {
  checkRowHorizontalOverlap,
  drawCell,
  scoreRightX,
  teamMaxWidthForPower,
  STANDINGS_GRID,
  TABLE_GRID,
} from './tableGrid'
import { loadIgFonts } from './fonts'
import type { TextBox } from './overflowCheck'

export interface SlideResult {
  blob: Blob
  caption: string
  overflow: { ok: boolean; issues: string[] }
}

function movementLabel(m: number | null): { text: string; color: string } {
  if (m == null || m === 0) return { text: '–', color: '#94a3b8' }
  if (m > 0) return { text: `▲ ${m}`, color: '#4ade80' }
  return { text: `▼ ${Math.abs(m)}`, color: '#f87171' }
}

function drawStandingsRows(
  rows: StandingRow[],
  ctx: CanvasRenderingContext2D,
  startY: number,
  layout: ReturnType<typeof fitTableLayout>,
): TextBox[] {
  const boxes: TextBox[] = []
  const rowH = layout.bodySize * 1.28
  const bodyFont = `600 ${layout.bodySize}px Inter`
  const mutedFont = `${layout.bodySize}px Inter`
  let y = startY
  for (const row of rows) {
    boxes.push(
      drawCell(ctx, {
        text: String(row.rank),
        font: bodyFont,
        color: IG.text,
        align: 'right',
        x: STANDINGS_GRID.rankRight,
        y,
        label: `standings-rank-${row.rank}`,
        rowHeight: rowH,
      }),
      drawCell(ctx, {
        text: row.teamName,
        font: bodyFont,
        color: IG.text,
        align: 'left',
        x: STANDINGS_GRID.teamLeft,
        y,
        label: `standings-team-${row.rank}`,
        rowHeight: rowH,
      }),
      drawCell(ctx, {
        text: recordLabel(row),
        font: mutedFont,
        color: IG.muted,
        align: 'right',
        x: STANDINGS_GRID.recordRight,
        y,
        label: `standings-record-${row.rank}`,
        rowHeight: rowH,
      }),
      drawCell(ctx, {
        text: row.pointsFor.toFixed(1),
        font: bodyFont,
        color: IG.text,
        align: 'right',
        x: STANDINGS_GRID.scoreRight,
        y,
        label: `standings-pf-${row.rank}`,
        rowHeight: rowH,
      }),
    )
    y += layout.rowHeight
  }
  return boxes
}

function drawPowerRows(
  rows: PowerRankingRow[],
  ctx: CanvasRenderingContext2D,
  startY: number,
  layout: ReturnType<typeof fitTableLayout>,
): TextBox[] {
  const boxes: TextBox[] = []
  const rowH = layout.bodySize * 1.28
  const bodyFont = `600 ${layout.bodySize}px Inter`
  let y = startY
  const moveFont = `${layout.bodySize}px Inter`
  for (const row of rows) {
    const move = movementLabel(row.movement)
    boxes.push(
      drawCell(ctx, {
        text: String(row.rank),
        font: bodyFont,
        color: IG.text,
        align: 'right',
        x: TABLE_GRID.rankRight,
        y,
        label: `power-rank-${row.rank}`,
        rowHeight: rowH,
      }),
      drawCell(ctx, {
        text: move.text,
        font: moveFont,
        color: move.color,
        align: 'left',
        x: TABLE_GRID.moveLeft,
        y,
        maxWidth: TABLE_GRID.moveMaxWidth,
        label: `power-move-${row.rank}`,
        rowHeight: rowH,
      }),
      drawCell(ctx, {
        text: row.teamName,
        font: bodyFont,
        color: IG.text,
        align: 'left',
        x: TABLE_GRID.teamLeft,
        y,
        maxWidth: teamMaxWidthForPower(),
        label: `power-team-${row.rank}`,
        rowHeight: rowH,
      }),
      drawCell(ctx, {
        text: row.score.toFixed(1),
        font: bodyFont,
        color: IG.text,
        align: 'right',
        x: scoreRightX(),
        y,
        label: `power-score-${row.rank}`,
        rowHeight: rowH,
      }),
    )
    y += layout.rowHeight
  }
  return boxes
}

export async function renderStandingsSlide(
  standings: StandingRow[],
  week: number,
  part?: 1 | 2,
): Promise<SlideResult> {
  const maxPer = maxRowsPerStandingsSlide()
  const needsSplit = standings.length > maxPer
  const slice =
    needsSplit && part === 2
      ? standings.slice(6, 12)
      : needsSplit && part === 1
        ? standings.slice(0, 6)
        : standings.slice(0, 12)

  const partLabel =
    needsSplit && part
      ? ` · PART ${part}`
      : needsSplit
        ? ''
        : ''
  const header = {
    hero: 'STANDINGS',
    label: `AFTER WEEK ${week}${partLabel} · GWB REDRAFT`,
  }
  const { blob, overflow } = await renderTableSlide(
    header,
    (ctx, startY, layout) => drawStandingsRows(slice, ctx, startY, layout),
    slice.length,
  )
  const caption = `GWB standings after Week ${week}${needsSplit && part ? ` (part ${part})` : ''}. ${IG_HASHTAGS}`
  return { blob, caption, overflow }
}

/** One or two PNGs depending on row count / long names. */
export async function renderAllStandingsSlides(
  standings: StandingRow[],
  week: number,
): Promise<SlideResult[]> {
  const maxPer = maxRowsPerStandingsSlide()
  if (standings.length <= maxPer) {
    return [await renderStandingsSlide(standings, week)]
  }
  return [
    await renderStandingsSlide(standings, week, 1),
    await renderStandingsSlide(standings, week, 2),
  ]
}

export async function renderPowerSlide(
  rankings: PowerRankingRow[],
  week: number,
): Promise<SlideResult> {
  const rows = rankings.slice(0, 12)
  const { blob, overflow } = await renderTableSlide(
    { hero: 'POWER RANKS', label: `AFTER WEEK ${week}` },
    (ctx, startY, layout) => drawPowerRows(rows, ctx, startY, layout),
    rows.length,
  )
  const caption = `GWB power ranks after Week ${week}. ${IG_HASHTAGS}`
  return { blob, caption, overflow }
}

export async function renderRecapSlide(
  recap: MatchupRecap,
  week: number,
  statusLabel: string,
): Promise<SlideResult> {
  await loadIgFonts()
  const ctx = createIgContext()
  const boxes: TextBox[] = []
  const cx = IG.width / 2
  const contentW = IG.width - IG.margin * 2
  const heroSize = 88
  const nameSize = 38
  const bodySize = 32

  const tag = recap.tags.length ? recap.tags.join(' · ') : statusLabel
  const hero = recap.isMatchupOfTheWeek ? 'MATCHUP OF THE WEEK' : 'WEEKLY RECAP'
  const label = `WEEK ${week} · ${statusLabel === 'LIVE' ? 'LIVE' : tag}`

  const aWins = recap.teamA.points >= recap.teamB.points
  const winner = aWins ? recap.teamA : recap.teamB
  const loser = aWins ? recap.teamB : recap.teamA
  const winnerScoreSize = 108
  const loserScoreSize = 84

  type Block = {
    type: 'hero' | 'label' | 'name' | 'score' | 'body' | 'scorers'
    text: string
    size: number
    font: string
    color: string
  }

  const aWinsTop = recap.teamA.points >= recap.teamB.points
  const wTop = aWinsTop ? recap.teamA.topScorer : recap.teamB.topScorer
  const lTop = aWinsTop ? recap.teamB.topScorer : recap.teamA.topScorer
  const wTeam = aWinsTop ? recap.teamA.teamName : recap.teamB.teamName
  const lTeam = aWinsTop ? recap.teamB.teamName : recap.teamA.teamName
  const scorerLines =
    recap.scorerLines ??
    [
      wTop ? `${wTop.name} ${wTop.points.toFixed(1)} · ${wTeam}` : '',
      lTop ? `${lTop.name} ${lTop.points.toFixed(1)} · ${lTeam}` : '',
    ].filter(Boolean)

  const blocks: Block[] = [
    { type: 'hero', text: hero, size: heroSize, font: 'Anton', color: IG.accent },
    { type: 'label', text: label, size: IG.labelSize, font: '"Bebas Neue"', color: IG.text },
    { type: 'name', text: winner.teamName, size: nameSize, font: 'Inter', color: IG.muted },
    {
      type: 'score',
      text: winner.points.toFixed(1),
      size: winnerScoreSize,
      font: 'Anton',
      color: IG.accent,
    },
    { type: 'name', text: loser.teamName, size: nameSize - 4, font: 'Inter', color: IG.muted },
    {
      type: 'score',
      text: loser.points.toFixed(1),
      size: loserScoreSize,
      font: 'Anton',
      color: IG.text,
    },
    { type: 'body', text: recap.narrative, size: bodySize, font: 'Inter', color: IG.muted },
  ]
  if (scorerLines.length) {
    blocks.push({
      type: 'label',
      text: 'TOP SCORERS',
      size: 36,
      font: '"Bebas Neue"',
      color: IG.text,
    })
    for (const line of scorerLines) {
      blocks.push({
        type: 'scorers',
        text: line,
        size: bodySize,
        font: 'Inter',
        color: IG.text,
      })
    }
  }

  const blockGap = 20
  const measureBlock = (b: Block) => {
    const lh = b.size * (b.type === 'hero' ? 1.28 : b.type === 'score' ? 1.12 : 1.32)
    ctx.font = `${b.type === 'name' || b.type === 'body' ? '500 ' : ''}${b.size}px ${b.font}`
    const lines =
      b.type === 'body' ? wrapBody(ctx, b.text, contentW) : [b.text]
    return lines.length * lh
  }

  let totalH = blocks.reduce((s, b) => s + measureBlock(b), 0)
  totalH += blockGap * (blocks.length - 1)
  let y = (IG.height - totalH) / 2

  blocks.forEach((b, idx) => {
    const lh = b.size * (b.type === 'hero' ? 1.28 : b.type === 'score' ? 1.12 : 1.32)
    ctx.fillStyle = b.color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.font = `${b.type === 'name' || b.type === 'body' ? '500 ' : ''}${b.size}px ${b.font}`
    const lines =
      b.type === 'body' ? wrapBody(ctx, b.text, contentW) : [b.text]
    lines.forEach((line, li) => {
      ctx.fillText(line, cx, y + li * lh)
    })
    const w = Math.max(...lines.map((l) => ctx.measureText(l).width), 0)
    boxes.push({
      x: cx - w / 2,
      y,
      width: w,
      height: lines.length * lh,
      label: b.type + idx,
    })
    y += measureBlock(b) + (idx < blocks.length - 1 ? blockGap : 0)
  })

  const overflow = combineOverflowResults(
    checkSlideOverflow(boxes),
    checkRowHorizontalOverlap(boxes),
  )
  const caption = `Week ${week} GWB recap: ${recap.narrative} ${recap.starsLine ?? ''} ${IG_HASHTAGS}`.trim()
  return { blob: await canvasToBlob(ctx), caption, overflow }
}

function wrapBody(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = w
    } else line = test
  }
  if (line) lines.push(line)
  return lines.length ? lines : ['']
}

export async function runOverflowStressCheck(): Promise<{
  standings: { ok: boolean; issues: string[] }
  power: { ok: boolean; issues: string[] }
  recap: { ok: boolean; issues: string[] }
}> {
  const fakeStandings: StandingRow[] = LONG_TEAM_NAMES.map((name, i) => ({
    rank: i + 1,
    rosterId: i + 1,
    teamName: name,
    displayName: name,
    wins: 3 - i,
    losses: i,
    ties: 0,
    pointsFor: 400 - i * 12,
    pointsAgainst: 380,
    streak: '1W',
  }))
  while (fakeStandings.length < 12) {
    fakeStandings.push({
      ...fakeStandings[0],
      rank: fakeStandings.length + 1,
      rosterId: fakeStandings.length + 1,
      teamName: `Team ${fakeStandings.length + 1}`,
      displayName: `T${fakeStandings.length + 1}`,
      wins: 0,
      losses: 3,
      ties: 0,
      pointsFor: 300,
      pointsAgainst: 400,
      streak: '3L',
    })
  }
  const fakePower: PowerRankingRow[] = fakeStandings.map((s, i) => ({
    rank: s.rank,
    rosterId: s.rosterId,
    teamName: s.teamName,
    score: 92 - i * 4,
    recentForm: 0.6,
    pointsForRate: 0.5,
    allPlayWinPct: 0.5,
    lineupEfficiency: 0.9,
    movement: i === 0 ? 2 : i === 7 ? -4 : -1,
  }))
  const fakeRecap: MatchupRecap = {
    matchupId: 1,
    margin: 45,
    winnerRosterId: 1,
    tags: ['Blowout', 'Upset'],
    isMatchupOfTheWeek: true,
    narrative: 'El Campeon de la Liga topped Turn Your Head And Goff by 45.0 points.',
    scorerLines: [
      'Josh Allen 47.9 · El Campeon de la Liga',
      'Patrick Mahomes 41.4 · Turn Your Head And Goff',
    ],
    starsLine: 'Top scorers: Josh Allen 47.9 · El Campeon de la Liga · Patrick Mahomes 41.4 · Turn Your Head And Goff',
    teamA: {
      rosterId: 1,
      teamName: LONG_TEAM_NAMES[0],
      points: 199.2,
      topScorer: { name: 'Josh Allen', points: 47.9 },
      benchMiss: null,
    },
    teamB: {
      rosterId: 2,
      teamName: LONG_TEAM_NAMES[1],
      points: 154.1,
      topScorer: { name: 'Patrick Mahomes', points: 41.4 },
      benchMiss: null,
    },
  }
  const standingsSlides = await renderAllStandingsSlides(fakeStandings, 18)
  const [p, r] = await Promise.all([
    renderPowerSlide(fakePower, 18),
    renderRecapSlide(fakeRecap, 18, 'FINAL'),
  ])
  const standingsOk = standingsSlides.every((x) => x.overflow.ok)
  return {
    standings: {
      ok: standingsOk,
      issues: standingsSlides.flatMap((x) => x.overflow.issues),
    },
    power: p.overflow,
    recap: r.overflow,
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
