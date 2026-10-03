(function () {
  "use strict";

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
  };

  const HANDLE_R = 14;
  const SIGN_SUBDIV = 28;

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

  function worldToScreen(wx, wy) {
    return {
      x: wx * state.scale + state.panX,
      y: wy * state.scale + state.panY,
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
    const w = state.photoW * 0.35;
    const h = w * (state.signH / state.signW || 0.25);
    return [
      { x: cx - w / 2, y: cy - h / 2 },
      { x: cx + w / 2, y: cy - h / 2 },
      { x: cx + w / 2, y: cy + h / 2 },
      { x: cx - w / 2, y: cy + h / 2 },
    ];
  }

  function bilinearQuad(u, v, corners) {
    const [tl, tr, br, bl] = corners;
    const x =
      (1 - u) * (1 - v) * tl.x +
      u * (1 - v) * tr.x +
      u * v * br.x +
      (1 - u) * v * bl.x;
    const y =
      (1 - u) * (1 - v) * tl.y +
      u * (1 - v) * tr.y +
      u * v * br.y +
      (1 - u) * v * bl.y;
    return { x, y };
  }

  function drawImageTriangle(ctx, img, sx0, sy0, sx1, sy1, sx2, sy2, dx0, dy0, dx1, dy1, dx2, dy2) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(dx0, dy0);
    ctx.lineTo(dx1, dy1);
    ctx.lineTo(dx2, dy2);
    ctx.closePath();
    ctx.clip();
    const denom = (sx0 * (sy1 - sy2) + sx1 * (sy2 - sy0) + sx2 * (sy0 - sy1));
    if (Math.abs(denom) < 1e-6) {
      ctx.restore();
      return;
    }
    const m11 = (dx0 * (sy1 - sy2) + dx1 * (sy2 - sy0) + dx2 * (sy0 - sy1)) / denom;
    const m12 = (dx0 * (sx2 - sx1) + dx1 * (sx0 - sx2) + dx2 * (sx1 - sx0)) / denom;
    const m21 = (dy0 * (sy1 - sy2) + dy1 * (sy2 - sy0) + dy2 * (sy0 - sy1)) / denom;
    const m22 = (dy0 * (sx2 - sx1) + dy1 * (sx0 - sx2) + dy2 * (sx1 - sx0)) / denom;
    const dx = (dx0 * (sx1 * sy2 - sx2 * sy1) + dx1 * (sx2 * sy0 - sx0 * sy2) + dx2 * (sx0 * sy1 - sx1 * sy0)) / denom;
    const dy = (dy0 * (sx1 * sy2 - sx2 * sy1) + dy1 * (sx2 * sy0 - sx0 * sy2) + dy2 * (sx0 * sy1 - sx1 * sy0)) / denom;
    ctx.setTransform(m11, m21, m12, m22, dx, dy);
    ctx.drawImage(img, 0, 0);
    ctx.restore();
  }

  function drawWarpedSign(ctx, img, corners, opacity) {
    const sw = img.width;
    const sh = img.height;
    const n = SIGN_SUBDIV;
    ctx.save();
    ctx.globalAlpha = opacity;
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
    ctx.restore();
  }

  function edgeLen(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function formatFtIn(totalInches) {
    if (!Number.isFinite(totalInches) || totalInches <= 0) return "—";
    const feet = Math.floor(totalInches / 12);
    let inches = totalInches - feet * 12;
    inches = Math.round(inches * 8) / 8;
    if (inches >= 12) {
      return `${feet + 1}′ 0″`;
    }
    const inchStr = inches % 1 === 0 ? String(inches) : inches.toFixed(2).replace(/\.?0+$/, "");
    if (feet > 0) return `${feet}′ ${inchStr}″`;
    return `${inchStr}″`;
  }

  function updateDimReadout() {
    const box = $("dimReadout");
    if (!state.ppi || !state.signCorners || !state.calApplied) {
      box.hidden = true;
      return;
    }
    const c = state.signCorners;
    const topPx = edgeLen(c[0], c[1]);
    const bottomPx = edgeLen(c[3], c[2]);
    const leftPx = edgeLen(c[0], c[3]);
    const rightPx = edgeLen(c[1], c[2]);
    const widthIn = ((topPx + bottomPx) / 2) / state.ppi;
    const heightIn = ((leftPx + rightPx) / 2) / state.ppi;
    $("dimText").textContent = `Sign size ≈ ${formatFtIn(widthIn)} wide × ${formatFtIn(heightIn)} tall`;
    box.hidden = false;
  }

  function getSignDimensionsInches() {
    if (!state.ppi || !state.signCorners) return null;
    const c = state.signCorners;
    const widthIn = ((edgeLen(c[0], c[1]) + edgeLen(c[3], c[2])) / 2) / state.ppi;
    const heightIn = ((edgeLen(c[0], c[3]) + edgeLen(c[1], c[2])) / 2) / state.ppi;
    return { widthIn, heightIn };
  }

  function draw() {
    const dpr = state.dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const vw = canvas.width / dpr;
    const vh = canvas.height / dpr;
    ctx.fillStyle = "#e8ecf2";
    ctx.fillRect(0, 0, vw, vh);

    if (!state.photo) return;

    ctx.save();
    ctx.translate(state.panX, state.panY);
    ctx.scale(state.scale, state.scale);
    ctx.drawImage(state.photo, 0, 0, state.photoW, state.photoH);

    if (state.sign && state.signCorners) {
      drawWarpedSign(ctx, state.sign, state.signCorners, state.signOpacity);
    }

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
      pan: "Pan & zoom (drag empty area; pinch on mobile)",
      calibrate: "Calibration: tap two points on a known dimension",
      sign: "Drag corner handles to place the sign",
    };
    $("modeLabel").textContent = labels[mode] || "";
  }

  function readRealInches() {
    if ($("lengthMode").value === "in") {
      return parseFloat($("calInchesOnly").value) || 0;
    }
    const ft = parseFloat($("calFeet").value) || 0;
    const inch = parseFloat($("calInches").value) || 0;
    return ft * 12 + inch;
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
    $("calStatus").textContent = `Calibrated: ${state.ppi.toFixed(2)} px per inch along this line.`;
    $("calStatus").className = "status ok";
    $("exportPdfBtn").disabled = !state.photo;
    updateDimReadout();
    setMode(state.sign ? "sign" : "pan");
  }

  async function fileToImage(file) {
    let blob = file;
    const name = (file.name || "").toLowerCase();
    const isHeic =
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      name.endsWith(".heic") ||
      name.endsWith(".heif");
    if (isHeic) {
      if (typeof heic2any !== "function") {
        throw new Error("HEIC not supported in this browser. Export as JPG or PNG.");
      }
      const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
      blob = Array.isArray(converted) ? converted[0] : converted;
    }
    const url = URL.createObjectURL(blob);
    try {
      const img = await loadImageElement(url);
      return img;
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
      $("calibrateBtn").disabled = false;
      $("clearCalBtn").disabled = false;
      $("applyCalBtn").disabled = false;
      $("calStatus").textContent = "Draw a calibration line, then apply.";
      $("calStatus").className = "status";
      setHint("Drag to pan. Use calibration before placing a sign for real-world size.");
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
      $("resetSignBtn").disabled = false;
      $("exportPdfBtn").disabled = !state.photo;
      updateDimReadout();
      setMode("sign");
      setHint("Drag each corner handle to match the storefront plane.");
      draw();
    } catch (err) {
      alert(err.message || "Could not open sign image.");
    }
  }

  function renderCompositeCanvas() {
    const c = document.createElement("canvas");
    c.width = state.photoW;
    c.height = state.photoH;
    const g = c.getContext("2d");
    g.drawImage(state.photo, 0, 0);
    if (state.sign && state.signCorners) {
      drawWarpedSign(g, state.sign, state.signCorners, state.signOpacity);
    }
    return c;
  }

  async function loadLogoDataUrl() {
    const resp = await fetch("/assets/img/logo-lockup-white-560.v2.png");
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    try {
      const img = await loadImageElement(url);
      const lc = document.createElement("canvas");
      const maxW = 280;
      const scale = maxW / img.naturalWidth;
      lc.width = Math.round(img.naturalWidth * scale);
      lc.height = Math.round(img.naturalHeight * scale);
      lc.getContext("2d").drawImage(img, 0, 0, lc.width, lc.height);
      return lc.toDataURL("image/png");
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function exportPdf() {
    if (!state.photo || !window.jspdf?.jsPDF) {
      alert("PDF library not loaded.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "letter" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 40;
    const logoData = await loadLogoDataUrl();
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const project = $("projectName").value.trim();
    const dims = getSignDimensionsInches();

    doc.setFillColor(11, 29, 51);
    doc.rect(0, 0, pageW, 72, "F");
    doc.addImage(logoData, "PNG", margin, 14, 140, 29);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text("Storefront sign concept proof", pageW - margin, 28, { align: "right" });
    doc.text("arcsignco.com  ·  (347) 450-2110", pageW - margin, 44, { align: "right" });

    const comp = renderCompositeCanvas();
    const imgData = comp.toDataURL("image/jpeg", 0.92);
    const maxImgW = pageW - margin * 2;
    const maxImgH = pageH - 200;
    const aspect = comp.width / comp.height;
    let drawW = maxImgW;
    let drawH = drawW / aspect;
    if (drawH > maxImgH) {
      drawH = maxImgH;
      drawW = drawH * aspect;
    }
    const imgX = margin + (maxImgW - drawW) / 2;
    const imgY = 88;
    doc.addImage(imgData, "JPEG", imgX, imgY, drawW, drawH);

    let y = imgY + drawH + 22;
    doc.setTextColor(23, 34, 51);
    doc.setFontSize(12);
    if (project) {
      doc.setFont(undefined, "bold");
      doc.text(`Project: ${project}`, margin, y);
      doc.setFont(undefined, "normal");
      y += 16;
    }
    doc.text(`Date: ${dateStr}`, margin, y);
    y += 16;
    if (dims && state.calApplied) {
      doc.text(
        `Approximate sign size: ${formatFtIn(dims.widthIn)} wide × ${formatFtIn(dims.heightIn)} tall (from photo calibration)`,
        margin,
        y
      );
      y += 16;
    } else {
      doc.text("Sign size: not calibrated — draw a scale line on the photo for approximate dimensions.", margin, y);
      y += 16;
    }

    doc.setFontSize(10);
    doc.setTextColor(101, 114, 135);
    const disclaimer =
      "Concept only, not to scale for fabrication.";
    const lines = doc.splitTextToSize(disclaimer, pageW - margin * 2);
    doc.text(lines, margin, y + 8);

    doc.save(`arc-sign-mockup-${dateStr.replace(/\s+/g, "-")}.pdf`);
  }

  function onPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    const sp = pointerPos(e);
    const w = screenToWorld(sp.x, sp.y);

    if (state.mode === "calibrate") {
      if (!state.calLine) {
        state.calLine = { a: w, b: w };
      } else if (!state.calLine.b || dist(state.calLine.a, state.calLine.b) < 1) {
        state.calLine.b = w;
      } else {
        state.calLine = { a: w, b: w };
      }
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
    state.drag = null;
    host.classList.remove("panning");
    if (state.mode === "calibrate" && state.calLine && dist(state.calLine.a, state.calLine.b) > 2) {
      $("calStatus").textContent = "Line drawn. Enter real length and tap Apply calibration.";
    }
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
    draw();
  });

  $("resetSignBtn").addEventListener("click", () => {
    if (state.sign) state.signCorners = defaultSignCorners();
    updateDimReadout();
    draw();
  });

  $("exportPdfBtn").addEventListener("click", () => exportPdf().catch((err) => alert(err.message || "PDF export failed.")));

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

  let pinch = null;
  host.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length === 2) {
        const d = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const rect = canvas.getBoundingClientRect();
        const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
        const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
        pinch = { d, cx, cy, world: screenToWorld(cx, cy), scale: state.scale };
        e.preventDefault();
      }
    },
    { passive: false }
  );
  host.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length === 2 && pinch) {
        const d = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = d / pinch.d;
        state.scale = pinch.scale * factor;
        state.panX = pinch.cx - pinch.world.x * state.scale;
        state.panY = pinch.cy - pinch.world.y * state.scale;
        $("zoomLabel").textContent = Math.round(state.scale * 100) + "%";
        draw();
        e.preventDefault();
      }
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
  resizeCanvas();
})();
