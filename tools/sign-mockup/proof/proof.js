// Phone proof page for a mockup (any category): shows the shared day/night views, the construction, the
// preliminary range, and lets the client comment, approve and download the PDF.
// The proof id travels in the URL fragment, so it never reaches server logs or Referer headers.
import { getType, describe, diagramSvg, categoryOf } from "../js/catalog.js";
import { priceView } from "../js/pricing.js";
import { buildSignPdf } from "../js/proof-pdf.js";

const API = "/api/sign-proofs";
const $ = id => document.getElementById(id);
const id = (location.hash.match(/^#([0-9a-f]{32})$/) || [])[1] || "";
const imageUrl = name => `${API}/${id}/${name}`;
let sheet = null;
let mode = "day";

const when = iso => new Date(iso).toLocaleString("en-US", {
  year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short",
});

function showMissing(text) {
  $("loading").hidden = true;
  $("proof").hidden = true;
  $("missing").hidden = false;
  if (text) $("missingText").textContent = text;
}

async function api(path, body) {
  const res = await fetch(`${API}/${id}${path}`, body
    ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
    : { cache: "no-store" });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(data?.error || "Something went wrong. Try again.");
    err.status = res.status;
    throw err;
  }
  return data;
}

// Optional notification through Netlify Forms; the proof is saved whether or not this lands.
function notifyArc(event, name, message) {
  const body = new URLSearchParams({
    "form-name": "sign-proof-activity", "bot-field": "", event, proof: location.href, project: sheet.project || "", name: name || "", message: message || "",
  });
  fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body }).catch(() => {});
}

function setMode(next) {
  mode = next === "night" && sheet.images.night ? "night" : "day";
  for (const b of document.querySelectorAll(".pf-switch [data-mode]")) b.setAttribute("aria-checked", String(b.dataset.mode === mode));
  const img = $("shot");
  img.src = imageUrl(mode);
  const d = sheet.images[mode];
  img.width = d.width;
  img.height = d.height;
  $("shotLink").href = imageUrl(mode);
  $("shotCap").textContent = `${mode === "night" ? "Night view (simulated lighting)" : "Day view"}. Tap the image to open it full size.`;
}

