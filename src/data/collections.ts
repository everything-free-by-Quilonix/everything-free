import type { Collection } from "@/types/collection";
import { seedResources } from "./resources";

/**
 * Curated collections.
 *
 * Each one exists to answer a real question someone arrives with, and each
 * carries a `rationale` stating the basis for the selection. Collections are the
 * only editorial voice on the site, so they are labelled as editorial and never
 * presented as measured or ranked.
 */
export const collections: Collection[] = [
  {
    id: "leave-the-adobe-subscription",
    slug: "leave-the-adobe-subscription",
    name: "Leaving a creative subscription",
    shortDescription: "Freely licensed replacements for the main pieces of a paid creative suite.",
    longDescription:
      "Covers the jobs a creative subscription is usually bought for: raster editing, painting, vector work, video and audio. Each entry records a licence that permits commercial use; each card says whether an official source has confirmed it.",
    rationale:
      "Selected on two recorded criteria only: the licence permits commercial use, and the free version exports without watermarks or resolution caps. These are not claimed to be feature-equivalent to the paid tools they replace, and the limitations on each entry are worth reading before committing a project to one.",
    icon: "palette",
    resourceSlugs: ["gimp", "krita", "inkscape", "davinci-resolve", "audacity", "photopea"],
    updatedAt: "2026-09-25",
  },
  {
    id: "video-from-recording-to-export",
    slug: "video-from-recording-to-export",
    name: "A video pipeline, end to end",
    shortDescription: "Record, edit, grade, caption and source footage with a tool recorded as free at every stage.",
    longDescription:
      "A working chain for producing video: capture the screen or camera, edit and grade, clean up the audio, generate captions, and fill gaps with licensed stock footage.",
    rationale:
      "Chosen to cover each stage of the pipeline with no gaps that force a paid purchase, and to interoperate through ordinary file formats rather than a proprietary project format. Transcription is included because captions are usually the first thing a free workflow has to pay for.",
    icon: "film",
    resourceSlugs: ["obs-studio", "davinci-resolve", "shotcut", "audacity", "whisper", "pexels"],
    updatedAt: "2026-09-25",
  },
  {
    id: "student-starter-kit",
    slug: "student-starter-kit",
    name: "A student's starting set",
    shortDescription: "Write, cite, revise and learn — none recorded as needing a student card or a trial.",
    longDescription:
      "Covers the practical needs of coursework: writing and formatting documents, managing references, revising effectively, checking your writing, and filling gaps in understanding.",
    rationale:
      "Chosen because each is recorded as free without institutional access, a student verification step or an expiring academic licence, because those requirements exclude the people who most need free tools. Certification and accreditation limits are noted on the individual entries.",
    icon: "graduation-cap",
    resourceSlugs: ["libreoffice", "zotero", "anki", "khan-academy", "languagetool", "obsidian", "project-gutenberg"],
    updatedAt: "2026-09-25",
  },
  {
    id: "ship-a-site-for-nothing",
    slug: "ship-a-site-for-nothing",
    name: "Ship a real site for nothing",
    shortDescription: "Editor, version control, database and hosting, each recorded as having a permanent free plan.",
    longDescription:
      "Enough to take a web project from an empty folder to a live URL with a real database behind it, using free plans rather than trials.",
    rationale:
      "Selected for free plans recorded as permanent rather than time-limited. Whether each one asks for a payment method at signup is recorded on its own entry, and for some it has not yet been established from an official source. The metered limits are listed on each entry — the database pause behaviour in particular matters if the project will have real users.",
    icon: "bolt",
    resourceSlugs: ["vs-code", "github", "cloudflare-pages", "supabase", "excalidraw"],
    updatedAt: "2026-09-25",
  },
  {
    id: "keep-your-data-on-your-machine",
    slug: "keep-your-data-on-your-machine",
    name: "Keep your data on your own machine",
    shortDescription: "Tools recorded as doing their work locally instead of uploading your files.",
    longDescription:
      "For documents, notes, recordings and locations you would rather not hand to a service: each is recorded as processing data on hardware you control.",
    rationale:
      "Each entry is recorded as either running entirely locally or being self-hostable, and as not needing an account for its core function; each card says which of those facts an official source has confirmed. Where a hosted or public instance also exists, the entry says so, because using it undoes the reason to pick the tool.",
    icon: "lock",
    resourceSlugs: ["stirling-pdf", "ollama", "whisper", "obsidian", "organic-maps", "excalidraw", "libreoffice"],
    updatedAt: "2026-09-25",
  },
  {
    id: "assets-safe-for-client-work",
    slug: "assets-safe-for-client-work",
    name: "Assets for client work",
    shortDescription: "Images, footage, typefaces and 3D output whose recorded licences permit commercial use.",
    longDescription:
      "Free assets are only useful professionally if the licence survives contact with a client invoice. Each of these records a licence that permits commercial use, with the conditions stated; each card says whether an official source has confirmed it.",
    rationale:
      "Included on the strength of their published licences permitting commercial use. Conditions that remain — attribution, share-alike, restrictions on reselling the asset itself, and separate releases for identifiable people or property — are recorded on each entry and are your responsibility to honour.",
    icon: "shield-check",
    resourceSlugs: ["unsplash", "pexels", "google-fonts", "blender"],
    updatedAt: "2026-09-25",
  },
  {
    id: "legal-free-movies-and-cinema",
    slug: "legal-free-movies-and-cinema",
    name: "Stream movies and cinema legally for zero cost",
    shortDescription: "Legitimate, 100% free streaming platforms for movies, TV series, indie cinema, and public domain classics.",
    longDescription:
      "Tired of costly streaming price hikes and risky piracy sites: each of these platforms is fully licensed and legally free. Watch on-demand Hollywood movies, public domain cinema, live channels, and festival documentaries without subscriptions or credit cards.",
    rationale:
      "Selected on strict legal criteria: completely licensed distribution, no payment info requested at signup, and no subscription paywalls. Includes ad-supported major studio catalogues (Tubi, Pluto TV), library card perks (Kanopy), and historical archives (Internet Archive).",
    icon: "film",
    resourceSlugs: ["tubi", "pluto-tv", "kanopy", "internet-archive-movies", "plex-free", "documentary-plus", "popcornflix", "justwatch"],
    updatedAt: "2026-10-08",
  },
  {
    id: "rare-internet-goldmines",
    slug: "rare-internet-goldmines",
    name: "Rare internet goldmines & viral utilities",
    shortDescription: "Hard-to-find web tools that do extraordinary things without ads, telemetry, or subscriptions.",
    longDescription:
      "A hand-picked collection of catchy, clever web utilities that feel like magic: ad-free media downloaders, in-browser vector editors, live global radio exploration, local image compression, and keyless creative AI.",
    rationale:
      "Chosen for utility, privacy, and exceptional execution. Every tool here runs either client-side or without predatory dark patterns, replacing shady ad-ridden websites with clean, fast, and transparent alternatives.",
    icon: "compass",
    resourceSlugs: ["cobalt", "vectorpea", "cyberchef", "radio-garden", "squoosh", "caesium", "pollinations-ai", "archive-today"],
    updatedAt: "2026-10-08",
  },
  {
    id: "viral-subscription-killers",
    slug: "viral-subscription-killers",
    name: "Escape the SaaS subscription trap",
    shortDescription: "Open-source and free replacements for expensive services like Zapier, Heroku, Notion, and Spotify.",
    longDescription:
      "Software subscriptions add up to thousands of dollars per year. These production-grade open-source and fair-code tools replace costly SaaS products with self-hosted control, privacy, and unlimited local power.",
    rationale:
      "Selected because each one solves a major subscription pain point with genuine open-source freedom or free self-hosting: n8n replaces Zapier, Coolify replaces Heroku/Vercel, AppFlowy replaces Notion, and Spotube delivers ad-free music.",
    icon: "bolt",
    resourceSlugs: ["coolify", "n8n", "appflowy", "anytype", "spotube", "freetube"],
    updatedAt: "2026-10-08",
  },
];

/** Fails the build if a collection points at a resource that does not exist. */
function validateCollections(): void {
  const slugs = new Set(seedResources.map((r) => r.slug));
  const problems: string[] = [];
  const collectionSlugs = new Set<string>();

  for (const collection of collections) {
    if (collectionSlugs.has(collection.slug)) problems.push(`Duplicate collection slug "${collection.slug}"`);
    collectionSlugs.add(collection.slug);

    if (collection.resourceSlugs.length === 0) {
      problems.push(`Collection "${collection.slug}" is empty`);
    }

    const seen = new Set<string>();
    for (const slug of collection.resourceSlugs) {
      if (!slugs.has(slug)) {
        problems.push(`Collection "${collection.slug}" references unknown resource "${slug}"`);
      }
      if (seen.has(slug)) {
        problems.push(`Collection "${collection.slug}" lists "${slug}" twice`);
      }
      seen.add(slug);
    }
  }

  if (problems.length > 0) {
    throw new Error(`Collection data is invalid:\n  - ${problems.join("\n  - ")}`);
  }
}

validateCollections();
