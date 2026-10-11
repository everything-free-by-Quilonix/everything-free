import type { VerificationCheck, VerificationCheckRecord } from "@/types/resource";

import type { ResearchSource } from "../entertainment/define-media";
import type { ResearchOverlay } from "./apply";

/** Students pass 1: the GitHub Student Developer Pack. Page read on 2026-10-11. */

const DATE = "2026-10-11";
const ok = (check: VerificationCheck, sourceUrl: string, evidence: string): VerificationCheckRecord => ({
  check,
  result: "confirmed",
  evidence,
  sourceUrl,
});
const src = (url: string, label: string): ResearchSource => ({ url, label });

const PACK = "https://education.github.com/pack";

export const studentsResearch1: ResearchOverlay[] = [
  {
    slug: "github-student-developer-pack",
    set: {
      shortDescription: "Free developer tools for verified students: GitHub Pro, Copilot Student, Codespaces and dozens of partner offers.",
      longDescription:
        "The GitHub Student Developer Pack gives verified students free GitHub Pro, GitHub Copilot Student and Pro-level Codespaces, plus offers from partners such as JetBrains (free IDEs, renewed yearly), Microsoft Azure ($100 credit for students 18+), MongoDB, Namecheap and Name.com domains, Datadog, Sentry and many learning platforms. Each offer has its own terms and duration.",
      whyListed: "The largest single bundle of free professional developer tools available to students, from GitHub and its partners.",
      limitations: [
        "Requires verification of student status",
        "Many partner offers are time-limited (for example 3, 6 or 12 months) rather than lasting while you study",
        "Some offers are credits or discounts rather than free access",
        "Some offers have age conditions, such as Azure's 18+ offer and a separate 13–17 offer",
        "Each offer must be claimed with the partner",
      ],
      features: [
        "Free GitHub Pro while you are a student",
        "GitHub Copilot Student: unlimited code completions plus an AI credit allowance",
        "Pro-level GitHub Codespaces",
        "Free JetBrains IDE subscription, renewed annually",
        "Domain names from Namecheap (.me), Name.com and .TECH",
      ],
    },
    research: {
      date: DATE,
      sources: [src(PACK, "Official Student Developer Pack page: list of offers and their terms (GitHub Pro, Copilot Student, Codespaces, JetBrains, Azure, domains, time-limited partner offers)")],
      checks: [
        ok("OFFICIAL_URL", PACK, "education.github.com/pack is GitHub's own page for the pack."),
        ok("FREE_STATUS", PACK, "Offers include 'Free GitHub Pro while you are a student' and 'Free Pro level access to Codespaces'."),
        ok("LIMITATIONS", PACK, "Offers carry their own durations (e.g. DataCamp three months, Educative six months, LambdaTest one year); Azure's offer is 'For students aged 18+'; Copilot Student is 'available to verified students'."),
        ok("ACCOUNT_REQUIREMENT", PACK, "Sign-up goes to github.com/settings/education/benefits, which needs a GitHub account."),
      ],
      notes:
        "Read on the official pack page. Corrected: removed an unsourced 'thousands of dollars' valuation and the '80+ partners' count, which the page does not state as a number.",
    },
  },
];
