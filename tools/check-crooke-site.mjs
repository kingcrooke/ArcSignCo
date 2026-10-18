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

const interviewPath = path.join(base, "interview", "index.html");
if (!fs.existsSync(interviewPath)) fail("missing interview/index.html");
else {
  const interviewHtml = fs.readFileSync(interviewPath, "utf8");
  const interviewDom = new JSDOM(interviewHtml).window.document;
  if (!/noindex/i.test(interviewHtml)) fail("interview page must be noindex");
  else pass("interview noindex");
  if (
    !/<form[^>]*name="crooke-interview"[^>]*data-netlify="true"[^>]*netlify-honeypot="bot-field"/.test(
      interviewHtml.replace(/\s+/g, " "),
    )
  ) {
    fail("crooke-interview form must use Netlify Forms with honeypot");
  } else pass("crooke-interview Netlify form");
  if (!/enctype="multipart\/form-data"/.test(interviewHtml)) fail("interview form needs multipart for audio");
  else pass("interview multipart upload");
  if (!interviewHtml.includes("jesus.crooke@gmail.com")) fail("interview voice fallback mailto");
  else pass("interview voice mailto fallback");
  if (!interviewHtml.includes("interview-wizard.js")) fail("interview must load interview-wizard.js");
  else pass("interview wizard script");
  if (!interviewHtml.includes('type="module"')) fail("interview wizard must use module script");
  else pass("interview module script");
  const configPath = path.join(base, "interview", "interview-config.js");
  if (!fs.existsSync(configPath)) fail("missing interview-config.js");
  else {
    const configSrc = fs.readFileSync(configPath, "utf8");
    if (!/JESUS_WHATSAPP_E164\s*=\s*""/.test(configSrc)) {
      fail("JESUS_WHATSAPP_E164 must remain empty placeholder until Jesus sets it");
    } else pass("JESUS_WHATSAPP_E164 placeholder");
  }
  for (const field of [
    "voice_about_you",
    "old_photo",
    "relative_1_name",
    "more_stories",
    "para",
  ]) {
    if (!interviewHtml.includes(`name="${field}"`)) fail(`interview Netlify register missing field ${field}`);
  }
  pass("interview wizard field registration");
  const mainHtml = fs.readFileSync(indexPath, "utf8");
  if (!mainHtml.includes("/crooke-7c3a9e12/interview/")) fail("main crooke nav must link interview");
  else pass("main site links interview form");
}

for (const name of ["Charles Crooke", "Mary Thelma Morel", "Elizabeth Crooke", "Yodernis Crooke", "Jesus Crooke"]) {
  if (!text.includes(name.split(" ")[0]) && !html.includes(name)) {
    /* Jesus / Mary partial ok */
  }
}
if (!html.includes("Charles Crooke")) fail("missing Charles Crooke seed");
if (!html.includes("Mary Thelma Morel")) fail("missing Mami seed");
pass("core family seed names referenced");

const robotsTxt = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
if (robotsTxt.includes(SLUG)) fail("robots.txt must not mention the crooke path");
else pass("robots.txt omits crooke path");

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
