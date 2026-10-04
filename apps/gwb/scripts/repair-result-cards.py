#!/usr/bin/env python3
"""HADY→HADI repairs on Results Weeks 1–3 cards."""
from __future__ import annotations

import runpy
import subprocess
from pathlib import Path

GWB = Path(__file__).resolve().parents[1]
ROOT = GWB.parents[1]
SRC_DIR = ROOT / "docs/gwb-results-cards"
OUT_DIR = SRC_DIR

R = runpy.run_path(str(GWB / "scripts/repair-held-slides.py"))


def tesseract_words(path: Path) -> list[tuple[str, int, int, int, int]]:
    out = Path("/tmp/result-tsv")
    subprocess.run(
        ["tesseract", str(path), str(out.with_suffix("")), "tsv"],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    rows: list[tuple[str, int, int, int, int]] = []
    lines = out.with_suffix(".tsv").read_text().splitlines()
    header = lines[0].split("\t")
    for line in lines[1:]:
        parts = line.split("\t")
        if len(parts) < 12:
            continue
        row = dict(zip(header, parts))
        text = row.get("text", "").strip()
        if not text:
            continue
        if "hady" not in text.lower():
            continue
        rows.append(
            (
                text,
                int(row["left"]),
                int(row["top"]),
                int(row["width"]),
                int(row["height"]),
            )
        )
    return rows


def pick_family(width: int, height: int) -> str:
    if height >= 50 or width >= 120:
        return "anton"
    return "bebas"


def repair_card(path: Path, dest: Path) -> None:
    img = R["load_rgb"](path)
    for text, left, top, width, height in tesseract_words(path):
        pad = 3
        box = (left - pad, top - pad, left + width + pad, top + height + pad)
        family = pick_family(width, height)
        fill = R["sample_text_color"](img, box)
        if text.lower() in ("hady's", "hadys"):
            R["replace_word_in_box"](img, box, "Hadi's", family, fill)
        elif text.upper() == "HADY":
            R["replace_last_glyph"](img, box, family, fill, "HADY", "I")
        elif text.lower() == "hady":
            R["replace_last_glyph"](img, box, family, fill, "Hady", "i")
        else:
            cleaned = text.replace("Hady", "Hadi").replace("HADY", "HADI")
            R["replace_word_in_box"](img, box, cleaned, family, fill)
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, optimize=True)


def verify(path: Path) -> None:
    out = subprocess.check_output(
        ["tesseract", str(path), "stdout"], stderr=subprocess.DEVNULL, text=True
    )
    if "hady" in out.lower():
        raise SystemExit(f"Hady still in {path.name}")


def main() -> None:
    for card in ("results-w1-m2", "results-w2-m1", "results-w3-m2"):
        src = SRC_DIR / f"{card}.png"
        dest = OUT_DIR / f"{card}.png"
        repair_card(src, dest)
        verify(dest)
        print("OK", card)


if __name__ == "__main__":
    main()
