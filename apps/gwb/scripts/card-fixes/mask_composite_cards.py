#!/usr/bin/env python3
"""Mask-fill panel art into main cards; redraw name pills; HADI→HADY on touched cards."""
from __future__ import annotations

import json
import subprocess
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

from frame_masks import masks_for_card

GWB = Path(__file__).resolve().parents[2]
ROOT = GWB.parent.parent
CARD_FIXES = Path(__file__).resolve().parent
OUT_SRC = GWB / "scripts" / "slide-sources"
FONT_BEBAS = GWB / "scripts/fonts-local/BebasNeue-Regular.ttf"


def main_from_git(card_id: str) -> Image.Image:
    rel = f"apps/gwb/public/slides/{card_id}.full.jpg"
    data = subprocess.check_output(["git", "show", f"main:{rel}"], cwd=ROOT)
    tmp = CARD_FIXES / ".tmp-main" / f"{card_id}.jpg"
    tmp.parent.mkdir(parents=True, exist_ok=True)
    tmp.write_bytes(data)
    return Image.open(tmp).copy().convert("RGB")


def panel_path(job: dict) -> Path:
    rel = job["outFile"]
    candidates = [
        CARD_FIXES / rel,
        CARD_FIXES / rel.replace("../", ""),
        GWB / "scripts" / rel.lstrip("./"),
        CARD_FIXES / "generated" / f"{job['panelId']}.jpg",
    ]
    for p in candidates:
        if p.is_file():
            return p
    raise FileNotFoundError(job["panelId"])


def fill_mask_flat(base: Image.Image, mask: np.ndarray, color: tuple[int, int, int] = (14, 14, 18)) -> None:
    arr = np.array(base)
    arr[mask > 128] = color
    base.paste(Image.fromarray(arr))


def cover_into_mask(base: Image.Image, panel: Image.Image, mask: np.ndarray) -> None:
    ys, xs = np.where(mask > 128)
    if len(xs) < 10:
        return
    x0, x1 = int(xs.min()), int(xs.max()) + 1
    y0, y1 = int(ys.min()), int(ys.max()) + 1
    tw, th = x1 - x0, y1 - y0
    panel = panel.convert("RGB")
    pw, ph = panel.size
    scale = max(tw / pw, th / ph) * 1.03
    nw, nh = int(pw * scale), int(ph * scale)
    resized = panel.resize((nw, nh), Image.Resampling.LANCZOS)
    cx = (nw - tw) // 2
    cy = max(0, int((nh - th) * 0.12))
    crop = resized.crop((cx, cy, cx + tw, cy + th))
    fill_mask_flat(base, mask)
    patch = np.array(crop)
    sub = np.array(base.crop((x0, y0, x1, y1)))
    m = mask[y0:y1, x0:x1] > 128
    sub[m] = patch[m]
    base.paste(Image.fromarray(sub), (x0, y0))


def pill_specs(card_id: str, main: Image.Image) -> list[tuple[str, tuple[int, int, int, int], str]]:
    """Side, box, label text from main card (HADI→HADY when needed)."""
    specs = []
    if card_id.startswith("vs-w5"):
        specs = [
            ("left", (58, 322, 260, 372), None),
            ("right", (818, 322, 1020, 372), None),
        ]
    elif card_id.startswith("vs-m"):
        specs = [
            ("left", (78, 318, 268, 362), None),
            ("right", (812, 318, 1002, 362), None),
        ]
    # Read text from main via simple crop OCR substitute: use known labels from sleeper
    return specs


def sample_pill_style(main: Image.Image, box: tuple[int, int, int, int]) -> tuple:
    x0, y0, x1, y1 = box
    patch = np.array(main.crop(box))
    gold = tuple(int(patch[:, :, c].mean()) for c in range(3))
    fill = (12, 12, 12)
    return fill, gold


def redraw_pill(main: Image.Image, ref: Image.Image, box: tuple[int, int, int, int], label: str) -> None:
    fill, gold = sample_pill_style(ref, box)
    arr = np.array(main)
    x0, y0, x1, y1 = box
    bgr = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)
    mask = np.zeros(bgr.shape[:2], np.uint8)
    cv2.rectangle(mask, (x0 - 2, y0 - 2), (x1 + 2, y1 + 2), 255, -1)
    cleaned = cv2.inpaint(bgr, mask, 5, cv2.INPAINT_NS)
    main.paste(Image.fromarray(cv2.cvtColor(cleaned, cv2.COLOR_BGR2RGB)))
    draw = ImageDraw.Draw(main)
    try:
        font = ImageFont.truetype(str(FONT_BEBAS), 28)
    except OSError:
        font = ImageFont.load_default()
    label = label.replace("HADI", "HADY").replace("Hadi", "Hady")
    draw.rounded_rectangle(box, radius=14, fill=fill, outline=gold, width=2)
    draw.text((box[0] + 14, box[1] + 8), label, fill=gold, font=font)


def pill_labels_from_main(ref: Image.Image, card_id: str) -> dict[str, str]:
    import json

    w4_path = CARD_FIXES / "w4-preview-cards/matchups.json"
    w5_path = GWB / "scripts/w5-matchup-cards/matchups.json"
    if card_id.startswith("vs-m") and w4_path.is_file():
        for m in json.loads(w4_path.read_text()):
            if m["id"] != card_id:
                continue
            return {
                "left": f"{m['left']['name'].upper()} {m['left']['record']}".replace("HADI", "HADY"),
                "right": f"{m['right']['name'].upper()} {m['right']['record']}",
            }
    if card_id.startswith("vs-w5") and w5_path.is_file():
        for m in json.loads(w5_path.read_text()):
            if m["id"] != card_id:
                continue
            return {
                "left": f"{m['left']['name']} {m['left']['record']}".replace("HADI", "HADY"),
                "right": f"{m['right']['name']} {m['right']['record']}",
            }
    return {}


def redraw_pills(card_id: str, main: Image.Image, ref: Image.Image, touched: set[str]) -> None:
    labels = pill_labels_from_main(ref, card_id)
    for side, box, _ in pill_specs(card_id, ref):
        if side not in touched:
            continue
        lab = labels.get(side)
        if not lab:
            continue
        redraw_pill(main, ref, box, lab)


def main() -> None:
    regen = json.loads((CARD_FIXES / "panel-fixes.json").read_text())
    by_card: dict[str, list] = {}
    for job in regen["panels"]:
        by_card.setdefault(job["cardId"], []).append(job)

    for card_id, jobs in sorted(by_card.items()):
        ref = main_from_git(card_id)
        base = ref.copy()
        masks = masks_for_card(card_id, ref)
        touched: set[str] = set()

        for job in jobs:
            side = job["side"]
            mask_key = side
            mask = masks.get(mask_key)
            if mask is None:
                continue
            panel = Image.open(panel_path(job))
            cover_into_mask(base, panel, mask)
            touched.add(side)

        redraw_pills(card_id, base, ref, touched)

        dest = OUT_SRC / f"{card_id}.png"
        base.save(dest, optimize=True)
        print("mask composited", dest.name, [j["panelId"] for j in jobs])


if __name__ == "__main__":
    main()
