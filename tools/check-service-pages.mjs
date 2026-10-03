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
export const SERVICE_SLUGS = ["sign-permits-shop-drawings", "ada-signs", "channel-letters", "construction-signs", "wayfinding-signs", "awnings"];
const pages = [{ slug: "", file: "index.html" }, ...SERVICE_SLUGS.map(slug => ({ slug, file: `${slug}/index.html` }))];

const BUSINESS_ID = "https://arcsignco.com/#business";
const APPROVED_ADDRESS = {
  addressRegion: "NY",
  addressCountry: "US",
};
const FORBIDDEN_ADDRESS_KEYS = ["streetAddress", "addressLocality", "postalCode"];

// Claims the site must not make (case-insensitive, visible text only).
const BANNED = [
  /ada[- ]compliant/i, /fully compliant/i, /(?<!(not|n't|no) )guarantee/i, /\bcertified\b/i, /dob[- ]approved/i,
  /we (pull|file) (dob|the) permits?/i, /\bour license\b/i, /\bwe are (a )?licensed/i, /stamped by arc/i,
  /opening ?hours/i, /\breviews?\b.*\bstars?\b/i, /years in business/i, /83 Post Ave/i,
  /Apt\s*A/i, /one-person/i, /\bone person\b/i,
  /Verify before publishing/i, /Pending Sales Ops and copy editor review/i,
];
const EDITOR_NOTE_SCAN = [/Verify before publishing/gi];
const FORBIDDEN_LD_KEYS_SERVICE = ["address", "streetAddress", "openingHours", "openingHoursSpecification", "aggregateRating", "review"];

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

function flattenLd(blocks) {
  const nodes = [];
  for (const b of blocks) {
    if (!b) continue;
    if (Array.isArray(b["@graph"])) nodes.push(...b["@graph"]);
    else nodes.push(b);
  }
  return nodes;
}

function addressMatches(node) {
  const a = node?.address;
  if (!a || a["@type"] !== "PostalAddress") return false;
  if (FORBIDDEN_ADDRESS_KEYS.some(k => k in a)) return false;
  return Object.entries(APPROVED_ADDRESS).every(([k, v]) => a[k] === v);
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

  const nodes = flattenLd(blocks);
  const keys = walkKeys(blocks);
  if (slug) {
    const bad = FORBIDDEN_LD_KEYS_SERVICE.filter(k => keys.includes(k));
    if (bad.length) fail(label, `JSON-LD contains forbidden keys: ${bad.join(", ")}`);
    else pass(label, "JSON-LD has no address, hours, ratings, or reviews");
  } else {
    if (keys.includes("openingHours") || keys.includes("openingHoursSpecification") || keys.includes("aggregateRating") || keys.includes("review")) {
      fail(label, "JSON-LD contains forbidden keys: hours or ratings");
    }
    const ldText = JSON.stringify(blocks);
    if (/83 Post Ave/i.test(ldText)) fail(label, "JSON-LD contains forbidden address 83 Post Ave");
    if (/1974 Crotona/i.test(ldText)) fail(label, "JSON-LD contains forbidden street address 1974 Crotona Ave");
    if (keys.includes("streetAddress")) fail(label, "JSON-LD contains forbidden key streetAddress");
    if (/Apt\s*A/i.test(ldText)) fail(label, "JSON-LD contains forbidden Apt A in address");
    const biz = nodes.find(n => n["@id"] === BUSINESS_ID);
    if (!biz) fail(label, `no JSON-LD node with @id ${BUSINESS_ID}`);
    else if (!addressMatches(biz)) fail(label, "homepage business address does not match approved PostalAddress");
    else pass(label, "homepage JSON-LD has approved schema-only PostalAddress");
  }

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
  for (const re of EDITOR_NOTE_SCAN) if (re.test(html)) fail(label, `page HTML contains editor note ${re}`);
  if (/\d+\s+[A-Z][a-z]+ (Street|St\.|Avenue|Ave\.|Blvd|Road)/.test(visible)) fail(label, "visible text looks like it contains a street address");
  if (!visible.includes("arc@arcsignco.com") || !visible.includes("jc@arcsignco.com") || !visible.includes("(347) 450-2110")) fail(label, "missing visible email or phone");
  if (visible.includes("+13474502110")) fail(label, "visible text contains raw E.164 phone");
  if (slug && !visible.includes("Hours: Mon–Fri 8 AM–6 PM")) fail(label, "missing contact-strip hours");
  if (slug && !/Call or text \(347\) 450-2110/.test(visible)) fail(label, "nav/hero/mobile call wording missing");

  const faq = nodes.find(b => b["@type"] === "FAQPage");
  const items = [...document.querySelectorAll(".faq-item")].map(el => ({
    q: norm(el.querySelector("h3").textContent),
    a: norm([...el.querySelectorAll("p")].map(p => p.textContent).join(" ")),
  }));

  if (!slug) {
    const biz = nodes.find(n => n["@id"] === BUSINESS_ID);
    const same = biz?.sameAs || [];
    for (const u of ["https://www.instagram.com/arcsignco", "https://www.facebook.com/1201574029704014"]) {
      if (!same.includes(u)) fail(label, `business sameAs missing ${u}`);
    }
    if (biz?.["@type"] !== "ProfessionalService") fail(label, "business @type is not ProfessionalService");
    pass(label, `ProfessionalService sameAs: ${same.join(", ")}`);
  } else {
    const service = nodes.find(b => b["@type"] === "Service");
    if (!service) fail(label, "no Service block");
    else {
      if (service.url !== url) fail(label, `Service url is ${service.url}`);
      if (service.provider?.["@id"] !== BUSINESS_ID) fail(label, "Service provider @id does not point at the homepage business");
      if ((slug === "wayfinding-signs" || slug === "awnings") && service.provider?.email !== "jc@arcsignco.com") {
        fail(label, `Service provider email should be jc@arcsignco.com, got ${service.provider?.email}`);
      }
      pass(label, `Service "${service.name}"`);
    }
    const crumbs = nodes.find(b => b["@type"] === "BreadcrumbList");
    if (!crumbs || crumbs.itemListElement?.at(-1)?.item !== url) fail(label, "BreadcrumbList missing or last item is not this page");
  }

  if (!faq) { fail(label, "no FAQPage block"); }
  else if (!items.length) { fail(label, "FAQPage block but no visible .faq-item elements"); }
  else {
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
  }

  if (slug) {
    const quoteLinks = [...document.querySelectorAll('a[href="/#quote"]')].length;
    if (!quoteLinks) fail(label, "no link to the quote form");
    const extLinks = [...document.querySelectorAll('a[target="_blank"]')];
    if (extLinks.some(a => !(a.rel || "").includes("noopener"))) fail(label, 'a target="_blank" link lacks rel="noopener"');
  }

  if (slug === "wayfinding-signs" || slug === "awnings") {
    if (/awning permit nyc/i.test(visible) || /awning permit nyc/i.test(html)) {
      fail(label, 'page targets the keyword "awning permit NYC"');
    } else pass(label, 'does not target "awning permit NYC"');
    const hrefs = new Set([...document.querySelectorAll("a")].map(a => a.getAttribute("href")));
    const required = slug === "awnings"
      ? ["/sign-permits-shop-drawings/", "/channel-letters/", "/ada-signs/", "/wayfinding-signs/", "/construction-signs/", "/#quote", "/tools/sign-mockup/"]
      : ["/ada-signs/", "/sign-permits-shop-drawings/", "/channel-letters/", "/awnings/", "/construction-signs/", "/#quote"];
    const missing = required.filter(href => !hrefs.has(href));
    if (missing.length) fail(label, `missing internal links: ${missing.join(", ")}`);
    else pass(label, "required internal links are present");
    const expected = {
      "wayfinding-signs": {
        title: "Interior Wayfinding NYC | Arc Signage Co",
        description: "Interior wayfinding signs for New York buildouts: lobby directories, floor IDs, room signs, and directional packages. Send plans or a schedule for a quote.",
        h1: "Interior wayfinding and directory packages for New York buildouts",
      },
      awnings: {
        title: "Storefront Awnings NYC | Arc Signage Co",
        description: "Storefront awnings for New York: layout, recover, sign text, shop drawings, and permit coordination. Send photos, dimensions, or drawings for a quote.",
        h1: "Storefront awnings, recover, and sign layouts for New York",
      },
    }[slug];
    if (title !== expected.title) fail(label, `title is not the approved tag: ${title}`);
    if (desc !== expected.description) fail(label, `meta description is not the approved text: ${desc}`);
    const h1 = norm(document.querySelector("h1")?.textContent || "");
    if (h1 !== expected.h1) fail(label, `h1 is not the approved heading: ${h1}`);
    else pass(label, "title, meta description, and h1 match the brief");
  }
}

if (sitemap.includes("sign-mockup/proof")) fail("sitemap", "proof pages are listed");
else pass("sitemap", "proof pages are not listed");
const homeNav = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const href of ["/wayfinding-signs/", "/awnings/"]) {
  if (!homeNav.includes(`href="${href}"`)) fail("/", `homepage missing link to ${href}`);
}
pass("/", "homepage links to both new service pages");

console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
