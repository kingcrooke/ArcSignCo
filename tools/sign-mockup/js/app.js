import {
  dist, centroid, pointInQuad, rectQuad, scaleQuad, quadSizeInches, formatFeetInches, formatArea, toInches,
} from "./geometry.js";
import { createWarper } from "./warp.js";
import { loadImageFile, renderTextSign, FONTS } from "./images.js";
import { buildProofPdf, DISCLAIMER } from "./pdf.js";

const $ = id => document.getElementById(id);
const stage = $("stage"), canvas = $("view"), ctx = canvas.getContext("2d");
const STEPS = ["photo", "scale", "sign", "export"];
const NAVY = "#0b1d33", GOLD = "#d4a843", GOLD2 = "#f0d080";
const LOGO_URL = "/assets/img/logo-lockup-white-847.v2.png";

const state = {
  step: "photo",
  photo: null,        // { canvas, name, heic }
  view: { s: 1, x: 0, y: 0 },
  fitted: true,
  cal: null,          // { a, b } in photo pixels
  calInches: 0,
  sign: null,         // canvas with the artwork
  signMode: "text",
  fileSign: null,
  quad: null,         // [tl, tr, br, bl] in photo pixels
  quadEdited: false,
  opacity: 1,
  selected: null,     // { kind: "cal" | "quad", index }
  touchedSign: false,
};

let warper = null;
let dpr = 1;
let raf = 0;
let drag = null;
const pointers = new Map();
let pinch = null;

// ---------- helpers ----------
const pxPerInch = () => (state.cal && state.calInches > 0 ? dist(state.cal.a, state.cal.b) / state.calInches : 0);
const calibrated = () => pxPerInch() > 0;
const toScreen = p => ({ x: state.view.x + p.x * state.view.s, y: state.view.y + p.y * state.view.s });
const toImage = (x, y) => ({ x: (x - state.view.x) / state.view.s, y: (y - state.view.y) / state.view.s });
const cssSize = () => ({ w: canvas.clientWidth, h: canvas.clientHeight });

function setStatus(text, error = false) {
  const el = $("status");
  el.textContent = text || "";
  el.classList.toggle("error", !!error);
}
function busy(text) {
  $("busy").hidden = !text;
  if (text) $("busyText").textContent = text;
}
function requestRender() {
  if (!raf) raf = requestAnimationFrame(render);
}
function sizeInfo() {
  if (!state.quad || !calibrated()) return null;
  const s = quadSizeInches(state.quad, pxPerInch());
  return { ...s, w: formatFeetInches(s.width), h: formatFeetInches(s.height), area: formatArea(s.width, s.height) };
}

// ---------- view ----------
function resizeCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 3);
  const { w, h } = cssSize();
  canvas.width = Math.max(1, Math.round(w * dpr));
  canvas.height = Math.max(1, Math.round(h * dpr));
  if (state.photo && state.fitted) fit();
  requestRender();
}
function fitScale() {
  const { w, h } = cssSize();
  const p = state.photo.canvas;
  return Math.min(w / p.width, h / p.height) * 0.94;
}
function fit() {
  if (!state.photo) return;
  const { w, h } = cssSize();
  const p = state.photo.canvas;
  const s = fitScale();
  state.view = { s, x: (w - p.width * s) / 2, y: (h - p.height * s) / 2 };
  state.fitted = true;
  requestRender();
}
function zoomAt(factor, cx, cy) {
  if (!state.photo) return;
  const min = fitScale() * 0.6, max = Math.max(fitScale() * 14, 6);
  const s = Math.min(max, Math.max(min, state.view.s * factor));
  const p = toImage(cx, cy);
  state.view = { s, x: cx - p.x * s, y: cy - p.y * s };
  state.fitted = false;
  requestRender();
}

// ---------- drawing ----------
function render() {
  raf = 0;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!state.photo) return;
  const { s, x, y } = state.view;
  const photo = state.photo.canvas;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(photo, x, y, photo.width * s, photo.height * s);

  if (state.sign && state.quad) {
    drawSign(ctx, state.quad.map(p => ({ x: (x + p.x * s) * dpr, y: (y + p.y * s) * dpr })));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const sq = state.quad && state.quad.map(toScreen);
  const size = sizeInfo();
  if (sq && size && $("showDims").checked && (state.step === "sign" || state.step === "export")) {
    drawDimensions(ctx, sq, size.w, size.h, 1);
  }
  if (state.cal && (state.step === "scale" || state.step === "sign")) drawCal(state.step === "scale");
  if (sq && state.step === "sign") drawQuadHandles(sq);
  if (drag && drag.type === "point") drawLoupe();
  updateChip(size);
}

