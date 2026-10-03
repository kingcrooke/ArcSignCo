import { formatFtIn, formatDay } from "./format.js";
import {
  CONCEPT_DISCLAIMER,
  ILLUMINATION_MODES,
  SIGN_TYPES,
  formatUsd,
  preliminaryPrice,
} from "./pricing-config.js";
import { buildProofPdf, canvasToJpeg, imageToDataUrl, loadLogoDataUrl } from "./proof-pdf.js";
import { renderScene } from "./scene.js";

const $ = (id) => document.getElementById(id);
const canvas = $("viewCanvas");
const ctx = canvas.getContext("2d", { alpha: false });
const host = $("canvasHost");

const state = {
  photo: null,
  photoW: 0,
  photoH: 0,
  sign: null,
  signW: 0,
  signH: 0,
  scale: 1,
  panX: 0,
  panY: 0,
  ppi: null,
  calLine: null,
  calApplied: false,
  signCorners: null,
  mode: "pan",
  drag: null,
  signOpacity: 0.85,
  dpr: 1,
  signType: "channel-letters",
  illumination: "face-lit",
  night: false,
  neonColor: "#ff3b30",
  viewCache: null,
  shareStamp: "",
};

const HANDLE_R = 14;

function setHint(text) {
  const el = $("hintOverlay");
  if (!text) {
    el.hidden = true;
    return;
  }
  el.hidden = false;
  el.textContent = text;
}

function resizeCanvas() {
  const rect = host.getBoundingClientRect();
  state.dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.floor(rect.width * state.dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * state.dpr));
  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";
  draw();
}

function fitToView() {
  if (!state.photo) return;
  const vw = canvas.width / state.dpr;
  const vh = canvas.height / state.dpr;
  const pad = 24;
  const sx = (vw - pad * 2) / state.photoW;
  const sy = (vh - pad * 2) / state.photoH;
  state.scale = Math.min(sx, sy, 1);
  state.panX = (vw - state.photoW * state.scale) / 2;
  state.panY = (vh - state.photoH * state.scale) / 2;
  $("zoomLabel").textContent = Math.round(state.scale * 100) + "%";
  draw();
}

function screenToWorld(sx, sy) {
  return {
    x: (sx - state.panX) / state.scale,
    y: (sy - state.panY) / state.scale,
  };
}

