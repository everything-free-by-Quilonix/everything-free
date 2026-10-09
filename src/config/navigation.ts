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
    label: "Students",
    href: "/students",
    description: "Free student software, developer packs and campus perks.",
    icon: "graduation-cap",
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
    label: "Free AI",
    href: "/ai",
    description: "Find a free AI for the job, or chat privately with one that runs on your device.",
    icon: "cpu",
  },
  {
    label: "AI Prompts",
    href: "/ai-prompts",
    description: "Discover prompts from open and community-driven AI prompt libraries.",
    icon: "image",
  },
  {
    label: "Alternatives",
    href: "/alternatives",
    description: "Free replacements for paid products.",
    icon: "refresh-cw",
  },
  {
    label: "Entertainment",
    href: "/entertainment",
    description: "Watch legal cartoons & cinema, listen to live radio, and play games on-site.",
    icon: "gamepad",
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
      { label: "Entertainment & Media", href: "/entertainment" },
      { label: "AI prompts aggregator", href: "/ai-prompts" },
      { label: "AI image prompt commands", href: "/ai-image-commands" },
      { label: "Free alternatives", href: "/alternatives" },
      { label: "Recently checked", href: "/resources?sort=recently-verified" },
    ],
  },
  {
    title: "Use",
    links: [
      { label: "Tools", href: "/tools" },
      { label: "Entertainment & Play", href: "/entertainment" },
      { label: "Private AI chat", href: "/tools/private-ai-chat" },
      { label: "Which free AI?", href: "/ai" },
      { label: "Free-trial cancel reminder", href: "/tools/trial-reminder" },
      { label: "Subscription audit", href: "/tools/subscription-audit" },
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
