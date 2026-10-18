#!/usr/bin/env python3
"""Report fur-mask mean L* per matchup card for PR #91, NEW, and PR #92 (normalized panels)."""
from __future__ import annotations

import importlib.util
import json
import tempfile
from pathlib import Path

import cv2
import numpy as np

_lsf = importlib.util.spec_from_file_location(
    "lighten_stone_fur", Path(__file__).with_name("lighten-stone-fur.py")
)
lighten = importlib.util.module_from_spec(_lsf)
assert _lsf.loader
_lsf.loader.exec_module(lighten)
REF_91 = lighten.REF_91
REF_92 = lighten.REF_92
build_fur_mask = lighten.build_fur_mask
fur_mean_l = lighten.fur_mean_l

_norm = importlib.util.spec_from_file_location(
    "normalize_panels", Path(__file__).with_name("normalize-panels.py")
)
norm_mod = importlib.util.module_from_spec(_norm)
assert _norm.loader
_norm.loader.exec_module(norm_mod)

ASSETS = Path(__file__).resolve().parent / "assets"
REPO = ASSETS.parents[3]


def git_panel(rev: str, name: str) -> np.ndarray:
    rel = f"apps/gwb/scripts/w6-matchup-cards/assets/{name}"
    data = __import__("subprocess").check_output(["git", "-C", str(REPO), "show", f"{rev}:{rel}"])
    tmp = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
    tmp.write(data)
    tmp.close()
    img = cv2.imread(tmp.name)
    Path(tmp.name).unlink(missing_ok=True)
    return img


def normalize_panel(img: np.ndarray) -> np.ndarray:
    with tempfile.TemporaryDirectory() as tmp:
        p = Path(tmp) / "panel.jpg"
        cv2.imwrite(str(p), img)
        norm_mod.normalize(p)
        return cv2.imread(str(p))


def card_fur_l(img_left: np.ndarray, img_right: np.ndarray) -> float:
    vals = []
    for img in (img_left, img_right):
        m = build_fur_mask(img, l_max=200.0)
        vals.append(fur_mean_l(img, m))
    return float(np.mean(vals))


def main() -> None:
    rows = []
    for n in range(1, 7):
        left = f"vs-w6-m{n}-left.jpg"
        right = f"vs-w6-m{n}-right.jpg"
        img91_l = normalize_panel(git_panel(REF_91, left))
        img91_r = normalize_panel(git_panel(REF_91, right))
        img92_l, img92_r = git_panel(REF_92, left), git_panel(REF_92, right)
        img_new_l, img_new_r = cv2.imread(str(ASSETS / left)), cv2.imread(str(ASSETS / right))
        rows.append(
            {
                "card": f"m{n}",
                "L_91": round(card_fur_l(img91_l, img91_r), 2),
                "L_new": round(card_fur_l(img_new_l, img_new_r), 2),
                "L_92": round(card_fur_l(img92_l, img92_r), 2),
            }
        )
    print(json.dumps(rows, indent=2))


if __name__ == "__main__":
    main()
