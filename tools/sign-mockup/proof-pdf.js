/**
 * Branded concept PDF.
 * Page 1 matches the original day proof (navy bar, logo, composite, project, date, size).
 * Later pages add the night view and the undistorted fabrication artwork.
 */

import { pdfSafe } from "./format.js";
import { CONCEPT_DISCLAIMER_PDF, formatUsd } from "./pricing-config.js";

export async function loadLogoDataUrl() {
  const resp = await fetch("/assets/img/logo-lockup-white-560.v2.png");
  if (!resp.ok) throw new Error("Logo failed to load.");
  const blob = await resp.blob();
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    const lc = document.createElement("canvas");
    const maxW = 280;
    const scale = maxW / img.naturalWidth;
    lc.width = Math.round(img.naturalWidth * scale);
    lc.height = Math.round(img.naturalHeight * scale);
    lc.getContext("2d").drawImage(img, 0, 0, lc.width, lc.height);
    return lc.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image."));
    img.src = url;
  });
}

function jsPDF() {
  const ctor = window.jspdf?.jsPDF;
  if (!ctor) throw new Error("PDF library not loaded.");
  return new ctor({ orientation: "landscape", unit: "pt", format: "letter" });
}

function drawHeader(doc, logoData) {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 40;
  doc.setFillColor(11, 29, 51);
  doc.rect(0, 0, pageW, 72, "F");
  if (logoData) doc.addImage(logoData, "PNG", margin, 14, 140, 29);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Storefront sign concept proof", pageW - margin, 28, { align: "right" });
  doc.text("arcsignco.com  ·  (347) 450-2110", pageW - margin, 44, { align: "right" });
  doc.setFontSize(9);
  doc.text("jc@arcsignco.com  ·  arc@arcsignco.com", pageW - margin, 58, { align: "right" });
}

function placeImage(doc, dataUrl, top, maxH) {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 40;
  const maxImgW = pageW - margin * 2;
  const props = doc.getImageProperties(dataUrl);
  const aspect = props.width / props.height;
  let drawW = maxImgW;
  let drawH = drawW / aspect;
  if (drawH > maxH) {
    drawH = maxH;
    drawW = drawH * aspect;
  }
  const imgX = margin + (maxImgW - drawW) / 2;
  const format = dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG";
  doc.addImage(dataUrl, format, imgX, top, drawW, drawH);
  return { drawW, drawH, y: top + drawH };
}

function writeDisclaimer(doc, y) {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 40;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(101, 114, 135);
  const lines = doc.splitTextToSize(CONCEPT_DISCLAIMER_PDF, pageW - margin * 2);
  doc.text(lines, margin, y);
  return y + lines.length * 13;
}

/**
 * @param {object} spec
 * @param {string} spec.logoDataUrl
 * @param {string} spec.project
 * @param {string} spec.dateStr
 * @param {string} spec.dayDataUrl
 * @param {string} [spec.nightDataUrl]
 * @param {string} [spec.artworkDataUrl]
 * @param {string} spec.sizeLine  already formatted, or the uncalibrated sentence
 * @param {string} [spec.signLine]
 * @param {string} [spec.nightLine]
 * @param {object|null} [spec.price]
 * @param {string} [spec.approvalLine]
 */
