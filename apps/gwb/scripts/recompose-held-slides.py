#!/usr/bin/env python3
"""Rebuild held GWB slides: preserve art, re-typeset all text (Hadi)."""
from __future__ import annotations

import json
import runpy
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

GWB = Path(__file__).resolve().parents[1]
ROOT = GWB.parents[1]
UPLOADS = Path("/home/ubuntu/.cursor/projects/workspace/uploads")
OUT_SLIDES = ROOT / "docs/gwb-fixed-slides"
OUT_RESULTS = ROOT / "docs/gwb-results-cards"
QA_DIR = Path("/opt/cursor/artifacts/screenshots")

R = runpy.run_path(str(GWB / "scripts/repair-held-slides.py"))

FontSpec = R["FontSpec"]
font = R["font"]
fit_size = R["fit_size"]
text_size = R["text_size"]
draw_text = R["draw_text"]
load_rgb = R["load_rgb"]
inpaint_region = R["inpaint_region"]
sample_text_color = R["sample_text_color"]


def save(img: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, optimize=True)


def clear_zones(img: Image.Image, zones: list[tuple[int, int, int, int]]) -> None:
    for z in zones:
        inpaint_region(img, z)


def draw_centered(
    img: Image.Image,
    box: tuple[int, int, int, int],
    text: str,
    family: str,
    fill: tuple[int, int, int],
) -> None:
    x0, y0, x1, y1 = box
    h = y1 - y0
    size = fit_size(family, text, target_h=h - 4, min_s=14, max_s=120)
    for s in range(size, 11, -1):
        spec = FontSpec(family, s, fill)
        tw, th = text_size(text, spec)
        if tw <= (x1 - x0) and th <= h:
            size = s
            break
    spec = FontSpec(family, size, fill)
    tw, th = text_size(text, spec)
    x = x0 + (x1 - x0 - tw) // 2
    y = y0 + (h - th) // 2
    draw_text(img, (x, y), text, spec, anchor="ls")


def draw_left(
    img: Image.Image,
    xy: tuple[int, int],
    text: str,
    family: str,
    fill: tuple[int, int, int],
    max_h: int,
) -> None:
    size = fit_size(family, text, target_h=max_h, min_s=12, max_s=96)
    draw_text(img, xy, text, FontSpec(family, size, fill), anchor="ls")


def footer_w4(img: Image.Image, ref: Image.Image, page: str) -> None:
    """Paste clean footer band from sibling slide."""
    band = ref.crop((0, 1240, img.width, img.height))
    img.paste(band, (0, 1240))
    page_color = sample_text_color(ref, (925, 1266, 1009, 1289))
    inpaint_region(img, (900, 1258, 1018, 1298))
    ps = fit_size("inter", page, target_h=23, min_s=20, max_s=26)
    draw_text(
        img,
        (1008, 1332),
        page,
        FontSpec("inter", ps, page_color),
        anchor="rs",
    )


