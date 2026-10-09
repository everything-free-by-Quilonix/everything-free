"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

import {
  auditSubscriptions,
  auditSummary,
  BILLING_PERIODS,
  CURRENCIES,
  formatMoney,
  type AlternativeTarget,
  type BillingPeriod,
  type Currency,
  type SubscriptionRow,
} from "../logic/subscription-audit";

/**
 * Subscription audit.
 *
 * Surveys keep finding that people underestimate what they pay for subscriptions,
 * often by more than half. Writing them down is the fix. This tool totals what
 * the user enters and points each paid product at its "free alternatives" page
 * when the library has one. Every amount is the user's own: the project records
 * no prices, so none are looked up or suggested.
 *
 * State lives in this component only. Nothing is stored between visits (the site
 * keeps no client storage beyond the theme), and nothing is sent anywhere.
 */

const PERIOD_LABELS: Record<BillingPeriod, string> = {
  month: "per month",
  year: "per year",
  week: "per week",
};

const fieldClass =
  "w-full rounded-lg border border-border-strong bg-bg px-3 py-2.5 text-sm text-fg transition-colors placeholder:text-fg-subtle focus:border-primary focus:outline-none";

const emptyRow = (): SubscriptionRow => ({ name: "", amount: "", period: "month" });

const SUGGESTION_COUNT = 10;

