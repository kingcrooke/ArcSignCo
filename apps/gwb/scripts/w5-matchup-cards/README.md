# GWB Week 5 matchup cards

Rebuilds `vs-w5-m1` … `vs-w5-m6` (1080×1350) with v5 cracked-stone buffalo art, neutral VS layout, and Sleeper Week 5 starting-QB jerseys.

```bash
# 1) Optional: refresh manager reference crops from approved vs-m slides
node extract-references.mjs

# 2) Place generated panel JPGs in assets/ (vs-w5-mN-left.jpg, -right.jpg), then:
python3 normalize-panels.py
node render.mjs

# 3) Publish derivatives
cd ../.. && node scripts/optimize-published-slides.mjs --only=vs-w5-m1,vs-w5-m2,vs-w5-m3,vs-w5-m4,vs-w5-m5,vs-w5-m6
cp public/slides/vs-w5-m*.{full.jpg,full.webp,thumb.jpg,thumb.webp} ../../../gwb-fe006a16/slides/

# 4) QA
node scripts/w5-matchup-cards/qa.mjs
```

Matchup metadata lives in `matchups.json` (names, records, bowl titles, win-% from season PF).
