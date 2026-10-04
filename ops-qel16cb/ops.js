const TOKEN_KEY = "arcQuoteEngineToken";
const TBD_LABEL = "TBD — Jesus to confirm";

function token() {
  return sessionStorage.getItem(TOKEN_KEY) || "";
}

function authHeaders() {
  const t = token();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function api(path, opts = {}) {
  const res = await fetch(path, {
    ...opts,
    headers: { "Content-Type": "application/json", ...authHeaders(), ...opts.headers },
  });
  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) throw new Error(await res.text());
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return res;
}

const gate = document.getElementById("gate");
const app = document.getElementById("app");
const gatePass = document.getElementById("gatePass");
const gateErr = document.getElementById("gateErr");
const leadList = document.getElementById("leadList");
const storageMode = document.getElementById("storageMode");
const rateCardStatusEl = document.getElementById("rateCardStatus");
const calcForm = document.getElementById("calcForm");
const quoteOut = document.getElementById("quoteOut");

let leads = [];
let active = null;
let lastQuote = null;
let rateCardMeta = null;

function showGate(msg) {
  gate.hidden = false;
  app.hidden = true;
  if (msg) {
    gateErr.hidden = false;
    gateErr.textContent = msg;
  }
}

function showApp() {
  gate.hidden = true;
  app.hidden = false;
  gateErr.hidden = true;
}

document.getElementById("gateBtn").addEventListener("click", () => {
  const pass = gatePass.value.trim();
  if (!pass) return;
  sessionStorage.setItem(TOKEN_KEY, pass);
  boot().catch(err => {
    sessionStorage.removeItem(TOKEN_KEY);
    showGate(err.message || "Could not sign in");
  });
});

function renderLeads() {
  leadList.innerHTML = leads
    .map(
      l => `<li data-id="${encodeURIComponent(l.id)}" aria-current="${active?.id === l.id}">
        <div class="name">${esc(l.company || l.name || l.id)}</div>
        <div class="sub">${esc(l.source)} · ${esc(l.status || "New")} · ${esc(l.receivedAt || "")}</div>
      </li>`,
    )
    .join("");
  leadList.querySelectorAll("li").forEach(li => {
    li.addEventListener("click", () => selectLead(decodeURIComponent(li.dataset.id)));
  });
}

function esc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

