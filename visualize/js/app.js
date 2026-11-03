import { loadImageFile } from "/tools/sign-mockup/js/images.js";
import { compositeLogo } from "./composite.js";

const $ = (id) => document.getElementById(id);
const startedAt = Date.now();
const state = {
  config: null,
  sessionId: "",
  category: "",
  step: "pick",
  reached: new Set(["pick"]),
  logoId: "",
  photoId: "",
  inspoId: "",
  photoUrl: "",
  logoPixels: null,
  variants: [],
  current: 0,
  quad: null,
  editsUsed: 0,
  renderPixels: null,
};

const COPY = {
  pick: "Pick a vehicle wrap, a storefront sign, or window graphics. The logo you upload is placed as your file. The preview is a concept for Arc to quote.",
  business: "Paste the business website and scan the public page, or type the details. You can correct anything before we draw.",
  subject: "Add the vehicle, or a photo of the storefront. Two versions come back. You get one written revision after that.",
  result: "Drag the corners to place the logo. Ask for one change in the box below, then send it to Arc. The price line stays a custom quote.",
};

const ASSIST_STEP = { pick: "pick", business: "business", subject: "subject", result: "result", thanks: "result" };

function showAlert(message) {
  const el = $("alert");
  el.hidden = !message;
  el.textContent = message || "";
}

function setBusy(on, text) {
  const busy = $("busy");
  if (!busy) return;
  busy.hidden = !on;
  if (text && $("busyText")) $("busyText").textContent = text;
}

async function api(path, options = {}) {
  const res = await fetch(path, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Try again.");
  return data;
}

function formBody(extra = {}) {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...extra, fax: $("fax").value }),
  };
}

function businessBody() {
  return {
    name: $("bizName").value,
    phone: $("bizPhone").value,
    email: $("bizEmail").value,
    web: $("bizWeb").value,
    tagline: $("tagline").value,
    services: $("services").value,
    colors: [$("colorA").value, $("colorB").value],
  };
}

function subjectBody() {
  if (state.category === "sign") {
    return { signType: $("signType").value, widthFt: $("signW").value, heightFt: $("signH").value, illuminated: $("signLit").value === "yes" };
  }
  if (state.category === "window") return { windowType: $("windowType").value, panes: $("panes").value };
  return {
    year: $("year").value, make: $("make").value, model: $("model").value,
    body: $("body").value, coverage: $("coverage").value, color: $("paint").value,
  };
}

function showStep(step) {
  state.step = step;
  state.reached.add(step);
  for (const name of ["pick", "business", "subject", "result", "thanks"]) $(`step-${name}`).hidden = name !== step;
  $("assistText").textContent = COPY[ASSIST_STEP[step]] || COPY.pick;
  for (const btn of document.querySelectorAll(".viz-steps button")) {
    const id = btn.dataset.step;
    btn.disabled = !state.reached.has(id) || id === "thanks";
    btn.setAttribute("aria-current", id === step ? "step" : "false");
  }
  showAlert("");
}

async function choose(category) {
  setBusy(true, "Starting…");
  try {
    const data = await api("/api/visualize/session", formBody({ category }));
    state.sessionId = data.id;
    state.category = category;
    state.config = { ...state.config, quote: data.quote, disclaimer: data.disclaimer };
    paintQuote(data.quote, data.disclaimer);
    $("subject-vehicle").hidden = category !== "vehicle";
    $("subject-sign").hidden = category !== "sign";
    $("subject-window").hidden = category !== "window";
    $("subjectTitle").textContent = category === "vehicle" ? "Which vehicle?" : category === "sign" ? "Which storefront?" : "Which windows?";
    showStep("business");
  } catch (err) {
    showAlert(err.message);
  } finally {
    setBusy(false);
  }
}

function paintQuote(quote, disclaimer) {
  const q = quote || state.config?.quote || { label: "Custom quote", message: "" };
  const text = q.low && q.high ? `${q.label}: $${q.low}–$${q.high}. ${q.message || ""}` : `${q.label}. ${q.message || ""}`;
  for (const id of ["quoteText", "thanksQuote"]) {
    const el = $(id);
    if (el) el.textContent = text;
  }
  const note = disclaimer || state.config?.disclaimer || "";
  for (const id of ["discResult", "discThanks"]) if ($(id)) $(id).textContent = note;
}

