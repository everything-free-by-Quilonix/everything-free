import type { Audience } from "@/types/category";

/**
 * Audience entry points.
 *
 * Each audience resolves to an ordinary library query rather than a separate
 * hand-maintained list, so an audience page can never drift out of sync with the
 * category pages feeding it. Adding a resource to `ai-image` automatically makes
 * it visible under "For Creators".
 */
export const audiences: Audience[] = [
  {
    id: "students",
    slug: "students",
    name: "For students",
    description: "Courses, study tools, research and writing help that do not need a budget.",
    icon: "graduation-cap",
    categoryIds: ["courses", "learning", "study-tools", "research", "books", "exams", "mathematics", "languages"],
    tags: ["students", "education"],
  },
  {
    id: "creators",
    slug: "creators",
    name: "For creators",
    description: "Editing, design, audio and stock media, each showing whether its commercial-use terms are confirmed.",
    icon: "palette",
    categoryIds: ["design", "photography", "video", "audio", "music", "animation", "three-d", "stock-media", "fonts"],
    tags: ["creator", "content-creation"],
  },
  {
    id: "developers",
    slug: "developers",
    name: "For developers",
    description: "Editors, hosting, databases, APIs and the utilities that fill a working day.",
    icon: "terminal",
    categoryIds: ["code-editors", "hosting", "databases", "apis", "deployment", "open-source", "developer-utilities"],
    tags: ["developer", "programming"],
  },
  {
    id: "small-businesses",
    slug: "small-businesses",
    name: "For small businesses",
    description: "Documents, collaboration, analytics and marketing on a free plan.",
    icon: "briefcase",
    categoryIds: ["documents", "presentations", "spreadsheets", "collaboration", "project-management", "analytics", "marketing"],
    tags: ["business", "small-business"],
  },
  {
    id: "researchers",
    slug: "researchers",
    name: "For researchers",
    description: "Literature, citations, datasets and computation.",
    icon: "library",
    categoryIds: ["research", "books", "science", "mathematics", "ai-models"],
    tags: ["research", "academic", "datasets"],
  },
  {
    id: "everyone",
    slug: "everyone",
    name: "For everyone",
    description: "The everyday things: files, photos, messages, maps and money.",
    icon: "compass",
    categoryIds: ["everyday", "utilities", "productivity", "communication", "maps", "personal-finance", "personal"],
    tags: ["everyday"],
  },
];

const audienceBySlug = new Map(audiences.map((a) => [a.slug, a]));

export function getAudience(slug: string): Audience | undefined {
  return audienceBySlug.get(slug);
}
