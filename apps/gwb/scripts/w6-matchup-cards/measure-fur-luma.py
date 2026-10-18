#!/usr/bin/env python3
"""Report fur-mask mean L* per W6 card vs PR #91, PR #92, 70% target, and W5 result reference."""
from __future__ import annotations

import importlib.util
import json
from pathlib import Path

import cv2
import numpy as np

_lsf = importlib.util.spec_from_file_location(
    "lighten_stone_fur", Path(__file__).with_name("lighten-stone-fur.py")
)
lighten = importlib.util.module_from_spec(_lsf)
assert _lsf.loader
_lsf.loader.exec_module(lighten)

_norm = importlib.util.spec_from_file_location(
    "normalize_panels", Path(__file__).with_name("normalize-panels.py")
)
norm_mod = importlib.util.module_from_spec(_norm)
assert _norm.loader
_norm.loader.exec_module(norm_mod)

ASSETS = Path(__file__).resolve().parent / "assets"
REF_91 = lighten.REF_91
REF_92 = lighten.REF_92
build_fur_mask = lighten.build_fur_mask
fur_mean_l = lighten.fur_mean_l
git_panel = lighten.git_panel
normalized_git_panel = lighten.normalized_git_panel


def normalize_panel(img: np.ndarray) -> np.ndarray:
    import tempfile

    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
        p = Path(tmp.name)
    cv2.imwrite(str(p), img)
    norm_mod.normalize(p)
    out = cv2.imread(str(p))
    p.unlink(missing_ok=True)
    return out


def card_fur_l(img_left: np.ndarray, img_right: np.ndarray) -> float:
    vals = []
    for img in (img_left, img_right):
        m = build_fur_mask(img, l_max=200.0)
        vals.append(fur_mean_l(img, m))
    return float(np.mean(vals))


def main() -> None:
    _, blend70, w5 = lighten.card_fur_targets()
    rows = []
    for n in range(1, 7):
        left = f"vs-w6-m{n}-left.jpg"
        right = f"vs-w6-m{n}-right.jpg"
        img91_l = normalize_panel(git_panel(REF_91, left))
        img91_r = normalize_panel(git_panel(REF_91, right))
        img92_l, img92_r = git_panel(REF_92, left), git_panel(REF_92, right)
        img_new_l, img_new_r = cv2.imread(str(ASSETS / left)), cv2.imread(str(ASSETS / right))
        l91 = card_fur_l(img91_l, img91_r)
        l92 = card_fur_l(img92_l, img92_r)
        rows.append(
            {
                "card": f"m{n}",
                "L_91": round(l91, 2),
                "L_70pct_target": round(blend70[n], 2),
                "L_w5_ref_target": round(w5[n], 2),
                "L_new": round(card_fur_l(img_new_l, img_new_r), 2),
                "L_92": round(l92, 2),
            }
        )
    print(json.dumps(rows, indent=2))


if __name__ == "__main__":
    main()
