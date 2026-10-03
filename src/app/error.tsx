"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Icon } from "@/components/icons";
import { Button, buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";

/**
 * Route error boundary.
 *
 * Shows the digest rather than the raw message. Next replaces server error
 * messages with a digest in production precisely so internal details are not
 * leaked to the browser, and displaying the digest gives a user something to quote
 * in a bug report without exposing a stack trace.
 */
export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // No error-reporting service is wired up, and adding a third-party one would
    // contradict the privacy position. The console is the honest destination.
    console.error("Route error:", error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span
        aria-hidden="true"
        className="flex size-12 items-center justify-center rounded-full border border-danger/30 bg-danger-soft text-danger-fg"
      >
        <Icon name="alert-triangle" size={22} />
      </span>

      <h1 className="mt-6 font-serif text-3xl font-semibold">Something went wrong</h1>
      <p className="mt-3 max-w-md text-fg-muted">
        This page failed to load. Trying again often works; if it does not, the problem is on our side.
      </p>

      {error.digest ? (
        <p className="mt-4 rounded-xs bg-surface-raised px-3 py-1.5 font-mono text-xs text-fg-subtle">
          Reference: {error.digest}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset} size="md">
          <Icon name="refresh-cw" size={16} />
          Try again
        </Button>
        <Link href="/" className={buttonClasses({ variant: "secondary", size: "md" })}>
          Go to the homepage
        </Link>
      </div>
    </Container>
  );
}
