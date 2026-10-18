/**
 * Build panel-fixes.json — panels to re-render for card fixes.
 * Run after sleeper-facts.mjs
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FACTS = path.join(__dirname, 'sleeper-facts.json')
const OUT = path.join(__dirname, 'panel-fixes.json')

/** result cards: [cardId, winnerRegen, loserRegen] — skip sides already correct */
const RESULT_REGEN = {
  'results-w1-m1': [true, true],
  'results-w1-m2': [true, true],
  'results-w1-m3': [true, true],
  'results-w1-m4': [true, true],
  'results-w1-m5': [true, true],
  'results-w1-m6': [true, true],
  'results-w2-m1': [false, false],
  'results-w2-m2': [true, true],
  'results-w2-m3': [true, true],
  'results-w2-m4': [true, true],
  'results-w2-m5': [true, true],
  'results-w2-m6': [true, true],
  'results-w3-m1': [true, true],
  'results-w3-m2': [true, true],
  'results-w3-m3': [true, true],
  'results-w3-m4': [true, true],
  'results-w3-m5': [true, true],
  'results-w3-m6': [false, false],
}

/** w4 preview: [leftRegen, rightRegen] */
const W4_PREVIEW_REGEN = {
  'vs-m1-narking-steven': [true, true],
  'vs-m2-kayser-frankie': [true, true],
  'vs-m3-hadi-manny': [true, true],
  'vs-m4-jamil-matt': [true, true],
  'vs-m5-mauricio-eric': [true, true],
  'vs-m6-danny-crooke': [true, true],
}

const W5_PREVIEW_REGEN = {
  'vs-w5-m2': [true, true],
  'vs-w5-m4': [true, true],
}

function panelEntry(cardId, side, managerKey, jersey, outFile) {
  return {
    cardId,
    side,
    managerKey,
    jersey,
    outFile,
    panelId: `${managerKey}-${jersey.team}-${jersey.number}-w${cardId.match(/w(\d+)/)?.[1] ?? '4'}`,
  }
}

function managerKey(name) {
  return name.toLowerCase().replace(/\s+/g, '')
}

async function main() {
  const facts = JSON.parse(await readFile(FACTS, 'utf8'))
  const panels = []

  for (const [weekKey, rows] of Object.entries(facts.results)) {
    const week = weekKey.replace('w', '')
    for (const row of rows) {
      const regen = RESULT_REGEN[row.id]
      if (!regen) continue
      const [wR, lR] = regen
      if (wR) {
        panels.push(
          panelEntry(
            row.id,
            'winner',
            managerKey(row.winner.name),
            row.winnerJersey,
            `assets/${row.id}-winner.jpg`,
          ),
        )
      }
      if (lR) {
        panels.push(
          panelEntry(
            row.id,
            'loser',
            managerKey(row.loser.name),
            row.loserJersey,
            `assets/${row.id}-loser.jpg`,
          ),
        )
      }
    }
  }

  for (const row of facts.previews.w4) {
    const regen = W4_PREVIEW_REGEN[row.id]
    if (!regen) continue
    if (regen[0]) {
      panels.push(
        panelEntry(
          row.id,
          'left',
          managerKey(row.left.name),
          row.left.jersey,
          `w4-preview-assets/${row.id}-left.jpg`,
        ),
      )
    }
    if (regen[1]) {
      panels.push(
        panelEntry(
          row.id,
          'right',
          managerKey(row.right.name),
          row.right.jersey,
          `w4-preview-assets/${row.id}-right.jpg`,
        ),
      )
    }
  }

  for (const row of facts.previews.w5) {
    const regen = W5_PREVIEW_REGEN[row.id]
    if (!regen) continue
    if (regen[0]) {
      panels.push(
        panelEntry(
          row.id,
          'left',
          managerKey(row.left.name),
          row.left.jersey,
          `../w5-matchup-cards/assets/${row.id}-left.jpg`,
        ),
      )
    }
    if (regen[1]) {
      panels.push(
        panelEntry(
          row.id,
          'right',
          managerKey(row.right.name),
          row.right.jersey,
          `../w5-matchup-cards/assets/${row.id}-right.jpg`,
        ),
      )
    }
  }

  await writeFile(OUT, JSON.stringify({ panels }, null, 2) + '\n')
  console.log(`Wrote ${panels.length} panel jobs to ${OUT}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
