/**
 * Build cleaned commissioner recaps for the GWB Recaps tab.
 * Source: uploads/gwb-recaps-weeks-1-4.md (Drive export; do not edit in Drive).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const SOURCE = path.join(
  '/home/ubuntu/.cursor/projects/workspace/uploads',
  'gwb-recaps-weeks-1-4_f534.md',
)
const OUT_MD = path.join(ROOT, '../../docs/gwb-commissioner-recaps.md')
const OUT_JSON = path.join(ROOT, 'src/content/commissioner-recaps.json')

const ID_TO_NAME = new Map([
  ['33006890831959129.68', 'Manny 129.68'],
  ['185585587216550130.39', 'Eric 130.39'],
  ['33006890831959', 'Manny'],
  ['109186742526081', 'Jamil'],
  ['125992882434278', 'Jamil'],
  ['133320130170939', 'Kayser'],
  ['231932562567218', 'Danny'],
  ['146394027429985', 'Crooke'],
  ['112270612946957', 'Steven'],
  ['125327212859529', 'Matt'],
  ['185585587216550', 'Eric'],
  ['222062761251006', 'Frankie'],
  ['281371947831487', 'Narking'],
  ['27715507855369', 'Mauricio'],
])

const RECON_NOTE =
  /^\*\[Reconstructed from notes[\s\S]*?\]\*\s*$/m

const LABEL_ORDER = {
  Waivers: 20,
  Predictions: 30,
  Thursday: 40,
  Saturday: 50,
  Sunday: 60,
  'Monday Morning': 70,
  'Monday Night': 80,
  Final: 90,
  Correction: 100,
}

function inferLabel(title) {
  const t = title.toUpperCase()
  if (t.includes('CORRECTION') || t.includes('AI CORRECTION')) return 'Correction'
  if (t.includes('FINAL REPORT')) return 'Final'
  if (/\bWEEK\s*1\b/.test(t) && t.includes('RECAP')) return 'Final'
  if (t.includes('MULLIGAN WATCH')) return 'Monday Night'
  if (t.includes('MONDAY NIGHT REPORT')) return 'Monday Night'
  if (t.includes('MONDAY MORNING')) return 'Monday Morning'
  if (t.includes('SUNDAY MORNING') || t.includes('SUNDAY CHECK')) return 'Sunday'
  if (t.includes('SATURDAY NIGHT') || t.includes('SATURDAY')) return 'Saturday'
  if (t.includes('FRIDAY MORNING') || t.includes('THURSDAY') || t.includes('FRIDAY')) {
    return 'Thursday'
  }
  if (t.includes('WAIVER') || t.includes('POST-WAIVER')) return 'Waivers'
  if (t.includes('PREDICTION') || t.includes('CRYSTAL BALL') || t.includes('CHECKPOINT')) {
    return 'Predictions'
  }
  return 'Final'
}

function inferWeek(title, index) {
  const t = title.toUpperCase()
  if (/\bWEEK\s*4\b/.test(t) || t.includes('WEEK 4')) return 4
  if (/\bWEEK\s*3\b/.test(t) || t.includes('WEEK 3')) return 3
  if (/\bWEEK\s*2\b/.test(t) || t.includes('WEEK 2')) return 2
  if (/\bWEEK\s*1\b/.test(t) || t.includes('WEEK 1')) return 1
  if (index <= 1) return 1
  if (index <= 8) return 2
  if (index <= 13) return 3
  return 4
}

function cleanBody(raw, { reconstructed }) {
  let text = raw.trim()
  if (RECON_NOTE.test(text)) {
    text = text.replace(RECON_NOTE, '').trim()
  }

  for (const [id, name] of [...ID_TO_NAME.entries()].sort(
    (a, b) => b[0].length - a[0].length,
  )) {
    text = text.replaceAll(`@${id}`, name)
  }

  text = text.replaceAll('+7.3', '+5.3')
  text = text.replace(
    /gained seven points/gi,
    'gained 5.3 points',
  )

  text = text.replace(
    /Mauricio already burned his Mulligan in Week 1 \(and won, though nobody's sure he needed it\)\./,
    "Mauricio already burned his Mulligan in Week 1 — it barely worked, but he got the win.",
  )

  // WhatsApp-style *bold* → markdown **bold** (single-asterisk pairs only).
  text = text.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '**$1**')

  // Strip accidental HTML-like tags from chat paste.
  text = text.replace(/<[^>]+>/g, '')

  return text
}

function parseRecaps(md) {
  const parts = md.split(/^## \d+\.\s+/m)
  const header = parts.shift()
  const recaps = []
  for (const chunk of parts) {
    const nl = chunk.indexOf('\n')
    const titleLine = chunk.slice(0, nl).trim()
    const body = chunk.slice(nl + 1).replace(/^---\s*$/m, '').trim()
    const reconstructed = RECON_NOTE.test(body)
    const index = recaps.length + 1
    const week = inferWeek(titleLine, index)
    const label = inferLabel(titleLine)
    recaps.push({
      id: `recap-${index}`,
      index,
      title: titleLine,
      week,
      label,
      postedAt: `${2026}-${String(8 + week).padStart(2, '0')}-${String(
        Math.min(28, index + week * 2),
      ).padStart(2, '0')}`,
      reconstructed,
      bodyMarkdown: cleanBody(body, { reconstructed }),
    })
  }
  if (!header.includes('GWB League Recaps')) {
    console.warn('Unexpected recap archive header')
  }
  return recaps
}

function main() {
  const md = readFileSync(SOURCE, 'utf8')
  const recaps = parseRecaps(md)

  const wrongSpelling = JSON.stringify(recaps).match(/Hadi|HADI/g)
  if (wrongSpelling) {
    throw new Error(`Hadi/HADI still present after cleanup: ${wrongSpelling.length}`)
  }
  const idLeft = JSON.stringify(recaps).match(/@\d{10,}/g)
  if (idLeft) {
    throw new Error(`Unmapped @IDs remain: ${idLeft.slice(0, 5).join(', ')}`)
  }

  mkdirSync(path.dirname(OUT_JSON), { recursive: true })
  mkdirSync(path.dirname(OUT_MD), { recursive: true })

  const mdOut = [
    '# GWB Commissioner Recaps (cleaned for web)',
    '',
    'Generated by `apps/gwb/scripts/prepare-commissioner-recaps.mjs`.',
    'Do not edit the Drive original; regenerate from the upload when text changes.',
    '',
    ...recaps.flatMap((r) => [
      `## ${r.index}. ${r.title}`,
      r.reconstructed ? '_Reconstructed recap._' : '',
      '',
      r.bodyMarkdown,
      '',
      '---',
      '',
    ]),
  ].join('\n')

  writeFileSync(OUT_MD, mdOut)
  writeFileSync(
    OUT_JSON,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        label: "Commissioner's recaps",
        recaps,
      },
      null,
      2,
    ) + '\n',
  )
  console.log(`Wrote ${recaps.length} recaps → ${OUT_JSON}`)
}

main()