export function buildProofPdf(spec) {
  const doc = jsPDF();
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;

  drawHeader(doc, spec.logoDataUrl);
  const day = placeImage(doc, spec.dayDataUrl, 88, pageH - 230);
  let y = day.y + 22;
  doc.setTextColor(23, 34, 51);
  doc.setFontSize(12);
  if (spec.project) {
    doc.setFont("helvetica", "bold");
    doc.text(pdfSafe(`Project: ${spec.project}`), margin, y);
    doc.setFont("helvetica", "normal");
    y += 16;
  }
  doc.text(`Date: ${spec.dateStr}`, margin, y);
  y += 16;
  doc.text(pdfSafe(spec.sizeLine), margin, y);
  y += 16;
  if (spec.signLine) {
    doc.text(pdfSafe(spec.signLine), margin, y);
    y += 16;
  }
  writeDisclaimer(doc, y + 8);

  if (spec.nightDataUrl) {
    doc.addPage();
    drawHeader(doc, spec.logoDataUrl);
    const night = placeImage(doc, spec.nightDataUrl, 88, pageH - 210);
    y = night.y + 22;
    doc.setTextColor(23, 34, 51);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(pdfSafe(spec.nightLine || "Night view, same placement as the day proof."), margin, y);
    y += 16;
    if (spec.project) {
      doc.text(pdfSafe(`Project: ${spec.project}`), margin, y);
      y += 16;
    }
    writeDisclaimer(doc, y + 8);
  }

  if (spec.artworkDataUrl) {
    doc.addPage();
    drawHeader(doc, spec.logoDataUrl);
    doc.setTextColor(23, 34, 51);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Fabrication artwork (undistorted)", margin, 96);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(101, 114, 135);
    const note = doc.splitTextToSize(
      "Build from this file. The storefront pictures are a placement concept only.",
      pageW - margin * 2
    );
    doc.text(note, margin, 112);
    const art = placeImage(doc, spec.artworkDataUrl, 132, pageH - 300);
    y = art.y + 20;
    doc.setTextColor(23, 34, 51);
    doc.setFontSize(12);
    if (spec.price) {
      doc.setFont("helvetica", "bold");
      doc.text(`Preliminary placeholder: ${formatUsd(spec.price.amountUsd)}`, margin, y);
      doc.setFont("helvetica", "normal");
      y += 16;
      const priceNote = doc.splitTextToSize(
        `${spec.price.label} (${spec.price.version}). ${spec.price.disclaimer} Based on calibrated width, sign type, and illumination.`,
        pageW - margin * 2
      );
      doc.setFontSize(10);
      doc.text(priceNote, margin, y);
      y += priceNote.length * 13 + 6;
    } else {
      doc.text("Preliminary price: width was not calibrated.", margin, y);
      y += 16;
    }
    if (spec.approvalLine) {
      doc.setFontSize(12);
      doc.setTextColor(23, 34, 51);
      const approval = doc.splitTextToSize(pdfSafe(spec.approvalLine), pageW - margin * 2);
      doc.text(approval, margin, y);
      y += approval.length * 15 + 6;
    }
    if (spec.comments?.length) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(23, 34, 51);
      doc.text("Comments", margin, y);
      y += 16;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      for (const line of spec.comments) {
        const wrapped = doc.splitTextToSize(pdfSafe(line), pageW - margin * 2);
        if (y + wrapped.length * 12 > pageH - 56) {
          doc.addPage();
          drawHeader(doc, spec.logoDataUrl);
          y = 96;
        }
        doc.text(wrapped, margin, y);
        y += wrapped.length * 12 + 6;
      }
    }
    writeDisclaimer(doc, y + 8);
  }

  return doc;
}

export function canvasToJpeg(canvas, maxEdge, quality) {
  return shrink(canvas, maxEdge, "image/jpeg", quality, false);
}

export function imageToDataUrl(img, maxEdge) {
  const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round((img.naturalWidth || img.width) * scale));
  canvas.height = Math.max(1, Math.round((img.naturalHeight || img.height) * scale));
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  let png = canvas.toDataURL("image/png");
  if (png.length <= 1_800_000) return png;
  ctx.globalCompositeOperation = "destination-over";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.86);
}

function shrink(source, maxEdge, type, quality) {
  const scale = Math.min(1, maxEdge / Math.max(source.width, source.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(source.width * scale));
  canvas.height = Math.max(1, Math.round(source.height * scale));
  canvas.getContext("2d").drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL(type, quality);
}

export async function blobToDataUrl(blob) {
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  const type = blob.type || "image/jpeg";
  return `data:${type};base64,${btoa(binary)}`;
}
