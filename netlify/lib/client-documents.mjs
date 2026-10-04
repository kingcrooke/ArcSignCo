import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { formatMoney, CLIENT_TAX_LINE } from "./quote-engine-pricing.mjs";

export { CLIENT_TAX_LINE };

const TPL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../templates/quote-engine");

const TEMPLATE_INSTRUCTION_PATTERNS = [
  /^\*Repeat the row for each line item\.\*$/i,
  /^Show prices before tax\./i,
  /^Print a tax line of/i,
  /engine_until_confirmed/i,
];

function readTpl(name) {
  return readFileSync(path.join(TPL_DIR, name), "utf8");
}

function merge(template, vars) {
  const merged = template.replace(/\{\{(\w+)\}\}/g, (_, key) => (vars[key] != null ? String(vars[key]) : ""));
  return merged.replace(/\{\{\w+\}\}/g, "");
}

function stripTemplateInstructions(md) {
  return md
    .split("\n")
    .filter(line => !TEMPLATE_INSTRUCTION_PATTERNS.some(re => re.test(line.trim())))
    .join("\n");
}

function escHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Inline **bold** and [text](url) after escaping plain segments. */
export function renderInlineMarkdown(raw) {
  const text = String(raw ?? "");
  let out = "";
  let i = 0;
  while (i < text.length) {
    const link = text.slice(i).match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (link) {
      out += `<a href="${escHtml(link[2])}">${escHtml(link[1])}</a>`;
      i += link[0].length;
      continue;
    }
    const bold = text.slice(i).match(/^\*\*([^*]+)\*\*/);
    if (bold) {
      out += `<strong>${escHtml(bold[1])}</strong>`;
      i += bold[0].length;
      continue;
    }
    const nextSpecial = text.slice(i).search(/\[|\*\*/);
    const end = nextSpecial === -1 ? text.length : i + nextSpecial;
    out += escHtml(text.slice(i, end));
    i = end;
  }
  return out;
}

function mdToHtml(md) {
  const lines = md.split("\n");
  const out = [];
  let inTable = false;
  for (const line of lines) {
    if (line.startsWith("# ")) {
      out.push(`<h1>${renderInlineMarkdown(line.slice(2))}</h1>`);
      continue;
    }
    if (line.startsWith("## ")) {
      out.push(`<h2>${renderInlineMarkdown(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith("|")) {
      if (!inTable) {
        inTable = true;
        out.push("<table>");
      }
      if (/^\|\s*-/.test(line)) continue;
      const cells = line.split("|").slice(1, -1).map(c => c.trim());
      out.push(`<tr>${cells.map(c => `<td>${renderInlineMarkdown(c)}</td>`).join("")}</tr>`);
      continue;
    }
    if (inTable && !line.startsWith("|")) {
      out.push("</table>");
      inTable = false;
    }
    if (line.trim() === "---") {
      out.push("<hr>");
      continue;
    }
    if (line.trim() === "") {
      out.push("");
      continue;
    }
    if (line.startsWith("- ")) {
      out.push(`<p>${renderInlineMarkdown(line.slice(2))}</p>`);
      continue;
    }
    out.push(`<p>${renderInlineMarkdown(line)}</p>`);
  }
  if (inTable) out.push("</table>");
  return out.join("\n");
}

function docShell(title, body, draft) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow">
<title>${escHtml(title)}</title>
<style>
body{font-family:Georgia,serif;max-width:720px;margin:2rem auto;line-height:1.5;color:#1a1a1a}
table{width:100%;border-collapse:collapse;margin:1rem 0;font-family:system-ui,sans-serif;font-size:.95rem}
td,th{border-bottom:1px solid #ddd;padding:.45rem .3rem;text-align:left}
a{color:#0b1d33}
.draft{background:#fff3cd;padding:.35rem .6rem;font-family:system-ui,sans-serif;font-size:.85rem}
.no-print{margin-top:1.5rem}
@media print{.draft{display:none}.no-print{display:none}}
</style></head><body>
${draft ? '<p class="draft">Draft for review — not yet sent to the client</p>' : ""}
${body}
<p class="no-print"><button type="button" onclick="window.print()">Print or save as PDF</button></p>
</body></html>`;
}

export function assertClientCopySanitized(content, label = "document", opts = {}) {
  const { skipRawMarkdownChecks = false } = opts;
  const forbidden = [
    ["{{", "unmerged template field"],
    ["Show prices before tax", "internal tax instruction"],
    ["Print a tax line", "internal tax instruction"],
    ["engine_until_confirmed", "internal tax key"],
    ["TBD — Jesus", "internal TBD flag"],
  ];
  if (!skipRawMarkdownChecks) {
    forbidden.unshift(["**", "raw markdown bold"], ["](", "raw markdown link"]);
  }
  for (const [needle, reason] of forbidden) {
    if (content.includes(needle)) {
      throw new Error(`${label} contains forbidden ${reason}: ${needle}`);
    }
  }
}

export function buildClientDocument({ lead, quote, kind = "estimate", draft = true }) {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const preliminary = quote.preliminary !== false;
  const tplName = preliminary ? "arc_estimate_template.md" : "arc_proposal_template.md";
  const priced = quote.clientLines || [];

  const rangeRows = priced
    .map(l => `| ${l.label} | ${formatMoney(l.low)} | ${formatMoney(l.high)} |`)
    .join("\n");
  const proposalRows = priced
    .map(l => {
      const amt = l.amount != null ? formatMoney(l.amount) : `${formatMoney(l.low)} – ${formatMoney(l.high)}`;
      return `| 1 | ${l.label} | ${amt} |`;
    })
    .join("\n");

  const taxLine = quote.taxClientLine || CLIENT_TAX_LINE;

  const vars = {
    estimate_no: lead.proposalNo || "DRAFT",
    proposal_no: lead.proposalNo || "DRAFT",
    estimate_date: date,
    proposal_date: date,
    client_name: lead.name || "",
    client_company: lead.company || "",
    bill_to_address: lead.address || "",
    client_email: lead.email || "",
    client_phone: lead.phone || "",
    project_name: lead.projectType || lead.signTypeLabel || "Signage project",
    project_address: lead.address || "",
    estimate_low: formatMoney(quote.low),
    estimate_high: formatMoney(quote.high),
    total: preliminary ? `${formatMoney(quote.low)} – ${formatMoney(quote.high)}` : formatMoney(quote.total),
    tax_note: taxLine,
    preliminary_notice: preliminary ? quote.preliminaryNotice || quote.rangeLabel : "",
    validity_days: String(quote.validityDays || 30),
    lead_time: lead.leadTime || "To be confirmed after artwork and permit path are set.",
    scope_notes: lead.scopeSummary || "",
    acceptor_name: "",
    acceptor_title: "",
    acceptance_date: "",
    range_line_items_table: rangeRows,
    line_items_table: proposalRows,
  };

  const md = stripTemplateInstructions(merge(readTpl(tplName), vars));
  const htmlBody = mdToHtml(md);
  const title = preliminary
    ? `Preliminary estimate — ${vars.client_company || vars.client_name}`
    : `Proposal — ${vars.client_company || vars.client_name}`;
  const html = docShell(title, htmlBody, draft);
  assertClientCopySanitized(html, "client HTML");
  return { html, md, preliminary };
}

export function buildProposalHtml(ctx) {
  return buildClientDocument(ctx).html;
}
