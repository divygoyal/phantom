"use client";
import { useState } from "react";
import { Play, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type StreamEvent = {
  id: string;
  step: string;
  tool: string;
  label: string;
  detail?: string;
  output?: string;
  status: "running" | "done" | "failed";
};

type StepCard = {
  step: string;
  tool: string;
  label: string;
  detail?: string;
  output?: string;
  status: "pending" | "running" | "done" | "failed";
};

const PLAN: Pick<StepCard, "step" | "tool" | "label" | "detail">[] = [
  { step: "read-analytics", tool: "PostHog", label: "Read funnel analytics (HogQL)", detail: "Query: top hooks by 10s retention, last 7 days" },
  { step: "rewrite-prompt", tool: "Memory", label: "Rewrite prompt template", detail: "Promote winning hooks · demote losers · save new version" },
  { step: "pick-topic", tool: "Research", label: "Pick today's topic", detail: "Cross-ref trending posts × audience signals" },
  { step: "draft-script", tool: "Claude", label: "Draft script with new prompt", detail: "90s target · hook in first 3 seconds" },
  { step: "gen-thumbnails", tool: "Fal", label: "Generate thumbnail A/B variants", detail: "FLUX schnell · 4 variants" },
  { step: "gen-broll", tool: "Fal", label: "Generate per-segment B-roll", detail: "FLUX schnell · 3 frames" },
  { step: "render-video", tool: "HeyGen", label: "Render avatar video (Avatar V)", detail: "1080×1920 · cloned voice via HeyGen voice import" },
  { step: "translate", tool: "HeyGen", label: "Translate to top languages", detail: "Hindi, Spanish · Video Translate + Lipsync" },
  { step: "publish", tool: "Publish", label: "Publish + fire tracking events", detail: "Queue → YouTube · PostHog capture" },
];

export function LiveRunPanel() {
  const [steps, setSteps] = useState<StepCard[]>(
    PLAN.map((s) => ({ ...s, status: "pending" }))
  );
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);

  async function runDemo() {
    setRunning(true);
    setDone(false);
    setFailed(false);
    setSteps(PLAN.map((s) => ({ ...s, status: "pending" })));

    try {
      const res = await fetch("/api/agent/run", { method: "POST" });
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done: streamDone } = await reader.read();
        if (streamDone) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const block of lines) {
          if (block.startsWith("event: done")) continue;
          const dataLine = block.split("\n").find((l) => l.startsWith("data: "));
          if (!dataLine) continue;
          const payload = dataLine.slice(6).trim();
          if (!payload || payload === "{}") continue;
          try {
            const event = JSON.parse(payload) as StreamEvent;
            if (event.step === "error") {
              setFailed(true);
              setSteps((prev) => [
                ...prev,
                { ...event, status: "failed" as const },
              ]);
              continue;
            }
            setSteps((prev) => {
              const existing = prev.findIndex((s) => s.step === event.step);
              if (existing >= 0) {
                const next = [...prev];
                next[existing] = {
                  ...next[existing],
                  status: event.status === "done" ? "done" : "running",
                  output: event.output ?? next[existing].output,
                  detail: event.detail ?? next[existing].detail,
                };
                return next;
              }
              return [...prev, { ...event, status: event.status }];
            });
          } catch {
            // skip malformed payload
          }
        }
      }
      setDone(true);
    } catch (err) {
      setFailed(true);
      console.error(err);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Control card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-zinc-200">Daily run</div>
            <div className="mt-0.5 text-xs text-zinc-500">
              The agent will execute {PLAN.length} steps using Claude, HeyGen,
              Fal, and PostHog.
            </div>
          </div>
          <button
            onClick={runDemo}
            disabled={running}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
              running
                ? "bg-zinc-800 text-zinc-500"
                : "bg-cyan-500 text-zinc-950 hover:bg-cyan-400"
            )}
          >
            {running ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running…
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                Run Agent Now
              </>
            )}
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
        <div className="border-b border-zinc-800 px-5 py-3 text-xs uppercase tracking-wider text-zinc-500">
          Reasoning timeline
        </div>
        <div className="divide-y divide-zinc-800/60">
          {steps.map((s, i) => (
            <StepRow key={s.step + i} step={s} index={i + 1} />
          ))}
        </div>
      </div>

      {done && !failed && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            Run complete — video rendered, translated, and queued for publish.
          </div>
          <div className="mt-2 text-xs text-emerald-200/80">
            The agent will read tomorrow&apos;s PostHog data and rewrite the
            prompt template again. View the diff in{" "}
            <a href="/prompts" className="underline">
              Prompts
            </a>
            .
          </div>
        </div>
      )}

      {failed && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-red-300">
            <AlertTriangle className="h-4 w-4" />
            Agent run failed — check the server logs.
          </div>
        </div>
      )}
    </div>
  );
}

function StepRow({ step, index }: { step: StepCard; index: number }) {
  return (
    <div className="px-5 py-3.5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-mono">
          {step.status === "done" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : step.status === "failed" ? (
            <AlertTriangle className="h-5 w-5 text-red-400" />
          ) : step.status === "running" ? (
            <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
          ) : (
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-700 text-zinc-500">
              {index}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[10px] font-mono",
                step.status === "done"
                  ? "bg-emerald-400/10 text-emerald-300"
                  : step.status === "running"
                  ? "bg-cyan-400/10 text-cyan-300"
                  : step.status === "failed"
                  ? "bg-red-400/10 text-red-300"
                  : "bg-zinc-800 text-zinc-500"
              )}
            >
              {step.tool}
            </span>
            <span
              className={cn(
                "text-sm",
                step.status === "pending" ? "text-zinc-500" : "text-zinc-200"
              )}
            >
              {step.label}
            </span>
          </div>
          {step.detail && (
            <div className="mt-1 text-xs text-zinc-500">{step.detail}</div>
          )}
          {step.output && (step.status === "done" || step.status === "failed") && (
            <pre className="mt-2 overflow-x-auto rounded-md bg-zinc-950/60 px-3 py-2 font-mono text-[11px] text-zinc-400 ring-1 ring-zinc-800">
              {step.output}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
