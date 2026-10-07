#!/usr/bin/env python3
"""High-fidelity text repairs for held-back GWB slide PNGs."""
from __future__ import annotations

import json
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

GWB = Path(__file__).resolve().parents[1]
ROOT = GWB.parents[1]
FONT_DIR = GWB / "scripts/fonts-local"
FONTS = {
    "anton": FONT_DIR / "Anton-Regular.ttf",
    "bebas": FONT_DIR / "BebasNeue-Regular.ttf",
    "inter": FONT_DIR / "Inter-Regular.ttf",
    "inter-semibold": FONT_DIR / "Inter-SemiBold.ttf",
}
UPLOADS = Path("/home/ubuntu/.cursor/projects/workspace/uploads")
OUT_DOCS = ROOT / "docs/gwb-fixed-slides"


@dataclass(frozen=True)
class FontSpec:
    family: str
    size: int
    fill: tuple[int, int, int]


def load_rgb(path: Path) -> Image.Image:
    return Image.open(path).convert("RGB")


def inpaint_text_in_box(img: Image.Image, box: tuple[int, int, int, int]) -> None:
    """Inpaint only bright glyph pixels inside a box (preserves background art)."""
    x0, y0, x1, y1 = box
    x0, y0 = max(0, x0), max(0, y0)
    x1, y1 = min(img.width, x1), min(img.height, y1)
    if x1 <= x0 or y1 <= y0:
        return
    arr = np.array(img)
    patch = arr[y0:y1, x0:x1]
    lum = patch.max(axis=2)
    mask_local = (lum > lum.mean() + 18) | (lum > 175)
    if mask_local.sum() < 12:
        return
    full_mask = np.zeros(arr.shape[:2], np.uint8)
    full_mask[y0:y1, x0:x1] = (mask_local.astype(np.uint8) * 255)
    full_mask = cv2.dilate(full_mask, np.ones((5, 5), np.uint8), iterations=1)
    bgr = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)
    cleaned = cv2.inpaint(bgr, full_mask, 4, cv2.INPAINT_TELEA)
    img.paste(Image.fromarray(cv2.cvtColor(cleaned, cv2.COLOR_BGR2RGB)))


def inpaint_region(img: Image.Image, box: tuple[int, int, int, int]) -> None:
    x0, y0, x1, y1 = box
    x0, y0 = max(0, x0), max(0, y0)
    x1, y1 = min(img.width, x1), min(img.height, y1)
    if x1 <= x0 or y1 <= y0:
        return
    arr = np.array(img)
    bgr = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)
    mask = np.zeros(bgr.shape[:2], np.uint8)
    cv2.rectangle(mask, (x0, y0), (x1 - 1, y1 - 1), 255, -1)
    cleaned = cv2.inpaint(bgr, mask, 5, cv2.INPAINT_NS)
    img.paste(Image.fromarray(cv2.cvtColor(cleaned, cv2.COLOR_BGR2RGB)))


def expand_box(
    box: tuple[int, int, int, int],
    pad: int,
    max_w: int,
    max_h: int,
) -> tuple[int, int, int, int]:
    x0, y0, x1, y1 = box
    return (
        max(0, x0 - pad),
        max(0, y0 - pad),
        min(max_w, x1 + pad),
        min(max_h, y1 + pad),
    )


def sample_panel_fill(
    img: Image.Image, box: tuple[int, int, int, int]
) -> tuple[int, int, int]:
    x0, y0, x1, y1 = box
    strips = [
        img.crop((x0, max(0, y0 - 6), x1, y0)),
        img.crop((x0, y1, x1, min(img.height, y1 + 6))),
        img.crop((max(0, x0 - 6), y0, x0, y1)),
        img.crop((x1, y0, min(img.width, x1 + 6), y1)),
    ]
    pixels = np.concatenate([np.array(s).reshape(-1, 3) for s in strips if s.size])
    if pixels.size == 0:
        return tuple(int(x) for x in np.array(img.crop(box)).mean(axis=(0, 1)))
    return tuple(int(x) for x in pixels.mean(axis=0))


def box_is_flat(img: Image.Image, box: tuple[int, int, int, int], threshold: float = 28.0) -> bool:
    patch = np.array(img.crop(box))
    return float(patch.std()) < threshold


