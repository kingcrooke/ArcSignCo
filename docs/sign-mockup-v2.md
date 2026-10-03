# Sign mockup tool v2

## New capabilities

1. **Day / night** — Same four-corner pin; night darkens the photo and applies face-lit, halo-lit, internal/lightbox glow, or exposed neon spill on the wall.
2. **Construction types** — Channel letters (returns + raceway), lightbox cabinet, blade depth, flat panel standoffs. The undistorted artwork is shown in PDF page 2 and on the approval page as the fabrication source.
3. **Mobile approval link** — Creates a shareable proof URL with day/night/fab images, comment thread, approve + timestamp, client PDF download, and preliminary estimate from `pricing-config.js`.

## Netlify backend (approval links only)

| Piece | Role |
|-------|------|
| `netlify/functions/sign-mockup-proof.mjs` | `POST` create proof, `GET` read, `PATCH` comment/approve |
| `@netlify/blobs` store `sign-mockup-proofs` | JSON records keyed `proof/{uuid}` |
| `netlify.toml` redirect | `/api/sign-mockup/proof` → function |
| `package.json` | Declares `@netlify/blobs` for CI/install |

The main editor still runs in the browser. Only **Create mobile approval link** uploads compressed JPEG previews (max ~1400px) plus metadata.

### API

- `POST /api/sign-mockup/proof` — body: project fields + `images.{day,night,fab}` data URLs
- `GET /api/sign-mockup/proof?id={uuid}`
- `PATCH /api/sign-mockup/proof?id={uuid}` — `{ comment }` or `{ approve: true }`

Proof page: `/tools/sign-mockup/proof/?id={uuid}`

## Pricing placeholders

All client-facing estimate numbers live in `tools/sign-mockup/pricing-config.js`. Edit Arc placeholder rates there only.
