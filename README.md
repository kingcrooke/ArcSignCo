# Arc Signage Co

Website for Arc Signage Co (legal name: Arc Signage Co LLC), live at https://arcsignco.com.

Static HTML hosted on Netlify (site name `arcsign`). There is no framework and no build step:
Netlify publishes the repository root as-is. The one server piece is a Netlify Function for the sign
mockup's approval links (`netlify/functions/`); `package.json` exists only for its dependency.

## Files

| Path | Purpose |
|---|---|
| `index.html` | The homepage (styles and scripts are inline) |
| `sign-permits-shop-drawings/`, `ada-signs/`, `channel-letters/`, `construction-signs/` | Service pages, each an `index.html` served at `/<slug>/` |
| `assets/css/service-page.v3.css` | Shared stylesheet for the service pages (versioned like `assets/img/`) |
| `docs/copy-review/` | Plain-text copy of each service page for copy review (not published as a page) |
| `thank-you.html` | Quote form success page, served at `/thank-you` (noindex) |
| `portfolio.html` | Founder's prior work, served at `/portfolio` (styles and scripts are inline) |
| `netlify.toml` | Publish settings, security headers, cache headers |
| `robots.txt`, `sitemap.xml` | Crawl rules and sitemap (update `sitemap.xml` when a page is added) |
| `favicon.ico`, `favicon-32.png`, `icon-192.png`, `apple-touch-icon.png` | Browser and home-screen icons |
| `assets/img/` | Optimized, versioned web images (AVIF / WebP / JPEG / PNG) |
| `*.png` in the root | Image masters used to generate `assets/img/` |
| `tools/optimize-images.mjs` | Regenerates `assets/img/` and the icons from the masters |
| `assets/portfolio/` | Optimized, versioned portfolio photos (AVIF / WebP / JPEG) |
| `tools/optimize-portfolio-images.mjs` | Regenerates `assets/portfolio/` from the cleaned portfolio masters (kept outside the repo) |
| `tools/check-service-pages.mjs` | Checks JSON-LD, FAQ/schema text match, canonicals, sitemap, and banned claims |
| `tools/export-copy.mjs` | Regenerates `docs/copy-review/<slug>.md` from the service pages |
| `tools/sign-mockup/` | Storefront sign and awning mockup tool, served at `/tools/sign-mockup/` (noindex, not in the sitemap or nav) |
| `tools/sign-mockup/proof/` | Phone proof page for approval links, served at `/tools/sign-mockup/proof/#<id>` (noindex) |
| `netlify/functions/sign-proofs.mjs`, `netlify/lib/sign-proofs.mjs` | Approval link API (`/api/sign-proofs`), stored in Netlify Blobs |
| `package.json` | `@netlify/blobs` for the function, and `npm test` for the mockup checks |
| `tools/check-sign-mockup.mjs` | Checks the mockup tool's geometry, sign types, awning shapes and meshes, PDF output, and copy guardrails |
| `tools/sign-mockup-pricing.test.mjs`, `tools/sign-proofs.test.mjs` | Unit tests: placeholder rates and the approval link API |
| `docs/sign-mockup-approval-links.md` | How approval links work: API, Blobs namespacing, notifications |
| `docs/awnings-research.md` | Awning shapes, covers, valances and lighting research behind the awning library (internal) |

## How changes ship

`main` is production. Nothing is pushed or merged to `main` without Jesus's approval.

1. **Branch**: create a feature branch from `main` (agents use `cursor/<description>`).
2. **Pull request**: open a PR against `main`. Fill in the PR template checklist.
3. **Deploy Preview**: Netlify builds a preview for the PR and posts its URL on the PR
   (`deploy-preview-<PR number>--arcsign.netlify.app`). Review everything there, on desktop and on a phone.
4. **Jesus approval**: Jesus reviews the preview and approves the PR.
5. **Merge**: after approval, merge to `main`. Netlify deploys production automatically.

Copy that makes a claim (turnaround, location, credentials, clients, reviews) must be verifiable.
If it can't be backed up, soften or remove it.

## Quote form (Netlify Forms)

- The form is `quote-request` in `index.html`. It uses `data-netlify="true"` and a honeypot field
  (`bot-field`). Netlify strips these attributes from the served HTML at deploy time, so they won't
  appear when viewing the live page source; that is expected.
