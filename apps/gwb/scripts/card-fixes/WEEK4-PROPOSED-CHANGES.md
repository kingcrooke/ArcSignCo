# Week 4 — Jesus decision (PR #95)

## Approved and published

**Six Week 4 preview cards** (`vs-m1-narking-steven` … `vs-m6-danny-crooke`) use the **W5 matchup template** + PR #96 panel art. Published in `apps/gwb/public/slides/` and `gwb-fe006a16/slides/` (full + thumb, JPG + WebP). Byte match the **`a576859`** published set.

| Basename | What changed vs `main` | Why |
|----------|------------------------|-----|
| `vs-m1-narking-steven` | W5 chrome; regen Steven/Narking panels | Approved W4 preview refresh |
| `vs-m2-kayser-frankie` | W5 chrome; distinct poses | Approved |
| `vs-m3-hadi-manny` | W5 chrome; **HADY** pill spelling; regen panels | Approved |
| `vs-m4-jamil-matt` | W5 chrome; pose differentiation | Approved |
| `vs-m5-mauricio-eric` | W5 chrome; regen panels | Approved |
| `vs-m6-danny-crooke` | W5 chrome; Crooke BAL #8 regen | Approved |

**Compare (historical):** `node scripts/card-fixes/build-week4-compare.mjs` → `week4-compare/<id>-current-vs-proposed.jpg` and `ALL.jpg` (live `main` vs proposed PNG sources for the six VS cards only).

## Reverted to `main` (unchanged)

**`w4-slide-12`** — Stat of the Week (**Mauricio 141.24 / Narking 141.21 / 0.03**) stays **byte-identical to `origin/main`** in both slide trees. No generator, no `slide-sources/w4-slide-12.png`, no w4-slide-12 compare sheet.

## Not in scope

`results-w4-m1`…`m6` and all other `w4-slide-*` except the six VS cards above.

## Branch-only tooling (not deployed slides)

W4 preview pipeline artifacts under `card-fixes/w4-preview-*`, `generated/*-w4.jpg`, and `slide-sources/vs-m*.png` support rebuild/compare; they do not replace published JPG/WebP except via the normal publish flow for the six approved VS IDs.
