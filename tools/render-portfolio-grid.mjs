// Prints the portfolio photo grid HTML for portfolio.html (stdout).
import { readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "assets", "portfolio");
const VERSION = "v2";
const sizes3 = "(max-width: 720px) calc(50vw - 43px), (max-width: 1196px) calc(33vw - 36px), 358px";

const PHOTOS = [
  {
    slug: "international-seabed-authority-plaque",
    alt: "Wall plaque with emblem and dimensional lettering.",
    cap: "International Seabed Authority wall plaque.",
  },
  {
    slug: "stair-1k-floor-92-id",
    alt: "Stair ID sign with tactile text and Braille.",
    cap: "Stair ID sign, floor 92, tactile text and Braille.",
  },
  {
    slug: "stair-a-floor-1-id-emergency-light",
    alt: "Stair ID sign beside a stair door with an emergency light.",
    cap: "Stair ID sign with emergency light at floor 1.",
  },
  {
    slug: "huddle-room-id",
    alt: "Brushed metal room ID plaque with tactile text and Braille.",
    cap: "Brushed metal huddle room ID plaque.",
  },
  {
    slug: "elevator-bank-a-floor-3-lobby-id",
    alt: "Elevator bank lobby ID sign with floor directory panel.",
    cap: "Elevator bank lobby ID sign, floor 3.",
  },
  {
    slug: "new-york-meat-provisions-decal-panels",
    alt: "Storefront decal panels laid out for fabrication.",
    cap: "Storefront decal panels, shop fabrication.",
  },
  {
    missing: true,
    todo: 7,
    master: "2026-06-01_We-dimensional-letters-color-prototype.jpg",
    alt: "Dimensional letter color prototype, photo pending.",
    cap: "Dimensional letter color prototype (photo pending).",
  },
  {
    slug: "navy-yard-wayfinding-frame-buildings-33-36",
    alt: "Wayfinding sign frame under fabrication.",
    cap: "Wayfinding sign frame fabrication, Buildings 33–36.",
  },
  {
    missing: true,
    todo: 9,
    master: "2025-05-01_acrylic-panel-production-proof.jpg",
    alt: "Acrylic panel production, photo pending.",
    cap: "Acrylic panel production (photo pending).",
  },
  {
    missing: true,
    todo: 10,
    master: "2026-05-04_delivery-handling-wrapped-stainless-sign-panel.jpg",
    alt: "Wrapped stainless sign panel, photo pending.",
    cap: "Wrapped stainless sign panel delivery (photo pending).",
  },
  {
    slug: "nomad-dimensional-letters-shop",
    alt: "Dimensional letters laid out in a sign shop.",
    cap: "Dimensional letters, shop fabrication.",
  },
  {
    missing: true,
    todo: 12,
    master: "2023-06-02_site-visit-elevator-control-room-install.jpg",
    alt: "Elevator control room signs install, photo pending.",
    cap: "Elevator control room signs install (photo pending).",
  },
];

function widthsForSlug(slug) {
  const ws = readdirSync(dir)
    .filter((f) => f.startsWith(`${slug}-`) && f.endsWith(`.${VERSION}.jpg`))
    .map((f) => Number(f.match(/-(\d+)\./)[1]))
    .sort((a, b) => a - b);
  if (!ws.length) throw new Error(`No JPEG derivatives for ${slug}`);
  return ws;
}

function srcset(slug, ext, ws) {
  return ws.map((w) => `/assets/portfolio/${slug}-${w}.${VERSION}.${ext} ${w}w`).join(", ");
}

function figure(p, i) {
  const lazy = i === 0 ? 'fetchpriority="high"' : 'loading="lazy"';
  if (p.missing) {
    return `          <figure class="pf-fig pf-fig--missing" data-todo-photo="${p.todo}">
            <div class="pf-missing" role="img" aria-label="${p.alt}">
              <span class="pf-missing-num">Photo ${p.todo}</span>
              <span class="pf-missing-label">Master not in repo — add optimized assets</span>
              <code class="pf-missing-file">${p.master}</code>
            </div>
            <figcaption>${p.cap}</figcaption>
          </figure>`;
  }
  const ws = widthsForSlug(p.slug);
  const maxW = Math.max(...ws);
  const jpg = path.join(dir, `${p.slug}-${maxW}.${VERSION}.jpg`);
  const dim = awaitMeta(jpg);
  const href = `/assets/portfolio/${p.slug}-${maxW}.${VERSION}.jpg`;
  return `          <figure class="pf-fig">
            <a class="pf-zoom" href="${href}"><picture>
              <source type="image/avif" srcset="${srcset(p.slug, "avif", ws)}" sizes="${sizes3}">
              <source type="image/webp" srcset="${srcset(p.slug, "webp", ws)}" sizes="${sizes3}">
              <img src="/assets/portfolio/${p.slug}-${ws.includes(800) ? 800 : ws[ws.length - 2] ?? ws[0]}.${VERSION}.jpg" srcset="${srcset(p.slug, "jpg", ws)}" sizes="${sizes3}" width="${dim.w}" height="${dim.h}" ${lazy} decoding="async" alt="${p.alt}">
            </picture><span class="sr-only"> (open larger photo)</span></a>
            <figcaption>${p.cap}</figcaption>
          </figure>`;
}

// dimensions from file command via sync read - parse from known files
import { execSync } from "node:child_process";
function awaitMeta(file) {
  const out = execSync(`file "${file}"`).toString();
  const m = out.match(/(\d+)\s*x\s*(\d+)/);
  if (!m) throw new Error(`Could not parse dimensions for ${file}`);
  return { w: Number(m[1]), h: Number(m[2]) };
}

const figures = PHOTOS.map((p, i) => figure(p, i)).join("\n");
process.stdout.write(figures + "\n");
