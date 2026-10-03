import { formatFeetInches } from "../../geometry.js";

export const MATERIAL = [["alum", "Brushed aluminum"], ["acm", "Painted ACM"], ["acrylic", "Clear acrylic insert"]];
export const FINISH = [["matte", "Matte"], ["satin", "Satin"], ["gloss", "Gloss"]];
export const MOUNT = [["standoff", "Standoffs"], ["flush", "Flush to wall"], ["project", "Projecting bracket"]];

export const SIZE_CHOICES = {
  "wf-lobby": [["72x24", "6' × 2'"], ["48x18", "4' × 1' 6\""], ["36x12", "3' × 1'"]],
  "wf-directory": [["36x48", "3' × 4'"], ["30x40", "30\" × 40\""], ["24x36", "2' × 3'"]],
  "wf-directional": [["18x6", "18\" × 6\""], ["24x8", "24\" × 8\""], ["12x4", "12\" × 4\""]],
  "wf-floor-id": [["24x24", "24\" × 24\""], ["18x18", "18\" × 18\""], ["36x12", "3' × 1'"]],
  "wf-elevator": [["12x18", "12\" × 18\""], ["10x14", "10\" × 14\""], ["8x12", "8\" × 12\""]],
  "wf-room-id": [["10x4", "10\" × 4\""], ["12x4", "12\" × 4\""], ["8x3", "8\" × 3\""]],
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

export function defaultWayfindingOptions(type) {
  const sizes = SIZE_CHOICES[type.id] || [["24x12", "2' × 1'"]];
  return {
    material: "alum",
    finish: "satin",
    mount: type.render?.standoffs ? "standoff" : "flush",
    panel: "#f4f6f8",
    frame: "#24262b",
    size: sizes[0][0],
  };
}

export function sanitizeWayfindingOptions(type, raw) {
  const d = defaultWayfindingOptions(type);
  const sizes = SIZE_CHOICES[type.id] || [];
  const allowed = new Set(sizes.map(([v]) => v));
  let mount = MOUNT.some(([v]) => v === raw?.mount) ? raw.mount : d.mount;
  if (type.render?.standoffs) mount = "standoff";
  if (type.id === "wf-directional" && mount === "standoff") mount = "flush";
  return {
    material: MATERIAL.some(([v]) => v === raw?.material) ? raw.material : d.material,
    finish: FINISH.some(([v]) => v === raw?.finish) ? raw.finish : d.finish,
    mount: MOUNT.some(([v]) => v === mount) ? mount : d.mount,
    panel: /^#[0-9a-f]{6}$/i.test(raw?.panel || "") ? raw.panel : d.panel,
    frame: /^#[0-9a-f]{6}$/i.test(raw?.frame || "") ? raw.frame : d.frame,
    size: allowed.has(raw?.size) ? raw.size : d.size,
  };
}

const label = (list, v) => list.find(([k]) => k === v)?.[1] || v;

export function wayfindingDetails(type, opts) {
  const o = sanitizeWayfindingOptions(type, opts);
  const rows = [
    ["Typical size", sizeLabel(o.size)],
    ["Material", label(MATERIAL, o.material)],
    ["Finish", label(FINISH, o.finish)],
    ["Mounting", label(MOUNT, o.mount)],
  ];
  if (type.render.kind === "cabinet") rows.push(["Frame", "Aluminum directory frame"]);
  return rows;
}

export function placeWidthIn(type, opts) {
  const s = parseSize(sanitizeWayfindingOptions(type, opts).size);
  return s?.width ?? 10;
}

export function wayfindingOptionFields(type, opts) {
  const o = sanitizeWayfindingOptions(type, opts);
  const fields = [
    { key: "size", label: "Typical size", kind: "select", value: o.size, choices: SIZE_CHOICES[type.id] || [] },
    { key: "material", label: "Material", kind: "select", value: o.material, choices: MATERIAL },
    { key: "finish", label: "Finish", kind: "select", value: o.finish, choices: FINISH },
    { key: "panel", label: "Face color", kind: "color", value: o.panel },
  ];
  if (type.render.kind === "cabinet") fields.push({ key: "frame", label: "Frame color", kind: "color", value: o.frame });
  if (!type.render?.standoffs) {
    fields.push({ key: "mount", label: "Mounting", kind: "select", value: o.mount, choices: MOUNT.filter(([k]) => k !== "standoff") });
  }
  return fields;
}
