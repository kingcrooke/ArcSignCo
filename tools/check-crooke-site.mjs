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
  const wizardPath = path.join(base, "interview", "interview-wizard.js");
  const thanksPath = path.join(base, "interview", "thank-you.html");
  const wizardSrc = fs.readFileSync(wizardPath, "utf8");
  const thanksHtml = fs.readFileSync(thanksPath, "utf8");
  const configPath = path.join(base, "interview", "interview-config.js");
  if (!fs.existsSync(configPath)) fail("missing interview-config.js");
  const configSrc = fs.existsSync(configPath) ? fs.readFileSync(configPath, "utf8") : "";
  const interviewCopy = [interviewHtml, wizardSrc, thanksHtml, configSrc].join("\n");
  if (/jesus\.crooke@gmail\.com/i.test(interviewCopy)) fail("interview copy must not show an email address");
  else pass("interview copy omits notification email");
  if (/Jesús|Jesus|Enviar a Jesús|Send to Jesus|Charles Crooke|Mami y Charles|Mami and Charles/.test(interviewHtml + wizardSrc + thanksHtml)) {
    fail("interview copy must stay a general family interview and not name Jesus");
  } else pass("interview copy is general");
  if (!interviewHtml.includes("Entrevista Familia Morel")) fail("interview title must be Entrevista Familia Morel");
  else pass("interview page name");
  if (!interviewHtml.includes("Comparte tu historia")) fail("welcome tagline Comparte tu historia must stay");
  else pass("Comparte tu historia kept");
  if (!interviewHtml.includes("← Libro de la familia")) fail("back link must read Libro de la familia");
  else pass("family book back link");
  if (!interviewHtml.includes("Vista previa")) fail("preview banner missing");
  else pass("preview banner");
  if (!wizardSrc.includes('get("preview") === "1"') && !wizardSrc.includes("isPreviewRequest")) {
    fail("wizard must recognize ?preview=1");
  } else pass("preview query");
  const visibleInterview = [interviewHtml, wizardSrc, thanksHtml, fs.readFileSync(path.join(base, "interview", "thank-you.js"), "utf8")]
    .join("\n")
    .replace(/\/crooke-7c3a9e12\/[^\s"'<>]*/g, "")
    .replace(/crooke-interview/g, "")
    .replace(/crooke-interview-wizard-v2/g, "");
  if (/crooke/i.test(visibleInterview)) fail("interview visible copy must not mention Crooke");
  else pass("interview copy omits Crooke");
  if (!/noindex/i.test(thanksHtml)) fail("thank-you page must be noindex");
  else pass("thank-you noindex");
  if (!wizardSrc.includes("Subir nota de voz / Upload a voice memo")) fail("voice memo upload label missing");
  else pass("voice memo upload label");
  if (!/accept="audio\/\*"/.test(wizardSrc)) fail("voice upload must accept audio/*");
  else pass("voice upload accept");
  if (/data-voice-upload="\$\{voiceKey\}"[^>]*capture=/.test(wizardSrc) || /accept="audio\/\*"[^>]*capture=/.test(wizardSrc)) {
    fail("voice upload must not set capture");
  } else pass("voice upload has no capture");
  if (!wizardSrc.includes("audio/mp4") || !wizardSrc.includes("audio/aac")) fail("recorder must consider Safari audio types");
  else pass("Safari audio mime candidates");
  if (!interviewHtml.includes("interview-wizard.js")) fail("interview must load interview-wizard.js");
  else pass("interview wizard script");
  if (!interviewHtml.includes('type="module"')) fail("interview wizard must use module script");
  else pass("interview module script");
  if (!/JESUS_WHATSAPP_E164\s*=\s*""/.test(configSrc)) {
    fail("JESUS_WHATSAPP_E164 must remain empty placeholder until it is set");
  } else pass("JESUS_WHATSAPP_E164 placeholder");
  for (const field of [
    "voice_about_you",
    "voice_loved_ones",
    "voice_family_stories",
    "loved_ones",
    "family_stories",
    "old_photo",
    "relative_1_name",
    "more_stories",
    "para",
  ]) {
    if (!interviewHtml.includes(`name="${field}"`)) fail(`interview Netlify register missing field ${field}`);
  }
  for (const retired of ["charles_memorial", "mami_charles_story", "voice_charles_memorial", "voice_mami_charles_story"]) {
    if (interviewHtml.includes(`name="${retired}"`) || wizardSrc.includes(retired)) {
      fail(`retired interview field still present: ${retired}`);
    }
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

if (/data-i18n="nav\.elizabeth"/.test(html)) fail("home nav must not name a person");
else pass("home nav has no person tab");
if (html.includes("home.elizabeth")) fail("home notes still link Elizabeth by name");
else pass("home notes do not link Elizabeth");
if (!html.includes('data-i18n="nav.members"') || !html.includes('id="panel-members"')) fail("members tab or panel missing");
else pass("members tab and panel");
if (!html.includes("/crooke-7c3a9e12/elizabeth/")) fail("book must still link Elizabeth's chapter");
else pass("book links Elizabeth's chapter");

const elizabethPath = path.join(base, "elizabeth", "index.html");
if (!fs.existsSync(elizabethPath)) fail("missing elizabeth/index.html");
else {
  const elizabethHtml = fs.readFileSync(elizabethPath, "utf8");
  if (!/noindex/i.test(elizabethHtml)) fail("elizabeth page must be noindex");
  else pass("elizabeth noindex");
  if (/<a[^>]*>\s*Elizabeth\s*<\/a>/.test(elizabethHtml)) fail("elizabeth chapter nav still uses her name as a tab");
  else pass("elizabeth chapter nav has no person tab");
  if (!elizabethHtml.includes("Miembros") || !elizabethHtml.includes("Árbol familiar")) {
    fail("elizabeth chapter nav missing Members or Family Tree");
  } else pass("elizabeth chapter nav uses section titles");
  const audioCount = (elizabethHtml.match(/<audio\b/g) || []).length;
  if (audioCount !== 5) fail(`elizabeth page expected 5 audio players, found ${audioCount}`);
  else pass("elizabeth has five audio players");
  for (const clip of [
    "voice_about_you.mp3",
    "voice_places_origins.mp3",
    "voice_loved_ones.mp3",
    "voice_family_stories.mp3",
    "voice_more_stories.mp3",
  ]) {
    if (!elizabethHtml.includes(clip)) fail(`elizabeth page missing ${clip}`);
    if (!fs.existsSync(path.join(base, "elizabeth", "audio", clip))) fail(`missing audio file ${clip}`);
  }
  pass("elizabeth audio files referenced");
  for (const phrase of ["Moca", "Trujillo", "pelo de ángel", "Ana Luisa", "Georgie", "Cheche", "Yencenia", "Tavárez", "Roque"]) {
    if (!elizabethHtml.includes(phrase)) fail(`elizabeth page missing ${phrase}`);
  }
  if (!elizabethHtml.includes("(?)")) fail("uncertain words should stay marked with (?)");
  else pass("elizabeth transcript keeps uncertain words");
}

const mainJs = fs.readFileSync(path.join(base, "main.js"), "utf8");
for (const id of ["crooke-grandfather", "tavarez-grandmother", "ana-luisa", "manuel", "georgie", "charlie", "cecilia", "yencenia", "hilda"]) {
  if (!mainJs.includes(`id: '${id}'`)) fail(`family tree missing ${id}`);
}
if (mainJs.includes("id: 'crooke-ancestor'")) fail("placeholder crooke ancestor should be replaced by Elizabeth's grandfather");
else pass("family tree includes relatives Elizabeth named");
if (!mainJs.includes("page: '/crooke-7c3a9e12/elizabeth/'") || !mainJs.includes("storyEn: 'View her story'")) {
  fail("tree must open Elizabeth's chapter with a story button");
} else pass("tree story button points at Elizabeth's chapter");
if (!mainJs.includes("'nav.members': 'Miembros'") || !mainJs.includes("'nav.tree': 'Árbol familiar'")) {
  fail("spanish nav missing Miembros or Árbol familiar");
} else pass("spanish section titles");
if (mainJs.includes("nav.elizabeth") || mainJs.includes("home.elizabeth")) fail("elizabeth name link copy remains");
else pass("elizabeth name links removed from nav and home notes");

function walkText(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walkText(full);
      continue;
    }
    if (!/\.(html|js|css|md|txt|json)$/i.test(ent.name)) continue;
    const body = fs.readFileSync(full, "utf8");
    if (/347[-.\s]?520[-.\s]?9203/.test(body)) fail(`phone number published in ${path.relative(root, full)}`);
  }
}
walkText(base);
pass("crooke folder does not publish Elizabeth's phone number");

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
