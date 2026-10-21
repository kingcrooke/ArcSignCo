import {
  JESUS_WHATSAPP_E164,
  STORAGE_KEY,
  MAX_UPLOAD_BYTES,
  MAX_RECORD_SECONDS,
  SITE_INTERVIEW_PATH,
} from "./interview-config.js";

export const VOICE_MIME_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/aac",
  "audio/ogg;codecs=opus",
];

export const PAGE_NAME = {
  es: "Entrevista Familiar Crooke",
  en: "Crooke Family Interview",
};

const VOICE_UPLOAD_LABEL = "Subir nota de voz / Upload a voice memo";

const RECORDER_MESSAGES = {
  noRecorder: {
    es: "Este navegador no puede grabar voz. Sube una nota de voz, o envíala por WhatsApp a quien te compartió este enlace.",
    en: "This browser cannot record voice. Upload a voice memo, or send it by WhatsApp to the person who shared this link.",
  },
  micDenied: {
    es: "Permiso de micrófono denegado. Puedes subir una nota de voz, o enviarla por WhatsApp a quien te compartió este enlace.",
    en: "Microphone permission was denied. You can upload a voice memo, or send it by WhatsApp to the person who shared this link.",
  },
};

export const QUESTION_STEPS = [
  {
    id: "about_you",
    field: "about_you",
    voice: "voice_about_you",
    es: { title: "Sobre ti y tu niñez", hint: "Apodos, dónde creciste, primeros recuerdos, juegos y primos." },
    en: { title: "About you and your childhood", hint: "Nicknames, where you grew up, early memories, games and cousins." },
    wa: "Pregunta — niñez: ",
  },
  {
    id: "parents",
    field: "parents",
    voice: "voice_parents",
    es: { title: "Padres", hint: "Tu madre y tu padre — personalidad, trabajo, lecciones." },
    en: { title: "Parents", hint: "Your mother and father — personality, work, lessons." },
    wa: "Pregunta — padres: ",
  },
  {
    id: "grandparents",
    field: "grandparents",
    voice: "voice_grandparents",
    es: { title: "Abuelos y mayores", hint: "Historias de abuelos; quién guarda fotos antiguas." },
    en: { title: "Grandparents and elders", hint: "Grandparents’ stories; who keeps old photos." },
    wa: "Pregunta — abuelos: ",
  },
  {
    id: "places_origins",
    field: "places_origins",
    voice: "voice_places_origins",
    es: { title: "Lugares y orígenes", hint: "De dónde viene la familia; migración; Nueva York y la comunidad." },
    en: { title: "Places and origins", hint: "Where the family comes from; migration; New York and the community." },
    wa: "Pregunta — orígenes: ",
  },
  {
    id: "loved_ones",
    field: "loved_ones",
    voice: "voice_loved_ones",
    es: {
      title: "Familiares que ya no están",
      hint: "Recuerdos de seres queridos que ya no están — cómo los recuerdas, historias, lo que enseñaron.",
    },
    en: {
      title: "Relatives we've lost",
      hint: "Memories of loved ones who have passed — how you remember them, stories, what they taught.",
    },
    wa: "Pregunta — familiares que ya no están: ",
  },
  {
    id: "family_stories",
    field: "family_stories",
    voice: "voice_family_stories",
    es: {
      title: "Historias de la familia",
      hint: "Cómo se conocieron las parejas, la vida en familia, hermanos y momentos importantes.",
    },
    en: {
      title: "Family stories",
      hint: "How couples met, family life, siblings, and big moments.",
    },
    wa: "Pregunta — historias de la familia: ",
  },
  {
    id: "more_stories",
    field: "more_stories",
    voice: "voice_more_stories",
    es: {
      title: "Tradiciones, comida, dichos y más",
      hint: "Fiestas, recetas, canciones, papeles que existen (sin IDs), quién más debemos entrevistar.",
    },
    en: {
      title: "Traditions, food, sayings & more",
      hint: "Holidays, recipes, songs, papers that exist (no IDs), who else we should interview.",
    },
    wa: "Pregunta — tradiciones y más: ",
  },
];

