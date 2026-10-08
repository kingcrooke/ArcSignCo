#!/usr/bin/env python3
"""Hadi → Hady: in-place pixel repair on main-branch slide JPGs (fonts + tight boxes)."""
from __future__ import annotations

import hashlib
import json
import re
import subprocess
import tempfile
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
ZOOMS = ARTIFACTS / "zoom-crops"

R = __import__("runpy").run_path(str(GWB / "scripts/repair-held-slides.py"))
load_rgb = R["load_rgb"]
inpaint_text_in_box = R["inpaint_text_in_box"]
clear_text_area = R["clear_text_area"]
inpaint_region = R["inpaint_region"]
sample_text_color = R["sample_text_color"]
sample_panel_fill = R["sample_panel_fill"]
box_is_flat = R["box_is_flat"]
FontSpec = R["FontSpec"]
fit_size = R["fit_size"]
text_size = R["text_size"]
draw_text = R["draw_text"]
font = R["font"]
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

# Tesseract misses card pill labels — tight boxes around the tag text only.
PILL_LABELS: dict[str, list[tuple[tuple[int, int, int, int], str]]] = {
    "vs-w5-m4": [((78, 314, 218, 366), "HADY 3-1")],
    "results-w2-m1": [((78, 314, 218, 366), "HADY 1-1")],
    "results-w3-m2": [((78, 314, 218, 366), "HADY 2-1")],
    "results-w4-m3": [((78, 314, 218, 366), "HADY 3-1")],
    "results-w1-m2": [((600, 322, 778, 362), "HADY 0-1")],
}


def normalize_ocr_box(
    slide_id: str, text: str, box: tuple[int, int, int, int]
) -> tuple[int, int, int, int]:
    """Tesseract often under-estimates cap height on Bebas/Anton lines."""
    x0, y0, x1, y1 = box
    h = y1 - y0
    if slide_id.startswith("results-") and 200 <= y0 <= 235 and text.isupper():
        y1 = y0 + max(h, 38)
    if slide_id.startswith("results-") and 1040 <= y0 <= 1080:
        y1 = y0 + max(h, 30)
    if slide_id == "vs-w5-m4" and y0 < 280 and re.fullmatch(r"HADI", text, re.I):
        y1 = y0 + max(h, 70 if y0 < 200 else 28)
    if slide_id == "w4-slide-06" and 700 <= y0 <= 730 and re.fullmatch(r"HADI", text, re.I):
        y1 = y0 + max(h, 52)
    return (x0, y0, x1, y1)


def boxes_overlap(a: tuple[int, int, int, int], b: tuple[int, int, int, int]) -> bool:
    return not (a[2] <= b[0] or b[2] <= a[0] or a[3] <= b[1] or b[3] <= a[1])


def ensure_original(slide_id: str) -> Path:
    ORIG_CACHE.mkdir(parents=True, exist_ok=True)
    dest = ORIG_CACHE / f"{slide_id}.jpg"
    if dest.is_file() and dest.stat().st_size > 10_000:
        return dest
    rel = f"apps/gwb/public/slides/{slide_id}.full.jpg"
    data = subprocess.check_output(["git", "show", f"main:{rel}"], cwd=REPO)
    dest.write_bytes(data)
    return dest


def tesseract_words(path: Path) -> list[tuple[str, int, int, int, int]]:
    with tempfile.TemporaryDirectory() as td:
        base = Path(td) / "ocr"
        subprocess.run(
            ["tesseract", str(path), str(base), "tsv"],
            check=True,
            capture_output=True,
        )
        lines = base.with_suffix(".tsv").read_text().splitlines()
    header = lines[0].split("\t")
    out: list[tuple[str, int, int, int, int]] = []
    for line in lines[1:]:
        parts = line.split("\t")
        if len(parts) < 12:
            continue
        row = dict(zip(header, parts))
        text = row.get("text", "").strip()
        if not text:
            continue
        l, t, w, h = int(row["left"]), int(row["top"]), int(row["width"]), int(row["height"])
        out.append((text, l, t, l + w, t + h))
    return out


def pick_family(box: tuple[int, int, int, int], text: str = "") -> str:
    h = box[3] - box[1]
    if text and not text.isupper() and h < 34:
        return "inter-semibold" if h >= 16 else "inter"
    if h >= 50:
        return "anton"
    if h >= 28:
        return "bebas"
    if h >= 22:
        return "inter-semibold"
    return "inter"


def to_hady(text: str) -> str:
    if "hady" in text.lower():
        return text
    if not HADI_RE.search(text):
        return text

    def sub(m: re.Match[str]) -> str:
        w = m.group(0)
        if w.isupper():
            return "HADY"
        if w[0].isupper():
            return "Hady"
        return "hady"

    if re.search(r"HADI['’]S", text, re.IGNORECASE):
        return re.sub(r"HADI", "HADY", text, count=1, flags=re.IGNORECASE)
    out = HADI_RE.sub(sub, text)
    out = re.sub(r"HadyS\b", "Hady's", out)
    out = re.sub(r"HADYS\b", "HADY'S", out)
    return out


