#!/usr/bin/env python3
"""Composite buffalo panels into MAIN preview cards (preserve original layout/text)."""
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
PUBLIC = GWB / "public" / "slides"

# Inner buffalo art only (inside gold frames; measured from main branch)
W4_LEFT = (100, 450, 429, 1049)
W4_RIGHT = (610, 450, 1006, 1049)
# y0 below name pills (main art fills frame under pill overlay)
W5_LEFT = (48, 375, 433, 979)
W5_RIGHT = (476, 375, 1024, 979)

REGEN = json.loads((CARD_FIXES / "panel-fixes.json").read_text())


def main_from_git(card_id: str) -> Image.Image:
    rel = f"apps/gwb/public/slides/{card_id}.full.jpg"
    data = subprocess.check_output(["git", "show", f"main:{rel}"], cwd=ROOT)
    tmp = CARD_FIXES / ".tmp-main" / f"{card_id}.jpg"
    tmp.parent.mkdir(parents=True, exist_ok=True)
    tmp.write_bytes(data)
    return Image.open(tmp).convert("RGB")


def panel_path(job: dict) -> Path:
    rel = job["outFile"]
    candidates = [
        CARD_FIXES / rel,
        CARD_FIXES / rel.replace("../", ""),
        GWB / "scripts" / rel.lstrip("./"),
        GWB / "scripts" / rel.replace("../", ""),
    ]
    for p in candidates:
        if p.is_file():
            return p
    raise FileNotFoundError(rel)


def touched_previews() -> set[str] | None:
    raw = __import__("os").environ.get("GWB_ROUND7_PREVIEWS", "").strip()
    if not raw:
        return None
    return {s.strip() for s in raw.split(",") if s.strip()}


def main() -> None:
    allow = touched_previews()
    by_card: dict[str, list] = {}
    for job in REGEN["panels"]:
        cid = job["cardId"]
        if not cid.startswith("vs-"):
            continue
        if allow is not None and cid not in allow:
            continue
        by_card.setdefault(cid, []).append(job)

    for card_id, jobs in sorted(by_card.items()):
        img = main_from_git(card_id)
        for job in jobs:
            if card_id.startswith("vs-w5"):
                box = W5_LEFT if job["side"] == "left" else W5_RIGHT
            else:
                box = W4_LEFT if job["side"] == "left" else W4_RIGHT
            panel = Image.open(panel_path(job)).convert("RGB")
            cover_paste(img, panel, box)
        dest = OUT_SRC / f"{card_id}.png"
        img.save(dest, optimize=True)
        print("preview composited", dest.name, [j["side"] for j in jobs])


if __name__ == "__main__":
    main()
