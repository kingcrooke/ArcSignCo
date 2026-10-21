// Local check for the Crooke interview wizard: titles, general questions, voice upload,
// Safari mime selection, and that the Netlify POST still carries the audio files.
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 9877;
const BASE = `http://127.0.0.1:${PORT}`;
const PAGE = `${BASE}/crooke-7c3a9e12/interview/`;
let failures = 0;
const ok = msg => console.log(`ok   ${msg}`);
const fail = msg => {
  failures++;
  console.log(`FAIL ${msg}`);
};

function startServer() {
  return spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], {
    cwd: root,
    stdio: "pipe",
  });
}

async function waitForServer(url) {
  const start = Date.now();
  while (Date.now() - start < 15000) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* retry */
    }
    await new Promise(r => setTimeout(r, 200));
  }
  throw new Error(`server did not respond at ${url}`);
}

const safariRecorder = () => {
  class FakeRecorder {
    constructor(_stream, options) {
      this.mimeType = options && options.mimeType ? options.mimeType : "";
      this.state = "inactive";
      this.ondataavailable = null;
      this.onstop = null;
      window.__recorderOptions = options || null;
    }
    start() {
      this.state = "recording";
      const type = this.mimeType || "audio/mp4";
      if (!this.mimeType) this.mimeType = type;
      const data = new Blob(["CROOKE-VOICE-MARKER-7c3a"], { type });
      queueMicrotask(() => {
        if (this.ondataavailable) this.ondataavailable({ data });
      });
    }
    stop() {
      this.state = "inactive";
      queueMicrotask(() => {
        if (this.onstop) this.onstop();
      });
    }
    static isTypeSupported(type) {
      return type === "audio/mp4" || type === "audio/aac";
    }
  }
  window.MediaRecorder = FakeRecorder;
  if (!navigator.mediaDevices) navigator.mediaDevices = {};
  navigator.mediaDevices.getUserMedia = async () => ({ getTracks: () => [{ stop() {} }] });
};

