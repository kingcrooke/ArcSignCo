// Checks the sign mockup tool: geometry math, sign types and diagrams, PDF structure and content,
// approval-link plumbing and copy guardrails.
//
//   node tools/check-sign-mockup.mjs
//
// No dependencies. Exits non-zero if any check fails.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  squareToQuad, invert3, apply3, quadSizeInches, formatFeetInches, formatArea, rectQuad, scaleQuad, pointInQuad, toInches,
} from "./sign-mockup/js/geometry.js";
import { buildProofPdf, fromWinAnsi, toWinAnsi, wrapText, textWidth, CONTACT, DISCLAIMER } from "./sign-mockup/js/pdf.js";
import { SIGN_TYPES, LIGHTING, GROUPS } from "./sign-mockup/js/sign-types.js";
import { diagramSvg, hasDiagram } from "./sign-mockup/js/diagrams.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const toolDir = path.join(root, "tools/sign-mockup");
let failures = 0;
const check = (ok, msg) => { if (ok) console.log(`ok   ${msg}`); else { failures++; console.log(`FAIL ${msg}`); } };
const near = (a, b, eps = 1e-6) => Math.abs(a - b) <= eps;

// Geometry
const quad = [{ x: 100, y: 80 }, { x: 520, y: 110 }, { x: 500, y: 300 }, { x: 120, y: 260 }];
const H = squareToQuad(quad);
const corners = [[0, 0], [1, 0], [1, 1], [0, 1]];
check(corners.every(([u, v], i) => { const p = apply3(H, u, v); return near(p.x, quad[i].x) && near(p.y, quad[i].y); }),
  "homography maps the unit square corners onto the quad");
const inv = invert3(H);
const probe = apply3(H, 0.3, 0.7), back = apply3(inv, probe.x, probe.y);
check(near(back.x, 0.3) && near(back.y, 0.7), "inverse homography round-trips an interior point");
const affine = squareToQuad(rectQuad(50, 50, 40, 20));
check(near(affine[6], 0) && near(affine[7], 0), "rectangles give an affine homography");

const size = quadSizeInches(rectQuad(0, 0, 1200, 300), 10);
check(near(size.width, 120) && near(size.height, 30), "quad size converts pixels to inches with the calibration scale");
check(formatFeetInches(148.4) === `12' 4"`, `formatFeetInches(148.4) -> 12' 4"`);
check(formatFeetInches(143.7) === `12' 0"`, `formatFeetInches rounds 11.7" up into the next foot`);
check(formatFeetInches(7.6) === `8"`, `formatFeetInches(7.6) -> 8"`);
check(formatArea(120, 30) === "25 sq ft" && formatArea(36, 24) === "6.0 sq ft", "formatArea");
check(toInches("3", "6") === 42 && toInches("", "") === 0, "toInches");
const scaled = scaleQuad(rectQuad(0, 0, 100, 50), 2);
check(near(scaled[1].x - scaled[0].x, 200) && near(scaled[0].x, -100), "scaleQuad scales about the centroid");
check(pointInQuad(quad, { x: 300, y: 200 }) && !pointInQuad(quad, { x: 50, y: 50 }), "pointInQuad");

// PDF text helpers
check(fromWinAnsi(toWinAnsi(DISCLAIMER)) === DISCLAIMER, "disclaimer survives WinAnsi encoding (en dash kept)");
check(near(textWidth("Hello", false, 10), 22.78, 0.01), "Helvetica widths");
check(wrapText("one two three four five", false, 10, 40).length > 1, "wrapText wraps long text");

// Sign types and their construction drawings
check(SIGN_TYPES.length >= 12 && SIGN_TYPES.length <= 18, `${SIGN_TYPES.length} sign types (12–18)`);
check(new Set(SIGN_TYPES.map(t => t.id)).size === SIGN_TYPES.length, "sign type ids are unique");
check(SIGN_TYPES.every(t => LIGHTING[t.lighting] && GROUPS.some(g => g.id === t.group)), "every type has a known lighting and group");
check(SIGN_TYPES.every(t => t.parts.length >= 3 && t.summary), "every type lists its parts and a summary");
const LIGHTINGS = ["face", "halo", "internal", "neon", "external", "none"];
check(LIGHTINGS.every(l => SIGN_TYPES.some(t => t.lighting === l)), `lighting covered: ${LIGHTINGS.join(", ")}`);
for (const t of SIGN_TYPES) {
  const svg = hasDiagram(t.id) ? diagramSvg(t) : "";
  check(/^<svg[^>]+viewBox="0 0 320 200"/.test(svg) && svg.endsWith("</svg>") && /aria-label="[^"]+how it.s built"/.test(svg), `${t.id}: construction diagram`);
}

