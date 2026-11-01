import {
  WHATSAPP_NUMBER,
  STORAGE_KEY,
  MEDIA_DB_NAME,
  MAX_UPLOAD_BYTES,
  FORM_HEADROOM_BYTES,
  SIZE_WARN_BYTES,
  AUDIO_BITS_PER_SECOND,
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
  es: "Entrevista Familia Morel",
  en: "Morel Family Interview",
};

const VOICE_UPLOAD_LABEL = "Subir nota de voz / Upload a voice memo";

export const WHATSAPP_PREFILL = "Hola, aquí están mis notas de voz para la Entrevista Familia Morel";

export const MIC_UPLOAD_HINT =
  "Si el micrófono no funciona, puedes subir un archivo de audio aquí / If the mic doesn't work, you can upload an audio file here";

const RECORDER_MESSAGES = {
  noRecorder: {
    es: "Este navegador no puede grabar voz. Puedes subir un archivo de audio aquí.",
    en: "This browser cannot record voice. You can upload an audio file here.",
  },
  micDenied: {
    es: "Permiso de micrófono denegado. Puedes subir un archivo de audio aquí.",
    en: "Microphone permission was denied. You can upload an audio file here.",
  },
  micFailed: {
    es: "No se pudo grabar. Revisa el micrófono e inténtalo de nuevo.",
    en: "Could not record. Check the microphone and try again.",
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
    es: { title: "Lugares y orígenes", hint: "Líneas de la familia, migración y de dónde viene la familia." },
    en: { title: "Places and origins", hint: "Family lines, migration, and where the family comes from." },
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
    recording: "Grabando…",
    savedClip: "Audio listo para enviar",
    tooBig: "Este audio es muy largo. Graba de nuevo, más breve (máx. ~8 MB).",
    micDenied: "No pudimos usar el micrófono aquí.",
    welcomeTitle: "Comparte tu historia",
    welcomeLead:
      "Paso a paso, en tu idioma. Todo se revisa antes de entrar al libro de la familia. Solo tu nombre es obligatorio.",
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
    recording: "Recording…",
    savedClip: "Audio ready to send",
    tooBig: "This recording is too large. Please record again, shorter (max ~8 MB).",
    micDenied: "We could not use the microphone here.",
    welcomeTitle: "Share your story",
    welcomeLead:
      "One step at a time, in your language. Everything is reviewed before it goes in the family book. Only your name is required.",
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

export const TEST_MODE_BANNER = "Modo de prueba: nada se envía / Test mode: nothing is sent";

export function isPreviewRequest(search) {
  const raw = String(search || "");
  const query = raw.startsWith("?") ? raw.slice(1) : raw;
  return new URLSearchParams(query).get("preview") === "1";
}

export function isTestRequest(search) {
  const raw = String(search || "");
  const query = raw.startsWith("?") ? raw.slice(1) : raw;
  return new URLSearchParams(query).get("test") === "1";
}

const previewMode = typeof location !== "undefined" && isPreviewRequest(location.search);
const testMode = typeof location !== "undefined" && isTestRequest(location.search);

let lang = "es";
let stepIndex = 0;
let state = defaultState();
/** The take that is recording right now. Null when the mic is idle. */
let activeTake = null;
const playbackUrls = new Map();
let recordClock = null;

export function formatClock(totalSeconds) {
  const s = Math.max(0, Math.round(Number(totalSeconds) || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export function savedVoiceLabel(seconds) {
  if (seconds == null || !Number.isFinite(Number(seconds))) {
    return "Grabación guardada / Recording saved";
  }
  const clock = formatClock(seconds);
  return `Grabación guardada (${clock}) / Recording saved (${clock})`;
}

function playbackUrl(key, blob) {
  const prev = playbackUrls.get(key);
  if (prev && prev.blob === blob) return prev.url;
  if (prev) URL.revokeObjectURL(prev.url);
  const url = URL.createObjectURL(blob);
  playbackUrls.set(key, { blob, url });
  return url;
}

function dropPlayback(key) {
  const prev = playbackUrls.get(key);
  if (!prev) return;
  URL.revokeObjectURL(prev.url);
  playbackUrls.delete(key);
}

function ensureRecordClock() {
  if (recordClock) return;
  recordClock = setInterval(() => {
    if (!activeTake?.startedAt) return;
    const elapsed = (Date.now() - activeTake.startedAt) / 1000;
    const el = document.querySelector("[data-record-timer]");
    if (el) el.textContent = formatClock(elapsed);
    const room = recordingRoomCopy(state, activeTake.voiceKey, elapsed);
    const es = document.querySelector("[data-room-es]");
    const en = document.querySelector("[data-room-en]");
    if (es) es.textContent = room.es;
    if (en) en.textContent = room.en;
  }, 250);
}

function clearRecordClock() {
  if (!recordClock) return;
  clearInterval(recordClock);
  recordClock = null;
}

function stopStream(stream) {
  if (!stream || typeof stream.getTracks !== "function") return;
  for (const track of stream.getTracks()) {
    try {
      track.stop();
    } catch {
      /* already stopped */
    }
  }
}

/**
 * Stop the active take. discard=true drops its chunks so they cannot land in
 * the next question. Tracks stop in onstop, after the recorder has flushed
 * its last chunk (that chunk carries a webm/mp4 header only if it stays
 * with its own take).
 */
function finishActiveTake(discard) {
  const take = activeTake;
  if (!take) return Promise.resolve();
  take.discarded = !!discard;
  if (take.timer) {
    clearTimeout(take.timer);
    take.timer = null;
  }
  const rec = take.recorder;
  if (!rec || rec.state === "inactive") {
    take.closed = true;
    stopStream(take.stream);
    if (activeTake === take) activeTake = null;
    if (state._recordingKey === take.voiceKey) state._recordingKey = null;
    take.resolveDone?.();
    return Promise.resolve();
  }
  try {
    rec.stop();
  } catch {
    take.closed = true;
    stopStream(take.stream);
    if (activeTake === take) activeTake = null;
    if (state._recordingKey === take.voiceKey) state._recordingKey = null;
    take.resolveDone?.();
    return Promise.resolve();
  }
  return Promise.race([
    take.done,
    new Promise(resolve => {
      setTimeout(() => {
        take.closed = true;
        stopStream(take.stream);
        if (activeTake === take) activeTake = null;
        if (state._recordingKey === take.voiceKey) state._recordingKey = null;
        resolve();
      }, 2000);
    }),
  ]);
}

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
  const parts = Array.isArray(chunks) ? chunks : [];
  const type = typeof mime === "string" ? mime : "";
  const ext = extensionForMime(type) || "webm";
  const name = `${field}.${ext}`;
  if (typeof File === "function") {
    try {
      return type ? new File(parts, name, { type }) : new File(parts, name);
    } catch {
      /* Blob fallback below */
    }
  }
  return type ? new Blob(parts, { type }) : new Blob(parts);
}

/** Save one take onto a question. A later take replaces that field; it does not append. */
export function commitVoiceTake(current, voiceKey, chunks, mime, maxBytes = MAX_UPLOAD_BYTES) {
  const voices = current.voices || (current.voices = {});
  const file = voiceFileFromChunks(chunks, mime, voiceKey);
  if (file.size > maxBytes) {
    voices[voiceKey] = null;
    return { error: "tooBig", file };
  }
  if (file.size > 0) voices[voiceKey] = file;
  return { error: null, file };
}

export function textByteLength(value) {
  const text = String(value ?? "");
  if (typeof TextEncoder !== "undefined") return new TextEncoder().encode(text).length;
  return text.length;
}

function identityFieldBytes(current) {
  let n = 0;
  for (const key of ["your_name", "relationship", "phone", "email", "para"]) {
    n += textByteLength(current?.[key]);
  }
  return n;
}

export function interviewTextBytes(current) {
  let n = identityFieldBytes(current);
  for (const q of QUESTION_STEPS) n += textByteLength(current?.[q.field]);
  const relatives = current?.relatives || [];
  for (let i = 0; i < 3; i++) {
    const rel = relatives[i] || {};
    n += textByteLength(rel.name) + textByteLength(rel.relation) + textByteLength(rel.note);
  }
  return n;
}

export function interviewFileEntries(current) {
  const files = [];
  for (const q of QUESTION_STEPS) {
    const blob = current?.voices?.[q.voice];
    if (blob && blob.size > 0) files.push({ field: q.voice, size: blob.size, kind: "voice" });
  }
  if (current?.photoBlob && current.photoBlob.size > 0) {
    files.push({ field: "old_photo", size: current.photoBlob.size, kind: "photo" });
  }
  return files;
}

export function interviewTotalBytes(current) {
  return interviewTextBytes(current) + interviewFileEntries(current).reduce((sum, file) => sum + file.size, 0);
}

export function partBudget(maxBytes = MAX_UPLOAD_BYTES) {
  const headroom = maxBytes >= 1024 * 1024 ? FORM_HEADROOM_BYTES : Math.min(FORM_HEADROOM_BYTES, Math.floor(maxBytes * 0.05));
  return Math.max(1, maxBytes - headroom);
}

/**
 * Split voice notes, the photo, and text into crooke-interview posts that each
 * stay under Netlify's submission cap. One part when everything fits.
 */
export function planInterviewParts(current, maxBytes = MAX_UPLOAD_BYTES) {
  const budget = partBudget(maxBytes);
  const files = interviewFileEntries(current);
  const blocked = [];
  const packable = [];
  for (const file of files) {
    if (file.size > budget) blocked.push(file);
    else packable.push(file);
  }
  const textBytes = interviewTextBytes(current);
  const nameBytes = identityFieldBytes(current);
  const totalBytes = interviewTotalBytes(current);
  if (textBytes > budget) {
    return { parts: [], blocked, totalBytes, textTooBig: true };
  }
  const packedBytes = textBytes + packable.reduce((sum, file) => sum + file.size, 0);
  if (!blocked.length && packedBytes <= budget) {
    return {
      parts: [{ files: packable.map(file => file.field), includeAnswers: true }],
      blocked,
      totalBytes,
      textTooBig: false,
    };
  }
  const parts = [];
  let bin = [];
  let used = 0;
  let answersPlaced = false;
  const flush = () => {
    if (!bin.length && answersPlaced) return;
    parts.push({ files: bin.map(file => file.field), includeAnswers: !answersPlaced });
    answersPlaced = true;
    bin = [];
    used = 0;
  };
  for (const file of packable) {
    const base = answersPlaced ? nameBytes : textBytes;
    if (bin.length && used + file.size > budget) flush();
    if (!bin.length && base + file.size > budget) {
      if (!answersPlaced) {
        parts.push({ files: [], includeAnswers: true });
        answersPlaced = true;
      }
      if (file.size + nameBytes <= budget) {
        parts.push({ files: [file.field], includeAnswers: false });
        continue;
      }
      blocked.push(file);
      continue;
    }
    if (!bin.length) used = answersPlaced ? nameBytes : textBytes;
    bin.push(file);
    used += file.size;
  }
  if (bin.length || !answersPlaced) flush();
  return { parts, blocked, totalBytes, textTooBig: false };
}

export function formatPlainMegabytes(bytes) {
  const mb = Math.max(0, Number(bytes) || 0) / (1024 * 1024);
  if (mb < 0.1) return { es: "queda menos de 0,1 MB", en: "Less than 0.1 MB left in total" };
  const rounded = mb >= 10 ? Math.round(mb) : Math.round(mb * 10) / 10;
  const esNum = String(rounded).replace(".", ",");
  return { es: `quedan unos ${esNum} MB`, en: `About ${rounded} MB left in total` };
}

export function recordingRoomCopy(current, voiceKey, elapsedSeconds = 0) {
  const perSecond = AUDIO_BITS_PER_SECOND / 8;
  const cap = Math.min(MAX_RECORD_SECONDS, Math.floor(partBudget() / perSecond));
  const elapsed = Math.max(0, Math.round(Number(elapsedSeconds) || 0));
  const noteLeft = Math.max(0, cap - (voiceKey ? elapsed : 0));
  const total = interviewTotalBytes(current);
  const totalLeft = Math.max(0, MAX_UPLOAD_BYTES - total);
  const over = total > partBudget();
  const close = !over && total >= SIZE_WARN_BYTES;
  const mb = formatPlainMegabytes(totalLeft);
  const esNote = noteLeft === 1 ? "queda cerca de 1 segundo" : `quedan unos ${noteLeft} segundos`;
  const enNote = noteLeft === 1 ? "About 1 second left" : `About ${noteLeft} seconds left`;
  const es = over
    ? `En esta nota ${esNote}. En total ya no cabe en un solo envío; se dividirá.`
    : `En esta nota ${esNote}. En total ${mb.es}.`;
  const en = over
    ? `${enNote} in this note. The total no longer fits in one send; it will be split.`
    : `${enNote} in this note. ${mb.en}.`;
  return { es, en, over, close, noteLeft, totalLeft, total };
}

export function whatsAppVoiceHref(number = WHATSAPP_NUMBER) {
  const digits = String(number ?? "").replace(/\D/g, "");
  if (!/^\d{10,15}$/.test(digits)) return "";
  return `https://wa.me/${digits}?text=${encodeURIComponent(WHATSAPP_PREFILL)}`;
}

export function hasUnsentDraft(data) {
  if (!data || typeof data !== "object") return false;
  const saved = data.state || {};
  if (String(saved.your_name || "").trim()) return true;
  if (String(saved.relationship || saved.phone || saved.email || "").trim()) return true;
  for (const q of QUESTION_STEPS) {
    if (String(saved[q.field] || "").trim()) return true;
  }
  if ((saved.relatives || []).some(rel => String(rel?.name || rel?.relation || rel?.note || "").trim())) return true;
  if (Object.values(data.voiceMeta || {}).some(meta => meta && meta.size > 0)) return true;
  if (data.photoMeta && data.photoMeta.size > 0) return true;
  return false;
}

export function resumePromptCopy(name) {
  const given = String(name || "").trim();
  const esName = given || "sin nombre";
  const enName = given || "someone";
  return `Tienes respuestas guardadas de ${esName}. ¿Continuar o empezar de nuevo? / You have saved answers from ${enName}. Continue or start fresh?`;
}

export function buildInterviewFormData(current, maxBytes = MAX_UPLOAD_BYTES, part = null) {
  const includeAnswers = !part || part.includeAnswers !== false;
  const allow = field => !part || !Array.isArray(part.files) || part.files.includes(field);
  const fd = new FormData();
  fd.append("form-name", "crooke-interview");
  fd.append("bot-field", "");
  fd.append("submission_id", part?.submissionId || "");
  fd.append("part_number", String(part?.partNumber || 1));
  fd.append("part_count", String(part?.partCount || 1));
  fd.append("your_name", current.your_name || "");
  fd.append("relationship", current.relationship || "");
  fd.append("phone", current.phone || "");
  fd.append("email", current.email || "");
  fd.append("para", current.para || "");
  for (const q of QUESTION_STEPS) {
    fd.append(q.field, includeAnswers ? current[q.field] || "" : "");
    const blob = current.voices?.[q.voice];
    if (allow(q.voice) && blob && blob.size > 0 && blob.size <= maxBytes) {
      fd.append(q.voice, blob, fileNameForVoice(q.voice, blob));
    }
  }
  const relatives = current.relatives || [];
  for (let i = 0; i < 3; i++) {
    const rel = relatives[i] || { name: "", relation: "", note: "" };
    const n = i + 1;
    const answer = includeAnswers ? rel : { name: "", relation: "", note: "" };
    fd.append(`relative_${n}_name`, answer.name || "");
    fd.append(`relative_${n}_relation`, answer.relation || "");
    fd.append(`relative_${n}_note`, answer.note || "");
  }
  if (allow("old_photo") && current.photoBlob && current.photoBlob.size > 0 && current.photoBlob.size <= maxBytes) {
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
    voiceSeconds: {},
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

let mediaGeneration = 0;
let mediaDbPromise = null;
let pendingDraft = null;

function readDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveProgress() {
  if (previewMode || testMode) return;
  const generation = ++mediaGeneration;
  try {
    const rest = {};
    for (const [key, value] of Object.entries(state)) {
      if (key === "photoBlob" || key === "voices" || key.startsWith("_")) continue;
      rest[key] = value;
    }
    const voiceMeta = {};
    for (const [key, blob] of Object.entries(state.voices || {})) {
      if (blob && blob.size > 0) voiceMeta[key] = { size: blob.size, type: blob.type || "" };
    }
    const photoMeta = state.photoBlob && state.photoBlob.size > 0
      ? { size: state.photoBlob.size, type: state.photoBlob.type || "", name: state.photoName || "" }
      : null;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ lang, stepIndex, state: rest, voiceMeta, photoMeta, savedAt: Date.now() }),
    );
  } catch {
    /* ignore quota or private mode */
  }
  persistMedia(generation).catch(() => {});
}

function applyDraft(data) {
  if (!data) return;
  if (data.lang === "en" || data.lang === "es") lang = data.lang;
  if (typeof data.stepIndex === "number" && Number.isFinite(data.stepIndex)) {
    stepIndex = Math.max(0, Math.min(STEP_ORDER.length - 1, data.stepIndex));
  }
  if (data.state && typeof data.state === "object") {
    const saved = {};
    for (const [key, value] of Object.entries(data.state)) {
      if (key === "photoBlob" || key === "voices" || key.startsWith("_")) continue;
      saved[key] = value;
    }
    state = { ...defaultState(), ...saved, voices: {}, photoBlob: null };
    if (!Array.isArray(state.relatives) || state.relatives.length !== 3) {
      state.relatives = defaultState().relatives;
    }
  }
}

function openMediaDb() {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);
  if (!mediaDbPromise) {
    mediaDbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(MEDIA_DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains("files")) db.createObjectStore("files");
      };
      req.onsuccess = () => {
        const db = req.result;
        db.onversionchange = () => {
          db.close();
          mediaDbPromise = null;
        };
        resolve(db);
      };
      req.onerror = () => {
        mediaDbPromise = null;
        reject(req.error);
      };
    });
  }
  return mediaDbPromise;
}

