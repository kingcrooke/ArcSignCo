/**
 * Storefront composite. The four corners stay the fabrication face.
 * Construction (returns, raceway, standoffs, halo) is drawn around that pin.
 * Night view uses the same corners.
 */

const DEPTH_IN = {
  "channel-letters": 5,
  lightbox: 8,
  blade: 6,
  "flat-panel": 1.25,
};

const SPILL = {
  "face-lit": { color: "#ffe1a8", alpha: 0.62, blur: 0.05, shift: 0.7, core: 0.28 },
  "halo-lit": { color: "#fff1cc", alpha: 0.95, blur: 0.065, shift: 1.15, core: 0.55 },
  internal: { color: "#d7e6ff", alpha: 0.55, blur: 0.042, shift: 0.4, core: 0.4 },
  neon: { color: null, alpha: 0.9, blur: 0.075, shift: 0.85, core: 0.75 },
};

function edgeLen(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function centroid(corners) {
  const x = corners.reduce((sum, p) => sum + p.x, 0) / corners.length;
  const y = corners.reduce((sum, p) => sum + p.y, 0) / corners.length;
  return { x, y };
}

function bilinearQuad(u, v, corners) {
  const [tl, tr, br, bl] = corners;
  return {
    x: (1 - u) * (1 - v) * tl.x + u * (1 - v) * tr.x + u * v * br.x + (1 - u) * v * bl.x,
    y: (1 - u) * (1 - v) * tl.y + u * (1 - v) * tr.y + u * v * br.y + (1 - u) * v * bl.y,
  };
}

function insetQuad(corners, u0, v0, u1, v1) {
  return [
    bilinearQuad(u0, v0, corners),
    bilinearQuad(u1, v0, corners),
    bilinearQuad(u1, v1, corners),
    bilinearQuad(u0, v1, corners),
  ];
}

function scalePoint(p, s) {
  return { x: p.x * s, y: p.y * s };
}

function shiftQuad(corners, offset, t) {
  return corners.map((p) => ({ x: p.x + offset.x * t, y: p.y + offset.y * t }));
}

function scaleOffset(offset, t) {
  return { x: offset.x * t, y: offset.y * t };
}

function extrusionOffset(corners, depthPx) {
  const [tl, tr, br, bl] = corners;
  const downX = (bl.x + br.x) / 2 - (tl.x + tr.x) / 2;
  const downY = (bl.y + br.y) / 2 - (tl.y + tr.y) / 2;
  const rightX = (tr.x + br.x) / 2 - (tl.x + bl.x) / 2;
  const rightY = (tr.y + br.y) / 2 - (tl.y + bl.y) / 2;
  const dl = Math.hypot(downX, downY) || 1;
  const rl = Math.hypot(rightX, rightY) || 1;
  const x = (downX / dl) * 0.72 + (rightX / rl) * 0.38;
  const y = (downY / dl) * 0.72 + (rightY / rl) * 0.38;
  const len = Math.hypot(x, y) || 1;
  return { x: (x / len) * depthPx, y: (y / len) * depthPx };
}

function depthPixels(corners, ppi, inches) {
  if (ppi && ppi > 0) return Math.max(2, inches * ppi);
  const h = (edgeLen(corners[0], corners[3]) + edgeLen(corners[1], corners[2])) / 2;
  return Math.max(4, h * (inches / 36));
}

function drawImageTriangle(ctx, img, sx0, sy0, sx1, sy1, sx2, sy2, dx0, dy0, dx1, dy1, dx2, dy2) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(dx0, dy0);
  ctx.lineTo(dx1, dy1);
  ctx.lineTo(dx2, dy2);
  ctx.closePath();
  ctx.clip();
  const denom = sx0 * (sy1 - sy2) + sx1 * (sy2 - sy0) + sx2 * (sy0 - sy1);
  if (Math.abs(denom) < 1e-6) {
    ctx.restore();
    return;
  }
  const m11 = (dx0 * (sy1 - sy2) + dx1 * (sy2 - sy0) + dx2 * (sy0 - sy1)) / denom;
  const m12 = (dx0 * (sx2 - sx1) + dx1 * (sx0 - sx2) + dx2 * (sx1 - sx0)) / denom;
  const m21 = (dy0 * (sy1 - sy2) + dy1 * (sy2 - sy0) + dy2 * (sy0 - sy1)) / denom;
  const m22 = (dy0 * (sx2 - sx1) + dy1 * (sx0 - sx2) + dy2 * (sx1 - sx0)) / denom;
  const dx =
    (dx0 * (sx1 * sy2 - sx2 * sy1) + dx1 * (sx2 * sy0 - sx0 * sy2) + dx2 * (sx0 * sy1 - sx1 * sy0)) / denom;
  const dy =
    (dy0 * (sx1 * sy2 - sx2 * sy1) + dy1 * (sx2 * sy0 - sx0 * sy2) + dy2 * (sx0 * sy1 - sx1 * sy0)) / denom;
  ctx.setTransform(m11, m21, m12, m22, dx, dy);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}

