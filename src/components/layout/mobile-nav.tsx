"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { footerNav, primaryNav } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

/**
 * Mobile navigation, on the shared `Dialog` (`panel-right`).
 *
 * When to use: below `lg`, where the five text nav items do not fit the header.
 * When not to use: on desktop; the header carries the same links inline.
 *
 * Keyboard: "Open menu" opens it with focus on the first control; Tab cycles
 * inside; Escape or "Close menu" closes it and focus returns to "Open menu".
 *
 * Navigating closes it in the link handler rather than in an effect watching the
 * pathname, so no extra render pass runs after the new page has painted. The
 * current item is shown in ink with a leading rule, never gold.
 *
 * Evidence: none.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const titleId = useId();
  const close = () => setOpen(false);
  const secondary = footerNav.find((section) => section.title === "Trust")?.links.filter((link) => !link.external) ?? [];

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          // Safari, and scripted clicks, do not focus a clicked button. Focusing
          // it first makes it the element the dialog returns focus to.
          event.currentTarget.focus();
          setOpen(true);
        }}
        className="inline-flex size-11 items-center justify-center rounded-sm text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg active:bg-(--fill-pressed) lg:hidden"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Icon name="menu" size={20} />
      </button>

      <Dialog open={open} onRequestClose={close} variant="panel-right" labelledBy={titleId}>
        <div className="flex items-center justify-between border-b border-rule px-4 py-2">
          <h2 id={titleId} className="sr-only">
            Menu
          </h2>
          <span aria-hidden="true" className="kicker">
            Menu
          </span>
          <button
            type="button"
            onClick={close}
            className="inline-flex size-11 items-center justify-center rounded-sm text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg active:bg-(--fill-pressed)"
            aria-label="Close menu"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <nav aria-label="Main" className="px-4 pt-2">
          <ul className="divide-y divide-rule">
            {primaryNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "-ml-4 flex h-12 items-center border-l-2 pl-[calc(1rem-2px)] text-base transition-colors",
                      active
                        ? "border-l-fg font-semibold text-fg"
                        : "border-l-transparent text-fg-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {secondary.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-1 border-t border-rule px-4 pt-4">
            {secondary.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={close}
                  className="flex h-10 items-center rounded-xs text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto border-t border-rule p-4">
          <Link
            href="/submit"
            onClick={close}
            className={buttonClasses({ variant: "secondary", size: "md", className: "w-full" })}
          >
            Submit a resource
          </Link>
        </div>
      </Dialog>
    </>
  );
}
