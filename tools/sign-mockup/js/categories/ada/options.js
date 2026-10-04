import { formatFeetInches } from "../../geometry.js";

export const MATERIAL = [["acrylic", "Photopolymer / acrylic"], ["metal", "Brushed aluminum"]];
export const FINISH = [["matte", "Matte"], ["satin", "Satin"]];
export const MOUNT = [["standoff", "Standoffs beside door"], ["adhesive", "Adhesive / stud"]];

export const SIZE_CHOICES = {
  "ada-room": [["9x6", "9\" × 6\""], ["8x5", "8\" × 5\""], ["10x7", "10\" × 7\""]],
  "ada-restroom": [["10x12", "10\" × 12\" (6\" pictogram field)"], ["9x10", "9\" × 10\""], ["12x14", "12\" × 14\""]],
  "ada-stair": [["18x12", "18\" × 12\" floor ID (min)"], ["20x14", "20\" × 14\""], ["24x18", "24\" × 18\""]],
  "ada-exit-tactile": [["9x6", "9\" × 6\" tactile EXIT"], ["8x5", "8\" × 5\""], ["10x7", "10\" × 7\""]],
  "ada-exit": [["18x6", "18\" × 6\" illuminated (6\" letters min)"], ["24x8", "24\" × 8\" (Group A / R-1)"], ["30x10", "30\" × 10\""]],
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
    panel: type.id === "ada-exit" ? "#cc2a2a" : "#f4f6f8",
    frame: "#24262b",
    size: sizes[0][0],
  };
}

export function sanitizeAdaOptions(type, raw) {
  const d = defaultAdaOptions(type);
  const sizes = SIZE_CHOICES[type.id] || [];
  const allowed = new Set(sizes.map(([v]) => v));
  return {
    material: MATERIAL.some(([v]) => v === raw?.material) ? raw.material : d.material,
    finish: FINISH.some(([v]) => v === raw?.finish) ? raw.finish : d.finish,
    mount: MOUNT.some(([v]) => v === raw?.mount) ? raw.mount : d.mount,
    panel: /^#[0-9a-f]{6}$/i.test(raw?.panel || "") ? raw.panel : d.panel,
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
  if (type.id === "ada-exit") rows.push(["Illumination", "Red letters, UL 924, always on, 90-min emergency power"]);
  if (type.id === "ada-exit-tactile") rows.push(["Type", "Tactile EXIT (BC 1013.4), not the illuminated exit"]);
  if (type.id !== "ada-exit") rows.push(["Mount height", "Baseline 48 in min, 60 in max (latch side)"]);
  return rows;
}

export function placeWidthIn(type, opts) {
  const s = parseSize(sanitizeAdaOptions(type, opts).size);
  return s?.width ?? 9;
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
    fields.push({ key: "frame", label: "Cabinet color", kind: "color", value: o.frame });
  }
  return fields;
}
