"""Panel interior masks (fixed geometry from main published cards)."""
from __future__ import annotations

import numpy as np
from PIL import Image

# Inside gold border, below name pill, above tagline (1080×1350)
W4_PREVIEW = {
    "left": (92, 368, 504, 948),
    "right": (576, 368, 988, 948),
}
W5_PREVIEW = {
    "left": (52, 368, 512, 982),
    "right": (568, 368, 1028, 982),
}
RESULT_WINNER = (108, 468, 472, 878)
RESULT_LOSER = (708, 488, 992, 828)


def _rect_mask(w: int, h: int, box: tuple[int, int, int, int]) -> np.ndarray:
    mask = np.zeros((h, w), dtype=np.uint8)
    x0, y0, x1, y1 = box
    mask[y0:y1, x0:x1] = 255
    return mask


def masks_for_card(card_id: str, img: Image.Image) -> dict[str, np.ndarray]:
    w, h = img.size
    if card_id.startswith("results-"):
        return {
            "winner": _rect_mask(w, h, RESULT_WINNER),
            "loser": _rect_mask(w, h, RESULT_LOSER),
        }
    if card_id.startswith("vs-w5"):
        return {
            "left": _rect_mask(w, h, W5_PREVIEW["left"]),
            "right": _rect_mask(w, h, W5_PREVIEW["right"]),
        }
    if card_id.startswith("vs-m"):
        return {
            "left": _rect_mask(w, h, W4_PREVIEW["left"]),
            "right": _rect_mask(w, h, W4_PREVIEW["right"]),
        }
    return {}
