#!/usr/bin/env python3
"""Lighten cracked-stone buffalo fur toward 70% blend L* (#91 → #92) with local contrast preserved."""
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
REF_W5 = "3795b91"
BLEND_TOWARD_92 = 0.7
L_CAP = 148.0


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


def git_file_at_rev(rev: str, rel: str) -> np.ndarray:
    data = subprocess.check_output(["git", "-C", str(REPO), "show", f"{rev}:{rel}"])
    tmp = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
    tmp.write(data)
    tmp.close()
    img = cv2.imread(tmp.name)
    Path(tmp.name).unlink(missing_ok=True)
    if img is None:
        raise SystemExit(f"cannot read {rev}:{rel}")
    return img


def git_panel(rev: str, name: str) -> np.ndarray:
    rel = f"apps/gwb/scripts/w6-matchup-cards/assets/{name}"
    return git_file_at_rev(rev, rel)


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


def card_blend_targets(blend: float = BLEND_TOWARD_92) -> dict[int, float]:
    """Per-matchup fur L* = L91 + blend * (L92 - L91), card-averaged."""
    by_card: dict[int, float] = {}
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
        l91 = float(np.mean(vals91))
        l92 = float(np.mean(vals92))
        by_card[n] = l91 + blend * (l92 - l91)
    return by_card


def w5_result_fur_targets() -> dict[int, float]:
    """Fur-mask mean L* from PR #94 Week 5 result panels (winner+loser avg per card)."""
    by_card: dict[int, float] = {}
    for n in range(1, 7):
        vals: list[float] = []
        for role in ("winner", "loser"):
            rel = f"apps/gwb/scripts/w5-result-cards/assets/results-w5-m{n}-{role}.jpg"
            img = git_file_at_rev(REF_W5, rel)
            m = build_fur_mask(img, l_max=200.0)
            vals.append(fur_mean_l(img, m))
        by_card[n] = float(np.mean(vals))
    return by_card


def card_fur_targets() -> tuple[dict[str, float], dict[int, float], dict[int, float]]:
    """Panel targets keyed by filename; card-level 70% and W5 reference maps."""
    blend70 = card_blend_targets()
    w5 = w5_result_fur_targets()
    panel_targets: dict[str, float] = {}
    for n in range(1, 7):
        tgt = w5[n]
        for side in ("left", "right"):
            panel_targets[f"vs-w6-m{n}-{side}.jpg"] = tgt
    return panel_targets, blend70, w5


def lighten_levels_preserve(
    img: np.ndarray,
    mask: np.ndarray,
    target_l: float,
    l_cap: float = L_CAP,
    contrast: float = 0.86,
) -> np.ndarray:
    """Shift fur L* to target while scaling local deviations (cracks stay dark)."""
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
    l_ch = lab[:, :, 0].copy()
    sel = mask > 0
    if not sel.any():
        return img

    f = l_ch[sel].astype(np.float64)
    mu = float(f.mean())
    p8, p92 = np.percentile(f, [8, 92])
    span = max(float(p92 - p8), 10.0)

    # Levels stretch + mean shift hybrid
    out_lo = max(16.0, p8 + 0.08 * span)
    out_hi = min(l_cap, out_lo + span * 1.35 + max(0.0, target_l - mu) * 0.85)
    stretched = (f - p8) / span * (out_hi - out_lo) + out_lo
    shifted = target_l + (f - mu) * contrast
    new_f = 0.45 * stretched + 0.55 * shifted

    for _ in range(24):
        cur = float(new_f.mean())
        delta = target_l - cur
        if abs(delta) < 0.2:
            break
        new_f = new_f + delta
        # Soft ceiling: compress highlights above cap instead of hard clip
        over = new_f > l_cap
        if over.any():
            new_f[over] = l_cap - (new_f[over] - l_cap) * 0.35
        new_f = np.clip(new_f, 14.0, l_cap)

    l_new = l_ch.copy()
    l_new[sel] = new_f.astype(np.float32)

    m = (mask > 0).astype(np.float32)
    m = cv2.GaussianBlur(m, (0, 0), 2.0)
    l_ch = l_ch * (1 - m) + l_new * m
    lab[:, :, 0] = l_ch
    return cv2.cvtColor(lab.astype(np.uint8), cv2.COLOR_LAB2BGR)


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
    out = lighten_levels_preserve(img, mask, tgt)
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
    ap.add_argument("--blend", type=float, default=BLEND_TOWARD_92)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    panel_targets, blend70, w5 = card_fur_targets()
    if args.target_l is not None:
        card_targets = {k: args.target_l for k in panel_targets}
    else:
        card_targets = panel_targets
    stats = []
    for p in sorted(ASSETS.glob("vs-w6-m*.jpg")):
        stats.append(process(p, None, card_targets, dry_run=args.dry_run))
    print("blend70_card", {f"m{k}": round(v, 2) for k, v in blend70.items()})
    print("w5_ref_card", {f"m{k}": round(v, 2) for k, v in w5.items()})
    for s in stats:
        print(s)


if __name__ == "__main__":
    main()
