"use client";
import { useState } from "react";
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
} from "lucide-react";

const STAGES = [
  { label: "Fetching source content", detail: "Scraping x.com" },
  { label: "Extracting key claims", detail: "GPT-4o · 4 chunks" },
  { label: "Drafting viral hook", detail: "12 variants scored" },
  { label: "Writing scene script", detail: "4 scenes · 58s cut" },
  { label: "Synthesizing voiceover", detail: "ElevenLabs · Brian" },
  { label: "Generating B-roll", detail: "FLUX 1.1 · 8 shots" },
  { label: "Matching trending audio", detail: "342 tracks ranked" },
  { label: "Burning captions", detail: "Word-level sync" },
  { label: "Rendering 9:16 frames", detail: "1800 frames · GPU" },
  { label: "Encoding 1080p H.264", detail: "ffmpeg · veryfast" },
  { label: "Mastering audio", detail: "−14 LUFS" },
  { label: "Finalizing reel", detail: "Packaging MP4" },
] as const;

const SUGGESTIONS = [
  { label: "Try: ChatGPT viral prompt", value: "https://x.com/altryne/status/1843921478239827841" },
  { label: "AI breakthrough X post", value: "https://x.com/openai/status/1839921478239827841" },
  { label: "Startup funding news", value: "https://techcrunch.com/2026/05/15/ai-startup-mega-round/" },
] as const;

const TOTAL_FRAMES = 1800;
const FAKE_DURATION_SEC = 298;
const REAL_DURATION_MS = 10000;

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
  const [phase, setPhase] = useState<"idle" | "rendering" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const [etaSec, setEtaSec] = useState(FAKE_DURATION_SEC);
  const [frame, setFrame] = useState(0);
  const [fps, setFps] = useState(142);
  const [vramGb, setVramGb] = useState(2.1);

  const start = () => {
    if (!input.trim()) return;
    setPhase("rendering");
    setProgress(0);
    setStageIdx(0);
    setEtaSec(FAKE_DURATION_SEC);
    setFrame(0);

    const startedAt = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / REAL_DURATION_MS);
      const eased = 1 - Math.pow(1 - t, 1.5);
      setProgress(eased * 100);
      setEtaSec(FAKE_DURATION_SEC * (1 - eased));
      setFrame(Math.round(TOTAL_FRAMES * eased));
      setStageIdx(Math.min(STAGES.length - 1, Math.floor(t * STAGES.length)));
      setFps(110 + Math.round(Math.random() * 60));
      setVramGb(2 + Math.round((eased * 5 + Math.random() * 0.5) * 10) / 10);
      if (t < 1) requestAnimationFrame(tick);
      else setPhase("done");
    };
    requestAnimationFrame(tick);
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
                      Rendered in <span className="font-mono">4:58</span> · 1080×1920 · 6.2 MB
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

                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none">
                        <p className="text-[10px] uppercase tracking-[0.3em] opacity-80 font-mono">Frame</p>
                        <p className="text-5xl md:text-6xl font-bold font-mono tabular-nums tracking-tight drop-shadow">
                          {String(frame).padStart(4, "0")}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.2em] opacity-70 font-mono mt-1">
                          of {TOTAL_FRAMES}
                        </p>
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
                        key="rendered-result"
                        src="/videos/demo-chatgpt-viral.mp4"
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
                          Estimated time left
                        </p>
                        <p className="text-5xl md:text-6xl font-semibold tracking-tighter font-mono tabular-nums leading-none mt-2">
                          {formatEta(etaSec)}
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
                      <StatPill label="GPU" value="A100" />
                      <StatPill label="Throughput" value={`${fps} fps`} />
                      <StatPill label="VRAM" value={`${vramGb.toFixed(1)} GB`} />
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
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-700">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Hook (0–3s)</p>
                      <p className="text-xl md:text-2xl font-semibold leading-tight">
                        &ldquo;This ChatGPT prompt is going viral — and it changes everything.&rdquo;
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Caption</p>
                      <p className="text-sm">
                        Save this before OpenAI patches it 👇 Three lines that turn ChatGPT into your personal research analyst.
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Hashtags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {["#shorts", "#chatgpt", "#aiprompts", "#productivity", "#viral"].map((h) => (
                          <span key={h} className="text-xs px-2 py-1 rounded-full bg-secondary">{h}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Music cue</p>
                      <p className="text-sm text-muted-foreground">
                        Tense lo-fi build → drop at 0:14 · &ldquo;Aesthetic&rdquo; — Tollan Kim
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button className="rounded-full bg-hero text-white border-0 hover:opacity-90">
                        <Share2 className="size-4" /> Post to @aisimplified
                      </Button>
                      <Button variant="outline" className="rounded-full border-border bg-background/60">
                        Download MP4
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
                  Timeline · {TOTAL_FRAMES} frames
                </p>
                <p className="text-xs font-mono text-muted-foreground tabular-nums">
                  {phase === "done" ? TOTAL_FRAMES : frame} / {TOTAL_FRAMES}
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
