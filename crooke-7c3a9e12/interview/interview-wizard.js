import {
  JESUS_WHATSAPP_E164,
  JESUS_EMAIL_FALLBACK,
  STORAGE_KEY,
  MAX_UPLOAD_BYTES,
  MAX_RECORD_SECONDS,
  SITE_INTERVIEW_PATH,
} from "./interview-config.js";

const QUESTION_STEPS = [
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
    es: { title: "Lugares y orígenes", hint: "Líneas Morel y Crooke; migración; Nueva York y comunidad." },
    en: { title: "Places and origins", hint: "Morel and Crooke lines; migration; New York and community." },
    wa: "Pregunta — orígenes: ",
  },
  {
    id: "charles_memorial",
    field: "charles_memorial",
    voice: "voice_charles_memorial",
    es: { title: "Charles Crooke — memorial", hint: "Cómo lo describes; historias; lo que enseñó." },
    en: { title: "Charles Crooke — memorial", hint: "How you describe him; stories; what he taught." },
    wa: "Pregunta — Charles: ",
  },
  {
    id: "mami_charles_story",
    field: "mami_charles_story",
    voice: "voice_mami_charles_story",
    es: { title: "Mami y Charles", hint: "Su historia juntos; vida familiar con los hermanos." },
    en: { title: "Mami and Charles", hint: "Their story; family life with the siblings." },
    wa: "Pregunta — Mami y Charles: ",
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
    submit: "Enviar a Jesús",
    speak: "Hablar",
    stop: "Detener",
    speakAgain: "Grabar de nuevo",
    waVoice: "Enviar nota de voz por WhatsApp",
    emailVoice: "O envía un audio por correo a",
    recording: "Grabando…",
    savedClip: "Audio listo para enviar",
    tooBig: "Este audio es muy largo. Graba de nuevo, más breve (máx. ~8 MB).",
    micDenied: "No pudimos usar el micrófono aquí.",
    welcomeTitle: "Comparte tu historia",
    welcomeLead:
      "Paso a paso, en tu idioma. Jesús revisa todo antes de que algo entre al Libro de los Crooke. Solo tu nombre es obligatorio.",
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
    submit: "Send to Jesus",
    speak: "Speak",
    stop: "Stop",
    speakAgain: "Record again",
    waVoice: "Send a WhatsApp voice note",
    emailVoice: "Or email an audio to",
    recording: "Recording…",
    savedClip: "Audio ready to send",
    tooBig: "This recording is too large. Please record again, shorter (max ~8 MB).",
    micDenied: "We could not use the microphone here.",
    welcomeTitle: "Share your story",
    welcomeLead:
      "One step at a time, in your language. Jesus reviews everything before it goes in the Book of the Crookes. Only your name is required.",
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

let lang = "es";
let stepIndex = 0;
let state = defaultState();
let mediaRecorder = null;
let recordChunks = [];
let recordTimer = null;
let micAvailable = true;

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
    charles_memorial: "",
    mami_charles_story: "",
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

function saveProgress() {
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

function mailtoVoiceFallback(q) {
  const title = lang === "es" ? q.es.title : q.en.title;
  const subject = encodeURIComponent("Crooke family voice note");
  const body = encodeURIComponent(`${q.wa}${title}\n\n[Attach your voice recording]`);
  return `mailto:${JESUS_EMAIL_FALLBACK}?subject=${subject}&body=${body}`;
}

async function startRecording(voiceKey) {
  if (!navigator.mediaDevices?.getUserMedia) {
    micAvailable = false;
    render();
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recordChunks = [];
    const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : "audio/webm";
    mediaRecorder = new MediaRecorder(stream, { mimeType: mime, audioBitsPerSecond: 32000 });
    mediaRecorder.ondataavailable = e => {
      if (e.data.size) recordChunks.push(e.data);
    };
    mediaRecorder.onstop = () => {
      stream.getTracks().forEach(tr => tr.stop());
      const blob = new Blob(recordChunks, { type: mime });
      if (blob.size > MAX_UPLOAD_BYTES) {
        state.voices[voiceKey] = null;
        state._recordError = "tooBig";
      } else {
        state.voices[voiceKey] = blob;
        state._recordError = null;
      }
      saveProgress();
      render();
    };
    mediaRecorder.start(250);
    state._recordingKey = voiceKey;
    clearTimeout(recordTimer);
    recordTimer = setTimeout(() => {
      if (mediaRecorder?.state === "recording") stopRecording();
    }, MAX_RECORD_SECONDS * 1000);
    render();
  } catch {
    micAvailable = false;
    render();
  }
}

function stopRecording() {
  clearTimeout(recordTimer);
  if (mediaRecorder && mediaRecorder.state === "recording") mediaRecorder.stop();
  state._recordingKey = null;
}

function renderSpeakBlock(q) {
  const voiceKey = q.voice;
  const hasClip = state.voices[voiceKey];
  const recording = state._recordingKey === voiceKey;
  const showWa = !micAvailable || isInAppBrowser();
  let html = "";
  if (!showWa) {
    html += `<button type="button" class="btn-speak${recording ? " is-recording" : ""}" data-speak="${voiceKey}">
      ${recording ? t("stop") : hasClip ? t("speakAgain") : t("speak")}
    </button>`;
    if (recording) html += `<p class="record-status">${t("recording")}</p>`;
    if (hasClip && !recording) html += `<p class="record-status">${t("savedClip")} (${Math.round(hasClip.size / 1024)} KB)</p>`;
    if (state._recordError === "tooBig") html += `<p class="record-warn">${t("tooBig")}</p>`;
  } else {
    html += `<p class="record-status">${t("micDenied")}</p>`;
    const wa = waLinkForQuestion(q);
    if (wa) {
      html += `<a class="btn-wa" href="${wa}" target="_blank" rel="noopener">${t("waVoice")}</a>`;
    } else {
      html += `<p class="audio-fallback">${t("emailVoice")} <a href="${mailtoVoiceFallback(q)}">${JESUS_EMAIL_FALLBACK}</a></p>`;
    }
  }
  return html;
}

function render() {
  document.documentElement.lang = lang === "es" ? "es" : "en";
  const banner = document.getElementById("private-banner");
  if (banner) banner.textContent = t("banner");

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
        ? `<button type="button" class="btn-next" data-nav="submit">${t("submit")}</button>`
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

  document.querySelector('[data-speak]')?.addEventListener("click", () => {
    const key = document.querySelector("[data-speak]").dataset.speak;
    if (state._recordingKey === key) stopRecording();
    else startRecording(key);
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
        if (step.type === "identity" && !state.your_name.trim()) {
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

  const fd = new FormData();
  fd.append("form-name", "crooke-interview");
  fd.append("bot-field", "");
  fd.append("your_name", state.your_name);
  fd.append("relationship", state.relationship);
  fd.append("phone", state.phone);
  fd.append("email", state.email);
  fd.append("para", state.para || "");
  for (const q of QUESTION_STEPS) {
    fd.append(q.field, state[q.field] || "");
    const blob = state.voices[q.voice];
    if (blob && blob.size <= MAX_UPLOAD_BYTES) {
      fd.append(q.voice, blob, `${q.voice}.webm`);
    }
  }
  state.relatives.forEach((rel, i) => {
    const n = i + 1;
    fd.append(`relative_${n}_name`, rel.name);
    fd.append(`relative_${n}_relation`, rel.relation);
    fd.append(`relative_${n}_note`, rel.note);
  });
  if (state.photoBlob && state.photoBlob.size <= MAX_UPLOAD_BYTES) {
    fd.append("old_photo", state.photoBlob, state.photoName || "old_photo.jpg");
  }

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

document.addEventListener("DOMContentLoaded", () => {
  parsePara();
  loadProgress();
  if (lang !== "en" && lang !== "es") lang = "es";
  render();
});
