import { loadImageFile } from "/tools/sign-mockup/js/images.js";
import { compositeLogo } from "./composite.js";
import { buildProofPdf } from "./proof.js";

const $ = (id) => document.getElementById(id);
const STOCK = "/visualize/img/work-van.svg";
const SAMPLE = "/tools/sign-mockup/img/sample-storefront.jpg";
const CONCEPTS = 3;
const EDITS = 3;
const SWATCHES = [
  ["#e23b3b", "Red"], ["#f28c28", "Orange"], ["#d4a53c", "Gold"], ["#f2d34a", "Yellow"],
  ["#3aaa4a", "Green"], ["#1aa8a8", "Teal"], ["#2f6fed", "Blue"], ["#163a78", "Navy"],
  ["#7a3eaf", "Purple"], ["#111111", "Black"], ["#f4f4f4", "White"], ["#c0c4cc", "Silver"],
];
const STYLES = [
  ["clean", "Clean & Minimal"],
  ["bold", "Bold & Sporty"],
  ["tech", "Tech & Futuristic"],
  ["classic", "Classic & Professional"],
];
const COVERAGE = [
  ["full", "Full wrap"],
  ["half", "Half wrap"],
  ["partial", "Partial"],
];
const SIGNS = [
  ["channel-letters", "Channel letters"],
  ["lightbox", "Lightbox"],
  ["blade", "Blade"],
  ["flat-panel", "Flat panel"],
  ["awning", "Awning"],
];
const WINDOWS = [
  ["perforated", "Perforated"],
  ["cut-vinyl", "Cut vinyl"],
  ["frosted", "Frosted"],
  ["full-print", "Full print"],
];
const PLACES = {
  vehicle: [["side", "Side"], ["hood", "Hood"], ["rear", "Rear"], ["doors", "Doors"]],
  sign: [["fascia", "Fascia"], ["above-door", "Above the door"], ["wall", "Wall"], ["window", "Window"]],
  window: [["window", "Window"], ["doors", "Doors"]],
};

let sessionReadyAt = 0;

const state = {
  sessionId: "",
  category: "vehicle",
  vehicle: { year: "", make: "", model: "", color: "white", body: "cargo-van", bodyPicked: false, stock: true, label: "Work van" },
  photoId: "",
  beforeUrl: STOCK,
  business: { name: "", phone: "", web: "", colors: [] },
  coverage: "",
  signType: "channel-letters",
  windowType: "cut-vinyl",
  style: "",
  places: { name: [], phone: [], web: [] },
  logoId: "",
  logoPixels: null,
  logoUrl: "",
  placements: {},
  concepts: [],
  index: 0,
  editsUsed: 0,
  selected: new Set(),
  timing: "",
  shownUrl: STOCK,
  abort: null,
};

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "class") node.className = value;
    else if (key.startsWith("on") && typeof value === "function") node.addEventListener(key.slice(2), value);
    else if (value === true) node.setAttribute(key, "");
    else if (value !== false && value != null) node.setAttribute(key, value);
  }
  for (const child of [].concat(children)) {
    if (child == null || child === false) continue;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return node;
}

function toast(text) {
  const node = $("toast");
  node.hidden = false;
  node.textContent = text;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { node.hidden = true; }, 2400);
}

async function api(path, options = {}) {
  const res = await fetch(path, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || "Something went wrong. Try again.");
    error.status = res.status;
    throw error;
  }
  return data;
}

async function apiRetry(path, options) {
  try {
    return await api(path, options);
  } catch (err) {
    if (!/take a moment/i.test(err.message || "")) throw err;
    await new Promise(resolve => setTimeout(resolve, 3200));
    return api(path, options);
  }
}

function jsonBody(extra) {
  return { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(extra) };
}

async function typeLine(text, kind = "bot") {
  const node = el("p", { class: `msg ${kind}` });
  $("log").append(node);
  $("chat").scrollTop = $("chat").scrollHeight;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || kind === "user") { node.textContent = text; return; }
  for (let i = 1; i <= text.length; i++) {
    node.textContent = text.slice(0, i);
    await new Promise(r => setTimeout(r, 6));
  }
}

function user(text) { return typeLine(text, "user"); }

function clearPanel() { $("panel").replaceChildren(); }

function setStage(url, label, alt) {
  $("stageImg").src = url;
  $("stageImg").alt = alt || label || "Preview";
  $("stageLabel").textContent = label || "";
  state.shownUrl = url;
}

function showArrows(on) {
  $("prevConcept").hidden = !on;
  $("nextConcept").hidden = !on;
  $("dots").hidden = !on;
}

function startRing(title, pill, { cancel = false } = {}) {
  $("logoEditor").hidden = true;
  $("logoHint").hidden = true;
  $("stageCard").classList.add("is-busy");
  $("stageBusy").hidden = false;
  $("busyTitle").textContent = title;
  $("busyPill").textContent = pill;
  $("cancelBtn").hidden = !cancel;
  const ring = $("pctRing");
  const started = Date.now();
  const timer = setInterval(() => {
    const pct = Math.min(92, Math.round((Date.now() - started) / 450));
    ring.style.setProperty("--p", String(pct));
    $("pctText").textContent = `${pct}%`;
  }, 200);
  return () => {
    clearInterval(timer);
    ring.style.setProperty("--p", "100");
    $("pctText").textContent = "100%";
    $("stageBusy").hidden = true;
    $("stageCard").classList.remove("is-busy");
  };
}

async function ensureSession(category) {
  if (state.sessionId && state.category === category) return;
  const data = await api("/api/visualize/session", jsonBody({ category }));
  state.sessionId = data.id;
  state.category = category;
  state.concepts = [];
  state.editsUsed = 0;
  state.photoId = "";
  sessionReadyAt = Date.now() + 3100;
}

async function afterGate() {
  const wait = sessionReadyAt - Date.now();
  if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait));
}

function vehicleLabel() {
  if (state.category !== "vehicle") return state.category === "sign" ? "Storefront" : "Windows";
  if (state.vehicle.stock) return "Work van";
  return [state.vehicle.year, state.vehicle.make, state.vehicle.model].filter(Boolean).join(" ") || "Your vehicle";
}

