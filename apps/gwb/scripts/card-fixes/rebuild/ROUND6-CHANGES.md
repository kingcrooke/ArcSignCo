# Round 6 — layout, copy, report slides, panels

## A. Layout
- **Renderer:** `rebuild/render-all.mjs` now uses production templates: `result-template.mjs` (results), `w4-preview-cards/template.mjs`, `w5-matchup-cards/template.mjs` (gold bar, VS badge, glow frames, Bebas/Anton).
- **Proof:** `/opt/cursor/artifacts/gwb-layout-diff/*-live-vs-new.png` (27 cards, live left / new right).

## B. Copy reverts (live)
- BIGBLUE, ALTADEI, MNNY + mulligan arrow, `Hady's crown`, preview headlines via matchups (`NARKING` **vs** `STEVEN`).

## C. Report slides
- `render-report-live.py`: surgical text on main plates (w1 word swap; w2 Eric `1-1` + `37.2` only; w4 stat zone repaint for HADY/Manny closest game).

## D. Panels
- **8 keeper sides** dual-ref regenerated (w1-m1 Crooke L, w1-m2 Kayser W, w1-m3 Matt W, w1-m4 Jamil W, w2-m2 Narking W, w2-m5 Manny W, w3-m1 Crooke W, w3-m2 Hady W).
- **Art pass** regenerated for listed wrong-logo/fur/pose panels (see `install-generated-panels.mjs` log / `generated/*.jpg`).
- Zoom sheet: `/opt/cursor/artifacts/gwb-panel-zooms/panel-zoom-sheet.png`

## Not verified / residual risk
- Img2img may still miss jersey numbers or logos on some panels; manual QA on deploy-preview-95 recommended.
