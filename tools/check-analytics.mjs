// Guards shared measurement wiring: every public HTML page loads the config + loader,
// gtag.js is never requested while ga4Id is empty, and a valid test ID triggers the loader.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const HTML_PAGES = [
  "index.html",
  "thank-you.html",
  "portfolio.html",
  "404.html",
  "channel-letters/index.html",
  "ada-signs/index.html",
  "construction-signs/index.html",
  "sign-permits-shop-drawings/index.html",
  "tools/sign-mockup/index.html",
  "tools/sign-mockup/proof/index.html",
];

const CONFIG_PATH = path.join(root, "assets/js/measurement-config.js");
const LOADER_PATH = path.join(root, "assets/js/measurement.js");
const CONFIG_SNIPPET = '<script src="/assets/js/measurement-config.js"></script>';
const LOADER_SNIPPET = '<script src="/assets/js/measurement.js"></script>';

let failures = 0;
const fail = msg => { failures++; console.log(`FAIL ${msg}`); };
const pass = msg => console.log(`ok   ${msg}`);

function readConfigGa4Id(configSrc) {
  const m = configSrc.match(/ga4Id:\s*"([^"]*)"/);
  return m ? m[1] : null;
}

function runLoaderInVm({ ga4Id, googleSiteVerification, bingSiteVerification, verification }) {
  const scripts = [];
  const metas = [];
  const window = {
    __ARC_MEASUREMENT__: {
      ga4Id,
      googleSiteVerification: googleSiteVerification || "",
      bingSiteVerification: bingSiteVerification || "",
    },
  };
  if (verification) window.__ARC_HEAD_OPTS__ = { verification: true };

  const document = {
    head: {
      appendChild(el) {
        if (el.tagName === "SCRIPT") scripts.push(el);
        if (el.tagName === "META") metas.push(el);
      },
    },
    createElement(tag) {
      const el = { tagName: String(tag).toUpperCase(), name: "", content: "", async: false, _src: "" };
      Object.defineProperty(el, "src", {
        get() { return el._src; },
        set(v) { el._src = v; },
      });
      return el;
    },
  };

  vm.runInNewContext(fs.readFileSync(LOADER_PATH, "utf8"), { window, document }, { filename: "measurement.js" });
  return { scripts, metas, gtag: window.gtag, dataLayer: window.dataLayer };
}

const configSrc = fs.readFileSync(CONFIG_PATH, "utf8");
const ga4InRepo = readConfigGa4Id(configSrc);
if (ga4InRepo !== "") fail(`committed measurement-config.js must keep ga4Id empty (found "${ga4InRepo}")`);
else pass("measurement-config.js keeps ga4Id empty in the repo");

for (const rel of HTML_PAGES) {
  const file = path.join(root, rel);
  const html = fs.readFileSync(file, "utf8");
  const label = rel.replace(/index\.html$/, "").replace(/\.html$/, "") || "/";
  if (!html.includes(CONFIG_SNIPPET)) fail(`${label}: missing measurement-config.js script tag`);
  else pass(`${label}: loads measurement-config.js`);
  if (!html.includes(LOADER_SNIPPET)) fail(`${label}: missing measurement.js script tag`);
  else pass(`${label}: loads measurement.js`);
  if (/googletagmanager\.com\/gtag\/js/.test(html)) fail(`${label}: inline gtag loader should be removed`);
}

const emptyRun = runLoaderInVm({ ga4Id: "" });
if (emptyRun.scripts.some(s => String(s.src || "").includes("googletagmanager"))) {
  fail("empty ga4Id must not append gtag.js script");
} else pass("empty ga4Id makes no gtag network request");

const testRun = runLoaderInVm({ ga4Id: "G-TEST12345" });
const gtagScript = testRun.scripts.find(s => String(s.src || "").includes("googletagmanager.com/gtag/js"));
if (!gtagScript) fail("valid test ga4Id must append gtag.js script");
else pass("valid test ga4Id appends gtag.js script");
if (typeof testRun.gtag !== "function") fail("valid test ga4Id must define window.gtag");
else pass("valid test ga4Id defines window.gtag");

const homeRun = runLoaderInVm({
  ga4Id: "",
  googleSiteVerification: "gsc-token-test",
  bingSiteVerification: "bing-token-test",
  verification: true,
});
const gsc = homeRun.metas.find(m => m.name === "google-site-verification");
const bing = homeRun.metas.find(m => m.name === "msvalidate.01");
if (!gsc || gsc.content !== "gsc-token-test") fail("homepage verification must emit google-site-verification meta when set");
else pass("verification meta google-site-verification when configured");
if (!bing || bing.content !== "bing-token-test") fail("homepage verification must emit msvalidate.01 meta when set");
else pass("verification meta msvalidate.01 when configured");

const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
if (!indexHtml.includes("__ARC_HEAD_OPTS__")) fail("index.html must set __ARC_HEAD_OPTS__ for verification metas");
else pass("index.html enables verification metas via __ARC_HEAD_OPTS__");

if (failures) {
  console.log(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log("\nAll analytics checks passed.");