def clear_text_area(
    img: Image.Image, box: tuple[int, int, int, int], pad: int = 10
) -> None:
    """Cover an entire text line or word box before re-typesetting."""
    region = expand_box(box, pad, img.width, img.height)
    if box_is_flat(img, region):
        fill = sample_panel_fill(img, region)
        ImageDraw.Draw(img).rectangle(region, fill=fill)
    else:
        inpaint_region(img, region)


def inpaint_gold_text_on_crop(crop: Image.Image) -> Image.Image:
    arr = np.array(crop)
    gold = (arr[:, :, 0] > 190) & (arr[:, :, 1] > 115) & (arr[:, :, 2] < 145)
    if gold.sum() < 20:
        return crop
    bgr = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)
    mask = np.zeros(arr.shape[:2], np.uint8)
    mask[gold] = 255
    mask = cv2.dilate(mask, np.ones((3, 3), np.uint8), iterations=1)
    cleaned = cv2.inpaint(bgr, mask, 3, cv2.INPAINT_NS)
    return Image.fromarray(cv2.cvtColor(cleaned, cv2.COLOR_BGR2RGB))


def sample_text_color(
    img: Image.Image, box: tuple[int, int, int, int]
) -> tuple[int, int, int]:
    arr = np.array(img.crop(box))
    lum = arr.max(axis=2)
    mask = lum > lum.mean() + 12
    if mask.sum() < 8:
        return tuple(int(x) for x in arr.reshape(-1, 3).mean(axis=0))
    return tuple(int(x) for x in arr[mask].mean(axis=0))


def font(spec: FontSpec) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONTS[spec.family]), spec.size)


def text_size(text: str, spec: FontSpec) -> tuple[int, int]:
    d = ImageDraw.Draw(Image.new("RGB", (4, 4)))
    b = d.textbbox((0, 0), text, font=font(spec))
    return b[2] - b[0], b[3] - b[1]


def fit_size(
    family: str,
    text: str,
    target_h: int,
    min_s: int = 12,
    max_s: int = 120,
) -> int:
    best = min_s
    for size in range(min_s, max_s + 1):
        spec = FontSpec(family, size, (255, 255, 255))
        h = text_size(text, spec)[1]
        if h <= target_h:
            best = size
        else:
            break
    return best


def draw_text(
    img: Image.Image,
    xy: tuple[int, int],
    text: str,
    spec: FontSpec,
    anchor: str = "ls",
) -> None:
    d = ImageDraw.Draw(img)
    d.text(xy, text, font=font(spec), fill=spec.fill, anchor=anchor)


def replace_word_in_box(
    img: Image.Image,
    box: tuple[int, int, int, int],
    new_word: str,
    family: str,
    fill: tuple[int, int, int],
) -> None:
    x0, y0, x1, y1 = box
    target_h = y1 - y0
    target_w = x1 - x0
    clear_text_area(img, box, pad=8)
    size = fit_size(family, new_word, target_h=target_h - 2, min_s=12, max_s=120)
    for candidate in range(size, 11, -1):
        spec = FontSpec(family, candidate, fill)
        tw, th = text_size(new_word, spec)
        if tw <= target_w + 10 and th <= target_h + 2:
            size = candidate
            break
    draw_text(img, (x0, y0), new_word, FontSpec(family, size, fill), anchor="ls")


def replace_line_in_box(
    img: Image.Image,
    box: tuple[int, int, int, int],
    new_line: str,
    family: str,
    fill: tuple[int, int, int],
) -> None:
    x0, y0, x1, y1 = box
    target_h = y1 - y0
    target_w = x1 - x0
    clear_text_area(img, box, pad=12)
    size = fit_size(family, new_line, target_h=target_h - 2, min_s=12, max_s=120)
    for candidate in range(size, 11, -1):
        spec = FontSpec(family, candidate, fill)
        tw, th = text_size(new_line, spec)
        if tw <= target_w + 8 and th <= target_h + 2:
            size = candidate
            break
    draw_text(img, (x0, y0), new_line, FontSpec(family, size, fill), anchor="ls")