function pointerPos(e) {
  const rect = canvas.getBoundingClientRect();
  const cx = e.clientX ?? e.touches?.[0]?.clientX;
  const cy = e.clientY ?? e.touches?.[0]?.clientY;
  return { x: cx - rect.left, y: cy - rect.top };
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function defaultSignCorners() {
  if (!state.photo) return null;
  const cx = state.photoW * 0.5;
  const cy = state.photoH * 0.38;
  const w = state.photoW * 0.42;
  const h = w * ((state.signH / state.signW) || 0.28);
  return [
    { x: cx - w / 2, y: cy - h / 2 },
    { x: cx + w / 2, y: cy - h / 2 },
    { x: cx + w / 2, y: cy + h / 2 },
    { x: cx - w / 2, y: cy + h / 2 },
  ];
}

function edgeLen(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getSignDimensionsInches() {
  if (!state.ppi || !state.signCorners) return null;
  const c = state.signCorners;
  const widthIn = ((edgeLen(c[0], c[1]) + edgeLen(c[3], c[2])) / 2) / state.ppi;
  const heightIn = ((edgeLen(c[0], c[3]) + edgeLen(c[1], c[2])) / 2) / state.ppi;
  return { widthIn, heightIn };
}

function sceneStamp() {
  const c = state.signCorners;
  const corners = c ? c.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(";") : "";
  return [
    state.signType,
    state.illumination,
    state.neonColor,
    state.signOpacity,
    corners,
    state.ppi,
    state.calApplied,
    $("projectName").value.trim(),
  ].join("|");
}

function viewComposite() {
  const dragging = state.drag?.type === "corner";
  const maxEdge = dragging ? 900 : 1400;
  const subdiv = dragging ? 10 : 16;
  const key = `${sceneStamp()}|${maxEdge}`;
  if (state.viewCache?.key === key) return state.viewCache.canvas;
  const rendered = renderScene({
    photo: state.photo,
    photoW: state.photoW,
    photoH: state.photoH,
    sign: state.sign,
    corners: state.signCorners,
    opacity: state.signOpacity,
    night: state.night,
    signType: state.signType,
    illumination: state.illumination,
    neonColor: state.neonColor,
    ppi: state.calApplied ? state.ppi : null,
    maxEdge,
    subdiv,
  });
  state.viewCache = { key, canvas: rendered };
  return rendered;
}

function draw() {
  const dpr = state.dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const vw = canvas.width / dpr;
  const vh = canvas.height / dpr;
  ctx.fillStyle = state.night ? "#0c121c" : "#e8ecf2";
  ctx.fillRect(0, 0, vw, vh);
  if (!state.photo) return;

  const composite = viewComposite();
  ctx.save();
  ctx.translate(state.panX, state.panY);
  ctx.scale(state.scale, state.scale);
  if (composite) ctx.drawImage(composite, 0, 0, state.photoW, state.photoH);

  if (state.calLine) {
    ctx.strokeStyle = "#d4a843";
    ctx.lineWidth = 3 / state.scale;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(state.calLine.a.x, state.calLine.a.y);
    ctx.lineTo(state.calLine.b.x, state.calLine.b.y);
    ctx.stroke();
    ctx.fillStyle = "#0b1d33";
    for (const p of [state.calLine.a, state.calLine.b]) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5 / state.scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (state.signCorners && state.sign) {
    ctx.strokeStyle = "rgba(212, 168, 67, 0.9)";
    ctx.lineWidth = 2 / state.scale;
    ctx.beginPath();
    ctx.moveTo(state.signCorners[0].x, state.signCorners[0].y);
    for (let i = 1; i < 4; i++) ctx.lineTo(state.signCorners[i].x, state.signCorners[i].y);
    ctx.closePath();
    ctx.stroke();
    for (const p of state.signCorners) {
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#0b1d33";
      ctx.lineWidth = 2 / state.scale;
      ctx.beginPath();
      ctx.arc(p.x, p.y, HANDLE_R / state.scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }
  ctx.restore();
}

function hitSignCorner(wx, wy) {
  if (!state.signCorners) return -1;
  const thr = HANDLE_R / state.scale + 4 / state.scale;
  for (let i = 0; i < 4; i++) {
    if (dist({ x: wx, y: wy }, state.signCorners[i]) <= thr) return i;
  }
  return -1;
}

function setMode(mode) {
  state.mode = mode;
  host.classList.toggle("mode-calibrate", mode === "calibrate");
  const labels = {
    pan: "Pan and zoom. Drag empty area. Pinch on a phone.",
    calibrate: "Calibration: tap two points on a known dimension.",
    sign: "Drag the corner handles. Day and night use this same pin.",
  };
  $("modeLabel").textContent = labels[mode] || "";
}

function readRealInches() {
  if ($("lengthMode").value === "in") return parseFloat($("calInchesOnly").value) || 0;
  const ft = parseFloat($("calFeet").value) || 0;
  const inch = parseFloat($("calInches").value) || 0;
  return ft * 12 + inch;
}

function sizeLine(dims) {
  if (dims && state.calApplied) {
    return `Approximate sign size: ${formatFtIn(dims.widthIn)} wide x ${formatFtIn(dims.heightIn)} tall (from photo calibration)`;
  }
  return "Sign size: not calibrated. Draw a scale line on the photo for approximate dimensions.";
}

function signLine() {
  const type = SIGN_TYPES.find((item) => item.id === state.signType);
  const light = ILLUMINATION_MODES.find((item) => item.id === state.illumination);
  return `Sign: ${type?.label || "Sign"} · Light: ${light?.label || "Face-lit"}`;
}

function updateDimReadout() {
  const box = $("dimReadout");
  if (!state.ppi || !state.signCorners || !state.calApplied) {
    box.hidden = true;
  } else {
    const dims = getSignDimensionsInches();
    $("dimText").textContent = `Sign size ~ ${formatFtIn(dims.widthIn)} wide x ${formatFtIn(dims.heightIn)} tall`;
    box.hidden = false;
  }
  updatePricePreview();
  markShareStale();
}

function updatePricePreview() {
  const card = $("pricePreview");
  card.replaceChildren();
  const tag = document.createElement("div");
  tag.className = "tag";
  tag.textContent = "Arc placeholder rate";
  card.appendChild(tag);
  const dims = state.calApplied ? getSignDimensionsInches() : null;
  const price = dims ? preliminaryPrice(state.signType, dims.widthIn, state.illumination) : null;
  const amount = document.createElement("div");
  amount.className = "amount";
  if (!price) {
    amount.textContent = "Calibrate a width to estimate.";
    card.appendChild(amount);
    const note = document.createElement("p");
    note.textContent = "The number uses the same width as the picture. It is not a quote.";
    card.appendChild(note);
    return;
  }
  amount.textContent = formatUsd(price.amountUsd);
  card.appendChild(amount);
  const breakdown = document.createElement("p");
  breakdown.textContent = `${price.signTypeLabel}, ${formatFtIn(price.widthInches)} wide, ${price.illuminationLabel}. Placeholder math: ${formatUsd(price.baseUsd)} base + ${formatUsd(price.widthPartUsd)} width + ${formatUsd(price.illuminationUsd)} light.`;
  card.appendChild(breakdown);
  const note = document.createElement("p");
  note.textContent = `${price.disclaimer} ${CONCEPT_DISCLAIMER}`;
  card.appendChild(note);
}

function markShareStale() {
  const result = $("shareResult");
  if (result.hidden || !state.shareStamp) return;
  if (state.shareStamp !== sceneStamp()) {
    $("shareStatus").hidden = false;
    $("shareStatus").textContent = "The picture changed. Create a new link to update the proof. The old link still opens the previous snapshot.";
  }
}

function applyCalibration() {
  if (!state.calLine) return;
  const realIn = readRealInches();
  const px = dist(state.calLine.a, state.calLine.b);
  if (realIn <= 0 || px < 2) {
    $("calStatus").textContent = "Enter a real length and draw a longer line.";
    $("calStatus").className = "status";
    return;
  }
  state.ppi = px / realIn;
  state.calApplied = true;
  state.viewCache = null;
  $("calStatus").textContent = `Calibrated: ${state.ppi.toFixed(2)} px per inch along this line.`;
  $("calStatus").className = "status ok";
  $("exportPdfBtn").disabled = !state.photo;
  updateDimReadout();
  setMode(state.sign ? "sign" : "pan");
  setHint(state.sign ? "Corners, construction, and night view all use this pin." : "");
  draw();
}

async function fileToImage(file) {
  let blob = file;
  const name = (file.name || "").toLowerCase();
  const isHeic = file.type === "image/heic" || file.type === "image/heif" || name.endsWith(".heic") || name.endsWith(".heif");
  if (isHeic) {
    if (typeof heic2any !== "function") throw new Error("HEIC is not supported in this browser. Export as JPG or PNG.");
    const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
    blob = Array.isArray(converted) ? converted[0] : converted;
  }
  const url = URL.createObjectURL(blob);
  try {
    return await loadImageElement(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImageElement(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image."));
    img.src = url;
  });
}

function syncActions() {
  const ready = !!(state.photo && state.sign);
  $("exportPdfBtn").disabled = !state.photo;
  $("shareBtn").disabled = !ready;
  $("resetSignBtn").disabled = !state.sign;
}

async function onPhotoSelected(file) {
  if (!file) return;
  try {
    const img = await fileToImage(file);
    state.photo = img;
    state.photoW = img.naturalWidth;
    state.photoH = img.naturalHeight;
    state.calLine = null;
    state.calApplied = false;
    state.ppi = null;
    state.viewCache = null;
    $("calibrateBtn").disabled = false;
    $("clearCalBtn").disabled = false;
    $("applyCalBtn").disabled = false;
    $("calStatus").textContent = "Draw a calibration line, then apply.";
    $("calStatus").className = "status";
    setHint("Drag to pan. Calibrate before you trust the size or the placeholder price.");
    syncActions();
    updateDimReadout();
    fitToView();
  } catch (err) {
    alert(err.message || "Could not open photo.");
  }
}

async function onSignSelected(file) {
  if (!file) return;
  try {
    let img;
    if (file.type === "image/svg+xml" || (file.name || "").toLowerCase().endsWith(".svg")) {
      const text = await file.text();
      const url = URL.createObjectURL(new Blob([text], { type: "image/svg+xml" }));
      try {
        img = await loadImageElement(url);
      } finally {
        URL.revokeObjectURL(url);
      }
    } else {
      img = await fileToImage(file);
    }
    state.sign = img;
    state.signW = img.naturalWidth;
    state.signH = img.naturalHeight;
    state.signCorners = defaultSignCorners();
    state.viewCache = null;
    $("artworkBox").hidden = false;
    $("artworkThumb").src = imageToDataUrl(img, 480);
    syncActions();
    updateDimReadout();
    setMode("sign");
    setHint("Drag each corner to the facade. Construction and night view use this same pin.");
    draw();
  } catch (err) {
    alert(err.message || "Could not open sign image.");
  }
}

function renderExport(night) {
  return renderScene({
    photo: state.photo,
    photoW: state.photoW,
    photoH: state.photoH,
    sign: state.sign,
    corners: state.signCorners,
    opacity: state.signOpacity,
    night,
    signType: state.signType,
    illumination: state.illumination,
    neonColor: state.neonColor,
    ppi: state.calApplied ? state.ppi : null,
    maxEdge: 1800,
    subdiv: 20,
  });
}

async function exportPdf() {
  if (!state.photo) return;
  const button = $("exportPdfBtn");
  button.disabled = true;
  try {
    const logoData = await loadLogoDataUrl();
    const dims = getSignDimensionsInches();
    const day = renderExport(false);
    const night = renderExport(true);
    const light = ILLUMINATION_MODES.find((item) => item.id === state.illumination);
    const price = dims && state.calApplied ? preliminaryPrice(state.signType, dims.widthIn, state.illumination) : null;
    const doc = buildProofPdf({
      logoDataUrl: logoData,
      project: $("projectName").value.trim(),
      dateStr: formatDay(),
      dayDataUrl: canvasToJpeg(day, 1600, 0.9),
      nightDataUrl: canvasToJpeg(night, 1600, 0.9),
      artworkDataUrl: state.sign ? imageToDataUrl(state.sign, 1400) : "",
      sizeLine: sizeLine(dims),
      signLine: signLine(),
      nightLine: `Night view, ${light?.label || "Face-lit"}. Same pin as the day view.`,
      price,
      approvalLine: "Not approved yet. Use the phone link if you want a name and a time on the proof.",
    });
    const dateStr = formatDay().replace(/\s+/g, "-");
    doc.save(`arc-sign-mockup-${dateStr}.pdf`);
  } catch (err) {
    alert(err.message || "PDF export failed.");
  } finally {
    button.disabled = !state.photo;
  }
}

async function createShareLink() {
  if (!state.photo || !state.sign) return;
  const button = $("shareBtn");
  button.disabled = true;
  $("shareStatus").hidden = false;
  $("shareStatus").textContent = "Uploading the proof…";
  try {
    const dims = state.calApplied ? getSignDimensionsInches() : null;
    const day = renderExport(false);
    const night = renderExport(true);
    const body = {
      projectName: $("projectName").value.trim(),
      signType: state.signType,
      illumination: state.illumination,
      neonColor: state.neonColor,
      widthIn: dims?.widthIn ?? null,
      heightIn: dims?.heightIn ?? null,
      calibrated: !!state.calApplied,
      dayJpeg: canvasToJpeg(day, 1500, 0.82),
      nightJpeg: canvasToJpeg(night, 1500, 0.82),
      artwork: imageToDataUrl(state.sign, 1400),
      company: "",
    };
    const res = await fetch("/api/sign-proof", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(payload.error || "Could not create the approval link.");
    const url = new URL(payload.path, window.location.origin).href;
    state.shareStamp = sceneStamp();
    $("shareResult").hidden = false;
    $("shareUrl").value = url;
    $("shareOpen").href = url;
    $("shareStatus").textContent = "Phone link ready. It opens the day view, the night view, the artwork, and the placeholder price.";
  } catch (err) {
    $("shareStatus").textContent = err.message || "Could not create the approval link. The link needs the Netlify function on a deploy preview.";
  } finally {
    button.disabled = !(state.photo && state.sign);
  }
}

function onPointerDown(e) {
  if (e.button !== undefined && e.button !== 0) return;
  e.preventDefault();
  const sp = pointerPos(e);
  const w = screenToWorld(sp.x, sp.y);
  if (state.mode === "calibrate") {
    if (!state.calLine || dist(state.calLine.a, state.calLine.b) > 1) state.calLine = { a: w, b: w };
    else state.calLine.b = w;
    state.drag = { type: "cal-end", pointerId: e.pointerId };
    draw();
    return;
  }
  const corner = hitSignCorner(w.x, w.y);
  if (corner >= 0) {
    state.drag = { type: "corner", index: corner, pointerId: e.pointerId };
    setMode("sign");
    return;
  }
  state.drag = { type: "pan", pointerId: e.pointerId, last: sp };
  host.classList.add("panning");
}

function onPointerMove(e) {
  if (!state.drag || state.drag.pointerId !== e.pointerId) return;
  e.preventDefault();
  const sp = pointerPos(e);
  const w = screenToWorld(sp.x, sp.y);
  if (state.drag.type === "cal-end" && state.calLine) {
    state.calLine.b = w;
    draw();
    return;
  }
  if (state.drag.type === "corner" && state.signCorners) {
    state.signCorners[state.drag.index] = w;
    state.viewCache = null;
    updateDimReadout();
    draw();
    return;
  }
  if (state.drag.type === "pan" && state.drag.last) {
    state.panX += sp.x - state.drag.last.x;
    state.panY += sp.y - state.drag.last.y;
    state.drag.last = sp;
    draw();
  }
}

function onPointerUp(e) {
  if (!state.drag || state.drag.pointerId !== e.pointerId) return;
  const wasCorner = state.drag.type === "corner";
  state.drag = null;
  host.classList.remove("panning");
  if (wasCorner) {
    state.viewCache = null;
    draw();
  }
  if (state.mode === "calibrate" && state.calLine && dist(state.calLine.a, state.calLine.b) > 2) {
    $("calStatus").textContent = "Line drawn. Enter the real length and tap Apply calibration.";
  }
}

function setNight(night) {
  state.night = night;
  state.viewCache = null;
  for (const button of document.querySelectorAll("[data-night]")) {
    button.setAttribute("aria-pressed", String(button.dataset.night === (night ? "1" : "0")));
  }
  $("viewLabel").textContent = night ? "Night" : "Day";
  draw();
}

function setSignType(id) {
  if (!SIGN_TYPES.some((item) => item.id === id)) return;
  state.signType = id;
  state.viewCache = null;
  for (const button of document.querySelectorAll("[data-sign-type]")) {
    button.setAttribute("aria-pressed", String(button.dataset.signType === id));
  }
  updatePricePreview();
  markShareStale();
  draw();
}

function setIllumination(id) {
  if (!ILLUMINATION_MODES.some((item) => item.id === id)) return;
  state.illumination = id;
  state.viewCache = null;
  for (const button of document.querySelectorAll("[data-illumination]")) {
    button.setAttribute("aria-pressed", String(button.dataset.illumination === id));
  }
  $("neonField").hidden = id !== "neon";
  updatePricePreview();
  markShareStale();
  draw();
}

canvas.addEventListener("pointerdown", onPointerDown);
canvas.addEventListener("pointermove", onPointerMove);
canvas.addEventListener("pointerup", onPointerUp);
canvas.addEventListener("pointercancel", onPointerUp);

$("photoInput").addEventListener("change", (e) => onPhotoSelected(e.target.files?.[0]));
$("signInput").addEventListener("change", (e) => onSignSelected(e.target.files?.[0]));
$("calibrateBtn").addEventListener("click", () => {
  setMode("calibrate");
  setHint("Tap or click two points for the known dimension.");
});
$("clearCalBtn").addEventListener("click", () => {
  state.calLine = null;
  state.calApplied = false;
  state.ppi = null;
  state.viewCache = null;
  $("calStatus").textContent = "Calibration cleared.";
  $("calStatus").className = "status";
  updateDimReadout();
  draw();
});
$("applyCalBtn").addEventListener("click", applyCalibration);
$("lengthMode").addEventListener("change", () => {
  const inOnly = $("lengthMode").value === "in";
  $("ftInFields").hidden = inOnly;
  $("inOnlyField").hidden = !inOnly;
});
$("signOpacity").addEventListener("input", () => {
  state.signOpacity = parseInt($("signOpacity").value, 10) / 100;
  $("opacityVal").textContent = $("signOpacity").value + "%";
  state.viewCache = null;
  draw();
  markShareStale();
});
$("resetSignBtn").addEventListener("click", () => {
  if (state.sign) state.signCorners = defaultSignCorners();
  state.viewCache = null;
  updateDimReadout();
  draw();
});
$("projectName").addEventListener("input", markShareStale);
$("exportPdfBtn").addEventListener("click", () => exportPdf());
$("shareBtn").addEventListener("click", () => createShareLink());
$("copyLinkBtn").addEventListener("click", async () => {
  const url = $("shareUrl").value;
  try {
    await navigator.clipboard.writeText(url);
    $("copyLinkBtn").textContent = "Copied";
  } catch {
    $("shareUrl").focus();
    $("shareUrl").select();
  }
});
$("zoomInBtn").addEventListener("click", () => {
  state.scale *= 1.15;
  $("zoomLabel").textContent = Math.round(state.scale * 100) + "%";
  draw();
});
$("zoomOutBtn").addEventListener("click", () => {
  state.scale /= 1.15;
  $("zoomLabel").textContent = Math.round(state.scale * 100) + "%";
  draw();
});
$("zoomFitBtn").addEventListener("click", fitToView);
$("neonColor").addEventListener("input", () => {
  state.neonColor = $("neonColor").value;
  state.viewCache = null;
  markShareStale();
  draw();
});

for (const button of document.querySelectorAll("[data-night]")) {
  button.addEventListener("click", () => setNight(button.dataset.night === "1"));
}
for (const button of document.querySelectorAll("[data-sign-type]")) {
  button.addEventListener("click", () => setSignType(button.dataset.signType));
}
for (const button of document.querySelectorAll("[data-illumination]")) {
  button.addEventListener("click", () => setIllumination(button.dataset.illumination));
}

let pinch = null;
host.addEventListener(
  "touchstart",
  (e) => {
    if (e.touches.length !== 2) return;
    const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    const rect = canvas.getBoundingClientRect();
    const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
    const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
    pinch = { d, cx, cy, world: screenToWorld(cx, cy), scale: state.scale };
    e.preventDefault();
  },
  { passive: false }
);
host.addEventListener(
  "touchmove",
  (e) => {
    if (e.touches.length !== 2 || !pinch) return;
    const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    state.scale = pinch.scale * (d / pinch.d);
    state.panX = pinch.cx - pinch.world.x * state.scale;
    state.panY = pinch.cy - pinch.world.y * state.scale;
    $("zoomLabel").textContent = Math.round(state.scale * 100) + "%";
    draw();
    e.preventDefault();
  },
  { passive: false }
);
host.addEventListener("touchend", () => {
  pinch = null;
});
canvas.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    const sp = pointerPos(e);
    const before = screenToWorld(sp.x, sp.y);
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    state.scale *= factor;
    state.panX = sp.x - before.x * state.scale;
    state.panY = sp.y - before.y * state.scale;
    $("zoomLabel").textContent = Math.round(state.scale * 100) + "%";
    draw();
  },
  { passive: false }
);

window.addEventListener("resize", resizeCanvas);
updatePricePreview();
resizeCanvas();
