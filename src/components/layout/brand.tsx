import Link from "next/link";
import { site } from "@/config/site";
import { cn } from "@/lib/utils/cn";

/**
 * The wordmark: "Everything", a gold dot, "Free", set in Inter 600. No tile.
 *
 * Everything.Free is the product; Quilonix is the parent and is deliberately
 * secondary in the interface — present for provenance, never competing for
 * attention. The dot is styled rather than typed as punctuation so "Everything"
 * and "Free" read as one name, and it is the brand's one use of gold.
 */
export function Brand({ className, showParent = false }: { className?: string; showParent?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex flex-col rounded-xs leading-none", className)}>
      <span className="text-base font-semibold tracking-[-0.011em] text-fg">
        Everything<span className="text-primary">.</span>Free
      </span>
      {showParent ? <span className="mt-1 text-2xs text-fg-subtle">by {site.parent.name}</span> : null}
    </Link>
  );
}
