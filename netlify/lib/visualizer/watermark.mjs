// "ARC SIGN CO · CONCEPT ONLY" in the corner of every stored preview.
// Skips pixels inside the logo box so a 1:1 paste stays byte-identical.

const FONT = {
  A: ["01110", "10001", "11111", "10001", "10001"],
  C: ["01111", "10000", "10000", "10000", "01111"],
  E: ["11111", "10000", "11110", "10000", "11111"],
  G: ["01111", "10000", "10111", "10001", "01111"],
  I: ["111", "010", "010", "010", "111"],
  L: ["10000", "10000", "10000", "10000", "11111"],
  N: ["10001", "11001", "10101", "10011", "10001"],
  O: ["01110", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "11110", "10000", "10000"],
  R: ["11110", "10001", "11110", "10100", "10010"],
  S: ["01111", "10000", "01110", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100"],
  Y: ["10001", "01010", "00100", "00100", "00100"],
  " ": ["0", "0", "0", "0", "0"],
};

function glyphWidth(rows) {
  return Math.max(...rows.map(r => r.length));
}

export function stampConcept(image, avoid = null) {
  const data = new Uint8ClampedArray(image.data);
  const text = "ARC SIGN CO  CONCEPT ONLY";
  const scale = image.width < 280 ? 1 : 2;
  const rows = 5 * scale;
  const margin = 6;
  let width = 0;
  for (const ch of text) width += (glyphWidth(FONT[ch] || FONT[" "]) + 1) * scale;
  let x = image.width - margin - width;
  const y = image.height - margin - rows;
  const inside = (px, py) => avoid && px >= avoid.minX && px < avoid.maxX && py >= avoid.minY && py < avoid.maxY;
  for (const ch of text) {
    const g = FONT[ch] || FONT[" "];
    const gw = glyphWidth(g);
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < gw; col++) {
        if (g[row][col] !== "1") continue;
        for (let sy = 0; sy < scale; sy++) {
          for (let sx = 0; sx < scale; sx++) {
            const px = x + col * scale + sx;
            const py = y + row * scale + sy;
            if (px < 0 || py < 0 || px >= image.width || py >= image.height || inside(px, py)) continue;
            const i = (py * image.width + px) * 4;
            data[i] = 240; data[i + 1] = 208; data[i + 2] = 128; data[i + 3] = 255;
          }
        }
      }
    }
    x += (gw + 1) * scale;
  }
  return { width: image.width, height: image.height, data };
}
