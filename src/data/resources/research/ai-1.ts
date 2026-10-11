import type { VerificationCheck, VerificationCheckRecord } from "@/types/resource";

import type { ResearchSource } from "../entertainment/define-media";
import type { ResearchOverlay } from "./apply";

/**
 * AI pass 1: the free plans people ask about most. Pages read on 2026-10-11.
 * Free AI plans change often, so each listing keeps only what the plan page says.
 */

const DATE = "2026-10-11";
const ok = (check: VerificationCheck, sourceUrl: string, evidence: string): VerificationCheckRecord => ({
  check,
  result: "confirmed",
  evidence,
  sourceUrl,
});
const src = (url: string, label: string): ResearchSource => ({ url, label });

const CLAUDE = "https://claude.com/pricing";
const COPILOT = "https://github.com/features/copilot/plans";
const SUPERMAVEN = "https://supermaven.com/";
/** Fetched from India; Google served the India edition (prices in INR). */
const GEMINI_IN = "https://gemini.google/subscriptions/";

export const aiResearch1: ResearchOverlay[] = [
  {
    slug: "claude",
    set: {
      pricingUrl: CLAUDE,
      requiresAccount: "yes",
      requiresCreditCard: "no",
      limitations: [
        "Usage limits reset on a rolling five-hour window; Anthropic publishes no fixed message count",
        "Free includes the Sonnet and Haiku models; Opus and Fable need a paid plan",
        "Up to 5 projects on the Free plan",
        "Claude Code, Research, Claude in Chrome and Microsoft 365 integrations are paid-plan features",
        "Chats may be used for model training unless you opt out",
      ],
      features: [
        "Chat on web, desktop, iOS and Android",
        "Web search, file creation and code execution",
        "Memory, connectors, skills and Artifacts",
        "Claude Design, Slides and Docs",
      ],
    },
    research: {
      date: DATE,
      sources: [src(CLAUDE, "Official pricing page: Free plan $0 'Free for everyone', feature comparison table, payment options and usage-limit FAQ")],
      checks: [
        ok("OFFICIAL_URL", CLAUDE, "claude.com is Anthropic's product site; 'Try Claude' links to claude.ai."),
        ok("FREE_STATUS", CLAUDE, "Free plan: '$0 — Free for everyone'."),
        ok("FREE_TIER_LIMITS", CLAUDE, "FAQ: limits reset on a rolling five-hour window with no fixed message count; Projects 'Up to 5' on Free; Opus 'No' on Free."),
        ok("ACCOUNT_REQUIREMENT", CLAUDE, "The Free plan button goes to claude.ai/login?plan=free."),
        ok("CREDIT_CARD_REQUIREMENT", CLAUDE, "Payment options table lists credit card as 'n/a' for the Free plan."),
        ok("PLATFORM_AVAILABILITY", CLAUDE, "'Chat on web, iOS, Android and Desktop' is included on Free."),
        ok("LIMITATIONS", CLAUDE, "Claude Code, Claude Science, Research, Chrome and Microsoft 365 are 'No' on Free; model training is 'Opt-out'."),
        ok("PRICING_INFORMATION", CLAUDE, "Pro is $17/month billed annually or $20 monthly; Max from $100/month."),
      ],
      notes:
        "Read on Anthropic's pricing page. Commercial use under the consumer terms was not checked.",
    },
  },
  {
    slug: "github-copilot-free",
    set: {
      limitations: [
        "2,000 inline code completions per month",
        "GitHub's FAQ caps Free at 50 chat requests a month; the plan table describes 'limited chat and agent usage'",
        "No pull-request code review, cloud agent or extra paid credits on Free",
        "Not available to people assigned a Copilot Business or Enterprise seat",
        "Free-plan interactions may be used to train models unless you opt out in settings",
      ],
      features: [
        "Inline code completions in VS Code, Visual Studio, JetBrains, Xcode, Neovim, Eclipse and others",
        "Agent mode and MCP servers in supported editors",
        "Copilot CLI in the terminal",
        "Chat on GitHub and GitHub Mobile",
      ],
    },
    research: {
      date: DATE,
      sources: [src(COPILOT, "Official Copilot plans page: Free $0, feature table per plan, FAQ on Free eligibility, limits and data use")],
      checks: [
        ok("OFFICIAL_URL", COPILOT, "github.com/features/copilot/plans is GitHub's own plan page."),
        ok("FREE_STATUS", COPILOT, "The Free plan is listed at $0; FAQ: 'GitHub Copilot Free is a new free pricing tier with limited functionality for individual developers'."),
        ok("FREE_TIER_LIMITS", COPILOT, "Inline suggestions: 'Free plan 2,000 per month'. FAQ: 'limited to 2000 completions and 50 chat requests'."),
        ok("LIMITATIONS", COPILOT, "Code review, cloud agent and buying extra credits are 'Not included' on Free; Business/Enterprise seat holders are not eligible; individual-plan data may train models unless opted out."),
        ok("PRICING_INFORMATION", COPILOT, "Pro $10/month, Pro+ $39/month, Max $100/month."),
      ],
      notes:
        "Read on GitHub's plans page. The page's plan table and FAQ describe the chat allowance differently; both are recorded. Operating systems are not listed per editor, so platforms were left unchanged.",
    },
  },
  {
    slug: "supermaven",
    set: {
      shortDescription: "Fast AI code completion for VS Code, JetBrains IDEs and Neovim, with a free tier; the 1M-token context is Pro-only.",
      longDescription:
        "Supermaven provides low-latency inline code completions in VS Code, JetBrains IDEs and Neovim. The free tier gives fast suggestions that work with large codebases; the 1 million token context window, the largest model, style adaptation and chat credits are Pro features.",
      whyListed: "A free, fast completion engine for developers who want suggestions without a subscription.",
      requiresCreditCard: "unknown",
      commercialUse: "unknown",
      features: [
        "Fast inline code suggestions",
        "Works with large codebases",
        "Extensions for VS Code, JetBrains IDEs and Neovim",
      ],
      limitations: [
        "The 1 million token context window, largest model and style adaptation are Pro-only",
        "Supermaven Chat credits are included only with Pro",
        "Code data is retained for up to 7 days, per Supermaven's code policy",
      ],
    },
    research: {
      date: DATE,
      sources: [src(SUPERMAVEN, "Official homepage with Plans & Pricing: Free tier $0/month with feature list (Pro-only items marked), Pro $10/month with 30-day trial; editors supported")],
      checks: [
        ok("OFFICIAL_URL", SUPERMAVEN, "supermaven.com is the product's own site."),
        ok("FREE_STATUS", SUPERMAVEN, "'Free Tier — $0/month — The fastest copilot, completely free.'"),
        ok("FREE_TIER_LIMITS", SUPERMAVEN, "The free list marks '1 million token context window', 'Largest, most intelligent model', 'Adapts to your coding style' and chat credits as 'Pro only'."),
        ok("LIMITATIONS", SUPERMAVEN, "'7-day data retention limit' is listed on every plan."),
        ok("PRICING_INFORMATION", SUPERMAVEN, "Pro $10/month with a 30-day free trial; Team $10/user/month."),
      ],
      notes:
        "Read on the official homepage. Corrected: the earlier listing claimed a 300,000-token context window on the free plan, which the page does not state. Card and commercial-use facts were reset to unknown because no page read settles them.",
    },
  },
  {
    slug: "google-gemini",
    set: {
      requiresAccount: "yes",
      limitations: [
        "Requires a Google Account",
        "Usage limits are compute-based and refresh every 5 hours up to a weekly limit, per Google's plans page",
        "The free plan's model is a lighter Flash-Lite model; Pro models and video generation need a paid Google AI plan",
      ],
      features: [
        "Chat and writing help",
        "Image generation and editing",
        "Deep Research, Gemini Live, Canvas and Gems",
        "Gemini Notebook research assistant",
      ],
    },
    research: {
      date: DATE,
      sources: [src(GEMINI_IN, "Official Google AI plans page (India): Free ₹0/month with a Google Account and its feature list; paid plans in INR; usage-limit footnote")],
      checks: [
        ok("OFFICIAL_URL", GEMINI_IN, "gemini.google is Google's official Gemini site."),
        ok("FREE_STATUS", GEMINI_IN, "Free plan: '₹0 INR / month' with a Google Account."),
        ok("ACCOUNT_REQUIREMENT", GEMINI_IN, "The free plan is offered 'with a Google account'."),
        ok("FREE_TIER_LIMITS", GEMINI_IN, "Footnote 2: compute-based usage limits that refresh every 5 hours until a weekly limit; free plan lists Flash-Lite access."),
        ok("LIMITATIONS", GEMINI_IN, "Paid plans add Pro-model access, 2x–4x the free usage and video generation."),
        ok("PRICING_INFORMATION", GEMINI_IN, "Google AI Plus ₹399/month, Google AI Pro ₹1,950/month, Ultra from ₹6,500/month (India)."),
      ],
      notes:
        "Read on the India edition of Google's plans page, so prices are in rupees. Corrected: removed a 32,000-token context-window limit that this page does not state. Model names change frequently and are deliberately not recorded in the description.",
    },
  },
  {
    slug: "google-ai-studio",
    set: {
      limitations: [
        "The free tier gives limited access to some models only",
        "On the free tier, content is used to improve Google's products",
        "Higher rate limits, context caching, Batch API and the most advanced models are on the paid tier",
      ],
    },
    research: {
      date: DATE,
      sources: [src(GEMINI_IN, "Official Google AI plans page (Developer tab): Gemini Developer API no-cost tier versus pay-as-you-go tier")],
      checks: [
        ok("FREE_STATUS", GEMINI_IN, "Gemini Developer API: a tier at 'no cost' for developers and small projects, including Google AI Studio access."),
        ok("FREE_TIER_LIMITS", GEMINI_IN, "No-cost tier: 'limited access to some models', input and output tokens at no cost."),
        ok("LIMITATIONS", GEMINI_IN, "No-cost tier: 'content used to improve our products'; paid tier adds higher rate limits, context caching, Batch API and the most advanced models."),
      ],
      notes:
        "Read on Google's plans page (Developer tab). Corrected: replaced unsourced region and age limitations with what this page states. The rate-limit numbers are shown inside AI Studio and were not read.",
    },
  },
];
