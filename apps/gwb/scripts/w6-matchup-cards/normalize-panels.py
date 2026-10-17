#!/usr/bin/env python3
"""Normalize panel crops so horn/head bounding boxes align (~5% tolerance target)."""
from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np

ASSETS = Path(__file__).resolve().parent / "assets"
TARGET_HORN_TOP = 0.12  # fraction of image height from top to horn peak band
OUT_W, OUT_H = 944, 1280


def horn_bbox(img: np.ndarray) -> tuple[int, int, int, int]:
    h, w = img.shape[:2]
    roi = img[: int(h * 0.55), :]
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    # horns/skin highlights
    mask = cv2.inRange(gray, 140, 255)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
    ys, xs = np.where(mask > 0)
    if len(xs) < 200:
        return 0, 0, w, int(h * 0.45)
    x0, x1 = int(xs.min()), int(xs.max())
    y0, y1 = int(ys.min()), int(ys.max())
    pad = 12
    return max(0, x0 - pad), max(0, y0 - pad), min(w, x1 + pad), min(roi.shape[0], y1 + pad)


def normalize(path: Path) -> dict:
    img = cv2.imread(str(path))
    if img is None:
        raise SystemExit(f"missing {path}")
    h, w = img.shape[:2]
    x0, y0, x1, y1 = horn_bbox(img)
    horn_h = max(1, y1 - y0)
    horn_cy = (y0 + y1) / 2 / h

    scale = (OUT_H * 0.38) / horn_h
    scale = float(np.clip(scale, 0.85, 1.35))
    new_w, new_h = int(w * scale), int(h * scale)
    resized = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)

    # target horn center y
    x0b, y0b, x1b, y1b = horn_bbox(resized)
    horn_cy_px = (y0b + y1b) / 2
    target_cy = OUT_H * TARGET_HORN_TOP + (OUT_H * 0.22)
    y_off = int(target_cy - horn_cy_px)
    x_off = (OUT_W - new_w) // 2

    canvas = np.zeros((OUT_H, OUT_W, 3), dtype=np.uint8)
    y1p = y_off + new_h
    x1p = x_off + new_w
    sy0 = max(0, -y_off)
    sx0 = max(0, -x_off)
    dy0 = max(0, y_off)
    dx0 = max(0, x_off)
    dy1 = min(OUT_H, y1p)
    dx1 = min(OUT_W, x1p)
    sy1 = sy0 + (dy1 - dy0)
    sx1 = sx0 + (dx1 - dx0)
    canvas[dy0:dy1, dx0:dx1] = resized[sy0:sy1, sx0:sx1]

    cv2.imwrite(str(path), canvas, [int(cv2.IMWRITE_JPEG_QUALITY), 92])
    x0b, y0b, x1b, y1b = horn_bbox(canvas)
    return {
        "file": path.name,
        "horn_box": [x0b, y0b, x1b, y1b],
        "horn_h": y1b - y0b,
        "horn_w": x1b - x0b,
    }


def main() -> None:
    stats = []
    for p in sorted(ASSETS.glob("vs-w5-m*.jpg")):
        stats.append(normalize(p))
    hs = [s["horn_h"] for s in stats]
    ref = float(np.median(hs))
    report = []
    for s in stats:
        dev = abs(s["horn_h"] - ref) / ref
        report.append({**s, "horn_h_dev_pct": round(dev * 100, 1)})
    out = ASSETS.parent / "framing-report.json"
    out.write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))
    bad = [r for r in report if r["horn_h_dev_pct"] > 5]
    if bad:
        print("WARN framing >5%:", [b["file"] for b in bad])


if __name__ == "__main__":
    main()
