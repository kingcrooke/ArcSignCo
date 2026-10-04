// Checks the sign mockup tool: geometry math, the category registry (every tab's types, cards,
// options and rates), PDF structure and content, approval-link plumbing and copy guardrails.
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
import { buildProofPdf, fromWinAnsi, toWinAnsi, pdfSafe, wrapText, textWidth, CONTACT, DISCLAIMER, FINE, STAMP_TITLE, STAMP_NOTE } from "./sign-mockup/js/pdf.js";
import { DISCLAIMER_FULL, NO_PRICE_MESSAGE } from "./sign-mockup/js/pricing-config.js";
import { priceView, estimatePrice, computeEstimate } from "./sign-mockup/js/pricing.js";
import { SIGN_TYPES, LIGHTING, GROUPS } from "./sign-mockup/js/categories/signs/types.js";
import { hasDiagram } from "./sign-mockup/js/categories/signs/diagrams.js";
import {
  AWNING_TYPES, AWNING_GROUPS, COVERS, VALANCES, LETTERING, defaultAwningOptions, sanitizeAwningOptions, awningOptionKeys, projectionFor,
} from "./sign-mockup/js/categories/awnings/types.js";
import { awningMesh } from "./sign-mockup/js/categories/awnings/geometry.js";
import { ALL_TYPES, CATEGORIES, READY, getType, describe, litWith, diagramSvg, optionFields, defaultOptions, codeWarnings } from "./sign-mockup/js/catalog.js";
import { validateCategory } from "./sign-mockup/js/categories/define.js";

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
for (const [input, want] of [["Old Town 🍎 Grocery", "Old Town Grocery"], ["🍕 PIZZA ☕ 🇺🇸", "PIZZA"], ["Café 👍🏽 — Joe’s", "Café — Joe’s"], ["Dana 👨‍👩‍👧", "Dana"], ["Acme™ © ®", "Acme™ © ®"], ["Line\tTab", "Line Tab"]]) {
  const got = fromWinAnsi(toWinAnsi(input));
  check(got === want, `PDF text drops emoji cleanly: ${JSON.stringify(input)} -> ${JSON.stringify(got)}`);
}
// English and Spanish print as typed; other Latin letters fold to their base; other scripts drop out.
for (const [input, want] of [
  ["Panadería Núñez — ¿Abierto? ¡Sí!", "Panadería Núñez — ¿Abierto? ¡Sí!"], ["ÁÉÍÓÚÑÜ áéíóúñü ¿¡", "ÁÉÍÓÚÑÜ áéíóúñü ¿¡"],
  ["Łódź Čapek", "Lódz Capek"], ["寿司 Sushi Bar", "Sushi Bar"], ["Пекарня Bakery", "Bakery"], ["مخبز", ""], ["Café → Bar", "Café Bar"],
]) {
  const got = pdfSafe(input);
  check(got === want, `PDF text: ${JSON.stringify(input)} -> ${JSON.stringify(got)}`);
}
check(!toWinAnsi("寿司 Пекарня مخبز ☃").includes(0x3f), "PDF text never prints ? for a character it can't show");
check(near(textWidth("Hello", false, 10), 22.78, 0.01), "Helvetica widths");
check(near(textWidth("Í", false, 10), textWidth("I", false, 10)) && near(textWidth("Ñ", true, 10), textWidth("N", true, 10)), "accented capitals use their base letter's width");
check(wrapText("one two three four five", false, 10, 40).length > 1, "wrapText wraps long text");

