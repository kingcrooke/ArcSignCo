import { formatFeetInches } from "../../geometry.js";

export const CABINET = [["black", "Black aluminum"], ["silver", "Silver aluminum"], ["custom", "Custom paint"]];
export const BRIGHT = [["indoor", "Indoor brightness"], ["window", "High-brightness window"], ["outdoor", "Outdoor rated"]];
export const MOUNT = [["wall", "Wall-mounted cabinet"], ["hung", "Hung behind glass"], ["pole", "Pole or monument"]];
export const LED_MESSAGE = [["#ffffff", "White"], ["#ffb02e", "Amber"]];

export const SIZE_CHOICES = {
  "led-message-center": [["96x48", "8' × 4'"], ["72x36", "6' × 3'"], ["48x24", "4' × 2'"]],
  "led-video-board": [["144x84", "12' × 7'"], ["120x68", "10' × 5' 8\""], ["96x54", "8' × 4' 6\""]],
  "led-window": [["48x72", "4' × 6'"], ["36x48", "3' × 4'"], ["24x36", "2' × 3'"]],
  "led-open-neon": [["36x12", "3' × 1'"], ["24x8", "2' × 8\""], ["48x10", "4' × 10\""]],
  "led-ticker": [["72x12", "6' × 1'"], ["48x8", "4' × 8\""], ["96x10", "8' × 10\""]],
};

export function parseSize(raw) {
  const m = String(raw || "").match(/^(\d+)x(\d+)$/i);
  if (!m) return null;
  const w = Number(m[1]), h = Number(m[2]);
  return w > 0 && h > 0 ? { width: w, height: h } : null;
}

export function sizeLabel(raw) {
  const s = parseSize(raw);
  if (!s) return "";
  return `${formatFeetInches(s.width)} × ${formatFeetInches(s.height)}`;
}

export function defaultLedOptions(type) {
  const sizes = SIZE_CHOICES[type.id] || [["48x24", "4' × 2'"]];
  return {
    cabinet: "black",
    bright: type.id === "led-window" ? "window" : "indoor",
    mount: type.id === "led-window" ? "hung" : "wall",
    panel: "#0b1d33",
    frame: "#24262b",
    light: type.id === "led-open-neon" ? "#eef5ff" : "#ffffff",
    size: sizes[0][0],
  };
}

export function sanitizeLedOptions(type, raw) {
  const d = defaultLedOptions(type);
  const sizes = SIZE_CHOICES[type.id] || [];
  const allowed = new Set(sizes.map(([v]) => v));
  let mount = MOUNT.some(([v]) => v === raw?.mount) ? raw.mount : d.mount;
  if (type.id === "led-window") mount = "hung";
  if (type.id === "led-open-neon") mount = "wall";
  return {
    cabinet: CABINET.some(([v]) => v === raw?.cabinet) ? raw.cabinet : d.cabinet,
    bright: BRIGHT.some(([v]) => v === raw?.bright) ? raw.bright : d.bright,
    mount: MOUNT.some(([v]) => v === mount) ? mount : d.mount,
    panel: /^#[0-9a-f]{6}$/i.test(raw?.panel || "") ? raw.panel : d.panel,
    frame: /^#[0-9a-f]{6}$/i.test(raw?.frame || "") ? raw.frame : d.frame,
    light: type.id === "led-open-neon"
      ? (/^#[0-9a-f]{6}$/i.test(raw?.light || "") ? raw.light : d.light)
      : (LED_MESSAGE.some(([v]) => v === raw?.light) ? raw.light : d.light),
    size: allowed.has(raw?.size) ? raw.size : d.size,
  };
}

const label = (list, v) => list.find(([k]) => k === v)?.[1] || v;

export function ledDetails(type, opts) {
  const o = sanitizeLedOptions(type, opts);
  return [
    ["Typical size", sizeLabel(o.size)],
    ["Cabinet", label(CABINET, o.cabinet)],
    ["Brightness", label(BRIGHT, o.bright)],
    ["Mounting", label(MOUNT, o.mount)],
    ["Electrical", "Power and data confirmed during survey"],
  ];
}

export function placeWidthIn(type, opts) {
  const s = parseSize(sanitizeLedOptions(type, opts).size);
  return s?.width ?? 72;
}

export function ledOptionFields(type, opts) {
  const o = sanitizeLedOptions(type, opts);
  const fields = [
    { key: "size", label: "Typical size", kind: "select", value: o.size, choices: SIZE_CHOICES[type.id] || [] },
    { key: "cabinet", label: "Cabinet finish", kind: "select", value: o.cabinet, choices: CABINET },
    { key: "bright", label: "Brightness", kind: "select", value: o.bright, choices: BRIGHT },
    { key: "frame", label: "Frame color", kind: "color", value: o.frame },
  ];
  if (type.id === "led-open-neon") {
    fields.push({ key: "light", label: "Light color", kind: "color", value: o.light });
  } else if (type.lighting === "internal") {
    fields.push({ key: "light", label: "Message color", kind: "select", value: o.light, choices: LED_MESSAGE });
  }
  if (type.id !== "led-window" && type.id !== "led-open-neon") {
    fields.push({ key: "mount", label: "Mounting", kind: "select", value: o.mount, choices: MOUNT });
  }
  return fields;
}