const STEP_ORDER = [
  { type: "welcome" },
  { type: "identity" },
  ...QUESTION_STEPS.map(q => ({ type: "question", q })),
  { type: "photo" },
  { type: "relatives" },
  { type: "review" },
];

const COPY = {
  es: {
    banner: "PRIVATE FAMILY SITE — solo enlace · no indexado",
    inApp:
      "Parece que abriste esto dentro de WhatsApp u otra app. Para grabar voz aquí, abre este enlace en Safari o Chrome (ícono ⋮ → Abrir en navegador).",
    progress: n => `${n} de 7`,
    back: "Atrás",
    next: "Siguiente",
    skip: "Saltar",
    submit: "Enviar",
    speak: "Hablar",
    stop: "Detener",
    speakAgain: "Grabar de nuevo",
    waVoice: "Enviar nota de voz por WhatsApp",
    waFallback: "O envíala por WhatsApp a quien te compartió este enlace.",
    recording: "Grabando…",
    savedClip: "Audio listo para enviar",
    tooBig: "Este audio es muy largo. Graba de nuevo, más breve (máx. ~8 MB).",
    micDenied: "No pudimos usar el micrófono aquí.",
    welcomeTitle: "Comparte tu historia",
    welcomeLead:
      "Paso a paso, en tu idioma. Todo se revisa antes de entrar al Libro de los Crooke. Solo tu nombre es obligatorio.",
    privacyTitle: "Privacidad — no incluyas",
    privacyBody:
      "Nunca escribas ni grabes: Seguro Social; pasaporte o documentos de migración; datos bancarios; fechas de nacimiento completas de personas vivas; direcciones actuales.",
    nameLabel: "Tu nombre",
    nameRequired: "Escribe tu nombre para continuar.",
    relationLabel: "Parentesco (opcional)",
    phoneLabel: "Teléfono (opcional)",
    emailLabel: "Correo (opcional)",
    typeAnswer: "O escribe aquí (opcional)",
    photoTitle: "Foto de una imagen antigua",
    photoHint: "Una foto de retrato o familia — no documentos ni cédulas. Máx. 8 MB.",
    photoPick: "Tomar o elegir foto",
    relativesTitle: "Sugerir familiares",
    relativesHint: "Hasta 3 personas — nombre, parentesco, una frase.",
    relName: "Nombre",
    relRelation: "Parentesco",
    relNote: "Una frase",
    reviewTitle: "¿Listo para enviar?",
    reviewLead: "Revisa y envía. Puedes volver atrás si falta algo.",
    sending: "Enviando…",
    english: "English",
    spanish: "Español",
  },
  en: {
    banner: "PRIVATE FAMILY SITE — share link only · not indexed",
    inApp: "Looks like you opened this inside WhatsApp or another app. To record voice here, open this link in Safari or Chrome (⋮ → Open in browser).",
    progress: n => `${n} of 7`,
    back: "Back",
    next: "Next",
    skip: "Skip",
    submit: "Submit",
    speak: "Speak",
    stop: "Stop",
    speakAgain: "Record again",
    waVoice: "Send a WhatsApp voice note",
    waFallback: "Or send it by WhatsApp to the person who shared this link.",
    recording: "Recording…",
    savedClip: "Audio ready to send",
    tooBig: "This recording is too large. Please record again, shorter (max ~8 MB).",
    micDenied: "We could not use the microphone here.",
    welcomeTitle: "Share your story",
    welcomeLead:
      "One step at a time, in your language. Everything is reviewed before it goes in the Book of the Crookes. Only your name is required.",
    privacyTitle: "Privacy — do not include",
    privacyBody:
      "Never type or record: Social Security numbers; passport or immigration IDs; bank or card details; full birthdates of living people; current street addresses.",
    nameLabel: "Your name",
    nameRequired: "Please enter your name to continue.",
    relationLabel: "Relationship (optional)",
    phoneLabel: "Phone (optional)",
    emailLabel: "Email (optional)",
    typeAnswer: "Or type here (optional)",
    photoTitle: "Photo of an old picture",
    photoHint: "One portrait or family photo — not documents or IDs. Max 8 MB.",
    photoPick: "Take or choose photo",
    relativesTitle: "Suggest relatives",
    relativesHint: "Up to 3 people — name, relationship, one sentence.",
    relName: "Name",
    relRelation: "Relationship",
    relNote: "One sentence",
    reviewTitle: "Ready to send?",
    reviewLead: "Review and submit. You can go back if something is missing.",
    sending: "Sending…",
    english: "English",
    spanish: "Español",
  },
};