def recompose_vs_m3() -> Path:
    src = UPLOADS / "vs-m3-hady-manny_11af.png"
    ref = UPLOADS / "vs-m4-jamil-matt_e46f.png"
    img = load_rgb(src)
    ref_img = load_rgb(ref)

    gold = sample_text_color(ref_img, (68, 241, 200, 264))
    white = sample_text_color(ref_img, (71, 147, 250, 220))
    poll_orange = sample_text_color(ref_img, (73, 1113, 200, 1145))
    poll_gray = sample_text_color(ref_img, (831, 1112, 950, 1145))
    foot = sample_text_color(ref_img, (186, 1211, 400, 1230))

    zones = [
        (55, 45, 400, 100),
        (55, 130, 620, 230),
        (55, 228, 650, 278),
        (55, 288, 250, 352),
        (330, 288, 560, 352),
        (78, 312, 540, 362),
        (180, 1020, 900, 1080),
        (55, 1090, 1025, 1150),
        (55, 1190, 1025, 1240),
        (55, 1260, 1025, 1345),
    ]
    clear_zones(img, zones)

    draw_left(img, (72, 54), "GWB", "bebas", gold, 28)
    draw_left(img, (213, 54), "WEEK 4", "bebas", gold, 28)
    draw_left(img, (73, 147), "HADI", "anton", white, 72)
    draw_left(img, (252, 157), "vs", "anton", white, 72)
    draw_left(img, (353, 147), "MANNY", "anton", white, 72)
    draw_left(img, (73, 241), "HADI (2-1)", "bebas", gold, 24)
    draw_left(img, (302, 246), "vs", "bebas", gold, 24)
    draw_left(img, (377, 241), "MANNY (2-1)", "bebas", gold, 24)

    badge_fill = (12, 12, 12)
    for box, label in [
        ((78, 318, 210, 358), "HADI 2-1"),
        ((368, 318, 530, 358), "MANNY 2-1"),
    ]:
        inpaint_region(img, box)
        ImageDraw.Draw(img).rounded_rectangle(box, radius=14, fill=badge_fill)
        draw_centered(img, box, label, "bebas", gold)

    draw_centered(img, (200, 1030, 880, 1070), "SNEAKY GAME OF THE WEEK", "bebas", gold)

    bar_y0, bar_y1 = 1110, 1142
    ImageDraw.Draw(img).rectangle((72, bar_y0, 520, bar_y1), fill=poll_orange)
    ImageDraw.Draw(img).rectangle((520, bar_y0, 1008, bar_y1), fill=(45, 52, 60))
    draw_left(img, (73, 1113), "Manny 52%", "bebas", (20, 20, 20), 30)
    draw_left(img, (833, 1112), "Hadi 48%", "bebas", (245, 245, 245), 30)

    draw_centered(
        img,
        (72, 1205, 1008, 1235),
        "Mahomes QB3 vs Kyler QB14 • JSN + Bowers back",
        "inter-semibold",
        foot,
    )
    foot_color = sample_text_color(ref_img, (72, 1270, 360, 1300))
    draw_left(img, (72, 1275), "gwb_fantasy_football", "inter", foot_color, 22)
    draw_left(img, (900, 1275), "VS • M3", "inter", foot_color, 22)

    dest = OUT_SLIDES / "vs-m3-hadi-manny.png"
    save(img, dest)
    return dest


def recompose_w4_slide_10() -> Path:
    src = UPLOADS / "w4-slide-10_4524.png"
    ref = UPLOADS / "w4-slide-11_838c.png"
    img = load_rgb(src)
    ref_img = load_rgb(ref)

    gold = sample_text_color(ref_img, (72, 54, 280, 80))
    white = (255, 255, 255)
    muted = sample_text_color(img, (107, 360, 400, 390))
    orange = sample_text_color(img, (72, 720, 200, 750))

    zones = [
        (55, 45, 700, 95),
        (55, 155, 500, 235),
        (55, 250, 1025, 680),
        (55, 670, 1025, 900),
        (55, 1255, 1025, 1345),
    ]
    clear_zones(img, zones)

    draw_left(img, (72, 54), "GWB | WEEK 4 | MATCHUP 3", "bebas", gold, 26)
    draw_left(img, (72, 170), "HADI vs MANNY", "anton", white, 58)

    card_bg = (22, 30, 42)
    for y0, y1 in [(268, 448), (458, 638)]:
        ImageDraw.Draw(img).rectangle((72, y0, 1008, y1), fill=card_bg)
        ImageDraw.Draw(img).rectangle((72, y0, 88, y1), fill=white)

    draw_left(img, (107, 319), "HADI (2-1)", "bebas", white, 26)
    draw_left(img, (107, 352), '"El Campeon de la Liga"', "inter-semibold", muted, 22)
    draw_left(
        img,
        (107, 388),
        "Kyler, JSN, Bowers, Pickens, Skattebo.",
        "inter-semibold",
        muted,
        22,
    )
    draw_left(img, (107, 420), "Quietly getting healthier.", "inter-semibold", muted, 22)

    draw_left(img, (107, 505), "MANNY (2-1)", "bebas", white, 26)
    draw_left(img, (107, 538), '"The Corporation"', "inter-semibold", muted, 22)
    draw_left(
        img,
        (107, 574),
        "Mahomes (QB3), Cook, Davante, Kelce, Tet.",
        "inter-semibold",
        muted,
        22,
    )
    draw_left(img, (107, 606), "Huge QB edge. Shaky flex depth.", "inter-semibold", muted, 22)

    bar_y0, bar_y1 = 682, 714
    ImageDraw.Draw(img).rectangle((72, bar_y0, 520, bar_y1), fill=orange)
    ImageDraw.Draw(img).rectangle((520, bar_y0, 1008, bar_y1), fill=(45, 52, 60))
    draw_left(img, (73, 685), "Manny 52%", "bebas", (20, 20, 20), 30)
    draw_left(img, (833, 684), "Hadi 48%", "bebas", white, 30)

    draw_left(
        img,
        (72, 748),
        "Sneaky Game of the Week. Coin flip.",
        "inter-semibold",
        orange,
        26,
    )
    draw_left(
        img,
        (72, 782),
        "Winner to 3-1. Loser joins the commoners.",
        "inter-semibold",
        orange,
        26,
    )

    footer_w4(img, ref_img, "10/16")
    dest = OUT_SLIDES / "w4-slide-10.png"
    save(img, dest)
    return dest


