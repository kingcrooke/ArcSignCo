import { isQuoteEngineForm } from "./quote-leads.mjs";
import { computeQuote } from "./quote-compute.mjs";
import { buildProposalHtml, buildProposalPdfBytes } from "./proposal.mjs";
import { ingestFormPayload, listLeadsMerged, getLeadBlob, updateLeadStatus } from "./quote-engine-store.mjs";
import { json, unauthorized, verifyOpsAuth, verifyWebhook, ROBOTS } from "./quote-engine-auth.mjs";
import { validateRateCard } from "./rate-card-validate.mjs";
import { rateCardStatus, saveRateCard } from "./rate-card-store.mjs";

function requireAuth(req) {
  const auth = verifyOpsAuth(req);
  if (!auth.ok) return unauthorized();
  return null;
}

export async function handleQuoteEngine(req, context) {
  const url = new URL(req.url);
  const path = url.pathname.replace(/\/$/, "") || "/";

  if (path === "/api/quote-engine/webhook" && req.method === "POST") {
    if (!verifyWebhook(req)) return json({ error: "Forbidden" }, 403);
    let payload;
    try {
      payload = await req.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }
    const formName = payload?.form_name || payload?.formName;
    if (!isQuoteEngineForm(formName)) return json({ ok: true, skipped: true, form: formName });
    try {
      const result = await ingestFormPayload(payload);
      return json({ ok: true, id: result.lead.id, sheet: result.sheet });
    } catch (err) {
      console.error("quote-engine ingest", err);
      return json({ ok: false, error: "Ingest failed" }, 500);
    }
  }

  if (path === "/api/quote-engine/leads" && req.method === "GET") {
    const deny = requireAuth(req);
    if (deny) return deny;
    const data = await listLeadsMerged();
    return json(data);
  }

  const leadMatch = path.match(/^\/api\/quote-engine\/leads\/([^/]+)$/);
  if (leadMatch && req.method === "GET") {
    const deny = requireAuth(req);
    if (deny) return deny;
    const lead = await getLeadBlob(decodeURIComponent(leadMatch[1]));
    if (!lead) return json({ error: "Not found" }, 404);
    return json({ lead });
  }

  if (leadMatch && req.method === "PATCH") {
    const deny = requireAuth(req);
    if (deny) return deny;
    const body = await req.json();
    const lead = await updateLeadStatus(decodeURIComponent(leadMatch[1]), {
      status: body.status,
      quotedValue: body.quotedValue,
      nextStep: body.nextStep,
    });
    return json({ lead });
  }

  if (path === "/api/quote-engine/rate-card" && req.method === "GET") {
    const deny = requireAuth(req);
    if (deny) return deny;
    const status = await rateCardStatus();
    return json(status);
  }

  if (path === "/api/quote-engine/rate-card" && req.method === "POST") {
    const deny = requireAuth(req);
    if (deny) return deny;
    let body;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }
    const card = body.rateCard || body;
    const v = validateRateCard(card);
    if (!v.ok) return json({ error: v.error }, 400);
    try {
      await saveRateCard(card);
    } catch (err) {
      console.error("rate-card save", err);
      return json({ error: "Could not save rate card (Blobs unavailable in this environment?)" }, 500);
    }
    const status = await rateCardStatus();
    return json({ ok: true, ...status });
  }

  if (path === "/api/quote-engine/calculate" && req.method === "POST") {
    const deny = requireAuth(req);
    if (deny) return deny;
    const body = await req.json();
    const input = body.input || body.calculatorInput || {};
    const surveyConfirmed = Boolean(body.surveyConfirmed);
    const quote = await computeQuote(input, { surveyConfirmed });
    return json({ quote });
  }

  const proposalMatch = path.match(/^\/api\/quote-engine\/proposal\/(.+)$/);
  if (proposalMatch && req.method === "GET") {
    const deny = requireAuth(req);
    if (deny) return deny;
    const rawId = proposalMatch[1];
    const asPdf = rawId.endsWith(".pdf");
    const id = decodeURIComponent(asPdf ? rawId.slice(0, -4) : rawId);
    const lead = (await getLeadBlob(id)) || {
      id,
      name: url.searchParams.get("name") || "Sample Client",
      company: "Sample Retail Co",
      address: "123 Main Street, Brooklyn, NY",
      email: "client@example.com",
      scopeSummary: "Storefront channel letters, face-lit, ground floor install.",
      projectType: "Channel letters",
      calculatorInput: {
        signType: "Channel letters",
        quantity: 1,
        sizeW: 12,
        sizeH: 2.5,
        sizeUnit: "ft",
        lit: "Lit",
        height: "Ground floor, under 12 ft",
        boroughZone: "brooklyn",
        permitsRequested: true,
      },
    };
    const surveyConfirmed = url.searchParams.get("surveyConfirmed") === "1";
    let quote = await computeQuote(lead.calculatorInput || {}, { surveyConfirmed });
    const quoteParam = url.searchParams.get("total");
    if (quoteParam && surveyConfirmed) {
      quote = { ...quote, total: Number(quoteParam) || quote.total };
    }
    if (asPdf) {
      const bytes = await buildProposalPdfBytes({ lead, quote, draft: true });
      if (bytes) {
        return new Response(bytes, {
          headers: {
            ...ROBOTS,
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="arc-estimate-${id}.pdf"`,
            "Cache-Control": "no-store",
          },
        });
      }
      const html = buildProposalHtml({ lead, quote, draft: true, pdfFallback: true });
      return new Response(html, {
        headers: {
          ...ROBOTS,
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `inline; filename="arc-estimate-${id}.html"`,
          "Cache-Control": "no-store",
          "X-Quote-Engine-Pdf-Fallback": "html",
        },
      });
    }
    const html = buildProposalHtml({ lead, quote, draft: true });
    return new Response(html, {
      headers: { ...ROBOTS, "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  if (path === "/api/quote-engine/health" && req.method === "GET") {
    return json({ ok: true, service: "quote-engine" });
  }

  return json({ error: "Not found" }, 404);
}

export const QUOTE_ENGINE_PATHS = [
  "/api/quote-engine/webhook",
  "/api/quote-engine/leads",
  "/api/quote-engine/leads/:id",
  "/api/quote-engine/calculate",
  "/api/quote-engine/rate-card",
  "/api/quote-engine/proposal/:id",
  "/api/quote-engine/proposal/:id.pdf",
  "/api/quote-engine/health",
];
