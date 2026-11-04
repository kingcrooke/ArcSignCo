# Arc Visualizer

Concept previews for vehicle wraps, storefront signs, and window graphics. The page is `/visualize/`. Leads are listed at `/visualize/admin/` (noindex, not in the sitemap).

The logo file is pasted by `visualize/js/composite.js` (the same module on the page and in the function), using the sign mockup's quad math in `tools/sign-mockup/js/geometry.js`. The image model is told to leave that area blank. It is never given the logo to redraw. Photos are opened with `tools/sign-mockup/js/images.js`, including iPhone HEIC. Prices stay on the sign mockup rule: the label is **Custom quote** until `ARC_VISUALIZER_ESTIMATES=1` and a rate exists in `netlify/lib/visualizer/pricing.mjs`. That rate table is empty. Do not type a dollar amount into it without Jesus's rates.

## What is stored

Images, sessions, renders, leads, and usage counters all live in the Netlify Blobs store `arc-visualizer`, separate from sign-mockup proofs.

- Images: `v1/<deploy context>/files/<id>`
- Records: `v1/<deploy context>/records/<kind>/<id>.json`

Netlify Database is not used. This account returns "database feature not available" and that failed the deploy, so records follow the same Blobs pattern as the sign-mockup approval links.

## Environment variables

Set these in Netlify (Site configuration → Environment variables). Do not commit values.

| Variable | Required | Purpose |
|---|---|---|
| `VISUALIZER_ADMIN_PASSWORD` | Yes, for the leads list | Password for `/visualize/admin/`. If unset, sign-in returns 503. |
| `RESEND_API_KEY` | Yes, to email leads | [Resend](https://resend.com) API key. Without it the lead is still stored and the admin row says `saved-no-email-key`. |
| `VISUALIZER_EMAIL_FROM` | Yes, to email leads | From address Resend will accept, for example `Arc Signage Co <arc@arcsignco.com>` after the domain is verified. |
| `VISUALIZER_LEAD_TO` | No | Inbox. Defaults to `arc@arcsignco.com`. |
| `VISUALIZER_IP_SALT` | No | Salt for the daily IP hash. Defaults to a fixed string. |
| `XAI_API_KEY` | No, for Grok images | xAI API key. When set, image generation uses Grok Imagine first. |
| `XAI_BASE_URL` | No | Defaults to `https://api.x.ai/v1`. |
| `ARC_XAI_IMAGE_MODEL` | No | Defaults to `grok-imagine-image-2.0`, the current Imagine image model in the xAI docs. |
| `ARC_XAI_IMAGE_RESOLUTION` | No | `1k` (default) or `2k`. |
| `GEMINI_API_KEY` | No | Fallback image model, and the website-scan text model. On Netlify, leave this unset and enable AI Gateway instead. The gateway injects `GEMINI_API_KEY` and `GOOGLE_GEMINI_BASE_URL`. Image model: `gemini-2.5-flash-image`. Text scan: `gemini-2.5-flash`. |
| `GOOGLE_GEMINI_BASE_URL` | Automatic with AI Gateway | Do not set this yourself if you want gateway routing. |
| `OPENAI_API_KEY` | No | Chat extraction, and image generation only when the base URL is OpenAI's own (the gateway does not serve image models). A gateway placeholder key is ignored for images. |
| `OPENAI_BASE_URL` | Automatic with AI Gateway | Direct OpenAI image calls are skipped when this host is Netlify. |
| `ARC_IMAGE_PROVIDER` | No | `auto` (default), `xai`, `gemini`, `openai`, or `stub`. `auto` tries xAI, then Gemini, then direct OpenAI images, then a layout placeholder. A failed call falls through to the next one. |
| `ARC_GEMINI_IMAGE_MODEL` | No | Defaults to `gemini-2.5-flash-image`. |
| `ARC_GEMINI_TEXT_MODEL` | No | Defaults to `gemini-2.5-flash`. |
| `ARC_OPENAI_IMAGE_MODEL` | No | Defaults to `gpt-image-1`. |
| `ARC_VISUALIZER_ESTIMATES` | No | Set to `1` to allow a ballpark. With the empty rate table the page still says Custom quote. |
| `TURNSTILE_SITE_KEY` | No | Cloudflare Turnstile site key. Shown on generate and on the lead form when set. |
| `TURNSTILE_SECRET_KEY` | No | Verified on generate and on the lead form. Other limits still apply when this is unset. |

Missing image keys do not break the flow. The function draws a layout placeholder, says so on the page, and still pastes the uploaded logo.

## Grok Imagine

Image calls go to `https://api.x.ai/v1` with model `grok-imagine-image-2.0` ([xAI image generation](https://docs.x.ai/developers/model-capabilities/images/generation), [image editing](https://docs.x.ai/developers/model-capabilities/images/editing)).

- No uploaded photo: `POST /v1/images/generations`.
- A vehicle photo, storefront photo, or a previous preview: `POST /v1/images/edits`. The picture is a base64 data URI (`image.url` plus `type: "image_url"`). An optional inspiration image is a second source. The API accepts up to five source images. The logo file is not one of them.
- The OpenAI SDK's multipart `images.edit()` is not the xAI edit call. xAI wants JSON.
- Output is requested as `b64_json` because returned URLs are temporary. Resolution is `1k` unless `ARC_XAI_IMAGE_RESOLUTION=2k`. Text-only generations use aspect `3:2`. Edits leave aspect ratio unset so the uploaded photo's aspect is kept.
- The real logo is still pasted afterward by `visualize/js/composite.js`. The prompt tells the model to leave that area blank.

## Limits

Per session: 3 concepts each time (a second set is allowed once), 4 bare-vehicle studio shots, and 1 written revision that changes only the concept it was asked to change. The function always returns all 3 concepts; a failed image call is replaced with the layout placeholder so the count does not drop. Per IP per UTC day: 30 scans, 16 preview images (vehicle shots and concepts share this), 4 revisions, 5 leads, 40 uploads, 10 admin sign-in failures. A lead, a vehicle shot, or a concept set sooner than 3 seconds after the session starts is rejected. A hidden fax field is dropped. The function also has a Netlify rate limit of 40 requests a minute per IP.

The page also posts the quote to the Netlify Form `visualizer-quote` (and problem notes to `visualizer-report`). Add an email notification for `visualizer-quote` to arc@arcsignco.com in Site configuration → Forms, the same place as `quote-request`. The existing Resend lead email still goes to arc@arcsignco.com when `RESEND_API_KEY` is set. SMS consent checkboxes are optional and start unchecked.

## Later

Fleet sets, extra angles, a before/after GIF, a color-swatch library, a quote builder, Stripe deposits, SMS, a public share gallery, prompt ratings, white-label shops, and a homepage button pointing here. The homepage and service pages were left unchanged so this ship does not alter the live marketing site. A measured, non-AI storefront mockup remains `/tools/sign-mockup/`.
