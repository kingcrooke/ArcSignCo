"""Shared panel prep: strip letterbox, cover-fill target boxes."""
from __future__ import annotations

import numpy as np
from PIL import Image


def strip_letterbox(img: Image.Image, threshold: int = 32) -> Image.Image:
    """Crop to non-black content bounding box."""
    arr = np.array(img.convert("RGB"))
    lum = arr.mean(axis=2)
    ys, xs = np.where(lum > threshold)
    if len(xs) < 50:
        return img
    pad = 2
    x0 = max(0, int(xs.min()) - pad)
    x1 = min(arr.shape[1], int(xs.max()) + 1 + pad)
    y0 = max(0, int(ys.min()) - pad)
    y1 = min(arr.shape[0], int(ys.max()) + 1 + pad)
    return img.crop((x0, y0, x1, y1))


def cover_paste(base: Image.Image, panel: Image.Image, box: tuple[int, int, int, int]) -> None:
    """Paste panel into box (x0,y0,x1,y1) with cover crop — no letterboxing."""
    x0, y0, x1, y1 = box
    tw, th = x1 - x0, y1 - y0
    panel = strip_letterbox(panel)
    pw, ph = panel.size
    scale = max(tw / pw, th / ph) * 1.04
    nw, nh = int(round(pw * scale)), int(round(ph * scale))
    resized = panel.resize((nw, nh), Image.Resampling.LANCZOS)
    cx = (nw - tw) // 2
    cy = int((nh - th) * 0.1)
    cy = max(0, min(cy, nh - th))
    crop = resized.crop((cx, cy, cx + tw, cy + th))
    base.paste(crop, (x0, y0))
