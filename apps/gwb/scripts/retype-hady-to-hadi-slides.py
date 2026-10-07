#!/usr/bin/env python3
"""Hady→Hadi on W1–W3 report slides via last-letter glyph splice (no re-typeset)."""
from __future__ import annotations

import hashlib
import json
import re
import runpy
import subprocess
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

GWB = Path(__file__).resolve().parents[1]
SLIDES = GWB / "public/slides"
SOURCES = GWB / "scripts/slide-sources"
ORIG_CACHE = GWB / "scripts/slide-orig-cache"
MANIFEST = GWB / "src/content/slide-basenames.json"
CROP_DIR = Path("/opt/cursor/artifacts/gwb-hadi-slide-crops")

R = runpy.run_path(str(GWB / "scripts/repair-held-slides.py"))

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


@dataclass
class Word:
    text: str
    left: int
    top: int
    width: int
    height: int

    @property
    def right(self) -> int:
        return self.left + self.width

    @property
    def bottom(self) -> int:
        return self.top + self.height

    @property
    def box(self) -> tuple[int, int, int, int]:
        p = 4
        return (
            self.left - p,
            self.top - p,
            self.right + p,
            self.bottom + p,
        )


def tesseract_words(path: Path, psm: int | None = None) -> list[Word]:
    out = Path("/tmp/retype-tsv")
    cmd = ["tesseract", str(path), str(out), "tsv"]
    if psm is not None:
        cmd.extend(["--psm", str(psm)])
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    lines = out.with_suffix(".tsv").read_text().splitlines()
    header = lines[0].split("\t")
    words: list[Word] = []
    for line in lines[1:]:
        parts = line.split("\t")
        if len(parts) < 12:
            continue
        row = dict(zip(header, parts))
        text = row.get("text", "").strip()
        if not text:
            continue
        words.append(
            Word(
                text,
                int(row["left"]),
                int(row["top"]),
                int(row["width"]),
                int(row["height"]),
            )
        )
    return words


def find_word(words: list[Word], pattern: str) -> Word | None:
    rx = re.compile(pattern, re.I)
    for w in words:
        if rx.search(w.text):
            return w
    return None


def find_title_hady(words: list[Word]) -> Word | None:
    return next((w for w in words if w.text == "Hady"), None)


def find_headline_hady(words: list[Word]) -> Word | None:
    return next((w for w in words if w.text == "HADY"), None)


def char_span(
    word: Word, text: str, index: int, *, last_scale: float = 1.0
) -> tuple[int, int, int, int]:
    n = max(len(text), 1)
    x0 = word.left + int(word.width * index / n)
    if index == n - 1:
        x1 = word.right + 2
    else:
        x1 = word.left + int(word.width * (index + 1) / n)
    return x0, word.top, x1, word.bottom


def clear_char_background(
    img: Image.Image,
    box: tuple[int, int, int, int],
    solid_sample: tuple[int, int] | None = None,
) -> None:
    x0, y0, x1, y1 = box
    pad = 4
    region = R["expand_box"](box, pad, img.width, img.height)
    if solid_sample is not None:
        fill = img.getpixel(solid_sample)
        ImageDraw.Draw(img).rectangle(region, fill=fill)
        return
    if R["box_is_flat"](img, region, threshold=32.0):
        fill = R["sample_panel_fill"](img, region)
        ImageDraw.Draw(img).rectangle(region, fill=fill)
        return
    w, h = x1 - x0, y1 - y0
    src_x = min(img.width - w - 4, x1 + max(24, w))
    if src_x + w < img.width:
        patch = img.crop((src_x, y0, src_x + w, y1))
        img.paste(patch, (x0, y0))
        return
    R["inpaint_text_in_box"](img, region)


def paste_glyph(
    img: Image.Image,
    target: tuple[int, int, int, int],
    donor: Image.Image,
    source: tuple[int, int, int, int],
    gold_mask: bool = False,
) -> None:
    x0, y0, x1, y1 = target
    tw, th = x1 - x0, y1 - y0
    if tw < 2 or th < 2:
        return
    sx0, sy0, sx1, sy1 = source
    glyph = donor.crop((sx0, sy0, sx1, sy1))
    glyph = glyph.resize((tw, th), Image.Resampling.LANCZOS)
    if not gold_mask:
        img.paste(glyph, (x0, y0))
        return
    arr = np.array(glyph)
    rgb = arr[:, :, :3]
    lum = rgb.max(axis=2)
    mask = (
        (rgb[:, :, 0] > 145)
        & (rgb[:, :, 1] > 85)
        & (rgb[:, :, 2] < 155)
        & (lum > 95)
    )
    base = np.array(img.crop((x0, y0, x1, y1)))
    base[mask] = rgb[mask]
    img.paste(Image.fromarray(base), (x0, y0))