async function choice() {
  clearPanel();
  showArrows(false);
  await ensureSession("vehicle");
  setStage(STOCK, "Work van", "White work van");
  state.beforeUrl = STOCK;
  state.vehicle = { year: "", make: "", model: "", color: "white", body: "cargo-van", bodyPicked: false, stock: true, label: "Work van" };
  await typeLine("I've started you on a work van. Use it, or pick a different vehicle?");
  const box = el("div");
  box.append(
    el("button", { class: "choice", type: "button", onclick: useStock }, [
      el("span", { class: "rec" }, "RECOMMENDED"),
      el("b", {}, "Use this work van"),
      el("small", {}, "Full wrap on the van shown."),
    ]),
    el("button", { class: "choice", type: "button", onclick: vehicleForm }, [
      el("b", {}, "Use a different vehicle"),
      el("small", {}, "Enter year, make, model & color"),
    ]),
    el("button", { class: "choice", type: "button", onclick: photoPath }, [
      el("b", {}, "I have a photo"),
      el("small", {}, "Upload a picture of your vehicle"),
    ]),
    el("p", { class: "hint" }, "Designing a storefront, wall, or windows instead?"),
    el("button", { class: "line-btn", type: "button", onclick: () => placePath("sign") }, "Storefront sign"),
    el("button", { class: "line-btn", type: "button", onclick: () => placePath("window") }, "Window graphics"),
  );
  $("panel").append(box);
}

async function useStock() {
  await user("Use this work van");
  state.vehicle.stock = true;
  state.photoId = "";
  state.beforeUrl = STOCK;
  await builder();
}

async function vehicleForm() {
  await user("I'll enter my vehicle");
  clearPanel();
  await typeLine("Tell me about your vehicle:");
  const year = el("input", { id: "year", inputmode: "numeric", maxlength: "4", placeholder: "2023" });
  const make = el("input", { id: "make", maxlength: "40", placeholder: "Toyota" });
  const model = el("input", { id: "model", maxlength: "40", placeholder: "Camry" });
  const color = el("input", { id: "paint", maxlength: "40", placeholder: "white" });
  const body = el("select", { id: "bodyType" }, [
    el("option", { value: "" }, "Match the model"),
    el("option", { value: "car" }, "Sedan / car"),
    el("option", { value: "suv" }, "SUV"),
    el("option", { value: "pickup" }, "Pickup"),
    el("option", { value: "cargo-van" }, "Cargo van"),
    el("option", { value: "sprinter" }, "Sprinter"),
    el("option", { value: "box-truck" }, "Box truck"),
    el("option", { value: "trailer" }, "Trailer"),
  ]);
  $("panel").append(
    el("label", { class: "field" }, ["Year", year]),
    el("label", { class: "field" }, ["Make", make]),
    el("label", { class: "field" }, ["Model", model]),
    el("label", { class: "field" }, ["Body type", body]),
    el("label", { class: "field" }, ["Current body color (optional)", color]),
    el("button", { class: "gold-btn", type: "button", onclick: () => generateVehicle(false) }, "Generate my vehicle"),
  );
}

async function generateVehicle() {
  const year = $("year").value.trim();
  const make = $("make").value.trim();
  const model = $("model").value.trim();
  const color = $("paint").value.trim();
  const body = $("bodyType").value;
  if (!/^(19|20)\d{2}$/.test(year) || !make || !model) {
    toast("Enter a year, make, and model.");
    return;
  }
  state.vehicle = {
    year, make, model, color, body, bodyPicked: !!body, stock: false,
    label: [year, make, model].filter(Boolean).join(" "),
  };
  await user([year, make, model, color].filter(Boolean).join(" "));
  clearPanel();
  const stop = startRing("Generating your car…", "This usually takes 30 to 60 seconds.");
  try {
    await afterGate();
    const data = await apiRetry("/api/visualize/vehicle", jsonBody({
      sessionId: state.sessionId,
      subject: { year, make, model, color, body, bodyPicked: !!body },
    }));
    if (data.body) state.vehicle.body = data.body;
    state.photoId = data.render.id;
    state.beforeUrl = data.render.url;
    state.vehicle.label = data.label || state.vehicle.label;
    setStage(data.render.url, state.vehicle.label, state.vehicle.label);
    if (data.stub) $("stubBanner").hidden = false;
    stop();
    await confirmVehicle();
  } catch (err) {
    stop();
    toast(err.message);
    await vehicleForm();
  }
}

async function confirmVehicle() {
  clearPanel();
  await typeLine("Does this look like your car?");
  $("panel").append(
    el("button", { class: "gold-btn", type: "button", onclick: () => builder() }, "Looks great — Next step"),
    el("button", { class: "line-btn", type: "button", onclick: regenerate }, "Not quite — regenerate"),
    el("button", { class: "line-btn", type: "button", onclick: vehicleForm }, "Wrong car — edit"),
  );
}

async function regenerate() {
  await user("Not quite — regenerate");
  const stop = startRing("Generating your car…", "This usually takes 30 to 60 seconds.");
  try {
    await afterGate();
    const data = await apiRetry("/api/visualize/vehicle", jsonBody({
      sessionId: state.sessionId,
      subject: {
        year: state.vehicle.year, make: state.vehicle.make, model: state.vehicle.model,
        color: state.vehicle.color, body: state.vehicle.body, bodyPicked: state.vehicle.bodyPicked,
      },
    }));
    state.photoId = data.render.id;
    state.beforeUrl = data.render.url;
    if (data.body) state.vehicle.body = data.body;
    setStage(data.render.url, state.vehicle.label, state.vehicle.label);
    stop();
    await confirmVehicle();
  } catch (err) {
    stop();
    toast(err.message);
    await confirmVehicle();
  }
}

async function photoPath() {
  await user("I have a photo");
  clearPanel();
  await typeLine("Upload a picture of your vehicle.");
  const input = el("input", { id: "photoFile", type: "file", accept: "image/*,.heic,.heif" });
  input.addEventListener("change", () => onPhoto(input));
  $("panel").append(el("label", { class: "field" }, ["Photo", input]));
}

