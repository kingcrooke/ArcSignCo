# GWB League Command Center

Static command center for the **GWB** REDRAFT Sleeper league (`1389375326257184768`). Pulls public Sleeper read APIs only — no backend, no secrets, no tracking.

## Features

- **Standings** — W-L-T, PF/PA, streak, rank (tiebreak: win%, then PF, then PA)
- **Power rankings** — transparent weighted formula with week-over-week movement
- **Weekly recaps** — scores, top scorers, bench misses, upset/blowout tags, template narratives
- **Instagram feed PNGs** (1080×1350) — standings, power, and recap slides with one-click download and captions (`#FantasyFootball #NFL #Football #NYC #GWBFF`)

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

## Data notes

- NFL player names are loaded once from `/players/nfl`, trimmed to needed fields, and cached in `localStorage` for seven days.
- Matchups are fetched per week through the current scored leg; empty or future weeks show a friendly empty state.

## Instagram standards

Slide typography and layout follow the locked GWB feed standards (Anton hero, Bebas Neue labels, Inter body, ~56px margins, centered stack). See `uploads/SKILL_0af0.md`.
