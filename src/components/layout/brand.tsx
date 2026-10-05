import Link from "next/link";
import { withBasePath } from "@/config/deployment";
import { site } from "@/config/site";
import { cn } from "@/lib/utils/cn";

/**
 * The brand lockup.
 *
 * Faithfully matches the official Everything.Free brand assets:
 * 1. Squircle icon with lowercase 'e' and signature architectural gold square
 * 2. Wordmark with square golden period between Everything and Free
 */
export function Brand({
  className,
  showParent = false,
  onClick,
}: {
  className?: string;
  showParent?: boolean;
  /** Lets an overlay (the mobile menu) close itself when the brand navigates home. */
  onClick?: () => void;
}) {
  return (
    <Link href="/" onClick={onClick} className={cn("group inline-flex items-center gap-2.5 rounded-lg select-none", className)}>
      {/* Authentic 'e.' squircle brand mark matching uploaded assets */}
      <span
        aria-hidden="true"
        className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-border/60 bg-surface shadow-xs transition-transform duration-200 group-hover:scale-105"
      >
        {/* Light mode brand icon */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={withBasePath("/brand/logo-light.png")}
          alt=""
          width={32}
          height={32}
          className="size-full object-cover dark:hidden"
        />
        {/* Dark mode brand icon */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={withBasePath("/brand/logo-dark.png")}
          alt=""
          width={32}
          height={32}
          className="hidden size-full object-cover dark:block"
        />
      </span>

      <span className="flex flex-col leading-none">
        <span className="flex items-center font-display text-[15.5px] font-bold tracking-tight text-fg transition-colors group-hover:text-fg">
          Everything
          {/* Signature golden square period from brand asset 02/03 */}
          <span className="mx-0.5 inline-block size-[5.5px] rounded-[1px] bg-primary self-center" />
          Free
        </span>
        {showParent ? (
          <span className="mt-0.5 text-[11px] font-normal text-fg-subtle">by {site.parent.name}</span>
        ) : null}
      </span>
    </Link>
  );
}