async function persistMedia(generation) {
  if (generation !== mediaGeneration) return;
  const db = await openMediaDb();
  if (!db || generation !== mediaGeneration) return;
  await new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readwrite");
    const store = tx.objectStore("files");
    for (const q of QUESTION_STEPS) {
      const blob = state.voices?.[q.voice];
      if (blob && blob.size > 0) store.put(blob, q.voice);
      else store.delete(q.voice);
    }
    if (state.photoBlob && state.photoBlob.size > 0) store.put(state.photoBlob, "old_photo");
    else store.delete("old_photo");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

async function loadMediaIntoState() {
  const db = await openMediaDb();
  if (!db) return;
  const keys = [...QUESTION_STEPS.map(q => q.voice), "old_photo"];
  const rows = await new Promise(resolve => {
    const tx = db.transaction("files", "readonly");
    const store = tx.objectStore("files");
    const out = {};
    let pending = keys.length;
    if (!pending) {
      resolve(out);
      return;
    }
    for (const key of keys) {
      const req = store.get(key);
      req.onsuccess = () => {
        out[key] = req.result || null;
        if (--pending === 0) resolve(out);
      };
      req.onerror = () => {
        out[key] = null;
        if (--pending === 0) resolve(out);
      };
    }
  });
  state.voices = state.voices || {};
  for (const q of QUESTION_STEPS) {
    const blob = rows[q.voice];
    if (blob && blob.size > 0) state.voices[q.voice] = blob;
  }
  if (rows.old_photo && rows.old_photo.size > 0) {
    state.photoBlob = rows.old_photo;
    if (!state.photoName) state.photoName = "old_photo.jpg";
  }
}

async function clearSavedInterview() {
  mediaGeneration += 1;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  if (typeof indexedDB === "undefined") return;
  const db = await mediaDbPromise;
  if (db) {
    try {
      db.close();
    } catch {
      /* ignore */
    }
  }
  mediaDbPromise = null;
  await new Promise(resolve => {
    const req = indexedDB.deleteDatabase(MEDIA_DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => resolve();
    req.onblocked = () => resolve();
  });
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

function showResume(name, draft) {
  pendingDraft = draft || null;
  const text = document.getElementById("resume-text");
  const dialog = document.getElementById("resume-prompt");
  if (text) text.textContent = resumePromptCopy(name);
  if (dialog) dialog.hidden = false;
}

function hideResume() {
  pendingDraft = null;
  const dialog = document.getElementById("resume-prompt");
  if (dialog) dialog.hidden = true;
}

function applyPageName() {
  const name = PAGE_NAME[lang] || PAGE_NAME.es;
  document.title = name;
  const heading = document.getElementById("interview-heading");
  if (heading) heading.textContent = name;
}

async function startRecording(voiceKey) {
  if (state._recordingStarting) return;
  state._recordingStarting = true;
  let stream = null;
  try {
    // Drop any recorder that is still running so its chunks cannot join this take.
    await finishActiveTake(true);
    if (!recorderSupport()) {
      state._recordBlock = "no-recorder";
      render();
      return;
    }
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const chunks = [];
    const preferred = pickSupportedMimeType(type => MediaRecorder.isTypeSupported(type));
    let recorder;
    try {
      recorder = new MediaRecorder(stream, recorderOptions(preferred));
    } catch (err) {
      if (!preferred) throw err;
      recorder = new MediaRecorder(stream, recorderOptions(""));
    }
    let resolveDone = () => {};
    const done = new Promise(resolve => {
      resolveDone = resolve;
    });
    const take = {
      voiceKey,
      stream,
      recorder,
      chunks,
      preferred,
      discarded: false,
      closed: false,
      startedAt: Date.now(),
      done,
      resolveDone,
      timer: null,
    };
    recorder.ondataavailable = event => {
      if (take.closed) return;
      if (event.data && event.data.size) chunks.push(event.data);
    };
    recorder.onstop = () => {
      take.closed = true;
      stopStream(stream);
      if (take.timer) clearTimeout(take.timer);
      if (activeTake === take) activeTake = null;
      if (state._recordingKey === take.voiceKey) state._recordingKey = null;
      try {
        if (!take.discarded) {
          const mime = recorder.mimeType || take.preferred || "";
          const result = commitVoiceTake(state, take.voiceKey, chunks.slice(), mime);
          if (result.error) {
            state._recordError = result.error;
            state._recordErrorKey = take.voiceKey;
          } else if (result.file && result.file.size > 0) {
            const elapsed = take.startedAt ? Math.max(1, Math.round((Date.now() - take.startedAt) / 1000)) : null;
            state.voiceSeconds = state.voiceSeconds || {};
            if (elapsed != null) state.voiceSeconds[take.voiceKey] = elapsed;
            state._recordError = null;
            state._recordErrorKey = null;
          }
          saveProgress();
          render();
        }
      } finally {
        take.resolveDone();
      }
    };
    activeTake = take;
    try {
      recorder.start(250);
    } catch {
      recorder.start();
    }
    take.timer = setTimeout(() => {
      if (recorder.state === "recording") {
        try {
          recorder.stop();
        } catch {
          /* onstop still owns the tracks */
        }
      }
    }, MAX_RECORD_SECONDS * 1000);
    state._recordingKey = voiceKey;
    state._recordBlock = null;
    render();
  } catch (err) {
    stopStream(stream);
    if (activeTake && activeTake.stream === stream) activeTake = null;
    const name = err && err.name;
    if (name === "NotSupportedError") state._recordBlock = "no-recorder";
    else if (name === "NotAllowedError" || name === "PermissionDeniedError" || name === "SecurityError") {
      state._recordBlock = "mic-denied";
    } else state._recordBlock = "mic-failed";
    render();
  } finally {
    state._recordingStarting = false;
  }
}

function stopRecording() {
  return finishActiveTake(false);
}

function bilingualNote(kind) {
  const msg = RECORDER_MESSAGES[kind];
  if (!msg) return "";
  return `<div class="record-alert" role="alert"><p>${msg.es}</p><p>${msg.en}</p></div>`;
}

function renderVoiceChecklist(currentId) {
  const saved = QUESTION_STEPS.filter(q => state.voices?.[q.voice] && state.voices[q.voice].size > 0).length;
  const items = QUESTION_STEPS.map(q => {
    const clip = state.voices?.[q.voice];
    const has = !!(clip && clip.size > 0);
    const title = esc(lang === "es" ? q.es.title : q.en.title);
    const seconds = Number.isFinite(state.voiceSeconds?.[q.voice]) ? state.voiceSeconds[q.voice] : null;
    const status = has ? savedVoiceLabel(seconds) : "Sin nota / No voice note";
    const current = q.id === currentId ? " is-current" : "";
    return `<li class="${has ? "is-saved" : "is-empty"}${current}">
      <span class="${has ? "record-check" : "voice-empty"}" aria-hidden="true">${has ? "✓" : ""}</span>
      <span class="voice-check-title">${title}</span>
      <span class="voice-check-state">${status}</span>
    </li>`;
  }).join("");
  return `<div class="voice-checklist-wrap">
    <p class="voice-checklist-heading">Notas de voz / Voice notes</p>
    <p class="voice-checklist-count">${saved} de 7 con nota de voz / ${saved} of 7 with a voice note</p>
    <ul class="voice-checklist">${items}</ul>
  </div>`;
}

function renderVoiceUpload(voiceKey) {
  const href = whatsAppVoiceHref();
  const alternate = href
    ? `<a class="btn-wa" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${t("waVoice")}</a>`
    : `<p class="audio-fallback">${MIC_UPLOAD_HINT}</p>`;
  return `<div class="voice-upload-block">${alternate}<label class="voice-upload" for="voice-file-${voiceKey}"><span class="voice-upload-label">${VOICE_UPLOAD_LABEL}</span></label><input id="voice-file-${voiceKey}" type="file" accept="audio/*" data-voice-upload="${voiceKey}" /></div>`;
}

function renderRoomCopy(voiceKey) {
  const elapsed = state._recordingKey === voiceKey && activeTake?.startedAt ? (Date.now() - activeTake.startedAt) / 1000 : 0;
  const room = recordingRoomCopy(state, voiceKey, elapsed);
  return `<p class="record-room" data-room-es>${esc(room.es)}</p><p class="record-room" data-room-en>${esc(room.en)}</p>`;
}

function renderSizeNotice() {
  if (state._forceSizeWarn) {
    return `<p class="size-warn" role="status">Te estás acercando al límite de 8 MB. / You are getting close to the 8 MB limit.</p><p class="size-warn">El total pasa de 8 MB, así que se enviará en 2 partes. / The total is over 8 MB, so it will be sent in 2 parts.</p>`;
  }
  const plan = planInterviewParts(state);
  if (plan.textTooBig || plan.blocked.length) {
    return `<div class="send-error" role="alert"><p>Hay un archivo que no cabe en un envío (límite de unos 8 MB). Quítalo para poder enviar.</p><p>A file does not fit in one submission (about an 8 MB limit). Remove it before sending.</p></div>`;
  }
  if (plan.parts.length > 1) {
    const n = plan.parts.length;
    return `<p class="size-warn" role="status">El total pasa de 8 MB, así que se enviará en ${n} partes. / The total is over 8 MB, so it will be sent in ${n} parts.</p>`;
  }
  if (plan.totalBytes >= SIZE_WARN_BYTES) {
    return `<p class="size-warn" role="status">Te estás acercando al límite de 8 MB. / You are getting close to the 8 MB limit.</p>`;
  }
  return "";
}

function sendErrorCopy(error) {
  if (error?.blocked) {
    return {
      es: "Hay un archivo que no cabe en un envío (límite de unos 8 MB). Quítalo y vuelve a intentar. Tus respuestas siguen aquí.",
      en: "A file does not fit in one submission (about an 8 MB limit). Remove it and try again. Your answers are still here.",
    };
  }
  if (error?.sent > 0) {
    return {
      es: `Se envió la parte ${error.sent} de ${error.total}, pero el resto no llegó. Tus respuestas siguen aquí.`,
      en: `Part ${error.sent} of ${error.total} was sent, but the rest did not arrive. Your answers are still here.`,
    };
  }
  return {
    es: "No se pudo enviar. Tus respuestas siguen aquí.",
    en: "We couldn't send this. Your answers are still here.",
  };
}

function renderSendPanel() {
  if (state._sending) {
    const part = state._sending.part;
    const total = state._sending.total;
    const pct = total > 1 ? Math.max(8, Math.round(((part - 1) / total) * 100)) : 40;
    const label = total > 1
      ? `Enviando parte ${part} de ${total}… / Sending part ${part} of ${total}…`
      : "Enviando… / Sending…";
    return `<div class="send-progress" role="status" aria-live="polite"><p>${label}</p><div class="send-progress-track" aria-hidden="true"><div class="send-progress-bar" style="width:${pct}%"></div></div></div>`;
  }
  if (state._sendError) {
    const copy = sendErrorCopy(state._sendError);
    return `<div class="send-error" role="alert"><p>${esc(copy.es)}</p><p>${esc(copy.en)}</p></div>`;
  }
  if (state._simNote) return `<p class="test-banner test-banner--inline" role="status">${esc(state._simNote)}</p>`;
  return "";
}

function renderSpeakBlock(q) {
  const voiceKey = q.voice;
  const clip = state.voices[voiceKey];
  const hasClip = !!(clip && clip.size > 0);
  const recording = state._recordingKey === voiceKey;
  const inApp = isInAppBrowser();
  const unsupported = !recorderSupport();
  const block = unsupported ? "no-recorder" : state._recordBlock;
  const stateName = recording ? "recording" : hasClip ? "saved" : "idle";
  let html = `<div class="recorder" data-recorder-state="${stateName}">`;
  if (block === "no-recorder" && !inApp) html += bilingualNote("noRecorder");
  else if (block === "mic-denied" && !inApp) html += bilingualNote("micDenied");
  else if (inApp || block === "mic-failed") html += bilingualNote("micFailed");
  if (!inApp && block !== "no-recorder") {
    if (recording) {
      const elapsed = activeTake?.startedAt ? (Date.now() - activeTake.startedAt) / 1000 : 0;
      html += `<p class="record-live" role="status">
        <span class="record-dot" aria-hidden="true"></span>
        <span class="record-live-label">Grabando… / Recording…</span>
        <span class="record-timer" data-record-timer>${formatClock(elapsed)}</span>
      </p>
      <button type="button" class="btn-speak is-recording" data-speak="${voiceKey}">Detener / Stop</button>`;
    } else if (hasClip) {
      const seconds = Number.isFinite(state.voiceSeconds?.[voiceKey]) ? state.voiceSeconds[voiceKey] : null;
      html += `<p class="record-saved" role="status">
        <span class="record-check" aria-hidden="true">✓</span>
        <span>${savedVoiceLabel(seconds)}</span>
      </p>
      <audio class="voice-player" controls preload="metadata" src="${playbackUrl(voiceKey, clip)}" aria-label="Grabación guardada / Recording saved"></audio>
      <button type="button" class="btn-rerecord" data-speak="${voiceKey}" aria-describedby="replace-${voiceKey}">Grabar de nuevo / Re-record</button>
      <p class="record-replace" id="replace-${voiceKey}">Esto reemplaza la toma guardada. / This replaces the saved take.</p>
      <button type="button" class="btn-delete-voice" data-delete-voice="${voiceKey}">Borrar / Delete</button>`;
    } else {
      html += `<button type="button" class="btn-speak" data-speak="${voiceKey}">Toca para grabar / Tap to record</button>`;
    }
  }
  if (state._recordError === "tooBig" && state._recordErrorKey === voiceKey) {
    html += `<p class="record-alert">${t("tooBig")}</p>`;
  }
  html += "</div>";
  html += renderRoomCopy(voiceKey);
  html += renderVoiceUpload(voiceKey);
  return html;
}

function reviewAction() {
  if (state._sending) return "";
  if (state._sendError) return `<button type="button" class="btn-next" data-nav="retry">Reintentar / Retry</button>`;
  if (testMode) return `<p class="test-banner test-banner--inline" role="status">${TEST_MODE_BANNER}</p>`;
  return `<button type="button" class="btn-next" data-nav="submit"${previewMode ? " disabled" : ""}>${t("submit")}</button>`;
}

function render() {
  document.documentElement.lang = lang === "es" ? "es" : "en";
  applyPageName();
  const banner = document.getElementById("private-banner");
  if (banner) banner.textContent = t("banner");
  const previewBanner = document.getElementById("preview-banner");
  if (previewBanner) previewBanner.hidden = !previewMode;
  const testBanner = document.getElementById("test-banner");
  if (testBanner) {
    testBanner.hidden = !testMode;
    testBanner.textContent = TEST_MODE_BANNER;
  }
  const testPanel = document.getElementById("test-panel");
  if (testPanel) testPanel.hidden = !testMode;

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
      ${renderSizeNotice()}
      ${renderVoiceChecklist(q.id)}
      <label class="wizard-lead">${t("typeAnswer")}</label>
      <textarea class="wizard-textarea" id="f_field" data-field="${q.field}">${esc(state[q.field] || "")}</textarea>
    `;
  } else if (step.type === "photo") {
    body = `
      <h2>${t("photoTitle")}</h2>
      <p class="wizard-lead">${t("photoHint")}</p>
      <input type="file" id="f_photo" accept="image/*" capture="environment" />
      ${state._photoError ? `<div class="send-error" role="alert"><p>Esta foto pasa del límite de unos 8 MB. Elige una más pequeña.</p><p>This photo is over the about-8 MB limit. Choose a smaller one.</p></div>` : ""}
      ${state.photoBlob ? `<img class="photo-preview" id="photo-preview" alt="" />` : ""}
      ${renderSizeNotice()}
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
    body = `<h2>${t("reviewTitle")}</h2><p class="wizard-lead">${t("reviewLead")}</p><p><strong>${esc(state.your_name)}</strong></p>${renderSizeNotice()}${renderVoiceChecklist(null)}${renderSendPanel()}`;
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
      ${step.type === "review" ? reviewAction() : `<button type="button" class="btn-next" data-nav="next">${t("next")}</button>`}
    </div>
    ${state._sending ? "" : `<p class="fresh-row"><button type="button" class="link-fresh" data-nav="fresh">Empezar de nuevo / Start fresh</button></p>`}
  `;

  bindStepEvents(step);
  if (state._recordingKey && activeTake?.startedAt) ensureRecordClock();
  else clearRecordClock();
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
    if (state._recordingStarting) return;
    if (state._recordingKey === key) stopRecording();
    else startRecording(key);
  });

  document.querySelector("[data-delete-voice]")?.addEventListener("click", () => {
    const key = document.querySelector("[data-delete-voice]").dataset.deleteVoice;
    if (!key) return;
    state.voices[key] = null;
    if (state.voiceSeconds) delete state.voiceSeconds[key];
    dropPlayback(key);
    state._recordError = null;
    state._recordErrorKey = null;
    saveProgress();
    render();
  });

  document.querySelector("[data-voice-upload]")?.addEventListener("change", async ev => {
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
    if (activeTake && activeTake.voiceKey === key) await finishActiveTake(true);
    state.voices[key] = file;
    if (state.voiceSeconds) delete state.voiceSeconds[key];
    dropPlayback(key);
    state._recordError = null;
    state._recordErrorKey = null;
    saveProgress();
    render();
  });

  document.getElementById("f_photo")?.addEventListener("change", async ev => {
    const file = ev.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      state._photoError = "tooBig";
      ev.target.value = "";
      render();
      return;
    }
    state._photoError = null;
    state.photoBlob = file;
    state.photoName = file.name;
    saveProgress();
    render();
  });

  document.querySelectorAll("[data-nav]").forEach(btn => {
    btn.addEventListener("click", async () => {
      collectFields();
      const action = btn.dataset.nav;
      if (action === "back" || action === "skip" || action === "next" || action === "submit" || action === "retry" || action === "fresh") {
        await finishActiveTake(false);
      }
      if (action === "fresh") {
        await startFresh();
        return;
      }
      if (action === "back" || action === "skip" || action === "next") {
        state._sendError = null;
        state._forceSizeWarn = false;
        state._simNote = null;
      }
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
        if (!previewMode && !testMode && step.type === "identity" && !state.your_name.trim()) {
          alert(t("nameRequired"));
          return;
        }
        stepIndex = Math.min(STEP_ORDER.length - 1, stepIndex + 1);
        saveProgress();
        render();
        return;
      }
      if (action === "retry") {
        if (previewMode || testMode) return;
        submitForm();
        return;
      }
      if (action === "submit") {
        if (previewMode || testMode) return;
        submitForm();
      }
    });
  });
}

function newSubmissionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `m-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function startFresh() {
  await finishActiveTake(true);
  for (const key of [...playbackUrls.keys()]) dropPlayback(key);
  const para = state.para;
  state = defaultState();
  state.para = para;
  stepIndex = 0;
  hideResume();
  if (!previewMode && !testMode) await clearSavedInterview();
  render();
}

async function continueDraft() {
  const draft = pendingDraft;
  hideResume();
  if (!draft || previewMode || testMode) {
    render();
    return;
  }
  applyDraft(draft);
  parsePara();
  try {
    await loadMediaIntoState();
  } catch {
    /* text answers still load */
  }
  render();
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function simulateSplitProgress() {
  state._sendError = null;
  state._simNote = null;
  state._forceSizeWarn = false;
  stepIndex = STEP_ORDER.findIndex(step => step.type === "review");
  state._sending = { part: 1, total: 2, simulated: true };
  render();
  await delay(650);
  if (!state._sending?.simulated) return;
  state._sending = { part: 2, total: 2, simulated: true };
  render();
  await delay(650);
  if (!state._sending?.simulated) return;
  state._sending = null;
  state._simNote = "Modo de prueba: no se envió nada. / Test mode: nothing was sent.";
  render();
}

function wireStaticControls() {
  document.getElementById("resume-continue")?.addEventListener("click", () => {
    continueDraft();
  });
  document.getElementById("resume-fresh")?.addEventListener("click", () => {
    startFresh();
  });
  document.getElementById("test-sim-error")?.addEventListener("click", () => {
    if (!testMode) return;
    state._sending = null;
    state._simNote = null;
    state._forceSizeWarn = false;
    state._sendError = { sent: 0, total: 1, simulated: true };
    stepIndex = STEP_ORDER.findIndex(step => step.type === "review");
    render();
  });
  document.getElementById("test-sim-size")?.addEventListener("click", () => {
    if (!testMode) return;
    state._sending = null;
    state._sendError = null;
    state._simNote = null;
    state._forceSizeWarn = true;
    stepIndex = STEP_ORDER.findIndex(step => step.type === "review");
    render();
  });
  document.getElementById("test-sim-split")?.addEventListener("click", () => {
    if (!testMode) return;
    simulateSplitProgress();
  });
  document.getElementById("test-sim-resume")?.addEventListener("click", () => {
    if (!testMode) return;
    showResume("Ana", null);
  });
}

async function submitForm() {
  if (previewMode || testMode) return;
  await finishActiveTake(false);
  collectFields();
  if (!state.your_name.trim()) {
    alert(t("nameRequired"));
    stepIndex = STEP_ORDER.findIndex(s => s.type === "identity");
    state._sending = null;
    render();
    return;
  }
  const plan = planInterviewParts(state);
  if (plan.textTooBig || plan.blocked.length || !plan.parts.length) {
    state._sending = null;
    state._sendError = { sent: 0, total: Math.max(1, plan.parts.length), blocked: true };
    render();
    return;
  }
  const signature = JSON.stringify(plan.parts);
  if (state._planSignature !== signature) {
    state._planSignature = signature;
    state._partsSent = 0;
    state._submissionId = newSubmissionId();
  }
  if (!state._submissionId) state._submissionId = newSubmissionId();
  const total = plan.parts.length;
  let sent = Number(state._partsSent) || 0;
  if (sent > total) sent = 0;
  state._sendError = null;

  for (let index = sent; index < total; index += 1) {
    state._sending = { part: index + 1, total };
    render();
    const fd = buildInterviewFormData(state, MAX_UPLOAD_BYTES, {
      ...plan.parts[index],
      submissionId: state._submissionId,
      partNumber: index + 1,
      partCount: total,
    });
    let response = null;
    try {
      response = await fetch("/", { method: "POST", body: fd });
    } catch {
      response = null;
    }
    if (!response || !response.ok) {
      state._sending = null;
      state._partsSent = index;
      state._sendError = { sent: index, total, blocked: false };
      render();
      return;
    }
    state._partsSent = index + 1;
  }

  state._sending = null;
  state._sendError = null;
  const para = state.para;
  await clearSavedInterview();
  for (const key of [...playbackUrls.keys()]) dropPlayback(key);
  const thanks = new URL("/crooke-7c3a9e12/interview/thank-you.html", location.origin);
  if (para) thanks.searchParams.set("para", para);
  location.href = thanks.pathname + thanks.search;
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", async () => {
    parsePara();
    wireStaticControls();
    if (lang !== "en" && lang !== "es") lang = "es";
    if (!previewMode && !testMode) {
      const draft = readDraft();
      if (hasUnsentDraft(draft)) {
        showResume(draft?.state?.your_name, draft);
        render();
        return;
      }
      if (draft) applyDraft(draft);
      try {
        await loadMediaIntoState();
      } catch {
        /* keep the text draft */
      }
    }
    render();
  });
}
