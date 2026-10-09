/**
 * The photo metadata remover and the palette extractor: byte-level parsing and
 * cleaning on hand-built JPEG and PNG files, and median-cut palettes on known
 * pixels. Both tools must also be registered as browser-local and free to run.
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { seedResources } from "@/data/resources";
import { getTool } from "@/config/tools";
import { matchesFilters } from "@/lib/search/filters";
import {
  cleanImage,
  detectFormat,
  isClean,
  MetadataError,
  orientationOnlyExif,
  readExif,
} from "@/features/tools/logic/photo-metadata";
import { extractPalette, paletteAsCss, paletteAsList, readableTextOn } from "@/features/tools/logic/palette";

const ascii = (text: string) => [...text].map((c) => c.charCodeAt(0));

function contains(haystack: Uint8Array, needle: number[]): boolean {
  outer: for (let i = 0; i + needle.length <= haystack.length; i++) {
    for (let j = 0; j < needle.length; j++) if (haystack[i + j] !== needle[j]) continue outer;
    return true;
  }
  return false;
}

/** Little-endian TIFF: Make, Model, Orientation 6, GPS 51.5 N 0.125 W, and a thumbnail IFD. */
function sampleTiff(): Uint8Array {
  const bytes = new Uint8Array(348);
  const v = new DataView(bytes.buffer);
  bytes.set(ascii("II"), 0);
  v.setUint16(2, 42, true);
  v.setUint32(4, 8, true);

  const entry = (at: number, tag: number, type: number, count: number, value: number | number[]) => {
    v.setUint16(at, tag, true);
    v.setUint16(at + 2, type, true);
    v.setUint32(at + 4, count, true);
    if (Array.isArray(value)) bytes.set(value, at + 8);
    else if (type === 3) v.setUint16(at + 8, value, true);
    else v.setUint32(at + 8, value, true);
  };

  v.setUint16(8, 4, true);
  entry(10, 0x010f, 2, 4, ascii("Cam\0"));
  entry(22, 0x0110, 2, 8, 100);
  entry(34, 0x0112, 3, 1, 6);
  entry(46, 0x8825, 4, 1, 120);
  v.setUint32(58, 200, true);
  bytes.set(ascii("Phone X\0"), 100);

  v.setUint16(120, 4, true);
  entry(122, 1, 2, 2, ascii("N\0"));
  entry(134, 2, 5, 3, 300);
  entry(146, 3, 2, 2, ascii("W\0"));
  entry(158, 4, 5, 3, 324);
  v.setUint32(170, 0, true);

  v.setUint16(200, 1, true);
  entry(202, 0x0201, 4, 1, 0);
  v.setUint32(214, 0, true);

  [51, 1, 30, 1, 0, 1].forEach((n, i) => v.setUint32(300 + i * 4, n, true));
  [0, 1, 7, 1, 30, 1].forEach((n, i) => v.setUint32(324 + i * 4, n, true));
  return bytes;
}

function segment(marker: number, data: number[] | Uint8Array): number[] {
  const length = data.length + 2;
  return [0xff, marker, length >> 8, length & 0xff, ...data];
}

const ENTROPY = [0x12, 0x34, 0xff, 0x00, 0x56, 0xff, 0xd0, 0x78];

function sampleJpeg(): Uint8Array {
  return new Uint8Array([
    0xff, 0xd8,
    ...segment(0xe0, [...ascii("JFIF\0"), 1, 1, 0, 0, 1, 0, 1, 0, 0]),
    ...segment(0xe1, [...ascii("Exif\0\0"), ...sampleTiff()]),
    ...segment(0xe1, [...ascii("http://ns.adobe.com/xap/1.0/\0"), ...ascii("<x:xmpmeta/>")]),
    ...segment(0xe2, [...ascii("ICC_PROFILE\0"), 1, 1, 9, 9]),
    ...segment(0xfe, ascii("hello")),
    ...segment(0xdb, [0, 0]),
    ...segment(0xda, [1, 1, 0, 0, 63, 0]),
    ...ENTROPY,
    0xff, 0xd9,
    ...ascii("TRAILER"),
  ]);
}

function chunk(type: string, data: number[]): number[] {
  const n = data.length;
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff, ...ascii(type), ...data, 0, 0, 0, 0];
}

function samplePng(): Uint8Array {
  return new Uint8Array([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ...chunk("IHDR", [0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0]),
    ...chunk("tEXt", [...ascii("Author\0Jane Example")]),
    ...chunk("tIME", [0x07, 0xea, 3, 14, 9, 26, 0]),
    ...chunk("iCCP", [...ascii("p\0"), 0, 1, 2]),
    ...chunk("IDAT", [1, 2, 3]),
    ...chunk("IEND", []),
    ...ascii("EXTRA"),
  ]);
}

