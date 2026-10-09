/**
 * Pure helpers for the private AI chat: separating a model's visible reasoning
 * from its answer, and keeping the conversation within the model's context.
 *
 * Kept out of the component so they can be tested without a GPU.
 */

export type ChatRole = "user" | "assistant";

export interface ChatTurn {
  role: ChatRole;
  content: string;
}

export interface SplitReply {
  /** Reasoning inside <think>…</think>, when the model produced any. */
  thinking: string;
  answer: string;
  /** True while the model is still inside an unclosed <think> block. */
  stillThinking: boolean;
}

/**
 * Qwen3 wraps optional reasoning in `<think>…</think>` before its answer. While
 * streaming, the closing tag may not have arrived yet.
 */
export function splitThinking(text: string): SplitReply {
  const open = text.indexOf("<think>");
  if (open === -1) return { thinking: "", answer: text.trim(), stillThinking: false };

  const close = text.indexOf("</think>", open);
  if (close === -1) {
    return { thinking: text.slice(open + 7).trim(), answer: text.slice(0, open).trim(), stillThinking: true };
  }
  return {
    thinking: text.slice(open + 7, close).trim(),
    answer: (text.slice(0, open) + text.slice(close + 8)).trim(),
    stillThinking: false,
  };
}

/**
 * Rough characters-per-token for budgeting. Real tokenisation varies by language,
 * so the budget is deliberately conservative.
 */
const CHARS_PER_TOKEN = 3;

/**
 * The most recent turns that fit within `maxTokens`, oldest dropped first.
 *
 * The models here have a 4,096-token window shared between the conversation and
 * the reply. The latest user turn is always kept, even if it alone is long, so
 * the model always sees what it is being asked.
 */
export function fitHistory(turns: readonly ChatTurn[], maxTokens: number): { kept: ChatTurn[]; dropped: number } {
  const budget = maxTokens * CHARS_PER_TOKEN;
  const kept: ChatTurn[] = [];
  let used = 0;
  for (let i = turns.length - 1; i >= 0; i--) {
    const cost = turns[i].content.length + 8;
    if (kept.length > 0 && used + cost > budget) break;
    kept.unshift(turns[i]);
    used += cost;
  }
  // A conversation must not start with the model talking.
  while (kept.length > 1 && kept[0].role === "assistant") kept.shift();
  return { kept, dropped: turns.length - kept.length };
}

/** Tokens reserved for the reply out of a 4,096-token window. */
export const REPLY_TOKENS = 1024;
export const CONTEXT_TOKENS = 4096;
/** Room for the conversation sent with each request. */
export const HISTORY_TOKENS = CONTEXT_TOKENS - REPLY_TOKENS - 200;

export const SYSTEM_PROMPT =
  "You are a helpful assistant running privately on the user's own device. " +
  "Answer clearly and concisely. If you are not sure of a fact, say so rather than guessing.";

/** Plain-text transcript for "Copy conversation". */
export function transcript(turns: readonly ChatTurn[]): string {
  return turns
    .map((turn) => `${turn.role === "user" ? "You" : "AI"}: ${splitThinking(turn.content).answer}`)
    .join("\n\n");
}
