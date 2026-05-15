"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Wand2,
  Play,
  Zap,
  Film,
  Music2,
  Type,
  Share2,
  ArrowRight,
  Check,
  Link as LinkIcon,
  Newspaper,
  Download,
  AlertTriangle,
} from "lucide-react";

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

const STAGES = [
  { label: "Delegating to reel-production agent", detail: "Phantom · claude --print subprocess" },
  { label: "Source ingest & editorial intake", detail: "X syndication · cheerio · 12-field brief" },
  { label: "Script draft + critique pass", detail: "9-beat reel · 20 auto-fail signals" },
  { label: "Avatar render (HeyGen template)", detail: "Elio look · chroma-locked BG" },
  { label: "B-roll generation", detail: "Gemini Nano Banana · per beat" },
  { label: "Composition + 9:16 render", detail: "Whisper-pinned · ffmpeg · 30fps" },
  { label: "Word-level Playfair captions", detail: "1.3× speed · sentence case" },
  { label: "Final reel ready to ship", detail: "Mobile-encoded mp4" },
] as const;

const SUGGESTIONS = [
  { label: "Test X post (Anthropic)", value: "https://x.com/AnthropicAI/status/1845869029537984584" },
  { label: "Test article (Verge)", value: "https://www.theverge.com/2024/10/22/24277610/anthropic-claude-3-5-sonnet-computer-use" },
] as const;

// Visual constants — the frame-counter dither animation is purely cosmetic, so
// we still drive a fake "frame" counter against an estimated ~25-min skill run
// so the UI stays alive between sparse SSE heartbeats. Real progress comes
// from the stageIdx state below, mapped from actual pipeline events.
const FRAME_TARGET = 1800;
const EST_DURATION_SEC = 25 * 60;

// Map a real SSE event from /api/agent/run-from-url into the 8-stage UI list.
// Falls back to a time-based estimate during long-running heartbeats so the
// stage indicator advances even when the skill is mid-composition.
function mapEventToStage(
  ev: StreamEvent,
  artifactN: number,
  elapsedMin: number
): number {
  if (ev.step === "skill-mode") return 0;
  if (ev.step === "skill-invoke") return Math.max(1, ev.status === "done" ? 6 : 1);
  if (ev.step === "ingest") return 1;
  if (ev.step.startsWith("artifact-")) {
    if (artifactN <= 1) return 1;       // editorial-brief
    if (artifactN <= 3) return 2;       // script + plan
    if (artifactN <= 6) return 3;       // avatar render artifacts
    if (artifactN <= 11) return 4;      // gemini stills
    return 5;                           // composition stage
  }
  if (ev.step === "skill-heartbeat") {
    if (elapsedMin < 1) return 1;
    if (elapsedMin < 4) return 2;
    if (elapsedMin < 9) return 3;
    if (elapsedMin < 14) return 4;
    return 5;
  }
  if (ev.step === "style-apply") return ev.status === "done" ? 7 : 6;
  if (ev.step === "skill-collect") return ev.status === "done" ? 7 : 6;
  return 0;
}

