"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { Callout } from "@/components/ui/callout";
import { ResourceGrid } from "@/features/resources/components/resource-card";
import { cn } from "@/lib/utils/cn";
import type { Resource } from "@/types/resource";
import type { EvidenceFilterKey } from "@/types/search";
import {
  AI_NEEDS,
  FINDER_PROMISES,
  findAi,
  RUNS_ON,
  RUNS_ON_LABELS,
  type RunsOn,
} from "../finder";

/**
 * The "Which free AI should I use?" finder.
 *
 * Runs over the AI listings handed down at build time, with the library's own
 * filter predicates (`features/ai/finder.ts`). With JavaScript off, the page
 * still shows the first job's listings, which is what the server renders.
 */
export function AiFinder({ resources }: { resources: readonly Resource[] }) {
  const [needId, setNeedId] = useState(AI_NEEDS[0].id);
  const [runsOn, setRunsOn] = useState<RunsOn>("any");
  const [promises, setPromises] = useState<EvidenceFilterKey[]>([]);
  const needName = useId();
  const runsName = useId();

  const result = useMemo(() => findAi(resources, { needId, runsOn, promises }), [resources, needId, runsOn, promises]);

  const toggle = (key: EvidenceFilterKey) =>
    setPromises((current) => (current.includes(key) ? current.filter((k) => k !== key) : [...current, key]));

  const choiceClass = (checked: boolean) =>
    cn(
      "flex cursor-pointer items-start gap-2.5 rounded-sm border px-3 py-2.5 text-sm transition-colors",
      "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-(--focus)",
      checked ? "border-fg bg-surface-raised text-fg" : "border-border-strong text-fg-muted hover:bg-surface-hover hover:text-fg",
    );

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <fieldset>
          <legend className="font-display text-base font-semibold">1. What do you want to do?</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {AI_NEEDS.map((need) => (
              <label key={need.id} className={choiceClass(needId === need.id)}>
                <input
                  type="radio"
                  name={needName}
                  value={need.id}
                  checked={needId === need.id}
                  onChange={() => setNeedId(need.id)}
                  className="mt-0.5 size-4 shrink-0"
                />
                <span>
                  <span className="block font-medium text-fg">{need.label}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-fg-muted">{need.description}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-6">
          <fieldset>
            <legend className="font-display text-base font-semibold">2. Where?</legend>
            <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1">
              {RUNS_ON.map((value) => (
                <label key={value} className={choiceClass(runsOn === value)}>
                  <input
                    type="radio"
                    name={runsName}
                    value={value}
                    checked={runsOn === value}
                    onChange={() => setRunsOn(value)}
                    className="mt-0.5 size-4 shrink-0"
                  />
                  {RUNS_ON_LABELS[value]}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-base font-semibold">3. Must have (confirmed)</legend>
            <div className="mt-3 flex flex-col gap-2.5">
              {FINDER_PROMISES.map((promise) => (
                <label key={promise.key} className="flex cursor-pointer items-center gap-2.5 text-sm text-fg">
                  <input
                    type="checkbox"
                    checked={promises.includes(promise.key)}
                    onChange={() => toggle(promise.key)}
                    className="size-4 shrink-0"
                  />
                  {promise.label}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs leading-snug text-fg-subtle">
              Only listings where an official source confirms it. A value nobody has checked does not count.
            </p>
          </fieldset>
        </div>
      </div>

      <section aria-labelledby="finder-results" className="flex flex-col gap-4">
        <div role="status" aria-live="polite">
          <h2 id="finder-results" className="font-display text-lg font-semibold">
            {result.matches.length === 0
              ? "No listings match"
              : `${result.matches.length} free option${result.matches.length === 1 ? "" : "s"} for “${result.need.label.toLowerCase()}”`}
          </h2>
          {result.heldBack > 0 ? (
            <p className="mt-1 text-sm text-fg-muted">
              {result.heldBack} more record {promises.length === 1 ? "this" : "these"}, but nobody has confirmed{" "}
              {promises.length === 1 ? "it" : "them"} against the provider&rsquo;s own pages yet, so they are left out.
              Clear a &ldquo;must have&rdquo; to see them, then check each listing&rsquo;s evidence.
            </p>
          ) : (
            <p className="mt-1 text-sm text-fg-muted">
              Ordered by how much of each listing has been checked, then by name. There are no ratings or popularity
              figures, because the library does not collect them.
            </p>
          )}
        </div>

        {result.need.privateChat && (runsOn === "any" || runsOn === "browser" || runsOn === "computer") ? (
          <Callout tone="neutral" icon="lock" title="Or try one right here, privately">
            A small open-source model can run on your own device in this browser: no account, and your messages never
            leave it. It is much less capable than the big assistants below.{" "}
            <Link href="/tools/private-ai-chat" className="link-inline font-medium">
              Open the private AI chat
            </Link>
          </Callout>
        ) : null}

        {result.matches.length > 0 ? (
          <ResourceGrid resources={result.matches} label={`Free AI options for ${result.need.label.toLowerCase()}`} />
        ) : (
          <p className="rounded-sm border border-dashed border-border bg-bg-subtle px-4 py-8 text-center text-sm text-fg-muted">
            Nothing in the library matches all of those. Try &ldquo;Anywhere&rdquo;, or clear a &ldquo;must
            have&rdquo;.
          </p>
        )}
      </section>
    </div>
  );
}
