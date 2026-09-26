// Checks the homepage and service pages for structured-data and copy guardrails.
//
//   mkdir -p /tmp/sd-tools && (cd /tmp/sd-tools && npm i jsdom)
//   NODE_PATH=/tmp/sd-tools/node_modules node tools/check-service-pages.mjs
//
// Exits non-zero if any check fails.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { JSDOM } = require("jsdom");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const SERVICE_SLUGS = ["sign-permits-shop-drawings", "ada-signs", "channel-letters", "construction-signs"];
const pages = [{ slug: "", file: "index.html" }, ...SERVICE_SLUGS.map(slug => ({ slug, file: `${slug}/index.html` }))];

// Claims the site must not make (case-insensitive, visible text only).
const BANNED = [
  /ada[- ]compliant/i, /fully compliant/i, /(?<!(not|n't|no) )guarantee/i, /\bcertified\b/i, /dob[- ]approved/i,
  /we (pull|file) (dob|the) permits?/i, /\bour license/i, /\bwe are (a )?licensed/i, /stamped by arc/i,
  /opening ?hours/i, /\breviews?\b.*\bstars?\b/i, /years in business/i,
];
const FORBIDDEN_LD_KEYS = ["address", "streetAddress", "openingHours", "openingHoursSpecification", "aggregateRating", "review"];

const norm = s => s.replace(/\s+/g, " ").trim();
let failures = 0;
const fail = (page, msg) => { failures++; console.log(`FAIL ${page}: ${msg}`); };
const pass = (page, msg) => console.log(`ok   ${page}: ${msg}`);

function walkKeys(value, found = []) {
  if (Array.isArray(value)) value.forEach(v => walkKeys(v, found));
  else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) { found.push(k); walkKeys(v, found); }
  }
  return found;
}

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const titles = new Map();
const descriptions = new Map();

for (const { slug, file } of pages) {
  const label = `/${slug ? slug + "/" : ""}`;
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const { document } = new JSDOM(html).window;
  const url = `https://arcsignco.com${label}`;

  const blocks = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s, i) => {
    try { return JSON.parse(s.textContent); } catch (e) { fail(label, `JSON-LD block ${i + 1} does not parse: ${e.message}`); return null; }
  }).filter(Boolean);
  pass(label, `${blocks.length} JSON-LD block(s) parse`);

  const keys = walkKeys(blocks);
  const bad = FORBIDDEN_LD_KEYS.filter(k => keys.includes(k));
  if (bad.length) fail(label, `JSON-LD contains forbidden keys: ${bad.join(", ")}`);
  else pass(label, "JSON-LD has no address, hours, ratings, or reviews");

  const canonical = document.querySelector('link[rel="canonical"]')?.href;
  if (canonical !== url) fail(label, `canonical is ${canonical}, expected ${url}`);
  const ogUrl = document.querySelector('meta[property="og:url"]')?.content;
  if (ogUrl !== url) fail(label, `og:url is ${ogUrl}, expected ${url}`);
  for (const prop of ["og:title", "og:description", "og:image"]) {
    if (!document.querySelector(`meta[property="${prop}"]`)?.content) fail(label, `missing ${prop}`);
  }
  const title = document.title;
  const desc = document.querySelector('meta[name="description"]')?.content || "";
  if (titles.has(title)) fail(label, `title duplicates ${titles.get(title)}`);
  if (descriptions.has(desc)) fail(label, `meta description duplicates ${descriptions.get(desc)}`);
  titles.set(title, label);
  descriptions.set(desc, label);
  pass(label, `title (${title.length} chars) "${title}"; description ${desc.length} chars`);

  if (!sitemap.includes(`<loc>${url}</loc>`)) fail(label, "not listed in sitemap.xml");
  else pass(label, "listed in sitemap.xml");

  const body = document.body.cloneNode(true);
  body.querySelectorAll("script, style").forEach(n => n.remove());
  const visible = norm(body.textContent);
  for (const re of BANNED) if (re.test(visible)) fail(label, `visible text matches banned claim ${re}`);
  if (/\d+\s+[A-Z][a-z]+ (Street|St\.|Avenue|Ave\.|Blvd|Road)/.test(visible)) fail(label, "visible text looks like it contains a street address");
  if (!visible.includes("arc@arcsignco.com") || !visible.includes("(917) 569-1076")) fail(label, "missing visible email or phone");

  if (!slug) {
    const biz = blocks.find(b => b["@type"] === "LocalBusiness");
    const same = biz?.sameAs || [];
    for (const u of ["https://www.instagram.com/arcsignco", "https://www.facebook.com/1201574029704014"]) {
      if (!same.includes(u)) fail(label, `LocalBusiness sameAs missing ${u}`);
    }
    if (biz?.["@id"] !== "https://arcsignco.com/#business") fail(label, "LocalBusiness @id is not https://arcsignco.com/#business");
    pass(label, `LocalBusiness sameAs: ${same.join(", ")}`);
    continue;
  }

  const service = blocks.find(b => b["@type"] === "Service");
  if (!service) fail(label, "no Service block");
  else {
    if (service.url !== url) fail(label, `Service url is ${service.url}`);
    if (service.provider?.["@id"] !== "https://arcsignco.com/#business") fail(label, "Service provider @id does not point at the homepage LocalBusiness");
    pass(label, `Service "${service.name}"`);
  }
  const crumbs = blocks.find(b => b["@type"] === "BreadcrumbList");
  if (!crumbs || crumbs.itemListElement?.at(-1)?.item !== url) fail(label, "BreadcrumbList missing or last item is not this page");

  const faq = blocks.find(b => b["@type"] === "FAQPage");
  const items = [...document.querySelectorAll(".faq-item")].map(el => ({
    q: norm(el.querySelector("h3").textContent),
    a: norm([...el.querySelectorAll("p")].map(p => p.textContent).join(" ")),
  }));
  if (!faq) { fail(label, "no FAQPage block"); continue; }
  const ld = faq.mainEntity.map(m => ({ q: norm(m.name), a: norm(m.acceptedAnswer.text) }));
  if (ld.length !== items.length) fail(label, `FAQPage has ${ld.length} questions, page shows ${items.length}`);
  let matched = 0;
  ld.forEach((m, i) => {
    const v = items[i];
    if (!v) return;
    if (m.q !== v.q) fail(label, `FAQ ${i + 1} question differs:\n  schema: ${m.q}\n  page:   ${v.q}`);
    else if (m.a !== v.a) fail(label, `FAQ ${i + 1} answer differs for "${m.q}"`);
    else matched++;
  });
  pass(label, `${matched}/${ld.length} FAQ question+answer pairs match the visible text exactly`);

  const quoteLinks = [...document.querySelectorAll('a[href="/#quote"]')].length;
  if (!quoteLinks) fail(label, "no link to the quote form");
  const extLinks = [...document.querySelectorAll('a[target="_blank"]')];
  if (extLinks.some(a => !(a.rel || "").includes("noopener"))) fail(label, 'a target="_blank" link lacks rel="noopener"');
}

console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
