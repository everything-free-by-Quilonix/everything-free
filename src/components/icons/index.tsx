import type { SVGProps } from "react";

/**
 * A small, hand-authored icon set.
 *
 * Why not an icon package: we need roughly forty glyphs. Pulling in a full icon
 * library for that means either a runtime dependency on the critical path or a
 * tree-shaking configuration to babysit, for artwork that never changes. These
 * are plain paths on a shared 24px grid with a consistent 1.75 stroke, which
 * keeps the visual language uniform and the dependency list honest.
 *
 * Accessibility: icons are decorative by default (`aria-hidden`). Passing
 * `label` promotes an icon to an image with an accessible name, which is only
 * correct when the icon is the *sole* carrier of meaning. Prefer adjacent text.
 */

const paths = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5 21 21" />
    </>
  ),
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="M20 6 9 17l-5-5" />,
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </>
  ),
  "x-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </>
  ),
  "minus-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8" />
    </>
  ),
  "alert-triangle": (
    <>
      <path d="M12 4l9 15H3z" />
      <path d="M12 9.5v4M12 16.5h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11.5v5M12 8h.01" />
    </>
  ),
  "help-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .9-1 1.6v.4M12 17h.01" />
    </>
  ),
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "arrow-left": <path d="M19 12H5M11 6l-6 6 6 6" />,
  "arrow-up-right": <path d="M7 17 17 7M8 7h9v9" />,
  "chevron-down": <path d="M6 9l6 6 6-6" />,
  "chevron-up": <path d="M6 15l6-6 6 6" />,
  "chevron-right": <path d="M9 6l6 6-6 6" />,
  "external-link": (
    <>
      <path d="M14 4h6v6M20 4 10.5 13.5" />
      <path d="M19 14.5V19a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 19V6.5A1.5 1.5 0 0 1 5.5 5H10" />
    </>
  ),
  filter: <path d="M3 5.5h18l-7 8.2V20l-4-2.2v-4.1z" />,
  sliders: (
    <>
      <path d="M4 8h9M19 8h1M4 16h3M13 16h7" />
      <circle cx="16" cy="8" r="2.4" />
      <circle cx="10" cy="16" r="2.4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </>
  ),
  moon: <path d="M20.5 14.8A8.6 8.6 0 0 1 9.2 3.5a8.6 8.6 0 1 0 11.3 11.3z" />,
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12.5" rx="2" />
      <path d="M9 20.5h6M12 16.5v4" />
    </>
  ),
  smartphone: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3.6 3 14.4 0 18M12 3c-3 3.6-3 14.4 0 18" />
    </>
  ),
  server: (
    <>
      <rect x="3" y="4" width="18" height="7" rx="2" />
      <rect x="3" y="13" width="18" height="7" rx="2" />
      <path d="M7 7.5h.01M7 16.5h.01" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7" />
    </>
  ),
  "shield-check": (
    <>
      <path d="M12 3l8 2.8v5.9c0 4.4-3.2 7.8-8 9.3-4.8-1.5-8-4.9-8-9.3V5.8z" />
      <path d="M9 12.2l2.2 2.2 4-4.3" />
    </>
  ),
  "shield-alert": (
    <>
      <path d="M12 3l8 2.8v5.9c0 4.4-3.2 7.8-8 9.3-4.8-1.5-8-4.9-8-9.3V5.8z" />
      <path d="M12 8.5v4M12 15.8h.01" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.2V12l3.4 2" />
    </>
  ),
  "refresh-cw": <path d="M20.5 11.5A8.5 8.5 0 1 0 12 20.5M20.5 4.5v7h-7" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5.5 15.5A1.5 1.5 0 0 1 4 14V5.5A1.5 1.5 0 0 1 5.5 4H14a1.5 1.5 0 0 1 1.5 1.5" />
    </>
  ),
  download: <path d="M12 3.5v12M7.5 11l4.5 4.5L16.5 11M4 20.5h16" />,
  upload: <path d="M12 20.5v-12M7.5 13 12 8.5l4.5 4.5M4 3.5h16" />,
  code: <path d="M9 18l-6-6 6-6M15 6l6 6-6 6" />,
  terminal: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 10l2.5 2.5L7 15M12.5 15.5H17" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </>
  ),
  cpu: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      <path d="M9 2.5V5M15 2.5V5M9 19v2.5M15 19v2.5M2.5 9H5M2.5 15H5M19 9h2.5M19 15h2.5" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.6" />
      <path d="M3.5 17.5l5-4.5 4 3.5 2.5-2 5.5 4.5" />
    </>
  ),
  film: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9.5h18M3 14.5h18M8 4v16M16 4v16" />
    </>
  ),
  music: (
    <>
      <path d="M9 17.5V5.8l10-2v11.7" />
      <circle cx="6.5" cy="18" r="2.6" />
      <circle cx="16.5" cy="15.5" r="2.6" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="10.5" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M9 21h6" />
    </>
  ),
  "file-text": (
    <>
      <path d="M14 3.5H7.5A2 2 0 0 0 5.5 5.5v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8z" />
      <path d="M14 3.5V8h4.5M9 13h6M9 16.5h4" />
    </>
  ),
  layers: <path d="M12 3l8.5 4.8L12 12.6 3.5 7.8zM3.5 13l8.5 4.8L20.5 13" />,
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  "book-open": <path d="M12 6.4v13.4M12 6.4C10 4.8 7 4.2 3.8 4.2v12.9c3.2 0 6.2.6 8.2 2.2 2-1.6 5-2.2 8.2-2.2V4.2c-3.2 0-6.2.6-8.2 2.2z" />,
  "graduation-cap": (
    <>
      <path d="M2.5 9.2 12 4.4l9.5 4.8L12 14z" />
      <path d="M6.5 11.2v4.6c0 1.6 2.5 2.9 5.5 2.9s5.5-1.3 5.5-2.9v-4.6" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18" />
    </>
  ),
  palette: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="9" cy="9.5" r="1.3" />
      <circle cx="15" cy="9.5" r="1.3" />
      <circle cx="12" cy="15.5" r="1.3" />
    </>
  ),
  "play-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10.2 8.6l5.4 3.4-5.4 3.4z" />
    </>
  ),
  gamepad: (
    <>
      <rect x="2.5" y="7.5" width="19" height="10" rx="5" />
      <path d="M7.5 10.5v4M5.5 12.5h4M15.5 11.5h.01M18 13.5h.01" />
    </>
  ),
  users: (
    <>
      <circle cx="9.5" cy="8" r="3.5" />
      <path d="M3 20a6.5 6.5 0 0 1 13 0M16.5 5.2a3.5 3.5 0 0 1 0 6.6M18 14.8A6.5 6.5 0 0 1 21 20" />
    </>
  ),
  heart: <path d="M12 20.3S4.5 16 4.5 10.6A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7.5 2.6c0 5.4-7.5 9.7-7.5 9.7z" />,
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.6 8.4l-2.2 5.2-5.2 2.2 2.2-5.2z" />
    </>
  ),
  "map-pin": (
    <>
      <path d="M12 21.2s7-6.4 7-11.2a7 7 0 1 0-14 0c0 4.8 7 11.2 7 11.2z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  "shopping-bag": (
    <>
      <path d="M5.5 7.5h13l-1.2 13H6.7z" />
      <path d="M9 7.5V5.8a3 3 0 0 1 6 0v1.7" />
    </>
  ),
  wallet: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10.5h18M16.5 15h1.5" />
    </>
  ),
  flag: <path d="M5.5 21V4.2c4-1.6 6 1.5 10 0v10c-4 1.6-6-1.5-10 0" />,
  link: (
    <>
      <path d="M9 15l6-6" />
      <path d="M10.6 6.8l1.7-1.7a4 4 0 0 1 5.6 5.6l-1.7 1.7M13.4 17.2l-1.7 1.7a4 4 0 0 1-5.6-5.6l1.7-1.7" />
    </>
  ),
  repo: (
    <>
      <path d="M6 4.5v10.2A3.3 3.3 0 0 0 9.3 18h4.4" />
      <circle cx="6" cy="19" r="2.2" />
      <circle cx="6" cy="4.5" r="2" />
      <circle cx="16.5" cy="18" r="2.2" />
    </>
  ),
  send: <path d="M21 3.5 10.5 14M21 3.5l-6.8 17.2-3.7-6.7-6.7-3.7z" />,
  contrast: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none" />
    </>
  ),
  type: <path d="M4 6.5V4.5h16v2M12 4.5v15M8.5 19.5h7" />,
  bolt: <path d="M13.5 3 5.5 14H11l-1 7 8-11h-5.5z" />,
  library: (
    <>
      <path d="M4 20V5.5M8.5 20V5.5M13.5 20V6l4.5 14" />
      <path d="M3 20h18" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

export const ICON_NAMES = Object.keys(paths) as IconName[];

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name" | "children"> {
  name: IconName;
  /** Rendered size in px for both axes. */
  size?: number;
  /**
   * Accessible name. Only pass this when no adjacent text conveys the same
   * meaning; otherwise the icon should stay hidden from assistive technology.
   */
  label?: string;
}

export function Icon({ name, size = 20, label, strokeWidth = 1.75, ...rest }: IconProps) {
  const labelled = typeof label === "string" && label.length > 0;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={labelled ? "img" : undefined}
      aria-label={labelled ? label : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable={false}
      {...rest}
    >
      {labelled ? <title>{label}</title> : null}
      {paths[name]}
    </svg>
  );
}