function drawWarpedSign(ctx, img, corners, subdiv) {
  const sw = img.width || img.naturalWidth;
  const sh = img.height || img.naturalHeight;
  const n = subdiv;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const u0 = i / n;
      const u1 = (i + 1) / n;
      const v0 = j / n;
      const v1 = (j + 1) / n;
      const p00 = bilinearQuad(u0, v0, corners);
      const p10 = bilinearQuad(u1, v0, corners);
      const p11 = bilinearQuad(u1, v1, corners);
      const p01 = bilinearQuad(u0, v1, corners);
      const sx0 = u0 * sw;
      const sx1 = u1 * sw;
      const sy0 = v0 * sh;
      const sy1 = v1 * sh;
      drawImageTriangle(ctx, img, sx0, sy0, sx1, sy0, sx1, sy1, p00.x, p00.y, p10.x, p10.y, p11.x, p11.y);
      drawImageTriangle(ctx, img, sx0, sy0, sx1, sy1, sx0, sy1, p00.x, p00.y, p11.x, p11.y, p01.x, p01.y);
    }
  }
}

function warpToLayer(sign, corners, w, h, subdiv) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  drawWarpedSign(ctx, sign, corners, subdiv);
  return canvas;
}

function tintLayer(layer, color) {
  const canvas = document.createElement("canvas");
  canvas.width = layer.width;
  canvas.height = layer.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(layer, 0, 0);
  ctx.globalCompositeOperation = "source-in";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return canvas;
}