// Category registry: every tab is a valid module; the placeholders place nothing.
const ids = CATEGORIES.map(c => c.id);
const NEW_CATS = ["vinyl", "construction", "wayfinding", "ada", "led"];
check(ids[0] === "sign" && ids[1] === "awning" && NEW_CATS.every(id => ids.includes(id)), `registry has Signs, Awnings and the product-line tabs (${ids.join(", ")})`);
check(NEW_CATS.every(id => READY.some(c => c.id === id)), "Vinyl, Construction, Wayfinding, ADA and LED tabs are live");
check(READY.length === 7, `seven live categories (${READY.map(c => c.id).join(", ")})`);
check(new Set(ids).size === ids.length, "category ids are unique");
for (const c of CATEGORIES) {
  const problems = validateCategory(c);
  check(!problems.length, `${c.id}: valid ${c.status} category${problems.length ? ` (${problems.join("; ")})` : ""}`);
}
const labelOf = id => CATEGORIES.find(c => c.id === id).label;
check(NEW_CATS.map(labelOf).join("|") === "Vinyl & Stickers|Construction Signs|Interior Wayfinding|ADA & Code Signs|LED Displays", "product-line tab labels");
for (const id of NEW_CATS) {
  const cat = CATEGORIES.find(c => c.id === id);
  check(cat.types.length >= 4, `${id}: at least four types (${cat.types.length})`);
  for (const t of cat.types) {
    const svg = diagramSvg(t);
    check(/^<svg[^>]+viewBox="0 0 320 200"/.test(svg) && svg.endsWith("</svg>") && /aria-label="[^"]+how it.s built"/.test(svg), `${id}/${t.id}: construction diagram`);
  }
}
check(NEW_CATS.every(id => !CATEGORIES.find(c => c.id === id).examples.length), "live categories are not placeholders");
// "How it's built" labels start at x = 214 on a 320-wide card; anything past the edge is cut off.
{
  const unesc = s => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
  const clipped = ALL_TYPES.flatMap(t => [...diagramSvg(t).matchAll(/<text x="214" y="[\d.]+" font-size="([\d.]+)"[^>]*>([^<]*)<\/text>/g)]
    .map(([, size, text]) => ({ id: t.id, text: unesc(text), right: 214 + textWidth(unesc(text), false, Number(size)) }))
    .filter(l => l.right > 318));
  check(!clipped.length, `diagram labels fit the card${clipped.length ? ` (${clipped.map(l => `${l.id}: "${l.text}"`).join("; ")})` : ""}`);
}
for (const t of ALL_TYPES) {
  const fields = optionFields(t, defaultOptions(t), { width: 144, height: 40 });
  if (!fields.every(f => f.kind !== "select" || (f.choices.length && f.choices.some(([v]) => v === f.value)))) check(false, `${t.id}: every select field offers its current value`);
}
check(true, "option fields resolve for every type");
// The engine never names a category: adding a tab only adds a module and a registry line.
for (const f of ["js/app.js", "js/scene.js", "js/catalog.js", "js/pricing.js", "js/pdf.js", "js/proof-pdf.js", "proof/proof.js", "../../netlify/lib/sign-proofs.mjs"]) {
  const body = fs.readFileSync(path.join(toolDir, f), "utf8");
  const hits = [/isAwning/, /["']awning["']/, /["']aw-/, /categories\/(signs|awnings)/, /AWNING_/].filter(re => re.test(body)).map(String);
  check(!hits.length, `${path.basename(f)}: category-agnostic${hits.length ? ` (${hits.join(", ")})` : ""}`);
}

// Sign types and their construction drawings
check(SIGN_TYPES.length >= 12 && SIGN_TYPES.length <= 18, `${SIGN_TYPES.length} sign types (12–18)`);
check(new Set(SIGN_TYPES.map(t => t.id)).size === SIGN_TYPES.length, "sign type ids are unique");
check(SIGN_TYPES.every(t => LIGHTING[t.lighting] && GROUPS.some(g => g.id === t.group)), "every type has a known lighting and group");
check(SIGN_TYPES.every(t => t.parts.length >= 3 && t.summary), "every type lists its parts and a summary");
const LIGHTINGS = ["face", "halo", "internal", "neon", "external", "none"];
check(LIGHTINGS.every(l => SIGN_TYPES.some(t => t.lighting === l)), `lighting covered: ${LIGHTINGS.join(", ")}`);
for (const t of SIGN_TYPES) {
  const svg = hasDiagram(t) ? diagramSvg(t) : "";
  check(/^<svg[^>]+viewBox="0 0 320 200"/.test(svg) && svg.endsWith("</svg>") && /aria-label="[^"]+how it.s built"/.test(svg), `${t.id}: construction diagram`);
}