def clear_word(img: Image.Image, box: tuple[int, int, int, int], pad: int = 2) -> None:
    x0, y0, x1, y1 = box
    region = (max(0, x0 - pad), max(0, y0 - pad), min(img.width, x1 + pad), min(img.height, y1 + pad))
    if box_is_flat(img, region, threshold=32):
        fill = sample_panel_fill(img, region)
        ImageDraw.Draw(img).rectangle(region, fill=fill)
    else:
        inpaint_text_in_box(img, region)


def fit_cap_height(family: str, word: str, cap_h: int) -> int:
    best = 12
    for size in range(12, 140):
        spec = FontSpec(family, size, (255, 255, 255))
        _, th = text_size(word, spec)
        if th <= cap_h + 1:
            best = size
        else:
            break
    return best


def draw_word_in_box(
    img: Image.Image,
    box: tuple[int, int, int, int],
    word: str,
    family: str,
    fill: tuple[int, int, int],
    *,
    max_width: int | None = None,
    center_in_box: bool = False,
) -> None:
    x0, y0, x1, y1 = box
    cap_h = y1 - y0
    target_w = max_width if max_width is not None else (x1 - x0)
    size = 12
    for candidate in range(12, 140):
        spec = FontSpec(family, candidate, fill)
        tw, th = text_size(word, spec)
        if th <= cap_h + 1 and tw <= target_w + 1:
            size = candidate
        elif th > cap_h + 1 or tw > target_w + 1:
            if candidate > 12:
                break
    spec = FontSpec(family, size, fill)
    tw, th = text_size(word, spec)
    # OCR boxes are top-aligned; anchor baseline to the box bottom.
    baseline = y1 - 2
    if center_in_box:
        x = x0 + (x1 - x0 - tw) // 2
    else:
        x = x0
    draw_text(img, (x, baseline), word, spec, anchor="ls")


def replace_pill_label(
    img: Image.Image,
    box: tuple[int, int, int, int],
    label: str,
    family: str = "bebas",
    *,
    name_only: bool = False,
) -> None:
    gold = sample_text_color(img, box)
    if sum(gold) < 180:
        gold = (232, 185, 35)
    x0, y0, x1, y1 = box
    w = x1 - x0
    if name_only:
        inpaint_region(img, box)
        for _ in range(2):
            inpaint_text_in_box(img, box)
        draw_word_in_box(img, box, label, family, gold, center_in_box=True)
        return
    inpaint_region(img, box)
    for _ in range(2):
        inpaint_text_in_box(img, box)
    draw_word_in_box(img, box, label, family, gold, center_in_box=True)


def replace_possessive_hadi(img: Image.Image, box: tuple[int, int, int, int], new_text: str) -> None:
    """HADI'S → HADY'S: change only the I glyph, keep apostrophe + S pixels."""
    x0, y0, x1, y1 = box
    w = x1 - x0
    fam = pick_family(box, new_text)
    fill = sample_text_color(img, box)
    i_box = (x0 + int(w * 0.52), y0, x0 + int(w * 0.68), y1)
    clear_word(img, i_box, pad=1)
    letter = "Y" if new_text.isupper() else "y"
    draw_word_in_box(img, i_box, letter, fam, fill, max_width=i_box[2] - i_box[0])


def replace_token(
    img: Image.Image,
    box: tuple[int, int, int, int],
    new_text: str,
    family: str | None = None,
    *,
    pill: bool = False,
) -> None:
    if pill:
        replace_pill_label(img, box, new_text, family or "bebas")
        return
    fam = family or pick_family(box, new_text)
    fill = sample_text_color(img, box)
    max_w = box[2] - box[0]
    clear_word(img, box, pad=1)
    draw_word_in_box(img, box, new_text, fam, fill, max_width=max_w)


def repair_slide(slide_id: str, orig: Path) -> tuple[Image.Image, list[tuple[tuple[int, int, int, int], str]]]:
    img = load_rgb(orig)
    changed: list[tuple[tuple[int, int, int, int], str]] = []
    skip_zones: list[tuple[int, int, int, int]] = []

    for box, label in PILL_LABELS.get(slide_id, []):
        replace_pill_label(img, box, label, name_only=(slide_id == "vs-w5-m4"))
        changed.append((box, label))
        skip_zones.append(box)

    for text, x0, y0, x1, y1 in tesseract_words(orig):
        if not HADI_RE.search(text) or "hady" in text.lower():
            continue
        box = normalize_ocr_box(slide_id, text, (x0, y0, x1, y1))
        if any(boxes_overlap(box, z) for z in skip_zones):
            continue
        new_text = to_hady(text)
        if re.search(r"HADI['’]S", text, re.IGNORECASE):
            replace_possessive_hadi(img, box, new_text)
        else:
            replace_token(img, box, new_text)
        changed.append((box, new_text))

    return img, changed


