/**
 * Trial reminder: pure date maths and an RFC 5545 (iCalendar) writer.
 *
 * Why this exists: free trials that silently convert into paid subscriptions are
 * the most common way "free" turns into a charge. The fix is boring and reliable,
 * a calendar reminder before the charge date, so this module produces a standard
 * `.ics` file that every mainstream calendar can import. Nothing is stored or
 * sent; the file is built in memory and handed to the browser as a download.
 *
 * Dates are calendar dates (`YYYY-MM-DD`), handled in UTC arithmetic so a
 * daylight-saving change can never shift a reminder by a day. Events are
 * all-day, so they land on the right date in whatever time zone the calendar is in.
 */

export interface TrialInput {
  name: string;
  /** `YYYY-MM-DD`, the day the trial started. */
  startDate: string;
  /** Length of the free period in days. */
  lengthDays: number;
  /** How many days before the charge to be reminded. */
  remindDaysBefore: number;
  /** Free text, e.g. "₹499/month". Optional; never parsed. */
  priceAfter?: string;
  /** Where to cancel. Optional; must be http(s) when present. */
  cancelUrl?: string;
}

export interface TrialSchedule {
  /** First day the provider may charge: start + length. */
  chargeDate: string;
  /** Day the reminder fires: charge − remindDaysBefore, never before the start. */
  reminderDate: string;
  /** Whole days from `today` to the charge date. Negative once it has passed. */
  daysUntilCharge: number;
  /** The reminder date is already behind `today`. */
  reminderInPast: boolean;
}

export const MAX_TRIAL_DAYS = 366;
export const MAX_REMIND_DAYS = 30;
export const MAX_NAME_LENGTH = 80;

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 86_400_000;

/** Parses `YYYY-MM-DD` to a UTC timestamp, rejecting impossible dates like 2026-02-30. */
export function parseIsoDate(value: string): number | null {
  const match = ISO_DATE.exec(value);
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const time = Date.UTC(year, month - 1, day);
  const date = new Date(time);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return time;
}

function formatIsoDate(time: number): string {
  return new Date(time).toISOString().slice(0, 10);
}

export function addDays(isoDate: string, days: number): string {
  const time = parseIsoDate(isoDate);
  if (time === null) throw new Error(`Invalid date "${isoDate}"`);
  return formatIsoDate(time + days * DAY_MS);
}

/** Whole days from `from` to `to`; negative when `to` is earlier. */
export function daysBetween(from: string, to: string): number {
  const a = parseIsoDate(from);
  const b = parseIsoDate(to);
  if (a === null || b === null) throw new Error("Invalid date");
  return Math.round((b - a) / DAY_MS);
}