def repair_vs_matchup_layout(img: Image.Image, poll_y: int) -> None:
    """vs-m3 card — full-line re-typeset for Hadi→Hadi."""
    white = sample_text_color(img, (353, 147, 574, 219))
    gold = sample_text_color(img, (73, 241, 169, 264))
    replace_line_in_box(img, (60, 135, 590, 228), "Hadi VS MANNY", "anton", white)
    replace_line_in_box(
        img,
        (60, 228, 520, 270),
        "Hadi (2-1) VS MANNY (2-1)",
        "bebas",
        gold,
    )
    poll_white = sample_text_color(img, (833, poll_y, 921, poll_y + 32))
    replace_word_in_box(
        img,
        (833, poll_y, 921, poll_y + 31),
        "Hadi",
        "bebas",
        poll_white,
    )


def repair_w4_slide_10(src: Path, dest: Path) -> None:
    img = load_rgb(src)
    white = sample_text_color(img, (285, 170, 454, 226))
    replace_word_in_box(img, (72, 170, 193, 226), "Hadi", "anton", white)
    ref_color = sample_text_color(img, (107, 505, 246, 530))
    replace_word_in_box(img, (107, 319, 210, 344), "Hadi", "bebas", ref_color)
    poll_white = sample_text_color(img, (833, 684, 920, 715))
    replace_word_in_box(img, (833, 684, 920, 715), "Hadi", "bebas", poll_white)
    img.save(dest, optimize=True)


def repair_w4_slide_14(src: Path, dest: Path) -> None:
    img = load_rgb(src)
    gray = sample_text_color(img, (856, 878, 979, 901))
    replace_line_in_box(
        img,
        (95, 935, 990, 985),
        "14 Kyler - Hadi",
        "inter-semibold",
        gray,
    )
    img.save(dest, optimize=True)


def repair_w4_slide_06(src: Path, dest: Path) -> None:
    img = load_rgb(src)
    fill = sample_text_color(img, (188, 562, 280, 600))
    replace_line_in_box(
        img,
        (55, 555, 640, 605),
        "Hadi goes from AJ Barner...",
        "inter-semibold",
        fill,
    )
    img.save(dest, optimize=True)


def repair_vs_m3(src: Path, dest: Path) -> None:
    img = load_rgb(src)
    repair_vs_matchup_layout(img, poll_y=1113)
    img.save(dest, optimize=True)


