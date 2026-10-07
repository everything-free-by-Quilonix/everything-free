import type { Category, CategoryGroup, CategoryGroupId } from "@/types/category";

export type { Category, CategoryGroup, CategoryGroupId };

/**
 * The category taxonomy.
 *
 * Categories are flat and globally unique; groups are curated orderings that
 * reference them. See `types/category.ts` for why.
 *
 * Adding a category: append it to `categories` with a unique slug, then add its
 * id to every group it belongs to. `assertTaxonomyIntegrity()` at the bottom of
 * this file fails the build if a group references a category that does not
 * exist, or a category claims a group that does not list it.
 */

export const categories: Category[] = [
  /* ---------------------------------------------------------------- general */
  {
    id: "everyday",
    slug: "everyday",
    name: "Everyday",
    description: "The things most people need at some point: converting a file, signing a document, sending something large.",
    groups: ["general"],
  },
  {
    id: "productivity",
    slug: "productivity",
    name: "Productivity",
    description: "Notes, tasks, calendars and writing tools for keeping work moving.",
    groups: ["general"],
  },
  {
    id: "utilities",
    slug: "utilities",
    name: "Utilities",
    description: "Small focused tools that do one job: compress, convert, rename, calculate.",
    groups: ["general"],
  },
  {
    id: "communication",
    slug: "communication",
    name: "Communication",
    description: "Messaging, email, calls and meetings.",
    groups: ["general", "life"],
  },
  {
    id: "personal",
    slug: "personal",
    name: "Personal",
    description: "Password managers, backups, file sync and other tools for your own digital life.",
    groups: ["general"],
  },
  {
    id: "travel",
    slug: "travel",
    name: "Travel",
    description: "Planning trips, finding routes and getting around.",
    groups: ["general", "life"],
  },
  {
    id: "personal-finance",
    slug: "personal-finance",
    name: "Personal finance",
    description: "Budgeting, expense tracking and understanding your own money.",
    groups: ["general", "life"],
  },
  {
    id: "shopping",
    slug: "shopping",
    name: "Shopping",
    description: "Comparing prices and making better buying decisions.",
    groups: ["general"],
  },
  {
    id: "lifestyle",
    slug: "lifestyle",
    name: "Lifestyle",
    description: "Hobbies, home, and everything that is not work.",
    groups: ["general"],
  },

  /* -------------------------------------------------------------- education */
  {
    id: "students",
    slug: "students",
    name: "Student perks & software",
    description: "Verified student developer packs, free cloud credits, pro licenses and educational discounts you can claim.",
    groups: ["education"],
  },
  {
    id: "courses",
    slug: "courses",
    name: "Courses",
    description: "Structured courses you can take from start to finish without paying.",
    groups: ["education"],
  },
  {
    id: "learning",
    slug: "learning",
    name: "Learning",
    description: "Self-directed learning: tutorials, practice, explanations and interactive lessons.",
    groups: ["education"],
  },
  {
    id: "study-tools",
    slug: "study-tools",
    name: "Study tools",
    description: "Flashcards, spaced repetition, note-taking and focus tools for studying.",
    groups: ["education"],
  },
  {
    id: "research",
    slug: "research",
    name: "Research",
    description: "Finding papers, managing citations and organising sources.",
    groups: ["education"],
  },
  {
    id: "books",
    slug: "books",
    name: "Books",
    description: "Books you can legally read for free, including public-domain and openly licensed texts.",
    groups: ["education", "media"],
  },
  {
    id: "exams",
    slug: "exams",
    name: "Exams",
    description: "Past papers, practice questions and exam preparation.",
    groups: ["education"],
  },
  {
    id: "mathematics",
    slug: "mathematics",
    name: "Mathematics",
    description: "Calculators, graphing, computation and maths teaching resources.",
    groups: ["education"],
  },
  {
    id: "science",
    slug: "science",
    name: "Science",
    description: "Simulations, data and teaching material across the sciences.",
    groups: ["education"],
  },
  {
    id: "languages",
    slug: "languages",
    name: "Languages",
    description: "Learning a language, translating, and checking what you have written.",
    groups: ["education"],
  },
  {
    id: "career",
    slug: "career",
    name: "Career",
    description: "Résumés, portfolios, interview practice and job searching.",
    groups: ["education"],
  },

  /* --------------------------------------------------------------- creative */
  {
    id: "design",
    slug: "design",
    name: "Design",
    description: "Interface design, illustration, layout and vector work.",
    groups: ["creative"],
  },
  {
    id: "photography",
    slug: "photography",
    name: "Photography",
    description: "Editing photos, raw processing and image retouching.",
    groups: ["creative"],
  },
  {
    id: "video",
    slug: "video",
    name: "Video",
    description: "Editing, cutting, captioning and exporting video.",
    groups: ["creative"],
  },
  {
    id: "audio",
    slug: "audio",
    name: "Audio",
    description: "Recording, editing, cleaning up and mastering sound.",
    groups: ["creative"],
  },
  {
    id: "music",
    slug: "music",
    name: "Music",
    description: "Making music, and finding music you are allowed to use.",
    groups: ["creative", "media"],
  },
  {
    id: "animation",
    slug: "animation",
    name: "Animation",
    description: "2D animation, motion graphics and rigging.",
    groups: ["creative"],
  },
  {
    id: "three-d",
    slug: "3d",
    name: "3D",
    description: "Modelling, sculpting, rendering and 3D assets.",
    groups: ["creative"],
  },
  {
    id: "fonts",
    slug: "fonts",
    name: "Fonts",
    description: "Typefaces licensed for free use, including open-source font families.",
    groups: ["creative"],
  },
  {
    id: "icons",
    slug: "icons",
    name: "Icons",
    description: "Icon sets you can use in interfaces and documents.",
    groups: ["creative"],
  },
  {
    id: "templates",
    slug: "templates",
    name: "Templates",
    description: "Starting points for documents, decks, sites and design files.",
    groups: ["creative"],
  },
  {
    id: "stock-media",
    slug: "stock-media",
    name: "Stock media",
    description: "Photos, footage and audio licensed for reuse, with the licence stated.",
    groups: ["creative"],
  },

  /* --------------------------------------------------------------------- ai */
  {
    id: "ai-chat",
    slug: "ai-chat",
    name: "AI chat",
    description: "Conversational assistants with a usable free allowance.",
    groups: ["ai"],
  },
  {
    id: "ai-writing",
    slug: "ai-writing",
    name: "AI writing",
    description: "Drafting, editing, summarising and rewriting text.",
    groups: ["ai"],
  },
  {
    id: "ai-coding",
    slug: "ai-coding",
    name: "AI coding",
    description: "Code completion, explanation and review assistants.",
    groups: ["ai"],
  },
  {
    id: "ai-image",
    slug: "ai-image",
    name: "AI image",
    description: "Generating and editing images with models.",
    groups: ["ai"],
  },
  {
    id: "ai-video",
    slug: "ai-video",
    name: "AI video",
    description: "Generating, editing or upscaling video with models.",
    groups: ["ai"],
  },
  {
    id: "ai-audio",
    slug: "ai-audio",
    name: "AI audio",
    description: "Transcription, separation, cleanup and audio generation.",
    groups: ["ai"],
  },
  {
    id: "ai-voice",
    slug: "ai-voice",
    name: "AI voice",
    description: "Text to speech and voice synthesis.",
    groups: ["ai"],
  },
  {
    id: "ai-research",
    slug: "ai-research",
    name: "AI research",
    description: "Searching, reading and synthesising sources with model assistance.",
    groups: ["ai"],
  },
  {
    id: "ai-productivity",
    slug: "ai-productivity",
    name: "AI productivity",
    description: "Meeting notes, inbox triage and everyday assistance.",
    groups: ["ai"],
  },
  {
    id: "ai-automation",
    slug: "ai-automation",
    name: "AI automation",
    description: "Chaining models and services into repeatable workflows.",
    groups: ["ai"],
  },
  {
    id: "ai-models",
    slug: "ai-models",
    name: "AI models",
    description: "Open-weight models you can download and run yourself.",
    groups: ["ai"],
  },
  {
    id: "ai-apis",
    slug: "ai-apis",
    name: "AI APIs",
    description: "Model endpoints with a free allowance for developers.",
    groups: ["ai"],
  },

  /* ------------------------------------------------------------ development */
  {
    id: "code-editors",
    slug: "code-editors",
    name: "Code editors",
    description: "Editors and IDEs for writing software.",
    groups: ["development"],
  },
  {
    id: "apis",
    slug: "apis",
    name: "APIs",
    description: "Public and free-tier APIs you can build against.",
    groups: ["development"],
  },
  {
    id: "databases",
    slug: "databases",
    name: "Databases",
    description: "Databases you can run locally or host on a free plan.",
    groups: ["development"],
  },
  {
    id: "hosting",
    slug: "hosting",
    name: "Hosting",
    description: "Somewhere to put a site or an app without a bill.",
    groups: ["development"],
  },
  {
    id: "deployment",
    slug: "deployment",
    name: "Deployment",
    description: "Building, shipping and automating releases.",
    groups: ["development"],
  },
  {
    id: "authentication",
    slug: "authentication",
    name: "Authentication",
    description: "Sign-in, identity and access control.",
    groups: ["development"],
  },
  {
    id: "storage",
    slug: "storage",
    name: "Storage",
    description: "Files, objects and assets.",
    groups: ["development"],
  },
  {
    id: "testing",
    slug: "testing",
    name: "Testing",
    description: "Test runners, browser automation and quality tooling.",
    groups: ["development"],
  },
  {
    id: "monitoring",
    slug: "monitoring",
    name: "Monitoring",
    description: "Logs, errors, uptime and performance visibility.",
    groups: ["development"],
  },
  {
    id: "open-source",
    slug: "open-source",
    name: "Open source",
    description: "Projects whose source you can read, run and change.",
    groups: ["development"],
  },
  {
    id: "developer-utilities",
    slug: "developer-utilities",
    name: "Developer utilities",
    description: "The small tools that fill a working day: formatters, converters, inspectors.",
    groups: ["development"],
  },

  /* --------------------------------------------------------------- business */
  {
    id: "documents",
    slug: "documents",
    name: "Documents",
    description: "Writing, editing, signing and converting documents.",
    groups: ["business"],
  },
  {
    id: "presentations",
    slug: "presentations",
    name: "Presentations",
    description: "Building and presenting slides.",
    groups: ["business"],
  },
  {
    id: "spreadsheets",
    slug: "spreadsheets",
    name: "Spreadsheets",
    description: "Numbers, models and tabular data.",
    groups: ["business"],
  },
  {
    id: "collaboration",
    slug: "collaboration",
    name: "Collaboration",
    description: "Working with other people on the same thing.",
    groups: ["business"],
  },
  {
    id: "project-management",
    slug: "project-management",
    name: "Project management",
    description: "Tracking work, planning and coordinating a team.",
    groups: ["business"],
  },
  {
    id: "crm",
    slug: "crm",
    name: "CRM",
    description: "Keeping track of customers and conversations.",
    groups: ["business"],
  },
  {
    id: "marketing",
    slug: "marketing",
    name: "Marketing",
    description: "Reaching people: email, social, SEO and content.",
    groups: ["business"],
  },
  {
    id: "analytics",
    slug: "analytics",
    name: "Analytics",
    description: "Understanding what is happening on your site or product.",
    groups: ["business"],
  },
  {
    id: "business-finance",
    slug: "business-finance",
    name: "Business finance",
    description: "Invoicing, bookkeeping and business accounts.",
    groups: ["business"],
  },
  {
    id: "hr",
    slug: "hr",
    name: "HR",
    description: "Hiring, onboarding and managing people.",
    groups: ["business"],
  },

  /* ------------------------------------------------------------------ media */
  {
    id: "games",
    slug: "games",
    name: "Games",
    description: "Games that are free to play, and tools for making them.",
    groups: ["media"],
  },
  {
    id: "movies",
    slug: "movies",
    name: "Movies",
    description: "Films and video you can watch legally for free.",
    groups: ["media"],
  },
  {
    id: "podcasts",
    slug: "podcasts",
    name: "Podcasts",
    description: "Listening to and making podcasts.",
    groups: ["media"],
  },
  {
    id: "streaming",
    slug: "streaming",
    name: "Streaming",
    description: "Broadcasting, and watching legally free streams.",
    groups: ["media"],
  },
  {
    id: "wallpapers",
    slug: "wallpapers",
    name: "Wallpapers",
    description: "Backgrounds for your screens, with the licence stated.",
    groups: ["media"],
  },

  /* ------------------------------------------------------------------- life */
  {
    id: "health-fitness",
    slug: "health-fitness",
    name: "Health & fitness",
    description: "Movement, sleep and general wellbeing tools. Not medical advice.",
    groups: ["life"],
  },
  {
    id: "food",
    slug: "food",
    name: "Food",
    description: "Recipes, meal planning and shopping lists.",
    groups: ["life"],
  },
  {
    id: "maps",
    slug: "maps",
    name: "Maps",
    description: "Maps, navigation and open geographic data.",
    groups: ["life"],
  },
  {
    id: "weather",
    slug: "weather",
    name: "Weather",
    description: "Forecasts and weather data.",
    groups: ["life"],
  },
];

