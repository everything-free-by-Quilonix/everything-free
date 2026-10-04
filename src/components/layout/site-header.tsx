import Link from "next/link";
import { Icon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";
import { primaryNav } from "@/config/navigation";
import { Brand } from "./brand";
import { HeaderScrollSentinel } from "./header-scroll";
import { HeaderSearch } from "./header-search";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme";

/**
 * Site header: a floating capsule inside the page gutters.
 *
 * Kept as a server component; only the genuinely interactive pieces (active-link
 * highlighting, search shortcut, theme toggle, mobile panel, scroll state) are
 * client components, which keeps the JavaScript on every page to the minimum the
 * header actually needs.
 *
 * The sticky `<header>` has a fixed footprint (`--header-space`) and is
 * transparent and click-through; only the capsule takes pointer events. Compacting
 * on scroll changes the capsule, never the header's height, so nothing below it
 * moves. Hierarchy inside the capsule: brand, then navigation, then the search and
 * theme utilities, then Submit as the one filled control.
 */
export function SiteHeader() {
  return (
    <>
      <HeaderScrollSentinel />
      <header id="site-header" className="pointer-events-none sticky top-0 z-40 h-(--header-space)">
        <Container>
          <div className="site-capsule pointer-events-auto mx-auto flex items-center gap-2 pr-1.5 pl-4 sm:pl-5 lg:pr-2.5">
            <Brand className="shrink-0" />

            <nav aria-label="Main" className="ml-6 hidden lg:block xl:ml-8">
              <NavLinks items={primaryNav} />
            </nav>

            <div className="ml-auto flex items-center gap-1">
              <HeaderSearch />

              {/* Below `sm` the theme control lives in the menu, keeping the bar to
                  brand, search and menu. */}
              <div className="hidden sm:flex">
                <ThemeToggle />
              </div>

              <span aria-hidden="true" className="mx-1.5 hidden h-5 w-px bg-border lg:block" />

              <Link
                href="/submit"
                className={buttonClasses({
                  variant: "accent",
                  size: "sm",
                  shape: "pill",
                  className: "hidden sm:inline-flex pr-3 pl-3.5",
                })}
              >
                <span>Submit</span>
                <Icon
                  name="arrow-right"
                  size={14}
                  strokeWidth={2}
                  className="btn-icon-shift"
                  data-arrow="true"
                />
              </Link>

              <MobileNav />
            </div>
          </div>
        </Container>
      </header>
    </>
  );
}

/**
 * Skip link.
 *
 * First focusable element on the page. Visually hidden until focused, then
 * revealed above the header — a keyboard user should not have to tab through the
 * whole header on every page to reach content (WCAG 2.4.1).
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only rounded-full bg-primary text-sm font-medium text-primary-fg shadow-raised focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2.5"
    >
      Skip to main content
    </a>
  );
}
