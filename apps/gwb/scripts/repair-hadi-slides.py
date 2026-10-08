#!/usr/bin/env python3
"""Repair baked-in Hadi → Hady on GWB slide masters (OCR-guided)."""
from __future__ import annotations

import hashlib
import json
import re
import runpy
import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image

GWB = Path(__file__).resolve().parents[1]
SLIDES = GWB / "public/slides"
SOURCES = GWB / "scripts/slide-sources"
ARTIFACTS = Path("/opt/cursor/artifacts/gwb-hadi-repair")
MANIFEST_PATH = GWB / "src/content/slide-asset-basenames.json"

R = runpy.run_path(str(GWB / "scripts/repair-held-slides.py"))
load_rgb = R["load_rgb"]
replace_word_in_box = R["replace_word_in_box"]
replace_line_in_box = R["replace_line_in_box"]
sample_text_color = R["sample_text_color"]

# Gallery + results slides with baked-in Hadi (orphan vs-m3-hadi-manny is removed, not repaired).
SLIDE_IDS = [
    "vs-w5-m4",
    "results-w1-m2",
    "results-w2-m1",
    "results-w3-m2",
    "results-w4-m3",
    "w4-slide-06",
    "w4-slide-11",
    "w4-slide-13",
    "w4-slide-14",
    "w4-slide-16",
]

HADI_RE = re.compile(r"hadi", re.IGNORECASE)


def to_hady(text: str) -> str:
    if HADI_RE.search(text) is None:
        return text
    if "hady" in text.lower():
        return text

    def sub(m: re.Match[str]) -> str:
        w = m.group(0)
        if w.isupper():
            return "HADY"
        if w[0].isupper():
            return "Hady"
        return "hady"

    out = HADI_RE.sub(sub, text)
    # Possessive: Hadi's / HADI'S
    out = out.replace("Hady's", "Hady's").replace("HADYS", "HADY'S")
    if out.endswith("S") and "HADY" in out and "HADY'S" not in out:
        out = out.replace("HADYS", "HADY'S")
    out = re.sub(r"HadyS\b", "Hady's", out)
    out = re.sub(r"HADYS\b", "HADY'S", out)
    return out


def pick_family(box: tuple[int, int, int, int]) -> str:
    h = box[3] - box[1]
    if h >= 52:
        return "anton"
    if h >= 30:
        return "bebas"
    return "inter-semibold"


def tesseract_words(img_path: Path) -> list[tuple[str, int, int, int, int]]:
    with tempfile.TemporaryDirectory() as td:
        base = Path(td) / "ocr"
        subprocess.run(
            ["tesseract", str(img_path), str(base), "tsv"],
            check=True,
            capture_output=True,
        )
        lines = base.with_suffix(".tsv").read_text().splitlines()
    header = lines[0].split("\t")
    rows: list[tuple[str, int, int, int, int]] = []
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


def word_box(left: int, top: int, width: int, height: int, pad: int = 4) -> tuple[int, int, int, int]:
    return (left - pad, top - pad, left + width + pad, top + height + pad)


def repair_image(img: Image.Image, tmp_path: Path) -> int:
    img.save(tmp_path)
    count = 0
    # Re-read words from current pixels each pass (up to 3 rounds for reflow).
    for _ in range(3):
        words = tesseract_words(tmp_path)
        changed = False
        for text, left, top, width, height in words:
            if not HADI_RE.search(text) or "hady" in text.lower():
                continue
            new_text = to_hady(text)
            if new_text == text:
                continue
            box = word_box(left, top, width, height)
            fill = sample_text_color(img, box)
            family = pick_family(box)
            replace_word_in_box(img, box, new_text, family, fill)
            changed = True
            count += 1
        if not changed:
            break
        img.save(tmp_path)
    return count


def save_master(img: Image.Image, basename: str) -> Path:
    SOURCES.mkdir(parents=True, exist_ok=True)
    out = SOURCES / f"{basename}.png"
    img.save(out, optimize=True)
    return out


def hash8(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()[:8]


def ocr_has_hadi(path: Path) -> list[str]:
    with tempfile.TemporaryDirectory() as td:
        base = Path(td) / "ocr"
        subprocess.run(
            ["tesseract", str(path), str(base)],
            check=True,
            capture_output=True,
        )
        text = base.with_suffix(".txt").read_text()
    return [line for line in text.splitlines() if HADI_RE.search(line) and "hady" not in line.lower()]


def main() -> None:
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    before_dir = ARTIFACTS / "before"
    before_dir.mkdir(exist_ok=True)

    basename_map: dict[str, str] = {}
    report: list[dict] = []

    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td) / "work.png"
        for basename in SLIDE_IDS:
            src = SLIDES / f"{basename}.full.jpg"
            if not src.is_file():
                raise SystemExit(f"Missing source {src}")
            before_copy = before_dir / f"{basename}.full.jpg"
            shutil.copy2(src, before_copy)

            img = load_rgb(src)
            n = repair_image(img, tmp)
            if n < 1:
                raise SystemExit(f"No Hadi tokens patched in {basename}")

            master = save_master(img, basename)
            bad = ocr_has_hadi(master)
            if bad:
                raise SystemExit(f"Hadi still in {basename} master OCR: {bad[:3]}")
            digest = hash8(master)
            hashed = f"{basename}-{digest}"
            basename_map[basename] = hashed
            report.append(
                {
                    "id": basename,
                    "hashedBasename": hashed,
                    "patches": n,
                    "before": str(before_copy),
                    "masterPng": str(master),
                }
            )
            print("repaired", basename, n, "token(s) →", hashed)

    MANIFEST_PATH.write_text(json.dumps(basename_map, indent=2) + "\n")
    (ARTIFACTS / "repair-report.json").write_text(json.dumps(report, indent=2) + "\n")
    print("wrote", MANIFEST_PATH)


if __name__ == "__main__":
    main()
