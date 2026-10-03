// Checks the sign mockup tool: geometry math, PDF structure and content, and copy guardrails.
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

// PDF build
const fakeJpeg = (w, h) => ({ bytes: new Uint8Array([0xff, 0xd8, 0xff, 0xd9]), width: w, height: h });
const pdf = buildProofPdf({
  logo: fakeJpeg(847, 174),
  mockup: fakeJpeg(1600, 1200),
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
for (const needle of [DISCLAIMER, CONTACT.phone, "jc@arcsignco.com", "arc@arcsignco.com", "arcsignco.com", `12' 4"`, `2' 6"`, `Door width = 3' 0"`]) {
  check(text.includes(needle), `PDF text includes ${JSON.stringify(needle)}`);
}
check(raw.includes("/URI (tel:+13474502110)") && raw.includes("/URI (mailto:jc@arcsignco.com)") && raw.includes("/URI (mailto:arc@arcsignco.com)"), "PDF has phone and email links");
check(!/\bApt\b/i.test(text), "PDF has no \"Apt\"");

// Copy guardrails across the tool's own files (vendored libraries excluded).
const own = ["index.html", "sign-mockup.css", ...fs.readdirSync(path.join(toolDir, "js")).map(f => `js/${f}`)];
const BANNED = [
  /\bApt\b/i, /83 Post Ave/i, /ada[- ]compliant/i, /fully compliant/i, /(?<!(not|n't|no) )guarantee/i, /\bcertified\b/i,
  /dob[- ]approved/i, /\bour license/i, /\bwe are (a )?licensed/i, /stamped by arc/i, /years in business/i, /\breviews?\b.*\bstars?\b/i,
];
for (const f of own) {
  const body = fs.readFileSync(path.join(toolDir, f), "utf8");
  const hits = BANNED.filter(re => re.test(body)).map(String);
  check(!hits.length, `${f}: no banned wording${hits.length ? ` (${hits.join(", ")})` : ""}`);
}
const html = fs.readFileSync(path.join(toolDir, "index.html"), "utf8");
check(/<meta name="robots" content="noindex">/.test(html), "page is noindex");
check(html.includes("tel:+13474502110") && html.includes("mailto:jc@arcsignco.com") && html.includes("mailto:arc@arcsignco.com"), "page shows phone and both emails");
check(!/googletagmanager|gtag\(/.test(html), "no analytics on the tool page");
check(!fs.readFileSync(path.join(root, "sitemap.xml"), "utf8").includes("/tools/"), "sitemap does not list /tools/");

const toml = fs.readFileSync(path.join(root, "netlify.toml"), "utf8");
const allow = toml.indexOf('from = "/tools/sign-mockup/*"'), block = toml.indexOf('from = "/tools/*"');
check(allow > -1 && block > -1 && allow < block, "netlify.toml serves /tools/sign-mockup/ before blocking /tools/*");
check(fs.existsSync(path.join(toolDir, "vendor/heic-to-1.6.5.min.js")) && fs.existsSync(path.join(toolDir, "vendor/heic-to-LICENSE.txt")), "HEIC decoder and its license are vendored");

console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
