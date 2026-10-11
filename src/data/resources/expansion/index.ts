import type { Resource } from "@/types/resource";

import { aiTools1Resources } from "./ai-tools-1";
import { creativeMedia1Resources } from "./creative-media-1";
import { developerGithub1Resources } from "./developer-github-1";
import { lifeEveryday1Resources } from "./life-everyday-1";
import { productivityBusiness1Resources } from "./productivity-business-1";

/**
 * Researched expansion batches outside Entertainment. Every listing carries the
 * dated pages it was built from (see `define-researched.ts`). Add a new file's
 * import AND its spread below.
 */
export const expansionResources: Resource[] = [
  ...aiTools1Resources,
  ...creativeMedia1Resources,
  ...developerGithub1Resources,
  ...lifeEveryday1Resources,
  ...productivityBusiness1Resources,
];
