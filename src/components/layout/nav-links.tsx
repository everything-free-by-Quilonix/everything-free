"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

/**
 * Desktop navigation links.
 *
 * A client component solely to read the pathname for active state. The active
 * item carries `aria-current="page"` as well as a visual treatment, so the
 * current location is conveyed without relying on colour.
 */
export function NavLinks({ items }: { items: NavLink[] }) {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-1">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex h-10 items-center rounded-sm px-3 text-sm transition-colors",
                active ? "bg-surface-raised font-medium text-fg" : "text-fg-muted hover:bg-surface-hover hover:text-fg",
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
