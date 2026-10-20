// Original isometric awning icons for /awnings/. Geometry is parametric (not traced).
// Run: NODE_PATH=/tmp/img-tools/node_modules node tools/awning-style-art.mjs sheet
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const STYLES = [
  {
    id: "straight-slope",
    name: "Straight Slope (Traditional)",
    desc: "A straight roof from the wall down to a low front edge.",
    tags: ["Retail", "Restaurant"],
    sample: null,
  },
  {
    id: "traditional-valance",
    name: "Traditional with Valance",
    desc: "The same straight roof, with a hanging valance for the name.",
    tags: ["Retail", "Restaurant"],
    sample: "wide",
  },
  {
    id: "convex",
    name: "Convex / Quarter Round",
    desc: "A quarter-round curve on flat ends, high at the wall.",
    tags: ["Cafe", "Retail"],
    sample: "narrow",
  },
  {
    id: "concave",
    name: "Concave",
    desc: "The cover sags inward, the reverse of a quarter-round.",
    tags: ["Retail", "Entrance"],
    sample: null,
  },
  {
    id: "waterfall",
    name: "Waterfall",
    desc: "A short roof and a tall front face for graphics.",
    tags: ["Retail", "Restaurant"],
    sample: "edge",
  },
  {
    id: "casement-hip",
    name: "Casement / Hip Roof",
    desc: "A hip roof: the ends slope, with no gable triangle.",
    tags: ["Entrance", "Retail"],
    sample: null,
  },
  {
    id: "gable",
    name: "Gable",
    desc: "A peaked roof with a triangular gable at the front.",
    tags: ["Entrance", "Retail"],
    sample: "horizontal",
  },
  {
    id: "dome",
    name: "Dome",
    desc: "A quarter-sphere over a door or a short window.",
    tags: ["Entrance", "Cafe"],
    sample: null,
  },
  {
    id: "elongated-dome",
    name: "Elongated Dome",
    desc: "The dome curve stretched across a longer front.",
    tags: ["Retail", "Restaurant"],
    sample: "wide",
  },
  {
    id: "circular",
    name: "Circular",
    desc: "A round cover, circular in plan rather than a wall dome.",
    tags: ["Cafe", "Entrance"],
    sample: null,
  },
  {
    id: "bullnose",
    name: "Bullnose",
    desc: "A straight roof that rolls into a rounded front edge.",
    tags: ["Retail", "Cafe"],
    sample: null,
  },
  {
    id: "sign-box",
    name: "Sign Box",
    desc: "A long box with a flat front face for graphics.",
    tags: ["Retail", "Restaurant"],
    sample: null,
  },
  {
    id: "backlit-popup",
    name: "Backlit Pop-Up",
    desc: "A box with a lighter face set forward. Lit faces need electrical coordination.",
    tags: ["Restaurant", "Retail"],
    sample: null,
  },
  {
    id: "entrance-canopy",
    name: "Entrance Canopy",
    desc: "A compact cover sized to the door, not the whole front.",
    tags: ["Entrance"],
    sample: null,
  },
  {
    id: "rounded-entrance",
    name: "Rounded Entrance Canopy",
    desc: "An entrance canopy with a barrel-vault roof.",
    tags: ["Entrance", "Cafe"],
    sample: "narrow",
  },
  {
    id: "pyramid-cabana",
    name: "Pyramid Cabana",
    desc: "A freestanding pyramid roof on four posts.",
    tags: ["Walkway", "Cafe"],
    sample: null,
  },
  {
    id: "patio-canopy",
    name: "Stationary / Patio Canopy",
    desc: "A flat roof on posts, freestanding rather than hung on the wall.",
    tags: ["Walkway", "Entrance"],
    sample: "wide",
  },
  {
    id: "lateral-arm",
    name: "Lateral Arm Retractable",
    desc: "Fabric on a roller with side arms, so the cover can roll back.",
    tags: ["Cafe", "Restaurant"],
    sample: null,
  },
];

function fmt(n) {
  return (Math.round(n * 10) / 10).toString();
}