// PDF build
const fakeJpeg = (w, h) => ({ bytes: new Uint8Array([0xff, 0xd8, 0xff, 0xd9]), width: w, height: h });
const halo = SIGN_TYPES.find(t => t.id === "halo");
const pdf = buildProofPdf({
  logo: fakeJpeg(847, 174),
  mockup: fakeJpeg(1600, 1200),
  night: fakeJpeg(1600, 1200),
  diagram: fakeJpeg(1280, 800),
  flat: { image: fakeJpeg(1200, 300) },
  type: { name: halo.name, lighting: halo.lightingLabel, summary: halo.summary, parts: halo.parts, night: LIGHTING.halo.night },
  price: { range: "$3,000 – $5,000", label: "Arc placeholder rates", note: "Rough preliminary range from placeholder rates, not a quote." },
  approval: { name: "Sample Client", at: "Oct 3, 2026, 3:04 PM EDT" },
  proofUrl: "https://example.test/tools/sign-mockup/proof/#0123",
  size: { width: `12' 4"`, height: `2' 6"`, area: "31 sq ft" },
  reference: `Door width = 3' 0"`,
  project: "Corner Bakery (sample)",
  preparedFor: "Sample client",
  notes: "Halo-lit letters, matte black returns.",
  date: new Date(2026, 9, 3),
});
const raw = Buffer.from(pdf).toString("latin1");
check(raw.startsWith("%PDF-1.4") && raw.trimEnd().endsWith("%%EOF"), "PDF header and trailer");
const xrefAt = Number(raw.match(/startxref\n(\d+)/)[1]);
check(raw.slice(xrefAt, xrefAt + 4) === "xref", "startxref points at the xref table");
const offsets = [...raw.slice(xrefAt).matchAll(/^(\d{10}) 00000 n $/gm)].map(m => Number(m[1]));
check(offsets.length > 0 && offsets.every((o, i) => raw.slice(o).startsWith(`${i + 1} 0 obj`)), `all ${offsets.length} xref offsets point at their objects`);
const strings = [...raw.matchAll(/\((?:\\.|[^\\)])*\)/g)].map(m =>
  m[0].slice(1, -1).replace(/\\([0-7]{3})/g, (_, o) => String.fromCharCode(parseInt(o, 8))).replace(/\\(.)/g, "$1"))
  .map(s => fromWinAnsi([...s].map(c => c.charCodeAt(0))));
const text = strings.join("\n");
for (const needle of [DISCLAIMER, CONTACT.phone, "jc@arcsignco.com", "arc@arcsignco.com", "arcsignco.com", `12' 4"`, `2' 6"`, `Door width = 3' 0"`,
  halo.name, "Night view and construction", "Flat artwork", "Arc placeholder rates", "APPROVED FOR NEXT STEPS", "Page 3 of 3"]) {
  check(text.includes(needle), `PDF text includes ${JSON.stringify(needle)}`);
}
check(/\/Type \/Pages \/Kids \[[^\]]+\] \/Count 3/.test(raw), "PDF has three pages");
check((text.match(/Concept only – not a shop drawing/g) || []).length >= 6, "disclaimer in the banner and footer of every page");
const onePage = Buffer.from(buildProofPdf({ logo: fakeJpeg(847, 174), mockup: fakeJpeg(800, 600), size: null })).toString("latin1");
check(/\/Count 1 >>/.test(onePage), "PDF without night view or artwork stays one page");
check(raw.includes("/URI (tel:+13474502110)") && raw.includes("/URI (mailto:jc@arcsignco.com)") && raw.includes("/URI (mailto:arc@arcsignco.com)"), "PDF has phone and email links");
check(!/\bApt\b/i.test(text), "PDF has no \"Apt\"");

