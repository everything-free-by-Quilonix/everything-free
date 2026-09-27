import { defineResources } from "./define";

/**
 * AI resources.
 *
 * Free allowances in this category change faster than anywhere else in the
 * library, which is why several entries here carry lower verification
 * confidence and deliberately avoid quoting specific numeric limits. A figure we
 * cannot keep current is worse than no figure at all.
 */
export const aiResources = defineResources([
  {
    slug: "ollama",
    name: "Ollama",
    shortDescription: "Run open-weight language models locally with one command.",
    longDescription:
      "Ollama packages open-weight language models so they can be downloaded and run on your own machine, exposing a local HTTP API and a command-line interface. Because inference happens locally, prompts and documents never leave the device.",
    whyListed:
      "It removes the usual cost and privacy trade-off in this category: there are no tokens to buy and no request quota, because nothing is sent to a provider.",
    category: "ai-models",
    subcategories: ["ai-chat", "ai-coding", "developer-utilities", "open-source"],
    resourceType: "OPEN_SOURCE",
    officialUrl: "https://ollama.com",
    sourceUrl: "https://github.com/ollama/ollama",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    licenseNotes:
      "Ollama itself is MIT licensed. The models you download through it each carry their own licence, and some restrict commercial use — check the licence of any model before using its output commercially.",
    platforms: ["WINDOWS", "MACOS", "LINUX", "SELF_HOSTED"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    apiAvailable: true,
    downloadAvailable: true,
    features: [
      "Local inference with no request quota",
      "Local HTTP API compatible with common client libraries",
      "Model library with one-command downloads",
      "Runs without any network connection once a model is downloaded",
    ],
    limitations: [
      "Output quality is bounded by what your hardware can run; large models need substantial RAM or VRAM.",
      "Inference speed on a CPU-only machine is slow enough to be frustrating for long responses.",
      "Model licences are separate from Ollama's and some prohibit commercial use.",
      "Command-line comfort helps, though graphical front-ends exist.",
    ],
    tags: ["local-ai", "llm", "privacy", "offline", "developer"],
    alternativeTo: ["ChatGPT Plus", "Claude Pro", "GitHub Copilot"],
    relatedResources: ["hugging-face", "whisper"],
    verificationStatus: "UNVERIFIED",
    compilationNotes:
      "Licence and local-execution model recorded from the project's repository. Hardware requirements vary by model and were not benchmarked.",
    editorialSpotlight: true,
  },
  {
    slug: "whisper",
    name: "Whisper",
    shortDescription: "Openly licensed speech recognition model for transcription and translation.",
    longDescription:
      "Whisper is an automatic speech recognition model released by OpenAI under the MIT licence, along with inference code. It transcribes audio in many languages and can translate speech into English, and it runs entirely on your own hardware.",
    whyListed:
      "Transcription is normally sold per minute. This is the same class of capability with no per-minute cost and no audio leaving your machine.",
    category: "ai-audio",
    subcategories: ["ai-models", "audio", "video"],
    resourceType: "AI_TOOL",
    officialUrl: "https://github.com/openai/whisper",
    sourceUrl: "https://github.com/openai/whisper",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    platforms: ["WINDOWS", "MACOS", "LINUX", "SELF_HOSTED"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    downloadAvailable: true,
    features: [
      "Transcription across many languages",
      "Speech translation into English",
      "Multiple model sizes trading accuracy for speed",
      "Runs fully offline",
      "Several faster third-party reimplementations available",
    ],
    limitations: [
      "Requires Python and command-line use, or a third-party wrapper.",
      "Larger, more accurate models need a capable GPU to run at reasonable speed.",
      "Accuracy varies considerably by language, accent and audio quality.",
      "Can occasionally produce fluent text that is not in the audio, so transcripts need review.",
    ],
    tags: ["transcription", "speech-to-text", "subtitles", "offline", "privacy", "accessibility"],
    alternativeTo: ["Otter.ai", "Rev", "Descript transcription"],
    relatedResources: ["ollama", "audacity", "hugging-face"],
    verificationStatus: "UNVERIFIED",
    compilationNotes:
      "MIT licensing of the model and inference code recorded from the project's repository. Accuracy characteristics summarised from the published model card rather than independent testing.",
  },
  {
    slug: "hugging-face",
    name: "Hugging Face",
    shortDescription: "Hosting and discovery for open models, datasets and demo apps.",
    longDescription:
      "Hugging Face hosts machine-learning models, datasets and interactive demos, with libraries for loading them into your own code. A free account allows public repositories, hosted demo Spaces on shared hardware, and limited use of hosted inference.",
    whyListed:
      "It is the practical index of openly licensed models and datasets, and the free account is enough to publish and run real work rather than only browse.",
    category: "ai-models",
    subcategories: ["ai-apis", "databases", "open-source", "ai-research"],
    resourceType: "SERVICE",
    officialUrl: "https://huggingface.co",
    pricingUrl: "https://huggingface.co/pricing",
    freeStatus: "FREE_TIER",
    openSource: false,
    licenseNotes:
      "The platform is a commercial service. Models and datasets hosted on it each carry their own licence, ranging from fully permissive to research-only — the licence is per repository, not platform-wide.",
    platforms: ["BROWSER"],
    requiresAccount: "yes",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    apiAvailable: true,
    downloadAvailable: true,
    features: [
      "Model and dataset hosting with Git-based versioning",
      "Hosted demo Spaces on free shared hardware",
      "Hosted inference with a free allowance",
      "Widely used Python libraries for loading models",
      "Dataset viewer and search",
    ],
    limitations: [
      "Free Spaces run on shared CPU and sleep when idle; GPU hardware is paid.",
      "Hosted inference on the free tier is rate-limited, and the allowance changes over time.",
      "Model licences vary and some prohibit commercial use regardless of the platform's terms.",
      "An account is required to publish anything.",
    ],
    pricingNotes:
      "Permanent free tier. Everything.Free does not quote specific inference or storage allowances here because they are revised frequently — check the pricing page.",
    tags: ["models", "datasets", "machine-learning", "developer", "ai-research"],
    alternativeTo: ["Replicate paid plans", "AWS SageMaker"],
    relatedResources: ["ollama", "whisper", "google-colab"],
    verificationStatus: "UNVERIFIED",
    compilationNotes:
      "The shape of the free tier is stable and documented, but the specific allowances were not re-checked during compilation and are intentionally not quoted as figures.",
  },
  {
    slug: "google-colab",
    name: "Google Colab",
    shortDescription: "Hosted Python notebooks with a free, non-guaranteed GPU allowance.",
    longDescription:
      "Google Colab runs Jupyter notebooks in the browser on Google-hosted machines, with common data science and machine learning libraries preinstalled. The free tier includes access to accelerated hardware when capacity is available.",
    whyListed:
      "It gives access to GPU compute without owning any hardware, with no setup beyond a Google account.",
    category: "ai-research",
    subcategories: ["ai-models", "learning", "science", "developer-utilities"],
    resourceType: "SERVICE",
    officialUrl: "https://colab.research.google.com",
    pricingUrl: "https://colab.research.google.com/signup",
    freeStatus: "FREE_TIER",
    openSource: false,
    platforms: ["BROWSER"],
    requiresAccount: "yes",
    requiresCreditCard: "no",
    commercialUse: "unknown",
    personalUse: "yes",
    features: [
      "Jupyter notebooks with no local setup",
      "Common ML and data libraries preinstalled",
      "Accelerated hardware when available",
      "Google Drive integration and easy sharing",
    ],
    limitations: [
      "Accelerated hardware is not guaranteed on the free tier and availability varies with demand.",
      "Sessions have maximum runtimes and are disconnected when idle; long training runs will be interrupted.",
      "The filesystem is ephemeral — anything not saved to Drive or elsewhere is lost when the session ends.",
      "Sustained or heavy use can lead to reduced access on the free tier.",
      "Requires a Google account, and notebooks run on Google's infrastructure.",
    ],
    pricingNotes:
      "Permanent free tier with best-effort resources. Paid tiers buy priority access and longer sessions rather than unlocking features.",
    tags: ["notebooks", "gpu", "python", "machine-learning", "students", "data-science"],
    alternativeTo: ["Paid GPU cloud instances", "Deepnote paid plans"],
    relatedResources: ["hugging-face", "ollama"],
    verificationStatus: "UNVERIFIED",
    compilationNotes:
      "Recorded from general product documentation but not verified against current terms during compilation. Free-tier resource policies in this product have changed repeatedly, and commercial-use terms were not established — treat the details here as a starting point and confirm on the official site.",
  },
  {
    slug: "languagetool",
    name: "LanguageTool",
    shortDescription: "Grammar and style checking in many languages, with an open-source core.",
    longDescription:
      "LanguageTool checks grammar, spelling and style across dozens of languages. The underlying checking engine is open source and can be self-hosted, while the hosted service adds a free tier and paid advanced suggestions, with browser and office integrations.",
    whyListed:
      "The checking engine is open source and self-hostable, so the capability is available without depending on the hosted service or sending text to it.",
    category: "languages",
    subcategories: ["ai-writing", "documents", "productivity"],
    resourceType: "WEB_APP",
    officialUrl: "https://languagetool.org",
    sourceUrl: "https://github.com/languagetool-org/languagetool",
    pricingUrl: "https://languagetool.org/premium",
    freeStatus: "FREE_TIER",
    openSource: true,
    license: "LGPL-2.1-or-later (core engine)",
    licenseNotes:
      "The core checking engine is openly licensed and self-hostable. The hosted service at languagetool.org is a commercial product built on it; the free-tier limits below apply to the hosted service, not to a self-hosted instance.",
    platforms: ["BROWSER", "WINDOWS", "MACOS", "LINUX", "SELF_HOSTED"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    apiAvailable: true,
    features: [
      "Grammar, spelling and style checks in many languages",
      "Browser extensions and office integrations",
      "Self-hostable open-source engine",
      "API access",
    ],
    limitations: [
      "The hosted free tier caps the amount of text per check.",
      "Advanced rewriting and style suggestions are reserved for the paid tier.",
      "Using the hosted service means your text is sent to LanguageTool's servers; self-hosting avoids this.",
      "Rule coverage is stronger for some languages than others.",
    ],
    pricingNotes:
      "Permanent free tier on the hosted service, or unlimited use by self-hosting the open-source engine.",
    tags: ["grammar", "writing", "proofreading", "self-hostable", "students", "languages"],
    alternativeTo: ["Grammarly Premium", "ProWritingAid"],
    relatedResources: ["libreoffice", "obsidian"],
    verificationStatus: "UNVERIFIED",
    compilationNotes:
      "Open-source core and the hosted free/paid split are documented by the project. The exact free-tier text-length cap was not re-checked and is deliberately not quoted here.",
  },
]);
