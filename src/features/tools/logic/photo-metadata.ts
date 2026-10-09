/**
 * Photo metadata inspection and removal for JPEG and PNG, on raw bytes.
 *
 * Removal is lossless: the file is split into its container segments (JPEG
 * markers, PNG chunks) and the ones that carry metadata are left out. The
 * compressed image data is copied byte for byte and never re-encoded, so the
 * picture is unchanged.
 *
 * Pure functions over `Uint8Array`, with every read bounds-checked: a damaged or
 * hostile file produces a `MetadataError` with a message a user can act on,
 * never an out-of-range read or an infinite loop.
 */

export type MetadataFormat = "jpeg" | "png";

export type FieldGroup = "location" | "time" | "people" | "camera" | "software" | "text" | "other";

export interface MetadataField {
  group: FieldGroup;
  label: string;
  value: string;
  /** Could identify the person, the place or the device. */
  sensitive: boolean;
}

export interface MetadataBlock {
  label: string;
  bytes: number;
  action: "removed" | "kept";
  reason: string;
}

export interface MetadataReport {
  format: MetadataFormat;
  fields: MetadataField[];
  blocks: MetadataBlock[];
  /** EXIF orientation 1–8, when the file records one. */
  orientation: number | null;
}

export interface CleanResult {
  report: MetadataReport;
  cleaned: Uint8Array;
  /** Bytes removed, net of any orientation tag written back. */
  removedBytes: number;
}

export class MetadataError extends Error {}

const MAX_TEXT = 300;

/* -------------------------------------------------------------------------- */
/* Detection                                                                  */
/* -------------------------------------------------------------------------- */

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function startsWith(bytes: Uint8Array, prefix: readonly number[], at = 0): boolean {
  if (at + prefix.length > bytes.length) return false;
  for (let i = 0; i < prefix.length; i++) if (bytes[at + i] !== prefix[i]) return false;
  return true;
}

function asciiBytes(text: string): number[] {
  return [...text].map((ch) => ch.charCodeAt(0));
}

export function detectFormat(bytes: Uint8Array): MetadataFormat | "webp" | "heic" | "gif" | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpeg";
  if (startsWith(bytes, PNG_SIGNATURE)) return "png";
  if (startsWith(bytes, asciiBytes("RIFF")) && startsWith(bytes, asciiBytes("WEBP"), 8)) return "webp";
  if (startsWith(bytes, asciiBytes("ftyp"), 4)) return "heic";
  if (startsWith(bytes, asciiBytes("GIF8"))) return "gif";
  return null;
}

/* -------------------------------------------------------------------------- */
/* EXIF (TIFF structure)                                                      */
/* -------------------------------------------------------------------------- */

const TYPE_SIZES: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };

interface TiffEntry {
  tag: number;
  type: number;
  count: number;
  /** Absolute offset of the value within the TIFF block. */
  valueOffset: number;
}

interface ExifSummary {
  fields: MetadataField[];
  orientation: number | null;
}

const IFD0_TAGS: Record<number, { label: string; group: FieldGroup; sensitive: boolean }> = {
  0x010f: { label: "Camera make", group: "camera", sensitive: false },
  0x0110: { label: "Camera model", group: "camera", sensitive: true },
  0x0131: { label: "Software", group: "software", sensitive: false },
  0x0132: { label: "Date modified", group: "time", sensitive: true },
  0x013b: { label: "Artist", group: "people", sensitive: true },
  0x8298: { label: "Copyright", group: "people", sensitive: true },
  0x010e: { label: "Description", group: "text", sensitive: true },
};

const EXIF_TAGS: Record<number, { label: string; group: FieldGroup; sensitive: boolean }> = {
  0x9003: { label: "Date taken", group: "time", sensitive: true },
  0x9004: { label: "Date digitised", group: "time", sensitive: true },
  0xa430: { label: "Camera owner", group: "people", sensitive: true },
  0xa431: { label: "Camera serial number", group: "camera", sensitive: true },
  0xa433: { label: "Lens make", group: "camera", sensitive: false },
  0xa434: { label: "Lens model", group: "camera", sensitive: false },
  0xa435: { label: "Lens serial number", group: "camera", sensitive: true },
  0xa420: { label: "Unique image ID", group: "camera", sensitive: true },
};

/**
 * Reads the parts of an EXIF block that matter for privacy.
 *
 * `tiff` is the TIFF structure only (after the `Exif\0\0` prefix in JPEG; the
 * whole chunk in PNG `eXIf`). Unreadable entries are skipped rather than failing
 * the whole file, because the block is about to be removed either way.
 */