function normal(a, b, c) {
  const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
  const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
  return [uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx];
}

function makeCtx() {
  const pts = [];
  const faces = [];
  const strokes = [];
  function project(x, y, z) {
    // Same 3/4 for every style: enough of the side profile to read the shape.
    const px = x * 0.62 - y * 1.12;
    const py = x * 0.34 + y * 0.5 - z;
    pts.push([px, py]);
    return [px, py];
  }
  function poly(points, cls) {
    const p = points.map((q) => project(q[0], q[1], q[2]));
    faces.push({
      cls,
      depth: points.reduce((s, q) => s + q[0] + q[1] - q[2] * 0.15, 0) / points.length,
      d: `M ${p.map((q) => `${fmt(q[0])} ${fmt(q[1])}`).join(" L ")} Z`,
    });
  }
  function addFace(points, force) {
    if (points.length < 3) return;
    const n = normal(points[0], points[1], points[2]);
    const facing = n[0] * 0.62 + n[1] * 1.12 + n[2] * 0.85;
    if (facing <= 0.4) return;
    const len = Math.hypot(n[0], n[1], n[2]) || 1;
    const nx = n[0] / len, ny = n[1] / len, nz = n[2] / len;
    let cls = "awning-body";
    if (nz > 0.62) cls = "awning-face";
    else if (nx > 0.35 && nx > ny) cls = "awning-shade";
    else cls = "awning-body";
    if (force) cls = force;
    poly(points, cls);
  }
  function addStroke(points, cls, width) {
    const p = points.map((q) => project(q[0], q[1], q[2]));
    strokes.push({
      cls,
      width,
      d: `M ${p.map((q) => `${fmt(q[0])} ${fmt(q[1])}`).join(" L ")}`,
    });
  }
  return { project, addFace, addStroke, pts, faces, strokes };
}

function heightfield(ctx, nu, nv, fn, opt = {}) {
  const g = [];
  for (let j = 0; j <= nv; j++) {
    const row = [];
    for (let i = 0; i <= nu; i++) row.push(fn(i / nu, j / nv));
    g.push(row);
  }
  for (let j = 0; j < nv; j++) {
    for (let i = 0; i < nu; i++) {
      ctx.addFace([g[j][i], g[j][i + 1], g[j + 1][i + 1], g[j + 1][i]], opt.faceClass);
    }
  }
  const z0 = opt.z0 ?? 0;
  const drop = opt.thickness
    ? (p) => [p[0], p[1], p[2] - opt.thickness]
    : (p) => [p[0], p[1], z0];
  if (opt.extrude !== false) {
    const sides = opt.sides ?? ["right", "front", "left"];
    if (sides.includes("right")) {
      const i = nu;
      for (let j = 0; j < nv; j++) {
        const a = g[j][i], b = g[j + 1][i];
        ctx.addFace([b, a, drop(a), drop(b)], opt.sideClass);
      }
    }
    if (sides.includes("left")) {
      for (let j = 0; j < nv; j++) {
        const a = g[j][0], b = g[j + 1][0];
        ctx.addFace([a, b, drop(b), drop(a)]);
      }
    }
    if (sides.includes("front")) {
      const j = nv;
      for (let i = 0; i < nu; i++) {
        const a = g[j][i], b = g[j][i + 1];
        ctx.addFace([a, b, drop(b), drop(a)], opt.frontClass);
      }
    }
    if (sides.includes("back")) {
      for (let i = 0; i < nu; i++) {
        const a = g[0][i], b = g[0][i + 1];
        ctx.addFace([b, a, drop(a), drop(b)]);
      }
    }
  }
  const front = g[nv];
  ctx.addStroke(front, "awning-accent", 2.1);
  const mid = front[Math.floor(front.length / 2)];
  const lip = opt.textZ ?? Math.max(6, (mid[2] + z0) * 0.42);
  ctx.textAt = [mid[0], mid[1], lip];
  if (opt.edgeBand !== false && mid[2] - z0 > 6) {
    const bandTop = z0 + Math.min(14, (mid[2] - z0) * 0.55);
    const a = front[0], b = front[front.length - 1];
    ctx.addFace(
      [[a[0], a[1], bandTop], [b[0], b[1], bandTop], [b[0], b[1], z0 + 1.5], [a[0], a[1], z0 + 1.5]],
      "awning-edge-band",
    );
  }
  return g;
}

