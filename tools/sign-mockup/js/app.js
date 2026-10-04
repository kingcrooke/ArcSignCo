import {
  dist, centroid, pointInQuad, rectQuad, scaleQuad, quadSizeInches, quadSpans, formatFeetInches, formatArea, toInches, bounds,
} from "./geometry.js";
import { loadImageFile, renderTextSign, loadSignFonts, FONTS } from "./images.js";
import { makeArtwork } from "./art.js";
import { coverFromQuad, sampleAround, coveredPhoto, hexOf, rgbOf } from "./cover.js";
import { createScene } from "./scene.js";
import {
  CATEGORIES, READY, DEFAULT_TYPE, getType, getCategory, categoryOf, litWith, describe, cleanOptions,
  defaultOptions, optionFields, aspectFor, diagramSvg, codeWarnings, isKnownType, cleanSource,
} from "./catalog.js";
import { estimatePrice, priceView, PRICES_LIVE } from "./pricing.js";
import { DISCLAIMER } from "./pdf.js";
import { buildSignPdf, flatArtwork, jpegBlob } from "./proof-pdf.js";

const $ = id => document.getElementById(id);
const stage = $("stage"), canvas = $("view"), ctx = canvas.getContext("2d");
const STEPS = ["photo", "scale", "sign", "export"];
const NAVY = "#0b1d33", GOLD = "#d4a843", GOLD2 = "#f0d080";
const API = "/api/sign-proofs";
// Used for depth and lighting until the scale is set; sizes are only shown once it is.
const ASSUMED_WIDTH_IN = 96;
// Below this width (pixels) a photo is too small for a useful scale line.
const SMALL_PHOTO = 800;
// A reference outside this range (inches) is almost always a typo in feet or inches.
const PLAUSIBLE_REF = [2, 1200];

const state = {
  step: "photo",
  photo: null,        // { canvas, name, heic }
  view: { s: 1, x: 0, y: 0 },
  fitted: true,
  cal: null,          // { a, b } in photo pixels
  calInches: 0,
  sign: null,         // canvas with the artwork as supplied (or rendered text)
  art: null,          // makeArtwork(sign)
  signMode: "text",
  fileSign: null,
  quad: null,         // [tl, tr, br, bl] in photo pixels
  quadEdited: false,
  opacity: 1,
  selected: null,     // { kind: "cal" | "quad" | "cover", index }
  cover: null,        // { quad, color:[r,g,b], auto } patch over an existing sign, or null
  home: null,         // { x, y, w } where a new sign starts on this photo (the sample's sign band)
  touchedSign: false,
  typeId: DEFAULT_TYPE,
  typeOptions: {},    // per type id, so switching back keeps choices
  lastType: Object.fromEntries(READY.map(c => [c.id, c.defaultType])),
  placed: {},         // per category: { quad, edited } while the other category is shown
  mode: "day",
  proof: null,        // { id, url } once an approval link exists for the current design
  src: "",            // the link's ?src= tag, carried into approval links
  test: false,        // ?test=1: approval links are marked as tests and never notify Arc
};

const scene = createScene();
let artVersion = 0;
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
const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

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
const currentType = () => getType(state.typeId);
const currentCat = () => categoryOf(currentType());
function optionsFor(type = currentType()) {
  return (state.typeOptions[type.id] ||= defaultOptions(type));
}
// Keeps only what the category allows (categories that store no options keep them as they are).
function setOptionsFor(type, opts) {
  state.typeOptions[type.id] = categoryOf(type).sanitizeOptions(type, opts) || opts;
}
// Size in inches the scene draws at: measured when the scale is set, assumed otherwise.
function sceneSize() {
  const s = sizeInfo();
  if (s) return { width: s.width, height: s.height };
  if (!state.quad) return { width: ASSUMED_WIDTH_IN, height: ASSUMED_WIDTH_IN * currentType().aspect || 30 };
  const sp = quadSpans(state.quad);
  return { width: ASSUMED_WIDTH_IN, height: ASSUMED_WIDTH_IN * (sp.height / Math.max(1, sp.width)) };
}
function drawScene(target, view, clip, { mode = state.mode, quality = "full" } = {}) {
  scene.render(target, {
    photo: coveredPhoto(state.photo.canvas, state.cover),
    view,
    clip,
    quad: state.art ? state.quad : null,
    art: state.art,
    type: currentType(),
    options: optionsFor(),
    mode,
    quality,
    sizeIn: state.quad ? sceneSize() : null,
    opacity: state.opacity,
  });
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
  const showSign = state.step === "sign" || state.step === "export";
  drawScene(ctx, { s: s * dpr, x: x * dpr, y: y * dpr }, { w: canvas.width, h: canvas.height }, {
    quality: drag || pinch ? "draft" : "full",
    mode: showSign ? state.mode : "day",
  });
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const sq = state.quad && state.quad.map(toScreen);
  const size = sizeInfo();
  if (sq && size && $("showDims").checked && (state.step === "sign" || state.step === "export")) {
    drawDimensions(ctx, sq, size.w, size.h, 1);
  }
  if (state.cal && (state.step === "scale" || state.step === "sign")) drawCal(state.step === "scale");
  if (state.cover && state.step === "sign") drawCoverHandles(state.cover.quad.map(toScreen));
  if (sq && state.step === "sign") drawQuadHandles(sq);
  updateChip(size);
  placeChip(sq);
  if (drag && drag.type === "point") drawLoupe();
}