function formatEta(sec: number) {
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-2 rounded-xl bg-secondary/60 border border-border/60 flex items-baseline justify-between gap-2 min-w-0">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground shrink-0">{label}</span>
      <span className="text-xs font-mono font-medium tabular-nums truncate">{value}</span>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      <Nav />
      <Hero />
      <LogoStrip />
      <Generator />
      <Features />
      <HowItWorks />
      <Showcase />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="size-8 rounded-xl bg-hero grid place-items-center shadow-[var(--shadow-glow)]">
            <Sparkles className="size-4 text-white" />
          </span>
          ReelForge
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#how" className="hover:text-foreground transition">How it works</a>
          <a href="#showcase" className="hover:text-foreground transition">Showcase</a>
        </nav>
        <Button size="sm" className="rounded-full bg-foreground text-background hover:bg-foreground/90">
          Try free <ArrowRight className="size-4" />
        </Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
      {/* Background flourishes */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0" style={{ background: "var(--gradient-soft)" }} />
        <div className="absolute top-20 -left-40 size-[500px] rounded-full opacity-30 blur-3xl"
             style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute bottom-0 -right-40 size-[500px] rounded-full opacity-20 blur-3xl"
             style={{ background: "var(--gradient-hero)", filter: "hue-rotate(60deg)" }} />
        <div className="absolute inset-0 opacity-[0.025]"
             style={{
               backgroundImage:
                 "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
               backgroundSize: "48px 48px",
             }} />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Headline block */}
        <div className="text-center max-w-5xl mx-auto">
          <Badge variant="secondary" className="rounded-full px-4 py-1.5 gap-2 text-xs">
            <span className="size-1.5 rounded-full bg-brand animate-pulse" />
            Used by 12,400+ creators · AI Reel Engine v2 is live
          </Badge>
          <h1 className="mt-7 text-5xl md:text-7xl lg:text-[5.5rem] font-semibold tracking-[-0.03em] leading-[0.95]">
            Paste an{" "}
            <span className="relative inline-block">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>X post</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" preserveAspectRatio="none">
                <path d="M2 8 Q100 0 198 6" stroke="url(#g1)" strokeWidth="3" fill="none" strokeLinecap="round" />
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0" stopColor="oklch(0.65 0.22 15)" />
                    <stop offset="1" stopColor="oklch(0.7 0.2 320)" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            .
            <br />
            Get a <span className="italic font-serif font-medium">viral</span> YouTube reel.
          </h1>
          <p className="mt-7 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Drop any X post or news article. Our AI writes the hook, scripts every scene,
            picks trending music and exports a ready-to-film reel —{" "}
            <span className="text-foreground font-medium">in under 60 seconds.</span>
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90 h-13 px-7 text-base" asChild>
              <a href="#generate">Generate my reel — free <Wand2 className="size-4" /></a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full h-13 px-7 text-base border-border bg-background/60 backdrop-blur">
              <Play className="size-4" /> Watch 30s demo
            </Button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Check className="size-3.5 text-brand" /> No credit card</span>
            <span className="flex items-center gap-1.5"><Check className="size-3.5 text-brand" /> 3 reels free</span>
            <span className="flex items-center gap-1.5"><Check className="size-3.5 text-brand" /> Export anywhere</span>
          </div>
        </div>

        {/* Visual showcase: X post → AI → Reel */}
        <div className="mt-16 lg:mt-20 relative">
          <div className="absolute -inset-10 bg-hero rounded-[3rem] blur-3xl opacity-20" />
          <div className="relative grid lg:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 lg:gap-3 items-center">
            {/* X post card */}
            <Card className="p-5 rounded-2xl border-border/60 shadow-[var(--shadow-card)] bg-background">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 grid place-items-center text-white font-bold text-sm shrink-0">c</div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    coco <span className="font-normal text-muted-foreground">@DawnKasie49448 · May 14</span>
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed">
                Did this <span className="font-semibold">robot</span> get drunk or what?
                <br />
                Its moves keep getting crazier.
                <br />
                Not sure if it&apos;s <span className="font-semibold">dancing</span>… or suddenly gained a soul. 😂
              </p>
              <p className="mt-3 text-sm leading-relaxed text-brand">
                #Robot <span>#SoulDancer</span> <span>#TechHumor</span> <span>#FutureWorld</span> <span>#AI</span>
              </p>
              <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                <span>↻ 18k</span><span>♡ 142k</span><span>↗ 9.4k</span>
              </div>
            </Card>

            {/* Arrow */}
            <ArrowRight className="hidden lg:block size-6 text-muted-foreground" />
            <ArrowRight className="lg:hidden size-6 text-muted-foreground rotate-90 mx-auto" />

            {/* AI processor */}
            <Card className="p-5 rounded-2xl border-border/60 shadow-[var(--shadow-glow)] bg-hero text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">ReelForge AI</span>
              </div>
              <div className="mt-4 space-y-2">
                {["Extracting hook…", "Writing 4 scenes…", "Matching trending audio…", "Generating captions…"].map((s) => (
                  <div key={s} className="flex items-center gap-2 text-sm">
                    <Check className="size-3.5" />
                    <span className="opacity-90">{s}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-1.5 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full w-3/4 bg-white rounded-full animate-pulse" />
              </div>
            </Card>

            {/* Arrow */}
            <ArrowRight className="hidden lg:block size-6 text-muted-foreground" />
            <ArrowRight className="lg:hidden size-6 text-muted-foreground rotate-90 mx-auto" />

            {/* Reel preview */}
            <div className="relative mx-auto w-full max-w-[260px]">
              <div className="absolute -inset-3 bg-hero rounded-[2rem] blur-2xl opacity-40" />
              <div className="relative aspect-[9/16] rounded-[1.75rem] overflow-hidden border-4 border-foreground shadow-[var(--shadow-card)]">
                <video
                  src="/videos/hero-robot-dance.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                <div className="pointer-events-none absolute top-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <Badge className="bg-red-500 border-0 text-white">● LIVE</Badge>
                  <span className="font-mono">0:34</span>
                </div>
                <div className="pointer-events-none absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-bold uppercase tracking-wider opacity-80">YouTube Shorts</p>
                  <p className="text-base font-bold leading-tight mt-1">&ldquo;This robot dancing looks TOO real 🤯&rdquo;</p>
                  <div className="mt-2 flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">▶ 2.1M</span>
                    <span className="flex items-center gap-1">♡ 184k</span>
                  </div>
                </div>
              </div>
              <Badge className="absolute -top-2 -right-2 bg-brand text-white border-0 shadow-lg z-10">Viral 🔥</Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function LogoStrip() {
  const items = ["TechCrunch", "The Verge", "Bloomberg", "Reuters", "X · Twitter", "Hacker News"];
  return (
    <section className="border-y border-border/50 py-8 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground text-center">
          Works with sources from
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-muted-foreground">
          {items.map((i) => (
            <span key={i} className="text-lg font-medium tracking-tight opacity-70">
              {i}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Generator() {
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<"idle" | "rendering" | "done" | "failed">("idle");
  const [stageIdx, setStageIdx] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [artifactCount, setArtifactCount] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeLabel, setActiveLabel] = useState<string>("");

  const startTimeRef = useRef<number | null>(null);

  // Tick a 1s elapsed counter while rendering — drives the cosmetic frame
  // counter + the ETA display so the UI feels alive between SSE heartbeats.
  useEffect(() => {
    if (phase !== "rendering") return;
    const id = setInterval(() => {
      if (startTimeRef.current) {
        setElapsedSec(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Real-event progress. The progress bar weights stageIdx as fraction of
  // STAGES, with a half-step lift while a stage is mid-flight, so visual
  // motion happens between events too.
  const stageFrac = Math.min(1, (stageIdx + (phase === "done" ? 1 : 0.5)) / STAGES.length);
  const progress = stageFrac * 100;
  const etaSec = Math.max(0, EST_DURATION_SEC - elapsedSec);
  const frame = Math.min(FRAME_TARGET, Math.round((elapsedSec / EST_DURATION_SEC) * FRAME_TARGET));

  const start = async () => {
    if (!input.trim()) return;
    setPhase("rendering");
    setStageIdx(0);
    setElapsedSec(0);
    setEventCount(0);
    setArtifactCount(0);
    setVideoUrl(null);
    setErrorMsg(null);
    setActiveLabel("Starting…");
    startTimeRef.current = Date.now();

    let artifacts = 0;
    let captured: string | null = null;

    try {
      const res = await fetch("/api/agent/run-from-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: input.trim() }),
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
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
            const ev: StreamEvent = JSON.parse(payload);
            setEventCount((c) => c + 1);
            if (ev.step.startsWith("artifact-")) {
              artifacts += 1;
              setArtifactCount(artifacts);
            }
            const elapsedMin = startTimeRef.current
              ? (Date.now() - startTimeRef.current) / 60_000
              : 0;
            const newIdx = mapEventToStage(ev, artifacts, elapsedMin);
            setStageIdx((cur) => Math.max(cur, newIdx));
            setActiveLabel(ev.label || ev.step);
            if (ev.data?.videoUrl) {
              captured = ev.data.videoUrl;
              setVideoUrl(ev.data.videoUrl);
            }
            // style-apply failure is non-fatal — the skill still returns the
            // unstyled base reel. Only surface a hard failure for other steps.
            if (ev.status === "failed" && ev.step !== "style-apply") {
              setErrorMsg(ev.output || ev.label);
            }
          } catch {
            /* skip malformed SSE chunk */
          }
        }
      }

      if (captured) {
        setStageIdx(STAGES.length - 1);
        setPhase("done");
      } else {
        setPhase("failed");
      }
    } catch (err) {
      console.error(err);
      setPhase("failed");
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <section id="generate" className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-10">
          <Badge variant="outline" className="rounded-full">Live demo</Badge>
          <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
            Paste it. Generate it. Post it.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Drop any X post URL or news article — we handle the rest.
          </p>
        </div>

        <Card className="p-6 md:p-8 rounded-3xl border-border/60 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <LinkIcon className="size-4" />
            X post URL, article link, or paste raw text
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://x.com/openai/status/... or paste a TechCrunch article…"
            className="min-h-[140px] text-base resize-none rounded-2xl border-border/60 focus-visible:ring-brand/40"
            disabled={phase === "rendering"}
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setInput(s.value)}
                  disabled={phase === "rendering"}
                  className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/70 transition disabled:opacity-50"
                >
                  {s.label}
                </button>
              ))}
            </div>
            <Button
              onClick={start}
              disabled={phase === "rendering"}
              size="lg"
              className="rounded-full h-12 px-6 bg-foreground text-background hover:bg-foreground/90"
            >
              {phase === "rendering" ? (
                <>
                  <span className="size-4 rounded-full border-2 border-background/40 border-t-background animate-spin" />
                  Forging your reel…
                </>
              ) : phase === "done" ? (
                <>
                  Generate another <Wand2 className="size-4" />
                </>
              ) : (
                <>
                  Generate viral reel <Wand2 className="size-4" />
                </>
              )}
            </Button>
          </div>
        </Card>

        {phase === "failed" && (
          <Card className="mt-6 p-6 rounded-3xl border-destructive/30 bg-destructive/[0.06] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-destructive">Reel pipeline failed</p>
                {errorMsg && (
                  <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl border border-destructive/20 bg-background/60 px-3 py-2 font-mono text-[11px] text-muted-foreground">
                    {errorMsg}
                  </pre>
                )}
                <p className="mt-3 text-xs text-muted-foreground">
                  Reached {stageIdx + 1} of {STAGES.length} stages · {eventCount} events · {formatEta(elapsedSec)} elapsed
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 rounded-full"
                  onClick={() => setPhase("idle")}
                >
                  Try again
                </Button>
              </div>
            </div>
          </Card>
        )}

        {(phase === "rendering" || phase === "done") && (
          <Card className="relative mt-6 p-6 md:p-8 rounded-3xl border-border/60 shadow-[var(--shadow-card)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div
              aria-hidden
              className="absolute -inset-8 opacity-25 -z-10 pointer-events-none"
              style={{ background: "var(--gradient-hero)", filter: "blur(80px)" }}
            />

            {phase === "done" && (
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="flex items-center gap-3">
                  <span className="size-9 rounded-full bg-brand text-white grid place-items-center shadow-[var(--shadow-glow)]">
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Reel ready to ship</p>
                    <p className="text-xs text-muted-foreground">
                      Rendered in <span className="font-mono">{formatEta(elapsedSec)}</span> · 1080×1920 · {STAGES.length} stages
                    </p>
                  </div>
                </div>
                <Badge className="rounded-full bg-hero text-white border-0">@aisimplified</Badge>
              </div>
            )}

            <div className="grid md:grid-cols-[1.05fr_1fr] gap-6 md:gap-8">
              {/* Unified preview box — renders animation, then morphs to play the video */}
              <div className="relative mx-auto w-full max-w-[300px] md:max-w-none">
                <div
                  className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-foreground/10 shadow-[var(--shadow-card)] transition-colors duration-700"
                  style={{
                    background: phase === "rendering" ? "var(--gradient-hero)" : "#000",
                  }}
                >
                  {phase === "rendering" ? (
                    <>
                      <div className="absolute inset-0 grid grid-cols-6 grid-rows-10 gap-px p-px">
                        {Array.from({ length: 60 }).map((_, i) => {
                          const threshold = (i * 0.6180339887) % 1;
                          const cleared = progress / 100 > threshold;
                          return (
                            <div
                              key={i}
                              className="transition-opacity duration-300"
                              style={{
                                opacity: cleared ? 0 : 0.55,
                                background: "oklch(0.18 0.06 280)",
                              }}
                            />
                          );
                        })}
                      </div>

                      <div
                        aria-hidden
                        className="absolute left-0 right-0 h-[30%] pointer-events-none mix-blend-screen"
                        style={{
                          top: 0,
                          animation: "renderScan 1.4s linear infinite",
                          background:
                            "linear-gradient(to bottom, transparent, oklch(1 0 0 / 0.55) 50%, transparent)",
                        }}
                      />

                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none px-4 text-center">
                        <p className="text-[10px] uppercase tracking-[0.3em] opacity-80 font-mono">Elapsed</p>
                        <p className="text-5xl md:text-6xl font-bold font-mono tabular-nums tracking-tight drop-shadow">
                          {formatEta(elapsedSec)}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.2em] opacity-70 font-mono mt-1">
                          Step {Math.min(stageIdx + 1, STAGES.length)} of {STAGES.length}
                        </p>
                        {activeLabel && (
                          <p className="text-[11px] opacity-85 mt-3 font-medium leading-tight max-w-[200px] line-clamp-2">
                            {activeLabel}
                          </p>
                        )}
                      </div>

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <Badge className="bg-black/45 text-white border-0 backdrop-blur text-[10px] uppercase tracking-[0.2em] gap-1.5">
                          <span className="size-1.5 rounded-full bg-red-400 animate-pulse" /> Rendering
                        </Badge>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-white/80">
                          1080×1920 · 30fps
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/85 text-[10px] font-mono uppercase tracking-widest pointer-events-none">
                        <span>9:16 · H.264</span>
                        <span className="tabular-nums">{progress.toFixed(1)}%</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <video
                        key={videoUrl ?? "rendered-result"}
                        src={videoUrl ?? "/demo-reel.mp4"}
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                        preload="auto"
                        className="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in-95 duration-700"
                      />
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                        <Badge className="bg-brand text-white border-0 text-[10px] uppercase tracking-[0.2em] gap-1.5 shadow-[var(--shadow-glow)]">
                          <Check className="size-2.5" strokeWidth={3} /> Rendered
                        </Badge>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-white/90 bg-black/40 backdrop-blur px-2 py-0.5 rounded-full">
                          1080×1920 · 30fps
                        </span>
                      </div>
                    </>
                  )}
                </div>
                {phase === "done" && (
                  <Badge className="absolute -top-2 -right-2 bg-brand text-white border-0 shadow-lg z-10">
                    Viral 🔥
                  </Badge>
                )}
              </div>

              {/* Right panel — ETA + stages OR hook + caption + hashtags */}
              <div className="flex flex-col min-w-0">
                {phase === "rendering" ? (
                  <>
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Elapsed · est ~25 min
                        </p>
                        <p className="text-5xl md:text-6xl font-semibold tracking-tighter font-mono tabular-nums leading-none mt-2">
                          {formatEta(elapsedSec)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Forge</p>
                        <p
                          className="text-3xl font-semibold tracking-tight tabular-nums bg-clip-text text-transparent mt-2"
                          style={{ backgroundImage: "var(--gradient-hero)" }}
                        >
                          {Math.floor(progress)}%
                        </p>
                      </div>
                    </div>

                    <div className="relative h-2 rounded-full bg-secondary overflow-hidden mt-5">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                          width: `${progress}%`,
                          background: "var(--gradient-hero)",
                          transition: "width 80ms linear",
                        }}
                      />
                      <div
                        aria-hidden
                        className="absolute inset-y-0 left-0 w-1/3 opacity-70 mix-blend-screen pointer-events-none"
                        style={{
                          animation: "renderShimmer 1.6s linear infinite",
                          background:
                            "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.7), transparent)",
                        }}
                      />
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <StatPill label="Engine" value="HeyGen + Skill" />
                      <StatPill label="Events" value={String(eventCount)} />
                      <StatPill label="Artifacts" value={String(artifactCount)} />
                    </div>

                    <div className="mt-6 space-y-1.5">
                      {STAGES.map((s, i) => {
                        const status: "done" | "active" | "pending" =
                          i < stageIdx ? "done" : i === stageIdx ? "active" : "pending";
                        return (
                          <div key={s.label} className="flex items-center gap-2.5 text-sm">
                            {status === "done" && (
                              <span className="size-4 rounded-full bg-brand text-white grid place-items-center shrink-0">
                                <Check className="size-2.5" strokeWidth={3} />
                              </span>
                            )}
                            {status === "active" && (
                              <span className="size-4 rounded-full border-2 border-brand border-t-transparent animate-spin shrink-0" />
                            )}
                            {status === "pending" && (
                              <span className="size-4 rounded-full border border-border shrink-0" />
                            )}
                            <span
                              className={
                                status === "pending"
                                  ? "text-muted-foreground"
                                  : status === "active"
                                  ? "font-medium"
                                  : "text-muted-foreground line-through decoration-muted-foreground/40"
                              }
                            >
                              {s.label}
                            </span>
                            {status === "active" && (
                              <span className="ml-auto text-[11px] font-mono text-muted-foreground tabular-nums truncate hidden sm:inline">
                                {s.detail}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Channel</p>
                      <p className="text-xl md:text-2xl font-semibold leading-tight">
                        @aisimplified
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Word-pinned Playfair captions · 1.3× speed · 1080×1920
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Render summary</p>
                      <div className="grid grid-cols-2 gap-2">
                        <StatPill label="Total time" value={formatEta(elapsedSec)} />
                        <StatPill label="Pipeline events" value={String(eventCount)} />
                        <StatPill label="Artifacts" value={String(artifactCount)} />
                        <StatPill label="Stages" value={`${STAGES.length}/${STAGES.length}`} />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {videoUrl && (
                        <Button asChild className="rounded-full bg-hero text-white border-0 hover:opacity-90">
                          <a href={videoUrl} download={`reel-${Date.now()}.mp4`}>
                            <Download className="size-4" /> Download MP4
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="rounded-full border-border bg-background/60"
                        onClick={() => setPhase("idle")}
                      >
                        <Wand2 className="size-4" /> Generate another
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Filmstrip — animates during render, locks to 100% when done */}
            <div className="mt-7 pt-6 border-t border-border/60">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Pipeline · {STAGES.length} stages
                </p>
                <p className="text-xs font-mono text-muted-foreground tabular-nums">
                  {phase === "done" ? STAGES.length : Math.min(stageIdx + 1, STAGES.length)} / {STAGES.length}
                </p>
              </div>
              <div
                className="grid gap-1"
                style={{ gridTemplateColumns: "repeat(36, minmax(0, 1fr))" }}
              >
                {Array.from({ length: 36 }).map((_, i) => {
                  const p = phase === "done" ? 100 : progress;
                  const filled = p / 100 > i / 36;
                  const isCurrent =
                    phase === "rendering" &&
                    i / 36 < progress / 100 &&
                    (i + 1) / 36 > progress / 100;
                  return (
                    <div
                      key={i}
                      className="h-7 rounded-md transition-all duration-300"
                      style={{
                        background: filled ? "var(--gradient-hero)" : "var(--color-secondary)",
                        opacity: filled ? 1 : 0.5,
                        transform: isCurrent ? "scaleY(1.25)" : "scaleY(1)",
                        transformOrigin: "bottom",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </Card>
        )}
      </div>
    </section>
  );
}

function Features() {
  const feats = [
    { icon: Zap, title: "Viral hooks in 0–3s", desc: "Trained on 50k+ shorts that crossed 1M views." },
    { icon: Film, title: "Scene-by-scene shot list", desc: "B-roll suggestions, cuts, transitions and pacing." },
    { icon: Type, title: "Auto captions & on-screen text", desc: "Burned-in style that matches the algorithm's taste." },
    { icon: Music2, title: "Trending music cues", desc: "We surface sounds spiking right now on YouTube & TikTok." },
    { icon: Newspaper, title: "Any source, any topic", desc: "X, news articles, blog posts, or raw text — all welcome." },
    { icon: Share2, title: "One-click export", desc: "Send straight to CapCut, Premiere or Descript." },
  ];
  return (
    <section id="features" className="py-24 bg-secondary/40 border-y border-border/50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <Badge variant="outline" className="rounded-full">Features</Badge>
          <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
            Everything you need to ship a reel that pops off.
          </h2>
        </div>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {feats.map((f) => (
            <Card key={f.title} className="p-6 rounded-3xl border-border/60 hover:shadow-[var(--shadow-card)] transition group">
              <div className="size-11 rounded-2xl bg-background border border-border/60 grid place-items-center group-hover:bg-hero transition">
                <f.icon className="size-5 group-hover:text-white transition" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Paste your source", d: "Drop an X URL, article link, or raw text." },
    { n: "02", t: "AI breaks it down", d: "We extract the angle, the controversy, and the hook." },
    { n: "03", t: "Get your reel kit", d: "Script, scenes, captions, hashtags and music — done." },
  ];
  return (
    <section id="how" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <Badge variant="outline" className="rounded-full">How it works</Badge>
          <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
            Three steps. Sixty seconds. One viral reel.
          </h2>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {steps.map((s) => (
            <div key={s.n} className="relative p-8 rounded-3xl bg-secondary/40 border border-border/60">
              <span className="text-6xl font-semibold tracking-tighter bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
                {s.n}
              </span>
              <h3 className="mt-4 text-xl font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  const items = [
    {
      src: "/videos/showcase-trump-phone.mp4",
      title: "This $499 Trump Phone is INSANE 💀",
      views: "3.2M",
      tag: "Tech",
    },
    {
      src: "/videos/showcase-higgsfield.mp4",
      title: "Higgsfield MCP with Claude changes ads forever 🤯",
      views: "1.8M",
      tag: "AI tools",
    },
    {
      src: "/videos/showcase-veo-seedance.mp4",
      title: "Google Veo 4 vs Seedance 2.0 😳",
      views: "2.4M",
      tag: "AI video",
    },
    {
      src: "/videos/showcase-google-cursor.mp4",
      title: "Google just reinvented the cursor 🤯",
      views: "4.1M",
      tag: "AI",
    },
  ];
  return (
    <section id="showcase" className="py-24 bg-secondary/40 border-y border-border/50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div className="max-w-2xl">
            <Badge variant="outline" className="rounded-full">Showcase</Badge>
            <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
              Reels our users shipped this week.
            </h2>
          </div>
        </div>
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <div key={item.src} className="group">
              <div className="aspect-[9/16] rounded-3xl border border-border/60 relative overflow-hidden bg-black shadow-[var(--shadow-card)]">
                <video
                  src={item.src}
                  controls
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="pointer-events-none absolute top-3 left-3 z-10">
                  <Badge className="bg-background/80 text-foreground border-0 backdrop-blur">{item.tag}</Badge>
                </div>
              </div>
              <div className="mt-3 px-1">
                <p className="text-sm font-semibold leading-tight">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.views} views</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    { q: "What sources can I use?", a: "Any X post URL, news article link, blog post, or raw pasted text. We handle the rest." },
    { q: "Do you actually make the video?", a: "We generate the full reel kit — hook, script, scenes, captions, hashtags and music cues. Film it in CapCut or any editor." },
    { q: "Is there a free plan?", a: "Yes — 3 reels per month, forever, no credit card needed." },
    { q: "Can I use it for any niche?", a: "Tech, finance, sports, lifestyle, politics — if it trends, we can package it as a reel." },
  ];
  return (
    <section className="py-24 bg-secondary/40 border-y border-border/50">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="rounded-full">FAQ</Badge>
          <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">Questions, answered.</h2>
        </div>
        <div className="space-y-3">
          {items.map((i) => (
            <details
              key={i.q}
              className="group p-6 rounded-2xl bg-background border border-border/60"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium">
                {i.q}
                <span className="size-6 rounded-full bg-secondary grid place-items-center group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{i.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative rounded-[2.5rem] overflow-hidden p-12 md:p-20 text-center text-white"
             style={{ background: "var(--gradient-hero)" }}>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight">
              Your next viral reel is one paste away.
            </h2>
            <p className="mt-4 text-lg text-white/85 max-w-xl mx-auto">
              Join thousands of creators turning the news cycle into views, daily.
            </p>
            <Button
              size="lg"
              className="mt-8 rounded-full h-12 px-8 bg-background text-foreground hover:bg-background/90"
              asChild
            >
              <a href="#generate">Start forging — it&apos;s free <ArrowRight className="size-4" /></a>
            </Button>
          </div>
          <div className="absolute -top-20 -right-20 size-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-white/10 blur-3xl" />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-10">
      <div className="mx-auto max-w-7xl px-6 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="size-6 rounded-md bg-hero" />
          © 2026 ReelForge. Made for creators who ship.
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Contact</a>
        </div>
      </div>
    </footer>
  );
}
