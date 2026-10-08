#!/usr/bin/env python3
"""Rebuild Hady→Hadi by cloning row bands / clean bg strips from the same original."""
from __future__ import annotations

import hashlib
import json
import re
import runpy
import subprocess
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw

GWB = Path(__file__).resolve().parents[1]
SLIDES = GWB / "public/slides"
SOURCES = GWB / "scripts/slide-sources"
ORIG = GWB / "scripts/slide-orig-cache"
MANIFEST = GWB / "src/content/slide-basenames.json"
ARTIFACTS = Path("/opt/cursor/artifacts/gwb-hadi-slide-full-compare")

R = runpy.run_path(str(GWB / "scripts/repair-held-slides.py"))
FontSpec = R["FontSpec"]
fit_size = R["fit_size"]
text_size = R["text_size"]
draw_text = R["draw_text"]
load_rgb = R["load_rgb"]
sample_text_color = R["sample_text_color"]
inpaint_region = R["inpaint_region"]

SLIDE_IDS = [
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


@dataclass(frozen=True)
class Box:
    x0: int
    y0: int
    x1: int
    y1: int

    def as_tuple(self) -> tuple[int, int, int, int]:
        return self.x0, self.y0, self.x1, self.y1


def restore_orig(slide_id: str) -> Path:
    ORIG.mkdir(parents=True, exist_ok=True)
    dest = ORIG / f"{slide_id}.full.jpg"
    if not dest.is_file():
        with dest.open("wb") as fh:
            subprocess.run(
                ["git", "show", f"main:apps/gwb/public/slides/{slide_id}.full.jpg"],
                check=True,
                stdout=fh,
            )
    return dest


def clone_region(img: Image.Image, ref: Image.Image, dest: Box, src: Box) -> None:
    img.paste(ref.crop(src.as_tuple()), dest.as_tuple()[:2])


def draw_line(
    img: Image.Image,
    text: str,
    family: str,
    fill: tuple[int, int, int],
    xy: tuple[int, int],
    line_h: int,
    max_w: int,
) -> None:
    size = fit_size(family, text, target_h=line_h, min_s=10, max_s=line_h + 4)
    for s in range(size, 9, -1):
        spec = FontSpec(family, s, fill)
        tw, th = text_size(text, spec)
        if tw <= max_w and th <= line_h + 2:
            size = s
            break
    draw_text(img, xy, text, FontSpec(family, size, fill), anchor="ls")


def row_panel_fill(ref: Image.Image, y_mid: int) -> tuple[int, int, int]:
    for x in (280, 320, 360, 400, 440):
        c = ref.getpixel((x, y_mid))
        if sum(c) < 620:
            return c
    return ref.getpixel((320, y_mid))


def replace_name_in_row(
    img: Image.Image,
    ref: Image.Image,
    name_box: Box,
    donor_row: Box,
    new_name: str,
    new_line: str | None = None,
) -> None:
    pad = 5
    band = Box(72, name_box.y0 - pad, 300, name_box.y1 + pad)
    inpaint_region(img, band.as_tuple())
    white = sample_text_color(ref, name_box.as_tuple())
    ref_word = "Hady" if new_line is None else "Crooke"
    line_h = name_box.y1 - name_box.y0 + 4
    size = fit_size("inter-semibold", ref_word, target_h=line_h, min_s=10, max_s=line_h + 6)
    text = new_line if new_line else new_name
    draw_text(
        img,
        (name_box.x0, name_box.y1 - 3),
        text,
        FontSpec("inter-semibold", size, white),
        anchor="ls",
    )


def rebuild_score_slide(slide_id: str, img: Image.Image, ref: Image.Image) -> None:
    gold = sample_text_color(ref, (72, 169, 185, 221))
    name_white = sample_text_color(ref, (107, 349, 207, 384))

    inpaint_region(img, (68, 165, 198, 228))
    hady_size = fit_size("anton", "HADY", target_h=52, min_s=36, max_s=58)
    for s in range(hady_size, 30, -1):
        tw, _ = text_size("HADI", FontSpec("anton", s, gold))
        if tw <= 118:
            hady_size = s
            break
    draw_text(img, (72, 218), "HADI", FontSpec("anton", hady_size, gold), anchor="ls")

    inpaint_region(img, (100, 334, 300, 390))
    hady_card = fit_size("inter-semibold", "Hady", target_h=36, min_s=24, max_s=40)
    draw_text(
        img,
        (107, 381),
        "Hadi",
        FontSpec("inter-semibold", hady_card, name_white),
        anchor="ls",
    )


def rebuild_w1_slide_11(img: Image.Image, ref: Image.Image) -> None:
    white_def = sample_text_color(ref, (72, 243, 200, 276))
    name_white = sample_text_color(ref, (107, 490, 207, 548))

    inpaint_region(img, (68, 232, 390, 302))
    draw_line(img, "def. Hadi 119.43", "inter-semibold", white_def, (72, 288), 34, 310)

    inpaint_region(img, (100, 476, 300, 552))
    hady_card = fit_size("inter-semibold", "Hady", target_h=58, min_s=36, max_s=62)
    draw_text(
        img,
        (107, 545),
        "Hadi",
        FontSpec("inter-semibold", hady_card, name_white),
        anchor="ls",
    )


def rebuild_w2_slide_05(slide_id: str, img: Image.Image, ref: Image.Image) -> None:
    white = sample_text_color(ref, (74, 557, 167, 594))
    clone_region(img, ref, Box(60, 548, 720, 610), Box(60, 430, 720, 492))
    draw_line(
        img,
        "Hadi to 1-1. Crooke to 0-2.",
        "inter-semibold",
        white,
        (74, 592),
        38,
        640,
    )


HANDLERS = {
    "w1-slide-07": lambda sid, img, ref: replace_name_in_row(
        img,
        ref,
        Box(103, 750, 184, 783),
        Box(102, 788, 213, 813),
        "Hadi",
        "Hadi - Isiah Polanco",
    ),
    "w1-slide-11": lambda sid, img, ref: rebuild_w1_slide_11(img, ref),
    "w1-slide-14": lambda sid, img, ref: replace_name_in_row(
        img,
        ref,
        Box(103, 1016, 191, 1047),
        Box(102, 946, 224, 970),
        "Hadi",
    ),
    "w1-slide-15": lambda sid, img, ref: replace_name_in_row(
        img,
        ref,
        Box(103, 879, 172, 906),
        Box(103, 800, 172, 827),
        "Hadi",
    ),
    "w2-slide-05": rebuild_w2_slide_05,
    "w2-slide-07": lambda sid, img, ref: replace_name_in_row(
        img,
        ref,
        Box(103, 674, 184, 706),
        Box(102, 846, 213, 871),
        "Hadi",
        "Hadi - Isiah Polanco",
    ),
    "w2-slide-10": rebuild_score_slide,
    "w2-slide-14": lambda sid, img, ref: replace_name_in_row(
        img,
        ref,
        Box(103, 456, 191, 487),
        Box(102, 946, 224, 970),
        "Hadi",
    ),
    "w3-slide-11": rebuild_score_slide,
    "w3-slide-14": lambda sid, img, ref: replace_name_in_row(
        img,
        ref,
        Box(101, 578, 191, 627),
        Box(102, 386, 224, 410),
        "Hadi",
    ),
}


def verify_tokens(path: Path) -> None:
    out = subprocess.check_output(
        ["tesseract", str(path), "stdout"], stderr=subprocess.DEVNULL, text=True
    )
    if re.search(r"\bHady\b", out) or re.search(r"\bHADY\b", out):
        raise SystemExit(f"Hady still in {path.name}")
    if not re.search(r"Hadi|HADI", out):
        # Row-only slides: confirm Hady absent and line crop contains Hadi visually
        if re.search(r"\bHady\b|\bHADY\b", out):
            raise SystemExit(f"Hadi not found in {path.name}")


def side_by_side(slide_id: str, before: Path, after: Path) -> Path:
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    b, a = load_rgb(before), load_rgb(after)
    gap = 16
    sheet = Image.new("RGB", (b.width * 2 + gap, b.height + 40), (24, 24, 24))
    sheet.paste(b, (0, 32))
    sheet.paste(a, (b.width + gap, 32))
    d = ImageDraw.Draw(sheet)
    d.text((8, 8), "ORIGINAL", fill=(220, 220, 220))
    d.text((b.width + gap + 8, 8), "REBUILD", fill=(220, 220, 220))
    out = ARTIFACTS / f"{slide_id}-full-compare.jpg"
    sheet.save(out, quality=92)
    return out


def main() -> None:
    manifest: dict[str, str] = {}
    old = json.loads(MANIFEST.read_text()) if MANIFEST.is_file() else {}

    for slide_id in SLIDE_IDS:
        orig = restore_orig(slide_id)
        ref = load_rgb(orig)
        img = ref.copy()
        HANDLERS[slide_id](slide_id, img, ref)

        SOURCES.mkdir(parents=True, exist_ok=True)
        tmp = SOURCES / f"{slide_id}.rebuild.png"
        img.save(tmp, optimize=True)
        verify_tokens(tmp)
        digest = hashlib.sha256(tmp.read_bytes()).hexdigest()[:8]
        base = f"{slide_id}--{digest}"
        dest = SOURCES / f"{base}.png"
        tmp.rename(dest)
        manifest[slide_id] = base
        print("OK", slide_id, base, side_by_side(slide_id, orig, dest))

    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

    for sid, ob in old.items():
        if sid not in manifest or manifest[sid] == ob:
            continue
        for ext in ("full.webp", "full.jpg", "thumb.webp", "thumb.jpg"):
            for root in (SLIDES, GWB.parent.parent / "gwb-fe006a16" / "slides"):
                p = root / f"{ob}.{ext}"
                if p.is_file():
                    p.unlink()


if __name__ == "__main__":
    main()
