import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildScoreTimeline, topPerformers } from './timeline.mjs'
import { SCENE_TIMINGS } from './sceneTimings.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function buildRecapConfig({ week, matchupId }) {
  const { resolveMatchup } = await import('./sleeper.mjs')
  const mulliganPath = path.join(__dirname, '../../src/content/mulligan-ledger.json')
  const matchup = await resolveMatchup({ week, matchupId, mulliganLedgerPath: mulliganPath })

  const scoreTicks = buildScoreTimeline(matchup)
  const wTop = topPerformers(matchup.winner)
  const lTop = topPerformers(matchup.loser)

  const matchupTag = matchup.mulligan
    ? 'MULLIGAN WATCH'
    : matchup.upset
      ? 'UPSET ALERT'
      : matchup.margin < 12
        ? 'NAIL-BITER'
        : `WEEK ${week} DUEL`

  const mulliganCopy = matchup.mulligan
    ? `${matchup.mulligan.managerShort ?? matchup.mulligan.manager} mulligan: ${matchup.mulligan.out.name} → ${matchup.mulligan.in.name} (${matchup.mulligan.netImpact >= 0 ? '+' : ''}${matchup.mulligan.netImpact} pts)`
    : null

  const subtitleFinal = `${matchup.winner.nickname} ${matchup.winner.points.toFixed(1)} — ${matchup.loser.nickname}'s ${matchup.loser.topScorer.name.split(' ').pop()} wasn't enough`

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      leagueId: matchup.leagueId,
      season: matchup.season,
      week,
      matchupId,
      matchupKey: `W${week}M${matchupId}`,
    },
    timing: SCENE_TIMINGS,
    matchup: {
      winner: {
        nickname: matchup.winner.nickname,
        teamName: matchup.winner.teamName,
        points: matchup.winner.points,
        recordBefore: matchup.winner.recordBefore,
        jersey: {
          team: matchup.jersey.winner.team,
          number: matchup.jersey.winner.number,
          player: matchup.jersey.winner.name,
        },
        topPerformers: wTop,
      },
      loser: {
        nickname: matchup.loser.nickname,
        teamName: matchup.loser.teamName,
        points: matchup.loser.points,
        recordBefore: matchup.loser.recordBefore,
        jersey: {
          team: matchup.jersey.loser.team,
          number: matchup.jersey.loser.number,
          player: matchup.jersey.loser.name,
        },
        topPerformers: lTop,
      },
      margin: matchup.margin,
      upset: matchup.upset,
      tagline: matchupTag,
      mulligan: matchup.mulligan,
      mulliganCopy,
    },
    scoreTicks,
    copy: {
      headline: `FINAL: ${matchup.winner.nickname.toUpperCase()} TAKES IT`,
      headerScore: `${matchup.winner.nickname.toUpperCase()} ${matchup.winner.points.toFixed(1)} — ${matchup.loser.points.toFixed(1)} ${matchup.loser.nickname.toUpperCase()}`,
      subtitleFinal,
      swingLines: [
        `${matchup.winner.nickname} ${matchup.winner.points.toFixed(1)} — ${matchup.loser.nickname} ${matchup.loser.points.toFixed(1)} (margin ${matchup.margin.toFixed(1)})`,
        mulliganCopy,
        matchup.upset
          ? `Upset: ${matchup.winner.nickname} (${matchup.winner.recordBefore}) over ${matchup.loser.nickname} (${matchup.loser.recordBefore})`
          : `${matchup.winner.topScorer.name} (${matchup.winner.topScorer.points}) powered ${matchup.winner.nickname}`,
        `${matchup.loser.topScorer.name} (${matchup.loser.topScorer.points}) led ${matchup.loser.nickname} but fell short`,
      ].filter(Boolean),
    },
    assumptions: [
      'Score progression buckets use NFL team kickoff windows (static map), not play-by-play.',
      'Projected tick is a stylistic pre-game estimate (~42–44% of combined final), not Sleeper projections.',
      'Winner buffalo jersey = highest-scoring starter; loser = starting QB that week.',
      'Buffalo character art is league stock; jerseys are generic colors/numbers (no NFL logos).',
    ],
  }
}