function post(ctx, x, y, zTop, s = 3.4) {
  const c = [
    [x - s, y - s],
    [x + s, y - s],
    [x + s, y + s],
    [x - s, y + s],
  ];
  for (let i = 0; i < 4; i++) {
    const a = c[i], b = c[(i + 1) % 4];
    ctx.addFace(
      [[a[0], a[1], zTop], [b[0], b[1], zTop], [b[0], b[1], 0], [a[0], a[1], 0]],
      "awning-shade",
    );
  }
}

function box(ctx, x0, y0, z0, x1, y1, z1, faces = {}) {
  const p = (x, y, z) => [x, y, z];
  ctx.addFace([p(x0, y0, z1), p(x1, y0, z1), p(x1, y1, z1), p(x0, y1, z1)], faces.top || "awning-face");
  ctx.addFace([p(x0, y1, z1), p(x1, y1, z1), p(x1, y1, z0), p(x0, y1, z0)], faces.front || "awning-body");
  ctx.addFace([p(x1, y0, z1), p(x1, y1, z1), p(x1, y1, z0), p(x1, y0, z0)], faces.right || "awning-shade");
  ctx.addFace([p(x0, y1, z1), p(x0, y0, z1), p(x0, y0, z0), p(x0, y1, z0)], faces.left);
  ctx.addFace([p(x1, y0, z1), p(x0, y0, z1), p(x0, y0, z0), p(x1, y0, z0)], faces.back);
  ctx.addStroke([p(x0, y1, z1), p(x1, y1, z1)], "awning-accent", 2.1);
  ctx.textAt = [(x0 + x1) / 2, y1, z0 + (z1 - z0) * 0.48];
}

function cylinderX(ctx, x0, x1, y, z, r, segs = 12) {
  for (let i = 0; i < segs; i++) {
    const a0 = (i / segs) * Math.PI * 2;
    const a1 = ((i + 1) / segs) * Math.PI * 2;
    const p = (a, x) => [x, y + Math.sin(a) * r, z + Math.cos(a) * r];
    ctx.addFace([p(a0, x0), p(a0, x1), p(a1, x1), p(a1, x0)]);
  }
}

function quarterDome(ctx, { cx, rx, ry, rz, nu, nv, zBase = 0 }) {
  const g = [];
  for (let j = 0; j <= nv; j++) {
    const phi = (j / nv) * (Math.PI / 2);
    const row = [];
    for (let i = 0; i <= nu; i++) {
      const theta = Math.PI * (i / nu);
      row.push([
        cx + rx * Math.sin(phi) * Math.cos(theta),
        ry * Math.sin(phi) * Math.sin(theta),
        zBase + rz * Math.cos(phi),
      ]);
    }
    g.push(row);
  }
  const pole = g[0][0];
  for (let i = 0; i < nu; i++) ctx.addFace([pole, g[1][i], g[1][i + 1]]);
  for (let j = 1; j < nv; j++) {
    for (let i = 0; i < nu; i++) ctx.addFace([g[j][i], g[j + 1][i], g[j + 1][i + 1], g[j][i + 1]]);
  }
  ctx.addStroke(g[nv], "awning-accent", 2.2);
  ctx.textAt = [cx, ry * 0.92, zBase + 14];
}

