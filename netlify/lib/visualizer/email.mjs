// Lead mail to arc@. Without RESEND_API_KEY the lead is still stored and the admin list shows
// that the email was not sent.

function escape(s) {
  return String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

export function leadEmail(env, lead) {
  const to = env.VISUALIZER_LEAD_TO || "arc@arcsignco.com";
  const rows = [
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Timing", lead.timingLabel || lead.timing],
    ["Category", lead.category],
    ["Business", lead.business?.name],
    ["Business phone", lead.business?.phone],
    ["Website", lead.business?.web],
    ["Tagline", lead.business?.tagline],
    ["Services", lead.business?.services],
    ["Quote", lead.quote?.label],
    ["Quote note", lead.quote?.message],
  ];
  const html = [
    "<p>New Arc Visualizer lead.</p>",
    "<table>",
    ...rows.filter(([, v]) => v).map(([k, v]) => `<tr><td>${escape(k)}</td><td>${escape(v)}</td></tr>`),
    "</table>",
    lead.subject ? `<pre>${escape(JSON.stringify(lead.subject, null, 2))}</pre>` : "",
    "<p>",
    ...(lead.links || []).map(link => `<a href="${escape(link.url)}">${escape(link.label)}</a><br>`),
    "</p>",
    "<p>AI-generated visual reference. Concept only, not a proof or a quote.</p>",
  ].join("");
  const text = rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n")
    + "\n\n" + (lead.links || []).map(l => `${l.label}: ${l.url}`).join("\n");
  return { to, subject: `Arc Visualizer lead: ${lead.name || "new"}`, html, text };
}

export async function sendLeadEmail(env, lead, fetchImpl = fetch) {
  const message = leadEmail(env, lead);
  if (!env.RESEND_API_KEY) return { status: "saved-no-email-key" };
  if (!env.VISUALIZER_EMAIL_FROM) return { status: "saved-no-from-address" };
  const attachments = [];
  for (const file of lead.files || []) {
    if (!file.bytes || file.bytes.length > 1_500_000) continue;
    attachments.push({ filename: file.filename, content: Buffer.from(file.bytes).toString("base64") });
  }
  const res = await fetchImpl("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.VISUALIZER_EMAIL_FROM,
      to: [message.to],
      subject: message.subject,
      html: message.html,
      text: message.text,
      reply_to: lead.email || undefined,
      attachments,
    }),
  });
  if (!res.ok) {
    console.error("visualizer email", res.status);
    return { status: "email-failed" };
  }
  return { status: "sent" };
}