// Keeps the size chip off the handles and dimension lines: if the sign (plus room for its
// dimension pills) reaches the top-left corner, the chip drops to the bottom-left.
function placeChip(sq) {
  const chip = $("chip");
  if (chip.hidden) return;
  let low = false;
  if (sq && (state.step === "sign" || state.step === "export")) {
    const pad = 44, minX = Math.min(...sq.map(p => p.x)) - pad, minY = Math.min(...sq.map(p => p.y)) - pad;
    const maxX = Math.max(...sq.map(p => p.x)) + pad, maxY = Math.max(...sq.map(p => p.y)) + pad;
    const r = { x0: 12, y0: 12, x1: 12 + chip.offsetWidth, y1: 12 + chip.offsetHeight };
    low = minX < r.x1 && maxX > r.x0 && minY < r.y1 && maxY > r.y0;
  }
  chip.classList.toggle("is-low", low);
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

function drawCoverHandles(cq) {
  ctx.save();
  ctx.beginPath();
  cq.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.closePath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(11,29,51,.6)";
  ctx.stroke();
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "#fff";
  ctx.stroke();
  ctx.setLineDash([]);
  cq.forEach((p, i) => {
    const on = state.selected?.kind === "cover" && state.selected.index === i;
    ctx.fillStyle = on ? GOLD2 : "#fff";
    ctx.strokeStyle = NAVY;
    ctx.lineWidth = 2;
    ctx.fillRect(p.x - 6, p.y - 6, 12, 12);
    ctx.strokeRect(p.x - 6, p.y - 6, 12, 12);
  });
  ctx.restore();
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
  const top = 12 + (left && !chip.hidden && !chip.classList.contains("is-low") ? chip.offsetHeight + 8 : 0);
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
  const ring = ref.kind === "cover" ? state.cover.quad : state.quad;
  const neighbors = ref.kind === "cal"
    ? [ref.index ? state.cal.a : state.cal.b]
    : [ring[(ref.index + 1) % 4], ring[(ref.index + 3) % 4]];
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
    const cat = currentCat();
    html = size
      ? `≈ ${size.w} W × ${size.h} ${cat.ui.heightShort}<small>${cat.ui.hangs ? "" : `≈ ${size.area} · `}estimate from your scale line</small>`
      : `${cat.Noun} placed<small>Set the scale in step 2 to see its size</small>`;
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
  if (ref.kind === "cover") return state.cover ? state.cover.quad[ref.index] : null;
  return state.quad ? state.quad[ref.index] : null;
}
function setPoint(ref, p) {
  const photo = state.photo.canvas;
  if (ref.kind === "cal") {
    const q = { x: Math.min(photo.width, Math.max(0, p.x)), y: Math.min(photo.height, Math.max(0, p.y)) };
    state.cal[ref.index ? "b" : "a"] = q;
  } else if (ref.kind === "cover") {
    state.cover.quad[ref.index] = { x: Math.min(photo.width, Math.max(0, p.x)), y: Math.min(photo.height, Math.max(0, p.y)) };
    resampleCover();
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
    if (state.cover) {
      const i = state.cover.quad.findIndex(near);
      if (i >= 0) return { type: "point", ref: { kind: "cover", index: i } };
    }
    if (pointInQuad(state.quad.map(toScreen), { x, y })) return { type: "move" };
    if (state.cover && pointInQuad(state.cover.quad.map(toScreen), { x, y })) return { type: "move", target: "cover" };
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
    drag = { type: "move", last: img, target: hit.target || "sign" };
    stage.classList.add("dragging");
  } else {
    drag = { type: "pan", last: pt };
    stage.classList.add("dragging");
  }
  if (state.step === "sign" && !state.touchedSign && ((hit.type === "move" && hit.target !== "cover") || hit.ref?.kind === "quad")) {
    state.touchedSign = true;
    showHint("");
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
  } else if (drag.type === "move" && drag.target === "cover") {
    const dx = img.x - drag.last.x, dy = img.y - drag.last.y;
    state.cover.quad = state.cover.quad.map(p => ({ x: p.x + dx, y: p.y + dy }));
    drag.last = img;
    resampleCover();
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
  const editable = p && ((ref.kind === "cal" && state.step === "scale") || (ref.kind !== "cal" && state.step === "sign"));
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
    state.placed = {};
    state.selected = null;
    state.home = null;
    setCover(false);
    $("drop").hidden = true;
    $("zoomBar").hidden = false;
    stage.style.setProperty("--sm-ar", (c.height / c.width).toFixed(4));
    $("photoMeta").textContent = `${state.photo.name}${heic ? " · iPhone photo converted" : ""}`;
    $("photoMeta").classList.toggle("warn", c.width < SMALL_PHOTO);
    if (c.width < SMALL_PHOTO) $("photoMeta").textContent += ". This photo is small, so sizes and detail will be rough. Use the original photo if you have it.";
    if (state.art) placeSign();
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

// The sample is an original, generated photo with a blank sign band, so it is free to use. Its
// scale line is preset on the entry door frame, which reads as 3 ft wide.
const SAMPLE = {
  url: new URL("../img/sample-storefront.jpg", import.meta.url),
  cal: [{ x: 752, y: 676 }, { x: 914, y: 676 }], inches: 36, label: "Door width",
  band: { x: 565, y: 258, w: 480 },
};
$("trySample").addEventListener("click", async () => {
  try {
    busy("Opening the sample photo…");
    const res = await fetch(SAMPLE.url);
    if (!res.ok) throw new Error();
    const file = new File([await res.blob()], "Sample storefront.jpg", { type: "image/jpeg" });
    $("calFt").value = "3";
    $("calIn").value = "";
    $("calLabel").value = SAMPLE.label;
    await loadPhoto(file);
    if (!state.photo) return;
    state.cal = { a: { ...SAMPLE.cal[0] }, b: { ...SAMPLE.cal[1] } };
    state.calInches = SAMPLE.inches;
    state.home = { ...SAMPLE.band };
    if (state.art) placeSign();
    setStatus("Sample photo loaded. Its scale line is already set across the door (3 ft).");
    updateUI();
    requestRender();
  } catch {
    busy("");
    setStatus("The sample photo couldn't be opened. Check your connection and try again.", true);
  }
});

// ---------- cover the existing sign ----------
function resampleCover() {
  if (state.cover?.auto) {
    state.cover.color = sampleAround(state.photo.canvas, state.cover.quad);
    $("coverColor").value = hexOf(state.cover.color);
  }
}
function setCover(on) {
  $("coverOld").checked = on;
  $("coverTools").hidden = !on;
  if (!on) {
    state.cover = null;
    if (state.selected?.kind === "cover") state.selected = null;
  } else if (!state.cover && state.photo) {
    const base = state.quad || rectQuad(state.photo.canvas.width / 2, state.photo.canvas.height * 0.3, state.photo.canvas.width * 0.4, state.photo.canvas.width * 0.08);
    state.cover = { quad: coverFromQuad(base), color: [128, 128, 128], auto: true };
    resampleCover();
  }
  renderProofLink();
  requestRender();
}
$("coverOld").addEventListener("change", e => setCover(e.target.checked));
$("coverColor").addEventListener("input", e => {
  if (!state.cover) return;
  state.cover.color = rgbOf(e.target.value);
  state.cover.auto = false;
  renderProofLink();
  requestRender();
});
$("coverMatch").addEventListener("click", () => {
  if (!state.cover) return;
  state.cover.auto = true;
  resampleCover();
  renderProofLink();
  requestRender();
});
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
const signAspect = () => aspectFor(currentType(), state.art, optionsFor());

function setSign(source, { text = false } = {}) {
  const prev = state.art ? signAspect() : null;
  state.sign = source;
  state.art = makeArtwork(source, { text });
  artVersion++;
  fitQuadToArt(prev);
  updateUI();
  requestRender();
}

// Keeps the quad's shape in step with the artwork and type. Untouched quads are re-placed;
// pinned quads keep their width and perspective and only change height.
function fitQuadToArt(prevAspect) {
  const aspect = signAspect();
  if (!state.quad) return placeSign(aspect);
  if (prevAspect && Math.abs(aspect / prevAspect - 1) < 0.02) return;
  if (!state.quadEdited) {
    if (currentCat().ui.plaque) {
      placeSign(aspect);
      return;
    }
    const c = centroid(state.quad), w = quadSpans(state.quad).width;
    state.quad = rectQuad(c.x, c.y, w, w * aspect);
    clampQuadInsidePhoto(state.photo.canvas);
    return;
  }
  const sp = quadSpans(state.quad);
  const k = (sp.width * aspect) / Math.max(1, sp.height);
  const [a, b, c, d] = state.quad;
  if (currentCat().ui.hangs) return setDropScale(k);
  const around = (p, q) => {
    const m = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
    return [{ x: m.x + (p.x - m.x) * k, y: m.y + (p.y - m.y) * k }, { x: m.x + (q.x - m.x) * k, y: m.y + (q.y - m.y) * k }];
  };
  const [a2, d2] = around(a, d), [b2, c2] = around(b, c);
  state.quad = [a2, b2, c2, d2];
}

// Products that hang from the wall line (awnings) change height from the top edge down.
function setDropScale(k) {
  const [a, b, c, d] = state.quad;
  const down = (top, bottom) => ({ x: top.x + (bottom.x - top.x) * k, y: top.y + (bottom.y - top.y) * k });
  state.quad = [a, b, down(b, c), down(a, d)];
}

function scaledWidthPx(widthIn) {
  if (!widthIn || !state.calInches || !state.cal) return null;
  const calPx = dist(state.cal.a, state.cal.b);
  if (calPx < 1) return null;
  return widthIn / (state.calInches / calPx);
}

/** Wall pier beside a scaled door opening, about 60 in above the sidewalk. */
function plaqueMountPoint(photo) {
  if (!state.cal || !state.calInches) return null;
  const calPx = dist(state.cal.a, state.cal.b);
  if (calPx < 1) return null;
  const inPerPx = state.calInches / calPx;
  const doorLeft = Math.min(state.cal.a.x, state.cal.b.x);
  const doorRight = Math.max(state.cal.a.x, state.cal.b.x);
  const doorY = (state.cal.a.y + state.cal.b.y) / 2;
  const sidewalkY = Math.min(photo.height - 6, doorY + 10 / inPerPx);
  const pier = {
    x: doorRight + 14 / inPerPx,
    y: sidewalkY - 60 / inPerPx,
  };
  const margin = 8;
  const pierOk = pier.x > margin && pier.x < photo.width - margin
    && pier.y > margin && pier.y < photo.height - margin;
  // A wide plaque centered on the pier would cover the door: it goes right of clearRight, or left of
  // clearLeft when the wall right of the door is too narrow.
  if (pierOk) return { ...pier, clearRight: doorRight + 6 / inPerPx, clearLeft: doorLeft - 6 / inPerPx };
  // Fallback: center of the wall strip beside the door, mid-door height.
  const beside = doorRight < photo.width * 0.55
    ? doorRight + (photo.width - doorRight) * 0.35
    : doorLeft - (doorLeft) * 0.35;
  return {
    x: Math.max(margin, Math.min(photo.width - margin, beside)),
    y: Math.max(margin, Math.min(photo.height - margin, doorY)),
  };
}

/**
 * For door decals: centered on a scale line drawn across a door (labeled "door"), about 50 in up,
 * where hours and door copy sit at eye level. Null when the reference isn't a door.
 */
function doorMountPoint(photo) {
  if (!state.cal || !state.calInches || !/door/i.test($("calLabel").value)) return null;
  const calPx = dist(state.cal.a, state.cal.b);
  if (calPx < 1) return null;
  const p = { x: (state.cal.a.x + state.cal.b.x) / 2, y: (state.cal.a.y + state.cal.b.y) / 2 - 50 * calPx / state.calInches };
  return p.x > 0 && p.x < photo.width && p.y > 0 && p.y < photo.height ? p : null;
}

const QUAD_CLAMP_MARGIN = 3;

function quadInsidePhoto(photo, quad = state.quad, margin = QUAD_CLAMP_MARGIN) {
  if (!photo || !quad) return false;
  return quad.every(p => p.x >= margin && p.x <= photo.width - margin && p.y >= margin && p.y <= photo.height - margin);
}

/** Shift (and slightly shrink if needed) so every corner stays inside the photo. */
function clampQuadInsidePhoto(photo) {
  if (!state.quad || !photo) return;
  const m = QUAD_CLAMP_MARGIN;
  let q = state.quad;
  const maxW = photo.width - 2 * m, maxH = photo.height - 2 * m;
  for (let pass = 0; pass < 8; pass++) {
    const b = bounds(q);
    // Shrink before shifting: a quad taller or wider than the photo can't be shifted inside.
    const bw = b.maxX - b.minX, bh = b.maxY - b.minY;
    if (bw > maxW || bh > maxH) {
      q = scaleQuad(q, Math.min(maxW / Math.max(1, bw), maxH / Math.max(1, bh)) * 0.98, centroid(q));
      continue;
    }
    let dx = 0, dy = 0;
    if (b.minX < m) dx = m - b.minX;
    else if (b.maxX > photo.width - m) dx = (photo.width - m) - b.maxX;
    if (b.minY < m) dy = m - b.minY;
    else if (b.maxY > photo.height - m) dy = (photo.height - m) - b.maxY;
    if (!dx && !dy) break;
    q = q.map(p => ({ x: p.x + dx, y: p.y + dy }));
  }
  state.quad = q;
}

// The type's typical width from its size preset, in photo pixels (null without a preset or a scale).
function presetWidthPx() {
  const cat = currentCat();
  if (typeof cat.ui.placeWidthIn !== "function") return null;
  return scaledWidthPx(cat.ui.placeWidthIn(currentType(), optionsFor()));
}

function defaultPlaceWidthPx(photo) {
  const cat = currentCat();
  const preset = presetWidthPx();
  if (preset) return preset;
  const scaled = cat.ui.plaque ? scaledWidthPx(10) : null;
  if (scaled) return scaled;
  if (cat.ui.plaque) return photo.width * 0.06;
  if (state.home?.w) return state.home.w;
  return photo.width * 0.45;
}

function placeSign(aspect = signAspect(), keepCenter = false) {
  const photo = state.photo.canvas;
  const cat = currentCat();
  const preset = presetWidthPx();
  let w = defaultPlaceWidthPx(photo);
  let c = (!cat.ui.plaque && state.home)
    ? { x: state.home.x, y: state.home.y }
    : { x: photo.width / 2, y: photo.height * 0.36 };
  const door = currentType().mount === "door" ? doorMountPoint(photo) : null;
  if (door) {
    c = door;
  } else if (cat.ui.plaque) {
    const mount = plaqueMountPoint(photo);
    if (mount) c = mount;
  } else if (keepCenter && state.quad) {
    c = centroid(state.quad);
    if (!preset) {
      w = (dist(state.quad[0], state.quad[1]) + dist(state.quad[3], state.quad[2])) / 2;
      if (w < photo.width * 0.04) w = photo.width * 0.45;
    }
  }
  // A size preset is drawn at its size; clampQuadInsidePhoto shrinks it only if it can't fit.
  if (!preset && cat.ui.plaque) {
    const maxW = photo.width * 0.22;
    if (w > maxW) w = maxW;
  } else if (!preset && w * aspect > photo.height * 0.5) {
    w = (photo.height * 0.5) / aspect;
  }
  if (c.clearRight) {
    const m = QUAD_CLAMP_MARGIN, right = Math.max(c.x, c.clearRight + w / 2), left = c.clearLeft - w / 2;
    if (right + w / 2 <= photo.width - m) c = { x: right, y: c.y };
    else if (left - w / 2 >= m) c = { x: left, y: c.y };
  }
  state.quad = rectQuad(c.x, c.y, w, w * aspect);
  clampQuadInsidePhoto(photo);
  state.quadEdited = false;
}

// Text becomes cut-out letters; the sign type supplies any panel, cabinet or fabric behind them.
function textSignOptions() {
  return { text: $("signTextInput").value, font: $("signFont").value, color: $("signColor").value, transparent: true };
}
function updateTextSign() {
  if (state.signMode !== "text" || !state.photo) return;
  setSign(renderTextSign(textSignOptions()), { text: true });
}

async function loadSignFile(file) {
  if (!file) return;
  busy("Opening artwork…");
  setStatus("");
  try {
    const { canvas: c, heic } = await loadImageFile(file, { maxSide: 2048, onStatus: busy });
    if (makeArtwork(c).empty) throw new Error("No artwork left after removing the background. Try a file with darker artwork, or one with a clear background.");
    state.fileSign = c;
    state.quadEdited = false;
    $("signMeta").textContent = `${file.name}${heic ? " · iPhone photo converted" : ""}`;
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

// ---------- types and their options ----------
// The fields come from the type's category (optionFields); see the field format in categories/define.js.
let fields = [];
function renderTypeOptions() {
  const type = currentType(), box = $("typeOptions");
  box.textContent = "";
  fields = optionFields(type, optionsFor(type), sceneSize());
  for (const f of fields) {
    const label = document.createElement("label");
    label.className = `sm-field${f.kind === "color" ? " sm-color" : ""}${f.kind === "range" ? " sm-wide" : ""}`;
    label.append(f.label);
    let input;
    if (f.kind === "range") {
      const out = document.createElement("output");
      out.textContent = f.format ? f.format(f.value) : String(f.value);
      label.append(out);
      input = Object.assign(document.createElement("input"), { type: "range", min: f.min, max: f.max, step: f.step || 1, value: f.value });
    } else if (f.kind === "color") {
      input = Object.assign(document.createElement("input"), { type: "color", value: f.value || f.fallback || "#24262b" });
    } else {
      input = document.createElement("select");
      for (const [v, t] of f.choices) input.add(new Option(t, v));
      input.value = f.value;
    }
    input.dataset.opt = f.key;
    label.append(input);
    if (f.auto) {
      const wrap = document.createElement("label");
      wrap.className = "sm-auto";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = !f.value;
      cb.dataset.auto = f.key;
      wrap.append(cb, f.auto);
      const outer = document.createElement("div");
      outer.append(label, wrap);
      box.append(outer);
    } else box.append(label);
  }
}

$("typeOptions").addEventListener("input", e => {
  const t = e.target, type = currentType(), opts = { ...optionsFor(type) };
  const key = t.dataset.opt || t.dataset.auto;
  const f = fields.find(x => x.key === key);
  if (!f) return;
  if (t.dataset.auto) {
    const input = $("typeOptions").querySelector(`[data-opt="${key}"]`);
    opts[key] = t.checked ? "" : input.value;
  } else {
    opts[key] = f.kind === "range" ? Number(t.value) : t.value;
    const auto = $("typeOptions").querySelector(`[data-auto="${key}"]`);
    if (auto) auto.checked = false;
    if (f.kind === "range" && f.format) t.previousElementSibling.textContent = f.format(Number(t.value));
  }
  const prevAspect = state.art ? signAspect() : null, prevPreset = presetWidthPx();
  setOptionsFor(type, opts);
  // A new size preset re-sizes an unpinned quad; a pinned one keeps its width and follows the new shape.
  if (state.art && state.quad) {
    const preset = presetWidthPx();
    if (preset && preset !== prevPreset && !state.quadEdited) placeSign(signAspect(), !currentCat().ui.plaque);
    else fitQuadToArt(prevAspect);
  }
  // A change that alters which other choices apply re-draws the card and its fields.
  if (f.refresh) renderTypeCard();
  updateUI();
  requestRender();
});
$("typeOptions").addEventListener("change", e => {
  const f = fields.find(x => x.key === e.target.dataset.opt);
  if (!f?.refresh) e.target.dispatchEvent(new Event("input", { bubbles: true }));
});

const NIGHT_PREFIX = "At night: ";
function renderTypeCard() {
  const type = currentType(), cat = currentCat();
  const info = describe(type, optionsFor(type), state.quad ? sceneSize() : null);
  $("typeThumb").innerHTML = diagramSvg(type);
  $("typeGroup").textContent = info.group;
  $("typeName").textContent = type.name;
  $("typeLight").textContent = info.lightingLabel;
  $("typeLight").classList.toggle("off", !litWith(type, optionsFor(type)));
  $("openTypes").textContent = `Change ${cat.typeWord}`;
  $("buildArt").innerHTML = diagramSvg(type);
  $("buildSummary").textContent = info.summary;
  $("buildParts").replaceChildren(...info.parts.map(p => Object.assign(document.createElement("li"), { textContent: p })));
  $("buildNight").textContent = `${NIGHT_PREFIX}${info.night}`;
  $("pinHint").hidden = !type.pinHint;
  $("pinHint").textContent = type.pinHint || "";
  $("typeNotice").hidden = !type.notice;
  $("typeNotice").textContent = type.notice || "";
  $("placeNoun").textContent = cat.noun;
  $("textLabel").textContent = cat.ui.textLabel;
  $("setDrop").hidden = !cat.ui.hangs;
  $("placeTip").innerHTML = cat.ui.placeTip;
  for (const b of $("category").querySelectorAll("[data-cat]")) {
    if (b.getAttribute("role") === "radio") {
      const on = b.dataset.cat === cat.id;
      b.setAttribute("aria-checked", String(on));
      b.tabIndex = on ? 0 : -1;
    }
  }
  revealCategoryTab();
  renderTypeOptions();
}
// Scrolls the tab row (not the page) so the selected tab is fully visible. The row snaps to tab
// starts, so it scrolls to the first tab start that shows the whole tab clear of the edge fade.
function revealCategoryTab() {
  const bar = $("category"), on = bar.querySelector('[role="radio"][aria-checked="true"]');
  if (!on || bar.scrollWidth <= bar.clientWidth) return;
  const x = el => el.getBoundingClientRect().left - bar.getBoundingClientRect().left + bar.scrollLeft;
  const left = x(on), right = left + on.offsetWidth, view = bar.clientWidth - 28;
  if (left >= bar.scrollLeft && right <= bar.scrollLeft + view) return;
  const starts = [...bar.querySelectorAll('[role="radio"]')].map(x).filter(s => s <= left);
  bar.scrollLeft = starts.find(s => right - s <= view) ?? left;
}

function setType(id) {
  const prevType = currentType();
  const prev = state.art ? signAspect() : null;
  const next = getType(id);
  state.typeId = next.id;
  state.lastType[next.category] = next.id;
  // Each category sits in its own place on the wall (a sign over the door, an awning over the
  // window), so each keeps its own placement.
  const from = prevType.category, to = next.category;
  // An unpinned placement left for another type of that category is re-drawn at this type's preset size.
  const kept = from !== to && state.placed[to];
  const stash = kept && (kept.edited || kept.typeId === next.id || !presetWidthPx()) && kept;
  if (from !== to && state.quad) state.placed[from] = { quad: state.quad.map(p => ({ ...p })), edited: state.quadEdited, aspect: prev, typeId: prevType.id };
  if (stash) {
    state.quad = stash.quad;
    state.quadEdited = stash.edited;
    // The artwork may have changed while the other category was shown.
    if (state.art && stash.aspect) fitQuadToArt(stash.aspect);
  } else if (state.art && !(from === to && categoryOf(next).ui.hangs && state.quadEdited)) {
    const nextCat = categoryOf(next), prevCat = categoryOf(prevType);
    // An unpinned quad takes the new type's own size (its preset) rather than the last type's,
    // and never carries a plaque's size into a storefront category or the other way round.
    if (!state.quadEdited && (presetWidthPx() || (from !== to && (nextCat.ui.plaque || prevCat.ui.plaque)))) {
      placeSign(aspectFor(next, state.art, optionsFor(next)), !nextCat.ui.plaque && !prevCat.ui.plaque && prevType.mount !== "door");
    } else {
      // Switching between hanging shapes keeps a wall area the user has pinned.
      fitQuadToArt(prev);
    }
  }
  renderTypeCard();
  updateUI();
  requestRender();
}
function setCategory(id) {
  const cat = getCategory(id);
  if (cat.id !== id || cat.status !== "ready") return openTypes(id);
  setType(state.lastType[cat.id] || cat.defaultType);
}

// Both category bars come from the registry; coming-soon tabs open their placeholder in the library.
const SOON = '<span class="sm-soon">Soon</span>';
function buildCategoryBars() {
  const bar = $("category"), tabs = $("typeCats");
  bar.textContent = "";
  tabs.textContent = "";
  for (const cat of [...READY, ...CATEGORIES.filter(c => !READY.includes(c))]) {
    const soon = cat.status !== "ready";
    const b = document.createElement("button");
    b.type = "button";
    b.dataset.cat = cat.id;
    const tab = cat.ui.tabLabel || cat.label;
    b.textContent = tab;
    b.setAttribute("aria-label", cat.label);
    if (!soon) b.title = cat.label;
    if (soon && !bar.querySelector(".sm-cattabs-label")) {
      bar.append(Object.assign(document.createElement("span"), { className: "sm-cattabs-label", textContent: "Coming soon" }));
    }
    if (soon) {
      b.setAttribute("aria-haspopup", "dialog");
      b.setAttribute("aria-label", `${cat.label}, coming soon`);
      b.classList.add("is-soon");
    } else b.setAttribute("role", "radio");
    bar.append(b);
    const t = document.createElement("button");
    t.type = "button";
    t.setAttribute("role", "tab");
    t.id = `tab-${cat.id}`;
    t.setAttribute("aria-controls", "typeList");
    t.dataset.cat = cat.id;
    t.innerHTML = `<span></span>${soon ? SOON : ""}`;
    t.firstChild.textContent = cat.ui.tabLabel || cat.label;
    t.setAttribute("aria-label", cat.label);
    if (soon) t.classList.add("is-soon");
    tabs.append(t);
  }
}
$("category").addEventListener("click", e => {
  const b = e.target.closest("[data-cat]");
  if (b) setCategory(b.dataset.cat);
});
$("category").addEventListener("keydown", e => {
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key) || e.target.getAttribute("role") !== "radio") return;
  e.preventDefault();
  const i = READY.findIndex(c => c.id === currentCat().id);
  const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : READY.length - 1;
  setCategory(READY[(i + step) % READY.length].id);
  $("category").querySelector(`[data-cat="${currentCat().id}"]`).focus();
});

const CONTACT_LINE = 'Need one now? Call or text <a href="tel:+13474502110">(347) 450-2110</a> · <a href="mailto:jc@arcsignco.com">jc@arcsignco.com</a> · <a href="mailto:arc@arcsignco.com">arc@arcsignco.com</a>';
let libraryCat = currentCat().id;

function buildTypeList() {
  const list = $("typeList");
  list.textContent = "";
  for (const cat of CATEGORIES) {
    const panel = document.createElement("div");
    panel.dataset.catPanel = cat.id;
    if (cat.status !== "ready") {
      panel.className = "sm-soon-panel";
      panel.innerHTML = `<p class="sm-soon-lead"><span class="sm-soon">Coming soon</span><span></span></p><div class="sm-tgrid"></div><p class="sm-soon-cta">${CONTACT_LINE}</p>`;
      panel.querySelector(".sm-soon-lead span:last-child").textContent = `${cat.label} isn't in the mockup tool yet. It will cover:`;
      const grid = panel.querySelector(".sm-tgrid");
      for (const ex of cat.examples) {
        const card = document.createElement("div");
        card.className = "sm-tcard is-soon";
        card.innerHTML = `<div class="sm-tc-art"><svg viewBox="0 0 48 48" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${cat.icon}</svg></div><strong></strong><span></span>`;
        card.querySelector("strong").textContent = ex.name;
        card.querySelector("span").textContent = ex.note;
        grid.append(card);
      }
      list.append(panel);
      continue;
    }
    for (const g of cat.groups) {
      const types = cat.types.filter(t => t.group === g.id);
      if (!types.length) continue;
      const h = document.createElement("h3");
      h.textContent = g.label;
      const grid = document.createElement("div");
      grid.className = "sm-tgrid";
      for (const t of types) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "sm-tcard";
        b.dataset.type = t.id;
        b.innerHTML = `<div class="sm-tc-art">${diagramSvg(t)}</div><strong></strong><span></span>`;
        b.querySelector("strong").textContent = t.name;
        b.querySelector("span").textContent = cat.cardNote(t);
        grid.append(b);
      }
      panel.append(h, grid);
    }
    list.append(panel);
  }
}
function showLibrary(id) {
  const c = getCategory(id);
  libraryCat = c.id;
  $("typesTitle").textContent = c.title;
  $("typesSub").textContent = c.intro;
  for (const b of $("typeCats").querySelectorAll("[data-cat]")) {
    const on = b.dataset.cat === c.id;
    b.setAttribute("aria-selected", String(on));
    b.tabIndex = on ? 0 : -1;
  }
  $("typeList").setAttribute("aria-labelledby", `tab-${c.id}`);
  for (const p of $("typeList").querySelectorAll("[data-cat-panel]")) p.hidden = p.dataset.catPanel !== c.id;
  revealTab();
}
function revealTab() {
  $("typeCats").querySelector(`[data-cat="${libraryCat}"]`)?.scrollIntoView({ block: "nearest", inline: "center" });
}
function openTypes(id = currentCat().id) {
  showLibrary(typeof id === "string" ? id : currentCat().id);
  for (const b of $("typeList").querySelectorAll("[data-type]")) b.setAttribute("aria-pressed", String(b.dataset.type === state.typeId));
  const dlg = $("typeDialog");
  if (dlg.showModal) dlg.showModal();
  else dlg.setAttribute("open", "");
  revealTab();
  const focus = $("typeList").querySelector(`[data-cat-panel="${libraryCat}"] [aria-pressed="true"]`) || $("typeCats").querySelector(`[data-cat="${libraryCat}"]`);
  focus?.focus();
}
function closeTypes() {
  const dlg = $("typeDialog");
  if (dlg.close) dlg.close();
  else dlg.removeAttribute("open");
}
// The construction card, enlarged.
$("buildArt").addEventListener("click", () => {
  const type = currentType(), dlg = $("cardZoom");
  $("cardZoomTitle").textContent = `How it's built: ${type.name}`;
  $("cardZoomArt").innerHTML = diagramSvg(type);
  if (dlg.showModal) dlg.showModal();
  else dlg.setAttribute("open", "");
  $("closeCardZoom").focus();
});
const closeCardZoom = () => { const dlg = $("cardZoom"); if (dlg.close) dlg.close(); else dlg.removeAttribute("open"); };
$("closeCardZoom").addEventListener("click", closeCardZoom);
$("cardZoom").addEventListener("click", e => { if (e.target === $("cardZoom") || e.target.closest("#cardZoomArt")) closeCardZoom(); });

$("openTypes").addEventListener("click", () => openTypes());
$("closeTypes").addEventListener("click", closeTypes);
$("typeCats").addEventListener("click", e => {
  const b = e.target.closest("[data-cat]");
  if (b) { showLibrary(b.dataset.cat); $("typeDialog").scrollTop = 0; }
});
$("typeCats").addEventListener("keydown", e => {
  if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
  e.preventDefault();
  const i = CATEGORIES.findIndex(c => c.id === libraryCat);
  showLibrary(CATEGORIES[(i + (e.key === "ArrowRight" ? 1 : CATEGORIES.length - 1)) % CATEGORIES.length].id);
  $("typeDialog").scrollTop = 0;
  $("typeCats").querySelector(`[data-cat="${libraryCat}"]`).focus();
});
$("typeDialog").addEventListener("click", e => {
  const b = e.target.closest("[data-type]");
  if (b) { setType(b.dataset.type); closeTypes(); $("openTypes").focus(); return; }
  if (e.target === $("typeDialog")) closeTypes();
});

function setMode(mode) {
  state.mode = mode === "night" ? "night" : "day";
  for (const b of $("dayNight").querySelectorAll("[data-mode]")) b.setAttribute("aria-checked", String(b.dataset.mode === state.mode));
  requestRender();
}
$("dayNight").addEventListener("click", e => { const b = e.target.closest("[data-mode]"); if (b) setMode(b.dataset.mode); });
$("dayNight").addEventListener("keydown", e => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
    e.preventDefault();
    setMode(state.mode === "day" ? "night" : "day");
    $("dayNight").querySelector(`[data-mode="${state.mode}"]`).focus();
  }
});

