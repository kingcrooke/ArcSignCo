#!/usr/bin/env python3
"""Retouch HADI/Hadi → HADI/Hadi on published slide masters (OCR-guided)."""
from __future__ import annotations

import hashlib
import json
import runpy
import subprocess
import sys
from pathlib import Path

GWB = Path(__file__).resolve().parents[1]
SLIDES = GWB / "public/slides"
SOURCES = GWB / "scripts/slide-sources"
MANIFEST = GWB / "src/content/slide-basenames.json"
ARTIFACTS = Path("/opt/cursor/artifacts/gwb-hadi-slide-repairs")

R = runpy.run_path(str(GWB / "scripts/repair-held-slides.py"))


def tesseract_words(path: Path):
    out = Path("/tmp/hadi-repair-tsv")
    subprocess.run(
        ["tesseract", str(path), str(out), "tsv"],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
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
        yield (
            text,
            int(row["left"]),
            int(row["top"]),
            int(row["width"]),
            int(row["height"]),
        )


def pick_family(width: int, height: int, token: str) -> str:
    if token.upper() == "HADI" and height >= 48:
        return "anton"
    if height >= 32:
        return "bebas"
    return "inter-semibold"


# OCR misses stylized lines; full-line re-typeset in these boxes (x0,y0,x1,y1).
MANUAL_LINES: dict[str, list[tuple[tuple[int, int, int, int], str, str]]] = {
    "w1-slide-11": [
        ((60, 235, 620, 335), "def. Hadi 119.43", "bebas"),
    ],
}


def replacement_for(token: str) -> str:
    if token.upper() == "HADI":
        return "HADI"
    if token == "Hadi":
        return "Hadi"
    if token.lower() == "hady":
        return "Hadi"
    if "Hadi" in token:
        return token.replace("Hadi", "Hadi").replace("HADI", "HADI")
    return "Hadi"


def repair_slide(slide_id: str) -> tuple[Path, str]:
    src_jpg = SLIDES / f"{slide_id}.full.jpg"
    if not src_jpg.is_file():
        raise SystemExit(f"Missing {src_jpg}")
    img = R["load_rgb"](src_jpg)
    hits = 0
    for box, line, family in MANUAL_LINES.get(slide_id, []):
        fill = R["sample_text_color"](img, box)
        R["replace_line_in_box"](img, box, line, family, fill)
        hits += 1
    for text, left, top, width, height in tesseract_words(src_jpg):
        if "hady" not in text.lower():
            continue
        pad = 6
        box = (left - pad, top - pad, left + width + pad, top + height + pad)
        family = pick_family(width, height, text)
        fill = R["sample_text_color"](img, box)
        new_word = replacement_for(text)
        R["replace_word_in_box"](img, box, new_word, family, fill)
        hits += 1
    if hits == 0:
        raise SystemExit(f"No Hady tokens found on {slide_id}")
    SOURCES.mkdir(parents=True, exist_ok=True)
    tmp = SOURCES / f"{slide_id}.repair.png"
    img.save(tmp, optimize=True)
    digest = hashlib.sha256(tmp.read_bytes()).hexdigest()[:8]
    basename = f"{slide_id}--{digest}"
    dest = SOURCES / f"{basename}.png"
    tmp.rename(dest)
    return dest, basename


def verify_no_hady(path: Path) -> None:
    import re

    for text, *_ in tesseract_words(path):
        if re.fullmatch(r"Hady|HADY", text, re.IGNORECASE):
            raise SystemExit(f"Hady token still in {path.name}: {text!r}")


def make_contact_sheet(before_after: list[tuple[Path, Path]], out: Path) -> None:
    from PIL import Image

    rows = []
    for before, after in before_after:
        b = Image.open(before).convert("RGB").resize((540, 675))
        a = Image.open(after).convert("RGB").resize((540, 675))
        row = Image.new("RGB", (1080, 675))
        row.paste(b, (0, 0))
        row.paste(a, (540, 0))
        rows.append(row)
    h = 675 * len(rows)
    sheet = Image.new("RGB", (1080, h))
    y = 0
    for row in rows:
        sheet.paste(row, (0, y))
        y += 675
    out.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out, quality=90)


def main() -> None:
    # OCR-confirmed basenames (full scan of *.full.jpg)
    slide_ids = [
        "w1-slide-07",
        "w1-slide-11",
        "w1-slide-14",
        "w1-slide-15",
        "w2-slide-05",
        "w2-slide-07",
        "w2-slide-10",
        "w2-slide-14",
        "w3-slide-11",
        "w3-slide-14",
    ]
    manifest: dict[str, str] = {}
    before_after: list[tuple[Path, Path]] = []
    for slide_id in slide_ids:
        before = SLIDES / f"{slide_id}.full.jpg"
        png, basename = repair_slide(slide_id)
        verify_no_hady(png)
        manifest[slide_id] = basename
        before_after.append((before, png))
        print("repaired", slide_id, "→", basename)
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    make_contact_sheet(before_after, ARTIFACTS / "hady-to-hadi-contact-sheet.jpg")
    print("manifest", MANIFEST)
    print("contact", ARTIFACTS / "hady-to-hadi-contact-sheet.jpg")


if __name__ == "__main__":
    main()
