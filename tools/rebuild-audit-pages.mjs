#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const template = fs.readFileSync(path.join(root, "ada-signs/index.html"), "utf8");

const NAV_EXTRA = `
            <a href="/window-graphics/">Window graphics</a>
            <a href="/vehicle-wraps/">Vehicle wraps</a>
            <a href="/traffic-signs/">Traffic signs</a>
            <a href="/blade-signs/">Blade signs</a>
            <a href="/sign-repair-maintenance/">Sign repair &amp; maintenance</a>
            <a href="/restaurant-storefront-signs/">Restaurant storefront signs</a>
            <a href="/design-consulting/">Design consulting</a>
            <a href="/agencies-institutions/">Agencies &amp; institutions</a>`;

function injectNav(html) {
  if (html.includes("/agencies-institutions/")) return html;
  return html
    .replace(
      `<a href="/winter-enclosures/">Winter enclosures</a>\n          </div>`,
      `<a href="/winter-enclosures/">Winter enclosures</a>${NAV_EXTRA}\n          </div>`,
    )
    .replace(
      `<a href="/winter-enclosures/">Winter enclosures</a>\n  </nav>`,
      `<a href="/winter-enclosures/">Winter enclosures</a>${NAV_EXTRA.replace(/^            /gm, "    ")}\n  </nav>`,
    );
}

const pages = JSON.parse(fs.readFileSync(path.join(root, "tools/audit-service-pages.json"), "utf8"));

function patch(html, p) {
  const base = "https://arcsignco.com/ada-signs/";
  const url = `https://arcsignco.com/${p.slug}/`;
  html = html.split(base).join(url);
  html = html.split("/ada-signs/").join(`/${p.slug}/`);
  html = html.replace(/ADA &amp; Tactile Signs NYC \| Arc Signage Co/g, p.title);
  html = html.replace(/ADA & tactile signs/g, p.crumb);
  html = html.replace(/ADA Signs \| New York \/ Tri-State/g, p.eyebrow);
  html = html.replace(
    /NYC ADA signage: room IDs, restroom signs, stair and exit signs with tactile text and Grade 2 Braille\. Send drawings or a sign schedule for a quote\./g,
    p.meta,
  );
  html = html.replace(
    /ADA room identification, restroom, stair, exit, and tactile signs for New York buildouts/g,
    p.h1,
  );
  html = html.replace(
    /<p class="answer">[\s\S]*?<\/p>\s*<div class="hero-actions"/,
    `<p class="answer">${p.answer}</p>\n        <div class="hero-actions"`,
  );
  html = html.replace(/"name": "ADA and tactile signage"[\s\S]*?"description": "[^"]+"/,
    `"name": ${JSON.stringify(p.serviceName)}\n  "serviceType": ${JSON.stringify(p.serviceName)}\n  "description": ${JSON.stringify(p.serviceDesc)}`);
  html = html.replace(/ADA and tactile signage/g, p.serviceName);
  html = html.replace(/ADA sign questions/g, p.faqTitle);
  html = html.replace(/Planning an ADA package\?/g, p.ctaH2);
  html = html.replace(
    /Email drawings or a sign schedule to arc@arcsignco\.com with the project address in the subject line\. No files yet\? Use the quote form\./,
    p.ctaP,
  );
  const faqJson = p.faqs.map(([q, a]) =>
    `    {\n      "@type": "Question",\n      "name": ${JSON.stringify(q)},\n      "acceptedAnswer": { "@type": "Answer", "text": ${JSON.stringify(a)} }\n    }`).join(",\n");
  html = html.replace(/"mainEntity": \[[\s\S]*?\n  \]\n\}\n<\/script>\n<!-- ANALYTICS/,
    `"mainEntity": [\n${faqJson}\n  ]\n}\n</script>\n<!-- ANALYTICS`);
  const faqHtml = p.faqs.map(([q, a]) => `<article class="faq-item"><h3>${q}</h3><p>${a}</p></article>`).join("\n        ");
  html = html.replace(/<div class="faq">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>\s*\n\s*<section class="section alt" id="sources">/,
    `<div class="faq">\n        ${faqHtml}\n      </div>\n    </div>\n  </section>\n\n  <section class="section alt" id="sources">`);
  html = html.replace(/<span>&copy; 2026 Arc Signage Co LLC/g, `<span>&copy; 2026 Arc Signage Co. LLC`);
  html = injectNav(html);
  if (!html.includes("arc-site-config.js")) {
    html = html.replace("</head>", `<script src="/assets/js/arc-site-config.js"></script>\n</head>`);
  }
  html = html.replace(
    /const gbpLink = document.getElementById\("gbpLink"\);[\s\S]*?gbpLink.hidden = false;/,
    `const cfg = window.ARC_SITE_CONFIG || {};
const gbpLink = document.getElementById("gbpLink");
const gbpUrl = (cfg.gbpUrl || "").trim();
if (gbpLink && /^https:\\/\\//.test(gbpUrl)) { gbpLink.href = gbpUrl; gbpLink.hidden = false; }`,
  );
  return html;
}

for (const p of pages) {
  fs.mkdirSync(path.join(root, p.slug), { recursive: true });
  fs.writeFileSync(path.join(root, p.slug, "index.html"), patch(template, p));
  console.log(p.slug);
}

// Nav inject all marketing pages
for (const ent of fs.readdirSync(root, { withFileTypes: true })) {
  if (!ent.isDirectory()) continue;
  const fp = path.join(root, ent.name, "index.html");
  if (!fs.existsSync(fp)) continue;
  if (["apps", "tools", "netlify", "assets", "docs", "node_modules", "gwb-fe006a16", "dynasty-1581d86a", "guarderia-dfe200bb", "novastage-2c397e45", "crooke-7c3a9e12"].includes(ent.name)) continue;
  let html = fs.readFileSync(fp, "utf8");
  const next = injectNav(html);
  if (next !== html) fs.writeFileSync(fp, next);
}