export function SubscriptionAudit({ targets }: { targets: readonly AlternativeTarget[] }) {
  const [rows, setRows] = useState<SubscriptionRow[]>(() => [emptyRow(), emptyRow(), emptyRow()]);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [copied, setCopied] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const listId = useId();
  const currencyId = useId();
  const rowIdBase = useId();

  const totals = useMemo(() => auditSubscriptions(rows, targets), [rows, targets]);

  // Products the library lists the most alternatives for: a starting point for
  // remembering what you pay for, not a claim that anyone pays for them.
  const suggestions = useMemo(
    () =>
      [...targets]
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
        .slice(0, SUGGESTION_COUNT),
    [targets],
  );
  const used = new Set(rows.map((row) => row.name.trim().toLowerCase()));

  const update = (index: number, patch: Partial<SubscriptionRow>) => {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
    setCopied(false);
  };

  const addSuggestion = (name: string) => {
    setRows((current) => {
      const empty = current.findIndex((row) => row.name.trim().length === 0);
      if (empty === -1) return [...current, { ...emptyRow(), name }];
      return current.map((row, i) => (i === empty ? { ...row, name } : row));
    });
    setAnnouncement(`${name} added. Enter what you pay for it.`);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(auditSummary(totals, currency));
      setCopied(true);
      setAnnouncement("Summary copied to clipboard");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setAnnouncement("Your browser blocked clipboard access. Select the totals and copy them instead.");
    }
  };

  const coveredShare = totals.yearly > 0 ? Math.round((totals.coveredYearly / totals.yearly) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-prose text-sm text-fg-muted">
          List what you pay for each month or year. Amounts are yours: they are never looked up, stored or sent.
        </p>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={currencyId} className="text-sm font-medium text-fg">
            Currency
          </label>
          <select
            id={currencyId}
            value={currency}
            onChange={(event) => setCurrency(event.target.value as Currency)}
            className={cn(fieldClass, "w-auto")}
          >
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset>
        <legend className="text-xs font-semibold tracking-wide text-fg-muted uppercase">Quick add</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {suggestions.map((target) => (
            <Button
              key={target.slug}
              variant="secondary"
              size="sm"
              disabled={used.has(target.name.toLowerCase())}
              onClick={() => addSuggestion(target.name)}
            >
              <Icon name="plus" size={12} />
              {target.name}
            </Button>
          ))}
        </div>
      </fieldset>

      <datalist id={listId}>
        {targets.map((target) => (
          <option key={target.slug} value={target.name} />
        ))}
      </datalist>

      <ol className="flex flex-col gap-3">
        {totals.lines.map((line, index) => {
          const nameId = `${rowIdBase}-name-${index}`;
          const amountId = `${rowIdBase}-amount-${index}`;
          const periodId = `${rowIdBase}-period-${index}`;
          const named = line.row.name.trim().length > 0;
          const badAmount = line.row.amount.trim().length > 0 && line.monthly === null;
          return (
            <li key={index} className="rounded-lg border border-border bg-bg-subtle p-3 sm:p-4">
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_8rem_9rem_auto] sm:items-end">
                <div className="flex flex-col gap-1">
                  <label htmlFor={nameId} className="text-xs font-medium text-fg-muted">
                    Subscription {index + 1}
                  </label>
                  <input
                    id={nameId}
                    list={listId}
                    value={line.row.name}
                    onChange={(event) => update(index, { name: event.target.value })}
                    autoComplete="off"
                    maxLength={80}
                    placeholder="Product name"
                    className={fieldClass}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor={amountId} className="text-xs font-medium text-fg-muted">
                    You pay
                  </label>
                  <input
                    id={amountId}
                    value={line.row.amount}
                    onChange={(event) => update(index, { amount: event.target.value })}
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0.00"
                    aria-invalid={badAmount || undefined}
                    className={cn(fieldClass, "tabular-nums", badAmount && "border-danger")}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor={periodId} className="text-xs font-medium text-fg-muted">
                    Billed
                  </label>
                  <select
                    id={periodId}
                    value={line.row.period}
                    onChange={(event) => update(index, { period: event.target.value as BillingPeriod })}
                    className={fieldClass}
                  >
                    {BILLING_PERIODS.map((period) => (
                      <option key={period} value={period}>
                        {PERIOD_LABELS[period]}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setRows((current) => (current.length === 1 ? [emptyRow()] : current.filter((_, i) => i !== index)));
                    setAnnouncement(named ? `${line.row.name.trim()} removed.` : "Row removed.");
                  }}
                  aria-label={named ? `Remove ${line.row.name.trim()}` : `Remove subscription ${index + 1}`}
                >
                  <Icon name="close" size={14} />
                </Button>
              </div>

              {badAmount ? (
                <p className="mt-2 text-xs text-danger-fg">Enter the amount as a number, such as 9.99 or 1,299.</p>
              ) : null}

              {named ? (
                <p className="mt-2 flex flex-wrap items-center gap-x-2 text-xs text-fg-muted">
                  {line.target ? (
                    <>
                      <Icon name="refresh-cw" size={12} className="shrink-0" />
                      <span>
                        {line.target.count} free {line.target.count === 1 ? "alternative" : "alternatives"} to{" "}
                        <span translate="no">{line.target.name}</span> listed.
                      </span>
                      <Link href={`/alternatives/${line.target.slug}`} className="link-inline font-medium">
                        Compare them
                      </Link>
                    </>
                  ) : (
                    <>
                      <span>No listed alternative under this name yet.</span>
                      <Link
                        href={`/resources?q=${encodeURIComponent(line.row.name.trim())}`}
                        className="link-inline font-medium"
                      >
                        Search the library
                      </Link>
                    </>
                  )}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div>
        <Button variant="secondary" size="sm" onClick={() => setRows((current) => [...current, emptyRow()])}>
          <Icon name="plus" size={14} />
          Add another subscription
        </Button>
      </div>

      <section
        aria-label="Totals"
        className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5"
      >
        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs text-fg-muted">Per month</dt>
            <dd className="mt-0.5 font-display text-2xl font-semibold tabular-nums">
              {formatMoney(totals.monthly, currency)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-fg-muted">Per year</dt>
            <dd className="mt-0.5 font-display text-2xl font-semibold tabular-nums">
              {formatMoney(totals.yearly, currency)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-fg-muted">Has a free alternative listed</dt>
            <dd className="mt-0.5 font-display text-2xl font-semibold tabular-nums">
              {formatMoney(totals.coveredYearly, currency)}
              <span className="text-sm font-normal text-fg-muted"> /yr</span>
            </dd>
          </div>
        </dl>

        {totals.pricedCount > 0 ? (
          <p className="text-sm text-fg-muted">
            {totals.coveredCount} of {totals.pricedCount} {totals.pricedCount === 1 ? "subscription has" : "subscriptions have"}{" "}
            free alternatives in the library{totals.coveredCount > 0 ? `, ${coveredShare}% of what you spend` : ""}. An
            alternative is rarely a like-for-like swap: open each one and check its limitations before cancelling
            anything.
          </p>
        ) : (
          <p className="text-sm text-fg-muted">Totals appear as you enter amounts.</p>
        )}

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <Button onClick={() => void copy()} disabled={totals.pricedCount === 0} size="md">
            <Icon name={copied ? "check" : "copy"} size={16} />
            {copied ? "Copied" : "Copy summary"}
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={() => {
              setRows([emptyRow(), emptyRow(), emptyRow()]);
              setAnnouncement("Cleared.");
            }}
          >
            Start over
          </Button>
        </div>
      </section>

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
