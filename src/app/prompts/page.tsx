import { GitBranch, Plus, Minus } from "lucide-react";

const VERSIONS = [
  {
    version: 4,
    active: true,
    createdAt: "2026-05-15 08:03",
    reasoning:
      "PostHog 7d HogQL — wrong_assumption hooks dominate retention at 4.1× baseline. Generic 'in this video' losses are -31%. Promote, demote, kill.",
    evidence: {
      promoted: "'you're using X wrong' — 78% 10s retention",
      demoted: "'in this video we'll cover…' — 18% 10s retention",
    },
  },
  {
    version: 3,
    active: false,
    createdAt: "2026-05-08 08:05",
    reasoning:
      "PostHog showed list-style ('top 5') saturating. Diversified into curiosity + comparison hooks.",
  },
  {
    version: 2,
    active: false,
    createdAt: "2026-05-01 08:07",
    reasoning:
      "Initial pivot from generic explainer style to story-driven openings after week-1 retention plateau.",
  },
  {
    version: 1,
    active: false,
    createdAt: "2026-04-24 08:00",
    reasoning: "Seed prompt — Phantom's first generation.",
  },
];

const DIFF = [
  { type: "context", text: "You are scripting a vertical video for @aisimplified." },
  { type: "context", text: "The audience watches AI + product content. Tight, punchy, no fluff." },
  { type: "context", text: "" },
  { type: "context", text: "Constraints:" },
  { type: "context", text: "- Total length 80-95 seconds." },
  { type: "context", text: "- Open in the first 3 seconds. No 'in this video we'll cover…'." },
  { type: "context", text: "" },
  { type: "remove", text: "Hook strategies (pick one per video):" },
  { type: "remove", text: "  - curiosity   (e.g., 'I bet you didn't know…')" },
  { type: "remove", text: "  - list        (e.g., 'Top 5 things…')" },
  { type: "remove", text: "  - comparison  (e.g., 'X vs Y, which wins?')" },
  { type: "add", text: "Hook strategy (use this pattern):" },
  { type: "add", text: "  WRONG-ASSUMPTION-FIRST:" },
  { type: "add", text: "    'You're using <X> wrong — here's why.'" },
  { type: "add", text: "    'The way you're thinking about <X> is backwards.'" },
  { type: "add", text: "  Why: PostHog 7d shows this pattern at 4.1× baseline" },
  { type: "add", text: "  10s retention. List + curiosity hooks fell off (1.6×, 1.4×)." },
  { type: "context", text: "" },
  { type: "context", text: "Structure:" },
  { type: "context", text: "  0-3s   hook" },
  { type: "context", text: "  3-15s  the wrong assumption laid out" },
  { type: "context", text: "  15-70s the correct mental model + 2-3 examples" },
  { type: "context", text: "  70-90s the surprise insight + soft CTA" },
];

export default function PromptsPage() {
  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <header className="mb-8">
        <div className="text-xs font-medium uppercase tracking-wider text-cyan-300">
          Self-modifying agent
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">
          Prompt versions
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-400">
          Every day after reading PostHog, Phantom rewrites the prompt template
          it uses to draft scripts. Each new version is committed with the
          reasoning and the analytics evidence that justified it.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-6">
        {/* Version list */}
        <aside className="col-span-1">
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3">
            History
          </div>
          <ol className="space-y-1.5">
            {VERSIONS.map((v) => (
              <li key={v.version}>
                <button
                  className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                    v.active
                      ? "bg-zinc-900 ring-1 ring-zinc-800"
                      : "hover:bg-zinc-900/40"
                  }`}
                >
                  <div className="mt-0.5">
                    <GitBranch
                      className={`h-4 w-4 ${
                        v.active ? "text-cyan-400" : "text-zinc-500"
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          v.active ? "text-zinc-100" : "text-zinc-400"
                        }`}
                      >
                        v{v.version}
                      </span>
                      {v.active && (
                        <span className="rounded-full bg-cyan-400/10 px-1.5 py-0.5 text-[10px] font-medium text-cyan-300">
                          active
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-zinc-500">
                      {v.createdAt}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ol>
        </aside>

        {/* Diff view */}
        <div className="col-span-2">
          <div className="mb-3 flex items-baseline justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Diff: v3 → v4
              </div>
              <h2 className="mt-1 text-lg font-medium text-zinc-100">
                Promoted wrong-assumption hooks
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <Plus className="h-3 w-3 text-emerald-400" /> 8 additions
              </span>
              <span className="flex items-center gap-1">
                <Minus className="h-3 w-3 text-red-400" /> 4 removals
              </span>
            </div>
          </div>

          {/* Reasoning */}
          <div className="mb-4 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.04] p-4">
            <div className="text-xs font-medium uppercase tracking-wider text-cyan-300">
              Reasoning
            </div>
            <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
              {VERSIONS[0].reasoning}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md bg-emerald-500/10 px-3 py-2 text-emerald-300">
                <div className="font-medium uppercase tracking-wider text-[10px] opacity-80">
                  Promoted
                </div>
                <div className="mt-0.5">{VERSIONS[0].evidence?.promoted}</div>
              </div>
              <div className="rounded-md bg-red-500/10 px-3 py-2 text-red-300">
                <div className="font-medium uppercase tracking-wider text-[10px] opacity-80">
                  Demoted
                </div>
                <div className="mt-0.5">{VERSIONS[0].evidence?.demoted}</div>
              </div>
            </div>
          </div>

          {/* The diff */}
          <pre className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-5 font-mono text-[12px] leading-relaxed">
            {DIFF.map((line, i) => (
              <div
                key={i}
                className={
                  line.type === "add"
                    ? "bg-emerald-500/10 text-emerald-300"
                    : line.type === "remove"
                    ? "bg-red-500/10 text-red-300"
                    : "text-zinc-500"
                }
              >
                <span className="select-none">
                  {line.type === "add"
                    ? "+ "
                    : line.type === "remove"
                    ? "- "
                    : "  "}
                </span>
                {line.text}
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}
