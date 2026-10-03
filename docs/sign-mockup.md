# Storefront sign mockup tool

Internal browser tool for quick storefront sign visualization. Published at `/tools/sign-mockup/` (not in the main navigation or `sitemap.xml`; `noindex`).

## What it does

1. **Photo** — User loads a storefront JPG/PNG (HEIC converts locally via heic2any when the browser allows). Images never leave the device.
2. **Calibration** — User draws a line on a known feature and enters its real length (feet/inches or inches). The tool stores pixels-per-inch along that plane.
3. **Sign placement** — User loads sign artwork and drags four corner handles. The sign is warped with a subdivided mesh (perspective approximation). Opacity and reset are available. Live readout shows approximate width × height from calibrated edge lengths.
4. **PDF proof** — jsPDF export with the composite image, optional project name, date, logo, arcsignco.com, (347) 450-2110, dimensions when calibrated, and the disclaimer: *Concept only, not to scale for fabrication.*

## Files

| Path | Purpose |
|------|---------|
| `tools/sign-mockup/index.html` | Page shell and controls |
| `tools/sign-mockup/sign-mockup.css` | Layout and Arc brand tokens |
| `tools/sign-mockup/sign-mockup.js` | Canvas, calibration, warp, PDF |

## Deploy / Netlify

- `netlify.toml` blocks `tools/*.mjs` dev scripts but serves `tools/sign-mockup/`.
- `X-Robots-Tag: noindex` is set for `/tools/sign-mockup/*`.

## Sharing with clients

Send the direct URL (or a deploy-preview URL while reviewing). No account or upload step is required.
