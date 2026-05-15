"use client";
import { useState } from "react";
import { Play, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      <Card className="rounded-3xl border-border/60 shadow-[var(--shadow-card)] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-foreground">Daily run</div>
            <div className="mt-1 text-xs text-muted-foreground">
              The agent will execute {PLAN.length} steps using Claude, HeyGen,
              Fal, and PostHog.
            </div>
          </div>
          <Button
            onClick={runDemo}
            disabled={running}
            className="rounded-full h-11 px-5 bg-foreground text-background hover:bg-foreground/90"
          >
            {running ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Running…
              </>
            ) : (
              <>
                <Play className="size-4 fill-current" />
                Run Agent Now
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Timeline */}
      <Card className="rounded-3xl border-border/60 shadow-[var(--shadow-card)] overflow-hidden">
        <div className="border-b border-border/60 bg-secondary/40 px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Reasoning timeline
        </div>
        <div className="divide-y divide-border/60">
          {steps.map((s, i) => (
            <StepRow key={s.step + i} step={s} index={i + 1} />
          ))}
        </div>
      </Card>

      {done && !failed && (
        <Card className="rounded-3xl border-emerald-500/30 bg-emerald-500/[0.06] p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="size-4" />
            Run complete — video rendered, translated, and queued for publish.
          </div>
          <div className="mt-2 text-xs text-emerald-700/80">
            The agent will read tomorrow&apos;s PostHog data and rewrite the
            prompt template again. View the diff in{" "}
            <a href="/prompts" className="underline underline-offset-4">
              Prompts
            </a>
            .
          </div>
        </Card>
      )}

      {failed && (
        <Card className="rounded-3xl border-destructive/30 bg-destructive/[0.06] p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
            <AlertTriangle className="size-4" />
            Agent run failed — check the server logs.
          </div>
        </Card>
      )}
    </div>
  );
}

function StepRow({ step, index }: { step: StepCard; index: number }) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-mono">
          {step.status === "done" ? (
            <CheckCircle2 className="size-5 text-emerald-600" />
          ) : step.status === "failed" ? (
            <AlertTriangle className="size-5 text-destructive" />
          ) : step.status === "running" ? (
            <Loader2 className="size-4 animate-spin text-brand" />
          ) : (
            <span className="flex size-5 items-center justify-center rounded-full border border-border text-muted-foreground">
              {index}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 text-[10px] font-mono font-semibold",
                step.status === "done"
                  ? "bg-emerald-500/15 text-emerald-700"
                  : step.status === "running"
                  ? "bg-hero text-white"
                  : step.status === "failed"
                  ? "bg-destructive/15 text-destructive"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {step.tool}
            </span>
            <span
              className={cn(
                "text-sm",
                step.status === "pending"
                  ? "text-muted-foreground"
                  : "text-foreground font-medium"
              )}
            >
              {step.label}
            </span>
          </div>
          {step.detail && (
            <div className="mt-1 text-xs text-muted-foreground">{step.detail}</div>
          )}
          {step.output && (step.status === "done" || step.status === "failed") && (
            <pre className="mt-2 overflow-x-auto rounded-xl border border-border/60 bg-foreground/[0.025] px-3 py-2 font-mono text-[11px] text-muted-foreground">
              {step.output}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