describe("photo metadata: detection and EXIF", () => {
  test("detects formats by signature, not extension", () => {
    assert.equal(detectFormat(sampleJpeg()), "jpeg");
    assert.equal(detectFormat(samplePng()), "png");
    assert.equal(detectFormat(new Uint8Array([...ascii("RIFF"), 0, 0, 0, 0, ...ascii("WEBP")])), "webp");
    assert.equal(detectFormat(new Uint8Array([0, 0, 0, 0x18, ...ascii("ftypheic")])), "heic");
    assert.equal(detectFormat(new Uint8Array([1, 2, 3])), null);
  });

  test("reads camera, GPS, orientation and the thumbnail from little-endian EXIF", () => {
    const { fields, orientation } = readExif(sampleTiff());
    const value = (label: string) => fields.find((f) => f.label === label)?.value;
    assert.equal(orientation, 6);
    assert.equal(value("Camera make"), "Cam");
    assert.equal(value("Camera model"), "Phone X");
    assert.equal(value("GPS location"), "51.500000, -0.125000");
    assert.ok(value("Embedded thumbnail"));
    assert.ok(fields.find((f) => f.label === "GPS location")?.sensitive);
  });

  test("survives hostile structures: IFD loops and offsets past the end", () => {
    const looped = sampleTiff();
    new DataView(looped.buffer).setUint32(58, 8, true); // IFD0's next IFD is itself
    assert.ok(Array.isArray(readExif(looped).fields));

    const outOfRange = sampleTiff();
    new DataView(outOfRange.buffer).setUint32(30, 0xfffffff0, true); // Model points far away
    assert.equal(readExif(outOfRange).fields.some((f) => f.label === "Camera model"), false);

    assert.deepEqual(readExif(new Uint8Array([1, 2, 3])).fields, []);
  });

  test("the orientation-only block reads back as orientation and nothing else", () => {
    const exif = orientationOnlyExif(8);
    const parsed = readExif(exif.subarray(6));
    assert.equal(parsed.orientation, 8);
    assert.deepEqual(parsed.fields, []);
  });
});

describe("photo metadata: JPEG cleaning", () => {
  test("reports what identifies, including XMP, comments and appended data", () => {
    const { report } = cleanImage(sampleJpeg(), { keepOrientation: true });
    const labels = report.fields.map((f) => f.label);
    for (const label of ["GPS location", "Camera model", "Comment", "XMP metadata", "Embedded thumbnail"]) {
      assert.ok(labels.includes(label), label);
    }
    assert.ok(report.blocks.some((b) => b.label === "Data after the image" && b.action === "removed"));
    assert.ok(report.blocks.some((b) => b.label === "Colour profile (ICC)" && b.action === "kept"));
  });

  test("removes metadata losslessly and keeps the image data byte for byte", () => {
    const original = sampleJpeg();
    const { cleaned, removedBytes } = cleanImage(original, { keepOrientation: false });
    assert.deepEqual([...cleaned.subarray(0, 2)], [0xff, 0xd8]);
    assert.deepEqual([...cleaned.subarray(-2)], [0xff, 0xd9]);
    assert.equal(removedBytes, original.length - cleaned.length);
    for (const gone of ["Exif", "Phone X", "hello", "xmpmeta", "TRAILER"]) {
      assert.equal(contains(cleaned, ascii(gone)), false, gone);
    }
    assert.ok(contains(cleaned, ascii("JFIF")));
    assert.ok(contains(cleaned, ascii("ICC_PROFILE")));
    assert.ok(contains(cleaned, [0xff, 0xda, 0, 8, 1, 1, 0, 0, 63, 0, ...ENTROPY, 0xff, 0xd9]));
    assert.ok(isClean(cleaned, { keepOrientation: false }));
  });

  test("writes back only the orientation when asked, and the result is still clean", () => {
    const { cleaned } = cleanImage(sampleJpeg(), { keepOrientation: true });
    const again = cleanImage(cleaned, { keepOrientation: true });
    assert.equal(again.report.orientation, 6);
    assert.deepEqual(again.report.fields, []);
    assert.equal(contains(cleaned, ascii("Phone X")), false);
    assert.ok(isClean(cleaned, { keepOrientation: true }));
    // Right after the JFIF header.
    assert.deepEqual([...cleaned.subarray(20, 22)], [0xff, 0xe1]);
  });

  test("refuses damaged files with an explanation instead of guessing", () => {
    const truncated = sampleJpeg().subarray(0, 40);
    assert.throws(() => cleanImage(truncated, { keepOrientation: true }), MetadataError);
    assert.throws(
      () => cleanImage(new Uint8Array([...ascii("RIFF"), 0, 0, 0, 0, ...ascii("WEBP")]), { keepOrientation: true }),
      /WebP files are not supported/,
    );
    assert.throws(() => cleanImage(new Uint8Array([1, 2, 3, 4]), { keepOrientation: true }), /not a JPEG or PNG/);
  });
});

