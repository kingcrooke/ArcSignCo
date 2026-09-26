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
  `TODO(GBP)`: add the URL to the empty `sameAs` array in the JSON-LD and uncomment the footer link.
  Never guess the URL.

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
  there.** When an image changes, bump `VERSION` in `tools/optimize-images.mjs` (e.g. `v1` to `v2`),
  regenerate, and update the references in the HTML.
- Regenerate images:

  ```bash
  mkdir -p /tmp/img-tools && (cd /tmp/img-tools && npm i sharp)
  NODE_PATH=/tmp/img-tools/node_modules node tools/optimize-images.mjs
  ```

- HTML is always revalidated, so page edits appear as soon as a deploy finishes.

## Analytics

None installed. A placeholder comment in `index.html` marks where a snippet would go. Do not add a
tracking ID until Jesus approves the provider and the ID.

## Environment variables

None are used today. If any are added later, list the variable **names** here (never the values);
values are set in the Netlify UI.
