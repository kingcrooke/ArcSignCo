#!/usr/bin/env python3
"""HADY→HADI repairs on Results Weeks 1–3 cards (full-line re-typeset)."""
from __future__ import annotations

import runpy
import subprocess
from pathlib import Path

GWB = Path(__file__).resolve().parents[1]
ROOT = GWB.parents[1]
UPLOADS = Path("/home/ubuntu/.cursor/projects/workspace/uploads")
SRC_DIR = ROOT / "docs/gwb-results-cards"
OUT_DIR = SRC_DIR

R = runpy.run_path(str(GWB / "scripts/repair-held-slides.py"))

UPLOAD_BY_CARD = {
    "results-w1-m2": UPLOADS / "result-w1-m2_b501.png",
    "results-w2-m1": UPLOADS / "result-w2-m1_d793.png",
    "results-w3-m2": UPLOADS / "result-w3-m2_adfa.png",
}


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


def repair_final_headline(img, path: Path) -> None:
    words = [w for w in tesseract_words(path) if w[0].upper() in ("FINAL:", "HADY", "TAKES", "IT", "KAYSER")]
    if not any(w[0].upper() == "HADY" for w in words):
        return
    tops = [w[2] for w in words if w[2] < 250]
    if not tops:
        return
    y0 = min(tops) - 8
    y1 = max(w[2] + w[4] for w in words if w[2] < 250) + 8
    fill = R["sample_text_color"](img, (60, y0, 700, y1))
    R["replace_line_in_box"](
        img,
        (60, y0, 720, y1),
        "FINAL: HADI TAKES IT",
        "anton",
        fill,
    )


def repair_card(path: Path, dest: Path) -> None:
    img = R["load_rgb"](path)
    repair_final_headline(img, path)

    for text, left, top, width, height in tesseract_words(path):
        if "hady" not in text.lower():
            continue
        pad = 4
        box = (left - pad, top - pad, left + width + pad, top + height + pad)
        family = pick_family(width, height)
        fill = R["sample_text_color"](img, box)
        if text.lower() in ("hady's", "hadys"):
            R["replace_word_in_box"](img, box, "Hadi's", family, fill)
        elif text.upper() == "HADY":
            R["replace_word_in_box"](img, box, "HADI", family, fill)
        elif text.lower() == "hady":
            R["replace_word_in_box"](img, box, "Hadi", family, fill)
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
    for card, upload in UPLOAD_BY_CARD.items():
        src = upload if upload.is_file() else SRC_DIR / f"{card}.png"
        dest = OUT_DIR / f"{card}.png"
        repair_card(src, dest)
        verify(dest)
        print("OK", card)


if __name__ == "__main__":
    main()