// Copy guardrails across the tool's own files (vendored libraries excluded).
const own = [
  "index.html", "sign-mockup.css", ...fs.readdirSync(path.join(toolDir, "js")).map(f => `js/${f}`),
  ...fs.readdirSync(path.join(toolDir, "proof")).map(f => `proof/${f}`),
];
const BANNED = [
  /\bApt\b/i, /83 Post Ave/i, /ada[- ]compliant/i, /fully compliant/i, /(?<!(not|n't|no) )guarantee/i, /\bcertified\b/i,
  /dob[- ]approved/i, /\bour license/i, /\bwe are (a )?licensed/i, /stamped by arc/i, /years in business/i, /\breviews?\b.*\bstars?\b/i,
];
// Reference catalogs and awning makers are research only: their names never ship.
const VENDORS = [
  /cosun/i, /schlosser/i, /\bsloan\b/i, /principal sloan/i, /1800awnings/i, /awntech/i, /brustor/i, /sunbrella/i, /trivantage/i,
  /strofix/i, /alutex/i, /mannlee/i, /hendee/i, /kreider/i, /glen raven/i, /recasens/i, /dickson/i, /sattler/i, /masa architectural/i,
  /carroll architectural/i, /shade systems/i, /\bmapes\b/i,
];
for (const f of own) {
  const body = fs.readFileSync(path.join(toolDir, f), "utf8");
  const hits = [...BANNED, ...VENDORS].filter(re => re.test(body)).map(String);
  check(!hits.length, `${f}: no banned wording or vendor names${hits.length ? ` (${hits.join(", ")})` : ""}`);
}
for (const f of ["netlify/functions/sign-proofs.mjs", "netlify/lib/sign-proofs.mjs", "README.md", "docs/sign-mockup-approval-links.md"]) {
  const p = path.join(root, f);
  const body = fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "";
  const hits = VENDORS.filter(re => re.test(body)).map(String);
  check(body && !hits.length, `${f}: present, no vendor names${hits.length ? ` (${hits.join(", ")})` : ""}`);
}
const html = fs.readFileSync(path.join(toolDir, "index.html"), "utf8");
check(/<meta name="robots" content="noindex">/.test(html), "page is noindex");
const proofHtml = fs.readFileSync(path.join(toolDir, "proof/index.html"), "utf8");
check(/<meta name="robots" content="noindex, nofollow">/.test(proofHtml), "proof page is noindex");
check(proofHtml.includes("tel:+13474502110") && proofHtml.includes("mailto:jc@arcsignco.com") && proofHtml.includes("mailto:arc@arcsignco.com"), "proof page shows phone and both emails");
check(proofHtml.includes("Concept only – not a shop drawing"), "proof page carries the disclaimer");
check(/<form name="sign-proof-activity"[^>]*data-netlify="true"[^>]*netlify-honeypot="bot-field"/.test(proofHtml), "proof activity form is registered with Netlify Forms (honeypot on)");
const pricingConfig = fs.readFileSync(path.join(toolDir, "js/pricing-config.js"), "utf8");
check(/PLACEHOLDER RATES/.test(pricingConfig) && /PLACEHOLDER = true/.test(pricingConfig), "rates are labeled as placeholders");
const priceFiles = own.filter(f => f !== "js/pricing-config.js" && f.endsWith(".js"));
check(priceFiles.every(f => !/\b(low|high):\s*\d{2,}/.test(fs.readFileSync(path.join(toolDir, f), "utf8"))), "no rate numbers outside pricing-config.js");
check(html.includes("tel:+13474502110") && html.includes("mailto:jc@arcsignco.com") && html.includes("mailto:arc@arcsignco.com"), "page shows phone and both emails");
check(!/googletagmanager|gtag\(/.test(html), "no analytics on the tool page");
check(!fs.readFileSync(path.join(root, "sitemap.xml"), "utf8").includes("/tools/"), "sitemap does not list /tools/");

const toml = fs.readFileSync(path.join(root, "netlify.toml"), "utf8");
const allow = toml.indexOf('from = "/tools/sign-mockup/*"'), block = toml.indexOf('from = "/tools/*"');
check(allow > -1 && block > -1 && allow < block, "netlify.toml serves /tools/sign-mockup/ before blocking /tools/*");
for (const from of ["/netlify/*", "/node_modules/*", "/package.json", "/package-lock.json"]) {
  check(new RegExp(`from = "${from.replace(/[*/.]/g, "\\$&")}"\\s+to = "/404.html"\\s+status = 404`).test(toml), `netlify.toml blocks ${from}`);
}
const fn = fs.readFileSync(path.join(root, "netlify/functions/sign-proofs.mjs"), "utf8");
check(/getStore\(\{ name: STORE_NAME/.test(fn) && /"\/api\/sign-proofs"/.test(fn), "approval function uses its own Blobs store at /api/sign-proofs");
check(JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).dependencies["@netlify/blobs"], "package.json declares @netlify/blobs");
check(!fs.existsSync(path.join(toolDir, "js/warp.js")), "old flat warp renderer removed");
check(fs.existsSync(path.join(toolDir, "vendor/heic-to-1.6.5.min.js")) && fs.existsSync(path.join(toolDir, "vendor/heic-to-LICENSE.txt")), "HEIC decoder and its license are vendored");

console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