async function onPhoto(input) {
  const file = input.files?.[0];
  if (!file) return;
  const stop = startRing("Analyzing your photo…", "This usually takes a few seconds.");
  try {
    const { canvas } = await loadImageFile(file, { maxSide: 1600 });
    const blob = await new Promise((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error("Could not read that image.")), "image/jpeg", 0.86));
    const body = new FormData();
    body.set("sessionId", state.sessionId);
    body.set("kind", "photo");
    body.set("file", blob, "photo.jpg");
    const uploaded = await api("/api/visualize/upload", { method: "POST", body });
    state.photoId = uploaded.id;
    state.beforeUrl = uploaded.url;
    state.vehicle.stock = false;
    state.vehicle.body = "";
    state.vehicle.bodyPicked = false;
    const found = await api("/api/visualize/identify", jsonBody({ sessionId: state.sessionId, photoId: uploaded.id }));
    state.vehicle.year = found.vehicle.year || "";
    state.vehicle.make = found.vehicle.make || "";
    state.vehicle.model = found.vehicle.model || "";
    state.vehicle.color = found.vehicle.color || "";
    state.vehicle.body = found.vehicle.body || "";
    state.vehicle.label = found.label || "your vehicle";
    setStage(uploaded.url, state.vehicle.label, "Your vehicle");
    stop();
    clearPanel();
    await typeLine(found.label && found.label !== "your vehicle"
      ? `This looks like a ${found.label}. Does this look like your car?`
      : "I have your photo. Does this look like your vehicle?");
    $("panel").append(
      el("button", { class: "gold-btn", type: "button", onclick: () => builder() }, "Looks great — Next step"),
      el("button", { class: "line-btn", type: "button", onclick: vehicleForm }, "Wrong car — edit"),
    );
  } catch (err) {
    stop();
    toast(err.message);
  }
}

async function placePath(category) {
  await user(category === "sign" ? "Storefront sign" : "Window graphics");
  await ensureSession(category);
  clearPanel();
  setStage(SAMPLE, category === "sign" ? "Sample storefront" : "Sample windows", "Sample storefront");
  state.beforeUrl = SAMPLE;
  await typeLine(category === "sign"
    ? "I've started you on a sample storefront. Use it, or upload a photo of your wall."
    : "I've started you on a sample storefront. Use it, or upload a photo of your windows.");
  const input = el("input", { type: "file", accept: "image/*,.heic,.heif" });
  input.addEventListener("change", () => uploadPlace(input));
  $("panel").append(
    el("button", { class: "gold-btn", type: "button", onclick: () => useSample(category) }, category === "sign" ? "Use this storefront" : "Use this storefront"),
    el("label", { class: "field" }, ["I have a photo", input]),
  );
}

async function useSample() {
  await user("Use this storefront");
  const stop = startRing("Preparing the photo…", "One moment.");
  try {
    const blob = await (await fetch(SAMPLE)).blob();
    const body = new FormData();
    body.set("sessionId", state.sessionId);
    body.set("kind", "photo");
    body.set("file", blob, "storefront.jpg");
    const uploaded = await api("/api/visualize/upload", { method: "POST", body });
    state.photoId = uploaded.id;
    state.beforeUrl = uploaded.url;
    setStage(uploaded.url, state.category === "sign" ? "Storefront" : "Windows", "Storefront");
    stop();
    await builder();
  } catch (err) {
    stop();
    toast(err.message);
  }
}

async function uploadPlace(input) {
  const file = input.files?.[0];
  if (!file) return;
  const stop = startRing("Preparing the photo…", "One moment.");
  try {
    const { canvas } = await loadImageFile(file, { maxSide: 1600 });
    const blob = await new Promise((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error("Could not read that image.")), "image/jpeg", 0.86));
    const body = new FormData();
    body.set("sessionId", state.sessionId);
    body.set("kind", "photo");
    body.set("file", blob, "place.jpg");
    const uploaded = await api("/api/visualize/upload", { method: "POST", body });
    state.photoId = uploaded.id;
    state.beforeUrl = URL.createObjectURL(blob);
    setStage(state.beforeUrl, state.category === "sign" ? "Your wall" : "Your windows", "Your photo");
    stop();
    await builder();
  } catch (err) {
    stop();
    toast(err.message);
  }
}

function words(value, max) {
  return String(value || "").trim().split(/\s+/).filter(Boolean).slice(0, max).join(" ");
}

function requiredReady() {
  return !!(state.coverage && state.style && state.business.colors.length);
}

async function builder() {
  clearPanel();
  showArrows(false);
  const intro = state.category === "vehicle"
    ? "Commercial wrap. Tap each section, then hit Generate. The preview renders on the vehicle."
    : state.category === "sign"
      ? "Storefront sign. Tap each section, then hit Generate. The preview renders on the wall."
      : "Window graphics. Tap each section, then hit Generate. The preview renders on the glass.";
  await typeLine(intro);
  const root = el("div");
  root.append(scanBlock(), section("coverage"), section("style"), section("colors"), section("logo"), section("name"), section("phone"), section("web"));
  const generate = el("button", { class: "gold-btn", id: "generateBtn", type: "button", onclick: generateConcepts }, "Generate");
  generate.disabled = !requiredReady();
  root.append(generate);
  $("panel").append(root);
  state._gen = generate;
}

function scanBlock() {
  const input = el("input", { id: "bizWeb", type: "url", placeholder: "yourbusiness.com", autocomplete: "url" });
  const button = el("button", { class: "gold-btn", type: "button", onclick: () => scan(input) }, "Scan");
  return el("div", {}, [
    el("p", { class: "hint" }, "Have a website? Prefill your details"),
    el("div", { class: "scan-row" }, [input, button]),
  ]);
}