for (const [key, f] of Object.entries(FONTS)) $("signFont").add(new Option(f.label, key));
loadSignFonts().then(() => { if (state.signMode === "text" && state.sign) updateTextSign(); });
document.querySelectorAll('input[name="signMode"]').forEach(r => r.addEventListener("change", () => setSignMode(r.value)));
["signTextInput", "signFont", "signColor"].forEach(id => {
  $(id).addEventListener("input", updateTextSign);
  $(id).addEventListener("change", updateTextSign);
});
$("signInput").addEventListener("change", e => { loadSignFile(e.target.files[0]); e.target.value = ""; });
$("opacity").addEventListener("input", e => {
  state.opacity = Number(e.target.value) / 100;
  $("opacityOut").textContent = `${e.target.value}%`;
  renderProofLink();
  requestRender();
});
$("resetSign").addEventListener("click", () => {
  if (!state.sign) return;
  placeSign(signAspect(), true);
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
  if (target < 1) return setStatus("Enter a width of at least 1 inch.", true);
  state.quad = scaleQuad(state.quad, target / size.width);
  setStatus(`Resized to about ${formatFeetInches(target)} wide.`);
  updateUI();
  requestRender();
});
$("applyDrop").addEventListener("click", () => {
  const target = toInches($("dFt").value, $("dIn").value);
  const size = sizeInfo();
  if (!size || !target) {
    setStatus(size ? "Enter a drop first." : "Set the scale in step 2 first.", true);
    return;
  }
  if (target < 1) return setStatus("Enter a drop of at least 1 inch.", true);
  setDropScale(target / size.height);
  state.quadEdited = true;
  setStatus(`Drop set to about ${formatFeetInches(target)}.`);
  renderTypeOptions();
  updateUI();
  requestRender();
});
$("showDims").addEventListener("change", requestRender);

