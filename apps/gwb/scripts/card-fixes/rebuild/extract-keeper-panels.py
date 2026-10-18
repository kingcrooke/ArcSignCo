#!/usr/bin/env python3
"""Crop keeper panels from main published JPGs (sides not in panel-fixes.json)."""
from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[4]
GWB = ROOT / "apps" / "gwb"
CARD = Path(__file__).resolve().parents[1]
FACTS = CARD / "panel-fixes.json"
OUT = Path(__file__).resolve().parent / "keepers"
OUT.mkdir(parents=True, exist_ok=True)

# reuse geometry from frame_masks.py
W4_PREVIEW = {"left": (92, 368, 504, 948), "right": (576, 368, 988, 948)}
W5_PREVIEW = {"left": (52, 368, 512, 982), "right": (568, 368, 1028, 982)}
RESULT_WINNER = (108, 468, 472, 878)
RESULT_LOSER = (708, 488, 992, 828)


def main_slide(card_id: str) -> Image.Image:
    rel = f"apps/gwb/public/slides/{card_id}.full.jpg"
    data = subprocess.check_output(["git", "show", f"main:{rel}"], cwd=ROOT)
    tmp = OUT / f".src-{card_id}.jpg"
    tmp.write_bytes(data)
    return Image.open(tmp).convert("RGB")


def crop(img: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
    return img.crop(box)


def regen_sides() -> set[tuple[str, str]]:
    data = json.loads(FACTS.read_text())
    out: set[tuple[str, str]] = set()
    for p in data["panels"]:
        out.add((p["cardId"], p["side"]))
    return out


def boxes_for(card_id: str) -> dict[str, tuple[int, int, int, int]]:
    if card_id.startswith("results-"):
        return {"winner": RESULT_WINNER, "loser": RESULT_LOSER}
    if card_id.startswith("vs-w5"):
        return W5_PREVIEW
    if card_id.startswith("vs-m"):
        return W4_PREVIEW
    return {}


TOUCHED = [
    *[f"results-w1-m{i}" for i in range(1, 7)],
    *[f"results-w2-m{i}" for i in range(2, 7)],
    *[f"results-w3-m{i}" for i in range(1, 6)],
    "vs-m1-narking-steven",
    "vs-m2-kayser-frankie",
    "vs-m3-hadi-manny",
    "vs-m4-jamil-matt",
    "vs-m5-mauricio-eric",
    "vs-m6-danny-crooke",
    "vs-w5-m2",
    "vs-w5-m4",
]


def main() -> None:
    regen = regen_sides()
    for card_id in TOUCHED:
        boxes = boxes_for(card_id)
        if not boxes:
            continue
        img = main_slide(card_id)
        for side, box in boxes.items():
            if (card_id, side) in regen:
                continue
            dest = OUT / f"{card_id}-{side}.jpg"
            crop(img, box).save(dest, quality=92)
            print("keeper", dest.name)


if __name__ == "__main__":
    main()