function drawSign(target, quadPx) {
  if (!warper || !warper.ok) {
    warper = createWarper({ forceCpu: !!warper });
    warper.setSource(state.sign);
  }
  warper.draw(target, quadPx, state.opacity);
}

function handle(p, active, r = 9) {
  ctx.beginPath();
  ctx.arc(p.x, p.y, r + 3, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(11,29,51,.55)";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.fillStyle = active ? GOLD : "#fff";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = NAVY;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
  ctx.fillStyle = NAVY;
  ctx.fill();
}

function pill(g, c, text, angle, u, { bg = "rgba(11,29,51,.92)", fg = "#fff", border = GOLD2 } = {}) {
  g.save();
  g.translate(c.x, c.y);
  g.rotate(angle);
  g.font = `800 ${12 * u}px Arial, Helvetica, sans-serif`;
  const tw = g.measureText(text).width, ph = 21 * u, pw = tw + 14 * u;
  g.beginPath();
  if (g.roundRect) g.roundRect(-pw / 2, -ph / 2, pw, ph, ph / 2);
  else g.rect(-pw / 2, -ph / 2, pw, ph);
  g.fillStyle = bg;
  g.fill();
  g.lineWidth = 1 * u;
  g.strokeStyle = border;
  g.stroke();
  g.fillStyle = fg;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(text, 0, 0.5 * u);
  g.restore();
}

function drawCal(active) {
  const a = toScreen(state.cal.a), b = toScreen(state.cal.b);
  ctx.save();
  ctx.globalAlpha = active ? 1 : 0.55;
  ctx.lineCap = "round";
  ctx.setLineDash(active ? [] : [6, 5]);
  ctx.strokeStyle = "rgba(11,29,51,.8)";
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  ctx.strokeStyle = GOLD2;
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  ctx.setLineDash([]);
  if (active) {
    handle(a, state.selected?.kind === "cal" && state.selected.index === 0, 8);
    handle(b, state.selected?.kind === "cal" && state.selected.index === 1, 8);
  }
  let angle = Math.atan2(b.y - a.y, b.x - a.x);
  if (angle > Math.PI / 2 + 1e-3) angle -= Math.PI;
  if (angle < -Math.PI / 2 - 1e-3) angle += Math.PI;
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const off = { x: Math.sin(angle) * 18, y: -Math.cos(angle) * 18 };
  if (active && dist(a, b) > 30) {
    const label = state.calInches > 0 ? `${formatFeetInches(state.calInches)} reference` : "Enter length";
    pill(ctx, { x: mid.x + off.x, y: mid.y + off.y }, label, angle, 1, { bg: GOLD, fg: NAVY, border: NAVY });
  }
  ctx.restore();
}

function drawQuadHandles(sq) {
  ctx.save();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(11,29,51,.55)";
  ctx.beginPath();
  sq.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.closePath();
  ctx.stroke();
  ctx.lineWidth = 1.5;
  ctx.setLineDash([7, 5]);
  ctx.strokeStyle = GOLD2;
  ctx.stroke();
  ctx.restore();
  sq.forEach((p, i) => handle(p, state.selected?.kind === "quad" && state.selected.index === i));
}

// Architectural-style dimension lines along the top and left edges. u scales strokes and text.
function drawDimensions(target, q, wText, hText, u) {
  const c = centroid(q);
  dimLine(target, q[0], q[1], c, wText, u);
  dimLine(target, q[0], q[3], c, hText, u);
}
function dimLine(target, a, b, c, text, u) {
  const len = dist(a, b);
  if (len < 8 * u) return;
  const tx = (b.x - a.x) / len, ty = (b.y - a.y) / len;
  let nx = -ty, ny = tx;
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  if ((mid.x - c.x) * nx + (mid.y - c.y) * ny < 0) { nx = -nx; ny = -ny; }
  const off = 20 * u, A = { x: a.x + nx * off, y: a.y + ny * off }, B = { x: b.x + nx * off, y: b.y + ny * off };
  const path = () => {
    target.beginPath();
    target.moveTo(a.x + nx * 5 * u, a.y + ny * 5 * u); target.lineTo(A.x + nx * 5 * u, A.y + ny * 5 * u);
    target.moveTo(b.x + nx * 5 * u, b.y + ny * 5 * u); target.lineTo(B.x + nx * 5 * u, B.y + ny * 5 * u);
    target.moveTo(A.x, A.y); target.lineTo(B.x, B.y);
    for (const P of [A, B]) {
      const k = 5 * u;
      target.moveTo(P.x - (tx + nx) * k, P.y - (ty + ny) * k);
      target.lineTo(P.x + (tx + nx) * k, P.y + (ty + ny) * k);
    }
  };
  target.save();
  target.lineCap = "round";
  path(); target.strokeStyle = "rgba(11,29,51,.8)"; target.lineWidth = 4 * u; target.stroke();
  path(); target.strokeStyle = GOLD2; target.lineWidth = 1.6 * u; target.stroke();
  target.restore();
  let angle = Math.atan2(ty, tx);
  if (angle > Math.PI / 2 - 1e-3) angle -= Math.PI;
  if (angle <= -Math.PI / 2 - 1e-3) angle += Math.PI;
  pill(target, { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 }, text, angle, u);
}

function drawLoupe() {
  const ref = drag.ref;
  const p = getPoint(ref);
  if (!p) return;
  const { w } = cssSize();
  const R = Math.min(64, w * 0.16);
  const sp = toScreen(p);
  const left = sp.x > w / 2;
  const chip = $("chip");
  const top = 12 + (left && !chip.hidden ? chip.offsetHeight + 8 : 0);
  const c = { x: left ? 12 + R : w - 12 - R, y: top + R };
  const Ls = Math.min(Math.max(state.view.s * 3, 0.5), 8);
  const photo = state.photo.canvas;
  ctx.save();
  ctx.beginPath();
  ctx.arc(c.x, c.y, R, 0, Math.PI * 2);
  ctx.fillStyle = "#14263d";
  ctx.fill();
  ctx.clip();
  ctx.imageSmoothingEnabled = Ls < 3;
  ctx.drawImage(photo, p.x - R / Ls, p.y - R / Ls, (2 * R) / Ls, (2 * R) / Ls, c.x - R, c.y - R, 2 * R, 2 * R);
  const neighbors = ref.kind === "cal"
    ? [ref.index ? state.cal.a : state.cal.b]
    : [state.quad[(ref.index + 1) % 4], state.quad[(ref.index + 3) % 4]];
  ctx.strokeStyle = GOLD2;
  ctx.lineWidth = 1.5;
  for (const n of neighbors) {
    ctx.beginPath();
    ctx.moveTo(c.x, c.y);
    ctx.lineTo(c.x + (n.x - p.x) * Ls, c.y + (n.y - p.y) * Ls);
    ctx.stroke();
  }
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(c.x - 10, c.y); ctx.lineTo(c.x - 3, c.y); ctx.moveTo(c.x + 3, c.y); ctx.lineTo(c.x + 10, c.y);
  ctx.moveTo(c.x, c.y - 10); ctx.lineTo(c.x, c.y - 3); ctx.moveTo(c.x, c.y + 3); ctx.lineTo(c.x, c.y + 10);
  ctx.stroke();
  ctx.restore();
  ctx.beginPath();
  ctx.arc(c.x, c.y, R, 0, Math.PI * 2);
  ctx.lineWidth = 3;
  ctx.strokeStyle = GOLD;
  ctx.stroke();
}

function updateChip(size) {
  const chip = $("chip");
  let html = "";
  if (state.sign && state.quad && (state.step === "sign" || state.step === "export")) {
    html = size
      ? `≈ ${size.w} W × ${size.h} H<small>≈ ${size.area} · estimate from your scale line</small>`
      : `Sign placed<small>Set the scale in step 2 to see its size</small>`;
  } else if (state.step === "scale" && calibrated()) {
    html = `Scale set<small>${formatFeetInches(state.calInches)} reference line</small>`;
  }
  if (chip.innerHTML !== html) chip.innerHTML = html;
  chip.hidden = !html;
}

// ---------- points ----------
function getPoint(ref) {
  if (!ref) return null;
  if (ref.kind === "cal") return state.cal ? (ref.index ? state.cal.b : state.cal.a) : null;
  return state.quad ? state.quad[ref.index] : null;
}
function setPoint(ref, p) {
  const photo = state.photo.canvas;
  if (ref.kind === "cal") {
    const q = { x: Math.min(photo.width, Math.max(0, p.x)), y: Math.min(photo.height, Math.max(0, p.y)) };
    state.cal[ref.index ? "b" : "a"] = q;
  } else {
    const q = {
      x: Math.min(photo.width * 1.5, Math.max(-photo.width * 0.5, p.x)),
      y: Math.min(photo.height * 1.5, Math.max(-photo.height * 0.5, p.y)),
    };
    state.quad[ref.index] = q;
    state.quadEdited = true;
  }
}

function hitTest(x, y, touch) {
  const r = touch ? 26 : 16;
  const near = p => { const s = toScreen(p); return Math.hypot(s.x - x, s.y - y) <= r; };
  if (state.step === "scale" && state.cal) {
    if (near(state.cal.b)) return { type: "point", ref: { kind: "cal", index: 1 } };
    if (near(state.cal.a)) return { type: "point", ref: { kind: "cal", index: 0 } };
  }
  if (state.step === "sign" && state.quad) {
    let best = -1, bestD = Infinity;
    state.quad.forEach((p, i) => {
      const s = toScreen(p), d = Math.hypot(s.x - x, s.y - y);
      if (d <= r && d < bestD) { best = i; bestD = d; }
    });
    if (best >= 0) return { type: "point", ref: { kind: "quad", index: best } };
    if (pointInQuad(state.quad.map(toScreen), { x, y })) return { type: "move" };
  }
  if (state.step === "scale" && !state.cal) return { type: "newcal" };
  return { type: "pan" };
}

// ---------- pointer input ----------
function localXY(e) {
  const r = canvas.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}

canvas.addEventListener("pointerdown", e => {
  if (!state.photo) return;
  e.preventDefault();
  // Focusing on touch makes mobile Chrome drop the click on the next button tapped.
  if (e.pointerType !== "touch") canvas.focus({ preventScroll: true });
  canvas.setPointerCapture(e.pointerId);
  const pt = localXY(e);
  pointers.set(e.pointerId, pt);
  if (pointers.size === 2) {
    const [p1, p2] = [...pointers.values()];
    const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    if (drag && drag.type === "newcal") state.cal = null;
    drag = null;
    pinch = { d0: Math.max(10, dist(p1, p2)), s0: state.view.s, img: toImage(mid.x, mid.y) };
    stage.classList.remove("dragging", "drawing");
    requestRender();
    return;
  }
  if (pointers.size > 2) return;
  const hit = hitTest(pt.x, pt.y, e.pointerType !== "mouse");
  const img = toImage(pt.x, pt.y);
  if (hit.type === "newcal") {
    state.cal = { a: img, b: { ...img } };
    state.selected = { kind: "cal", index: 1 };
    drag = { type: "point", ref: state.selected, offset: { x: 0, y: 0 }, isNew: true, start: pt };
    stage.classList.add("drawing");
  } else if (hit.type === "point") {
    const p = getPoint(hit.ref);
    state.selected = hit.ref;
    drag = { type: "point", ref: hit.ref, offset: { x: p.x - img.x, y: p.y - img.y } };
    stage.classList.add("dragging");
  } else if (hit.type === "move") {
    drag = { type: "move", last: img };
    stage.classList.add("dragging");
  } else {
    drag = { type: "pan", last: pt };
    stage.classList.add("dragging");
  }
  requestRender();
});

canvas.addEventListener("pointermove", e => {
  if (!state.photo) return;
  const pt = localXY(e);
  if (pointers.has(e.pointerId)) pointers.set(e.pointerId, pt);
  if (pinch && pointers.size >= 2) {
    const [p1, p2] = [...pointers.values()];
    const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    const min = fitScale() * 0.6, max = Math.max(fitScale() * 14, 6);
    const s = Math.min(max, Math.max(min, pinch.s0 * (dist(p1, p2) / pinch.d0)));
    state.view = { s, x: mid.x - pinch.img.x * s, y: mid.y - pinch.img.y * s };
    state.fitted = false;
    requestRender();
    return;
  }
  if (!drag) {
    if (e.pointerType === "mouse") {
      const hit = hitTest(pt.x, pt.y, false);
      stage.classList.toggle("over-handle", hit.type === "point" || hit.type === "move");
      stage.classList.toggle("drawing", hit.type === "newcal");
    }
    return;
  }
  applyDrag(pt);
  requestRender();
});

function applyDrag(pt) {
  const img = toImage(pt.x, pt.y);
  if (drag.type === "point") {
    setPoint(drag.ref, { x: img.x + drag.offset.x, y: img.y + drag.offset.y });
    if (drag.ref.kind === "quad") state.touchedSign = true;
  } else if (drag.type === "move") {
    const dx = img.x - drag.last.x, dy = img.y - drag.last.y;
    state.quad = state.quad.map(p => ({ x: p.x + dx, y: p.y + dy }));
    drag.last = img;
    state.touchedSign = true;
  } else if (drag.type === "pan") {
    state.view.x += pt.x - drag.last.x;
    state.view.y += pt.y - drag.last.y;
    drag.last = pt;
    state.fitted = false;
  }
}

function endPointer(e) {
  pointers.delete(e.pointerId);
  if (pinch) {
    if (pointers.size < 2) pinch = null;
    if (pointers.size === 1) {
      const [id, pt] = [...pointers.entries()][0];
      drag = { type: "pan", last: pt, id };
    }
    return;
  }
  if (!drag) return;
  // Chrome aligns pointermove to frames, so the last move before a quick release can be skipped.
  if (e.type === "pointerup") applyDrag(localXY(e));
  if (drag.isNew && state.cal && dist(toScreen(state.cal.a), toScreen(state.cal.b)) < 8) {
    state.cal = null;
    state.selected = null;
  }
  drag = null;
  stage.classList.remove("dragging", "drawing");
  updateUI();
  requestRender();
}
canvas.addEventListener("pointerup", endPointer);
canvas.addEventListener("pointercancel", endPointer);
canvas.addEventListener("lostpointercapture", e => { if (pointers.has(e.pointerId)) endPointer(e); });

canvas.addEventListener("wheel", e => {
  if (!state.photo) return;
  e.preventDefault();
  const pt = localXY(e);
  const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
  zoomAt(Math.exp(-delta * (e.ctrlKey ? 0.01 : 0.0015)), pt.x, pt.y);
}, { passive: false });

canvas.addEventListener("keydown", e => {
  if (!state.photo) return;
  const { w, h } = cssSize();
  if (e.key === "+" || e.key === "=") { zoomAt(1.25, w / 2, h / 2); e.preventDefault(); return; }
  if (e.key === "-") { zoomAt(0.8, w / 2, h / 2); e.preventDefault(); return; }
  const dir = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
  if (!dir) return;
  e.preventDefault();
  const step = (e.shiftKey ? 10 : 1) / state.view.s;
  const ref = state.selected;
  const p = getPoint(ref);
  const editable = p && ((ref.kind === "cal" && state.step === "scale") || (ref.kind === "quad" && state.step === "sign"));
  if (editable) setPoint(ref, { x: p.x + dir[0] * step, y: p.y + dir[1] * step });
  else { state.view.x -= dir[0] * 20; state.view.y -= dir[1] * 20; state.fitted = false; }
  updateUI();
  requestRender();
});

// ---------- photo ----------
async function loadPhoto(file) {
  if (!file) return;
  setStatus("");
  busy("Opening photo…");
  try {
    const { canvas: c, heic } = await loadImageFile(file, { maxSide: 3200, onStatus: busy });
    state.photo = { canvas: c, name: file.name || "photo", heic };
    state.cal = null;
    state.calInches = toInches($("calFt").value, $("calIn").value);
    state.quad = null;
    state.quadEdited = false;
    state.selected = null;
    $("drop").hidden = true;
    $("zoomBar").hidden = false;
    stage.style.setProperty("--sm-ar", (c.height / c.width).toFixed(4));
    $("photoMeta").textContent = `${state.photo.name} · ${c.width} × ${c.height} px${heic ? " · converted from HEIC" : ""}`;
    fit();
    setStatus(heic ? "iPhone photo converted. Next, set the scale." : "Photo loaded. Next, set the scale.");
  } catch (err) {
    setStatus(err.message || "That file couldn't be opened.", true);
  } finally {
    busy("");
    updateUI();
  }
}

$("photoInput").addEventListener("change", e => { loadPhoto(e.target.files[0]); e.target.value = ""; });
stage.addEventListener("dragover", e => { e.preventDefault(); stage.classList.add("dropping"); });
stage.addEventListener("dragleave", e => { if (!stage.contains(e.relatedTarget)) stage.classList.remove("dropping"); });
stage.addEventListener("drop", e => {
  e.preventDefault();
  stage.classList.remove("dropping");
  const file = [...(e.dataTransfer?.files || [])][0];
  if (!file) return;
  if (state.step === "sign" && state.photo) {
    setSignMode("file");
    loadSignFile(file);
  } else {
    loadPhoto(file);
    setStep("photo");
  }
});
document.addEventListener("paste", e => {
  const file = [...(e.clipboardData?.files || [])].find(f => f.type.startsWith("image/"));
  if (!file || e.target.closest?.("input, textarea")) return;
  if (state.step === "sign" && state.photo) { setSignMode("file"); loadSignFile(file); }
  else loadPhoto(file);
});

// ---------- calibration ----------
function onCalInput() {
  state.calInches = toInches($("calFt").value, $("calIn").value);
  updateUI();
  requestRender();
}
$("calFt").addEventListener("input", onCalInput);
$("calIn").addEventListener("input", onCalInput);
$("redrawCal").addEventListener("click", () => {
  state.cal = null;
  state.selected = null;
  updateUI();
  requestRender();
});

// ---------- sign ----------
function setSign(source) {
  const prev = state.sign;
  state.sign = source;
  if (!warper || !warper.ok) warper = createWarper({ forceCpu: !!warper });
  warper.setSource(source);
  const aspect = source.height / source.width;
  if (!state.quad) placeSign(aspect);
  else if (!state.quadEdited && prev) {
    const c = centroid(state.quad), w = dist(state.quad[0], state.quad[1]);
    state.quad = rectQuad(c.x, c.y, w, w * aspect);
  }
  updateUI();
  requestRender();
}

function placeSign(aspect = state.sign.height / state.sign.width, keepCenter = false) {
  const photo = state.photo.canvas;
  let w = photo.width * 0.45;
  let c = { x: photo.width / 2, y: photo.height * 0.36 };
  if (keepCenter && state.quad) {
    c = centroid(state.quad);
    w = (dist(state.quad[0], state.quad[1]) + dist(state.quad[3], state.quad[2])) / 2;
  }
  if (w * aspect > photo.height * 0.5) w = (photo.height * 0.5) / aspect;
  state.quad = rectQuad(c.x, c.y, w, w * aspect);
  state.quadEdited = false;
}

function textSignOptions() {
  return {
    text: $("signTextInput").value,
    font: $("signFont").value,
    color: $("signColor").value,
    background: $("signBg").value,
    transparent: $("signTransparent").checked,
    glow: $("signGlow").checked,
  };
}
function updateTextSign() {
  if (state.signMode !== "text" || !state.photo) return;
  setSign(renderTextSign(textSignOptions()));
}

async function loadSignFile(file) {
  if (!file) return;
  busy("Opening artwork…");
  setStatus("");
  try {
    const { canvas: c, heic } = await loadImageFile(file, { maxSide: 2048, onStatus: busy });
    state.fileSign = c;
    state.quadEdited = false;
    $("signMeta").textContent = `${file.name} · ${c.width} × ${c.height} px${heic ? " · converted from HEIC" : ""}`;
    setSign(c);
    setStatus("Artwork placed. Drag the corners onto the wall.");
  } catch (err) {
    setStatus(err.message || "That file couldn't be opened.", true);
  } finally {
    busy("");
    requestRender();
  }
}

function setSignMode(mode) {
  state.signMode = mode;
  document.querySelector(`input[name="signMode"][value="${mode}"]`).checked = true;
  $("signText").hidden = mode !== "text";
  $("signFile").hidden = mode !== "file";
  if (mode === "text") updateTextSign();
  else if (state.fileSign) setSign(state.fileSign);
}

for (const [key, f] of Object.entries(FONTS)) $("signFont").add(new Option(f.label, key));
document.querySelectorAll('input[name="signMode"]').forEach(r => r.addEventListener("change", () => setSignMode(r.value)));
["signTextInput", "signFont", "signColor", "signBg", "signTransparent", "signGlow"].forEach(id => {
  $(id).addEventListener("input", updateTextSign);
  $(id).addEventListener("change", updateTextSign);
});
$("signInput").addEventListener("change", e => { loadSignFile(e.target.files[0]); e.target.value = ""; });
$("opacity").addEventListener("input", e => {
  state.opacity = Number(e.target.value) / 100;
  $("opacityOut").textContent = `${e.target.value}%`;
  requestRender();
});
$("resetSign").addEventListener("click", () => {
  if (!state.sign) return;
  placeSign(state.sign.height / state.sign.width, true);
  updateUI();
  requestRender();
});
$("applyWidth").addEventListener("click", () => {
  const target = toInches($("wFt").value, $("wIn").value);
  const size = sizeInfo();
  if (!size || !target) {
    setStatus(size ? "Enter a width first." : "Set the scale in step 2 first.", true);
    return;
  }
  state.quad = scaleQuad(state.quad, target / size.width);
  setStatus(`Resized to about ${formatFeetInches(target)} wide.`);
  updateUI();
  requestRender();
});
$("showDims").addEventListener("change", requestRender);

// ---------- export ----------
function composite(withDims) {
  const photo = state.photo.canvas;
  const out = document.createElement("canvas");
  out.width = photo.width;
  out.height = photo.height;
  const octx = out.getContext("2d");
  octx.drawImage(photo, 0, 0);
  const u = Math.max(1.2, photo.width / 700);
  if (state.sign && state.quad) drawSign(octx, state.quad);
  const size = sizeInfo();
  if (withDims && size) drawDimensions(octx, state.quad, size.w, size.h, u);
  const label = `${DISCLAIMER} · arcsignco.com`;
  octx.font = `800 ${12 * u}px Arial, Helvetica, sans-serif`;
  const tw = octx.measureText(label).width;
  pill(octx, { x: 12 * u + (tw + 14 * u) / 2, y: out.height - 22 * u }, label, 0, u, { fg: GOLD2 });
  return out;
}

const toBlob = (c, type, q) => new Promise((res, rej) => c.toBlob(b => (b ? res(b) : rej(new Error("export"))), type, q));
async function jpegBytes(c, q = 0.9) {
  return { bytes: new Uint8Array(await (await toBlob(c, "image/jpeg", q)).arrayBuffer()), width: c.width, height: c.height };
}

let logoCache = null;
async function logoJpeg() {
  if (logoCache) return logoCache;
  const img = new Image();
  img.src = LOGO_URL;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const lctx = c.getContext("2d");
  lctx.fillStyle = NAVY;
  lctx.fillRect(0, 0, c.width, c.height);
  lctx.drawImage(img, 0, 0);
  logoCache = await jpegBytes(c, 0.95);
  return logoCache;
}

function fileBase() {
  const slug = ($("project").value || "storefront").toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").slice(0, 40) || "storefront";
  const d = new Date();
  const p = v => String(v).padStart(2, "0");
  return `arc-sign-mockup-${slug}-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

async function makePdf() {
  const size = sizeInfo();
  const ref = calibrated() ? `${$("calLabel").value.trim() || "Reference line"} = ${formatFeetInches(state.calInches)}` : "";
  const [logo, mockup] = await Promise.all([logoJpeg(), jpegBytes(composite($("showDims").checked), 0.88)]);
  const bytes = buildProofPdf({
    logo,
    mockup,
    size: size ? { width: size.w, height: size.h, area: size.area } : null,
    reference: ref,
    project: $("project").value.trim(),
    preparedFor: $("preparedFor").value.trim(),
    notes: $("notes").value.trim(),
  });
  return new File([bytes], `${fileBase()}.pdf`, { type: "application/pdf" });
}

function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

async function runExport(label, fn) {
  if (!state.photo) return;
  busy(label);
  setStatus("");
  await new Promise(r => setTimeout(r, 30));
  try {
    await fn();
  } catch (err) {
    console.error(err);
    if (err?.name !== "AbortError") setStatus("Export failed. Try again, or try a smaller photo.", true);
  } finally {
    busy("");
    requestRender();
  }
}

$("downloadPdf").addEventListener("click", () => runExport("Building PDF…", async () => {
  const file = await makePdf();
  download(file, file.name);
  setStatus(`Saved ${file.name}`);
}));
$("downloadPng").addEventListener("click", () => runExport("Building image…", async () => {
  const blob = await toBlob(composite($("showDims").checked), "image/jpeg", 0.92);
  const name = `${fileBase()}.jpg`;
  download(blob, name);
  setStatus(`Saved ${name}`);
}));
$("sharePdf").addEventListener("click", () => runExport("Building PDF…", async () => {
  const file = await makePdf();
  await navigator.share({ files: [file], title: "Storefront sign mockup" });
  setStatus("Shared.");
}));
try {
  const probe = new File([new Uint8Array(1)], "probe.pdf", { type: "application/pdf" });
  $("sharePdf").hidden = !(navigator.canShare && navigator.canShare({ files: [probe] }));
} catch { /* sharing files unsupported */ }

// ---------- steps & panel state ----------
function canGo(step) {
  if (step === "photo") return true;
  if (step === "export") return !!(state.photo && state.sign);
  return !!state.photo;
}

function setStep(step) {
  if (!canGo(step)) return;
  if (step !== state.step) setStatus("");
  state.step = step;
  if (step === "sign" && !state.sign) setSignMode(state.signMode);
  document.querySelectorAll("[data-panel]").forEach(p => { p.hidden = p.dataset.panel !== step; });
  updateUI();
  requestRender();
}

function hintText() {
  if (!state.photo) return "";
  if (state.step === "scale") {
    if (!state.cal) return "Drag across something you've measured";
    if (!state.calInches) return "Now enter its real length";
    return "";
  }
  if (state.step === "sign" && !state.touchedSign) return "Drag the corners onto the wall";
  return "";
}

function updateUI() {
  STEPS.forEach((s, i) => {
    const b = document.querySelector(`[data-step="${s}"]`);
    b.disabled = !canGo(s);
    if (s === state.step) b.setAttribute("aria-current", "step");
    else b.removeAttribute("aria-current");
    const done = [!!state.photo, calibrated(), !!state.sign, false][i];
    b.classList.toggle("done", done && s !== state.step);
  });
  $("toScale").disabled = !state.photo;

  const out = $("scaleOut");
  out.classList.remove("warn", "good");
  if (!state.cal) out.textContent = "Draw the line on the photo.";
  else {
    const px = dist(state.cal.a, state.cal.b);
    if (!state.calInches) out.textContent = `Line drawn (${Math.round(px)} px). Enter its real length.`;
    else if (px < 80) {
      out.textContent = `Scale set, but the line is short (${Math.round(px)} px). Zoom in and use a longer reference for a closer estimate.`;
      out.classList.add("warn");
    } else {
      out.textContent = `Scale set: ${formatFeetInches(state.calInches)} over ${Math.round(px)} px of the photo.`;
      out.classList.add("good");
    }
  }

  const size = sizeInfo();
  $("sizeOut").innerHTML = state.sign
    ? size
      ? `<div><span>Width</span><strong>${size.w}</strong></div><div><span>Height</span><strong>${size.h}</strong></div><div><span>Area</span><strong>${size.area.replace(" sq ft", "")}</strong>sq ft</div><p>Approximate, from your scale line.</p>`
      : `<p>Set the scale in step 2 to see the sign's size.</p>`
    : "";
  $("setWidth").disabled = !size;

  const hint = hintText();
  $("hint").textContent = hint;
  $("hint").hidden = !hint;
}

document.querySelectorAll("[data-step]").forEach(b => b.addEventListener("click", () => setStep(b.dataset.step)));
document.querySelectorAll("[data-goto]").forEach(b => b.addEventListener("click", () => {
  setStep(b.dataset.goto);
  if (window.matchMedia("(max-width: 860px)").matches) {
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stage.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  }
}));
$("zoomIn").addEventListener("click", () => { const { w, h } = cssSize(); zoomAt(1.4, w / 2, h / 2); });
$("zoomOut").addEventListener("click", () => { const { w, h } = cssSize(); zoomAt(1 / 1.4, w / 2, h / 2); });
$("zoomFit").addEventListener("click", fit);

window.addEventListener("beforeunload", e => {
  if (state.photo) { e.preventDefault(); e.returnValue = ""; }
});

new ResizeObserver(resizeCanvas).observe(stage);
resizeCanvas();
updateUI();

// Lets automated checks drive the tool without simulating every gesture.
window.signMockup = { state, loadPhoto, loadSignFile, setStep, makePdf, composite, requestRender, get warper() { return warper?.kind; } };
