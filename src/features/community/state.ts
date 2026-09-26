import type { ZodType } from "zod";

import { toFieldErrors } from "./schema";
import { issueUrl, type ComposedIssue } from "./compose";

/**
 * Shared validation step for the contribution forms.
 *
 * On the trust model: validation runs in the browser, not on a server. That is
 * sound *specifically here*, because nothing is persisted. The output is a URL the
 * contributor opens themselves, and they can edit the resulting issue freely
 * before filing it — so there is no boundary a server-side check would be
 * protecting. Validation exists to help contributors meet the editorial rules, not
 * to defend a datastore.
 *
 * The moment submissions are written anywhere — a database, a bot that files issues
 * automatically, an API — this has to move back behind a server boundary. The Zod
 * schema is deliberately environment-agnostic so that change is an import swap, not
 * a rewrite. This is recorded in `docs/architecture.md` as a migration obligation.
 */

export type ContributionState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors: Record<string, string[]> }
  | { status: "success"; message: string; url: string };

export const idleState: ContributionState = { status: "idle" };

export function validateAndCompose<T>({
  schema,
  values,
  compose,
  successMessage,
  errorMessage,
}: {
  schema: ZodType<T>;
  values: unknown;
  compose: (data: T) => ComposedIssue;
  successMessage: string;
  errorMessage: string;
}): ContributionState {
  const parsed = schema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      message: errorMessage,
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  return {
    status: "success",
    message: successMessage,
    url: issueUrl(compose(parsed.data)),
  };
}

/** Reads a form field as a trimmed string, or undefined when empty. */
export function readField(form: FormData, name: string): string | undefined {
  const value = form.get(name);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
