const TOKEN_KEY = "arcQuoteEngineToken";

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
const calcForm = document.getElementById("calcForm");
const quoteOut = document.getElementById("quoteOut");

let leads = [];
let active = null;
let lastQuote = null;

function showGate(msg) {
  gate.hidden = false;
  app.hidden = true;
  if (msg) { gateErr.hidden = false; gateErr.textContent = msg; }
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

function fillCalcFromLead(lead) {
  const i = lead.calculatorInput || {};
  calcForm.signType.value = i.signType || lead.projectType || "";
  calcForm.quantity.value = i.quantity || 1;
  calcForm.sizeW.value = i.sizeW || "";
  calcForm.sizeH.value = i.sizeH || "";
  calcForm.sizeUnit.value = i.sizeUnit || "ft";
  calcForm.lit.value = i.lit || "Not sure";
  calcForm.height.value = i.height || "";
  calcForm.permitsRequested.checked = Boolean(i.permitsRequested);
  document.getElementById("fStatus").value = lead.status || "New";
  document.getElementById("fValue").value = lead.quotedValue || "";
  document.getElementById("fNext").value = lead.nextStep || "";
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
    boroughZone: active?.boroughZone || active?.calculatorInput?.boroughZone || "brooklyn",
  };
}

function renderQuote(q) {
  const rows = (q.lines || [])
    .map(l => `<tr><td>${esc(l.label)}</td><td>$${Math.round(l.amount).toLocaleString("en-US")}</td></tr>`)
    .join("");
  quoteOut.innerHTML = `<p><strong>${esc(q.label)}</strong> · ${esc(q.version)}${q.placeholder ? " · PLACEHOLDER RATES" : ""}</p>
    <table>${rows}</table>
    <p><strong>Total:</strong> $${Math.round(q.total).toLocaleString("en-US")}</p>`;
  quoteOut.hidden = false;
}

calcForm.addEventListener("submit", async e => {
  e.preventDefault();
  const { quote } = await api("/api/quote-engine/calculate", {
    method: "POST",
    body: JSON.stringify({ input: calcInputFromForm() }),
  });
  lastQuote = quote;
  renderQuote(quote);
  if (active && quote?.total) document.getElementById("fValue").value = `$${Math.round(quote.total).toLocaleString("en-US")}`;
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
  let url = `/api/quote-engine/proposal/${encodeURIComponent(id)}?token=${encodeURIComponent(token())}`;
  if (lastQuote?.total) url += `&total=${encodeURIComponent(lastQuote.total)}`;
  window.open(url, "_blank", "noopener");
});

async function boot() {
  if (!token()) { showGate(); return; }
  showApp();
  await loadLeads();
}

if (token()) boot().catch(() => showGate("Session expired. Enter the password again."));
else showGate();
