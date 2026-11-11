// Real vehicle and storefront photographs used as the visualizer's starter images.
// Sources and licenses are in visualize/img/templates/CREDITS.md.
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const FILES = {
  "cargo-van": "cargo-van.jpg",
  pickup: "pickup.jpg",
  "box-truck": "box-truck.jpg",
  car: "sedan.jpg",
  storefront: "storefront.jpg",
};

function templateDir() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(here, "../../../visualize/img/templates"),
    path.resolve(process.cwd(), "visualize/img/templates"),
    "/var/task/visualize/img/templates",
  ];
  return candidates.find(dir => existsSync(path.join(dir, "cargo-van.jpg"))) || "";
}

export function templateKeyFor(category, subject = {}) {
  if (category !== "vehicle") return "storefront";
  const body = subject.body || "cargo-van";
  return FILES[body] ? body : "cargo-van";
}

export async function loadTemplate(key, { fetchImpl = fetch, siteUrl = "" } = {}) {
  const file = FILES[key];
  if (!file) return null;
  const folder = templateDir();
  if (folder) {
    const bytes = await readFile(path.join(folder, file));
    return { bytes, mime: "image/jpeg", role: "photo" };
  }
  if (!siteUrl) return null;
  const res = await fetchImpl(new URL(`/visualize/img/templates/${file}`, siteUrl));
  if (!res.ok) return null;
  const bytes = Buffer.from(await res.arrayBuffer());
  if (!bytes.length) return null;
  return { bytes, mime: "image/jpeg", role: "photo" };
}
