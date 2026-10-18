#!/usr/bin/env python3
"""Lighten cracked-stone buffalo fur toward midpoint L* between PR #91 and PR #92 panels."""
from __future__ import annotations

import argparse
import subprocess
import tempfile
from pathlib import Path

import cv2
import numpy as np

ASSETS = Path(__file__).resolve().parent / "assets"
REPO = ASSETS.parents[3]
REF_91 = "741e20d"
REF_92 = "af18e0d"


def build_fur_mask(img: np.ndarray, l_max: float = 200.0) -> np.ndarray:
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
    bright = (l_ch > 175) & (s_ch < 25)

    fur = (
        (s_ch < 52)
        & (l_ch >= 14)
        & (l_ch <= l_max)
        & (~red)
        & (~jersey)
        & (~bright)
    )

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


def fur_mean_l(img: np.ndarray, mask: np.ndarray) -> float:
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    sel = mask > 0
    if not sel.any():
        return 0.0
    return float(lab[:, :, 0][sel].mean())


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


def _normalize_file(path: Path) -> None:
    import importlib.util

    here = Path(__file__).resolve().parent
    spec = importlib.util.spec_from_file_location(
        "normalize_panels", here / "normalize-panels.py"
    )
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(mod)
    mod.normalize(path)


def normalized_git_panel(rev: str, name: str) -> np.ndarray:
    raw = git_panel(rev, name)
    if rev == REF_92:
        return raw
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
        p = Path(tmp.name)
    cv2.imwrite(str(p), raw)
    _normalize_file(p)
    img = cv2.imread(str(p))
    p.unlink(missing_ok=True)
    return img


def card_midpoint_targets() -> dict[str, float]:
    """Per-matchup fur L* target = midpoint of card-averaged PR #91 and PR #92 fur means."""
    targets: dict[str, float] = {}
    for n in range(1, 7):
        vals91: list[float] = []
        vals92: list[float] = []
        for side in ("left", "right"):
            name = f"vs-w6-m{n}-{side}.jpg"
            img91 = normalized_git_panel(REF_91, name)
            img92 = git_panel(REF_92, name)
            if img91.shape != img92.shape:
                img92 = cv2.resize(
                    img92, (img91.shape[1], img91.shape[0]), interpolation=cv2.INTER_AREA
                )
            m91 = build_fur_mask(img91)
            m92 = build_fur_mask(img92, l_max=200.0)
            vals91.append(fur_mean_l(img91, m91))
            vals92.append(fur_mean_l(img92, m92))
        mid = (float(np.mean(vals91)) + float(np.mean(vals92))) / 2.0
        for side in ("left", "right"):
            targets[f"vs-w6-m{n}-{side}.jpg"] = mid
    return targets


def lighten_to_target(
    img: np.ndarray,
    mask: np.ndarray,
    target_l: float,
    l_cap: float = 152.0,
    max_passes: int = 6,
) -> np.ndarray:
    out = img.copy()
    for _ in range(max_passes):
        lab = cv2.cvtColor(out, cv2.COLOR_BGR2LAB).astype(np.float32)
        l_ch = lab[:, :, 0]
        m = (mask > 0).astype(np.float32)
        m = cv2.GaussianBlur(m, (0, 0), 2.5)
        cur = fur_mean_l(out, mask)
        gap = target_l - cur
        if abs(gap) < 0.35:
            break
        eff = max(float(m[mask > 0].mean()), 0.15)
        lift = (gap / eff) * m
        l_ch = np.clip(l_ch + lift, 0, l_cap)
        lab[:, :, 0] = l_ch
        out = cv2.cvtColor(lab.astype(np.uint8), cv2.COLOR_LAB2BGR)
    return out


def process(
    path: Path,
    target_l: float | None,
    card_targets: dict[str, float],
    dry_run: bool = False,
) -> dict:
    img = cv2.imread(str(path))
    if img is None:
        raise SystemExit(f"missing {path}")
    mask = build_fur_mask(img)
    tgt = target_l if target_l is not None else card_targets[path.name]
    before = fur_mean_l(img, mask)
    out = lighten_to_target(img, mask, tgt)
    after = fur_mean_l(out, mask)
    if not dry_run:
        cv2.imwrite(str(path), out, [int(cv2.IMWRITE_JPEG_QUALITY), 92])
    return {
        "file": path.name,
        "target_L": round(tgt, 2),
        "L_before": round(before, 2),
        "L_after": round(after, 2),
        "lift": round(after - before, 2),
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--target-l", type=float, default=None, help="fixed L* for all panels")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    card_targets = card_midpoint_targets()
    stats = []
    for p in sorted(ASSETS.glob("vs-w6-m*.jpg")):
        stats.append(process(p, args.target_l, card_targets, dry_run=args.dry_run))
    for s in stats:
        print(s)


if __name__ == "__main__":
    main()
