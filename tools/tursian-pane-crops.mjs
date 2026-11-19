// Generate window-pane–focused TURSIAN crops (v2) for before/after compares.
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "assets", "portfolio");
const VERSION = "v2";

const AVIF = { quality: 50, effort: 6 };
const WEBP = { quality: 74, effort: 6 };
const JPEG = { quality: 78, mozjpeg: true, progressive: true };

const PAIR_WIDTHS = [480, 800, 1200, 1600];
const CLOSE_WIDTHS = [480, 800, 1200, 1600];

const PAIR_RATIO = { w: 6, h: 5 };
const CLOSE_RATIO = { w: 3, h: 4 };

const masters = "/home/ubuntu/.cursor/projects/agent-repos-ArcSignCo";

const JOBS = [
  {
    name: "tursian-9-bleecker-before-panes-pair",
    src: path.join(masters, "uploads/tursian-9-bleecker-before-01_b648.jpg"),
    extract: { left: 600, top: 85, width: 540, height: 450 },
    ratio: PAIR_RATIO,
    widths: PAIR_WIDTHS,
  },
  {
    name: "tursian-9-bleecker-after-panes-pair",
    src: path.join(masters, "assets/tursian-9-bleecker-01.jpg"),
    extract: { left: 540, top: 290, width: 640, height: 533 },
    ratio: PAIR_RATIO,
    widths: PAIR_WIDTHS,
  },
  {
    name: "tursian-9-bleecker-before-panes-close",
    src: path.join(masters, "uploads/tursian-9-bleecker-before-02_db04.jpg"),
    extract: { left: 230, top: 170, width: 790, height: 1053 },
    ratio: CLOSE_RATIO,
    widths: CLOSE_WIDTHS,
  },
  {
    name: "tursian-9-bleecker-after-panes-close",
    src: path.join(masters, "assets/tursian-9-bleecker-02.jpg"),
    extract: { left: 360, top: 195, width: 820, height: 1093 },
    ratio: CLOSE_RATIO,
    widths: CLOSE_WIDTHS,
  },
];

async function assertNoMetadata(file) {
  const m = await sharp(file).metadata();
  const found = ["exif", "xmp", "iptc", "icc"].filter((k) => m[k]);
  if (found.length) throw new Error(`${file} carries metadata: ${found.join(", ")}`);
}

await mkdir(out, { recursive: true });

for (const job of JOBS) {
  const baseHeightAt1200 = Math.round((1200 * job.ratio.h) / job.ratio.w);
  for (const w of job.widths) {
    const h = Math.round((w * job.ratio.h) / job.ratio.w);
    const stem = path.join(out, `${job.name}-${w}.${VERSION}`);
    const pipeline = () =>
      sharp(job.src)
        .rotate()
        .extract(job.extract)
        .resize({ width: w, height: h, fit: "fill" });

    for (const [ext, encode] of [
      ["avif", (i) => i.avif(AVIF)],
      ["webp", (i) => i.webp(WEBP)],
      ["jpg", (i) => i.jpeg(JPEG)],
    ]) {
      const file = `${stem}.${ext}`;
      await encode(pipeline()).toFile(file);
      await assertNoMetadata(file);
    }
  }
  console.log(`${job.name}: ${job.extract.width}x${job.extract.height} extract`);
}