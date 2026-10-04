// Optimize ad-hoc portfolio masters into assets/portfolio (same settings as optimize-portfolio-images.mjs).
import { createRequire } from "node:module";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire("/tmp/img-tools/package.json");
const sharp = require("sharp");

const VERSION = "v2";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "assets", "portfolio");

const AVIF = { quality: 50, effort: 6 };
const WEBP = { quality: 74, effort: 6 };
const JPEG = { quality: 78, mozjpeg: true, progressive: true };
const WIDTHS = [480, 800, 1200];
const TALL_WIDTHS = [480, 800];

const INPUTS = [
  ["/tmp/portfolio-masters/09_we-dimensional-letters-prototype.jpg", "we-dimensional-letters-color-prototype"],
  ["/tmp/portfolio-masters/14_acrylic-panel-production.jpg", "acrylic-panel-production"],
  ["/tmp/portfolio-masters/15_stainless-sign-panel-delivery.jpg", "wrapped-stainless-sign-panel-delivery"],
  ["/tmp/portfolio-masters/17_elevator-control-room-signs-install.jpg", "elevator-control-room-signs-install"],
];

async function assertNoMetadata(file) {
  const m = await sharp(file).metadata();
  const found = ["exif", "xmp", "iptc", "icc"].filter((k) => m[k]);
  if (found.length) throw new Error(`${file} carries metadata: ${found.join(", ")}`);
}

await mkdir(out, { recursive: true });

for (const [input, name] of INPUTS) {
  const { width, height } = await sharp(input).rotate().metadata();
  const widths = [...new Set((height / width > 1.6 ? TALL_WIDTHS : [...WIDTHS, 1600]).map((w) => Math.min(w, width)))];
  for (const w of widths) {
    const base = () => sharp(input).rotate().resize({ width: w, withoutEnlargement: true });
    const stem = path.join(out, `${name}-${w}.${VERSION}`);
    for (const [ext, encode] of [
      ["avif", (i) => i.avif(AVIF)],
      ["webp", (i) => i.webp(WEBP)],
      ["jpg", (i) => i.jpeg(JPEG)],
    ]) {
      const file = `${stem}.${ext}`;
      await encode(base()).toFile(file);
      await assertNoMetadata(file);
    }
  }
  console.log(`${name}: ${width}x${height} -> widths ${widths.join(", ")}`);
}
