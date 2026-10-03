// Prepares artwork for the construction renderer: removes a flat background, crops to the copy,
// and derives the masks each sign type needs (trim outline, rings, soft shadows, neon centerline).
// Everything is cached per source canvas, so re-rendering while dragging corners costs nothing.

const WORK = 1024; // long side for mask processing

export function makeCanvas(w, h) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}
const ctx2d = (c, read = false) => c.getContext("2d", read ? { willReadFrequently: true } : undefined);

const memo = new WeakMap();
function cached(src, key, make) {
  let m = memo.get(src);
  if (!m || m.ver !== (src.__smVer || 0)) memo.set(src, (m = { ver: src.__smVer || 0, map: new Map() }));
  if (!m.map.has(key)) m.map.set(key, make());
  return m.map.get(key);
}

export const hexToRgb = hex => {
  const h = String(hex || "#000").replace("#", "");
  const v = h.length === 3 ? h.split("").map(c => c + c).join("") : h.padEnd(6, "0");
  return [0, 2, 4].map(i => parseInt(v.slice(i, i + 2), 16) / 255);
};
export const rgbToHex = c => "#" + c.map(v => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("");
export const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

function scaled(src, maxSide) {
  const k = Math.min(1, maxSide / Math.max(src.width, src.height));
  if (k === 1) return src;
  const c = makeCanvas(src.width * k, src.height * k);
  const g = ctx2d(c);
  g.imageSmoothingQuality = "high";
  g.drawImage(src, 0, 0, c.width, c.height);
  return c;
}

/** Bounding box of pixels with alpha above the threshold, or null when empty. */
export function alphaBounds(src, threshold = 12) {
  return cached(src, `bounds${threshold}`, () => {
    const s = scaled(src, WORK), k = src.width / s.width;
    const d = ctx2d(s, true).getImageData(0, 0, s.width, s.height).data;
    let x0 = s.width, y0 = s.height, x1 = -1, y1 = -1;
    for (let y = 0; y < s.height; y++) {
      for (let x = 0; x < s.width; x++) {
        if (d[(y * s.width + x) * 4 + 3] > threshold) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    }
    if (x1 < 0) return null;
    return { x: x0 * k, y: y0 * k, w: (x1 - x0 + 1) * k, h: (y1 - y0 + 1) * k };
  });
}

/** True when the artwork has real transparency (a logo PNG), not a filled rectangle. */
export function hasTransparency(src) {
  return cached(src, "transp", () => {
    const s = scaled(src, 256);
    const d = ctx2d(s, true).getImageData(0, 0, s.width, s.height).data;
    let clear = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] < 200) clear++;
    return clear / (d.length / 4) > 0.02;
  });
}

/**
 * Removes a flat background color (sampled from the border) from opaque artwork, so a logo on
 * white can become cut-out letters. Returns { canvas, removed, background:[r,g,b] }.
 */
export function knockout(src) {
  return cached(src, "knockout", () => {
    if (hasTransparency(src)) return { canvas: src, removed: false, background: null };
    const w = src.width, h = src.height;
    const g = ctx2d(src, true);
    const d = g.getImageData(0, 0, w, h).data;
    const border = [];
    const step = Math.max(1, Math.round((w + h) / 400));
    for (let x = 0; x < w; x += step) border.push((0 * w + x) * 4, ((h - 1) * w + x) * 4);
    for (let y = 0; y < h; y += step) border.push((y * w + 0) * 4, (y * w + w - 1) * 4);
    const med = [0, 1, 2].map(c => {
      const v = border.map(i => d[i + c]).sort((a, b) => a - b);
      return v[v.length >> 1];
    });
    const near = i => Math.hypot(d[i] - med[0], d[i + 1] - med[1], d[i + 2] - med[2]);
    const match = border.filter(i => near(i) < 34).length / border.length;
    if (match < 0.85) return { canvas: src, removed: false, background: med.map(v => v / 255) };
    const out = makeCanvas(w, h);
    const og = ctx2d(out);
    const img = og.createImageData(w, h);
    const o = img.data;
    const T0 = 26, T1 = 70;
    for (let i = 0; i < d.length; i += 4) {
      const dd = near(i);
      const a = dd <= T0 ? 0 : dd >= T1 ? 1 : (dd - T0) / (T1 - T0);
      if (a <= 0) continue;
      // Un-mix the background from antialiased edge pixels so the edge keeps the letter color.
      for (let c = 0; c < 3; c++) o[i + c] = Math.min(255, Math.max(0, med[c] + (d[i + c] - med[c]) / a));
      o[i + 3] = a * d[i + 3];
    }
    og.putImageData(img, 0, 0);
    return { canvas: out, removed: true, background: med.map(v => v / 255) };
  });
}

