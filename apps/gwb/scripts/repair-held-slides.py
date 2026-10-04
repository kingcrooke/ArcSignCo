#!/usr/bin/env python3
"""Repair held-back GWB slide PNGs (text-only edits)."""
from __future__ import annotations

import json
import shutil
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

GWB = Path(__file__).resolve().parents[1]
ROOT = GWB.parents[1]
FONTS = {
    "anton": GWB / "public/fonts/Anton-Regular.ttf",
    "bebas": GWB / "public/fonts/BebasNeue-Regular.ttf",
    "inter": GWB / "public/fonts/Inter-Variable.ttf",
}
UPLOADS = Path("/home/ubuntu/.cursor/projects/workspace/uploads")
OUT_DOCS = ROOT / "docs/gwb-fixed-slides"
OUT_PUBLIC = GWB / "public/slides-sources"


@dataclass
class TextFix:
    left: int
    top: int
    width: int
    height: int
    old: str
    new: str
    font: str
    fill: str
    weight: int = 400
    align: str = "left"  # left | right | center


def parse_color(hex_color: str) -> tuple[int, int, int]:
    h = hex_color.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def font_for(name: str, size: int, weight: int = 400) -> ImageFont.FreeTypeFont:
    path = FONTS[name]
    try:
        return ImageFont.truetype(str(path), size=size, index=0)
    except TypeError:
        return ImageFont.truetype(str(path), size=size)


def fit_font(
    text: str, font_name: str, target_h: int, weight: int = 400, max_size: int = 200
) -> ImageFont.FreeTypeFont:
    for size in range(min(target_h + 8, max_size), 8, -1):
        font = font_for(font_name, size, weight)
        bbox = ImageDraw.Draw(Image.new("RGB", (1, 1))).textbbox((0, 0), text, font=font)
        h = bbox[3] - bbox[1]
        if h <= target_h + 1:
            return font
    return font_for(font_name, 12, weight)


def sample_patch_color(img: Image.Image, box: tuple[int, int, int, int]) -> tuple[int, int, int]:
    x0, y0, x1, y1 = box
    pad = 4
    samples = []
    w, h = img.size
    strips = [
        (max(0, x0 - 24 - pad), y0, max(0, x0 - pad), y1),
        (min(w, x1 + pad), y0, min(w, x1 + 24 + pad), y1),
        (x0, max(0, y0 - 16), x1, max(0, y0 - 2)),
    ]
    arr = np.array(img.convert("RGB"))
    for sx0, sy0, sx1, sy1 in strips:
        if sx1 <= sx0 or sy1 <= sy0:
            continue
        patch = arr[sy0:sy1, sx0:sx1]
        if patch.size:
            samples.append(patch.reshape(-1, 3))
    if not samples:
        patch = arr[y0:y1, x0:x1]
        return tuple(int(x) for x in np.median(patch.reshape(-1, 3), axis=0))
    all_px = np.vstack(samples)
    return tuple(int(x) for x in np.median(all_px, axis=0))


def inpaint_box(
    img: Image.Image, box: tuple[int, int, int, int], expand: int = 6, solid: bool = False
) -> None:
    x0, y0, x1, y1 = box
    x0 = max(0, x0 - expand)
    y0 = max(0, y0 - expand)
    x1 = min(img.width, x1 + expand)
    y1 = min(img.height, y1 + expand)
    color = sample_patch_color(img, (x0, y0, x1, y1))
    draw = ImageDraw.Draw(img)
    draw.rectangle((x0, y0, x1, y1), fill=color)
    if solid:
        return
    region = img.crop((x0, y0, x1, y1))
    blurred = region.filter(ImageFilter.GaussianBlur(radius=1.2))
    img.paste(blurred, (x0, y0))


def draw_text_in_box(
    img: Image.Image,
    text: str,
    box: tuple[int, int, int, int],
    font_name: str,
    fill: str,
    weight: int = 400,
    align: str = "left",
) -> None:
    x0, y0, x1, y1 = box
    target_h = y1 - y0
    font = fit_font(text, font_name, target_h, weight=weight)
    draw = ImageDraw.Draw(img)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    ty = y0 + (target_h - th) // 2 - bbox[1]
    if align == "left":
        tx = x0
    elif align == "right":
        tx = x1 - tw
    else:
        tx = x0 + ((x1 - x0) - tw) // 2
    draw.text((tx, ty), text, font=font, fill=parse_color(fill))


def apply_fixes(img: Image.Image, fixes: list[TextFix], solid_patches: set[int] | None = None) -> None:
    solid_patches = solid_patches or set()
    for i, fix in enumerate(fixes):
        box = (fix.left, fix.top, fix.left + fix.width, fix.top + fix.height)
        inpaint_box(img, box, solid=i in solid_patches)
        draw_text_in_box(
            img,
            fix.new,
            box,
            fix.font,
            fix.fill,
            weight=fix.weight,
            align=fix.align,
        )