async function scan(input) {
  try {
    const data = await api("/api/visualize/scan", jsonBody({ sessionId: state.sessionId, url: input.value }));
    const b = data.business || {};
    if (b.name) state.business.name = words(b.name, 5);
    if (b.phone) state.business.phone = words(b.phone, 3);
    if (b.web) state.business.web = words(b.web, 4);
    if (b.colors?.length) state.business.colors = b.colors.slice(0, 3);
    if (data.logoId) {
      state.logoId = data.logoId;
      const res = await fetch(data.logoUrl);
      const blob = await res.blob();
      state.logoPixels = await pixelsFromBlob(blob);
      state.logoUrl = URL.createObjectURL(blob);
    }
    toast("Details added. You can still edit each section.");
    await builder();
  } catch (err) {
    toast(err.message);
  }
}

function section(kind) {
  const open = el("div", { class: "acc-b" });
  const titles = {
    coverage: state.category === "sign" ? "Sign type" : state.category === "window" ? "Window type" : "Coverage Options",
    style: "Style Preference",
    colors: "Color Accents",
    logo: "Logo",
    name: "Business Name",
    phone: "Phone Number",
    web: "Website / URL",
  };
  const required = kind === "coverage" || kind === "style" || kind === "colors";
  const done = () => {
    if (kind === "coverage") return !!state.coverage;
    if (kind === "style") return !!state.style;
    if (kind === "colors") return state.business.colors.length > 0;
    if (kind === "logo") return !!state.logoId;
    if (kind === "name") return !!state.business.name;
    if (kind === "phone") return !!state.business.phone;
    return !!state.business.web;
  };
  const head = el("button", { class: "acc-h", type: "button" });
  const paintHead = () => {
    head.replaceChildren(
      el("span", {}, [titles[kind], required ? el("span", { class: "req" }, " *") : el("span", { class: "opt" }, " Optional")]),
      el("span", { class: done() ? "ok" : "" }, done() ? "✓" : "+"),
    );
  };
  paintHead();
  const body = buildSection(kind, () => { paintHead(); if (state._gen) state._gen.disabled = !requiredReady(); });
  open.append(body);
  open.hidden = true;
  head.addEventListener("click", () => { open.hidden = !open.hidden; });
  return el("div", { class: "acc" }, [head, open]);
}

function buildSection(kind, refresh) {
  if (kind === "coverage") {
    const options = state.category === "sign" ? SIGNS : state.category === "window" ? WINDOWS : COVERAGE;
    const wrap = el("div", { class: "cards3" });
    for (const [value, label] of options) {
      const btn = el("button", { type: "button", "aria-pressed": String(state.coverage === value) }, label);
      btn.addEventListener("click", () => {
        state.coverage = value;
        if (state.category === "sign") state.signType = value;
        if (state.category === "window") state.windowType = value;
        for (const other of wrap.querySelectorAll("button")) other.setAttribute("aria-pressed", "false");
        btn.setAttribute("aria-pressed", "true");
        refresh();
      });
      wrap.append(btn);
    }
    return wrap;
  }
  if (kind === "style") {
    const wrap = el("div", { class: "cards3" });
    for (const [value, label] of STYLES) {
      const btn = el("button", { type: "button", "aria-pressed": String(state.style === value) }, label);
      btn.addEventListener("click", () => {
        state.style = value;
        for (const other of wrap.querySelectorAll("button")) other.setAttribute("aria-pressed", "false");
        btn.setAttribute("aria-pressed", "true");
        refresh();
      });
      wrap.append(btn);
    }
    return el("div", {}, [el("p", { class: "hint" }, "Choose a design style"), wrap]);
  }
  if (kind === "colors") {
    const wrap = el("div", { class: "swatches" });
    const note = el("p", { class: "hint" });
    const palette = el("div", { class: "palette" });
    const paint = () => {
      note.textContent = state.business.colors.length ? `${state.business.colors.length} color${state.business.colors.length === 1 ? "" : "s"} selected` : "Pick up to 3";
      palette.replaceChildren(el("b", {}, "YOUR WRAP PALETTE"));
      state.business.colors.forEach((hex, index) => {
        const name = SWATCHES.find(item => item[0] === hex)?.[1] || hex;
        palette.append(el("div", {}, [el("span", { class: "dot", style: `background:${hex}` }), index === 0 ? `${name} · main` : name]));
      });
      for (const btn of wrap.querySelectorAll("button")) {
        const hex = btn.dataset.hex;
        const index = state.business.colors.indexOf(hex);
        btn.setAttribute("aria-pressed", index >= 0 ? "true" : "false");
        const badge = btn.querySelector("em");
        if (badge) badge.remove();
        if (index >= 0) btn.append(el("em", {}, String(index + 1)));
      }
      refresh();
    };
    for (const [hex, name] of SWATCHES) {
      const btn = el("button", { class: "swatch", type: "button", "aria-label": name, style: `background:${hex}`, "data-hex": hex });
      btn.addEventListener("click", () => {
        const index = state.business.colors.indexOf(hex);
        if (index >= 0) state.business.colors.splice(index, 1);
        else if (state.business.colors.length < 3) state.business.colors.push(hex);
        else toast("Pick up to 3 colors.");
        paint();
      });
      wrap.append(btn);
    }
    paint();
    return el("div", {}, [note, wrap, palette]);
  }
  if (kind === "logo") {
    const input = el("input", { id: "logoFile", type: "file", accept: "image/png,image/*,.heic,.heif" });
    const name = el("span", { class: "hint", id: "logoName" }, state.logoId ? "Logo added" : "PNG with a transparent background works best.");
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const { canvas } = await loadImageFile(file, { maxSide: 1200 });
        const blob = await new Promise((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error("Could not read that image.")), "image/png"));
        const body = new FormData();
        body.set("sessionId", state.sessionId);
        body.set("kind", "logo");
        body.set("file", blob, "logo.png");
        const data = await api("/api/visualize/upload", { method: "POST", body });
        state.logoId = data.id;
        state.logoPixels = await pixelsFromBlob(blob);
        state.logoUrl = URL.createObjectURL(blob);
        name.textContent = "Logo added";
        refresh();
      } catch (err) { toast(err.message); }
    });
    return el("div", {}, [name, input]);
  }
  const limits = { name: 5, phone: 3, web: 4 };
  const keys = { name: "name", phone: "phone", web: "web" };
  const key = keys[kind];
  const input = el("input", { id: `biz-${kind}`, maxlength: "80", value: state.business[key] || "", placeholder: kind === "name" ? "Your company or brand name" : "" });
  const count = el("span", { class: "wordcount" });
  const chips = el("div", { class: "chips" });
  const paintCount = () => {
    const text = words(input.value, limits[kind]);
    if (text !== input.value.trim().replace(/\s+/g, " ")) input.value = text;
    state.business[key] = text;
    const n = text ? text.split(" ").length : 0;
    count.textContent = `${n}/${limits[kind]} words`;
    refresh();
  };
  input.addEventListener("input", paintCount);
  for (const [value, label] of PLACES[state.category] || PLACES.vehicle) {
    const btn = el("button", { type: "button", "aria-pressed": state.places[key].includes(value) ? "true" : "false" }, label);
    btn.addEventListener("click", () => {
      const list = state.places[key];
      const index = list.indexOf(value);
      if (index >= 0) list.splice(index, 1);
      else list.push(value);
      btn.setAttribute("aria-pressed", list.includes(value) ? "true" : "false");
    });
    chips.append(btn);
  }
  paintCount();
  return el("div", {}, [input, count, el("p", { class: "hint" }, "Placement"), chips]);
}

