/** Shared display formatters. PDF text stays ASCII (ft / in). */

export function formatFtIn(totalInches) {
  if (!Number.isFinite(totalInches) || totalInches <= 0) return "\u2014";
  const feet = Math.floor(totalInches / 12);
  let inches = totalInches - feet * 12;
  inches = Math.round(inches * 8) / 8;
  if (inches >= 12) return `${feet + 1} ft 0 in`;
  const inchStr = inches % 1 === 0 ? String(inches) : inches.toFixed(2).replace(/\.?0+$/, "");
  if (feet > 0) return `${feet} ft ${inchStr} in`;
  return `${inchStr} in`;
}

export function formatFtInPdf(totalInches) {
  const label = formatFtIn(totalInches);
  return label === "\u2014" ? "-" : label;
}

export function formatWhen(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function pdfSafe(value) {
  return String(value || "")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/ {2,}/g, " ")
    .trim();
}

export function formatDay(iso) {
  const date = iso ? new Date(iso) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
