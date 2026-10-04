"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

/**
 * Desktop navigation links.
 *
 * A client component solely to read the pathname for active state. The active
 * item carries `aria-current="page"`, a stronger text colour and an underline
 * mark, so the current location never relies on colour alone. Every item uses
 * the same weight, so moving between pages does not reflow the bar.
 */
export function NavLinks({ items }: { items: NavLink[] }) {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-0.5 xl:gap-1">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative inline-flex h-9 items-center rounded-full px-3 text-sm font-medium whitespace-nowrap",
                "transition-colors duration-(--duration-hover) ease-(--ease-standard)",
                // The underline mark: present on every link so hover and active
                // states animate the same element instead of swapping styles.
                "after:pointer-events-none after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full",
                "after:transition-[opacity,transform,background-color] after:duration-(--duration-hover) after:ease-(--ease-standard)",
                active
                  ? "text-fg after:scale-x-100 after:bg-primary after:opacity-100"
                  : "text-fg-muted after:scale-x-50 after:bg-fg-subtle after:opacity-0 hover:text-fg hover:after:scale-x-100 hover:after:opacity-40",
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