describe("photo metadata: PNG cleaning", () => {
  test("reports and removes text and time chunks, keeps image and colour chunks", () => {
    const original = samplePng();
    const { report, cleaned } = cleanImage(original, { keepOrientation: true });
    const author = report.fields.find((f) => f.label === "Text: Author");
    assert.equal(author?.value, "Jane Example");
    assert.equal(author?.sensitive, true);
    assert.equal(report.fields.find((f) => f.label === "Last modified")?.value, "2026-03-14 09:26");

    for (const gone of ["tEXt", "tIME", "Jane", "EXTRA"]) assert.equal(contains(cleaned, ascii(gone)), false, gone);
    for (const kept of ["IHDR", "iCCP", "IDAT", "IEND"]) assert.ok(contains(cleaned, ascii(kept)), kept);
    assert.ok(isClean(cleaned, { keepOrientation: true }));
  });

  test("rejects a PNG with no end chunk", () => {
    const png = samplePng();
    assert.throws(() => cleanImage(png.subarray(0, 40), { keepOrientation: true }), MetadataError);
  });
});

/* -------------------------------------------------------------------------- */

function pixels(colours: Array<[number, number, number, number]>, repeat: number[]): Uint8ClampedArray {
  const out: number[] = [];
  colours.forEach((c, i) => {
    for (let n = 0; n < repeat[i]; n++) out.push(...c);
  });
  return new Uint8ClampedArray(out);
}

describe("palette extractor", () => {
  test("a single-colour image gives one swatch however many are asked for", () => {
    const palette = extractPalette(pixels([[212, 175, 55, 255]], [100]), 6);
    assert.equal(palette.length, 1);
    assert.equal(palette[0].hex, "#d4af37");
    assert.equal(palette[0].share, 1);
  });

  test("finds distinct colours with their shares, largest first", () => {
    const palette = extractPalette(
      pixels(
        [
          [255, 0, 0, 255],
          [0, 0, 255, 255],
        ],
        [75, 25],
      ),
      4,
    );
    assert.deepEqual(
      palette.map((c) => [c.hex, c.share]),
      [
        ["#ff0000", 0.75],
        ["#0000ff", 0.25],
      ],
    );
  });

  test("ignores transparent pixels, and an all-transparent image has no palette", () => {
    const palette = extractPalette(
      pixels(
        [
          [0, 255, 0, 255],
          [255, 255, 255, 0],
        ],
        [10, 90],
      ),
      3,
    );
    assert.deepEqual(
      palette.map((c) => c.hex),
      ["#00ff00"],
    );
    assert.deepEqual(extractPalette(pixels([[1, 2, 3, 0]], [5]), 3), []);
    assert.deepEqual(extractPalette(new Uint8ClampedArray(0), 3), []);
  });

  test("never returns more swatches than asked, and is deterministic", () => {
    const colours: Array<[number, number, number, number]> = [];
    for (let i = 0; i < 64; i++) colours.push([i * 4, 255 - i * 4, (i * 37) % 256, 255]);
    const data = pixels(colours, colours.map((_, i) => 1 + (i % 5)));
    const a = extractPalette(data, 8);
    assert.equal(a.length, 8);
    assert.deepEqual(a, extractPalette(data, 8));
    const total = a.reduce((sum, c) => sum + c.share, 0);
    assert.ok(Math.abs(total - 1) < 1e-9);
  });

  test("picks readable text and formats exports", () => {
    assert.equal(readableTextOn({ r: 255, g: 255, b: 255 }), "#000000");
    assert.equal(readableTextOn({ r: 0, g: 0, b: 0 }), "#ffffff");
    const palette = [
      { hex: "#112233", r: 17, g: 34, b: 51, share: 0.6 },
      { hex: "#abcdef", r: 171, g: 205, b: 239, share: 0.4 },
    ];
    assert.equal(paletteAsList(palette), "#112233\n#abcdef");
    assert.equal(paletteAsCss(palette), ":root {\n  --palette-1: #112233;\n  --palette-2: #abcdef;\n}");
  });
});

describe("new tools are registered honestly", () => {
  test("both run locally, cost nothing, document limits and relate only to listable resources", () => {
    const listable = new Set(seedResources.filter((r) => matchesFilters(r, {})).map((r) => r.slug));
    for (const slug of ["photo-metadata", "palette-extractor"]) {
      const tool = getTool(slug);
      assert.ok(tool, slug);
      assert.equal(tool.status, "available");
      assert.equal(tool.integrationType, "BROWSER_LOCAL");
      assert.equal(tool.processing.location, "browser");
      assert.equal(tool.processing.leavesDevice, false);
      assert.equal(tool.infrastructureCost, "none");
      assert.ok(tool.limitations.length > 0);
      for (const related of tool.relatedResources) assert.ok(listable.has(related), `${slug} → ${related}`);
    }
  });
});