def hash8(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()[:8]


def ocr_hadi(path: Path) -> list[str]:
    out = subprocess.check_output(
        ["tesseract", str(path), "stdout"], stderr=subprocess.DEVNULL, text=True
    )
    return [ln for ln in out.splitlines() if HADI_RE.search(ln)]


def side_pair(slide_id: str, before: Image.Image, after: Image.Image) -> Path:
    PAIRS.mkdir(parents=True, exist_ok=True)
    w, h = before.size
    combo = Image.new("RGB", (w * 2 + 24, h + 44), (24, 24, 24))
    combo.paste(before, (12, 36))
    combo.paste(after, (w + 24, 36))
    d = ImageDraw.Draw(combo)
    d.text((12, 8), f"{slide_id} — LIVE (main)", fill=(232, 185, 35))
    d.text((w + 28, 8), f"{slide_id} — PIXEL REPAIR", fill=(232, 185, 35))
    out = PAIRS / f"{slide_id}.jpg"
    combo.save(out, quality=92)
    return out


def zoom_pair(
    slide_id: str,
    before: Image.Image,
    after: Image.Image,
    box: tuple[int, int, int, int],
    label: str,
    idx: int,
) -> Path:
    ZOOMS.mkdir(parents=True, exist_ok=True)
    pad = 12
    x0, y0, x1, y1 = box
    crop_b = before.crop((x0 - pad, y0 - pad, x1 + pad, y1 + pad))
    crop_a = after.crop((x0 - pad, y0 - pad, x1 + pad, y1 + pad))
    scale = 3
    zb = crop_b.resize((crop_b.width * scale, crop_b.height * scale), Image.Resampling.NEAREST)
    za = crop_a.resize((crop_a.width * scale, crop_a.height * scale), Image.Resampling.NEAREST)
    w, h = zb.size
    combo = Image.new("RGB", (w * 2 + 16, h + 28), (16, 16, 16))
    combo.paste(zb, (8, 24))
    combo.paste(za, (w + 16, 24))
    d = ImageDraw.Draw(combo)
    d.text((8, 4), f"{slide_id} {label} LIVE", fill=(200, 200, 200))
    d.text((w + 16, 4), f"{slide_id} {label} REPAIR", fill=(200, 200, 200))
    out = ZOOMS / f"{slide_id}-{idx:02d}-{label.replace(' ', '_')}.jpg"
    combo.save(out, quality=95)
    return out


def diff_heatmap(slide_id: str, before: Image.Image, after: Image.Image) -> Path:
    DIFFS.mkdir(parents=True, exist_ok=True)
    a = np.array(before, dtype=np.int16)
    b = np.array(after, dtype=np.int16)
    diff = np.abs(a - b).mean(axis=2)
    heat = np.clip(diff * 5, 0, 255).astype(np.uint8)
    rgb = np.zeros((*heat.shape, 3), dtype=np.uint8)
    rgb[:, :, 0] = heat
    out = DIFFS / f"{slide_id}-diff.png"
    Image.fromarray(rgb).save(out)
    return out


def main() -> None:
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    basename_map: dict[str, str] = {}
    report: list[dict] = []
    zoom_paths: list[str] = []

    for slide_id in SLIDE_IDS:
        orig = ensure_original(slide_id)
        before = load_rgb(orig)
        after, boxes = repair_slide(slide_id, orig)
        master = SOURCES / f"{slide_id}.png"
        SOURCES.mkdir(parents=True, exist_ok=True)
        after.save(master, optimize=True)

        bad = ocr_hadi(master)
        if bad:
            raise SystemExit(f"Hadi still in {slide_id}: {bad[:3]}")

        digest = hash8(master)
        basename_map[slide_id] = f"{slide_id}-{digest}"

        pair = side_pair(slide_id, before, after)
        diff = diff_heatmap(slide_id, before, after)
        for i, (box, label) in enumerate(boxes):
            zoom_paths.append(str(zoom_pair(slide_id, before, after, box, label, i)))

        report.append(
            {
                "id": slide_id,
                "hashedBasename": basename_map[slide_id],
                "pair": str(pair),
                "diff": str(diff),
                "tokens": len(boxes),
            }
        )
        print("OK", slide_id, basename_map[slide_id], f"({len(boxes)} tokens)")

    MANIFEST_PATH.write_text(json.dumps(basename_map, indent=2) + "\n")
    (ARTIFACTS / "pixel-report.json").write_text(
        json.dumps({"slides": report, "zoomCrops": zoom_paths}, indent=2) + "\n"
    )

    review = REPO / "gwb-review/pr58"
    (review / "pairs").mkdir(parents=True, exist_ok=True)
    (review / "zoom-crops").mkdir(parents=True, exist_ok=True)
    for sid in SLIDE_IDS:
        p = PAIRS / f"{sid}.jpg"
        if p.is_file():
            (review / "pairs" / f"{sid}.jpg").write_bytes(p.read_bytes())
    for z in ZOOMS.glob("*.jpg"):
        (review / "zoom-crops" / z.name).write_bytes(z.read_bytes())
    (review / "diffs").mkdir(parents=True, exist_ok=True)
    for d in DIFFS.glob("*.png"):
        (review / "diffs" / d.name).write_bytes(d.read_bytes())

    print("wrote", MANIFEST_PATH)


if __name__ == "__main__":
    main()
