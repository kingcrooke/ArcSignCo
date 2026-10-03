(function (global) {
  "use strict";

  const SIGN_SUBDIV = 28;

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
      (dx0 * (sx1 * sy2 - sx2 * sy1) + dx1 * (sx2 * sy0 - sx0 * sy2) + dx2 * (sx0 * sy1 - sx1 * sy0)) /
      denom;
    const dy =
      (dy0 * (sx1 * sy2 - sx2 * sy1) + dy1 * (sx2 * sy0 - sx0 * sy2) + dy2 * (sx0 * sy1 - sx1 * sy0)) /
      denom;
    ctx.setTransform(m11, m21, m12, m22, dx, dy);
    ctx.drawImage(img, 0, 0);
    ctx.restore();
  }

  function drawWarpedSign(ctx, img, corners, opacity, tintFn) {
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
        if (tintFn) tintFn(ctx, u0, v0, u1, v1);
        drawImageTriangle(ctx, img, sx0, sy0, sx1, sy0, sx1, sy1, p00.x, p00.y, p10.x, p10.y, p11.x, p11.y);
        drawImageTriangle(ctx, img, sx0, sy0, sx1, sy1, sx0, sy1, p00.x, p00.y, p11.x, p11.y, p01.x, p01.y);
      }
    }
    ctx.restore();
  }

  function drawWarpedSolidQuad(ctx, corners, fillStyle, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.moveTo(corners[0].x, corners[0].y);
    for (let i = 1; i < 4; i++) ctx.lineTo(corners[i].x, corners[i].y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function offsetCorners(corners, dx, dy) {
    return corners.map((p) => ({ x: p.x + dx, y: p.y + dy }));
  }

  function quadCenter(corners) {
    let x = 0;
    let y = 0;
    for (const p of corners) {
      x += p.x;
      y += p.y;
    }
    return { x: x / 4, y: y / 4 };
  }

  function scaleCornersFromCenter(corners, scale) {
    const c = quadCenter(corners);
    return corners.map((p) => ({
      x: c.x + (p.x - c.x) * scale,
      y: c.y + (p.y - c.y) * scale,
    }));
  }

  function drawNightPhoto(ctx, photo, w, h) {
    ctx.drawImage(photo, 0, 0, w, h);
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = "rgb(35, 45, 75)";
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(0, 8, 24, 0.45)";
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  function drawWallSpill(ctx, corners, color, radiusMul) {
    const c = quadCenter(corners);
    const w = Math.hypot(corners[1].x - corners[0].x, corners[1].y - corners[0].y);
    const r = w * (radiusMul || 0.85);
    const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r);
    g.addColorStop(0, color);
    g.addColorStop(0.45, "rgba(255, 220, 160, 0.12)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = g;
    ctx.fillRect(c.x - r, c.y - r, r * 2, r * 2);
    ctx.restore();
  }

  function drawHaloGlow(ctx, img, corners, color, blurScale) {
    const expanded = scaleCornersFromCenter(corners, 1.06 + (blurScale || 0));
    ctx.save();
    ctx.filter = `blur(${8 + (blurScale || 0) * 12}px)`;
    drawWarpedSolidQuad(ctx, expanded, color, 0.55);
    drawWarpedSign(ctx, img, expanded, 0.35);
    ctx.restore();
  }

  function drawReturns(ctx, img, corners, depthPx) {
    const layers = 4;
    for (let i = layers; i >= 1; i--) {
      const off = (depthPx * i) / layers;
      const shade = 0.15 + (i / layers) * 0.35;
      ctx.save();
      ctx.globalAlpha = shade;
      drawWarpedSign(ctx, img, offsetCorners(corners, off * 0.6, off), 0.9);
      ctx.restore();
    }
  }

  function drawRaceway(ctx, corners) {
    const bottom = [corners[3], corners[2]];
    const midY = (bottom[0].y + bottom[1].y) / 2;
    const raceway = [
      { x: corners[3].x, y: corners[3].y + 6 },
      { x: corners[2].x, y: corners[2].y + 6 },
      { x: corners[2].x, y: midY + 22 },
      { x: corners[3].x, y: midY + 22 },
    ];
    drawWarpedSolidQuad(ctx, raceway, "#1a1f28", 0.92);
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(raceway[0].x, raceway[0].y);
    for (let i = 1; i < 4; i++) ctx.lineTo(raceway[i].x, raceway[i].y);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  function drawStandoffs(ctx, corners) {
    const r = 5;
    for (const p of corners) {
      ctx.save();
      ctx.fillStyle = "#8a919c";
      ctx.strokeStyle = "#3d4654";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.arc(p.x - 1.5, p.y - 1.5, r * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawBladeDepth(ctx, corners) {
    const depth = 14;
    const side = [
      corners[0],
      corners[3],
      { x: corners[3].x - depth, y: corners[3].y + depth * 0.35 },
      { x: corners[0].x - depth, y: corners[0].y + depth * 0.35 },
    ];
    drawWarpedSolidQuad(ctx, side, "#2a3340", 0.88);
  }

  function drawLightboxCabinet(ctx, corners) {
    const inset = scaleCornersFromCenter(corners, 1.04);
    drawWarpedSolidQuad(ctx, inset, "#0f141c", 0.95);
    ctx.save();
    ctx.strokeStyle = "rgba(212, 168, 67, 0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(inset[0].x, inset[0].y);
    for (let i = 1; i < 4; i++) ctx.lineTo(inset[i].x, inset[i].y);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  function illuminationFaceOpacity(mode, timeOfDay) {
    if (timeOfDay === "day") return { face: 0.88, spill: false };
    switch (mode) {
      case "face":
        return { face: 1, spill: true, spillColor: "rgba(255, 240, 200, 0.55)" };
      case "halo":
        return { face: 0.42, spill: true, spillColor: "rgba(255, 220, 160, 0.45)" };
      case "internal":
        return { face: 0.95, spill: true, spillColor: "rgba(255, 255, 240, 0.5)" };
      case "neon":
        return { face: 0.75, spill: true, spillColor: "rgba(255, 100, 180, 0.5)" };
      default:
        return { face: 0.85, spill: false };
    }
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} opts
   */
  function drawMockupScene(ctx, opts) {
    const {
      photo,
      photoW,
      photoH,
      sign,
      signCorners,
      signOpacity = 0.85,
      timeOfDay = "day",
      illumination = "none",
      signType = "channelLetters",
      calLine,
      showHandles,
      handleRadius = 14,
      viewScale = 1,
    } = opts;

    if (!photo) return;

    if (timeOfDay === "night") {
      drawNightPhoto(ctx, photo, photoW, photoH);
    } else {
      ctx.drawImage(photo, 0, 0, photoW, photoH);
    }

    if (sign && signCorners) {
      const illum = illuminationFaceOpacity(illumination, timeOfDay);
      const isLit = timeOfDay === "night" && illumination !== "none";

      if (isLit && illum.spill) {
        drawWallSpill(ctx, signCorners, illum.spillColor, 1);
      }

      if (signType === "flatPanel") {
        drawStandoffs(ctx, signCorners);
      }

      if (signType === "lightbox") {
        drawLightboxCabinet(ctx, signCorners);
      }

      if (signType === "channelLetters" || signType === "blade") {
        drawRaceway(ctx, signCorners);
      }

      if (signType === "blade") {
        drawBladeDepth(ctx, signCorners);
      }

      if (signType === "channelLetters") {
        drawReturns(ctx, sign, signCorners, 10);
      }

      if (isLit && (illumination === "halo" || illumination === "neon")) {
        const haloColor = illumination === "neon" ? "rgba(255, 80, 160, 0.7)" : "rgba(255, 220, 150, 0.65)";
        drawHaloGlow(ctx, sign, signCorners, haloColor, illumination === "neon" ? 0.15 : 0.08);
      }

      let faceAlpha = signOpacity;
      if (timeOfDay === "night" && illumination !== "none") {
        faceAlpha = illum.face;
      }

      if (timeOfDay === "night" && illumination === "internal") {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        drawWarpedSign(ctx, sign, signCorners, 0.55);
        ctx.restore();
      }

      drawWarpedSign(ctx, sign, signCorners, faceAlpha);

      if (timeOfDay === "night" && illumination === "face") {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        drawWarpedSign(ctx, sign, signCorners, 0.35);
        ctx.restore();
      }

      if (timeOfDay === "night" && illumination === "neon") {
        ctx.save();
        ctx.strokeStyle = "rgba(255, 120, 200, 0.85)";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "rgba(255, 80, 180, 0.9)";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(signCorners[0].x, signCorners[0].y);
        for (let i = 1; i < 4; i++) ctx.lineTo(signCorners[i].x, signCorners[i].y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
    }

    if (calLine) {
      ctx.strokeStyle = "#d4a843";
      ctx.lineWidth = 3 / viewScale;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(calLine.a.x, calLine.a.y);
      ctx.lineTo(calLine.b.x, calLine.b.y);
      ctx.stroke();
      ctx.fillStyle = "#0b1d33";
      for (const p of [calLine.a, calLine.b]) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5 / viewScale, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (showHandles && signCorners && sign) {
      ctx.strokeStyle = "rgba(212, 168, 67, 0.9)";
      ctx.lineWidth = 2 / viewScale;
      ctx.beginPath();
      ctx.moveTo(signCorners[0].x, signCorners[0].y);
      for (let i = 1; i < 4; i++) ctx.lineTo(signCorners[i].x, signCorners[i].y);
      ctx.closePath();
      ctx.stroke();
      for (const p of signCorners) {
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#0b1d33";
        ctx.lineWidth = 2 / viewScale;
        ctx.beginPath();
        ctx.arc(p.x, p.y, handleRadius / viewScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
  }

  function renderCompositeCanvas(state, viewOptions) {
    const c = document.createElement("canvas");
    c.width = state.photoW;
    c.height = state.photoH;
    const g = c.getContext("2d");
    drawMockupScene(g, {
      photo: state.photo,
      photoW: state.photoW,
      photoH: state.photoH,
      sign: state.sign,
      signCorners: state.signCorners,
      signOpacity: state.signOpacity,
      timeOfDay: viewOptions?.timeOfDay ?? state.timeOfDay,
      illumination: viewOptions?.illumination ?? state.illumination,
      signType: viewOptions?.signType ?? state.signType,
      calLine: null,
      showHandles: false,
      viewScale: 1,
    });
    return c;
  }

  function renderFabSourceCanvas(sign) {
    const c = document.createElement("canvas");
    const pad = 24;
    c.width = sign.width + pad * 2;
    c.height = sign.height + pad * 2;
    const g = c.getContext("2d");
    g.fillStyle = "#f5f6f8";
    g.fillRect(0, 0, c.width, c.height);
    g.drawImage(sign, pad, pad);
    g.strokeStyle = "#dfe5ee";
    g.lineWidth = 1;
    g.strokeRect(pad, pad, sign.width, sign.height);
    return c;
  }

  function resizeCanvasToMax(canvas, maxDim) {
    const scale = Math.min(1, maxDim / Math.max(canvas.width, canvas.height));
    if (scale >= 1) return canvas.toDataURL("image/jpeg", 0.88);
    const c = document.createElement("canvas");
    c.width = Math.round(canvas.width * scale);
    c.height = Math.round(canvas.height * scale);
    c.getContext("2d").drawImage(canvas, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.88);
  }

  global.ArcSignRender = {
    drawMockupScene,
    renderCompositeCanvas,
    renderFabSourceCanvas,
    resizeCanvasToMax,
    bilinearQuad,
  };
})(typeof window !== "undefined" ? window : globalThis);
