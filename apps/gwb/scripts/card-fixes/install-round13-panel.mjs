import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ART = '/opt/cursor/artifacts/assets'
const prompts = JSON.parse(await readFile(path.join(__dirname, 'panel-prompts-round13.json'), 'utf8'))

for (const panelId of process.argv.slice(2)) {
  const item = prompts.find((p) => p.panelId === panelId)
  if (!item) throw new Error(`unknown ${panelId}`)
  const jpg = await sharp(path.join(ART, `${panelId}.jpg`)).jpeg({ quality: 92 }).toBuffer()
  const dest = path.join(__dirname, item.outFile)
  await mkdir(path.dirname(dest), { recursive: true })
  await writeFile(dest, jpg)
  if (item.outFile.startsWith('w5-matchup-cards/')) {
    const w5 = path.join(__dirname, '..', item.outFile)
    await mkdir(path.dirname(w5), { recursive: true })
    await writeFile(w5, jpg)
  }
  console.log('installed', panelId, dest)
}
