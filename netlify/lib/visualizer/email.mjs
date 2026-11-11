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
    ["SMS updates", lead.smsTransactional ? "yes" : "no"],
    ["SMS promos", lead.smsPromo ? "yes" : "no"],
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

const MAX_ATTACHMENT_BYTES = 1_500_000;

function attachmentsFromFiles(files) {
  const attachments = [];
  for (const file of files || []) {
    if (!file.bytes || file.bytes.length > MAX_ATTACHMENT_BYTES) continue;
    attachments.push({ filename: file.filename, content: Buffer.from(file.bytes).toString("base64") });
  }
  return attachments;
}

async function postResend(env, message, { attachments = [], replyTo } = {}, fetchImpl) {
  if (!env.RESEND_API_KEY) return { status: "saved-no-email-key" };
  if (!env.VISUALIZER_EMAIL_FROM) return { status: "saved-no-from-address" };
  const res = await fetchImpl("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.VISUALIZER_EMAIL_FROM,
      to: [message.to],
      subject: message.subject,
      html: message.html,
      text: message.text,
      reply_to: replyTo || undefined,
      attachments,
    }),
  });
  if (!res.ok) {
    console.error("visualizer email", res.status);
    return { status: "email-failed" };
  }
  return { status: "sent" };
}

export function renderNotifyTo(env) {
  return env.VISUALIZER_RENDER_TO || env.VISUALIZER_LEAD_TO || "arc@arcsignco.com";
}

export function renderEmail(env, render) {
  const to = renderNotifyTo(env);
  const rows = [
    ["Job", render.jobId],
    ["Session", render.sessionId],
    ["Time", render.createdAt],
    ["Category", render.category],
    ["Business", render.business?.name],
    ["Business phone", render.business?.phone],
    ["Email on file", render.business?.email],
    ["Website", render.business?.web],
    ["Tagline", render.business?.tagline],
    ["Services", render.business?.services],
    ["Brand colors", Array.isArray(render.business?.colors) ? render.business.colors.join(", ") : ""],
    ["Quote", render.quote?.label],
    ["Stub concepts", render.stub ? "yes (placeholder layout)" : "no"],
  ];
  const html = [
    "<p>New Arc Visualizer concept set (visitor has not submitted the lead form yet).</p>",
    "<table>",
    ...rows.filter(([, v]) => v).map(([k, v]) => `<tr><td>${escape(k)}</td><td>${escape(v)}</td></tr>`),
    "</table>",
    render.subject ? `<pre>${escape(JSON.stringify(render.subject, null, 2))}</pre>` : "",
    "<p>",
    ...(render.links || []).map(link => `<a href="${escape(link.url)}">${escape(link.label)}</a><br>`),
    "</p>",
    "<p>AI-generated visual reference. Concept only, not a proof or a quote.</p>",
  ].join("");
  const text = rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n")
    + "\n\n" + (render.links || []).map(l => `${l.label}: ${l.url}`).join("\n");
  const label = render.business?.name || render.sessionId?.slice(0, 8) || "new";
  return { to, subject: `Arc Visualizer concepts: ${label}`, html, text };
}

export async function sendRenderEmail(env, render, fetchImpl = fetch) {
  const message = renderEmail(env, render);
  return postResend(env, message, { attachments: attachmentsFromFiles(render.files) }, fetchImpl);
}

export async function sendLeadEmail(env, lead, fetchImpl = fetch) {
  const message = leadEmail(env, lead);
  return postResend(env, message, {
    attachments: attachmentsFromFiles(lead.files),
    replyTo: lead.email,
  }, fetchImpl);
}
