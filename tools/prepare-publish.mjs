// Copies the static site to _site without dependencies, function source, or package files.
// Netlify publishes _site. Functions are bundled from netlify/functions separately.
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dest = path.join(root, "_site");
const skip = new Set([
  ".git",
  ".netlify",
  ".github",
  "node_modules",
  "_site",
  "netlify",
]);
const skipFiles = new Set(["package.json", "package-lock.json"]);

fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest);

for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (entry.name.startsWith(".")) continue;
  if (skip.has(entry.name)) continue;
  if (entry.isFile() && skipFiles.has(entry.name)) continue;
  const from = path.join(root, entry.name);
  const to = path.join(dest, entry.name);
  fs.cpSync(from, to, {
    recursive: true,
    filter: (src) => !src.split(path.sep).includes("node_modules"),
  });
}

if (!fs.existsSync(path.join(dest, "index.html"))) {
  throw new Error("prepare-publish did not copy index.html");
}
if (!fs.existsSync(path.join(dest, "tools", "sign-mockup", "index.html"))) {
  throw new Error("prepare-publish did not copy the sign mockup");
}
