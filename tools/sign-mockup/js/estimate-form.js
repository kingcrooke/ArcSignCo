// "Request a formal estimate": the lead form on the tool (under the mockup) and on the phone proof
// page (after the concept is approved). Built here from one schema so both pages match; the static
// copy that registers it with Netlify Forms is the hidden form at the end of tools/sign-mockup/index.html
// (tools/check-sign-mockup.mjs checks the two list the same fields).
//
// Submitted with fetch as multipart form data to "/". Netlify's email notification for this form
// takes its subject from the hidden `subject` field, and `flags` is the first field in the email.
// Netlify Forms caps a submission at 8 MB with one file per field, so photos are spread over
// photo_1…photo_10 and large images are re-saved as JPEGs before sending.
import { getType, categoryOf, cleanSource } from "./catalog.js";
import { loadImageFile } from "./images.js";

export const FORM_NAME = "sign-estimate-request";
export const CONFIRM_TITLE = "Concept approved, request a formal estimate";
export const MAX_PHOTOS = 10;
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
// Netlify's 8 MB request limit, less room for the text fields and multipart overhead.
export const MAX_UPLOAD_BYTES = 7.5 * 1024 * 1024;
const PHOTO_EXT = /\.(jpe?g|png|heic|heif|pdf)$/i;
const ART_ACCEPT = ".ai,.eps,.pdf,.svg,.png,application/pdf,image/svg+xml,image/png,application/postscript,application/illustrator";

export const ROLES = ["Owner", "Tenant", "GC", "Architect", "Property manager"];
export const SIGN_TYPES = [
  "Storefront / fascia", "Blade / projecting", "Channel letters", "Lightbox / cabinet", "Window vinyl / graphics",
  "Awning", "ADA / interior wayfinding", "Mural / painted", "Monument / pylon", "Other",
];
export const LIT = ["Lit", "Non-lit", "Not sure"];
export const JOBS = ["New sign", "Replacing or removing an existing sign"];
export const SERVICES = ["Design", "Fabrication", "Installation", "Removal of old sign", "Permits / DOB filing", "Permit-only for an existing sign"];
export const CONTACT_PREFS = ["Call", "Text", "Either"];
export const YES_NO = ["Yes", "No", "Not sure"];
export const SURFACES = ["Brick", "Stone / masonry", "Stucco / EIFS", "Metal panel", "Wood", "Glass", "Awning frame", "Not sure"];
export const HEIGHTS = ["Ground floor, under 12 ft", "12–25 ft", "2nd floor or higher", "Not sure"];
// Ranges the customer picks for their own budget; not Arc prices.
export const BUDGETS = ["Under $1k", "$1–3k", "$3–10k", "$10–25k", "$25k+", "Not sure"];
const BOROUGHS = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island", "Jersey City", "Hoboken", "Newark", "Stamford"];

const PHOTO_FIELDS = Array.from({ length: MAX_PHOTOS }, (_, i) => `photo_${i + 1}`);
/** Every field the form submits, in email order. The Netlify registration copy must list exactly these. */
export const FIELD_NAMES = [
  "flags", "subject", "tab", "type", "src", "proof", "bot-field",
  "name", "email", "phone", "street", "city", "zip", "role", "sign_type", "sign_count",
  "size_w", "size_h", "size_unit", "size_not_sure", "lit", "job", "services", "target_date",
  ...PHOTO_FIELDS, "business", "contact_pref", "landmark", "surface", "height", "power", "budget", "artwork", "notes",
];
export const FILE_FIELDS = [...PHOTO_FIELDS, "artwork"];

/** The sign-type choice for a mockup type, from its category and its pricing row. */
export function signTypeFor(typeId) {
  if (!typeId) return "";
  const type = getType(typeId), cat = categoryOf(type);
  if (cat.id === "awning") return "Awning";
  if (cat.id === "ada" || cat.id === "wayfinding") return "ADA / interior wayfinding";
  if (cat.id === "construction" || cat.id === "led") return "Other";
  const row = cat.pricing?.row?.[type.id] || "";
  if (row.startsWith("letters-")) return "Channel letters";
  if (row.startsWith("cabinet-")) return "Lightbox / cabinet";
  if (row.startsWith("blade-")) return "Blade / projecting";
  if (row === "graphics-vinyl") return "Window vinyl / graphics";
  if (row === "graphics-painted") return "Mural / painted";
  return "Storefront / fascia";
}