def recompose_w4_slide_06() -> Path:
    src = UPLOADS / "w4-slide-06_804c.png"
    ref = UPLOADS / "w4-slide-07_78cc.png"
    img = load_rgb(src)
    ref_img = load_rgb(ref)
    gold = sample_text_color(ref_img, (72, 54, 280, 80))
    white = (255, 255, 255)
    yellow = sample_text_color(img, (72, 130, 200, 200))
    body = sample_text_color(img, (72, 480, 400, 520))

    zones = [
        (55, 45, 700, 95),
        (55, 115, 720, 280),
        (55, 280, 1025, 1230),
        (55, 1255, 1025, 1345),
    ]
    clear_zones(img, zones)

    draw_left(img, (72, 54), "GWB | WEEK 4 | EL CAMPEON", "bebas", gold, 26)
    draw_left(img, (72, 130), "BOWERS", "anton", white, 72)
    draw_left(img, (72, 200), "IS BACK", "anton", yellow, 72)

    body_lines = [
        "Brock Bowers returned from the knee",
        "procedure and immediately went:",
        "10 catches. 116 yards. 1 TD.",
        "",
        "Hadi goes from AJ Barner...",
        "back to an elite tight end!",
        "Ranked around top-15 overall FLEX -",
        "absurd for a tight end.",
        "JSN still a top-two FLEX.",
        "El Campeon quietly getting healthier.",
        "Nobody say anything.",
    ]
    y = 300
    for line in body_lines:
        if line:
            draw_left(img, (72, y), line, "inter-semibold", body, 28)
        y += 38

    footer_w4(img, ref_img, "6/16")
    dest = OUT_SLIDES / "w4-slide-06.png"
    save(img, dest)
    return dest


def recompose_w4_slide_14() -> Path:
    src = UPLOADS / "w4-slide-14_8b5b.png"
    ref = UPLOADS / "w4-slide-15_9529.png"
    img = load_rgb(src)
    ref_img = load_rgb(ref)
    gold = sample_text_color(ref_img, (72, 54, 280, 80))
    white = (255, 255, 255)
    gray = sample_text_color(img, (193, 878, 280, 910))
    note = sample_text_color(img, (72, 1050, 400, 1080))

    zones = [
        (55, 45, 700, 95),
        (55, 115, 1008, 220),
        (55, 1020, 720, 1240),
        (55, 1255, 1025, 1345),
    ]
    clear_zones(img, zones)

    draw_left(img, (72, 54), "GWB | WEEK 4 | QB HEAT CHECK", "bebas", gold, 26)
    draw_centered(img, (72, 130, 1008, 210), "QB HEAT CHECK", "anton", gold)

    rows = [
        "1 Josh Allen - Matt",
        "2 Lamar - Crooke",
        "3 Mahomes - Manny",
        "4 Lawrence - Danny",
        "5 Hurts - Jamil",
        "6 Goff - Frankie",
        "7 Purdy - Narking",
        "9 Dak - Eric",
        "11 Bryce - Mauricio",
        "14 Kyler - Hadi",
    ]
    panel = (120, 250, 960, 980)
    ImageDraw.Draw(img).rectangle(panel, fill=(18, 24, 32))
    y = 280
    for row in rows:
        draw_left(img, (140, y), row, "inter-semibold", gray, 28)
        y += 62

    note_lines = [
        "Darnold isn't top-tier this week...",
        "after 47.89 GWB points, I'm not telling",
        "that man what to do.",
    ]
    y = 1040
    for line in note_lines:
        draw_left(img, (72, y), line, "inter-semibold", note, 26)
        y += 32

    footer_w4(img, ref_img, "14/16")
    dest = OUT_SLIDES / "w4-slide-14.png"
    save(img, dest)
    return dest