function subjectBody() {
  const places = {
    namePlaces: state.places.name,
    phonePlaces: state.places.phone,
    webPlaces: state.places.web,
    style: state.style,
  };
  if (state.category === "sign") return { signType: state.signType, style: state.style, ...places, namePlaces: state.places.name, phonePlaces: state.places.phone, webPlaces: state.places.web };
  if (state.category === "window") return { windowType: state.windowType, panes: "the main storefront windows", ...places };
  const stock = state.vehicle.stock && !state.photoId;
  return {
    year: state.vehicle.year, make: state.vehicle.make, model: state.vehicle.model,
    body: stock ? "cargo-van" : (state.vehicle.body || ""),
    bodyPicked: !stock && !!state.vehicle.bodyPicked,
    color: state.vehicle.color || "white",
    coverage: state.coverage, stock, ...places,
  };
}

async function generateConcepts() {
  if (!requiredReady()) return;
  await user("Generate");
  clearPanel();
  const controller = new AbortController();
  state.abort = controller;
  const stop = startRing("Designing 3 concepts…", "This usually takes about a minute.", { cancel: true });
  $("cancelBtn").onclick = () => controller.abort();
  try {
    await afterGate();
    const data = await apiRetry("/api/visualize/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        sessionId: state.sessionId,
        business: { name: state.business.name, phone: state.business.phone, web: state.business.web, colors: state.business.colors },
        subject: subjectBody(),
        logoId: state.logoId,
        photoId: state.photoId,
      }),
    });
    if (!data.variants || data.variants.length !== CONCEPTS) throw new Error("The preview did not return 3 concepts. Try again.");
    state.concepts = data.variants;
    state.placements = {};
    state.index = 0;
    $("stubBanner").hidden = !data.stub;
    stop();
    await showConcepts();
  } catch (err) {
    stop();
    const keep = state.concepts.length === CONCEPTS;
    if (err.name === "AbortError") toast("Cancelled.");
    else toast(err.message);
    if (keep) await showConcepts();
    else await builder();
  } finally {
    state.abort = null;
  }
}

async function showConcepts() {
  clearPanel();
  showArrows(true);
  paintDots();
  await presentConcept();
  await typeLine(`Here are your ${CONCEPTS} concepts — swipe through and pick the direction you like best.`);
  const box = el("div");
  const left = EDITS - state.editsUsed;
  box.append(
    el("button", { class: "gold-btn", type: "button", onclick: useConcept }, "Use this concept — Next step"),
    el("button", { class: "line-btn", type: "button", onclick: anotherDesign }, "Create another design"),
    el("button", { class: "line-btn", type: "button", onclick: askChange }, left > 0 ? `Request a change (${left} left)` : "Revisions used"),
  );
  $("panel").append(box);
}