export const categoryGroups: CategoryGroup[] = [
  {
    id: "general",
    name: "General",
    description: "The everyday things anyone might need.",
    icon: "compass",
    categoryIds: [
      "everyday",
      "productivity",
      "utilities",
      "communication",
      "personal",
      "travel",
      "personal-finance",
      "shopping",
      "lifestyle",
    ],
  },
  {
    id: "education",
    name: "Students & education",
    description: "Learning something, or teaching it.",
    icon: "graduation-cap",
    categoryIds: [
      "students",
      "courses",
      "learning",
      "study-tools",
      "research",
      "books",
      "exams",
      "mathematics",
      "science",
      "languages",
      "career",
    ],
  },
  {
    id: "creative",
    name: "Creative",
    description: "Making images, video, audio and design work.",
    icon: "palette",
    categoryIds: [
      "design",
      "photography",
      "video",
      "audio",
      "music",
      "animation",
      "three-d",
      "fonts",
      "icons",
      "templates",
      "stock-media",
    ],
  },
  {
    id: "ai",
    name: "AI",
    description: "Model-powered tools with a genuinely usable free allowance.",
    icon: "cpu",
    categoryIds: [
      "ai-chat",
      "ai-writing",
      "ai-coding",
      "ai-image",
      "ai-video",
      "ai-audio",
      "ai-voice",
      "ai-research",
      "ai-productivity",
      "ai-automation",
      "ai-models",
      "ai-apis",
    ],
  },
  {
    id: "development",
    name: "Development",
    description: "Writing, shipping and running software.",
    icon: "terminal",
    categoryIds: [
      "code-editors",
      "apis",
      "databases",
      "hosting",
      "deployment",
      "authentication",
      "storage",
      "testing",
      "monitoring",
      "open-source",
      "developer-utilities",
    ],
  },
  {
    id: "business",
    name: "Business",
    description: "Running an organisation without a software budget.",
    icon: "briefcase",
    categoryIds: [
      "documents",
      "presentations",
      "spreadsheets",
      "collaboration",
      "project-management",
      "crm",
      "marketing",
      "analytics",
      "business-finance",
      "hr",
    ],
  },
  {
    id: "media",
    name: "Media & entertainment",
    description: "Things to watch, play, read and listen to.",
    icon: "play-circle",
    categoryIds: ["games", "movies", "music", "podcasts", "books", "streaming", "wallpapers"],
  },
  {
    id: "life",
    name: "Life",
    description: "Health, food, travel and getting through the day.",
    icon: "heart",
    categoryIds: ["health-fitness", "food", "maps", "weather", "travel", "personal-finance", "communication"],
  },
];