def recompose_w4_slide_16() -> Path:
    src = UPLOADS / "HELD-w4-slide-16-footer-overlap_c4d2.png"
    ref = UPLOADS / "w4-slide-15_9529.png"
    img = load_rgb(src)
    ref_img = load_rgb(ref)
    gold = sample_text_color(ref_img, (72, 54, 280, 80))
    white = (255, 255, 255)
    row_fill = (22, 30, 42)
    red = sample_text_color(img, (72, 713, 260, 743))
    body = (235, 235, 235)

    zones = [
        (55, 45, 700, 95),
        (55, 115, 720, 220),
        (55, 230, 720, 1230),
        (55, 1255, 1025, 1345),
    ]
    clear_zones(img, zones)

    draw_left(img, (72, 54), "GWB | WEEK 4 | CROOKE'S PICKS", "bebas", gold, 26)
    draw_left(img, (72, 150), "THE PICKS", "anton", white, 64)

    picks = [
        "Crooke over Danny",
        "Eric over Mauricio - barely",
        "Steven over Narking",
        "Kayser over Frankie",
        "Manny over Hadi - coin flip",
        "Matt over Jamil - coin flip",
    ]
    y = 260
    for pick in picks:
        box = (72, y, 1008, y + 52)
        ImageDraw.Draw(img).rectangle(box, fill=row_fill)
        draw_left(img, (88, y + 10), pick, "inter-semibold", white, 28)
        y += 58

    draw_left(img, (72, 720), "Upset watch: Narking over Steven.", "inter-semibold", red, 26)
    draw_left(
        img,
        (72, 752),
        "Purdy dropped 50.3, Kittle 26.2, Jeanty due for TD regression.",
        "inter-semibold",
        red,
        24,
    )
    draw_left(img, (72, 784), "If it happens...", "inter-semibold", red, 24)

    draw_left(img, (72, 840), "God help us all:", "inter-semibold", red, 26)
    closing = [
        "Steven is the final boss. Kayser refuses",
        "the Bottom 6. Jamil robbed the wire.",
        "Week 4 hasn't started and we're already",
        "fighting. GWB is exactly where it needs",
        "to be.",
    ]
    y = 878
    for line in closing:
        draw_left(img, (72, y), line, "inter-semibold", body, 28)
        y += 36

    footer_w4(img, ref_img, "16/16")
    dest = OUT_SLIDES / "w4-slide-16.png"
    save(img, dest)
    return dest


def recompose_result_card(
    upload_name: str,
    out_name: str,
    *,
    week: int,
    matchup: str,
    final_line: str,
    winner: str,
    loser: str,
    w_score: str,
    l_score: str,
    tagline: str,
    note: str,
    winner_badge: str,
) -> Path:
    src = UPLOADS / upload_name
    ref = UPLOADS / "result-w2-m2_8d28.png"
    img = load_rgb(src)
    ref_img = load_rgb(ref)

    gold = sample_text_color(ref_img, (72, 54, 280, 80))
    white = (255, 255, 255)
    muted = sample_text_color(ref_img, (72, 1180, 400, 1210))

    zones = [
        (55, 45, 500, 100),
        (55, 120, 1025, 260),
        (55, 260, 1025, 340),
        (65, 220, 210, 270),
        (65, 310, 210, 370),
        (55, 1095, 1025, 1235),
        (55, 1240, 1025, 1345),
    ]
    clear_zones(img, zones)

    draw_left(img, (72, 54), f"GWB • WEEK {week}", "bebas", gold, 28)
    draw_centered(img, (72, 130, 1008, 220), final_line, "anton", white)
    score = f"{winner} {w_score} — {l_score} {loser}"
    draw_centered(img, (72, 230, 1008, 310), score, "bebas", gold)
    draw_centered(img, (72, 1120, 1008, 1165), tagline, "inter-semibold", white)
    draw_centered(img, (72, 1170, 1008, 1210), note, "inter-semibold", muted)

    badge_gold = sample_text_color(ref_img, (97, 334, 180, 354))
    badge_box = (72, 318, 200, 358)
    inpaint_region(img, badge_box)
    ImageDraw.Draw(img).rounded_rectangle(badge_box, radius=10, fill=(18, 18, 18))
    draw_centered(img, badge_box, winner_badge, "bebas", badge_gold)

    draw_centered(
        img,
        (72, 1270, 1008, 1310),
        f"gwb_fantasy_football • RESULTS • {matchup}",
        "inter",
        muted,
    )

    dest = OUT_RESULTS / out_name
    save(img, dest)
    return dest


def verify_no_hady(path: Path) -> None:
    out = subprocess.check_output(
        ["tesseract", str(path), "stdout"], stderr=subprocess.DEVNULL, text=True
    )
    if "hady" in out.lower():
        raise SystemExit(f"Hady in OCR: {path.name}")


