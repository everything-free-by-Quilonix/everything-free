import type { Platform } from "@/types/resource";
import { defineResources, type ResourceSeed } from "./define";

/**
 * Batch 010: High-Demand Security Auditing, OSINT, AI Editors & Self-Hosted Infrastructure.
 *
 * Adds trending, highly-requested free & open-source tools:
 * - Security & OSINT: Aircrack-ng, SpiderFoot, Sherlock
 * - AI & Coding: Void Editor, Fooocus, LibreChat
 * - Networking, Telephony & Privacy: Linphone, NetBird, Ghostfolio
 * - Creative & Design: Polotno Studio
 */
type BatchSeed = Omit<
  ResourceSeed,
  "requiresAccount" | "requiresCreditCard" | "commercialUse" | "personalUse" | "verificationStatus" | "compilationNotes" | "platforms"
> & {
  platforms?: Platform[];
  requiresAccount?: "yes" | "no" | "unknown";
  requiresCreditCard?: "yes" | "no" | "unknown";
  commercialUse?: "yes" | "no" | "unknown";
  personalUse?: "yes" | "no" | "unknown";
};

function seed(item: BatchSeed): ResourceSeed {
  return {
    ...item,
    platforms: item.platforms ?? ["BROWSER"],
    requiresAccount: item.requiresAccount ?? "unknown",
    requiresCreditCard: item.requiresCreditCard ?? "no",
    commercialUse: item.commercialUse ?? "unknown",
    personalUse: item.personalUse ?? "yes",
    verificationStatus: "UNVERIFIED",
    compilationNotes:
      "Compiled from project documentation, official source repositories, and release manifests. No maintainer verification pass has been recorded.",
  };
}

