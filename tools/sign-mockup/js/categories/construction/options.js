import { formatFeetInches } from "../../geometry.js";

export const BOARD = [["acm", "Aluminum composite (ACM)"], ["alum", "Aluminum sheet"], ["banner", "Banner / scrim"]];
export const FINISH = [["matte", "Matte laminate"], ["gloss", "Gloss laminate"]];
export const MOUNT = [["flush", "Flush to surface"], ["standoff", "Standoffs"], ["grommet", "Grommets / ties"]];

const BC_WARN = "NYC BC §3301.9.7 generally prohibits other signs on construction fences and sidewalk sheds unless the code or another law allows them. Confirm with DOB before ordering.";

export const SIZE_CHOICES = {
  "constr-site-board": [["96x48", "8' × 4' site board"], ["120x60", "10' × 5'"], ["72x48", "6' × 4'"]],
  "constr-project-panel": [
    ["72x48", "6' × 4' fence panel (standard)"],
    ["28x48", "2' 4\" × 4' (demolition)"],
    ["55x36.5", "55\" × 36.5\" (frontage under 60 ft)"],
  ],
  "constr-shed-parapet": [["36x72", "3' × 6' parapet panel"], ["180x30", "15' × 2' 6\" run"], ["120x24", "10' × 2'"]],
  "constr-fence-wrap": [["120x48", "10' × 4' wrap"], ["96x36", "8' × 3'"]],
  "constr-safety-sign": [["18x24", "18\" × 24\""], ["12x18", "12\" × 18\""], ["24x24", "24\" × 24\""]],
  "constr-permit-board": [["24x36", "2' × 3'"], ["18x24", "18\" × 24\""], ["30x40", "30\" × 40\""]],
};

export function parseSize(raw) {
  const m = String(raw || "").match(/^(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)$/i);
  if (!m) return null;
  const w = Number(m[1]), h = Number(m[2]);
  return w > 0 && h > 0 ? { width: w, height: h } : null;
}

export function sizeLabel(raw) {
  const s = parseSize(raw);
  if (!s) return "";
  return `${formatFeetInches(s.width)} × ${formatFeetInches(s.height)}`;
}

export function defaultConstructionOptions(type) {
  const sizes = SIZE_CHOICES[type.id] || [["48x24", "4' × 2'"]];
  const isFencePanel = type.id === "constr-project-panel";
  const isShed = type.id === "constr-shed-parapet";
  return {
    board: type.id === "constr-fence-wrap" ? "banner" : "acm",
    finish: "matte",
    mount: isFencePanel || type.id === "constr-shed-parapet" ? "flush" : (type.render?.standoffs ? "standoff" : (type.id === "constr-fence-wrap" ? "grommet" : "flush")),
    panel: isFencePanel || isShed ? "#0f2b54" : "#f4f6f8",
    size: sizes[0][0],
    bottomAff: isFencePanel ? "48" : "",
  };
}

export function sanitizeConstructionOptions(type, raw) {
  const d = defaultConstructionOptions(type);
  const sizes = SIZE_CHOICES[type.id] || [];
  const allowed = new Set(sizes.map(([v]) => v));
  let mount = MOUNT.some(([v]) => v === raw?.mount) ? raw.mount : d.mount;
  if (type.id === "constr-fence-wrap") mount = "grommet";
  if (type.id === "constr-project-panel" || type.id === "constr-shed-parapet") mount = "flush";
  if (type.render?.standoffs && type.id === "constr-permit-board") mount = "standoff";
  if (type.id === "constr-site-board" || type.id === "constr-safety-sign") mount = mount === "standoff" ? "flush" : mount;
  return {
    board: BOARD.some(([v]) => v === raw?.board) ? raw.board : d.board,
    finish: FINISH.some(([v]) => v === raw?.finish) ? raw.finish : d.finish,
    mount: MOUNT.some(([v]) => v === mount) ? mount : d.mount,
    panel: /^#[0-9a-f]{6}$/i.test(raw?.panel || "") ? raw.panel : d.panel,
    size: allowed.has(raw?.size) ? raw.size : d.size,
    bottomAff: type.id === "constr-project-panel" && /^\d{2}$/.test(String(raw?.bottomAff || "")) ? raw.bottomAff : d.bottomAff,
  };
}

const label = (list, v) => list.find(([k]) => k === v)?.[1] || v;

export function constructionDetails(type, opts) {
  const o = sanitizeConstructionOptions(type, opts);
  const rows = [
    ["Typical size", sizeLabel(o.size)],
    ["Board", label(BOARD, o.board)],
    ["Finish", label(FINISH, o.finish)],
    ["Mounting", label(MOUNT, o.mount)],
  ];
  if (type.id === "constr-project-panel" && o.bottomAff) rows.push(["Bottom edge", `${o.bottomAff}" above ground (typical)`]);
  if (type.id === "constr-project-panel" || type.id === "constr-shed-parapet") rows.push(["Colors", "White lettering on Pantone 296 blue (#0f2b54)"]);
  return rows;
}

export function placeWidthIn(type, opts) {
  const s = parseSize(sanitizeConstructionOptions(type, opts).size);
  return s?.width ?? 96;
}

export function constructionWarnings(type) {
  if (type.id === "constr-site-board" || type.id === "constr-fence-wrap") {
    return [{ text: BC_WARN, over: true }];
  }
  return [];
}

export function constructionOptionFields(type, opts) {
  const o = sanitizeConstructionOptions(type, opts);
  const fields = [
    { key: "size", label: "Typical size", kind: "select", value: o.size, choices: SIZE_CHOICES[type.id] || [] },
    { key: "board", label: "Board / material", kind: "select", value: o.board, choices: type.id === "constr-fence-wrap" ? [["banner", "Banner / scrim"]] : BOARD.filter(([k]) => k !== "banner") },
    { key: "finish", label: "Face finish", kind: "select", value: o.finish, choices: FINISH },
    { key: "panel", label: "Face color", kind: "color", value: o.panel },
  ];
  if (type.id === "constr-project-panel") {
    fields.push({ key: "bottomAff", label: "Bottom edge above ground", kind: "select", value: o.bottomAff || "48", choices: [["48", "4 ft (typical)"], ["52", "4 ft 4 in"], ["56", "4 ft 8 in"]] });
  }
  if (!type.render?.standoffs && type.id !== "constr-fence-wrap" && type.id !== "constr-project-panel" && type.id !== "constr-shed-parapet") {
    fields.push({ key: "mount", label: "Mounting", kind: "select", value: o.mount, choices: MOUNT.filter(([k]) => k !== "standoff") });
  }
  return fields;
}
