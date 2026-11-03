// Exercises /visualize in a browser against tools/visualizer-server.mjs.
//   VISUALIZER_ADMIN_PASSWORD=local node tools/check-visualizer-browser.mjs
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { encodePng } from "../netlify/lib/visualizer/png.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = process.env.VISUALIZER_SHOTS || "/tmp/visualizer-shots";
const port = Number(process.env.PORT || 4173);
fs.mkdirSync(outDir, { recursive: true });

const logo = new Uint8ClampedArray(32 * 32 * 4);
for (let i = 0; i < logo.length; i += 4) {
  logo[i] = 200; logo[i + 1] = 16; logo[i + 2] = 32; logo[i + 3] = 255;
}
const logoPath = path.join(outDir, "logo.png");
fs.writeFileSync(logoPath, encodePng(32, 32, logo));

const server = spawn(process.execPath, ["tools/visualizer-server.mjs"], {
  cwd: root,
  env: { ...process.env, PORT: String(port), VISUALIZER_ADMIN_PASSWORD: "local-preview" },
  stdio: ["ignore", "pipe", "inherit"],
});
await new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error("server did not start")), 8000);
  server.stdout.on("data", (buf) => {
    if (String(buf).includes("visualize")) { clearTimeout(timer); resolve(); }
  });
  server.on("exit", (code) => reject(new Error(`server exited ${code}`)));
});

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("pageerror", (err) => errors.push(err.message));
page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });

const base = `http://127.0.0.1:${port}`;
await page.goto(`${base}/visualize/`, { waitUntil: "networkidle" });
await page.getByRole("heading", { name: "See your name on the vehicle or the storefront" }).waitFor();
await page.screenshot({ path: path.join(outDir, "visualize-pick.png"), fullPage: true });

await page.getByRole("button", { name: /Vehicle wrap/ }).click();
await page.locator("#bizName").fill("North Side Bagels");
await page.locator("#bizPhone").fill("7185551212");
await page.locator("#logoFile").setInputFiles(logoPath);
await page.waitForFunction(() => document.querySelector("#logoName")?.textContent?.length > 0);
await page.getByRole("button", { name: "Continue" }).click();
await page.locator("#year").fill("2024");
await page.locator("#make").fill("Ford");
await page.locator("#model").fill("Transit");
await page.waitForTimeout(3500);
await page.getByRole("button", { name: "Make 2 previews" }).click();
await page.getByRole("heading", { name: "One revision" }).waitFor({ timeout: 20000 });
await page.getByText("Custom quote", { exact: false }).first().waitFor();
await page.getByText("AI-generated visual reference").first().waitFor();
await page.getByText("layout placeholders").waitFor();
const thumbs = page.locator("#thumbs img");
if (await thumbs.count() !== 2) throw new Error(`expected 2 versions, saw ${await thumbs.count()}`);
await page.locator(".viz-handle").first().hover();
const handle = page.locator(".viz-handle").nth(1);
const box = await handle.boundingBox();
await page.mouse.move(box.x + 8, box.y + 8);
await page.mouse.down();
await page.mouse.move(box.x + 48, box.y + 20);
await page.mouse.up();
await page.locator("#editRequest").fill("Make the lettering larger");
await page.getByRole("button", { name: "Apply revision" }).click();
await page.getByRole("button", { name: "Revision" }).waitFor();
await page.locator("#leadName").fill("Ada Baker");
await page.locator("#leadPhone").fill("7185550199");
await page.locator("#leadEmail").fill("ada@north.example");
await page.locator("#timing").selectOption("this-month");
await page.getByRole("button", { name: "Send preview" }).click();
await page.getByRole("heading", { name: "Arc has this preview" }).waitFor();
await page.screenshot({ path: path.join(outDir, "visualize-sent.png") });
await page.screenshot({ path: path.join(outDir, "visualize-sent-full.png"), fullPage: true });

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/visualize/`, { waitUntil: "networkidle" });
const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
if (overflow) throw new Error("page scrolls sideways at 390px");
await page.screenshot({ path: path.join(outDir, "visualize-mobile.png"), fullPage: true });
await page.getByRole("button", { name: "Menu" }).click();
await page.getByRole("link", { name: "Free Sign Preview" }).first().waitFor();
await page.keyboard.press("Escape");

const admin = await browser.newPage({ viewport: { width: 1100, height: 800 } });
await admin.goto(`${base}/visualize/admin/`);
await admin.getByLabel("Password").fill("wrong");
await admin.getByRole("button", { name: "Open leads" }).click();
await admin.getByText("That password is not right.").waitFor();
await admin.getByLabel("Password").fill("local-preview");
await admin.getByRole("button", { name: "Open leads" }).click();
await admin.getByText("Ada Baker").waitFor();
await admin.getByText("Custom quote").waitFor();
await admin.getByText("sent").waitFor({ timeout: 2000 }).catch(() => admin.getByText("saved-no-email-key").waitFor());
await admin.screenshot({ path: path.join(outDir, "visualize-admin.png"), fullPage: true });

if (errors.length) throw new Error(errors.join("\n"));
await browser.close();
server.kill();
console.log(`browser checks passed\n${outDir}`);
