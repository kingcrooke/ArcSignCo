#!/usr/bin/env python3
"""Report slides: keep main layout/art; swap only requested fact fixes."""
from __future__ import annotations

import json
import re
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
replace_line_in_box = R["replace_line_in_box"]
sample_text_color = R["sample_text_color"]
FontSpec = R["FontSpec"]


def main_slide(card_id: str):
    rel = f"apps/gwb/public/slides/{card_id}.full.jpg"
    data = subprocess.check_output(["git", "show", f"main:{rel}"], cwd=ROOT)
    tmp = CARD / "rebuild" / f".src-{card_id}.jpg"
    tmp.write_bytes(data)
    return load_rgb(tmp)


def save(img, name: str) -> None:
    img.save(SRC / name, optimize=True)


def w1_slide_09() -> None:
    img = main_slide("w1-slide-09")
    muted = sample_text_color(img, (200, 400, 800, 500))
    replace_word_in_box(img, (180, 400, 900, 520), "fourth-highest", "inter-semibold", muted)
    save(img, "w1-slide-09.png")


def w2_slide_06() -> None:
    img = main_slide("w2-slide-06")
    white = (255, 255, 255)
    muted = sample_text_color(img, (72, 500, 900, 600))
    replace_line_in_box(img, (72, 200, 900, 320), "1-1 AND UNEXPLAINED", "anton", white)
    replace_line_in_box(img, (72, 380, 900, 440), "Eric is 1-1.", "inter-semibold", muted)
    replace_word_in_box(img, (72, 440, 1000, 500), "44.00", "inter-semibold", muted)
    replace_word_in_box(img, (72, 440, 1000, 500), "37.2", "inter-semibold", muted)
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
    inpaint_region(img, (72, 320, 1008, 1020))
    draw_text(img, (72, 340), "STAT OF THE WEEK", FontSpec("bebas", 36, muted))
    draw_text(img, (72, 420), f"{w_name} {closest['winnerPts']:.2f}", FontSpec("anton", 48, white))
    draw_text(img, (72, 500), f"{l_name} {closest['loserPts']:.2f}", FontSpec("anton", 48, white))
    tw, th = R["text_size"](margin, FontSpec("anton", 72, gold))
    draw_text(img, ((1080 - tw) // 2, 590), margin, FontSpec("anton", 72, gold))
    draw_text(
        img,
        (72, 700),
        f"Closest game of Week 4: {w_name} over {l_name} by {margin}.",
        FontSpec("inter-semibold", 26, muted),
    )
    draw_text(img, (72, 760), "FANTASY FOOTBALL.", FontSpec("bebas", 32, gold))
    save(img, "w4-slide-12.png")


def main() -> None:
    w1_slide_09()
    w2_slide_06()
    w4_slide_12()
    print("report slides (live plates + fact fixes) →", SRC)


if __name__ == "__main__":
    main()