export function isPreviewRequest(search) {
  const raw = String(search || "");
  const query = raw.startsWith("?") ? raw.slice(1) : raw;
  return new URLSearchParams(query).get("preview") === "1";
}

const previewMode = typeof location !== "undefined" && isPreviewRequest(location.search);

let lang = "es";
let stepIndex = 0;
let state = defaultState();
let mediaRecorder = null;
let recordChunks = [];
let recordTimer = null;
let discardRecording = false;

export function pickSupportedMimeType(isTypeSupported) {
  if (typeof isTypeSupported !== "function") return "";
  for (const type of VOICE_MIME_CANDIDATES) {
    try {
      if (isTypeSupported(type) === true) return type;
    } catch {
      /* try the next candidate */
    }
  }
  return "";
}

export function extensionForMime(mime) {
  const base = String(mime || "").split(";")[0].trim().toLowerCase();
  if (base === "audio/webm" || base.includes("webm")) return "webm";
  if (
    base === "audio/mp4" ||
    base === "audio/aac" ||
    base === "audio/m4a" ||
    base === "audio/x-m4a" ||
    base === "audio/mp4a-latm" ||
    base.includes("mp4") ||
    base.includes("aac") ||
    base.includes("m4a")
  ) {
    return "m4a";
  }
  if (base === "audio/ogg" || base === "audio/opus" || base === "application/ogg" || base.includes("ogg") || base.includes("opus")) {
    return "ogg";
  }
  return "";
}

export function recorderOptions(mimeType) {
  const options = { audioBitsPerSecond: 32000 };
  if (mimeType) options.mimeType = mimeType;
  return options;
}

export function fileNameForVoice(field, blob) {
  const raw = blob && typeof blob.name === "string" ? blob.name.trim() : "";
  if (raw) {
    const base = raw.split(/[/\\]/).pop();
    if (base) return base;
  }
  const ext = extensionForMime(blob?.type) || "webm";
  return `${field}.${ext}`;
}

export function voiceFileFromChunks(chunks, mime, field) {
  const type = typeof mime === "string" ? mime : "";
  const ext = extensionForMime(type) || "webm";
  const name = `${field}.${ext}`;
  if (typeof File === "function") {
    try {
      return type ? new File(chunks, name, { type }) : new File(chunks, name);
    } catch {
      /* Blob fallback below */
    }
  }
  return type ? new Blob(chunks, { type }) : new Blob(chunks);
}

export function buildInterviewFormData(current, maxBytes = MAX_UPLOAD_BYTES) {
  const fd = new FormData();
  fd.append("form-name", "crooke-interview");
  fd.append("bot-field", "");
  fd.append("your_name", current.your_name || "");
  fd.append("relationship", current.relationship || "");
  fd.append("phone", current.phone || "");
  fd.append("email", current.email || "");
  fd.append("para", current.para || "");
  for (const q of QUESTION_STEPS) {
    fd.append(q.field, current[q.field] || "");
    const blob = current.voices?.[q.voice];
    if (blob && blob.size > 0 && blob.size <= maxBytes) {
      fd.append(q.voice, blob, fileNameForVoice(q.voice, blob));
    }
  }
  const relatives = current.relatives || [];
  for (let i = 0; i < 3; i++) {
    const rel = relatives[i] || { name: "", relation: "", note: "" };
    const n = i + 1;
    fd.append(`relative_${n}_name`, rel.name || "");
    fd.append(`relative_${n}_relation`, rel.relation || "");
    fd.append(`relative_${n}_note`, rel.note || "");
  }
  if (current.photoBlob && current.photoBlob.size > 0 && current.photoBlob.size <= maxBytes) {
    fd.append("old_photo", current.photoBlob, current.photoName || "old_photo.jpg");
  }
  return fd;
}

