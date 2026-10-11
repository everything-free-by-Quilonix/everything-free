import type { Resource, VerificationCheck, VerificationCheckRecord } from "@/types/resource";

import type { ResearchSource } from "../entertainment/define-media";
import { defineResearchedList } from "./define-researched";

/**
 * AI tools, batch 1 — video, image, audio, voice, writing, productivity, automation.
 *
 * Every value below comes from a provider page or official repository read on
 * 2026-10-11. Unknown facts stay "unknown". Not registered in any index.
 */

const DATE = "2026-10-11";
const ok = (check: VerificationCheck, sourceUrl: string, evidence: string): VerificationCheckRecord => ({
  check,
  result: "confirmed",
  evidence,
  sourceUrl,
});
const src = (url: string, label: string): ResearchSource => ({ url, label });

/* ------------------------------------------------------------------ sources */

const WAN = "https://github.com/Wan-Video/Wan2.2";
const FRAMEPACK = "https://github.com/lllyasviel/FramePack";
const HUNYUAN = "https://github.com/Tencent-Hunyuan/HunyuanVideo";
const HUNYUAN_LICENSE = "https://github.com/Tencent-Hunyuan/HunyuanVideo/blob/main/LICENSE.txt";
const ESRGAN = "https://github.com/xinntao/Real-ESRGAN";
const REMBG = "https://github.com/danielgatis/rembg";
const KRITA_AI = "https://github.com/Acly/krita-ai-diffusion";
const LEONARDO = "https://leonardo.ai/pricing/";
const IDEOGRAM_PLANS = "https://docs.ideogram.ai/plans-and-pricing/available-plans";
const UVR = "https://github.com/Anjok07/ultimatevocalremovergui";
const AUDIOCRAFT = "https://github.com/facebookresearch/audiocraft";
const SUNO = "https://suno.com/pricing";
const KOKORO = "https://github.com/hexgrad/kokoro";
const COQUI = "https://github.com/idiap/coqui-ai-TTS";
const INDIC_PARLER = "https://huggingface.co/ai4bharat/indic-parler-tts";
const ELEVENLABS = "https://elevenlabs.io/pricing";
const GRAMMARLY = "https://www.grammarly.com/plans";
const OTTER = "https://otter.ai/pricing";
const ACTIVEPIECES_REPO = "https://github.com/activepieces/activepieces";
const ACTIVEPIECES_PRICING = "https://www.activepieces.com/pricing";