- Every input needs a `name`, and the field must exist in the static HTML, or Netlify drops it.
- Successful submissions redirect to `/thank-you`.
- Fields follow the Sales Ops intake checklist (Must have / Request next):

  | Field (`name`) | Required | Notes |
  |---|---|---|
  | `name`, `email` | yes | |
  | `phone` | no | |
  | `company` | no | |
  | `role` | yes | General contractor / Architect / Owner / Tenant / Other |
  | `type` | defaults to "Not sure" | Every service the site lists, plus "Several of these" |
  | `project-address`, `borough` | yes | The customer's job site, not Arc's address |
  | `deadline-type` | yes | Bid due / Install / Both bid and install / No firm date yet |
  | `deadline-date` | when a deadline type with a date is picked | Labelled "Bid due date" or "Install date" to match the type |
  | `install-date` | no | Shown only for "Both bid and install" |
  | `drawings` | yes | Yes / No / Will email |
  | `permit[]` | no | Any of DOB / FDNY / Landlord / Not sure (multi-value) |
  | `message` | no | Placeholder prompts for access, existing signs, power, GC name |
  | `scope-finder` | hidden | Scope Finder result, if used and not already in the notes |

- On submit, the page saves the project address in `sessionStorage` (this tab only) so `/thank-you` can
  put it in the "Email drawings" subject line. Nothing is sent anywhere else.
- Submissions, spam, and notification settings live in the Netlify UI
  (Forms, and Project configuration > Notifications). The notification email target is set there, not in code.
- **Notification target: arc@arcsignco.com** (owner decision). Configure it in Netlify under
  Project configuration > Notifications > Emails and webhooks > Form submission notifications, for the
  `quote-request` form.
- Public contact emails on the site: jc@arcsignco.com and arc@arcsignco.com (lowercase). Homepage business JSON-LD uses jc@.

## Location and address

- No street address in visible copy or the footer. The location label is "New York / Tri-State".
- Never publish the old Post Avenue business address anywhere on the site.
- The homepage JSON-LD `ProfessionalService` node (`@id` `https://arcsignco.com/#business`) may include
  a schema-only `PostalAddress` with `addressRegion` `NY` and `addressCountry` `US` only (no street,
  city, or ZIP in schema or visible copy). Service pages must not include `address` or `streetAddress` in JSON-LD; they point their
  `Service` `provider` at the same `@id`.
- `sameAs` lists Instagram (`https://www.instagram.com/arcsignco`) and Facebook
  (`https://www.facebook.com/1201574029704014`). The footer on every page links to both.
- Google Business Profile: Arc has one, but the URL isn't confirmed yet. Search all pages for
  `TODO(GBP)`. When the URL is confirmed, put it in these places:
  1. the `sameAs` array in the homepage JSON-LD (after Instagram and Facebook), and
  2. the `href` of the footer link `id="gbpLink"` on the homepage, on each service page, and in `portfolio.html`.

  The footer link stays hidden while its `href` is empty and shows automatically once it's an `https://`
  URL. Never guess the URL.

## Service pages

- Each page has three JSON-LD blocks: `Service`, `BreadcrumbList`, and `FAQPage`. The `FAQPage`
  question and answer text must match the visible FAQ on the page word for word. If you edit an FAQ,
  edit both, then update the matching file in `docs/copy-review/`.
- Code and regulation references are cited in a "Public sources" list on each page. Re-check them
  whenever the page is edited.
- The header and footer are copied into each page (there is no build step). A change to the
  homepage header or footer needs the same change in the four service pages and `portfolio.html`.
- `assets/css/service-page.v3.css` is cached for a year. To change it, copy it to `.v4.css` and
  update the `<link>` in each service page. (`v1` was only ever on a Deploy Preview. `v2` is kept
  because production served it; v3 only moves the Menu breakpoint from 720px to 880px.)
- The service pages use the same header (Call + Request a quote), phone bottom bar, v2 logo, GBP
  footer slot, and GA4 hook as the homepage. The phone bar watches the hero buttons, the "What to
  send" section, and the closing CTA band, and shows only when none of them is on screen.
- After editing a service page, regenerate the copy-review files and run the checks:

  ```bash
  mkdir -p /tmp/sd-tools && (cd /tmp/sd-tools && npm i jsdom)
  NODE_PATH=/tmp/sd-tools/node_modules node tools/export-copy.mjs
  NODE_PATH=/tmp/sd-tools/node_modules node tools/check-service-pages.mjs
  ```

## Portfolio photos

- `/portfolio` shows projects Jesus managed as a Project Manager at other New York sign companies
  before starting Arc. It is always labelled as the founder's prior work, never as Arc Signage Co jobs.
  Captions are owner-approved copy: don't reword them or add facts.
- Source: sign photos supplied by Jesus; masters stay outside the repo. EXIF/GPS is stripped on
  publish. Do not use packing-label or box photos that show personal names, addresses, or shipping
  info — portfolio entries should show installed signs only. Page copy may name
  project owners/clients and general contractors where the repo already lists them; do not name former
  sign-company employers in copy or alt text.
