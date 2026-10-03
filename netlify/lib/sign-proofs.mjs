// Phone approval links for the sign mockup tool: storage and validation, independent of the
// Netlify runtime so tools/sign-proofs.test.mjs can run it against an in-memory store.
//
// Storage: one Netlify Blobs store, STORE_NAME, used only by this feature. Keys are namespaced
//   v1/<deploy context>/<proof id>/sheet.json   project, type, options, size, price, comments, approval
//   v1/<deploy context>/<proof id>/day.jpg      day mockup
//   v1/<deploy context>/<proof id>/night.jpg    night mockup
//   v1/<deploy context>/<proof id>/art.jpg      flat artwork
// so proofs made on deploy previews never mix with production ones and can be cleared by prefix.
import { estimatePrice } from "../../tools/sign-mockup/js/pricing.js";
import { getType, isKnownType, cleanOptions, lightingOf } from "../../tools/sign-mockup/js/catalog.js";
import { AWNING_LIGHTS } from "../../tools/sign-mockup/js/awning-types.js";

export const STORE_NAME = "arc-sign-mockup-proofs";
export const KEY_VERSION = "v1";
export const IMAGES = ["day", "night", "art"];
export const LIMITS = {
  imageBytes: 1_600_000,
  imageSide: 4096,
  text: { project: 120, preparedFor: 120, notes: 1200, reference: 160, name: 80, comment: 1000 },
  comments: 200,
  sizeInches: [1, 2400],
};

const ID_RE = /^[0-9a-f]{32}$/;

export function newProofId() {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return [...b].map(v => v.toString(16).padStart(2, "0")).join("");
}

export function contextSlug(ctx) {
  const s = String(ctx || "dev").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 32);
  return s || "dev";
}

const keyFor = (ns, id, file) => `${KEY_VERSION}/${ns}/${id}/${file}`;

const json = (status, body, extra = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex", ...extra },
});
const fail = (status, error) => json(status, { error });

function clean(value, max) {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/\r\n?/g, "\n")
    .trim()
    .slice(0, max);
}

function isJpeg(bytes) {
  return bytes.length > 4 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
}

function validDims(d) {
  const w = Math.round(Number(d?.width)), h = Math.round(Number(d?.height));
  return w > 0 && h > 0 && w <= LIMITS.imageSide && h <= LIMITS.imageSide ? { width: w, height: h } : null;
}

// The public view of a sheet: what the proof page and the PDF need.
function publicSheet(sheet) {
  const { ns, ...rest } = sheet;
  return rest;
}

async function readSheet(store, ns, id) {
  const got = await store.getWithMetadata(keyFor(ns, id, "sheet.json"), { type: "json" });
  return got && got.data ? { sheet: got.data, etag: got.etag } : null;
}

// Read-modify-write with the etag, so two people commenting at once never overwrite each other.
async function updateSheet(store, ns, id, change) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const cur = await readSheet(store, ns, id);
    if (!cur) return { status: 404 };
    const result = change(structuredClone(cur.sheet));
    if (result.status) return result;
    const write = await store.setJSON(keyFor(ns, id, "sheet.json"), result.sheet, { onlyIfMatch: cur.etag });
    if (write.modified) return { sheet: result.sheet };
  }
  return { status: 409, error: "The proof changed while saving. Try again." };
}

