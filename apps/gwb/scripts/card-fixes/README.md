# GWB card fixes (Weeks 1–5)

Sleeper league `1389375326257184768`. Jersey rules:

- **Preview:** starting QB each week; Crooke always Lamar Jackson **#8 BAL**.
- **Result:** winner = top scorer among starters; loser = starting QB; Crooke always Lamar **#8**.

Art: PR #91 / #94 dual-ref img2img — **light granite** stone fur, **unique pose per panel**, numbers in fabric (not hidden by arms).

Spelling on touched cards: **HADY** (not HADI).

## Pipeline

```bash
node scripts/card-fixes/sleeper-facts.mjs
node scripts/card-fixes/build-panel-fixes.mjs
node scripts/card-fixes/build-panel-prompts.mjs
GEMINI_API_KEY=... node scripts/card-fixes/generate-panels.mjs   # or Cursor GenerateImage + generated/*.jpg

python3 scripts/card-fixes/mask_composite_cards.py   # mask fill into main card frames
python3 scripts/card-fixes/render-report-slides.py
# captions: results-w2-m2, vs-w5-m2 footer (Lawrence vs Cousins)

node scripts/optimize-published-slides.mjs --only=...   # includes vs-w5-m*
cp public/slides/* ../../../gwb-fe006a16/slides/

node scripts/card-fixes/build-contact-sheet-weeks.mjs
node scripts/card-fixes/build-panel-table.mjs
```

Do **not** use rectangle paste compositors or full W6 HTML re-renders for Week 4/5 preview cards.