// Awning shapes: library, options, 3D mesh and side-profile cards
check(AWNING_TYPES.length >= 20, `${AWNING_TYPES.length} awning shapes`);
check(new Set(ALL_TYPES.map(t => t.id)).size === ALL_TYPES.length, "type ids are unique across categories");
check(READY.every(c => getType(c.defaultType).id === c.defaultType), "every live category has a valid default type");
check(getType("awning").id === "aw-traditional", "legacy awning id maps to the traditional slope");
check(AWNING_TYPES.every(t => AWNING_GROUPS.some(g => g.id === t.group) && t.summary && t.parts.length >= 3), "every awning shape has a group, summary and parts");
check(AWNING_TYPES.every(t => t.covers.every(c => COVERS[c]) && t.valances.every(v => VALANCES[v]) && t.letter.every(l => LETTERING[l])), "awning covers, valances and lettering spots are known");
check(AWNING_GROUPS.every(g => AWNING_TYPES.some(t => t.group === g.id)), "every awning group has shapes");
check(AWNING_TYPES.some(t => t.backlit) && AWNING_TYPES.some(t => !t.backlit), "some shapes can be backlit, some can't");
const finite = a => a.every(Number.isFinite);
for (const t of AWNING_TYPES) {
  const def = defaultAwningOptions(t);
  const variants = [def, { ...def, sides: "open", valance: "none", pattern: "stripes", lit: "backlit", projection: 999 }];
  let ok = true;
  for (const o of variants) for (const [W, D] of [[144, 40], [60, 30], [360, 72]]) {
    const m = awningMesh(t, o, W, D);
    ok &&= m.faces.length > 0 && m.faces.every(f => f.pts.length === 4 && f.pts.every(finite) && finite(f.n) && (!f.tex || m.tex[f.tex]))
      && m.tubes.every(tb => finite(tb.a) && finite(tb.b));
  }
  const svg = diagramSvg(t);
  check(ok, `${t.id}: 3D mesh is finite for default and extreme options`);
  check(/^<svg[^>]+viewBox="0 0 320 200"/.test(svg) && svg.endsWith("</svg>") && /aria-label="[^"]+how it.s built"/.test(svg), `${t.id}: side-profile card`);
}
const trad = getType("aw-traditional");
const dirty = sanitizeAwningOptions(trad, { panel: "red", cover: "glass", valance: "<script>", projection: 500, lit: "backlit", extra: "x" });
check(dirty.panel === defaultAwningOptions(trad).panel && dirty.cover === "vinyl" && dirty.valance === "straight" && dirty.projection === 96 && !("extra" in dirty),
  "sanitize keeps only allowed awning options (backlit forces vinyl, projection clamped)");
check(!litWith(trad, defaultAwningOptions(trad)) && litWith(trad, { lit: "backlit" }), "awnings glow at night only when backlit");
check(awningOptionKeys(trad, defaultAwningOptions(trad)).includes("projection") && !awningOptionKeys(trad, defaultAwningOptions(trad)).includes("stripe")
  && awningOptionKeys(trad, { ...defaultAwningOptions(trad), pattern: "stripes" }).includes("stripe"), "stripe color is offered only for striped covers");