export function readExif(tiff: Uint8Array): ExifSummary {
  const fields: MetadataField[] = [];
  let orientation: number | null = null;
  if (tiff.length < 8) return { fields, orientation };

  const little = tiff[0] === 0x49 && tiff[1] === 0x49;
  const big = tiff[0] === 0x4d && tiff[1] === 0x4d;
  if (!little && !big) return { fields, orientation };
  const view = new DataView(tiff.buffer, tiff.byteOffset, tiff.byteLength);

  const u16 = (at: number) => (at + 2 <= tiff.length ? view.getUint16(at, little) : null);
  const u32 = (at: number) => (at + 4 <= tiff.length ? view.getUint32(at, little) : null);
  if (u16(2) !== 42) return { fields, orientation };

  const visited = new Set<number>();

  const readIfd = (offset: number | null): { entries: TiffEntry[]; next: number | null } => {
    if (offset === null || offset < 8 || visited.has(offset)) return { entries: [], next: null };
    visited.add(offset);
    const count = u16(offset);
    if (count === null || count > 1000) return { entries: [], next: null };
    const entries: TiffEntry[] = [];
    for (let i = 0; i < count; i++) {
      const at = offset + 2 + i * 12;
      const tag = u16(at);
      const type = u16(at + 2);
      const n = u32(at + 4);
      if (tag === null || type === null || n === null) break;
      const size = (TYPE_SIZES[type] ?? 0) * n;
      if (size === 0) continue;
      const valueOffset = size <= 4 ? at + 8 : u32(at + 8);
      if (valueOffset === null || valueOffset + size > tiff.length) continue;
      entries.push({ tag, type, count: n, valueOffset });
    }
    const next = u32(offset + 2 + count * 12);
    return { entries, next: next && next > 0 ? next : null };
  };

  const ascii = (entry: TiffEntry): string | null => {
    if (entry.type !== 2 && entry.type !== 7) return null;
    const raw = tiff.subarray(entry.valueOffset, entry.valueOffset + entry.count);
    const text = new TextDecoder("utf-8").decode(raw).replace(/\0+$/g, "").trim();
    if (text.length === 0) return null;
    return text.length > MAX_TEXT ? `${text.slice(0, MAX_TEXT)}…` : text;
  };

  const shortValue = (entry: TiffEntry): number | null => {
    if (entry.type === 3) return u16(entry.valueOffset);
    if (entry.type === 4) return u32(entry.valueOffset);
    return null;
  };

  const rational = (entry: TiffEntry, index: number): number | null => {
    if (entry.type !== 5 || index >= entry.count) return null;
    const num = u32(entry.valueOffset + index * 8);
    const den = u32(entry.valueOffset + index * 8 + 4);
    if (num === null || den === null || den === 0) return null;
    return num / den;
  };

  const collect = (entries: TiffEntry[], table: typeof IFD0_TAGS) => {
    for (const entry of entries) {
      const known = table[entry.tag];
      if (!known) continue;
      const value = ascii(entry);
      if (value) fields.push({ ...known, value });
    }
  };

  const ifd0 = readIfd(u32(4));
  collect(ifd0.entries, IFD0_TAGS);

  const orientationEntry = ifd0.entries.find((e) => e.tag === 0x0112);
  if (orientationEntry) {
    const value = shortValue(orientationEntry);
    if (value !== null && value >= 1 && value <= 8) orientation = value;
  }

  const exifPointer = ifd0.entries.find((e) => e.tag === 0x8769);
  if (exifPointer) collect(readIfd(shortValue(exifPointer)).entries, EXIF_TAGS);

  const gpsPointer = ifd0.entries.find((e) => e.tag === 0x8825);
  if (gpsPointer) {
    const gps = readIfd(shortValue(gpsPointer)).entries;
    const byTag = (tag: number) => gps.find((e) => e.tag === tag);
    const coordinate = (refTag: number, valueTag: number, negative: string): number | null => {
      const entry = byTag(valueTag);
      if (!entry) return null;
      const [d, m, s] = [rational(entry, 0), rational(entry, 1), rational(entry, 2)];
      if (d === null) return null;
      const decimal = d + (m ?? 0) / 60 + (s ?? 0) / 3600;
      const ref = byTag(refTag);
      const sign = ref && ascii(ref)?.toUpperCase() === negative ? -1 : 1;
      return sign * decimal;
    };
    const lat = coordinate(1, 2, "S");
    const lon = coordinate(3, 4, "W");
    if (lat !== null && lon !== null && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
      fields.push({
        group: "location",
        label: "GPS location",
        value: `${lat.toFixed(6)}, ${lon.toFixed(6)}`,
        sensitive: true,
      });
    } else if (gps.length > 0) {
      fields.push({ group: "location", label: "GPS data", value: "Present (no readable coordinates)", sensitive: true });
    }
    const altitude = byTag(6);
    const metres = altitude ? rational(altitude, 0) : null;
    if (metres !== null) {
      const below = byTag(5);
      const sign = below && tiff[below.valueOffset] === 1 ? -1 : 1;
      fields.push({ group: "location", label: "GPS altitude", value: `${(sign * metres).toFixed(1)} m`, sensitive: true });
    }
  }

  // IFD1 is the embedded thumbnail. It is generated when the photo is taken, so
  // it can still show what was cropped out or edited away afterwards.
  if (ifd0.next !== null && readIfd(ifd0.next).entries.length > 0) {
    fields.push({
      group: "other",
      label: "Embedded thumbnail",
      value: "Present. It can show the photo as it was before cropping or editing.",
      sensitive: true,
    });
  }

  return { fields, orientation };
}

