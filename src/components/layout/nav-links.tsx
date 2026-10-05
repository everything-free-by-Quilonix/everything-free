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
    <ul className="flex h-(--header-h) items-stretch gap-1">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <li key={item.href} className="flex">
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex items-center border-y-2 border-transparent px-3 text-sm font-medium transition-colors",
                active ? "border-b-primary text-fg" : "text-fg-muted hover:text-fg",
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
