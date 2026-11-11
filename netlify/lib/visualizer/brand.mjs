// Navy footer drawn under a preview so a shared file carries Arc's name and contact line.

const FONT = {
  A: ["01110", "10001", "11111", "10001", "10001"],
  C: ["01111", "10000", "10000", "10000", "01111"],
  E: ["11111", "10000", "11110", "10000", "11111"],
  G: ["01111", "10000", "10111", "10001", "01111"],
  I: ["111", "010", "010", "010", "111"],
  L: ["10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001"],
  O: ["01110", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "11110", "10000", "10000"],
  R: ["11110", "10001", "11110", "10100", "10010"],
  S: ["01111", "10000", "01110", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100"],
  Y: ["10001", "01010", "00100", "00100", "00100"],
  "0": ["111", "101", "101", "101", "111"],
  "1": ["010", "110", "010", "010", "111"],
  "2": ["111", "001", "111", "100", "111"],
  "3": ["111", "001", "111", "001", "111"],
  "4": ["101", "101", "111", "001", "001"],
  "5": ["111", "100", "111", "001", "111"],
  "6": ["111", "100", "111", "101", "111"],
  "7": ["111", "001", "001", "001", "001"],
  "8": ["111", "101", "111", "101", "111"],
  "9": ["111", "101", "111", "001", "111"],
  "@": ["01110", "10001", "10111", "10000", "01110"],
  ".": ["0", "0", "0", "0", "1"],
  "(": ["01", "10", "10", "10", "01"],
  ")": ["10", "01", "01", "01", "10"],
  "-": ["000", "000", "111", "000", "000"],
  " ": ["0", "0", "0", "0", "0"],
};

const GOLD = [212, 165, 60, 255];
const WHITE = [231, 238, 246, 255];
const NAVY = [11, 31, 58, 255];

function glyphWidth(rows) {
  return Math.max(...rows.map(row => row.length));
}

function lineWidth(text, scale) {
  let width = 0;
  for (const ch of text) width += (glyphWidth(FONT[ch] || FONT[" "]) + 1) * scale;
  return width;
}

function paintText(data, width, height, text, x, y, scale, color) {
  let cursor = x;
  for (const ch of text) {
    const glyph = FONT[ch] || FONT[" "];
    const gw = glyphWidth(glyph);
    for (let row = 0; row < glyph.length; row++) {
      for (let col = 0; col < gw; col++) {
        if (glyph[row][col] !== "1") continue;
        for (let sy = 0; sy < scale; sy++) {
          for (let sx = 0; sx < scale; sx++) {
            const px = cursor + col * scale + sx;
            const py = y + row * scale + sy;
            if (px < 0 || py < 0 || px >= width || py >= height) continue;
            const i = (py * width + px) * 4;
            data[i] = color[0];
            data[i + 1] = color[1];
            data[i + 2] = color[2];
            data[i + 3] = color[3];
          }
        }
      }
    }
    cursor += (gw + 1) * scale;
  }
}

export function addBrandBar(image) {
  const scale = image.width < 280 ? 1 : image.width < 720 ? 2 : 3;
  const lineH = 5 * scale + scale + 2;
  const bar = lineH * 3 + scale * 4;
  const width = image.width;
  const height = image.height + bar;
  const data = new Uint8ClampedArray(width * height * 4);
  data.set(image.data.subarray(0, image.width * image.height * 4));
  for (let y = image.height; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      data[i] = NAVY[0];
      data[i + 1] = NAVY[1];
      data[i + 2] = NAVY[2];
      data[i + 3] = 255;
    }
  }
  const pad = Math.max(6, scale * 3);
  let y = image.height + scale * 2;
  paintText(data, width, height, "ARC SIGNAGE CO", pad, y, scale, GOLD);
  y += lineH;
  const contact = "(347) 450-2110  ARC@ARCSIGNCO.COM";
  const contactScale = lineWidth(contact, scale) > width - pad * 2 ? 1 : scale;
  paintText(data, width, height, contact, pad, y, contactScale, WHITE);
  y += lineH;
  paintText(data, width, height, "CONCEPT ONLY", pad, y, scale, GOLD);
  return { width, height, data };
}