/** Width and height in inches as the form's size fields: feet (to the half foot) from 3 ft up. */
export function sizeFields(widthIn, heightIn) {
  if (!(widthIn > 0)) return null;
  const ft = widthIn >= 36;
  const f = v => (v > 0 ? String(ft ? Math.max(0.5, Math.round(v / 6) / 2) : Math.max(1, Math.round(v))) : "");
  return { w: f(widthIn), h: f(heightIn), unit: ft ? "ft" : "in" };
}

/** The flags shown at the top of Arc's email. */
export function flagsFor(v) {
  const services = v.services || [];
  return [
    v.lit === "Lit" && "Lit",
    services.some(s => /permit/i.test(s)) && "Permits requested",
    v.landmark === "Yes" && "Landmark = Yes",
    v.height === "2nd floor or higher" && "Height 2nd floor+",
  ].filter(Boolean);
}

export function subjectFor(v) {
  const who = (v.business || "").trim() || (v.name || "").trim();
  return `[Sign Preview] ${who} / ${(v.city || "").trim()} / ${v.sign_type || "Other"} / source=${cleanSource(v.src) || "direct"}`;
}

/** Test proofs, ?test=1 and automated browsers never send the form. */
export const isTestRun = (ctx, search = location.search, webdriver = navigator.webdriver) =>
  !!ctx?.test || new URLSearchParams(search).get("test") === "1" || !!webdriver;

// ---------- markup ----------
let uid = 0;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const opt = (v, sel) => `<option${v === sel ? " selected" : ""}>${esc(v)}</option>`;
const select = (name, list, { required = false, placeholder = "Choose…", id } = {}) =>
  `<select name="${name}"${id ? ` id="${id}"` : ""}${required ? " required" : ""}><option value="">${placeholder}</option>${list.map(v => opt(v)).join("")}</select>`;
const radios = (name, list, { required = false, checked = "", hints = {} } = {}) => list.map(v =>
  `<label class="ef-choice"><input type="radio" name="${name}" value="${esc(v)}"${required ? " required" : ""}${v === checked ? " checked" : ""}> <span>${esc(v)}</span>${hints[v] ? `<small class="ef-hint">${esc(hints[v])}</small>` : ""}</label>`).join("");

