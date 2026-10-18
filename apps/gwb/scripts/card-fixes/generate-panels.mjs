/**
 * Dual-ref img2img panels (same as PR #93 / #94 / W6 pipeline).
 *   GEMINI_API_KEY=... node scripts/card-fixes/generate-panels.mjs
 *   node scripts/card-fixes/generate-panels.mjs --only=manny-LV-8-w5
 */
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { GoogleGenAI } from '@google/genai'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROMPTS = path.join(__dirname, 'panel-prompts.json')
const GENERATED = path.join(__dirname, 'generated')
const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image'

async function toPngB64(filePath) {
  const buf = await sharp(filePath).rotate().png().toBuffer()
  return buf.toString('base64')
}

async function generateOne(ai, item) {
  const aB64 = await toPngB64(item.refA)
  const bB64 = await toPngB64(item.refB)
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `${item.prompt}\n\nReference A = first image (pose/layout/jersey). Reference B = second image (target fur lightness/tone). Output vertical 3:4 portrait photoreal illustration.`,
          },
          { inlineData: { mimeType: 'image/png', data: aB64 } },
          { inlineData: { mimeType: 'image/png', data: bB64 } },
        ],
      },
    ],
  })
  const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)
  if (!part?.inlineData?.data) {
    throw new Error(`no image for ${item.panelId}: ${JSON.stringify(response).slice(0, 400)}`)
  }
  const jpg = await sharp(Buffer.from(part.inlineData.data, 'base64'))
    .jpeg({ quality: 93 })
    .toBuffer()
  const genPath = path.join(GENERATED, `${item.panelId}.jpg`)
  await writeFile(genPath, jpg)
  const dest = path.join(__dirname, item.outFile.replace(/^\.\.\//, '../'))
  if (item.outFile.startsWith('../')) {
    await mkdir(path.dirname(dest), { recursive: true })
    await writeFile(dest, jpg)
  } else {
    const dest2 = path.join(__dirname, item.outFile)
    await mkdir(path.dirname(dest2), { recursive: true })
    await writeFile(dest2, jpg)
  }
  console.log('generated', item.panelId, jpg.length, '->', item.outFile)
}

async function main() {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!key) {
    console.error('Set GEMINI_API_KEY or GOOGLE_API_KEY')
    process.exit(1)
  }
  await mkdir(GENERATED, { recursive: true })
  const ai = new GoogleGenAI({ apiKey: key })
  const only = process.argv.find((a) => a.startsWith('--only='))?.slice(7)
  const items = JSON.parse(await readFile(PROMPTS, 'utf8')).filter(
    (i) => !only || i.panelId === only || i.file === only,
  )
  for (const item of items) {
    await generateOne(ai, item)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
