import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils/cn";

/**
 * Link to a third-party site.
 *
 * Always carries `rel="noopener noreferrer"`. `noopener` is a security measure:
 * without it a target page can reach back through `window.opener`. `noreferrer`
 * additionally withholds the referring URL, so browsing the library does not leak
 * what a user was looking at to every vendor they click through to.
 *
 * The icon is decorative; the fact that a link leaves the site is stated in text
 * for screen-reader users, since an icon alone would not convey it.
 */
export function ExternalLink({
  href,
  children,
  className,
  showIcon = true,
  announceExternal = true,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  showIcon?: boolean;
  announceExternal?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...rest}
    >
      {children}
      {showIcon ? <Icon name="external-link" size={14} className="shrink-0 opacity-70" /> : null}
      {announceExternal ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}

/** Extracts a display hostname, e.g. "gimp.org" from a full URL. */
export function displayHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
