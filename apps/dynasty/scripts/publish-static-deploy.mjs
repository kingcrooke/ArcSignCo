/**
 * Copy Vite production output into repo-root deploy slug folder for Netlify static publish.
 */
import { readFile, mkdir } from 'node:fs/promises'
import { cp, rm, readdir } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appRoot = path.join(__dirname, '..')
const dist = path.join(appRoot, 'dist')
const deployConfig = JSON.parse(
  await readFile(path.join(appRoot, 'deploy.config.json'), 'utf8'),
)
const target = path.join(appRoot, '..', '..', deployConfig.deploySlug)

function run(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, stdio: 'inherit' })
  if (r.status !== 0) process.exit(r.status ?? 1)
}

async function emptyDir(dir) {
  await mkdir(dir, { recursive: true })
  for (const name of await readdir(dir)) {
    await rm(path.join(dir, name), { recursive: true, force: true })
  }
}

run('node', ['scripts/build-season-nfl-teams.mjs'], appRoot)
run('npm', ['run', 'build'], appRoot)

await mkdir(target, { recursive: true })
await emptyDir(target)
await cp(dist, target, { recursive: true })

const index = path.join(target, 'index.html')
console.log('Published', dist, '→', target)
console.log('Verify noindex in', index)
