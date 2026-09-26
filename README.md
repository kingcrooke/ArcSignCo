# Arc Signage Co

Website for Arc Signage Co (legal name: Arc Signage Co LLC), live at https://arcsignco.com.

Static HTML hosted on Netlify (site name `arcsign`). There is no framework and no build step:
Netlify publishes the repository root as-is.

## Files

| Path | Purpose |
|---|---|
| `index.html` | The homepage (styles and scripts are inline) |
| `sign-permits-shop-drawings/`, `ada-signs/`, `channel-letters/`, `construction-signs/` | Service pages, each an `index.html` served at `/<slug>/` |
| `assets/css/service-page.v1.css` | Shared stylesheet for the service pages (versioned like `assets/img/`) |
| `docs/copy-review/` | Plain-text copy of each service page for copy review (not published as a page) |
| `thank-you.html` | Quote form success page, served at `/thank-you` (noindex) |
| `netlify.toml` | Publish settings, security headers, cache headers |
| `robots.txt`, `sitemap.xml` | Crawl rules and sitemap (update `sitemap.xml` when a page is added) |
| `favicon.ico`, `favicon-32.png`, `icon-192.png`, `apple-touch-icon.png` | Browser and home-screen icons |
| `assets/img/` | Optimized, versioned web images (AVIF / WebP / JPEG / PNG) |
| `*.png` in the root | Image masters used to generate `assets/img/` |
| `tools/optimize-images.mjs` | Regenerates `assets/img/` and the icons from the masters |
| `tools/check-service-pages.mjs` | Checks JSON-LD, FAQ/schema text match, canonicals, sitemap, and banned claims |
| `tools/export-copy.mjs` | Regenerates `docs/copy-review/<slug>.md` from the service pages |

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
  or `streetAddress`. Its `@id` is `https://arcsignco.com/#business`; the service pages point their
  `Service` `provider` at that same `@id`.
- `sameAs` lists Instagram (`https://www.instagram.com/arcsignco`) and Facebook
  (`https://www.facebook.com/1201574029704014`). The footer on every page links to both.
- Google Business Profile: Arc has one, but the URL isn't confirmed yet. Search all pages for
  `TODO(GBP)`: add the URL to the `sameAs` array in the homepage JSON-LD and uncomment the footer
  link on the homepage and each service page.
  Never guess the URL.

## Service pages

- Each page has three JSON-LD blocks: `Service`, `BreadcrumbList`, and `FAQPage`. The `FAQPage`
  question and answer text must match the visible FAQ on the page word for word. If you edit an FAQ,
  edit both, then update the matching file in `docs/copy-review/`.
- Code and regulation references are cited in a "Public sources" list on each page. Re-check them
  whenever the page is edited.
- The header and footer are copied into each page (there is no build step). A change to the
  homepage header or footer needs the same change in the four service pages.
- `assets/css/service-page.v1.css` is cached for a year. To change it, copy it to `.v2.css` and
  update the `<link>` in each service page.
- After editing a service page, regenerate the copy-review files and run the checks:

  ```bash
  mkdir -p /tmp/sd-tools && (cd /tmp/sd-tools && npm i jsdom)
  NODE_PATH=/tmp/sd-tools/node_modules node tools/export-copy.mjs
  NODE_PATH=/tmp/sd-tools/node_modules node tools/check-service-pages.mjs
  ```

## Portfolio photos (later phase)

Past Crown and Certified install photos may be used in a later portfolio PR, with those company names
and logos blurred out before they are committed. None are in the repo yet.

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
