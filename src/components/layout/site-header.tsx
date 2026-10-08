import { buttonClasses } from "@/components/ui/button";
import { primaryNav } from "@/config/navigation";
import { site } from "@/config/site";
import { PaletteTrigger } from "@/features/palette/palette-trigger";
import { Brand } from "./brand";
import { HeaderScrollSentinel } from "./header-scroll";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme";

/**
 * Floating Editorial Capsule Header.
 *
 * Implements the Apple/Linear-grade floating capsule navigation bar:
 * - Floating surface with subtle neutral blur and refined edge
 * - Max width: 1240px, top offset: 12-16px
 * - Subtly compresses on scroll without jarring jumps
 * - Compact mobile header preserving brand, search and menu touch targets
 */
export function SiteHeader() {
  return (
    <header
      id="site-header"
      className="sticky top-0 z-(--z-header) w-full pt-3 sm:pt-4 px-3 sm:px-6 pointer-events-none transition-[padding]"
    >
      <HeaderScrollSentinel />
      <div className="mx-auto w-full max-w-[1240px] pointer-events-auto">
        <div className="capsule-header flex h-13 sm:h-14 items-center gap-3 sm:gap-6 px-3.5 sm:px-6 transition-[height,box-shadow]">
          <Brand />

          <nav aria-label="Main" className="hidden lg:block ml-1">
            <NavLinks items={primaryNav} />
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {/* Command palette search trigger */}
            <PaletteTrigger />

            <ThemeToggle />

            <a
              href={site.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({
                variant: "secondary",
                size: "sm",
                className: "hidden md:inline-flex",
              })}
            >
              Submit
            </a>

            <MobileNav />
          </div>
        </div>
      </div>
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