function markup(p) {
  const today = new Date().toISOString().slice(0, 10);
  return `
<form class="ef-form" name="${FORM_NAME}" novalidate>
  <input type="hidden" name="flags"><input type="hidden" name="subject">
  <input type="hidden" name="tab"><input type="hidden" name="type"><input type="hidden" name="src"><input type="hidden" name="proof">
  <p class="ef-hp" aria-hidden="true"><label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
  <p class="ef-req-note">All fields are required unless they're in "Help us price it faster".</p>

  <div class="ef-grid">
    <label class="ef-field">Name <input type="text" name="name" maxlength="80" autocomplete="name" required></label>
    <label class="ef-field">Email <input type="email" name="email" maxlength="120" autocomplete="email" required></label>
    <label class="ef-field">Phone <input type="tel" name="phone" maxlength="30" autocomplete="tel" inputmode="tel" required></label>
  </div>

  <fieldset class="ef-set">
    <legend>Install address</legend>
    <div class="ef-grid ef-addr">
      <label class="ef-field ef-wide">Street <input type="text" name="street" maxlength="120" autocomplete="street-address" required></label>
      <label class="ef-field">Borough or city <input type="text" name="city" maxlength="60" autocomplete="address-level2" list="${p}-boroughs" required></label>
      <label class="ef-field">ZIP <input type="text" name="zip" maxlength="10" autocomplete="postal-code" inputmode="numeric" pattern="\\d{5}(-\\d{4})?" required></label>
    </div>
    <datalist id="${p}-boroughs">${BOROUGHS.map(b => `<option value="${b}">`).join("")}</datalist>
  </fieldset>

  <fieldset class="ef-set">
    <legend>Your role</legend>
    <div class="ef-choices">${radios("role", ROLES, { required: true, hints: { Tenant: "Tenants need landlord approval." } })}</div>
  </fieldset>

  <div class="ef-grid">
    <label class="ef-field">Sign type ${select("sign_type", SIGN_TYPES, { required: true })}</label>
    <label class="ef-field">Number of signs <input type="number" name="sign_count" min="1" max="99" step="1" value="1" required></label>
  </div>

  <fieldset class="ef-set">
    <legend>Approximate size</legend>
    <div class="ef-size">
      <label class="ef-field">Width <input type="number" name="size_w" min="0" step="0.5" inputmode="decimal"></label>
      <span class="ef-x" aria-hidden="true">×</span>
      <label class="ef-field">Height <input type="number" name="size_h" min="0" step="0.5" inputmode="decimal"></label>
      <label class="ef-field ef-unit">Unit <select name="size_unit"><option value="ft">ft</option><option value="in">in</option></select></label>
      <label class="ef-choice ef-unsure"><input type="checkbox" name="size_not_sure" value="Yes"> <span>Not sure</span></label>
    </div>
  </fieldset>

  <fieldset class="ef-set">
    <legend>Lighting</legend>
    <div class="ef-choices">${radios("lit", LIT, { required: true })}</div>
  </fieldset>

  <fieldset class="ef-set">
    <legend>New or replacing</legend>
    <div class="ef-choices">${radios("job", JOBS, { required: true })}</div>
  </fieldset>

  <fieldset class="ef-set" data-group="services">
    <legend>Services needed <small>(pick any)</small></legend>
    <input type="hidden" name="services">
    <div class="ef-choices">${SERVICES.map(s => `<label class="ef-choice"><input type="checkbox" data-service value="${esc(s)}"> <span>${esc(s)}</span></label>`).join("")}</div>
  </fieldset>

  <label class="ef-field ef-date">Target install or opening date <input type="date" name="target_date" min="${today}" required></label>

  <details class="ef-more">
    <summary>Help us price it faster <small>optional</small></summary>
    <div class="ef-more-body">
      <div class="ef-photos">
        <label class="ef-field">Photos <small>(up to ${MAX_PHOTOS}, recommended)</small>
          <input type="file" data-photos multiple accept=".jpg,.jpeg,.png,.heic,.heif,.pdf,image/jpeg,image/png,image/heic,image/heif,application/pdf">
        </label>
        <p class="ef-hint">Wide storefront shot plus a close-up of where the sign goes; logo/artwork if you have it.</p>
        <p class="ef-fine">JPG, PNG, HEIC or PDF, up to 10 MB each. Photos are resized before sending; everything together must stay under about 7.5 MB, so for more, email them to <a href="mailto:arc@arcsignco.com">arc@arcsignco.com</a>.</p>
        <ul class="ef-files" data-photo-list></ul>
      </div>
      <div class="ef-grid">
        <label class="ef-field">Business name <input type="text" name="business" maxlength="120" autocomplete="organization"></label>
        <label class="ef-field">Call or text? ${select("contact_pref", CONTACT_PREFS, { placeholder: "No preference" })}</label>
      </div>
      <fieldset class="ef-set">
        <legend>Landmark or historic district?</legend>
        <div class="ef-choices">${radios("landmark", YES_NO, { checked: "Not sure" })}</div>
      </fieldset>
      <div class="ef-grid">
        <label class="ef-field">Mounting surface ${select("surface", SURFACES)}</label>
        <label class="ef-field">Mounting height ${select("height", HEIGHTS)}</label>
      </div>
      <fieldset class="ef-set" data-power hidden>
        <legend>Power at the sign location?</legend>
        <div class="ef-choices">${radios("power", YES_NO)}</div>
      </fieldset>
      <label class="ef-field">Budget range <small>(your range, not a price)</small> ${select("budget", BUDGETS)}</label>
      <label class="ef-field">Artwork or logo file <small>(AI, EPS, PDF, SVG or PNG)</small>
        <input type="file" name="artwork" accept="${ART_ACCEPT}">
      </label>
      <label class="ef-field">Notes <textarea name="notes" rows="3" maxlength="1500" placeholder="Colors, materials, timing, access, anything else"></textarea></label>
    </div>
  </details>

  <p class="ef-error" role="alert" hidden></p>
  <button type="submit" class="btn gold lg ef-submit">Request a formal estimate</button>
  <p class="ef-fine">Arc replies with a formal written estimate. Call or text <a href="tel:+13474502110">(347) 450-2110</a> with questions.</p>
</form>
<div class="ef-done" tabindex="-1" hidden>
  <strong>${esc(CONFIRM_TITLE)}</strong>
  <span data-done-text></span>
</div>`;
}

