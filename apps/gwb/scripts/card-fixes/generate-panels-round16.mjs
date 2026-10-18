/**
 * Round 16 panel regenerations (PR #96 tone + pose refs).
 *   GEMINI_API_KEY=... node scripts/card-fixes/generate-panels-round16.mjs
 *   ... --only=results-w3-m4-winner.jpg
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { GoogleGenAI } from '@google/genai'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROMPTS = path.join(__dirname, 'panel-prompts-round16.json')
const STYLE = path.join(__dirname, '../w5-result-cards/assets/results-w5-m1-loser.jpg')
const REFW5 = path.join(__dirname, '../w6-matchup-cards/refs-w5')
const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image'

async function toPngB64(filePath) {
  const buf = await sharp(filePath).rotate().png().toBuffer()
  return buf.toString('base64')
}

async function generateOne(ai, item) {
  const refA = path.join(REFW5, item.pose_ref)
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `${item.prompt}\n\nReference A = pose/jersey layout. Reference B = mandatory light stone-gray cracked granite skin (match B, not brown fur). Vertical 3:4 portrait, edge-to-edge. No text overlays.`,
          },
          { inlineData: { mimeType: 'image/png', data: await toPngB64(refA) } },
          { inlineData: { mimeType: 'image/png', data: await toPngB64(STYLE) } },
        ],
      },
    ],
  })
  const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)
  if (!part?.inlineData?.data) throw new Error(`no image for ${item.outFile}`)
  const rel = item.outFile.replace(/^\.\.\//, '../')
  const out = rel.startsWith('../')
    ? path.join(__dirname, rel)
    : path.join(__dirname, item.outFile)
  await mkdir(path.dirname(out), { recursive: true })
  await writeFile(
    out,
    await sharp(Buffer.from(part.inlineData.data, 'base64')).jpeg({ quality: 92 }).toBuffer(),
  )
  console.log('generated', item.outFile)
}

async function main() {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!key) {
    console.error('Set GEMINI_API_KEY')
    process.exit(1)
  }
  const only = process.argv.find((a) => a.startsWith('--only='))?.slice(7)
  const items = JSON.parse(await readFile(PROMPTS, 'utf8')).filter(
    (i) => !only || i.outFile.includes(only) || i.panelId === only,
  )
  const ai = new GoogleGenAI({ apiKey: key })
  for (const item of items) await generateOne(ai, item)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