async function create(req, { store, ns, now, makeId }) {
  const type = req.headers.get("content-type") || "";
  if (!type.startsWith("multipart/form-data")) return fail(415, "Send the proof as multipart form data.");
  let form;
  try { form = await req.formData(); } catch { return fail(400, "The upload could not be read."); }

  let meta;
  try { meta = JSON.parse(String(form.get("sheet") || "")); } catch { return fail(400, "Missing proof details."); }
  if (!meta || typeof meta !== "object") return fail(400, "Missing proof details.");
  if (!isKnownType(meta.typeId)) return fail(400, "Unknown sign or awning type.");

  const files = {};
  const dims = {};
  for (const name of IMAGES) {
    const f = form.get(name);
    if (!f || typeof f.arrayBuffer !== "function") {
      if (name === "day") return fail(400, "The day mockup is missing.");
      continue;
    }
    const bytes = new Uint8Array(await f.arrayBuffer());
    if (bytes.length > LIMITS.imageBytes) return fail(413, `The ${name} image is too large.`);
    if (!isJpeg(bytes)) return fail(415, `The ${name} image must be a JPEG.`);
    const d = validDims(meta.images?.[name]);
    if (!d) return fail(400, `The ${name} image size is missing.`);
    files[name] = bytes;
    dims[name] = d;
  }

  const [lo, hi] = LIMITS.sizeInches;
  const w = Number(meta.size?.width), h = Number(meta.size?.height);
  const size = w >= lo && w <= hi && h >= lo && h <= hi ? { width: Math.round(w * 10) / 10, height: Math.round(h * 10) / 10 } : null;
  const t = LIMITS.text;
  const sizeText = size && meta.sizeText ? {
    width: clean(meta.sizeText.width, 24), height: clean(meta.sizeText.height, 24), area: clean(meta.sizeText.area, 24),
  } : null;
  const signType = getType(meta.typeId);
  // Awning options are rebuilt from the allowed values only; signs carry none.
  const options = cleanOptions(signType, meta.options);

  const id = makeId();
  const sheet = {
    v: 1,
    id,
    ns,
    createdAt: now().toISOString(),
    project: clean(meta.project, t.project),
    preparedFor: clean(meta.preparedFor, t.preparedFor),
    notes: clean(meta.notes, t.notes),
    reference: clean(meta.reference, t.reference),
    typeId: signType.id,
    category: signType.category,
    typeName: signType.name,
    lighting: options ? AWNING_LIGHTS[lightingOf(signType, options)] : signType.lightingLabel,
    options,
    size,
    sizeText,
    // Priced on the server from the shared placeholder config, so a link can't carry a made-up number.
    price: size ? estimatePrice(signType.id, size, options) : null,
    images: dims,
    comments: [],
    approval: null,
  };

  for (const name of Object.keys(files)) {
    await store.set(keyFor(ns, id, `${name}.jpg`), files[name], { metadata: { contentType: "image/jpeg", ...dims[name] } });
  }
  const write = await store.setJSON(keyFor(ns, id, "sheet.json"), sheet, { onlyIfNew: true });
  if (!write.modified) return fail(409, "Could not create the link. Try again.");
  return json(201, { id, sheet: publicSheet(sheet) });
}

async function readBody(req) {
  try { return await req.json(); } catch { return null; }
}

/**
 * @param {Request} req
 * @param {{store, params: {id?: string, action?: string}, deployContext?: string, now?: () => Date, makeId?: () => string}} env
 */
export async function handleSignProofs(req, { store, params = {}, deployContext, now = () => new Date(), makeId = newProofId }) {
  const ns = contextSlug(deployContext);
  const { id, action } = params;
  const method = req.method.toUpperCase();

  if (!id) {
    if (method !== "POST") return fail(405, "Method not allowed.");
    return create(req, { store, ns, now, makeId });
  }
  if (!ID_RE.test(id)) return fail(404, "This approval link was not found.");

  if (!action) {
    if (method !== "GET") return fail(405, "Method not allowed.");
    const cur = await readSheet(store, ns, id);
    return cur ? json(200, publicSheet(cur.sheet)) : fail(404, "This approval link was not found.");
  }

  if (IMAGES.includes(action)) {
    if (method !== "GET") return fail(405, "Method not allowed.");
    const data = await store.get(keyFor(ns, id, `${action}.jpg`), { type: "arrayBuffer" });
    if (!data) return fail(404, "Image not found.");
    return new Response(data, {
      status: 200,
      headers: { "Content-Type": "image/jpeg", "Cache-Control": "private, max-age=86400", "X-Robots-Tag": "noindex" },
    });
  }

  if (action === "comments" || action === "approve") {
    if (method !== "POST") return fail(405, "Method not allowed.");
    const body = await readBody(req);
    if (!body || typeof body !== "object") return fail(400, "Send JSON.");
    const name = clean(body.name, LIMITS.text.name);
    const at = now().toISOString();

    const result = await updateSheet(store, ns, id, sheet => {
      if (action === "comments") {
        const text = clean(body.text, LIMITS.text.comment);
        if (!text) return { status: 400, error: "Write a comment first." };
        if (sheet.comments.length >= LIMITS.comments) return { status: 429, error: "This proof has reached its comment limit." };
        sheet.comments.push({ name, text, at });
      } else {
        if (!name) return { status: 400, error: "Add your name to approve." };
        if (sheet.approval) return { status: 409, error: "This proof was already approved." };
        sheet.approval = { name, at };
      }
      return { sheet };
    });
    if (result.status === 404) return fail(404, "This approval link was not found.");
    if (result.status) return fail(result.status, result.error);
    return json(200, publicSheet(result.sheet));
  }

  return fail(404, "Not found.");
}
