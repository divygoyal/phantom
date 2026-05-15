import { GitBranch, Plus, Minus } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

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
    reasoning: "Seed prompt — ReelForge's first generation.",
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
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-10">
          <Badge variant="outline" className="rounded-full">Self-modifying agent</Badge>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
            Prompt versions
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Every day after reading PostHog, ReelForge rewrites the prompt template
            it uses to draft scripts. Each new version is committed with the
            reasoning and the analytics evidence that justified it.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Version list */}
          <aside className="lg:col-span-1">
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
              History
            </div>
            <ol className="space-y-2">
              {VERSIONS.map((v) => (
                <li key={v.version}>
                  <button
                    className={`flex w-full items-start gap-3 rounded-2xl px-4 py-3 text-left transition ${
                      v.active
                        ? "bg-card border border-foreground/30 shadow-[var(--shadow-card)]"
                        : "hover:bg-secondary/60 border border-transparent"
                    }`}
                  >
                    <GitBranch
                      className={`mt-0.5 size-4 ${
                        v.active ? "text-brand" : "text-muted-foreground"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            v.active ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          v{v.version}
                        </span>
                        {v.active && (
                          <Badge className="bg-hero text-white border-0 text-[10px] py-0">
                            active
                          </Badge>
                        )}
                      </div>
                      <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                        {v.createdAt}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ol>
          </aside>

          {/* Diff view */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-baseline justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Diff: v3 → v4
                </div>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">
                  Promoted wrong-assumption hooks
                </h2>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Plus className="size-3 text-emerald-600" /> 8 additions
                </span>
                <span className="flex items-center gap-1">
                  <Minus className="size-3 text-destructive" /> 4 removals
                </span>
              </div>
            </div>

            {/* Reasoning */}
            <Card className="mb-4 rounded-3xl border-border/60 shadow-[var(--shadow-card)] p-6">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-brand">
                Reasoning
              </div>
              <p className="mt-2 text-sm leading-relaxed">
                {VERSIONS[0].reasoning}
              </p>
              <div className="mt-4 grid sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] px-4 py-3">
                  <div className="font-semibold uppercase tracking-wider text-[10px] text-emerald-700">
                    Promoted
                  </div>
                  <div className="mt-1 text-foreground">{VERSIONS[0].evidence?.promoted}</div>
                </div>
                <div className="rounded-2xl border border-destructive/30 bg-destructive/[0.06] px-4 py-3">
                  <div className="font-semibold uppercase tracking-wider text-[10px] text-destructive">
                    Demoted
                  </div>
                  <div className="mt-1 text-foreground">{VERSIONS[0].evidence?.demoted}</div>
                </div>
              </div>
            </Card>

            {/* The diff */}
            <pre className="overflow-x-auto rounded-3xl border border-border/60 bg-foreground/[0.025] p-5 font-mono text-[12px] leading-relaxed">
              {DIFF.map((line, i) => (
                <div
                  key={i}
                  className={
                    line.type === "add"
                      ? "bg-emerald-500/10 text-emerald-800"
                      : line.type === "remove"
                      ? "bg-destructive/10 text-destructive"
                      : "text-muted-foreground"
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
      </main>
    </div>
  );
}
