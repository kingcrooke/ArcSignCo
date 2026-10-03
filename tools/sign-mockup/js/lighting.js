// Lighting styles the engine knows how to draw at night. Pure data (no DOM).
//
//   label  what the editor, proof page and PDF call it
//   night  one line on what the client sees after dark
//   spill  how much of the glow lands on the wall (0 = none)
//   bloom  how much soft glow surrounds the lit parts
//   floor  share of the wall light added regardless of the wall's color, so a halo still reads
//          on a near-black fascia the way it does in person (default 0.16)
//
// A category picks one of these keys per type (or per option, see lightingOf in the category
// module). Add a key here only when a new kind of light needs different spill or bloom.
export const LIGHTING = {
  face: { label: "Face-lit", night: "The faces glow; returns stay dark.", spill: 0.32, bloom: 0.5 },
  "face-sides": { label: "Face and sides lit", night: "Faces and sides glow; there is no trim cap to break the edge.", spill: 0.45, bloom: 0.6 },
  halo: { label: "Halo-lit (reverse-lit)", night: "Light washes the wall behind the letters; the faces stay dark.", spill: 0.12, bloom: 0.35, floor: 0.42 },
  "face-halo": { label: "Face + halo", night: "The faces glow and a halo washes the wall behind.", spill: 0.3, bloom: 0.5, floor: 0.32 },
  neon: { label: "Exposed LED neon", night: "The neon line itself glows, with colored spill on the wall.", spill: 0.95, bloom: 0.95 },
  internal: { label: "Internally lit", night: "The whole face glows from LEDs inside the cabinet.", spill: 0.35, bloom: 0.42 },
  "internal-letters": { label: "Internally lit (copy only)", night: "Only the push-through copy glows; the metal face stays dark.", spill: 0.3, bloom: 0.5 },
  external: { label: "External lights", night: "Gooseneck lamps wash the face from above.", spill: 0, bloom: 0.55 },
  backlit: { label: "Backlit", night: "The translucent cover glows from LEDs inside the frame, and the graphics read through it.", spill: 0.4, bloom: 0.55 },
  none: { label: "Non-lit", night: "No light of its own; it reads by street and storefront light.", spill: 0, bloom: 0 },
};

export const lightingInfo = key => LIGHTING[key] || LIGHTING.none;
