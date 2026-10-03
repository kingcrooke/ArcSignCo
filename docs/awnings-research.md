# Awnings research: shapes, profiles, valances, fabrics, NYC rules

Internal reference for the storefront sign mockup engine. Research only, no app code.

**Usage rule.** This file is internal. Anything that ships on the site (UI labels, presets, thumbnails, copy) must use the generic shape names below. It must not use manufacturer or competitor names, product names, logos or images. Supplier and brand names appear only in the Sources section at the end. Where the body needs a material, it uses the generic term ("solution-dyed acrylic", "translucent backlit vinyl") instead of a trade name.

**Confidence markers.** Facts taken from a catalog, spec sheet or code carry a source tag like `[S3]`, which points to the Sources list. Values marked *(design default)* are proportions suggested for drawing the mockup, not industry or code figures. Values marked *(inferred)* were worked out from product descriptions and should be checked against a real shop drawing before anyone relies on them.

---

## Contents

1. Definitions (awning vs canopy vs marquee)
2. Geometry conventions for SVG (W, P, D and friends)
3. Shared construction facts (frames, covers, sizes)
4. Shape catalog (32 entries)
5. Valance styles
6. Fabric patterns and cover materials
7. NYC considerations (projection, clearance, lettering, permits, landmarks, sidewalk canopies)
8. Suggested mockup-engine checks
9. Summary table
10. Sources

---

## 1. Definitions

- **Awning**: an architectural projection that gives weather protection, identity or decoration, and is *wholly supported by the building* it's attached to. It's a lightweight frame with a cover over it. Awnings are either **stationary (fixed)** or **retractable** `[S1]`.
- **Canopy**: also attached to the building, but with *at least one stanchion (post) at the outer end* `[S1]`. In NYC the Department of Transportation (DOT) uses "canopy" for a frame clad in fabric that runs from a building entrance over the sidewalk to the curb, on posts `[S14][S16]`.
- **Freestanding canopy**: supported on stanchions and *not attached* to a building `[S1]`.
- **Marquee**: in NYC code, a permanent projecting structure supported only from the building, at least 10 ft above the sidewalk, with limits on fascia height and on which building types may have one `[S11]`. Some fabric catalogs also use "marquee" for gable-top or round-top entrance canopies `[S5]`, so treat the word as ambiguous in vendor material.
- **Skirt / valance**: the finishing strip of fabric along the lower edge. A **rigid (hard, framed)** valance is part of the frame. A **loose (soft, flexible)** valance hangs free `[S12][S17]`.
- **Sign box**: a tall vertical framed face, usually at the front, that carries lettering. It's often combined with a rigid valance `[S4]`.

## 2. Geometry conventions

All shapes are described in one 3D frame plus three orthographic SVG views. Every SVG path below uses **SVG user units with y pointing down**. Substitute the symbols with numbers (inches are recommended; 1 unit = 1 in).

```
3D frame
  X  across the facade, 0 … W (left to right, seen from the street)
  Y  outward from the wall, 0 … P   (Y = 0 is the wall face)
  Z  downward from the top attachment line, 0 … D (+ loose valance)

Side profile (section)   = (Y, Z)  → SVG x = Y, SVG y = Z. The wall is the line x = 0.
Front elevation          = (X, Z)  → SVG x = X, SVG y = Z.
Plan (top view)          = (X, Y)  → SVG x = X, SVG y = Y (the wall is the top edge y = 0).

Parameters
  W   overall width along the facade
  P   projection: horizontal distance from the wall face to the outermost framed point
  D   overall framed drop: top attachment to bottom of framed front
      (includes rigid valance or sign box; excludes loose valance)
  Vr  rigid valance / sign-box height (framed, part of D). 0 if none.
  Vs  loose valance height (unframed, hangs below D). 0 if none.
  Dc  = D − Vr   "crown drop": vertical extent of the shaped roof surface
  k   = 0.5523   cubic-Bezier quarter-circle constant, 4(√2 − 1)/3
  Hm  mounting height: sidewalk to the top attachment line
      clearance under frame   = Hm − D
      clearance under valance = Hm − D − Vs
```

Drawing notes that apply everywhere:

- **Closed sides** means the side panel is filled with cover material, so draw the side-profile path as a filled shape. **Open sides** means draw only the roof stroke, the valance and the support members.
- **Front elevation** is what a straight-on storefront photo mostly shows. For a 3/4 perspective, extrude the side profile along X, or project the 3D vertices given for the more complex shapes.
- Quarter-ellipse arcs are written as cubic Béziers so they also work in canvas and Path2D: from `(x0,y0)` to `(x1,y1)` with the center at the corner, the control points sit at `k` times each radius along the tangents.
- SVG `A` sweep flags are given for the y-down coordinate system and have been checked.
- Paths are symbolic: evaluate each expression in parentheses (and products like `kP`) to a number before emitting the path. "−" means minus.

## 3. Shared construction facts

**Frames**