function defaultState() {
  return {
    your_name: "",
    relationship: "",
    phone: "",
    email: "",
    para: "",
    about_you: "",
    parents: "",
    grandparents: "",
    places_origins: "",
    loved_ones: "",
    family_stories: "",
    more_stories: "",
    relatives: [{ name: "", relation: "", note: "" }, { name: "", relation: "", note: "" }, { name: "", relation: "", note: "" }],
    voices: {},
    photoBlob: null,
    photoName: "",
  };
}

function t(key) {
  const pack = COPY[lang];
  if (typeof pack[key] === "function") return pack[key];
  return pack[key] ?? COPY.en[key];
}

function isInAppBrowser() {
  const ua = navigator.userAgent || "";
  return /WhatsApp|FBAN|FBAV|Instagram|Line\//i.test(ua);
}

function recorderSupport() {
  return typeof MediaRecorder !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
}

function saveProgress() {
  if (previewMode) return;
  try {
    const { photoBlob, voices, ...rest } = state;
    const voiceMeta = {};
    for (const [k, blob] of Object.entries(voices)) {
      if (blob) voiceMeta[k] = { size: blob.size, type: blob.type };
    }
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ lang, stepIndex, state: rest, voiceMeta, savedAt: Date.now() }),
    );
  } catch {
    /* ignore */
  }
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.lang === "en" || data.lang === "es") lang = data.lang;
    if (typeof data.stepIndex === "number") stepIndex = data.stepIndex;
    if (data.state) state = { ...defaultState(), ...data.state, voices: state.voices || {}, photoBlob: state.photoBlob };
  } catch {
    /* ignore */
  }
}

function parsePara() {
  const p = new URLSearchParams(location.search).get("para");
  if (p) state.para = p.trim().slice(0, 120);
}

function questionProgressIndex() {
  const step = STEP_ORDER[stepIndex];
  if (step?.type !== "question") return null;
  const i = QUESTION_STEPS.findIndex(q => q.id === step.q.id);
  return i >= 0 ? i + 1 : null;
}

function waLinkForQuestion(q) {
  const title = lang === "es" ? q.es.title : q.en.title;
  const text = `${q.wa}${title}. (Historia familiar Crooke — grabación de voz)`;
  if (JESUS_WHATSAPP_E164 && /^\d{10,15}$/.test(JESUS_WHATSAPP_E164)) {
    return `https://wa.me/${JESUS_WHATSAPP_E164}?text=${encodeURIComponent(text)}`;
  }
  return null;
}

function applyPageName() {
  const name = PAGE_NAME[lang] || PAGE_NAME.es;
  document.title = name;
  const heading = document.getElementById("interview-heading");
  if (heading) heading.textContent = name;
}

async function startRecording(voiceKey) {
  if (!recorderSupport()) {
    state._recordBlock = "no-recorder";
    render();
    return;
  }
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recordChunks = [];
    discardRecording = false;
    const preferred = pickSupportedMimeType(type => MediaRecorder.isTypeSupported(type));
    let recorder;
    try {
      recorder = new MediaRecorder(stream, recorderOptions(preferred));
    } catch (err) {
      if (!preferred) throw err;
      recorder = new MediaRecorder(stream, recorderOptions(""));
    }
    mediaRecorder = recorder;
    mediaRecorder.ondataavailable = e => {
      if (e.data && e.data.size) recordChunks.push(e.data);
    };
    mediaRecorder.onstop = () => {
      stream.getTracks().forEach(tr => tr.stop());
      const skipped = discardRecording;
      discardRecording = false;
      state._recordingKey = null;
      if (skipped) return;
      const actual = mediaRecorder.mimeType || preferred || "";
      const file = voiceFileFromChunks(recordChunks, actual, voiceKey);
      if (file.size > MAX_UPLOAD_BYTES) {
        state.voices[voiceKey] = null;
        state._recordError = "tooBig";
        state._recordErrorKey = voiceKey;
      } else if (file.size > 0) {
        state.voices[voiceKey] = file;
        state._recordError = null;
        state._recordErrorKey = null;
      }
      saveProgress();
      render();
    };
    mediaRecorder.start(250);
    state._recordingKey = voiceKey;
    state._recordBlock = null;
    clearTimeout(recordTimer);
    recordTimer = setTimeout(() => {
      if (mediaRecorder?.state === "recording") stopRecording();
    }, MAX_RECORD_SECONDS * 1000);
    render();
  } catch (err) {
    if (stream) stream.getTracks().forEach(tr => tr.stop());
    const name = err && err.name;
    if (name === "NotSupportedError") state._recordBlock = "no-recorder";
    else if (name === "NotAllowedError" || name === "PermissionDeniedError" || name === "SecurityError") {
      state._recordBlock = "mic-denied";
    } else state._recordBlock = "mic-failed";
    render();
  }
}

