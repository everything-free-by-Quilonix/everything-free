"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

import {
  buildTrialCalendar,
  localToday,
  MAX_NAME_LENGTH,
  MAX_REMIND_DAYS,
  MAX_TRIAL_DAYS,
  trialSchedule,
  validateTrial,
  type TrialInput,
} from "../logic/trial-reminder";

/**
 * Trial reminder.
 *
 * The user lists the free trials they have started; the tool works out when each
 * one converts to paid and produces a calendar file with a reminder before that
 * date. The file is assembled in memory and offered as a download through an
 * object URL, so nothing leaves the device. There is deliberately no "add to
 * Google Calendar" link: that would send the trial details to a third party in a
 * URL, which the tool's privacy declaration says never happens.
 */

const LENGTH_PRESETS = [7, 14, 30];

const fieldClass =
  "w-full rounded-lg border border-border-strong bg-bg px-3 py-2.5 text-sm text-fg transition-colors placeholder:text-fg-subtle focus:border-primary focus:outline-none";

function formatLongDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function countdown(days: number): string {
  if (days < 0) return `charge date passed ${-days} ${-days === 1 ? "day" : "days"} ago`;
  if (days === 0) return "may charge today";
  if (days === 1) return "may charge tomorrow";
  return `may charge in ${days} days`;
}

const subscribeNever = () => () => {};
const serverToday = () => null;

