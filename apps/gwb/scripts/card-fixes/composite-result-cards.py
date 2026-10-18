#!/usr/bin/env python3
"""Composite new buffalo panels into MAIN result cards (preserves baked text incl. HADI)."""
from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image

from shared_panels import cover_paste

GWB = Path(__file__).resolve().parents[2]
ROOT = GWB.parent.parent
CARD_FIXES = Path(__file__).resolve().parent
OUT_SRC = GWB / "scripts" / "slide-sources"

# Weeks 1–3 result inner illustration (remake-held/extract-assets.mjs)
WINNER_BOX = (100, 430, 480, 890)
LOSER_BOX = (700, 450, 1000, 820)


def main_from_git(card_id: str) -> Image.Image:
    rel = f"apps/gwb/public/slides/{card_id}.full.jpg"
    data = subprocess.check_output(["git", "show", f"main:{rel}"], cwd=ROOT)
    tmp = CARD_FIXES / ".tmp-main" / f"{card_id}.jpg"
    tmp.parent.mkdir(parents=True, exist_ok=True)
    tmp.write_bytes(data)
    return Image.open(tmp).convert("RGB")


def main() -> None:
    regen = json.loads((CARD_FIXES / "panel-fixes.json").read_text())
    by_card: dict[str, dict[str, Path]] = {}
    for job in regen["panels"]:
        if not job["cardId"].startswith("results-w"):
            continue
        by_card.setdefault(job["cardId"], {})[job["side"]] = CARD_FIXES / job["outFile"]

    for card_id, sides in sorted(by_card.items()):
        img = main_from_git(card_id)
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