function money(n) {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

function allowanceDefaultsFromInput(i) {
  const permits = Boolean(i.permitsRequested);
  const lit = i.lit === "Lit";
  return {
    allowFilingExpediting: permits,
    allowDrawingsStamp: false,
    allowSignHanger: false,
    allowLpc: false,
    allowElectrical: permits || lit,
  };
}

function setAllowanceCheckboxes(i) {
  const d = allowanceDefaultsFromInput(i);
  document.getElementById("fAllowFiling").checked = i.allowFilingExpediting ?? d.allowFilingExpediting;
  document.getElementById("fAllowDrawings").checked = i.allowDrawingsStamp ?? d.allowDrawingsStamp;
  document.getElementById("fAllowHanger").checked = i.allowSignHanger ?? d.allowSignHanger;
  document.getElementById("fAllowLpc").checked = i.allowLpc ?? d.allowLpc;
  document.getElementById("fAllowElectrical").checked = i.allowElectrical ?? d.allowElectrical;
}

function fillCalcFromLead(lead) {
  const i = lead.calculatorInput || {};
  calcForm.signType.value = i.signType || lead.projectType || "";
  calcForm.quantity.value = i.quantity || 1;
  calcForm.sizeW.value = i.sizeW || "";
  calcForm.sizeH.value = i.sizeH || "";
  calcForm.sizeUnit.value = i.sizeUnit || "ft";
  calcForm.lit.value = i.lit || "Not sure";
  calcForm.height.value = i.height || "";
  document.getElementById("fPermitsLikely").checked = Boolean(i.permitsRequested);
  setAllowanceCheckboxes(i);
  document.getElementById("fSurveyConfirmed").checked = Boolean(i.surveyConfirmed);
  document.getElementById("fStatus").value = lead.status || "New";
  document.getElementById("fValue").value = lead.quotedValue || "";
  document.getElementById("fNext").value = lead.nextStep || "";
}

function refreshAllowanceDefaultsFromPermitsLit() {
  const i = {
    permitsRequested: document.getElementById("fPermitsLikely").checked,
    lit: calcForm.lit.value,
  };
  const d = allowanceDefaultsFromInput(i);
  document.getElementById("fAllowFiling").checked = d.allowFilingExpediting;
  document.getElementById("fAllowElectrical").checked = d.allowElectrical;
}

function selectLead(id) {
  active = leads.find(l => l.id === id) || null;
  renderLeads();
  if (active) fillCalcFromLead(active);
  quoteOut.hidden = true;
  lastQuote = null;
}

async function loadLeads() {
  const data = await api("/api/quote-engine/leads");
  leads = data.leads || [];
  storageMode.textContent = data.mode ? `Storage: ${data.mode}${data.error ? " (sheet fallback)" : ""}` : "";
  renderLeads();
  if (!active && leads[0]) selectLead(leads[0].id);
}

async function loadRateCardStatus() {
  try {
    rateCardMeta = await api("/api/quote-engine/rate-card");
    const src = rateCardMeta.placeholder ? "placeholder fallback" : rateCardMeta.source || "imported";
    rateCardStatusEl.textContent = `Rate card: ${rateCardMeta.name || rateCardMeta.version || "unknown"} (${src}) · ${rateCardMeta.signTypeCount ?? "?"} sign types`;
  } catch {
    rateCardStatusEl.textContent = "Rate card: status unavailable";
  }
}

function calcInputFromForm() {
  const fd = new FormData(calcForm);
  return {
    signType: fd.get("signType"),
    quantity: Number(fd.get("quantity")) || 1,
    sizeW: Number(fd.get("sizeW")) || 0,
    sizeH: Number(fd.get("sizeH")) || 0,
    sizeUnit: fd.get("sizeUnit"),
    lit: fd.get("lit"),
    height: fd.get("height"),
    permitsRequested: fd.get("permitsRequested") === "on",
    allowFilingExpediting: fd.get("allowFilingExpediting") === "on",
    allowDrawingsStamp: fd.get("allowDrawingsStamp") === "on",
    allowSignHanger: fd.get("allowSignHanger") === "on",
    allowLpc: fd.get("allowLpc") === "on",
    allowElectrical: fd.get("allowElectrical") === "on",
    boroughZone: active?.boroughZone || active?.calculatorInput?.boroughZone || "brooklyn",
  };
}

document.getElementById("fPermitsLikely").addEventListener("change", refreshAllowanceDefaultsFromPermitsLit);
calcForm.lit.addEventListener("change", refreshAllowanceDefaultsFromPermitsLit);

function lineAmount(l, preliminary) {
  if (l.quoteRequired) return '<span class="quote-required">Quote required</span>';
  if (preliminary) return `${money(l.low)} – ${money(l.high)}`;
  const mid = roundLineMid(l.low, l.high);
  return money(mid);
}

function roundLineMid(low, high) {
  const n = (low + high) / 2;
  const base = Math.floor(n / 10) * 10;
  const rem = n - base;
  return rem >= 5 ? base + 10 : base;
}

function renderQuote(q) {
  const preliminary = q.preliminary !== false;
  const banner = q.tbdBanner
    ? `<div class="tbd-banner" role="status">${esc(q.tbdBanner)}</div>`
    : "";
  const rows = (q.lines || [])
    .map(l => {
      const tbd = l.tbd ? `<span class="tbd-badge">${esc(TBD_LABEL)}</span>` : "";
      return `<tr><td>${esc(l.label)}${tbd}</td><td>${lineAmount(l, preliminary)}</td></tr>`;
    })
    .join("");
  const meta = [
    q.rangeLabel || "Preliminary",
    q.version ? `v ${q.version}` : "",
    q.placeholder ? "PLACEHOLDER RATES" : q.source === "blob" ? "Imported card" : "",
  ]
    .filter(Boolean)
    .join(" · ");
  const totalLine = preliminary
    ? `<p><strong>${esc(q.rangeLabel || "Preliminary")} range:</strong> ${money(q.low)} – ${money(q.high)}</p>`
    : `<p><strong>Total:</strong> ${money(q.total)}</p>`;
  quoteOut.innerHTML = `${banner}<p><strong>${esc(meta)}</strong></p>
    <table><tbody>${rows}</tbody></table>
    ${totalLine}
    ${q.quoteRequiredAny ? '<p class="quote-required">Some lines need a custom quote before this total is final.</p>' : ""}`;
  quoteOut.hidden = false;
}

calcForm.addEventListener("submit", async e => {
  e.preventDefault();
  const surveyConfirmed = document.getElementById("fSurveyConfirmed").checked;
  const { quote } = await api("/api/quote-engine/calculate", {
    method: "POST",
    body: JSON.stringify({ input: calcInputFromForm(), surveyConfirmed }),
  });
  lastQuote = quote;
  renderQuote(quote);
  const fValue = document.getElementById("fValue");
  if (quote.preliminary) fValue.value = `${money(quote.low)} – ${money(quote.high)}`;
  else if (quote.total) fValue.value = money(quote.total);
});

document.getElementById("saveLead").addEventListener("click", async () => {
  if (!active) return;
  const { lead } = await api(`/api/quote-engine/leads/${encodeURIComponent(active.id)}`, {
    method: "PATCH",
    body: JSON.stringify({
      status: document.getElementById("fStatus").value,
      quotedValue: document.getElementById("fValue").value,
      nextStep: document.getElementById("fNext").value,
    }),
  });
  active = lead;
  await loadLeads();
  selectLead(active.id);
});

document.getElementById("genProposal").addEventListener("click", () => {
  const id = active?.id || "sample-demo-lead";
  const surveyConfirmed = document.getElementById("fSurveyConfirmed").checked;
  let url = `/api/quote-engine/proposal/${encodeURIComponent(id)}?token=${encodeURIComponent(token())}`;
  if (surveyConfirmed) url += "&surveyConfirmed=1";
  window.open(url, "_blank", "noopener");
});

document.getElementById("importRateCard").addEventListener("click", async () => {
  const fileInput = document.getElementById("rateCardFile");
  const errEl = document.getElementById("importErr");
  const okEl = document.getElementById("importOk");
  errEl.hidden = true;
  okEl.hidden = true;
  const file = fileInput.files?.[0];
  if (!file) {
    errEl.textContent = "Choose a JSON file first.";
    errEl.hidden = false;
    return;
  }
  try {
    const text = await file.text();
    const card = JSON.parse(text);
    const result = await api("/api/quote-engine/rate-card", { method: "POST", body: JSON.stringify(card) });
    okEl.textContent = `Imported ${result.name || result.version} (${result.signTypeCount} sign types).`;
    okEl.hidden = false;
    fileInput.value = "";
    await loadRateCardStatus();
  } catch (err) {
    errEl.textContent = err.message || "Import failed";
    errEl.hidden = false;
  }
});

async function boot() {
  if (!token()) {
    showGate();
    return;
  }
  showApp();
  await Promise.all([loadLeads(), loadRateCardStatus()]);
}

if (token()) boot().catch(() => showGate("Session expired. Enter the password again."));
else showGate();
