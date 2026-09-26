import type { IconName } from "@/components/icons";
import { PLATFORMS, type Platform } from "@/types/resource";

export interface PlatformDefinition {
  id: Platform;
  label: string;
  /** Compact label for dense card rows. */
  shortLabel: string;
  icon: IconName;
  /** Coarse grouping used to derive `desktop`/`mobile`/`browser` availability. */
  family: "browser" | "desktop" | "mobile" | "infrastructure";
}

export const platformDefinitions: Record<Platform, PlatformDefinition> = {
  BROWSER: { id: "BROWSER", label: "Browser", shortLabel: "Web", icon: "globe", family: "browser" },
  WINDOWS: { id: "WINDOWS", label: "Windows", shortLabel: "Windows", icon: "monitor", family: "desktop" },
  MACOS: { id: "MACOS", label: "macOS", shortLabel: "macOS", icon: "monitor", family: "desktop" },
  LINUX: { id: "LINUX", label: "Linux", shortLabel: "Linux", icon: "terminal", family: "desktop" },
  ANDROID: { id: "ANDROID", label: "Android", shortLabel: "Android", icon: "smartphone", family: "mobile" },
  IOS: { id: "IOS", label: "iOS", shortLabel: "iOS", icon: "smartphone", family: "mobile" },
  SELF_HOSTED: {
    id: "SELF_HOSTED",
    label: "Self-hosted",
    shortLabel: "Self-host",
    icon: "server",
    family: "infrastructure",
  },
};

export const platformList: PlatformDefinition[] = PLATFORMS.map((id) => platformDefinitions[id]);

/** The six platforms users actually filter by, in the documented order. */
export const filterablePlatforms: PlatformDefinition[] = platformList;

export function getPlatform(id: Platform): PlatformDefinition {
  return platformDefinitions[id];
}

export function isPlatform(value: string): value is Platform {
  return Object.hasOwn(platformDefinitions, value);
}
