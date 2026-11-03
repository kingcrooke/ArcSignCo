// Small PNG codec so tests and the no-key placeholder can run without a native image library.
import { deflateSync, inflateSync } from "node:zlib";

const SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const body = Buffer.isBuffer(data) ? data : Buffer.from(data);
  const out = Buffer.alloc(12 + body.length);
  out.writeUInt32BE(body.length, 0);
  out.write(type, 4, 4, "ascii");
  body.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + body.length)), 8 + body.length);
  return out;
}

export function isPng(bytes) {
  return bytes && bytes.length > 8 && bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71;
}

export function encodePng(width, height, rgba) {
  const w = width | 0, h = height | 0;
  if (w < 1 || h < 1 || rgba.length < w * h * 4) throw new Error("png size");
  const stride = w * 4;
  const raw = Buffer.alloc((stride + 1) * h);
  for (let y = 0; y < h; y++) {
    const at = y * (stride + 1);
    raw[at] = 0;
    for (let i = 0; i < stride; i++) raw[at + 1 + i] = rgba[y * stride + i];
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([SIG, chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function unfilter(raw, height, stride) {
  const bpp = 4;
  const out = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const src = y * (stride + 1) + 1;
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;
    const dst = out.subarray(y * stride, (y + 1) * stride);
    if (filter === 0) {
      raw.copy(dst, 0, src, src + stride);
      continue;
    }
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? dst[i - bpp] : 0;
      const b = prev ? prev[i] : 0;
      const c = prev && i >= bpp ? prev[i - bpp] : 0;
      const x = raw[src + i];
      let v = x;
      if (filter === 1) v = x + a;
      else if (filter === 2) v = x + b;
      else if (filter === 3) v = x + Math.floor((a + b) / 2);
      else if (filter === 4) v = x + paeth(a, b, c);
      else throw new Error("unsupported png filter");
      dst[i] = v & 255;
    }
  }
  return out;
}

export function decodePng(bytes) {
  const buf = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
  if (!isPng(buf)) throw new Error("not a png");
  let off = 8;
  let width = 0, height = 0, color = 6, interlace = 0;
  const idat = [];
  while (off + 8 <= buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString("ascii", off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    off += 12 + len;
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      if (data[8] !== 8) throw new Error("png bit depth");
      color = data[9];
      interlace = data[12];
    } else if (type === "IDAT") idat.push(data);
    else if (type === "IEND") break;
  }
  if (!width || !height || interlace) throw new Error("png layout");
  const raw = inflateSync(Buffer.concat(idat));
  if (color === 6) {
    const stride = width * 4;
    if (raw.length < (stride + 1) * height) throw new Error("png data");
    const rgba = unfilter(raw, height, stride);
    const data = new Uint8ClampedArray(rgba.length);
    data.set(rgba);
    return { width, height, data };
  }
  if (color === 2) {
    const stride = width * 3;
    const rgb = unfilter(raw, height, stride);
    const data = new Uint8ClampedArray(width * height * 4);
    for (let i = 0, j = 0; i < rgb.length; i += 3, j += 4) {
      data[j] = rgb[i]; data[j + 1] = rgb[i + 1]; data[j + 2] = rgb[i + 2]; data[j + 3] = 255;
    }
    return { width, height, data };
  }
  throw new Error("png color");
}
