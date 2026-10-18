import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ART = '/opt/cursor/artifacts/assets'
const CARD_FIXES = __dirname
const W5_ASSETS = path.join(__dirname, '..', 'w5-matchup-cards', 'assets')

const prompts = JSON.parse(
  await readFile(path.join(__dirname, 'panel-prompts-round12.json'), 'utf8'),
)
const panelIds = process.argv.slice(2)

for (const panelId of panelIds) {
  const item = prompts.find((p) => p.panelId === panelId)
  if (!item) throw new Error(`unknown panelId ${panelId}`)
  const src = path.join(ART, `${panelId}.jpg`)
  const jpg = await sharp(src).jpeg({ quality: 92 }).toBuffer()
  const dest = path.join(CARD_FIXES, item.outFile)
  await mkdir(path.dirname(dest), { recursive: true })
  await writeFile(dest, jpg)
  if (item.outFile.startsWith('w5-matchup-cards/')) {
    const fn = path.basename(item.outFile)
    await mkdir(W5_ASSETS, { recursive: true })
    await writeFile(path.join(W5_ASSETS, fn), jpg)
  }
  console.log('installed', panelId, '->', dest)
}
