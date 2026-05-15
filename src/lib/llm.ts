import "server-only";

export type LLMProvider = "scripted" | "claude-code" | "anthropic";

export function llmProvider(): LLMProvider {
  const p = (process.env.LLM_PROVIDER || "scripted").toLowerCase();
  if (p === "anthropic" || p === "claude-code") return p;
  return "scripted";
}

export type GenerateOptions = {
  system?: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
};

export async function generate(opts: GenerateOptions): Promise<string> {
  const provider = llmProvider();

  if (provider === "anthropic") {
    return generateWithAnthropic(opts);
  }

  if (provider === "claude-code") {
    return generateWithClaudeCode(opts);
  }

  return generateScripted(opts);
}

// === Anthropic API ===

async function generateWithAnthropic(opts: GenerateOptions): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Silent fall-back to scripted so the demo never breaks
    return generateScripted(opts);
  }
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: opts.maxTokens ?? 2048,
      temperature: opts.temperature ?? 0.7,
      system: opts.system,
      messages: [{ role: "user", content: opts.prompt }],
    }),
  });
  if (!res.ok) {
    return generateScripted(opts);
  }
  const data = await res.json();
  const text = data.content?.[0]?.text ?? "";
  return text;
}

// === Claude Code (shell out to local CLI) ===

async function generateWithClaudeCode(opts: GenerateOptions): Promise<string> {
  const { spawn } = await import("node:child_process");

  return new Promise<string>((resolve) => {
    const args = ["--print"];
    const full = opts.system
      ? `${opts.system}\n\n---\n\n${opts.prompt}`
      : opts.prompt;

    const proc = spawn("claude", args, {
      shell: true,
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true,
    });

    let stdout = "";
    proc.stdout.on("data", (chunk) => (stdout += chunk.toString()));
    proc.on("close", () => resolve(stdout.trim() || generateScripted(opts)));
    proc.on("error", () => resolve(generateScripted(opts)));

    proc.stdin.write(full);
    proc.stdin.end();
  });
}

// === Scripted brain: pre-baked agent responses ===

const SCRIPTS: Array<{ match: RegExp; response: string }> = [
  {
    match: /promote.*hook|rewrite.*prompt/i,
    response: `You are scripting a vertical video for @aisimplified.
The audience watches AI + product content. Tight, punchy, no fluff.

Constraints:
- Total length 80-95 seconds.
- Open in the first 3 seconds. No "in this video we'll cover…".

Hook strategy (use this pattern):
  WRONG-ASSUMPTION-FIRST:
    "You're using <X> wrong — here's why."
    "The way you're thinking about <X> is backwards."
  Why: PostHog 7d shows this pattern at 4.1× baseline 10s retention.
  List + curiosity hooks fell off (1.6×, 1.4×).

Structure:
  0-3s   hook
  3-15s  the wrong assumption laid out
  15-70s the correct mental model + 2-3 examples
  70-90s the surprise insight + soft CTA`,
  },
  {
    match: /pick.*topic|topic.*today/i,
    response: `"You're using ChatGPT wrong — here's why"

Reasoning: trending on r/ChatGPT (14k upvotes, 2h old). Audience-match score 0.91 against @aisimplified's last 8 weeks of best-performing videos. Topic intersects "wrong-assumption" hook pattern (currently winning).`,
  },
  {
    match: /draft.*script|write.*script|generate.*script/i,
    response: `[HOOK · 0-3s]
If you're typing "write me a..." you're already losing.

[WRONG ASSUMPTION · 3-15s]
Most people treat ChatGPT like a search engine. They type a question, hit enter, copy the answer. That's why their output sucks.

[CORRECT MODEL · 15-70s]
ChatGPT is a roleplay engine. You're not asking it a question — you're hiring a temporary employee. The first message is the job interview.

Example one: instead of "write a blog post about productivity," say "you are an editor at The Atlantic. I'm a contributor. Help me outline a piece on productivity."

Example two: instead of "fix this code," say "you are reviewing my pull request. Be ruthless."

Example three: instead of "make this email better," say "you are my exec coach. This email is too soft."

[INSIGHT · 70-85s]
Notice the pattern? You're not asking. You're casting. The model is an actor. You're the director.

[CTA · 85-90s]
Sub for more. Link in bio.`,
  },
];

function generateScripted(opts: GenerateOptions): string {
  for (const s of SCRIPTS) {
    if (s.match.test(opts.prompt)) return s.response;
  }
  // Generic fallback
  return `[Scripted brain — no match found for prompt]\n\nPrompt was: ${opts.prompt.slice(0, 200)}...`;
}
