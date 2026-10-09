import Link from "next/link";
import { Icon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button";
import { chatModels, defaultChatModel, formatMegabytes, MAX_DOWNLOAD_MB } from "@/features/ai/models";

/**
 * Homepage feature: the private AI chat and the free AI finder.
 *
 * Every number comes from the model registry (`features/ai/models.ts`), never typed
 * here, so the homepage cannot drift from what the chat actually offers. The chat
 * preview on the right is a static illustration, not a live model: it is labelled
 * as one and is not interactive.
 */
export function PrivateAiFeature() {
  const smallest = Math.min(...chatModels.map((model) => model.downloadMB));
  const points = [
    { icon: "lock" as const, title: "Stays on your device", text: "Nothing you type is sent to us or anyone else." },
    { icon: "users" as const, title: "No account, no key", text: "No sign-up, no API key and no usage limit." },
    {
      icon: "download" as const,
      title: "Download once",
      text: `Open-source models from ${formatMegabytes(smallest)} to under ${formatMegabytes(MAX_DOWNLOAD_MB)}, kept in your browser.`,
    },
    {
      icon: "database" as const,
      title: "Keep a copy",
      text: "Save a model to your Downloads and set it up again without the internet.",
    },
  ];

  return (
    <section
      aria-labelledby="private-ai-heading"
      className="overflow-hidden rounded-md border border-border-strong bg-surface p-6 shadow-xs sm:p-8 lg:p-10"
    >
      <div className="grid items-center gap-10 lg:grid-cols-12">
        {/* ------------------------------------------------------- copy */}
        <div className="lg:col-span-6">
          <p className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-subtle px-3 py-1 text-2xs font-semibold tracking-widest text-fg-subtle uppercase">
            <Icon name="cpu" size={12} />
            New · Free AI
          </p>
          <h2
            id="private-ai-heading"
            className="mt-4 font-display text-2xl leading-tight font-bold tracking-tight text-balance sm:text-3xl lg:text-4xl"
          >
            A private AI chat that runs on your own device.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted sm:text-base">
            Chat with an open-source model inside your browser. It runs on your device&rsquo;s graphics chip, so your
            messages never leave it. Not sure which AI to use for a job? The finder compares the free options in the
            library, with their limits written down.
          </p>

          <ul className="mt-6 grid list-none gap-4 sm:grid-cols-2">
            {points.map((point) => (
              <li key={point.title} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-bg-subtle text-fg-muted"
                >
                  <Icon name={point.icon} size={15} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-fg">{point.title}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-fg-muted">{point.text}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/tools/private-ai-chat" className={buttonClasses({ variant: "primary", size: "md" })}>
              <span>Try the private AI chat</span>
              <Icon name="arrow-right" size={14} />
            </Link>
            <Link href="/ai" className={buttonClasses({ variant: "secondary", size: "md" })}>
              <Icon name="compass" size={14} />
              <span>Which free AI should I use?</span>
            </Link>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-fg-subtle">
            Works in recent Chrome, Edge and Safari with WebGPU. Small models are far less capable than the big online
            assistants, and the page says so.
          </p>
        </div>

        {/* ------------------------------------------------------- preview */}
        <figure className="lg:col-span-6">
          <div
            role="img"
            aria-label={`Illustration of the private AI chat screen, running ${defaultChatModel.name}`}
            className="overflow-hidden rounded-md border border-border bg-bg shadow-xs"
          >
            <div aria-hidden="true">
              <div className="flex items-center gap-2.5 border-b border-border px-4 py-2.5">
                <Icon name="arrow-left" size={14} className="text-fg-subtle" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-fg">{defaultChatModel.name}</p>
                  <p className="flex items-center gap-1 text-2xs text-fg-subtle">
                    <Icon name="lock" size={9} />
                    Private · running on this device
                  </p>
                </div>
                <span className="flex items-center gap-1 text-2xs text-fg-subtle">
                  <Icon name="plus" size={11} />
                  New chat
                </span>
              </div>

              <div className="flex flex-col gap-4 px-4 py-5">
                <div className="flex justify-end">
                  <p className="max-w-[80%] rounded-md bg-surface-raised px-3 py-2 text-xs leading-relaxed text-fg">
                    Write a short, polite message asking to move our meeting to Friday.
                  </p>
                </div>
                <div className="flex gap-2.5">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-border bg-surface-raised text-fg-muted">
                    <Icon name="cpu" size={11} />
                  </span>
                  <div className="min-w-0 text-xs leading-relaxed text-fg">
                    <p>Here&rsquo;s a short message you could send:</p>
                    <p className="mt-2 border-l-2 border-border-strong pl-2.5 text-fg-muted">
                      Hi Sam, would it be possible to move our meeting to Friday? Any time that morning works for me.
                      Thanks!
                    </p>
                    <p className="mt-2 flex gap-3 text-2xs text-fg-subtle">
                      <span className="flex items-center gap-1">
                        <Icon name="copy" size={10} />
                        Copy
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="refresh-cw" size={10} />
                        Regenerate
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 rounded-md border border-border-strong bg-surface px-3 py-2.5">
                  <span className="flex-1 text-xs text-fg-subtle">Message {defaultChatModel.name}</span>
                  <span className="flex size-6 items-center justify-center rounded-md bg-fg text-bg">
                    <Icon name="send" size={11} />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <figcaption className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-2xs text-fg-subtle">
            <span>Illustration.</span>
            {chatModels.map((model) => (
              <span key={model.id} className="tabular-nums">
                {model.name} · {formatMegabytes(model.downloadMB)}
              </span>
            ))}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