function stopRecording() {
  clearTimeout(recordTimer);
  if (mediaRecorder && mediaRecorder.state === "recording") mediaRecorder.stop();
  else state._recordingKey = null;
}

function bilingualNote(kind) {
  const msg = RECORDER_MESSAGES[kind];
  if (!msg) return "";
  return `<p class="record-warn">${msg.es}</p><p class="record-warn">${msg.en}</p>`;
}

function renderVoiceUpload(voiceKey) {
  return `<label class="voice-upload"><span class="voice-upload-label">${VOICE_UPLOAD_LABEL}</span><input type="file" accept="audio/*" data-voice-upload="${voiceKey}" /></label>`;
}

function renderFallbacks(q) {
  const wa = waLinkForQuestion(q);
  if (wa) return `<a class="btn-wa" href="${wa}" target="_blank" rel="noopener">${t("waVoice")}</a>`;
  return `<p class="audio-fallback">${t("waFallback")}</p>`;
}

function renderSpeakBlock(q) {
  const voiceKey = q.voice;
  const hasClip = state.voices[voiceKey];
  const recording = state._recordingKey === voiceKey;
  const inApp = isInAppBrowser();
  const unsupported = !recorderSupport();
  const block = unsupported ? "no-recorder" : state._recordBlock;
  let html = "";
  if (!inApp && block !== "no-recorder") {
    html += `<button type="button" class="btn-speak${recording ? " is-recording" : ""}" data-speak="${voiceKey}">
      ${recording ? t("stop") : hasClip ? t("speakAgain") : t("speak")}
    </button>`;
    if (recording) html += `<p class="record-status">${t("recording")}</p>`;
  }
  if (hasClip && !recording) html += `<p class="record-status">${t("savedClip")} (${Math.round(hasClip.size / 1024)} KB)</p>`;
  if (block === "no-recorder" && !inApp) html += bilingualNote("noRecorder");
  else if (block === "mic-denied" && !inApp) html += bilingualNote("micDenied");
  else if (inApp || block === "mic-failed") html += `<p class="record-status">${t("micDenied")}</p>`;
  if (state._recordError === "tooBig" && state._recordErrorKey === voiceKey) {
    html += `<p class="record-warn">${t("tooBig")}</p>`;
  }
  html += renderVoiceUpload(voiceKey);
  if (inApp || block) html += renderFallbacks(q);
  return html;
}

