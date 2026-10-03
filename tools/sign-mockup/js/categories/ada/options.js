import { formatFeetInches } from "../../geometry.js";

export const MATERIAL = [["acrylic", "Photopolymer / acrylic"], ["metal", "Brushed aluminum"]];
export const FINISH = [["matte", "Matte"], ["satin", "Satin"]];
export const MOUNT = [["standoff", "Standoffs beside door"], ["adhesive", "Adhesive / stud"]];
export const EXIT_FACE = [["red", "Red exit"], ["green", "Green exit"]];

export const SIZE_CHOICES = {
  "ada-room": [["9x6", "9\" × 6\""], ["8x5", "8\" × 5\""], ["10x7", "10\" × 7\""]],
  "ada-restroom": [["9x6", "9\" × 6\""], ["8x8", "8\" × 8\""], ["10x7", "10\" × 7\""]],
  "ada-stair": [["12x8", "12\" × 8\""], ["10x7", "10\" × 7\""], ["8x6", "8\" × 6\""]],
  "ada-exit": [["12x8", "12\" × 8\""], ["18x10", "18\" × 10\""], ["24x12", "24\" × 12\""]],
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

export function defaultAdaOptions(type) {
  const sizes = SIZE_CHOICES[type.id] || [["8x6", "8\" × 6\""]];
  return {
    material: "acrylic",
    finish: "matte",
    mount: "standoff",
    exitFace: "red",
    panel: type.id === "ada-exit" ? "#cc2a2a" : "#f4f6f8",
    frame: "#24262b",
    size: sizes[0][0],
  };
}

export function sanitizeAdaOptions(type, raw) {
  const d = defaultAdaOptions(type);
  const sizes = SIZE_CHOICES[type.id] || [];
  const allowed = new Set(sizes.map(([v]) => v));
  let panel = /^#[0-9a-f]{6}$/i.test(raw?.panel || "") ? raw.panel : d.panel;
  if (type.id === "ada-exit" && raw?.exitFace === "green") panel = "#1a7a3a";
  if (type.id === "ada-exit" && raw?.exitFace === "red") panel = "#cc2a2a";
  return {
    material: MATERIAL.some(([v]) => v === raw?.material) ? raw.material : d.material,
    finish: FINISH.some(([v]) => v === raw?.finish) ? raw.finish : d.finish,
    mount: MOUNT.some(([v]) => v === raw?.mount) ? raw.mount : d.mount,
    exitFace: EXIT_FACE.some(([v]) => v === raw?.exitFace) ? raw.exitFace : d.exitFace,
    panel,
    frame: /^#[0-9a-f]{6}$/i.test(raw?.frame || "") ? raw.frame : d.frame,
    size: allowed.has(raw?.size) ? raw.size : d.size,
  };
}

const label = (list, v) => list.find(([k]) => k === v)?.[1] || v;

export function adaDetails(type, opts) {
  const o = sanitizeAdaOptions(type, opts);
  const rows = [
    ["Typical size", sizeLabel(o.size)],
    ["Material", label(MATERIAL, o.material)],
    ["Finish", label(FINISH, o.finish)],
    ["Mounting", label(MOUNT, o.mount)],
    ["Layout", "Preview only; shop drawings confirm spacing"],
  ];
  if (type.id === "ada-exit") rows.push(["Exit style", label(EXIT_FACE, o.exitFace)]);
  return rows;
}

export function adaOptionFields(type, opts) {
  const o = sanitizeAdaOptions(type, opts);
  const fields = [
    { key: "size", label: "Typical size", kind: "select", value: o.size, choices: SIZE_CHOICES[type.id] || [] },
    { key: "material", label: "Material", kind: "select", value: o.material, choices: MATERIAL },
    { key: "finish", label: "Finish", kind: "select", value: o.finish, choices: FINISH },
    { key: "mount", label: "Mounting", kind: "select", value: o.mount, choices: MOUNT },
    { key: "panel", label: type.id === "ada-exit" ? "Face color" : "Plaque color", kind: "color", value: o.panel },
  ];
  if (type.id === "ada-exit") {
    fields.push({ key: "exitFace", label: "Exit style", kind: "select", value: o.exitFace, choices: EXIT_FACE, refresh: true });
    fields.push({ key: "frame", label: "Cabinet color", kind: "color", value: o.frame });
  }
  return fields;
}
