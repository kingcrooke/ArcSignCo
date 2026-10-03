import { formatDay, formatFtIn, formatWhen, pdfSafe } from "../format.js";
import { CONCEPT_DISCLAIMER, formatUsd } from "../pricing-config.js";
import { blobToDataUrl, buildProofPdf, loadLogoDataUrl } from "../proof-pdf.js";

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(window.location.search);
const id = params.get("id") || "";
let proof = null;
let night = false;

function setStatus(text, bad) {
  const el = $("status");
  el.hidden = !text;
  el.textContent = text || "";
  el.className = bad ? "status bad" : "status";
}

async function loadProof() {
  if (!/^[a-f0-9]{32}$/.test(id)) {
    setStatus("This proof link is missing or invalid.", true);
    return;
  }
  const res = await fetch(`/api/sign-proof/${id}`, { cache: "no-store" });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    setStatus(body.error || "This proof link was not found.", true);
    return;
  }
  proof = body;
  setStatus("");
  $("proof").hidden = false;
  render();
}

function render() {
  $("projectName").textContent = proof.projectName || "Storefront sign concept";
  $("created").textContent = proof.createdAt ? `Proof opened ${formatWhen(proof.createdAt)}` : "";
  const bits = [proof.signTypeLabel, proof.illuminationLabel];
  if (proof.calibrated && proof.widthIn) {
    bits.push(`${formatFtIn(proof.widthIn)} wide`);
    if (proof.heightIn) bits.push(`${formatFtIn(proof.heightIn)} tall`);
  } else {
    bits.push("width not calibrated");
  }
  $("metaLine").textContent = bits.filter(Boolean).join(" · ");
  showScene();
  renderPrice();
  $("artwork").src = proof.images.artwork;
  renderApproval();
  renderComments();
}

function showScene() {
  $("scene").src = night ? proof.images.night : proof.images.day;
  $("scene").alt = night
    ? `Night view, ${proof.illuminationLabel || "lit"}, on the storefront`
    : "Day view of the sign on the storefront";
  $("sceneCaption").textContent = night
    ? `Night view, ${proof.illuminationLabel || "lit"}. Same pin as the day view. Light spill is a concept.`
    : "Day view. Switch to night for the same placement with the light on.";
  $("dayBtn").setAttribute("aria-pressed", String(!night));
  $("nightBtn").setAttribute("aria-pressed", String(night));
}

function renderPrice() {
  const card = $("priceCard");
  card.className = "card price-card";
  card.replaceChildren();
  const tag = document.createElement("div");
  tag.className = "tag";
  tag.textContent = proof.price?.label || "Arc placeholder rate";
  card.appendChild(tag);
  const amount = document.createElement("div");
  amount.className = "amount";
  if (!proof.price) {
    amount.textContent = "No preliminary price";
    card.appendChild(amount);
    const note = document.createElement("p");
    note.className = "help";
    note.textContent = "The width was not calibrated, so there is no placeholder figure.";
    card.appendChild(note);
  } else {
    amount.textContent = formatUsd(proof.price.amountUsd);
    card.appendChild(amount);
    const breakdown = document.createElement("p");
    breakdown.className = "help";
    breakdown.textContent = `${proof.price.signTypeLabel}, ${formatFtIn(proof.price.widthInches)} wide, ${proof.price.illuminationLabel}. Placeholder math: ${formatUsd(proof.price.baseUsd)} base + ${formatUsd(proof.price.widthPartUsd)} width + ${formatUsd(proof.price.illuminationUsd)} light. Rate card ${proof.price.version}.`;
    card.appendChild(breakdown);
    const note = document.createElement("p");
    note.className = "help";
    note.textContent = `${proof.price.disclaimer} ${CONCEPT_DISCLAIMER}`;
    card.appendChild(note);
  }
}

function renderApproval() {
  const box = $("approvalState");
  const form = $("approveForm");
  box.replaceChildren();
  if (proof.approval) {
    form.hidden = true;
    const banner = document.createElement("p");
    banner.className = "approved";
    banner.textContent = `Approved by ${proof.approval.name} on ${formatWhen(proof.approval.at)}.`;
    box.appendChild(banner);
  } else {
    form.hidden = false;
  }
}

