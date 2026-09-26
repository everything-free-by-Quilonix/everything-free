/** Human-readable byte size. Binary units, because that is what file managers show. */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;

  return `${value.toFixed(value < 10 && exponent > 0 ? 1 : 0)} ${units[exponent]}`;
}

/** Locale-aware integer, so large counts get thousands separators. */
export function formatCount(value: number): string {
  return new Intl.NumberFormat("en-GB").format(value);
}