def splice_last_letter(
    img: Image.Image,
    target: Word,
    target_text: str,
    donor_img: Image.Image,
    donor: Word,
    donor_text: str,
    donor_letter: str,
    solid_sample: tuple[int, int] | None = None,
) -> None:
    if not target_text:
        target_text = target.text.lstrip("_")
    donor_letter = donor_letter.lower()
    d_idx = donor_text.lower().index(donor_letter)
    t_idx = len(target_text) - 1
    d_last_scale = 0.22 if donor_text and donor_text[0].isdigit() else 1.0
    t_box = char_span(target, target_text, t_idx)
    x0, y0, x1, y1 = t_box
    if target_text.isupper():
        x0 = target.left + int(target.width * 0.52)
        t_box = (x0, y0, target.right + 4, y1)
    else:
        x0 = target.left + int(target.width * 0.68)
        t_box = (x0, y0, target.right + 3, y1)
    d_box = char_span(donor, donor_text, d_idx, last_scale=d_last_scale)
    clear_char_background(img, t_box, solid_sample=solid_sample)
    paste_glyph(
        img,
        t_box,
        donor_img,
        d_box,
        gold_mask=target_text.isupper(),
    )


def pick_lowercase_i_donor(
    words: list[Word],
    near_y: int,
    target_height: int,
    exclude: Word | None = None,
) -> tuple[Word, str, str]:
    candidates: list[tuple[int, int, Word, str, int]] = []
    for w in words:
        if w is exclude:
            continue
        plain = w.text.strip('"').strip("'")
        if not re.match(r"^[A-Z][a-z]{2,}$", plain):
            continue
        if abs(w.height - target_height) > 12:
            continue
        low = plain.lower()
        if "i" not in low:
            continue
        idx = low.index("i")
        dist = abs(w.top - near_y)
        candidates.append((dist, abs(w.height - target_height), w, plain, idx))
    if not candidates:
        for w in words:
            if w is exclude:
                continue
            plain = w.text.strip('"').strip("'")
            low = plain.lower()
            if "i" not in low:
                continue
            if abs(w.height - target_height) > 20:
                continue
            idx = low.index("i")
            dist = abs(w.top - near_y)
            candidates.append((dist, abs(w.height - target_height), w, plain, idx))
    if not candidates:
        for w in words:
            if w is exclude:
                continue
            plain = w.text.strip('"').strip("'")
            low = plain.lower()
            if "i" not in low:
                continue
            idx = low.index("i")
            dist = abs(w.top - near_y)
            candidates.append((dist, abs(w.height - target_height), w, plain, idx))
    if not candidates:
        raise ValueError(f"no lowercase i donor near y={near_y} h={target_height}")
    candidates.sort(key=lambda t: (t[0], t[1]))
    _, _, word, text, idx = candidates[0]
    return word, text, text[idx]


def pick_headline_i_donor() -> tuple[Image.Image, Word, str]:
    path = headline_donor_path()
    words = tesseract_words(path)
    hadi = next((w for w in words if w.text == "HADI" and w.height >= 40), None)
    if not hadi:
        raise ValueError("results card missing HADI headline glyph")
    return R["load_rgb"](path), hadi, "HADI"


def headline_donor_path() -> Path:
    p = SLIDES / "results-w2-m1.full.jpg"
    if not p.is_file():
        with p.open("wb") as fh:
            subprocess.run(
                ["git", "show", "main:apps/gwb/public/slides/results-w2-m1.full.jpg"],
                check=True,
                stdout=fh,
            )
    return p


def restore_orig(slide_id: str) -> Path:
    ORIG_CACHE.mkdir(parents=True, exist_ok=True)
    dest = ORIG_CACHE / f"{slide_id}.full.jpg"
    if not dest.is_file():
        with dest.open("wb") as fh:
            subprocess.run(
                ["git", "show", f"main:apps/gwb/public/slides/{slide_id}.full.jpg"],
                check=True,
                stdout=fh,
            )
    return dest


