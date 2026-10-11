# GWB League Command Center

Static command center for the **GWB** REDRAFT Sleeper league (`1389375326257184768`). Pulls public Sleeper read APIs only — no backend, no secrets, no tracking.

## Features

- **Standings** — W-L-T, PF/PA, streak, rank (tiebreak: win%, then PF, then PA)
- **Power rankings** — transparent weighted formula with week-over-week movement
- **Weekly recaps** — scores, top scorers, bench misses, upset/blowout tags, template narratives
- **Mulligans** — per-manager status and weekly swap ledger from `mulligan-ledger.json`
- **Week graphics** — published slide gallery by NFL week

## Local development

```bash
npm install
npm run dev
```

App runs at `http://127.0.0.1:4317`.

## Tests

```bash
npm run test          # unit tests (fixture JSON from real Sleeper responses)
npm run build
npm run test:e2e      # Playwright against production build + live Sleeper API
```

## Deploy to Netlify

1. Push this repo to GitHub (or connect your existing repo).
2. In Netlify: **Add new site** → **Import an existing project**.
3. Build settings (also in `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Deploy. No environment variables required.

Optional: run `npm run preview` locally to verify the production bundle.

To refresh the live static path at `/gwb-fe006a16/` (Netlify publishes repo root with no GWB build step):

```bash
cd apps/gwb && npm run publish-static
```

Commit the updated `gwb-fe006a16/` folder with your PR.

## Data notes

- NFL player names are loaded once from `/players/nfl`, trimmed to needed fields, and cached in `localStorage` for 24 hours.
- Matchups are fetched per week through the current scored leg; empty or future weeks show a friendly empty state.