function build(id, ctx) {
  const W = 120;
  if (id === "straight-slope") {
    heightfield(ctx, 1, 1, (u, v) => [u * W, v * 56, 52 - v * 40], { textZ: 10, z0: 0 });
  } else if (id === "traditional-valance") {
    heightfield(ctx, 1, 1, (u, v) => [u * W, v * 50, 54 - v * 16], { textZ: 18, z0: 0 });
  } else if (id === "convex") {
    heightfield(ctx, 1, 16, (u, v) => {
      const z = Math.cos(v * Math.PI * 0.5) * 64;
      return [u * W, v * 64, z];
    }, { textZ: 12 });
  } else if (id === "concave") {
    heightfield(ctx, 1, 18, (u, v) => {
      const z = 20 + Math.sin(v * Math.PI) * -28 + (1 - v) * 36;
      return [u * W, 8 + v * 70, z];
    }, { thickness: 9, textZ: 18, edgeBand: false });
  } else if (id === "bullnose") {
    heightfield(ctx, 1, 20, (u, v) => {
      if (v <= 0.42) {
        const t = v / 0.42;
        return [u * W, t * 28, 58 - t * 4];
      }
      const t = (v - 0.42) / 0.58;
      const ang = t * Math.PI;
      return [u * W, 28 + Math.sin(ang) * 26, 54 - (1 - Math.cos(ang)) * 26];
    }, { thickness: 8, textZ: 20, edgeBand: false });
  } else if (id === "casement-hip") {
    const ridgeL = [30, 22, 56];
    const ridgeR = [96, 26, 56];
    const fL = [4, 64, 16];
    const fR = [122, 70, 16];
    const bL = [18, 2, 18];
    const bR = [112, 6, 18];
    ctx.addFace([ridgeL, ridgeR, fR, fL], "awning-face");
    ctx.addFace([ridgeR, bR, fR], "awning-shade");
    ctx.addFace([bR, bL, ridgeL, ridgeR], "awning-body");
    ctx.addFace([bL, fL, ridgeL], "awning-face");
    ctx.addFace([fL, fR, [fR[0], fR[1], 4], [fL[0], fL[1], 4]], "awning-body");
    ctx.addStroke([fL, fR], "awning-accent", 2.2);
    ctx.textAt = [63, 67, 12];
  } else if (id === "entrance-canopy") {
    box(ctx, 8, 10, 18, 118, 48, 30, { top: "awning-face", front: "awning-body" });
  } else if (id === "waterfall") {
    heightfield(ctx, 1, 1, (u, v) => [u * W, v * 22, 46 - v * 4], {
      frontClass: "awning-face",
      z0: 0,
      textZ: 24,
    });
  } else if (id === "gable") {
    heightfield(ctx, 2, 1, (u, v) => {
      const peak = 1 - Math.abs(u - 0.5) * 2;
      return [u * W, v * 52, 8 + peak * 50];
    }, { textZ: 20 });
  } else if (id === "dome") {
    quarterDome(ctx, { cx: 60, rx: 52, ry: 50, rz: 50, nu: 14, nv: 8 });
  } else if (id === "elongated-dome") {
    quarterDome(ctx, { cx: 78, rx: 86, ry: 42, rz: 40, nu: 16, nv: 8 });
  } else if (id === "circular") {
    const nu = 18, nv = 8, R = 48, Hh = 34;
    const g = [];
    for (let j = 0; j <= nv; j++) {
      const phi = (j / nv) * (Math.PI / 2);
      const row = [];
      for (let i = 0; i <= nu; i++) {
        const theta = (i / nu) * Math.PI * 2;
        row.push([
          56 + R * Math.cos(theta) * Math.sin(phi),
          36 + R * 0.78 * Math.sin(theta) * Math.sin(phi),
          Hh * Math.cos(phi),
        ]);
      }
      g.push(row);
    }
    const pole = g[0][0];
    for (let i = 0; i < nu; i++) ctx.addFace([pole, g[1][i], g[1][i + 1]]);
    for (let j = 1; j < nv; j++) {
      for (let i = 0; i < nu; i++) ctx.addFace([g[j][i], g[j + 1][i], g[j + 1][i + 1], g[j][i + 1]]);
    }
    ctx.textAt = [56, 36 + R * 0.78, 12];
  } else if (id === "sign-box") {
    box(ctx, 0, 0, 0, 140, 36, 42, { front: "awning-face", top: "awning-body" });
  } else if (id === "backlit-popup") {
    box(ctx, 0, 0, 0, 136, 28, 40, { front: "awning-shade", top: "awning-body" });
    box(ctx, 12, 24, 7, 124, 42, 33, { front: "awning-face", top: "awning-face", right: "awning-body" });
    ctx.addStroke([[12, 42, 33], [124, 42, 33], [124, 42, 7], [12, 42, 7], [12, 42, 33]], "awning-accent", 1.8);
    ctx.textAt = [68, 42, 20];
  } else if (id === "rounded-entrance") {
    heightfield(ctx, 12, 1, (u, v) => {
      const z = Math.sin(u * Math.PI) * 30 + 10;
      return [10 + u * 100, v * 42, z];
    }, { textZ: 16 });
  } else if (id === "pyramid-cabana") {
    const S = 96;
    const apex = [S / 2, 34, 62];
    const c = [[2, 6, 18], [S - 2, 6, 18], [S - 2, 62, 18], [2, 62, 18]];
    post(ctx, 8, 12, 18, 3.3);
    post(ctx, S - 8, 12, 18, 3.3);
    post(ctx, S - 8, 56, 18, 3.3);
    post(ctx, 8, 56, 18, 3.3);
    ctx.addFace([c[0], c[1], apex], "awning-face");
    ctx.addFace([c[1], c[2], apex], "awning-shade");
    ctx.addFace([c[2], c[3], apex], "awning-body");
    ctx.addFace([c[3], c[0], apex], "awning-face");
    ctx.addStroke([c[3], c[2]], "awning-accent", 2.2);
    ctx.textAt = [S / 2, 62, 26];
  } else if (id === "patio-canopy") {
    const x0 = 4, x1 = 136, y0 = 6, y1 = 68, z = 40;
    post(ctx, x0 + 5, y0 + 5, z, 3.4);
    post(ctx, x1 - 5, y0 + 5, z, 3.4);
    post(ctx, x1 - 5, y1 - 5, z, 3.4);
    post(ctx, x0 + 5, y1 - 5, z, 3.4);
    box(ctx, x0, y0, z, x1, y1, z + 8, { front: "awning-face", top: "awning-face" });
    ctx.addFace([[x0, y1, z], [x1, y1, z], [x1, y1, z - 11], [x0, y1, z - 11]], "awning-edge-band");
    ctx.textAt = [(x0 + x1) / 2, y1, z - 2];
  } else if (id === "lateral-arm") {
    const yC = 6, zC = 50, r = 8;
    cylinderX(ctx, 6, W - 6, yC, zC, r, 12);
    heightfield(ctx, 1, 1, (u, v) => [12 + u * (W - 24), yC + 6 + v * 48, zC - 4 - v * 16], {
      z0: 18,
      sides: ["front"],
      textZ: 22,
    });
    const arm = (x, side) => {
      ctx.addStroke(
        [[x, yC + 2, zC - 6], [x + side * 10, yC + 28, zC - 16], [x + side * 2, yC + 54, 30]],
        "awning-arm",
        4,
      );
    };
    arm(18, -1);
    arm(W - 18, 1);
  }
}

