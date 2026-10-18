/**
 * Copy optimized slides from public/slides to gwb-fe006a16/slides and verify MD5.
 *
 *   node scripts/card-fixes/sync-published-slides.mjs --only=id1,id2
 */
import { createHash } from 'node:crypto'
import { copyFile, readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GWB = path.join(__dirname, '..', '..')
const PUBLIC = path.join(GWB, 'public', 'slides')
const DEPLOY = path.join(GWB, '..', '..', 'gwb-fe006a16', 'slides')

const SUFFIXES = ['.full.jpg', '.full.webp', '.thumb.jpg', '.thumb.webp']

async function md5(file) {
  const buf = await readFile(file)
  return createHash('md5').update(buf).digest('hex')
}

async function main() {
  const onlyArg = process.argv.find((a) => a.startsWith('--only='))
  const only = onlyArg
    ? new Set(
        onlyArg
          .slice('--only='.length)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      )
    : null

  const ids = only
    ? [...only]
    : await (async () => {
        const files = await readdir(PUBLIC)
        const set = new Set()
        for (const f of files) {
          const m = f.match(/^(.+)\.(full|thumb)\.(jpe?g|webp)$/i)
          if (m) set.add(m[1])
        }
        return [...set]
      })()
  let failed = false

  for (const id of ids) {
    for (const suf of SUFFIXES) {
      const src = path.join(PUBLIC, `${id}${suf}`)
      const dest = path.join(DEPLOY, `${id}${suf}`)
      try {
        await stat(src)
      } catch {
        console.error('missing', src)
        failed = true
        continue
      }
      await copyFile(src, dest)
      const a = await md5(src)
      const b = await md5(dest)
      if (a !== b) {
        console.error('MD5 mismatch', id, suf, a, b)
        failed = true
      }
    }
    console.log('synced', id)
  }

  if (failed) process.exit(1)
  console.log('MD5 OK for', ids.length, 'basenames')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
