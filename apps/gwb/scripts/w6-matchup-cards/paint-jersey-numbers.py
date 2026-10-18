#!/usr/bin/env python3
"""Paint crisp NFL-style jersey numbers from matchups.json (replaces #92 glyph bake)."""
from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ASSETS = Path(__file__).resolve().parent / "assets"
FONTS = Path(__file__).resolve().parent.parent / "fonts-local" / "Anton-Regular.ttf"
MATCHUPS = Path(__file__).resolve().parent / "matchups.json"

# cx, cy, width_frac of panel (tuned on normalized 944×1280 PR #91 panels)
PANEL_ANCHORS: dict[str, tuple[float, float, float]] = {
    "vs-w6-m1-left.jpg": (0.50, 0.555, 0.30),
    "vs-w6-m1-right.jpg": (0.50, 0.565, 0.34),
    "vs-w6-m2-left.jpg": (0.50, 0.585, 0.32),
    "vs-w6-m2-right.jpg": (0.50, 0.595, 0.32),
    "vs-w6-m3-left.jpg": (0.50, 0.590, 0.34),
    "vs-w6-m3-right.jpg": (0.50, 0.585, 0.30),
    "vs-w6-m4-left.jpg": (0.50, 0.580, 0.32),
    "vs-w6-m4-right.jpg": (0.50, 0.595, 0.32),
    "vs-w6-m5-left.jpg": (0.50, 0.585, 0.32),
    "vs-w6-m5-right.jpg": (0.50, 0.575, 0.32),
    "vs-w6-m6-left.jpg": (0.50, 0.590, 0.30),
    "vs-w6-m6-right.jpg": (0.50, 0.585, 0.30),
}

# RGB tuples for PIL
TEAM_STYLE: dict[str, dict[str, tuple[int, int, int]]] = {
    "BAL": {"fill": (255, 255, 255), "outline": (0, 0, 0), "outline2": (180, 140, 40)},
    "KC": {"fill": (255, 255, 255), "outline": (255, 182, 18)},
    "GB": {"fill": (255, 220, 60), "outline": (20, 40, 20)},
    "SEA": {"fill": (255, 255, 255), "outline": (0, 34, 68)},
    "JAX": {"fill": (255, 255, 255), "outline": (0, 60, 50)},
    "PIT": {"fill": (255, 182, 18), "outline": (0, 0, 0)},
    "SF": {"fill": (255, 255, 255), "outline": (170, 0, 0)},
    "NYG": {"fill": (255, 255, 255), "outline": (163, 13, 45)},
    "NE": {"fill": (255, 255, 255), "outline": (192, 26, 46)},
    "BUF": {"fill": (255, 255, 255), "outline": (198, 12, 48)},
    "CAR": {"fill": (180, 220, 255), "outline": (0, 0, 0)},
    "LAR": {"fill": (255, 255, 255), "outline": (255, 182, 18)},
}


def jersey_chest_mask(img: np.ndarray) -> np.ndarray:
    h, w = img.shape[:2]
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    s = hsv[:, :, 1]
    yy, xx = np.ogrid[:h, :w]
    roi = (
        (yy > int(h * 0.57))
        & (yy < int(h * 0.74))
        & (xx > int(w * 0.30))
        & (xx < int(w * 0.70))
    )
    jersey = (s > 42) & roi
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))
    return cv2.morphologyEx(jersey.astype(np.uint8) * 255, cv2.MORPH_CLOSE, k, iterations=2)


def number_zone_mask(img: np.ndarray, chest: np.ndarray, panel_name: str) -> np.ndarray:
    h, w = img.shape[:2]
    if panel_name in PANEL_ANCHORS:
        fx, fy, fw = PANEL_ANCHORS[panel_name]
        cx, cy = int(w * fx), int(h * fy)
        rw, rh = int(w * fw * 0.55), int(h * 0.075)
    else:
        cx, cy, cw = chest_anchor(chest)
        rw, rh = int(cw * 0.55), int(h * 0.075)
    zone = np.zeros((h, w), np.uint8)
    cv2.ellipse(zone, (cx, cy), (max(rw, 40), max(rh, 28)), 0, 0, 360, 255, -1)
    return cv2.bitwise_and(zone, chest)


