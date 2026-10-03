// Browser side of the proof PDF: turns canvases, the construction SVG and the logo into JPEGs and
// hands them to the DOM-free writer in pdf.js. Used by the editor and by the phone proof page.
import { buildProofPdf } from "./pdf.js";
import { DIAGRAM_SIZE } from "./diagram-kit.js";
import { getType, describe, diagramSvg, faceArt } from "./catalog.js";
import { averageColor, makeCanvas } from "./art.js";

export const LOGO_URL = "/assets/img/logo-lockup-white-847.v2.png";
const NAVY = "#0b1d33";

const toBlob = (c, type, q) => new Promise((res, rej) => c.toBlob(b => (b ? res(b) : rej(new Error("export"))), type, q));

export async function jpegBytes(c, q = 0.9) {
  return { bytes: new Uint8Array(await (await toBlob(c, "image/jpeg", q)).arrayBuffer()), width: c.width, height: c.height };
}
export const jpegBlob = (c, q = 0.88) => toBlob(c, "image/jpeg", q);

async function loadImage(src) {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  await img.decode();
  return img;
}

let logoCache = null;
export async function logoJpeg() {
  if (logoCache) return logoCache;
  const img = await loadImage(LOGO_URL);
  const c = makeCanvas(img.naturalWidth, img.naturalHeight);
  const g = c.getContext("2d");
  g.fillStyle = NAVY;
  g.fillRect(0, 0, c.width, c.height);
  g.drawImage(img, 0, 0);
  logoCache = await jpegBytes(c, 0.95);
  return logoCache;
}

/** Rasterizes SVG markup onto white, `scale` times its viewBox size. */
export async function svgToCanvas(svg, scale = 4, size = DIAGRAM_SIZE) {
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const img = await loadImage(url);
    const c = makeCanvas(Math.round(size.width * scale), Math.round(size.height * scale));
    const g = c.getContext("2d");
    g.fillStyle = "#fff";
    g.fillRect(0, 0, c.width, c.height);
    g.drawImage(img, 0, 0, c.width, c.height);
    return c;
  } finally {
    URL.revokeObjectURL(url);
  }
}
export async function svgToJpeg(svg, scale = 4) {
  return jpegBytes(await svgToCanvas(svg, scale), 0.92);
}

const luminance = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/**
 * The artwork flat and undistorted: the face the type uses (letters, printed panel or valance),
 * padded on a neutral ground that keeps it readable. Light copy sits on dark gray, dark copy on
 * light gray.
 */
export function flatArtwork(type, art, options, sizeIn) {
  const face = faceArt(type, art, options, sizeIn);
  const maxSide = 2000;
  const k = Math.min(1, maxSide / Math.max(face.width, face.height));
  const fw = Math.max(1, Math.round(face.width * k)), fh = Math.max(1, Math.round(face.height * k));
  const pad = Math.round(Math.max(fw, fh) * 0.06);
  const c = makeCanvas(fw + pad * 2, fh + pad * 2);
  const g = c.getContext("2d");
  const light = luminance(averageColor(face)) > 0.62;
  g.fillStyle = light ? "#30353d" : "#eef0f3";
  g.fillRect(0, 0, c.width, c.height);
  g.imageSmoothingQuality = "high";
  g.drawImage(face, pad, pad, fw, fh);
  return c;
}

const asJpeg = async (img, q) => (img && img.bytes ? img : img ? jpegBytes(img, q) : null);

/**
 * @param {object} p
 * @param {string} p.typeId
 * @param {object} [p.options]  the type's cleaned options (catalog cleanOptions), if its category keeps any
 * @param {{width: number, height: number}} [p.sizeIn]  size in inches (some categories use it, e.g. awning projection)
 * @param {HTMLCanvasElement | {bytes, width, height}} p.day
 * @param {HTMLCanvasElement | {bytes, width, height}} [p.night]
 * @param {HTMLCanvasElement | {bytes, width, height}} [p.flat]
 * The rest is passed through to buildProofPdf (size, reference, project, preparedFor, notes,
 * price, approval, proofUrl, date).
 */
export async function buildSignPdf({ typeId, options = null, sizeIn = null, day, night, flat, ...rest }) {
  const type = getType(typeId);
  const info = describe(type, options, sizeIn);
  const [logo, mockup, nightJ, flatJ, diagram] = await Promise.all([
    logoJpeg(), asJpeg(day, 0.88), asJpeg(night, 0.88), asJpeg(flat, 0.9), svgToJpeg(diagramSvg(type)),
  ]);
  return buildProofPdf({
    ...rest,
    logo,
    mockup,
    night: nightJ,
    diagram,
    flat: flatJ ? { image: flatJ } : null,
    type: {
      name: info.name,
      category: info.category,
      noun: info.noun,
      typeLabel: info.typeLabel,
      heightLabel: info.heightLabel,
      lighting: info.lightingLabel,
      summary: info.summary,
      parts: info.parts,
      night: info.night,
      details: info.details,
    },
  });
}
