import type { IconName } from "@/components/icons";

export interface NavLink {
  label: string;
  href: string;
  /** Shown in the mobile menu and mega-menu, not in the compact desktop bar. */
  description?: string;
  icon?: IconName;
  /** Marks links to resources outside this site. */
  external?: boolean;
}

/** Primary navigation. Deliberately short — five items, no dropdowns-in-dropdowns. */
export const primaryNav: NavLink[] = [
  {
    label: "Browse",
    href: "/resources",
    description: "Every resource in the library, with filters.",
    icon: "grid",
  },
  {
    label: "Categories",
    href: "/categories",
    description: "Find things by topic.",
    icon: "layers",
  },
  {
    label: "Tools",
    href: "/tools",
    description: "Tools you can use here, without uploading your files.",
    icon: "sliders",
  },
  {
    label: "Collections",
    href: "/collections",
    description: "Curated sets that solve one problem together.",
    icon: "library",
  },
  {
    label: "Alternatives",
    href: "/alternatives",
    description: "Free replacements for paid products.",
    icon: "refresh-cw",
  },
];

export interface FooterSection {
  title: string;
  links: NavLink[];
}

export const footerNav: FooterSection[] = [
  {
    title: "Discover",
    links: [
      { label: "Browse all resources", href: "/resources" },
      { label: "Categories", href: "/categories" },
      { label: "Collections", href: "/collections" },
      { label: "Free alternatives", href: "/alternatives" },
      { label: "Recently checked", href: "/resources?sort=recently-verified" },
    ],
  },
  {
    title: "Use",
    links: [
      { label: "Tools", href: "/tools" },
      // These open confirmed-only filters, and the labels say so.
      { label: "Open source (confirmed)", href: "/resources?openSource=1" },
      { label: "No account needed (confirmed)", href: "/resources?noAccount=1" },
      { label: "Commercial use allowed (confirmed)", href: "/resources?commercialUse=1" },
    ],
  },
  {
    title: "Trust",
    links: [
      { label: "What “free” means here", href: "/free-status" },
      { label: "How we verify", href: "/verification" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
  {
    title: "Contribute",
    links: [
      { label: "Submit a resource", href: "/submit" },
      { label: "Report a problem", href: "/report" },
      { label: "About", href: "/about" },
      { label: "Source on GitHub", href: "https://github.com/everything-free-by-Quilonix", external: true },
    ],
  },
];