// ---------- photos ----------
async function asJpeg(file, maxSide) {
  const { canvas } = await loadImageFile(file, { maxSide });
  // White behind transparent PNG areas, which would turn black in a JPEG.
  const c = Object.assign(document.createElement("canvas"), { width: canvas.width, height: canvas.height });
  const g = c.getContext("2d");
  g.fillStyle = "#fff";
  g.fillRect(0, 0, c.width, c.height);
  g.drawImage(canvas, 0, 0);
  const blob = await new Promise(r => c.toBlob(r, "image/jpeg", 0.82));
  return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
}

/** Photos ready to send: small JPEG/PNG files as they are, other images re-saved as JPEGs, PDFs as they are. */
export async function preparePhotos(files, budget = MAX_UPLOAD_BYTES) {
  for (const maxSide of [2000, 1400]) {
    const out = [];
    for (const f of files) {
      if (/\.pdf$/i.test(f.name) || f.type === "application/pdf") out.push(f);
      else if (/\.(jpe?g|png)$/i.test(f.name) && f.size <= 900 * 1024) out.push(f);
      else out.push(await asJpeg(f, maxSide));
    }
    if (out.reduce((n, f) => n + f.size, 0) <= budget) return out;
  }
  throw new Error(`The photos are too large to send together. Remove a few, or email them to arc@arcsignco.com.`);
}

// ---------- mount ----------
/**
 * Builds the form in `container`.
 * @param {HTMLElement} container
 * @param {{ context: () => {typeId?: string, src?: string, proof?: string, widthIn?: number, heightIn?: number, lit?: boolean|null, name?: string, test?: boolean} }} opts
 * @returns {{ prefill: () => void, form: HTMLFormElement }}
 */
