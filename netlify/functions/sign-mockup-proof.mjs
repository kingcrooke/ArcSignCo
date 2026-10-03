import { getStore } from "@netlify/blobs";

const STORE_NAME = "sign-mockup-proofs";
const MAX_BODY_BYTES = 4_500_000;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export default async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const store = getStore(STORE_NAME);

  if (req.method === "POST" && !id) {
    const len = Number(req.headers.get("content-length") || 0);
    if (len > MAX_BODY_BYTES) {
      return json({ error: "Proof payload too large. Try a smaller photo." }, 413);
    }
    let payload;
    try {
      payload = await req.json();
    } catch {
      return json({ error: "Invalid JSON body." }, 400);
    }
    const proofId = crypto.randomUUID();
    const record = {
      id: proofId,
      createdAt: new Date().toISOString(),
      status: "pending",
      approvedAt: null,
      comments: [],
      ...payload,
    };
    await store.setJSON(`proof/${proofId}`, record);
    return json({
      id: proofId,
      proofUrl: `/tools/sign-mockup/proof/?id=${proofId}`,
    });
  }

  if (!id) {
    return json({ error: "Missing proof id." }, 400);
  }

  const existing = await store.get(`proof/${id}`, { type: "json" });
  if (!existing) {
    return json({ error: "Proof not found." }, 404);
  }

  if (req.method === "GET") {
    return json(existing);
  }

  if (req.method === "PATCH") {
    let patch;
    try {
      patch = await req.json();
    } catch {
      return json({ error: "Invalid JSON body." }, 400);
    }
    if (typeof patch.comment === "string" && patch.comment.trim()) {
      existing.comments.push({
        text: patch.comment.trim().slice(0, 2000),
        at: new Date().toISOString(),
      });
    }
    if (patch.approve === true && existing.status !== "approved") {
      existing.status = "approved";
      existing.approvedAt = new Date().toISOString();
    }
    await store.setJSON(`proof/${id}`, existing);
    return json(existing);
  }

  return json({ error: "Method not allowed." }, 405);
};
