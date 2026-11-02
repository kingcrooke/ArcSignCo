#!/usr/bin/env node
/** Sync service nav/footer lists and common footer strings across marketing HTML. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NAV_BLOCK = `<a href="/sign-permits-shop-drawings/">Sign permits &amp; shop drawings</a>
            <a href="/ada-signs/">ADA &amp; tactile signs</a>
            <a href="/channel-letters/">Channel letters</a>
            <a href="/construction-signs/">Construction site signs</a>
            <a href="/wayfinding-signs/">Interior wayfinding</a>
            <a href="/digital-signage/">Digital signage</a>
            <a href="/awnings/">Storefront awnings</a>
            <a href="/winter-enclosures/">Winter enclosures</a>
            <a href="/window-graphics/">Window graphics</a>
            <a href="/vehicle-wraps/">Vehicle wraps</a>
            <a href="/traffic-signs/">Traffic signs</a>
            <a href="/blade-signs/">Blade signs</a>
            <a href="/sign-repair-maintenance/">Sign repair &amp; maintenance</a>
            <a href="/restaurant-storefront-signs/">Restaurant storefront signs</a>
            <a href="/design-consulting/">Design consulting</a>
            <a href="/agencies-institutions/">Agencies &amp; institutions</a>`;

const FOOTER_NAV = NAV_BLOCK.replace(/^            /gm, "    ");

const files = [
  "index.html",
  "portfolio.html",
  "thank-you.html",
  "404.html",
  "tools/sign-mockup/index.html",
  "tools/sign-mockup/proof/index.html",
  ...[
    "sign-permits-shop-drawings",
    "ada-signs",
    "channel-letters",
    "construction-signs",
    "wayfinding-signs",
    "digital-signage",
    "awnings",
    "winter-enclosures",
    "window-graphics",
    "vehicle-wraps",
    "traffic-signs",
    "blade-signs",
    "sign-repair-maintenance",
    "restaurant-storefront-signs",
    "design-consulting",
    "agencies-institutions",
  ].map(s => `${s}/index.html`),
];

for (const rel of files) {
  const fp = path.join(root, rel);
  if (!fs.existsSync(fp)) continue;
  let html = fs.readFileSync(fp, "utf8");
  let orig = html;
  html = html.replace(/Arc Signage Co LLC/g, "Arc Signage Co. LLC");
  html = html.replace(
    /<div class="nav-services-sub" aria-label="Service pages">[\s\S]*?<\/div>/,
    `<div class="nav-services-sub" aria-label="Service pages">\n            ${NAV_BLOCK}\n          </div>`,
  );
  html = html.replace(
    /<nav class="wrap footer-services" aria-label="Service pages">\s*<span>Services<\/span>[\s\S]*?<\/nav>/,
    `<nav class="wrap footer-services" aria-label="Service pages">\n    <span>Services</span>\n    ${FOOTER_NAV}\n  </nav>`,
  );
  if (!html.includes("arc-site-config.js") && html.includes('id="gbpLink"')) {
    html = html.replace("</head>", `<script src="/assets/js/arc-site-config.js"></script>\n</head>`);
    html = html.replace(
      /const gbpLink = document\.getElementById\("gbpLink"\);[\s\S]*?gbpLink\.hidden = false;/,
      `const cfg = window.ARC_SITE_CONFIG || {};
const gbpLink = document.getElementById("gbpLink");
const gbpUrl = (cfg.gbpUrl || "").trim();
if (gbpLink && /^https:\\/\\//.test(gbpUrl)) { gbpLink.href = gbpUrl; gbpLink.hidden = false; }`,
    );
  }
  if (html !== orig) {
    fs.writeFileSync(fp, html);
    console.log("patched", rel);
  }
}
