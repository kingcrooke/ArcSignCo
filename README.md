# Arc Signage Co

Website for Arc Signage Co (legal name: Arc Signage Co LLC), live at https://arcsignco.com.

Static HTML hosted on Netlify (site name `arcsign`). There is no framework and no build step:
Netlify publishes the repository root as-is.

## Files

| Path | Purpose |
|---|---|
| `index.html` | The single-page site (styles and scripts are inline) |
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
- The public contact email shown on the site is also arc@arcsignco.com (lowercase).

## Location and address

- No street address anywhere: not in visible copy, the footer, or JSON-LD. The location label is
  "New York / Tri-State".
- JSON-LD `LocalBusiness` uses `areaServed` (New York, New Jersey, Connecticut) and has no `address`
  or `streetAddress`.
- Google Business Profile: Arc has one, but the URL isn't confirmed yet. Search `index.html` for
  `TODO(GBP)`. When the URL is confirmed, put it in two places:
  1. the empty `sameAs` array in the JSON-LD, and
  2. the `href` of the footer link `id="gbpLink"`.

  The footer link stays hidden while its `href` is empty and shows automatically once it's an `https://`
  URL. Never guess the URL.

## Portfolio photos

- `/portfolio` shows projects Jesus managed as a Project Manager at other New York sign companies
  before starting Arc. It is always labelled as the founder's prior work, never as Arc Signage Co jobs.
  Captions are owner-approved copy: don't reword them or add facts.
- Source: 14 photos supplied by Jesus, already cleaned before they reached the repo. EXIF/GPS is
  stripped, and former-employer names and logos, a street address, a phone number and some box/label
  text are blurred. Don't sharpen or try to recover blurred areas, and don't name former employers in
  page copy or alt text.
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

## Analytics

Google Analytics 4 is wired in but **off**. Do not add a Measurement ID until Jesus approves it.

While the ID is empty, the pages load no analytics script and make no request to Google.

**To turn it on** (after approval):

1. In GA4, create a Web data stream for `https://arcsignco.com` and copy its Measurement ID (`G-XXXXXXXXXX`).
2. Search for `ANALYTICS(GA4)` in `index.html`, `thank-you.html` and `portfolio.html`. In all three files, set
   `var GA4_ID = "G-XXXXXXXXXX";` to the same ID. Anything that doesn't look like `G-` plus letters
   and digits is ignored.
3. Open a PR, check the Deploy Preview's network tab for a `googletagmanager.com/gtag/js` request, then merge.
4. In GA4 (Admin > Events), mark `generate_lead` as a key event (conversion).

**Events:**

| Event | Where it fires |
|---|---|
| `page_view` | Every page, sent automatically by the GA4 config |
| `generate_lead` (`form_name: quote-request`) | `/thank-you`, in the script at the bottom of `thank-you.html`. It fires only after a real quote form submit in the same tab, and only once per submit, so reloads and direct visits don't count. |
| `click_to_call` | Any `tel:` link on the homepage (header, hero, trust row, phone bar, contact card, footer) and on `/portfolio` (header, phone bar, footer) |

Nothing else is tracked. The GA4 `config` call uses Google's defaults.

## Environment variables

None are used today. If any are added later, list the variable **names** here (never the values);
values are set in the Netlify UI.
