// Regenerates the portfolio photos in /assets/portfolio from the cleaned masters.
//
// The masters are not committed: Netlify publishes the repo root and the repo is public, so any
// master in the repo would be downloadable at full size. Keep the cleaned set with the project
// files and pass its folder (sharp is not a site dependency, so install it outside the repo):
//   mkdir -p /tmp/img-tools && (cd /tmp/img-tools && npm i sharp)
//   NODE_PATH=/tmp/img-tools/node_modules node tools/optimize-portfolio-images.mjs /path/to/masters
//
// Masters are matched by their two-digit prefix ("01-...jpg") and checked against the SHA-256
// below, so a different or re-cleaned file is caught before anything is written. /assets/* is
// served with a one-year immutable cache (see netlify.toml): if a master changes, update its hash,
// bump VERSION, regenerate, and update the references in portfolio.html.

import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const VERSION = "v1";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "assets", "portfolio");

// Same encoder settings as tools/optimize-images.mjs.
const AVIF = { quality: 50, effort: 6 };
const WEBP = { quality: 74, effort: 6 };
const JPEG = { quality: 78, mozjpeg: true, progressive: true };

// 1200 w covers the widest slot on the page (about 725 CSS px) at better than 1.6x density, and
// keeps every AVIF under about 65 KB. Photos taller than 1:1.6 never display wider than about
// 450 CSS px (the enlarged view is height-bound), so they stop at 800 w.
const WIDTHS = [480, 800, 1200];
const TALL_WIDTHS = [480, 800];

// Per-photo AVIF quality where the default would push a file far past the rest of the set.
const AVIF_QUALITY = { "shop-exit-stair-e-bench-qc": 44 };

const PHOTOS = [
  ["01", "navy-yard-storehouse-illuminated-id", "23ae6b36f5ebc695d8b176a62d5ef113240b1ef0aa600a9cc179e3539040ea97"],
  ["02", "undc-room-id-packing-label", "c33a8bd06f3721619ecf524cbcd8cf650a3750ff27c245e4f6e482afc9aa2ee9"],
  ["03", "ada-stair-k-floor-92-id", "333c6619dee3718b057d659d959032e3bcf8fbf2afc7697014e99342b48545c3"],
  ["04", "ada-stair-a-floor-1-id", "d32533a11ed681c0e7cfaeac3a40f2e59cb21ae764bf9cb042425bdadc6b9dc9"],
  ["05", "ada-exit-sign-black-door", "31e4682d8c4031b408b3cade866088dce94b099398bb9bdafd377b990289e2e3"],
  ["06", "ada-elevator-bank-y-package", "3c13192ffe2dfdabb1d2dc6d6a1b227cfb0ce90a2d98d71c88f54ff9682ab99b"],
  ["07", "pool-lifeguard-packing-label", "638a3af8ecc11761c12a3e862ea15aa76c3f54144f7ed13ca3fee2317ec747c2"],
  ["08", "shop-nomad-dimensional-letters", "4b87bf3ff9ae45dc9647644415d59c8945068dc97307a0d3f26173adf2230428"],
  ["09", "shop-exit-stair-e-bench-qc", "3ab3a1e0a9ee64c69fa34a3a910a0dc10dd051d3564978cf1ce9a195e1ad5fe1"],
  ["10", "plaque-directory-a-b-c-m", "60f5281f275437c70e0c7dee2887a9ab9b31c610130d2f90493aa156226d32a7"],
  ["11", "plaque-international-seabed-authority", "1199b5a749a2bddb4a528f067a78ed2e867bb33942ab0a2d8f1c692fdb83d534"],
  ["12", "plaque-sr-112-electrical-service-room", "3b75284f060df1c82fb702bb8c7638d02849a19342292d3035370343d78011cc"],
  ["13", "gallery-room-id-6-711", "72983da1412a7dd65984d34427e789b300af024c31f2b451e26c0f3b19b8db43"],
  ["14", "gallery-room-id-wardrobe", "0e1e93c4fd61102dfe454003749d0d6b6d1bab456a008d953ffa859f64af8a15"],
];

const src = process.argv[2];
if (!src) {
  console.error("Usage: node tools/optimize-portfolio-images.mjs /path/to/cleaned/masters");
  process.exit(1);
}
const files = (await readdir(src)).filter((f) => /\.jpe?g$/i.test(f));

async function assertNoMetadata(file) {
  const m = await sharp(file).metadata();
  const found = ["exif", "xmp", "iptc", "icc"].filter((k) => m[k]);
  if (found.length) throw new Error(`${file} carries metadata: ${found.join(", ")}`);
}

await mkdir(out, { recursive: true });
let largest = { size: 0 };

for (const [prefix, name, sha256] of PHOTOS) {
  const matches = files.filter((f) => f.startsWith(`${prefix}-`));
  if (matches.length !== 1) throw new Error(`Expected one master starting with "${prefix}-" in ${src}, found ${matches.length}`);
  const input = path.join(src, matches[0]);
  const digest = createHash("sha256").update(await readFile(input)).digest("hex");
  if (digest !== sha256) throw new Error(`${matches[0]} does not match the approved master (sha256 ${digest})`);

  const { width, height } = await sharp(input).metadata();
  const widths = [...new Set((height / width > 1.6 ? TALL_WIDTHS : WIDTHS).map((w) => Math.min(w, width)))];
  const avif = { ...AVIF, quality: AVIF_QUALITY[name] ?? AVIF.quality };
  const row = [];
  for (const w of widths) {
    // rotate() applies any EXIF orientation before the (default) metadata strip. Never call
    // withMetadata(): the derivatives must carry no EXIF/GPS.
    const base = () => sharp(input).rotate().resize({ width: w, withoutEnlargement: true });
    const stem = path.join(out, `${name}-${w}.${VERSION}`);
    for (const [ext, encode] of [["avif", (i) => i.avif(avif)], ["webp", (i) => i.webp(WEBP)], ["jpg", (i) => i.jpeg(JPEG)]]) {
      const file = `${stem}.${ext}`;
      await encode(base()).toFile(file);
      await assertNoMetadata(file);
      const { size } = await stat(file);
      if (size > largest.size) largest = { size, file };
      row.push(`${ext} ${w}: ${(size / 1024).toFixed(1)} KB`);
    }
  }
  console.log(`${name} (${width}x${height}) widths ${widths.join("/")}\n  ${row.join(" | ")}`);
}

console.log(`Largest file: ${path.relative(root, largest.file)} ${(largest.size / 1024).toFixed(1)} KB`);