/** Crops to the visible copy plus a margin (fraction of the copy's larger side). */
export function cropToContent(src, margin = 0.025) {
  return cached(src, `crop${margin}`, () => {
    const b = alphaBounds(src);
    if (!b) return src;
    const m = Math.round(Math.max(b.w, b.h) * margin) + 2;
    const x = Math.max(0, Math.floor(b.x - m)), y = Math.max(0, Math.floor(b.y - m));
    const x1 = Math.min(src.width, Math.ceil(b.x + b.w + m)), y1 = Math.min(src.height, Math.ceil(b.y + b.h + m));
    const c = makeCanvas(x1 - x + 2 * m, y1 - y + 2 * m);
    ctx2d(c).drawImage(src, x, y, x1 - x, y1 - y, m, m, x1 - x, y1 - y);
    return c;
  });
}

/** White silhouette with the artwork's alpha, at processing resolution. */
export function maskOf(src) {
  return cached(src, "mask", () => {
    const s = scaled(src, WORK);
    const c = makeCanvas(s.width, s.height);
    const g = ctx2d(c);
    g.drawImage(s, 0, 0);
    g.globalCompositeOperation = "source-in";
    g.fillStyle = "#fff";
    g.fillRect(0, 0, c.width, c.height);
    return c;
  });
}

function offsets(r) {
  const out = [];
  const rings = Math.max(1, Math.ceil(r / 1.5));
  for (let k = 1; k <= rings; k++) {
    const rr = (r * k) / rings;
    const n = Math.min(32, Math.max(8, Math.ceil((2 * Math.PI * rr) / 1.5)));
    for (let i = 0; i < n; i++) out.push([Math.cos((i / n) * Math.PI * 2) * rr, Math.sin((i / n) * Math.PI * 2) * rr]);
  }
  return out;
}

/** Grows (r > 0) or shrinks (r < 0) a mask by r pixels of the mask canvas. */
export function morph(mask, r) {
  const key = `morph${r.toFixed(2)}`;
  return cached(mask, key, () => {
    if (Math.abs(r) < 0.3) return mask;
    const c = makeCanvas(mask.width, mask.height);
    const g = ctx2d(c);
    if (r > 0) {
      g.drawImage(mask, 0, 0);
      for (const [dx, dy] of offsets(r)) g.drawImage(mask, dx, dy);
      return c;
    }
    const inv = makeCanvas(mask.width, mask.height);
    const ig = ctx2d(inv);
    ig.fillStyle = "#fff";
    ig.fillRect(0, 0, inv.width, inv.height);
    ig.globalCompositeOperation = "destination-out";
    ig.drawImage(mask, 0, 0);
    const grown = morph(inv, -r);
    g.drawImage(mask, 0, 0);
    g.globalCompositeOperation = "destination-out";
    g.drawImage(grown, 0, 0);
    return c;
  });
}

/** The band just inside the mask's edge, r pixels wide. */
export function ring(mask, r) {
  return cached(mask, `ring${r.toFixed(2)}`, () => {
    const c = makeCanvas(mask.width, mask.height);
    const g = ctx2d(c);
    g.drawImage(mask, 0, 0);
    g.globalCompositeOperation = "destination-out";
    g.drawImage(morph(mask, -r), 0, 0);
    return c;
  });
}

/**
 * Soft blur by downsampling (works everywhere, unlike ctx.filter on older Safari).
 * Returns { canvas, pad } where canvas covers the source grown by `pad` source pixels per side.
 */
