#!/usr/bin/env python3
"""Apply only LIVE-TEXT-DIFF.md text deltas onto composited slide-sources PNGs."""
from __future__ import annotations

import runpy
import subprocess
from pathlib import Path

GWB = Path(__file__).resolve().parents[2]
ROOT = GWB.parent.parent
CARD = Path(__file__).resolve().parent
SRC = GWB / "scripts/slide-sources"

R = runpy.run_path(str(GWB / "scripts/repair-held-slides.py"))
load_rgb = R["load_rgb"]
replace_word_in_box = R["replace_word_in_box"]
replace_line_in_box = R["replace_line_in_box"]
sample_text_color = R["sample_text_color"]


def save(img, name: str) -> None:
    img.save(SRC / name, optimize=True)


def patch_hady_pill(card_id: str, box: tuple[int, int, int, int], label: str) -> None:
    path = SRC / f"{card_id}.png"
    if not path.is_file():
        return
    img = load_rgb(path)
    gold = sample_text_color(img, box)
    replace_line_in_box(img, box, label, "bebas", gold)
    save(img, f"{card_id}.png")


def patch_vs_w5_taglines() -> None:
    fixes = {
        "vs-w5-m2": (
            (72, 1195, 1008, 1245),
            "Lawrence vs Cousins • Manny has lost two straight",
        ),
        "vs-w5-m4": (
            (72, 1195, 1008, 1245),
            "Maye vs Goff • Frankie's first win came in Week 4",
        ),
    }
    for card_id, (box, line) in fixes.items():
        path = SRC / f"{card_id}.png"
        if not path.is_file():
            continue
        img = load_rgb(path)
        muted = sample_text_color(img, box)
        replace_line_in_box(img, box, line, "inter-semibold", muted)
        save(img, f"{card_id}.png")


def main() -> None:
    patch_hady_pill("vs-m3-hadi-manny", (78, 318, 268, 362), "HADY 2-1")
    patch_vs_w5_taglines()
    print("live-text-diff patches applied (report slides unchanged on main)")


if __name__ == "__main__":
    main()
