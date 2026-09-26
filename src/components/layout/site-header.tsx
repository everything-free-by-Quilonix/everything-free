import Link from "next/link";
import { Icon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";
import { primaryNav } from "@/config/navigation";
import { Brand } from "./brand";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme";

/**
 * Site header.
 *
 * Kept as a server component; only the three genuinely interactive pieces
 * (active-link highlighting, theme toggle, mobile panel) are client components.
 * That keeps the JavaScript on every page to the minimum the header actually
 * needs.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center gap-4">
          <Brand />

          <nav aria-label="Main" className="hidden lg:block">
            <NavLinks items={primaryNav} />
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <Link
              href="/resources"
              className="inline-flex size-10 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
              aria-label="Search resources"
            >
              <Icon name="search" size={18} />
            </Link>

            <ThemeToggle />

            <Link
              href="/submit"
              className={buttonClasses({ variant: "secondary", size: "sm", className: "hidden sm:inline-flex" })}
            >
              Submit
            </Link>

            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  );
}

/**
 * Skip link.
 *
 * First focusable element on the page. Visually hidden until focused, then
 * revealed — a keyboard user should not have to tab through the whole header on
 * every page to reach content (WCAG 2.4.1).
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-fg focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
    >
      Skip to main content
    </a>
  );
}
