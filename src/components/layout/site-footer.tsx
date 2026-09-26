import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { ExternalLink } from "@/components/ui/external-link";
import { footerNav } from "@/config/navigation";
import { site } from "@/config/site";
import { Brand } from "./brand";

/**
 * Site footer.
 *
 * Carries the disclaimer about third-party ownership. That statement is load-
 * bearing rather than boilerplate: the library describes products operated by
 * other people, and it must never read as though Everything.Free runs them.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-bg-subtle">
      <Container>
        <div className="grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_2fr]">
          <div className="max-w-sm">
            <Brand showParent />
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">{site.description}</p>
            <p className="mt-4 text-sm font-medium text-fg">{site.tagline}</p>
          </div>

          <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {footerNav.map((section) => (
              <div key={section.title}>
                <h2 className="font-display text-xs font-semibold tracking-wide text-fg uppercase">{section.title}</h2>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      {link.external ? (
                        <ExternalLink
                          href={link.href}
                          className="rounded text-sm text-fg-muted transition-colors hover:text-fg"
                        >
                          {link.label}
                        </ExternalLink>
                      ) : (
                        <Link href={link.href} className="rounded text-sm text-fg-muted transition-colors hover:text-fg">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-border py-6 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}, a {site.parent.name} project. Released as open source.
          </p>
          <p className="max-w-xl sm:text-right">
            Resources listed here are owned and operated by their respective providers. Everything.Free is not
            affiliated with them, and their terms and pricing can change at any time.
          </p>
        </div>
      </Container>
    </footer>
  );
}
