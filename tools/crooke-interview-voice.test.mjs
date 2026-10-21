import assert from "node:assert/strict";
import test from "node:test";
import {
  QUESTION_STEPS,
  VOICE_MIME_CANDIDATES,
  buildInterviewFormData,
  extensionForMime,
  fileNameForVoice,
  isPreviewRequest,
  pickSupportedMimeType,
  recorderOptions,
  voiceFileFromChunks,
} from "../crooke-7c3a9e12/interview/interview-wizard.js";

test("preview=1 is the only review-mode switch", () => {
  assert.equal(isPreviewRequest("?preview=1"), true);
  assert.equal(isPreviewRequest("preview=1"), true);
  assert.equal(isPreviewRequest("?para=Ana&preview=1"), true);
  assert.equal(isPreviewRequest(""), false);
  assert.equal(isPreviewRequest("?preview=0"), false);
  assert.equal(isPreviewRequest("?preview=true"), false);
});

test("picks the first supported voice mime, including iPhone audio/mp4", () => {
  assert.deepEqual(VOICE_MIME_CANDIDATES, [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/aac",
    "audio/ogg;codecs=opus",
  ]);
  const safari = new Set(["audio/mp4", "audio/aac"]);
  assert.equal(
    pickSupportedMimeType(type => safari.has(type)),
    "audio/mp4",
  );
  assert.equal(
    pickSupportedMimeType(type => type === "audio/ogg;codecs=opus"),
    "audio/ogg;codecs=opus",
  );
  assert.equal(
    pickSupportedMimeType(() => false),
    "",
  );
  assert.equal(pickSupportedMimeType(undefined), "");
  assert.equal(
    pickSupportedMimeType(type => {
      if (type.startsWith("audio/webm")) throw new Error("unsupported");
      return type === "audio/aac";
    }),
    "audio/aac",
  );
});

test("omits mimeType when nothing is supported and maps extensions", () => {
  assert.deepEqual(recorderOptions(""), { audioBitsPerSecond: 32000 });
  assert.equal(recorderOptions("audio/mp4").mimeType, "audio/mp4");
  assert.equal(extensionForMime("audio/webm;codecs=opus"), "webm");
  assert.equal(extensionForMime("audio/webm"), "webm");
  assert.equal(extensionForMime("audio/mp4"), "m4a");
  assert.equal(extensionForMime("audio/aac"), "m4a");
  assert.equal(extensionForMime("audio/mp4;codecs=mp4a.40.2"), "m4a");
  assert.equal(extensionForMime("audio/ogg;codecs=opus"), "ogg");
  assert.equal(extensionForMime(""), "");
});

test("seven general questions, with no single person as the focus", () => {
  assert.deepEqual(
    QUESTION_STEPS.map(q => [q.es.title, q.en.title]),
    [
      ["Sobre ti y tu niñez", "About you and your childhood"],
      ["Padres", "Parents"],
      ["Abuelos y mayores", "Grandparents and elders"],
      ["Lugares y orígenes", "Places and origins"],
      ["Familiares que ya no están", "Relatives we've lost"],
      ["Historias de la familia", "Family stories"],
      ["Tradiciones, comida, dichos y más", "Traditions, food, sayings & more"],
    ],
  );
  const places = QUESTION_STEPS.find(q => q.id === "places_origins");
  assert.equal(places.es.hint, "Líneas de la familia, migración y de dónde viene la familia.");
  assert.equal(places.en.hint, "Family lines, migration, and where the family comes from.");
  assert.equal(/Crooke|Morel/.test(`${places.es.hint} ${places.en.hint}`), false);
  assert.equal(/Charles|Mami|Jesús|Jesus/.test(JSON.stringify(QUESTION_STEPS)), false);
});

test("submission FormData includes each voice file with the recorder extension", async () => {
  assert.equal(QUESTION_STEPS.length, 7);
  const recorded = voiceFileFromChunks([new Blob(["CROOKE-VOICE-MARKER"])], "audio/mp4", "voice_about_you");
  assert.equal(recorded.name, "voice_about_you.m4a");
  assert.equal(recorded.type, "audio/mp4");
  const uploaded = new File(["CROOKE-UPLOAD-MARKER"], "Voice Memo.m4a", { type: "audio/mp4" });
  const tooBig = new File([new Uint8Array(32)], "huge.m4a", { type: "audio/mp4" });
  const fd = buildInterviewFormData(
    {
      your_name: "Ana",
      relationship: "prima",
      phone: "",
      email: "",
      para: "",
      about_you: "crecí en el barrio",
      parents: "",
      loved_ones: "un tío",
      family_stories: "se conocieron en una fiesta",
      voices: {
        voice_about_you: recorded,
        voice_parents: uploaded,
        voice_loved_ones: tooBig,
      },
      relatives: [],
    },
    24,
  );
  assert.equal(fd.get("form-name"), "crooke-interview");
  assert.equal(fd.get("your_name"), "Ana");
  assert.equal(fd.get("about_you"), "crecí en el barrio");
  assert.equal(fd.get("loved_ones"), "un tío");
  assert.equal(fd.get("family_stories"), "se conocieron en una fiesta");
  assert.equal(fd.get("charles_memorial"), null);
  assert.equal(fd.get("mami_charles_story"), null);
  const voice = fd.get("voice_about_you");
  assert.equal(voice.name, "voice_about_you.m4a");
  assert.equal(voice.type, "audio/mp4");
  assert.equal(await voice.text(), "CROOKE-VOICE-MARKER");
  const upload = fd.get("voice_parents");
  assert.equal(upload.name, "Voice Memo.m4a");
  assert.equal(await upload.text(), "CROOKE-UPLOAD-MARKER");
  assert.equal(fd.get("voice_loved_ones"), null);
  assert.equal(fileNameForVoice("voice_family_stories", { type: "audio/ogg;codecs=opus" }), "voice_family_stories.ogg");
});
