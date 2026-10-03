// Turns a user-picked file into a canvas. Safari decodes HEIC natively; other browsers fall back
// to libheif (vendor/heic-to), loaded only when it is needed.
const HEIC_BRANDS = ["heic", "heix", "hevc", "hevx", "heim", "heis", "hevm", "hevs", "mif1", "msf1"];
const HEIC_LIB = new URL("../vendor/heic-to-1.6.5.min.js", import.meta.url).href;

export async function isHeic(file) {
  if (/\.(heic|heif)$/i.test(file.name || "") || /image\/hei[cf]/i.test(file.type || "")) return true;
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const text = String.fromCharCode(...head);
  return text.slice(4, 8) === "ftyp" && HEIC_BRANDS.includes(text.slice(8, 12));
}

function decodeWithImg(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      const done = () => { URL.revokeObjectURL(url); resolve(img); };
      img.decode ? img.decode().then(done, done) : done();
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("decode")); };
    img.src = url;
  });
}

async function decodeHeic(file, onStatus) {
  onStatus?.("Converting the iPhone photo…");
  const { heicTo } = await import(HEIC_LIB);
  return heicTo({ blob: file, type: "bitmap" });
}

export function toCanvas(source, maxSide) {
  const w = source.naturalWidth || source.width || 1024, h = source.naturalHeight || source.height || 1024;
  const k = Math.min(1, maxSide / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(w * k));
  canvas.height = Math.max(1, Math.round(h * k));
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

// SVGs with no width/height report 0x0 (or 150x150 in some browsers); give them a usable raster size.
async function svgSize(file) {
  const text = await file.text();
  const vb = text.match(/viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  return vb ? { w: Number(vb[1]), h: Number(vb[2]) } : null;
}

export async function loadImageFile(file, { maxSide = 3200, onStatus } = {}) {
  const heic = await isHeic(file);
  let source = null;
  try {
    source = await decodeWithImg(file);
  } catch (err) {
    if (!heic) throw new Error("This file couldn't be opened as an image. Try a JPEG, PNG, WebP, SVG, or an iPhone photo.");
  }
  if (!source) {
    try {
      source = await decodeHeic(file, onStatus);
    } catch (err) {
      console.error(err);
      throw new Error("This iPhone photo couldn't be converted. On the iPhone, go to Settings, then Camera, then Formats, and choose Most Compatible, or send it as a JPEG.");
    }
  }
  if (/svg/i.test(file.type) || /\.svg$/i.test(file.name || "")) {
    const vb = await svgSize(file).catch(() => null);
    const ratio = vb && vb.w && vb.h ? vb.h / vb.w : (source.naturalHeight || 1) / (source.naturalWidth || 1);
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = Math.max(1, Math.round(2048 * ratio));
    canvas.getContext("2d").drawImage(source, 0, 0, canvas.width, canvas.height);
    return { canvas, heic };
  }
  const canvas = toCanvas(source, maxSide);
  if (source.close) source.close();
  return { canvas, heic };
}

export const FONTS = {
  sans: { label: "Bold sans", css: (px) => `900 ${px}px "Arial Black", "Helvetica Neue", Arial, sans-serif` },
  serif: { label: "Classic serif", css: (px) => `700 ${px}px Georgia, "Times New Roman", serif` },
  condensed: { label: "Condensed", css: (px) => `700 ${px}px Impact, "Arial Narrow", "Roboto Condensed", sans-serif-condensed, sans-serif` },
};

// Renders a one-line text sign. Returns a canvas whose size defines the sign's aspect ratio.
export function renderTextSign({ text, font = "sans", color = "#ffffff", background = "#0b1d33", transparent = false, glow = false }) {
  const label = (text || "").trim() || "Your Business";
  const px = 220;
  const pad = Math.round(px * 0.42);
  const measure = document.createElement("canvas").getContext("2d");
  const fontCss = (FONTS[font] || FONTS.sans).css(px);
  measure.font = fontCss;
  const m = measure.measureText(label);
  const ascent = m.actualBoundingBoxAscent || px * 0.75, descent = m.actualBoundingBoxDescent || px * 0.2;
  const tw = Math.ceil(Math.max(m.width, (m.actualBoundingBoxLeft || 0) + (m.actualBoundingBoxRight || 0)));
  const canvas = document.createElement("canvas");
  canvas.width = Math.min(4096, tw + pad * 2);
  canvas.height = Math.ceil(ascent + descent + pad * 1.4);
  const ctx = canvas.getContext("2d");
  if (!transparent) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.font = fontCss;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "center";
  const scaleX = Math.min(1, (canvas.width - pad * 2) / tw);
  ctx.translate(canvas.width / 2, (canvas.height + ascent - descent) / 2);
  ctx.scale(scaleX, 1);
  if (glow) {
    ctx.shadowColor = color;
    ctx.shadowBlur = px * 0.22;
    ctx.fillStyle = color;
    ctx.fillText(label, 0, 0);
    ctx.shadowBlur = px * 0.08;
  }
  ctx.fillStyle = color;
  ctx.fillText(label, 0, 0);
  return canvas;
}
