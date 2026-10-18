#!/usr/bin/env python3
"""Clean full-zone text re-renders for report slides + captions (no stamping)."""
from __future__ import annotations

import json
import runpy
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

GWB = Path(__file__).resolve().parents[2]
ROOT = GWB.parent.parent
CARD_FIXES = Path(__file__).resolve().parent
SRC = GWB / "scripts/slide-sources"
FACTS = json.loads((CARD_FIXES / "sleeper-facts.json").read_text())

R = runpy.run_path(str(GWB / "scripts/repair-held-slides.py"))
load_rgb = R["load_rgb"]
inpaint_region = R["inpaint_region"]
draw_text = R["draw_text"]
replace_line_in_box = R["replace_line_in_box"]
sample_text_color = R["sample_text_color"]
FontSpec = R["FontSpec"]
fit_size = R["fit_size"]
text_size = R["text_size"]


def main_slide(card_id: str) -> Image.Image:
    rel = f"apps/gwb/public/slides/{card_id}.full.jpg"
    data = subprocess.check_output(["git", "show", f"main:{rel}"], cwd=ROOT)
    tmp = CARD_FIXES / ".tmp-main" / f"{card_id}.jpg"
    tmp.parent.mkdir(parents=True, exist_ok=True)
    tmp.write_bytes(data)
    return load_rgb(tmp)


def save(img: Image.Image, name: str) -> None:
    img.save(SRC / name, optimize=True)


def draw_centered_box(img, box, text, family, fill):
    x0, y0, x1, y1 = box
    h = y1 - y0
    size = fit_size(family, text, target_h=h - 6, min_s=14, max_s=72)
    spec = FontSpec(family, size, fill)
    tw, th = text_size(text, spec)
    x = x0 + (x1 - x0 - tw) // 2
    y = y0 + (h - th) // 2
    draw_text(img, (x, y), text, spec)


def fix_w1_slide_09() -> None:
    img = main_slide("w1-slide-09")
    muted = sample_text_color(img, (200, 400, 800, 500))
    inpaint_region(img, (72, 380, 1000, 520))
    draw_centered_box(
        img,
        (72, 400, 1000, 480),
        "Narking's 158.17 was the fourth-highest Week 1 score in league history.",
        "inter-semibold",
        muted,
    )
    save(img, "w1-slide-09.png")


def fix_w2_slide_06() -> None:
    img = main_slide("w2-slide-06")
    white = (255, 255, 255)
    muted = sample_text_color(img, (72, 500, 900, 600))
    inpaint_region(img, (72, 180, 1000, 900))
    draw_text(img, (72, 210), "ERIC IS 1-1 AFTER WEEK 2", FontSpec("anton", 52, white))
    draw_text(
        img,
        (72, 420),
        "Not undefeated — Eric split after losing to Manny.",
        FontSpec("inter-semibold", 28, muted),
    )
    draw_text(
        img,
        (72, 480),
        "Amon-Ra St. Brown scored 37.2 in Week 2 (not 44.00).",
        FontSpec("inter-semibold", 28, muted),
    )
    save(img, "w2-slide-06.png")


def fix_w4_slide_12() -> None:
    img = main_slide("w4-slide-12")
    closest = FACTS["margins"]["w4"][0]
    margin = f"{closest['margin']:.2f}"
    white = (255, 255, 255)
    gold = sample_text_color(img, (400, 520, 680, 600))
    muted = sample_text_color(img, (72, 700, 1000, 900))
    inpaint_region(img, (72, 280, 1008, 1050))
    draw_text(img, (72, 300), "STAT OF THE WEEK", FontSpec("bebas", 36, muted))
    draw_text(
        img,
        (72, 400),
        f"{closest['winner'].upper()} {closest['winnerPts']:.2f}",
        FontSpec("anton", 48, white),
    )
    draw_text(
        img,
        (72, 490),
        f"{closest['loser'].upper()} {closest['loserPts']:.2f}",
        FontSpec("anton", 48, white),
    )
    draw_centered_box(img, (300, 580, 780, 700), margin, "anton", gold)
    draw_text(
        img,
        (72, 720),
        f"Closest game of Week 4: {closest['winner']} over {closest['loser']} by {margin}.",
        FontSpec("inter-semibold", 26, muted),
    )
    draw_text(
        img,
        (72, 780),
        "Mauricio edged Narking by 0.03 in total points — not the same as matchup margin.",
        FontSpec("inter-semibold", 24, muted),
    )
    save(img, "w4-slide-12.png")


def fix_results_w2_m2_caption() -> None:
    path = SRC / "results-w2-m2.png"
    if not path.is_file():
        return
    img = load_rgb(path)
    muted = sample_text_color(img, (72, 1180, 1000, 1250))
    inpaint_region(img, (72, 1165, 1008, 1255))
    draw_centered_box(
        img,
        (72, 1175, 1008, 1245),
        "Brock Purdy 49.0 — Narking climbs to 1-1",
        "inter-semibold",
        muted,
    )
    save(img, "results-w2-m2.png")


def fix_vs_w5_m2_footer() -> None:
    path = SRC / "vs-w5-m2.png"
    if not path.is_file():
        return
    img = load_rgb(path)
    muted = sample_text_color(img, (72, 1180, 900, 1260))
    inpaint_region(img, (72, 1188, 1008, 1248))
    draw_centered_box(
        img,
        (72, 1198, 1008, 1238),
        "Lawrence vs Cousins • Manny has lost two straight",
        "inter-semibold",
        muted,
    )
    save(img, "vs-w5-m2.png")


def main() -> None:
    fix_w1_slide_09()
    fix_w2_slide_06()
    fix_w4_slide_12()
    print("report slides rebuilt from main plates")


if __name__ == "__main__":
    main()
