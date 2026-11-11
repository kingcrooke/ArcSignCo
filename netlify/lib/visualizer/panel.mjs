// Find a logo rectangle on the vehicle, not on the studio background or a person beside it.

function dist(a, b) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function borderColor(data, width, height) {
  const samples = [];
  const take = (x, y) => {
    const i = (y * width + x) * 4;
    samples.push([data[i], data[i + 1], data[i + 2]]);
  };
  const n = 10;
  for (let i = 0; i < n; i++) {
    const x = Math.min(width - 1, Math.round(((width - 1) * i) / (n - 1)));
    take(x, Math.min(height - 1, 1));
    take(x, Math.max(0, height - 2));
  }
  for (let i = 1; i < n - 1; i++) {
    const y = Math.min(height - 1, Math.round(((height - 1) * i) / (n - 1)));
    take(Math.min(width - 1, 1), y);
    take(Math.max(0, width - 2), y);
  }
  const med = (channel) => {
    const arr = samples.map(sample => sample[channel]).sort((a, b) => a - b);
    return arr[arr.length >> 1];
  };
  return [med(0), med(1), med(2)];
}

function maskAt(data, width, height, bg, threshold) {
  const step = Math.max(2, Math.round(Math.min(width, height) / 90));
  const gw = Math.ceil(width / step);
  const gh = Math.ceil(height / step);
  const mask = new Uint8Array(gw * gh);
  for (let gy = 0; gy < gh; gy++) {
    for (let gx = 0; gx < gw; gx++) {
      const x = Math.min(width - 1, gx * step + (step >> 1));
      const y = Math.min(height - 1, gy * step + (step >> 1));
      const i = (y * width + x) * 4;
      if (dist([data[i], data[i + 1], data[i + 2]], bg) > threshold) mask[gy * gw + gx] = 1;
    }
  }
  return { mask, gw, gh };
}

function dilate(mask, gw, gh, radius) {
  const out = new Uint8Array(mask.length);
  for (let y = 0; y < gh; y++) {
    for (let x = 0; x < gw; x++) {
      if (!mask[y * gw + x]) continue;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue;
          out[ny * gw + nx] = 1;
        }
      }
    }
  }
  return out;
}

function largestComponent(mask, gw, gh) {
  const seen = new Uint8Array(mask.length);
  let best = null;
  const stack = [];
  for (let start = 0; start < mask.length; start++) {
    if (!mask[start] || seen[start]) continue;
    stack.push(start);
    seen[start] = 1;
    const cells = [];
    while (stack.length) {
      const cur = stack.pop();
      const x = cur % gw;
      const y = (cur / gw) | 0;
      cells.push(x, y);
      const neighbors = [1, -1, gw, -gw];
      for (const delta of neighbors) {
        const ni = cur + delta;
        if (ni < 0 || ni >= mask.length || seen[ni] || !mask[ni]) continue;
        const nx = ni % gw;
        const ny = (ni / gw) | 0;
        if (Math.abs(nx - x) + Math.abs(ny - y) !== 1) continue;
        seen[ni] = 1;
        stack.push(ni);
      }
    }
    if (!best || cells.length > best.length) best = cells;
  }
  return best;
}

function columnSpan(cells, gw) {
  const counts = new Uint32Array(gw);
  let max = 0;
  for (let i = 0; i < cells.length; i += 2) {
    const next = ++counts[cells[i]];
    if (next > max) max = next;
  }
  const need = Math.max(2, max * 0.35);
  let best = null;
  let run = null;
  const finish = () => {
    if (!run) return;
    if (!best || run.x1 - run.x0 > best.x1 - best.x0) best = run;
    run = null;
  };
  for (let x = 0; x < gw; x++) {
    if (counts[x] >= need) {
      if (!run) run = { x0: x, x1: x };
      run.x1 = x;
    } else finish();
  }
  finish();
  return best;
}

function boundsOf(cells, gw, gh, x0, x1) {
  let minX = gw;
  let minY = gh;
  let maxX = 0;
  let maxY = 0;
  let n = 0;
  for (let i = 0; i < cells.length; i += 2) {
    const x = cells[i];
    const y = cells[i + 1];
    if (x < x0 || x > x1) continue;
    n += 1;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  if (!n) return null;
  return { minX, minY, maxX, maxY, n };
}

function clamp01(rect) {
  let { x, y, w, h } = rect;
  w = Math.max(0.04, Math.min(w, 1));
  h = Math.max(0.04, Math.min(h, 1));
  x = Math.min(Math.max(x, 0), 1 - w);
  y = Math.min(Math.max(y, 0), 1 - h);
  return { x, y, w, h };
}

export function fallbackPanel() {
  return {
    zone: { x: 0.4, y: 0.42, w: 0.2, h: 0.22 },
    box: { x: 0.1, y: 0.18, w: 0.8, h: 0.64 },
  };
}

function panelFromMask(mask, gw, gh) {
  const dilated = dilate(mask, gw, gh, 2);
  const cells = largestComponent(dilated, gw, gh);
  if (!cells || cells.length < gw * gh * 0.08 * 2) return null;
  const span = columnSpan(cells, gw);
  if (!span || span.x1 - span.x0 < 2) return null;
  const tight = boundsOf(cells, gw, gh, span.x0, span.x1);
  if (!tight) return null;
  const box = clamp01({
    x: tight.minX / gw,
    y: tight.minY / gh,
    w: (tight.maxX - tight.minX + 1) / gw,
    h: (tight.maxY - tight.minY + 1) / gh,
  });
  const inset = 0.06;
  const inner = clamp01({
    x: box.x + box.w * inset,
    y: box.y + box.h * inset,
    w: box.w * (1 - inset * 2),
    h: box.h * (1 - inset * 2),
  });
  const w = Math.min(Math.max(inner.w * 0.24, 0.08), inner.w * 0.42);
  const h = Math.min(Math.max(inner.h * 0.28, 0.08), inner.h * 0.46);
  const zone = clamp01({
    x: inner.x + inner.w * 0.5 - w / 2,
    y: inner.y + inner.h * 0.52 - h / 2,
    w,
    h,
  });
  return { zone, box: inner };
}

export function vehiclePanel(image) {
  if (!image?.width || !image?.height || !image?.data) return fallbackPanel();
  const bg = borderColor(image.data, image.width, image.height);
  let short = null;
  for (const threshold of [34, 20]) {
    const { mask, gw, gh } = maskAt(image.data, image.width, image.height, bg, threshold);
    const found = panelFromMask(mask, gw, gh);
    if (!found) continue;
    if (found.box.h >= 0.38) return found;
    short = short || found;
  }
  return short || fallbackPanel();
}
