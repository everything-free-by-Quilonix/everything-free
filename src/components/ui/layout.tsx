import type { ElementType, ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils/cn";

/**
 * Layout primitives.
 *
 * `Container` is the only place horizontal page padding is defined, so every
 * section aligns to the same gutter without each one re-deciding.
 */

export function Container({
  children,
  className,
  width = "content",
}: {
  children: ReactNode;
  className?: string;
  width?: "content" | "prose";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        width === "content" ? "max-w-(--container-content)" : "max-w-(--container-prose)",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * A titled page section.
 *
 * Takes the heading level explicitly rather than guessing, because a correct
 * heading outline is the primary way screen-reader users navigate a long page.
 */
export function Section({
  title,
  description,
  action,
  children,
  className,
  headingLevel = "h2",
  id,
}: {
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  headingLevel?: "h2" | "h3";
  id?: string;
}) {
  const Heading = headingLevel as ElementType;
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <section className={cn("py-12 sm:py-16", className)} id={id} aria-labelledby={headingId}>
      {title ? (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <Heading id={headingId} className="text-xl font-semibold tracking-tight sm:text-2xl">
              {title}
            </Heading>
            {description ? <p className="mt-2 text-sm text-fg-muted sm:text-base">{description}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

/** "See all" style link with a trailing chevron. */
export function SectionLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-md text-sm font-medium text-fg-muted transition-colors hover:text-fg"
    >
      {children}
      <Icon name="chevron-right" size={16} />
    </Link>
  );
}

/** Standard page heading block. */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: ReactNode;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-border bg-bg-subtle py-10 sm:py-14">
      <Container>
        {eyebrow ? <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-fg-muted">{eyebrow}</div> : null}
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {description ? <p className="mt-4 max-w-3xl text-base leading-relaxed text-fg-muted">{description}</p> : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </Container>
    </header>
  );
}

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Breadcrumbs as an ordered list inside a labelled nav, which is what assistive
 * technology expects. The current page is marked with `aria-current`.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-fg-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="rounded transition-colors hover:text-fg">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={isLast ? "text-fg" : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast ? <Icon name="chevron-right" size={14} className="text-fg-subtle" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
