export interface AIChatPrompt {
  id: string;
  command: string;
  name: string;
  category: "Coding" | "Writing" | "Brainstorming" | "Analysis" | "Productivity" | "Learning";
  description: string;
  prompt: string;
  tags: string[];
}

export const aiChatPrompts: AIChatPrompt[] = [
  {
    id: "explain-like-im-5",
    command: "/eli5",
    name: "Explain Like I'm 5",
    category: "Learning",
    description: "Breaks down any complex or technical topic into plain, everyday language using simple analogies.",
    prompt: "Explain the following concept as if I am 5 years old. Use simple analogies, avoid technical jargon, and keep it under 3 paragraphs:\n\n[Insert Topic Here]",
    tags: ["learning", "simple", "eli5", "analogy"],
  },
  {
    id: "code-debugger",
    command: "/debug",
    name: "Code Bug Hunter & Fixer",
    category: "Coding",
    description: "Identifies bugs, explains why they happen, and provides the corrected drop-in code snippet.",
    prompt: "Review the code below. 1) Identify any bugs, edge cases, or memory leaks. 2) Explain the root cause simply. 3) Provide the corrected, drop-in replacement code:\n\n```\n[Insert Code Here]\n```",
    tags: ["coding", "debugging", "developer", "clean code"],
  },
  {
    id: "concise-summary",
    command: "/summarize",
    name: "Bullet-Point Executive Summary",
    category: "Analysis",
    description: "Condenses long articles, documents, or transcripts into 5 key takeaways and action items.",
    prompt: "Summarize the text below into: 1) A one-sentence takeaway. 2) Five clear bullet points. 3) Key action items or decisions:\n\n[Insert Text Here]",
    tags: ["summary", "bullets", "reading", "productivity"],
  },
  {
    id: "tone-polisher",
    command: "/polish",
    name: "Professional Tone Polisher",
    category: "Writing",
    description: "Rewrites rough drafts into warm, concise, professional business correspondence.",
    prompt: "Rewrite the following message to sound professional, polite, and confident while remaining concise. Eliminate unnecessary filler words:\n\n[Insert Draft Here]",
    tags: ["email", "professional", "writing", "communication"],
  },
  {
    id: "devils-advocate",
    command: "/critique",
    name: "Devil's Advocate & Stress Tester",
    category: "Brainstorming",
    description: "Challenges assumptions and reveals blind spots in any idea, plan, or business strategy.",
    prompt: "Act as a constructive devil's advocate. Stress-test the plan below by finding 3 critical risks, hidden assumptions, or potential failure points, then suggest how to mitigate each:\n\n[Insert Plan or Idea Here]",
    tags: ["strategy", "thinking", "critique", "business"],
  },
  {
    id: "sql-generator",
    command: "/sql",
    name: "Plain English to SQL Query",
    category: "Coding",
    description: "Translates plain-English business questions into optimized, clean SQL queries.",
    prompt: "Write an optimized SQL query for the following database schema based on this request. Include brief comments explaining any joins or window functions:\n\nRequest: [Insert Request Here]\nSchema: [Insert Schema Here]",
    tags: ["sql", "database", "query", "developer"],
  },
];
