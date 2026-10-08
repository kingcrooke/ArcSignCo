#!/usr/bin/env python3
"""Hadi → Hady: HTML re-render where templates exist; else in-place word fixes."""
from __future__ import annotations

import hashlib
import json
import re
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

GWB = Path(__file__).resolve().parents[1]
REPO = GWB.parents[1]
SOURCES = GWB / "scripts/slide-sources"
ORIG_CACHE = SOURCES / "_orig-main-jpg"
MANIFEST_PATH = GWB / "src/content/slide-asset-basenames.json"
ARTIFACTS = Path("/opt/cursor/artifacts/gwb-hadi-repair")
PAIRS = ARTIFACTS / "pairs"
DIFFS = ARTIFACTS / "diffs"

HTML_RENDER_IDS = [
    "vs-w5-m4",
    "results-w1-m2",
    "results-w2-m1",
    "results-w3-m2",
    "results-w4-m3",
    "w4-slide-14",
]

PIXEL_FIX_IDS = [
    "w4-slide-06",
    "w4-slide-11",
    "w4-slide-13",
    "w4-slide-16",
]

SLIDE_IDS = HTML_RENDER_IDS + PIXEL_FIX_IDS

R = __import__("runpy").run_path(str(GWB / "scripts/repair-held-slides.py"))
load_rgb = R["load_rgb"]
sample_text_color = R["sample_text_color"]
replace_word_in_box = R["replace_word_in_box"]
replace_line_in_box = R["replace_line_in_box"]
FontSpec = R["FontSpec"]
fit_size = R["fit_size"]
text_size = R["text_size"]
draw_text = R["draw_text"]
clear_text_area = R["clear_text_area"]

HADI_RE = re.compile(r"\bhadi\b", re.IGNORECASE)


def draw_centered(
    img: Image.Image,
    box: tuple[int, int, int, int],
    text: str,
    family: str,
    fill: tuple[int, int, int],
) -> None:
    x0, y0, x1, y1 = box
    h = y1 - y0
    size = fit_size(family, text, target_h=h - 4, min_s=14, max_s=120)
    tw, th = text_size(text, FontSpec(family, size, fill))
    x = x0 + (x1 - x0 - tw) // 2
    y = y0 + (h - th) // 2
    draw_text(img, (x, y), text, FontSpec(family, size, fill), anchor="ls")


def apply_pixel_fixes(img: Image.Image, slide_id: str) -> None:
    if slide_id == "w4-slide-06":
        white = sample_text_color(img, (370, 709, 502, 778))
        body = sample_text_color(img, (220, 1071, 281, 1094))
        replace_word_in_box(img, (365, 700, 510, 785), "HADY", "anton", white)
        replace_line_in_box(
            img,
            (180, 1065, 920, 1100),
            "Hady went balanced: Chuba 27.9 - Bowers 20.6",
            "inter-semibold",
            body,
        )
    elif slide_id == "w4-slide-11":
        gray = sample_text_color(img, (260, 695, 324, 726))
        replace_word_in_box(img, (255, 688, 330, 730), "HADY", "inter-semibold", gray)
    elif slide_id == "w4-slide-13":
        gray = sample_text_color(img, (138, 576, 202, 607))
        replace_word_in_box(img, (130, 568, 210, 612), "HADY", "inter-semibold", gray)
    elif slide_id == "w4-slide-16":
        gold = sample_text_color(img, (101, 558, 163, 588))
        white = sample_text_color(img, (225, 993, 286, 1023))
        replace_word_in_box(img, (95, 550, 170, 595), "HADY", "bebas", gold)
        replace_word_in_box(img, (218, 985, 292, 1028), "HADY", "inter-semibold", white)
    else:
        raise SystemExit(f"No pixel handler for {slide_id}")


def ensure_original(slide_id: str) -> Path:
    ORIG_CACHE.mkdir(parents=True, exist_ok=True)
    dest = ORIG_CACHE / f"{slide_id}.jpg"
    if dest.is_file() and dest.stat().st_size > 10_000:
        return dest
    rel = f"apps/gwb/public/slides/{slide_id}.full.jpg"
    data = subprocess.check_output(["git", "show", f"main:{rel}"], cwd=REPO)
    dest.write_bytes(data)
    return dest


def render_from_html(slide_ids: list[str]) -> None:
    if not slide_ids:
        return
    cmd = ["node", "scripts/render-hadi-from-html.mjs", *slide_ids]
    subprocess.run(cmd, cwd=GWB, check=True)


