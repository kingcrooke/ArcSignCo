import { formatFeetInches } from "../../geometry.js";

export const FINISHES = [["matte", "Matte"], ["gloss", "Gloss"], ["laminate", "Gloss laminate"]];
export const MATERIALS = [["cast", "Cast vinyl"], ["cal", "Calendared vinyl"]];
export const MOUNTS = [["outside", "Outside face"], ["inside", "Inside face (reverse read)"]];
export const FROST = [["etched", "Etched-look"], ["dot", "Dot pattern"], ["band", "Horizontal band"]];

/** [value, label] size presets: value is WxH in inches joined by x */
export const SIZE_CHOICES = {
  "vinyl-window-lettering": [["120x18", "10' × 1' 6\" line"], ["96x24", "8' × 2'"], ["48x12", "4' × 1'"]],
  "vinyl-window-perf": [["96x60", "8' × 5' window"], ["72x48", "6' × 4'"], ["48x36", "4' × 3'"]],
  "vinyl-frosted": [["36x48", "3' × 4' door"], ["24x72", "2' × 6' sidelite"], ["48x24", "4' × 2' band"]],
  "vinyl-wall-mural": [["240x120", "20' × 10' feature"], ["144x96", "12' × 8'"], ["96x48", "8' × 4'"]],
  "vinyl-glass-decal": [["24x24", "2' × 2'"], ["18x18", "18\" × 18\""], ["12x12", "12\" × 12\""]],
  "vinyl-door-hours": [["12x18", "12\" × 18\""], ["10x14", "10\" × 14\""], ["8x12", "8\" × 12\""]],
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

export function defaultVinylOptions(type) {
  const sizes = SIZE_CHOICES[type.id] || [["48x24", "4' × 2'"]];
  return {
    finish: "matte",
    material: "cast",
    mount: "outside",
    frost: "etched",
    panel: "#ffffff",
    size: sizes[0][0],
  };
}

export function sanitizeVinylOptions(type, raw) {
  const d = defaultVinylOptions(type);
  const sizes = SIZE_CHOICES[type.id] || [];
  const allowed = new Set(sizes.map(([v]) => v));
  return {
    finish: FINISHES.some(([v]) => v === raw?.finish) ? raw.finish : d.finish,
    material: MATERIALS.some(([v]) => v === raw?.material) ? raw.material : d.material,
    mount: MOUNTS.some(([v]) => v === raw?.mount) ? raw.mount : d.mount,
    frost: FROST.some(([v]) => v === raw?.frost) ? raw.frost : d.frost,
    panel: /^#[0-9a-f]{6}$/i.test(raw?.panel || "") ? raw.panel : d.panel,
    size: allowed.has(raw?.size) ? raw.size : d.size,
  };
}

const finishLabel = v => FINISHES.find(([k]) => k === v)?.[1] || v;
const materialLabel = v => MATERIALS.find(([k]) => k === v)?.[1] || v;
const mountLabel = v => MOUNTS.find(([k]) => k === v)?.[1] || v;
const frostLabel = v => FROST.find(([k]) => k === v)?.[1] || v;

export function vinylDetails(type, opts) {
  const o = sanitizeVinylOptions(type, opts);
  const rows = [
    ["Typical size", sizeLabel(o.size)],
    ["Finish", finishLabel(o.finish)],
    ["Material", materialLabel(o.material)],
  ];
  if (type.render.surface === "glass") rows.push(["Mounting", mountLabel(o.mount)]);
  if (type.id === "vinyl-frosted") rows.push(["Film style", frostLabel(o.frost)]);
  if (type.id === "vinyl-window-perf") rows[2] = ["Material", "Perforated window film"];
  return rows;
}

export function vinylOptionFields(type, opts) {
  const o = sanitizeVinylOptions(type, opts);
  const fields = [
    { key: "size", label: "Typical size", kind: "select", value: o.size, choices: SIZE_CHOICES[type.id] || [] },
    { key: "finish", label: "Finish", kind: "select", value: o.finish, choices: FINISHES },
    { key: "material", label: "Material", kind: "select", value: o.material, choices: MATERIALS, refresh: type.id !== "vinyl-window-perf" },
  ];
  if (type.render.surface === "glass" && type.id !== "vinyl-wall-mural") {
    fields.push({ key: "mount", label: "Mounting", kind: "select", value: o.mount, choices: MOUNTS });
  }
  if (type.id === "vinyl-frosted") {
    fields.push({ key: "frost", label: "Film style", kind: "select", value: o.frost, choices: FROST });
  }
  if (type.id === "vinyl-window-perf") {
    fields.splice(2, 1);
    fields.push({ key: "panel", label: "Print background", kind: "color", value: o.panel });
  }
  return fields;
}
