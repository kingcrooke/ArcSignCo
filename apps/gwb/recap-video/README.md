# GWB recap video generator

Motion-graphic matchup recaps for the GWB Sleeper league. Pulls **read-only** data from the public Sleeper API, merges mulligan entries from `apps/gwb/src/content/mulligan-ledger.json`, and renders a silent MP4 suitable for later music/voiceover.

## Requirements

- Node 20+
- `ffmpeg` on PATH
- Playwright Chromium (installed via `npx playwright install chromium`)

## Quick start (Week 3 Danny vs Hadi — matchup 2)

```bash
cd apps/gwb/recap-video
npm install
npx playwright install chromium
npm run render:test -- --out /opt/cursor/artifacts/gwb-recap-w3-m2
```

## CLI

```bash
node bin/render.mjs --week <n> --matchup <id> --out <artifact-dir> [--no-vertical]
```

## Outputs

| File | Purpose |
|------|---------|
| `gwb-recap-w{n}-m{id}-1080p.mp4` | 1920×1080 @ ~30fps (browser capture), stereo silent AAC bed |
| `gwb-recap-w{n}-m{id}-vertical-1080x1920.mp4` | Letterboxed 9:16 derivative |
| `gwb-recap-w{n}-m{id}-poster.png` | Thumbnail from final card beat |
| `still-*.png` | Key moment stills |
| `scene-timings.json` | Scene in/out points for VO/music |
| `recap-w{n}-m{id}.config.json` | Full copy, stats, and assumptions used |

## Post-production

- Replace or mux audio using `scene-timings.json` scene boundaries.
- Title-safe margins are defined in `src/sceneTimings.mjs` (`titleSafe`).
- No NFL logos or broadcast footage — generic jersey colors + league buffalo art only.

## Art

Buffalo slots read `manifest/art.manifest.json` (placeholder SVG by default; set `mode: custom` and portrait paths when Imagine assets are ready). Generic jersey panels: **navy + green #11** (winner top scorer), **teal + #16** (loser starting QB) — no NFL logos.
