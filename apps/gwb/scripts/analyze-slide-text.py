#!/usr/bin/env python3
"""Debug helper: OCR boxes + color samples for slide repair."""
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image


def tsv_words(path: Path):
    out = Path("/tmp/analyze.tsv")
    subprocess.run(["tesseract", str(path), str(out.with_suffix("")), "tsv"], check=True)
    lines = out.read_text().splitlines()
    header = lines[0].split("\t")
    for line in lines[1:]:
        parts = line.split("\t")
        if len(parts) < 12:
            continue
        row = dict(zip(header, parts))
        if row.get("text", "").strip():
            yield row


def sample_text_color(img: np.ndarray, left, top, w, h):
    x0, y0 = int(left), int(top)
    x1, y1 = x0 + int(w), y0 + int(h)
    patch = img[y0:y1, x0:x1]
    # brightest pixels likely text
    lum = patch.max(axis=2)
    mask = lum > lum.mean() + 15
    if mask.sum() < 5:
        return tuple(int(x) for x in patch.reshape(-1, 3).mean(axis=0))
    return tuple(int(x) for x in patch[mask].mean(axis=0))


def main():
    path = Path(sys.argv[1])
    img = np.array(Image.open(path).convert("RGB"))
    for w in tsv_words(path):
        if not any(
            k in w["text"].lower() for k in ("hady", "hadi", "manny", "mauricio", "steven")
        ):
            continue
        c = sample_text_color(
            img, w["left"], w["top"], w["width"], w["height"]
        )
        print(
            w["text"],
            w["left"],
            w["top"],
            w["width"],
            w["height"],
            c,
        )


if __name__ == "__main__":
    main()