// ---------- export ----------
// The photo with the sign at photo resolution (or scaled down to maxSide), day or night.
function composite({ mode = "day", dims = false, maxSide = 0 } = {}) {
  const photo = state.photo.canvas;
  const k = maxSide ? Math.min(1, maxSide / Math.max(photo.width, photo.height)) : 1;
  const out = document.createElement("canvas");
  out.width = Math.round(photo.width * k);
  out.height = Math.round(photo.height * k);
  const octx = out.getContext("2d");
  drawScene(octx, { s: k, x: 0, y: 0 }, { w: out.width, h: out.height }, { mode });
  const u = Math.max(1.2, out.width / 700);
  const size = sizeInfo();
  if (dims && size) drawDimensions(octx, state.quad.map(p => ({ x: p.x * k, y: p.y * k })), size.w, size.h, u);
  const label = `${mode === "night" ? "Night preview · " : ""}${DISCLAIMER} · arcsignco.com`;
  octx.font = `800 ${12 * u}px Arial, Helvetica, sans-serif`;
  const tw = octx.measureText(label).width;
  pill(octx, { x: 12 * u + (tw + 14 * u) / 2, y: out.height - 22 * u }, label, 0, u, { fg: GOLD2 });
  return out;
}

function flatArt(maxSide = 0) {
  const c = flatArtwork(currentType(), state.art, optionsFor(), sceneSize());
  if (!maxSide || Math.max(c.width, c.height) <= maxSide) return c;
  const k = maxSide / Math.max(c.width, c.height);
  const out = document.createElement("canvas");
  out.width = Math.round(c.width * k);
  out.height = Math.round(c.height * k);
  const g = out.getContext("2d");
  g.imageSmoothingQuality = "high";
  g.drawImage(c, 0, 0, out.width, out.height);
  return out;
}

