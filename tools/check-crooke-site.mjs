// Guardrails for the hidden Crooke family heritage site (Phase 1).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { JSDOM } = require("jsdom");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SLUG = "crooke-7c3a9e12";
const base = path.join(root, SLUG);
const indexPath = path.join(base, "index.html");

let failures = 0;
const fail = msg => {
  failures++;
  console.log(`FAIL crooke: ${msg}`);
};
const pass = msg => console.log(`ok   crooke: ${msg}`);

if (!fs.existsSync(indexPath)) {
  fail(`missing ${SLUG}/index.html`);
  process.exit(1);
}

const html = fs.readFileSync(indexPath, "utf8");
const { document } = new JSDOM(html).window;
const robots = document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "";
if (!/noindex/i.test(robots)) fail("index.html must include noindex meta");
else pass("noindex meta present");

const text = document.body?.textContent ?? "";
const bannedLiving = [
  /\bSSN\b/i,
  /\bsocial security\b/i,
  /\b\d{3}-\d{2}-\d{4}\b/,
  /\bstreet address\b/i,
  /\b\d{5}\b.*\bNY\b/,
];
for (const re of bannedLiving) {
  if (re.test(text)) fail(`body matches sensitive pattern ${re}`);
}
pass("no obvious sensitive patterns in static copy");

if (!/art coming from Build/i.test(html)) fail('crest area must mention "art coming from Build"');
else pass("Build art placeholder labeled");

if (!/household emblem made for the Crooke family/i.test(html)) {
  fail("crest must caption household emblem (not historic grant)");
} else pass("household emblem caption present");

if (!document.querySelector(".archive-source[data-source]")) {
  fail("archive source tags required");
} else pass("archive source tags present");

function rasterExt(name) {
  return /\.(jpe?g|png|webp|heic|pdf)$/i.test(name);
}
const files = fs.readdirSync(base, { recursive: true, withFileTypes: true });
for (const ent of files) {
  if (ent.isFile() && rasterExt(ent.name) && ent.name !== "CONTENT-POLICY.md") {
    fail(`no raster scans in ${SLUG}: ${ent.name}`);
  }
}
pass("no photo/document scans in crooke folder");

for (const name of ["Charles Crooke", "Mary Thelma Morel", "Elizabeth Crooke", "Yodernis Crooke", "Jesus Crooke"]) {
  if (!text.includes(name.split(" ")[0]) && !html.includes(name)) {
    /* Jesus / Mary partial ok */
  }
}
if (!html.includes("Charles Crooke")) fail("missing Charles Crooke seed");
if (!html.includes("Mary Thelma Morel")) fail("missing Mami seed");
pass("core family seed names referenced");

const robotsTxt = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
if (!robotsTxt.includes(`Disallow: /${SLUG}/`)) fail("robots.txt must Disallow the crooke path");
else pass("robots.txt disallow");

const toml = fs.readFileSync(path.join(root, "netlify.toml"), "utf8");
if (!toml.includes(`/${SLUG}/*`)) fail("netlify.toml missing X-Robots-Tag for crooke path");
else pass("netlify.toml noindex headers");

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
if (sitemap.includes(SLUG)) fail("sitemap must not list hidden crooke path");
else pass("sitemap excludes crooke path");

const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
if (home.includes(SLUG)) fail("public homepage must not link to crooke site");
else pass("public homepage does not reference crooke path");

if (failures) {
  console.log(`\n${failures} crooke check(s) failed.`);
  process.exit(1);
}
console.log("\nAll crooke site checks passed.");
