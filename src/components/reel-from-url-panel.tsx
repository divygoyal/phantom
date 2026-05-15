"use client";
import { useState } from "react";
import { Play, Loader2, CheckCircle2, AlertTriangle, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
              // Upsert by step
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
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <label className="text-sm font-medium text-zinc-200">
          Paste an X post or article URL
        </label>
        <p className="mt-0.5 text-xs text-zinc-500">
          Phantom will ingest the source, write a 5-beat reel script in your
          voice, generate avatar + B-roll, compose in HyperFrames, and render
          at 1080×1920.
        </p>
        <div className="mt-3 flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="url"
              placeholder="https://x.com/... or https://example.com/article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={running}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 disabled:opacity-50"
            />
          </div>
          <button
            onClick={() => runFromUrl()}
            disabled={running || !url.trim()}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap",
              running || !url.trim()
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
                Run
              </>
            )}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-[11px] uppercase tracking-wider text-zinc-500">
            quick try:
          </span>
          {PRESET_URLS.map((p) => (
            <button
              key={p.url}
              onClick={() => {
                setUrl(p.url);
                runFromUrl(p.url);
              }}
              disabled={running}
              className="text-xs text-cyan-300 hover:text-cyan-200 disabled:opacity-50"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {steps.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
          <div className="border-b border-zinc-800 px-5 py-3 text-xs uppercase tracking-wider text-zinc-500">
            Reel pipeline
          </div>
          <div className="divide-y divide-zinc-800/60">
            {steps.map((s, i) => (
              <StepRow key={s.step + i} step={s} index={i + 1} />
            ))}
          </div>
        </div>
      )}

      {/* Final reel embed */}
      {displayVideo && (
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-cyan-300 mb-3">
            <CheckCircle2 className="h-4 w-4" />
            Reel rendered
          </div>
          <div className="flex justify-center">
            <video
              src={displayVideo}
              controls
              autoPlay
              loop
              className="rounded-lg ring-1 ring-zinc-800"
              style={{ maxHeight: "70vh", aspectRatio: "9 / 16" }}
            />
          </div>
          {!videoUrl && defaultDemoVideo && (
            <div className="mt-3 text-xs text-zinc-500 text-center">
              Live render takes 5-10 minutes; showing this morning's pre-rendered
              artifact from the same pipeline.
            </div>
          )}
        </div>
      )}

      {failed && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-red-300">
            <AlertTriangle className="h-4 w-4" />
            Reel pipeline failed. Check server logs.
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
            <span className="text-sm text-zinc-200">{step.label}</span>
          </div>
          {step.detail && (
            <div className="mt-1 text-xs text-zinc-500">{step.detail}</div>
          )}
          {step.output && (step.status === "done" || step.status === "failed") && (
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-md bg-zinc-950/60 px-3 py-2 font-mono text-[11px] text-zinc-400 ring-1 ring-zinc-800">
              {step.output}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
