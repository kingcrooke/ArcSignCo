// node --test ./tools/sign-proofs.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { handleSignProofs, STORE_NAME, contextSlug, newProofId } from "../netlify/lib/sign-proofs.mjs";

// In-memory stand-in for a Netlify Blobs store, with the same etag rules for conditional writes.
function memoryStore() {
  const data = new Map();
  let n = 0;
  const put = (key, value, opts = {}) => {
    const cur = data.get(key);
    if (opts.onlyIfNew && cur) return { modified: false };
    if (opts.onlyIfMatch && (!cur || cur.etag !== opts.onlyIfMatch)) return { modified: false };
    const etag = `"e${++n}"`;
    data.set(key, { value, etag, metadata: opts.metadata || {} });
    return { modified: true, etag };
  };
  return {
    data,
    async set(key, value, opts) { return put(key, value instanceof Uint8Array ? value.slice() : value, opts); },
    async setJSON(key, value, opts) { return put(key, JSON.stringify(value), opts); },
    async get(key, { type } = {}) {
      const e = data.get(key);
      if (!e) return null;
      if (type === "json") return JSON.parse(e.value);
      if (type === "arrayBuffer") return e.value.buffer.slice(e.value.byteOffset, e.value.byteOffset + e.value.byteLength);
      return e.value;
    },
    async getWithMetadata(key, { type } = {}) {
      const e = data.get(key);
      if (!e) return null;
      return { data: type === "json" ? JSON.parse(e.value) : e.value, etag: e.etag, metadata: e.metadata };
    },
  };
}

const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 16, 0x4a, 0x46, 0x49, 0x46, 0xff, 0xd9]);
const fixedNow = () => new Date("2026-10-03T15:04:05.000Z");
let seq = 0;
const makeId = () => (++seq).toString(16).padStart(32, "0");

function createRequest(sheet, images = { day: JPEG, night: JPEG, art: JPEG }, headers = {}) {
  const form = new FormData();
  form.set("sheet", JSON.stringify(sheet));
  for (const [k, v] of Object.entries(images)) form.set(k, new Blob([v], { type: "image/jpeg" }), `${k}.jpg`);
  return new Request("https://example.test/api/sign-proofs", { method: "POST", body: form, headers });
}
const baseSheet = {
  typeId: "halo",
  project: "Corner Bakery (sample)",
  preparedFor: "Sample client",
  size: { width: 120, height: 24 },
  sizeText: { width: `10' 0"`, height: `2' 0"`, area: "20 sq ft" },
  price: { low: 1, high: 2 },
  images: { day: { width: 1600, height: 1200 }, night: { width: 1600, height: 1200 }, art: { width: 800, height: 200 } },
};
const call = (store, req, params, ctx = "deploy-preview") => handleSignProofs(req, { store, params, deployContext: ctx, now: fixedNow, makeId });
const post = (url, body) => new Request(`https://example.test${url}`, { method: "POST", body: JSON.stringify(body), headers: { "content-type": "application/json" } });
const get = url => new Request(`https://example.test${url}`);

test("store is namespaced for this feature", () => {
  assert.equal(STORE_NAME, "arc-sign-mockup-proofs");
  assert.equal(contextSlug("deploy-preview"), "deploy-preview");
  assert.equal(contextSlug("../../x"), "x");
  assert.equal(contextSlug(undefined), "dev");
  assert.match(newProofId(), /^[0-9a-f]{32}$/);
});

