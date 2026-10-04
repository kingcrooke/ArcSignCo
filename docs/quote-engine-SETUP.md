# Quote Engine lite — setup (Jesus)

This doc is for turning on the **private Quote Engine** on Netlify: Google Sheet lead log, form webhooks, and the hidden admin URL. The admin path is **`/ops-qel16cb/`** (not linked from the public site).

---

## 1. Netlify environment variables

In **Netlify → Site (arcsign) → Project configuration → Environment variables**, add these for **Production** (and **Deploy previews** if you want to test leads there).

| Variable | Required | What to put |
|----------|----------|-------------|
| `QUOTE_ENGINE_PASSWORD` | **Yes** | A long random password for the ops admin. Share only with Arc staff. |
| `QUOTE_ENGINE_SHEET_ID` | For Google Sheet | The ID from the Sheet URL (`https://docs.google.com/spreadsheets/d/`**`THIS_PART`**/edit). |
| `QUOTE_ENGINE_GOOGLE_CREDENTIALS` | For Google Sheet | The **full JSON** of a Google Cloud service account key (single line or pasted JSON). |
| `QUOTE_ENGINE_WEBHOOK_SECRET` | Recommended | A random string. Netlify sends it as header **`X-Quote-Engine-Secret`** on form webhooks. |

If Sheet variables are missing, the site **still works**: leads are stored in **Netlify Blobs** and the Sheet API is mocked in tests. Email notifications from Netlify Forms are unchanged.

**Never commit secret values.** Names only are listed in the root `README.md`.

---

## 2. Google Sheet (lead log)

1. In Google Drive (jc@ account), create a spreadsheet named e.g. **Arc Quote Engine — Lead log**.
2. Add a tab named exactly **`LeadLog`**.
3. Row **1** headers (columns A–M):

   `lead_id` | `received_at` | `source` | `status` | `quoted_value` | `next_step` | `name` | `email` | `phone` | `company` | `address` | `project_type` | `scope_summary`

4. **Google Cloud console** (same Google account or a small project):
   - Enable **Google Sheets API**.
   - Create a **Service account** → **Keys** → **Add key** → JSON.
   - Copy the entire JSON into `QUOTE_ENGINE_GOOGLE_CREDENTIALS`.
5. In the Sheet, **Share** with the service account email (`….iam.gserviceaccount.com`) as **Editor**.

Status, quoted value, and next step are updated from the admin when you click **Save lead**.

---

## 3. Form webhooks (quote-request + sign-estimate-request)

Scope Finder data is already included on **`quote-request`** via the hidden **`scope-finder`** field — no separate webhook.

For **each** form below, add an outgoing webhook in Netlify:

**Netlify → Forms → (form name) → Form submission notifications → Add notification → Webhook**

| Form name | Webhook URL |
|-----------|-------------|
| `quote-request` | `https://arcsignco.com/api/quote-engine/webhook` |
| `sign-estimate-request` | `https://arcsignco.com/api/quote-engine/webhook` |

On **Deploy Previews**, use the preview host instead, e.g.  
`https://deploy-preview-NN--arcsign.netlify.app/api/quote-engine/webhook`

If `QUOTE_ENGINE_WEBHOOK_SECRET` is set, configure the webhook to send header:

- **Name:** `X-Quote-Engine-Secret`  
- **Value:** (same as the env var)

Netlify’s built-in email notifications to **arc@arcsignco.com** can stay as they are.

---

## 4. Open the admin

1. Deploy the branch/PR after env vars are set.
2. Visit (production example):  
   **`https://arcsignco.com/ops-qel16cb/`**
3. Enter **`QUOTE_ENGINE_PASSWORD`**.
4. Workflow:
   - Pick a lead in the log.
   - Adjust calculator fields → **Calculate** (uses placeholder rates until PM drops in real **`quote-rates`** numbers).
   - Set **Status**, **Quoted value**, **Next step** → **Save lead**.
   - **Generate proposal draft** → printable HTML (use **Print / Save as PDF** in the browser) or append **`.pdf`** to the API URL for a simple PDF.

Proposal copy is client-facing: no vendor names or sub costs; contact **(347) 450-2110**, **jc@arcsignco.com**, Mon–Fri 8 AM–6 PM; Arc third-person voice.

---

## 5. When Construction PM sends real rates

1. Edit **`netlify/lib/quote-rates.mjs`** (or replace values from their spreadsheet).
2. Set **`PLACEHOLDER = false`** and bump **`RATES_VERSION`**.
3. Merge via PR; no calculator code changes required.

---

## 6. Checklist

- [ ] `QUOTE_ENGINE_PASSWORD` set on Netlify  
- [ ] Sheet created with **`LeadLog`** tab and headers  
- [ ] Service account JSON in `QUOTE_ENGINE_GOOGLE_CREDENTIALS`  
- [ ] Sheet shared with service account  
- [ ] `QUOTE_ENGINE_SHEET_ID` set  
- [ ] Webhooks on **`quote-request`** and **`sign-estimate-request`**  
- [ ] Optional webhook secret header  
- [ ] Admin URL tested on Deploy Preview before production  

---

## Troubleshooting

| Symptom | What to check |
|---------|----------------|
| Admin says Unauthorized | Password env on this deploy context; hard refresh after saving env. |
| Leads list empty | Webhook URL and form names; Netlify Forms → Submissions still arriving; without Sheet, check Blobs after a test submit. |
| Sheet not updating | Service account editor access; tab name **`LeadLog`**; Netlify function logs. |
| Calculator shows PLACEHOLDER | Expected until PM rates are merged and `PLACEHOLDER` is false. |

Internal plan reference: `/opt/cursor/artifacts/docs/quote-engine-lite-PLAN.md` (planning artifact; not published on the site).