function paintDots() {
  const dots = $("dots");
  dots.replaceChildren();
  state.concepts.forEach((_, index) => {
    const btn = el("button", { type: "button", "aria-label": `Concept ${index + 1}`, "aria-current": index === state.index ? "true" : "false" });
    btn.addEventListener("click", () => { state.index = index; presentConcept(); paintDots(); });
    dots.append(btn);
  });
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

function clampPlace(rect, box) {
  const limit = box || { x: 0.02, y: 0.02, w: 0.96, h: 0.96 };
  const w = Math.min(Math.max(rect.w, 0.05), limit.w);
  const h = Math.min(Math.max(rect.h, 0.05), limit.h);
  const x = Math.min(Math.max(rect.x, limit.x), limit.x + limit.w - w);
  const y = Math.min(Math.max(rect.y, limit.y), limit.y + limit.h - h);
  return { x, y, w, h };
}

function currentConcept() {
  return state.concepts[state.index] || null;
}

function placeFor(concept, img) {
  if (state.placements[concept.id]) return state.placements[concept.id];
  const zone = concept.zone || { x: 0.4, y: 0.42, w: 0.2, h: 0.22 };
  const box = concept.vehicleBox;
  if (!state.logoPixels || !img?.naturalWidth) return clampPlace({ ...zone }, box);
  const normAspect = (state.logoPixels.width / state.logoPixels.height) * (img.naturalHeight / img.naturalWidth);
  let h = Math.max(zone.h, 0.12);
  let w = h * normAspect;
  const maxW = (box?.w || 0.5) * 0.42;
  if (w > maxW) {
    w = maxW;
    h = w / normAspect;
  }
  return clampPlace({ x: zone.x + zone.w / 2 - w / 2, y: zone.y + zone.h / 2 - h / 2, w, h }, box);
}

function frameMetrics() {
  const frame = $("stageFrame").getBoundingClientRect();
  const img = $("stageImg");
  const nw = img.naturalWidth || 1;
  const nh = img.naturalHeight || 1;
  const scale = Math.min(frame.width / nw, frame.height / nh);
  const w = nw * scale;
  const h = nh * scale;
  return { left: (frame.width - w) / 2, top: (frame.height - h) / 2, w, h };
}

function syncLogoEditor() {
  const editor = $("logoEditor");
  const concept = currentConcept();
  const show = !!(concept && state.logoPixels && state.concepts.length && $("stageBusy").hidden);
  editor.hidden = !show;
  $("logoHint").hidden = !show;
  if (!show) return;
  if (!state.placements[concept.id]) state.placements[concept.id] = placeFor(concept, $("stageImg"));
  const place = state.placements[concept.id];
  const metrics = frameMetrics();
  editor.style.left = `${metrics.left}px`;
  editor.style.top = `${metrics.top}px`;
  editor.style.width = `${metrics.w}px`;
  editor.style.height = `${metrics.h}px`;
  const box = $("logoBox");
  box.style.left = `${place.x * 100}%`;
  box.style.top = `${place.y * 100}%`;
  box.style.width = `${place.w * 100}%`;
  box.style.height = `${place.h * 100}%`;
  if (state.logoUrl) $("logoGhost").src = state.logoUrl;
}

async function presentConcept() {
  const concept = state.concepts[state.index];
  if (!concept) return;
  $("stageLabel").textContent = `Concept ${state.index + 1} of ${state.concepts.length}`;
  const img = $("stageImg");
  img.alt = `Concept ${state.index + 1} of ${state.concepts.length}`;
  if (img.src !== new URL(concept.url, location.origin).href) img.src = concept.url;
  state.shownUrl = concept.url;
  paintDots();
  try { await img.decode(); } catch { /* the overlay waits for naturalWidth */ }
  syncLogoEditor();
}

async function useConcept() {
  await user(`Use concept ${state.index + 1}`);
  state.selected = new Set([state.concepts[state.index].id]);
  clearPanel();
  showArrows(true);
  await typeLine(state.category === "vehicle"
    ? "Here's your fully customized ride! Everything look good?"
    : "Here's your concept. Everything look good?");
  $("panel").append(
    el("button", { class: "gold-btn", type: "button", onclick: timeline }, "Request a follow-up"),
    el("button", { class: "line-btn", type: "button", onclick: startOver }, "Start over"),
  );
}

async function anotherDesign() {
  await user("Create another design");
  await generateConcepts();
}

async function askChange() {
  if (state.editsUsed >= EDITS) { toast("This preview already used its 3 revisions. Send it to Arc, or start over."); return; }
  clearPanel();
  const left = EDITS - state.editsUsed;
  await typeLine(`Tell me what to change. I'll keep the rest of this concept. ${left} revision${left === 1 ? "" : "s"} left.`);
  const input = el("textarea", { id: "editRequest", maxlength: "400", placeholder: "Make the phone number bigger" });
  $("panel").append(
    el("label", { class: "field" }, ["Request a change", input]),
    el("button", { class: "gold-btn", type: "button", onclick: () => applyChange(input) }, "Apply change"),
  );
}

async function applyChange(input) {
  const request = input.value.trim();
  if (request.length < 3) { toast("Say what you want changed."); return; }
  await user(request);
  clearPanel();
  const stop = startRing("Applying your change…", "Editing just that part of this concept.");
  try {
    const current = state.concepts[state.index];
    const data = await api("/api/visualize/edit", jsonBody({ sessionId: state.sessionId, renderId: current.id, request }));
    state.concepts[state.index] = data.render;
    delete state.placements[data.render.id];
    state.editsUsed = data.editsUsed || state.editsUsed + 1;
    stop();
    await showConcepts();
  } catch (err) {
    stop();
    toast(err.message);
    await showConcepts();
  }
}

async function timeline() {
  clearPanel();
  await typeLine("When would you like this done?");
  const options = [
    ["asap", "ASAP"],
    ["weeks", "Within the next few weeks"],
    ["months", "1–3 months"],
    ["planning", "Just planning"],
  ];
  const box = el("div");
  for (const [value, label] of options) {
    box.append(el("button", { class: "line-btn", type: "button", onclick: () => { state.timing = value; user(label).then(lead); } }, label));
  }
  $("panel").append(box);
}

async function lead() {
  clearPanel();
  showArrows(true);
  await typeLine("Last step. Add a name, phone, and email. Arc will follow up.");
  const form = $("leadForm");
  form.hidden = false;
  $("panel").append(form);
  $("leadTiming").value = state.timing;
  const picks = $("designPicks");
  picks.replaceChildren(el("p", { class: "hint" }, "Which designs do you want a quote on? Tap to select."));
  const row = el("div", { class: "thumbs" });
  state.concepts.forEach((concept, index) => {
    const btn = el("button", { type: "button", "aria-pressed": state.selected.has(concept.id) ? "true" : "false", "aria-label": `Concept ${index + 1}` });
    btn.append(el("img", { src: concept.url, alt: "" }));
    btn.addEventListener("click", () => {
      if (state.selected.has(concept.id)) state.selected.delete(concept.id);
      else state.selected.add(concept.id);
      btn.setAttribute("aria-pressed", state.selected.has(concept.id) ? "true" : "false");
      paintSummary();
    });
    row.append(btn);
  });
  picks.append(row);
  paintSummary();
}

function coverageLabel() {
  const list = state.category === "sign" ? SIGNS : state.category === "window" ? WINDOWS : COVERAGE;
  return list.find(item => item[0] === state.coverage)?.[1] || state.coverage;
}

function paintSummary() {
  const kind = state.category === "vehicle" ? "Commercial Wrap" : state.category === "sign" ? "Storefront sign" : "Window graphics";
  $("summaryCard").replaceChildren(
    el("div", {}, vehicleLabel()),
    el("div", {}, `${kind}${state.business.name ? ` — ${state.business.name}` : ""}`),
    el("div", {}, coverageLabel()),
    el("div", {}, "Custom quote"),
  );
}

async function sendLead(ev) {
  ev.preventDefault();
  const name = $("leadName").value.trim();
  const phone = $("leadPhone").value.trim();
  const email = $("leadEmail").value.trim();
  if (name.length < 2 || (phone.match(/\d/g) || []).length < 7 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    toast("Enter your name, phone, and email.");
    return;
  }
  if (!state.selected.size) { toast("Tap at least one design."); return; }
  const ids = [...state.selected];
  const urls = state.concepts.filter(item => state.selected.has(item.id)).map(item => new URL(item.url, location.origin).href);
  $("leadCompany").value = state.business.name;
  $("leadCategory").value = state.category;
  $("leadVehicle").value = vehicleLabel();
  $("leadCoverage").value = coverageLabel();
  $("leadStyle").value = state.style;
  $("leadColors").value = state.business.colors.join(", ");
  $("leadDesigns").value = urls.join(" ");
  $("leadMessage").value = `${vehicleLabel()} · ${coverageLabel()} · ${state.business.name || "No business name"}`;
  const stop = startRing("Sending this to Arc…", "One moment.");
  try {
    await afterGate();
    const formData = new FormData($("leadForm"));
    const posted = fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    });
    const saved = apiRetry("/api/visualize/lead", jsonBody({
      sessionId: state.sessionId,
      name, phone, email,
      timing: state.timing,
      renderId: ids[0],
      smsTransactional: $("smsUpdates").checked === true,
      smsPromo: $("smsPromos").checked === true,
      quad: currentQuad(),
    }));
    const [formRes, apiRes] = await Promise.allSettled([posted, saved]);
    if (apiRes.status === "rejected" && formRes.status === "rejected") throw apiRes.reason;
    if (apiRes.status === "rejected" && !/already sent/i.test(apiRes.reason.message || "")) {
      if (formRes.status !== "fulfilled" || !formRes.value.ok) throw apiRes.reason;
    }
    stop();
    $("leadForm").hidden = true;
    clearPanel();
    await typeLine("Arc will email back from arc@arcsignco.com (check spam or promotions).");
    $("panel").append(el("a", { class: "gold-btn", href: "tel:+13474502110" }, "Call or text (347) 450-2110"));
  } catch (err) {
    stop();
    toast(err.message);
  }
}

