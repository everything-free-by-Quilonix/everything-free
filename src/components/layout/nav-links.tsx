"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

/**
 * Desktop navigation: five text items, no icons.
 *
 * A client component solely to read the pathname for the current item, which
 * carries `aria-current="page"`, ink text and a 2px gold underline at the
 * header's bottom edge, so the location is conveyed without relying on colour.
 */
export function NavLinks({ items }: { items: NavLink[] }) {
  const pathname = usePathname();

  return (
    <ul className="flex h-full items-center gap-0.5">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <li key={item.href} className="flex shrink-0">
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex items-center whitespace-nowrap px-2 py-1 rounded-md text-xs font-medium transition-colors xl:px-2.5 xl:py-1.5 xl:text-sm",
                active
                  ? "bg-surface-raised text-fg font-medium shadow-2xs"
                  : "text-fg-muted hover:text-fg hover:bg-surface-hover/60",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