function renderComments() {
  const list = $("comments");
  list.replaceChildren();
  if (!proof.comments?.length) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "No comments yet.";
    list.appendChild(li);
    return;
  }
  for (const comment of proof.comments) {
    const li = document.createElement("li");
    const name = document.createElement("strong");
    name.textContent = comment.name || "Client";
    const text = document.createElement("div");
    text.textContent = comment.text;
    const time = document.createElement("time");
    time.dateTime = comment.at || "";
    time.textContent = formatWhen(comment.at);
    li.append(name, text, time);
    list.appendChild(li);
  }
}

async function post(action, payload) {
  const res = await fetch(`/api/sign-proof/${id}/${action}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || "Could not save.");
  proof = body;
  render();
  notifyOffice(action, payload).catch(() => {});
}

async function notifyOffice(action, payload) {
  const form = new URLSearchParams({
    "form-name": "sign-proof-approval",
    "bot-field": "",
    "proof-url": window.location.href,
    project: proof.projectName || "",
    person: payload.name || "Client",
    action,
    comment: payload.text || "",
  });
  await fetch("/", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
}

$("dayBtn").addEventListener("click", () => {
  night = false;
  showScene();
});
$("nightBtn").addEventListener("click", () => {
  night = true;
  showScene();
});

$("approveForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const button = e.target.querySelector("button");
  button.disabled = true;
  try {
    await post("approve", { name: data.get("name"), company: data.get("company") });
  } catch (err) {
    setStatus(err.message, true);
  } finally {
    button.disabled = false;
  }
});

$("commentForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const button = e.target.querySelector("button");
  button.disabled = true;
  try {
    await post("comment", { name: data.get("name"), text: data.get("text"), company: data.get("company") });
    e.target.reset();
  } catch (err) {
    setStatus(err.message, true);
  } finally {
    button.disabled = false;
  }
});

$("pdfBtn").addEventListener("click", async () => {
  if (!proof) return;
  const button = $("pdfBtn");
  button.disabled = true;
  button.textContent = "Preparing PDF…";
  try {
    const [logo, day, nightImage, artwork] = await Promise.all([
      loadLogoDataUrl(),
      fetch(proof.images.day).then((res) => res.blob()).then(blobToDataUrl),
      fetch(proof.images.night).then((res) => res.blob()).then(blobToDataUrl),
      fetch(proof.images.artwork).then((res) => res.blob()).then(blobToDataUrl),
    ]);
    const sizeLine = proof.calibrated && proof.widthIn
      ? `Approximate sign size: ${formatFtIn(proof.widthIn)} wide x ${proof.heightIn ? formatFtIn(proof.heightIn) + " tall" : "height not measured"} (from photo calibration)`
      : "Sign size: not calibrated. Draw a scale line on the photo for approximate dimensions.";
    const approvalLine = proof.approval
      ? `Approved by ${proof.approval.name} on ${formatWhen(proof.approval.at)}.`
      : "Not approved yet.";
    const comments = (proof.comments || []).map(
      (comment) => `${comment.name || "Client"} (${formatWhen(comment.at)}): ${comment.text}`
    );
    const doc = buildProofPdf({
      logoDataUrl: logo,
      project: proof.projectName || "",
      dateStr: formatDay(proof.createdAt),
      dayDataUrl: day,
      nightDataUrl: nightImage,
      artworkDataUrl: artwork,
      sizeLine,
      signLine: `Sign: ${proof.signTypeLabel} · Light: ${proof.illuminationLabel}`,
      nightLine: `Night view, ${proof.illuminationLabel}. Same pin as the day view.`,
      price: proof.price,
      approvalLine: pdfSafe(approvalLine),
      comments: comments.map(pdfSafe),
    });
    doc.save(`arc-sign-proof-${id.slice(0, 8)}.pdf`);
  } catch (err) {
    setStatus(err.message || "PDF download failed.", true);
  } finally {
    button.disabled = false;
    button.textContent = "Download PDF";
  }
});

loadProof().catch(() => setStatus("Could not load this proof.", true));
