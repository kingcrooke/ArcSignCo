// Draws the photo and the chosen product in the photo's perspective, for day or night. The engine
// core: what the product is made of comes from its category's build(type, env, kit) (see kit.js
// and categories/define.js); this file projects that plan, lights it and composites it.
//
// Plane coordinates are inches on the pinned quad: X across, Y down, Z out of the wall toward the
// viewer. A plan is an ordered list of ops (textured quads and hardware paths), plus "emit" layers
// (what glows) and "spill" layers (light that lands on the wall). Night mode darkens the photo,
// adds the spill on the wall (photo × light), draws the product with lit parts at full strength
// and everything else at ambient, then adds bloom. Products that aren't lit never emit.
import { makeCamera, squareToQuad, apply3, dist, bounds } from "./geometry.js";
import { createRenderer } from "./renderer.js";
import { makeCanvas } from "./art.js";
import { makeKit, rgbCss, NIGHT_PHOTO } from "./kit.js";
import { LIGHTING } from "./lighting.js";
import { categoryOf } from "./catalog.js";

/** Runs the category's render rules for a type. Pure description; nothing is drawn here. */
function build(type, env) {
  const cat = categoryOf(type);
  const lighting = cat.lightingOf(type, env.opts);
  const litType = lighting !== "none";
  const full = { ...env, litType, lit: litType && env.night };
  const kit = makeKit(full);
  cat.build(type, full, kit);
  return { ops: kit.ops, emit: kit.emit, spill: kit.spill, fx: LIGHTING[lighting] || LIGHTING.none, lit: full.lit, spillReach: cat.spillReach };
}

/** Average wall color around the quad (raceways are painted to match the wall). */
function sampleWall(photo, quad) {
  const b = bounds(quad);
  const pad = (b.maxX - b.minX) * 0.08;
  const x = Math.max(0, b.minX - pad), y = Math.max(0, b.minY - pad);
  const w = Math.min(photo.width, b.maxX + pad) - x, h = Math.min(photo.height, b.maxY + pad) - y;
  if (w < 2 || h < 2) return [0.55, 0.55, 0.55];
  const c = makeCanvas(24, 24);
  const g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(photo, x, y, w, h, 0, 0, 24, 24);
  const d = g.getImageData(0, 0, 24, 24).data;
  const px = [];
  for (let i = 0; i < d.length; i += 4) px.push([d[i], d[i + 1], d[i + 2]]);
  px.sort((p, q) => p[0] + p[1] + p[2] - (q[0] + q[1] + q[2]));
  const mid = px.slice(Math.floor(px.length * 0.3), Math.ceil(px.length * 0.7));
  return [0, 1, 2].map(k => mid.reduce((s, p) => s + p[k], 0) / mid.length / 255);
}

function half(src) {
  const c = makeCanvas(Math.max(1, src.width / 2), Math.max(1, src.height / 2));
  const g = c.getContext("2d");
  g.imageSmoothingQuality = "high";
  g.drawImage(src, 0, 0, c.width, c.height);
  return c;
}

function intersect(a, b) {
  const x0 = Math.max(a.x, b.x), y0 = Math.max(a.y, b.y);
  const x1 = Math.min(a.x + a.w, b.x + b.w), y1 = Math.min(a.y + a.h, b.y + b.h);
  return x1 > x0 && y1 > y0 ? { x: x0, y: y0, w: x1 - x0, h: y1 - y0 } : null;
}
const grow = (b, p) => ({ x: b.x - p, y: b.y - p, w: b.w + 2 * p, h: b.h + 2 * p });

