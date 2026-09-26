/**
 * `bigint` and `0` are included in the falsy union because JSX guards such as
 * `{items.length && "cls"}` and `{title && "cls"}` can narrow to them when the
 * left operand is a `ReactNode`.
 */
type ClassValue =
  | string
  | number
  | bigint
  | null
  | undefined
  | false
  | ClassValue[]
  | Record<string, boolean | undefined | null>;

/**
 * Conditional class name joining.
 *
 * Deliberately not `clsx` + `tailwind-merge`. Those exist to resolve conflicting
 * Tailwind utilities at runtime, which is only necessary when components accept
 * arbitrary overriding classes. The components here expose variants instead, so
 * a 20-line join covers every case and adds nothing to the bundle.
 */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];

  const walk = (value: ClassValue): void => {
    if (!value) return;

    if (typeof value === "string" || typeof value === "number") {
      out.push(String(value));
      return;
    }

    if (Array.isArray(value)) {
      for (const entry of value) walk(entry);
      return;
    }

    for (const [key, enabled] of Object.entries(value)) {
      if (enabled) out.push(key);
    }
  };

  for (const input of inputs) walk(input);
  return out.join(" ");
}
