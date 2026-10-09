/**
 * Dedicated worker that runs WebLLM.
 *
 * Model inference is heavy, so it runs here rather than on the page's main thread,
 * which keeps the page responsive while the model downloads and generates. The
 * handler is WebLLM's own: the page talks to it through `CreateWebWorkerMLCEngine`.
 *
 * This worker is the only code on the site that downloads from another origin: the
 * model's weights from Hugging Face and its compiled WebGPU library from GitHub,
 * once, when the visitor asks for them. Nothing the visitor types is sent anywhere;
 * messages go from the page to this worker and no further.
 */
import { WebWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

const handler = new WebWorkerMLCEngineHandler();

self.onmessage = (message: MessageEvent) => {
  handler.onmessage(message);
};
