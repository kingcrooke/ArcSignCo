// Writes the visible text of each service page to docs/copy-review/<slug>.md for copy review.
// Edit the HTML page, then re-run this so the review file matches what is published.
//
//   mkdir -p /tmp/sd-tools && (cd /tmp/sd-tools && npm i jsdom)
//   NODE_PATH=/tmp/sd-tools/node_modules node tools/export-copy.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { JSDOM } = require("jsdom");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SLUGS = ["sign-permits-shop-drawings", "ada-signs", "channel-letters", "construction-signs"];
const norm = s => s.replace(/\s+/g, " ").trim();

function inline(node) {
  let out = "";
  for (const n of node.childNodes) {
    if (n.nodeType === 3) out += n.textContent;
    else if (n.nodeType === 1) {
      const t = n.tagName.toLowerCase();
      const inner = inline(n);
      if (t === "strong" || t === "b") out += `**${norm(inner)}**`;
      else if (t === "a") out += `[${norm(inner)}](${n.getAttribute("href")})`;
      else out += inner;
    }
  }
  return norm(out);
}

function block(el, lines) {
  for (const n of el.children) {
    const t = n.tagName.toLowerCase();
    const cls = n.classList;
    if (cls.contains("crumbs")) {
      lines.push(`Breadcrumb: ${[...n.querySelectorAll("li")].map(li => norm(li.textContent)).join(" / ")}`, "");
    } else if (cls.contains("eyebrow")) {
      lines.push(`_Label: ${norm(n.textContent)}_`, "");
    } else if (/^h[1-6]$/.test(t)) {
      const level = Number(t[1]) + (el.closest("aside") ? 1 : 0);
      const suffix = n.closest("aside") && t === "h2" ? " (sidebar)" : "";
      lines.push(`${"#".repeat(level)} ${inline(n)}${suffix}`, "");
    } else if (t === "p") {
      lines.push(inline(n), "");
    } else if (cls.contains("process")) {
      for (const li of n.children) {
        lines.push(`- **${norm(li.querySelector("b").textContent)} ${norm(li.querySelector("h3").textContent)}:** ${inline(li.querySelector("p"))}`);
      }
      lines.push("");
    } else if (t === "ul" || t === "ol") {
      [...n.children].forEach((li, i) => lines.push(`${t === "ol" ? `${i + 1}.` : "-"} ${inline(li)}`));
      lines.push("");
    } else if (t === "table") {
      const rows = [...n.querySelectorAll("tr")].map(tr => [...tr.children].map(c => inline(c).replace(/\|/g, "\\|")));
      lines.push(`| ${rows[0].join(" | ")} |`, `| ${rows[0].map(() => "---").join(" | ")} |`);
      rows.slice(1).forEach(r => lines.push(`| ${r.join(" | ")} |`));
      lines.push("");
    } else if (t === "a" && cls.contains("btn")) {
      lines.push(`[Button: ${norm(n.textContent)}](${n.getAttribute("href")})`, "");
    } else if (cls.contains("related")) {
      for (const a of n.querySelectorAll("a")) {
        lines.push(`- [${norm(a.querySelector("strong").textContent)}](${a.getAttribute("href")}): ${norm(a.querySelector("span").textContent)}`);
      }
      lines.push("");
    } else if (t === "figure") {
      const img = n.querySelector("img");
      lines.push(`[Image, alt text: "${img.getAttribute("alt")}"]`, "", `Caption: ${norm(n.querySelector("figcaption").textContent)}`, "");
    } else if (cls.contains("contact-links")) {
      lines.push(...[...n.querySelectorAll("a")].flatMap(a => [`[Link: ${norm(a.textContent)}](${a.getAttribute("href")})`, ""]));
    } else if (cls.contains("hero-actions")) {
      lines.push(...[...n.querySelectorAll("a")].flatMap(a => [`[Button: ${norm(a.textContent)}](${a.getAttribute("href")})`, ""]));
    } else {
      block(n, lines);
    }
  }
}

fs.mkdirSync(path.join(root, "docs/copy-review"), { recursive: true });
for (const slug of SLUGS) {
  const html = fs.readFileSync(path.join(root, slug, "index.html"), "utf8");
  const { document } = new JSDOM(html).window;
  const lines = [
    `# Copy review: /${slug}/`,
    "",
    "**Status: draft.** Pending Sales Ops and copy editor review, and Jesus's OK. The URL slug is also a proposal pending Jesus's approval.",
    "",
    `Generated from \`${slug}/index.html\` by \`tools/export-copy.mjs\`. This is every piece of visible text on the page, in order (the shared header and footer are listed once in \`README.md\` of this folder). To change wording, edit the HTML page and re-run the script. FAQ text is also in the page's \`FAQPage\` JSON-LD and must stay word-for-word identical; \`tools/check-service-pages.mjs\` verifies that.`,
    "",
    "## Search and social snippets",
    "",
    `- Proposed URL: https://arcsignco.com/${slug}/`,
    `- Title tag: ${document.title}`,
    `- Meta description: ${document.querySelector('meta[name="description"]').content}`,
    `- Social share title: ${document.querySelector('meta[property="og:title"]').content}`,
    `- Social share description: ${document.querySelector('meta[property="og:description"]').content}`,
    "",
    "## Page text",
    "",
  ];
  block(document.querySelector("main"), lines);
  const out = lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
  fs.writeFileSync(path.join(root, "docs/copy-review", `${slug}.md`), out);
  console.log(`wrote docs/copy-review/${slug}.md`);
}
