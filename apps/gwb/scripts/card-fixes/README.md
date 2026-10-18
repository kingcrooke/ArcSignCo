# GWB card fixes (Weeks 1–5)

Sleeper league `1389375326257184768`. Jersey rules:

- **Preview:** starting QB each week; Crooke always Lamar Jackson **#8 BAL**.
- **Result:** winner = top scorer among starters; loser = starting QB; Crooke always Lamar **#8**.

Art: PR #91 stone/cracked buffalo, **light stone gray** fur (~20–30% lighter than dark stone), 3:4 cover crop, bold jersey numbers.

## Pipeline

```bash
node scripts/card-fixes/sleeper-facts.mjs
node scripts/card-fixes/build-panel-fixes.mjs
# panel JPGs → card-fixes/assets, w4-preview-assets, w5-matchup-cards/assets
python3 scripts/card-fixes/composite-result-cards.py   # W1–3 results (keeps HADI text)
cd scripts/card-fixes/w4-preview-cards && python3 normalize-panels.py && node render.mjs
# w5: normalize + render vs-w5-m2 / m4
python3 scripts/card-fixes/fix-report-slides.py
node scripts/optimize-published-slides.mjs --only=...
node scripts/card-fixes/build-contact-sheet.mjs
```

Do **not** modify Week 6 cards or baked **HADI** text on older result art (compositing preserves headlines).