/* -------------------------------------------------------------------------- */
/* Lookups                                                                    */
/* -------------------------------------------------------------------------- */

const categoryById = new Map<string, Category>(categories.map((c) => [c.id, c]));
const categoryBySlug = new Map<string, Category>(categories.map((c) => [c.slug, c]));
const groupById = new Map<CategoryGroupId, CategoryGroup>(categoryGroups.map((g) => [g.id, g]));

/** Alias kept because "list" reads better at call sites that iterate. */
export const categoryList: Category[] = categories;

export function getCategory(id: string): Category | undefined {
  return categoryById.get(id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categoryBySlug.get(slug);
}

/** Display name for a category id, falling back to the raw id if unknown. */
export function categoryName(id: string): string {
  return categoryById.get(id)?.name ?? id;
}

export function getCategoryGroup(id: CategoryGroupId): CategoryGroup | undefined {
  return groupById.get(id);
}

export function getCategoriesInGroup(id: CategoryGroupId): Category[] {
  const group = groupById.get(id);
  if (!group) return [];
  return group.categoryIds.flatMap((cid) => {
    const category = categoryById.get(cid);
    return category ? [category] : [];
  });
}

export function isCategoryId(value: string): boolean {
  return categoryById.has(value);
}

export function isCategoryGroupId(value: string): value is CategoryGroupId {
  return groupById.has(value as CategoryGroupId);
}

export function isCategoryOrGroupId(value: string): boolean {
  return categoryById.has(value) || groupById.has(value as CategoryGroupId);
}

export interface CategoryIdentity {
  id: string;
  name: string;
  description: string;
  isGroup: boolean;
  groupId?: CategoryGroupId;
  categoryIds?: string[];
}

export function getCategoryOrGroupInfo(id: string): CategoryIdentity | undefined {
  if (groupById.has(id as CategoryGroupId)) {
    const group = groupById.get(id as CategoryGroupId)!;
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      isGroup: true,
      categoryIds: group.categoryIds,
    };
  }
  const category = categoryById.get(id);
  if (category) {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      isGroup: false,
      groupId: category.groups[0],
    };
  }
  return undefined;
}

