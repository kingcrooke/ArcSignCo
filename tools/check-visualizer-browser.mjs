// Exercises /visualize in a browser against tools/visualizer-server.mjs.
//   VISUALIZER_ADMIN_PASSWORD=local node tools/check-visualizer-browser.mjs
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = process.env.VISUALIZER_SHOTS || "/tmp/visualizer-shots";
const port = Number(process.env.PORT || 4173);
fs.mkdirSync(outDir, { recursive: true });

const server = spawn(process.execPath, ["tools/visualizer-server.mjs"], {
  cwd: root,
  env: { ...process.env, PORT: String(port), ARC_IMAGE_PROVIDER: "stub", VISUALIZER_ADMIN_PASSWORD: "local-preview" },
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
page.on("response", (res) => {
  if (res.status() >= 400) errors.push(`${res.status()} ${res.url()}`);
});

async function shot(name) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(outDir, name), fullPage: false });
}

const base = `http://127.0.0.1:${port}`;
await page.goto(`${base}/visualize/`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Use this work van" }).waitFor();
await page.getByRole("banner").getByRole("link", { name: "(347) 450-2110" }).waitFor();
await page.getByRole("banner").getByRole("link", { name: "arc@arcsignco.com" }).waitFor();
await shot("01-vehicle-choice.png");

await page.getByRole("button", { name: "Use a different vehicle" }).click();
await page.getByRole("button", { name: "Generate my vehicle" }).waitFor();
await shot("02-vehicle-form.png");
await page.locator("#year").fill("2022");
await page.locator("#make").fill("Ford");
await page.locator("#model").fill("Transit");
await page.locator("#paint").fill("white");
await page.getByRole("button", { name: "Generate my vehicle" }).click();
await page.getByRole("button", { name: "Looks great — Next step" }).waitFor({ timeout: 20000 });
await page.getByText("2022 Ford Transit").first().waitFor();
await shot("03-vehicle-confirm.png");
await page.getByRole("button", { name: "Looks great — Next step" }).click();

await page.getByRole("button", { name: "Generate", exact: true }).waitFor();
await shot("04-wrap-builder.png");
await page.getByRole("button", { name: /Coverage Options/ }).click();
await page.getByRole("button", { name: "Full wrap" }).click();
await page.getByRole("button", { name: /Style Preference/ }).click();
await page.getByRole("button", { name: "Bold & Sporty" }).click();
await page.getByRole("button", { name: /Color Accents/ }).click();
await page.getByRole("button", { name: "Red", exact: true }).click();
await page.getByRole("button", { name: "Gold", exact: true }).click();
await page.getByRole("button", { name: "Navy", exact: true }).click();
await page.getByRole("button", { name: /Business Name/ }).click();
await page.locator("#biz-name").fill("Acme Plumbing Co");
await page.getByRole("button", { name: "Side", exact: true }).click();
await shot("05-colors-selected.png");
if (await page.getByRole("button", { name: "Generate", exact: true }).isDisabled()) throw new Error("Generate stayed disabled");
await page.getByRole("button", { name: "Generate", exact: true }).click();
await page.getByText("Concept 1 of 3").waitFor({ timeout: 20000 });
await page.getByText("pick the direction you like best").waitFor();
await page.getByText("Previews are temporarily unavailable.").waitFor();
const dots = page.locator("#dots button");
if (await dots.count() !== 3) throw new Error(`expected 3 concepts, saw ${await dots.count()}`);
await shot("06-concepts.png");

await page.getByRole("button", { name: "Before / after" }).click({ timeout: 10000 });
await page.getByRole("heading", { name: "Drag to compare" }).waitFor();
await shot("07-before-after.png");
await page.getByRole("button", { name: "Close", exact: true }).click();

await page.getByRole("button", { name: "Request a change" }).click();
await page.locator("#editRequest").fill("Make the phone number bigger");
await shot("08-request-change.png");
await page.getByRole("button", { name: "Apply change" }).click();
await page.getByRole("button", { name: "Use this concept — Next step" }).waitFor({ timeout: 20000 });
await page.getByText("Concept 1 of 3").waitFor();
await shot("09-after-change.png");

await page.getByRole("button", { name: "Use this concept — Next step" }).click();
await page.getByRole("button", { name: "Request a follow-up" }).click();
await page.getByRole("button", { name: "Within the next few weeks" }).waitFor();
await shot("10-timeline.png");
await page.getByRole("button", { name: "Within the next few weeks" }).click();
await page.getByRole("button", { name: "Request a follow-up" }).waitFor();
const sms = page.locator("#smsUpdates");
const promo = page.locator("#smsPromos");
if (await sms.isChecked() || await promo.isChecked()) throw new Error("SMS consent must start unchecked");
if (await page.locator("#designPicks img").count() !== 3) throw new Error("lead form did not list 3 concepts");
await page.locator("#leadName").fill("Ada Baker");
await page.locator("#leadPhone").fill("7185550199");
await page.locator("#leadEmail").fill("ada@north.example");
await page.evaluate(() => {
  const chat = document.getElementById("chat");
  const form = document.getElementById("leadForm");
  if (chat && form) form.scrollIntoView({ block: "center" });
});
await shot("11-lead-form.png");
await page.getByRole("button", { name: "Request a follow-up" }).click();
await page.getByText("Arc will email back from arc@arcsignco.com").waitFor({ timeout: 20000 });
await shot("12-quote-sent.png");

await page.getByRole("button", { name: "Report a problem" }).click();
await page.getByRole("heading", { name: "Report a problem" }).waitFor();
await page.locator("#reportMessage").fill("The rear door lettering looks cramped.");
await shot("13-report.png");
await page.getByRole("button", { name: "Close" }).click();

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/visualize/`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Use this work van" }).waitFor();
const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
if (overflow) throw new Error("page scrolls sideways at 390px");
await page.screenshot({ path: path.join(outDir, "14-mobile.png"), fullPage: true });

const admin = await browser.newPage({ viewport: { width: 1100, height: 800 } });
await admin.goto(`${base}/visualize/admin/`);
await admin.getByLabel("Password").fill("wrong");
await admin.getByRole("button", { name: "Open leads" }).click();
await admin.getByText("That password is not right.").waitFor();
await admin.getByLabel("Password").fill("local-preview");
await admin.getByRole("button", { name: "Open leads" }).click();
await admin.getByText("Ada Baker").waitFor();
await admin.getByText("Custom quote").waitFor();
await admin.screenshot({ path: path.join(outDir, "15-admin.png"), fullPage: true });

if (errors.length) throw new Error(errors.join("\n"));
await browser.close();
server.kill();
console.log(`browser checks passed\n${outDir}`);