check(projectionFor(getType("aw-dome"), {}, 144, 40) > 0, "automatic projection resolves");
const warn = (id, o) => { const t = getType(id); return codeWarnings(t, { ...defaultAwningOptions(t), ...o }, { width: 240, height: 40 }); };
check(!warn("aw-traditional", {}).some(w => w.over), "a default storefront awning raises no over-limit warning");
check(warn("aw-retractable", { projection: 156 }).some(w => w.over && /8 ft beyond the street line/.test(w.text)), "a 13 ft lateral-arm warns past the 8 ft storefront limit");
check(warn("aw-traditional", { projection: 72 }).some(w => w.over && /5 ft/.test(w.text)), "past 5 ft warns about window and door awnings");
check(warn("aw-louver", { projection: 48 }).some(w => w.over && /2' 6"/.test(w.text)), "a deep louver warns about the 2' 6\" sun-control limit");
check(warn("aw-entrance", {}).some(w => /18–24 in of the curb/.test(w.text)), "the entrance canopy is sized to the sidewalk");
check(warn("aw-traditional", { lit: "backlit" }).some(w => /C7/.test(w.text) && /12 in \(18 in if double-faced\)/.test(w.text) && /C6-5 and C6-7/.test(w.text)), "lit lettering warns with the 12/18 in sign rule (C7 included)");
const marquee = describe(getType("aw-marquee"), defaultAwningOptions(getType("aw-marquee")), { width: 240, height: 120 });
check(marquee.lighting === "fascia" && !marquee.parts.some(p => /translucent backlit vinyl/.test(p)) && marquee.parts.some(p => /fascia/i.test(p)) && /roof deck and soffit stay dark/.test(marquee.night),
  "a lit marquee is a metal cover with an internally lit fascia");
check(getType("trimless").lighting === "face" && /no plastic trim cap/i.test(getType("trimless").summary), "trimless means no trim cap; only the face glows by default");
check(getType("halo").name === "Halo-lit (reverse-lit) channel letters" && getType("halo").parts.includes("Open or clear backs"), "halo-lit naming and open or clear backs");
const awInfo = describe(trad, { lit: "backlit" }, { width: 144, height: 40 });
check(awInfo.category === "awning" && awInfo.lightingLabel === "Backlit" && awInfo.details.some(([k]) => k === "Projection"), "describe() reports awning lighting and details");

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
  price: priceView(estimatePrice("halo", { width: 148, height: 30 })),
  approval: { name: "José Muñoz Ibáñez", at: "Oct 3, 2026, 3:04 PM EDT" },
  proofUrl: "https://example.test/tools/sign-mockup/proof/#0123",
  size: { width: `12' 4"`, height: `2' 6"`, area: "31 sq ft" },
  reference: `Door width = 3' 0"`,
  project: "Panadería Núñez (sample) 寿司",
  preparedFor: "Sample client",
  notes: "Halo-lit letters, matte black returns. ¿Letras más grandes? ¡Sí!",
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
const flowing = strings.join(" ");
for (const needle of [DISCLAIMER, `Call or text ${CONTACT.phone}`, "jc@arcsignco.com", "arc@arcsignco.com", "arcsignco.com", `12' 4"`, `2' 6"`, `Door width = 3' 0"`,
  halo.name, "Night view and construction", "Flat artwork", "NIGHT VIEW, SAME SPOT AS PAGE 1", STAMP_TITLE, STAMP_NOTE, "José Muñoz Ibáñez",
  "Panadería Núñez (sample)", "¿Letras más grandes? ¡Sí!", "Page 3 of 3"]) {
  check(flowing.includes(needle), `PDF text includes ${JSON.stringify(needle)}`);
}
check(flowing.includes(NO_PRICE_MESSAGE), "PDF shows the no-price message while the rates are placeholders");
check(!/\$\s?\d/.test(text), "PDF shows no dollar amounts while the rates are placeholders");
check(!text.includes("寿司") && !text.includes("?)"), "PDF drops text it can't show instead of printing ?");
check((flowing.match(new RegExp(DISCLAIMER_FULL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length === 3, "full disclaimer in the footer of every page");
check(FINE.includes("the artwork is placed by hand") && !FINE.includes("sign artwork"), "PDF fine print says \"the artwork\"");
// The footer and fine print stay on the page and below the content.
const lowest = Math.min(...[...raw.matchAll(/ ([\d.]+) Td \(/g)].map(m => Number(m[1])));
check(lowest > 12, `PDF text stays inside the page (lowest baseline ${lowest} pt)`);
check(/\/Type \/Pages \/Kids \[[^\]]+\] \/Count 3/.test(raw), "PDF has three pages");
check((text.match(/Concept only – not a shop drawing/g) || []).length >= 6, "short disclaimer in the banner and footer of every page");
const livePdf = Buffer.from(buildProofPdf({
  logo: fakeJpeg(847, 174), mockup: fakeJpeg(1600, 1200), night: fakeJpeg(1600, 1200), diagram: fakeJpeg(1280, 800), flat: { image: fakeJpeg(1200, 300) },
  type: { name: halo.name, lighting: halo.lightingLabel }, size: { width: `12' 4"`, height: `2' 6"`, area: "31 sq ft" },
  price: priceView(computeEstimate("halo", { width: 148, height: 30 }), { live: true, date: new Date(2026, 9, 3) }),
})).toString("latin1");
check(/Preliminary estimate valid 30 days from October 3, 2026/.test(livePdf) && /Sales tax extra where it applies/.test(livePdf) && /confirmed after site survey/.test(livePdf),
  "with real rates on, the PDF carries the range lines, tax and valid-days note");
const onePage = Buffer.from(buildProofPdf({ logo: fakeJpeg(847, 174), mockup: fakeJpeg(800, 600), size: null })).toString("latin1");
check(/\/Count 1 >>/.test(onePage), "PDF without night view or artwork stays one page");
check(raw.includes("/URI (tel:+13474502110)") && raw.includes("/URI (mailto:jc@arcsignco.com)") && raw.includes("/URI (mailto:arc@arcsignco.com)"), "PDF has phone and email links");
check(!/\bApt\b/i.test(text), "PDF has no \"Apt\"");
const pdfStrings = bytes => [...Buffer.from(bytes).toString("latin1").matchAll(/\((?:\\.|[^\\)])*\)/g)].map(m =>
  fromWinAnsi([...m[0].slice(1, -1).replace(/\\([0-7]{3})/g, (_, o) => String.fromCharCode(parseInt(o, 8))).replace(/\\(.)/g, "$1")].map(c => c.charCodeAt(0))))
  .join("\n");
const awPdf = pdfStrings(buildProofPdf({
  logo: fakeJpeg(847, 174), mockup: fakeJpeg(1600, 1200), night: fakeJpeg(1600, 1200), diagram: fakeJpeg(1280, 800),
  type: { ...awInfo, lighting: awInfo.lightingLabel },
  price: priceView(estimatePrice("aw-traditional", { width: 144, height: 40 })),
  size: { width: `12' 0"`, height: `3' 4"`, area: "40 sq ft" },
}));
for (const needle of ["Storefront awning mockup", "AWNING SHAPE", "Drop", "Traditional slope", "Cover: Coated vinyl", "Projection:", "Pricing comes in a formal written estimate", DISCLAIMER]) {
  check(awPdf.includes(needle), `awning PDF includes ${JSON.stringify(needle)}`);
}
// Interior and job-site tabs aren't storefront mockups.
for (const [id, title] of [["wf-lobby", "Interior wayfinding sign mockup"], ["ada-room", "ADA and code sign mockup"], ["constr-site-board", "Construction sign mockup"],
  ["vinyl-wall-mural", "Vinyl graphic mockup"], ["led-ticker", "LED display mockup"], ["halo", "Storefront sign mockup"]]) {
  const info = describe(getType(id), null, null);
  const t = pdfStrings(buildProofPdf({ logo: fakeJpeg(847, 174), mockup: fakeJpeg(800, 600), type: { ...info, lighting: info.lightingLabel } }));
  check(t.includes(title) && (id === "halo" || !/Storefront/.test(t)), `${id} PDF is titled "${title}"`);
}
// A long project and client line wraps to two lines and ends in "…" rather than losing the client silently.
const longSub = pdfStrings(buildProofPdf({
  logo: fakeJpeg(847, 174), mockup: fakeJpeg(800, 600),
  project: "Riverside Medical Arts Building, ground-floor lobby and elevator wayfinding refresh, phase two",
  preparedFor: "Northeast Property Management Group, attention Dolores Müller-Hernández, facilities director, with copies to the building engineer and the leasing office",
})).split("\n");
const subLines = longSub.filter(s => /Riverside|Northeast|Müller|…$/.test(s) && !/Page \d/.test(s));
check(subLines.length === 2 && subLines[1].endsWith("…"), `long PDF subtitle wraps to two lines ending in "…" (${subLines.length} lines)`);
const shortSub = pdfStrings(buildProofPdf({ logo: fakeJpeg(847, 174), mockup: fakeJpeg(800, 600), project: "Corner Deli", preparedFor: "Ana Müller" }));
check(shortSub.includes("Corner Deli  ·  Prepared for Ana Müller"), "short PDF subtitle stays on one line, whole");

// Copy guardrails across the tool's own files (vendored libraries excluded).
const walk = dir => fs.readdirSync(path.join(toolDir, dir), { withFileTypes: true })
  .flatMap(d => (d.isDirectory() ? walk(`${dir}/${d.name}`) : [`${dir}/${d.name}`]));
const own = ["index.html", "sign-mockup.css", ...walk("js"), ...walk("proof")];
const BANNED = [
  /\bApt\b/i, /83 Post Ave/i, /ada[- ]compliant/i, /fully compliant/i, /(?<!(not|n't|no) )guarantee/i, /\bcertified\b/i,
  /dob[- ]approved/i, /\bour license\b/i, /\bwe are (a )?licensed/i, /stamped by arc/i, /years in business/i, /\breviews?\b.*\bstars?\b/i,
  // Arc team wording rules: nothing reads like a contract, deposit or go-ahead; ADA is "for architect
  // and inspector review", never compliant; no slip-resistance claims; the only phone is the 347 line.
  /\bcontracts?\b/i, /\bdeposits?\b/i, /go[- ]ahead/i, /payment authori[sz]ation/i, /\bcompliant\b/i, /\bcompliance\b/i,
  /slip[- ]?resist/i, /\b(non|anti)[- ]?slip\b/i, /\(917\)|\b917[ .-]\d{3}[ .-]?\d{4}\b|\+1[ -]?917/,
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
for (const f of ["netlify/functions/sign-proofs.mjs", "netlify/lib/sign-proofs.mjs", "README.md", "docs/sign-mockup-approval-links.md", "docs/ADDING-A-CATEGORY.md"]) {
  const p = path.join(root, f);
  const body = fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "";
  const hits = VENDORS.filter(re => re.test(body)).map(String);
  check(body && !hits.length, `${f}: present, no vendor names${hits.length ? ` (${hits.join(", ")})` : ""}`);
}
const html = fs.readFileSync(path.join(toolDir, "index.html"), "utf8");
check(!/<meta name="robots" content="noindex/.test(html), "tool page is indexable (no noindex meta)");
check(/<link rel="canonical" href="https:\/\/arcsignco\.com\/tools\/sign-mockup\/">/.test(html), "tool page has canonical URL");
const proofHtml = fs.readFileSync(path.join(toolDir, "proof/index.html"), "utf8");
check(/<meta name="robots" content="noindex, nofollow">/.test(proofHtml), "proof page is noindex");
check(proofHtml.includes("tel:+13474502110") && proofHtml.includes("mailto:jc@arcsignco.com") && proofHtml.includes("mailto:arc@arcsignco.com"), "proof page shows phone and both emails");
check(proofHtml.includes("Concept only – not a shop drawing"), "proof page carries the disclaimer");
check(/id="approveBtn">Concept approved, request a formal estimate</.test(proofHtml), "the approve button reads \"Concept approved, request a formal estimate\"");
check(html.includes("Upload a storefront photo, see your sign in 2 minutes. Free, no account."), "step 1 opens with the Arc intro line");
check(/<strong>Concept approved, request a formal estimate<\/strong>/.test(proofHtml), "the approval confirmation reads \"Concept approved, request a formal estimate\"");
check(STAMP_TITLE === "CONCEPT APPROVED, REQUEST A FORMAL ESTIMATE", "the PDF approval stamp reads \"Concept approved, request a formal estimate\"");
for (const f of own) {
  const body = fs.readFileSync(path.join(toolDir, f), "utf8");
  const bare = [...body.matchAll(/\(347\) 450-2110/g)].filter(m => !/(call or text\s*(<a [^>]*>)?|phone: ")$/i.test(body.slice(Math.max(0, m.index - 80), m.index)));
  check(!bare.length, `${f}: every phone line reads "Call or text (347) 450-2110"${bare.length ? ` (${bare.length} bare)` : ""}`);
}
check((proofHtml.split(DISCLAIMER_FULL).length - 1) === 2, "proof page carries the full disclaimer in the price box and the footer");
check(html.includes(DISCLAIMER_FULL), "the tool's step 4 carries the full disclaimer");
check(!/Approved by/.test(fs.readFileSync(path.join(toolDir, "proof/proof.js"), "utf8")), "the proof email doesn't say \"Approved by\"");
check(/<form name="sign-proof-activity"[^>]*data-netlify="true"[^>]*netlify-honeypot="bot-field"/.test(proofHtml), "proof activity form is registered with Netlify Forms (honeypot on)");
const pricingConfig = fs.readFileSync(path.join(toolDir, "js/pricing-config.js"), "utf8");
check(/PLACEHOLDER RATES/.test(pricingConfig) && /PLACEHOLDER = true/.test(pricingConfig), "rates are labeled as placeholders");
check(READY.every(c => c.pricing && Object.keys(c.pricing).join() === "row"), "every live category only maps its types to config rows");
// Price numbers live only in js/pricing-config.js.
const PRICE_NUM = /\b(base|rate|projRate|low|high):\s*\d{2,}|\brange:\s*\[\s*\d{2,}/;
const strayRates = own.filter(f => f.endsWith(".js") && f !== "js/pricing-config.js" && PRICE_NUM.test(fs.readFileSync(path.join(toolDir, f), "utf8")));
check(!strayRates.length, `no price numbers outside pricing-config.js${strayRates.length ? ` (${strayRates.join(", ")})` : ""}`);
check(html.includes("tel:+13474502110") && html.includes("mailto:jc@arcsignco.com") && html.includes("mailto:arc@arcsignco.com"), "page shows phone and both emails");
check(!/googletagmanager|gtag\(/.test(html), "no analytics on the tool page");
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const toml = fs.readFileSync(path.join(root, "netlify.toml"), "utf8");
check(sitemap.includes("<loc>https://arcsignco.com/tools/sign-mockup/</loc>"), "sitemap lists the sign mockup tool");
check(!sitemap.includes("/tools/sign-mockup/proof"), "sitemap does not list proof pages");
check(!toml.includes('for = "/tools/sign-mockup/*"\n  [headers.values]\n    X-Robots-Tag = "noindex"'), "netlify.toml does not noindex the whole mockup tool");
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

// The worked example in docs/ADDING-A-CATEGORY.md must stay a valid module: load it from the
// categories folder (so its imports resolve) and validate it, then remove the temporary copy.
const guide = fs.existsSync(path.join(root, "docs/ADDING-A-CATEGORY.md")) ? fs.readFileSync(path.join(root, "docs/ADDING-A-CATEGORY.md"), "utf8") : "";
const example = (guide.match(/<!-- example:start -->\s*```js\n([\s\S]*?)```\s*<!-- example:end -->/) || [])[1];
check(!!example, "ADDING-A-CATEGORY.md has the example module between the example markers");
if (example) {
  const tmp = path.join(toolDir, "js/categories", `.doc-example-${process.pid}.mjs`);
  fs.writeFileSync(tmp, example);
  try {
    const mod = (await import(tmp)).default;
    const problems = validateCategory(mod);
    check(!problems.length, `the guide's example module is a valid category${problems.length ? ` (${problems.join("; ")})` : ""}`);
    check(mod.types.every(t => mod.optionFields(t, mod.defaultOptions(t), { width: 96, height: 24 }).length >= 0) && mod.types.every(t => /^<svg/.test(mod.diagram(t))), "the guide's example draws its cards and option fields");
  } catch (e) {
    check(false, `the guide's example module loads (${e.message})`);
  } finally {
    fs.rmSync(tmp, { force: true });
  }
}

console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
