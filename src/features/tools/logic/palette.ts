/**
 * Colour palette extraction by median cut.
 *
 * Input is RGBA pixel data as returned by `CanvasRenderingContext2D.getImageData`.
 * Mostly-transparent pixels are ignored. The colour space is split repeatedly
 * along its widest channel at the median, and each final box contributes the
 * average of its pixels, so every swatch is a colour that is really present
 * rather than a theoretical bucket centre.
 *
 * Pure and deterministic: the same pixels always give the same palette.
 */

export interface PaletteColour {
  hex: string;
  r: number;
  g: number;
  b: number;
  /** Fraction of the opaque pixels this colour stands for, 0–1. */
  share: number;
}

interface Box {
  start: number;
  end: number;
  channel: 0 | 1 | 2;
  range: number;
}

const ALPHA_THRESHOLD = 128;

const channelOf = (packed: number, channel: 0 | 1 | 2) => (packed >> (16 - channel * 8)) & 0xff;

function measure(pixels: Uint32Array, start: number, end: number): Box {
  const min = [255, 255, 255];
  const max = [0, 0, 0];
  for (let i = start; i < end; i++) {
    for (const c of [0, 1, 2] as const) {
      const v = channelOf(pixels[i], c);
      if (v < min[c]) min[c] = v;
      if (v > max[c]) max[c] = v;
    }
  }
  const ranges = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
  const channel = ranges.indexOf(Math.max(...ranges)) as 0 | 1 | 2;
  return { start, end, channel, range: ranges[channel] };
}

export function toHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export function extractPalette(rgba: ArrayLike<number>, count: number): PaletteColour[] {
  const wanted = Math.max(1, Math.min(32, Math.floor(count)));

  let opaque = 0;
  for (let i = 3; i < rgba.length; i += 4) if (rgba[i] >= ALPHA_THRESHOLD) opaque++;
  if (opaque === 0) return [];

  const pixels = new Uint32Array(opaque);
  for (let i = 0, j = 0; i + 3 < rgba.length; i += 4) {
    if (rgba[i + 3] >= ALPHA_THRESHOLD) pixels[j++] = (rgba[i] << 16) | (rgba[i + 1] << 8) | rgba[i + 2];
  }

  const boxes: Box[] = [measure(pixels, 0, pixels.length)];

  while (boxes.length < wanted) {
    // Split the box where it matters most: wide colour range and many pixels.
    let best = -1;
    let bestScore = 0;
    boxes.forEach((box, index) => {
      const score = box.range * (box.end - box.start);
      if (box.end - box.start > 1 && score > bestScore) {
        best = index;
        bestScore = score;
      }
    });
    if (best === -1) break; // every box is a single colour

    const box = boxes[best];
    const slice = pixels.subarray(box.start, box.end);
    slice.sort((a, b) => channelOf(a, box.channel) - channelOf(b, box.channel) || a - b);

    let mid = box.start + Math.floor((box.end - box.start) / 2);
    // Never split a run of identical values across two boxes.
    const pivot = channelOf(pixels[mid], box.channel);
    while (mid > box.start && channelOf(pixels[mid - 1], box.channel) === pivot) mid--;
    if (mid === box.start) {
      mid = box.start + Math.floor((box.end - box.start) / 2);
      while (mid < box.end && channelOf(pixels[mid], box.channel) === pivot) mid++;
    }
    if (mid === box.start || mid === box.end) {
      box.range = 0; // cannot be split on its widest channel; leave it
      continue;
    }

    boxes.splice(best, 1, measure(pixels, box.start, mid), measure(pixels, mid, box.end));
  }

  return boxes
    .map((box) => {
      let r = 0;
      let g = 0;
      let b = 0;
      for (let i = box.start; i < box.end; i++) {
        r += channelOf(pixels[i], 0);
        g += channelOf(pixels[i], 1);
        b += channelOf(pixels[i], 2);
      }
      const n = box.end - box.start;
      const colour = { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) };
      return { ...colour, hex: toHex(colour.r, colour.g, colour.b), share: n / opaque };
    })
    .sort((a, b) => b.share - a.share || a.hex.localeCompare(b.hex));
}

/** WCAG relative luminance. */
function luminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const lin = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Black or white, whichever has more contrast against the colour. */
export function readableTextOn(colour: { r: number; g: number; b: number }): "#000000" | "#ffffff" {
  const l = luminance(colour);
  return (l + 0.05) / 0.05 >= 1.05 / (l + 0.05) ? "#000000" : "#ffffff";
}

export function paletteAsCss(palette: readonly PaletteColour[]): string {
  return [":root {", ...palette.map((c, i) => `  --palette-${i + 1}: ${c.hex};`), "}"].join("\n");
}

export function paletteAsList(palette: readonly PaletteColour[]): string {
  return palette.map((c) => c.hex).join("\n");
}
