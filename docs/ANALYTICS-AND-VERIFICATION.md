# Analytics and search verification

GA4 uses JavaScript and loads only when a valid Measurement ID is set. Search Console and Bing HTML verification must appear in **raw HTML** (crawlers do not rely on JS-injected meta tags).

## Where to paste tokens

### GA4 Measurement ID

Edit **`assets/js/measurement-config.js`**, property **`ga4Id`** (line **3**):

```javascript
  ga4Id: "",
```

Set to `G-XXXXXXXXXX` after approval. While empty, no `gtag/js` request runs on any page.

### Google Search Console (HTML meta tag)

Edit **`index.html`** in `<head>`. Uncomment **one** line and replace `PASTE_TOKEN` with the `content` value from Search Console (not the full tag).

Approximate lines **112–113** (immediately above the analytics script tags):

```html
<!-- GSC: uncomment and replace PASTE_TOKEN with the Search Console HTML tag content (see docs/ANALYTICS-AND-VERIFICATION.md). -->
<!-- GSC: <meta name="google-site-verification" content="PASTE_TOKEN"> -->
```

After pasting, the active line should look like:

```html
<meta name="google-site-verification" content="your-token-here">
```

Remove or keep the HTML comment wrapper as preferred; the meta tag must be real markup in the served HTML.

### Bing Webmaster (HTML meta tag)

Same file, lines **114–115**:

```html
<!-- Bing: uncomment and replace PASTE_TOKEN with the msvalidate.01 content from Bing Webmaster. -->
<!-- Bing: <meta name="msvalidate.01" content="PASTE_TOKEN"> -->
```

Active example:

```html
<meta name="msvalidate.01" content="your-token-here">
```

### DNS (Search Console)

Apex DNS for `arcsignco.com` is on Google Cloud DNS (`ns-cloud-a*.googledomains.com`). A `google-site-verification` TXT record may already exist at the apex. That method does not require the meta tag. Do not add a Netlify DNS TXT record for this domain.

## Root verification files (alternative to meta tags)

Netlify serves files from the repository root at the site URL. Either method can verify ownership; use what Search Console or Bing offers.

| Provider | Typical file | Repo location | URL after deploy |
| --- | --- | --- | --- |
| Search Console | `googleXXXXXXXX.html` (exact name from the console) | repository root | `https://arcsignco.com/googleXXXXXXXX.html` |
| Bing Webmaster | `BingSiteAuth.xml` | repository root | `https://arcsignco.com/BingSiteAuth.xml` |

Drop the file contents exactly as downloaded. Commit and deploy; run **Verify** in the respective webmaster tool. Remove the file only if switching methods (meta tag vs file vs DNS).

## GA4 behavior

- **`assets/js/measurement.js`** reads `ga4Id`. If it does not match `G-` plus uppercase letters and digits, **no** `gtag/js` request runs.
- The config + loader pair is linked from every public HTML page (homepage, thank-you, portfolio, 404, all service pages, sign mockup tool, mockup proof page).

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

### Google Search Console

**Meta tag:** Deploy, then **View page source** on the homepage (not only the Elements panel). Confirm `<meta name="google-site-verification" content="…">` is in the first bytes of HTML. Run **Verify** for the HTML tag method.

**HTML file:** Open `https://arcsignco.com/googleXXXXXXXX.html` (or the preview URL with the same path) and confirm the file body matches what Search Console expects.

**DNS:** Confirm the apex TXT record in Google Cloud DNS if that method is already in use.

### Bing Webmaster

**Meta tag:** View homepage source for `<meta name="msvalidate.01" content="…">`, then verify in Bing Webmaster Tools.

**XML file:** Confirm `https://arcsignco.com/BingSiteAuth.xml` returns the auth document.

## Automated checks

```bash
npm test
node tools/check-analytics.mjs
```

`tools/check-analytics.mjs` verifies every page includes the shared scripts, the committed config keeps `ga4Id` empty, homepage verification metas stay commented placeholders, and loader logic with test ID `G-TEST12345` would request gtag.
