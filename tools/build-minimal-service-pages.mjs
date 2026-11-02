#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pages = JSON.parse(fs.readFileSync(path.join(root, "tools/audit-service-pages.json"), "utf8"));

const NAV = `
            <a href="/sign-permits-shop-drawings/">Sign permits &amp; shop drawings</a>
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

function pageHtml(p) {
  const url = `https://arcsignco.com/${p.slug}/`;
  const faqJson = p.faqs
    .map(
      ([q, a]) =>
        `    {\n      "@type": "Question",\n      "name": ${JSON.stringify(q)},\n      "acceptedAnswer": { "@type": "Answer", "text": ${JSON.stringify(a)} }\n    }`,
    )
    .join(",\n");
  const faqHtml = p.faqs
    .map(([q, a]) => `<article class="faq-item"><h3>${q}</h3><p>${a}</p></article>`)
    .join("\n        ");
  const cards = (p.cards || [
    ["Scope", "Layout and shop drawings in-house when the job needs them."],
    ["Partners", "Fabrication and installation through Arc's licensed partners."],
    ["Coordination", "Permit information coordinated with the licensed applicant. Arc does not file permits or stamp drawings."],
  ])
    .map(([h, t]) => `<article class="info-card"><h3>${h}</h3><p>${t}</p></article>`)
    .join("\n        ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${p.title}</title>
<meta name="description" content="${p.meta}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#0b1d33">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Arc Signage Co">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.meta}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="https://arcsignco.com/assets/img/og-image-1200x630.v1.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Arc Signage Co: full-service signage for New York / Tri-State">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
<link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/css/service-page.v6.css">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "${url}#service",
  "name": ${JSON.stringify(p.serviceName)},
  "serviceType": ${JSON.stringify(p.serviceName)},
  "description": ${JSON.stringify(p.serviceDesc)},
  "url": "${url}",
  "provider": {
    "@type": "ProfessionalService",
    "@id": "https://arcsignco.com/#business",
    "name": "Arc Signage Co",
    "url": "https://arcsignco.com/",
    "telephone": "+1-347-450-2110",
    "email": "jc@arcsignco.com"
  },
  "areaServed": [
    { "@type": "State", "name": "New York" },
    { "@type": "State", "name": "New Jersey" },
    { "@type": "State", "name": "Connecticut" }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://arcsignco.com/" },
    { "@type": "ListItem", "position": 2, "name": ${JSON.stringify(p.crumb)}, "item": "${url}" }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
${faqJson}
  ]
}
</script>
<script src="/assets/js/arc-site-config.js"></script>
</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>
<header class="topbar">
  <div class="wrap nav">
    <a class="brand" href="/" aria-label="Arc Signage Co home">
      <picture>
        <source type="image/webp" srcset="/assets/img/logo-lockup-white-280.v2.webp 280w, /assets/img/logo-lockup-white-360.v2.webp 360w, /assets/img/logo-lockup-white-560.v2.webp 560w, /assets/img/logo-lockup-white-847.v2.webp 847w" sizes="(max-width: 720px) 168px, 265px">
        <img class="brand-logo" src="/assets/img/logo-lockup-white-560.v2.png" srcset="/assets/img/logo-lockup-white-280.v2.png 280w, /assets/img/logo-lockup-white-360.v2.png 360w, /assets/img/logo-lockup-white-560.v2.png 560w, /assets/img/logo-lockup-white-847.v2.png 847w" sizes="(max-width: 720px) 168px, 265px" width="847" height="174" alt="Arc Signage Co">
      </picture>
    </a>
    <nav class="navlinks" aria-label="Primary navigation">
      <div class="navmenu" id="nav-menu">
        <a href="/#about">About</a>
        <div class="nav-services-group">
          <a href="/#services" class="nav-services-label">Services</a>
          <div class="nav-services-sub" aria-label="Service pages">${NAV}
          </div>
        </div>
        <a href="/#work">Scopes</a>
        <a href="/portfolio">Prior signage work</a>
        <a href="/#selector">Scope Finder</a>
        <a href="/tools/sign-mockup/">Free Sign Preview</a>
      </div>
      <a href="tel:+13474502110" class="btn ghost nav-call" aria-label="Call or text (347) 450-2110"><span class="call-long">Call or text (347) 450-2110</span><span class="call-short">Call or text</span></a>
      <a href="/#quote" class="btn gold nav-cta">Request a quote</a>
      <button class="nav-toggle" id="navToggle" type="button" aria-expanded="false" aria-controls="nav-menu">Menu</button>
    </nav>
  </div>
