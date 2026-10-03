# Adding a category to the sign mockup tool

The mockup tool at `/tools/sign-mockup/` shows one tab per category: **Signs**, **Awnings**, **Vinyl & Stickers**, **Construction Signs**, **Interior Wayfinding**, **ADA & Code Signs**, and **LED Displays**.

A category is **one JavaScript module** plus **one line in the registry**. The engine (the editor, the 3D renderer, day/night lighting, the PDF, the phone approval page, the approval-link server, pricing and the checks) reads everything it needs from the module. It never names a category, so you do not edit engine files. `npm test` checks this and fails if an engine file mentions a category.

Follow the steps in order. Each one says exactly which file to touch.

---

## 0. Files you will touch (and the ones you won't)

| Touch | File | What it is |
| --- | --- | --- |
| **yes** | `tools/sign-mockup/js/categories/<id>.js` | Your category module (new, or replacing a coming-soon file). |
| **yes** | `tools/sign-mockup/js/categories/index.js` | The registry: one import and one entry in `CATEGORIES`. Only if the tab is new. |
| optional | `tools/sign-mockup/js/categories/<id>/…` | Helper files if your module gets long: types, diagrams, custom render rules. |
| optional | `README.md` | One line in the categories list. |
| **no** | everything else in `tools/sign-mockup/js/`, `proof/`, `netlify/` | The engine. Leave it alone. |

