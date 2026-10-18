# Round 8b — VS chrome, report deck style, PR #96 panels

# Round 8 — W5 template rebuild (no compositing)

**Pipeline:** `rebuild/render-all.mjs` → `optimize-published-slides.mjs --only=…` → `sync-published-slides.mjs` (MD5 match `public/slides` ↔ `gwb-fe006a16/slides`).

**Contact sheets:** `/opt/cursor/artifacts/gwb-week-{1..5}-old-vs-new-*.png`

## Round 8b deltas

| Area | Change |
|------|--------|
| VS template | `w5-matchup-cards/template.mjs` matches live `vs-w5-m1` chrome (gold top bar, gold left / grey right frame, pink right pill, 132px VS badge, 32px odds bar). `verify-vs-chrome.mjs` masked mean diff ≈17 vs live. |
| Results caption | `.tagline` under score bar (W5 `results-w5-m1` style, uppercase). |
| Reports | W5 report deck layout (`remake-held/shared-css`): dual cards + info stack (w1), cover + hero (w2), stat grid + 6.77 hero fill (w4). |
| Art | All 48 `panel-fixes` panels regenerated via PR #96 tone ref + GenerateImage (`panel-prompts-pr96.json` + remainder). Tone sheet: `gwb-panel-tone-vs-w5m1.png`. |
| Text | `results-w1-m6` midTitle `MNNY SURVIVES BY 4`; w1-slide `Fourth-highest`. |

## Global

| Area | Change |
|------|--------|
| Layout | All 18 W1–W3 results use `result-template.mjs` (W5 results style). All 8 preview cards use `w5-matchup-cards/template.mjs` with `live-card-copy.json` odds labels (not `matchups.json`). |
| Compositing | Removed from delivery path; full HTML + panel art only. |
| Text | Live copy from `live-card-copy.json`; MANNY on pills/scores; MNNY only in taglines/mid titles where live has it; HADY spelling; no extra tagline lines on results. |
| Reports | `report-templates.mjs` + Playwright (not `render-report-live.py`). |

## Per card

| Card | What changed |
|------|----------------|
| `results-w1-m1` … `results-w1-m6` | Full W5 results card rebuild; granite panel art; live text. |
| `results-w1-m6` | Winner pill **MANNY** (was MNNY on live plate). |
| `results-w1-m2` | W5 layout; Kayser W / Hady L panels. |
| `results-w2-m2` … `results-w2-m6` | Full W5 results rebuild. |
| `results-w2-m5` | Winner pill **MANNY**; mid title keeps **MNNY**. |
| `results-w3-m1` … `results-w3-m5` | Full W5 results rebuild. |
| `results-w3-m2` | Hady W (SEA #11) / Danny L (JAX). |
| `vs-m1` … `vs-m6` | W4 previews → W5 matchup template; live odds order (favourite first in bar labels). |
| `vs-m3-hadi-manny` | Pill **HADY** (Sleeper diff). |
| `vs-w5-m2` | W5 matchup template; tagline Lawrence vs Cousins; **59/41** bar. |
| `vs-w5-m4` | W5 matchup template; Maye vs Goff tagline; **54/46** bar. |
| `w1-slide-09` | HTML rebuild; Matt quotes; **fourth-highest** caption. |
| `w2-slide-06` | HTML rebuild; title **2-0 AND UNEXPLAINED**; Eric **1-1**; Amon-Ra **37.2**; live lines kept (**is undefeated** pending Jesus). |
| `w4-slide-12` | HTML rebuild; **HADY 141.65 / MANNY 134.88 / 6.77**; STAT OF THE WEEK once; no Mauricio/Narking small print. |

## Untouched (per scope)

Week 6, `results-w5-*`, W5 report deck, JS bundle.