function fillQuad(ctx, corners, color) {
  ctx.beginPath();
  ctx.moveTo(corners[0].x, corners[0].y);
  for (let i = 1; i < 4; i++) ctx.lineTo(corners[i].x, corners[i].y);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function strokeQuad(ctx, corners, color, width) {
  ctx.beginPath();
  ctx.moveTo(corners[0].x, corners[0].y);
  for (let i = 1; i < 4; i++) ctx.lineTo(corners[i].x, corners[i].y);
  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function palette(night) {
  if (night) {
    return {
      trim: "#2c343c",
      returns: ["#46515c", "#242a31", "#121418", "#323a43"],
      racewayFace: "#12161b",
      racewayReturns: ["#3a424b", "#1c2127", "#0c0e11", "#2a3138"],
      plate: "#1a1f25",
      peg: "#d5dbe2",
      pegShaft: "#2a3038",
    };
  }
  return {
    trim: "#d5dde4",
    returns: ["#aeb7c0", "#66717b", "#3d464e", "#87919a"],
    racewayFace: "#242b32",
    racewayReturns: ["#5c6771", "#2e363d", "#171c21", "#454e57"],
    plate: "#3c4550",
    peg: "#e7edf2",
    pegShaft: "#2a3038",
  };
}

function drawBox(ctx, corners, offset, faceColor, returnColors) {
  const back = shiftQuad(corners, offset, 1);
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    ctx.fillStyle = returnColors[i];
    ctx.beginPath();
    ctx.moveTo(corners[i].x, corners[i].y);
    ctx.lineTo(corners[j].x, corners[j].y);
    ctx.lineTo(back[j].x, back[j].y);
    ctx.lineTo(back[i].x, back[i].y);
    ctx.closePath();
    ctx.fill();
  }
  if (faceColor) fillQuad(ctx, corners, faceColor);
}

function drawContactShadow(ctx, layer, offset) {
  const blur = Math.max(8, Math.hypot(offset.x, offset.y) * 0.45);
  ctx.save();
  ctx.filter = `blur(${blur}px) brightness(0)`;
  ctx.globalAlpha = 0.42;
  ctx.drawImage(layer, offset.x * 0.55, offset.y * 0.55);
  ctx.restore();
}

function drawAlphaReturns(ctx, layer, offset, steps) {
  ctx.save();
  ctx.filter = "brightness(0.2) saturate(0.15)";
  for (let i = steps; i >= 1; i--) {
    const t = i / steps;
    ctx.globalAlpha = 0.92;
    ctx.drawImage(layer, offset.x * t, offset.y * t);
  }
  ctx.restore();
}

function drawStandoffs(ctx, corners, offset, ppi, colors) {
  const radius = Math.max(5.5, depthPixels(corners, ppi, 0.7) * 0.55);
  const spots = [
    [0.14, 0.2],
    [0.86, 0.2],
    [0.86, 0.8],
    [0.14, 0.8],
  ];
  for (const [u, v] of spots) {
    const face = bilinearQuad(u, v, corners);
    const wall = { x: face.x + offset.x, y: face.y + offset.y };
    ctx.strokeStyle = colors.pegShaft;
    ctx.lineWidth = Math.max(2, radius * 0.7);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(face.x, face.y);
    ctx.lineTo(wall.x, wall.y);
    ctx.stroke();
    ctx.fillStyle = colors.pegShaft;
    ctx.beginPath();
    ctx.arc(wall.x, wall.y, radius * 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colors.peg;
    ctx.beginPath();
    ctx.arc(face.x, face.y, radius * 0.75, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSpill(ctx, layer, color, blurPx, alpha, dx, dy) {
  const tinted = tintLayer(layer, color);
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.filter = `blur(${Math.max(4, blurPx)}px)`;
  ctx.globalAlpha = alpha;
  ctx.drawImage(tinted, dx, dy);
  ctx.restore();
}

function drawQuadSpill(ctx, corners, color, blurPx, alpha) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.filter = `blur(${Math.max(6, blurPx)}px)`;
  ctx.globalAlpha = alpha;
  fillQuad(ctx, corners, color);
  ctx.restore();
}

function expandQuad(corners, pad) {
  const c = centroid(corners);
  return corners.map((p) => {
    const dx = p.x - c.x;
    const dy = p.y - c.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: p.x + (dx / len) * pad, y: p.y + (dy / len) * pad };
  });
}

function drawNightGrade(ctx, w, h) {
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = "#1a2744";
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(2, 6, 18, 0.45)";
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function drawFace(ctx, layer, { night, illumination, opacity }) {
  ctx.save();
  ctx.globalAlpha = opacity;
  if (!night) {
    ctx.drawImage(layer, 0, 0);
    ctx.restore();
    return;
  }
  if (illumination === "halo-lit") {
    ctx.filter = "brightness(0.32) saturate(0.75)";
    ctx.drawImage(layer, 0, 0);
  } else if (illumination === "face-lit") {
    const glow = tintLayer(layer, "#fff3d4");
    ctx.filter = "brightness(1.2) saturate(1.05)";
    ctx.drawImage(layer, 0, 0);
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.78 * opacity;
    ctx.filter = "none";
    ctx.drawImage(glow, 0, 0);
  } else if (illumination === "internal") {
    const glow = tintLayer(layer, "#e7f1ff");
    ctx.filter = "brightness(1.25)";
    ctx.drawImage(layer, 0, 0);
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.82 * opacity;
    ctx.filter = "none";
    ctx.drawImage(glow, 0, 0);
  } else if (illumination === "neon") {
    ctx.filter = "brightness(0.18)";
    ctx.drawImage(layer, 0, 0);
  } else {
    ctx.drawImage(layer, 0, 0);
  }
  ctx.restore();
}

function racewayQuad(corners, ppi) {
  const h = (edgeLen(corners[0], corners[3]) + edgeLen(corners[1], corners[2])) / 2;
  const raceH = ppi ? Math.min(h * 0.5, depthPixels(corners, ppi, 8)) : h * 0.3;
  const span = Math.min(0.46, (raceH / h) / 2);
  const v0 = 0.5 - span;
  const v1 = 0.5 + span;
  return [
    bilinearQuad(-0.04, v0, corners),
    bilinearQuad(1.04, v0, corners),
    bilinearQuad(1.04, v1, corners),
    bilinearQuad(-0.04, v1, corners),
  ];
}

function drawChannel(ctx, opts, layer, colors) {
  const { corners, ppi, night, illumination, opacity, neonColor } = opts;
  const depth = depthPixels(corners, ppi, DEPTH_IN["channel-letters"]);
  const offset = extrusionOffset(corners, depth);
  const race = racewayQuad(corners, ppi);
  const raceFront = shiftQuad(race, offset, 0.62);
  drawBox(ctx, raceFront, scaleOffset(offset, 0.38), colors.racewayFace, colors.racewayReturns);
  drawContactShadow(ctx, layer, offset);
  if (night) paintSpill(ctx, layer, corners, offset, illumination, neonColor);
  if (illumination === "halo-lit") drawStandoffs(ctx, corners, offset, ppi, colors);
  drawAlphaReturns(ctx, layer, scaleOffset(offset, 0.62), 6);
  drawFace(ctx, layer, { night, illumination, opacity });
  if (night && illumination === "neon") drawNeonCore(ctx, layer, neonColor, opacity);
}

function drawLightbox(ctx, opts, colors, subdiv) {
  const { corners, ppi, night, illumination, opacity, neonColor, sign, w, h } = opts;
  const depth = depthPixels(corners, ppi, DEPTH_IN.lightbox);
  const offset = extrusionOffset(corners, depth);
  const faceCorners = insetQuad(corners, 0.07, 0.1, 0.93, 0.9);
  const faceLayer = warpToLayer(sign, faceCorners, w, h, subdiv);
  if (night) {
    const spill = SPILL[illumination] || SPILL["face-lit"];
    const color = illumination === "neon" ? neonColor : spill.color;
    const pool = shiftQuad(expandQuad(corners, depth * 0.45), offset, spill.shift * 0.5);
    drawQuadSpill(ctx, pool, color, Math.max(w, h) * spill.blur, spill.alpha);
  }
  drawBox(ctx, corners, offset, colors.trim, colors.returns);
  strokeQuad(ctx, corners, night ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.55)", Math.max(1, depth * 0.04));
  if (night && (illumination === "internal" || illumination === "face-lit")) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    fillQuad(ctx, faceCorners, illumination === "internal" ? "rgba(214, 230, 255, 0.92)" : "rgba(255, 236, 205, 0.55)");
    ctx.restore();
  }
  if (night && illumination === "halo-lit") {
    drawStandoffs(ctx, corners, offset, ppi, colors);
    drawSpill(ctx, faceLayer, "#fff1cc", Math.max(w, h) * 0.04, 0.7, offset.x * 0.85, offset.y * 0.85);
  }
  drawFace(ctx, faceLayer, { night, illumination, opacity });
  if (night && illumination === "neon") drawNeonCore(ctx, faceLayer, neonColor, opacity);
  strokeQuad(ctx, faceCorners, night ? "#1b2127" : "#2c343c", Math.max(2, depth * 0.05));
}

function drawBlade(ctx, opts, layer, colors) {
  const { corners, ppi, night, illumination, opacity, neonColor } = opts;
  const depth = depthPixels(corners, ppi, DEPTH_IN.blade);
  const offset = extrusionOffset(corners, depth);
  const plate = insetQuad(corners, -0.075, 0.4, -0.012, 0.6);
  const plateFront = shiftQuad(plate, offset, 0.72);
  drawBox(ctx, plateFront, scaleOffset(offset, 0.28), colors.plate, colors.returns);
  drawContactShadow(ctx, layer, offset);
  if (night) paintSpill(ctx, layer, corners, offset, illumination, neonColor);
  drawBox(ctx, corners, scaleOffset(offset, 0.7), null, colors.returns);
  drawFace(ctx, layer, { night, illumination, opacity });
  if (night && illumination === "neon") drawNeonCore(ctx, layer, neonColor, opacity);
  strokeQuad(ctx, corners, night ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.4)", Math.max(1, depth * 0.035));
}

function drawFlatPanel(ctx, opts, layer, colors) {
  const { corners, ppi, night, illumination, opacity, neonColor } = opts;
  const depth = depthPixels(corners, ppi, DEPTH_IN["flat-panel"]);
  const offset = extrusionOffset(corners, depth);
  drawContactShadow(ctx, layer, offset);
  drawStandoffs(ctx, corners, offset, ppi, colors);
  if (night) paintSpill(ctx, layer, corners, offset, illumination, neonColor);
  drawAlphaReturns(ctx, layer, offset, 3);
  drawBox(ctx, corners, scaleOffset(offset, 0.35), null, colors.returns);
  drawFace(ctx, layer, { night, illumination, opacity });
  if (night && illumination === "neon") drawNeonCore(ctx, layer, neonColor, opacity);
}

function paintSpill(ctx, layer, corners, offset, illumination, neonColor) {
  const spill = SPILL[illumination] || SPILL["face-lit"];
  const color = illumination === "neon" ? neonColor : spill.color;
  const blur = Math.max(layer.width, layer.height) * spill.blur;
  const pool = shiftQuad(expandQuad(corners, blur * 0.35), offset, spill.shift);
  drawQuadSpill(ctx, pool, color, blur, spill.alpha * 0.85);
  drawSpill(ctx, layer, color, blur, spill.alpha, offset.x * spill.shift, offset.y * spill.shift);
  drawSpill(ctx, layer, color, blur * 0.35, spill.core, offset.x * spill.shift * 0.35, offset.y * spill.shift * 0.35);
}

function drawNeonCore(ctx, layer, neonColor, opacity) {
  const tinted = tintLayer(layer, neonColor);
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = 0.95 * opacity;
  ctx.filter = "blur(1.2px)";
  ctx.drawImage(tinted, 0, 0);
  ctx.globalAlpha = 0.55 * opacity;
  ctx.filter = "blur(8px)";
  ctx.drawImage(tinted, 0, 0);
  ctx.restore();
}

/**
 * Render the in-situ composite. Corners are in the original photo's pixels.
 * Returns a canvas (possibly scaled down to maxEdge).
 */
export function renderScene(opts) {
  const photoW = opts.photoW;
  const photoH = opts.photoH;
  if (!opts.photo || !photoW || !photoH) return null;
  const maxEdge = opts.maxEdge || 1600;
  const s = Math.min(1, maxEdge / Math.max(photoW, photoH));
  const w = Math.max(1, Math.round(photoW * s));
  const h = Math.max(1, Math.round(photoH * s));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(opts.photo, 0, 0, w, h);
  if (opts.night) drawNightGrade(ctx, w, h);
  if (!opts.sign || !opts.corners || opts.corners.length !== 4) return canvas;

  const corners = opts.corners.map((p) => scalePoint(p, s));
  const ppi = opts.ppi ? opts.ppi * s : null;
  const signType = DEPTH_IN[opts.signType] ? opts.signType : "channel-letters";
  const illumination = SPILL[opts.illumination] ? opts.illumination : "face-lit";
  const neonColor = /^#[0-9a-fA-F]{6}$/.test(opts.neonColor || "") ? opts.neonColor : "#ff3b30";
  const subdiv = opts.subdiv || 16;
  const colors = palette(!!opts.night);
  const shared = {
    corners,
    ppi,
    night: !!opts.night,
    illumination,
    opacity: Number.isFinite(opts.opacity) ? opts.opacity : 1,
    neonColor,
    sign: opts.sign,
    w,
    h,
  };

  if (signType === "lightbox") {
    drawLightbox(ctx, shared, colors, subdiv);
    return canvas;
  }

  const layer = warpToLayer(opts.sign, corners, w, h, subdiv);
  if (signType === "channel-letters") drawChannel(ctx, shared, layer, colors);
  else if (signType === "blade") drawBlade(ctx, shared, layer, colors);
  else drawFlatPanel(ctx, shared, layer, colors);
  return canvas;
}