/** A minimal EXIF block holding only an orientation tag (big-endian TIFF). */
export function orientationOnlyExif(orientation: number): Uint8Array {
  return new Uint8Array([
    ...asciiBytes("Exif"), 0, 0,
    0x4d, 0x4d, 0x00, 0x2a, 0x00, 0x00, 0x00, 0x08, // header, IFD0 at 8
    0x00, 0x01, // one entry
    0x01, 0x12, 0x00, 0x03, 0x00, 0x00, 0x00, 0x01, 0x00, orientation, 0x00, 0x00, // Orientation SHORT
    0x00, 0x00, 0x00, 0x00, // no next IFD
  ]);
}

/* -------------------------------------------------------------------------- */
/* JPEG                                                                       */
/* -------------------------------------------------------------------------- */

const XMP_PREFIX = asciiBytes("http://ns.adobe.com/xap/1.0/\0");
const XMP_EXT_PREFIX = asciiBytes("http://ns.adobe.com/xmp/extension/\0");
const EXIF_PREFIX = asciiBytes("Exif\0\0");
const ICC_PREFIX = asciiBytes("ICC_PROFILE\0");
const JFIF_PREFIX = asciiBytes("JFIF\0");
const ADOBE_PREFIX = asciiBytes("Adobe");
const PHOTOSHOP_PREFIX = asciiBytes("Photoshop 3.0\0");

const CORRUPT_JPEG = "This JPEG is damaged or truncated, so it cannot be cleaned safely. Try re-saving it in an image editor first.";

