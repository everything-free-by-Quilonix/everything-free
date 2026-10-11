import Link from "next/link";
import { Icon } from "@/components/icons";
import { Container } from "@/components/ui/layout";
import { ExternalLink } from "@/components/ui/external-link";
import { footerNav } from "@/config/navigation";
import { site } from "@/config/site";
import { Brand } from "./brand";

/** Chrome text link: muted, ink and underlined on hover. */
const footerLink =
  "inline-block rounded-xs text-sm text-fg-muted underline-offset-[0.2em] transition-colors hover:text-fg hover:underline pointer-coarse:py-2";

/**
 * Site footer: four text columns, social connections, and a colophon.
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
        <div className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-8">
          <div className="max-w-sm lg:col-span-3">
            <Brand showParent />
            <p className="mt-4 text-sm text-fg-muted">{site.description}</p>

            <div className="mt-5 flex items-center gap-2 text-fg-muted">
              <a
                href={site.social.website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Quilonix Website"
                title="Quilonix Website"
                className="inline-flex size-8 items-center justify-center rounded-xs text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
              >
                <Icon name="globe" size={17} />
              </a>
              <a
                href={site.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Quilonix on GitHub"
                title="Quilonix on GitHub"
                className="inline-flex size-8 items-center justify-center rounded-xs text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
              >
                <Icon name="github" size={17} />
              </a>
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Quilonix on LinkedIn"
                title="Quilonix on LinkedIn"
                className="inline-flex size-8 items-center justify-center rounded-xs text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
              >
                <Icon name="linkedin" size={17} />
              </a>
              <a
                href={site.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Quilonix on YouTube"
                title="Quilonix on YouTube"
                className="inline-flex size-8 items-center justify-center rounded-xs text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
              >
                <Icon name="youtube" size={17} />
              </a>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Quilonix on Instagram"
                title="Quilonix on Instagram"
                className="inline-flex size-8 items-center justify-center rounded-xs text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
              >
                <Icon name="instagram" size={17} />
              </a>
            </div>
          </div>

          <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-4">
            {footerNav.map((section) => (
              <div key={section.title}>
                <h2 className="kicker">{section.title}</h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      {link.external ? (
                        <ExternalLink href={link.href} className={footerLink}>
                          {link.label}
                        </ExternalLink>
                      ) : (
                        <Link href={link.href} className={footerLink}>
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

        <div className="flex flex-col gap-4 border-t border-rule py-6 text-xs text-fg-subtle sm:flex-row sm:justify-between">
          <p>
            © {year} {site.name}, a{" "}
            <a
              href={site.parent.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-fg underline decoration-rule underline-offset-2 transition-colors hover:text-fg"
            >
              {site.parent.name}
            </a>{" "}
            project. Released as open source. Set in Source Serif 4 and Inter.
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