export function blur(src, r) {
  return cached(src, `blur${r.toFixed(1)}`, () => {
    const pad = Math.ceil(Math.max(1, r) * 2.4);
    let cur = makeCanvas(src.width + pad * 2, src.height + pad * 2);
    ctx2d(cur).drawImage(src, pad, pad);
    let k = 1;
    while (k * 2 <= Math.max(1, r / 1.4)) {
      const n = makeCanvas(Math.ceil(cur.width / 2), Math.ceil(cur.height / 2));
      const g = ctx2d(n);
      g.imageSmoothingQuality = "high";
      g.drawImage(cur, 0, 0, n.width, n.height);
      cur = n;
      k *= 2;
    }
    const out = makeCanvas(cur.width, cur.height);
    const g = ctx2d(out);
    g.globalCompositeOperation = "lighter";
    const taps = [[0, 0, 0.25], [1, 0, 0.125], [-1, 0, 0.125], [0, 1, 0.125], [0, -1, 0.125], [1, 1, 0.0625], [-1, 1, 0.0625], [1, -1, 0.0625], [-1, -1, 0.0625]];
    for (const [dx, dy, w] of taps) {
      g.globalAlpha = w;
      g.drawImage(cur, dx, dy);
    }
    return { canvas: out, pad };
  });
}

/** Average color of the visible pixels, 0..1. */
export function averageColor(src) {
  return cached(src, "avg", () => {
    const s = scaled(src, 96);
    const d = ctx2d(s, true).getImageData(0, 0, s.width, s.height).data;
    let r = 0, g = 0, b = 0, a = 0;
    for (let i = 0; i < d.length; i += 4) {
      const w = d[i + 3] / 255;
      r += d[i] * w; g += d[i + 1] * w; b += d[i + 2] * w; a += w;
    }
    return a ? [r / a / 255, g / a / 255, b / a / 255] : [1, 1, 1];
  });
}

/**
 * Centerline of the strokes (ridge of the distance transform), grown to a tube r pixels in
 * radius. Used for LED neon flex, which is bent along the middle of each stroke.
 */
export function tube(mask, r) {
  return cached(mask, `tube${r.toFixed(1)}`, () => {
    const s = scaled(mask, 640), k = mask.width / s.width;
    const w = s.width, h = s.height;
    const d = ctx2d(s, true).getImageData(0, 0, w, h).data;
    const INF = 1e9;
    const dt = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) dt[i] = d[i * 4 + 3] > 127 ? INF : 0;
    const A = 1, B = 1.4142;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (!dt[i]) continue;
        let v = dt[i];
        if (x > 0) v = Math.min(v, dt[i - 1] + A); else v = Math.min(v, A);
        if (y > 0) v = Math.min(v, dt[i - w] + A); else v = Math.min(v, A);
        if (x > 0 && y > 0) v = Math.min(v, dt[i - w - 1] + B);
        if (x < w - 1 && y > 0) v = Math.min(v, dt[i - w + 1] + B);
        dt[i] = v;
      }
    }
    for (let y = h - 1; y >= 0; y--) {
      for (let x = w - 1; x >= 0; x--) {
        const i = y * w + x;
        if (!dt[i]) continue;
        let v = dt[i];
        if (x < w - 1) v = Math.min(v, dt[i + 1] + A); else v = Math.min(v, A);
        if (y < h - 1) v = Math.min(v, dt[i + w] + A); else v = Math.min(v, A);
        if (x < w - 1 && y < h - 1) v = Math.min(v, dt[i + w + 1] + B);
        if (x > 0 && y < h - 1) v = Math.min(v, dt[i + w - 1] + B);
        dt[i] = v;
      }
    }
    // Keep the band within r of the local maximum distance (the stroke's center): a continuous
    // line of the tube's width down the middle of each stroke. Thin strokes keep their full width.
    const rs = r / k;
    const vals = [];
    for (let i = 0; i < dt.length; i++) if (dt[i] > 1) vals.push(dt[i]);
    vals.sort((a, b) => a - b);
    const typical = vals.length ? vals[Math.floor(vals.length * 0.9)] : 1;
    const R = Math.max(1, Math.ceil(typical));
    const tmp = new Float32Array(w * h), loc = new Float32Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      let m = 0;
      for (let j = Math.max(0, x - R); j <= Math.min(w - 1, x + R); j++) m = Math.max(m, dt[y * w + j]);
      tmp[y * w + x] = m;
    }
    for (let x = 0; x < w; x++) for (let y = 0; y < h; y++) {
      let m = 0;
      for (let j = Math.max(0, y - R); j <= Math.min(h - 1, y + R); j++) m = Math.max(m, tmp[j * w + x]);
      loc[y * w + x] = m;
    }
    const line = makeCanvas(w, h);
    const lg = ctx2d(line);
    const img = lg.createImageData(w, h);
    const o = img.data;
    for (let i = 0; i < w * h; i++) {
      const v = dt[i];
      if (v < 0.5) continue;
      const a = Math.min(1, Math.max(0, v - (loc[i] - rs) + 0.5));
      if (a <= 0) continue;
      o[i * 4] = o[i * 4 + 1] = o[i * 4 + 2] = 255;
      o[i * 4 + 3] = a * 255;
    }
    lg.putImageData(img, 0, 0);
    const out = makeCanvas(mask.width, mask.height);
    const og = ctx2d(out);
    og.imageSmoothingQuality = "high";
    og.drawImage(line, 0, 0, out.width, out.height);
    return out;
  });
}

