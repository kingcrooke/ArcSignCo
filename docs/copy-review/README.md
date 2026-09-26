# Copy review: service pages (Phase C + G4)

**Status: draft.** Everything in this folder is pending review by Sales Ops and a copy editor, and Jesus's OK, before it merges. The URL slugs are proposals pending Jesus's approval.

| Page | Proposed URL | Review file |
|---|---|---|
| Sign permits & shop drawings | `/sign-permits-shop-drawings/` | [sign-permits-shop-drawings.md](sign-permits-shop-drawings.md) |
| ADA & tactile signs | `/ada-signs/` | [ada-signs.md](ada-signs.md) |
| Channel letters | `/channel-letters/` | [channel-letters.md](channel-letters.md) |
| Construction site signs | `/construction-signs/` | [construction-signs.md](construction-signs.md) |

The page files are generated from the HTML by `tools/export-copy.mjs`, so they match what is on the Deploy Preview word for word. To change wording, edit the HTML, then re-run:

```bash
mkdir -p /tmp/sd-tools && (cd /tmp/sd-tools && npm i jsdom)
NODE_PATH=/tmp/sd-tools/node_modules node tools/export-copy.mjs
NODE_PATH=/tmp/sd-tools/node_modules node tools/check-service-pages.mjs
```

## Wording rules these pages follow

- Arc **coordinates** permits. It does not file DOB applications as a licensed applicant, stamp drawings, or hold a Licensed Sign Hanger, electrical, or PE/RA license. The pages say Arc works with those licensed parties where the job requires them.
- No promises of approvals, inspections, sign-offs, or production times. Agencies, architects, and inspectors make those calls.
- ADA signs are "made to the project's drawings and specs, prepared to the applicable standards for architect and inspector review." Never "ADA compliant" or "certified."
- Construction page: NYC Building Code §3301.9.7 and §3301.9.8 limit other signs and advertising on fences and sidewalk sheds and ban illuminated business signs on them. The page does not offer branded fence wraps or shed advertising in NYC.
- The 24-hour quote target is stated only as the site already states it: it starts once drawings, photos, and site details are in.
- Every code or regulation reference was checked against the public source listed in each page's "Public sources" section (checked September 2026). Anything that couldn't be verified was left out.
- No clients, projects, reviews, ratings, stats, years in business, hours, or street address.

## Shared text on all four pages

**Header** (same as the homepage): About · Services · Work · Scope Finder · Call (917) 569-1076 · Request a quote (links go to the homepage sections). On phones, the Call and Request a quote buttons move to a bottom bar that appears once the page's own quote buttons scroll out of view.

**Footer:**

- Tagline: "Full-service signage for New York and the tri-state area: design, fabrication, permit coordination, ADA signage, and installation." (Same as the homepage after the Sales Ops wording pass.)
- Social icon links: "Arc Signage Co on Instagram (opens in a new tab)", "Arc Signage Co on Facebook (opens in a new tab)" (screen-reader labels)
- Links: About · Services · Work · Scope Finder · Contact · Google Business Profile (hidden until the URL is confirmed)
- Services: Sign permits & shop drawings · ADA & tactile signs · Channel letters · Construction site signs
- © 2026 Arc Signage Co LLC — New York / Tri-State · (917) 569-1076 · arc@arcsignco.com

## Homepage text added in this PR

- Services cards, new links under four cards:
  - ADA & Code Signs: "More on ADA & tactile signs"
  - LED & Illuminated: "More on channel letters"
  - Permits & Submittals: "More on permits & shop drawings"
  - Construction Signs: "More on construction site signs"
- Footer: the same Instagram/Facebook icons and "Services" link row as the service pages.
- JSON-LD description (not visible): "…design, fabrication, permitting, ADA compliance, and installation…" → "…design, fabrication, permit coordination, ADA signage, and installation…"

## Existing homepage wording flagged for review (not changed here)

The Sales Ops wording pass (PR #3) already fixed "ADA compliance", "DOB permits … stamped drawing coordination", and "Built to pass review". Two items remain:

- Construction Signs card: "hoarding graphics, project IDs." In NYC, §3301.9.7 restricts these on fences and sheds; consider "project information panels" instead.
- Hero proof tile "ADA — Code-first packages." Reads close to an outcome promise.
