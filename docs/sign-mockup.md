# Storefront sign mockup tool

Internal tool at `/tools/sign-mockup/` (not in the main navigation or `sitemap.xml`; `noindex`).

Concept only – not a shop drawing.

## What it does

1. **Photo** — JPG or PNG. HEIC converts in the browser when it can.
2. **Calibration** — A line on a known length stores pixels per inch along that line.
3. **Artwork** — Four corner handles warp the sign onto the facade. The uploaded file is kept undistorted and is the fabrication artwork. The proof shows both the in-situ picture and that file.
4. **Construction** — Channel letters (returns and a raceway), lightbox / cabinet (depth and trim), blade (thickness and a wall plate), or flat panel (standoffs). Same four corners.
5. **Day and night** — One pin. Night can be face-lit, halo-lit, internal, or neon, with light spill on the wall.
6. **PDF** — The original branded day proof, plus a night page and an undistorted artwork page. Phone (347) 450-2110, jc@arcsignco.com, arc@arcsignco.com.
7. **Phone approval link** — A client opens one link, comments, approves (name and timestamp), downloads the PDF, and sees a preliminary placeholder price from the calibrated width, sign type, and light mode.

## Placeholder price

The only price list is `tools/sign-mockup/pricing-config.js`. The numbers are Arc placeholders, labeled on the proof. They are not a quote. Replace them in that file before sending links to clients. Do not put vendor names or vendor costs in that file. It is public.

## Phone link storage

The site is static. The link uses one Netlify Function, `netlify/functions/sign-proof.mjs`, at `/api/sign-proof`.

Each proof is one package in a Netlify Blobs store named `sign-proofs`:

- `day`, `night`, and `artwork` image files
- a JSON sheet for the project, the placeholder price, comments, and the approval time

There is no database and no list of proofs. The id is a random 128-bit hex string. Deploy previews and production share this site-scoped store, so a test link created on a preview writes a real object. It does not deploy production code.

The proof page is `/tools/sign-mockup/proof/?id=...`.

Approving or commenting also posts the Netlify Form `sign-proof-approval` (proof URL, project, person, action, comment). That form does not send mail until a notification is turned on in the Netlify UI. The name and time on the proof page come from the blob sheet, not from the form.

Local static hosting can run the editor. Creating a link needs `netlify dev` (or a deploy) so the function and the local blob sandbox exist.

## Files

| Path | Purpose |
|------|---------|
| `tools/sign-mockup/index.html` | Editor |
| `tools/sign-mockup/sign-mockup.css` | Editor layout |
| `tools/sign-mockup/sign-mockup.js` | Photo, calibration, placement, share |
| `tools/sign-mockup/scene.js` | Construction and night render |
| `tools/sign-mockup/proof-pdf.js` | Branded PDF |
| `tools/sign-mockup/pricing-config.js` | Placeholder rates |
| `tools/sign-mockup/format.js` | Size and time labels |
| `tools/sign-mockup/proof/` | Phone proof page |
| `netlify/functions/sign-proof.mjs` | Create, read, comment, approve |

## Limits

- Depth, glow, and the night grade are a concept render of the photo you upload. They are not a surveyed wall angle and they do not relight the street.
- Channel-letter returns follow the artwork's shape. A PNG with transparency reads as letters. A solid rectangle reads as a panel.
- The price is a placeholder from the calibrated width. A wrong calibration line makes a wrong number.
- Anyone with the link can view, comment, and approve. There is no password.
- Approval does not email anyone until the `sign-proof-approval` form notification is set in Netlify.
