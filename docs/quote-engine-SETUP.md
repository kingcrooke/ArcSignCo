# Quote Engine lite — setup (Jesus)

Step-by-step to turn on the **private Quote Engine** on Netlify. Admin URL: **`/ops-qel16cb/`** (not linked from the public site).

---

## Step 1 — Ops password (required)

1. Open **Netlify → Site (arcsign) → Project configuration → Environment variables**.
2. Add **`QUOTE_ENGINE_PASSWORD`** = a long random password (Production, and Deploy previews if you test there).
3. Save. Redeploy or wait for the next deploy so functions see it.

---

## Step 2 — Google Sheet lead log (recommended: Apps Script, one URL)

### 2a. Create the Sheet

1. In Google Drive (jc@), create **Arc Quote Engine — Lead log**.
2. Rename the first tab to **`LeadLog`**.
3. Row **1**, columns A–M:

   `lead_id` · `received_at` · `source` · `status` · `quoted_value` · `next_step` · `name` · `email` · `phone` · `company` · `address` · `project_type` · `scope_summary`

### 2b. Add the Apps Script (recommended)

No Google Cloud project and no JSON key.

1. In the spreadsheet: **Extensions → Apps Script**.
2. Delete any starter code. Paste everything from **`docs/quote-engine-sheet-apps-script.gs`** in this repo → **Save**.
3. (Optional) **Project settings → Script properties** → add property **`SECRET`** = a random string (same value as Netlify **`QUOTE_ENGINE_SHEET_APP_SECRET`** in step 2d).
4. **Deploy → New deployment → Type: Web app**
   - **Execute as:** Me (jc@…)
   - **Who has access:** Anyone  
   (The URL is unguessable; optional `SECRET` above adds a check.)
5. Copy the **Web app URL** (ends in `/exec`).

### 2c. Netlify variables for Apps Script

| Variable | Required | Value |
|----------|----------|--------|
| **`QUOTE_ENGINE_SHEET_APP_URL`** | **Yes** (for Sheet) | The Web app URL from step 2b |
| **`QUOTE_ENGINE_SHEET_APP_SECRET`** | Optional | Same as Apps Script `SECRET` if you set one |

### 2d. Alternative — Service account + Sheets API (advanced)

Use this only if Apps Script is not an option.

| Variable | Value |
|----------|--------|
| **`QUOTE_ENGINE_SHEET_ID`** | ID from the Sheet URL |
| **`QUOTE_ENGINE_GOOGLE_CREDENTIALS`** | Full JSON key for a Google Cloud service account with Sheets API |

Share the Sheet with the service account email as **Editor**. Steps: enable Sheets API, create service account, download JSON — same as a typical Google API setup.

If **no** Sheet variables are set, leads still save to **Netlify Blobs**; email form notifications are unchanged.

---

## Step 3 — Form webhooks

Scope Finder rides on **`quote-request`** (hidden **`scope-finder`** field). No extra form.

For **each** form:

**Netlify → Forms → (form) → Form submission notifications → Add notification → Webhook**

| Form | Webhook URL |
|------|-------------|
| `quote-request` | `https://arcsignco.com/api/quote-engine/webhook` |
| `sign-estimate-request` | same |

On a **Deploy Preview**, swap the host, e.g.  
`https://deploy-preview-24--arcsign.netlify.app/api/quote-engine/webhook`

Optional: set **`QUOTE_ENGINE_WEBHOOK_SECRET`** on Netlify and add header **`X-Quote-Engine-Secret`** with the same value on both webhooks.

---

## Step 4 — Use the admin

1. Open **`https://arcsignco.com/ops-qel16cb/`** (or your preview URL + `/ops-qel16cb/`).
2. Enter **`QUOTE_ENGINE_PASSWORD`**.
3. Select a lead → set **Allowances** checkboxes as needed → **Calculate** → set **Status / Quoted value / Next step** → **Save lead** → **Generate proposal draft** (print to PDF in the browser, or open the `.pdf` link).

**PDF on Netlify:** the `.pdf` URL returns the same HTML proposal with a short notice and **Print or save as PDF** (no headless Chromium in functions). Locally, set `QUOTE_ENGINE_PDF_PLAYWRIGHT=1` if you need server-generated PDF bytes.

**Allowances:** by default, only **DOB filing** (when Permits likely) and **electrician** (when Permits likely or Lit) are checked. LPC, PE/RA drawings, and Sign Hanger stay off until Jesus checks them.

Proposal copy is client-facing: no vendor or sub costs; **(347) 450-2110**, **jc@arcsignco.com**, Mon–Fri 8 AM–6 PM; Arc third-person voice.

---

## Step 5 — Import the Construction PM rate card (required for real math)

Real rates **must not** live in GitHub (public repo). The repo ships only a **placeholder** card with fake numbers.

1. After deploy, open **`/ops-qel16cb/`** and sign in.
2. In **Rate card**, choose the PM file **`arc_pricing_inputs.json`** (schema matches the placeholder).
3. Click **Upload to Blobs**. Netlify stores it in the **`arc-quote-engine-rate-card`** Blobs store (site-scoped, not in git).
4. Repeat on **Production** after you trust a preview import. Each environment has its own Blobs.

Until import, the calculator uses the placeholder card and shows **PLACEHOLDER RATES** in admin.

Internal **TBD — Jesus to confirm** flags appear in admin and the calculator only — never on client proposals or estimates.

---

## Checklist

- [ ] `QUOTE_ENGINE_PASSWORD`
- [ ] Sheet + **`LeadLog`** headers
- [ ] **`QUOTE_ENGINE_SHEET_APP_URL`** (recommended) *or* service account pair
- [ ] Webhooks on **`quote-request`** and **`sign-estimate-request`**
- [ ] **Rate card imported** via admin (Blobs)
- [ ] Admin tested on Deploy Preview

---

## Troubleshooting

| Symptom | Check |
|---------|--------|
| Unauthorized | Password env on this deploy; hard refresh. |
| Empty lead list | Webhook URL; form names; submit a test lead. |
| Sheet not updating | Apps Script deployed as Web app; tab **`LeadLog`**; function logs in Netlify. |
| PLACEHOLDER in calculator | Import rate card JSON in admin (Step 5). |
| Import failed | Deploy must run on Netlify (Blobs); check function logs. |

Never commit secrets or the PM **`arc_pricing_inputs.json`**. Variable names are also in the root **`README.md`**.