def repaint_chest_jersey(img: np.ndarray, chest: np.ndarray) -> np.ndarray:
    """Replace chest with jersey-colored texture (removes baked-in digits)."""
    out = img.copy()
    ys, xs = np.where(chest > 0)
    if len(xs) < 80:
        return out
    x0, x1 = int(xs.min()), int(xs.max())
    y0, y1 = int(ys.min()), int(ys.max())
    pad = 8
    x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
    x1, y1 = min(img.shape[1], x1 + pad), min(img.shape[0], y1 + pad)
    bw, bh = x1 - x0, y1 - y0
    sample_y0 = max(0, y0 - bh // 2)
    sample_y1 = y0
    sample = img[sample_y0:sample_y1, x0:x1]
    if sample.size < 100:
        sample = img[y0 : y0 + bh // 3, x0:x1]
    if sample.size < 100:
        return out
    patch = cv2.resize(sample, (bw, bh), interpolation=cv2.INTER_LINEAR)
    mask = chest[y0:y1, x0:x1].astype(np.float32) / 255.0
    mask = cv2.GaussianBlur(mask, (0, 0), 3)
    for c in range(3):
        out[y0:y1, x0:x1, c] = (
            out[y0:y1, x0:x1, c] * (1 - mask) + patch[:, :, c] * mask
        ).astype(np.uint8)
    return out


def clear_old_number(img: np.ndarray, panel_name: str) -> np.ndarray:
    chest = jersey_chest_mask(img)
    zone = number_zone_mask(img, chest, panel_name)
    out = repaint_chest_jersey(img, zone)
    lab = cv2.cvtColor(out, cv2.COLOR_BGR2LAB)[:, :, 0]
    # Remove legacy baked digits anywhere on jersey torso
    legacy = (
        chest
        & ((lab < 72) | (lab > 158))
        & (cv2.cvtColor(out, cv2.COLOR_BGR2HSV)[:, :, 1] > 38)
    ).astype(np.uint8) * 255
    legacy = cv2.dilate(
        legacy, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)), iterations=1
    )
    out = cv2.inpaint(out, legacy, 3, cv2.INPAINT_TELEA)
    edges = cv2.Canny(cv2.cvtColor(out, cv2.COLOR_BGR2LAB)[:, :, 0], 45, 120)
    glyphs = cv2.dilate(
        edges, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)), iterations=1
    )
    inpaint_mask = ((glyphs > 0) & (zone > 0)).astype(np.uint8) * 255
    return cv2.inpaint(out, inpaint_mask, 3, cv2.INPAINT_TELEA)


def chest_anchor(chest: np.ndarray) -> tuple[int, int, int]:
    ys, xs = np.where(chest > 0)
    if len(xs) < 50:
        h, w = chest.shape[:2]
        return w // 2, int(h * 0.66), int(w * 0.38)
    x0, x1 = int(xs.min()), int(xs.max())
    y0, y1 = int(ys.min()), int(ys.max())
    cx = (x0 + x1) // 2
    cy = int(y0 + (y1 - y0) * 0.58)
    width = x1 - x0
    return cx, cy, width


def draw_number_pil(
    img_bgr: np.ndarray, number: int, team: str, panel_name: str
) -> np.ndarray:
    style = TEAM_STYLE.get(team, {"fill": (255, 255, 255), "outline": (0, 0, 0)})
    text = str(number)
    h, w = img_bgr.shape[:2]
    if panel_name in PANEL_ANCHORS:
        fx, fy, fw = PANEL_ANCHORS[panel_name]
        cx, cy = int(w * fx), int(h * fy)
        chest_w = int(w * fw)
    else:
        chest = jersey_chest_mask(img_bgr)
        cx, cy, chest_w = chest_anchor(chest)

    pil = Image.fromarray(cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB))
    draw = ImageDraw.Draw(pil)
    font_size = int(chest_w * (0.48 if len(text) == 1 else 0.40))
    font_size = max(108, min(font_size, 240))
    font = ImageFont.truetype(str(FONTS), font_size)

    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = cx - tw // 2
    y = cy - th // 2

    outline = style["outline"]
    fill = style["fill"]
    w_outer = max(5, font_size // 22)
    w_inner = max(2, font_size // 40)
    for ox in range(-w_outer, w_outer + 1):
        for oy in range(-w_outer, w_outer + 1):
            if ox * ox + oy * oy <= w_outer * w_outer:
                draw.text((x + ox, y + oy), text, font=font, fill=outline)
    if "outline2" in style:
        o2 = style["outline2"]
        for ox in range(-w_inner, w_inner + 1):
            for oy in range(-w_inner, w_inner + 1):
                if ox * ox + oy * oy <= w_inner * w_inner:
                    draw.text((x + ox, y + oy), text, font=font, fill=o2)
    draw.text((x, y), text, font=font, fill=fill)

    return cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)


def panel_meta() -> dict[str, tuple[str, int]]:
    data = json.loads(MATCHUPS.read_text())
    out: dict[str, tuple[str, int]] = {}
    for m in data:
        mid = m["matchupNum"]
        for side in ("left", "right"):
            p = m[side]
            name = f"vs-w6-m{mid}-{side}.jpg"
            out[name] = (p["team"], int(p["number"]))
    return out


def main() -> None:
    meta = panel_meta()
    for path in sorted(ASSETS.glob("vs-w6-m*.jpg")):
        team, num = meta[path.name]
        img = cv2.imread(str(path))
        if img is None:
            continue
        img = clear_old_number(img, path.name)
        img = draw_number_pil(img, num, team, path.name)
        cv2.imwrite(str(path), img, [int(cv2.IMWRITE_JPEG_QUALITY), 92])
        print("painted", path.name, team, num)


if __name__ == "__main__":
    main()
