#!/usr/bin/env python3
"""Copy readable jersey glyphs from PR #92 normalized panels onto current panels."""
from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path

import cv2
import numpy as np

ASSETS = Path(__file__).resolve().parent / "assets"
REPO = ASSETS.parents[3]
REF_92 = "af18e0d"


def git_panel(rev: str, name: str) -> np.ndarray:
    rel = f"apps/gwb/scripts/w6-matchup-cards/assets/{name}"
    data = subprocess.check_output(["git", "-C", str(REPO), "show", f"{rev}:{rel}"])
    tmp = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
    tmp.write(data)
    tmp.close()
    img = cv2.imread(tmp.name)
    Path(tmp.name).unlink(missing_ok=True)
    if img is None:
        raise SystemExit(f"cannot read {rev}:{rel}")
    return img


def jersey_chest_mask(img: np.ndarray) -> np.ndarray:
    h, w = img.shape[:2]
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    s = hsv[:, :, 1]
    yy, xx = np.ogrid[:h, :w]
    roi = (
        (yy > int(h * 0.54))
        & (yy < int(h * 0.76))
        & (xx > int(w * 0.28))
        & (xx < int(w * 0.72))
    )
    jersey = (s > 45) & roi
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    return cv2.morphologyEx(jersey.astype(np.uint8) * 255, cv2.MORPH_CLOSE, k, iterations=2)


def number_mask_from_ref(ref: np.ndarray, base: np.ndarray) -> np.ndarray:
    if base.shape != ref.shape:
        ref = cv2.resize(ref, (base.shape[1], base.shape[0]), interpolation=cv2.INTER_LANCZOS4)
    chest = jersey_chest_mask(ref)
    lab_r = cv2.cvtColor(ref, cv2.COLOR_BGR2LAB)[:, :, 0]
    lab_b = cv2.cvtColor(base, cv2.COLOR_BGR2LAB)[:, :, 0]
    contrast = cv2.absdiff(lab_r, lab_b) > 14
    # PR #92 numbers: bright fills + dark outlines printed on jersey mesh
    glyphs = contrast & ((lab_r > 152) | (lab_r < 62)) & (chest > 0)
    glyphs = glyphs.astype(np.uint8) * 255
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    glyphs = cv2.morphologyEx(glyphs, cv2.MORPH_CLOSE, k, iterations=1)

    n, labels, stats, _ = cv2.connectedComponentsWithStats(glyphs, connectivity=8)
    keep = np.zeros_like(glyphs)
    for i in range(1, n):
        x, y, w, h, area = (
            stats[i, cv2.CC_STAT_LEFT],
            stats[i, cv2.CC_STAT_TOP],
            stats[i, cv2.CC_STAT_WIDTH],
            stats[i, cv2.CC_STAT_HEIGHT],
            stats[i, cv2.CC_STAT_AREA],
        )
        if area < 35 or area > 9000:
            continue
        if w > h * 3.2 and w > 80:  # drop horizontal streaks
            continue
        keep[labels == i] = 255
    return keep


def composite(base: np.ndarray, ref: np.ndarray) -> np.ndarray:
    if ref.shape != base.shape:
        ref = cv2.resize(ref, (base.shape[1], base.shape[0]), interpolation=cv2.INTER_LANCZOS4)
    mask = number_mask_from_ref(ref, base)
    if mask.sum() < 500:
        chest = jersey_chest_mask(ref)
        lab_r = cv2.cvtColor(ref, cv2.COLOR_BGR2LAB)[:, :, 0]
        lab_b = cv2.cvtColor(base, cv2.COLOR_BGR2LAB)[:, :, 0]
        contrast = cv2.absdiff(lab_r, lab_b) > 8
        relaxed = (contrast & ((lab_r > 118) | (lab_r < 68)) & (chest > 0)).astype(np.uint8) * 255
        n, labels, stats, _ = cv2.connectedComponentsWithStats(relaxed, connectivity=8)
        keep = np.zeros_like(relaxed)
        for i in range(1, n):
            area = stats[i, cv2.CC_STAT_AREA]
            w = stats[i, cv2.CC_STAT_WIDTH]
            h = stats[i, cv2.CC_STAT_HEIGHT]
            if 30 < area < 14000 and not (w > h * 3.2 and w > 80):
                keep[labels == i] = 255
        mask = keep
    if mask.sum() < 80:
        return base
    m = (mask > 0).astype(np.float32)
    m = cv2.GaussianBlur(m, (0, 0), 0.9)
    out = base.astype(np.float32)
    if ref.shape != base.shape:
        ref = cv2.resize(ref, (base.shape[1], base.shape[0]), interpolation=cv2.INTER_LANCZOS4)
    ref_f = ref.astype(np.float32)
    for c in range(3):
        out[:, :, c] = out[:, :, c] * (1 - m) + ref_f[:, :, c] * m
    return np.clip(out, 0, 255).astype(np.uint8)


def main() -> None:
    for p in sorted(ASSETS.glob("vs-w6-m*.jpg")):
        base = cv2.imread(str(p))
        ref = git_panel(REF_92, p.name)
        out = composite(base, ref)
        cv2.imwrite(str(p), out, [int(cv2.IMWRITE_JPEG_QUALITY), 92])
        print("numbers", p.name, "px", int((number_mask_from_ref(ref, base) > 0).sum()))


if __name__ == "__main__":
    main()
