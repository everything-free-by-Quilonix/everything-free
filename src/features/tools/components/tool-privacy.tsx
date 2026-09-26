import { Icon } from "@/components/icons";
import { Callout } from "@/components/ui/callout";
import { ExternalLink } from "@/components/ui/external-link";
import type { Tool } from "@/types/tool";

/**
 * Privacy disclosure for a tool.
 *
 * Rendered entirely from the tool's declared `processing` metadata. There is no
 * prop for "privacy text" and no way for a page to override what this says, which
 * is the point: the statement a user reads is generated from the same declaration
 * that build-time validation checks for contradictions.
 */
export function ToolPrivacyNotice({ tool }: { tool: Tool }) {
  const { processing } = tool;
  const local = processing.location === "browser" && !processing.leavesDevice;

  return (
    <Callout
      tone={local ? "success" : "warning"}
      icon={local ? "lock" : "server"}
      title={local ? "Your files stay on your device" : "Your data is sent to a server"}
    >
      <p>{processing.explanation}</p>

      {processing.thirdParty ? (
        <p className="mt-2">
          Processed by{" "}
          <ExternalLink href={processing.thirdParty.url} className="font-medium text-fg underline underline-offset-2">
            {processing.thirdParty.name}
          </ExternalLink>
          {processing.thirdParty.privacyPolicyUrl ? (
            <>
              {" — "}
              <ExternalLink
                href={processing.thirdParty.privacyPolicyUrl}
                className="underline underline-offset-2 hover:text-fg"
              >
                their privacy policy
              </ExternalLink>
            </>
          ) : null}
          .
        </p>
      ) : null}
    </Callout>
  );
}

/**
 * Credit for open-source work a tool is built on.
 *
 * Renders nothing when there is nothing to credit — a tool built only on browser
 * APIs owes no attribution, and inventing one would be noise. Licences that
 * require display are marked as such.
 */
export function ToolAttributions({ tool }: { tool: Tool }) {
  if (tool.attributions.length === 0) return null;

  return (
    <section aria-labelledby="tool-attributions">
      <h2 id="tool-attributions" className="font-display text-lg font-semibold">
        Built on
      </h2>
      <ul className="mt-3 flex flex-col gap-2.5">
        {tool.attributions.map((attribution) => (
          <li key={attribution.url} className="flex items-start gap-2.5 text-sm">
            <Icon name="repo" size={15} className="mt-0.5 shrink-0 text-fg-subtle" />
            <span>
              <ExternalLink href={attribution.url} className="font-medium text-fg hover:underline">
                {attribution.name}
              </ExternalLink>
              <span className="text-fg-muted"> — {attribution.license}</span>
              {attribution.required ? (
                <span className="ml-1.5 text-xs text-fg-subtle">(attribution required by licence)</span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