def repair_row_hady(img: Image.Image, words: list[Word]) -> None:
    hady = find_title_hady(words)
    if not hady:
        raise ValueError("no Hady row")
    jamil = find_word(words, r"^Jamil$")
    if jamil:
        donor_w, donor_t = jamil, "Jamil"
    else:
        donor_w, donor_t, _ = pick_lowercase_i_donor(
            words, hady.top, hady.height, exclude=hady
        )
    splice_last_letter(img, hady, "Hady", img, donor_w, donor_t, "i")


def repair_headline_hady(img: Image.Image, words: list[Word]) -> None:
    hady = find_headline_hady(words)
    if not hady:
        raise ValueError("no HADY headline")
    gold = R["sample_text_color"](img, hady.box)
    box = hady.box
    w, h = box[2] - box[0], box[3] - box[1]
    sx = min(img.width - w - 4, hady.right + 40)
    patch = img.crop((sx, box[1], sx + w, box[3]))
    img.paste(patch, (box[0], box[1]))
    size = R["fit_size"]("anton", "HADI", target_h=hady.height - 2, min_s=24, max_s=72)
    R["draw_text"](
        img,
        (hady.left, hady.bottom - 2),
        "HADI",
        R["FontSpec"]("anton", size, gold),
        anchor="ls",
    )


