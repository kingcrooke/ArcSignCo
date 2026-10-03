(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const canvas = $("viewCanvas");
  const ctx = canvas.getContext("2d", { alpha: false });
  const host = $("canvasHost");
  const DISCLAIMER = "Concept only – not a shop drawing.";

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
    timeOfDay: "day",
    illumination: "none",
    signType: "channelLetters",
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

  function edgeLen(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function formatFtIn(totalInches) {
    if (!Number.isFinite(totalInches) || totalInches <= 0) return "—";
    const feet = Math.floor(totalInches / 12);
    let inches = totalInches - feet * 12;
    inches = Math.round(inches * 8) / 8;
    if (inches >= 12) {
      return `${feet + 1} ft 0 in`;
    }
    const inchStr = inches % 1 === 0 ? String(inches) : inches.toFixed(2).replace(/\.?0+$/, "");
    if (feet > 0) return `${feet} ft ${inchStr} in`;
    return `${inchStr} in`;
  }

  function getSignDimensionsInches() {
    if (!state.ppi || !state.signCorners) return null;
    const c = state.signCorners;
    const widthIn = ((edgeLen(c[0], c[1]) + edgeLen(c[3], c[2])) / 2) / state.ppi;
    const heightIn = ((edgeLen(c[0], c[3]) + edgeLen(c[1], c[2])) / 2) / state.ppi;
    return { widthIn, heightIn };
  }

  function updateDimReadout() {
    const box = $("dimReadout");
    if (!state.ppi || !state.signCorners || !state.calApplied) {
      box.hidden = true;
      updateEstimate();
      return;
    }
    const dims = getSignDimensionsInches();
    $("dimText").textContent = `Sign size ~ ${formatFtIn(dims.widthIn)} wide x ${formatFtIn(dims.heightIn)} tall`;
    box.hidden = false;
    updateEstimate();
  }

  function updateEstimate() {
    const box = $("estimateBox");
    const dims = getSignDimensionsInches();
    if (!dims || !state.calApplied) {
      box.hidden = true;
      return;
    }
    const illum = state.timeOfDay === "night" ? state.illumination : "none";
    const est = window.computeArcPreliminaryEstimate(state.signType, illum, dims.widthIn, dims.heightIn);
    if (!est) {
      box.hidden = true;
      return;
    }
    const cfg = window.ARC_SIGN_MOCKUP_PRICING;
    $("estimateText").textContent = `${est.label}: $${est.low.toLocaleString()} – $${est.high.toLocaleString()} ${cfg.currency}`;
    $("estimateDisclaimer").textContent = `${est.detail}. ${cfg.estimateDisclaimer}`;
    box.hidden = false;
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
    window.ArcSignRender.drawMockupScene(ctx, {
      photo: state.photo,
      photoW: state.photoW,
      photoH: state.photoH,
      sign: state.sign,
      signCorners: state.signCorners,
      signOpacity: state.signOpacity,
      timeOfDay: state.timeOfDay,
      illumination: state.illumination,
      signType: state.signType,
      calLine: state.calLine,
      showHandles: !!(state.signCorners && state.sign),
      handleRadius: HANDLE_R,
      viewScale: state.scale,
    });
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

  function setTimeOfDay(tod) {
    state.timeOfDay = tod;
    $("dayBtn").classList.toggle("active", tod === "day");
    $("nightBtn").classList.toggle("active", tod === "night");
    $("illumField").style.opacity = tod === "night" ? "1" : "0.55";
    if (tod === "day") {
      state.illumination = "none";
      $("illumination").value = "none";
    }
    updateEstimate();
    draw();
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
    enableExports();
    updateDimReadout();
    setMode(state.sign ? "sign" : "pan");
  }

  function enableExports() {
    const ok = !!state.photo;
    $("exportPdfBtn").disabled = !ok;
    $("shareProofBtn").disabled = !ok || !state.sign;
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
      enableExports();
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
      enableExports();
      updateDimReadout();
      setMode("sign");
      setHint("Drag each corner handle to match the storefront plane.");
      draw();
    } catch (err) {
      alert(err.message || "Could not open sign image.");
    }
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

  function signTypeLabel() {
    return window.ARC_SIGN_MOCKUP_PRICING.signTypes[state.signType]?.label || state.signType;
  }

  function illuminationLabel() {
    const key = state.timeOfDay === "night" ? state.illumination : "none";
    return window.ARC_SIGN_MOCKUP_PRICING.illumination[key]?.label || "Non-illuminated";
  }

  function dataUrlFormat(dataUrl) {
    return dataUrl && dataUrl.indexOf("image/png") >= 0 ? "PNG" : "JPEG";
  }

  function addImageFit(doc, imgData, x, y, maxW, maxH) {
    const img = new Image();
    const fmt = dataUrlFormat(imgData);
    return new Promise((resolve) => {
      img.onload = () => {
        const aspect = img.width / img.height;
        let drawW = maxW;
        let drawH = drawW / aspect;
        if (drawH > maxH) {
          drawH = maxH;
          drawW = drawH * aspect;
        }
        doc.addImage(imgData, fmt, x + (maxW - drawW) / 2, y, drawW, drawH);
        resolve(drawH);
      };
      img.src = imgData;
    });
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
    const cfg = window.ARC_SIGN_MOCKUP_PRICING;

    function drawHeader() {
      doc.setFillColor(11, 29, 51);
      doc.rect(0, 0, pageW, 72, "F");
      doc.addImage(logoData, "PNG", margin, 14, 140, 29);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.text("Storefront sign concept proof", pageW - margin, 28, { align: "right" });
      doc.text(`${cfg.contact.site}  ·  ${cfg.contact.phone}`, pageW - margin, 44, { align: "right" });
      doc.text(`${cfg.contact.emailPrimary}  ·  ${cfg.contact.emailStudio}`, pageW - margin, 58, { align: "right" });
    }

    drawHeader();
    const dayCanvas = window.ArcSignRender.renderCompositeCanvas(state, { timeOfDay: "day", illumination: "none" });
    const dayData = dayCanvas.toDataURL("image/jpeg", 0.9);
    const maxImgW = (pageW - margin * 2 - 12) / 2;
    const maxImgH = pageH - 210;
    const dayH = await addImageFit(doc, dayData, margin, 88, maxImgW, maxImgH);

    const nightCanvas = window.ArcSignRender.renderCompositeCanvas(state, {
      timeOfDay: "night",
      illumination: state.timeOfDay === "night" ? state.illumination : "face",
    });
    const nightData = nightCanvas.toDataURL("image/jpeg", 0.9);
    await addImageFit(doc, nightData, margin + maxImgW + 12, 88, maxImgW, maxImgH);

    doc.setFontSize(9);
    doc.setTextColor(101, 114, 135);
    doc.text("Day view", margin, 82);
    doc.text(`Night view (${illuminationLabel()})`, margin + maxImgW + 12, 82);

    let y = 88 + Math.max(dayH, maxImgH) + 18;
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
    doc.text(`Sign type: ${signTypeLabel()}`, margin, y);
    y += 16;
    if (dims && state.calApplied) {
      doc.text(
        `Approximate sign size: ${formatFtIn(dims.widthIn)} wide x ${formatFtIn(dims.heightIn)} tall (from photo calibration)`,
        margin,
        y
      );
      y += 16;
    }
    const est = dims && state.calApplied
      ? window.computeArcPreliminaryEstimate(state.signType, state.timeOfDay === "night" ? state.illumination : "none", dims.widthIn, dims.heightIn)
      : null;
    if (est) {
      doc.text(
        `${est.label}: $${est.low.toLocaleString()} – $${est.high.toLocaleString()} ${cfg.currency}`,
        margin,
        y
      );
      y += 16;
    }

    doc.setFontSize(10);
    doc.setTextColor(101, 114, 135);
    doc.text(DISCLAIMER, margin, y + 4);

    if (state.sign) {
      doc.addPage();
      drawHeader();
      doc.setTextColor(23, 34, 51);
      doc.setFontSize(12);
      doc.text("Fabrication artwork (undistorted — not warped to the photo)", margin, 88);
      const fab = window.ArcSignRender.renderFabSourceCanvas(state.sign);
      const fabData = fab.toDataURL("image/png");
      await addImageFit(doc, fabData, margin, 100, pageW - margin * 2, pageH - 140);
      doc.setFontSize(10);
      doc.setTextColor(101, 114, 135);
      doc.text(DISCLAIMER, margin, pageH - 36);
    }

    doc.save(`arc-sign-mockup-${dateStr.replace(/\s+/g, "-")}.pdf`);
  }

  async function createShareProof() {
    if (!state.photo || !state.sign) return;
    $("shareProofBtn").disabled = true;
    $("shareStatus").hidden = false;
    $("shareStatus").textContent = "Uploading compressed preview for client review…";
    $("shareStatus").className = "status";

    const dims = getSignDimensionsInches();
    const illum = state.timeOfDay === "night" ? state.illumination : "none";
    const estimate = dims && state.calApplied
      ? window.computeArcPreliminaryEstimate(state.signType, illum, dims.widthIn, dims.heightIn)
      : null;

    const dayCanvas = window.ArcSignRender.renderCompositeCanvas(state, { timeOfDay: "day", illumination: "none" });
    const nightCanvas = window.ArcSignRender.renderCompositeCanvas(state, {
      timeOfDay: "night",
      illumination: state.timeOfDay === "night" ? state.illumination : "face",
    });
    const fabCanvas = window.ArcSignRender.renderFabSourceCanvas(state.sign);

    const payload = {
      projectName: $("projectName").value.trim(),
      signType: state.signType,
      signTypeLabel: signTypeLabel(),
      illumination: illum,
      illuminationLabel: window.ARC_SIGN_MOCKUP_PRICING.illumination[illum]?.label || "Non-illuminated",
      dimensions: dims,
      dimensionsText: dims
        ? `${formatFtIn(dims.widthIn)} wide × ${formatFtIn(dims.heightIn)} tall`
        : null,
      estimate,
      disclaimer: DISCLAIMER,
      images: {
        day: window.ArcSignRender.resizeCanvasToMax(dayCanvas, 1400),
        night: window.ArcSignRender.resizeCanvasToMax(nightCanvas, 1400),
        fab: window.ArcSignRender.resizeCanvasToMax(fabCanvas, 1200),
      },
    };

    try {
      const resp = await fetch("/api/sign-mockup/proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Could not create link.");
      const fullUrl = new URL(data.proofUrl, window.location.origin).href;
      $("shareLink").value = fullUrl;
      $("shareLinkWrap").hidden = false;
      $("shareStatus").textContent = "Link ready — send to your client for comment or approval.";
      $("shareStatus").className = "status ok";
    } catch (err) {
      $("shareStatus").textContent = err.message || "Share failed.";
      $("shareStatus").className = "status";
    } finally {
      $("shareProofBtn").disabled = false;
    }
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

  function pointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX ?? e.touches?.[0]?.clientX;
    const cy = e.clientY ?? e.touches?.[0]?.clientY;
    return { x: cx - rect.left, y: cy - rect.top };
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

  $("signType").addEventListener("change", () => {
    state.signType = $("signType").value;
    updateEstimate();
    draw();
  });

  $("illumination").addEventListener("change", () => {
    state.illumination = $("illumination").value;
    if (state.timeOfDay === "night") updateEstimate();
    draw();
  });

  $("dayBtn").addEventListener("click", () => setTimeOfDay("day"));
  $("nightBtn").addEventListener("click", () => setTimeOfDay("night"));

  $("exportPdfBtn").addEventListener("click", () => exportPdf().catch((err) => alert(err.message || "PDF export failed.")));
  $("shareProofBtn").addEventListener("click", () => createShareProof());
  $("copyLinkBtn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($("shareLink").value);
      $("shareStatus").textContent = "Link copied.";
      $("shareStatus").className = "status ok";
    } catch {
      $("shareLink").select();
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