// What the price box, the PDF and the proof show: no numbers while the rates are placeholders.
function priceInfo() {
  const size = sizeInfo();
  return priceView(size ? estimatePrice(state.typeId, size, optionsFor()) : null);
}

function fileBase() {
  const slug = ($("project").value || "storefront").toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").slice(0, 40) || "storefront";
  const d = new Date();
  const p = v => String(v).padStart(2, "0");
  return `arc-sign-mockup-${slug}-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const referenceText = () => (calibrated() ? `${$("calLabel").value.trim() || "Reference line"} = ${formatFeetInches(state.calInches)}` : "");

async function makePdf() {
  const size = sizeInfo();
  const dims = $("showDims").checked;
  const bytes = await buildSignPdf({
    typeId: state.typeId,
    options: cleanOptions(currentType(), optionsFor()),
    sizeIn: size ? { width: size.width, height: size.height } : null,
    day: composite({ dims }),
    night: composite({ mode: "night", dims }),
    flat: flatArt(2000),
    size: size ? { width: size.w, height: size.h, area: size.area } : null,
    reference: referenceText(),
    project: $("project").value.trim(),
    preparedFor: $("preparedFor").value.trim(),
    notes: $("notes").value.trim(),
    price: priceInfo(),
    proofUrl: state.proof && state.proof.key === designKey() ? state.proof.url : "",
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
    if (err?.name !== "AbortError") setStatus(err?.userMessage || "The file couldn't be saved. Try again, or try a smaller photo.", true);
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
  const blob = await jpegBlob(composite({ mode: state.mode, dims: $("showDims").checked }), 0.92);
  const name = `${fileBase()}${state.mode === "night" ? "-night" : ""}.jpg`;
  download(blob, name);
  setStatus(`Saved ${name}`);
}));
$("sharePdf").addEventListener("click", () => runExport("Building PDF…", async () => {
  const file = await makePdf();
  await navigator.share({ files: [file], title: `${currentCat().titleNoun} mockup` });
  setStatus("Shared.");
}));
try {
  const probe = new File([new Uint8Array(1)], "probe.pdf", { type: "application/pdf" });
  $("sharePdf").hidden = !(navigator.canShare && navigator.canShare({ files: [probe] }));
} catch { /* sharing files unsupported */ }

// ---------- approval link ----------
// Anything that changes what the client would see; a link made for an older design is not offered.
function designKey() {
  const r = v => Math.round(v);
  return JSON.stringify([
    artVersion, state.typeId, optionsFor(), state.quad && state.quad.map(p => [r(p.x), r(p.y)]), state.calInches,
    state.cal && [r(state.cal.a.x), r(state.cal.a.y), r(state.cal.b.x), r(state.cal.b.y)], state.opacity, $("showDims").checked,
    state.cover && [state.cover.color, state.cover.quad.map(p => [r(p.x), r(p.y)])],
    $("project").value, $("preparedFor").value, $("notes").value, $("calLabel").value,
  ]);
}

class UserError extends Error {
  constructor(message) { super(message); this.userMessage = message; }
}

async function createProof() {
  const dims = $("showDims").checked;
  const day = composite({ dims, maxSide: 1600 });
  const night = composite({ mode: "night", dims, maxSide: 1600 });
  const art = flatArt(1400);
  const [dayB, nightB, artB] = await Promise.all([jpegBlob(day, 0.84), jpegBlob(night, 0.84), jpegBlob(art, 0.88)]);
  const size = sizeInfo();
  const sheet = {
    typeId: state.typeId,
    src: state.src,
    test: state.test || undefined,
    options: cleanOptions(currentType(), optionsFor()),
    project: $("project").value.trim(),
    preparedFor: $("preparedFor").value.trim(),
    notes: $("notes").value.trim(),
    reference: referenceText(),
    size: size ? { width: size.width, height: size.height } : null,
    sizeText: size ? { width: size.w, height: size.h, area: size.area } : null,
    images: {
      day: { width: day.width, height: day.height },
      night: { width: night.width, height: night.height },
      art: { width: art.width, height: art.height },
    },
  };
  const form = new FormData();
  form.set("sheet", JSON.stringify(sheet));
  form.set("day", dayB, "day.jpg");
  form.set("night", nightB, "night.jpg");
  form.set("art", artB, "art.jpg");
  let res;
  try {
    res = await fetch(API, { method: "POST", body: form, headers: state.test ? { "X-Sign-Mockup-Test": "1" } : {} });
  } catch {
    throw new UserError("Couldn't reach the server. Check your connection and try again.");
  }
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.id) {
    throw new UserError(res.status === 404 || res.status === 405 || (state.test && res.status === 403)
      ? "Approval links aren't available here."
      : body?.error || "Couldn't create the link. Try again.");
  }
  const url = `${location.origin}/tools/sign-mockup/proof/#${body.id}`;
  state.proof = { id: body.id, url, key: designKey() };
}

