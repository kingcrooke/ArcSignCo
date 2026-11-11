// One-page concept PDF. No library: a JPEG plus the vehicle, coverage, and Arc contact line.

function encode(text) {
  return new TextEncoder().encode(text);
}

function concat(parts) {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

function pdfEscape(value) {
  return String(value ?? "").replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

export function jpegSize(jpeg) {
  const bytes = jpeg instanceof Uint8Array ? jpeg : new Uint8Array(jpeg);
  let i = 2;
  while (i + 9 < bytes.length) {
    if (bytes[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = bytes[i + 1];
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      return { width: (bytes[i + 7] << 8) | bytes[i + 8], height: (bytes[i + 5] << 8) | bytes[i + 6] };
    }
    const length = (bytes[i + 2] << 8) | bytes[i + 3];
    if (!length) break;
    i += 2 + length;
  }
  return { width: 1200, height: 800 };
}

export function buildProofPdf({ jpeg, lines = [] }) {
  const bytes = jpeg instanceof Uint8Array ? jpeg : new Uint8Array(jpeg);
  const { width: iw, height: ih } = jpegSize(bytes);
  const pageW = 612;
  const pageH = 792;
  const margin = 40;
  const maxW = pageW - margin * 2;
  const maxH = 460;
  const scale = Math.min(maxW / Math.max(iw, 1), maxH / Math.max(ih, 1));
  const dw = Math.round(iw * scale * 100) / 100;
  const dh = Math.round(ih * scale * 100) / 100;
  const imgX = Math.round((pageW - dw) / 2 * 100) / 100;
  const imgTop = 96;
  const imgY = Math.round((pageH - imgTop - dh) * 100) / 100;
  const commands = [
    "0.83 0.65 0.24 rg",
    "40 760 96 4 re f",
    "BT /F1 18 Tf 40 740 Td (Arc Signage Co.) Tj ET",
    "BT /F1 11 Tf 40 722 Td (Vehicle wrap concept) Tj ET",
    `q ${dw} 0 0 ${dh} ${imgX} ${imgY} cm /Im1 Do Q`,
  ];
  let y = imgY - 22;
  for (const line of lines) {
    if (y < 36) break;
    commands.push(`BT /F1 11 Tf 40 ${y.toFixed(1)} Td (${pdfEscape(line)}) Tj ET`);
    y -= 16;
  }
  const stream = commands.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /Font << /F1 6 0 R >> /XObject << /Im1 5 0 R >> >> /Contents 4 0 R >>`,
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    null,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  const chunks = [encode("%PDF-1.4\n")];
  let length = chunks[0].length;
  const offsets = [0];
  const push = (part) => {
    const block = typeof part === "string" ? encode(part) : part;
    chunks.push(block);
    length += block.length;
  };
  for (let n = 1; n <= 6; n++) {
    offsets[n] = length;
    push(`${n} 0 obj\n`);
    if (n === 5) {
      push(`<< /Type /XObject /Subtype /Image /Width ${iw} /Height ${ih} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${bytes.length} >>\nstream\n`);
      push(bytes);
      push("\nendstream");
    } else push(objects[n - 1]);
    push("\nendobj\n");
  }
  const xrefAt = length;
  let xref = `xref\n0 7\n0000000000 65535 f \n`;
  for (let n = 1; n <= 6; n++) xref += `${String(offsets[n]).padStart(10, "0")} 00000 n \n`;
  push(xref);
  push(`trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF`);
  return concat(chunks);
}
