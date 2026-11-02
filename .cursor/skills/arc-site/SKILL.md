---
name: arc-site
description: Cloud-agent rules for arcsignco.com (Netlify static site) and its hidden URL-only sections.
---

# Arc Signage Co site (`arc-site`)

Read this skill at the start of every task on this repo. The site is **static HTML at the repo root**, published by Netlify with **no build step** for the core site; league/family apps live under `apps/*` and are copied into hashed folders at the root for deploy (see each app’s README).

## Model

**Composer 2.5** is the default. Use another model only when Jesus asks for one.

## Ship workflow

1. Branch from `main` (`cursor/<description>-2aba` for cloud agents).
2. Open a **PR** against `main`; fill `.github/pull_request_template.md`.
3. Wait for the **Netlify Deploy Preview** (`deploy-preview-<PR#>--arcsign.netlify.app`, linked on the PR).
4. **Verify on the preview** before calling work done: desktop and ~375px mobile (screenshots or browser check).
5. Report **PR URL** and **preview URL** in your summary.

**Never** merge to `main`, force-push, rebase pushed commits, or delete branches without Jesus’s explicit OK on that PR. To update with latest `main`, merge `main` into your branch.

Do **not** change Netlify site settings in the UI. Do **not** commit secrets or log them.

## Section ownership

Stay in the area you were asked to change:

| Area | Paths / source |
|------|----------------|
| Arc core (marketing, mockup, functions) | Root HTML, `assets/`, `tools/sign-mockup/`, `netlify/` |
| GWB league | `apps/gwb/` → publish `gwb-fe006a16/` |
| Dynasty league | `apps/dynasty/` → publish `dynasty-1581d86a/` |
| Corderitos (guardería) | `guarderia-dfe200bb/` |
| NovaStage | `novastage-2c397e45/` |
| Crooke heritage | `crooke-7c3a9e12/` |

Cross-cutting edits (`netlify.toml`, `sitemap.xml`, shared headers) need extra care and hidden-page checks below.

## Hidden URL-only pages (family / league)

These paths are **not linked from public Arc pages**, **must not appear in `sitemap.xml`**, and **must stay noindex**. On any PR that touches them, `sitemap.xml`, `robots.txt`, public HTML nav, or `netlify.toml` headers, confirm:

| Path | Noindex |
|------|---------|
| `/gwb-fe006a16/` | `<meta name="robots" content="noindex, nofollow">` in published `index.html`; `X-Robots-Tag: noindex, nofollow` on `/gwb-fe006a16/*` in `netlify.toml` |
| `/dynasty-1581d86a/` | Meta noindex in `index.html`; `X-Robots-Tag: noindex, nofollow` on `/dynasty-1581d86a/*`, `/`, and `index.html` |
| `/guarderia-dfe200bb/` | Meta noindex in `index.html`; `X-Robots-Tag: noindex, nofollow` on `/guarderia-dfe200bb/*` |
| `/novastage-2c397e45/` | Meta noindex in `index.html`; `X-Robots-Tag: noindex, nofollow` on `/novastage-2c397e45/*` |
| `/crooke-7c3a9e12/` (and subpages) | Meta noindex on HTML pages; `X-Robots-Tag: noindex, nofollow` on `/crooke-7c3a9e12/*`, `/`, and `index.html` |

Public sitemap today lists only Arc marketing URLs and `/tools/sign-mockup/` — keep hidden paths out.

Other noindex areas (not league/family): `/thank-you`, `/tools/sign-mockup/proof/*`, `/admin/*`, `/quote-engine/*` — see `netlify.toml`.

## Facts and copy

Prices, stats, names, credentials, and marketing claims must match a **source** (repo docs, owner-approved copy, cited public sources). If you cannot verify, **flag it** — do not invent.

## Quick repo checks

- After service page edits: `tools/export-copy.mjs` and `tools/check-service-pages.mjs` (see root `README.md`).
- After sign mockup edits: `npm test`.
- Versioned assets: never overwrite files in `assets/img/` or cached paths; bump version in filename.
- GA4 is off until Jesus approves; do not add tracking IDs.
