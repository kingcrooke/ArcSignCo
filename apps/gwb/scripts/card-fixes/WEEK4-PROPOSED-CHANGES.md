# Week 4 — proposed changes only (live deck unchanged)

Jesus approved **live Week 4** on `main`. Published assets under `apps/gwb/public/slides/` and `gwb-fe006a16/slides/` for `vs-m1`…`vs-m6` and `w4-slide-12` are **restored to `main`** on this branch. Proposed rebuilds live in `scripts/slide-sources/*.png` and side-by-sides in `week4-compare/`.

**Compare:** `node scripts/card-fixes/build-week4-compare.mjs` → `week4-compare/<id>-current-vs-proposed.jpg`, `ALL.jpg`.

**Not in scope:** `results-w4-m1`…`m6` and all other `w4-slide-*` except `w4-slide-12` proposal below.

---

## Published slides (proposal was reverted to live)

| File | What would change | Why |
|------|-------------------|-----|
| `apps/gwb/public/slides/vs-m1-narking-steven.full.jpg` | W5 matchup chrome + regen Steven/Narking panels | Round 8 W5 template + PR #96 tone |
| `apps/gwb/public/slides/vs-m1-narking-steven.full.webp` | WebP derivative of proposed PNG | optimize-published-slides |
| `apps/gwb/public/slides/vs-m1-narking-steven.thumb.jpg` | Thumbnail of proposed | optimize-published-slides |
| `apps/gwb/public/slides/vs-m1-narking-steven.thumb.webp` | Thumbnail WebP of proposed | optimize-published-slides |
| `apps/gwb/public/slides/vs-m2-kayser-frankie.full.jpg` | Same template/panel regen | W5 chrome + distinct poses |
| `apps/gwb/public/slides/vs-m2-kayser-frankie.full.webp` | WebP derivative | publish pipeline |
| `apps/gwb/public/slides/vs-m2-kayser-frankie.thumb.jpg` | Thumb | publish pipeline |
| `apps/gwb/public/slides/vs-m2-kayser-frankie.thumb.webp` | Thumb WebP | publish pipeline |
| `apps/gwb/public/slides/vs-m3-hadi-manny.full.jpg` | W5 template; **HADY** pill; regen panels | Spelling + stone-tone art |
| `apps/gwb/public/slides/vs-m3-hadi-manny.full.webp` | WebP derivative | publish pipeline |
| `apps/gwb/public/slides/vs-m3-hadi-manny.thumb.jpg` | Thumb | publish pipeline |
| `apps/gwb/public/slides/vs-m3-hadi-manny.thumb.webp` | Thumb WebP | publish pipeline |
| `apps/gwb/public/slides/vs-m4-jamil-matt.full.jpg` | W5 template; pose differentiation vs m3 | Preview pose rules |
| `apps/gwb/public/slides/vs-m4-jamil-matt.full.webp` | WebP derivative | publish pipeline |
| `apps/gwb/public/slides/vs-m4-jamil-matt.thumb.jpg` | Thumb | publish pipeline |
| `apps/gwb/public/slides/vs-m4-jamil-matt.thumb.webp` | Thumb WebP | publish pipeline |
| `apps/gwb/public/slides/vs-m5-mauricio-eric.full.jpg` | W5 template + regen panels | Round 8 rebuild |
| `apps/gwb/public/slides/vs-m5-mauricio-eric.full.webp` | WebP derivative | publish pipeline |
| `apps/gwb/public/slides/vs-m5-mauricio-eric.thumb.jpg` | Thumb | publish pipeline |
| `apps/gwb/public/slides/vs-m5-mauricio-eric.thumb.webp` | Thumb WebP | publish pipeline |
| `apps/gwb/public/slides/vs-m6-danny-crooke.full.jpg` | W5 template; Crooke BAL #8 regen | Lamar jersey, no star |
| `apps/gwb/public/slides/vs-m6-danny-crooke.full.webp` | WebP derivative | publish pipeline |
| `apps/gwb/public/slides/vs-m6-danny-crooke.thumb.jpg` | Thumb | publish pipeline |
| `apps/gwb/public/slides/vs-m6-danny-crooke.thumb.webp` | Thumb WebP | publish pipeline |
| `apps/gwb/public/slides/w4-slide-12.full.jpg` | W5 report-style stat slide (HADY/MANNY 6.77) | Sleeper closest-game stat |
| `apps/gwb/public/slides/w4-slide-12.full.webp` | WebP derivative | publish pipeline |
| `apps/gwb/public/slides/w4-slide-12.thumb.jpg` | Thumb | publish pipeline |
| `apps/gwb/public/slides/w4-slide-12.thumb.webp` | Thumb WebP | publish pipeline |
| `gwb-fe006a16/slides/vs-m1-narking-steven.full.jpg` | Mirror of proposed public asset | deploy sync |
| `gwb-fe006a16/slides/vs-m1-narking-steven.full.webp` | Mirror | deploy sync |
| `gwb-fe006a16/slides/vs-m1-narking-steven.thumb.jpg` | Mirror | deploy sync |
| `gwb-fe006a16/slides/vs-m1-narking-steven.thumb.webp` | Mirror | deploy sync |
| `gwb-fe006a16/slides/vs-m2-kayser-frankie.full.jpg` | Mirror | deploy sync |
| `gwb-fe006a16/slides/vs-m2-kayser-frankie.full.webp` | Mirror | deploy sync |
| `gwb-fe006a16/slides/vs-m2-kayser-frankie.thumb.jpg` | Mirror | deploy sync |
| `gwb-fe006a16/slides/vs-m2-kayser-frankie.thumb.webp` | Mirror | deploy sync |
| `gwb-fe006a16/slides/vs-m3-hadi-manny.full.jpg` | Mirror | deploy sync |
| `gwb-fe006a16/slides/vs-m3-hadi-manny.full.webp` | Mirror | deploy sync |
| `gwb-fe006a16/slides/vs-m3-hadi-manny.thumb.jpg` | Mirror | deploy sync |
| `gwb-fe006a16/slides/vs-m3-hadi-manny.thumb.webp` | Mirror | deploy sync |
| `gwb-fe006a16/slides/vs-m4-jamil-matt.full.jpg` | Mirror | deploy sync |
| `gwb-fe006a16/slides/vs-m4-jamil-matt.full.webp` | Mirror | deploy sync |
| `gwb-fe006a16/slides/vs-m4-jamil-matt.thumb.jpg` | Mirror | deploy sync |
| `gwb-fe006a16/slides/vs-m4-jamil-matt.thumb.webp` | Mirror | deploy sync |
| `gwb-fe006a16/slides/vs-m5-mauricio-eric.full.jpg` | Mirror | deploy sync |
| `gwb-fe006a16/slides/vs-m5-mauricio-eric.full.webp` | Mirror | deploy sync |
| `gwb-fe006a16/slides/vs-m5-mauricio-eric.thumb.jpg` | Mirror | deploy sync |
| `gwb-fe006a16/slides/vs-m5-mauricio-eric.thumb.webp` | Mirror | deploy sync |
| `gwb-fe006a16/slides/vs-m6-danny-crooke.full.jpg` | Mirror | deploy sync |
| `gwb-fe006a16/slides/vs-m6-danny-crooke.full.webp` | Mirror | deploy sync |
| `gwb-fe006a16/slides/vs-m6-danny-crooke.thumb.jpg` | Mirror | deploy sync |
| `gwb-fe006a16/slides/vs-m6-danny-crooke.thumb.webp` | Mirror | deploy sync |
| `gwb-fe006a16/slides/w4-slide-12.full.jpg` | Mirror | deploy sync |
| `gwb-fe006a16/slides/w4-slide-12.full.webp` | Mirror | deploy sync |
| `gwb-fe006a16/slides/w4-slide-12.thumb.jpg` | Mirror | deploy sync |
| `gwb-fe006a16/slides/w4-slide-12.thumb.webp` | Mirror | deploy sync |

