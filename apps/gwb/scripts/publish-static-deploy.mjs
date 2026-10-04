/**
 * Copy Vite production output into repo-root gwb-fe006a16/ for Netlify static publish.
 * Netlify publishes "." with no build step; this folder must match apps/gwb/dist.
 */
import { cp, rm, readdir } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appRoot = path.join(__dirname, '..')
const dist = path.join(appRoot, 'dist')
const target = path.join(appRoot, '..', '..', 'gwb-fe006a16')

function run(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, stdio: 'inherit' })
  if (r.status !== 0) process.exit(r.status ?? 1)
}

async function emptyDir(dir) {
  for (const name of await readdir(dir)) {
    await rm(path.join(dir, name), { recursive: true, force: true })
  }
}

run('npm', ['run', 'build'], appRoot)

await emptyDir(target)
await cp(dist, target, { recursive: true })

const index = path.join(target, 'index.html')
console.log('Published', dist, '→', target)
console.log('Verify noindex in', index)
