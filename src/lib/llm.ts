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
//
// On Windows, `claude` resolves to `claude.cmd` (npm shim). Spawning via
// `shell: true` lets cmd.exe find it. The previous version piped stdin from
// Node directly, but cmd.exe's stdin handling for .cmd scripts is unreliable —
// it buffered or dropped the prompt entirely, causing Claude to return empty
// stdout. We now stage the prompt into a temp file and use shell redirection
// (`claude --print < tempfile`) which cmd.exe handles correctly.

async function generateWithClaudeCode(opts: GenerateOptions): Promise<string> {
  const { spawn } = await import("node:child_process");
  const { promises: fs } = await import("node:fs");
  const path = await import("node:path");
  const os = await import("node:os");

  const full = opts.system
    ? `${opts.system}\n\n---\n\n${opts.prompt}`
    : opts.prompt;

  const tempFile = path.join(
    os.tmpdir(),
    `phantom-prompt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.txt`
  );
  await fs.writeFile(tempFile, full, "utf8");

  const timeoutMs = 120_000; // 2 min hard cap per call

  return new Promise<string>((resolve) => {
    let settled = false;
    const settle = (value: string) => {
      if (settled) return;
      settled = true;
      // Best-effort cleanup
      fs.unlink(tempFile).catch(() => {});
      resolve(value);
    };

    // Use shell redirection so cmd.exe pipes the file into claude's stdin.
    // The `--print` flag plus stdin file gives the response on stdout.
    const cmd = `claude --print < "${tempFile}"`;
    const proc = spawn(cmd, [], {
      shell: true,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (chunk) => (stdout += chunk.toString()));
    proc.stderr.on("data", (chunk) => (stderr += chunk.toString()));

    const timer = setTimeout(() => {
      try {
        proc.kill();
      } catch {
        /* ignore */
      }
      console.error(
        `claude-code timed out after ${timeoutMs}ms; stderr tail:`,
        stderr.slice(-300)
      );
      settle(generateScripted(opts));
    }, timeoutMs);

    proc.on("close", (code) => {
      clearTimeout(timer);
      const text = stdout.trim();
      if (code === 0 && text) {
        settle(text);
      } else {
        console.error(
          `claude-code exited ${code} with ${text.length} chars stdout; stderr:`,
          stderr.slice(-300)
        );
        settle(generateScripted(opts));
      }
    });

    proc.on("error", (err) => {
      clearTimeout(timer);
      console.error("claude-code spawn error:", err);
      settle(generateScripted(opts));
    });
  });
}

// === Editorial brain system prompts (compressed from reel-production skill) ===

/**
 * Voice register + structural rules baked from the reel-production skill's
 * `references/script-writing.md` §11 (middle-ground Varun register) and
 * Phase 3 critique rubrics (auto-fails 1-20). Pass this as the system prompt
 * when LLM_PROVIDER is anthropic or claude-code.
 */
export const REEL_SCRIPT_SYSTEM = `You are scripting a vertical reel for the @aisimplified YouTube channel.

The audience watches AI + product content. Tight, punchy, no fluff.

## VOICE REGISTER — middle-ground Varun (validated 2026-05-14)

- **12-18 words per beat.** Beats run 5-7 seconds at 2.15 WPS.
- **Light connectors allowed:** "Then", "So", "Here's the thing —", "The catch is —", "And the best part —"
- **Specifics retained:** numbers, names, model versions, dollar amounts, dates
- **Read-aloud test:** every beat must sound like a friend talking. If it sounds like narration, rewrite.

## FORBIDDEN OPENERS (auto-fail #2)

- "Hi", "Hey", "So today", "Welcome", "Let me tell you", "In this video", "Today we'll"

## FORBIDDEN CLOSERS (auto-fail #11, #18)

- "Tag 3 friends", "Follow for more", "Smash that like", "Subscribe and ring the bell"
- Course-bro CTAs in general

## CHANNEL HANDLE

- Always say "@aisimplified" (never "@yourchannel", never plain "subscribe")

## TONAL PALETTES (pick one, never mix without reason)

| Palette | When to use |
|---|---|
| dark-humor | drama/discourse, controversy, ironic disasters |
| warm-humor | tutorials, relatable observations, friendly takes |
| ironic-deadpan | hype-saturated launches, "of course they did" energy |
| sincere-awe | genuine breakthroughs, breakthrough benchmarks, founder moments |
| urgent-breaking | just-happened news, time-sensitive (hours/days) |
| quiet-observation | layoffs, wind-downs, death notices, regulatory shifts |

## HOOK ARCHETYPES (pick one)

- **wrong-assumption-first**: "You're using X wrong" / "The way you think about X is backwards"
- **shock-fact**: open with the most surprising specific number/quote
- **tension-then-twist**: setup an expectation, then flip it
- **question-then-answer**: pose the loaded question the viewer is thinking
- **list-promise**: "Three things X just changed" (only for genuine list content)

## BEAT STRUCTURE (5-beat default)

  B1 (0-3s)    HOOK            — punch line in <12 words, must promise the payoff
  B2 (3-12s)   SETUP           — the wrong assumption / the stakes / the context
  B3 (12-25s)  PAYOFF          — the actual insight / the reveal / what really matters
  B4 (25-38s)  PROOF           — a specific number, quote, or concrete example from source
  B5 (38-50s)  CALL            — what the viewer should think / save / do (NOT a generic CTA)

## OUTPUT

Return ONLY the beat lines, one per line. No numbering, no "[HOOK]" labels, no commentary.
Each line is the exact voiceover for that beat.`;

/**
 * Critique pass — scans a draft for the top auto-fails and returns issues
 * to fix. Used by reel.ts to optionally regen a script that fails the critique.
 */
export const CRITIQUE_SYSTEM = `You are critiquing a reel script for @aisimplified. Score against these auto-fails (any one = FAIL):

1. Opens on "Hi/Hey/So today/Welcome/Let me/In this video"
2. Closes with "tag 3 friends" / "follow for more" / generic course-bro CTA
3. Uses "@yourchannel" instead of "@aisimplified"
4. Generic narrator cadence — doesn't sound like a friend talking
5. Beats outside 12-18 words (too punchy OR too explanatory)
6. Hook doesn't promise a concrete payoff
7. Re-hook missing at beat 4 (no specific concrete proof point)
8. Uses "incredible/insane/mind-blowing" without context
9. Closes on a written-aphorism ("X is solved. Y isn't.")
10. Stacked filler tics ("Bro. Look. Like.")

Output format:
PASS — if no auto-fails
FAIL: <list specific issues, line-by-line>`;

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
