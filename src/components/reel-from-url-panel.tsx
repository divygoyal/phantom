"use client";
import { useState } from "react";
import { Play, Loader2, CheckCircle2, AlertTriangle, Link as LinkIcon, Download } from "lucide-react";
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
  data?: { videoUrl?: string; slug?: string };
};

type StepCard = StreamEvent & { _renderedAt?: number };

const PRESET_URLS = [
  { label: "Test X post (Anthropic)", url: "https://x.com/AnthropicAI/status/1845869029537984584" },
  { label: "Test article (Verge)", url: "https://www.theverge.com/2024/10/22/24277610/anthropic-claude-3-5-sonnet-computer-use" },
];

export function ReelFromUrlPanel({ defaultDemoVideo }: { defaultDemoVideo?: string }) {
  const [url, setUrl] = useState("");
  const [steps, setSteps] = useState<StepCard[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  async function runFromUrl(target?: string) {
    const inputUrl = (target ?? url).trim();
    if (!inputUrl) return;

    setRunning(true);
    setDone(false);
    setFailed(false);
    setSteps([]);
    setVideoUrl(null);

    try {
      const res = await fetch("/api/agent/run-from-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl }),
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done: streamDone } = await reader.read();
        if (streamDone) break;
        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() || "";

        for (const block of blocks) {
          if (block.startsWith("event: done")) continue;
          const dataLine = block.split("\n").find((l) => l.startsWith("data: "));
          if (!dataLine) continue;
          const payload = dataLine.slice(6).trim();
          if (!payload || payload === "{}") continue;
          try {
            const event: StreamEvent = JSON.parse(payload);
            if (event.step === "error") {
              setFailed(true);
            }
            if (event.status === "failed") {
              setFailed(true);
            }
            if (event.data?.videoUrl) {
              setVideoUrl(event.data.videoUrl);
            }
            setSteps((prev) => {
              const idx = prev.findIndex((s) => s.step === event.step);
              if (idx >= 0) {
                const next = [...prev];
                next[idx] = { ...next[idx], ...event };
                return next;
              }
              return [...prev, { ...event, _renderedAt: Date.now() }];
            });
          } catch {
            /* skip malformed */
          }
        }
      }
      setDone(true);
    } catch (err) {
      console.error(err);
      setFailed(true);
    } finally {
      setRunning(false);
    }
  }

  const showDemoFallback = done && !videoUrl && defaultDemoVideo;
  const displayVideo = videoUrl ?? (showDemoFallback ? defaultDemoVideo : null);

  return (
    <div className="space-y-6">
      {/* URL input card */}
      <Card className="rounded-3xl border-border/60 shadow-[var(--shadow-card)] p-6 md:p-7">
        <label className="text-sm font-semibold text-foreground">
          Paste an X post or article URL
        </label>
        <p className="mt-1 text-xs text-muted-foreground">
          ReelForge will ingest the source, write a 5-beat reel script in your
          voice, generate avatar + B-roll, compose in HyperFrames, and render
          at 1080×1920.
        </p>
        <div className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="url"
              placeholder="https://x.com/... or https://example.com/article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={running}
              className="w-full rounded-full border border-border/60 bg-background pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40 disabled:opacity-50"
            />
          </div>
          <Button
            onClick={() => runFromUrl()}
            disabled={running || !url.trim()}
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
                Run
              </>
            )}
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Quick try:
          </span>
          {PRESET_URLS.map((p) => (
            <button
              key={p.url}
              onClick={() => {
                setUrl(p.url);
                runFromUrl(p.url);
              }}
              disabled={running}
              className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/70 transition disabled:opacity-50"
            >
              {p.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Timeline */}
      {steps.length > 0 && (
        <Card className="rounded-3xl border-border/60 shadow-[var(--shadow-card)] overflow-hidden">
          <div className="border-b border-border/60 bg-secondary/40 px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Reel pipeline
          </div>
          <div className="divide-y divide-border/60">
            {steps.map((s, i) => (
              <StepRow key={s.step + i} step={s} index={i + 1} />
            ))}
          </div>
        </Card>
      )}

      {/* Final reel embed */}
      {displayVideo && (
        <Card className="rounded-3xl border-foreground/30 shadow-[var(--shadow-glow)] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand">
              <CheckCircle2 className="size-4" />
              Reel rendered
            </div>
            <Button
              asChild
              size="sm"
              className="rounded-full bg-foreground text-background hover:bg-foreground/90"
            >
              <a
                href={displayVideo}
                download={`reel-${Date.now()}.mp4`}
                aria-label="Download reel mp4"
              >
                <Download className="size-3.5" />
                Download mp4
              </a>
            </Button>
          </div>
          <div className="flex justify-center">
            <video
              src={displayVideo}
              controls
              autoPlay
              loop
              className="rounded-2xl ring-1 ring-border/60"
              style={{ maxHeight: "70vh", aspectRatio: "9 / 16" }}
            />
          </div>
          {!videoUrl && defaultDemoVideo && (
            <div className="mt-3 text-xs text-muted-foreground text-center">
              Showing the pre-baked demo reel. Run a URL above to render fresh.
            </div>
          )}
        </Card>
      )}

      {failed && (
        <Card className="rounded-3xl border-destructive/30 bg-destructive/[0.06] p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
            <AlertTriangle className="size-4" />
            Reel pipeline failed. Check server logs.
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
            <span className="text-sm font-medium text-foreground">{step.label}</span>
          </div>
          {step.detail && (
            <div className="mt-1 text-xs text-muted-foreground">{step.detail}</div>
          )}
          {step.output && (step.status === "done" || step.status === "failed") && (
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl border border-border/60 bg-foreground/[0.025] px-3 py-2 font-mono text-[11px] text-muted-foreground">
              {step.output}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
