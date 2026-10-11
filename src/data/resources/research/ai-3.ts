import type { VerificationCheck, VerificationCheckRecord } from "@/types/resource";

import type { ResearchSource } from "../entertainment/define-media";
import type { ResearchOverlay } from "./apply";

/** AI pass 3: app builders (v0, Bolt) and n8n's licence. Pages read on 2026-10-11. */

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

const V0 = "https://v0.app/pricing";
const BOLT = "https://bolt.new/pricing";
const N8N_PRICING = "https://n8n.io/pricing/";
const N8N_LICENSE = "https://docs.n8n.io/choose-n8n/faircode-license";

export const aiResearch3: ResearchOverlay[] = [
  {
    slug: "v0-dev",
    set: {
      officialUrl: "https://v0.app",
      pricingUrl: V0,
      whyListed: "Lets anyone try Vercel's AI app and UI builder, deploy to Vercel and sync with GitHub, on a free plan.",
      requiresCreditCard: "unknown",
      commercialUse: "unknown",
      limitations: [
        "Free plan: 7 messages per day",
        "Access to all models, monthly credits and team sharing need a paid plan",
      ],
      features: [
        "Build apps and UI from prompts",
        "Deploy apps to Vercel",
        "Visual editing with Design Mode",
        "Sync with GitHub",
      ],
    },
    research: {
      date: DATE,
      sources: [src(V0, "Official v0 pricing page: Free $0/month plan contents including '7 message/day limit'; Plus, Business, Enterprise")],
      checks: [
        ok("OFFICIAL_URL", V0, "v0.app is Vercel's v0 site; v0.dev is the earlier address."),
        ok("FREE_STATUS", V0, "Free plan: '$0/month', 'Free access to v0'."),
        ok("FREE_TIER_LIMITS", V0, "Free plan includes a '7 message/day limit'."),
        ok("PRICING_INFORMATION", V0, "Plus $30/user/month with $30 monthly credits; Business $100/user/month."),
      ],
      notes:
        "Read on v0's pricing page. Corrected: the listing claimed 200 monthly message credits and that free generations are public; the page states a 7-messages-a-day limit and says nothing about visibility.",
    },
  },
  {
    slug: "bolt-new",
    set: {
      whyListed: "A browser-based AI app builder whose free plan publishes exact token limits and includes hosting.",
      requiresCreditCard: "unknown",
      commercialUse: "unknown",
      limitations: [
        "Free plan: 300,000 tokens a day and 1 million tokens a month",
        "Sites on the free plan carry Bolt branding",
        "10 MB file upload limit on the free plan",
      ],
      features: [
        "Public and private projects",
        "Website hosting, up to 333k web requests on Free",
        "Unlimited databases",
        "Runs in the browser",
      ],
    },
    research: {
      date: DATE,
      sources: [src(BOLT, "Official Bolt pricing page: Free $0 plan contents and FAQ 'What are the token limits associated with a free plan?'")],
      checks: [
        ok("OFFICIAL_URL", BOLT, "bolt.new is the product's own site."),
        ok("FREE_STATUS", BOLT, "Free plan at $0: 'Start for free. Upgrade as you go.'"),
        ok("FREE_TIER_LIMITS", BOLT, "FAQ: 'Free plans have a 300,000 token daily limit and 1 million token monthly limit.'"),
        ok("LIMITATIONS", BOLT, "Free plan lists 'Bolt branding on websites' and a '10MB file upload limit'."),
        ok("PRICING_INFORMATION", BOLT, "Pro from $25/month billed monthly; Teams $30/member/month."),
      ],
      notes:
        "Read on Bolt's pricing page. Corrected: removed an unsourced 'one-click Netlify deployment' feature; the page lists Bolt's own website hosting.",
    },
  },
  {
    slug: "n8n",
    set: {
      shortDescription: "Workflow automation and AI agent platform, free to self-host under n8n's fair-code licence; cloud plans are paid.",
      longDescription:
        "n8n is a workflow automation platform with a visual editor, code steps and AI agent nodes. The Community Edition is free to self-host under the Sustainable Use License, a fair-code licence: source-available and free for internal business, personal or non-commercial use, but not open source. n8n Cloud plans are paid, with a free trial.",
      whyListed: "Lets individuals and companies run their own automations without per-task fees, provided they stay within its licence.",
      openSource: false,
      license: "Sustainable Use License (fair-code)",
      licenseUrl: N8N_LICENSE,
      commercialUse: "unknown",
      limitations: [
        "Not open source: the licence allows use only for your own internal business purposes or non-commercial and personal use",
        "You may not offer n8n to others commercially, for example letting customers build workflows in it, without a separate agreement",
        "Files marked '.ee.' are under the n8n Enterprise License",
        "Hosted n8n Cloud is paid; only a free trial is offered there",
      ],
    },
    research: {
      date: DATE,
      sources: [
        src(N8N_LICENSE, "n8n docs, Community license: Sustainable Use License terms, 'Is n8n open source?' answer, scope of the Enterprise License"),
        src(N8N_PRICING, "Official pricing page: Cloud plans (Starter, Pro, Business, Enterprise) with free trials; Community Edition self-hosted on GitHub"),
      ],
      checks: [
        ok("OFFICIAL_URL", N8N_PRICING, "n8n.io is the company's own site."),
        ok("FREE_STATUS", N8N_LICENSE, "The licence grants 'the free right to use, modify, create derivative works, and redistribute' within its limitations."),
        ok("OPEN_SOURCE_STATUS", N8N_LICENSE, "'we do not call ourselves open source' — OSI licences cannot limit use, and this one does."),
        ok("LICENSE", N8N_LICENSE, "n8n uses the Sustainable Use License, a fair-code licence, plus the n8n Enterprise License for '.ee.' files."),
        ok("LIMITATIONS", N8N_LICENSE, "Use 'only for your own internal business purposes or for non-commercial or personal use'; distribute only 'free of charge for non-commercial purposes'."),
        ok("PRICING_INFORMATION", N8N_PRICING, "Cloud Starter 20€/month and Pro 50€/month billed annually; Business 667€/month; trials need no card except Business."),
        open(
          "COMMERCIAL_USE",
          N8N_LICENSE,
          "Internal business use is allowed but offering n8n to customers is not; a yes/no field cannot state that, so it is left unknown and described in the limitations.",
        ),
      ],
      notes:
        "Read on n8n's licence page and pricing page. Corrected: the listing marked n8n as open source; n8n's own documentation says it is not. Commercial use is described in the limitations rather than as a yes/no.",
    },
  },
];