function renderProofLink() {
  const fresh = state.proof && state.proof.key === designKey();
  $("linkOut").hidden = !fresh;
  $("createLink").textContent = state.proof && !fresh ? "Create a new link for this version" : "Create approval link";
  if (fresh) {
    $("linkUrl").value = state.proof.url;
    $("openLink").href = state.proof.url;
  }
}

$("createLink").addEventListener("click", () => runExport("Creating approval link…", async () => {
  await createProof();
  renderProofLink();
  setStatus("Approval link ready. Send it to your client.");
  $("linkUrl").focus();
  $("linkUrl").select();
}));
$("copyLink").addEventListener("click", async () => {
  const url = $("linkUrl").value;
  try {
    await navigator.clipboard.writeText(url);
    setStatus("Link copied.");
  } catch {
    $("linkUrl").select();
    setStatus("Press Ctrl+C (or ⌘C) to copy the selected link.");
  }
});
$("shareLink").hidden = !navigator.share;
$("shareLink").addEventListener("click", async () => {
  try {
    await navigator.share({ title: `${currentCat().Noun} mockup for approval`, url: $("linkUrl").value });
  } catch { /* dismissed */ }
});
["project", "preparedFor", "notes", "calLabel"].forEach(id => $(id).addEventListener("input", renderProofLink));
$("showDims").addEventListener("change", renderProofLink);

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
    if (!state.calInches) out.textContent = "Line drawn. Enter its real length.";
    else if (state.calInches < PLAUSIBLE_REF[0] || state.calInches > PLAUSIBLE_REF[1]) {
      out.textContent = `Scale set to ${formatFeetInches(state.calInches)}, which is unusual for a storefront. Check the feet and inches.`;
      out.classList.add("warn");
    } else if (px < 80) {
      out.textContent = "Scale set, but the line is short. Zoom in and use a longer reference for a closer estimate.";
      out.classList.add("warn");
    } else {
      out.textContent = `Scale set: ${formatFeetInches(state.calInches)}.`;
      out.classList.add("good");
    }
  }

  const size = sizeInfo();
  const cat = currentCat();
  const extra = size && cat.ui.sizeExtra(currentType(), optionsFor(), size);
  const third = extra ? `<div><span>${escapeHtml(extra.label)}</span><strong>${escapeHtml(extra.value)}</strong>${extra.unit ? escapeHtml(extra.unit) : ""}</div>` : "";
  $("sizeOut").innerHTML = state.sign
    ? size
      ? `<div><span>Width</span><strong>${size.w}</strong></div><div><span>${cat.ui.heightLabel}</span><strong>${size.h}</strong></div>${third}<p>Approximate, from your scale line.</p>`
      : `<p>Set the scale in step 2 to see the ${cat.noun}'s size.</p>`
    : "";
  const warns = state.sign ? codeWarnings(currentType(), optionsFor(), sceneSize()) : [];
  $("typeWarn").hidden = !warns.length;
  $("typeWarn").replaceChildren(...warns.map(w => Object.assign(document.createElement("li"), { textContent: w.text, className: w.over ? "over" : "" })));
  $("setWidth").disabled = !size;
  $("setDrop").disabled = !size;

  const price = $("priceOut");
  const p = state.sign && priceInfo();
  const needsScale = PRICES_LIVE && !sizeInfo();
  price.classList.toggle("muted", !p || p.withheld);
  price.innerHTML = !p
    ? ""
    : needsScale
      ? `<span>${escapeHtml(p.label)}</span><small>Set the scale in step 2 to see a preliminary estimate for this size and type.</small>`
      : p.withheld
        ? `<span>${escapeHtml(p.label)}</span><strong class="sm-noprice">${escapeHtml(p.message)}</strong><small>${escapeHtml(p.disclaimer)}</small>`
        : `<span>${escapeHtml(p.label)}</span><strong>${escapeHtml(p.range)}</strong>${p.perFoot ? `<b class="sm-perfoot">${escapeHtml(p.perFoot)}</b>` : ""}<ul class="sm-plines">${p.lines.map(l => `<li>${escapeHtml(l)}</li>`).join("")}</ul><small>${escapeHtml(p.tax)} ${escapeHtml(p.valid)}</small><small>${escapeHtml(p.disclaimer)}</small>`;

  $("dayNight").hidden = !(state.photo && state.sign && (state.step === "sign" || state.step === "export"));
  renderProofLink();

  showHint(hintText());
}

