#!/usr/bin/env python3
"""Report slides: keep main layout/art; swap only requested fact fixes."""
from __future__ import annotations

import json
import runpy
import subprocess
from pathlib import Path

GWB = Path(__file__).resolve().parents[3]
ROOT = GWB.parent
CARD = Path(__file__).resolve().parents[1]
SRC = GWB / "scripts/slide-sources"
FACTS = json.loads((CARD / "sleeper-facts.json").read_text())

R = runpy.run_path(str(GWB / "scripts/repair-held-slides.py"))
load_rgb = R["load_rgb"]
inpaint_region = R["inpaint_region"]
draw_text = R["draw_text"]
replace_word_in_box = R["replace_word_in_box"]
sample_text_color = R["sample_text_color"]
FontSpec = R["FontSpec"]
fit_size = R["fit_size"]
text_size = R["text_size"]


def main_slide(card_id: str):
    rel = f"apps/gwb/public/slides/{card_id}.full.jpg"
    data = subprocess.check_output(["git", "show", f"main:{rel}"], cwd=ROOT)
    tmp = CARD / "rebuild" / f".src-{card_id}.jpg"
    tmp.write_bytes(data)
    return load_rgb(tmp)


def save(img, name: str) -> None:
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


def w1_slide_09() -> None:
    img = main_slide("w1-slide-09")
    muted = sample_text_color(img, (200, 400, 800, 500))
    replace_word_in_box(img, (180, 400, 420, 470), "fourth-highest", "inter-semibold", muted)
    save(img, "w1-slide-09.png")


def w2_slide_06() -> None:
    img = main_slide("w2-slide-06")
    muted = sample_text_color(img, (72, 380, 1000, 520))
    R["replace_line_in_box"](img, (72, 380, 900, 440), "Eric is 1-1.", "inter-semibold", muted)
    replace_word_in_box(img, (520, 440, 620, 500), "37.2", "inter-semibold", muted)
    save(img, "w2-slide-06.png")


def w4_slide_12() -> None:
    img = main_slide("w4-slide-12")
    closest = FACTS["margins"]["w4"][0]
    margin = f"{closest['margin']:.2f}"
    w_name = "HADY" if closest["winner"] == "Hady" else closest["winner"].upper()
    l_name = closest["loser"].upper()
    white = (255, 255, 255)
    gold = sample_text_color(img, (400, 520, 680, 600))
    muted = sample_text_color(img, (72, 700, 1000, 900))
    inpaint_region(img, (72, 280, 1008, 1050))
    draw_text(img, (72, 300), "STAT OF THE WEEK", FontSpec("bebas", 36, muted))
    draw_text(img, (72, 400), f"{w_name} {closest['winnerPts']:.2f}", FontSpec("anton", 48, white))
    draw_text(img, (72, 490), f"{l_name} {closest['loserPts']:.2f}", FontSpec("anton", 48, white))
    draw_centered_box(img, (300, 580, 780, 700), margin, "anton", gold)
    draw_text(
        img,
        (72, 720),
        f"Closest game of Week 4: {w_name} over {l_name} by {margin}.",
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
    draw_text(img, (72, 900), "FANTASY FOOTBALL.", FontSpec("bebas", 32, gold))
    save(img, "w4-slide-12.png")


def main() -> None:
    w1_slide_09()
    w2_slide_06()
    w4_slide_12()
    print("report slides (live plates + fact fixes) →", SRC)


if __name__ == "__main__":
    main()