- The cleaned masters (about 2400 px, JPEG q85) are **not committed**: the repo is public and Netlify
  publishes the repo root, so a committed master would be downloadable at full size. Keep them with the
  project files. `tools/optimize-portfolio-images.mjs` lists each master's SHA-256 and refuses to run on
  a different file.
- Only `assets/portfolio/` is published: AVIF / WebP / JPEG at 480, 800 and 1200 w (800 w max for very
  tall photos), with no EXIF, XMP, IPTC or ICC data (the script checks every output).
- Regenerate:

  ```bash
  mkdir -p /tmp/img-tools && (cd /tmp/img-tools && npm i sharp)
  NODE_PATH=/tmp/img-tools/node_modules node tools/optimize-portfolio-images.mjs /path/to/cleaned/masters
  ```

  Masters are matched by their two-digit prefix (`01-…jpg` to `14-…jpg`). If a master is re-cleaned,
  update its hash and bump `VERSION` in the script, then update the references in `portfolio.html`.

## Images and caching

- Files in `assets/img/` are cached by browsers for one year (`immutable`). **Never overwrite a file
  there.** When an image changes, bump its version in `tools/optimize-images.mjs` (`VERSION` for the
  photos and icon, `LOCKUP_VERSION` for the header/footer logo), regenerate, and update the references
  in the HTML.
- The logo lockup is on `v2` (palette-quantized, about half the bytes of `v1`). New pages should use
  `logo-lockup-white-*.v2.*`. The `v1` lockup files are no longer generated but stay in `assets/img/`
  until no page or open branch references them.
- `service_photoreal_sprite_codex.png` (2.26 MB) is not used by any page. It is the master that the
  service tiles and collage in `assets/img/` are cut from, so keep it unless a replacement master is
  stored elsewhere.
- Regenerate images:

  ```bash
  mkdir -p /tmp/img-tools && (cd /tmp/img-tools && npm i sharp)
  NODE_PATH=/tmp/img-tools/node_modules node tools/optimize-images.mjs
  ```

- HTML is always revalidated, so page edits appear as soon as a deploy finishes.

## Sign mockup tool

`/tools/sign-mockup/` lets a visitor upload a storefront photo, set the scale by drawing a line over
something they measured, pick a sign type or an awning shape, pin it (typed text or uploaded artwork)
to the wall with four corner handles, and see it built in perspective by day and at night. They can then
download a three-page PDF or send a phone approval link.

- **Categories**: each tab (Signs, Awnings, …) is one self-contained module in
  `js/categories/<id>.js` that default-exports `defineCategory({...})`: its types, groups, options,
  SVG construction cards, render rules, wording and placeholder rates. `js/categories/index.js` is
  the **only** place tabs are listed. The engine (`app.js`, `scene.js`, `catalog.js`, `pricing.js`,
  the PDF, proof page and server) never names a category; `js/catalog.js` reads everything through
  the registry. Adding a tab is one module file plus one registry line:
  follow `docs/ADDING-A-CATEGORY.md` step by step.
- **Signs** (`categories/signs.js`, types in `categories/signs/types.js`): 17 types (channel letters,
  non-lit letters, light boxes, blade signs, panels, LED neon, vinyl and paint). Each has a "how it's
  built" cross-section drawn in code for this tool (`categories/signs/diagrams.js`): generic, typical
  construction, not to scale. Signs use the shared construction kinds in `js/kinds.js`.
- **Awnings** (`categories/awnings.js` plus `categories/awnings/`): 29 shapes (sloped, curved, domes
  and cones, sign-face and backlit, canopies and marquees, retractable), based on
  `docs/awnings-research.md`. Options: projection, cover, color, solid or striped fabric, valance
  style, lettering on the valance or the face, open or closed sides, frame color, and backlit where
  the shape allows it. The pinned corners are the wall area the awning covers (width and drop); the
  projection comes out from the wall. `awnings/geometry.js` builds each shape as a 3D mesh,
  `awnings/build.js` paints and lights it, and `awnings/diagrams.js` draws the side-profile card.
  Only backlit awnings glow at night. Awnings are priced per linear foot of width.
- **Coming soon**: Vinyl & Stickers, Construction Signs, Interior Wayfinding, ADA & Code Signs and
  LED Displays are registered with `comingSoon()`. They show as dashed tabs; picking one opens the
  library with example cards and a call/email line instead of types.
- Use generic type and shape names only: no catalog, vendor or awning maker names anywhere on the
  site, in PDFs or in code comments. `tools/check-sign-mockup.mjs` checks for this.
