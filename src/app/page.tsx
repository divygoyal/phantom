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
      <Pricing />
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
          <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
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
                <div className="size-10 rounded-full bg-foreground grid place-items-center text-background font-bold text-sm shrink-0">𝕏</div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">@elonmusk</p>
                  <p className="text-xs text-muted-foreground">2h · 14.2M views</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed">
                Neuralink just enabled a paralyzed patient to control a robotic arm with their thoughts. The future is now.
              </p>
              <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                <span>↻ 48k</span><span>♡ 312k</span><span>↗ 22k</span>
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
                <img src="/hero.jpg" alt="Viral reel preview" width={540} height={960} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <Badge className="bg-red-500 border-0 text-white">● LIVE</Badge>
                  <span className="font-mono">0:47</span>
                </div>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="size-14 rounded-full bg-white/95 grid place-items-center shadow-2xl">
                    <Play className="size-5 fill-foreground text-foreground ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-bold uppercase tracking-wider opacity-80">YouTube Shorts</p>
                  <p className="text-base font-bold leading-tight mt-1">&ldquo;This Neuralink update will blow your mind 🤯&rdquo;</p>
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
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<null | {
    hook: string;
    script: { time: string; scene: string; voiceover: string }[];
    caption: string;
    hashtags: string[];
    music: string;
  }>(null);

  const handle = () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput(null);
    setTimeout(() => {
      setOutput({
        hook: "You won't believe what just happened in the AI world…",
        script: [
          { time: "0:00", scene: "Close-up reaction to phone screen", voiceover: "Stop scrolling. This changes everything." },
          { time: "0:08", scene: "Text overlay with breaking headline", voiceover: "Here's what just dropped — and why it matters to you." },
          { time: "0:22", scene: "Quick cuts of B-roll + screen recording", voiceover: "Three things you need to know right now." },
          { time: "0:40", scene: "Direct-to-camera CTA", voiceover: "Follow for more — I break down a story like this every day." },
        ],
        caption: "The internet is losing it over this 👇 Save this before it gets buried.",
        hashtags: ["#shorts", "#ai", "#breakingnews", "#tech", "#viral"],
        music: "Upbeat lo-fi build → drop at 0:22 (Trending: 'Aesthetic' — Tollan Kim)",
      });
      setLoading(false);
    }, 1400);
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
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {["AI breakthrough X post", "Sports headline", "Startup funding news"].map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/70 transition"
                >
                  {s}
                </button>
              ))}
            </div>
            <Button
              onClick={handle}
              disabled={loading}
              size="lg"
              className="rounded-full h-12 px-6 bg-foreground text-background hover:bg-foreground/90"
            >
              {loading ? (
                <>
                  <span className="size-4 rounded-full border-2 border-background/40 border-t-background animate-spin" />
                  Forging your reel…
                </>
              ) : (
                <>
                  Generate viral reel <Wand2 className="size-4" />
                </>
              )}
            </Button>
          </div>
        </Card>

        {output && (
          <Card className="mt-6 p-6 md:p-8 rounded-3xl border-border/60 shadow-[var(--shadow-card)] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Hook (0–3s)</p>
                  <p className="text-2xl font-semibold leading-tight">&ldquo;{output.hook}&rdquo;</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Scene-by-scene script</p>
                  <ol className="space-y-3">
                    {output.script.map((s, i) => (
                      <li key={i} className="flex gap-4 p-3 rounded-2xl bg-secondary/50">
                        <span className="text-sm font-mono text-brand font-semibold pt-0.5">{s.time}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{s.scene}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">&ldquo;{s.voiceover}&rdquo;</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Caption</p>
                  <p className="text-sm">{output.caption}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Hashtags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {output.hashtags.map((h) => (
                      <span key={h} className="text-xs px-2 py-1 rounded-full bg-secondary">{h}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Music cue</p>
                  <p className="text-sm text-muted-foreground">{output.music}</p>
                </div>
                <Button className="w-full rounded-full bg-hero text-white border-0 hover:opacity-90">
                  <Share2 className="size-4" /> Export to CapCut
                </Button>
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
    { title: "OpenAI launches GPT-6", views: "3.2M", tag: "Tech" },
    { title: "Bitcoin breaks $200k", views: "1.8M", tag: "Finance" },
    { title: "Lakers stunning comeback", views: "2.4M", tag: "Sports" },
    { title: "Apple Vision Pro 2 leak", views: "4.1M", tag: "Gadgets" },
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
          {items.map((item, i) => (
            <div key={item.title} className="group cursor-pointer">
              <div
                className="aspect-[9/16] rounded-3xl border border-border/60 relative overflow-hidden"
                style={{ background: "var(--gradient-hero)", filter: `hue-rotate(${i * 50}deg)` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-background/80 text-foreground border-0 backdrop-blur">{item.tag}</Badge>
                </div>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="size-14 rounded-full bg-background/90 grid place-items-center group-hover:scale-110 transition">
                    <Play className="size-5 fill-foreground text-foreground" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-sm font-semibold leading-tight">{item.title}</p>
                  <p className="text-xs opacity-80 mt-1">{item.views} views</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: "Starter", price: "$0", desc: "Try it out", features: ["3 reels / month", "Basic hooks", "Standard export"], cta: "Start free" },
    { name: "Creator", price: "$19", desc: "For daily posters", features: ["Unlimited reels", "Viral hook engine", "Trending music cues", "CapCut export"], cta: "Go viral", featured: true },
    { name: "Studio", price: "$49", desc: "For teams & agencies", features: ["Everything in Creator", "5 brand voices", "Team workspace", "Priority support"], cta: "Contact sales" },
  ];
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="outline" className="rounded-full">Pricing</Badge>
          <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
            Simple pricing. Built for creators.
          </h2>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {tiers.map((t) => (
            <Card
              key={t.name}
              className={`p-8 rounded-3xl border-border/60 ${
                t.featured ? "border-foreground/80 shadow-[var(--shadow-glow)] relative" : ""
              }`}
            >
              {t.featured && (
                <Badge className="absolute -top-3 left-8 bg-hero text-white border-0">
                  Most popular
                </Badge>
              )}
              <h3 className="text-lg font-semibold">{t.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
              <p className="mt-6 text-5xl font-semibold tracking-tight">
                {t.price}
                <span className="text-base font-normal text-muted-foreground">/mo</span>
              </p>
              <Button
                className={`mt-6 w-full rounded-full ${
                  t.featured
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : "bg-secondary text-foreground hover:bg-secondary/70"
                }`}
              >
                {t.cta}
              </Button>
              <ul className="mt-8 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-brand" /> {f}
                  </li>
                ))}
              </ul>
            </Card>
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
