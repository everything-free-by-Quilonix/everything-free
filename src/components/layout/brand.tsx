import Link from "next/link";
import { site } from "@/config/site";
import { cn } from "@/lib/utils/cn";

/**
 * The brand lockup.
 *
 * Everything.Free is the product; Quilonix is the parent and is deliberately
 * secondary in the interface — present for provenance, never competing for
 * attention. The dot is styled rather than typed as punctuation so "Everything"
 * and "Free" read as one name.
 */
export function Brand({ className, showParent = false }: { className?: string; showParent?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5 rounded", className)}>
      <span
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary font-display text-sm font-bold text-primary-fg"
      >
        EF
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[15px] font-semibold tracking-tight">
          Everything<span className="text-primary">.</span>Free
        </span>
        {showParent ? (
          <span className="mt-0.5 text-[11px] font-normal text-fg-subtle">by {site.parent.name}</span>
        ) : null}
      </span>
    </Link>
  );
}
