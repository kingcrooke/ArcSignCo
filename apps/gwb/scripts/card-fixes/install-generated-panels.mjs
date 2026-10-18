import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ART = '/opt/cursor/artifacts/assets'
const prompts = JSON.parse(await readFile(path.join(__dirname, 'panel-prompts.json'), 'utf8'))
const names = process.argv.slice(2)
const byId = new Map(prompts.map((p) => [p.panelId, p]))

for (const panelId of names) {
  const item = byId.get(panelId)
  if (!item) throw new Error(`unknown ${panelId}`)
  const src = path.join(ART, `${panelId}.jpg`)
  const jpg = await sharp(src).jpeg({ quality: 93 }).toBuffer()
  const genDest = path.join(__dirname, 'generated', `${panelId}.jpg`)
  await mkdir(path.dirname(genDest), { recursive: true })
  await writeFile(genDest, jpg)
  let out = item.outFile
  const dest = out.startsWith('../')
    ? path.join(__dirname, '..', out.replace(/^\.\.\//, ''))
    : path.join(__dirname, out)
  await mkdir(path.dirname(dest), { recursive: true })
  await writeFile(dest, jpg)
  console.log('installed', panelId, '->', dest)
}
