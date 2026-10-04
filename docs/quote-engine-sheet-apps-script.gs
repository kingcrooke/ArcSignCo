/**
 * Arc Quote Engine — Google Sheet bridge (recommended setup)
 *
 * 1. Create a spreadsheet with tab "LeadLog" and header row (see docs/quote-engine-SETUP.md).
 * 2. Extensions → Apps Script → paste this file → Save.
 * 3. Project Settings → Script properties → add SECRET = (same random string you put in Netlify QUOTE_ENGINE_SHEET_APP_SECRET, optional)
 * 4. Deploy → New deployment → Web app → Execute as: Me · Who has access: Anyone
 * 5. Copy the Web app URL into Netlify as QUOTE_ENGINE_SHEET_APP_URL
 */

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function checkSecret_(body) {
  const expected = PropertiesService.getScriptProperties().getProperty("SECRET");
  if (!expected) return true;
  return body.secret === expected;
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("LeadLog");
  if (!sheet) throw new Error('Missing tab "LeadLog"');
  return sheet;
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    if (!checkSecret_(body)) return json_({ error: "forbidden" });

    if (body.action === "append") {
      const row = body.row;
      if (!Array.isArray(row) || row.length < 1) return json_({ error: "bad row" });
      const sheet = sheet_();
      sheet.appendRow(row);
      return json_({ ok: true, sheetRow: sheet.getLastRow() });
    }

    if (body.action === "list") {
      const sheet = sheet_();
      const values = sheet.getDataRange().getValues();
      const rows = values.slice(1)
        .map((values, idx) => ({ row: idx + 2, values }))
        .filter(r => r.values[0]);
      return json_({ ok: true, rows });
    }

    if (body.action === "patch") {
      const r = Number(body.row);
      if (!(r >= 2)) return json_({ error: "bad row" });
      const sheet = sheet_();
      if (body.status != null) sheet.getRange(r, 4).setValue(body.status);
      if (body.quotedValue != null) sheet.getRange(r, 5).setValue(body.quotedValue);
      if (body.nextStep != null) sheet.getRange(r, 6).setValue(body.nextStep);
      return json_({ ok: true });
    }

    return json_({ error: "unknown action" });
  } catch (err) {
    return json_({ error: String(err.message || err) });
  }
}
