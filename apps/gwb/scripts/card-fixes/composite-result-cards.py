#!/usr/bin/env python3
"""Composite new buffalo panels into existing result cards (preserves baked text incl. HADI)."""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

GWB = Path(__file__).resolve().parents[2]
CARD_FIXES = Path(__file__).resolve().parent
ASSETS = CARD_FIXES / "assets"
PUBLIC = GWB / "public" / "slides"
OUT_SRC = GWB / "scripts" / "slide-sources"
# w4-style result panel frames (1080×1350)
WINNER_BOX = (36, 312, 524, 972)  # x0,y0,x1,y1
LOSER_BOX = (556, 312, 1044, 972)


def cover_paste(base: Image.Image, panel: Image.Image, box: tuple[int, int, int, int]) -> None:
    x0, y0, x1, y1 = box
    tw, th = x1 - x0, y1 - y0
    pw, ph = panel.size
    scale = max(tw / pw, th / ph)
    nw, nh = int(pw * scale), int(ph * scale)
    resized = panel.resize((nw, nh), Image.Resampling.LANCZOS)
    cx = (nw - tw) // 2
    cy = int((nh - th) * 0.12)  # bias horns high
    crop = resized.crop((cx, cy, cx + tw, cy + th))
    base.paste(crop, (x0, y0))


def main() -> None:
    regen_path = CARD_FIXES / "panel-fixes.json"
    regen = json.loads(regen_path.read_text())
    by_card: dict[str, dict[str, Path]] = {}
    for job in regen["panels"]:
        if not job["cardId"].startswith("results-w"):
            continue
        by_card.setdefault(job["cardId"], {})[job["side"]] = CARD_FIXES / job["outFile"]

    for card_id, sides in sorted(by_card.items()):
        src = PUBLIC / f"{card_id}.full.jpg"
        if not src.is_file():
            raise SystemExit(f"missing {src}")
        img = Image.open(src).convert("RGB")
        if "winner" in sides:
            panel = Image.open(sides["winner"]).convert("RGB")
            cover_paste(img, panel, WINNER_BOX)
        if "loser" in sides:
            panel = Image.open(sides["loser"]).convert("RGB")
            cover_paste(img, panel, LOSER_BOX)
        dest = OUT_SRC / f"{card_id}.png"
        img.save(dest, optimize=True)
        print("composited", dest.name)


if __name__ == "__main__":
    main()
