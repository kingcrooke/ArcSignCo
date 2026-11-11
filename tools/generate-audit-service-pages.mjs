#!/usr/bin/env node
/** Generates new service pages for the site audit PR. Run once from repo root. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templatePath = path.join(root, "construction-signs/index.html");
const template = fs.readFileSync(templatePath, "utf8");

const NAV_EXTRA = `
            <a href="/window-graphics/">Window graphics</a>
            <a href="/vehicle-wraps/">Vehicle wraps</a>
            <a href="/traffic-signs/">Traffic signs</a>
            <a href="/blade-signs/">Blade signs</a>
            <a href="/sign-repair-maintenance/">Sign repair &amp; maintenance</a>
            <a href="/restaurant-storefront-signs/">Restaurant storefront signs</a>
            <a href="/design-consulting/">Design consulting</a>
            <a href="/agencies-institutions/">Agencies &amp; institutions</a>`;

const FOOTER_EXTRA = `
    <a href="/window-graphics/">Window graphics</a>
    <a href="/vehicle-wraps/">Vehicle wraps</a>
    <a href="/traffic-signs/">Traffic signs</a>
    <a href="/blade-signs/">Blade signs</a>
    <a href="/sign-repair-maintenance/">Sign repair &amp; maintenance</a>
    <a href="/restaurant-storefront-signs/">Restaurant storefront signs</a>
    <a href="/design-consulting/">Design consulting</a>
    <a href="/agencies-institutions/">Agencies &amp; institutions</a>`;

function injectNav(html) {
  if (html.includes("/vehicle-wraps/")) return html;
  return html.replace(
    `<a href="/winter-enclosures/">Winter enclosures</a>\n          </div>`,
    `<a href="/winter-enclosures/">Winter enclosures</a>${NAV_EXTRA}\n          </div>`,
  ).replace(
    `<a href="/winter-enclosures/">Winter enclosures</a>\n  </nav>`,
    `<a href="/winter-enclosures/">Winter enclosures</a>${FOOTER_EXTRA}\n  </nav>`,
  );
}

const pages = [
  {
    slug: "vehicle-wraps",
    title: "Vehicle Wraps NYC | Arc Signage Co",
    meta: "Vehicle wraps and fleet graphics for New York / Tri-State: layout, vinyl specs, and install coordination through licensed partners. Send photos and vehicle dimensions for a quote.",
    h1: "Vehicle wraps and fleet graphics for New York / Tri-State",
    eyebrow: "Vehicle Wraps | New York / Tri-State",
    crumb: "Vehicle wraps",
    serviceName: "Vehicle wraps and fleet graphics",
    serviceDesc:
      "Layout, print-ready artwork, and install coordination for vehicle wraps, partial wraps, and fleet lettering in New York / Tri-State. Production and installation are through Arc's licensed partners. Arc does not file permits or stamp drawings.",
    answer:
      "Arc plans wrap layouts from your logo and vehicle dimensions, prepares print files, and coordinates application through licensed install partners. Arc does not claim DOT fleet certification or perform on-road regulatory marking unless scoped separately as traffic signage.",
    glance: ["Full and partial vehicle wraps", "Fleet lettering and numbering", "Window perf and spot graphics", "Print file prep and color proofs", "Install scheduling through partners"],
    faqs: [
      {
        q: "Does Arc install vehicle wraps?",
        a: "Application is through Arc's licensed partners. Arc handles design, file prep, and coordination with the shop doing the install.",
      },
      {
        q: "What should I send for a wrap quote?",
        a: "Send vehicle make and model, photos of each side, any existing graphics to remove, your logo files, and the project street address or fleet yard location. Email arc@arcsignco.com with the address in the subject line.",
      },
      {
        q: "Can Arc wrap a food truck or delivery fleet?",
        a: "Yes, when dimensions and artwork are available. Arc scopes each vehicle separately unless you provide a fleet count and schedule.",
      },
    ],
    ctaH2: "Planning a vehicle wrap or fleet rebrand?",
  },
  {
    slug: "traffic-signs",
    title: "Traffic & Regulatory Signs NYC | Arc Signage Co",
    meta: "Traffic, parking, and regulatory signs for New York / Tri-State properties: layout to MUTCD-style conventions, fabrication through partners. No claim of DOT approval.",
    h1: "Traffic, parking, and regulatory signs for private sites",
    eyebrow: "Traffic Signs | New York / Tri-State",
    crumb: "Traffic signs",
    serviceName: "Traffic and regulatory signage",
    serviceDesc:
      "Parking, traffic control, and regulatory signs laid out to common MUTCD-style conventions for private property and site plans in New York / Tri-State. Fabrication and installation through Arc's licensed partners. Arc is not a DOT-certified sign manufacturer and does not claim agency approval.",
    answer:
      "Arc lays out regulatory and directional signs from your site plan or parking count, prepares shop drawings when needed, and coordinates fabrication and posting through licensed partners. Public-road authority signs and agency approvals stay with the project's engineer or traffic consultant.",
    glance: ["Parking and garage signs", "Private-road speed and stop signs", "Loading zone and truck route signs", "Reflective sheeting specs", "Mounting details for GC review"],
    faqs: [
      {
        q: "Does Arc provide DOT-approved highway signs?",
        a: "Arc does not claim NYSDOT or NYC DOT certification. Arc can produce regulatory-style signs for private property when your traffic engineer or architect specifies layouts.",
      },
      {
        q: "What reflective sheeting do you use?",
        a: "Sheeting grade follows the project spec or Arc's shop default for the application. Confirm with the specifier before ordering.",
      },
      {
        q: "Who installs traffic signs on site?",
        a: "Installation is through Arc's licensed partners or the GC's trade, depending on the contract. Arc coordinates mounting details in the shop drawings.",
      },
    ],
    ctaH2: "Need parking or site regulatory signs?",
  },
  {
    slug: "sign-repair-maintenance",
    title: "Sign Repair & Maintenance NYC | Arc Signage Co",
    meta: "Sign repair, service calls, and maintenance coordination for New York / Tri-State: relamps, face replacements, and structural checks through licensed partners.",
    h1: "Sign repair and maintenance coordination",
    eyebrow: "Sign Repair | New York / Tri-State",
    crumb: "Sign repair & maintenance",
    serviceName: "Sign repair and maintenance",
    serviceDesc:
      "Service calls for illuminated signs, face replacements, relamping, and minor structural repairs in New York / Tri-State, coordinated through Arc's licensed partners. Arc does not file permits or perform electrical work.",
    answer:
      "Arc reviews photos or site visits, scopes parts and access, and coordinates repair with licensed sign hangers and electricians as the job requires. Permit needs depend on what is being changed; Arc flags that during intake.",
    glance: ["Relamping and power checks", "Face and letter replacements", "Cabinet and raceway repairs", "Storm or vandalism damage triage", "Maintenance schedules for portfolios"],
    faqs: [
      {
        q: "Can Arc fix a sign the same week?",
        a: "Timing depends on parts, access, and permits. Put URGENT in the email subject for active storefronts. Arc's 24-hour quote target starts once Arc has photos and the project street address.",
      },
      {
        q: "Does Arc service signs Arc did not fabricate?",
        a: "Often yes, when parts can be matched or remade from photos and measurements. Send straight-on photos and any existing shop drawings.",
      },
      {
        q: "Who handles electrical on a repair?",
        a: "A licensed electrician makes connections and files electrical permits when required. Arc coordinates the handoff.",
      },
    ],
    ctaH2: "Need a sign repaired or relamped?",
  },
  {
    slug: "restaurant-storefront-signs",
    title: "Restaurant Storefront Signs NYC | Arc Signage Co",
    meta: "Restaurant and hospitality storefront signs for New York / Tri-State: channel letters, blades, window graphics, and awnings with permit coordination.",
    h1: "Restaurant and hospitality storefront signage",
    eyebrow: "Restaurant Storefronts | New York / Tri-State",
    crumb: "Restaurant storefront signs",
    serviceName: "Restaurant and hospitality storefront signage",
    serviceDesc:
      "Storefront packages for restaurants, cafes, and bars in New York / Tri-State: channel letters, blades, window graphics, menus boards, and awning graphics with landlord and DOB coordination. Fabrication and installation through Arc's licensed partners.",
    answer:
      "Arc bundles exterior identity for food and beverage tenants: lit letters, blades, vinyl, and awning layouts aligned to lease sign criteria. Arc prepares shop drawings in-house and coordinates permits with the licensed applicant.",
    glance: ["Channel letters and lightboxes", "Blade and projecting signs", "Window and door vinyl", "Awning and valance graphics", "Landlord and LPC coordination"],
    faqs: [
      {
        q: "Can Arc match my brand book?",
        a: "Send logo files, Pantone or paint references, and landlord criteria. Arc lays out to those specs for architect or landlord review.",
      },
      {
        q: "Do restaurant signs need permits in NYC?",
        a: "Most exterior illuminated signs need DOB sign permits and electrical permits. Arc coordinates with the licensed applicant; agencies decide approvals.",
      },
      {
        q: "What should I send for a quote?",
        a: "Facade photos with measurements, logo files, lease sign criteria, desired open date, and the street address. Email arc@arcsignco.com with the address in the subject line.",
      },
    ],
    ctaH2: "Opening or rebranding a restaurant storefront?",
  },
  {
    slug: "blade-signs",
    title: "Blade Signs NYC | Arc Signage Co",
    meta: "Blade and projecting storefront signs for New York / Tri-State: layout, shop drawings, and install coordination through licensed partners.",
    h1: "Blade and projecting signs for storefronts",
    eyebrow: "Blade Signs | New York / Tri-State",
    crumb: "Blade signs",
    serviceName: "Blade and projecting signs",
    serviceDesc:
      "Blade, projecting, and flag-mounted storefront signs for New York / Tri-State: design, shop drawings, and coordination with Licensed Sign Hangers and electricians through Arc's partners.",
    answer:
      "Arc designs blades to zoning set-back and landlord rules, prepares shop drawings in-house, and coordinates structural attachment and illumination with licensed partners. Projecting signs often need annual illuminated sign permits when they extend beyond the building line.",
    glance: ["Flat and lit blade signs", "Double-sided blades", "Flag and bracket mounts", "Illuminated cabinet blades", "LPC and landlord submittals"],
    faqs: [
      {
        q: "Do blade signs need a sign hanger in NYC?",
        a: "Exterior installation generally requires a Licensed Sign Hanger under §28-415. Arc coordinates with a licensed partner.",
      },
      {
        q: "How deep can a blade project?",
        a: "Zoning and landlord criteria set projection limits. Send the street address and facade photos so Arc can review the district rules early.",
      },
      {
        q: "Can blades be non-lit?",
        a: "Yes. Non-illuminated blades may qualify for simpler permit paths when size limits are met; zoning still applies.",
      },
    ],
    ctaH2: "Planning a blade or projecting sign?",
  },
  {
    slug: "design-consulting",
    title: "Sign Design Consulting NYC | Arc Signage Co",
    meta: "Sign design consulting for New York / Tri-State architects and owners: sign programs, message schedules, and review support without fabrication promises.",
    h1: "Sign design consulting and program support",
    eyebrow: "Design Consulting | New York / Tri-State",
    crumb: "Design consulting",
    serviceName: "Sign design consulting",
    serviceDesc:
      "Consulting on sign programs, message schedules, and design review support for architects, owners, and GCs in New York / Tri-State. Deliverables are drawings and schedules for your team to bid or build; fabrication and install are scoped separately through partners when needed.",
    answer:
      "Arc helps teams that already have an architect or GC define sign types, messages, and mounting intent before bid. Arc does not stamp structural drawings unless scoped as shop drawings with a third-party PE when required.",
    glance: ["Sign type and message schedules", "Design intent drawings", "Code and ADA routing review", "Bid package support", "Value engineering sessions"],
    faqs: [
      {
        q: "Is consulting separate from fabrication?",
        a: "Yes. Consulting deliverables are documents for review. Fabrication and install are quoted separately if Arc continues on the job.",
      },
      {
        q: "Can Arc join owner/architect meetings?",
        a: "Yes, when scheduled in advance. Remote review of PDF markups is also available.",
      },
      {
        q: "What is not included?",
        a: "Arc does not file permits, stamp PE drawings, or guarantee agency approval in a consulting-only scope.",
      },
    ],
    ctaH2: "Need sign program support before bid?",
  },
  {
    slug: "agencies-institutions",
    title: "Agencies & Institutions Signage NYC | Arc Signage Co",
    meta: "Signage for agencies, foundations, hospitals, and campuses in New York / Tri-State: wayfinding, ADA, donor recognition, and exterior identity.",
    h1: "Signage for agencies, institutions, and campuses",
    eyebrow: "Agencies & Institutions | New York / Tri-State",
    crumb: "Agencies & institutions",
    serviceName: "Agency and institutional signage",
    serviceDesc:
      "Wayfinding, ADA, donor recognition, and exterior identity packages for hospitals, foundations, schools, and public agencies in New York / Tri-State. Arc coordinates multi-phase rollouts with GCs and owner's reps.",
    answer:
      "Arc supports institutional teams with sign schedules, room ID packages, directories, and exterior identity coordinated to brand and accessibility requirements. Fabrication and installation are through licensed partners; Arc does not file permits or stamp drawings.",
    glance: ["Campus wayfinding", "Healthcare ADA packages", "Donor walls and recognition", "Exterior identity and directories", "Phased rollout planning"],
    faqs: [
      {
        q: "Can Arc work from an architect's sign schedule?",
        a: "Yes. Send the schedule, floor plans, and spec section. Arc clarifies mounting and messaging before shop drawings.",
      },
      {
        q: "Do you handle phased hospital wings?",
        a: "Arc can phase shop drawing and production batches to match construction milestones when dates are provided.",
      },
      {
        q: "What about security or restricted areas?",
        a: "Message content comes from the owner. Arc produces to approved schedules only.",
      },
    ],
    ctaH2: "Planning an institutional signage package?",
  },
];

function buildPage(p) {
  let html = template;
  html = html.replace(/https:\/\/arcsignco\.com\/construction-signs\//g, `https://arcsignco.com/${p.slug}/`);
  html = html.replace(/\/construction-signs\//g, `/${p.slug}/`);
  html = html.replace(/Construction Site Signs NYC \| Arc Signage Co/g, p.title);
  html = html.replace(
    /NYC construction site signs: project information panels, sidewalk shed parapet panels, safety, directional, and project ID signs\. Send site details to quote\./g,
    p.meta,
  );
  html = html.replace(/Construction site signs/g, p.crumb);
  html = html.replace(/Construction Signs \| New York \/ Tri-State/g, p.eyebrow);
  html = html.replace(
    /Jobsite and temporary signage for New York construction projects/g,
    p.h1,
  );
  html = html.replace(
    /<p class="answer">[\s\S]*?<\/p>\s*<div class="hero-actions"/,
    `<p class="answer">${p.answer}</p>\n        <div class="hero-actions"`,
  );
  html = html.replace(
    /"name": "Construction and temporary site signage"[\s\S]*?"serviceType": "Construction and temporary site signage"[\s\S]*?"description": "[^"]+"/,
    `"name": "${p.serviceName}"\n  "serviceType": "${p.serviceName}"\n  "description": "${p.serviceDesc.replace(/"/g, '\\"')}"`,
  );
  html = html.replace(
    /<h2 id="glance-title">What Arc handles<\/h2>\s*<ul>[\s\S]*?<\/ul>/,
    `<h2 id="glance-title">What Arc handles</h2>\n        <ul>\n          ${p.glance.map(li => `<li>${li}</li>`).join("\n          ")}\n        </ul>`,
  );
  const faqLd = p.faqs
    .map(
      f =>
        `    {\n      "@type": "Question",\n      "name": ${JSON.stringify(f.q)},\n      "acceptedAnswer": { "@type": "Answer", "text": ${JSON.stringify(f.a)} }\n    }`,
    )
    .join(",\n");
  html = html.replace(
    /"mainEntity": \[[\s\S]*?\]\s*\}\s*\}\s*<\/script>\s*<!-- ANALYTICS/,
    `"mainEntity": [\n${faqLd}\n  ]\n}\n</script>\n<!-- ANALYTICS`,
  );
  html = html.replace(
    /<div class="faq">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>\s*<section class="section alt" id="sources">/,
    `<div class="faq">\n        ${p.faqs
      .map(
        f =>
          `<article class="faq-item"><h3>${f.q}</h3><p>${f.a}</p></article>`,
      )
      .join("\n        ")}\n      </div>\n    </div>\n  </section>\n\n  <section class="section alt" id="sources">`,
  );
  html = html.replace(/Planning a lit storefront sign\?/g, p.ctaH2);
  html = html.replace(/Construction site sign questions/g, `${p.crumb} questions`);
  html = injectNav(html);
  html = html.replace(
    /const gbpLink = document.getElementById\("gbpLink"\);[\s\S]*?gbpLink.hidden = false;/,
    `const cfg = window.ARC_SITE_CONFIG || {};
const gbpLink = document.getElementById("gbpLink");
const gbpUrl = (cfg.gbpUrl || "").trim();
if (gbpLink && /^https:\\/\\//.test(gbpUrl)) { gbpLink.href = gbpUrl; gbpLink.hidden = false; }`,
  );
  if (!html.includes("arc-site-config.js")) {
    html = html.replace(
      "</head>",
      `<script src="/assets/js/arc-site-config.js"></script>\n</head>`,
    );
  }
  html = html.replace(/<span>&copy; 2026 Arc Signage Co LLC/g, `<span>&copy; 2026 Arc Signage Co. LLC`);
  return html;
}

for (const p of pages) {
  const dir = path.join(root, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), buildPage(p));
  console.log("wrote", p.slug);
}

// Patch all existing service pages nav (simple string insert once)
const serviceDirs = fs.readdirSync(root, { withFileTypes: true })
  .filter(d => d.isDirectory() && fs.existsSync(path.join(root, d.name, "index.html")))
  .map(d => d.name)
  .filter(n => !["apps", "netlify", "tools", "assets", "docs", "node_modules"].includes(n) && !n.includes("-"));

for (const dir of serviceDirs) {
  const file = path.join(root, dir, "index.html");
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, "utf8");
  const next = injectNav(html);
  if (next !== html) {
    fs.writeFileSync(file, next);
    console.log("nav", dir);
  }
}