</header>
<main id="main">
  <section class="page-hero">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/#services">Services</a></li>
          <li><span aria-current="page">${p.crumb}</span></li>
        </ol>
      </nav>
      <div>
        <span class="eyebrow">${p.eyebrow}</span>
        <h1>${p.h1}</h1>
        <p class="answer">${p.answer}</p>
        <div class="hero-actions" id="heroActions">
          <a class="btn gold lg" href="/#quote">Request a quote</a>
          <a class="btn ghost lg" href="tel:+13474502110">Call or text (347) 450-2110</a>
        </div>
      </div>
      <aside class="glance" aria-labelledby="glance-title">
        <h2 id="glance-title">What Arc handles</h2>
        <ul>
          ${(p.glance || ["Shop drawings and layouts", "Permit and landlord coordination", "Partner fabrication and install"]).map(li => `<li>${li}</li>`).join("\n          ")}
        </ul>
        <p>Larger fabrication and installation are through Arc's licensed partners. Arc does not file permits or stamp drawings.</p>
      </aside>
    </div>
  </section>
  <section class="section" id="scope">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">Scope</span>
        <h2>${p.scopeH2 || "Typical scope"}</h2>
      </div>
      <div class="card-grid three">
        ${cards}
      </div>
    </div>
  </section>
  <section class="section alt" id="what-to-send">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">Quote</span>
        <h2>What to send for a quote</h2>
      </div>
      <div class="send-grid">
        <ul class="checklist">
          <li>Photos or drawings with measurements when you have them</li>
          <li>Logo or message artwork</li>
          <li>Landlord or agency criteria if known</li>
          <li>Target date</li>
          <li>Street address of the project</li>
        </ul>
        <div class="send-card">
          <h3>Send it to Arc</h3>
          <p>Email files to jc@arcsignco.com with the project address in the subject line. Put URGENT in the subject for active jobsites.</p>
          <div class="contact-strip">
            <a href="tel:+13474502110">(347) 450-2110</a> (call or text) · <a href="mailto:jc@arcsignco.com">jc@arcsignco.com</a> · <a href="mailto:arc@arcsignco.com">arc@arcsignco.com</a>
            <span class="hours">Hours: Mon–Fri 8 AM–6 PM</span>
          </div>
          <a class="btn gold" href="/#quote">Request a quote</a>
        </div>
      </div>
    </div>
  </section>
  <section class="section" id="faq">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">FAQ</span>
        <h2>${p.faqTitle}</h2>
      </div>
      <div class="faq">
        ${faqHtml}
      </div>
    </div>
  </section>
  <section class="cta-band" id="pageCta">
    <div class="wrap">
      <div>
        <span class="eyebrow">Request a quote</span>
        <h2>${p.ctaH2}</h2>
        <p>${p.ctaP}</p>
        <p><span class="hours">Hours: Mon–Fri 8 AM–6 PM</span></p>
      </div>
      <div class="hero-actions">
        <a class="btn gold" href="/#quote">Request a quote</a>
        <a class="btn ghost" href="mailto:jc@arcsignco.com">Email jc@arcsignco.com</a>
      </div>
    </div>
  </section>
</main>
<footer>
  <div class="wrap footer-grid">
    <div>
      <picture>
        <source type="image/webp" srcset="/assets/img/logo-lockup-white-280.v2.webp 280w, /assets/img/logo-lockup-white-560.v2.webp 560w" sizes="134px">
        <img src="/assets/img/logo-lockup-white-280.v2.png" srcset="/assets/img/logo-lockup-white-280.v2.png 280w, /assets/img/logo-lockup-white-560.v2.png 560w" sizes="134px" width="847" height="174" loading="lazy" decoding="async" alt="Arc Signage Co">
      </picture>
      <p>Full-service signage for New York / Tri-State: design, permit coordination, and ADA signage. Larger fabrication and installation are through Arc's licensed partners. Arc does not file permits or stamp drawings.</p>
    </div>
    <div class="footer-links">
      <a href="/#about">About</a>
      <a href="/#services">Services</a>
      <a href="/portfolio">Prior signage work</a>
      <a href="/#quote">Contact</a>
      <a id="gbpLink" href="" rel="noopener" target="_blank" hidden>Google Business Profile</a>
    </div>
  </div>
  <nav class="wrap footer-services" aria-label="Service pages">
    <span>Services</span>${NAV.replace(/^            /gm, "    ")}
  </nav>
  <div class="wrap footer-meta">
    <span>&copy; 2026 Arc Signage Co. LLC &mdash; New York / Tri-State</span>
    <span><a href="tel:+13474502110">(347) 450-2110</a> &nbsp;|&nbsp; <a href="mailto:jc@arcsignco.com">jc@arcsignco.com</a> &nbsp;|&nbsp; <a href="mailto:arc@arcsignco.com">arc@arcsignco.com</a></span>
  </div>
</footer>
<div class="mobile-cta" id="mobileCta">
  <a class="btn gold" href="/#quote">Request a quote</a>
  <a class="btn ghost" href="tel:+13474502110">Call or text (347) 450-2110</a>
</div>
<script>
const cfg = window.ARC_SITE_CONFIG || {};
const gbpLink = document.getElementById("gbpLink");
const gbpUrl = (cfg.gbpUrl || "").trim();
if (gbpLink && /^https:\\/\\//.test(gbpUrl)) { gbpLink.href = gbpUrl; gbpLink.hidden = false; }
const mobileCta = document.getElementById("mobileCta");
if ("IntersectionObserver" in window) {
  const inView = new Map();
  const watch = new IntersectionObserver(entries => {
    entries.forEach(entry => inView.set(entry.target, entry.isIntersecting));
    mobileCta.classList.toggle("show", ![...inView.values()].some(Boolean));
  });
  ["heroActions", "what-to-send", "pageCta"].forEach(id => { const el = document.getElementById(id); if (el) watch.observe(el); });
} else mobileCta.classList.add("show");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("nav-menu");
navToggle.addEventListener("click", () => {
  const open = !navMenu.classList.contains("open");
  navMenu.classList.toggle("open", open);
  document.body.classList.toggle("nav-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.textContent = open ? "Close" : "Menu";
});
</script>
<script data-goatcounter="https://arcsignco.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
</body>
</html>`;
}

for (const p of pages) {
  fs.mkdirSync(path.join(root, p.slug), { recursive: true });
  fs.writeFileSync(path.join(root, p.slug, "index.html"), pageHtml(p));
  console.log(p.slug);
}