export function createScene() {
  let renderer = null;
  const R = () => {
    if (!renderer || !renderer.ok) renderer = createRenderer({ forceCpu: !!renderer });
    return renderer;
  };
  let wallKey = "", wallColor = [0.55, 0.55, 0.55];

  /**
   * Draws the photo and the sign into ctx (identity transform, target pixels).
   * o: { photo, view:{s,x,y} photo->target, clip:{w,h}, quad (photo px), art, type, options,
   *      mode:'day'|'night', quality:'draft'|'full', sizeIn:{width,height}, opacity }
   */
  function render(ctx, o) {
    const { photo, view } = o;
    const night = o.mode === "night";
    const photoBox = { x: view.x, y: view.y, w: photo.width * view.s, h: photo.height * view.s };
    const clip = intersect({ x: 0, y: 0, w: o.clip.w, h: o.clip.h }, photoBox) || { x: 0, y: 0, w: 0, h: 0 };
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(photo, photoBox.x, photoBox.y, photoBox.w, photoBox.h);
    if (night) {
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = rgbCss(NIGHT_PHOTO);
      ctx.fillRect(clip.x, clip.y, clip.w, clip.h);
      ctx.globalCompositeOperation = "source-over";
    }
    if (!o.quad || !o.art || !o.type || !clip.w) { ctx.restore(); return; }

    const { quad, type } = o;
    const W = o.sizeIn.width, H = o.sizeIn.height;
    const lens = { cx: photo.width / 2, cy: photo.height / 2, f: 0.85 * Math.max(photo.width, photo.height) };
    const cam = makeCamera(quad, o.sizeIn, lens);
    const flat = squareToQuad(quad);
    const T = p => p && { x: view.x + p.x * view.s, y: view.y + p.y * view.s };
    const P = (X, Y, Z) => T(cam ? cam.project(X, Y, Z) : flat && apply3(flat, X / W, Y / H));

    const key = quad.map(p => `${Math.round(p.x / 8)},${Math.round(p.y / 8)}`).join(";");
    if (key !== wallKey) { wallKey = key; wallColor = sampleWall(photo, quad); }

    const r = R();
    const cpu = r.kind === "cpu";
    const maxSlices = cpu ? 5 : o.quality === "draft" ? 12 : 40;
    const sliceCount = (zb, zf) => {
      if (!cam) return 0;
      let d = 0;
      for (const [x, y] of [[0, 0], [W, 0], [W, H], [0, H]]) {
        const a = P(x, y, zb), b = P(x, y, zf);
        if (a && b) d = Math.max(d, dist(a, b));
      }
      return d < 0.4 ? 0 : Math.min(maxSlices, Math.ceil(d / 0.9));
    };
    const plan = build(type, { W, H, cam, night, opts: o.options || {}, art: o.art, wall: wallColor, sliceCount });

    const projectAll = pts => {
      const out = [];
      for (const p of pts) { const q = P(p[0], p[1], p[2]); if (!q) return null; out.push(q); }
      return out;
    };
    const boxOf = lists => {
      const all = [];
      for (const pts of lists) { const q = projectAll(pts); if (q) all.push(...q); }
      if (!all.length) return null;
      const b = bounds(all);
      return { x: b.minX, y: b.minY, w: b.maxX - b.minX, h: b.maxY - b.minY };
    };
    const opPts = [];
    for (const op of plan.ops) {
      if (op.kind === "layers") for (const l of op.layers) opPts.push(l.pts);
      else opPts.push(op.pts);
    }
    const signBox0 = boxOf(opPts);
    if (!signBox0) { ctx.restore(); return; }
    const signBox = intersect(grow(signBox0, 3), clip);

    const runLayers = (layers, box, q = 1) => {
      r.begin({ x: box.x * q, y: box.y * q, w: box.w * q, h: box.h * q });
      for (const l of layers) {
        const pts = projectAll(l.pts);
        if (!pts) continue;
        r.quad(l.tex, q === 1 ? pts : pts.map(p => ({ x: p.x * q, y: p.y * q })), l);
      }
      return r.end().canvas;
    };
    const copy = c => { const k = makeCanvas(c.width, c.height); k.getContext("2d").drawImage(c, 0, 0); return k; };

    // Night: light that lands on the wall, multiplied into the photo.
    let emitCanvas = null, emitBox = null;
    if (plan.lit && (plan.emit.length || plan.spill.length)) {
      const sp = Math.max(signBox0.h * plan.spillReach, signBox0.w * 0.14);
      emitBox = intersect(grow(signBox0, sp), clip);
      if (emitBox) {
        const q = Math.min(o.quality === "draft" ? 0.3 : 0.5, 720 / Math.max(emitBox.w, emitBox.h));
        emitCanvas = plan.emit.length ? copy(runLayers(plan.emit, emitBox, q)) : null;
        const L = makeCanvas(emitBox.w * q, emitBox.h * q);
        const lg = L.getContext("2d");
        lg.fillStyle = "#000";
        lg.fillRect(0, 0, L.width, L.height);
        lg.globalCompositeOperation = "lighter";
        if (plan.spill.length) lg.drawImage(runLayers(plan.spill, emitBox, q), 0, 0, L.width, L.height);
        if (emitCanvas && plan.fx.spill) {
          let lv = emitCanvas;
          const weights = [0, 0, 0.5, 0.7, 0.8, 0.8];
          for (let i = 1; i < weights.length && lv.width > 2; i++) {
            lv = half(lv);
            if (!weights[i]) continue;
            lg.globalAlpha = Math.min(1, weights[i] * plan.fx.spill);
            lg.drawImage(lv, 0, 0, L.width, L.height);
          }
          lg.globalAlpha = 1;
        }
        // Light fades out before the edge of its box instead of stopping at a hard line.
        const f = Math.max(2, sp * q * 0.6);
        lg.globalCompositeOperation = "source-over";
        for (const [x0, y0, x1, y1, rx, ry, rw, rh] of [
          [0, 0, 0, f, 0, 0, L.width, f], [0, L.height, 0, L.height - f, 0, L.height - f, L.width, f],
          [0, 0, f, 0, 0, 0, f, L.height], [L.width, 0, L.width - f, 0, L.width - f, 0, f, L.height],
        ]) {
          const gr = lg.createLinearGradient(x0, y0, x1, y1);
          gr.addColorStop(0, "rgba(0,0,0,1)");
          gr.addColorStop(1, "rgba(0,0,0,0)");
          lg.fillStyle = gr;
          lg.fillRect(rx, ry, rw, rh);
        }
        const Tc = makeCanvas(L.width, L.height);
        const tg = Tc.getContext("2d");
        tg.drawImage(photo, (emitBox.x - view.x) / view.s, (emitBox.y - view.y) / view.s, emitBox.w / view.s, emitBox.h / view.s, 0, 0, Tc.width, Tc.height);
        tg.globalCompositeOperation = "multiply";
        tg.drawImage(L, 0, 0);
        // Even a dark fascia reflects some light, so the spill never vanishes on black walls.
        tg.globalCompositeOperation = "lighter";
        tg.globalAlpha = plan.fx.floor ?? 0.16;
        tg.drawImage(L, 0, 0);
        ctx.globalCompositeOperation = "lighter";
        ctx.drawImage(Tc, emitBox.x, emitBox.y, emitBox.w, emitBox.h);
        ctx.globalCompositeOperation = "source-over";
      }
    }

    // The sign itself, in op order (texture batches and hardware paths interleave).
    if (signBox) {
      ctx.globalAlpha = o.opacity ?? 1;
      for (const op of plan.ops) {
        if (op.kind === "layers") {
          let frame = runLayers(op.layers, signBox);
          if (op.paint) frame = paintOnWall(frame, signBox, photo, view);
          ctx.drawImage(frame, signBox.x, signBox.y, signBox.w, signBox.h);
        } else drawPath(ctx, op, P);
      }
      ctx.globalAlpha = 1;
    }

    if (emitCanvas && plan.fx.bloom) {
      ctx.globalCompositeOperation = "lighter";
      let lv = emitCanvas;
      const weights = [0.35, 0.4, 0.4, 0.35, 0.3];
      for (const w of weights) {
        if (lv.width <= 2) break;
        lv = half(lv);
        ctx.globalAlpha = Math.min(1, w * plan.fx.bloom);
        ctx.drawImage(lv, emitBox.x, emitBox.y, emitBox.w, emitBox.h);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.restore();
  }

  return {
    render,
    get kind() { return R().kind; },
  };
}

function drawPath(ctx, op, P) {
  const pts = op.pts.map(p => P(p[0], p[1], p[2]));
  if (pts.some(p => !p)) return;
  const a = op.pts[0], p0 = pts[0], p1 = P(a[0] + 1, a[1], a[2]);
  const ppi = p1 ? dist(p0, p1) : 1;
  ctx.save();
  ctx.globalAlpha *= op.alpha ?? 1;
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  if (op.close) ctx.closePath();
  if (op.fill) {
    ctx.fillStyle = rgbCss(op.fill);
    ctx.fill();
  }
  if (op.stroke) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(1, (op.width || 0.5) * ppi);
    ctx.strokeStyle = rgbCss(op.stroke);
    ctx.stroke();
  }
  ctx.restore();
}

// Paint takes the wall's texture: the paint color is modulated by the brightness of the wall under it.
function paintOnWall(frame, box, photo, view) {
  const w = frame.width, h = frame.height;
  const out = makeCanvas(w, h);
  const g = out.getContext("2d", { willReadFrequently: true });
  g.drawImage(photo, (box.x - view.x) / view.s, (box.y - view.y) / view.s, box.w / view.s, box.h / view.s, 0, 0, w, h);
  const wall = g.getImageData(0, 0, w, h).data;
  g.clearRect(0, 0, w, h);
  g.drawImage(frame, 0, 0);
  const img = g.getImageData(0, 0, w, h), d = img.data;
  let sum = 0, n = 0;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 128) continue;
    sum += wall[i] * 0.3 + wall[i + 1] * 0.59 + wall[i + 2] * 0.11;
    n++;
  }
  const mean = n ? sum / n : 128;
  for (let i = 0; i < d.length; i += 4) {
    if (!d[i + 3]) continue;
    const lum = wall[i] * 0.3 + wall[i + 1] * 0.59 + wall[i + 2] * 0.11;
    const k = Math.min(1.25, Math.max(0.35, 0.45 + 0.55 * (lum / (mean || 1))));
    d[i] = Math.min(255, d[i] * k); d[i + 1] = Math.min(255, d[i + 1] * k); d[i + 2] = Math.min(255, d[i + 2] * k);
  }
  g.putImageData(img, 0, 0);
  return out;
}