/** Today's calendar date in the user's own time zone, as `YYYY-MM-DD`. */
export function localToday(now: Date = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

/** Problems with an input, phrased so the user can fix them. Empty when valid. */
export function validateTrial(trial: TrialInput): string[] {
  const problems: string[] = [];
  const name = trial.name.trim();
  if (name.length === 0) problems.push("Give the trial a name, such as the service you signed up for.");
  if (name.length > MAX_NAME_LENGTH) problems.push(`Keep the name under ${MAX_NAME_LENGTH} characters.`);
  if (parseIsoDate(trial.startDate) === null) problems.push("Enter the date the trial started.");
  if (!Number.isInteger(trial.lengthDays) || trial.lengthDays < 1 || trial.lengthDays > MAX_TRIAL_DAYS) {
    problems.push(`Trial length must be a whole number of days between 1 and ${MAX_TRIAL_DAYS}.`);
  }
  if (
    !Number.isInteger(trial.remindDaysBefore) ||
    trial.remindDaysBefore < 0 ||
    trial.remindDaysBefore > MAX_REMIND_DAYS
  ) {
    problems.push(`Reminder must be between 0 and ${MAX_REMIND_DAYS} days before the charge.`);
  }
  const url = trial.cancelUrl?.trim();
  if (url) {
    let ok = false;
    try {
      const parsed = new URL(url);
      ok = parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
      ok = false;
    }
    if (!ok) problems.push("The cancellation link must be a full web address starting with https://.");
  }
  return problems;
}

export function trialSchedule(trial: TrialInput, today: string): TrialSchedule {
  const chargeDate = addDays(trial.startDate, trial.lengthDays);
  const earliest = trial.startDate;
  const candidate = addDays(chargeDate, -trial.remindDaysBefore);
  const reminderDate = daysBetween(earliest, candidate) < 0 ? earliest : candidate;
  return {
    chargeDate,
    reminderDate,
    daysUntilCharge: daysBetween(today, chargeDate),
    reminderInPast: daysBetween(today, reminderDate) < 0,
  };
}

/* -------------------------------------------------------------------------- */
/* iCalendar                                                                  */
/* -------------------------------------------------------------------------- */

/** RFC 5545 §3.3.11: backslash, semicolon, comma and newline are escaped in TEXT. */
export function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

/**
 * RFC 5545 §3.1: lines longer than 75 octets are folded with CRLF + space.
 * Counts UTF-8 bytes and never splits a multi-byte character.
 */
export function foldIcsLine(line: string): string {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let current = "";
  let bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    // Continuation lines start with a space, which counts toward their 75.
    const limit = parts.length === 0 ? 75 : 74;
    if (bytes + size > limit) {
      parts.push(current);
      current = "";
      bytes = 0;
    }
    current += char;
    bytes += size;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

function icsDate(isoDate: string): string {
  return isoDate.replace(/-/g, "");
}

function icsTimestamp(now: Date): string {
  return now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

interface IcsEvent {
  uid: string;
  date: string;
  summary: string;
  description: string;
  url?: string;
  alarmText: string;
}

function eventLines(event: IcsEvent, stamp: string): string[] {
  const lines = [
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${icsDate(event.date)}`,
    `DTEND;VALUE=DATE:${icsDate(addDays(event.date, 1))}`,
    `SUMMARY:${escapeIcsText(event.summary)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
  ];
  if (event.url) lines.push(`URL:${event.url}`);
  lines.push(
    "TRANSP:TRANSPARENT",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcsText(event.alarmText)}`,
    // 09:00 on the day of an all-day event.
    "TRIGGER;RELATED=START:PT9H",
    "END:VALARM",
    "END:VEVENT",
  );
  return lines;
}

export interface IcsOptions {
  /** Also add an event on the charge date itself. */
  includeChargeDay: boolean;
  now?: Date;
  /** Injected for deterministic tests; defaults to `crypto.randomUUID`. */
  makeId?: () => string;
}

export function buildTrialCalendar(trials: readonly TrialInput[], options: IcsOptions): string {
  const now = options.now ?? new Date();
  const makeId = options.makeId ?? (() => crypto.randomUUID());
  const stamp = icsTimestamp(now);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Everything.Free//Trial reminder//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const trial of trials) {
    const name = trial.name.trim();
    const { chargeDate, reminderDate } = trialSchedule(trial, trial.startDate);
    const url = trial.cancelUrl?.trim() || undefined;
    const price = trial.priceAfter?.trim();
    const details = [
      `Your free trial of ${name} is expected to convert to a paid plan on ${chargeDate}.`,
      price ? `Price after the trial: ${price}.` : null,
      url ? `Cancel here: ${url}` : "Cancel from the account or billing settings of the service.",
      "Check the provider's own terms: some charge at the start of the last day, not the end.",
      "Created with the Everything.Free trial reminder. Nothing was uploaded.",
    ]
      .filter(Boolean)
      .join("\n");

    lines.push(
      ...eventLines(
        {
          uid: `${makeId()}@everything.free`,
          date: reminderDate,
          summary: `Cancel ${name} trial before ${chargeDate}`,
          description: details,
          url,
          alarmText: `Decide whether to keep ${name} before it charges on ${chargeDate}.`,
        },
        stamp,
      ),
    );

    if (options.includeChargeDay && chargeDate !== reminderDate) {
      lines.push(
        ...eventLines(
          {
            uid: `${makeId()}@everything.free`,
            date: chargeDate,
            summary: `${name} trial converts to paid today`,
            description: details,
            url,
            alarmText: `${name} may charge today.`,
          },
          stamp,
        ),
      );
    }
  }

  lines.push("END:VCALENDAR");
  return `${lines.map(foldIcsLine).join("\r\n")}\r\n`;
}