async function scan() {
  showAlert("");
  setBusy(true, "Reading the public page…");
  try {
    const data = await api("/api/visualize/scan", formBody({ sessionId: state.sessionId, url: $("bizWeb").value }));
    const b = data.business || {};
    if (b.name && !$("bizName").value) $("bizName").value = b.name;
    if (b.phone && !$("bizPhone").value) $("bizPhone").value = b.phone;
    if (b.email && !$("bizEmail").value) $("bizEmail").value = b.email;
    if (b.tagline && !$("tagline").value) $("tagline").value = b.tagline;
    if (b.services && !$("services").value) $("services").value = b.services;
    if (b.colors?.[0]) $("colorA").value = b.colors[0];
    if (b.colors?.[1]) $("colorB").value = b.colors[1];
    if (data.logoId && !state.logoId) {
      state.logoId = data.logoId;
      await rememberLogo(data.logoUrl);
    }
  } catch (err) {
    showAlert(err.message);
  } finally {
    setBusy(false);
  }
}

async function rememberLogo(url) {
  const res = await fetch(url);
  const blob = await res.blob();
  state.logoPixels = await pixelsFromBlob(blob);
  $("logoName").textContent = "Logo added";
}

async function pixelsFromBlob(blob) {
  const img = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const g = canvas.getContext("2d", { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  const frame = g.getImageData(0, 0, canvas.width, canvas.height);
  return { width: canvas.width, height: canvas.height, data: frame.data };
}

async function upload(file, kind) {
  const logo = kind === "logo";
  const { canvas } = await loadImageFile(file, { maxSide: logo ? 1200 : 1600 });
  const blob = await new Promise((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error("Could not read that image.")), logo ? "image/png" : "image/jpeg", 0.86));
  const body = new FormData();
  body.set("sessionId", state.sessionId);
  body.set("kind", kind);
  body.set("file", blob, logo ? "logo.png" : `${kind}.jpg`);
  const data = await api("/api/visualize/upload", { method: "POST", body });
  if (kind === "logo") {
    state.logoId = data.id;
    state.logoPixels = await pixelsFromBlob(blob);
    $("logoName").textContent = file.name || "Logo added";
  } else if (kind === "photo") {
    state.photoId = data.id;
    state.photoUrl = URL.createObjectURL(blob);
    $("photoName").textContent = file.name || "Photo added";
  } else {
    state.inspoId = data.id;
    $("inspoName").textContent = file.name || "Inspiration added";
  }
}

async function onFile(input, kind) {
  const file = input.files?.[0];
  if (!file) return;
  showAlert("");
  setBusy(true, "Preparing the image…");
  try { await upload(file, kind); }
  catch (err) { showAlert(err.message); }
  finally { setBusy(false); }
}

function quadFromZone(zone) {
  const x = zone.x, y = zone.y, w = zone.w, h = zone.h;
  return [{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }];
}

async function generate() {
  showAlert("");
  setBusy(true, "Preparing your preview…");
  const timer = setInterval(() => {
    const s = Math.round((Date.now() - startedAt) / 1000);
    $("busySub").textContent = s < 4 ? "This usually finishes in under 40 seconds." : `Working… ${s}s. This usually finishes in under 40 seconds.`;
  }, 500);
  try {
    const data = await api("/api/visualize/render", formBody({
      sessionId: state.sessionId,
      business: businessBody(),
      subject: subjectBody(),
      logoId: state.logoId,
      photoId: state.photoId,
      inspoId: state.inspoId,
      turnstileToken: turnstileToken(),
    }));
    state.variants = data.variants;
    state.current = 0;
    state.editsUsed = 0;
    paintQuote(data.quote, data.disclaimer);
    $("stubBanner").hidden = !data.stub;
    $("editBtn").disabled = false;
    $("editRequest").disabled = false;
    drawThumbs();
    await selectVariant(0);
    $("compareWrap").hidden = !state.photoUrl;
    showStep("result");
  } catch (err) {
    showAlert(err.message);
  } finally {
    clearInterval(timer);
    setBusy(false);
  }
}

function drawThumbs() {
  const box = $("thumbs");
  box.replaceChildren();
  state.variants.forEach((variant, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", index === state.current ? "true" : "false");
    btn.setAttribute("aria-label", variant.kind === "edit" ? "Revision" : `Version ${index + 1}`);
    const img = document.createElement("img");
    img.alt = "";
    img.src = variant.url;
    btn.append(img);
    btn.addEventListener("click", () => selectVariant(index));
    box.append(btn);
  });
}

async function selectVariant(index) {
  state.current = index;
  const variant = state.variants[index];
  state.quad = quadFromZone(variant.zone);
  const res = await fetch(variant.url);
  state.renderPixels = await pixelsFromBlob(await res.blob());
  drawThumbs();
  placeHandles();
  paint();
}

let paintQueued = 0;
function paint() {
  const now = Date.now();
  if (now - paintQueued < 40) return;
  paintQueued = now;
  const base = state.renderPixels;
  const canvas = $("stage");
  canvas.width = base.width;
  canvas.height = base.height;
  const g = canvas.getContext("2d");
  let frame = base;
  if (state.logoPixels && state.quad) {
    const quad = state.quad.map(p => ({ x: p.x * base.width, y: p.y * base.height }));
    try { frame = compositeLogo(base, state.logoPixels, quad); } catch { frame = base; }
  }
  g.putImageData(new ImageData(new Uint8ClampedArray(frame.data), frame.width, frame.height), 0, 0);
  const compare = Number($("compare").value);
  $("photoBehind").src = state.photoUrl || "";
  canvas.style.clipPath = `inset(0 ${100 - compare}% 0 0)`;
}

function placeHandles() {
  const layer = $("handles");
  layer.replaceChildren();
  if (!state.quad) return;
  state.quad.forEach((point, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "viz-handle";
    btn.style.left = `${point.x * 100}%`;
    btn.style.top = `${point.y * 100}%`;
    btn.setAttribute("aria-label", `Logo corner ${index + 1}`);
    btn.addEventListener("pointerdown", (ev) => drag(ev, index));
    layer.append(btn);
  });
}

function normFromEvent(ev) {
  const rect = $("stage").getBoundingClientRect();
  return {
    x: Math.min(1, Math.max(0, (ev.clientX - rect.left) / rect.width)),
    y: Math.min(1, Math.max(0, (ev.clientY - rect.top) / rect.height)),
  };
}

function drag(ev, index) {
  ev.preventDefault();
  const handle = ev.currentTarget;
  handle.setPointerCapture(ev.pointerId);
  const move = (e) => {
    const point = normFromEvent(e);
    state.quad[index] = point;
    handle.style.left = `${point.x * 100}%`;
    handle.style.top = `${point.y * 100}%`;
    paint();
  };
  const up = () => {
    handle.removeEventListener("pointermove", move);
    handle.removeEventListener("pointerup", up);
    paintQueued = 0;
    paint();
  };
  handle.addEventListener("pointermove", move);
  handle.addEventListener("pointerup", up);
}

async function edit() {
  if (state.editsUsed) return;
  showAlert("");
  setBusy(true, "Updating this version…");
  try {
    const data = await api("/api/visualize/edit", formBody({
      sessionId: state.sessionId,
      renderId: state.variants[state.current].id,
      request: $("editRequest").value,
    }));
    state.variants.push(data.render);
    state.editsUsed = 1;
    $("editBtn").disabled = true;
    $("editRequest").disabled = true;
    await selectVariant(state.variants.length - 1);
  } catch (err) {
    showAlert(err.message);
  } finally {
    setBusy(false);
  }
}

function turnstileToken() {
  const field = document.querySelector("[name='cf-turnstile-response']");
  return field?.value || "";
}

async function sendLead(ev) {
  ev.preventDefault();
  showAlert("");
  setBusy(true, "Sending this to Arc…");
  try {
    const data = await api("/api/visualize/lead", formBody({
      sessionId: state.sessionId,
      name: $("leadName").value,
      phone: $("leadPhone").value,
      email: $("leadEmail").value,
      timing: $("timing").value,
      renderId: state.variants[state.current].id,
      quad: state.logoId ? state.quad : null,
      turnstileToken: turnstileToken(),
    }));
    paintQuote(data.quote, data.disclaimer);
    $("shareLink").href = data.url;
    $("shareLink").textContent = data.url;
    showStep("thanks");
  } catch (err) {
    showAlert(err.message);
  } finally {
    setBusy(false);
  }
}

async function init() {
  try { state.config = await api("/api/visualize/config"); } catch { state.config = { quote: { label: "Custom quote", message: "" }, disclaimer: $("discHero").textContent }; }
  paintQuote(state.config.quote, state.config.disclaimer);
  if (state.config.turnstileSiteKey) {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    document.body.append(s);
    for (const id of ["turnstileRender", "turnstileLead"]) {
      $(id).dataset.sitekey = state.config.turnstileSiteKey;
      $(id).classList.add("cf-turnstile");
    }
  }
  document.querySelectorAll("[data-category]").forEach(btn => btn.addEventListener("click", () => choose(btn.dataset.category)));
  document.querySelectorAll(".viz-steps button").forEach(btn => btn.addEventListener("click", () => {
    if (state.reached.has(btn.dataset.step)) showStep(btn.dataset.step);
  }));
  $("scanBtn").addEventListener("click", scan);
  $("toSubject").addEventListener("click", () => showStep("subject"));
  $("backBusiness").addEventListener("click", () => showStep("business"));
  $("generateBtn").addEventListener("click", generate);
  $("logoFile").addEventListener("change", (e) => onFile(e.target, "logo"));
  $("photoFile").addEventListener("change", (e) => onFile(e.target, "photo"));
  $("inspoFile").addEventListener("change", (e) => onFile(e.target, "inspo"));
  $("editBtn").addEventListener("click", edit);
  $("leadForm").addEventListener("submit", sendLead);
  $("compare").addEventListener("input", paint);
  showStep("pick");
}

init();
