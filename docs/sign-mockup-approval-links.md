# Sign mockup approval links

How the phone approval link in the sign mockup tool works, where its data lives, and how to look
after it. Internal doc (`/docs/*` returns 404 on the site).

## What the client sees

The editor's Download step has **Create approval link**. It uploads three JPEGs and a small JSON
sheet, then gives a link like:

```
https://arcsignco.com/tools/sign-mockup/proof/#3f9c0d6e2b7a41c58e0f1a2b3c4d5e6f
```

The proof page (`tools/sign-mockup/proof/`) is built for phones. The client can:

- switch between the day and night views (both rendered from the same pin in the editor)
- read the sign type or awning shape, approximate size and how it's built (the same drawing as the
  picker); for awnings, also the chosen cover, pattern, valance, lettering spot, sides, projection and
  lighting
- see the price note: while the rates are placeholders, "A price is prepared after a site survey" and
  no numbers; once Arc's rates are in, a preliminary estimate range if the scale was set
- post comments
- approve with their name; the server records the time
- download the PDF (the same three pages as the editor, plus an approval stamp once approved)
- email Arc (a prefilled `mailto:` to arc@ with jc@ on copy)

The id is a random 128-bit hex string in the URL **fragment** (`#…`). Browsers don't send fragments
to servers, so the id stays out of access logs and `Referer` headers. Anyone who has the link can
see the proof, comment and approve. There are no accounts.

Editing the design after making a link (moving a corner, changing the type, the notes and so on)
hides the old link in the editor. **Create a new link for this version** makes a new proof. Old links
keep showing what was sent.

## Pieces

| Path | Role |
|---|---|
| `netlify/functions/sign-proofs.mjs` | Netlify Function (modern default export + `config.path`). Routes `/api/sign-proofs[/:id[/:action]]` to the core. Rate limit: 60 requests a minute per IP. |
| `netlify/lib/sign-proofs.mjs` | Core logic: validation, keys, conditional writes. No Netlify imports, so it can be tested with a fake store. |
| `tools/sign-proofs.test.mjs` | Unit tests for the core with an in-memory store (`node --test ./tools/sign-proofs.test.mjs`). |
| `tools/sign-mockup/proof/` | The proof page (`index.html`, `proof.js`, `proof.css`). |
| `tools/sign-mockup/js/proof-pdf.js` | Builds the PDF in the browser; shared by the editor and the proof page. |
| `tools/sign-mockup/js/pricing-config.js` | Every price number in the code (placeholders). Each category's `pricing.row` only maps a type id to a row here. |
| `tools/sign-mockup/js/catalog.js` | Reads types, options and wording from the category registry (`js/categories/index.js`); the server uses it to validate sheets. |
| `package.json` | Declares `@netlify/blobs` (Netlify installs it at deploy). Needs Node 22.12+, set in `netlify.toml`. |

### API

| Method and path | Body | Result |
|---|---|---|
| `POST /api/sign-proofs` | multipart: `sheet` (JSON), `day`, `night`, `art` (JPEG) | `201 { id, sheet }` |
| `GET /api/sign-proofs/:id` | | the sheet |
| `GET /api/sign-proofs/:id/day` (or `night`, `art`) | | `image/jpeg` |
| `POST /api/sign-proofs/:id/comments` | `{ name, text }` | the sheet |
| `POST /api/sign-proofs/:id/approve` | `{ name }` | the sheet; `409` if already approved |

Limits: each image ≤ 1.6 MB and ≤ 4096 px a side (the editor sends about 1600 px, well under
Netlify's 6 MB request limit); comments ≤ 1000 characters, 200 per proof; names ≤ 80 characters.
Every response has `X-Robots-Tag: noindex`.

The server ignores any price the browser sends. It recomputes the estimate from the sign type,
options and measured size with `estimatePrice()` and `js/pricing-config.js`, so a link can't carry a
made-up number. While `PLACEHOLDER` is true it stores `{ withheld: true, message, disclaimer }` with
no numbers, and the proof page shows the message even for older proofs saved with numbers. Sheets may carry an `options` object; the server keeps only the keys and values the
type allows (`cleanOptions()` in `js/catalog.js`, which calls the category's `sanitizeOptions`).
Categories without options (signs) store `options: null`. Awnings are priced from width and
projection, with the backlit adder when backlit is chosen. Only categories marked ready accept proofs;
Every live category tab has types the server can price from `pricing-config.js`. Old links with the type id `awning` open as the traditional slope. The approval time comes from the server clock, not from the browser.

## Storage and namespacing

Netlify Blobs is site-wide: production and every Deploy Preview share the same stores. To keep proofs
apart from anything else the site stores, and to keep test proofs apart from real ones:

- **Store:** `arc-sign-mockup-proofs`, used only by this feature (strong consistency).
- **Keys:** `v1/<deploy context>/<proof id>/…`, where the deploy context is `production`,
  `deploy-preview`, `branch-deploy` or `dev`:

  ```
  v1/production/<id>/sheet.json   project, type, options, size, price, comments, approval
  v1/production/<id>/day.jpg
  v1/production/<id>/night.jpg
  v1/production/<id>/art.jpg      flat artwork
  ```

A link made on a Deploy Preview only opens on Deploy Previews, and production never reads preview
proofs. Preview test data can be cleared by prefix without touching production:

```bash
npx netlify blobs:list arc-sign-mockup-proofs --prefix v1/deploy-preview/
npx netlify blobs:delete arc-sign-mockup-proofs v1/deploy-preview/<id>/sheet.json
```

`v1` is the key schema version. If the sheet format changes in a way old pages can't read, write new
proofs under `v2/` and keep reading `v1/`.

Comments and approvals use read-modify-write with the blob's etag (`onlyIfMatch`, retried up to
four times), so two people commenting at once don't overwrite each other. A proof is created with
`onlyIfNew`, so an id is never reused.

Blobs suits this feature: proofs are mostly image files plus one small sheet each, read by id. If Arc
later wants to search or report on approvals, move the sheet fields to Netlify Database and keep the
images in Blobs.

## Notifications

After an approval or a comment, the proof page also posts to the Netlify form
`sign-proof-activity` (static copy in `proof/index.html`, honeypot `bot-field`). Its fields are
`event` (`approved` or `comment`), `proof` (the link), `project`, `name` and `message`. To get an
email for each, add a form notification for `sign-proof-activity` in Netlify under Project
configuration > Notifications (same place as `quote-request`). The proof is saved whether or not
the form post lands; the form is only the alert. Deploy Preview tests also post to this form, so
expect test entries there.

## Local testing

`netlify dev` runs the function with a local sandboxed Blobs store:

```bash
npm install
npx netlify dev        # then open http://localhost:8888/tools/sign-mockup/
```

Without the Netlify CLI, the editor still works. Creating a link then reports that approval links
aren't available on that copy of the site.

## Before showing a price to a client

The numbers in `tools/sign-mockup/js/pricing-config.js` are placeholders, and while `PLACEHOLDER` is
true no number reaches a client. Replace them with Arc's own rates, bump `RATES_VERSION`, set
`PLACEHOLDER = false`, update the "while the rates are placeholders" test, and run `npm test` (it
checks that every type points at a row, the rounding and range rule, and that low is below high).
