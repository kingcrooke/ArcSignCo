// Local preview of /visualize and /api/visualize without Netlify.
//   VISUALIZER_ADMIN_PASSWORD=local node tools/visualizer-server.mjs
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handleVisualizer, ENV_KEYS } from "../netlify/lib/visualizer/handle.mjs";
import { memoryBlobs, memoryRecords } from "../netlify/lib/visualizer/records.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const records = memoryRecords();
const blobs = memoryBlobs();
const env = Object.fromEntries(ENV_KEYS.map(key => [key, process.env[key] || ""]));
env.NETLIFY_DB_URL = env.NETLIFY_DB_URL || "memory";

const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".json": "application/json" };

function fileFor(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const rel = decoded.replace(/^\/+/, "");
  const full = path.normalize(path.join(root, rel));
  if (!full.startsWith(root)) return null;
  if (fs.existsSync(full) && fs.statSync(full).isDirectory()) return path.join(full, "index.html");
  if (fs.existsSync(full) && fs.statSync(full).isFile()) return full;
  const html = path.join(root, rel, "index.html");
  if (fs.existsSync(html)) return html;
  return null;
}

export function start(port = 4173) {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    if (url.pathname.startsWith("/api/visualize")) {
      try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const incoming = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (["host", "connection", "content-length", "transfer-encoding"].includes(key)) continue;
        if (Array.isArray(value)) value.forEach(item => incoming.append(key, item));
        else if (value) incoming.set(key, value);
      }
      const request = new Request(url, { method: req.method, headers: incoming, body: req.method === "GET" || req.method === "HEAD" ? undefined : Buffer.concat(chunks) });
      const response = await handleVisualizer(request, { blobs, records, env, deployContext: "dev", ip: req.socket.remoteAddress || "127.0.0.1" });
      const outgoing = Object.fromEntries([...response.headers.entries()].filter(([key]) => key !== "set-cookie"));
      const cookies = response.headers.getSetCookie?.() || [];
      if (cookies.length) outgoing["set-cookie"] = cookies;
      res.writeHead(response.status, outgoing);
      res.end(Buffer.from(await response.arrayBuffer()));
      } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Something went wrong. Try again." }));
      }
      return;
    }
    const file = fileFor(url.pathname);
    if (!file) { res.writeHead(404); res.end("Not found"); return; }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(fs.readFileSync(file));
  });
  return new Promise(resolve => server.listen(port, "127.0.0.1", () => resolve(server)));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4173);
  start(port).then(() => console.log(`http://127.0.0.1:${port}/visualize/`));
}
