#!/usr/bin/env python3
"""Cover-crop result panels to 944×1280 for gold frames."""
from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np

ASSETS = Path(__file__).resolve().parent / "assets"
OUT_W, OUT_H = 944, 1280
TARGET_HORN_TOP = 0.12


def horn_bbox(img: np.ndarray) -> tuple[int, int, int, int]:
    h, w = img.shape[:2]
    roi = img[: int(h * 0.55), :]
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    mask = cv2.inRange(gray, 120, 255)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
    ys, xs = np.where(mask > 0)
    if len(xs) < 200:
        return 0, 0, w, int(h * 0.45)
    x0, x1 = int(xs.min()), int(xs.max())
    y0, y1 = int(ys.min()), int(ys.max())
    pad = 12
    return max(0, x0 - pad), max(0, y0 - pad), min(w, x1 + pad), min(roi.shape[0], y1 + pad)


def cover_crop(img: np.ndarray, out_w: int, out_h: int) -> np.ndarray:
    h, w = img.shape[:2]
    scale = max(out_w / w, out_h / h)
    new_w, new_h = int(round(w * scale)), int(round(h * scale))
    resized = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)
    x0, y0, x1, y1 = horn_bbox(resized)
    horn_cy_px = (y0 + y1) / 2
    target_cy = out_h * (TARGET_HORN_TOP + 0.22)
    cx = max(0, (new_w - out_w) // 2)
    cy = int(np.clip(horn_cy_px - target_cy, 0, max(0, new_h - out_h)))
    cropped = resized[cy : cy + out_h, cx : cx + out_w]
    if cropped.shape[0] != out_h or cropped.shape[1] != out_w:
        cropped = cv2.resize(cropped, (out_w, out_h), interpolation=cv2.INTER_LANCZOS4)
    return cropped


def main() -> None:
    stats = []
    for p in sorted(ASSETS.glob("results-w5-m*.jpg")):
        img = cv2.imread(str(p))
        if img is None:
            raise SystemExit(f"missing {p}")
        out = cover_crop(img, OUT_W, OUT_H)
        cv2.imwrite(str(p), out, [int(cv2.IMWRITE_JPEG_QUALITY), 92])
        stats.append(p.name)
    print(json.dumps({"normalized": stats}, indent=2))


if __name__ == "__main__":
    main()