## W4 preview generator (branch adds / changes vs main)

| File | What changes | Why |
|------|----------------|-----|
| `apps/gwb/scripts/card-fixes/w4-preview-cards/template.mjs` | W4 Playwright HTML template (legacy chrome) | Early round 6 path; superseded by W5 template in `render-all` |
| `apps/gwb/scripts/card-fixes/w4-preview-cards/matchups.json` | Copy/odds metadata for W4 previews | Feeds preview renderer |
| `apps/gwb/scripts/card-fixes/w4-preview-cards/render.mjs` | Standalone W4 render entry | Local QA |
| `apps/gwb/scripts/card-fixes/w4-preview-cards/normalize-panels.py` | Panel crop/normalize | Art pipeline |
| `apps/gwb/scripts/card-fixes/w4-preview-cards/output/vs-m1-narking-steven.png` | Render output snapshot | QA artifact |
| `apps/gwb/scripts/card-fixes/w4-preview-cards/output/vs-m2-kayser-frankie.png` | Render output snapshot | QA artifact |
| `apps/gwb/scripts/card-fixes/w4-preview-cards/output/vs-m3-hadi-manny.png` | Render output snapshot | QA artifact |
| `apps/gwb/scripts/card-fixes/w4-preview-cards/output/vs-m4-jamil-matt.png` | Render output snapshot | QA artifact |
| `apps/gwb/scripts/card-fixes/w4-preview-cards/output/vs-m5-mauricio-eric.png` | Render output snapshot | QA artifact |
| `apps/gwb/scripts/card-fixes/w4-preview-cards/output/vs-m6-danny-crooke.png` | Render output snapshot | QA artifact |
| `apps/gwb/scripts/card-fixes/w4-preview-cards/output/.tmp-vs-m1-narking-steven.html` | Temp HTML for screenshot | Playwright |
| `apps/gwb/scripts/card-fixes/w4-preview-cards/output/.tmp-vs-m2-kayser-frankie.html` | Temp HTML | Playwright |
| `apps/gwb/scripts/card-fixes/w4-preview-cards/output/.tmp-vs-m3-hadi-manny.html` | Temp HTML | Playwright |
| `apps/gwb/scripts/card-fixes/w4-preview-cards/output/.tmp-vs-m4-jamil-matt.html` | Temp HTML | Playwright |
| `apps/gwb/scripts/card-fixes/w4-preview-cards/output/.tmp-vs-m5-mauricio-eric.html` | Temp HTML | Playwright |
| `apps/gwb/scripts/card-fixes/w4-preview-cards/output/.tmp-vs-m6-danny-crooke.html` | Temp HTML | Playwright |
| `apps/gwb/scripts/card-fixes/extract-w4-preview-panels.py` | Extract panels from live JPGs | Bootstrap assets |

