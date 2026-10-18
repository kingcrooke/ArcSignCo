# GWB Week 5 result cards

Light stone-gray cracked buffalo panels (PR #91 style, ~25% brighter via `prepare-assets.mjs`), cover-cropped into gold frames. Jerseys follow Sleeper Week 5 finals (winner top scorer, loser starting QB; Crooke always Lamar `#8` BAL).

```bash
node scripts/week5-sleeper-assert.mjs
node scripts/w5-result-cards/build-results-json.mjs
node scripts/w5-result-cards/prepare-assets.mjs
# add results-w5-m{1,2,5,6}-winner.jpg panels, then:
python3 scripts/w5-result-cards/normalize-panels.py
node scripts/w5-result-cards/render.mjs
node scripts/optimize-published-slides.mjs --only=results-w5-m1,...,results-w5-m6
```
