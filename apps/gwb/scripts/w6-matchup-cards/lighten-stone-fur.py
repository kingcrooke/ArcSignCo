#!/usr/bin/env python3
"""Lighten cracked-stone buffalo fur ~25% without touching jerseys, horns, cracks, or BG."""
from __future__ import annotations

import argparse
from pathlib import Path

import cv2
import numpy as np

ASSETS = Path(__file__).resolve().parent / "assets"


def build_fur_mask(img: np.ndarray) -> np.ndarray:
    h, w = img.shape[:2]
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    h_ch, s_ch, _v = cv2.split(hsv)
    l_ch = lab[:, :, 0]
    _b, g_ch, r_ch = cv2.split(img)

    red = ((r_ch.astype(np.int16) - g_ch.astype(np.int16)) > 18) & (
        (r_ch.astype(np.int16) - _b.astype(np.int16)) > 12
    )
    red |= (h_ch < 12) & (s_ch > 45)
    red |= (h_ch > 168) & (s_ch > 45)

    jersey = s_ch > 58
    bright = (l_ch > 118) & (s_ch < 35)

    fur = (s_ch < 52) & (l_ch >= 14) & (l_ch <= 105) & (~red) & (~jersey) & (~bright)

    yy, xx = np.ogrid[:h, :w]
    cx, cy = w * 0.5, h * 0.42
    radial = ((xx - cx) / (w * 0.55)) ** 2 + ((yy - cy) / (h * 0.62)) ** 2 < 1.0
    fur &= radial

    horn_zone = (yy < h * 0.22) & radial
    fur &= ~horn_zone

    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    fur_u8 = fur.astype(np.uint8) * 255
    fur_u8 = cv2.morphologyEx(fur_u8, cv2.MORPH_CLOSE, k, iterations=2)
    fur_u8 = cv2.morphologyEx(fur_u8, cv2.MORPH_OPEN, k, iterations=1)
    return fur_u8


def lighten(img: np.ndarray, mask: np.ndarray, amount: float = 0.27, l_cap: float = 110.0) -> np.ndarray:
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
    l_ch = lab[:, :, 0]
    m = (mask > 0).astype(np.float32)
    m = cv2.GaussianBlur(m, (0, 0), 3)
    delta = amount * (l_cap - l_ch)
    delta = np.clip(delta, 0, 38)
    l_ch = l_ch + delta * m
    lab[:, :, 0] = np.clip(l_ch, 0, 255)
    return cv2.cvtColor(lab.astype(np.uint8), cv2.COLOR_LAB2BGR)


def process(path: Path, amount: float, dry_run: bool = False) -> dict:
    img = cv2.imread(str(path))
    if img is None:
        raise SystemExit(f"missing {path}")
    mask = build_fur_mask(img)
    out = lighten(img, mask, amount=amount)
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    lab2 = cv2.cvtColor(out, cv2.COLOR_BGR2LAB)
    sel = mask > 0
    before = float(lab[:, :, 0][sel].mean()) if sel.any() else 0.0
    after = float(lab2[:, :, 0][sel].mean()) if sel.any() else 0.0
    if not dry_run:
        cv2.imwrite(str(path), out, [int(cv2.IMWRITE_JPEG_QUALITY), 92])
    return {
        "file": path.name,
        "mask_pct": round(100 * sel.mean(), 1),
        "L_before": round(before, 1),
        "L_after": round(after, 1),
        "lift_pct": round(100 * (after - before) / max(before, 1), 1),
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--amount", type=float, default=0.27, help="fraction toward l_cap on fur mask")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    stats = []
    for p in sorted(ASSETS.glob("vs-w6-m*.jpg")):
        stats.append(process(p, amount=args.amount, dry_run=args.dry_run))
    for s in stats:
        print(s)


if __name__ == "__main__":
    main()
