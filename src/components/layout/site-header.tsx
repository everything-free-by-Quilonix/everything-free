import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";
import { primaryNav } from "@/config/navigation";
import { site } from "@/config/site";
import { PaletteTrigger } from "@/features/palette/palette-trigger";
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
    <header className="material-functional motion-scroll-hairline sticky top-0 z-(--z-header)">
      <Container>
        <div className="flex h-(--header-h) items-center gap-6">
          <Brand />

          <nav aria-label="Main" className="hidden lg:block">
            <NavLinks items={primaryNav} />
          </nav>

          <div className="ml-auto flex items-center gap-1">
            {/* The command palette trigger. Without JS it is a working link to
                the library. */}
            <PaletteTrigger />

            <ThemeToggle />

            <a
              href={site.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ variant: "secondary", size: "sm", className: "hidden sm:inline-flex" })}
            >
              Submit
            </a>

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
      className="sr-only rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-fg focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-(--z-overlay)"
    >
      Skip to main content
    </a>
  );
}
