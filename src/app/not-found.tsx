import Link from "next/link";

import { Icon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";
import { primaryNav } from "@/config/navigation";
import { SearchBox } from "@/features/search/components/search-box";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * 404 page.
 *
 * Treated as a navigation opportunity rather than a dead end: a search field and
 * the main sections, because someone landing here was looking for something and
 * still is.
 */
export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span
        aria-hidden="true"
        className="flex size-12 items-center justify-center rounded-full border border-border bg-surface text-fg-subtle"
      >
        <Icon name="compass" size={22} />
      </span>

      <h1 className="mt-6 font-serif text-3xl font-semibold">
        This page does not exist
      </h1>
      <p className="mt-3 max-w-md text-fg-muted">
        The link may be out of date, or the resource may have been removed from the library. Try searching for what you
        needed.
      </p>

      <div className="mt-8 w-full max-w-xl">
        <SearchBox size="md" label="Search free resources" />
      </div>

      <nav aria-label="Main sections" className="mt-8">
        <ul className="flex flex-wrap justify-center gap-2">
          {primaryNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={buttonClasses({ variant: "secondary", size: "sm" })}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
