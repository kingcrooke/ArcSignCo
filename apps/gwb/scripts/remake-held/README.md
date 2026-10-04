# Held-slide fresh renders

Rebuilds the eight Hadi slides from HTML/CSS (Playwright screenshot at 1080×1350) instead of patching baked-in “Hady” pixels.

```bash
# Populate sources/ once from git (pre-repair masters at c97b1ed):
#   apps/gwb/public/slides/<id>.full.jpg → scripts/remake-held/sources/<id>.jpg

npm run remake-held-slides
npm run optimize-slides   # prefers docs/gwb-remade-slides/*.png
```

QA: Tesseract must not find “Hady”; side-by-sides land in `/opt/cursor/artifacts/gwb-slide-remakes/`.
