import type { IconName } from "@/components/icons";
import { RESOURCE_TYPES, type ResourceType } from "@/types/resource";

export interface ResourceTypeDefinition {
  id: ResourceType;
  label: string;
  /** Plural form, for headings such as "Free courses". */
  plural: string;
  description: string;
  icon: IconName;
}

export const resourceTypeDefinitions: Record<ResourceType, ResourceTypeDefinition> = {
  WEBSITE: {
    id: "WEBSITE",
    label: "Website",
    plural: "Websites",
    description: "A site you visit for its content rather than to operate a tool.",
    icon: "globe",
  },
  WEB_APP: {
    id: "WEB_APP",
    label: "Web app",
    plural: "Web apps",
    description: "Runs in the browser with no installation.",
    icon: "monitor",
  },
  MOBILE_APP: {
    id: "MOBILE_APP",
    label: "Mobile app",
    plural: "Mobile apps",
    description: "Installed on a phone or tablet.",
    icon: "smartphone",
  },
  DESKTOP_APP: {
    id: "DESKTOP_APP",
    label: "Desktop app",
    plural: "Desktop apps",
    description: "Installed on Windows, macOS or Linux.",
    icon: "monitor",
  },
  OPEN_SOURCE: {
    id: "OPEN_SOURCE",
    label: "Open-source project",
    plural: "Open-source projects",
    description: "Published source code you can read, run and modify.",
    icon: "repo",
  },
  AI_TOOL: {
    id: "AI_TOOL",
    label: "AI tool",
    plural: "AI tools",
    description: "Uses machine-learning models as its core function.",
    icon: "cpu",
  },
  API: {
    id: "API",
    label: "API",
    plural: "APIs",
    description: "Programmatic interface for developers.",
    icon: "code",
  },
  COURSE: {
    id: "COURSE",
    label: "Course",
    plural: "Courses",
    description: "Structured teaching material with a defined path.",
    icon: "graduation-cap",
  },
  BOOK: {
    id: "BOOK",
    label: "Book",
    plural: "Books",
    description: "Long-form reading, including ebooks and reference texts.",
    icon: "book-open",
  },
  GAME: { id: "GAME", label: "Game", plural: "Games", description: "Something to play.", icon: "gamepad" },
  DATASET: {
    id: "DATASET",
    label: "Dataset",
    plural: "Datasets",
    description: "Structured data available for analysis or training.",
    icon: "database",
  },
  TEMPLATE: {
    id: "TEMPLATE",
    label: "Template",
    plural: "Templates",
    description: "A starting point you fill in or adapt.",
    icon: "layers",
  },
  FONT: { id: "FONT", label: "Font", plural: "Fonts", description: "Typefaces for design and text.", icon: "type" },
  ICON: {
    id: "ICON",
    label: "Icon set",
    plural: "Icon sets",
    description: "Collections of interface or illustrative icons.",
    icon: "grid",
  },
  STOCK_IMAGE: {
    id: "STOCK_IMAGE",
    label: "Stock images",
    plural: "Stock image libraries",
    description: "Photographs and illustrations licensed for reuse.",
    icon: "image",
  },
  STOCK_VIDEO: {
    id: "STOCK_VIDEO",
    label: "Stock video",
    plural: "Stock video libraries",
    description: "Footage licensed for reuse.",
    icon: "film",
  },
  STOCK_AUDIO: {
    id: "STOCK_AUDIO",
    label: "Stock audio",
    plural: "Stock audio libraries",
    description: "Sound effects and production music licensed for reuse.",
    icon: "mic",
  },
  MUSIC: {
    id: "MUSIC",
    label: "Music",
    plural: "Music",
    description: "Music to listen to, or to make.",
    icon: "music",
  },
  EDUCATIONAL_RESOURCE: {
    id: "EDUCATIONAL_RESOURCE",
    label: "Educational resource",
    plural: "Educational resources",
    description: "Reference or teaching material outside a formal course.",
    icon: "library",
  },
  PRODUCTIVITY_TOOL: {
    id: "PRODUCTIVITY_TOOL",
    label: "Productivity tool",
    plural: "Productivity tools",
    description: "Helps you organise, plan or get through work.",
    icon: "check-circle",
  },
  BUSINESS_TOOL: {
    id: "BUSINESS_TOOL",
    label: "Business tool",
    plural: "Business tools",
    description: "Supports running or growing an organisation.",
    icon: "briefcase",
  },
  DEVELOPER_TOOL: {
    id: "DEVELOPER_TOOL",
    label: "Developer tool",
    plural: "Developer tools",
    description: "Built for writing, shipping or operating software.",
    icon: "terminal",
  },
  CREATIVE_TOOL: {
    id: "CREATIVE_TOOL",
    label: "Creative tool",
    plural: "Creative tools",
    description: "For making images, video, audio or design work.",
    icon: "palette",
  },
  UTILITY: {
    id: "UTILITY",
    label: "Utility",
    plural: "Utilities",
    description: "Does one focused job well.",
    icon: "sliders",
  },
  SERVICE: {
    id: "SERVICE",
    label: "Service",
    plural: "Services",
    description: "Hosted infrastructure or an ongoing service.",
    icon: "server",
  },
  COMMUNITY: {
    id: "COMMUNITY",
    label: "Community",
    plural: "Communities",
    description: "Where people help each other.",
    icon: "users",
  },
  OTHER: {
    id: "OTHER",
    label: "Other",
    plural: "Other resources",
    description: "Does not fit the existing types yet.",
    icon: "compass",
  },
};

export const resourceTypeList: ResourceTypeDefinition[] = RESOURCE_TYPES.map((id) => resourceTypeDefinitions[id]);

export function getResourceType(id: ResourceType): ResourceTypeDefinition {
  return resourceTypeDefinitions[id];
}

export function isResourceType(value: string): value is ResourceType {
  return Object.hasOwn(resourceTypeDefinitions, value);
}
