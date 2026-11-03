// Public-page fetch for the business step. Blocks private and link-local addresses (SSRF).

const PRIVATE_V4 = [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.168.0.0", 16],
  ["100.64.0.0", 10],
];

function ipToInt(ip) {
  const p = ip.split(".").map(n => Number(n));
  if (p.length !== 4 || p.some(n => !Number.isInteger(n) || n < 0 || n > 255)) return null;
  return ((p[0] << 24) >>> 0) + (p[1] << 16) + (p[2] << 8) + p[3];
}

export function isPrivateAddress(address) {
  const ip = String(address || "").toLowerCase().replace(/^\[|\]$/g, "");
  if (ip.includes(":") && (ip === "::1" || ip.startsWith("fe80:") || ip.startsWith("fc") || ip.startsWith("fd"))) return true;
  const mapped = ip.startsWith("::ffff:") ? ip.slice(7) : ip;
  const n = ipToInt(mapped);
  if (n == null) return false;
  return PRIVATE_V4.some(([base, bits]) => {
    const b = ipToInt(base);
    const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
    return (n & mask) === (b & mask);
  });
}

function weirdIPv4(host) {
  if (!/^\d+$/.test(host)) return null;
  const n = Number(host);
  if (!Number.isSafeInteger(n) || n < 0 || n > 0xffffffff) return null;
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}

export async function assertPublicUrl(raw, resolve) {
  let url;
  try { url = new URL(raw); } catch { throw Object.assign(new Error("Enter a full website address."), { status: 400 }); }
  if (url.protocol !== "http:" && url.protocol !== "https:") throw Object.assign(new Error("Use an http or https address."), { status: 400 });
  if (url.username || url.password) throw Object.assign(new Error("That address is not allowed."), { status: 400 });
  const host = url.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (!host || host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
    throw Object.assign(new Error("That address is not allowed."), { status: 400 });
  }
  const literal = weirdIPv4(host) || host;
  const candidates = [literal];
  if (resolve && !/^\d+\.\d+\.\d+\.\d+$/.test(literal)) {
    const found = await resolve(host);
    for (const row of found || []) candidates.push(row.address || row);
  }
  if (candidates.some(isPrivateAddress)) throw Object.assign(new Error("That address is not allowed."), { status: 400 });
  return url;
}

function meta(html, key) {
  const re = new RegExp(`<meta[^>]+(?:name|property)=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i");
  const alt = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${key}["'][^>]*>`, "i");
  return (html.match(re) || html.match(alt) || [])[1] || "";
}

function decode(s) {
  return String(s || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractBusiness(html, pageUrl) {
  const title = decode((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "");
  const named = decode(meta(html, "og:site_name") || meta(html, "og:title") || title.split(/\s+[|–—-]\s+/)[0]);
  const phones = [...html.matchAll(/tel:([^"'<\s]+)/gi)].map(m => decodeURIComponent(m[1]).slice(0, 40));
  const emails = [...html.matchAll(/mailto:([^"'?\s]+)/gi)].map(m => m[1].slice(0, 160));
  const color = meta(html, "theme-color");
  let logo = meta(html, "og:image");
  if (logo && pageUrl) {
    try { logo = new URL(logo, pageUrl).href; } catch { logo = ""; }
  }
  return {
    name: named.slice(0, 120),
    phone: phones[0] || "",
    email: emails.find(e => e.includes("@")) || "",
    services: [],
    brand_colors: /^#[0-9a-fA-F]{6}$/.test(color) ? [color.toLowerCase()] : [],
    tagline: decode(meta(html, "description")).slice(0, 180),
    logo_url: logo || "",
  };
}

export function pageText(html) {
  return decode(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")).slice(0, 8000);
}

export async function readCapped(res, max) {
  if (!res.body || !res.body.getReader) {
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > max) throw Object.assign(new Error("That page is too large to scan."), { status: 413 });
    return buf;
  }
  const reader = res.body.getReader();
  const chunks = [];
  let n = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    n += value.byteLength;
    if (n > max) throw Object.assign(new Error("That page is too large to scan."), { status: 413 });
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks);
}

export async function fetchPublic(raw, { fetchImpl, resolve, timeoutMs = 8000, maxBytes = 800_000 }) {
  let current = await assertPublicUrl(raw, resolve);
  for (let hop = 0; hop < 3; hop++) {
    const res = await fetchImpl(current.href, {
      redirect: "manual",
      headers: { "User-Agent": "ArcVisualizer/1.0", Accept: "text/html,image/*;q=0.8" },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) throw Object.assign(new Error("The website did not respond."), { status: 502 });
      current = await assertPublicUrl(new URL(loc, current).href, resolve);
      continue;
    }
    if (!res.ok) throw Object.assign(new Error("The website did not respond."), { status: 502 });
    const buf = await readCapped(res, maxBytes);
    return { url: current.href, status: res.status, headers: res.headers, body: buf };
  }
  throw Object.assign(new Error("The website redirected too many times."), { status: 502 });
}