- **Rendering**: `js/geometry.js` recovers a camera from the pinned corners, so depth (returns,
  raceways, cabinets, standoffs, brackets, awning projection) is drawn in perspective.
  `js/scene.js` asks the type's category to build its parts with the drawing helpers in `js/kit.js`
  and the light table in `js/lighting.js`; `js/renderer.js` draws them with WebGL, or on the CPU
  when WebGL is missing. `js/art.js` removes a flat background and makes the masks.
- **Night view**: same pin, darker photo, light from the sign by lighting type (face-lit, halo,
  internal, LED neon, gooseneck lamps). Non-lit types never glow but stay readable. This is a
  simulation to show where the light goes, not a photometric render.
- **PDF** (`js/pdf.js` writer, `js/proof-pdf.js` browser glue): page 1 is the day mockup with size, type and
  the price note; page 2 is the night view and the construction drawing; page 3 is the flat,
  undistorted artwork. Every page has the logo, phone, both emails and "Concept only – not a shop drawing".
- **Preliminary estimate**: every price number (rows, minimums, illumination adders, extra lines,
  rounding, the range rule, tax line and valid days) lives in `js/pricing-config.js`; a category
  module only maps each type id to a row. The numbers are **placeholders** and `PLACEHOLDER = true`,
  so no dollar amount shows anywhere (tool, proof page, PDF, server): they show "A price is prepared
  after a site survey" and the full disclaimer. Put Arc's rates in, bump `RATES_VERSION` and set
  `PLACEHOLDER = false` to show "Preliminary estimate" ranges once the scale is set.
- **Approval links**: `netlify/functions/sign-proofs.mjs` stores proofs in the Netlify Blobs store
  `arc-sign-mockup-proofs` under `v1/<deploy context>/<id>/`, so preview test proofs never mix with
  production ones. Details: `docs/sign-mockup-approval-links.md`.
- Nothing leaves the browser unless the visitor creates an approval link. Plain ES modules, no build
  step and no runtime CDN.
- iPhone HEIC photos: Safari decodes them natively. Other browsers load
  `tools/sign-mockup/vendor/heic-to-1.6.5.min.js` (libheif, LGPL-3.0, about 0.8 MB gzipped) only when
  a HEIC file is picked. To upgrade it, add a new versioned file (the vendor folder is cached for a year)
  and update `HEIC_LIB` in `js/images.js`.
- `netlify.toml` serves `/tools/sign-mockup/*` before the rule that 404s the rest of `/tools/`.
  Keep that order. It also 404s `/netlify/*`, `/node_modules/*`, `/package.json` and
  `/package-lock.json`, because the publish root is the repo root.
- Sizes are estimates: they assume the reference line is on the same wall as the sign and the photo is
  close to straight-on. The page and PDF say so; don't remove that wording.
- After editing the tool, run `npm test` (or `node tools/check-sign-mockup.mjs` and the two
  `node --test` files on their own; no install needed for those).

## Analytics

Google Analytics 4 is wired in but **off**. Do not add a Measurement ID until Jesus approves it.

While the ID is empty, the pages load no analytics script and make no request to Google.

**To turn it on** (after approval):

1. In GA4, create a Web data stream for `https://arcsignco.com` and copy its Measurement ID (`G-XXXXXXXXXX`).
2. Search for `ANALYTICS(GA4)` in `index.html`, `thank-you.html`, `portfolio.html`, and the four
   service pages (`*/index.html`). In every file, set
   `var GA4_ID = "G-XXXXXXXXXX";` to the same ID. Anything that doesn't look like `G-` plus letters
   and digits is ignored.
3. Open a PR, check the Deploy Preview's network tab for a `googletagmanager.com/gtag/js` request, then merge.
4. In GA4 (Admin > Events), mark `generate_lead` as a key event (conversion).

**Events:**

| Event | Where it fires |
|---|---|
| `page_view` | Every page, sent automatically by the GA4 config |
| `generate_lead` (`form_name: quote-request`) | `/thank-you`, in the script at the bottom of `thank-you.html`. It fires only after a real quote form submit in the same tab, and only once per submit, so reloads and direct visits don't count. |
| `click_to_call` | Any `tel:` link on the homepage (header, hero, trust row, phone bar, contact card, footer), on the service pages (header, hero, quote card, phone bar, footer), and on `/portfolio` (header, phone bar, footer) |

Nothing else is tracked. The GA4 `config` call uses Google's defaults.

## Environment variables

None are used today. If any are added later, list the variable **names** here (never the values);
values are set in the Netlify UI.