test("create stores images and a server-priced sheet under v1/<context>/<id>/", async () => {
  const store = memoryStore();
  const res = await call(store, createRequest(baseSheet), {});
  assert.equal(res.status, 201);
  const { id, sheet } = await res.json();
  assert.match(id, /^[0-9a-f]{32}$/);
  for (const f of ["sheet.json", "day.jpg", "night.jpg", "art.jpg"]) assert.ok(store.data.has(`v1/deploy-preview/${id}/${f}`), f);
  assert.equal(sheet.typeName, "Halo-lit (reverse-lit) channel letters");
  // The client's numbers are ignored; while the rates are placeholders the server stores no numbers at all.
  assert.equal(sheet.price.withheld, true, "price comes from the config, not the client");
  assert.equal(sheet.price.placeholder, true);
  assert.equal(sheet.price.low, undefined);
  assert.equal(sheet.price.high, undefined);
  assert.doesNotMatch(JSON.stringify(sheet.price), /\$\d/);
  assert.match(sheet.price.message, /formal written estimate after a site survey/i);
  assert.equal(sheet.createdAt, "2026-10-03T15:04:05.000Z");
  assert.equal(sheet.ns, undefined);
});

test("proofs from one deploy context are not visible from another", async () => {
  const store = memoryStore();
  const { id } = await (await call(store, createRequest(baseSheet), {}, "deploy-preview")).json();
  assert.equal((await call(store, get(`/api/sign-proofs/${id}`), { id }, "deploy-preview")).status, 200);
  assert.equal((await call(store, get(`/api/sign-proofs/${id}`), { id }, "production")).status, 404);
});

test("the deep link's source tag is stored, cleaned, with the tab and type", async () => {
  const store = memoryStore();
  const { sheet } = await (await call(store, createRequest({ ...baseSheet, typeId: "vinyl-door-hours", src: "Instagram Bio<script>" }), {})).json();
  assert.equal(sheet.src, "instagrambioscript");
  assert.equal(sheet.category, "vinyl");
  assert.equal(sheet.typeId, "vinyl-door-hours");
  assert.equal(sheet.test, undefined);
  const plain = await (await call(store, createRequest(baseSheet), {})).json();
  assert.equal(plain.sheet.src, "");
});

test("test proofs are refused on production and marked as tests elsewhere", async () => {
  const store = memoryStore();
  const before = store.data.size;
  assert.equal((await call(store, createRequest({ ...baseSheet, test: true }), {}, "production")).status, 403);
  assert.equal((await call(store, createRequest(baseSheet, undefined, { "X-Sign-Mockup-Test": "1" }), {}, "production")).status, 403);
  assert.equal(store.data.size, before, "nothing stored");
  const res = await call(store, createRequest(baseSheet, undefined, { "X-Sign-Mockup-Test": "1" }), {}, "deploy-preview");
  assert.equal(res.status, 201);
  assert.equal((await res.json()).sheet.test, true);
  assert.equal((await call(store, createRequest(baseSheet), {}, "production")).status, 201, "real proofs still work on production");
});

test("create rejects bad input", async () => {
  const store = memoryStore();
  assert.equal((await call(store, createRequest({ ...baseSheet, typeId: "nope" }), {})).status, 400);
  assert.equal((await call(store, createRequest(baseSheet, { night: JPEG }), {})).status, 400, "day is required");
  assert.equal((await call(store, createRequest(baseSheet, { day: new Uint8Array([1, 2, 3, 4, 5]) }), {})).status, 415);
  assert.equal((await call(store, createRequest(baseSheet, { day: new Uint8Array(1_700_000).fill(0xff) }), {})).status, 413);
  assert.equal((await call(store, post("/api/sign-proofs", {}), {})).status, 415);
});