export function mountEstimateForm(container, { context }) {
  const p = `ef${++uid}`;
  container.innerHTML = markup(p);
  const form = container.querySelector("form");
  const done = container.querySelector(".ef-done");
  const err = form.querySelector(".ef-error");
  const photoInput = form.querySelector("[data-photos]");
  const photoList = form.querySelector("[data-photo-list]");
  const power = form.querySelector("[data-power]");
  const el = name => form.elements.namedItem(name);
  let photos = [];

  // A field the user has changed is never overwritten by a later prefill.
  form.addEventListener("input", e => { if (e.target.name) e.target.dataset.touched = "1"; });
  const touched = name => {
    const f = el(name);
    return f && (f instanceof RadioNodeList ? [...f].some(r => r.dataset.touched) : f.dataset.touched);
  };
  const setRadio = (name, value) => { for (const r of form.querySelectorAll(`input[name="${name}"]`)) r.checked = r.value === value; };

  function syncPower() {
    const on = form.querySelector('input[name="lit"]:checked')?.value === "Lit";
    power.hidden = !on;
    for (const r of power.querySelectorAll("input")) { r.disabled = !on; if (!on) r.checked = false; }
  }
  form.addEventListener("change", e => {
    if (e.target.name === "lit") syncPower();
    if (e.target.name === "size_not_sure") for (const n of ["size_w", "size_h"]) el(n).disabled = e.target.checked;
  });

  function prefill() {
    const c = context() || {};
    const type = c.typeId ? getType(c.typeId) : null;
    el("tab").value = type ? categoryOf(type).id : "";
    el("type").value = type ? type.id : "";
    el("src").value = cleanSource(c.src);
    el("proof").value = c.proof || "";
    if (type && !touched("sign_type")) el("sign_type").value = signTypeFor(type.id);
    const size = sizeFields(c.widthIn, c.heightIn);
    if (size && !touched("size_w") && !touched("size_h") && !touched("size_not_sure")) {
      el("size_w").value = size.w;
      el("size_h").value = size.h;
      el("size_unit").value = size.unit;
    }
    if (typeof c.lit === "boolean" && !touched("lit")) { setRadio("lit", c.lit ? "Lit" : "Non-lit"); syncPower(); }
    if (c.name && !el("name").value) el("name").value = c.name;
  }

  function renderPhotos() {
    photoList.replaceChildren(...photos.map((f, i) => {
      const li = document.createElement("li");
      li.append(Object.assign(document.createElement("span"), { textContent: `${f.name} (${(f.size / 1048576).toFixed(1)} MB)` }));
      const rm = Object.assign(document.createElement("button"), { type: "button", textContent: "Remove", className: "ef-rm" });
      rm.setAttribute("aria-label", `Remove ${f.name}`);
      rm.addEventListener("click", () => { photos.splice(i, 1); renderPhotos(); });
      li.append(rm);
      return li;
    }));
  }
  photoInput.addEventListener("change", () => {
    const picked = [...photoInput.files];
    photoInput.value = "";
    const bad = picked.filter(f => !PHOTO_EXT.test(f.name));
    const big = picked.filter(f => PHOTO_EXT.test(f.name) && f.size > MAX_FILE_BYTES);
    const okFiles = picked.filter(f => PHOTO_EXT.test(f.name) && f.size <= MAX_FILE_BYTES);
    const room = MAX_PHOTOS - photos.length;
    photos.push(...okFiles.slice(0, room));
    renderPhotos();
    const notes = [
      bad.length && `${bad.length} file(s) skipped: use JPG, PNG, HEIC or PDF.`,
      big.length && `${big.length} file(s) over 10 MB skipped.`,
      okFiles.length > room && `Up to ${MAX_PHOTOS} photos; ${okFiles.length - room} not added.`,
    ].filter(Boolean);
    showError(notes.join(" "));
  });

  function showError(text) { err.hidden = !text; err.textContent = text || ""; }

  function values() {
    const fd = new FormData(form);
    const v = Object.fromEntries([...fd.entries()].filter(([, x]) => typeof x === "string"));
    v.services = [...form.querySelectorAll("[data-service]:checked")].map(b => b.value);
    return v;
  }

  function validate(v) {
    for (const f of form.querySelectorAll("input[required], select[required]")) f.setCustomValidity("");
    const bad = [...form.querySelectorAll("input, select, textarea")].find(f => !f.disabled && !f.checkValidity());
    if (bad) {
      const label = bad.closest("fieldset")?.querySelector("legend")?.firstChild?.textContent?.trim() || bad.closest("label")?.firstChild?.textContent?.trim() || "This field";
      return { msg: `${label}: ${bad.validationMessage}`, focus: bad };
    }
    if (!v.size_not_sure && !(Number(v.size_w) > 0 && Number(v.size_h) > 0)) return { msg: "Add an approximate width and height, or check \"Not sure\".", focus: el("size_w") };
    if (!v.services.length) return { msg: "Pick at least one service.", focus: form.querySelector("[data-service]") };
    return null;
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    prefill();
    const v = values();
    const problem = validate(v);
    if (problem) { showError(problem.msg); problem.focus?.focus(); return; }
    showError("");
    const btn = form.querySelector(".ef-submit");
    btn.disabled = true;
    const label = btn.textContent;
    btn.textContent = "Sending…";
    try {
      const ready = await preparePhotos(photos);
      const art = el("artwork").files[0];
      if (art && art.size > MAX_FILE_BYTES) throw new Error("The artwork file is over 10 MB. Email it to arc@arcsignco.com instead.");
      const fileBytes = ready.reduce((n, f) => n + f.size, 0) + (art?.size || 0);
      if (fileBytes > MAX_UPLOAD_BYTES) throw new Error("The photos and artwork are too large to send together. Remove a photo, or email files to arc@arcsignco.com.");
      const flags = flagsFor(v);
      const body = new FormData();
      body.set("form-name", FORM_NAME);
      for (const name of FIELD_NAMES) {
        if (FILE_FIELDS.includes(name)) continue;
        body.set(name, name === "services" ? v.services.join(", ") : v[name] ?? "");
      }
      body.set("flags", flags.length ? `FLAGS: ${flags.join(" · ")}` : "No flags");
      body.set("subject", subjectFor(v));
      ready.forEach((f, i) => body.set(PHOTO_FIELDS[i], f, f.name));
      if (art) body.set("artwork", art, art.name);
      if (isTestRun(context())) {
        // Test mode: build the submission but never send it, so checks can read it.
        window.__estimateTest = { fields: Object.fromEntries([...body.entries()].map(([k, x]) => [k, typeof x === "string" ? x : { name: x.name, size: x.size, type: x.type }])) };
      } else {
        const res = await fetch("/", { method: "POST", body });
        if (!res.ok) throw new Error("Couldn't send the request. Try again, or call or text (347) 450-2110.");
      }
      form.hidden = true;
      done.hidden = false;
      done.querySelector("[data-done-text]").textContent = `Thanks, ${v.name.trim()}. Arc will follow up with a formal written estimate.`;
      done.focus();
    } catch (ex) {
      showError(ex.message || "Couldn't send the request. Try again.");
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  });

  prefill();
  syncPower();
  return { prefill, form };
}
