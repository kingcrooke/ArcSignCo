# GWB card fixes (Weeks 1–5)

Sleeper league `1389375326257184768`. Jersey rules:

- **Preview:** starting QB each week; Crooke always Lamar Jackson **#8 BAL**.
- **Result:** winner = top scorer among starters; loser = starting QB; Crooke always Lamar **#8**.

Art: PR #91 / #94 dual-ref img2img — **light granite** stone fur, **unique pose per panel**, numbers in fabric (not hidden by arms).

Spelling on touched cards: **HADY** (not HADI).

## Pipeline (HTML rebuild — do not composite over baked JPGs)

```bash
node scripts/card-fixes/sleeper-facts.mjs
node scripts/card-fixes/build-panel-fixes.mjs
# Regen panels → card-fixes/generated/ or assets/ (dual-ref prompts)

python3 scripts/card-fixes/rebuild/extract-keeper-panels.py
node scripts/card-fixes/rebuild/build-results-meta.mjs
node scripts/card-fixes/render-round7.mjs

node scripts/optimize-published-slides.mjs --only=<touched ids>
# copy public/slides/* → gwb-fe006a16/slides/ for touched basenames only

node scripts/card-fixes/build-contact-sheet-weeks.mjs
node scripts/card-fixes/build-panel-table.mjs
```

Legacy mask/paste scripts (`mask_composite_cards.py`, `render-report-slides.py`) are **deprecated** for delivery.
