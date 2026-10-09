/**
 * The models offered by the private AI chat.
 *
 * Every model here runs entirely on the visitor's device through WebLLM. The list
 * is short on purpose: each one is under 500 MB to download, permissively
 * licensed, and listed in WebLLM's own prebuilt configuration for the pinned
 * version, so its weights and compiled library are known to work together.
 * `tests/ai.test.mts` enforces all three.
 *
 * `downloadMB` was measured on 2026-10-08: the total size of the model's files on
 * Hugging Face plus its compiled WebGPU library on GitHub. It is what the visitor
 * downloads the first time, and is shown before they agree to it. `gpuMemoryMB` is
 * WebLLM's own `vram_required_MB` estimate for the same model.
 */

export interface ChatModel {
  /** WebLLM prebuilt model id. Must exist in `prebuiltAppConfig.model_list`. */
  id: string;
  name: string;
  /** Who trained it. */
  maker: string;
  /** One line on what it is good for, in plain words. */
  bestFor: string;
  /** Measured first download, weights plus library, in megabytes. */
  downloadMB: number;
  /** WebLLM's estimate of graphics memory needed, in megabytes. */
  gpuMemoryMB: number;
  license: "Apache-2.0";
  /** The original model card, for attribution and details. */
  sourceUrl: string;
  /** Can show its reasoning before answering. Off by default because it is slower. */
  canThink: boolean;
  /** Offered first. Exactly one model is the default. */
  isDefault?: boolean;
}

/** The ceiling the list is held to. */
export const MAX_DOWNLOAD_MB = 500;

export const chatModels: readonly ChatModel[] = [
  {
    id: "Qwen2.5-0.5B-Instruct-q4f16_1-MLC",
    name: "Qwen2.5 0.5B",
    maker: "Alibaba Qwen",
    bestFor: "Everyday questions, short writing and summaries. A good balance of size and quality.",
    downloadMB: 295,
    gpuMemoryMB: 945,
    license: "Apache-2.0",
    sourceUrl: "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct",
    canThink: false,
    isDefault: true,
  },
  {
    id: "SmolLM2-360M-Instruct-q4f32_1-MLC",
    name: "SmolLM2 360M",
    maker: "Hugging Face",
    bestFor: "The smallest and fastest. Simple English questions and rewording; weakest at facts and reasoning.",
    downloadMB: 213,
    gpuMemoryMB: 580,
    license: "Apache-2.0",
    sourceUrl: "https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct",
    canThink: false,
  },
  {
    id: "Qwen2.5-Coder-0.5B-Instruct-q4f16_1-MLC",
    name: "Qwen2.5 Coder 0.5B",
    maker: "Alibaba Qwen",
    bestFor: "Small coding help: explaining a snippet, writing a short function, regular expressions.",
    downloadMB: 295,
    gpuMemoryMB: 945,
    license: "Apache-2.0",
    sourceUrl: "https://huggingface.co/Qwen/Qwen2.5-Coder-0.5B-Instruct",
    canThink: false,
  },
  {
    id: "Qwen3-0.6B-q4f16_1-MLC",
    name: "Qwen3 0.6B",
    maker: "Alibaba Qwen",
    bestFor: "Newer and a little smarter, with an optional step-by-step thinking mode for maths and logic.",
    downloadMB: 357,
    gpuMemoryMB: 1404,
    license: "Apache-2.0",
    sourceUrl: "https://huggingface.co/Qwen/Qwen3-0.6B",
    canThink: true,
  },
  {
    id: "Qwen3.5-0.8B-q4f16_1-MLC",
    name: "Qwen3.5 0.8B",
    maker: "Alibaba Qwen",
    bestFor: "The most capable here and the largest download. Best for longer answers and more languages.",
    downloadMB: 453,
    gpuMemoryMB: 1630,
    license: "Apache-2.0",
    sourceUrl: "https://huggingface.co/Qwen/Qwen3.5-0.8B",
    canThink: false,
  },
];

export function getChatModel(id: string): ChatModel | undefined {
  return chatModels.find((model) => model.id === id);
}

export const defaultChatModel: ChatModel = chatModels.find((model) => model.isDefault) ?? chatModels[0];

/** "295 MB", or "1.4 GB" past a thousand. */
export function formatMegabytes(mb: number): string {
  return mb >= 1000 ? `${(mb / 1000).toFixed(1)} GB` : `${Math.round(mb)} MB`;
}