export const batch010Resources = defineResources([
  /* ------------------------------------------------------------- Security & OSINT */
  seed({
    slug: "aircrack-ng",
    name: "Aircrack-ng",
    shortDescription: "Complete suite of security tools to assess and audit Wi-Fi network security.",
    longDescription:
      "Aircrack-ng is an open-source command-line suite designed for evaluating 802.11 wireless network security. It includes tools for monitoring radio packets, testing wireless adapters, injecting frames, capturing WPA/WPA2 handshakes, and conducting dictionary recovery tests.",
    whyListed:
      "The standard open-source Wi-Fi security assessment suite used by penetration testers and network administrators worldwide.",
    category: "developer-utilities",
    subcategories: ["utilities", "open-source"],
    resourceType: "DEVELOPER_TOOL",
    officialUrl: "https://www.aircrack-ng.org",
    sourceUrl: "https://github.com/aircrack-ng/aircrack-ng",
    licenseUrl: "https://raw.githubusercontent.com/aircrack-ng/aircrack-ng/master/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GPL-2.0-only",
    platforms: ["LINUX", "WINDOWS", "MACOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    features: [
      "Packet capture and export to text or PCAP files for analysis",
      "Packet injection, deauthentication testing, and replay capabilities",
      "Cracking WEP and WPA/WPA2-PSK keys via dictionary and statistical methods",
      "Cross-platform support across Linux, Windows, and Unix-like systems",
    ],
    downloadAvailable: true,
    tags: ["wifi-security", "network-audit", "penetration-testing", "wireless"],
    relatedResources: ["wireshark", "nmap"],
  }),

  seed({
    slug: "spiderfoot",
    name: "SpiderFoot",
    shortDescription: "Automated OSINT reconnaissance tool for threat intelligence and attack surface mapping.",
    longDescription:
      "SpiderFoot is an open-source intelligence (OSINT) automation platform that queries over 100 public data sources to gather intelligence on IP addresses, domain names, e-mail addresses, and names. It maps attack surfaces, identifies network leaks, and correlates threats.",
    whyListed:
      "An essential automated OSINT recon engine that replaces expensive commercial threat intelligence platforms.",
    category: "developer-utilities",
    subcategories: ["utilities", "open-source"],
    resourceType: "DEVELOPER_TOOL",
    officialUrl: "https://www.spiderfoot.net",
    sourceUrl: "https://github.com/smicallef/spiderfoot",
    licenseUrl: "https://github.com/smicallef/spiderfoot/blob/master/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    platforms: ["LINUX", "WINDOWS", "MACOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    features: [
      "Automated scans across 100+ public OSINT data feeds",
      "Reconnaissance on IP, domain, hostname, CIDR, and phone targets",
      "Interactive graph visualization of asset relationships and leaks",
      "Web-based UI and command-line execution options",
    ],
    downloadAvailable: true,
    tags: ["osint", "threat-intelligence", "reconnaissance", "security-scanner"],
    alternativeTo: ["Maltego"],
    relatedResources: ["nmap", "wireshark"],
  }),

  seed({
    slug: "sherlock",
    name: "Sherlock",
    shortDescription: "Hunt down social media accounts by username across 400+ online networks.",
    longDescription:
      "Sherlock is an open-source OSINT utility designed to locate user accounts across hundreds of online platforms, forums, and social networks from a single command-line search query. It enables investigators to cross-reference public handles rapidly.",
    whyListed:
      "One of the most popular and efficient open-source username reconnaissance tools for digital forensics and privacy audits.",
    category: "utilities",
    subcategories: ["developer-utilities", "open-source"],
    resourceType: "DEVELOPER_TOOL",
    officialUrl: "https://sherlock-project.github.io",
    sourceUrl: "https://github.com/sherlock-project/sherlock",
    licenseUrl: "https://github.com/sherlock-project/sherlock/blob/master/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    platforms: ["LINUX", "WINDOWS", "MACOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    features: [
      "Fast simultaneous username queries across 400+ online sites",
      "Outputs results into CSV, JSON, or text report files",
      "Tor routing support for privacy-preserving queries",
      "Actively maintained site target definitions",
    ],
    downloadAvailable: true,
    tags: ["osint", "username-search", "digital-forensics", "privacy-audit"],
    relatedResources: ["nmap"],
  }),

  /* ------------------------------------------------------------- AI & Coding Assistants */
  seed({
    slug: "void-editor",
    name: "Void",
    shortDescription: "Open-source AI-native code editor designed as an accessible alternative to Cursor.",
    longDescription:
      "Void is an open-source, AI-first code editor built on top of VS Code architecture. It provides inline AI transformations, codebase-aware chat, and intelligent autocomplete while allowing users to retain full ownership of their data and configure their own local or hosted model backends.",
    whyListed:
      "A fast-growing open-source, vendor-neutral alternative to proprietary AI-first editors like Cursor.",
    category: "code-editors",
    subcategories: ["ai-coding", "open-source"],
    resourceType: "DESKTOP_APP",
    officialUrl: "https://voideditor.com",
    sourceUrl: "https://github.com/voideditor/void",
    licenseUrl: "https://github.com/voideditor/void/blob/main/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "Apache-2.0",
    platforms: ["WINDOWS", "MACOS", "LINUX"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    features: [
      "Native AI chat, inline diff edits, and contextual autocomplete",
      "Direct integration with local LLMs (Ollama) or private API keys",
      "Familiar VS Code keybindings and extension ecosystem compatibility",
      "Zero vendor lock-in or proprietary telemetry requirements",
    ],
    downloadAvailable: true,
    tags: ["ai-editor", "code-editor", "cursor-alternative", "open-source-ai"],
    alternativeTo: ["Cursor"],
    relatedResources: ["vs-code", "ollama"],
  }),

  seed({
    slug: "fooocus",
    name: "Fooocus",
    shortDescription: "Offline image generation software based on SDXL with automated prompting optimization.",
    longDescription:
      "Fooocus is an open-source image generating software that redesigns the Stable Diffusion interface, taking inspiration from Midjourney. It automates technical parameters and prompt engineering so users can focus on creativity while generating high-resolution art on local hardware.",
    whyListed:
      "Offers the simplicity of Midjourney in an offline, free, open-source tool without paywalled fast hours or cloud fees.",
    category: "ai-image",
    subcategories: ["open-source", "photography"],
    resourceType: "DESKTOP_APP",
    officialUrl: "https://github.com/lllyasviel/Fooocus",
    sourceUrl: "https://github.com/lllyasviel/Fooocus",
    licenseUrl: "https://github.com/lllyasviel/Fooocus/blob/main/LICENSE.txt",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GPL-3.0-only",
    platforms: ["WINDOWS", "LINUX"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    features: [
      "Midjourney-style image generation workflow without complex configuration",
      "Automated prompt enhancements and built-in artistic styles",
      "Inpainting, outpainting, and face swap tools built in",
      "Runs completely offline on consumer GPUs with no subscriptions",
    ],
    downloadAvailable: true,
    tags: ["image-generation", "ai-art", "sdxl", "midjourney-alternative"],
    alternativeTo: ["Midjourney"],
    relatedResources: ["sd-webui", "comfyui"],
  }),

  seed({
    slug: "librechat",
    name: "LibreChat",
    shortDescription: "Enhanced open-source AI chat platform supporting multi-model conversations, agents, and artifacts.",
    longDescription:
      "LibreChat is a feature-rich, self-hostable AI chat web application that aggregates multiple AI providers (OpenAI, Anthropic, Gemini, Mistral, Ollama) into a unified ChatGPT-like interface. It supports code execution, image generation, custom presets, file search, and autonomous AI agents.",
    whyListed:
      "The definitive open-source AI conversation interface that replaces expensive ChatGPT Team and Claude subscriptions.",
    category: "ai-chat",
    subcategories: ["ai-models", "open-source"],
    resourceType: "WEB_APP",
    officialUrl: "https://www.librechat.ai",
    sourceUrl: "https://github.com/danny-avila/LibreChat",
    licenseUrl: "https://github.com/danny-avila/LibreChat/blob/main/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    platforms: ["BROWSER", "LINUX", "WINDOWS", "MACOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    features: [
      "Unified interface for OpenAI, Anthropic, Gemini, Groq, and local Ollama models",
      "Multi-modal image support, file search, and code execution",
      "Artifact rendering for live HTML/React/SVG preview",
      "Multi-user authentication and role-based permissions",
    ],
    tags: ["ai-chat", "chatgpt-alternative", "local-llm", "self-hosted-ai"],
    alternativeTo: ["ChatGPT Plus", "Claude Pro"],
    relatedResources: ["ollama", "open-webui"],
  }),

  /* ------------------------------------------------------------- Networking, Telephony & Personal Finance */
  seed({
    slug: "linphone",
    name: "Linphone",
    shortDescription: "Open-source SIP VoIP phone for high-definition voice and video calling.",
    longDescription:
      "Linphone is an open-source Voice over IP (VoIP) client that operates via standard SIP protocols. It allows users to make and receive encrypted audio/video calls, send instant messages, and connect with any standard VoIP PBX or SIP provider without subscription lock-in.",
    whyListed:
      "A free, open-source alternative to proprietary softphones and virtual call clients like CallHippo and Zoiper.",
    category: "communication",
    subcategories: ["utilities", "open-source"],
    resourceType: "DESKTOP_APP",
    officialUrl: "https://www.linphone.org",
    sourceUrl: "https://gitlab.linphone.org/BC/public/linphone-desktop",
    licenseUrl: "https://gitlab.linphone.org/BC/public/linphone-desktop/-/blob/master/LICENSE.txt",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GPL-3.0-or-later",
    platforms: ["WINDOWS", "MACOS", "LINUX", "ANDROID", "IOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    features: [
      "HD audio and video calling supporting VP8, H.264, and Opus codecs",
      "End-to-end call encryption via SRTP and ZRTP protocols",
      "Compatible with any standard SIP provider or self-hosted PBX (Asterisk)",
      "Cross-platform desktop and mobile client support",
    ],
    downloadAvailable: true,
    tags: ["voip", "sip-client", "virtual-calling", "softphone"],
    alternativeTo: ["CallHippo", "Zoiper"],
  }),

  seed({
    slug: "netbird",
    name: "NetBird",
    shortDescription: "Open-source Zero Trust WireGuard-based overlay network connecting machines securely.",
    longDescription:
      "NetBird creates private point-to-point overlay networks using WireGuard and automated NAT traversal. It allows servers, laptops, and cloud workloads to communicate securely across firewalls without manual port forwarding or complex VPN gateway setups.",
    whyListed:
      "The leading open-source peer-to-peer mesh networking and Zero Trust VPN alternative to Tailscale.",
    category: "developer-utilities",
    subcategories: ["hosting", "open-source"],
    resourceType: "SERVICE",
    officialUrl: "https://netbird.io",
    sourceUrl: "https://github.com/netbirdio/netbird",
    licenseUrl: "https://github.com/netbirdio/netbird/blob/main/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "BSD-3-Clause",
    platforms: ["LINUX", "WINDOWS", "MACOS", "ANDROID", "IOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    features: [
      "Fast WireGuard mesh connectivity with automatic NAT hole-punching",
      "Zero Trust access control policies and identity provider integration",
      "100% self-hostable control plane and signaling infrastructure",
      "Multi-platform clients with instant peer connection",
    ],
    downloadAvailable: true,
    tags: ["vpn", "wireguard", "mesh-network", "tailscale-alternative"],
    alternativeTo: ["Tailscale", "ZeroTier"],
    relatedResources: ["wireguard"],
  }),

  seed({
    slug: "ghostfolio",
    name: "Ghostfolio",
    shortDescription: "Open-source privacy-first wealth management and portfolio tracking dashboard.",
    longDescription:
      "Ghostfolio is an open-source personal finance dashboard for tracking stocks, ETFs, cryptocurrencies, and personal accounts. It emphasizes complete data ownership, encryption, and anonymized tracking with zero data selling or advertising trackers.",
    whyListed:
      "A sovereign, privacy-respecting wealth tracking dashboard replacing subscription financial trackers like Kubera and Copilot Money.",
    category: "personal-finance",
    subcategories: ["personal", "open-source"],
    resourceType: "SERVICE",
    officialUrl: "https://ghostfol.io",
    sourceUrl: "https://github.com/ghostfolio/ghostfolio",
    licenseUrl: "https://github.com/ghostfolio/ghostfolio/blob/main/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "AGPL-3.0-only",
    platforms: ["LINUX", "WINDOWS", "MACOS", "BROWSER"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    features: [
      "Track multi-currency portfolios including stocks, ETFs, and cryptocurrencies",
      "Detailed asset allocation, performance analytics, and dividend summaries",
      "Import transactions from major brokers via CSV",
      "Completely self-hostable with PostgreSQL and Docker",
    ],
    downloadAvailable: true,
    tags: ["portfolio-tracker", "personal-finance", "net-worth", "privacy-first"],
    alternativeTo: ["Kubera", "Copilot Money"],
  }),

  /* ------------------------------------------------------------- Creative Design */
  seed({
    slug: "polotno-studio",
    name: "Polotno Studio",
    shortDescription: "Browser-based graphic design editor with templates, illustrations, and zero required account.",
    longDescription:
      "Polotno Studio is a clean, browser-based graphic canvas editor designed for creating social media banners, presentations, and digital posters. It runs entirely on client-side canvas technology with no mandatory account creation, credit card, or paywalled exports.",
    whyListed:
      "A genuinely free, zero-friction web graphics editor that provides instant Canva-style design exports without a subscription paywall.",
    category: "templates",
    subcategories: ["utilities"],
    resourceType: "WEB_APP",
    officialUrl: "https://studio.polotno.com",
    freeStatus: "FREE",
    openSource: false,
    license: "Freely accessible web app",
    platforms: ["BROWSER"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    features: [
      "Drag-and-drop graphic canvas with royalty-free icons and illustrations",
      "High-resolution PNG, JPEG, and PDF exports without watermarks",
      "No account creation, sign-up, or credit card required",
      "Browser-local project saving",
    ],
    tags: ["graphic-design", "banner-creator", "canva-alternative", "online-editor"],
    alternativeTo: ["Canva"],
    relatedResources: ["photopea"],
  }),
]);
