import { createSign, createPrivateKey } from "node:crypto";
import { env } from "./env.mjs";

const SHEET_RANGE = "LeadLog!A:M";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SHEETS_BASE = "https://sheets.googleapis.com/v4/spreadsheets";

/** In-memory mock used when no Sheet integration is configured (tests and local dev). */
export const mockSheetRows = [];

export function resetMockSheet() {
  mockSheetRows.length = 0;
}

export function appsScriptConfigured() {
  return Boolean(env("QUOTE_ENGINE_SHEET_APP_URL"));
}

export function serviceAccountConfigured() {
  return Boolean(env("QUOTE_ENGINE_SHEET_ID") && env("QUOTE_ENGINE_GOOGLE_CREDENTIALS"));
}

export function sheetsConfigured() {
  return appsScriptConfigured() || serviceAccountConfigured();
}

function appSecret() {
  return env("QUOTE_ENGINE_SHEET_APP_SECRET") || "";
}

async function appsScriptPost(payload) {
  const url = env("QUOTE_ENGINE_SHEET_APP_URL");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, secret: appSecret() || undefined }),
    redirect: "follow",
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Apps Script bad response (${res.status})`);
  }
  if (!res.ok || json.error) throw new Error(json.error || `Apps Script HTTP ${res.status}`);
  return json;
}

function parseCredentials() {
  const raw = env("QUOTE_ENGINE_GOOGLE_CREDENTIALS");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function googleAccessToken(creds) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(
    JSON.stringify({
      iss: creds.client_email,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${claim}`;
  const key = createPrivateKey(creds.private_key);
  const sign = createSign("RSA-SHA256");
  sign.update(unsigned);
  sign.end();
  const signature = sign
    .sign(key)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  const jwt = `${unsigned}.${signature}`;
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) throw new Error(`Google token error ${res.status}`);
  const json = await res.json();
  return json.access_token;
}

async function sheetsFetch(path, { method = "GET", body, token }) {
  const res = await fetch(`${SHEETS_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets API ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.status === 204 ? null : res.json();
}

function mockAppend(rowValues) {
  mockSheetRows.push([...rowValues]);
  return { ok: true, mode: "mock", sheetRow: mockSheetRows.length + 1 };
}

/**
 * @returns {{ ok: boolean, mode: "apps-script"|"sheet"|"mock", sheetRow?: number, error?: string }}
 */
export async function appendLeadRow(rowValues) {
  if (appsScriptConfigured()) {
    try {
      const json = await appsScriptPost({ action: "append", row: rowValues });
      return { ok: true, mode: "apps-script", sheetRow: json.sheetRow };
    } catch (err) {
      console.error("quote-engine apps script append", err);
      return { ...mockAppend(rowValues), error: String(err.message || err) };
    }
  }
  if (!serviceAccountConfigured()) {
    return mockAppend(rowValues);
  }
  const creds = parseCredentials();
  const sheetId = env("QUOTE_ENGINE_SHEET_ID");
  if (!creds?.client_email || !creds?.private_key) {
    return { ...mockAppend(rowValues), error: "invalid_credentials" };
  }
  try {
    const token = await googleAccessToken(creds);
    const json = await sheetsFetch(`/${sheetId}/values/${encodeURIComponent(SHEET_RANGE)}:append?valueInputOption=USER_ENTERED`, {
      method: "POST",
      token,
      body: { values: [rowValues] },
    });
    const updated = json?.updates?.updatedRange || "";
    const match = updated.match(/!(?:[A-Z]+)(\d+):/);
    const sheetRow = match ? Number(match[1]) : undefined;
    return { ok: true, mode: "sheet", sheetRow };
  } catch (err) {
    console.error("quote-engine sheets append", err);
    return { ...mockAppend(rowValues), error: String(err.message || err) };
  }
}

export async function listLeadRows() {
  if (appsScriptConfigured()) {
    try {
      const json = await appsScriptPost({ action: "list" });
      return { ok: true, mode: "apps-script", rows: json.rows || [] };
    } catch (err) {
      console.error("quote-engine apps script list", err);
      return {
        ok: true,
        mode: "mock",
        rows: mockSheetRows.map((r, i) => ({ row: i + 2, values: r })),
        error: String(err.message || err),
      };
    }
  }
  if (!serviceAccountConfigured()) {
    return { ok: true, mode: "mock", rows: mockSheetRows.map((r, i) => ({ row: i + 2, values: r })) };
  }
  const creds = parseCredentials();
  const sheetId = env("QUOTE_ENGINE_SHEET_ID");
  if (!creds?.client_email) {
    return { ok: true, mode: "mock", rows: mockSheetRows.map((r, i) => ({ row: i + 2, values: r })) };
  }
  try {
    const token = await googleAccessToken(creds);
    const json = await sheetsFetch(`/${sheetId}/values/${encodeURIComponent(SHEET_RANGE)}`, { token });
    const values = json?.values || [];
    const dataRows = values.slice(1).map((values, idx) => ({ row: idx + 2, values }));
    return { ok: true, mode: "sheet", rows: dataRows };
  } catch (err) {
    console.error("quote-engine sheets list", err);
    return {
      ok: true,
      mode: "mock",
      rows: mockSheetRows.map((r, i) => ({ row: i + 2, values: r })),
      error: String(err.message || err),
    };
  }
}

/** Update status, quoted_value, next_step columns (D, E, F) for a sheet row. */
export async function patchLeadRow(sheetRow, { status, quotedValue, nextStep }) {
  if (!sheetRow || sheetRow < 2) throw new Error("invalid row");

  if (appsScriptConfigured()) {
    await appsScriptPost({ action: "patch", row: sheetRow, status, quotedValue, nextStep });
    return { ok: true, mode: "apps-script" };
  }

  if (!serviceAccountConfigured()) {
    const idx = sheetRow - 2;
    if (mockSheetRows[idx]) {
      if (status != null) mockSheetRows[idx][3] = status;
      if (quotedValue != null) mockSheetRows[idx][4] = quotedValue;
      if (nextStep != null) mockSheetRows[idx][5] = nextStep;
    }
    return { ok: true, mode: "mock" };
  }

  const updates = [];
  if (status != null) updates.push({ range: `LeadLog!D${sheetRow}`, values: [[status]] });
  if (quotedValue != null) updates.push({ range: `LeadLog!E${sheetRow}`, values: [[quotedValue]] });
  if (nextStep != null) updates.push({ range: `LeadLog!F${sheetRow}`, values: [[nextStep]] });

  const creds = parseCredentials();
  const sheetId = env("QUOTE_ENGINE_SHEET_ID");
  const token = await googleAccessToken(creds);
  await sheetsFetch(`/${sheetId}/values:batchUpdate`, {
    method: "POST",
    token,
    body: {
      valueInputOption: "USER_ENTERED",
      data: updates,
    },
  });
  return { ok: true, mode: "sheet" };
}