function mailtoHref() {
  const { noun, Noun } = categoryOf(getType(sheet.typeId));
  const subject = `${Noun} proof${sheet.project ? `: ${sheet.project}` : ""}`;
  const lines = [
    "Hi Arc,", "", `About this ${noun} proof: ${location.href}`, "",
    sheet.approval ? `Concept approval, a request for a formal estimate (not a contract): ${sheet.approval.name}, ${when(sheet.approval.at)}.` : "", "",
  ];
  return `mailto:arc@arcsignco.com?cc=jc@arcsignco.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

function renderApproval() {
  const a = sheet.approval;
  $("approvedBox").hidden = !a;
  $("approveForm").hidden = !!a;
  $("approvalTitle").textContent = a ? "Concept approved" : "Approve this concept";
  if (a) $("approvedText").textContent = `Concept approved by ${a.name} on ${when(a.at)}. This asks Arc for a formal estimate. It is not a contract.`;
  $("emailArc").href = mailtoHref();
}

function renderComments() {
  const list = $("comments");
  list.replaceChildren(...sheet.comments.map(c => {
    const li = document.createElement("li");
    const head = document.createElement("div");
    head.className = "pf-c-head";
    const who = document.createElement("strong");
    who.textContent = c.name || "Guest";
    const at = document.createElement("time");
    at.dateTime = c.at;
    at.textContent = when(c.at);
    head.append(who, at);
    const p = document.createElement("p");
    p.textContent = c.text;
    li.append(head, p);
    return li;
  }));
  $("noComments").hidden = sheet.comments.length > 0;
}

function render() {
  const type = getType(sheet.typeId);
  const info = describe(type, sheet.options, sheet.size);
  const cat = categoryOf(type);
  document.title = `${sheet.project || `${cat.Noun} mockup`} for approval | Arc Signage Co`;
  $("title").textContent = sheet.project || `Storefront ${cat.noun}`;
  $("eyebrow").textContent = `${cat.Noun} mockup for approval`;
  $("detailsTitle").textContent = `The ${cat.noun}`;
  $("typeLabel").textContent = cat.typeLabel;
  $("shot").alt = `The ${cat.noun} mockup on the storefront photo`;
  $("art").alt = cat.ui.flatLabel;
  $("subtitle").textContent = [sheet.preparedFor && `Prepared for ${sheet.preparedFor}`, `Shared ${new Date(sheet.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })}`].filter(Boolean).join(" · ");

  $("typeName").textContent = info.name;
  $("typeLight").textContent = info.lightingLabel;
  $("sizeRow").hidden = !sheet.sizeText;
  if (sheet.sizeText) $("sizeText").textContent = `${sheet.sizeText.width} W × ${sheet.sizeText.height} ${cat.ui.heightShort} (${sheet.sizeText.area})`;
  for (const old of $("facts").querySelectorAll(".pf-opt")) old.remove();
  $("facts").append(...info.details.filter(([k]) => k !== "Lighting").map(([k, v]) => {
    const row = document.createElement("div");
    row.className = "pf-opt";
    row.append(Object.assign(document.createElement("dt"), { textContent: k }), Object.assign(document.createElement("dd"), { textContent: v }));
    return row;
  }));
  const price = priceView(sheet.price, { date: new Date(sheet.createdAt) });
  $("priceLabel").textContent = price.label;
  $("priceRange").textContent = price.withheld ? price.message : price.range;
  $("priceRange").classList.toggle("pf-noprice", price.withheld);
  $("pricePerFoot").hidden = !price.perFoot;
  $("pricePerFoot").textContent = price.perFoot;
  $("priceLines").hidden = !price.lines.length;
  $("priceLines").replaceChildren(...price.lines.map(t => Object.assign(document.createElement("li"), { textContent: t })));
  $("priceValid").hidden = price.withheld;
  $("priceValid").textContent = price.withheld ? "" : `${price.tax} ${price.valid}`;
  $("priceNote").textContent = price.disclaimer;
  $("notes").hidden = !sheet.notes;
  $("notes").textContent = sheet.notes || "";

  $("diagram").innerHTML = diagramSvg(type);
  $("buildSummary").textContent = info.summary;
  $("buildParts").replaceChildren(...info.parts.map(t => Object.assign(document.createElement("li"), { textContent: t })));
  $("buildNight").textContent = `At night: ${info.night}`;

  if (sheet.images.art) {
    const art = $("art");
    art.src = imageUrl("art");
    art.width = sheet.images.art.width;
    art.height = sheet.images.art.height;
  } else $("art").closest(".pf-card").hidden = true;
  document.querySelector(".pf-switch").hidden = !sheet.images.night;

  setMode(mode);
  renderApproval();
  renderComments();
}

document.querySelector(".pf-switch").addEventListener("click", e => {
  const b = e.target.closest("[data-mode]");
  if (b) setMode(b.dataset.mode);
});
document.querySelector(".pf-switch").addEventListener("keydown", e => {
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
  e.preventDefault();
  setMode(mode === "day" ? "night" : "day");
  document.querySelector(`.pf-switch [data-mode="${mode}"]`).focus();
});

function showError(el, text) {
  el.hidden = !text;
  el.textContent = text || "";
}

$("approveForm").addEventListener("submit", async e => {
  e.preventDefault();
  const name = $("approveName").value.trim();
  if (!name) { showError($("approveError"), "Add your name to approve."); $("approveName").focus(); return; }
  if (!$("approveOk").checked) { showError($("approveError"), "Check the box to confirm you've reviewed it."); $("approveOk").focus(); return; }
  showError($("approveError"), "");
  $("approveBtn").disabled = true;
  try {
    sheet = await api("/approve", { name });
    renderApproval();
    notifyArc("approved", name, `Concept approved on ${when(sheet.approval.at)} (request for a formal estimate)`);
    $("approvedBox").focus?.();
  } catch (err) {
    if (err.status === 409) { sheet = await api("").catch(() => sheet); renderApproval(); }
    showError($("approveError"), err.message);
  } finally {
    $("approveBtn").disabled = false;
  }
});

$("commentForm").addEventListener("submit", async e => {
  e.preventDefault();
  const text = $("commentText").value.trim();
  if (!text) { showError($("commentError"), "Write a comment first."); $("commentText").focus(); return; }
  showError($("commentError"), "");
  $("commentBtn").disabled = true;
  try {
    const name = $("commentName").value.trim();
    sheet = await api("/comments", { name, text });
    $("commentText").value = "";
    renderComments();
    notifyArc("comment", name, text);
  } catch (err) {
    showError($("commentError"), err.message);
  } finally {
    $("commentBtn").disabled = false;
  }
});

async function jpegFrom(name) {
  const d = sheet.images[name];
  if (!d) return null;
  const res = await fetch(imageUrl(name));
  if (!res.ok) throw new Error(`image ${name}`);
  return { bytes: new Uint8Array(await res.arrayBuffer()), width: d.width, height: d.height };
}

$("downloadPdf").addEventListener("click", async () => {
  const btn = $("downloadPdf");
  btn.disabled = true;
  $("pdfStatus").textContent = "Building the PDF…";
  try {
    const [day, night, flat] = await Promise.all(["day", "night", "art"].map(jpegFrom));
    const bytes = await buildSignPdf({
      typeId: sheet.typeId,
      options: sheet.options,
      sizeIn: sheet.size,
      day, night, flat,
      size: sheet.sizeText,
      reference: sheet.reference,
      project: sheet.project,
      preparedFor: sheet.preparedFor,
      notes: sheet.notes,
      price: priceView(sheet.price, { date: new Date(sheet.createdAt) }),
      approval: sheet.approval ? { name: sheet.approval.name, at: when(sheet.approval.at) } : null,
      proofUrl: location.href,
      date: new Date(sheet.createdAt),
    });
    const slug = (sheet.project || "storefront").toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").slice(0, 40) || "storefront";
    const file = new File([bytes], `arc-sign-proof-${slug}.pdf`, { type: "application/pdf" });
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    $("pdfStatus").textContent = `Saved ${file.name}`;
  } catch (err) {
    console.error(err);
    $("pdfStatus").textContent = "The PDF couldn't be built. Try again.";
  } finally {
    btn.disabled = false;
  }
});

async function load() {
  if (!id) return showMissing();
  try {
    sheet = await api("");
  } catch (err) {
    return showMissing(err.status === 404 ? undefined : "The proof couldn't be loaded. Check your connection and refresh the page.");
  }
  render();
  $("loading").hidden = true;
  $("proof").hidden = false;
}

window.addEventListener("hashchange", () => location.reload());
load();
// Lets automated checks read the loaded proof.
window.signProof = { get sheet() { return sheet; }, setMode };
