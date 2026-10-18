/**
 * Write panel manifest table (pose, number, team) for PR verification.
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const prompts = JSON.parse(await readFile(path.join(__dirname, 'panel-prompts.json'), 'utf8'))
const fixes = JSON.parse(await readFile(path.join(__dirname, 'panel-fixes.json'), 'utf8'))

const byId = new Map(fixes.panels.map((p) => [p.panelId, p]))

let md = '| panelId | card | side | pose | team | # | player |\n|---|---|---|---|---|---|---|\n'
for (const p of prompts) {
  const j = byId.get(p.panelId)
  md += `| ${p.panelId} | ${j?.cardId ?? ''} | ${j?.side ?? ''} | ${p.pose ?? ''} | ${j?.jersey?.team ?? ''} | ${j?.jersey?.number ?? ''} | ${j?.jersey?.name ?? ''} |\n`
}

const out = '/opt/cursor/artifacts/gwb-card-fixes-panel-table.md'
await writeFile(out, md)
console.log('Wrote', out)