- Most awnings and canopies are fabric stretched over a fixed metal frame. The fabric is secured by lacing or screws, or stapled into a groove in extruded aluminum frame members. Frames are welded, bolted or otherwise connected. Retractables use rollers and lateral arms instead `[S5]`. Almost any shape can be made by cutting, bending and welding tube `[S5]`.
- Typical tube: 1 in × 1 in (and 1 × 2 in) square aluminum (6063-T5/T6) `[S19][S20]`, 16 ga galvanized steel tube or 0.125 in aluminum tube `[S21]`, or 1 in square 18 ga steel "staple-in" tubing for staple-attached covers `[S22]`. Heavier work uses 1.5 in, 2 in or 3 in square tube `[S20][S24]`.
- Spacing: rafters no more than 60 in on center, drop and projection arms no more than 72 in on center (one fabricator's spec) `[S19]`. Major joints get at least 3 welds `[S19][S22]`.
- Curved shapes are built from bows (curved rafters). Convex/quarter-round fronts are "a series of parallel bows in the shape of a convex curve" `[S1]`. Domes use **radial ribs**; elongated domes use **vertical ribs** on the straight section `[S2]`.
- Projections over about **4 ft usually need front-end support** (posts or hanger rods) `[S4]`.

**Covers (summary; detail in section 6)**

Woven solution-dyed acrylic, vinyl-laminated or vinyl-coated polyester, vinyl-coated mesh, polyester/cotton blends `[S5]`, PVC-coated polyester tensile membranes (canopies) `[S36][S37]`, metal (aluminum, Galvalume steel, copper) `[S23][S24][S26]`, laminated glass `[S31]`, and polycarbonate with translucent vinyl `[S28]`.

**Typical sizes (general)**

| Item | Typical value | Source |
|---|---|---|
| Size notation | Width × Height (drop) × Projection, plus valance heights (e.g. 10'6" W × 3'0" H × 3'6" P × 6" hard valance) | `[S17]` |
| Valance height | 6–8 in standard. Residential 6–7 in, commercial 8–10 in. | `[S17][S18]` |
| Width vs opening | Opening plus about 3–6 in per side (one guide adds 6 in total, another 4.5 in, another at least 4 in) | `[S18][S38][S39][S85]` |
| Window awning drop | About 1/2 of window height. Shade the top 1/3 to 1/2 of the window. | `[S85][S38]` |
| Window/door projection | Doorways often 24–48 in. Aluminum window units run 22–50 in without posts. | `[S38][S85]` |
| Dome / quarter-round | Drop and projection are equal (the radius) | `[S40]` |
| Waterfall / box | Projection and drop are similar | `[S40]` |
| Storefront (NYC legal max) | Up to 8 ft beyond the street line. Window/door awnings up to 5 ft. | `[S10][S11]` |

---

## 4. Shape catalog

Each entry gives: aliases, a one-line description, geometry (side profile, front elevation, plan or 3D where needed), frame, covers, uses, lighting, typical sizes and variants.

### 4.1 Traditional / standard slope

- **Aliases:** shed, slope, lean-to, standard, "traditional with/without sides", "open-end traditional" `[S1][S2][S3][S6]`.
- **What it is:** a single straight down-slanting front panel, with or without two side panels, optionally with a valance. It's the most common storefront and window profile `[S1][S6]`.
- **Side profile, closed sides (trapezoid side panel):**
  `M 0,0 L P,Dc L P,D L 0,D Z`
  The roof line runs from `(0,0)` to `(P,Dc)`, the rigid valance from `(P,Dc)` to `(P,D)`, and the bottom (projection) bar from `(P,D)` back to the wall.
  *Triangular-side variant (valance on the front only):* side `M 0,0 L P,Dc L 0,Dc Z`, plus the valance strip `M P,Dc L P,D`.
- **Side profile, open sides (lean-to frame):** strokes only.
  Roof `M 0,0 L P,Dc`. Valance `M P,Dc L P,D`. Support arm `M 0,A L P,Dc`, where the arm meets the wall at `A ≈ 1.0–1.5·D` below the top line *(design default)*. On open-end awnings the side arms can be moved up or down the frame `[S4]`. At NYC individual landmarks, a fixed awning must be a lean-to frame with no top-bar-to-side-bar member perpendicular to the facade, a round side bar, and a gray finish `[S12]`.
- **Front elevation:** rectangle `M 0,0 H W V D H 0 Z`. The roof band is `0…Dc`, the valance band `Dc…D`, and a loose valance hangs `D…D+Vs`.
- **Pitch:** `atan(Dc / P)`. Drawing defaults *(design default)*: P = 36–48 in, D = 24–36 in, Vr = 8 in.
- **Frame:** welded square tube: top bar on the wall, front bar, rafters, plus a projection bar (closed) or diagonal arms (open) `[S19]`.
- **Covers:** acrylic canvas (matte), vinyl, metal (standing seam, flat pan), aluminum-panel units `[S1][S24][S85]`.
- **Uses:** storefronts, windows, doors, patios. It's also the profile NYC landmark rules expect ("must project at an angle") `[S12]`.
- **Lit?** Usually not. A backlit vinyl version with a sign box exists (see 4.31).
- **Sizes:** see section 3. Storefront runs are often continuous across several bays.
- **Variants:** with/without sides, with/without valance, rigid vs loose valance, with sign box (4.9b), gabled traditional (4.10b), spear-arm (4.25).

### 4.2 Quarter-round / convex

- **Aliases:** convex, quarter-round, quarter-barrel, waterfall (in some catalogs), bullnose (some regions), convex canopy `[S1][S6][S41][S42][S43]`.
- **What it is:** like a traditional awning with flat side panels, but the front panel is a convex curve built from parallel bows, giving a radius shape with flat ends `[S1]`.
- **Side profile (full quarter-round, center at (0,Dc), radii P × Dc):**
  `M 0,0 C kP,0 P,(Dc−k·Dc) P,Dc L P,D L 0,D Z`
  The curve leaves the wall horizontally and meets the front vertically. When P = Dc it's a true quarter circle `[S40]`.
- **Side profile (partial convex, leaves the wall already sloping):**
  `M 0,0 C 0.55P,0.20Dc P,0.45Dc P,Dc L P,D L 0,D Z` *(design default)*.
- **Front elevation:** same rectangle as 4.1. The curve only shows as shading. Graphics usually go on the valance or flat sign panels `[S43]`.
- **Frame:** bent-tube bows (curved rafters) between a wall bar and a front bar, with flat welded side frames `[S1]`.
- **Covers:** acrylic, vinyl (including backlit), "metal-look" fabric, standing-seam metal for barrel looks `[S6][S43]`.
- **Uses:** small entries and windows `[S1]`, hospitality and boutique retail `[S6]`, older main-street shopfronts.
- **Lit?** Sometimes. Convex and waterfall-family shapes in vinyl are common backlit forms `[S5][S28]`.
- **Sizes:** P ≈ D (radius) `[S40]`; residential/door P is often 24–48 in.
- **Variants:** with hard valance, with soft/scalloped valance, with sign face, with domed ends (this is the elongated dome, 4.5) `[S43]`. A "custom convex" is a non-circular curve `[S5]`.

### 4.3 Concave

- **Aliases:** inverted quarter-barrel, concave shed `[S1][S6][S25]`.
- **What it is:** the front panel curves inward. Sides can be closed for full shade, or open with the front supported by decorative poles `[S1]`.
- **Side profile (quarter-ellipse, center at (P,0)):**
  `M 0,0 C 0,k·Dc (P−kP),Dc P,Dc L P,D L 0,D Z`
  The curve leaves the wall going steeply down and ends nearly horizontal at the front.
  *Softer concave (design default):* `M 0,0 C 0.15P,0.55Dc 0.5P,Dc P,Dc …`. An optional slight upturn at the tip: end at `(P, Dc−0.03P)`.
- **Front elevation:** rectangle, as in 4.1.
- **Frame:** concave bent rafters. Open-sided versions often hang from ornamental iron spear arms `[S1][S25]`.
- **Covers:** acrylic canvas, vinyl, metal.
- **Uses:** windows and doors `[S1]`, contemporary architecture `[S6]`, café fronts with spear arms.
- **Lit?** Rarely.
- **Sizes:** like traditional; decorative spear-arm units come in standard widths up to about 8 ft `[S25]`.

### 4.4 Dome

- **Aliases:** half-round, circular, quarter-sphere, standard dome, "bullnose" (some shops) `[S1][S2][S41][S44]`.
- **What it is:** a quarter-sphere shell over a small entry, window or arch. It gives similar protection from all angles `[S1]`. It's built on radial ribs `[S2]`.
- **3D:** a semi-ellipsoid with semi-axes `W/2` (X), `P` (Y) and `Dc` (Z), centered at `(W/2, 0, Dc)` and cut by the wall plane Y = 0 and the plane Z = Dc. A true quarter-sphere has W = 2P = 2Dc.
- **Side profile:** the full quarter-round from 4.2 with P and Dc.
- **Front elevation:**
  `M 0,Dc A (W/2),Dc 0 0 1 W,Dc L W,D L 0,D Z`
  This is an upper half-ellipse with a valance band below it.
- **Plan:** `M 0,0 A (W/2),P 0 0 0 W,0 Z` (a half-ellipse bulging away from the wall).
- **Valance on a dome:** it follows the curved bottom edge. In front view, a pattern element at plan angle φ (0 at front center, ±90° at the wall) looks horizontally squashed by `cos φ`. Shrink the scallop period toward the ends instead of repeating it evenly in screen space.
- **Stripes on a dome:** they run along the gores (radial seams) and converge toward the top center *(inferred from construction)*.
- **Frame:** a wall arc bar, radial ribs from the top center, and a curved front/bottom hoop `[S2][S45]`.
- **Covers:** acrylic, vinyl, metal-look fabric. A sign box is possible on the front `[S4]`.
- **Uses:** small entries, windows, archways `[S1]`, residential doors, small retail entries `[S6]`.
- **Lit?** Occasionally, as a backlit vinyl dome.
- **Sizes:** drop equals projection equals radius `[S40]`. *(design default)* W 36–96 in.
- **Variants:** tall dome, irregular dome, dome with sign box and fixed valance `[S4][S44]`, clamshell (4.27).

### 4.5 Elongated dome

- **Aliases:** long dome, extended dome, "convex with domed ends", "bullnose" (US sign-shop usage) `[S1][S3][S4][S43][S45]`.
- **What it is:** a dome stretched for long windows or entries. It can sit on a flat wall or wrap a corner `[S1]`. In practice it's a convex center section with quarter-sphere ends. Vertical ribs run along the straight part `[S2]`.
- **3D:** a straight quarter-cylinder of length `W − 2R` along X, with quarter-sphere end caps of radius R. *(design default)* R = P.
- **Side profile:** the full quarter-round from 4.2.
- **Front elevation:**
  `M 0,Dc A R,Dc 0 0 1 R,0 H (W−R) A R,Dc 0 0 1 W,Dc L W,D L 0,D Z`
- **Plan:**
  `M 0,0 A R,P 0 0 0 R,P H (W−R) A R,P 0 0 0 W,0 Z`
- **Frame:** a dome-style frame with design rafters and down bars `[S45]`; ends built like a dome.
- **Covers:** acrylic, vinyl (backlit possible), metal-look fabric.
- **Uses:** long storefront windows, entries, corner wraps `[S1]`.
- **Lit?** Sometimes (backlit vinyl).
- **Sizes:** W is typically 8–30 ft *(design default)*; P is the same as for convex.

### 4.6 Bullnose (alias family, not a distinct shape)

- **What the term means:** suppliers disagree.
  - Several US fabricators file "bullnose" with **elongated dome** ("bullnose or elongated dome") or call it "also known as a dome awning" `[S3][S41]`.
  - Other fabricators (often Australian or UK) use it for the **convex / quarter-round** shape with straight sides and a rounded front, and say the radius can be adjusted `[S42][S46]`.
  - One fabricator describes it as semi-polygonal, "half of an umbrella", which is a faceted dome or half-cone (see 4.15) `[S41]`.
- **Recommendation for the engine:** map the user-facing label "Bullnose" to **elongated dome (4.5)** by default, and add a toggle for "squared ends" that switches to convex (4.2). Don't present it as a separate geometry.

### 4.7 Waterfall / curved front

- **Aliases:** waterfall, curved-front, "convex bulge, tall valance", straight waterfall, convex waterfall `[S2][S6][S45]`.
- **What it is:** a flat or gently pitched top that rolls over a radiused nose into a tall vertical front face. That face is the sign field. Some catalogs use "waterfall" as a straight synonym for convex/quarter-round `[S43][S46]`; the tall-face meaning is the more distinctive one for signage `[S2][S28]`.
- **Side profile (straight waterfall):** with a top fall `s` (0–0.15·P), nose radius `r` (0.15–0.35·min(P, D−s)) and `c1 = (P−r+k·r, s + k·r·s/(P−r))`:
  `M 0,0 L (P−r),s C c1 P,(s+r−k·r) P,(s+r) L P,D L 0,D Z`
  The vertical front face runs from `s+r` to `D`.
- **Side profile (convex waterfall, long curved rafter):** `M 0,0 C 0.6P,0 P,0.1D P,0.35D L P,D L 0,D Z` *(design default)*.
- **Plan-curved fronts:** one CAD system's waterfall family covers straight/convex, straight/concave, convex/straight, convex/convex and convex/concave. The first word is the top and front bars (straight or curved in plan); the second is the rafter shape `[S45]`.
- **Front elevation:** rectangle. The roll-over band `0…s+r` reads as a highlight; the sign face is `s+r…D`.
- **Frame:** extruded aluminum or steel staple-in framing, often with an open "egg-crate" ceiling when backlit `[S28]`.
- **Covers:** translucent backlit vinyl (very common), acrylic, vinyl.
- **Uses:** strip retail, laundromats, banks and franchise fronts that need a big sign face `[S28]`.
- **Lit?** **Often backlit** (internal fluorescent or LED) `[S28]`.
- **Sizes:** P and D are similar `[S40]`; *(design default)* P = 30–48 in, D = 30–48 in, r = 6–12 in.
- **NYC note:** the tall vertical sign face and vinyl conflict with LPC staff-level rules (sloped projection, skirt no more than 12 in, matte canvas) `[S12]`. If it's lit or lettered beyond the awning allowance, it's treated as a sign `[S8][S9]`. See section 7.

### 4.8 Box / flat-front

- **Aliases:** box awning, flat-front, flat panel, sign-box awning, "box-style" `[S2][S28][S47]`.
- **What it is:** a near-rectangular section: a nearly flat top, a sharp front corner, a vertical (or slightly raked) front face, and flat closed ends. It reads as a fabric sign box.
- **Side profile:** with a top fall `s = P · pitch` (pitch about 1:12 to 3:12, *design default*):
  `M 0,0 L P,s L P,D L 0,D Z`
  Bottom: open, egg-crate grid, or closed soffit `[S28]`. Raked-front variant: `L (P+t),D` with `t ≈ 0.1–0.25·(D−s)`.
- **Front elevation:** rectangle W × D. The whole face can be a sign.
- **Frame:** welded aluminum square tube, with a top plane, front plane and end frames `[S28][S47]`.
- **Covers:** acrylic (heat-sealed graphics), backlit vinyl.
- **Uses:** storefront identity, office and retail entries `[S28][S47]`.
- **Lit?** Often internally lit (backlit) `[S28]`.
- **Sizes:** *(design default)* P = 18–36 in, D = 24–48 in.
- **Combination:** "box awning + center gable" is a standard combination style `[S2]`.

### 4.9 Traditional with sign box (sub-variant of 4.1)

- **What it is:** a traditional slope that ends in a tall vertical framed sign box, often with a fixed valance or a loose valance below. Lettering goes in the box and graphics on the slope `[S4]`.
- **Side profile:** `M 0,0 L P,(D−Hsb) L P,D L 0,D Z`, where `Hsb` is the sign-box height. *(design default)* 12–24 in for commercial work. Note the LPC cap of 12 in, unframed, at NYC landmarks `[S12]`.
- **Front elevation:** rectangle with a sign band `D−Hsb…D`.

### 4.10 Gable

- **Aliases:** gabled, A-frame, peaked, "gable style canopy" `[S2][S3][S5][S6]`.
- **What it is:** a peaked roof with two slopes, so the front shows a triangle like a small roof `[S2][S6]`. The ridge runs perpendicular to the wall.
- **3D:** ridge from `(W/2, 0, 0)` to `(W/2, P, s)`. Eaves along `X = 0` and `X = W` at `Z = Hg` (to `Hg+s` at the front). Gable rise `Hg = (W/2)·tan θ`, roof pitch θ = 25–45° *(design default)*. `D = Hg + Vr`.
- **Front elevation (closed gable end plus valance):**
  `M 0,Hg L (W/2),0 L W,Hg L W,(Hg+Vr) L 0,(Hg+Vr) Z`
  The gable end panel is the triangle `M 0,Hg L (W/2),0 L W,Hg Z`. It can be fabric-filled (closed) or open.
- **Side profile:** `M 0,0 L P,s L P,(Hg+Vr+s) L 0,(Hg+Vr) Z`, with the eave fold line `M 0,Hg L P,(Hg+s)`.
- **Frame:** a ridge bar, eave bars and gable-end rafters. Posts are needed on long projections (see entrance canopy, 4.20).
- **Covers:** acrylic, vinyl, metal.
- **Uses:** traditional facades, period architecture, sheds water well `[S6]`, entrance canopies `[S4]`.
- **Lit?** Rarely; downlights under entrance versions.
- **Variants:**
  - (a) **Gable entrance canopy:** a peaked version of the round entrance canopy, with a flat front nose for graphics `[S4]`.
  - (b) **Gabled traditional:** a traditional slope across the full W with a centered or off-center gable of width `Wg` whose ridge projection equals P, giving a flush front `[S4]`. Front elevation: the 4.1 rectangle plus a pediment with points `(xg−Wg/2, Dc)`, `(xg, Dc−Hg)`, `(xg+Wg/2, Dc)`.
  - (c) **Extended gable:** the gable ridge projects past the traditional, to `Pg > P`. Total projection over 4 ft usually needs front support `[S4]`.
  - (d) **Combination:** box awning plus a center gable `[S2]`.

### 4.11 Hip

- **Aliases:** hipped, hip roof, Juliet awning, hip & ridge (sub-variant) `[S2][S48][S49]`.
- **What it is:** like half a pyramid. The front and both ends slope outward and down from the top, so rain and snow are thrown clear on three sides `[S48]`. The ends are tapered instead of vertical `[S49]`.
- **3D (equal pitch):** top edge on the wall from `(a,0,0)` to `(W−a,0,0)`. Front eave from `(0,P,Dc)` to `(W,P,Dc)`. Hip lines from `(a,0,0)` to `(0,P,Dc)` and from `(W−a,0,0)` to `(W,P,Dc)`. Default `a = P` (45° hips in plan). Optional flat top shelf: start the slopes at `Y = Pf`.
- **Front elevation:** `M a,0 L (W−a),0 L W,Dc L W,D L 0,D L 0,Dc Z`, plus hip lines `M a,0 L 0,Dc` and `M (W−a),0 L W,Dc`. The end faces are edge-on in a pure front view, so render a slight perspective to show them.
- **Side profile:** the same silhouette as 4.1: `M 0,0 L P,Dc L P,D L 0,D Z`.
- **Valance:** usually runs around all three sides `[S48]`.
- **Hip & ridge variant:** the ridge runs out from the wall (`(W/2,0,0)` to `(W/2,P−h,0)`) with a sloped hip face at the front end instead of a vertical gable. Front view looks like 4.10; side view is `M 0,0 L (P−h),0 L P,Hr …` `[S2]`.
- **Frame:** welded tube with hip rafters.
- **Covers:** fabric, vinyl, metal, standing seam `[S49]`.
- **Uses:** doors, windows, corner entries (inner-corner hipped door canopies exist with one hipped side) `[S50]`.
- **Lit?** Rarely; some metal door canopies have built-in LED spotlights `[S50]`.
- **Sizes:** *(design default)* like traditional. Factory door canopies run about 1.5–2.6 m wide and about 0.95 m deep `[S50]`.

### 4.12 Mansard

- **Aliases:** mansard awning, mansard canopy `[S6][S51]`.
- **What it is:** a French-style angled profile on four sides `[S6]`: a steep front face (and hipped returns) under a short flat cap, often with a fascia. It's common on formal commercial buildings `[S6]`.
- **Side profile:** with top cap depth `Pt` (0–0.3·P), steep face to drop `Dm`, and fascia `Vf`:
  `M 0,0 L Pt,0 L P,Dm L P,(Dm+Vf) L 0,(Dm+Vf) Z`
  Steepness: `Dm/(P−Pt) ≥ 1.7` (60° or more) *(design default)*.
- **Front elevation:** `M b,0 L (W−b),0 L W,Dm L W,(Dm+Vf) L 0,(Dm+Vf) L 0,Dm Z`, with `b ≈ P−Pt` for hipped returns.
- **Frame:** 1 in square structural aluminum, TIG-welded, shipped as a three-part frame. Optional soffit panels and front-edge valance; sides enclosed or open `[S51]`.
- **Covers:** metal roof panels (standing seam, color options) `[S51]`, metal-look fabric.
- **Uses:** storefronts, windows, stairway covers, door protection `[S51]`.
- **Lit?** Usually not; sometimes downlights in the soffit.
- **Sizes:** custom `[S51]`.

### 4.13 Barrel / cylinder (arched canopy, barrel vault)

- **Aliases:** barrel, barrel vault, arch canopy, round entrance canopy, round-top canopy, cylinder `[S4][S36][S37][S41]`.
- **What it is:** an arched (semicircular or segmental) roof whose curve is visible in the **front elevation**, with its axis running perpendicular to the wall (or along a walkway). The flat front nose is a showcase for graphics `[S4][S41]`.
- **3D:** an arch in the X–Z plane spanning W with rise `Ra`, extruded along Y from 0 to P. The spring line is at `Z = Ra`, with a side valance band `Ra…Ra+Vr`.
- **Front elevation:**
  - Semicircular (Ra = W/2) or elliptical: `M 0,Ra A (W/2),Ra 0 0 1 W,Ra L W,(Ra+Vr) L 0,(Ra+Vr) Z`
  - True segmental (Ra < W/2): `Rc = ((W/2)² + Ra²)/(2·Ra)`, then `M 0,Ra A Rc,Rc 0 0 1 W,Ra …`
- **Side profile:** `M 0,0 L P,s L P,(Ra+Vr+s) L 0,(Ra+Vr) Z`, spring line `M 0,Ra L P,(Ra+s)`, and arch ribs drawn as vertical lines at the rafter spacing.
- **Front end:** a closed arched "nose" panel (sign field) or an open end.
- **Frame:** bent arch bows on a wall frame. Front posts when P is over about 4 ft `[S4]`. Tensile versions are heavy-duty tubular steel with a PVC membrane, freestanding or wall-tied `[S36][S37]`.
- **Covers:** acrylic, vinyl, PVC tensile membrane, polycarbonate, metal.
- **Uses:** hotel, theater and residential entrances `[S41]`, long walkways `[S4]`, building links `[S37]`.
- **Lit?** Usually downlights underneath (NYC sidewalk canopies limit lighting to the underside) `[S16]`.
- **Sizes:** tensile barrel vaults from about 3–4 m wide and 3 m long, modular. Clear spans up to 15 m and more, with post centers 3.5–7.5 m `[S36][S37]`. NYC DOT sidewalk canopies are 4–10 ft wide `[S16]`.

### 4.14 Half-barrel (arched wall awning)

- **Aliases:** arched, half-barrel, arch awning `[S2][S52]`.
- **What it is:** a wall-mounted half-cylinder: the barrel profile (4.13) at awning scale, with no posts. The front shows a semicircular or segmental arch over the opening.
- **Geometry:** as in 4.13, with `Ra ≤ W/2`, P about 24–48 in *(design default)*, and an optional downward crown fall `s`.
- **Note:** "Quarter-barrel" is the convex/quarter-round profile (4.2), a quarter-cylinder seen from the side `[S6][S52]`. Use these terms in the engine: **quarter-barrel = 4.2, half-barrel = 4.14, barrel = 4.13.**
- **Frame / covers / uses:** as for barrel. It's often used over arched windows and doors, and high-end restaurant fronts `[S6]`.

### 4.15 Cone / round

- **Aliases:** half-cone, conical, umbrella, semi-polygonal, round marquee canopy, conic canopy `[S3][S41][S53][S54]`.
- **What it is (wall-mounted):** a half-cone whose apex is at the wall top center, with straight generator lines down to a semicircular bottom edge. The faceted version (flat panels between radial ribs) reads as "half an umbrella" `[S41]`.
- **3D:** apex `(W/2, 0, 0)`. Base curve in the plane `Z = Dc`: `X = W/2 + (W/2)·sin φ`, `Y = P·cos φ`, `φ ∈ [−90°, 90°]`. Faceted version: N facets (4–8, *design default*), with base vertices at evenly spaced φ.
- **Front elevation:** `M 0,Dc L (W/2),0 L W,Dc L W,D L 0,D Z`. For the faceted version, draw rib lines from `(W/2,0)` to each base vertex.
- **Side profile:** a straight slope, as in 4.1.
- **Plan:** a half-ellipse (smooth) or half-polygon (faceted), as in 4.4.
- **Freestanding conic canopy (tensile):** a single central column with a high center point and low perimeter. The fabric is tensioned from a constant edge height up to a point. Modules run 3–8 m square and can be joined. The edge is either a cable edge (scalloped between tension points) or a fixed edge with gutters `[S53][S54]`.
- **Covers:** acrylic or vinyl (wall cone); PVC-coated polyester or knitted shade cloth (tensile) `[S53][S54]`.
- **Uses:** decorative entries (wall); cafés, schools and playgrounds (tensile) `[S53]`.
- **Lit?** Tensile cones offer optional lighting and heating `[S53][S54]`.

### 4.16 Bay / multi-faceted bay

- **Aliases:** bay window awning, angled bay, faceted awning `[S29][S55]`.
- **What it is:** an awning that follows a projecting bay (or angled storefront) in plan. It's a set of traditional (or convex) facets mitered at the corners. Conservatory-style retractables also handle angled or rounded corners `[S56]`.
- **Plan of the bay head (wall line):** with center facet width `Wc`, side facet length `Ls` and bay angle `α`:
  `(0,0) → (Ls·cos α, Ls·sin α) → (Ls·cos α + Wc, Ls·sin α) → (2·Ls·cos α + Wc, 0)`
  Common bay angles are 30°, 45° and 90° (box bay) *(design default)*. The awning's front edge is this polyline offset outward by P, with mitered corners on the angle bisectors.
- **Each facet:** a 4.1 (or 4.2) section with the same P and Dc. The seams at the corners read like hip lines.
- **Front elevation:** a center panel `Wc` wide, flanked by side panels whose apparent width is `Ls·cos α` plus the offset. The valance runs continuously.
- **Multi-faceted (N facets):** the same construction over any polygonal bay. With many facets it approaches 4.4 or 4.5.
- **Frame / covers:** welded tube with fabric or metal. The roof-like "bay awning" over a bay window can also be built in wood with roofing *(different product class)* `[S55]`.
- **Lit?** No.

### 4.17 Wedge

- **Aliases:** wedge, closed wedge `[S26]`.
- **What it is:** a metal awning closed on both sides and at the front so it forms a crisp triangle. It's offered in copper or colored metal, with or without decorative scrolls `[S26]`.
- **Side profile *(inferred)*:** right triangle `M 0,0 L P,D L 0,D Z`, with a closed soffit along `Z = D`, no valance, and a sharp front edge (optional drip lip 0.5–1 in).
- **Front elevation:** rectangle W × D with no valance band; render metal sheen and seam lines.
- **Variants:** scroll brackets under the soffit `[S26]`.
- **Uses:** doors, windows, small storefront entries.
- **Lit?** No.

### 4.18 Flat canopy (metal)

- **Aliases:** flat canopy, metal canopy, hanger-rod canopy, wall-hung canopy, cantilever canopy, flat-panel door hood `[S23][S27][S57]`.
- **What it is:** a near-horizontal metal deck with a front fascia or gutter. It's either cantilevered from the wall or suspended by diagonal hanger rods.
- **Side profile:** deck thickness `T` (about 3–6 in), fascia height `F`:
  `M 0,0 L P,0 L P,F L 0,T Z`
  Hanger rod `M 0,−Hr L (P−e),0`, with `Hr ≈ 0.6–1.0·P` and `e ≈ 2–4 in` *(design default)*. Roof panels pitch at least 1/4 in per ft, draining to the fascia gutter `[S57]`.
- **Front elevation:** fascia band `M 0,0 H W V F H 0 Z`, plus rods as thin diagonals (in perspective) at their spacing.
- **Frame:** extruded aluminum (6063-T6) deck panels and fascia `[S57]`. Stainless (304) threaded hanger rods, 1/2–3/4 in diameter, powder-coated `[S27]`. Wall plate with clevis; rods typically about 10 ft apart `[S23]`.
- **Fascia sizes:** 6, 8, 10 and 12 in typical. Over 12 in needs an upper extension `[S23]`.
- **Covers:** aluminum interlocking pans, extruded deck `[S23][S57]`, aluminum composite panel `[S20]`.
- **Uses:** retail, restaurant, mixed-use and office entrances and storefront runs `[S27]`.
- **Lit?** Often has downlights in the soffit. Fascia-mounted letters are possible.
- **Sizes:** hanger-rod canopies typically project 4–8 ft `[S27]`. Without rods, about 2–3 ft typical `[S23]`. One spec table runs 4–9 ft projection, with allowable rod spacing dropping from 14'7" at 4 ft to 2'5" at 9 ft (at 20 psf / 90 mph) `[S57]`.

### 4.19 Marquee

- **Aliases:** marquee, theater marquee, hotel marquee. Fabric "marquee" in some catalogs means a gable or round entrance canopy `[S5][S45]`.
- **What it is:** a heavy, permanent, flat (or shallow-sloped) projecting canopy with a deep fascia. It often carries signage, changeable letters and lights. Supported only from the building (rods or chains) in NYC `[S11]`.
- **Side profile:** `M 0,0 L P,0 L P,F L 0,F Z`, with fascia `F ≤ 36 in` in NYC `[S11]`. An optional "crown" sign on top: in NYC, outside C6-5 and C6-7 districts, signs may rise no more than 48 in above and hang no more than 12 in below the marquee `[S9]`.
- **Front elevation:** a fascia band W × F with sign copy. Optional bulb rows (chaser lights).
- **NYC:** at least 10 ft above the sidewalk; no closer than 2 ft to the curb; only on certain occupancies (public buildings and schools, theaters, hotels, terminals, large department stores, supermarkets, multiple dwellings, office buildings, listed market areas) `[S11]`.
- **Lit?** Usually yes.

### 4.20 Entrance canopy (sidewalk canopy)

- **Aliases:** entrance canopy, sidewalk canopy, building canopy, round entrance canopy, gabled entrance canopy `[S4][S12][S16]`.
- **What it is:** a wall-attached canopy over a walkway, held up at the outer end by posts. The top is round (bowed) or gabled, with a flat front nose for name and logo `[S4][S12]`.
- **Side profile:** a long band. Crown line `M 0,0 L P,0`, side valance band `Ra…Ra+Vr`, post `M (P−e),(Ra+Vr) L (P−e),Hm` (to grade), plus intermediate posts on long runs.
- **Front elevation:** the 4.13 arch or 4.10 gable end, plus posts `M e,(Ra+Vr) V Hm` and `M (W−e),(Ra+Vr) V Hm`.
- **Frame:** light-gauge metal tube with canvas (historic NYC type) `[S12]`. NYC DOT uprights are steel pipe 1¼–3 in diameter in their own concrete footings; diagonal bracing only for wind, parallel to the curb, at most 18 in out `[S16]`.
- **Covers:** matte canvas (required at NYC landmarks) `[S12]`, acrylic, vinyl.
- **Lit?** Underside lighting is typical. NYC DOT allows underside-only lighting, no neon, and covered fluorescent bulbs `[S16]`.
- **Sizes (NYC DOT):** width no more than the entrance width and between 4 and 10 ft. Bottom of covering at least 8 ft and top at most 12 ft above the sidewalk. Runs from the building line to within 18–24 in of the curb face `[S16]`.

### 4.21 Freestanding / walkway canopy

- **Aliases:** freestanding canopy, patio canopy, covered walkway, walkway cover, shade structure `[S1][S2][S37]`.
- **What it is:** a roof on posts at both ends or sides, not attached to a building `[S1]`. The roof can be gable, hip, barrel or flat.
- **Geometry:** front elevation = the roof shape (4.10, 4.11, 4.13 or 4.18) on two or more posts. Side elevation = the roof band with posts at the post spacing.
- **Frame:** galvanized or powder-coated steel or aluminum posts; single or double rows of columns; optional gutters `[S36][S37]`.
- **Covers:** PVC-coated polyester, HDPE shade cloth, acrylic, metal, polycarbonate `[S36][S58]`.
- **Uses:** walkways between buildings, café seating, schools, parking `[S36][S37]`.
- **Lit?** Optional.
- **Sizes:** modules from about 3 m × 3 m; barrel-vault spans to 15 m and more; post centers 3.5–7.5 m `[S36][S37]`. Hip shade structures from 4 m (13 ft) squares, up to about 250 m² per canopy `[S58]`.

### 4.22 Retractable lateral-arm

- **Aliases:** retractable, lateral-arm, folding-arm, motorized awning, cassette awning (open-roll, semi-cassette, full-cassette) `[S1][S2][S5][S32][S33]`.
- **What it is:** fabric on a roller, pushed out by spring-loaded folding arms to a front (load) bar, usually with a loose valance. It's operated by crank, switch, remote, or sun/wind sensors `[S1]`.
- **Side profile (extended):** roller or cassette box at the wall, `M 0,0 H c V h H 0 Z` (*design default* c ≈ 8–12 in, h ≈ 6–13 in; one heavy-duty model's side profile is 13 in high × 12 in wide `[S34]`). Fabric line `M c,h/2 L P,(h/2 + drop)`, front bar as a small rectangle about 3 × 3 in, loose valance `M P,yf L P,(yf+Vs)`.
- **Pitch:** adjustable, often stated as 5–60% `[S32]`. A typical drop is about 1 in per ft of projection (8 ft → about 8 in, 12 ft → about 12 in) `[S38]`.
- **Arms:** two (or more on wide units) two-segment arms with elbows. Draw them as faint lines under the fabric.
- **Front elevation (extended):** a thin front bar across W with the loose valance band below. The underside isn't visible straight-on. **Retracted:** just the cassette box plus front bar and valance.
- **Covers:** solution-dyed acrylic (the norm), polyester; optional drop-down valance or mesh screens `[S33][S34]`.
- **Uses:** patios, decks, restaurants, café frontage `[S1][S32]`. LPC permits retractables on landmark storefronts `[S12]`.
- **Lit?** Optional LED arm strips or front-bar lights `[S32][S33]`.
- **Sizes:** widths about 9–40 ft. Standard projections 6'7", 8'2", 10'6", 11'6", 13'0" (one line); 6'11"–13'5" (another); heavy-duty 14'9"–16'6" and up to 20 ft `[S32][S33][S34][S35]`.
- **NYC:** storefront awnings may project at most 8 ft beyond the street line, frame at least 8 ft and flexible valance at least 7 ft above the sidewalk, and the awning box or cover no more than 12 in `[S10]`. Cap mockup projections at 8 ft for NYC street-line installs.

### 4.23 Standing-seam metal awning

- **Aliases:** standing seam, metal awning, metal canopy `[S23][S24][S59]`.
- **What it is:** an awning (usually a traditional slope, sometimes flat, hip or mansard) clad in standing-seam metal panels, with raised seams running down the slope.
- **Geometry:** use the 4.1 / 4.11 / 4.12 profiles, with a front fascia or gutter in place of a fabric valance. In front elevation, draw seam ribs every 16 in or 24 in across W. Rib height is about 1–1.5 in *(design default)*.
- **Frame:** 1 × 1 in or 1.5 × 1.5 in aluminum frames; optional trusses for open ends; powder-coated roof and underside panels `[S24]`. Supported by tie-backs or hanger rods beyond about 2–3 ft `[S23]`.
- **Covers:** Galvalume (aluminum-zinc coated steel) panels, 16 in or 24 in wide `[S24]`; painted aluminum.
- **Uses:** storefronts, office buildings, restaurants `[S24]`.
- **Lit?** Usually not; downlights are possible.
- **Sizes:** projection about 2–3 ft without hanger rods, more with them `[S23]`.

### 4.24 Metal louvered (sunshade)

- **Aliases:** louvered canopy, sunshade, sun-control device, louver awning; shutter-style louvered awning (fixed angled louvers) `[S29][S60]`.
- **What it is:** a flat (or slightly sloped) frame filled with spaced blades that cut sun while letting light and air through. It's hung on rods or cantilevered.
- **Side profile:** a front fascia (8, 10 or 12 in C-channel or J, or a smooth face) `[S60]`, a back channel at the wall, and blades drawn as small rectangles or airfoils along `Z ≈ F/2`, tilted 0–45°. Blade pitch is product-specific; 4–8 in looks right at storefront scale *(design default)*.
- **Plan:** parallel blades (usually parallel to the wall) between the side frames.
- **Frame:** all-extruded aluminum (6063-T6), 0.125 in fascia, 0.110 in extruded blades, hanger rod or cantilever supports `[S60]`.
- **Uses:** storefront glare control, curtain-wall accents `[S60]`. The shutter-style fixed louver is used at homes, shops, cafés and offices `[S29]`.
- **Lit?** No.
- **Sizes:** maximum projection 10 ft with hanger rods, 5 ft cantilevered (one pre-engineered line) `[S60]`. Shutter-style units come in standard widths up to 8 ft `[S29]`.
- **NYC:** "sun control devices" may project at most 2'6" beyond the street line, at least 8 ft above the sidewalk `[S11]`. A louvered *awning* may be classed differently; confirm with the applicant.

### 4.25 Spear awning (others found)

- **Aliases:** spear, scroll-arm, spear-arm `[S25][S61][S62]`.
- **What it is:** a fixed (or retractable) fabric awning, usually standard (straight) or convex, sometimes concave, with **open sides**. The front is supported by ornamental iron arms ending in a spear, ball or scroll finial `[S25][S61][S62]`.
- **Side profile:** the 4.1, 4.2 or 4.3 roof stroke plus an arm `M 0,A L (P+e),(Dc−e·tanβ)`, where the arm passes under the front bar and continues `e ≈ 4–8 in` to the finial *(design default)*.
- **Uses:** cafés, storefronts, historic homes `[S61][S62]`. **Lit?** No.

### 4.26 Dutch hood / bow Dutch canopy (others found)

- **Aliases:** Dutch canopy, Dutch hood, bow canopy, basket / folding canopy `[S63][S64]`.
- **What it is:** a quadrant-shaped canopy with closed, fan-shaped sides. It's made of hoops that pivot at a side hinge, so it can be fixed or fold up `[S63][S64]`.
- **Side profile:** a quarter disc centered at the hinge `(0,R)`: `M 0,R L 0,0 A R,R 0 0 1 R,R Z`, with hoop crease lines radiating from `(0,R)`.
- **Front elevation:** rectangle W × R with horizontal crease lines (pleats between hoops).
- **Sizes:** width 1–7 m, projection 0.6–1.5 m (one line) `[S63]`; up to 6000 mm long and 1800 mm projection (another) `[S64]`.
- **Uses:** shop fronts, cafés, hotels, salons; signwriting on the fabric is common `[S63][S64]`. **Lit?** No.

### 4.27 Clamshell (others found)

- **What it is:** a member of the dome family in at least one awning CAD system `[S45]`. It's a rounded, rib-split dome; vendor descriptions vary.
- **Geometry *(inferred)*:** the 4.4 dome with visible radial ribs, and fabric that may be lobed (scalloped) between the rib ends at the bottom edge.
- **Lit?** No.

### 4.28 Combination and extended styles (others found)

- **Box + center gable** (4.8 + 4.10b) `[S2]`, **extended gable traditional** (4.10c) `[S4]`, and **convex with domed ends** (= 4.5) `[S43]`. These are compositions of other shapes, not new primitives.

### 4.29 Shade sail (others found; not storefront)

- **What it is:** tensioned triangular (or four-sided) fabric between anchor points `[S2]`. It isn't a sign carrier; list it only if patios are in scope.

### 4.30 Glass / polycarbonate entrance canopy

- **Aliases:** glass canopy, tension-rod glass canopy, hanging glass canopy, under-supported (bracket) glass canopy `[S31][S65]`.
- **What it is:** a laminated safety-glass panel over an entrance. It's either hung from stainless tension rods anchored to the wall above, or carried on brackets from below `[S31][S65]`.
- **Side profile:** a thin plate `M 0,0 L P,s` with thickness about 0.5–0.7 in (12.76 mm or 16.76 mm laminated) `[S31]`. Rod `M 0,−Hr L (P−e),s` (hanging). Bracket version: a cantilever arm under the plate.
- **Front elevation:** a thin line or band at the top, with the glass mostly transparent; rods appear as diagonals in perspective.
- **Frame:** AISI 304 or 316 stainless fittings; Ø10–12 mm rods 1000–2000 mm long with turnbuckle ends `[S31][S65]`.
- **Sizes:** depth 900–1300 mm (about 3–4.3 ft). Under-supported glass tops out around 1.3 m; hanging systems can go deeper with a second rod row. Width 1400–3800 mm, ideally 400–500 mm wider than the door `[S31][S65]`.
- **Polycarbonate:** used on illuminated or "crown" structures with translucent vinyl applied to the second surface `[S28]`.
- **Lit?** Sometimes wall-washed or downlit; the glass itself isn't lit.

### 4.31 Backlit / illuminated (an attribute of many shapes)

- **Aliases:** backlit awning, illuminated awning, lighted awning, internally lit awning `[S5][S28][S30]`.
- **What it is:** any of box, waterfall, convex, traditional-with-sign-box (and sometimes dome or elongated dome), made with translucent vinyl over internal lights so the whole surface glows and the graphics read at night `[S28][S30]`.
- **Construction:** structural welded aluminum frames; damp-location high-output fluorescent or LED lighting; custom bottom closures (egg-crate grid) or an open bottom for service access `[S30]`. Fabric seams are welded `[S30]`.
- **Cover:** vinyl-laminated or extrusion-coated polyester "flex face" backlit fabric with a white backing `[S30][S66]`. Wide seamless widths are available, up to 16'4" `[S67]`. Light transmission is around 19–21% for one wide-width substrate `[S67]`.
- **Graphics:** eradication (removing the colored top coat to expose white or translucent), cut translucent film, or digital print with translucent UV/solvent inks `[S28][S30]`.
- **External lighting alternative:** an LED wash or light bar aimed at dimensional letters, or gooseneck lamps `[S28]`.
- **Render guidance:** brightest at the sign field, slight hot-spotting near lamp rows, visible seam lines, darker frame shadows (rafters) through the fabric. Dim the daytime look slightly to show a glossy vinyl sheen.
- **NYC:** the zoning allowance for lettering on awnings covers **non-illuminated** signs only `[S9]`. Lit awnings with copy fall under sign rules, need an electrical permit, and may need an annual illuminated sign permit `[S8]`. LPC landmark rules expect matte canvas `[S12]`. See section 7.

### 4.32 Other names seen in catalogs (no extra geometry needed)

"New look", "kitchen hood style", "standard bell", "extended bell", "bay window", "lighted" and "window" models appear in one manufacturer's rigid-awning list without drawings `[S68]`. A **bell (flared dome)** is probably a dome with an S-shaped flare toward the bottom edge *(inferred)*. "Victorian", "Regency" and similar names usually refer to valance cuts (section 5), not shapes.

---

## 5. Valance styles

**Construction types**

- **None (no valance).** Allowed on most styles `[S3][S51]`. The front edge is the bottom of the roof (or a front bar).
- **Rigid / hard / fixed valance.** Framed and part of D. It can carry graphics `[S4][S17]`.
- **Loose / soft / flexible valance.** Unframed and hangs free. In NYC it may hang lower than the frame (down to 7 ft clearance) `[S10]`. At NYC landmarks the skirt *must* be unframed and no more than 12 in `[S12]`.
- **Both (hard + soft).** A rigid band with a loose skirt below `[S17]`.
- **Binding / braid.** A decorative finishing strip along the cut edge, often in a contrasting color `[S4][S17][S39]`.
- **Heights.** 6–8 in standard; residential 6–7 in; commercial 8–10 in `[S17][S18]`. Some products set valance height by overall awning height (6 in for 16–24 in awnings up to 10 in for 58 in awnings) `[S69]`.

**Edge geometry (for SVG generation).** The valance band spans `y0…yb` (`yb = y0 + Hv`) across `0…W`. Pick a nominal period `p` and cut depth `h ≤ Hv`, then set `n = round(W/p)` and `p' = W/n` so the pattern ends symmetrically at both corners. *(design default)* `p ≈ 1.0–1.5·Hv`, `h ≈ 0.3–0.5·Hv`.

| Style (aliases) | Description | SVG recipe for the bottom edge (left to right) | Source |
|---|---|---|---|
| **None** | No skirt | n/a | `[S3]` |
| **Straight** (flat, plain) | Solid strip, no cuts. The most common style and the cheapest. | `M 0,y0 H W V yb H 0 Z` | `[S7][S13][S48]` |
| **Scalloped** (classic scallop, half-round) | Repeated downward round lobes. "Scallop" is also used loosely for *any* shaped edge. | `M 0,y0 V (yb−h)` then for each i `A (p'/2),h 0 0 0 x(i+1),(yb−h)`, then `V y0 Z` | `[S13][S70]` |
| **Wave / ocean wave** (large wave, small wave, soft wave) | Rounded lobes alternating with rounded notches | With `yc = yb − h/2`: `M 0,yc Q (p'/4),(yc+h) (p'/2),yc T p',yc T …` | `[S43][S48][S70][S71]` |
| **Serpentine** (low wave) | Smooth, low-amplitude sine | The wave recipe with small h (about 1–2 in) and a longer p | `[S7]` |
| **Classic / Parisian** (Parisienne) | Straight edge broken at intervals by rounded-triangle cutouts. Some shops use "classic" to mean straight, so confirm. | Straight edge with a notch every p': `L (xc−wn/2),yb Q xc,(yb−2h) (xc+wn/2),yb` (rounded V) | `[S7][S43][S48]` |
| **Flat-bottomed Parisian** (wave with flat bottom) | Flat-bottomed lobes separated by rounded notches | Flat segments at yb joined by short rounded notches up to `yb−h` | `[S43][S48][S71]` |
| **Bell / bell wave** | Bell-shaped lobes | Cubic lobes with flared shoulders: `C` with controls pulled outward at the top of each lobe | `[S70][S71]` |
| **Fancy wave** | Decorative wave with secondary curls | Wave plus a small inverted cusp in each notch | `[S70][S71]` |
| **French cut** | Named cut; geometry varies by shop | Get the shop's chart; treat as a fancy scallop | `[S70][S71]` |
| **Greek key / modified Greek key / Roman key** | Rectilinear stepped (meander-like) cuts | A square wave with an inner step: `H … V … H … V …` | `[S5][S43][S70]` |
| **Castle** | Crenellation (square tabs and notches) | Square wave: depth h, tab = notch = p'/2 | `[S71]` |
| **Houndstooth** | Stepped tooth motif | A stepped zigzag | `[S70]` |
| **Serrated** (pointed, saw-tooth, "dagger") | Pointed edges | Zigzag: `L (x+p'/2),yb L (x+p'),(yb−h)` | `[S13]` |
| **Regency (large/small), Continental, Contemporary, Ritz, Waldorf, Egyptian** | Named decorative cuts in one industry booklet's scallop chart | No public geometry. Treat as presets of wave/scallop/key. | `[S5]` |

Engine notes: on curved plans (dome, elongated dome, bay) the valance follows the bottom edge. Apply the `cos φ` foreshortening from 4.4 to the edge pattern in front view. The binding is a thin offset stroke (about 0.75–1 in, *design default*) following the cut edge.

## 6. Fabric patterns and cover materials

**Patterns**

- **Solid.** The default. NYC landmark storefront and residential awnings must be a solid color or vertical stripes that harmonize with the building's historic palette, avoiding visually jarring colors and patterns `[S12]`.
- **Stripes.** Classic awning stripes are woven into solution-dyed acrylic on 46 in rolls. Repeats vary by style, for example 3.75 in, 9.13 in and 11.16 in across the roll `[S72][S73][S74]`. A "6-bar" pattern repeats at 7.7 in `[S75]`, and a basic two-color block stripe at 4 in `[S76]`. Families include block (equal two-color bars), multi-bar, and thin pinstripes on a field `[S73][S75]`.
- **Orientation.** Stripes on awnings run from the wall to the front edge, down the slope. In front elevation they appear **vertical** (the "vertical stripes" in the LPC rule) `[S12]`. They continue through the valance. On domes they follow the gores (4.4). *(Convention; LPC is the documented basis.)*
- **Symmetry.** Center a stripe or a gap on the awning centerline and make the count across W symmetric *(design default)*.
- **Printed / graphic.** Lettering and logos painted, heat-sealed (RF-welded vinyl), cut-vinyl, eradicated or digitally printed `[S28][S30]`. At NYC landmarks: storefronts get lettering on the skirt only, not on the slope `[S12]`; residential awnings get only the address number (6 in maximum) `[S12]`.

**Cover materials (for render presets)**

| Cover | Look | Notes | Source |
|---|---|---|---|
| Woven solution-dyed acrylic canvas | Matte, soft woven texture, slight translucency against light | 46 in rolls, so seams fall about every 46 in less hems; double-faced; breathable | `[S72][S73]` |
| Vinyl-laminated / coated polyester | Semi-gloss to gloss, smooth | Heat-welded seams; opaque awning vinyl or translucent backlit grades | `[S5][S30][S66]` |
| Translucent backlit vinyl ("flex face") | Glossy by day, glows evenly at night | Wide seamless widths (up to 16'4"), white backing | `[S30][S67]` |
| Vinyl-coated mesh / shade cloth | Perforated, see-through at an angle | Shade structures and sails | `[S5][S54]` |
| PVC-coated polyester tensile membrane | Smooth, taut, HF-welded panels | Barrel vaults, cones | `[S36][S53]` |
| Metal (aluminum, Galvalume, copper) | Painted, powder-coated or natural copper; standing seam ribs or flat pan | Seams and ribs every 16–24 in for standing seam | `[S24][S26]` |
| Laminated glass | Transparent, thin edge, stainless fittings | 12.76 or 16.76 mm laminated | `[S31]` |
| Polycarbonate | Clear or tinted; can carry translucent vinyl on the second surface | Crowns, lit features | `[S28]` |

## 7. NYC considerations

Sources are primary (NYC codes and agency pages) unless noted. Rules change, so the engine should show these as **warnings with a "verify with your applicant or expediter" note**, not as hard blocks.

**7.1 Building Code, Chapter 32 (encroachments into the public right-of-way)**

- **Storefront awnings (§3202.2.3.1):** may project **no more than 8 ft beyond the street line**. **No part may be less than 8 ft above the sidewalk**, except a **flexible valance**, which may be as low as **7 ft**. The **awning box or cover may project no more than 12 in** `[S10][S11]`. Chapter 32 was amended by Local Law 77 of 2023 (effective June 10, 2023) `[S10]`.
- **Awnings over windows or doors (§3202.2.3.2):** **no more than 5 ft** beyond the street line, with **no part below 8 ft** `[S11]`.
- Awnings must be built per §3105 and be **supported entirely from the building** to use these allowances `[S11]`.
- **Marquees (§3202.2.1.4):** building-supported only; **at least 10 ft** above the sidewalk; **no closer than 2 ft to the curb**; thickness and fascia **no more than 3 ft**; only on listed occupancies. The applicant also needs proof that DOT, Consumer Affairs and DEP haven't permitted conflicting under-sidewalk uses `[S11]`.
- **Related projections:** sun control devices no more than 2'6" (at least 8 ft high); light fixtures no more than 2 ft (at least 8 ft high); wall signs no more than 12 in; projecting signs no more than 10 ft (at least 10 ft high, no closer than 2 ft to the curb), with listed streets where permanent projecting signs are banned `[S11]`.
- **Drainage:** water from a roof, awning, canopy or marquee (other than canvas or flexible material) must not flow over a public walking surface `[S11]`.

**7.2 Zoning Resolution (signs on awnings)**

- **ZR §32-653(a):** **non-illuminated** signs may go on awnings or canopies permitted by the Administrative Code, with **no more than 12 sq ft of surface area** and **letters no taller than 12 in**. Commercial copy is limited to the **name or address of the building or establishment** `[S9]`. The manufacturing-district equivalent is §42-542 `[S77]`.
- **ZR §32-652:** in most commercial districts, signs may project across the street line at most **18 in (double- or multi-faceted)** or **12 in (all other signs)**. C6-5, C6-7 and C7 allow up to 8 ft (§32-651) `[S9][S78]`.
- **DOB guidance:** awnings may project up to 8 ft, but they're limited to the business name and address in letters no taller than 12 in, totaling no more than 12 sq ft. **Awnings with text or images beyond those limits become signs** and are subject to all sign rules `[S8]`.
- **Practical effect (our reading; verify):** a fully lettered, logo-heavy or **backlit** awning projecting feet over the sidewalk is a sign. In most commercial districts a sign may project only 12–18 in, so that design usually can't be permitted as drawn. The mockup should warn when (a) the awning is lit and carries copy, (b) letter height is over 12 in, (c) copy area is over 12 sq ft, or (d) the copy goes beyond name and address (phone numbers, product lists, taglines).
- Residential districts are much more restrictive for accessory signs `[S8]`.

**7.3 Permits and enforcement**

- **Awning permit:** a DOB Alteration Type 3 (ALT3) permit. General contractors may install awnings, and the awning must meet the zoning text limits `[S8]`.
- **Signs:** a sign (SG) permit plus an ALT3 for the structure. An **electrical permit** for any wired sign, and an **annual illuminated sign permit** for signs that are illuminated and extend beyond the building line `[S8]`.
- **Local Law 15 of 2026:** DOB won't issue work-without-permit (and related) violations from Feb 9, 2019 through **Feb 8, 2028** for accessory signs that existed on or before **Feb 9, 2025**, unless there's an imminent hazard. This **doesn't make noncompliant signs lawful**. There's also a civil-penalty waiver for accessory signs up to 150 sq ft and 1,200 lb, and fee waivers and assistance through Aug 7, 2028 `[S79][S77]`. Earlier awning-specific grace periods date back to Local Law 44 of 2003 and Local Law 35 of 2004 `[S81][S82]`.

**7.4 Landmarks (LPC), for landmarks and historic districts**

- Storefront awnings must **project at an angle** (sloped), sized to the storefront. They can't be longer than the opening, edges align with the inside face of the piers, and the underside is open with **no "ceiling"**. The lowest framed part is at least 8 ft and the lowest unframed part (skirt) at least 7 ft above the sidewalk. The skirt is **unframed, no more than 12 in**. **Lettering goes on the skirt only**, sized to it. Covers are **matte canvas** (or similar texture) in a **solid color or vertical stripes** `[S12]`.
- Install at the top of the storefront opening or at the transom (or just above it in limited cases). Don't obscure historic transoms or decorative features. Fixed or retractable both work; integral historic housings must be restored `[S12]`.
- **Individual landmarks:** a fixed awning must be a **lean-to frame** (open sides, no perpendicular top-to-side bar), with a round side bar and a gray finish `[S12]`.
- **Residential awnings:** address numbers no taller than 6 in over the entrance; no other lettering `[S12]`.
- **Sidewalk canopies:** a **bowed profile** (or one relating to the opening if there's precedent); at least 8 ft high; open underside; matte canvas; round metal poles. Building or institution name and address in letters under 12 in, plus a logo of no more than **4 sq ft** on the street-facing end `[S12]`.
- **Practical effect:** the waterfall, box, backlit, glossy vinyl and sign-box styles (4.7, 4.8, 4.9, 4.31) aren't staff-approvable at landmark addresses. The engine should flag them when the address is landmarked `[S12][S83]`.

**7.5 DOT sidewalk canopy rules (34 RCNY §2-04, Street Works Manual §3.4)**

- A DOT canopy permit is required, plus a one-time Street Opening Permit for the posts. The maintenance permit is renewed yearly, at least one month before it expires `[S14][S15][S16]`.
- **Width:** no more than the entrance width and between **4 and 10 ft**. **Height:** bottom at least **8 ft**, top at most **12 ft** above the sidewalk. **Length:** from the building line to within **18–24 in of the curb face**. **Fully roofed** `[S16]`.
- **Lettering:** at most **12 in** high, a **single horizontal line**, no more than **12 sq ft per side**. No advertising. Logo for identification only `[S16]`. No attachments (signs, banners, flags, balloons) `[S15]`.
- **Lighting:** underside only; no neon; fluorescent bulbs covered; nothing protruding below the covering `[S16]`.
- **Siting exclusions** include within 15 ft of hydrants or bus stops, corners and the 10 ft corner quadrant, under or obstructing fire escapes, within 5 ft of tree pits, 4 ft of street lights or utility covers, and 3 ft of parking meters. Some streets are partially or fully restricted (§2-04(f)) `[S16]`. Construction follows DOT Standard Detail H-1029 `[S15][S16]`.

**7.6 Outside NYC (tri-state context)**

- The NY State code (IBC-based) requires at least 7 ft clearance to the lowest part of any awning, *including valances*. Awnings, canopies, marquees and signs with less than 15 ft clearance may cover at most two-thirds of the sidewalk width. Stanchions must sit at least 2 ft in from the curb `[S84]`. NJ and CT municipalities use IBC-based codes plus local sign ordinances; check locally.

## 8. Suggested mockup-engine checks

These are warnings only; the thresholds come from section 7.

| Check | NYC trigger |
|---|---|
| Projection | Storefront P > 8 ft; window/door awning P > 5 ft; retractable box > 12 in |
| Clearance | `Hm − D < 8 ft` (framed) or `Hm − D − Vs < 7 ft` (flexible valance) |
| Copy limits | Letter height > 12 in; copy area > 12 sq ft; copy beyond name/address |
| Illumination | Lit (4.31) **and** has copy → "treated as a sign; needs SG + electrical + possibly annual illuminated sign permit" |
| Landmark address | Shape not sloped (4.7/4.8/4.9), vinyl/gloss cover, copy on the slope, skirt > 12 in or framed, non-solid/non-vertical-stripe pattern |
| Sidewalk canopy | W outside 4–10 ft; height outside 8–12 ft; copy not a single line ≤ 12 in |
| Marquee | Clearance < 10 ft; fascia > 3 ft |

## 9. Summary table

| # | Shape | Side-profile family | Usual sides | Usual cover | Usually lit? |
|---|---|---|---|---|---|
| 4.1 | Traditional / standard slope | straight slope | open or closed | acrylic, vinyl, metal | no |
| 4.2 | Quarter-round / convex (quarter-barrel) | quarter-ellipse (convex) | closed, flat | acrylic, vinyl | sometimes |
| 4.3 | Concave (inverted quarter-barrel) | quarter-ellipse (concave) | open or closed | acrylic, vinyl | rarely |
| 4.4 | Dome | quarter-sphere | n/a (curved) | acrylic, vinyl | occasionally |
| 4.5 | Elongated dome | convex + quarter-sphere ends | n/a | acrylic, vinyl | sometimes |
| 4.6 | Bullnose | alias of 4.5 (or 4.2) | n/a | n/a | n/a |
| 4.7 | Waterfall / curved front | flat top, radius nose, vertical face | closed | backlit vinyl, acrylic | often |
| 4.8 | Box / flat-front | rectangle | closed | backlit vinyl, acrylic | often |
| 4.9 | Traditional with sign box | slope + vertical box | closed | vinyl, acrylic | sometimes |
| 4.10 | Gable (A-frame, extended, gabled traditional) | ridge + eaves | gable end open or closed | acrylic, vinyl, metal | rarely |
| 4.11 | Hip (hip & ridge) | slope (3 sloped faces) | sloped ends | fabric, metal | rarely |
| 4.12 | Mansard | flat cap + steep face | hipped | metal panels | no |
| 4.13 | Barrel / cylinder / barrel vault | arch in front view | open or nose panel | acrylic, vinyl, PVC | downlights |
| 4.14 | Half-barrel (arched) | arch in front view, short P | as 4.13 | acrylic, vinyl | no |
| 4.15 | Cone / round (half-cone, umbrella, tensile cone) | straight slope / cone | n/a | fabric, PVC | optional |
| 4.16 | Bay / multi-faceted bay | slope per facet | mitered | fabric, metal | no |
| 4.17 | Wedge | triangle, closed soffit | closed | metal | no |
| 4.18 | Flat canopy (metal) | flat deck + fascia | n/a | aluminum | downlights |
| 4.19 | Marquee | deep flat box | n/a | metal | yes |
| 4.20 | Entrance (sidewalk) canopy | long band on posts | open | canvas, acrylic | underside |
| 4.21 | Freestanding / walkway canopy | roof on posts | open | PVC, fabric, metal | optional |
| 4.22 | Retractable lateral-arm | thin pitched sheet | open | acrylic | optional LED |
| 4.23 | Standing-seam metal | slope / flat / hip | open or closed | Galvalume, aluminum | rarely |
| 4.24 | Metal louvered (sunshade) | flat frame + blades | open | aluminum | no |
| 4.25 | Spear | slope/convex/concave + iron arms | open | acrylic | no |
| 4.26 | Dutch hood / bow Dutch | quarter disc (fan) | closed fan | acrylic, polyester | no |
| 4.27 | Clamshell | dome with ribs | n/a | fabric | no |
| 4.28 | Combination / extended styles | compositions | varies | varies | varies |
| 4.29 | Shade sail | tensioned planes | n/a | shade cloth | no |
| 4.30 | Glass / polycarbonate canopy | thin plate + rods | n/a | laminated glass | no |
| 4.31 | Backlit / illuminated | attribute on 4.2/4.4/4.5/4.7/4.8/4.9 | closed | translucent vinyl | yes |
| 4.32 | Other catalog names (bell, kitchen hood, new look) | see note | n/a | n/a | n/a |

---

## 10. Sources

Internal only. These links and names must not appear in shipped UI or copy.

**Industry associations, booklets and CAD references**

- [S1] Professional Awning Manufacturers Association (PAMA): Awning Types & Styles. https://awnings.textiles.org/resources/commercial-awning-styles/
- [S5] "All About Awnings" industry booklet (PDF, via Sweets / construction.com): design considerations, Diagram 1 (awning designs), Diagram 2 (scallop styles), materials, loads. http://sweets.construction.com/swts_content_files/151604/273963.pdf
- [S45] Autometrix Help Center, Eclipse terminology (dome / long dome / clamshell, convex and straight waterfall, traditional, marquee). https://help.autometrix.com/software/eclipse/manual/terminology

**Fabricator style pages and booklets**

- [S2] Manchester Awning: 13 Awning Styles. https://www.manchesterawning.com/awning-styles/
- [S3] American Awning (ABC): Window & Door Awnings booklet (PDF). https://www.americanawningabc.com/wp-content/uploads/2022/06/AAABC-Window-_-Door.pdf
- [S4] Awning Concepts (St. Louis): Shapes. https://www.awningsstl.com/shapes
- [S6] AAA Awning Co.: Awning Shapes & Styles. https://aaaawning.net/awnings-canopies/shapes-styles
- [S7] New Awning: Awning Valance Styles. https://newawning.com/awning-valance-styles/
- [S13] M&M Awning: Awning Valance. https://mmawning.com/awning-valance/
- [S17] Tropical Jalousie & Shutters: Awning Spec / sizing guide (PDF). https://www.tropicaljs.com/wp-content/uploads/2020/08/Awning-Spec.pdf
- [S18] Awntech: Fixed Awning Measuring Guide (PDF). https://cdnimages.opentip.com/Docs/AWN/awntech-fixed-awning-measuring-guide-v1.pdf
- [S38] 1800Awnings: How to Measure for Your Awning. https://1800awnings.com/pages/how-to-measure-awnings
- [S39] Hendee: How to Measure for Awnings (PDF). https://www.hendee.com/wp-content/uploads/2024/03/how_to_measure_for_awnings.pdf
- [S40] 1800Awnings measuring guide (shape-specific measuring notes; same page as S38). https://1800awnings.com/pages/how-to-measure-awnings
- [S41] Carroll Architectural Shade: Custom Awnings and Awning Styles; Choosing the Best Awning Styles. https://www.carrollarchitecturalshade.com/custom-awnings-and-awning-styles/ and https://www.carrollarchitecturalshade.com/choosing-the-best-awning-styles-for-your-needs/
- [S42] OBA (Australia): canvas canopy awning options (bullnose). https://obaau.com.au/spoilt-for-choice-with-6-canvas-canopy-awning-options/
- [S43] Four Seasons Awning: Awning Shapes and Styles, Convex. https://www.fourseasonsawning.com/materials/canvas-fabric-awning-canopy-material-pages/awning-shapes-and-styles/awning-shapes-and-styles-convex/
- [S44] New Haven Awning: Different Types of Fixed Awnings (dome / half round). https://www.nhawning.com/different-types-of-fixed-awnings/
- [S46] Aurora Window Furnishings: Convex Canopy Heritage Awnings. https://aurorawindowfurnishings.com.au/product/awnings/heritage-awnings/convex-canopy-heritage-awnings/
- [S47] Kreider's Canvas: flat panel door hood / storefront awning projects. https://www.kreiderscanvas.com/project/care-atc-flat-panel-doorhood-awning
- [S48] Four Seasons Awning: Awning Shapes and Styles, Hipped. https://www.fourseasonsawning.com/materials/canvas-fabric-awning-canopy-material-pages/awning-shapes-and-styles/awning-shapes-and-styles-hipped/
- [S49] Camel Custom Canvas: The Hip awning. https://camelcanvas.com/awnings/residential/the-hip/
- [S50] Canopy Superstore: inner-corner hipped canopy with LED spotlights. https://www.canopysuperstore.co.uk/hipped-inner-corner-canopy-with-led-spotlights.html
- [S51] Americana: Mansard Awnings brochure (PDF). https://americana.com/brochures/mansard.pdf
- [S52] Evans Awning: quarter- and half-barrel awnings. https://www.evansawning.com/gallery/barrel-style-awnings
- [S55] Mannlee: Bay Window Awning. https://mannleeco.com/product/bay-window-awning
- [S61] Marine Awning (AAwnings of Distinction): Spear Awnings. https://www.awningsofdistinction.com/spear-awnings
- [S62] Superior Awning: Spear or Scroll Awnings. https://superiorawning.com/spear-awnings/
- [S68] Auvents Polo: door and window awnings, rigid awning shapes list. https://www.auventspolo.com/en/commercial-industrial/door-and-window-awnings/
- [S69] General Awnings: fixed window/door awning (valance height by awning height). https://www.generalawnings.com/window-awnings-c-81/fabric-c-142/new-yorker-window-door-awning-p-234
- [S70] Bluegrass Awning: Awning Valances. https://www.bgawning.com/technical/awning-valances/
- [S71] Awnings Above: Valances. https://awningsaboveus.com/awnings-atlanta-ga/valances/

**Product and spec sheets (frames, metal, retractable, glass, backlit)**

- [S19] Parasol Awnings: Section 10530 spec (frames, welds, rafter spacing) (PDF). https://parasolawnings.com/wp-content/uploads/2023/10/Parasol-Specs-Standing-Seam-Awning-Canopy-2023-10.pdf
- [S20] MASA Architectural Canopies: aluminum awning master spec (PDF). https://www.architecturalcanopies.com/wp-content/uploads/2015/12/AlumiframeSpec1.pdf
- [S21] Coastal Canvas: awning spec Section 107313 (PDF). https://www.coastalcanvas.com/pdfs/awning-specification-section-107313.pdf
- [S22] Trivantage: 10536 awning specifications, staple-in steel tubing (PDF). https://www.trivantage.com/itemfiles/pdfs/tds/GatorStitch_Specifications.pdf
- [S23] G&J Awnings & Canvas: Metal Canopy (fascia sizes, projections, hanger rods). https://gjawning.com/metal-canopy/
- [S24] MetalAwnings.com: Standing Seam Awnings. https://metalawnings.com/products/standing-seam-awnings
- [S25] Awntech: spear-arm fixed awning (concave). https://awntech.com/products/large-new-orleans-awning
- [S26] Design Your Awning: Wedge Style Awning. https://designyourawning.com/pages/wedge-style-awning-gallery
- [S27] Jackson Williams: Hanger Rod Canopies. https://jacksonwilliams.com/products/canopies-hanger-rod/
- [S28] ViewPoint Sign and Awning: Backlit / Illuminated Awnings portfolio. https://viewpointsign.com/portfolio/backlit-illuminated-awnings/
- [S29] Awntech: shutter-style fixed louvered awning. https://awntech.com/products/bahama-awning
- [S30] Awning Works Inc.: Backlit Awnings. https://www.awningworksinc.com/awnings-canopies/fixed-awnings-and-canopies/backlit-awnings/
- [S31] Strofix: hanging and under-supported glass canopies (kits, sizes, rods). https://strofix.com/en/hanging-glass-canopy-with-2-rods-900-1100.html , https://strofix.com/en/glass-canopies/undersupported/glass-canopy-on-3-supports-1200.html , https://strofix.com/en/glass-canopies/hanging/
- [S32] 1800Awnings: full-cassette retractable product page (widths, projections, LED). https://1800awnings.com/products/zeus-shademaker-retractable-awning
- [S33] Polar Shades: open-roll retractable specs (projections, pitch range, LED). https://polarshade.com/products/retractable-awnings/select
- [S34] Alutex: heavy-duty lateral-arm specs (projections to 20 ft, side dimensions). https://alutex.com/madera-giant/
- [S35] Rainier Shade: commercial retractable specs (projections to 16'6"). https://rainiershade.com/retractable-awnings/summit-retractable-awning/
- [S36] ArcCan: barrel vault entrance canopy and covered walkway. https://www.arccan.com/products/landsdowne-entrance-canopy/ and https://www.arccan.com/products/epsom-covered-walkway/
- [S37] Streetspace: barrel vault fabric canopies (spans, post centers). https://streetspacestructures.co.uk/products/barrel-vault-fabric-canopies/
- [S53] Streetspace: conic fabric canopies. https://streetspacestructures.co.uk/products/conic-fabric-canopies/
- [S54] ArcCan: square conic canopy (sizes, fabrics). https://www.arccan.com/products/goodwood-square-conic-canopy/
- [S56] Brustor: conservatory awning for angled or rounded corners. https://www.brustor.com/en-us/products/product-types/conservatory-awnings/b127
- [S57] Queen City Awning: wall-hung (hanger rod) canopy spec sheet (PDF). https://www.queencityawning.com/HangerRodSpecs.pdf
- [S58] Shade Systems Global: hip shade structure. https://shadesystemsglobal.com/products/shade-structures/hip-shade/
- [S59] Kreider's Canvas: flat panel storefront awning. https://www.kreiderscanvas.com/taupe-store-in-lancaster-flat-panel-storefront-awning
- [S60] Mapes (via Design Components): aluminum louvered sunshade spec (PDF). https://designcomponents.com/wp-content/uploads/2026/04/DCI-Canopies-Aluminum-Super-Shade.pdf
- [S63] Access Awnings: bow Dutch canopy. https://www.accessawnings.com/commercial-awnings/bow-dutch-canopy-commercial-awning/
- [S64] Shade Systems (Melbourne): Dutch hood canopy. https://www.shadesystems.com.au/product/dutch-hood-canopy/
- [S65] Strofix: glass canopy types and installation (supported vs hanging limits). https://strofix.com/en/blog/post/glass-canopy-over-the-building-entrance-its-functions-and-types
- [S66] Backlit eradicable vinyl awning fabric data sheet (16 oz). https://sfsupplies.com/cooley-brite-lite-eradicable-vinyl-awning-fabric-royal-blue-78-16oz-awfcbl06
- [S67] Wide-width backlit flexible substrate data (widths to 16'4", light transmission). https://kgsupplies.com/arlon-dpf-390-wide-width-backlit-substrate/
- [S72] Solution-dyed acrylic awning stripe data (46 in, 9.13 in repeat). https://www.fabriconsales.com/sunbrella-awning-stripe-4921-0000-mediterranean-canvas-block-46-fabric/
- [S73] Solution-dyed acrylic awning stripe data (3.75 in repeat). https://www.outdoorfabr.com/sunbrella-awning-stripe-4987-0000-cooper-navy-46-fabric/
- [S74] Solution-dyed acrylic awning stripe data (11.16 in repeat). https://www.outdoorfabr.com/sunbrella-awning-stripe-4884-0000-saxon-cascade-46-fabric/
- [S75] 6-bar awning stripe data (7.7 in repeat). https://ennisfabrics.com/products/sunbrella-5700-stripes
- [S76] 4 in two-color awning stripe fabric. https://fabricwarehouse.com/awning-stripe-in-black-and-ivory-outdoor-waterproof-upholstery-fabric-4-stripes-54-wide-by-the-yard-1
- [S85] General Awnings: aluminum window awning with angled side panels (projections 22–50 in without posts, drop about 1/2 window height, width at least 4 in over the window). https://www.generalawnings.com/window-awnings-c-81/brookside-window-awning-with-angled-side-panels-p-267

**NYC primary sources**

- [S8] NYC DOB: Accessory Business Sign webinar (awning signage, permits). https://www.nyc.gov/assets/buildings/pdf/accessory_business_sign_webinar.pdf
- [S9] NYC Zoning Resolution §32-60 sign regulations (incl. §32-652, §32-653) (print PDF). https://zoningresolution.planning.nyc.gov/print/pdf/node/17861 and https://zoningresolution.planning.nyc.gov/article-iii/chapter-2/32-653
- [S10] NYC Building Code §3202.2.3.1 Store Front Awnings (UpCodes). https://up.codes/s/store-front-awnings
- [S11] NYC Building Code 2022, Chapter 32 Encroachments into the Public Right-of-Way (UpCodes), incl. §3202.2.3.2 and §3202.2.1.4 marquees. https://up.codes/viewer/new_york_city/nyc-building-code-2022/chapter/32/encroachments-into-the-public-right-of-way and https://up.codes/s/awnings-over-windows-or-doors
- [S12] NYC LPC Permit Guidebook, Chapter 4: Awnings and Sidewalk Canopies (PDF). https://www.nyc.gov/assets/lpc/downloads/pdf/LPCPermitGuidebook_Chapter4_Awnings.pdf
- [S14] NYC DOT: Street Works Permits (canopy authorizations). https://nyc.gov/html/dot/html/infrastructure/permits.shtml
- [S15] NYC Street Works Manual §3.4: Canopy Authorizations and Permits. https://streetworksmanual.nyc/chapter-three/canopy-authorizations-permits
- [S16] 34 RCNY §2-04 Canopies (NYC Highway Rules, American Legal). https://codelibrary.amlegal.com/codes/newyorkcity/latest/NYCrules/0-0-0-61303
- [S77] Local Law 15 of 2026 text (references ZR §32-653(a) and §42-542(a)). https://intro.nyc/local-laws/2026-15
- [S78] NYC BSA Sign Analysis form, commercial districts (projection summary). https://www.nyc.gov/assets/bsa/forms/sign-calc-form.pdf
- [S79] NYC DOB: Accessory Sign Education & Outreach (Local Law 15 of 2026). https://www.nyc.gov/site/buildings/safety/sign-ll15of2026.page
- [S81] Local Law 44 of 2003 (awning violation grace period) (PDF). https://www.nyc.gov/html/dob/downloads/bldgs_code/locallaw44of03.pdf
- [S82] Local Law 35 of 2004 (awning grace period extension) (PDF). https://www.nyc.gov/assets/buildings/local_laws/locallaw35of04.pdf
- [S83] NYC LPC Permit Guidebook (full). https://www.nyc.gov/assets/lpc/downloads/pdf/LPC-Permit-Guidebook.pdf
- [S84] Building Code of New York State 2025, Chapter 32 (UpCodes). https://up.codes/viewer/new_york/ibc-2024/chapter/32/encroachments-into-the-public-right-of-way

**Other**

- San Francisco Planning, Awnings, Canopies and Marquees handout (not used for NYC rules; a useful comparison of how cities cap projection and drop). https://archives.sfplanning.org/documents/8575-Awnings_Canopies_&_Marquees_Handout.pdf