// The hint fades out (rather than vanishing) once the user has done what it asks.
let hintTimer = 0;
function showHint(text) {
  const el = $("hint");
  clearTimeout(hintTimer);
  if (text) {
    el.textContent = text;
    el.hidden = false;
    el.classList.remove("is-out");
  } else if (!el.hidden) {
    el.classList.add("is-out");
    hintTimer = setTimeout(() => { el.hidden = true; }, 400);
  }
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
buildCategoryBars();
buildTypeList();
renderTypeCard();
resizeCanvas();
updateUI();
openDeepLink(new URLSearchParams(location.search));

// /tools/sign-mockup/?tab=<category>&type=<type id>&src=<tag>: opens that tab and type. Unknown
// or coming-soon values fall back to the default tab rather than failing.
function openDeepLink(q) {
  state.src = cleanSource(q.get("src"));
  state.test = q.get("test") === "1";
  const type = q.get("type"), tab = q.get("tab");
  const cat = READY.find(c => c.id === tab);
  if (type && isKnownType(type) && (!cat || getType(type).category === cat.id)) setType(type);
  else if (cat) setCategory(cat.id);
}

// Lets automated checks drive the tool without simulating every gesture.
window.signMockup = {
  state, loadPhoto, loadSignFile, setStep, setType, setCategory, setMode, makePdf, composite, requestRender, designKey,
  sizeInfo,
  quadInsidePhoto() {
    return state.photo?.canvas ? quadInsidePhoto(state.photo.canvas) : false;
  },
  setOptions(o) {
    const type = currentType();
    setOptionsFor(type, { ...optionsFor(type), ...o });
    renderTypeCard();
    updateUI();
    requestRender();
  },
  get renderer() { return scene.kind; },
};
