"use client";

import { useEffect, useState } from "react";

import { Icon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button";

/**
 * Mobile action bar: keeps a record's primary action, "Open {host}", within
 * reach once the header's actions have scrolled away.
 *
 * When to use: once per record page, below `lg`. When not to use: on wide
 * screens (the header actions stay near), or for any secondary action.
 *
 * Keyboard: one link. While hidden it is `visibility: hidden`, so it leaves the
 * tab order. Below `lg`, once its space is reserved, `main` and
 * `scroll-padding-bottom` gain its height (materials.css), so it never covers
 * the focused element.
 *
 * Evidence: none. It is the same outbound link as the header's.
 *
 * One `IntersectionObserver` watches the header action group and the footer.
 * Layout and visibility are separate: `data-reserved` (the page's bottom
 * space) follows the header actions only, set once they are above the
 * viewport and cleared when they return. `data-visible` also needs the footer
 * out of view, so the bar never sits over the footer, and hiding it there
 * never moves the page. Without JavaScript or the observer it never appears,
 * and the header action remains.
 */
export function MobileActionBar({ href, host }: { href: string; host: string }) {
  const [reserved, setReserved] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const actions = document.querySelector("[data-record-actions]");
    // The site footer is the page's last <footer>.
    const footer = [...document.querySelectorAll("footer")].at(-1);
    if (!actions) return;

    let actionsAbove = false;
    let footerInView = false;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === actions) actionsAbove = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        else footerInView = entry.isIntersecting;
      }
      setReserved(actionsAbove);
      setVisible(actionsAbove && !footerInView);
    });
    observer.observe(actions);
    if (footer) observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="action-bar material-functional motion-action-bar fixed inset-x-0 bottom-0 z-(--z-sticky) border-t border-b-0 border-rule px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
      data-reserved={reserved ? "" : undefined}
      data-visible={visible ? "" : undefined}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses({ variant: "primary", size: "md", className: "w-full" })}
      >
        Open <span translate="no">{host}</span>
        <Icon name="external-link" size={15} />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}
