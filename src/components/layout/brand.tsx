import Link from "next/link";
import { withBasePath } from "@/config/deployment";
import { site } from "@/config/site";
import { cn } from "@/lib/utils/cn";

/**
 * The wordmark: "Everything", a gold dot, "Free", set in Inter 600.
 *
 * Incorporates the authentic brand squircle mark alongside the official
 * wordmark with the signature gold period.
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
    <Link
      href="/"
      onClick={onClick}
      className={cn("group inline-flex items-center gap-2 rounded-xs select-none", className)}
    >
      <span
        aria-hidden="true"
        className="relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-xs border border-border bg-surface"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={withBasePath("/brand/logo-light.png")}
          alt=""
          width={24}
          height={24}
          className="size-full object-cover dark:hidden"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={withBasePath("/brand/logo-dark.png")}
          alt=""
          width={24}
          height={24}
          className="hidden size-full object-cover dark:block"
        />
      </span>

      <span className="inline-flex flex-col leading-none">
        <span className="text-base font-semibold tracking-[-0.011em] text-fg">
          Everything<span className="text-primary">.</span>Free
        </span>
        {showParent ? <span className="mt-1 text-2xs text-fg-subtle">by {site.parent.name}</span> : null}
      </span>
    </Link>
  );
}
