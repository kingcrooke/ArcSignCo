## What changed

<!-- One line per change. For copy changes, show before -> after text. -->

## Why

## Deploy Preview checklist

Review on the Deploy Preview (`deploy-preview-<PR number>--arcsign.netlify.app`), not on production.

- [ ] Page loads on desktop and on a phone (about 390px wide); nothing overlaps or scrolls sideways
- [ ] Header menu, "Get Quote", phone and email links work on a phone
- [ ] Scope Finder: answer all questions, press Finish, result lands in the quote form notes
- [ ] Quote form submits and lands on `/thank-you`; the test submission shows up in Netlify Forms
- [ ] Images look sharp (no visible compression artifacts) and load below the fold as you scroll
- [ ] `/robots.txt` and `/sitemap.xml` load; `sitemap.xml` lists every public page and not `/thank-you`
- [ ] No new claim that can't be backed up (clients, reviews, stats, licenses, addresses, hours, turnaround)
- [ ] No street address anywhere (copy, footer, JSON-LD); location reads "New York / Tri-State"; visible email is arc@arcsignco.com
- [ ] No tracking or analytics ID added without Jesus's approval
- [ ] New images in `assets/img/` use a new version in the filename (existing files are never overwritten)

## Needs action in the Netlify UI

<!-- Anything that can't be done in code, e.g. form notification email, domain settings. Write "None" if nothing. -->

## Approval

- [ ] Jesus reviewed the Deploy Preview and approved merging to `main`
