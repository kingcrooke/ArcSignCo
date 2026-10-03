# Analytics and search verification

All measurement and verification tokens live in one file. Leave any value as an empty string (`""`) until it is approved; empty values load no third-party scripts and emit no verification meta tags.

## Where to paste IDs

Edit **`assets/js/measurement-config.js`**:

| Token | Property | Line (approx.) |
| --- | --- | --- |
| GA4 Measurement ID (`G-XXXXXXXXXX`) | `ga4Id` | line 3 |
| Search Console HTML verification | `googleSiteVerification` | line 4 |
| Bing Webmaster HTML verification | `bingSiteVerification` | line 5 |

Only the homepage (`index.html`) injects the Search Console and Bing meta tags when those strings are set. Apex DNS for `arcsignco.com` is on Google Cloud DNS; a `google-site-verification` TXT record may already exist there. The meta tag is an optional HTML method and does not replace DNS verification.

## GA4 behavior

- **`assets/js/measurement.js`** reads `ga4Id`. If it does not match `G-` plus uppercase letters and digits, **no** `gtag/js` request runs.
- The same config + loader pair is linked from every public HTML page (homepage, thank-you, portfolio, 404, all service pages, sign mockup tool, mockup proof page).

### Events (when `ga4Id` is set)

| Event | When |
| --- | --- |
| `page_view` | Automatic via GA4 config on each page |
| `generate_lead` (`form_name: quote-request`) | `/thank-you` after a real `quote-request` submit in the same tab, once per submit (`sessionStorage` `arcQuote`) |
| `click_to_call` | `tel:` link clicks on homepage, service pages, and portfolio |
| `mockup_pdf_download` | Sign mockup tool — concept PDF download |
| `mockup_approval_link_created` | Sign mockup tool — approval link created |

Mark `generate_lead` as a key event in the GA4 property after go-live.

### Privacy copy

The sign mockup tool already states that photos stay on the device unless an approval link is created. The site has no separate privacy policy page today. If one is added later, include a short note that the public site may use analytics cookies when measurement is turned on.

## How to confirm each works

### GA4

1. Set `ga4Id` in `measurement-config.js` on a Deploy Preview branch (do not merge a real ID without approval).
2. Open any page, DevTools → Network, filter `gtag` — a request to `googletagmanager.com/gtag/js?id=G-…` should appear.
3. Submit the quote form to `/thank-you` and check GA4 DebugView or Realtime for `generate_lead`.
4. With `ga4Id` still `""` in the repo, `npm test` runs `tools/check-analytics.mjs`, which asserts no gtag script is injected.

### Google Search Console (HTML tag method)

1. Set `googleSiteVerification` to the `content` value from Search Console (not the full meta tag).
2. Deploy preview, view homepage source or Elements — `<meta name="google-site-verification" content="…">` should appear in `<head>`.
3. Use Search Console’s **Verify** for the HTML tag method, or rely on the existing apex TXT record if that method is already verified.

### Bing Webmaster

1. Set `bingSiteVerification` to the `content` value for `msvalidate.01`.
2. Deploy preview — confirm `<meta name="msvalidate.01" content="…">` on the homepage.
3. Complete verification in Bing Webmaster Tools.

## Automated checks

```bash
npm test
node tools/check-analytics.mjs
```

`tools/check-analytics.mjs` verifies every page includes the shared scripts, the committed config keeps `ga4Id` empty, and loader logic with test ID `G-TEST12345` would request gtag.
