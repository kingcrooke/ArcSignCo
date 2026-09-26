// Regenerates the optimized web images in /assets/img from the master files in the repo root.
//
// Usage (sharp is not a site dependency, so install it outside the repo):
//   mkdir -p /tmp/img-tools && cd /tmp/img-tools && npm i sharp
//   NODE_PATH=/tmp/img-tools/node_modules node tools/optimize-images.mjs
//
// /assets/* is served with a one-year immutable cache (see netlify.toml), so if a master changes,
// bump VERSION below so every output gets a new filename and update the references in the HTML.

import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const VERSION = "v1";
// v2: palette-quantized lockup (about half the bytes of v1). The v1 lockup files stay in
// assets/img so pages or branches that still reference them keep working.
const LOCKUP_VERSION = "v2";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "assets", "img");

const SPRITE = path.join(root, "service_photoreal_sprite_codex.png");
const LOGO_WHITE = path.join(root, "logo_horizontal_white_transparent.png");
const LOGO_ICON = path.join(root, "logo_icon_white_transparent_codex.png");
const FAVICON = path.join(root, "favicon_512.png");

// Tile rectangles inside the 1774x887 sprite (4 columns x 2 rows, white gutters trimmed).
const TILE = { w: 428, h: 425 };
const COLS = [12, 452, 893, 1333];
const ROWS = [12, 450];
const SERVICES = [
  ["exterior", 0, 0], ["wayfinding", 1, 0], ["ada", 2, 0], ["led", 3, 0],
  ["permits", 0, 1], ["awnings", 1, 1], ["construction", 2, 1], ["stickers", 3, 1],
];

const AVIF = { quality: 50, effort: 6 };
const WEBP = { quality: 74, effort: 6 };
const JPEG = { quality: 78, mozjpeg: true, progressive: true };

async function photo(input, name, widths, extract) {
  for (const width of widths) {
    const base = () => {
      let img = sharp(input);
      if (extract) img = img.extract(extract);
      return img.resize({ width, withoutEnlargement: true });
    };
    const stem = path.join(out, `${name}-${width}.${VERSION}`);
    await base().avif(AVIF).toFile(`${stem}.avif`);
    await base().webp(WEBP).toFile(`${stem}.webp`);
    await base().jpeg(JPEG).toFile(`${stem}.jpg`);
  }
}

async function transparent(input, name, widths) {
  for (const width of widths) {
    const stem = path.join(out, `${name}-${width}.${VERSION}`);
    await sharp(input).resize({ width }).webp({ quality: 90, alphaQuality: 90, effort: 6 }).toFile(`${stem}.webp`);
    await sharp(input).resize({ width }).png({ compressionLevel: 9 }).toFile(`${stem}.png`);
  }
}

// Flat artwork with few colours (logos): quantize to a palette, then store that palette image as
// PNG and lossless WebP. Keep the default palette size: forcing 16 colours breaks up the thin ring.
async function palette(input, name, widths, version) {
  for (const width of widths) {
    const stem = path.join(out, `${name}-${width}.${version}`);
    const png = await sharp(input).resize({ width }).png({ palette: true, effort: 10, compressionLevel: 9 }).toBuffer();
    await writeFile(`${stem}.png`, png);
    await sharp(png).webp({ lossless: true, effort: 6 }).toFile(`${stem}.webp`);
  }
}

// The 1200x240 horizontal logo masters carry a "CUSTOM SIGNAGE · BRONX, NEW YORK" tagline
// (rows 140-206 right of the icon). The web lockup drops that band, recentres the wordmark and
// rule on the icon, and trims the transparent padding. The masters stay untouched.
async function lockupWithoutTagline(input) {
  const icon = await sharp(input).extract({ left: 33, top: 33, width: 174, height: 174 }).toBuffer();
  const wordmark = await sharp(input).extract({ left: 249, top: 61, width: 631, height: 72 }).toBuffer();
  const iconCentre = 174 / 2;
  return sharp({ create: { width: 847, height: 174, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: icon, left: 0, top: 0 },
      { input: wordmark, left: 216, top: Math.round(iconCentre - 72 / 2) },
    ])
    .png()
    .toBuffer();
}

async function ogImage(lockup) {
  const logo = await sharp(lockup).resize({ width: 900 }).toBuffer();
  const { height } = await sharp(logo).metadata();
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#0b1d33" } })
    .composite([
      { input: logo, left: 150, top: Math.round((630 - height) / 2) - 10 },
      { input: Buffer.from('<svg width="1200" height="8"><rect width="1200" height="8" fill="#d4a843"/></svg>'), left: 0, top: 622 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(out, `og-image-1200x630.${VERSION}.png`));
}

// ICO container holding PNG-encoded images (supported by every current browser).
function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

async function favicons() {
  const sizes = [16, 32, 48];
  const pngs = [];
  for (const size of sizes) {
    pngs.push({ size, data: await sharp(FAVICON).resize(size, size).png({ compressionLevel: 9 }).toBuffer() });
  }
  await writeFile(path.join(root, "favicon.ico"), buildIco(pngs));
  await sharp(FAVICON).resize(32, 32).png({ compressionLevel: 9 }).toFile(path.join(root, "favicon-32.png"));
  await sharp(FAVICON).resize(192, 192).png({ compressionLevel: 9, palette: true }).toFile(path.join(root, "icon-192.png"));
  // iOS renders transparent corners as black, so the touch icon gets the brand navy behind it.
  await sharp(FAVICON)
    .resize(180, 180)
    .flatten({ background: "#0b1d33" })
    .png({ compressionLevel: 9, palette: true })
    .toFile(path.join(root, "apple-touch-icon.png"));
}

await mkdir(out, { recursive: true });

for (const [name, col, row] of SERVICES) {
  await photo(SPRITE, `service-${name}`, [300, 428], { left: COLS[col], top: ROWS[row], width: TILE.w, height: TILE.h });
}
await photo(SPRITE, "scope-collage", [800, 1200, 1774]);
const lockup = await lockupWithoutTagline(LOGO_WHITE);
await palette(lockup, "logo-lockup-white", [280, 360, 560, 847], LOCKUP_VERSION);
await ogImage(lockup);
await transparent(LOGO_ICON, "logo-icon-white", [240]);
await favicons();

console.log("Images written to", path.relative(root, out));