async function startOver() {
  state.sessionId = "";
  state.business = { name: "", phone: "", web: "", colors: [] };
  state.coverage = "";
  state.style = "";
  state.places = { name: [], phone: [], web: [] };
  state.logoId = "";
  state.logoPixels = null;
  state.logoUrl = "";
  state.placements = {};
  state.concepts = [];
  state.editsUsed = 0;
  state.selected = new Set();
  $("log").replaceChildren();
  $("stubBanner").hidden = true;
  $("upBtn").setAttribute("aria-pressed", "false");
  $("downBtn").setAttribute("aria-pressed", "false");
  await choice();
}

function currentQuad() {
  const concept = currentConcept();
  const place = concept && state.placements[concept.id];
  if (!place) return undefined;
  return [
    { x: place.x, y: place.y },
    { x: place.x + place.w, y: place.y },
    { x: place.x + place.w, y: place.y + place.h },
    { x: place.x, y: place.y + place.h },
  ];
}

function colorNames() {
  return state.business.colors.map(hex => SWATCHES.find(item => item[0] === hex)?.[1] || hex).join(", ");
}

function styleLabel() {
  return STYLES.find(item => item[0] === state.style)?.[1] || state.style || "";
}

async function compositedPixels() {
  const concept = currentConcept();
  const src = concept?.url || $("stageImg").src;
  const blob = await (await fetch(src)).blob();
  const base = await pixelsFromBlob(blob);
  const place = concept && state.placements[concept.id];
  if (!state.logoPixels || !place) return base;
  const quad = currentQuad().map(point => ({ x: point.x * base.width, y: point.y * base.height }));
  return compositeLogo(base, state.logoPixels, quad);
}

function canvasFromPixels(frame) {
  const canvas = document.createElement("canvas");
  canvas.width = frame.width;
  canvas.height = frame.height;
  canvas.getContext("2d").putImageData(new ImageData(new Uint8ClampedArray(frame.data), frame.width, frame.height), 0, 0);
  return canvas;
}

async function downloadImage() {
  const frame = await compositedPixels();
  const bitmap = await createImageBitmap(await new Promise(resolve => canvasFromPixels(frame).toBlob(resolve, "image/png")));
  const footer = 72;
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height + footer;
  const g = canvas.getContext("2d");
  g.drawImage(bitmap, 0, 0);
  g.fillStyle = "rgba(244,247,242,.9)";
  g.font = "600 22px Georgia, serif";
  g.textAlign = "right";
  g.fillText("Arc Signage Co.", bitmap.width - 18, bitmap.height - 16);
  g.fillStyle = "#0B1F3A";
  g.fillRect(0, bitmap.height, canvas.width, footer);
  g.fillStyle = "#D4A53C";
  g.textAlign = "left";
  g.font = "700 26px Georgia, serif";
  g.fillText("Arc Signage Co.", 20, bitmap.height + 32);
  g.fillStyle = "#e7eef6";
  g.font = "16px sans-serif";
  g.fillText("Concept only · (347) 450-2110 · arc@arcsignco.com", 20, bitmap.height + 56);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", 0.92));
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "arc-signage-concept.jpg";
  a.click();
  toast("Download started");
}

async function proofLines() {
  const vehicle = vehicleLabel();
  return [
    `Vehicle: ${vehicle}`,
    `Coverage: ${coverageLabel() || "Wrap"}`,
    `Style: ${styleLabel() || "Not set"}`,
    `Colors: ${colorNames() || "Not set"}`,
    `Business: ${state.business.name || "Not set"}`,
    `Phone on the wrap: ${state.business.phone || "Not set"}`,
    `Website on the wrap: ${state.business.web || "Not set"}`,
    "Contact Arc: arc@arcsignco.com · (347) 450-2110",
    "This is an AI-generated concept, not a measured proof or a quote.",
    "Color, fit, and lettering can change after Arc reviews the vehicle.",
  ];
}

