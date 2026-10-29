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

    const idleLabel = await page.getByRole("button", { name: "Toca para grabar" }).innerText();
    if (!idleLabel.includes("Tap to record")) fail(`idle label ${idleLabel}`);
    else ok("idle button is bilingual");
    await page.getByRole("button", { name: "Toca para grabar" }).click();
    await page.getByRole("button", { name: "Detener" }).waitFor();
    const live = await page.locator(".record-live").innerText();
    if (!live.includes("Grabando") || !live.includes("Recording")) fail(`recording label ${live}`);
    else ok("recording label is bilingual");
    const timer1 = (await page.locator("[data-record-timer]").innerText()).trim();
    if (!/^\d+:\d{2}$/.test(timer1)) fail(`timer ${timer1}`);
    else ok("recording timer is mm:ss");
    await page.waitForTimeout(1100);
    const timer2 = (await page.locator("[data-record-timer]").innerText()).trim();
    if (timer2 === timer1) fail(`timer did not advance (${timer1})`);
    else ok("recording timer advances");
    const options = await page.evaluate(() => window.__recorderOptions);
    if (!options || options.mimeType !== "audio/mp4") fail(`recorder options ${JSON.stringify(options)}`);
    else ok("recorder uses audio/mp4 on Safari");
    await page.getByRole("button", { name: "Detener" }).click();
    await page.locator(".record-saved").waitFor();
    const saved = await page.locator(".record-saved").innerText();
    if (!/Grabación guardada \(\d+:\d{2}\) \/ Recording saved \(\d+:\d{2}\)/.test(saved)) {
      fail(`saved state ${saved}`);
    } else ok("saved state shows duration in both languages");
    if ((await page.locator(".voice-player").count()) !== 1) fail("saved state has no player");
    else ok("saved state has an audio player");
    const replace = await page.locator(".record-replace").innerText();
    if (!replace.includes("reemplaza") || !replace.includes("replaces")) fail(`rerecord warning ${replace}`);
    else ok("re-record warns that it replaces the take");
    if (!(await page.getByRole("button", { name: "Borrar" }).count())) fail("delete button missing");
    else ok("delete button is present");
    const onCard = await page.locator(".voice-checklist").innerText();
    if (!onCard.includes("Sobre ti y tu niñez") || !onCard.includes("Grabación guardada")) {
      fail("question card does not list the saved voice note");
    } else ok("question card lists the saved voice note");
    const wideSaved = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (wideSaved) fail("saved recorder scrolls sideways");
    else ok("saved recorder does not scroll sideways");

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
    await page.locator('[data-recorder-state="saved"]').waitFor();
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
    const reviewNotes = await page.locator(".voice-checklist").innerText();
    if (!reviewNotes.includes("Sobre ti y tu niñez") || !reviewNotes.includes("Padres") || !reviewNotes.includes("Grabación guardada")) {
      fail("summary does not list saved voice notes");
    } else ok("summary lists saved voice notes before submit");
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
    await deniedPage.getByRole("button", { name: "Toca para grabar" }).click();
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
    if (await missingPage.getByRole("button", { name: "Toca para grabar" }).count()) fail("speak button shown without MediaRecorder");
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

    const iso = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await iso.addInitScript(() => {
      window.__recorders = [];
      window.__recId = 0;
      window.__gumCalls = 0;
      window.__stoppedTracks = 0;
      class LeakyRecorder {
        constructor(_stream, options) {
          this.mimeType = options && options.mimeType ? options.mimeType : "audio/webm";
          this.state = "inactive";
          this.ondataavailable = null;
          this.onstop = null;
          this.ticks = 0;
          this.id = ++window.__recId;
          window.__recorders.push(this);
        }
        start() {
          this.state = "recording";
          const emit = () => {
            if (this.state !== "recording") return;
            this.ticks += 1;
            const data = new Blob([`R${this.id}C${this.ticks}|`], { type: this.mimeType });
            if (this.ondataavailable) this.ondataavailable({ data });
          };
          emit();
          this._timer = setInterval(emit, 30);
        }
        stop() {
          clearInterval(this._timer);
          this.state = "inactive";
          const data = new Blob([`R${this.id}END|`], { type: this.mimeType });
          if (this.ondataavailable) this.ondataavailable({ data });
          queueMicrotask(() => {
            if (this.onstop) this.onstop();
          });
        }
        static isTypeSupported(type) {
          return type === "audio/webm;codecs=opus" || type === "audio/webm";
        }
      }
      window.MediaRecorder = LeakyRecorder;
      if (!navigator.mediaDevices) navigator.mediaDevices = {};
      navigator.mediaDevices.getUserMedia = async () => {
        window.__gumCalls += 1;
        const track = {
          stop() {
            window.__stoppedTracks += 1;
          },
        };
        return { getTracks: () => [track] };
      };
    });
    const isoPage = await iso.newPage();
    const isoPosts = [];
    await isoPage.route("**/*", route => {
      const req = route.request();
      if (req.method() === "POST") {
        isoPosts.push(req.postDataBuffer());
        return route.fulfill({ status: 200, body: "ok" });
      }
      return route.continue();
    });

    await isoPage.goto(`${BASE}/crooke-7c3a9e12/elizabeth/`, { waitUntil: "networkidle" });
    if ((await isoPage.locator("audio").count()) !== 5) fail("elizabeth page should have 5 audio players");
    else ok("elizabeth page has 5 audio players");
    const elizabethText = await isoPage.locator("body").innerText();
    if (!elizabethText.includes("pelo de ángel") || !elizabethText.includes("Moca")) fail("elizabeth transcript text missing");
    else ok("elizabeth transcript is on the page");
    if (/347[-.\s]?520[-.\s]?9203/.test(elizabethText)) fail("elizabeth page shows a phone number");
    else ok("elizabeth page hides contact details");
    const elizabethWide = await isoPage.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    if (elizabethWide) fail("elizabeth page scrolls sideways on a phone");
    else ok("elizabeth page does not scroll sideways");
    await isoPage.getByRole("button", { name: "ES" }).click();
    const spanishBio = await isoPage.locator("body").innerText();
    if (!spanishBio.includes("nació en Moca") || !spanishBio.includes("tobogán")) fail("spanish chapter did not switch");
    else ok("elizabeth chapter switches to Spanish");

    await isoPage.goto(PAGE, { waitUntil: "networkidle" });
    await isoPage.getByRole("button", { name: "Siguiente" }).click();
    await isoPage.locator("#f_name").fill("Ana");
    await isoPage.getByRole("button", { name: "Siguiente" }).click();
    await isoPage.getByRole("heading", { name: "Sobre ti y tu niñez" }).waitFor();
    await isoPage.getByRole("button", { name: "Toca para grabar" }).click();
    await isoPage.waitForFunction(() => window.__recorders.some(r => r.state === "recording" && r.ticks >= 2));
    await isoPage.getByRole("button", { name: "Siguiente" }).click();
    await isoPage.getByRole("heading", { name: "Padres" }).waitFor();
    const afterLeave = await isoPage.evaluate(() => ({
      recording: window.__recorders.filter(r => r.state === "recording").length,
      gum: window.__gumCalls,
      stopped: window.__stoppedTracks,
    }));
    if (afterLeave.recording !== 0 || afterLeave.gum !== 1 || afterLeave.stopped < 1) {
      fail(`recorder kept running after leaving the question: ${JSON.stringify(afterLeave)}`);
    } else ok("leaving a question stops that take and its mic track");

    await isoPage.getByRole("button", { name: "Toca para grabar" }).click();
    await isoPage.waitForFunction(() => window.__recorders.filter(r => r.state === "recording").length === 1 && window.__recorders.some(r => r.ticks >= 2));
    await isoPage.getByRole("button", { name: "Detener" }).click();
    await isoPage.locator('[data-recorder-state="saved"]').waitFor();
    await isoPage.getByRole("button", { name: "Grabar de nuevo" }).click();
    await isoPage.waitForFunction(() => {
      const live = window.__recorders.filter(r => r.state === "recording");
      return live.length === 1 && live[0].ticks >= 2 && window.__recorders.length === 3;
    });
    await isoPage.getByRole("button", { name: "Detener" }).click();
    await isoPage.locator('[data-recorder-state="saved"]').waitFor();
    const replaced = await isoPage.evaluate(() => ({
      recording: window.__recorders.filter(r => r.state === "recording").length,
      gum: window.__gumCalls,
      stopped: window.__stoppedTracks,
    }));
    if (replaced.recording !== 0 || replaced.gum !== 3 || replaced.stopped < 3) {
      fail(`re-record did not isolate takes: ${JSON.stringify(replaced)}`);
    } else ok("each question starts a fresh recorder and stops the previous tracks");

    for (let i = 0; i < 8; i++) {
      const skip = isoPage.getByRole("button", { name: "Saltar" });
      if (await skip.count()) await skip.click();
      else break;
    }
    await isoPage.getByRole("heading", { name: "¿Listo para enviar?" }).waitFor();
    await isoPage.getByRole("button", { name: "Enviar" }).click();
    await isoPage.waitForURL("**/thank-you.html");
    if (isoPosts.length !== 1) fail(`isolation submit count ${isoPosts.length}`);
    else {
      const body = isoPosts[0].toString("latin1");
      const keptFirst = body.includes("R1END|");
      const droppedRerecord = !body.includes("R2C") && !body.includes("R2END|");
      const keptReplacement = body.includes("R3END|");
      const aboutFile = body.includes('name="voice_about_you"') && body.includes("voice_about_you.webm");
      const parentFile = body.includes('name="voice_parents"') && body.includes("voice_parents.webm");
      if (!keptFirst || !droppedRerecord || !keptReplacement || !aboutFile || !parentFile) {
        fail(
          `takes were mixed or mis-filed (R1=${keptFirst} noR2=${droppedRerecord} R3=${keptReplacement} about=${aboutFile} parents=${parentFile})`,
        );
      } else ok("re-record replaces the take and each file stays on its question");
    }
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
