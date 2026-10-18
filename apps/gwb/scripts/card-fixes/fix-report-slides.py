#!/usr/bin/env python3
"""Text fixes for w1-slide-09, w2-slide-06, w4-slide-12; results-w2-m2 caption."""
from __future__ import annotations

import json
import runpy
from pathlib import Path

GWB = Path(__file__).resolve().parents[2]
R = runpy.run_path(str(GWB / "scripts" / "repair-held-slides.py"))
SRC = GWB / "scripts/slide-sources"
FACTS = json.loads((Path(__file__).parent / "sleeper-facts.json").read_text())

load_rgb = R["load_rgb"]


def save(img, path: Path) -> None:
    img.save(path, optimize=True)

replace_word_in_box = R["replace_word_in_box"]
replace_line_in_box = R["replace_line_in_box"]
sample_text_color = R["sample_text_color"]
clear_text_area = R["clear_text_area"]
draw_text = R["draw_text"]
FontSpec = R["FontSpec"]


def fix_w1_slide_09() -> None:
    path = SRC / "w1-slide-09.png"
    img = load_rgb(path)
    fill = sample_text_color(img, (200, 400, 800, 500))
    replace_word_in_box(img, (180, 400, 420, 470), "fourth-highest", "inter-semibold", fill)
    save(img, path)


def fix_w2_slide_06() -> None:
    path = SRC / "w2-slide-06.png"
    img = load_rgb(path)
    white = (255, 255, 255)
    muted = sample_text_color(img, (72, 500, 900, 600))
    replace_line_in_box(img, (72, 200, 1000, 320), "ERIC IS 1-1 AFTER WEEK 2", "anton", white)
    clear_text_area(img, (72, 360, 1000, 720))
    draw_text(
        img,
        (72, 400),
        "Not undefeated — Eric split after losing to Manny.",
        FontSpec("inter-semibold", 28, muted),
    )
    draw_text(
        img,
        (72, 460),
        "Amon-Ra St. Brown scored 37.2 in Week 2 (not 44.00).",
        FontSpec("inter-semibold", 28, muted),
    )
    save(img, path)


def fix_w4_slide_12() -> None:
    path = SRC / "w4-slide-12.png"
    img = load_rgb(path)
    closest = FACTS["margins"]["w4"][0]
    margin = f"{closest['margin']:.2f}"
    white = (255, 255, 255)
    gold = sample_text_color(img, (400, 520, 680, 600))
    muted = sample_text_color(img, (72, 700, 1000, 900))
    clear_text_area(img, (72, 280, 1008, 1050))
    replace_line_in_box(img, (72, 300, 1000, 380), "STAT OF THE WEEK", "bebas", muted)
    replace_line_in_box(
        img,
        (72, 400, 1000, 480),
        f"{closest['winner'].upper()} {closest['winnerPts']:.2f}",
        "anton",
        white,
    )
    replace_line_in_box(
        img,
        (72, 490, 1000, 560),
        f"{closest['loser'].upper()} {closest['loserPts']:.2f}",
        "anton",
        white,
    )
    replace_line_in_box(img, (300, 580, 780, 700), margin, "anton", gold)
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
    draw_text(
        img,
        (72, 840),
        "Biggest blowout: Steven over Narking by 39.35.",
        FontSpec("inter-semibold", 24, muted),
    )
    save(img, path)


def fix_vs_w5_m2_tagline() -> None:
    path = SRC / "vs-w5-m2.png"
    if not path.is_file():
        return
    img = load_rgb(path)
    muted = sample_text_color(img, (72, 1180, 900, 1260))
    replace_line_in_box(
        img,
        (72, 1195, 1008, 1245),
        "Lawrence vs Cousins • Manny has lost two straight",
        "inter-semibold",
        muted,
    )
    save(img, path)


def fix_w2_m2_caption() -> None:
    path = SRC / "results-w2-m2.png"
    if not path.is_file():
        return
    img = load_rgb(path)
    muted = sample_text_color(img, (72, 1180, 1000, 1250))
    replace_line_in_box(
        img,
        (72, 1175, 1008, 1245),
        "Brock Purdy 49.0 — Narking climbs to 1-1",
        "inter-semibold",
        muted,
    )
    save(img, path)


def main() -> None:
    fix_w1_slide_09()
    fix_w2_slide_06()
    fix_w4_slide_12()
    fix_vs_w5_m2_tagline()
    fix_w2_m2_caption()
    print("report + caption fixes done")


if __name__ == "__main__":
    main()