test("awning proofs keep only allowed options and carry no price numbers", async () => {
  const store = memoryStore();
  const req = createRequest({
    ...baseSheet,
    typeId: "aw-traditional",
    size: { width: 240, height: 40 },
    options: { panel: "#1F4F7A", pattern: "stripes", valance: "scalloped", lit: "backlit", cover: "glass", evil: "<script>", projection: 9999 },
  });
  const { sheet } = await (await call(store, req, {})).json();
  assert.equal(sheet.category, "awning");
  assert.equal(sheet.typeName, "Traditional slope");
  assert.equal(sheet.options.panel, "#1f4f7a");
  assert.equal(sheet.options.valance, "scalloped");
  assert.equal(sheet.options.cover, "vinyl", "backlit awnings are vinyl; glass isn't allowed on this shape");
  assert.equal(sheet.options.projection, 96, "projection is clamped to the shape's range");
  assert.equal(sheet.options.evil, undefined);
  assert.equal(sheet.lighting, "Backlit");
  assert.equal(sheet.price.withheld, true);
  assert.equal(sheet.price.low, undefined);
  const plain = await (await call(store, createRequest({ ...baseSheet, typeId: "aw-traditional", size: { width: 240, height: 40 } }), {})).json();
  assert.equal(plain.sheet.lighting, "Non-lit");
  assert.equal(plain.sheet.price.withheld, true);
  const sign = await (await call(store, createRequest(baseSheet), {})).json();
  assert.equal(sign.sheet.options, null, "signs carry no options");
  const legacy = await (await call(store, createRequest({ ...baseSheet, typeId: "awning" }), {})).json();
  assert.equal(legacy.sheet.typeId, "aw-traditional", "the old single awning id maps onto the library");
});

test("no size means no price", async () => {
  const store = memoryStore();
  const { sheet } = await (await call(store, createRequest({ ...baseSheet, size: null }), {})).json();
  assert.equal(sheet.price, null);
  assert.equal(sheet.size, null);
});

test("images are served as JPEG", async () => {
  const store = memoryStore();
  const { id } = await (await call(store, createRequest(baseSheet), {})).json();
  const res = await call(store, get(`/api/sign-proofs/${id}/night`), { id, action: "night" });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("content-type"), "image/jpeg");
  assert.deepEqual(new Uint8Array(await res.arrayBuffer()), JPEG);
});

test("comments append; approval is timestamped by the server and only happens once", async () => {
  const store = memoryStore();
  const { id } = await (await call(store, createRequest(baseSheet), {})).json();
  let res = await call(store, post(`/api/sign-proofs/${id}/comments`, { name: "Sam", text: "  Can the letters be gold?  " }), { id, action: "comments" });
  assert.equal(res.status, 200);
  let sheet = await res.json();
  assert.deepEqual(sheet.comments, [{ name: "Sam", text: "Can the letters be gold?", at: "2026-10-03T15:04:05.000Z" }]);

  assert.equal((await call(store, post(`/api/sign-proofs/${id}/comments`, { text: "   " }), { id, action: "comments" })).status, 400);
  assert.equal((await call(store, post(`/api/sign-proofs/${id}/approve`, { name: "" }), { id, action: "approve" })).status, 400);

  res = await call(store, post(`/api/sign-proofs/${id}/approve`, { name: "Sam Lee", at: "1999-01-01" }), { id, action: "approve" });
  sheet = await res.json();
  assert.deepEqual(sheet.approval, { name: "Sam Lee", at: "2026-10-03T15:04:05.000Z" });
  assert.equal((await call(store, post(`/api/sign-proofs/${id}/approve`, { name: "Other" }), { id, action: "approve" })).status, 409);
});

test("concurrent comments are both kept", async () => {
  const store = memoryStore();
  const { id } = await (await call(store, createRequest(baseSheet), {})).json();
  await Promise.all(["one", "two", "three"].map(text => call(store, post(`/api/sign-proofs/${id}/comments`, { text }), { id, action: "comments" })));
  const sheet = await (await call(store, get(`/api/sign-proofs/${id}`), { id })).json();
  assert.deepEqual(sheet.comments.map(c => c.text).sort(), ["one", "three", "two"]);
});

test("unknown ids and routes", async () => {
  const store = memoryStore();
  assert.equal((await call(store, get("/api/sign-proofs/../x"), { id: "../x" })).status, 404);
  assert.equal((await call(store, get(`/api/sign-proofs/${"a".repeat(32)}`), { id: "a".repeat(32) })).status, 404);
  assert.equal((await call(store, get("/api/sign-proofs"), {})).status, 405);
});