function render() {
  document.documentElement.lang = lang === "es" ? "es" : "en";
  applyPageName();
  const banner = document.getElementById("private-banner");
  if (banner) banner.textContent = t("banner");
  const previewBanner = document.getElementById("preview-banner");
  if (previewBanner) previewBanner.hidden = !previewMode;

  const inApp = document.getElementById("in-app-banner");
  if (inApp) {
    inApp.hidden = !isInAppBrowser();
    inApp.querySelectorAll("p").forEach((p, i) => {
      p.hidden = lang === "es" ? i === 1 : i === 0;
    });
  }

  const mount = document.getElementById("wizard-mount");
  if (!mount) return;

  const step = STEP_ORDER[stepIndex];
  const prog = questionProgressIndex();
  const progEl = prog ? `<div class="wizard-progress">${lang === "es" ? prog + " de 7" : `${prog} of 7`}</div>` : `<div class="wizard-progress"></div>`;

  let body = "";
  if (step.type === "welcome") {
    body = `
      <h2>${t("welcomeTitle")}</h2>
      <p class="wizard-lead">${t("welcomeLead")}</p>
      <div class="privacy-wizard"><strong>${t("privacyTitle")}</strong><p>${t("privacyBody")}</p></div>
    `;
  } else if (step.type === "identity") {
    body = `
      <h2>${t("nameLabel")}</h2>
      <input class="wizard-input" id="f_name" value="${esc(state.your_name)}" required aria-required="true" />
      <label class="wizard-lead">${t("relationLabel")}</label>
      <input class="wizard-input" id="f_rel" value="${esc(state.relationship)}" />
      <label class="wizard-lead">${t("phoneLabel")}</label>
      <input class="wizard-input" id="f_phone" type="tel" value="${esc(state.phone)}" />
      <label class="wizard-lead">${t("emailLabel")}</label>
      <input class="wizard-input" id="f_email" type="email" value="${esc(state.email)}" />
    `;
  } else if (step.type === "question") {
    const q = step.q;
    const pack = lang === "es" ? q.es : q.en;
    body = `
      ${progEl}
      <h2>${pack.title}</h2>
      <p class="wizard-lead">${pack.hint}</p>
      ${renderSpeakBlock(q)}
      <label class="wizard-lead">${t("typeAnswer")}</label>
      <textarea class="wizard-textarea" id="f_field" data-field="${q.field}">${esc(state[q.field] || "")}</textarea>
    `;
  } else if (step.type === "photo") {
    body = `
      <h2>${t("photoTitle")}</h2>
      <p class="wizard-lead">${t("photoHint")}</p>
      <input type="file" id="f_photo" accept="image/*" capture="environment" />
      ${state.photoBlob ? `<img class="photo-preview" id="photo-preview" alt="" />` : ""}
    `;
  } else if (step.type === "relatives") {
    body = `<h2>${t("relativesTitle")}</h2><p class="wizard-lead">${t("relativesHint")}</p>`;
    state.relatives.forEach((rel, i) => {
      body += `
        <div class="relative-card">
          <h3>${i + 1}</h3>
          <input class="wizard-input" data-rel="${i}" data-part="name" placeholder="${t("relName")}" value="${esc(rel.name)}" />
          <input class="wizard-input" data-rel="${i}" data-part="relation" placeholder="${t("relRelation")}" value="${esc(rel.relation)}" />
          <input class="wizard-input" data-rel="${i}" data-part="note" placeholder="${t("relNote")}" value="${esc(rel.note)}" />
        </div>`;
    });
  } else if (step.type === "review") {
    body = `<h2>${t("reviewTitle")}</h2><p class="wizard-lead">${t("reviewLead")}</p><p><strong>${esc(state.your_name)}</strong></p>`;
  }

  mount.innerHTML = `
    <div class="wizard-top">
      ${step.type === "question" ? "" : progEl}
      <button type="button" class="btn-lang-big" id="btn-english">${lang === "es" ? t("english") : t("spanish")}</button>
    </div>
    <div class="wizard-card">${body}</div>
    <div class="wizard-nav">
      ${stepIndex > 0 ? `<button type="button" class="btn-back" data-nav="back">${t("back")}</button>` : ""}
      ${step.type !== "identity" && step.type !== "review" ? `<button type="button" class="btn-skip" data-nav="skip">${t("skip")}</button>` : ""}
      ${step.type === "review"
        ? `<button type="button" class="btn-next" data-nav="submit"${previewMode ? " disabled" : ""}>${t("submit")}</button>`
        : `<button type="button" class="btn-next" data-nav="next">${t("next")}</button>`}
    </div>
  `;

  bindStepEvents(step);
  if (state.photoBlob) {
    const img = document.getElementById("photo-preview");
    if (img && !img.src) {
      img.src = URL.createObjectURL(state.photoBlob);
    }
  }
}

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}

