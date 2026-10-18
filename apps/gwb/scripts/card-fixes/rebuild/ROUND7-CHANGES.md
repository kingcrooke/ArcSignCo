# Round 7 — generator provenance & per-card status

## Generators (from `git log --follow` on `main` slide JPGs)

| Asset class | First on `main` | Generator used this round |
|-------------|-----------------|---------------------------|
| Results W1–W3 (14 cards) | `a008298` (#23) | `composite-result-cards.py` — panel paste on `main` full JPG (`a538c42` lineage) |
| W4 `vs-m1`…`m6` | `a008298` | `composite-preview-cards.py` |
| W5 `vs-w5-m2`, `vs-w5-m4` | `9f776ae`+ | `composite-preview-cards.py` (W5 panel boxes) |
| Report `w1-slide-09`, `w2-slide-06`, `w4-slide-12` | `a008298` | **NO GENERATOR** — left byte-identical to `main` |

Orchestration: `node scripts/card-fixes/render-round7.mjs`

## Left as live (no composite)

| Card | Reason |
|------|--------|
| `results-w1-m2` | Not in the 14-card results scope |
| `results-w3-m2` | Not in the 14-card results scope |
| `w1-slide-09`, `w2-slide-06`, `w4-slide-12` | NO GENERATOR — pending text in LIVE-TEXT-DIFF marked NOT APPLIED |

## Composited (panel art only + allowed text patches)

**Results:** `results-w1-m1`, `m3`–`m6`; `results-w2-m2`–`m6`; `results-w3-m1`, `m3`–`m5`

**Previews:** `vs-m1-narking-steven` … `vs-m6-danny-crooke`; `vs-w5-m2`, `vs-w5-m4`

**Text patches (post-composite):** `apply-live-text-diff.py` — HADY pill on `vs-m3-hadi-manny`; W5 taglines per LIVE-TEXT-DIFF. All other copy remains live (incl. MANNY pills/scores, 59/41 & 54/46 odds, MNNY in tagline only where live has it).

## Art regen (Rule 4)

Dual-ref panels reinstalled via `install-generated-panels.mjs` (hyped: Narking W2-m2, Crooke W3-m1; dejected: Hady W1-m2, Matt W2-m4, Frankie W2-m6, Danny W3-m3; fixes: Hady W3-m2 asset on disk — **card `results-w3-m2` left live**, Steven NO#12 W2-m4, Rams vs-m2 Kayser, vs-m5 arms, vs-m6 Crooke BAL#8, W5 Raiders shield #8, etc.).

## Per-card delta (vs `main` full JPG)

| Card | Layout | Panels | Text |
|------|--------|--------|------|
| 14 scoped results | live composite | regen sides pasted | live |
| `results-w1-m2`, `results-w3-m2` | **live** | none | live |
| W4 `vs-m1`–`m6` | live composite | both sides pasted | live (+ HADY pill on `vs-m3`) |
| `vs-w5-m2`, `vs-w5-m4` | live composite | both sides | live odds; tagline QB fix only |
| Report slides ×3 | **live** | none | NOT APPLIED |

## w4-slide-12 note

Live shows Mauricio/Narking `0.03` and “NARKING LOSES BY 39.35”. Requested HADY/Manny `6.77` stat **NOT APPLIED** (no slide generator). Steven–Narking 39.35 blowout remains factually valid as biggest margin context if that line is ever re-enabled.
