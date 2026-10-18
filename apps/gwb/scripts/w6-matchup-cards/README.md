# GWB Week 6 matchup cards

Rebuilds `vs-w6-m1` … `vs-w6-m6` (1080×1350) with v5 cracked-stone buffalo art, neutral VS layout, and Sleeper Week 6 starting-QB jerseys (Crooke always Lamar Jackson).

```bash
# 1) Place generated panel JPGs in assets/ (vs-w6-mN-left.jpg, -right.jpg), then:
python3 lighten-stone-fur.py   # optional: ~25% lighter stone fur vs raw v5 panels
python3 normalize-panels.py
node render.mjs

# 2) Publish derivatives
cd ../.. && node scripts/optimize-vs-w6-only.mjs
cp public/slides/vs-w6-m*.{full.jpg,full.webp,thumb.jpg,thumb.webp} ../../../gwb-fe006a16/slides/

# 3) QA
node scripts/w6-matchup-cards/qa.mjs
```

Matchup metadata lives in `matchups.json` (names, records, bowl titles, win-% from season PF).