def ssim_vs_sibling(output: Path, sibling: Path, mask_top: int = 0) -> float:
    """Rough similarity of non-text bands (higher = closer chrome)."""
    a = np.array(Image.open(output).convert("RGB"), dtype=np.float32)
    b = np.array(Image.open(sibling).convert("RGB"), dtype=np.float32)
    if mask_top:
        a = a[mask_top:]
        b = b[mask_top:]
    diff = np.abs(a - b).mean()
    return float(100 - min(diff / 2.55, 100))


def qa_side_by_side(a: Path, b: Path, label: str) -> Path:
    ia, ib = Image.open(a), Image.open(b)
    w, h = ia.width, ia.height
    combo = Image.new("RGB", (w * 2 + 20, h), (30, 30, 30))
    combo.paste(ib, (0, 0))
    combo.paste(ia, (w + 20, 0))
    d = ImageDraw.Draw(combo)
    d.text((12, 12), f"sibling: {b.name}", fill=(255, 200, 80))
    d.text((w + 32, 12), f"rebuild: {a.name}", fill=(255, 200, 80))
    out = QA_DIR / f"gwb-recompose-compare-{label}.png"
    QA_DIR.mkdir(parents=True, exist_ok=True)
    combo.save(out, optimize=True)
    return out


def main() -> None:
    jobs: list[tuple[str, Path, Path]] = []

    jobs.append(
        (
            "vs-m3-hadi-manny",
            recompose_vs_m3(),
            UPLOADS / "vs-m4-jamil-matt_e46f.png",
        )
    )
    jobs.append(
        ("w4-slide-10", recompose_w4_slide_10(), UPLOADS / "w4-slide-11_838c.png")
    )
    jobs.append(
        ("w4-slide-06", recompose_w4_slide_06(), UPLOADS / "w4-slide-07_78cc.png")
    )
    jobs.append(
        ("w4-slide-14", recompose_w4_slide_14(), UPLOADS / "w4-slide-15_9529.png")
    )
    jobs.append(
        ("w4-slide-16", recompose_w4_slide_16(), UPLOADS / "w4-slide-15_9529.png")
    )

    recompose_result_card(
        "result-w1-m2_b501.png",
        "results-w1-m2.png",
        week=1,
        matchup="W1M2",
        final_line="FINAL: KAYSER TAKES IT",
        winner="KAYSER",
        loser="HADI",
        w_score="138.7",
        l_score="119.4",
        tagline="THE SPECIAL ONE STRIKES",
        note="Kayser 1-0 — Hadi's crown slips in Week 1",
        winner_badge="KAYSER 1-0",
    )
    jobs.append(
        (
            "results-w1-m2",
            OUT_RESULTS / "results-w1-m2.png",
            UPLOADS / "result-w2-m2_8d28.png",
        )
    )

    recompose_result_card(
        "result-w2-m1_d793.png",
        "results-w2-m1.png",
        week=2,
        matchup="W2M1",
        final_line="FINAL: HADI TAKES IT",
        winner="HADI",
        loser="CROOKE",
        w_score="151.0",
        l_score="123.7",
        tagline="EL CAMPEON RESPONDS",
        note="Hadi evens up at 1-1 — Crooke falls to 0-2",
        winner_badge="HADI 1-1",
    )
    jobs.append(
        (
            "results-w2-m1",
            OUT_RESULTS / "results-w2-m1.png",
            UPLOADS / "result-w2-m2_8d28.png",
        )
    )

    recompose_result_card(
        "result-w3-m2_adfa.png",
        "results-w3-m2.png",
        week=3,
        matchup="W3M2",
        final_line="FINAL: HADI TAKES IT",
        winner="HADI",
        loser="DANNY",
        w_score="132.0",
        l_score="121.7",
        tagline="EL CAMPEON TO 2-1",
        note="Danny's negative mulligan — first in GWB history",
        winner_badge="HADI 2-1",
    )
    jobs.append(
        (
            "results-w3-m2",
            OUT_RESULTS / "results-w3-m2.png",
            UPLOADS / "result-w2-m2_8d28.png",
        )
    )

    manifest = []
    for label, path, sibling in jobs:
        verify_no_hady(path)
        qa_side_by_side(path, sibling, label)
        score = ssim_vs_sibling(path, sibling, mask_top=280)
        manifest.append({"id": label, "path": str(path), "ssim_band": round(score, 2)})
        print("OK", label, "ssim~", round(score, 2))

    (OUT_SLIDES / "recompose-manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n"
    )


if __name__ == "__main__":
    main()