The shared building blocks you **import** (but don't edit):

| File | Gives you |
| --- | --- |
| `js/categories/define.js` | `defineCategory()`: fills in defaults for anything you leave out. `comingSoon()`: placeholder tabs. |
| `js/diagram-kit.js` | `card()`, `Svg` and `PALETTE`, for drawing the "How it's built" cards (320 × 200 SVG). |
| `js/kinds.js` | Ready-made construction kinds: `letters`, `cabinet`, `blade`, `panel`, `neon`, `flat`. |
| `js/lighting.js` | The lighting keys: `none`, `face`, `halo`, `internal`, `external`, `backlit`, `neon`, … |
| `js/kit.js` | The build kit, for custom render rules (step 9; most categories don't need it). |

---

## 1. Pick the id, label and noun

- **id**: lowercase letters, digits and dashes (`construction`, `led`). It is stored in approval links, so **never change it** after it ships.
- **label**: the tab text (`"Construction Signs"`).
- **noun**: what the user places, lowercase and singular (`"construction sign"`). The UI builds its sentences from it: "Choose and place the construction sign", "Construction sign mockup for approval", "Approx. construction sign size".

If the category already has a coming-soon file (`vinyl.js`, `construction.js`, `wayfinding.js`, `ada.js`, `led.js`), **keep its file name and id** and replace the file's contents in step 2. The registry entry is already there, so you skip step 7.

## 2. Create the module from the example

Copy the example module below into `tools/sign-mockup/js/categories/<id>.js`, then change it in steps 3 to 6.

<!-- example:start -->
```js
// Construction Signs: printed boards and panels for job sites.
import { defineCategory } from "./define.js";
import { card, PALETTE as C } from "../diagram-kit.js";

// "How it's built" cards, one per type id. The wall face is at x = 44; label rows run 20–180.
const DRAW = {
  "site-board"(s) {
    s.wall();
    s.rect(44, 30, 5, 140, "#f4f6f8", C.ink, 1);
    s.rect(49, 30, 2, 140, C.paint);
    s.circle(46.5, 50, 2, C.metal).circle(46.5, 150, 2, C.metal);
    s.label("Aluminum composite board, about 1/4\" thick", 47, 90, 40)
      .label("Printed face, laminated", 50, 120, 90)
      .label("Screwed through to the fence or wall", 46.5, 150, 140);
    return "Section";
  },
  "project-panel"(s) {
    s.wall();
    s.rect(50, 40, 4, 120, "#f4f6f8", C.ink, 1);
    s.rect(54, 40, 2, 120, C.paint);
    for (const y of [56, 144]) s.rect(44, y - 2, 10, 4, C.metalLight).circle(56, y, 2.6, C.metal);
    s.label("Standoff caps", 56, 56, 34)
      .label("Printed panel, about 1\" off the wall", 52, 100, 92)
      .label("Standoff barrels into anchors", 47, 144, 150);
    return "Section";
  },
};

export default defineCategory({
  id: "construction",
  label: "Construction Signs",
  noun: "construction sign",
  title: "Choose a construction sign",
  intro: "Printed boards and panels for job sites. The drawings are sections, not to scale.",
  groups: [{ id: "boards", label: "Boards and panels" }],
  types: [
    {
      id: "site-board",
      group: "boards",
      name: "Site board",
      lighting: "none",
      summary: "A large printed board screwed flat to the fence, hoarding or wall: project name, rendering and team.",
      parts: ["Aluminum composite board", "Printed, laminated face", "Screws through to the fence or wall"],
      render: { kind: "panel", gap: 0, thick: 0.25 },
      options: ["panel"],
    },
    {
      id: "project-panel",
      group: "boards",
      name: "Project information panel",
      lighting: "none",
      summary: "A printed panel on standoffs with the owner, architect, contractor and permit details.",
      parts: ["Aluminum composite panel", "Printed, laminated face", "Four standoffs into wall anchors"],
      render: { kind: "panel", gap: 1, thick: 0.25, standoffs: true },
      options: ["panel"],
    },
  ],
  diagram: type => card(type, DRAW[type.id]),

  // Each type's row in js/pricing-config.js, where every price number lives.
  pricing: {
    row: {
      "site-board": "panel-flat",
      "project-panel": "panel-flat",
    },
  },
});
```
<!-- example:end -->

This example is complete: once registered, it works in the editor, the night view, the PDF and approval links. `npm test` loads this exact block and checks it, so it stays correct.

## 3. Write the types

Each entry in `types` is one card in the library. Every field:

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | yes | Lowercase, unique across **all** categories (prefix it if unsure, e.g. `led-ticker`). Stored in approval links. |
| `group` | yes | The id of one of your `groups`. Every group must have at least one type. |
| `name` | yes | Card title, PDF and proof page. |
| `lighting` | yes | A key from `js/lighting.js`. Use `"none"` for anything that isn't lit. |
| `summary` | yes | One or two plain sentences. |
| `parts` | yes | At least 3 short strings: what it is made of. |
| `render` | yes | `{ kind, …settings }`, see step 4. |
| `options` | no | Which built-in option fields to show (see step 6). `[]` shows none. |
| `aspect` | no | Height ÷ width used when it is first placed, for types whose shape doesn't come from the artwork. |
| `pinHint` | no | A tip shown above the text box, e.g. which corners to pin. |
| `notice` | no | A notice shown under the options (rules to verify, etc.). Keep it factual. |

## 4. Pick a construction kind (render rules)

`render.kind` picks how the type is built in the photo. You get 3D depth, shadows, night lighting and the flat-artwork page in the PDF without writing render code.

| kind | Use it for | `render` settings (inches) |
| --- | --- | --- |
| `panel` | Flat boards and panels, flush or on standoffs, optional gooseneck lamps | `gap` (off the wall), `thick`, `standoffs: true`, `lamps: true` |
| `cabinet` | Boxes with a printed or routed face (light boxes, LED display cabinets) | `depth`, `gap`, `frame` (border width), `frameColor`, `face: "routed"`, `push` |
| `blade` | Double-sided signs that stick out from the wall | `thick`, `arm` (gap to the wall), `bracket: true`, `lit: true`, `frameColor` |
| `letters` | Cut-out letters with depth (channel letters, flat-cut letters) | `depth`, `gap`, `returns` (`"art"`, `"art-dark"` or `"#hex"`), `trim`, `trimColor`, `halo`, `sidesLit`, `face: "open"`, `tube`, `raceway: { depth, height }` |
| `neon` | LED neon line on a clear backer | `gap`, `thick`, `tube` |
| `flat` | Vinyl or paint straight on the surface: no depth | `surface: "glass"` (window) or `"wall"` (takes the wall's texture) |

Lit kinds glow at night when the type's `lighting` is lit: for example `cabinet` with `lighting: "internal"`, or `panel` with `lamps: true` and `lighting: "external"`.

To see how each kind looks, find the sign type that uses it in `js/categories/signs/types.js` and copy its `render` values as a starting point. For example, `lightbox` is a `cabinet` and `vinyl` is a `flat` on glass.

## 5. Draw the "How it's built" cards

Every type needs a card. Use the pattern in the example: a `DRAW` object keyed by type id, with `diagram: type => card(type, DRAW[type.id])`.

The canvas is 320 × 200. The `Svg` methods (in `js/diagram-kit.js`):

- `s.wall()`: the hatched wall on the left, with the wall face at x = 44. Draw your parts from x = 44 to the right, staying left of x ≈ 200.
- `s.rect(x, y, w, h, fill, stroke, strokeWidth)`, `s.line(x1, y1, x2, y2, stroke, width)`, `s.path(d, fill, stroke, width)` and `s.circle(cx, cy, r, fill, stroke, width)`. Each returns `s`, so calls chain.
- `s.led(x, y)` draws an LED module and `s.rays(x, y, dir)` draws light rays (`dir` is 1 to the right, −1 to the left).
- `s.label(text, px, py, rowY)`: a dot at (px, py) with a leader line to a label at row `rowY` in the right-hand column. Keep 3 to 6 labels with rows between 20 and 180, spaced at least 14 apart. The label column is only about 100 units wide (roughly 20 characters); `npm test` fails if a label runs past the card's edge.
- `return "Section"` (or `"Front view"`, `"Side view"`) sets the caption in the corner.

Colors come from `PALETTE`: `ink`, `muted`, `wall`, `metal`, `metalLight`, `acrylic`, `led`, `ray`, `paint`, `fabric`, `glass`, `clear`. Draw your own simple drawings. **Do not trace or copy a manufacturer's drawing, and don't name a manufacturer.**

## 6. Options (only if you need more than the built-ins)

The built-in fields, listed per type in `options: [...]`:

| key | Field |
| --- | --- |
| `panel` | Panel or face color (the background behind the copy) |
| `frame` | Cabinet or frame color |
| `returns` | Letter return color, with "Match artwork" |
| `trim` | Trim cap color |
| `raceway` | Raceway color, with "Match wall" |
| `light` | Light color: warm, cool, red, blue, green or amber |
| `side` | Which side the wall is on (blade signs) |

That covers most categories. For options of your own (materials, mounting, sizes), add these three to the module, following `js/categories/awnings.js`:

```js
defaultOptions: type => ({ finish: "matte", panel: "#ffffff" }),
sanitizeOptions: (type, raw) => ({
  finish: ["matte", "gloss"].includes(raw?.finish) ? raw.finish : "matte",
  panel: /^#[0-9a-f]{6}$/i.test(raw?.panel || "") ? raw.panel : "#ffffff",
}),
optionFields: (type, opts) => [
  { key: "finish", label: "Finish", kind: "select", value: opts.finish, choices: [["matte", "Matte"], ["gloss", "Gloss"]] },
  { key: "panel", label: "Board color", kind: "color", value: opts.panel },
],
```

- A field is `{ key, label, kind: "select" | "color" | "range", value }`. Selects also need `choices: [[value, text], …]`. Ranges also need `min`, `max`, `step`, and optionally `format: v => text`. Add `refresh: true` when changing the field changes which other fields apply.
- `sanitizeOptions` **must** rebuild the object from allowed values only. The approval-link server stores whatever it returns, so never pass `raw` through. Return `null` if the category keeps no options in approval links (the default).
- If an option changes the lighting, add `lightingOf: (type, opts) => "backlit" or "none"`.
- If an option should show in the PDF and on the proof page, add `details: (type, opts, size) => [["Finish", "Matte"]]`.
- To change the parts list by option, add `parts: (type, opts) => [...]`.

## 7. Register the tab

**Skip this step if you replaced a coming-soon file in step 2.** Otherwise, open `tools/sign-mockup/js/categories/index.js`, add an import and add the module to `CATEGORIES` where its tab should appear:

```js
import parking from "./parking.js";

export const CATEGORIES = [signs, awnings, vinyl, construction, wayfinding, ada, led, parking];
```

Tabs appear in this order in step 3 and in the library.

## 8. Wording (optional)

Defaults come from `noun`. Override any of these in `ui: { … }`:

| `ui` key | Default | Example |
| --- | --- | --- |
| `tabLabel` | `label` | `"Vinyl"` (short pill in the step 3 tab bar; full `label` stays in aria-label) |
| `textLabel` | `"<Noun> text"` | `"Board text"` |
| `plaque` | `false` | `true` for interior plaques: first placement uses `placeWidthIn`, not the storefront sign band |
| `placeWidthIn` | `null` | `(type, opts) => 9` inches wide when scale is set |
| `placeTip` | Drag-the-corners tip using the noun | HTML is allowed (`<strong>`). |
| `heightLabel` | `"Height"` | Awnings use `"Drop"`. |
| `heightShort` | `"H"` | Shown in the size chip, e.g. "12' W × 3' H". |
| `flatLabel` | `"The <noun> artwork, flat"` | Alt text for the flat artwork image. |
| `hangs` | `false` | `true` means it hangs from its top edge (awnings): resizing keeps the top edge and a "Set the drop" field appears. |
| `placeWidthIn` | `null` | `(type, opts) => inches`: the typical width it is first placed at once the scale is set, usually from a size preset. Switching types or picking another preset re-sizes it until the user drags a corner. |
| `plaque` | `false` | `true` places it beside the scaled door at about 60 in up (small wall plaques), never at the storefront sign band. |
| `sizeExtra` | Area in sq ft | `(type, opts, size) => ({ label: "Panels", value: "3" })` |

Other optional top-level fields are `typeWord` (`"type"`, or `"shape"` for awnings), `cardNote(type)` (the line under each library card), `aliases` (old id → new id) and `spillReach` (how far night light spreads, as a multiple of the height; default 0.7).

## 9. Custom render rules (rarely needed)

If no kind in step 4 fits, write `build(type, env, kit)` in a helper file and pass it as `build`. Also pass `faceArt(type, art, opts, size)`, which returns the flat artwork canvas, and `aspect(type, art, opts)`, which returns height ÷ width. Use `js/categories/awnings/build.js` as the model.

- `env` is `{ W, H, night, lit, litType, opts, art, cam, wall, sliceCount }`. `W` and `H` are the placed size in inches. X runs across, Y down, and Z out of the wall toward the viewer.
- Add textured quads with `kit.layer(texture, [[x, y, z] × 4], { tint, mul, alpha, add, uv })`, hardware with `kit.path({ pts, width, stroke, fill, close })`, glow with `kit.emit.push(layer)` and light on the wall with `kit.spill.push(layer)`.
- Multiply unlit surfaces by `kit.amb(brightness)` so they dim at night. Helpers: `kit.box`, `kit.extrude`, `kit.shadow`, `kit.boxShadow`, `kit.caps`, `kit.softRect`, `kit.rect`.
- No DOM access at import time: the server and the Node checks import every module. Creating canvases inside functions is fine.

## 10. Check it

From the repository root:

```sh
npm test
```

This runs the unit tests and `tools/check-sign-mockup.mjs`, which validates every registered category:

- ids are unique
- every type has a name, summary, 3+ parts, a known group, lighting and kind
- every type has a 320 × 200 card and points at a row in `js/pricing-config.js`
- the option fields work
- no vendor names or banned claims appear in the files

Every problem is printed with the category and type id. Fix them and run it again until it ends with `All checks passed`.

Then look at it in a browser. Serve the repository root with any static server, e.g. `python3 -m http.server 8000`, and open `http://localhost:8000/tools/sign-mockup/`. Then:

1. Upload a storefront photo and set the scale (step 2).
2. In step 3, click your tab. Open "Change type" and check every card.
3. Drag the corners onto the wall. Switch **Night** on and off.
4. In step 4, download the PDF and check the size labels, type name and price.

Approval links need the Netlify function, so they only work on a deploy preview or with `netlify dev`.

## 11. Rules that always apply

- **Price numbers live only in `js/pricing-config.js`.** A category's `pricing` block is just `row: { typeId: "row-id" }`. If no row fits, add one to `ROWS` there (base, size rate, minimum, unit). While `PLACEHOLDER` is true no number is shown anywhere; the tool, proof page and PDF show "A price is prepared after a site survey" instead.
- **No vendor or competitor names, logos, photos or copied text** anywhere in the tool. Reference catalogs are for research only. Write your own words and draw your own cards.
- **No compliance claims.** Don't write "ADA compliant", "certified", "approved" or "guaranteed". Say what it is and that Arc confirms the details before ordering.
- **Don't edit engine files** (`app.js`, `scene.js`, `catalog.js`, `pricing.js`, `pdf.js`, `proof-pdf.js`, `proof/`, `netlify/`). If something truly can't be expressed through the module, add an optional field to `defineCategory()` in `define.js` with a default that keeps every existing category unchanged, and document it here.
- Commit the module and the registry line together, with a message like `Sign mockup: add Construction Signs category`.

## Making a coming-soon tab

A tab that isn't ready yet is a short file that lists what it will cover:

```js
import { comingSoon } from "./define.js";

export default comingSoon({
  id: "parking",
  label: "Parking Signs",
  noun: "parking sign",
  intro: "Lot and garage signs, mocked up on a photo of the site.",
  icon: '<rect x="12" y="8" width="24" height="32" rx="3"/><path d="M20 32V16h6a5 5 0 0 1 0 10h-6"/>',
  examples: [
    { name: "Reserved space signs", note: "Post-mounted signs for each space." },
    { name: "Garage entrance signs", note: "Clearance bars and entrance signs." },
  ],
});
```

`icon` is the inside of a 48 × 48 SVG drawn with 2 px lines (paths, rects, circles; no `fill`). Register it as in step 7. It shows a "Soon" badge, opens a panel listing the examples with Arc's phone and email, and can't be placed. When it's ready, replace the file's contents with a full module (step 2) and keep the same id.