def build_master(slide_id: str) -> Image.Image:
    png = SOURCES / f"{slide_id}.png"
    if slide_id in HTML_RENDER_IDS:
        if not png.is_file():
            render_from_html([slide_id])
        return load_rgb(png)
    img = load_rgb(ensure_original(slide_id))
    apply_pixel_fixes(img, slide_id)
    return img


def save_master(img: Image.Image, slide_id: str) -> Path:
    out = SOURCES / f"{slide_id}.png"
    img.save(out, optimize=True)
    return out


def hash8(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()[:8]


def ocr_hadi_lines(path: Path) -> list[str]:
    out = subprocess.check_output(
        ["tesseract", str(path), "stdout"], stderr=subprocess.DEVNULL, text=True
    )
    return [ln for ln in out.splitlines() if HADI_RE.search(ln)]


def side_by_side(slide_id: str, before: Path, after: Path) -> Path:
    PAIRS.mkdir(parents=True, exist_ok=True)
    a = Image.open(before).convert("RGB")
    b = Image.open(after).convert("RGB")
    w, h = a.size
    combo = Image.new("RGB", (w * 2 + 24, h + 48), (24, 24, 24))
    combo.paste(a, (12, 40))
    combo.paste(b, (w + 24, 40))
    d = ImageDraw.Draw(combo)
    d.text((16, 8), f"{slide_id} — BEFORE (main)", fill=(232, 185, 35))
    d.text((w + 28, 8), f"{slide_id} — AFTER", fill=(232, 185, 35))
    out = PAIRS / f"{slide_id}.jpg"
    combo.save(out, quality=92)
    return out


def diff_heatmap(slide_id: str, before: Path, after: Path) -> Path:
    DIFFS.mkdir(parents=True, exist_ok=True)
    a = np.array(Image.open(before).convert("RGB"), dtype=np.int16)
    b = np.array(Image.open(after).convert("RGB"), dtype=np.int16)
    diff = np.abs(a - b).mean(axis=2)
    heat = np.clip(diff * 4, 0, 255).astype(np.uint8)
    rgb = np.zeros((*heat.shape, 3), dtype=np.uint8)
    rgb[:, :, 0] = heat
    rgb[:, :, 2] = (255 - heat) // 2
    out = DIFFS / f"{slide_id}-diff.png"
    Image.fromarray(rgb).save(out)
    return out


def main() -> None:
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    before_dir = ARTIFACTS / "before"
    after_dir = ARTIFACTS / "after"
    before_dir.mkdir(exist_ok=True)
    after_dir.mkdir(exist_ok=True)

    for slide_id in SLIDE_IDS:
        ensure_original(slide_id)

    render_from_html(HTML_RENDER_IDS)

    basename_map: dict[str, str] = {}
    report: list[dict] = []

    for slide_id in SLIDE_IDS:
        orig = ensure_original(slide_id)
        before_copy = before_dir / f"{slide_id}.jpg"
        if not before_copy.exists():
            before_copy.write_bytes(orig.read_bytes())

        img = build_master(slide_id)
        master = save_master(img, slide_id)
        after_jpg = after_dir / f"{slide_id}.jpg"
        img.save(after_jpg, quality=95)

        bad = ocr_hadi_lines(master)
        if bad:
            raise SystemExit(f"Hadi still in {slide_id}: {bad[:3]}")

        digest = hash8(master)
        basename_map[slide_id] = f"{slide_id}-{digest}"
        pair = side_by_side(slide_id, before_copy, after_jpg)
        diff = diff_heatmap(slide_id, before_copy, after_jpg)
        report.append(
            {
                "id": slide_id,
                "hashedBasename": basename_map[slide_id],
                "method": "html" if slide_id in HTML_RENDER_IDS else "pixel",
                "pair": str(pair),
                "diff": str(diff),
            }
        )
        print("OK", slide_id, basename_map[slide_id])

    MANIFEST_PATH.write_text(json.dumps(basename_map, indent=2) + "\n")
    (ARTIFACTS / "recompose-report.json").write_text(json.dumps(report, indent=2) + "\n")

    workspace_pairs = REPO / "gwb-review/pr58/pairs"
    workspace_pairs.mkdir(parents=True, exist_ok=True)
    for slide_id in SLIDE_IDS:
        src = PAIRS / f"{slide_id}.jpg"
        if src.is_file():
            (workspace_pairs / f"{slide_id}.jpg").write_bytes(src.read_bytes())

    print("wrote", MANIFEST_PATH)


if __name__ == "__main__":
    main()