export function TrialReminder() {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [lengthDays, setLengthDays] = useState("7");
  const [remindDaysBefore, setRemindDaysBefore] = useState("2");
  const [priceAfter, setPriceAfter] = useState("");
  const [cancelUrl, setCancelUrl] = useState("");
  const [trials, setTrials] = useState<TrialInput[]>([]);
  const [problems, setProblems] = useState<string[]>([]);
  const [includeChargeDay, setIncludeChargeDay] = useState(true);
  const [announcement, setAnnouncement] = useState("");

  const ids = {
    name: useId(),
    start: useId(),
    length: useId(),
    remind: useId(),
    price: useId(),
    url: useId(),
    errors: useId(),
    chargeDay: useId(),
  };

  // "Today" is the visitor's date, which the static build cannot know. The server
  // snapshot is null, so the prerendered HTML and hydration agree, and the client
  // fills it in straight after.
  const today = useSyncExternalStore(subscribeNever, localToday, serverToday);
  // An untouched start date means "today".
  const effectiveStart = startDate || today || "";

  const draft: TrialInput = {
    name,
    startDate: effectiveStart,
    lengthDays: Number(lengthDays),
    remindDaysBefore: Number(remindDaysBefore),
    priceAfter,
    cancelUrl,
  };
  const draftValid = validateTrial(draft).length === 0;
  const preview = draftValid && today ? trialSchedule(draft, today) : null;

  const add = () => {
    const found = validateTrial(draft);
    setProblems(found);
    if (found.length > 0) {
      setAnnouncement(`Not added. ${found.length} ${found.length === 1 ? "problem" : "problems"} to fix.`);
      return;
    }
    setTrials((current) => [...current, { ...draft, name: draft.name.trim() }]);
    setAnnouncement(`${draft.name.trim()} added. ${trials.length + 1} in the list.`);
    setName("");
    setPriceAfter("");
    setCancelUrl("");
  };

  const remove = (index: number) => {
    const removed = trials[index];
    setTrials((current) => current.filter((_, i) => i !== index));
    setAnnouncement(`${removed.name} removed.`);
  };

  /*
   * The file is built at the moment of the click, from the current list, and its
   * object URL is revoked once the browser has started the download, so no URL
   * outlives the action that needed it.
   */
  const download = () => {
    if (trials.length === 0) return;
    const ics = buildTrialCalendar(trials, { includeChargeDay });
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "trial-reminders.ics";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setAnnouncement(
      `Calendar file with ${trials.length} ${trials.length === 1 ? "trial" : "trials"} downloaded. Open it to add the reminders.`,
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <form
        className="flex flex-col gap-5"
        aria-describedby={problems.length > 0 ? ids.errors : undefined}
        onSubmit={(event) => {
          event.preventDefault();
          add();
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor={ids.name} className="text-sm font-medium text-fg">
              Service
            </label>
            <input
              id={ids.name}
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={MAX_NAME_LENGTH}
              autoComplete="off"
              placeholder="e.g. a streaming, design or AI service"
              className={fieldClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={ids.start} className="text-sm font-medium text-fg">
              Trial started on
            </label>
            <input
              id={ids.start}
              type="date"
              value={effectiveStart}
              onChange={(event) => setStartDate(event.target.value)}
              className={fieldClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={ids.length} className="text-sm font-medium text-fg">
              Free for (days)
            </label>
            <input
              id={ids.length}
              type="number"
              inputMode="numeric"
              min={1}
              max={MAX_TRIAL_DAYS}
              value={lengthDays}
              onChange={(event) => setLengthDays(event.target.value)}
              className={fieldClass}
            />
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Common trial lengths">
              {LENGTH_PRESETS.map((days) => (
                <button
                  key={days}
                  type="button"
                  aria-pressed={lengthDays === String(days)}
                  onClick={() => setLengthDays(String(days))}
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-xs transition-colors pointer-coarse:py-2",
                    lengthDays === String(days)
                      ? "border-primary bg-primary-soft text-fg"
                      : "border-border-strong text-fg-muted hover:text-fg",
                  )}
                >
                  {days} days
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={ids.remind} className="text-sm font-medium text-fg">
              Remind me (days before)
            </label>
            <input
              id={ids.remind}
              type="number"
              inputMode="numeric"
              min={0}
              max={MAX_REMIND_DAYS}
              value={remindDaysBefore}
              onChange={(event) => setRemindDaysBefore(event.target.value)}
              className={fieldClass}
            />
            <p className="text-xs text-fg-muted">Two days gives time for a slow cancellation flow.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={ids.price} className="text-sm font-medium text-fg">
              Price after the trial <span className="font-normal text-fg-muted">(optional)</span>
            </label>
            <input
              id={ids.price}
              value={priceAfter}
              onChange={(event) => setPriceAfter(event.target.value)}
              maxLength={40}
              autoComplete="off"
              placeholder="e.g. 9.99 a month"
              className={fieldClass}
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor={ids.url} className="text-sm font-medium text-fg">
              Cancellation page <span className="font-normal text-fg-muted">(optional)</span>
            </label>
            <input
              id={ids.url}
              type="url"
              inputMode="url"
              value={cancelUrl}
              onChange={(event) => setCancelUrl(event.target.value)}
              autoComplete="off"
              placeholder="https://"
              className={fieldClass}
            />
            <p className="text-xs text-fg-muted">Saved into the reminder so cancelling is one tap away.</p>
          </div>
        </div>

        {problems.length > 0 ? (
          <ul id={ids.errors} className="flex flex-col gap-1 rounded-lg border border-danger/40 bg-danger-soft px-4 py-3">
            {problems.map((problem) => (
              <li key={problem} className="text-sm text-danger-fg">
                {problem}
              </li>
            ))}
          </ul>
        ) : null}

        {preview ? (
          <p className="rounded-lg border border-border bg-bg-subtle px-4 py-3 text-sm text-fg-muted">
            Converts to paid on <span className="font-medium text-fg">{formatLongDate(preview.chargeDate)}</span> (
            {countdown(preview.daysUntilCharge)}). Reminder on{" "}
            <span className="font-medium text-fg">{formatLongDate(preview.reminderDate)}</span>.
          </p>
        ) : null}

        <div>
          <Button type="submit" size="md">
            <Icon name="plus" size={16} />
            Add trial
          </Button>
        </div>
      </form>

      <section aria-label="Your trials" className="flex flex-col gap-4 border-t border-border pt-5">
        {trials.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border bg-bg-subtle px-4 py-6 text-center text-sm text-fg-muted">
            Add each trial you have started. They go into one calendar file you can import anywhere.
          </p>
        ) : (
          <>
            <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
              {trials.map((trial, index) => {
                const schedule = today ? trialSchedule(trial, today) : null;
                return (
                  <li key={`${trial.name}-${index}`} className="flex flex-wrap items-center gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-fg">{trial.name}</p>
                      {schedule ? (
                        <p className="text-xs text-fg-muted">
                          Charges {formatLongDate(schedule.chargeDate)} · {countdown(schedule.daysUntilCharge)}
                          {trial.priceAfter ? ` · ${trial.priceAfter}` : ""}
                        </p>
                      ) : null}
                      {schedule?.reminderInPast && schedule.daysUntilCharge >= 0 ? (
                        <p className="mt-1 text-xs text-warning-fg">
                          The reminder date has passed. Cancel now if you do not want to pay.
                        </p>
                      ) : null}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => remove(index)} aria-label={`Remove ${trial.name}`}>
                      <Icon name="close" size={14} />
                      Remove
                    </Button>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2">
              <input
                id={ids.chargeDay}
                type="checkbox"
                checked={includeChargeDay}
                onChange={(event) => setIncludeChargeDay(event.target.checked)}
                className="size-4 accent-primary"
              />
              <label htmlFor={ids.chargeDay} className="text-sm text-fg">
                Also add an event on each charge date
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button size="md" onClick={download}>
                <Icon name="download" size={16} />
                Download calendar file (.ics)
              </Button>
              <p className="text-xs text-fg-muted">
                Opens in Apple Calendar and Outlook; import it in Google Calendar under Settings, Import.
              </p>
            </div>
          </>
        )}
      </section>

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
