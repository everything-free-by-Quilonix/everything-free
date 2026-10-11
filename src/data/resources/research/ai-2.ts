import type { VerificationCheck, VerificationCheckRecord } from "@/types/resource";

import type { ResearchSource } from "../entertainment/define-media";
import type { ResearchOverlay } from "./apply";

/** AI pass 2: ChatGPT, Mistral, OpenRouter, Groq. Pages read on 2026-10-11. */

const DATE = "2026-10-11";
const ok = (check: VerificationCheck, sourceUrl: string, evidence: string): VerificationCheckRecord => ({
  check,
  result: "confirmed",
  evidence,
  sourceUrl,
});
const open = (check: VerificationCheck, sourceUrl: string, evidence: string): VerificationCheckRecord => ({
  check,
  result: "unresolved",
  evidence,
  sourceUrl,
});
const src = (url: string, label: string): ResearchSource => ({ url, label });

const CHATGPT_FAQ = "https://help.openai.com/en/articles/9275245-chatgpt-free-tier-faq";
const MISTRAL = "https://mistral.ai/pricing";
const OPENROUTER = "https://openrouter.ai/docs/api/reference/limits";
const GROQ = "https://console.groq.com/docs/rate-limits";

export const aiResearch2: ResearchOverlay[] = [
  {
    slug: "chatgpt",
    set: {
      limitations: [
        "Everyday text chat is unlimited on Free, subject to abuse-prevention safeguards",
        "File uploads, image generation, voice and data analysis have separate usage limits that reset over time",
        "Ads may appear on the Free tier in certain countries",
        "New GPTs cannot be created on personal accounts; existing GPTs can be used",
      ],
      features: [
        "Chat with OpenAI's default free model",
        "Web search for up-to-date answers",
        "File and image uploads, data analysis",
        "Image creation within limits",
        "Library with 500 MB of storage",
      ],
    },
    research: {
      date: DATE,
      sources: [
        src(CHATGPT_FAQ, "OpenAI Help Center, ChatGPT Free Tier FAQ: free to use; capabilities; rate-limit rules; ads; GPT creation"),
        src("https://chatgpt.com/pricing", "Official pricing page: attempted, returned HTTP 403 to the research fetch; nothing confirmed from it"),
      ],
      checks: [
        ok("FREE_STATUS", CHATGPT_FAQ, "'ChatGPT is free to use.' Free tier users have chat, tools and GPTs."),
        ok("FREE_TIER_LIMITS", CHATGPT_FAQ, "'Free users have unlimited everyday text chats, subject to abuse-prevention safeguards'; uploads, image generation, voice and data analysis have separate limits."),
        ok("LIMITATIONS", CHATGPT_FAQ, "'Ads may appear in the Free tier in certain countries'; GPT creation is not available on personal accounts."),
        open("PRICING_INFORMATION", "https://chatgpt.com/pricing", "chatgpt.com/pricing returned HTTP 403 to the research fetch, so paid prices were not read."),
      ],
      notes:
        "Read on OpenAI's Help Center. The pricing page refused automated access; platforms and paid prices were not re-checked. The free model's name changes often and is deliberately not recorded.",
    },
  },
  {
    slug: "mistral-le-chat",
    set: {
      shortDescription: "Mistral AI's assistant (now Vibe, formerly Le Chat), with a limited free plan on web and mobile.",
      longDescription:
        "Mistral AI's assistant, now called Vibe and formerly Le Chat, offers chat, web search, image generation, document upload and a coding agent. The Free plan gives limited messages, searches and coding sessions on web and mobile; Pro raises the limits and adds full coding access.",
      freeStatus: "FREE_TIER",
      platforms: ["BROWSER", "IOS", "ANDROID"],
      requiresCreditCard: "unknown",
      commercialUse: "unknown",
      limitations: [
        "Limited messages, web searches and coding sessions on the Free plan",
        "Basic image generation; Pro allows up to 40x more",
        "Document library is 'Limited' on Free; up to 5 scheduled tasks",
      ],
      features: [
        "Chat with Mistral's latest models",
        "Web search and 100+ connectors",
        "Basic image generation and editing",
        "Vibe coding agent in the terminal",
      ],
    },
    research: {
      date: DATE,
      sources: [src(MISTRAL, "Official Mistral pricing page: Free plan feature list, comparison table, FAQ 'Does Mistral have a free plan?'; iOS and Android app links")],
      checks: [
        ok("OFFICIAL_URL", MISTRAL, "The Free plan's 'Start now' links to chat.mistral.ai, matching the listing."),
        ok("FREE_STATUS", MISTRAL, "FAQ: 'Yes, Mistral's Free plan provides limited access to Vibe' — a free tier, not unrestricted free use."),
        ok("FREE_TIER_LIMITS", MISTRAL, "Free: 'Limited messages and web searches', 'Limited coding sessions', 'Basic image generation'; library 'Limited'; task scheduling 'Up to 5'."),
        ok("PLATFORM_AVAILABILITY", MISTRAL, "'Access on web and mobile'; App Store and Google Play links in the footer."),
        ok("PRICING_INFORMATION", MISTRAL, "Pro $14.99/month; Team $24.99/user/month; students $5.99/month."),
      ],
      notes:
        "Read on Mistral's pricing page. Corrected: the listing said FREE with no limitations; the page describes limited free access, so it is FREE_TIER. The product was renamed from Le Chat to Vibe; the slug is kept so links keep working. Card and commercial-use facts were reset to unknown as no page read settles them.",
    },
  },
  {
    slug: "openrouter",
    set: {
      limitations: [
        "Free model variants (IDs ending ':free') have per-minute and per-day request caps",
        "The daily cap is higher once a set amount of credits has been bought",
        "A negative credit balance can block free models too",
        "Which models are free changes over time",
      ],
    },
    research: {
      date: DATE,
      sources: [src(OPENROUTER, "OpenRouter docs, Limits: free-model request caps by credits purchased, credit and budget limits")],
      checks: [
        ok("OFFICIAL_URL", OPENROUTER, "OpenRouter's own documentation."),
        ok("FREE_STATUS", OPENROUTER, "'If you're using a free model variant … the following limits apply', with requests-per-minute and per-day caps: free variants exist."),
        ok("LIMITATIONS", OPENROUTER, "Higher daily cap after purchasing credits; 'If your account has a negative credit balance, you may see errors, including for free models.'"),
        open("FREE_TIER_LIMITS", OPENROUTER, "The page's limit table rendered without its numbers in the fetch, so the exact per-minute and per-day figures were not confirmed."),
      ],
      notes:
        "Read on OpenRouter's Limits page. Corrected: removed specific request numbers that could not be read on the current page.",
    },
  },
  {
    slug: "groq",
    set: {
      limitations: [
        "Free-plan rate limits apply per organisation, measured in requests and tokens per minute and per day",
        "Exact current limits for an organisation are shown on its console limits page",
        "Batch and Flex processing and higher limits need the paid Developer plan",
      ],
    },
    research: {
      date: DATE,
      sources: [src(GROQ, "Groq docs, Rate Limits: Free Plan and Developer Plan limit tables, how limits are measured, upgrade note")],
      checks: [
        ok("OFFICIAL_URL", GROQ, "console.groq.com is Groq's developer console and documentation."),
        ok("FREE_STATUS", GROQ, "The page has a 'Free Plan Limits' table alongside 'Developer Plan Limits'."),
        ok("LIMITATIONS", GROQ, "'Rate limits apply at the organization level'; 'Upgrade to Developer plan to access higher limits, Batch and Flex processing'."),
        open("FREE_TIER_LIMITS", GROQ, "The table switches between plans and the fetched copy did not show which plan its numbers belonged to, so no figures were recorded."),
      ],
      notes:
        "Read on Groq's rate-limit page. Corrected: the old listing said the published table was Developer-only; the page has separate Free and Developer tables.",
    },
  },
];
