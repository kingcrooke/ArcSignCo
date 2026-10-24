import path from 'node:path'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { buildScoreTimeline, topPerformers } from './timeline.mjs'
import { SCENE_TIMINGS } from './sceneTimings.mjs'
import { formatGraphicScore } from './scores.mjs'
import { DEFAULT_JERSEY_STYLES, loadArtManifest, resolvePortraitUrls } from './art.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Published copy for W3M2 (remake-held/templates.mjs results-w3-m2). */
const W3M2_GRAPHIC = {
  tagline: 'EL CAMPEON TO 2-1',
  note: "Danny's negative mulligan — first in GWB history",
}

export async function buildRecapConfig({ week, matchupId }) {
  const { resolveMatchup, recordsBeforeWeek, recordsThroughWeek } = await import('./sleeper.mjs')
  const mulliganPath = path.join(__dirname, '../../src/content/mulligan-ledger.json')
  const manifestPath = path.join(__dirname, '../manifest/art.manifest.json')
  const artManifest = await loadArtManifest(manifestPath)
  const portraits = resolvePortraitUrls(artManifest)

  const matchup = await resolveMatchup({ week, matchupId, mulliganLedgerPath: mulliganPath })
  const [recordsBefore, recordsAfter] = await Promise.all([
    recordsBeforeWeek(week),
    recordsThroughWeek(week),
  ])

  const scoreTicks = buildScoreTimeline(matchup)
  const wTop = topPerformers(matchup.winner)
  const lTop = topPerformers(matchup.loser)

  const wDisplay = formatGraphicScore(matchup.winner.points)
  const lDisplay = formatGraphicScore(matchup.loser.points)

  const winnerJersey = {
    ...DEFAULT_JERSEY_STYLES.winner,
    number: String(matchup.jersey.winner.number || DEFAULT_JERSEY_STYLES.winner.number),
    player: matchup.jersey.winner.name,
  }
  const loserJersey = {
    ...DEFAULT_JERSEY_STYLES.loser,
    number: String(matchup.jersey.loser.number || DEFAULT_JERSEY_STYLES.loser.number),
    player: matchup.jersey.loser.name,
  }

  const mulliganCopy = matchup.mulligan
    ? `${matchup.mulligan.managerShort ?? matchup.mulligan.manager} mulligan: ${matchup.mulligan.out.name} → ${matchup.mulligan.in.name} (${matchup.mulligan.netImpact >= 0 ? '+' : ''}${matchup.mulligan.netImpact} pts)`
    : null

  const graphic =
    week === 3 && matchupId === 2
      ? W3M2_GRAPHIC
      : {
          tagline: matchup.mulligan ? 'MULLIGAN WATCH' : `WEEK ${week} DUEL`,
          note: `${matchup.winner.nickname} ${wDisplay} — ${matchup.loser.nickname} ${lDisplay}`,
        }

  const winnerRecordAfter = `${recordsAfter.wins[matchup.winner.rosterId] ?? 0}-${recordsAfter.losses[matchup.winner.rosterId] ?? 0}`
  const loserRecordAfter = `${recordsAfter.wins[matchup.loser.rosterId] ?? 0}-${recordsAfter.losses[matchup.loser.rosterId] ?? 0}`

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      leagueId: matchup.leagueId,
      season: matchup.season,
      week,
      matchupId,
      matchupKey: `W${week}M${matchupId}`,
    },
    art: {
      manifestPath,
      mode: portraits.mode,
      portraits,
      imagineSlots: {
        winner: artManifest.winner?.imagineSlot ?? 'winner',
        loser: artManifest.loser?.imagineSlot ?? 'loser',
      },
    },
    timing: SCENE_TIMINGS,
    matchup: {
      winner: {
        nickname: matchup.winner.nickname,
        teamName: matchup.winner.teamName,
        points: matchup.winner.points,
        pointsDisplay: wDisplay,
        recordBefore: `${recordsBefore.wins[matchup.winner.rosterId] ?? 0}-${recordsBefore.losses[matchup.winner.rosterId] ?? 0}`,
        recordAfter: winnerRecordAfter,
        jersey: winnerJersey,
        topPerformers: wTop,
      },
      loser: {
        nickname: matchup.loser.nickname,
        teamName: matchup.loser.teamName,
        points: matchup.loser.points,
        pointsDisplay: lDisplay,
        recordBefore: `${recordsBefore.wins[matchup.loser.rosterId] ?? 0}-${recordsBefore.losses[matchup.loser.rosterId] ?? 0}`,
        recordAfter: loserRecordAfter,
        jersey: loserJersey,
        topPerformers: lTop,
      },
      margin: matchup.margin,
      upset: matchup.upset,
      tagline: graphic.tagline,
      mulligan: matchup.mulligan,
      mulliganCopy,
    },
    scoreTicks,
    copy: {
      headline: `FINAL: ${matchup.winner.nickname.toUpperCase()} TAKES IT`,
      scoreline: `${matchup.winner.nickname.toUpperCase()} ${wDisplay} — ${lDisplay} ${matchup.loser.nickname.toUpperCase()}`,
      caption: graphic.note,
      subtitleFinal: graphic.note,
      swingLines: [
        `${matchup.winner.nickname} ${wDisplay} — ${matchup.loser.nickname} ${lDisplay} (Sleeper ${matchup.winner.points}–${matchup.loser.points})`,
        mulliganCopy,
        `${matchup.winner.topScorer.name} (${formatGraphicScore(matchup.winner.topScorer.points)}) led ${matchup.winner.nickname}`,
        `${matchup.loser.topScorer.name} (${formatGraphicScore(matchup.loser.topScorer.points)}) led ${matchup.loser.nickname}`,
      ].filter(Boolean),
    },
    assumptions: [
      'Display scores use one decimal (weekGraphics / results slides); Sleeper raw totals kept in swing copy.',
      'Running score bar sums starter points into kickoff windows only; cumulative from 0 to final.',
      'Buffalo slots use logo-free placeholders until Imagine assets are set in manifest/art.manifest.json.',
      'Jerseys are generic color panels (navy/green #11 winner, teal #16 loser) — no NFL marks.',
    ],
  }
}