/* -------------------------------------------------------------------------- */
/* Integrity                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Fails fast on a taxonomy that contradicts itself.
 *
 * Runs at module load in development and during `next build`, so a mistyped
 * category id surfaces as a build error rather than as a silently empty page.
 */
function assertTaxonomyIntegrity(): void {
  const problems: string[] = [];

  const slugs = new Set<string>();
  for (const category of categories) {
    if (slugs.has(category.slug)) problems.push(`Duplicate category slug: ${category.slug}`);
    slugs.add(category.slug);
    if (category.groups.length === 0) problems.push(`Category "${category.id}" belongs to no group`);
  }

  for (const group of categoryGroups) {
    const seen = new Set<string>();
    for (const cid of group.categoryIds) {
      if (seen.has(cid)) problems.push(`Group "${group.id}" lists "${cid}" twice`);
      seen.add(cid);

      const category = categoryById.get(cid);
      if (!category) {
        problems.push(`Group "${group.id}" references unknown category "${cid}"`);
        continue;
      }
      if (!category.groups.includes(group.id)) {
        problems.push(`Category "${cid}" does not claim group "${group.id}" that lists it`);
      }
    }
  }

  for (const category of categories) {
    for (const groupId of category.groups) {
      const group = groupById.get(groupId);
      if (!group) {
        problems.push(`Category "${category.id}" claims unknown group "${groupId}"`);
      } else if (!group.categoryIds.includes(category.id)) {
        problems.push(`Group "${groupId}" does not list category "${category.id}" that claims it`);
      }
    }
  }

  if (problems.length > 0) {
    throw new Error(`Category taxonomy is inconsistent:\n  - ${problems.join("\n  - ")}`);
  }
}

assertTaxonomyIntegrity();