## W4 panel assets (proposed art)

| File | What changes | Why |
|------|----------------|-----|
| `apps/gwb/scripts/card-fixes/w4-preview-assets/vs-m1-narking-steven-left.jpg` | Regen Narking panel | PR #96 tone |
| `apps/gwb/scripts/card-fixes/w4-preview-assets/vs-m1-narking-steven-right.jpg` | Regen Steven; no wordmark | Art rules |
| `apps/gwb/scripts/card-fixes/w4-preview-assets/vs-m2-kayser-frankie-left.jpg` | Regen Kayser | Stone buffalo |
| `apps/gwb/scripts/card-fixes/w4-preview-assets/vs-m2-kayser-frankie-right.jpg` | Regen Frankie | Stone buffalo |
| `apps/gwb/scripts/card-fixes/w4-preview-assets/vs-m3-hadi-manny-left.jpg` | Regen Hady | HADY spelling in UI |
| `apps/gwb/scripts/card-fixes/w4-preview-assets/vs-m3-hadi-manny-right.jpg` | Regen Manny | Stone buffalo |
| `apps/gwb/scripts/card-fixes/w4-preview-assets/vs-m4-jamil-matt-left.jpg` | Regen Jamil | Distinct pose |
| `apps/gwb/scripts/card-fixes/w4-preview-assets/vs-m4-jamil-matt-right.jpg` | Regen Matt | Stone buffalo |
| `apps/gwb/scripts/card-fixes/w4-preview-assets/vs-m5-mauricio-eric-left.jpg` | Regen Mauricio | Preview art |
| `apps/gwb/scripts/card-fixes/w4-preview-assets/vs-m5-mauricio-eric-right.jpg` | Regen Eric | Preview art |
| `apps/gwb/scripts/card-fixes/w4-preview-assets/vs-m6-danny-crooke-left.jpg` | Regen Danny | Preview art |
| `apps/gwb/scripts/card-fixes/w4-preview-assets/vs-m6-danny-crooke-right.jpg` | Regen Crooke BAL #8 | No Cowboys star |
| `apps/gwb/scripts/card-fixes/generated/crooke-BAL-8-w4.jpg` | Generated intermediate | img2img output |
| `apps/gwb/scripts/card-fixes/generated/danny-JAX-16-w4.jpg` | Generated intermediate | img2img output |
| `apps/gwb/scripts/card-fixes/generated/eric-DAL-4-w4.jpg` | Generated intermediate | img2img output |
| `apps/gwb/scripts/card-fixes/generated/frankie-DET-16-w4.jpg` | Generated intermediate | img2img output |
| `apps/gwb/scripts/card-fixes/generated/hady-MIN-1-w4.jpg` | Generated intermediate | img2img output |
| `apps/gwb/scripts/card-fixes/generated/jamil-PHI-1-w4.jpg` | Generated intermediate | img2img output |
| `apps/gwb/scripts/card-fixes/generated/kayser-LAR-9-w4.jpg` | Generated intermediate | img2img output |
| `apps/gwb/scripts/card-fixes/generated/manny-KC-15-w4.jpg` | Generated intermediate | img2img output |
| `apps/gwb/scripts/card-fixes/generated/matt-BUF-17-w4.jpg` | Generated intermediate | img2img output |
| `apps/gwb/scripts/card-fixes/generated/mauricio-CAR-9-w4.jpg` | Generated intermediate | img2img output |
| `apps/gwb/scripts/card-fixes/generated/narking-SF-13-w4.jpg` | Generated intermediate | img2img output |
| `apps/gwb/scripts/card-fixes/generated/steven-SEA-14-w4.jpg` | Generated intermediate | img2img output |

