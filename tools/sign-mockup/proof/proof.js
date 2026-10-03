(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const proofId = params.get("id");
  const $ = (id) => document.getElementById(id);
  let proof = null;

  function formatTimestamp(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function renderComments() {
    const list = $("commentList");
    list.innerHTML = "";
    for (const c of proof.comments || []) {
      const li = document.createElement("li");
      li.textContent = c.text;
      const t = document.createElement("time");
      t.textContent = formatTimestamp(c.at);
      li.appendChild(t);
      list.appendChild(li);
    }
  }

  function renderProof(data) {
    proof = data;
    $("loading").hidden = true;
    $("proofContent").hidden = false;
    $("projectTitle").textContent = data.projectName || "Storefront sign concept";
    const parts = [data.signTypeLabel, data.dimensionsText, data.illuminationLabel].filter(Boolean);
    $("metaLine").textContent = parts.join(" · ");
    const pill = $("statusPill");
    if (data.status === "approved") {
      pill.textContent = `Approved ${formatTimestamp(data.approvedAt)}`;
      pill.classList.add("approved");
      $("approveBtn").disabled = true;
    } else {
      pill.textContent = "Pending review";
    }
    $("imgDay").src = data.images?.day || "";
    $("imgNight").src = data.images?.night || "";
    $("nightHeading").textContent = `Night view (${data.illuminationLabel || "illuminated"})`;
    $("imgFab").src = data.images?.fab || "";
    if (data.estimate) {
      $("estimateCard").hidden = false;
      const cfg = window.ARC_SIGN_MOCKUP_PRICING;
      $("estimateLine").textContent = `$${data.estimate.low.toLocaleString()} – $${data.estimate.high.toLocaleString()} ${cfg.currency}`;
      $("estimateNote").textContent = `${data.estimate.detail}. ${cfg.estimateDisclaimer}`;
    }
    $("disclaimer").textContent = data.disclaimer || "Concept only – not a shop drawing.";
    renderComments();
  }

  async function loadProof() {
    if (!proofId) {
      $("loading").hidden = true;
      $("errorBox").hidden = false;
      $("errorBox").textContent = "Missing proof link.";
      return;
    }
    try {
      const resp = await fetch(`/api/sign-mockup/proof?id=${encodeURIComponent(proofId)}`);
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Proof not found.");
      renderProof(data);
    } catch (err) {
      $("loading").hidden = true;
      $("errorBox").hidden = false;
      $("errorBox").textContent = err.message || "Could not load proof.";
    }
  }

  async function patchProof(body) {
    const resp = await fetch(`/api/sign-mockup/proof?id=${encodeURIComponent(proofId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || "Update failed.");
    renderProof(data);
  }

  $("submitCommentBtn").addEventListener("click", async () => {
    const text = $("commentInput").value.trim();
    if (!text) return;
    $("actionStatus").hidden = false;
    $("actionStatus").textContent = "Saving comment…";
    try {
      await patchProof({ comment: text });
      $("commentInput").value = "";
      $("actionStatus").textContent = "Comment saved.";
      $("actionStatus").className = "status ok";
    } catch (err) {
      $("actionStatus").textContent = err.message;
      $("actionStatus").className = "status";
    }
  });

  $("approveBtn").addEventListener("click", async () => {
    if (!confirm("Approve this sign concept? This records a timestamp for Arc Signage Co.")) return;
    $("actionStatus").hidden = false;
    $("actionStatus").textContent = "Recording approval…";
    try {
      await patchProof({ approve: true });
      $("actionStatus").textContent = "Thank you — approval recorded.";
      $("actionStatus").className = "status ok";
    } catch (err) {
      $("actionStatus").textContent = err.message;
      $("actionStatus").className = "status";
    }
  });

  async function loadLogoDataUrl() {
    const resp = await fetch("/assets/img/logo-lockup-white-560.v2.png");
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const lc = document.createElement("canvas");
        lc.width = 280;
        lc.height = Math.round(280 * (img.naturalHeight / img.naturalWidth));
        lc.getContext("2d").drawImage(img, 0, 0, lc.width, lc.height);
        URL.revokeObjectURL(url);
        resolve(lc.toDataURL("image/png"));
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  function dataUrlFormat(url) {
    return url && url.indexOf("image/png") >= 0 ? "PNG" : "JPEG";
  }

  $("downloadPdfBtn").addEventListener("click", async () => {
    if (!proof || !window.jspdf?.jsPDF) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "letter" });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 40;
    const cfg = window.ARC_SIGN_MOCKUP_PRICING;
    const logo = await loadLogoDataUrl();
    doc.setFillColor(11, 29, 51);
    doc.rect(0, 0, pageW, 64, "F");
    doc.addImage(logo, "PNG", margin, 12, 120, 25);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("Concept approval summary", pageW - margin, 28, { align: "right" });
    doc.text(`${cfg.contact.phone}`, pageW - margin, 42, { align: "right" });

    let y = 80;
    doc.setTextColor(23, 34, 51);
    doc.setFontSize(14);
    doc.text(proof.projectName || "Storefront sign concept", margin, y);
    y += 18;
    doc.setFontSize(11);
    doc.text($("metaLine").textContent, margin, y);
    y += 14;
    if (proof.status === "approved") {
      doc.setTextColor(31, 122, 77);
      doc.text(`Approved: ${formatTimestamp(proof.approvedAt)}`, margin, y);
      y += 14;
    }
    doc.setTextColor(23, 34, 51);
    const imgW = pageW - margin * 2;
    const addImg = (dataUrl, label, maxH) => {
      return new Promise((resolve) => {
        const im = new Image();
        im.onload = () => {
          doc.setFontSize(10);
          doc.text(label, margin, y);
          y += 8;
          const aspect = im.width / im.height;
          let h = imgW / aspect;
          if (h > maxH) h = maxH;
          const w = h * aspect;
          doc.addImage(dataUrl, dataUrlFormat(dataUrl), margin, y, w, h);
          y += h + 16;
          resolve();
        };
        im.src = dataUrl;
      });
    };
    await addImg(proof.images.day, "Day view", 160);
    await addImg(proof.images.night, `Night view (${proof.illuminationLabel})`, 160);
    if (proof.estimate) {
      doc.text(
        `Preliminary estimate: $${proof.estimate.low.toLocaleString()} – $${proof.estimate.high.toLocaleString()}`,
        margin,
        y
      );
      y += 20;
    }
    doc.setFontSize(9);
    doc.setTextColor(101, 114, 135);
    doc.text(proof.disclaimer || "Concept only – not a shop drawing.", margin, y);
    doc.save(`arc-concept-approval-${proofId.slice(0, 8)}.pdf`);
  });

  loadProof();
})();