export const aiTools1Resources: Resource[] = defineResearchedList([
  /* ---------------------------------------------------------------- ai-video */
  {
    slug: "wan-2-2",
    name: "Wan2.2",
    shortDescription: "Open video generation models for text-to-video and image-to-video, released under Apache 2.0.",
    longDescription:
      "Wan2.2 is a family of large-scale video generation models from the Wan team, published with inference code on GitHub and weights on Hugging Face and ModelScope. The repository states the models are licensed under Apache 2.0, and its TI2V-5B model supports text-to-video and image-to-video in one framework.",
    whyListed:
      "It is one of the few video generation models whose weights are published under a permissive open-source licence, so it can be run locally without a subscription.",
    category: "ai-video",
    resourceType: "AI_TOOL",
    officialUrl: WAN,
    sourceUrl: WAN,
    licenseUrl: "https://github.com/Wan-Video/Wan2.2/blob/main/LICENSE.txt",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "Apache-2.0",
    platforms: [],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    downloadAvailable: true,
    limitations: [
      "Running the models locally needs a capable GPU; the README cites a single consumer-grade GPU taking under 9 minutes for a 5-second 720P clip with TI2V-5B",
      "The licence text adds use restrictions on harmful, unlawful or misleading content",
    ],
    features: [
      "Text-to-video and image-to-video in the TI2V-5B model",
      "Mixture-of-Experts architecture in Wan2.2",
      "Weights published on Hugging Face and ModelScope",
    ],
    tags: ["video-generation", "text-to-video", "image-to-video", "open-weights", "local-ai"],
    research: {
      date: DATE,
      sources: [src(WAN, "Official repository README: licence agreement, models, hardware notes")],
      checks: [
        ok("OFFICIAL_URL", WAN, "The Wan-Video organisation's Wan2.2 repository is linked from wan.video and hosts the official README."),
        ok("FREE_STATUS", WAN, "README 'License Agreement': 'The models in this repository are licensed under the Apache 2.0 License.'"),
        ok("LICENSE", WAN, "Repository sidebar lists 'Apache-2.0 license'; LICENSE.txt is in the repository root."),
        ok("OPEN_SOURCE_STATUS", WAN, "Code and models are published in the repository under Apache 2.0, with weights linked on Hugging Face and ModelScope."),
        ok("LIMITATIONS", WAN, "README: 'TI2V-5B can generate a 5-second 720P video in under 9 minutes on a single consumer-grade GPU'; usage 'must not involve sharing any content that violates applicable laws'."),
      ],
      notes:
        "Read the Wan2.2 README. Platform support and minimum VRAM for the larger models were not checked (INSTALL.md not read), so platforms are left empty.",
    },
  },
  {
    slug: "framepack",
    name: "FramePack",
    shortDescription: "Desktop software for next-frame video diffusion that runs on GPUs with as little as 6 GB of memory.",
    longDescription:
      "FramePack is the official implementation of a next-frame-prediction video diffusion structure by Lvmin Zhang and collaborators. It ships as a one-click Windows package and a Linux install, generates video progressively from an input image and prompt, and is published under Apache 2.0.",
    whyListed:
      "It makes local video generation possible on laptop-class NVIDIA GPUs, which most video models do not.",
    category: "ai-video",
    resourceType: "AI_TOOL",
    officialUrl: FRAMEPACK,
    sourceUrl: FRAMEPACK,
    licenseUrl: "https://github.com/lllyasviel/FramePack/blob/main/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "Apache-2.0",
    platforms: ["WINDOWS", "LINUX"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    downloadAvailable: true,
    limitations: [
      "Requires an NVIDIA RTX 30XX, 40XX or 50XX GPU with at least 6 GB of memory; GTX 10XX/20XX are not tested",
      "First run downloads more than 30 GB of models from Hugging Face",
      "The project has no web service; the README warns that other FramePack websites are not official",
    ],
    features: [
      "One-click Windows package with update and run scripts",
      "Progressive generation, so frames are visible before the clip finishes",
      "Generation workload stays constant regardless of video length",
    ],
    tags: ["video-generation", "image-to-video", "local-ai", "desktop"],
    research: {
      date: DATE,
      sources: [src(FRAMEPACK, "Official repository README: requirements, installation, licence")],
      checks: [
        ok("OFFICIAL_URL", FRAMEPACK, "README: 'this GitHub repository is the only official FramePack website. We do not have any web services.'"),
        ok("FREE_STATUS", FRAMEPACK, "Repository is published under the Apache-2.0 licence with a downloadable one-click package."),
        ok("LICENSE", FRAMEPACK, "Repository sidebar lists 'Apache-2.0 license'."),
        ok("OPEN_SOURCE_STATUS", FRAMEPACK, "Source code is public in the repository under Apache-2.0."),
        ok("PLATFORM_AVAILABILITY", FRAMEPACK, "Requirements: 'Linux or Windows operating system.' A one-click Windows package is linked."),
        ok("LIMITATIONS", FRAMEPACK, "Requirements: 'Nvidia GPU in RTX 30XX, 40XX, 50XX series… At least 6GB GPU memory.' Installation: 'You will download more than 30GB from HuggingFace.'"),
      ],
      notes: "Read the FramePack README. Licence terms of the downloaded base model weights were not checked.",
    },
  },
  {
    slug: "hunyuanvideo",
    name: "HunyuanVideo",
    shortDescription: "Tencent's 13B-parameter video generation model with published weights, under a community licence.",
    longDescription:
      "HunyuanVideo is Tencent's video foundation model, released with PyTorch model definitions, pre-trained weights and inference code. It is licensed under the Tencent Hunyuan Community License, which is royalty-free inside its defined territory but excludes the European Union, United Kingdom and South Korea, so it is not an OSI open-source licence.",
    whyListed:
      "Its weights can be downloaded and run locally at no charge, and it is supported in ComfyUI and Diffusers, but the licence terms need reading before use.",
    category: "ai-video",
    resourceType: "AI_TOOL",
    officialUrl: HUNYUAN,
    sourceUrl: HUNYUAN,
    licenseUrl: HUNYUAN_LICENSE,
    freeStatus: "LIMITED_FREE",
    openSource: false,
    license: "Tencent Hunyuan Community License",
    licenseNotes:
      "Not an OSI licence: it does not apply in the EU, UK or South Korea, bars using outputs to improve other AI models, and requires a separate licence above 100 million monthly active users.",
    platforms: ["LINUX"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    downloadAvailable: true,
    limitations: [
      "Licence does not apply in the European Union, United Kingdom or South Korea, and use outside its territory is unlicensed",
      "Outputs may not be used to improve any AI model other than Tencent Hunyuan or its derivatives",
      "Products above 100 million monthly active users must request a separate licence from Tencent",
      "Needs an NVIDIA GPU with CUDA; minimum 45 GB of GPU memory for 544p and 60 GB for 720p, tested on Linux",
    ],
    features: [
      "Text-to-video generation with published checkpoints",
      "FP8 weights that save about 10 GB of GPU memory",
      "Gradio web demo and multi-GPU parallel inference",
    ],
    tags: ["video-generation", "text-to-video", "open-weights", "tencent"],
    research: {
      date: DATE,
      sources: [
        src(HUNYUAN, "Official repository README: requirements, weights, installation"),
        src(HUNYUAN_LICENSE, "Tencent Hunyuan Community License Agreement text"),
      ],
      checks: [
        ok("OFFICIAL_URL", HUNYUAN, "Tencent-Hunyuan/HunyuanVideo repository 'contains PyTorch model definitions, pre-trained weights and inference/sampling code'."),
        ok("FREE_STATUS", HUNYUAN_LICENSE, "Section 2 grants 'for the Territory only, a non-exclusive, non-transferable and royalty-free limited license'."),
        ok("LICENSE", HUNYUAN_LICENSE, "File title: 'TENCENT HUNYUAN COMMUNITY LICENSE AGREEMENT'."),
        ok("OPEN_SOURCE_STATUS", HUNYUAN_LICENSE, "'THIS LICENSE AGREEMENT DOES NOT APPLY IN THE EUROPEAN UNION, UNITED KINGDOM AND SOUTH KOREA' — a territorial restriction that OSI licences do not carry."),
        ok("LIMITATIONS", HUNYUAN_LICENSE, "Section 4: over 100 million monthly active users 'You must request a license from Tencent'; Section 5(b): must not use outputs 'to improve any other AI model'."),
        ok("PLATFORM_AVAILABILITY", HUNYUAN, "Requirements: 'An NVIDIA GPU with CUDA support is required… Tested operating system: Linux'."),
      ],
      notes:
        "Read the README and LICENSE.txt. Classified LIMITED_FREE rather than OPEN_SOURCE because the licence is territorial and use-restricted. HunyuanVideo-1.5 is a separate repository and was not checked.",
    },
  },

  /* ---------------------------------------------------------------- ai-image */
  {
    slug: "real-esrgan",
    name: "Real-ESRGAN",
    shortDescription: "Image and video upscaling and restoration models, with portable executables for Windows, Linux and macOS.",
    longDescription:
      "Real-ESRGAN, from Tencent ARC Lab researchers, upscales and restores real-world images and anime video. It is available as a Python package, as portable NCNN executables that need no CUDA or PyTorch install, and through Colab demos, under the BSD-3-Clause licence.",
    whyListed:
      "It is the upscaling engine many free GUI tools build on, and its portable executables work on Intel, AMD and NVIDIA GPUs without a Python setup.",
    category: "ai-image",
    subcategories: ["ai-video"],
    resourceType: "AI_TOOL",
    officialUrl: ESRGAN,
    sourceUrl: ESRGAN,
    licenseUrl: "https://github.com/xinntao/Real-ESRGAN/blob/master/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "BSD-3-Clause",
    platforms: ["WINDOWS", "LINUX", "MACOS"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    downloadAvailable: true,
    limitations: [
      "The command-line executables have no graphical interface; GUIs are separate community projects",
      "The online ARC demo supports only the RealESRGAN_x4plus_anime_6B model",
    ],
    features: [
      "Portable executables bundling all binaries and models",
      "Models for general photos, anime images and anime video",
      "Python package and Colab notebooks",
    ],
    tags: ["upscaling", "image-restoration", "super-resolution", "anime"],
    alternativeTo: ["Topaz Gigapixel AI"],
    research: {
      date: DATE,
      sources: [src(ESRGAN, "Official repository README: usage, executables, licence")],
      checks: [
        ok("OFFICIAL_URL", ESRGAN, "xinntao/Real-ESRGAN is the repository for the Real-ESRGAN paper by Xintao Wang et al., Tencent ARC Lab."),
        ok("FREE_STATUS", ESRGAN, "Repository is published under BSD-3-Clause with downloadable release executables."),
        ok("LICENSE", ESRGAN, "Repository sidebar lists 'BSD-3-Clause license'."),
        ok("OPEN_SOURCE_STATUS", ESRGAN, "Source code is public and installable via 'python setup.py develop' or PyPI."),
        ok("PLATFORM_AVAILABILITY", ESRGAN, "'You can download Windows / Linux / MacOS executable files for Intel/AMD/Nvidia GPU.'"),
        ok("LIMITATIONS", ESRGAN, "'You can try in our website: ARC Demo (now only support RealESRGAN_x4plus_anime_6B)'."),
      ],
      notes: "Read the README. The last release date and maintenance activity were not checked.",
    },
  },
  {
    slug: "rembg",
    name: "rembg",
    shortDescription: "Command-line tool and Python library that removes image backgrounds locally with downloadable models.",
    longDescription:
      "rembg removes image backgrounds and can be used as a CLI, a Python library, an HTTP server or a Docker container. Local ONNX models download on first use. The code is MIT-licensed, but each model carries its own licence, and the default BRIA model needs a paid agreement for commercial use.",
    whyListed:
      "It does background removal on your own machine, including batch processing of folders, instead of uploading images to a web service.",
    category: "ai-image",
    resourceType: "DEVELOPER_TOOL",
    officialUrl: REMBG,
    sourceUrl: REMBG,
    licenseUrl: "https://github.com/danielgatis/rembg/blob/main/LICENSE.txt",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    licenseNotes:
      "Model weights carry their own licences, independent of rembg's MIT licence. The default bria-rmbg model (RMBG-2.0) requires a paid agreement with BRIA for commercial use.",
    platforms: [],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    apiAvailable: true,
    downloadAvailable: true,
    limitations: [
      "The default bria-rmbg model requires a paid BRIA agreement for commercial use; pass another model such as u2net to avoid it",
      "Requires Python 3.11 to 3.13",
      "The withoutbg and atlascloud backends send images to third-party servers and need API keys",
    ],
    features: [
      "CLI with single-file, folder batch, HTTP server and FFmpeg stream modes",
      "Several models including u2net, BiRefNet variants and BRIA RMBG",
      "Optional alpha matting and colour decontamination for hair and fur edges",
    ],
    tags: ["background-removal", "image-processing", "python", "cli"],
    alternativeTo: ["remove.bg"],
    research: {
      date: DATE,
      sources: [src(REMBG, "Official repository README: installation, models, licence")],
      checks: [
        ok("OFFICIAL_URL", REMBG, "danielgatis/rembg README: 'Rembg is a tool to remove image backgrounds. It can be used as a CLI, Python library, HTTP server, or Docker container.'"),
        ok("FREE_STATUS", REMBG, "README 'License': 'Licensed under the MIT License.'"),
        ok("LICENSE", REMBG, "Repository sidebar lists 'MIT license'; README: 'Copyright (c) 2020-present Daniel Gatis'."),
        ok("OPEN_SOURCE_STATUS", REMBG, "Source code is public and installed with pip install \"rembg[cpu,cli]\"."),
        ok("LIMITATIONS", REMBG, "'RMBG-2.0 is released under a BRIA license that requires a paid agreement for commercial use. Model weights carry their own licenses, independent of rembg's MIT license.'"),
      ],
      notes:
        "Read the README. Platform support depends on onnxruntime and was not settled, so platforms are left empty.",
    },
  },
  {
    slug: "krita-ai-diffusion",
    name: "Krita AI Diffusion",
    shortDescription: "Krita plugin for generative fill, inpainting, upscaling and live painting with local image models.",
    longDescription:
      "Krita AI Diffusion is a GPL-3.0 plugin by Acly that adds image generation to Krita 5.2 or newer, using a ComfyUI backend. It supports inpainting, outpainting, ControlNet, regions and upscaling, and can run models locally on your own GPU.",
    whyListed:
      "It brings model-based editing into a free painting application, keeping the work in layers and selections instead of a separate prompt window.",
    category: "ai-image",
    subcategories: ["design"],
    resourceType: "CREATIVE_TOOL",
    officialUrl: KRITA_AI,
    sourceUrl: KRITA_AI,
    licenseUrl: "https://github.com/Acly/krita-ai-diffusion/blob/main/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GPL-3.0",
    platforms: ["WINDOWS", "LINUX", "MACOS"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    downloadAvailable: true,
    limitations: [
      "Local generation recommends an NVIDIA GPU with at least 6 GB VRAM; CPU is supported but very slow",
      "Requires Krita 5.2.0 or newer",
      "The optional cloud generation service was not checked for price",
    ],
    features: [
      "Inpainting and outpainting from selections",
      "Live painting with real-time interpretation of the canvas",
      "ControlNet, IP-Adapter, regions and custom presets",
    ],
    tags: ["krita", "image-generation", "inpainting", "plugin", "comfyui"],
    relatedResources: ["krita", "comfyui"],
    alternativeTo: ["Adobe Photoshop Generative Fill"],
    research: {
      date: DATE,
      sources: [src(KRITA_AI, "Official repository README: features, requirements, licence")],
      checks: [
        ok("OFFICIAL_URL", KRITA_AI, "Acly/krita-ai-diffusion README links www.interstice.cloud and docs.interstice.cloud as the project's introduction and docs."),
        ok("FREE_STATUS", KRITA_AI, "Repository is published under GPL-3.0; README goal 'Local, Open, Free… run everything local on your hardware.'"),
        ok("LICENSE", KRITA_AI, "Repository sidebar lists 'GPL-3.0 license'."),
        ok("OPEN_SOURCE_STATUS", KRITA_AI, "Source is public; README: 'We are committed to open source models.'"),
        ok("PLATFORM_AVAILABILITY", KRITA_AI, "README 'Operating System': 'Windows, Linux, MacOS'."),
        ok("LIMITATIONS", KRITA_AI, "'To run locally a powerful graphics card with at least 6 GB VRAM (NVIDIA) is recommended'; CPU 'supported, but very slow'; 'Required version: 5.2.0 or newer'."),
      ],
      notes:
        "Read the README. The README mentions optional cloud generation 'to get started quickly'; its pricing was not read.",
    },
  },
  {
    slug: "leonardo-ai",
    name: "Leonardo.Ai",
    shortDescription: "Image and video generation platform with a free plan of 150 fast tokens a day.",
    longDescription:
      "Leonardo.Ai is a hosted image, video and design generation platform with web and mobile apps. Its free plan includes 150 fast tokens per day that reset daily, basic quality settings and public creations; paid plans add private generations, model training and token rollover.",
    whyListed:
      "The daily token allowance is enough to try image and video generation without a subscription, and the free tier includes a commercial-use licence for outputs.",
    category: "ai-image",
    subcategories: ["ai-video"],
    resourceType: "AI_TOOL",
    officialUrl: "https://leonardo.ai/",
    pricingUrl: LEONARDO,
    freeStatus: "FREE_TIER",
    openSource: false,
    platforms: ["BROWSER", "IOS", "ANDROID"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "yes",
    personalUse: "unknown",
    apiAvailable: true,
    limitations: [
      "150 fast tokens per day with no rollover; tokens reset daily",
      "Free-plan creations are public and cannot be made private",
      "Basic quality settings only; no personal model training or top-up tokens",
      "On the free tier Leonardo.Ai holds rights to use, reproduce and distribute your images; you get a non-exclusive commercial licence",
    ],
    features: [
      "Image and video generation, including third-party models",
      "Presets and Flow State",
      "Limited access to Realtime Canvas and Ultra Quality",
    ],
    tags: ["image-generation", "video-generation", "hosted"],
    alternativeTo: ["Midjourney"],
    research: {
      date: DATE,
      sources: [src(LEONARDO, "Pricing page: Free plan allowance, feature table and FAQ on ownership")],
      checks: [
        ok("OFFICIAL_URL", LEONARDO, "Pricing page on leonardo.ai, '© 2026 All Rights Reserved, Leonardo Interactive Pty Ltd'."),
        ok("FREE_STATUS", LEONARDO, "FREE plan '$0 /month' alongside paid Essential, Premium and Ultimate plans."),
        ok("FREE_TIER_LIMITS", LEONARDO, "FREE: 'Fast Tokens 150 / day', 'Creations access Public', 'Quality settings Basic', 'Personal collections 1'; Rollover Token Bank '-'."),
        ok("COMMERCIAL_USE", LEONARDO, "FAQ: 'Free tier users: While Leonardo.Ai owns rights to the images you create, you're granted a non-exclusive, royalty-free licence to use your generated content for commercial purposes.'"),
        ok("LIMITATIONS", LEONARDO, "Free-plan table: Personal AI Model Training '-', Private Generations '-', Top-up Tokens '-'; 'Token Top-up Packs are available to paid users only.'"),
        ok("PLATFORM_AVAILABILITY", LEONARDO, "Page footer shows 'Download on App Store' and 'Get it on Google Play' alongside the web app."),
        ok("PRICING_INFORMATION", LEONARDO, "Essential $12/month, Premium $30/month, Ultimate $60/month, ex. tax."),
      ],
      notes:
        "Read the pricing page. How many images 150 tokens buys varies by model and is not stated as a fixed number, so none is recorded.",
    },
  },
  {
    slug: "ideogram",
    name: "Ideogram",
    shortDescription: "Image generator known for rendering text in images, with 30 free credits a week.",
    longDescription:
      "Ideogram is a hosted image generation and editing service with web and iOS apps. Free accounts receive 30 credits each week when they sign in with Google, Apple or Microsoft; images, edits, upscales and app runs all cost credits, and everything generated on the free plan is public.",
    whyListed:
      "A weekly credit allowance with no subscription is a practical way to make posters, logos and images with legible text.",
    category: "ai-image",
    resourceType: "AI_TOOL",
    officialUrl: "https://ideogram.ai/",
    pricingUrl: "https://ideogram.ai/pricing",
    freeStatus: "FREE_TIER",
    openSource: false,
    platforms: ["BROWSER", "IOS"],
    requiresAccount: "yes",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    apiAvailable: true,
    limitations: [
      "30 credits a week; unused monthly plan credits do not roll over",
      "Free credits apply only to accounts that sign in with Google, Apple or Microsoft; email-and-password accounts get none",
      "Everything generated on the free plan is public",
      "When free credits run out you wait for next week's credits or buy more",
    ],
    features: [
      "Image generation, editing, remix and upscale",
      "Transparent backgrounds and logo creation",
      "Video app and batch generation",
    ],
    tags: ["image-generation", "typography", "hosted"],
    research: {
      date: DATE,
      sources: [src(IDEOGRAM_PLANS, "Official help docs: Plans and Credits (last verified October 1, 2026)")],
      checks: [
        ok("OFFICIAL_URL", IDEOGRAM_PLANS, "Ideogram's GitBook documentation links ideogram.ai as the website and ideogram.ai/pricing for subscriptions."),
        ok("FREE_STATUS", IDEOGRAM_PLANS, "Plans table: 'Free $0 $0 30 a week' alongside Plus, Pro, Team and Enterprise."),
        ok("FREE_TIER_LIMITS", IDEOGRAM_PLANS, "'Free accounts get 30 credits each week if they sign in with Google, Apple or Microsoft.'"),
        ok("ACCOUNT_REQUIREMENT", IDEOGRAM_PLANS, "'Accounts created with an email and password don't get free credits'; free credits require signing in with Google, Apple or Microsoft."),
        ok("LIMITATIONS", IDEOGRAM_PLANS, "'On the free plan, everything you generate is public.' Free: 'Wait for next week's 30 credits, or buy credits.'"),
        ok("PLATFORM_AVAILABILITY", IDEOGRAM_PLANS, "Docs sidebar links the Website and an 'iOS app' on the App Store."),
        ok("PRICING_INFORMATION", IDEOGRAM_PLANS, "Plus $20/month, Pro $60/month, Team $30 per user/month, in US dollars before tax."),
      ],
      notes:
        "ideogram.ai/pricing returned 403 to the fetcher, so Ideogram's own help documentation was used instead. Commercial-use terms for free-plan images were not checked.",
    },
  },

  /* ---------------------------------------------------------------- ai-audio */
  {
    slug: "ultimate-vocal-remover",
    name: "Ultimate Vocal Remover",
    shortDescription: "Desktop app that separates vocals and instruments from songs using neural source-separation models.",
    longDescription:
      "Ultimate Vocal Remover (UVR) is a GUI application that bundles Python, PyTorch and separation models, including MDX-Net, VR Architecture and Demucs, into installers for Windows and macOS, with manual setup for Linux. Its code is MIT-licensed.",
    whyListed:
      "It puts stem separation, the job behind karaoke tracks and remixes, into a desktop app with no account or upload.",
    category: "ai-audio",
    subcategories: ["audio"],
    resourceType: "DESKTOP_APP",
    officialUrl: UVR,
    sourceUrl: UVR,
    licenseUrl: "https://github.com/Anjok07/ultimatevocalremovergui/blob/master/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    platforms: ["WINDOWS", "MACOS", "LINUX"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    downloadAvailable: true,
    limitations: [
      "GPU conversion needs at least an NVIDIA GTX 1060 6GB; 8 GB VRAM is recommended and AMD support is limited",
      "64-bit systems only; Windows installs must go on the C: drive",
      "Non-WAV files need FFmpeg, and time-stretch or pitch tools need Rubber Band",
    ],
    features: [
      "Windows installer and macOS DMGs for Apple Silicon and Intel",
      "MDX-Net, VR Architecture and Demucs models",
      "DirectML build for AMD Radeon and Intel Arc GPUs",
    ],
    tags: ["stem-separation", "vocal-remover", "karaoke", "music"],
    research: {
      date: DATE,
      sources: [src(UVR, "Official repository README: installation, requirements, licence")],
      checks: [
        ok("OFFICIAL_URL", UVR, "Anjok07/ultimatevocalremovergui README lists core developers Anjok07 and aufr33 and the official download links."),
        ok("FREE_STATUS", UVR, "README 'License': 'The Ultimate Vocal Remover GUI code is MIT-licensed.'"),
        ok("LICENSE", UVR, "README links the MIT LICENSE file for the GUI code."),
        ok("OPEN_SOURCE_STATUS", UVR, "Source is public; README 'Contributing' invites pull requests and describes the project as open source."),
        ok("PLATFORM_AVAILABILITY", UVR, "README has Windows Installation, MacOS Installation (arm64 and x86_64 DMGs) and Linux Installation sections."),
        ok("LIMITATIONS", UVR, "'Nvidia GTX 1060 6GB is the minimum requirement for GPU conversions'; 'only compatible with 64-bit platforms'; 'You must install UVR to the main C:\\ drive.'"),
      ],
      notes:
        "Read the README, which notes a development update dated October 6th, 2026. The licence of individual bundled models was not checked separately.",
    },
  },
  {
    slug: "audiocraft",
    name: "AudioCraft (MusicGen)",
    shortDescription: "Meta's research library for MusicGen and AudioGen; code is MIT but model weights are non-commercial.",
    longDescription:
      "AudioCraft is a PyTorch library from Meta's FAIR team with inference and training code for MusicGen (text-to-music), AudioGen (text-to-sound), EnCodec and related models. The code is MIT-licensed, but the model weights are released under CC-BY-NC 4.0, which rules out commercial use of the pretrained models.",
    whyListed:
      "It lets researchers and hobbyists generate music and sound effects locally from text, with training code included.",
    category: "ai-audio",
    resourceType: "AI_TOOL",
    officialUrl: AUDIOCRAFT,
    sourceUrl: AUDIOCRAFT,
    licenseUrl: "https://github.com/facebookresearch/audiocraft/blob/main/LICENSE_weights",
    freeStatus: "LIMITED_FREE",
    openSource: true,
    license: "MIT",
    licenseNotes: "The code is MIT; the pretrained model weights are CC-BY-NC 4.0 (non-commercial), per LICENSE_weights.",
    platforms: [],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "no",
    personalUse: "unknown",
    downloadAvailable: true,
    limitations: [
      "Pretrained weights are CC-BY-NC 4.0, so outputs from the released models cannot be used commercially",
      "Requires Python 3.9 and PyTorch 2.1.0; ffmpeg is recommended",
      "Built for deep-learning research; there is no graphical app",
    ],
    features: [
      "MusicGen text-to-music and MusicGen Style",
      "AudioGen text-to-sound",
      "Training code for EnCodec, MusicGen, Multi Band Diffusion and JASCO",
    ],
    tags: ["music-generation", "text-to-music", "sound-effects", "research"],
    research: {
      date: DATE,
      sources: [src(AUDIOCRAFT, "Official repository README: models, installation, licence")],
      checks: [
        ok("OFFICIAL_URL", AUDIOCRAFT, "facebookresearch/audiocraft: 'AudioCraft is a PyTorch library for deep learning research on audio generation.'"),
        ok("FREE_STATUS", AUDIOCRAFT, "README 'License': code 'released under the MIT license'; weights 'released under the CC-BY-NC 4.0 license'."),
        ok("LICENSE", AUDIOCRAFT, "'The code in this repository is released under the MIT license as found in the LICENSE file.'"),
        ok("OPEN_SOURCE_STATUS", AUDIOCRAFT, "Code is public and installable with 'python -m pip install -U audiocraft'."),
        ok("COMMERCIAL_USE", AUDIOCRAFT, "'The models weights in this repository are released under the CC-BY-NC 4.0 license as found in the LICENSE_weights file.' NC means non-commercial."),
        ok("LIMITATIONS", AUDIOCRAFT, "'AudioCraft requires Python 3.9, PyTorch 2.1.0'; 'We also recommend having ffmpeg installed'."),
      ],
      notes:
        "Classified LIMITED_FREE, not OPEN_SOURCE, because the usable pretrained weights are non-commercial. commercialUse 'no' refers to the released weights.",
    },
  },
  {
    slug: "suno",
    name: "Suno",
    shortDescription: "Song generator with a free plan of 50 credits a day on its free model, without commercial rights.",
    longDescription:
      "Suno generates songs from text descriptions in the browser. Its free plan gives 50 credits per day on its best free model, standard features and audio uploads up to 8 minutes, but no commercial rights, no monthly song downloads and no stem separation; Pro and Premier add those.",
    whyListed:
      "It is a way to try AI song generation without paying, as long as the results are for personal experimentation rather than release.",
    category: "ai-audio",
    resourceType: "AI_TOOL",
    officialUrl: "https://suno.com/",
    pricingUrl: SUNO,
    freeStatus: "FREE_TIER",
    openSource: false,
    platforms: ["BROWSER"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "no",
    personalUse: "unknown",
    limitations: [
      "50 credits per day, which do not carry over",
      "No commercial rights to songs made on the free plan",
      "No monthly song downloads, no stem separation and no add-on credit purchases",
      "Free model only (v6-mini) in a shared creation queue",
    ],
    features: ["Text-to-song generation", "Audio upload up to 8 minutes", "Basic editing (crop, fade)"],
    tags: ["music-generation", "songs", "hosted"],
    research: {
      date: DATE,
      sources: [src(SUNO, "Pricing page: Free, Pro and Premier plans and comparison table")],
      checks: [
        ok("OFFICIAL_URL", SUNO, "suno.com/pricing: 'Start making music for free — Plans for every creator'."),
        ok("FREE_STATUS", SUNO, "Free plan '$0 /month' alongside Pro ($8/month) and Premier ($24/month)."),
        ok("FREE_TIER_LIMITS", SUNO, "Free: '50 credits per day', 'Standard features only', 'Upload up to 8 min of audio', 'Shared creation queue'; available model 'Best free model (v6-mini)'."),
        ok("COMMERCIAL_USE", SUNO, "Free plan: 'No commercial rights'."),
        ok("LIMITATIONS", SUNO, "Free plan: 'No monthly song downloads', 'No add-on credit purchases', 'No stem separation'; 'Credits included in subscriptions do not carry over from day to day'."),
        ok("PRICING_INFORMATION", SUNO, "Pro $8/month with 2,500 credits; Premier $24/month with 10,000 credits; annual billing saves 20%."),
      ],
      notes:
        "Read the pricing page. 'No monthly song downloads' is quoted as stated; whether free-plan songs can be streamed or shared was not checked. Terms of service not read.",
    },
  },

  /* ---------------------------------------------------------------- ai-voice */
  {
    slug: "kokoro-tts",
    name: "Kokoro TTS",
    shortDescription: "82-million-parameter text-to-speech model with Apache-licensed weights, including Hindi voices.",
    longDescription:
      "Kokoro is an open-weight text-to-speech model with 82 million parameters, and the kokoro Python package is its inference library. Both the code and the weights are Apache-licensed. It supports American and British English, Spanish, French, Hindi, Italian, Japanese, Brazilian Portuguese and Mandarin.",
    whyListed:
      "It is small enough to run on ordinary hardware and is licensed for both personal and production use, which is rare for natural-sounding TTS.",
    category: "ai-voice",
    resourceType: "AI_TOOL",
    officialUrl: KOKORO,
    sourceUrl: KOKORO,
    licenseUrl: "https://github.com/hexgrad/kokoro/blob/main/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "Apache-2.0",
    platforms: [],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "yes",
    personalUse: "yes",
    downloadAvailable: true,
    limitations: [
      "Python library with no graphical app; espeak-ng is needed for some languages and English fallback",
      "Japanese and Mandarin need extra misaki language packages",
    ],
    features: [
      "Voices for nine language options including Hindi",
      "pip-installable package and Colab notebooks",
      "JavaScript package in the repository (kokoro.js)",
    ],
    tags: ["tts", "speech-synthesis", "open-weights", "hindi", "local-ai"],
    relatedResources: ["piper-tts"],
    research: {
      date: DATE,
      sources: [src(KOKORO, "Official repository README: model description, languages, licence")],
      checks: [
        ok("OFFICIAL_URL", KOKORO, "hexgrad/kokoro: 'An inference library for Kokoro-82M', linked to hf.co/hexgrad/Kokoro-82M."),
        ok("FREE_STATUS", KOKORO, "'Kokoro is an open-weight TTS model… With Apache-licensed weights'."),
        ok("LICENSE", KOKORO, "Repository sidebar lists 'Apache-2.0 license'."),
        ok("OPEN_SOURCE_STATUS", KOKORO, "Inference code is public in the repository and on PyPI ('pip install kokoro')."),
        ok("COMMERCIAL_USE", KOKORO, "'With Apache-licensed weights, Kokoro can be deployed anywhere from production environments to personal projects.'"),
        ok("PERSONAL_USE", KOKORO, "'…can be deployed anywhere from production environments to personal projects.'"),
        ok("LIMITATIONS", KOKORO, "Setup installs espeak-ng, 'used for English OOD fallback and some non-English languages'; Japanese needs 'pip install misaki[ja]', Mandarin 'misaki[zh]'."),
      ],
      notes: "Read the README. Supported operating systems are not stated as a list, so platforms are left empty.",
    },
  },
  {
    slug: "coqui-tts",
    name: "Coqui TTS (Idiap fork)",
    shortDescription: "Maintained fork of the Coqui text-to-speech toolkit, with pretrained models and voice cloning.",
    longDescription:
      "Coqui TTS is a deep-learning toolkit for text-to-speech, voice conversion and model training. The original coqui-ai repository is unmaintained; Idiap Research Institute maintains this fork and the coqui-tts PyPI package under MPL-2.0, including XTTS, VITS, Bark and Tortoise models and Fairseq models covering about 1,100 languages.",
    whyListed:
      "It is the continued home of a widely used open TTS toolkit, with training tools for languages that commercial voices do not cover.",
    category: "ai-voice",
    resourceType: "DEVELOPER_TOOL",
    officialUrl: COQUI,
    sourceUrl: COQUI,
    licenseUrl: "https://github.com/idiap/coqui-ai-TTS/blob/dev/LICENSE.txt",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MPL-2.0",
    licenseNotes: "The toolkit code is MPL-2.0. Individual pretrained models may carry their own licences; these were not checked.",
    platforms: ["LINUX", "MACOS", "WINDOWS"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    apiAvailable: true,
    downloadAvailable: true,
    limitations: [
      "Pretrained models can carry licences separate from the MPL-2.0 code; check each model before relying on it",
      "From coqui-tts 0.27.4, PyTorch must be installed separately",
      "Tested on Ubuntu 24.04; macOS and Windows are expected to work but are not the tested platform",
    ],
    features: [
      "XTTSv2 with 17 languages and streaming under 200 ms latency",
      "Voice conversion with FreeVC, kNN-VC and OpenVoice",
      "Command-line tool, Python API, TTS server and Docker image",
    ],
    tags: ["tts", "voice-cloning", "speech-synthesis", "python", "training"],
    research: {
      date: DATE,
      sources: [src(COQUI, "Idiap fork README: news, installation, models, licence")],
      checks: [
        ok("OFFICIAL_URL", COQUI, "README news: 'Fork of the original, unmaintained repository. New PyPI package: coqui-tts'."),
        ok("FREE_STATUS", COQUI, "Repository is published under MPL-2.0 and installed with 'uv pip install coqui-tts'."),
        ok("LICENSE", COQUI, "Repository sidebar lists 'MPL-2.0 license'."),
        ok("OPEN_SOURCE_STATUS", COQUI, "Source is public on GitHub, forked from coqui-ai/TTS."),
        ok("PLATFORM_AVAILABILITY", COQUI, "'Prebuilt wheels are now also published for macOS and Windows (in addition to Linux as before)'."),
        ok("LIMITATIONS", COQUI, "'From coqui-tts 0.27.4, PyTorch is not included by default'; 'tested on Ubuntu 24.04… but should also work on Mac and Windows'."),
      ],
      notes:
        "Read the README. XTTS model weights are widely reported to use a non-commercial Coqui Public Model License, but that was not confirmed from a page read today, so it is a general caution rather than a recorded fact.",
    },
  },
  {
    slug: "indic-parler-tts",
    name: "Indic Parler-TTS",
    shortDescription: "AI4Bharat text-to-speech model for 20 Indian languages and English, under Apache 2.0.",
    longDescription:
      "Indic Parler-TTS is a multilingual Indic extension of Parler-TTS Mini, built by AI4Bharat with the Hugging Face audio team. It speaks Assamese, Bengali, Bodo, Dogri, Gujarati, Hindi, Kannada, Konkani, Maithili, Malayalam, Manipuri, Marathi, Nepali, Odia, Sanskrit, Santali, Sindhi, Tamil, Telugu, Urdu and English, with 69 voices whose style is set by a text description.",
    whyListed:
      "Few freely licensed TTS models cover this many Indian languages, including low-resource ones such as Bodo, Dogri and Santali.",
    category: "ai-voice",
    subcategories: ["languages"],
    resourceType: "AI_TOOL",
    officialUrl: INDIC_PARLER,
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "Apache-2.0",
    platforms: [],
    requiresAccount: "yes",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    downloadAvailable: true,
    languages: ["as", "bn", "gu", "hi", "kn", "ml", "mr", "ne", "or", "sa", "sd", "ta", "te", "ur", "en"],
    limitations: [
      "The model files are gated: you must log in to Hugging Face and agree to share contact information",
      "The model card recommends the newer Indic-Speak model for better quality across 22 languages",
      "Emotion prompts are officially supported in 10 of the languages only",
    ],
    features: [
      "69 voices with recommended speakers per language",
      "Control of pitch, speaking rate, noise, reverberation and expressivity through a caption",
      "Indian English accents supported officially",
    ],
    tags: ["tts", "indian-languages", "india", "ai4bharat", "hindi"],
    relatedResources: ["indictrans2", "bhashini"],
    research: {
      date: DATE,
      sources: [src(INDIC_PARLER, "Hugging Face model card by AI4Bharat: languages, access conditions, licence")],
      checks: [
        ok("OFFICIAL_URL", INDIC_PARLER, "Model page under the ai4bharat organisation; 'This work is the result of a collaboration between the HuggingFace audio team and the AI4Bharat team.'"),
        ok("FREE_STATUS", INDIC_PARLER, "Model card 'License': 'This model is permissively licensed under the Apache 2.0 license.'"),
        ok("LICENSE", INDIC_PARLER, "Model metadata: 'License: apache-2.0'."),
        ok("OPEN_SOURCE_STATUS", INDIC_PARLER, "Weights are published on Hugging Face under Apache 2.0, built on the open Parler-TTS repository."),
        ok("ACCOUNT_REQUIREMENT", INDIC_PARLER, "'You need to agree to share your contact information to access this model… Log in or Sign Up to review the conditions and access this model content.'"),
        ok("LIMITATIONS", INDIC_PARLER, "'Indic-Speak is now available… We recommend using Indic-Speak.' '10 languages officially support emotion-specific prompts'."),
      ],
      notes:
        "Read the model card. Language codes cover the listed languages that have ISO 639-1 codes; Bodo, Dogri, Konkani, Maithili, Manipuri and Santali do not and are named in the description instead.",
    },
  },
  {
    slug: "elevenlabs",
    name: "ElevenLabs",
    shortDescription: "Text-to-speech, voice design, sound effects and music, with a free plan of 10,000 credits a month.",
    longDescription:
      "ElevenLabs is a hosted voice AI platform covering text to speech, speech to text, sound effects, voice design and music. The free plan includes 10,000 credits per month and 3 Studio projects; a commercial licence, instant voice cloning and dubbing start on the paid Starter plan.",
    whyListed:
      "The monthly free credits are enough to test expressive multilingual voices before deciding whether a paid plan or an open model fits better.",
    category: "ai-voice",
    subcategories: ["ai-audio"],
    resourceType: "AI_TOOL",
    officialUrl: "https://elevenlabs.io/",
    pricingUrl: ELEVENLABS,
    freeStatus: "FREE_TIER",
    openSource: false,
    platforms: ["BROWSER"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "no",
    personalUse: "unknown",
    apiAvailable: true,
    limitations: [
      "10,000 credits per month, shared across every product; text to speech costs about 1 credit per character",
      "No commercial licence on the free plan; it starts on Starter",
      "Unused credits do not roll over on the free plan",
      "No instant voice cloning or dubbing studio on the free plan",
    ],
    features: [
      "Text to speech and speech to text",
      "Sound effects, voice design and music",
      "3 projects in Studio",
    ],
    tags: ["tts", "voice-generation", "sound-effects", "hosted"],
    research: {
      date: DATE,
      sources: [src(ELEVENLABS, "Pricing page: plans, FAQ on credits and rollover")],
      checks: [
        ok("OFFICIAL_URL", ELEVENLABS, "elevenlabs.io/pricing: 'Flexible pricing for your needs'."),
        ok("FREE_STATUS", ELEVENLABS, "Free plan '$0 per month' with '10k credits per month', alongside Starter, Creator, Pro, Scale and Business."),
        ok("FREE_TIER_LIMITS", ELEVENLABS, "FAQ: 'Free $0 (10,000 credits)'; 'All products draw from one shared monthly credit pool'; 'Text to Speech 1 credit per character'."),
        ok("COMMERCIAL_USE", ELEVENLABS, "Starter: 'Everything in free, plus Commercial License, Instant Voice Cloning… Music commercial use, Dubbing Studio'."),
        ok("LIMITATIONS", ELEVENLABS, "FAQ: 'Rollover does not apply to the Free plan.'"),
        ok("PRICING_INFORMATION", ELEVENLABS, "Starter $6, Creator $22, Pro $99, Scale $299, Business $990 per month; prices exclude taxes."),
      ],
      notes:
        "Read the pricing page, which also showed a time-limited Starter discount; that promotion is not recorded. The free plan's maximum credits per request is mentioned but not quantified.",
    },
  },

  /* -------------------------------------------------------------- ai-writing */
  {
    slug: "grammarly",
    name: "Grammarly",
    shortDescription: "Spelling, grammar and tone checker with a free plan that includes 100 AI prompts a month.",
    longDescription:
      "Grammarly checks spelling and grammar and shows the tone of your writing across browsers, desktop, mobile and office apps. The free plan includes those checks and 100 AI text-generation prompts a month; full-sentence rewrites, tone adjustment, plagiarism and AI-text detection need a paid plan.",
    whyListed:
      "Its free grammar and spelling checks work inside most places people write, which makes it a practical baseline writing aid.",
    category: "ai-writing",
    resourceType: "AI_TOOL",
    officialUrl: "https://www.grammarly.com/",
    pricingUrl: GRAMMARLY,
    freeStatus: "FREE_TIER",
    openSource: false,
    platforms: ["BROWSER", "WINDOWS", "MACOS", "IOS", "ANDROID"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "100 AI prompts per month on the free plan",
      "No full-sentence rewrites, tone adjustment or fluency suggestions",
      "No plagiarism check or AI-generated text detection",
    ],
    features: ["Spelling and grammar corrections", "Tone detection", "Apps for browsers, desktop and mobile"],
    tags: ["grammar", "proofreading", "writing-assistant"],
    relatedResources: ["languagetool"],
    research: {
      date: DATE,
      sources: [src(GRAMMARLY, "Plans page (served in INR): Free, Plus and Enterprise comparison")],
      checks: [
        ok("OFFICIAL_URL", GRAMMARLY, "grammarly.com/plans: 'Great Writing Starts With a Plan'."),
        ok("FREE_STATUS", GRAMMARLY, "'Free — Write without spelling and grammar mistakes. ₹0 INR / month' alongside Plus and Enterprise."),
        ok("FREE_TIER_LIMITS", GRAMMARLY, "Compare Plans: 'Generate text with AI prompts — 100 prompts / month' on Free."),
        ok("LIMITATIONS", GRAMMARLY, "Free column shows 'Unavailable' for Adjust your writing tone, Rewrite full sentences, Write fluently in English, Detect AI generated text and Catch accidental plagiarism."),
        ok("PLATFORM_AVAILABILITY", GRAMMARLY, "Footer 'Get Grammarly': Windows, Mac, browser extensions (Chrome, Safari, Firefox, Edge), iPhone, iPad and Android."),
        ok("PRICING_INFORMATION", GRAMMARLY, "Plus: '₹392 INR / member / month, billed annually; ₹1,000 when billed monthly' (India plan)."),
      ],
      notes:
        "The plans page was served with Indian pricing; other regions may see different plans. A user-count claim on the page is not recorded.",
    },
  },

  /* --------------------------------------------------------- ai-productivity */
  {
    slug: "otter-ai",
    name: "Otter.ai",
    shortDescription: "Meeting transcription and AI notes, with a free plan of 300 transcription minutes a month.",
    longDescription:
      "Otter.ai joins Zoom, Microsoft Teams and Google Meet calls to transcribe, identify speakers and write summaries, and also records in its web, desktop and mobile apps. The free Basic plan includes 300 monthly transcription minutes, 30 minutes per conversation, 3 lifetime file imports and 20 AI Chat queries a month.",
    whyListed:
      "The free allowance covers occasional meetings and lectures with live transcripts and summaries, without a subscription.",
    category: "ai-productivity",
    subcategories: ["ai-audio"],
    resourceType: "PRODUCTIVITY_TOOL",
    officialUrl: "https://otter.ai/",
    pricingUrl: OTTER,
    freeStatus: "FREE_TIER",
    openSource: false,
    platforms: ["BROWSER", "WINDOWS", "MACOS", "IOS", "ANDROID"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: [
      "300 transcription minutes per month, with no rollover",
      "Maximum 30 minutes per conversation",
      "Only 3 audio or video file imports per user, for the lifetime of the account",
      "Only the 25 most recent conversations are kept in history",
      "20 AI Chat queries per month (3 per conversation)",
    ],
    features: [
      "Live transcription with speaker identification",
      "Automated summaries with action items",
      "Joins Zoom, Microsoft Teams and Google Meet",
    ],
    tags: ["transcription", "meeting-notes", "summaries"],
    research: {
      date: DATE,
      sources: [src(OTTER, "Pricing page: Basic plan and full comparison table")],
      checks: [
        ok("OFFICIAL_URL", OTTER, "otter.ai/pricing: 'Choose the plan that's right for you', © 2026 Otter.ai Inc."),
        ok("FREE_STATUS", OTTER, "'Basic — Free forever' alongside Pro, Business and Enterprise."),
        ok("FREE_TIER_LIMITS", OTTER, "Basic: '300 minutes per user' monthly (no rollover), 'Max transcription time per conversation 30 minutes', '3 lifetime per user' file imports."),
        ok("LIMITATIONS", OTTER, "Basic: 'Conversation history 25 most recent'; 'Max monthly queries for Otter AI Chat 20 per user (3 per conversation)'."),
        ok("PLATFORM_AVAILABILITY", OTTER, "Download for Mac and Windows; 'iOS and Android apps'; 'Web and mobile recording'; Chrome extension."),
        ok("PRICING_INFORMATION", OTTER, "Pro $16.99/user/month monthly or $8.33 billed annually; Business $30 monthly or $19.99 annually."),
      ],
      notes: "Read the pricing page. Language coverage is listed as English, Spanish, French, German, Japanese and Chinese; Indian languages are not listed.",
    },
  },

  /* ----------------------------------------------------------- ai-automation */
  {
    slug: "activepieces",
    name: "Activepieces",
    shortDescription: "Workflow automation with AI steps and MCP servers; MIT Community Edition and a free cloud plan.",
    longDescription:
      "Activepieces is a no-code automation builder with loops, branches, code steps and AI pieces, and its integrations are also exposed as MCP servers for AI assistants. The Community Edition is MIT-licensed for self-hosting; the hosted Free plan gives 1,000 credits a month, unlimited flows and up to 5 users, with no card required.",
    whyListed:
      "It offers a Zapier-style builder you can self-host under an MIT licence, plus a cloud plan for trying it without a server.",
    category: "ai-automation",
    subcategories: ["productivity"],
    resourceType: "BUSINESS_TOOL",
    officialUrl: "https://www.activepieces.com/",
    sourceUrl: ACTIVEPIECES_REPO,
    pricingUrl: ACTIVEPIECES_PRICING,
    licenseUrl: "https://github.com/activepieces/activepieces/blob/main/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    licenseNotes: "Community Edition is MIT; enterprise features are released under a separate commercial licence.",
    platforms: ["BROWSER", "SELF_HOSTED"],
    requiresAccount: "unknown",
    requiresCreditCard: "no",
    commercialUse: "unknown",
    personalUse: "unknown",
    apiAvailable: true,
    limitations: [
      "Enterprise features are under a commercial licence, not MIT",
      "Cloud Free plan: 1,000 credits a month; runs past the quota wait for credits to refresh",
      "AI steps on the cloud cost 2 to 20 credits each, and own AI keys need a paid plan",
      "According to the pricing FAQ, Agents and Chat are part of the paid layer rather than the self-hosted Community Edition",
    ],
    features: [
      "Loops, branches, auto retries, HTTP and NPM code steps",
      "Integrations (pieces) published as open-source npm packages and MCP servers",
      "Human-in-the-loop approvals and form or chat triggers",
    ],
    tags: ["workflow-automation", "no-code", "mcp", "zapier-alternative", "self-hosted"],
    relatedResources: ["n8n"],
    alternativeTo: ["Zapier", "Make"],
    research: {
      date: DATE,
      sources: [
        src(ACTIVEPIECES_REPO, "Official repository README: features and licence"),
        src(ACTIVEPIECES_PRICING, "Pricing page: Free plan, credits, FAQ on self-hosting"),
      ],
      checks: [
        ok("OFFICIAL_URL", ACTIVEPIECES_REPO, "activepieces/activepieces README links www.activepieces.com as the project site."),
        ok("FREE_STATUS", ACTIVEPIECES_REPO, "'Activepieces' Community Edition is released as open source under the MIT license and enterprise features are released under Commercial License'."),
        ok("LICENSE", ACTIVEPIECES_REPO, "README 'License' section: Community Edition under the MIT license."),
        ok("OPEN_SOURCE_STATUS", ACTIVEPIECES_REPO, "'All pieces are open source and available on npmjs.com'; source is public on GitHub."),
        ok("FREE_TIER_LIMITS", ACTIVEPIECES_PRICING, "Free: '1,000 credits a month', 'Unlimited flows', 'Up to 5 users'; 'Free forever, no card'."),
        ok("CREDIT_CARD_REQUIREMENT", ACTIVEPIECES_PRICING, "FAQ 'Is the free plan really free?': 'Yes. No card, no time limit.'"),
        ok("LIMITATIONS", ACTIVEPIECES_PRICING, "'A step on a fast model is 2 credits, a smart model is 10, and a frontier model is 20'; Bring your own AI keys '—' on Free; self-hosting FAQ: 'Community Edition is the automation core on its own. Paying adds… running Agents and Chat.'"),
        ok("PLATFORM_AVAILABILITY", ACTIVEPIECES_PRICING, "Hosting: 'Cloud or on-prem' on every plan."),
        ok("PRICING_INFORMATION", ACTIVEPIECES_PRICING, "Plus $20 flat per month; Team $200 flat per month; Ultimate custom."),
      ],
      notes:
        "Read the README and pricing page. The pricing page is internally inconsistent: the comparison table says Free credits reset 'Daily' and overages wait 'for tomorrow', while the FAQ says a fresh 1,000 credits arrive every month. The monthly figure is recorded; the reset cadence is not.",
    },
  },
]);
