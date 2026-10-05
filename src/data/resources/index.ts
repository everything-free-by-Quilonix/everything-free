import type { Resource } from "@/types/resource";

import { aiResources } from "./ai";
import { batch001Resources } from "./batch-001";
import { batch002Resources } from "./batch-002";
import { batch003Resources } from "./batch-003";
import { batch004Resources } from "./batch-004";
import { batch005Resources } from "./batch-005";
import { batch006Resources } from "./batch-006";
import { batch007Resources } from "./batch-007";
import { creativeResources } from "./creative";
import { developmentResources } from "./development";
import { educationResources } from "./education";
import { lifeResources } from "./life";
import { productivityResources } from "./productivity";
import { studentResources } from "./students";
import { findDataProblems } from "./validate";

/**
 * The seed library.
 *
 * Data is split by domain purely for editing ergonomics; nothing downstream
 * depends on the file boundaries. Consumers should not import this directly —
 * go through `lib/repository` so the storage layer stays swappable.
 */
const allSeedResources: Resource[] = [
  ...creativeResources,
  ...developmentResources,
  ...educationResources,
  ...studentResources,
  ...aiResources,
  ...productivityResources,
  ...lifeResources,
  ...batch001Resources,
  ...batch002Resources,
  ...batch003Resources,
  ...batch004Resources,
  ...batch005Resources,
  ...batch006Resources,
  ...batch007Resources,
];

/**
 * Validates the library at module load and throws on any problem, so `next build`
 * fails rather than shipping it. The rules themselves are in `validate.ts`, where
 * the unit tests can also run them against deliberately broken listings.
 */
const problems = findDataProblems(allSeedResources);
if (problems.length > 0) {
  throw new Error(`Seed resource data is invalid:\n  - ${problems.join("\n  - ")}`);
}

export const seedResources: readonly Resource[] = Object.freeze(allSeedResources);
