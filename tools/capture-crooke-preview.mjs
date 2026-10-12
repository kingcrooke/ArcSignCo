import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "docs", "qa");
const BASE = process.env.PREVIEW_URL || "http://127.0.0.1:8765/crooke-7c3a9e12/";

async function shot(page, name) {
  await page.screenshot({ path: path.join(outDir, name), fullPage: true });
  console.log("wrote", name);
}

const server = await import("node:http");
const fs = await import("node:fs");
const root = path.join(__dirname, "..");

function startStatic(port) {
  return new Promise(resolve => {
    const srv = server.createServer((req, res) => {
      let p = req.url?.split("?")[0] || "/";
      if (p.endsWith("/")) p += "index.html";
      const file = path.join(root, decodeURIComponent(p));
      if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.writeHead(404);
        res.end("not found");
        return;
      }
      const ext = path.extname(file);
      const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml" };
      res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
      fs.createReadStream(file).pipe(res);
    });
    srv.listen(port, () => resolve(srv));
  });
}

const port = 8765;
let srv;
if (!process.env.PREVIEW_URL) {
  srv = await startStatic(port);
}

const browser = await chromium.launch();
const page = await browser.newPage();

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(BASE, { waitUntil: "networkidle" });
await shot(page, "crooke-mobile-home-en.png");

await page.click('[data-lang-btn="es"]');
await page.waitForTimeout(200);
await shot(page, "crooke-mobile-home-es.png");

await page.setViewportSize({ width: 1280, height: 900 });
await page.click('[data-lang-btn="en"]');
await page.goto(BASE, { waitUntil: "networkidle" });
await shot(page, "crooke-desktop-home-en.png");

await page.goto(`${BASE}#tree`, { waitUntil: "networkidle" });
await page.click('[data-person="charles"]');
await shot(page, "crooke-desktop-tree-en.png");

await browser.close();
if (srv) srv.close();