/**
 * The artwork as a sign maker would use it. Built once per source; each getter is cached.
 *   letters  cut-out copy (background removed when possible), cropped tight
 *   panel(color) printed face for panels, cabinets and blades
 *   copy(color)  only the copy, laid out like panel(color) (push-through letters)
 */
export function makeArtwork(source, { text = false } = {}) {
  const k = () => knockout(source);
  const art = {
    source,
    text,
    get removed() { return k().removed; },
    // Nothing left to place: blank artwork, or artwork that was all background.
    get empty() { return !alphaBounds(k().canvas); },
    get cutout() { return text || hasTransparency(source) || k().removed; },
    get letters() { return cropToContent(k().canvas); },
    get color() { return averageColor(art.letters); },
    background() { return k().background; },
    layout(panelColor) {
      return cached(source, `layout${panelColor}`, () => {
        if (!text && !hasTransparency(source)) {
          // Opaque artwork is the face as supplied.
          return { panel: source, copy: k().removed ? k().canvas : source, bg: k().background || [1, 1, 1] };
        }
        const L = art.letters;
        const pad = Math.round(Math.max(L.height * 0.32, L.width * 0.04));
        const panel = makeCanvas(L.width + pad * 2, L.height + pad * 2);
        const pg = ctx2d(panel);
        pg.fillStyle = panelColor;
        pg.fillRect(0, 0, panel.width, panel.height);
        pg.drawImage(L, pad, pad);
        const copy = makeCanvas(panel.width, panel.height);
        ctx2d(copy).drawImage(L, pad, pad);
        return { panel, copy, bg: hexToRgb(panelColor) };
      });
    },
  };
  return art;
}

/** A plain white texture, tinted by the renderer for solid parts. */
export const WHITE = (() => {
  let c = null;
  return () => {
    if (c) return c;
    c = makeCanvas(4, 4);
    const g = ctx2d(c);
    g.fillStyle = "#fff";
    g.fillRect(0, 0, 4, 4);
    return c;
  };
})();

/** Round cap with a soft metallic highlight (standoff caps). */
export const DISK = (() => {
  let c = null;
  return () => {
    if (c) return c;
    c = makeCanvas(64, 64);
    const g = ctx2d(c);
    const grad = g.createRadialGradient(26, 24, 2, 32, 32, 31);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.55, "#c9ccd1");
    grad.addColorStop(1, "#6d7178");
    g.fillStyle = grad;
    g.beginPath();
    g.arc(32, 32, 31, 0, Math.PI * 2);
    g.fill();
    return c;
  };
})();

/** A filled rectangle with soft edges for box shadows: { canvas, pad } with pad as a fraction of the side. */
export const SOFT_RECT = (() => {
  let v = null;
  return () => {
    if (v) return v;
    const c = makeCanvas(48, 48);
    const g = ctx2d(c);
    g.fillStyle = "#fff";
    g.fillRect(0, 0, 48, 48);
    const b = blur(c, 6);
    v = { canvas: b.canvas, pad: b.pad / 48 };
    return v;
  };
})();