def shift_region_up(img: Image.Image, region: tuple[int, int, int, int], dy: int) -> None:
    x0, y0, x1, y1 = region
    block = img.crop((x0, y0, x1, y1)).copy()
    inpaint_box(img, (x0, y0, x1, y1), expand=2)
    img.paste(block, (x0, y0 - dy))


def repair_w4_slide_10(src: Path, dest: Path) -> None:
    img = Image.open(src).convert("RGB")
    fixes = [
        TextFix(72, 170, 121, 56, "HADY", "HADI", "anton", "#f4f7fb"),
        TextFix(107, 319, 103, 25, "HADY", "HADI", "bebas", "#f4f7fb", weight=600),
        TextFix(833, 684, 87, 31, "Hady", "Hadi", "inter", "#f4f7fb", weight=600, align="right"),
    ]
    apply_fixes(img, fixes)
    img.save(dest, optimize=True)


def repair_w4_slide_14(src: Path, dest: Path) -> None:
    img = Image.open(src).convert("RGB")
    fixes = [
        TextFix(905, 948, 74, 29, "Hady", "Hadi", "inter", "#8fa3b8", weight=500, align="right"),
    ]
    apply_fixes(img, fixes)
    img.save(dest, optimize=True)


def redraw_card_badge(img: Image.Image, box: tuple[int, int, int, int], label: str) -> None:
    x0, y0, x1, y1 = box
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((x0, y0, x1, y1), radius=10, fill=(12, 12, 14))
    draw_text_in_box(
        img,
        label,
        (x0 + 4, y0 + 2, x1 - 4, y1 - 2),
        "bebas",
        "#e8b923",
        weight=600,
        align="center",
    )


def repair_vs_m3(src: Path, dest: Path) -> None:
    img = Image.open(src).convert("RGB")
    fixes = [
        TextFix(73, 147, 158, 72, "HADY", "HADI", "anton", "#f4f7fb"),
        TextFix(73, 241, 96, 23, "HADY", "HADI", "bebas", "#e8b923"),
        TextFix(833, 1112, 88, 31, "Hady", "Hadi", "inter", "#f4f7fb", weight=600, align="right"),
    ]
    apply_fixes(img, fixes)
    redraw_card_badge(img, (84, 314, 246, 354), "HADI 2-1")
    img.save(dest, optimize=True)


def repair_w4_slide_16(src: Path, dest: Path) -> None:
    img = Image.open(src).convert("RGB")
    fixes = [
        TextFix(322, 579, 74, 29, "Hady", "Hadi", "inter", "#f4f7fb", weight=500),
    ]
    apply_fixes(img, fixes)
    # Closing paragraph — shift up so "to be." clears the footer handle
    shift_region_up(img, (56, 1094, 1024, 1290), dy=88)
    original = Image.open(src).convert("RGB")
    img.paste(original.crop((0, 1306, 1080, 1350)), (0, 1306))
    img.save(dest, optimize=True)


def verify_no_hady(path: Path) -> None:
    import subprocess

    out = subprocess.check_output(
        ["tesseract", str(path), "stdout"],
        stderr=subprocess.DEVNULL,
        text=True,
    )
    if "hady" in out.lower():
        raise SystemExit(f"Hady still present in {path}")


def main() -> None:
    jobs = [
        (
            UPLOADS / "w4-slide-10_4524.png",
            OUT_DOCS / "w4-slide-10.png",
            repair_w4_slide_10,
        ),
        (
            UPLOADS / "w4-slide-14_8b5b.png",
            OUT_DOCS / "w4-slide-14.png",
            repair_w4_slide_14,
        ),
        (
            UPLOADS / "vs-m3-hady-manny_11af.png",
            OUT_DOCS / "vs-m3-hadi-manny.png",
            repair_vs_m3,
        ),
        (
            UPLOADS / "HELD-w4-slide-16-footer-overlap_c4d2.png",
            OUT_DOCS / "w4-slide-16.png",
            repair_w4_slide_16,
        ),
    ]
    OUT_DOCS.mkdir(parents=True, exist_ok=True)
    OUT_PUBLIC.mkdir(parents=True, exist_ok=True)
    manifest = []
    for src, doc_out, fn in jobs:
        if not src.exists():
            raise SystemExit(f"Missing source {src}")
        fn(src, doc_out)
        verify_no_hady(doc_out)
        manifest.append({"source": src.name, "output": doc_out.name})
        print("OK", doc_out.name)

    (OUT_DOCS / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")


if __name__ == "__main__":
    main()