function patterns(id) {
  const pid = id;
  return `<defs>
    <pattern id="narrow-${pid}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(24)">
      <rect width="7" height="7" fill="var(--face)"/>
      <rect width="3" height="7" fill="var(--stripe)"/>
    </pattern>
    <pattern id="wide-${pid}" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(24)">
      <rect width="16" height="16" fill="var(--face)"/>
      <rect width="8" height="16" fill="var(--stripe)"/>
    </pattern>
    <pattern id="horizontal-${pid}" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(112)">
      <rect width="9" height="9" fill="var(--face)"/>
      <rect width="4" height="9" fill="var(--stripe)"/>
    </pattern>
  </defs>`;
}

function svgMarkup(style, { decorative = false } = {}) {
  const ctx = makeCtx();
  build(style.id, ctx);
  if (!ctx.pts.length) throw new Error(`No geometry for ${style.id}`);
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of ctx.pts) {
    minX = Math.min(minX, x); minY = Math.min(minY, y);
    maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
  }
  const vw = 320, vh = 200, pad = 14;
  const bw = Math.max(1, maxX - minX), bh = Math.max(1, maxY - minY);
  const s = Math.min((vw - pad * 2) / bw, (vh - pad * 2) / bh);
  const tx = (vw - bw * s) / 2 - minX * s;
  const ty = (vh - bh * s) / 2 - minY * s + 4;
  ctx.faces.sort((a, b) => a.depth - b.depth);
  const sample = style.sample;
  const faceFill = (cls) => {
    if (cls !== "awning-face" || !sample || sample === "edge") return "";
    return ` fill="url(#${sample}-${style.id})"`;
  };
  const fallback = {
    "awning-face": "#3d74a8",
    "awning-body": "#0b1d33",
    "awning-shade": "#07111c",
    "awning-edge-band": "#d4a843",
  };
  const paths = ctx.faces.map((f) => {
    const patterned = f.cls === "awning-face" ? faceFill(f.cls) : "";
    const fill = patterned || (fallback[f.cls] ? ` fill="${fallback[f.cls]}"` : "");
    return `<path class="${f.cls}"${fill} d="${f.d}"/>`;
  }).join("");
  const lines = ctx.strokes.map((st) => `<path class="${st.cls}" d="${st.d}" fill="none" stroke="${st.cls === "awning-accent" ? "#d4a843" : "#102033"}" stroke-width="${st.width}" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
  let text = "";
  if (ctx.textAt) {
    const [tx0, ty0] = (() => {
      const [x, y, z] = ctx.textAt;
      return [x * 0.62 - y * 1.12, x * 0.34 + y * 0.5 - z];
    })();
    text = `<text class="awning-name" x="${fmt(tx0)}" y="${fmt(ty0)}" text-anchor="middle" dominant-baseline="middle"></text>`;
  }
  const label = decorative ? "" : ` role="img" aria-label="${style.name} awning"`;
  const sampleClass = sample ? ` sample-${sample}` : "";
  const sampleCss = sample && sample !== "edge"
    ? `.awning-svg.sample-${sample} .awning-face { fill: url(#${sample}-${style.id}); }`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" class="awning-svg${sampleClass}" viewBox="0 0 ${vw} ${vh}"${label}>
    <style>
      .awning-edge-band { display: none; }
      .awning-svg.sample-edge .awning-edge-band { display: inline; }
      ${sampleCss}
    </style>
    ${patterns(style.id)}
    <g transform="translate(${fmt(tx)} ${fmt(ty)}) scale(${fmt(s)})">
      ${paths}${lines}${text}
    </g>
  </svg>`;
}

function cardMarkup(style) {
  const tags = style.tags.map((t) => `<li>${t}</li>`).join("");
  return `<a class="style-card" href="#awning-quote" data-style-id="${style.id}" data-style-name="${style.name.replace(/"/g, "&quot;")}">
    ${svgMarkup(style)}
    <span class="style-copy">
      <h3 class="style-name">${style.name}</h3>
      <p class="style-desc">${style.desc}</p>
      <ul class="style-tags">${tags}</ul>
    </span>
  </a>`;
}

function gridMarkup() {
  return STYLES.map(cardMarkup).join("\n");
}

function optionMarkup() {
  return STYLES.map((s) => `<option>${s.name}</option>`).join("");
}

const COLORS = [
  { id: "navy", name: "Navy", body: "#0b1d33", face: "#1e4468", shade: "#07111c", stripe: "#d7e6f5", accent: "#d4a843", light: false },
  { id: "black", name: "Black", body: "#161616", face: "#3a3a3a", shade: "#070707", stripe: "#ececec", accent: "#d4a843", light: false },
  { id: "charcoal", name: "Charcoal", body: "#3a424c", face: "#5d6875", shade: "#242a32", stripe: "#e7edf3", accent: "#d4a843", light: false },
  { id: "forest", name: "Forest", body: "#1c3b32", face: "#2f6a56", shade: "#10241e", stripe: "#e4f2ea", accent: "#d4a843", light: false },
  { id: "burgundy", name: "Burgundy", body: "#5c2430", face: "#8a3b4c", shade: "#3a1620", stripe: "#f3d5c4", accent: "#d4a843", light: false },
  { id: "red", name: "Red", body: "#8d2e2e", face: "#c45a4e", shade: "#5c1c1c", stripe: "#f8e0d4", accent: "#f0d080", light: false },
  { id: "royal", name: "Royal blue", body: "#1a4c86", face: "#3d78b8", shade: "#102f54", stripe: "#e5f0fb", accent: "#d4a843", light: false },
  { id: "teal", name: "Teal", body: "#16545c", face: "#2f8b96", shade: "#0c3338", stripe: "#d8f3f4", accent: "#d4a843", light: false },
  { id: "canvas", name: "Canvas", body: "#c2b194", face: "#e4d7c0", shade: "#8f8068", stripe: "#5c4a32", accent: "#0b1d33", light: true },
  { id: "white", name: "White", body: "#f3f0e8", face: "#ffffff", shade: "#cfc8bb", stripe: "#0b1d33", accent: "#d4a843", light: true },
];

const STRIPES = [
  { id: "stripe-narrow", name: "Narrow stripes", pattern: "narrow", body: "#0b1d33", face: "#1e4468", shade: "#07111c", stripe: "#f4f1ea", accent: "#d4a843", light: false },
  { id: "stripe-wide", name: "Wide stripes", pattern: "wide", body: "#1c3b32", face: "#2f6a56", shade: "#10241e", stripe: "#f4f1ea", accent: "#d4a843", light: false },
  { id: "stripe-horizontal", name: "Horizontal stripes", pattern: "horizontal", body: "#5c2430", face: "#8a3b4c", shade: "#3a1620", stripe: "#f0d080", accent: "#f0d080", light: false },
  { id: "stripe-valance", name: "Valance band", pattern: "edge", body: "#0b1d33", face: "#1e4468", shade: "#07111c", stripe: "#d4a843", accent: "#d4a843", light: false },
];

async function sheet() {
  const sharp = require("sharp");
  const cellW = 360, cellH = 300, cols = 6;
  const rows = Math.ceil(STYLES.length / cols);
  const tiles = [];
  for (let i = 0; i < STYLES.length; i++) {
    const style = STYLES[i];
    const svg = svgMarkup(style, { decorative: true });
    const png = await sharp(Buffer.from(svg)).resize(cellW, 210, { fit: "contain", background: "#f4f6f8" }).png().toBuffer();
    const label = Buffer.from(`<svg width="${cellW}" height="${cellH}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f4f6f8"/>
      <text x="${cellW / 2}" y="248" text-anchor="middle" font-family="Arial" font-size="15" font-weight="700" fill="#0b1d33">${style.name.replace(/&/g, "&amp;")}</text>
    </svg>`);
    const base = await sharp(label).png().toBuffer();
    const composed = await sharp(base).composite([{ input: png, top: 8, left: 0 }]).png().toBuffer();
    tiles.push({ input: composed, left: (i % cols) * cellW, top: Math.floor(i / cols) * cellH });
  }
  const out = path.join("/tmp/awning-src", "style-sheet.png");
  await sharp({
    create: { width: cols * cellW, height: rows * cellH, channels: 3, background: "#e7ebf0" },
  }).composite(tiles).png().toFile(out);
  console.log(out);
}

const cmd = process.argv[2];
if (cmd === "sheet") {
  await sheet();
} else if (cmd === "fragment") {
  const out = path.join(root, "awnings", "style-cards.fragment.html");
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, gridMarkup());
  await writeFile(path.join(root, "awnings", "style-options.fragment.html"), optionMarkup());
  const preview = svgMarkup(STYLES[0]);
  await writeFile(path.join(root, "awnings", "style-preview.fragment.html"), preview);
  await writeFile(path.join(root, "awnings", "style-data.json"), JSON.stringify({ styles: STYLES.map(({ id, name, desc, tags }) => ({ id, name, desc, tags })), colors: COLORS, stripes: STRIPES }, null, 2));
  console.log("fragments written");
}

export { STYLES, COLORS, STRIPES, svgMarkup, gridMarkup, optionMarkup };