async function downloadProof() {
  const frame = await compositedPixels();
  const jpeg = await new Promise(resolve => canvasFromPixels(frame).toBlob(resolve, "image/jpeg", 0.92));
  const pdf = buildProofPdf({ jpeg: new Uint8Array(await jpeg.arrayBuffer()), lines: await proofLines() });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
  a.download = "arc-signage-concept.pdf";
  a.click();
  toast("Proof downloaded");
}

async function shareImage() {
  const concept = currentConcept();
  let url = new URL(concept?.url || state.shownUrl, location.origin).href;
  if (concept && state.sessionId) {
    try {
      const shared = await api("/api/visualize/share", jsonBody({
        sessionId: state.sessionId,
        renderId: concept.id,
        quad: currentQuad(),
      }));
      url = new URL(shared.url, location.origin).href;
    } catch (err) {
      toast(err.message);
      return;
    }
  }
  if (navigator.share) {
    try {
      await navigator.share({ title: "Arc Signage Co concept", url });
      toast("Shared");
      return;
    } catch (err) {
      if (err.name === "AbortError") return;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    toast("Link copied");
  } catch {
    toast(url);
  }
}

async function openCompare() {
  $("compareBefore").src = state.beforeUrl || STOCK;
  try {
    const frame = await compositedPixels();
    $("compareAfter").src = canvasFromPixels(frame).toDataURL("image/jpeg", 0.9);
  } catch {
    $("compareAfter").src = state.shownUrl;
  }
  $("compareBox").style.setProperty("--x", "50%");
  $("compareModal").hidden = false;
}

function dragCompare(ev) {
  const box = $("compareBox").getBoundingClientRect();
  const x = Math.min(100, Math.max(0, ((ev.clientX - box.left) / box.width) * 100));
  $("compareBox").style.setProperty("--x", `${x}%`);
}

let dragOn = false;
$("compareBox").addEventListener("pointerdown", (ev) => { dragOn = true; ev.currentTarget.setPointerCapture(ev.pointerId); dragCompare(ev); });
$("compareBox").addEventListener("pointermove", (ev) => { if (dragOn) dragCompare(ev); });
$("compareBox").addEventListener("pointerup", () => { dragOn = false; });

$("reportBtn").addEventListener("click", () => {
  $("reportSlot").append($("reportForm"));
  $("reportForm").hidden = false;
  $("reportModal").hidden = false;
});
$("reportClose").addEventListener("click", () => { $("reportModal").hidden = true; });
$("reportForm").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const data = new FormData($("reportForm"));
  try {
    const res = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(data).toString() });
    if (!res.ok) throw new Error("Could not send that note.");
    $("reportModal").hidden = true;
    $("reportMessage").value = "";
    toast("Thanks — Arc has this note.");
  } catch (err) { toast(err.message); }
});
$("compareBtn").addEventListener("click", () => openCompare().catch(err => toast(err.message)));
$("compareClose").addEventListener("click", () => { $("compareModal").hidden = true; });
$("downloadBtn").addEventListener("click", () => downloadImage().catch(err => toast(err.message)));
$("proofBtn").addEventListener("click", () => downloadProof().catch(err => toast(err.message)));
$("shareBtn").addEventListener("click", () => shareImage());
$("upBtn").addEventListener("click", () => { $("upBtn").setAttribute("aria-pressed", "true"); $("downBtn").setAttribute("aria-pressed", "false"); toast("Thanks — that helps."); });
$("downBtn").addEventListener("click", () => { $("downBtn").setAttribute("aria-pressed", "true"); $("upBtn").setAttribute("aria-pressed", "false"); toast("Thanks — that helps."); });
$("prevConcept").addEventListener("click", () => { if (!state.concepts.length) return; state.index = (state.index + state.concepts.length - 1) % state.concepts.length; presentConcept(); });
$("nextConcept").addEventListener("click", () => { if (!state.concepts.length) return; state.index = (state.index + 1) % state.concepts.length; presentConcept(); });
window.addEventListener("resize", () => syncLogoEditor());

function dragLogo(mode, ev) {
  const concept = currentConcept();
  if (!concept || !state.placements[concept.id]) return;
  ev.preventDefault();
  const editor = $("logoEditor").getBoundingClientRect();
  const start = { x: ev.clientX, y: ev.clientY, place: { ...state.placements[concept.id] } };
  const move = (e) => {
    const dx = (e.clientX - start.x) / editor.width;
    const dy = (e.clientY - start.y) / editor.height;
    const box = concept.vehicleBox;
    if (mode === "resize") {
      const img = $("stageImg");
      const aspect = state.logoPixels ? (state.logoPixels.width / state.logoPixels.height) * (img.naturalHeight / img.naturalWidth) : start.place.w / start.place.h;
      const w = Math.max(0.06, start.place.w + dx);
      state.placements[concept.id] = clampPlace({ ...start.place, w, h: w / aspect }, box);
    } else {
      state.placements[concept.id] = clampPlace({ ...start.place, x: start.place.x + dx, y: start.place.y + dy }, box);
    }
    syncLogoEditor();
  };
  const up = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}
$("logoBox").addEventListener("pointerdown", (ev) => {
  if (ev.target.id === "logoResize") return;
  dragLogo("move", ev);
});
$("logoResize").addEventListener("pointerdown", (ev) => dragLogo("resize", ev));
$("leadForm").addEventListener("submit", sendLead);
$("cancelBtn").addEventListener("click", () => state.abort?.abort());

let touchX = 0;
$("stageImg").addEventListener("touchstart", (ev) => { touchX = ev.changedTouches[0].clientX; }, { passive: true });
$("stageImg").addEventListener("touchend", (ev) => {
  if (!state.concepts.length) return;
  const dx = ev.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) < 40) return;
  state.index = (state.index + (dx < 0 ? 1 : state.concepts.length - 1)) % state.concepts.length;
  presentConcept();
});

choice().catch(err => toast(err.message));