function cleanJpeg(bytes: Uint8Array, keepOrientation: boolean): CleanResult {
  const fields: MetadataField[] = [];
  const blocks: MetadataBlock[] = [];
  const kept: Uint8Array[] = [bytes.subarray(0, 2)];
  let orientation: number | null = null;
  let insertAt = 1; // index in `kept` where an orientation block would go
  let i = 2;
  let sawScan = false;

  while (i < bytes.length) {
    if (bytes[i] !== 0xff) throw new MetadataError(CORRUPT_JPEG);
    let marker = bytes[i + 1];
    while (marker === 0xff && i + 2 < bytes.length) {
      i++;
      marker = bytes[i + 1];
    }
    if (marker === undefined) throw new MetadataError(CORRUPT_JPEG);

    if (marker === 0xd9) {
      kept.push(bytes.subarray(i, i + 2));
      i += 2;
      break;
    }
    if ((marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
      kept.push(bytes.subarray(i, i + 2));
      i += 2;
      continue;
    }
    if (i + 4 > bytes.length) throw new MetadataError(CORRUPT_JPEG);
    const length = (bytes[i + 2] << 8) | bytes[i + 3];
    const end = i + 2 + length;
    if (length < 2 || end > bytes.length) throw new MetadataError(CORRUPT_JPEG);

    if (marker === 0xda) {
      // Start of scan. Entropy-coded data follows; inside it 0xFF is always
      // stuffed or a restart marker, so the first FFD9 is the end of the image.
      // Progressive files carry more tables and scans in this stretch, which are
      // copied as they are.
      let eoi = -1;
      for (let j = end; j + 1 < bytes.length; j++) {
        if (bytes[j] === 0xff && bytes[j + 1] === 0xd9) {
          eoi = j;
          break;
        }
      }
      const stop = eoi === -1 ? bytes.length : eoi + 2;
      kept.push(bytes.subarray(i, stop));
      i = stop;
      sawScan = true;
      break;
    }

    const segment = bytes.subarray(i, end);
    const data = bytes.subarray(i + 4, end);
    const at = (prefix: number[]) => startsWith(data, prefix);

    if (marker === 0xe0 && at(JFIF_PREFIX)) {
      kept.push(segment);
      insertAt = kept.length;
      blocks.push({ label: "JFIF header", bytes: segment.length, action: "kept", reason: "Image format information." });
    } else if (marker === 0xe1 && at(EXIF_PREFIX)) {
      const exif = readExif(data.subarray(EXIF_PREFIX.length));
      fields.push(...exif.fields);
      orientation ??= exif.orientation;
      blocks.push({ label: "EXIF", bytes: segment.length, action: "removed", reason: "Camera, date, location and thumbnail data." });
    } else if (marker === 0xe1 && (at(XMP_PREFIX) || at(XMP_EXT_PREFIX))) {
      fields.push({ group: "text", label: "XMP metadata", value: "Present (editing history, ratings, captions or location).", sensitive: true });
      blocks.push({ label: "XMP", bytes: segment.length, action: "removed", reason: "Editing history, captions and other descriptive data." });
    } else if (marker === 0xe2 && at(ICC_PREFIX)) {
      kept.push(segment);
      blocks.push({ label: "Colour profile (ICC)", bytes: segment.length, action: "kept", reason: "Needed to show colours correctly. Identifies no one." });
    } else if (marker === 0xed && at(PHOTOSHOP_PREFIX)) {
      fields.push({ group: "text", label: "IPTC / Photoshop data", value: "Present (captions, keywords, credits or location).", sensitive: true });
      blocks.push({ label: "IPTC / Photoshop", bytes: segment.length, action: "removed", reason: "Captions, credits, keywords and contact details." });
    } else if (marker === 0xee && at(ADOBE_PREFIX)) {
      kept.push(segment);
      blocks.push({ label: "Adobe colour transform", bytes: segment.length, action: "kept", reason: "Needed to decode the colours of some files." });
    } else if (marker === 0xfe) {
      const text = new TextDecoder("utf-8").decode(data).replace(/\0+$/g, "").trim();
      if (text) fields.push({ group: "text", label: "Comment", value: text.slice(0, MAX_TEXT), sensitive: true });
      blocks.push({ label: "Comment", bytes: segment.length, action: "removed", reason: "Free text written by software or a person." });
    } else if (marker >= 0xe0 && marker <= 0xef) {
      blocks.push({ label: `Application data (APP${marker - 0xe0})`, bytes: segment.length, action: "removed", reason: "Vendor-specific data, such as maker notes or embedded previews." });
    } else {
      // Quantisation and Huffman tables, frame header and so on: the image itself.
      kept.push(segment);
    }
    i = end;
  }

  if (!sawScan) throw new MetadataError(CORRUPT_JPEG);

  if (i < bytes.length) {
    blocks.push({
      label: "Data after the image",
      bytes: bytes.length - i,
      action: "removed",
      reason: "Extra images some phones append, such as previews, depth maps or HDR gain maps.",
    });
  }

  if (keepOrientation && orientation !== null && orientation !== 1) {
    const body = orientationOnlyExif(orientation);
    const length = body.length + 2;
    const segment = new Uint8Array([0xff, 0xe1, length >> 8, length & 0xff, ...body]);
    kept.splice(insertAt, 0, segment);
    blocks.push({ label: "Orientation", bytes: segment.length, action: "kept", reason: "Written back so the photo stays the right way up. Contains nothing else." });
  }

  return finish({ format: "jpeg", fields, blocks, orientation }, bytes, kept);
}

/* -------------------------------------------------------------------------- */
/* PNG                                                                        */
/* -------------------------------------------------------------------------- */

const CORRUPT_PNG = "This PNG is damaged or truncated, so it cannot be cleaned safely. Try re-saving it in an image editor first.";

const PNG_REMOVED: Record<string, string> = {
  tEXt: "Text such as author, description or software.",
  zTXt: "Compressed text such as author, description or software.",
  iTXt: "Text such as author, description or XMP data.",
  eXIf: "Camera, date and location data.",
  tIME: "When the file was last modified.",
};

function cleanPng(bytes: Uint8Array): CleanResult {
  const fields: MetadataField[] = [];
  const blocks: MetadataBlock[] = [];
  const kept: Uint8Array[] = [bytes.subarray(0, 8)];
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const latin1 = new TextDecoder("latin1");
  const utf8 = new TextDecoder("utf-8");
  let orientation: number | null = null;
  let i = 8;
  let sawEnd = false;

  while (i < bytes.length) {
    if (i + 12 > bytes.length) throw new MetadataError(CORRUPT_PNG);
    const length = view.getUint32(i);
    const end = i + 12 + length;
    if (end > bytes.length) throw new MetadataError(CORRUPT_PNG);
    const type = latin1.decode(bytes.subarray(i + 4, i + 8));
    const data = bytes.subarray(i + 8, i + 8 + length);
    const chunk = bytes.subarray(i, end);

    if (type in PNG_REMOVED) {
      blocks.push({ label: `${type} chunk`, bytes: chunk.length, action: "removed", reason: PNG_REMOVED[type] });
      const nul = data.indexOf(0);
      const keyword = nul > 0 ? latin1.decode(data.subarray(0, nul)) : "";
      if (type === "eXIf") {
        const exif = readExif(data);
        fields.push(...exif.fields);
        orientation ??= exif.orientation;
      } else if (type === "tIME" && length === 7) {
        const pad = (n: number) => String(n).padStart(2, "0");
        fields.push({
          group: "time",
          label: "Last modified",
          value: `${view.getUint16(i + 8)}-${pad(data[2])}-${pad(data[3])} ${pad(data[4])}:${pad(data[5])}`,
          sensitive: true,
        });
      } else if (type === "tEXt" && nul > 0) {
        fields.push(textField(keyword, latin1.decode(data.subarray(nul + 1))));
      } else if (type === "iTXt" && nul > 0) {
        // keyword \0 flag method language \0 translated-keyword \0 text
        const compressed = data[nul + 1] === 1;
        const langEnd = data.indexOf(0, nul + 3);
        const transEnd = langEnd === -1 ? -1 : data.indexOf(0, langEnd + 1);
        const value = compressed || transEnd === -1 ? "(compressed text)" : utf8.decode(data.subarray(transEnd + 1));
        fields.push(textField(keyword, value));
      } else if (type === "zTXt" && nul > 0) {
        fields.push(textField(keyword, "(compressed text)"));
      }
    } else {
      kept.push(chunk);
    }

    i = end;
    if (type === "IEND") {
      sawEnd = true;
      break;
    }
  }

  if (!sawEnd) throw new MetadataError(CORRUPT_PNG);
  if (i < bytes.length) {
    blocks.push({ label: "Data after the image", bytes: bytes.length - i, action: "removed", reason: "Bytes appended after the end of the PNG." });
  }

  return finish({ format: "png", fields, blocks, orientation }, bytes, kept);
}

function textField(keyword: string, raw: string): MetadataField {
  const value = raw.replace(/\0+$/g, "").trim() || "(empty)";
  const xmp = keyword === "XML:com.adobe.xmp";
  return {
    group: "text",
    label: xmp ? "XMP metadata" : `Text: ${keyword}`,
    value: xmp ? "Present (editing history, captions or location)." : value.slice(0, MAX_TEXT),
    sensitive: xmp || /author|copyright|comment|description|source|title|location|gps/i.test(keyword),
  };
}

/* -------------------------------------------------------------------------- */

function finish(report: MetadataReport, original: Uint8Array, parts: Uint8Array[]): CleanResult {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const cleaned = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    cleaned.set(part, offset);
    offset += part.length;
  }
  return { report, cleaned, removedBytes: original.length - total };
}

