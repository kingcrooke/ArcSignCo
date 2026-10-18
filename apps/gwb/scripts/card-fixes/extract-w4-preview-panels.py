#!/usr/bin/env python3
"""Pull unchanged panel art from published Week 4 preview slides."""
from pathlib import Path

from PIL import Image

GWB = Path(__file__).resolve().parents[2]
SLIDES = GWB.parent.parent / "gwb-fe006a16" / "slides"
OUT = Path(__file__).resolve().parent / "w4-preview-assets"

LEFT = (88, 318, 508, 938)
RIGHT = (572, 318, 992, 938)

KEEP = {
    "vs-m1-narking-steven": ["left"],
    "vs-m2-kayser-frankie": ["right"],
    "vs-m3-hadi-manny": ["right"],
    "vs-m4-jamil-matt": ["right"],
    "vs-m5-mauricio-eric": ["right"],
    "vs-m6-danny-crooke": ["right"],
}


def crop(img: Image.Image, box):
    x0, y0, x1, y1 = box
    return img.crop((x0, y0, x1, y1))


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for card_id, sides in KEEP.items():
        src = SLIDES / f"{card_id}.full.jpg"
        img = Image.open(src).convert("RGB")
        if "left" in sides:
            crop(img, LEFT).save(OUT / f"{card_id}-left.jpg", quality=92)
        if "right" in sides:
            crop(img, RIGHT).save(OUT / f"{card_id}-right.jpg", quality=92)
        print(card_id, sides)


if __name__ == "__main__":
    main()
