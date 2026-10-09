export interface AIPluginTool {
  id: string;
  name: string;
  type: "Browser Extension" | "Desktop App" | "Web Tool" | "VS Code Extension";
  description: string;
  freeStatus: "100% Free & Open Source" | "Generous Free Tier" | "Free Forever";
  url: string;
  tags: string[];
}

export const aiPluginsTools: AIPluginTool[] = [
  {
    id: "ollama",
    name: "Ollama",
    type: "Desktop App",
    description: "Run open-source large language models (Llama 3, Mistral, Gemma, DeepSeek) locally on your own computer with zero fees, offline support, and complete privacy.",
    freeStatus: "100% Free & Open Source",
    url: "https://ollama.com",
    tags: ["local ai", "open source", "offline", "privacy"],
  },
  {
    id: "continue-dev",
    name: "Continue.dev",
    type: "VS Code Extension",
    description: "Open-source AI code assistant inside VS Code & JetBrains. Connects to local models or free API keys to provide code completion and chat.",
    freeStatus: "100% Free & Open Source",
    url: "https://continue.dev",
    tags: ["coding", "vscode", "copilot alternative", "developer"],
  },
  {
    id: "harpa-ai",
    name: "HARPA AI",
    type: "Browser Extension",
    description: "Free hybrid browser automation extension that summarizes web pages, monitors price drops, tracks competitors, and runs custom page commands.",
    freeStatus: "Generous Free Tier",
    url: "https://harpa.ai",
    tags: ["chrome extension", "automation", "summarizer", "browser"],
  },
  {
    id: "jan-ai",
    name: "Jan",
    type: "Desktop App",
    description: "Open-source, local-first alternative to ChatGPT that runs on your laptop. 100% offline, zero data collection, clean desktop UI.",
    freeStatus: "100% Free & Open Source",
    url: "https://jan.ai",
    tags: ["local ai", "privacy", "chatgpt alternative", "desktop"],
  },
];