/**
 * Reads a JPEG or PNG, reports its metadata and returns a cleaned copy.
 *
 * Throws `MetadataError` with a user-facing explanation for unsupported or
 * damaged files.
 */
export function cleanImage(bytes: Uint8Array, options: { keepOrientation: boolean }): CleanResult {
  const format = detectFormat(bytes);
  if (format === "jpeg") return cleanJpeg(bytes, options.keepOrientation);
  if (format === "png") return cleanPng(bytes);
  if (format === "webp" || format === "heic" || format === "gif") {
    const name = { webp: "WebP", heic: "HEIC and AVIF", gif: "GIF" }[format];
    throw new MetadataError(
      `${name} files are not supported yet. Only JPEG and PNG can be cleaned without re-encoding. ` +
        "Converting the image to JPEG or PNG with the image converter also writes a new file without this metadata.",
    );
  }
  throw new MetadataError("That file is not a JPEG or PNG image.");
}

/**
 * Re-reads a cleaned file to confirm nothing is left to remove.
 *
 * Cleaning is idempotent: a clean file yields no fields, and cleaning it again
 * removes no bytes (an orientation-only block is removed and written back
 * identically).
 */
export function isClean(cleaned: Uint8Array, options: { keepOrientation: boolean }): boolean {
  const again = cleanImage(cleaned, options);
  return again.report.fields.length === 0 && again.removedBytes === 0;
}