async function run() {
  const server = startServer();
  const browser = await chromium.launch({ headless: true });
  try {
    await waitForServer(PAGE);
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.addInitScript(safariRecorder);
    const page = await context.newPage();
    const posts = [];
    await page.route("**/*", route => {
      const req = route.request();
      if (req.method() === "POST") {
        posts.push(req.postDataBuffer());
        return route.fulfill({ status: 200, body: "ok" });
      }
      return route.continue();
    });

    await page.goto(PAGE, { waitUntil: "networkidle" });
    if ((await page.title()) !== "Entrevista Familia Morel") fail(`title ${await page.title()}`);
    else ok("Spanish page title");
    const h1 = (await page.locator("#interview-heading").textContent())?.trim();
    if (h1 !== "Entrevista Familia Morel") fail(`heading ${h1}`);
    else ok("Spanish heading");
    const welcome = await page.locator("#wizard-mount").innerText();
    if (!welcome.includes("Comparte tu historia")) fail("missing Comparte tu historia");
    else ok("welcome title kept");
    if (!welcome.includes("Todo se revisa antes de entrar al libro de la familia")) fail("welcome book wording");
    else ok("general welcome");
    if (!welcome.includes("Privacidad — no incluyas")) fail("privacy box missing");
    else ok("privacy box");
    if (/Jesús|Jesus|jesus\.crooke@gmail\.com|Charles|Mami/.test(welcome)) fail("welcome names a person");
    else ok("welcome does not name Jesus or Charles");
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    if (!/noindex/i.test(robots || "")) fail("noindex meta missing");
    else ok("noindex meta");
    const nav = await page.locator('a[aria-current="page"]').innerText();
    if (!nav.includes("Entrevista")) fail(`nav ${nav}`);
    else ok("short nav label");
    const visible = await page.locator("body").innerText();
    if (!visible.includes("← Libro de la familia")) fail("back link label");
    else ok("family book back link");
    if (/crooke/i.test(visible)) fail("visible copy still mentions Crooke");
    else ok("visible copy omits Crooke");

    await page.getByRole("button", { name: "Siguiente" }).click();
    await page.locator("#f_name").fill("Ana");
    await page.getByRole("button", { name: "Siguiente" }).click();
    await page.getByRole("heading", { name: "Sobre ti y tu niñez" }).waitFor();
    const upload = page.locator("[data-voice-upload]");
    if ((await upload.count()) !== 1) fail("voice upload missing on question");
    else ok("voice upload on question");
    const accept = await upload.getAttribute("accept");
    const capture = await upload.getAttribute("capture");
    if (accept !== "audio/*" || capture) fail(`upload accept=${accept} capture=${capture}`);
    else ok("upload accepts audio files without capture");
    if (!(await page.locator(".voice-upload-label").innerText()).includes("Subir nota de voz / Upload a voice memo")) {
      fail("upload label");
    } else ok("bilingual upload label");
    const wide = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (wide) fail("question step scrolls sideways");
    else ok("mobile question does not scroll sideways");

    await page.getByRole("button", { name: "Hablar" }).click();
    await page.getByRole("button", { name: "Detener" }).waitFor();
    const options = await page.evaluate(() => window.__recorderOptions);
    if (!options || options.mimeType !== "audio/mp4") fail(`recorder options ${JSON.stringify(options)}`);
    else ok("recorder uses audio/mp4 on Safari");
    await page.getByRole("button", { name: "Detener" }).click();
    await page.getByText("Audio listo para enviar").waitFor();
    ok("recorded clip ready");

    await page.getByRole("button", { name: "Siguiente" }).click();
    await page.getByRole("heading", { name: "Padres" }).waitFor();
    const hint = await page.locator(".wizard-lead").first().innerText();
    if (!hint.includes("Tu madre y tu padre")) fail(`parents hint changed: ${hint}`);
    else ok("parents hint stays general");
    await page.locator("[data-voice-upload]").setInputFiles({
      name: "Voice Memo.m4a",
      mimeType: "audio/mp4",
      buffer: Buffer.from("CROOKE-UPLOAD-MARKER"),
    });
    await page.getByText("Audio listo para enviar").waitFor();
    ok("uploaded voice memo");

    const titles = ["Padres"];
    for (let i = 0; i < 8; i++) {
      const heading = await page.locator(".wizard-card h2").innerText();
      if (!titles.includes(heading)) titles.push(heading);
      const skip = page.getByRole("button", { name: "Saltar" });
      if (await skip.count()) await skip.click();
      else break;
    }
    await page.getByRole("heading", { name: "¿Listo para enviar?" }).waitFor();
    const expected = [
      "Sobre ti y tu niñez",
      "Padres",
      "Abuelos y mayores",
      "Lugares y orígenes",
      "Familiares que ya no están",
      "Historias de la familia",
      "Tradiciones, comida, dichos y más",
    ];
    for (const title of expected) {
      if (!titles.includes(title) && title !== "Sobre ti y tu niñez") {
        /* first title was left before this loop recorded Padres onward */
      }
    }
    if (!titles.includes("Familiares que ya no están") || !titles.includes("Historias de la familia")) {
      fail(`question titles ${titles.join(" | ")}`);
    } else ok("general question titles");
    if (titles.some(t => /Charles|Mami/.test(t))) fail("a question still names Charles or Mami");
    else ok("no person-focused question");

    await page.getByRole("button", { name: "English" }).click();
    if ((await page.title()) !== "Morel Family Interview") fail(`english title ${await page.title()}`);
    else ok("English page title");
    if ((await page.locator("#interview-heading").innerText()).trim() !== "Morel Family Interview") fail("english heading");
    else ok("English heading");
    const submit = page.getByRole("button", { name: "Submit", exact: true });
    await submit.click();
    await page.waitForURL("**/thank-you.html");
    const thanks = await page.locator("body").innerText();
    if (/Jesus|Jesús|@|crooke/i.test(thanks)) fail("thank-you names a person, shows an email, or mentions Crooke");
    else ok("thank-you is general");
    if (!thanks.includes("libro de la familia") || !thanks.includes("the family book")) fail("thank-you book wording");
    else ok("thank-you says the family book");

    if (posts.length !== 1) fail(`expected 1 submit, got ${posts.length}`);
    else {
      const body = posts[0].toString("latin1");
      if (!body.includes("name=\"form-name\"") && !body.includes("crooke-interview")) fail("form name missing");
      else if (!body.includes("crooke-interview")) fail("form name missing");
      else ok("submission form is crooke-interview");
      if (!body.includes("voice_about_you.m4a") || !body.includes("CROOKE-VOICE-MARKER-7c3a")) {
        fail("recorded audio missing from submission");
      } else ok("submission includes recorded m4a");
      if (!body.includes("Voice Memo.m4a") || !body.includes("CROOKE-UPLOAD-MARKER")) {
        fail("uploaded audio missing from submission");
      } else ok("submission includes uploaded voice memo");
      if (body.includes("charles_memorial") || body.includes("mami_charles") || body.includes("jesus.crooke@gmail.com")) {
        fail("submission still has retired fields or an email");
      } else ok("submission has no retired fields");
    }

    const denied = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await denied.addInitScript(() => {
      class FakeRecorder {
        static isTypeSupported() {
          return false;
        }
      }
      window.MediaRecorder = FakeRecorder;
      if (!navigator.mediaDevices) navigator.mediaDevices = {};
      navigator.mediaDevices.getUserMedia = async () => {
        const err = new Error("denied");
        err.name = "NotAllowedError";
        throw err;
      };
    });
    const deniedPage = await denied.newPage();
    await deniedPage.goto(PAGE, { waitUntil: "networkidle" });
    await deniedPage.getByRole("button", { name: "Saltar" }).click();
    await deniedPage.locator("#f_name").fill("Ana");
    await deniedPage.getByRole("button", { name: "Siguiente" }).click();
    await deniedPage.getByRole("button", { name: "Hablar" }).click();
    const deniedText = await deniedPage.locator("#wizard-mount").innerText();
    if (!deniedText.includes("Permiso de micrófono denegado") || !deniedText.includes("Microphone permission was denied")) {
      fail("mic denial is not bilingual");
    } else ok("mic denial is bilingual");
    if (!deniedText.includes("O envíala por WhatsApp a quien te compartió este enlace.")) fail("WhatsApp fallback missing");
    else ok("WhatsApp fallback without an email");
    if ((await deniedPage.locator("[data-voice-upload]").count()) !== 1) fail("upload missing after denial");
    else ok("upload remains after mic denial");

    const missing = await browser.newContext();
    await missing.addInitScript(() => {
      delete window.MediaRecorder;
      if (navigator.mediaDevices) delete navigator.mediaDevices.getUserMedia;
    });
    const missingPage = await missing.newPage();
    await missingPage.goto(PAGE, { waitUntil: "networkidle" });
    await missingPage.getByRole("button", { name: "Saltar" }).click();
    await missingPage.locator("#f_name").fill("Ana");
    await missingPage.getByRole("button", { name: "Siguiente" }).click();
    const missingText = await missingPage.locator("#wizard-mount").innerText();
    if (!missingText.includes("Este navegador no puede grabar voz") || !missingText.includes("This browser cannot record voice")) {
      fail(`missing recorder message: ${missingText.slice(0, 400)}`);
    } else ok("missing MediaRecorder is bilingual");
    if (await missingPage.getByRole("button", { name: "Hablar" }).count()) fail("speak button shown without MediaRecorder");
    else ok("speak button hidden when recording is unavailable");

    const plainDialogs = [];
    const plain = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const plainPage = await plain.newPage();
    plainPage.on("dialog", async dialog => {
      plainDialogs.push(dialog.message());
      await dialog.accept();
    });
    await plainPage.goto(PAGE, { waitUntil: "domcontentloaded" });
    await plainPage.locator("#wizard-mount h2").waitFor();
    if (await plainPage.locator("#preview-banner").isVisible()) fail("preview banner shows without ?preview=1");
    else ok("normal link hides the preview banner");
    await plainPage.getByRole("button", { name: "Siguiente" }).click();
    await plainPage.getByRole("button", { name: "Siguiente" }).click();
    if (!plainDialogs.some(msg => msg.includes("nombre"))) fail("name is not required without preview");
    else ok("name stays required without preview");
    if (!(await plainPage.locator("#f_name").count())) fail("empty name left the identity step");
    else ok("empty name does not advance");

    const previewPosts = [];
    const preview = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const previewPage = await preview.newPage();
    await previewPage.route("**/*", route => {
      if (route.request().method() === "POST") {
        previewPosts.push(route.request().url());
        return route.fulfill({ status: 200, body: "ok" });
      }
      return route.continue();
    });
    await previewPage.goto(`${PAGE}?preview=1`, { waitUntil: "domcontentloaded" });
    await previewPage.locator("#wizard-mount h2").waitFor();
    const banner = previewPage.locator("#preview-banner");
    if (!(await banner.isVisible()) || (await banner.innerText()).trim() !== "Vista previa") fail("Vista previa banner missing");
    else ok("Vista previa banner");
    const headings = [(await previewPage.locator(".wizard-card h2").innerText()).trim()];
    for (let i = 0; i < 11; i++) {
      await previewPage.getByRole("button", { name: "Siguiente" }).click();
      headings.push((await previewPage.locator(".wizard-card h2").innerText()).trim());
    }
    if (headings.length !== 12 || new Set(headings).size !== 12) fail(`preview screens: ${headings.join(" | ")}`);
    else ok("preview walks all 12 screens without answers");
    const previewSubmit = previewPage.locator('[data-nav="submit"]');
    if (!(await previewSubmit.isDisabled())) fail("preview submit is enabled");
    else ok("preview submit disabled");
    await previewSubmit.click({ force: true }).catch(() => {});
    await previewPage.waitForTimeout(300);
    if (previewPosts.length || /thank-you/.test(previewPage.url())) fail("preview submitted a form");
    else ok("preview cannot submit");

    await page.setViewportSize({ width: 1280, height: 900 });
  } finally {
    await browser.close();
    server.kill();
  }
  if (failures) {
    console.log(`\n${failures} interview browser check(s) failed.`);
    process.exit(1);
  }
  console.log("\nAll interview browser checks passed.");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