def tesseract_word_boxes(path: Path, min_y: int, max_y: int) -> list[tuple[int, int, int, int]]:
    out = Path("/tmp/repair-tsv")
    subprocess.run(
        ["tesseract", str(path), str(out.with_suffix("")), "tsv"],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    boxes: list[tuple[int, int, int, int]] = []
    lines = out.with_suffix(".tsv").read_text().splitlines()
    header = lines[0].split("\t")
    for line in lines[1:]:
        parts = line.split("\t")
        if len(parts) < 12:
            continue
        row = dict(zip(header, parts))
        if not row.get("text", "").strip():
            continue
        top = int(row["top"])
        if top < min_y or top > max_y:
            continue
        left, width, height = int(row["left"]), int(row["width"]), int(row["height"])
        pad = 4
        boxes.append(
            (
                left - pad,
                top - pad,
                left + width + pad,
                top + height + pad,
            )
        )
    return boxes


def extend_background_band(
    img: Image.Image, dest_y0: int, dest_y1: int, src_y0: int, src_y1: int
) -> None:
    strip = img.crop((0, src_y0, img.width, src_y1))
    h = src_y1 - src_y0
    y = dest_y0
    while y < dest_y1:
        img.paste(strip, (0, y))
        y += h


def restore_w4_footer(img: Image.Image, ref: Image.Image, page_label: str) -> None:
    footer_color = sample_text_color(ref, (72, 1261, 360, 1297))
    page_color = sample_text_color(ref, (925, 1266, 1009, 1289))
    inpaint_text_in_box(img, (60, 1248, 380, 1302))
    inpaint_text_in_box(img, (900, 1258, 1018, 1298))
    footer_size = fit_size("inter", "gwb_fantasy_football", target_h=34, min_s=24, max_s=34)
    draw_text(
        img,
        (72, 1297),
        "gwb_fantasy_football",
        FontSpec("inter", footer_size, footer_color),
        anchor="ls",
    )
    page_size = fit_size("inter", page_label, target_h=23, min_s=20, max_s=26)
    draw_text(
        img,
        (1008, 1332),
        page_label,
        FontSpec("inter", page_size, page_color),
        anchor="rs",
    )


def repair_w4_slide_16(src: Path, footer_ref: Path, dest: Path) -> None:
    img = load_rgb(src)
    ref_footer = load_rgb(footer_ref)

    pick_color = sample_text_color(img, (428, 579, 486, 602))
    replace_word_in_box(img, (322, 579, 396, 608), "Hadi", "inter-semibold", pick_color)

    for box in tesseract_word_boxes(src, 828, 1295):
        inpaint_text_in_box(img, box)

    extend_background_band(img, 836, 1260, 996, 1036)

    body_color = sample_text_color(img, (72, 779, 400, 831))
    if sum(body_color) < 120:
        body_color = (245, 245, 245)
    heading_color = sample_text_color(img, (72, 713, 260, 743))
    if sum(heading_color) < 120:
        heading_color = (236, 108, 108)
    heading_size = fit_size("inter-semibold", "God help us all:", target_h=26, min_s=24, max_s=32)
    draw_text(
        img,
        (72, 848),
        "God help us all:",
        FontSpec("inter-semibold", heading_size, heading_color),
        anchor="ls",
    )

    lines = [
        "Steven is the final boss. Kayser refuses",
        "the Bottom 6. Jamil robbed the wire.",
        "Week 4 hasn't started and we're already",
        "fighting. GWB is exactly where it needs",
        "to be.",
    ]
    body_size = fit_size("inter-semibold", lines[0], target_h=28, min_s=28, max_s=36)
    spec = FontSpec("inter-semibold", body_size, body_color)
    line_h = int(body_size * 1.38)
    y = 888
    for line in lines:
        draw_text(img, (72, y), line, spec, anchor="ls")
        y += line_h

    footer_top = 1260
    if y + 40 > footer_top:
        raise SystemExit(f"slide 16 body too low: last line y={y}, need 40px above {footer_top}")

    restore_w4_footer(img, ref_footer, "16/16")
    img.save(dest, optimize=True)


def verify_no_hady(path: Path) -> None:
    out = subprocess.check_output(
        ["tesseract", str(path), "stdout"], stderr=subprocess.DEVNULL, text=True
    )
    if re.search(r"\bHady\b", out, re.IGNORECASE):
        raise SystemExit(f"Hady still present in {path}")


def main() -> None:
    OUT_DOCS.mkdir(parents=True, exist_ok=True)
    footer_ref = UPLOADS / "w4-slide-15_9529.png"
    jobs: list[tuple[Path, Path, object]] = [
        (UPLOADS / "w4-slide-06_804c.png", OUT_DOCS / "w4-slide-06.png", repair_w4_slide_06),
        (UPLOADS / "w4-slide-10_4524.png", OUT_DOCS / "w4-slide-10.png", repair_w4_slide_10),
        (UPLOADS / "w4-slide-14_8b5b.png", OUT_DOCS / "w4-slide-14.png", repair_w4_slide_14),
        (
            UPLOADS / "vs-m3-hady-manny_11af.png",
            OUT_DOCS / "vs-m3-hadi-manny.png",
            repair_vs_m3,
        ),
    ]
    repair_w4_slide_16(
        UPLOADS / "HELD-w4-slide-16-footer-overlap_c4d2.png",
        footer_ref,
        OUT_DOCS / "w4-slide-16.png",
    )
    verify_no_hady(OUT_DOCS / "w4-slide-16.png")
    print("OK w4-slide-16.png")

    manifest = [{"source": "HELD-w4-slide-16-footer-overlap", "output": "w4-slide-16.png"}]
    for src, dest, fn in jobs:
        fn(src, dest)
        verify_no_hady(dest)
        manifest.append({"source": src.name, "output": dest.name})
        print("OK", dest.name)

    (OUT_DOCS / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")


if __name__ == "__main__":
    main()
