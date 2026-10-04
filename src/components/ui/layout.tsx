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
 *
 * `variant="editorial"` is the running-head layout: a 1px rule above, the kicker
 * in a three-column margin from `lg` (above the title below it), and the serif
 * title, standfirst and content in the nine-column field. The kicker is a `<p>`,
 * never a heading, and there is at most one per section.
 */
export function Section({
  title,
  description,
  action,
  children,
  className,
  headingLevel = "h2",
  id,
  kicker,
  variant = "default",
}: {
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  headingLevel?: "h2" | "h3";
  id?: string;
  kicker?: string;
  variant?: "default" | "editorial";
}) {
  const Heading = headingLevel as ElementType;
  const headingId = id ? `${id}-heading` : undefined;

  if (variant === "editorial") {
    return (
      <section
        className={cn("editorial border-t border-border py-16 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:py-24", className)}
        id={id}
        aria-labelledby={headingId}
      >
        <div className="lg:col-span-3">{kicker ? <p className="kicker mb-3 lg:mt-2 lg:mb-0">{kicker}</p> : null}</div>
        <div className="min-w-0 lg:col-span-9">
          {title ? (
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-(--measure-standfirst)">
                <Heading id={headingId} className="text-2xl font-semibold">
                  {title}
                </Heading>
                {description ? <p className="mt-3 text-base text-fg-muted">{description}</p> : null}
              </div>
              {action ? <div className="shrink-0">{action}</div> : null}
            </div>
          ) : null}
          {children}
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-12 sm:py-16", className)} id={id} aria-labelledby={headingId}>
      {title ? (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            {kicker ? <p className="kicker mb-2">{kicker}</p> : null}
            <Heading id={headingId} className="text-xl font-semibold sm:text-2xl">
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

/** "See all" style link: a chrome text link with a trailing arrow (the one place arrow-right is used). */
export function SectionLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-xs text-sm font-medium text-fg-muted underline-offset-[0.2em] transition-colors hover:text-fg hover:underline"
    >
      {children}
      <Icon name="arrow-right" size={14} />
    </Link>
  );
}

/** Standard page heading block. */
export function PageHeader({
  eyebrow,
  kicker,
  title,
  description,
  children,
}: {
  eyebrow?: ReactNode;
  /** A running head above the title, rendered as a `<p>`. */
  kicker?: string;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-border bg-bg-subtle py-12 sm:py-16">
      <Container>
        {kicker ? <p className="kicker mb-3">{kicker}</p> : null}
        {eyebrow ? <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-fg-muted">{eyebrow}</div> : null}
        <h1 className="font-serif text-3xl font-semibold">{title}</h1>
        {description ? (
          <p className="mt-4 max-w-(--measure-standfirst) text-lg text-fg-muted">{description}</p>
        ) : null}
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
      <ol className="flex flex-wrap items-center gap-2 text-xs text-fg-subtle">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="rounded-xs underline-offset-[0.2em] transition-colors hover:text-fg hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={isLast ? "text-fg" : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast ? <span aria-hidden="true">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
