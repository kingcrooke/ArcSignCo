/**
 * Regenerate W6 panels via Gemini image-to-image (same approach as W5 result art).
 * Reference A: PR #91 panel (pose/bg/jersey). Reference B: W5 result panel (stone tone).
 *
 *   GEMINI_API_KEY=... node scripts/w6-matchup-cards/generate-panels.mjs
 *   node scripts/w6-matchup-cards/generate-panels.mjs --only=vs-w6-m1-left.jpg
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { GoogleGenAI } from '@google/genai'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS = path.join(__dirname, 'assets')
const REF91 = path.join(__dirname, 'refs-91')
const REFW5 = path.join(__dirname, 'refs-w5')
const PROMPTS = path.join(__dirname, 'panel-prompts.json')
const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image'

async function loadPrompts() {
  return JSON.parse(await readFile(PROMPTS, 'utf8'))
}

async function toPngB64(filePath) {
  const buf = await sharp(filePath).rotate().png().toBuffer()
  return buf.toString('base64')
}

async function generateOne(ai, item) {
  const refA = path.join(REF91, item.file)
  const refB = path.join(REFW5, item.w5_style_ref)
  const aB64 = await toPngB64(refA)
  const bB64 = await toPngB64(refB)
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: 'user',
        parts: [
          { text: `${item.prompt}\n\nReference A = first image (pose/layout). Reference B = second image (target fur lightness/tone). Output vertical 3:4 portrait photoreal illustration.` },
          { inlineData: { mimeType: 'image/png', data: aB64 } },
          { inlineData: { mimeType: 'image/png', data: bB64 } },
        ],
      },
    ],
  })
  const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)
  if (!part?.inlineData?.data) {
    throw new Error(`no image for ${item.file}: ${JSON.stringify(response)}`)
  }
  const out = path.join(ASSETS, item.file)
  const jpg = await sharp(Buffer.from(part.inlineData.data, 'base64'))
    .jpeg({ quality: 92 })
    .toBuffer()
  await writeFile(out, jpg)
  console.log('generated', item.file, jpg.length)
}

async function main() {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!key) {
    console.error('Set GEMINI_API_KEY or GOOGLE_API_KEY')
    process.exit(1)
  }
  await mkdir(ASSETS, { recursive: true })
  const ai = new GoogleGenAI({ apiKey: key })
  const only = process.argv.find((a) => a.startsWith('--only='))?.slice(7)
  const items = (await loadPrompts()).filter((i) => !only || i.file === only)
  for (const item of items) {
    await generateOne(ai, item)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
