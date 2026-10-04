import { getStore } from "@netlify/blobs";
import { leadToSheetRow, normalizeLead, SHEET_HEADERS } from "./quote-leads.mjs";
import { appendLeadRow, listLeadRows, patchLeadRow } from "./google-sheets.mjs";

export const BLOB_STORE = "arc-quote-engine-leads";

export function blobStore() {
  return getStore({ name: BLOB_STORE, consistency: "strong" });
}

export async function saveLeadBlob(lead, meta = {}) {
  const store = blobStore();
  await store.setJSON(`lead/${lead.id}`, { ...lead, ...meta, updatedAt: new Date().toISOString() });
}

export async function getLeadBlob(id) {
  if (!id) return null;
  if (!process.env.NETLIFY_SITE_ID && !process.env.NETLIFY_BLOBS_CONTEXT) {
    return null;
  }
  try {
    const store = blobStore();
    return store.get(`lead/${id}`, { type: "json" });
  } catch {
    return null;
  }
}

export async function listLeadBlobs() {
  const store = blobStore();
  const list = await store.list({ prefix: "lead/" });
  const leads = [];
  for (const item of list.blobs) {
    const lead = await store.get(item.key, { type: "json" });
    if (lead) leads.push(lead);
  }
  leads.sort((a, b) => String(b.receivedAt).localeCompare(String(a.receivedAt)));
  return leads;
}

/** Ingest from Netlify Forms webhook JSON. */
export async function ingestFormPayload(payload) {
  const lead = normalizeLead(payload);
  const sheetResult = await appendLeadRow(leadToSheetRow(lead));
  await saveLeadBlob(lead, { sheetRow: sheetResult.sheetRow, sheetMode: sheetResult.mode });
  return { lead, sheet: sheetResult };
}

export function rowToLead(values, sheetRow) {
  const [
    id,
    receivedAt,
    source,
    status,
    quotedValue,
    nextStep,
    name,
    email,
    phone,
    company,
    address,
    projectType,
    scopeSummary,
  ] = values;
  return {
    id,
    receivedAt,
    source,
    status: status || "New",
    quotedValue: quotedValue || "",
    nextStep: nextStep || "",
    name,
    email,
    phone,
    company,
    address,
    projectType,
    scopeSummary,
    sheetRow,
  };
}

export async function listLeadsMerged() {
  const [sheetList, blobs] = await Promise.all([listLeadRows(), listLeadBlobs()]);
  const blobById = new Map(blobs.map(b => [b.id, b]));
  const fromSheet = sheetList.rows
    .filter(r => r.values?.[0])
    .map(r => {
      const lead = rowToLead(r.values, r.row);
      const blob = blobById.get(lead.id);
      return blob ? { ...blob, ...lead, calculatorInput: blob.calculatorInput } : lead;
    });
  if (fromSheet.length) return { mode: sheetList.mode, leads: fromSheet, error: sheetList.error };
  return { mode: "blob", leads: blobs, error: sheetList.error };
}

export async function updateLeadStatus(id, patch) {
  const blob = (await getLeadBlob(id)) || {};
  const next = {
    ...blob,
    status: patch.status ?? blob.status,
    quotedValue: patch.quotedValue ?? blob.quotedValue,
    nextStep: patch.nextStep ?? blob.nextStep,
  };
  await saveLeadBlob(next);
  if (blob.sheetRow) await patchLeadRow(blob.sheetRow, patch);
  return next;
}

export { SHEET_HEADERS };