function collectFields() {
  const n = document.getElementById("f_name");
  if (n) state.your_name = n.value.trim();
  const r = document.getElementById("f_rel");
  if (r) state.relationship = r.value.trim();
  const p = document.getElementById("f_phone");
  if (p) state.phone = p.value.trim();
  const e = document.getElementById("f_email");
  if (e) state.email = e.value.trim();
  const ta = document.getElementById("f_field");
  if (ta) state[ta.dataset.field] = ta.value.trim();
  document.querySelectorAll("[data-rel]").forEach(inp => {
    const i = +inp.dataset.rel;
    const part = inp.dataset.part;
    if (state.relatives[i]) state.relatives[i][part] = inp.value.trim();
  });
}

function bindStepEvents(step) {
  document.getElementById("btn-english")?.addEventListener("click", () => {
    lang = lang === "es" ? "en" : "es";
    saveProgress();
    render();
  });

  document.querySelector("[data-speak]")?.addEventListener("click", () => {
    const key = document.querySelector("[data-speak]").dataset.speak;
    if (state._recordingKey === key) stopRecording();
    else startRecording(key);
  });

  document.querySelector("[data-voice-upload]")?.addEventListener("change", ev => {
    const input = ev.target;
    const key = input.dataset.voiceUpload;
    const file = input.files?.[0];
    if (!file || !key) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      state._recordError = "tooBig";
      state._recordErrorKey = key;
      input.value = "";
      saveProgress();
      render();
      return;
    }
    if (state._recordingKey === key) {
      discardRecording = true;
      stopRecording();
    }
    state.voices[key] = file;
    state._recordError = null;
    state._recordErrorKey = null;
    saveProgress();
    render();
  });

  document.getElementById("f_photo")?.addEventListener("change", async ev => {
    const file = ev.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      alert(t("tooBig"));
      ev.target.value = "";
      return;
    }
    state.photoBlob = file;
    state.photoName = file.name;
    saveProgress();
    render();
  });

  document.querySelectorAll("[data-nav]").forEach(btn => {
    btn.addEventListener("click", () => {
      collectFields();
      const action = btn.dataset.nav;
      if (action === "back") {
        stepIndex = Math.max(0, stepIndex - 1);
        saveProgress();
        render();
        return;
      }
      if (action === "skip") {
        stepIndex = Math.min(STEP_ORDER.length - 1, stepIndex + 1);
        saveProgress();
        render();
        return;
      }
      if (action === "next") {
        if (!previewMode && step.type === "identity" && !state.your_name.trim()) {
          alert(t("nameRequired"));
          return;
        }
        stepIndex = Math.min(STEP_ORDER.length - 1, stepIndex + 1);
        saveProgress();
        render();
        return;
      }
      if (action === "submit") submitForm();
    });
  });
}

async function submitForm() {
  if (previewMode) return;
  collectFields();
  if (!state.your_name.trim()) {
    alert(t("nameRequired"));
    stepIndex = STEP_ORDER.findIndex(s => s.type === "identity");
    render();
    return;
  }

  const btn = document.querySelector('[data-nav="submit"]');
  if (btn) {
    btn.disabled = true;
    btn.textContent = t("sending");
  }

  const fd = buildInterviewFormData(state);

  try {
    await fetch("/", { method: "POST", body: fd });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    const thanks = new URL("/crooke-7c3a9e12/interview/thank-you.html", location.origin);
    if (state.para) thanks.searchParams.set("para", state.para);
    location.href = thanks.pathname + thanks.search;
  } catch {
    alert(lang === "es" ? "No se pudo enviar. Intenta de nuevo." : "Could not send. Please try again.");
    if (btn) {
      btn.disabled = false;
      btn.textContent = t("submit");
    }
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    parsePara();
    if (!previewMode) loadProgress();
    if (lang !== "en" && lang !== "es") lang = "es";
    render();
  });
}