def repair_card_hady(img: Image.Image, words: list[Word]) -> None:
    hady = find_title_hady(words)
    if not hady:
        raise ValueError("no Hady card name")
    isiah = find_word(words, r"Isiah")
    if hady.height > 42 and isiah:
        donor_t = isiah.text.strip('"').strip("'")
        sample = (min(img.width - 8, hady.right + 100), hady.top + hady.height // 2)
        splice_last_letter(
            img, hady, "Hady", img, isiah, donor_t, "i", solid_sample=sample
        )
        return
    white = R["sample_text_color"](img, hady.box)
    box = R["expand_box"](hady.box, 4, img.width, img.height)
    sample = (min(img.width - 8, hady.right + 100), hady.top + hady.height // 2)
    clear_char_background(img, box, solid_sample=sample)
    size = R["fit_size"](
        "dejavu-bold",
        "Hadi",
        target_h=hady.height - 2,
        min_s=12,
        max_s=max(24, hady.height),
    )
    R["draw_text"](
        img,
        (hady.left, hady.bottom - 2),
        "Hadi",
        R["FontSpec"]("dejavu-bold", size, white),
        anchor="ls",
    )


def repair_score_slide(img: Image.Image, words: list[Word]) -> None:
    repair_card_hady(img, words)
    repair_headline_hady(img, words)


def tesseract_words_after(img: Image.Image, _prev: list[Word]) -> list[Word]:
    tmp = Path("/tmp/retype-slide.jpg")
    img.save(tmp, quality=95)
    return tesseract_words(tmp)


def repair_w1_slide_11(img: Image.Image, words: list[Word]) -> None:
    line = img.crop((60, 220, 520, 320))
    line_path = Path("/tmp/w11-def-line.png")
    line.save(line_path)
    lw = tesseract_words(line_path, psm=7)
    hady_line = find_word(lw, r"Hady")
    if not hady_line:
        raise ValueError("w1-slide-11 def line Hady")
    text = hady_line.text.lstrip("_")
    raw = hady_line.text
    skip = len(raw) - len(text)
    n = max(len(raw), 1)
    left = hady_line.left + 60 + int(hady_line.width * skip / n)
    width = int(hady_line.width * len(text) / n)
    def_w = find_word(lw, r"def")
    line_h = def_w.height if def_w else 36
    top = hady_line.top + 220 + hady_line.height - line_h
    hady_global = Word(text, left, top, width, line_h)
    donor_w, donor_t, _ = pick_lowercase_i_donor(
        words, hady_global.top, hady_global.height, exclude=None
    )
    splice_last_letter(img, hady_global, text, img, donor_w, donor_t, "i")
    repair_card_hady(img, words)


def repair_w2_slide_05(img: Image.Image, words: list[Word]) -> None:
    hady = find_title_hady(words)
    if not hady:
        raise ValueError("w2-slide-05")
    donor_w, donor_t, _ = pick_lowercase_i_donor(
        words, hady.top, hady.height, exclude=hady
    )
    splice_last_letter(img, hady, "Hady", img, donor_w, donor_t, "i")


def repair_w3_slide_14(img: Image.Image, words: list[Word]) -> None:
    hadies = [w for w in words if w.text in ("Hady", "HADY")]
    for hady in sorted(hadies, key=lambda w: w.top):
        donor_w, donor_t, _ = pick_lowercase_i_donor(
            words, hady.top, hady.height, exclude=hady
        )
        splice_last_letter(img, hady, "Hady", img, donor_w, donor_t, "i")
        words = tesseract_words_after(img, words)


HANDLERS = {
    "w1-slide-07": repair_row_hady,
    "w1-slide-11": repair_w1_slide_11,
    "w1-slide-14": repair_row_hady,
    "w1-slide-15": repair_row_hady,
    "w2-slide-05": repair_w2_slide_05,
    "w2-slide-07": repair_row_hady,
    "w2-slide-10": repair_score_slide,
    "w2-slide-14": repair_row_hady,
    "w3-slide-11": repair_score_slide,
    "w3-slide-14": repair_w3_slide_14,
}


def verify_no_hady(path: Path) -> None:
    for w in tesseract_words(path):
        if w.text in ("Hady", "HADY"):
            raise SystemExit(f"Hady token still in {path.name}: {w.text!r}")


def _crop_sheet(
    before: Image.Image, after: Image.Image, region: tuple[int, int, int, int], label: str
) -> Image.Image:
    from PIL import ImageDraw

    x0, y0, x1, y1 = region
    cb = before.crop(region)
    ca = after.crop(region)
    sheet = Image.new(
        "RGB", (cb.width * 2 + 12, max(cb.height, ca.height) + 28), (32, 32, 32)
    )
    sheet.paste(cb, (0, 24))
    sheet.paste(ca, (cb.width + 12, 24))
    d = ImageDraw.Draw(sheet)
    d.text((4, 4), f"BEFORE {label}", fill=(220, 220, 220))
    d.text((cb.width + 16, 4), f"AFTER {label}", fill=(220, 220, 220))
    return sheet


def crop_compare(slide_id: str, before: Path, after: Path) -> None:
    CROP_DIR.mkdir(parents=True, exist_ok=True)
    b = R["load_rgb"](before)
    a = R["load_rgb"](after)
    words = tesseract_words(before)
    targets = [w for w in words if w.text in ("Hady", "HADY")]
    if not targets:
        return
    pad = 80
    sheets: list[Image.Image] = []
    for i, hady in enumerate(sorted(targets, key=lambda w: w.top)):
        x0 = max(0, hady.left - pad)
        y0 = max(0, hady.top - pad)
        x1 = min(b.width, hady.right + pad + 220)
        y1 = min(b.height, hady.bottom + pad + 140)
        label = hady.text if len(targets) == 1 else f"{hady.text}#{i+1}"
        sheets.append(_crop_sheet(b, a, (x0, y0, x1, y1), label))
    out_img = sheets[0]
    if len(sheets) > 1:
        w = max(s.width for s in sheets)
        h = sum(s.height + 8 for s in sheets) - 8
        out_img = Image.new("RGB", (w, h), (32, 32, 32))
        y = 0
        for s in sheets:
            out_img.paste(s, (0, y))
            y += s.height + 8
    out = CROP_DIR / f"{slide_id}-name-crop.jpg"
    out_img.save(out, quality=92)
    print("crop", out)


def main() -> None:
    manifest: dict[str, str] = {}
    old_manifest = json.loads(MANIFEST.read_text()) if MANIFEST.is_file() else {}

    for slide_id in SLIDE_IDS:
        orig = restore_orig(slide_id)
        img = R["load_rgb"](orig)
        words = tesseract_words(orig)
        HANDLERS[slide_id](img, words)
        SOURCES.mkdir(parents=True, exist_ok=True)
        tmp = SOURCES / f"{slide_id}.retype.png"
        img.save(tmp, optimize=True)
        verify_no_hady(tmp)
        digest = hashlib.sha256(tmp.read_bytes()).hexdigest()[:8]
        basename = f"{slide_id}--{digest}"
        dest = SOURCES / f"{basename}.png"
        tmp.rename(dest)
        manifest[slide_id] = basename
        crop_compare(slide_id, orig, dest)
        print("OK", slide_id, "→", basename)

    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

    for sid, old_base in old_manifest.items():
        if sid not in manifest or manifest[sid] == old_base:
            continue
        for ext in ("full.webp", "full.jpg", "thumb.webp", "thumb.jpg"):
            for root in (SLIDES, GWB.parent.parent / "gwb-fe006a16" / "slides"):
                p = root / f"{old_base}.{ext}"
                if p.is_file():
                    p.unlink()
                    print("removed stale", p)


if __name__ == "__main__":
    main()
