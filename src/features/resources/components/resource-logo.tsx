import Image from "next/image";
import type { ResourceLogo as ResourceLogoData } from "@/types/resource";
import { cn } from "@/lib/utils/cn";

/**
 * Renders a resource's mark.
 *
 * The default is a generated monogram rather than the vendor's real logo. That is
 * a deliberate product decision, not a shortcut:
 *
 * - We have no licence to redistribute third-party trademarked artwork, and a
 *   directory that hotlinks a few hundred logos is making a few hundred
 *   assumptions about that.
 * - Hotlinking puts a third-party request on every card, which leaks the user's
 *   browsing to every vendor listed and slows the grid down.
 * - Remote logos break. A wall of broken images reads as an abandoned site.
 *
 * The `image` variant exists for the case where a vendor explicitly permits logo
 * use and the asset is self-hosted under `public/branding`.
 */
export function ResourceLogo({
  logo,
  size = 40,
  className,
}: {
  logo: ResourceLogoData;
  size?: number;
  className?: string;
}) {
  if (logo.kind === "image") {
    return (
      <Image
        src={logo.url}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        className={cn("shrink-0 rounded-sm border border-border object-contain", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      // Decorative: the resource name is always adjacent in text, so announcing
      // the initials again would only add noise.
      aria-hidden="true"
      className={cn(
        "flex shrink-0 select-none items-center justify-center rounded-sm border border-border bg-surface-raised font-display font-semibold tracking-tight text-fg-muted",
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {logo.text}
    </span>
  );
}