## Slide sources & shared template (feeds proposed W4 renders)

| File | What changes | Why |
|------|----------------|-----|
| `apps/gwb/scripts/slide-sources/vs-m1-narking-steven.png` | Proposed full card PNG | `render-all.mjs` + W5 matchup template |
| `apps/gwb/scripts/slide-sources/vs-m2-kayser-frankie.png` | Proposed PNG | Same |
| `apps/gwb/scripts/slide-sources/vs-m3-hadi-manny.png` | Proposed PNG | Same |
| `apps/gwb/scripts/slide-sources/vs-m4-jamil-matt.png` | Proposed PNG | Same |
| `apps/gwb/scripts/slide-sources/vs-m5-mauricio-eric.png` | Proposed PNG | Same |
| `apps/gwb/scripts/slide-sources/vs-m6-danny-crooke.png` | Proposed PNG | Same |
| `apps/gwb/scripts/slide-sources/w4-slide-12.png` | Proposed report slide PNG | W5 report layout |
| `apps/gwb/scripts/w5-matchup-cards/template.mjs` | Live `vs-w5-m1` chrome (gold bar, asymmetric pills) | Used to render proposed `vs-m*` |

## Compare artifacts (this PR)

| File | What changes | Why |
|------|----------------|-----|
| `apps/gwb/scripts/card-fixes/week4-compare/vs-m1-narking-steven-current-vs-proposed.jpg` | Live vs proposed | Review |
| `apps/gwb/scripts/card-fixes/week4-compare/vs-m2-kayser-frankie-current-vs-proposed.jpg` | Live vs proposed | Review |
| `apps/gwb/scripts/card-fixes/week4-compare/vs-m3-hadi-manny-current-vs-proposed.jpg` | Live vs proposed | Review |
| `apps/gwb/scripts/card-fixes/week4-compare/vs-m4-jamil-matt-current-vs-proposed.jpg` | Live vs proposed | Review |
| `apps/gwb/scripts/card-fixes/week4-compare/vs-m5-mauricio-eric-current-vs-proposed.jpg` | Live vs proposed | Review |
| `apps/gwb/scripts/card-fixes/week4-compare/vs-m6-danny-crooke-current-vs-proposed.jpg` | Live vs proposed | Review |
| `apps/gwb/scripts/card-fixes/week4-compare/w4-slide-12-current-vs-proposed.jpg` | Live vs proposed | Review |
| `apps/gwb/scripts/card-fixes/week4-compare/ALL.jpg` | Combined sheet | Review |
| `apps/gwb/scripts/card-fixes/build-week4-compare.mjs` | Builder script | Regenerate compares |
| `apps/gwb/scripts/card-fixes/WEEK4-PROPOSED-CHANGES.md` | This manifest | Jesus request |
