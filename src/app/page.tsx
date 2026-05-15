import Link from "next/link";
import {
  Ghost,
  TrendingUp,
  Eye,
  Clock,
  ArrowUpRight,
  Globe,
} from "lucide-react";

export default function ChannelPage() {
  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-cyan-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400"></span>
              </span>
              Agent active
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-50">
              @aisimplified
            </h1>
            <p className="mt-2 max-w-lg text-zinc-400">
              Phantom is autonomously running this channel. Picks topics, drafts
              scripts, renders avatar videos, and learns from PostHog what
              works.
            </p>
          </div>
          <Link
            href="/live-run"
            className="group inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-cyan-400"
          >
            Run Agent Now
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </header>

      {/* Stats */}
      <section className="mb-10 grid grid-cols-4 gap-3">
        <StatCard
          label="Subscribers"
          value="50,400"
          delta="+340 today"
          deltaPositive
          Icon={TrendingUp}
        />
        <StatCard
          label="Videos this week"
          value="4"
          delta="all auto-generated"
          Icon={Ghost}
        />
        <StatCard
          label="Views (7d)"
          value="142.6K"
          delta="+18% vs last week"
          deltaPositive
          Icon={Eye}
        />
        <StatCard
          label="Avg watch time"
          value="3:42"
          delta="+12s vs last week"
          deltaPositive
          Icon={Clock}
        />
      </section>

      {/* Latest video */}
      <section className="mb-10">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg font-medium text-zinc-100">
            Latest video — published this morning
          </h2>
          <Link
            href="/analytics"
            className="text-xs text-zinc-500 hover:text-zinc-300"
          >
            View analytics →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
            <div className="aspect-video bg-gradient-to-br from-zinc-800 via-zinc-900 to-cyan-950 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full bg-zinc-950/80 px-3 py-1 text-xs text-zinc-300 ring-1 ring-zinc-700">
                  preview placeholder · plays the real render at demo time
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="rounded bg-zinc-950/80 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
                  1080×1920 · 0:90
                </span>
                <span className="flex items-center gap-1.5 rounded bg-zinc-950/80 px-2 py-0.5 text-[10px] text-zinc-400">
                  <Globe className="h-3 w-3" /> EN · HI · ES
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-base font-medium text-zinc-100">
                You&apos;re using ChatGPT wrong — here&apos;s why
              </h3>
              <p className="mt-1.5 text-sm text-zinc-400">
                Hook generated from prompt template v4. Script drafted by
                Phantom, voiced as @aisimplified via the cloned voice imported
                into HeyGen.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <Tag color="cyan">HeyGen · Avatar V</Tag>
                <Tag color="cyan">HeyGen · Lipsync</Tag>
                <Tag color="cyan">HeyGen · Translate</Tag>
                <Tag color="violet">ElevenLabs · Cloned voice</Tag>
                <Tag color="fuchsia">Fal · FLUX schnell</Tag>
                <Tag color="amber">PostHog · Tracking</Tag>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h3 className="text-sm font-medium text-zinc-300">
              Why this hook?
            </h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              The agent read PostHog yesterday and noticed that videos with the{" "}
              <span className="text-zinc-200 font-medium">
                &ldquo;you&rsquo;re using X wrong&rdquo;
              </span>{" "}
              hook had{" "}
              <span className="text-cyan-300 font-semibold">4.1× retention</span>{" "}
              past the 10-second mark.
            </p>
            <Link
              href="/prompts"
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-cyan-300 hover:text-cyan-200"
            >
              See the prompt diff →
            </Link>
          </div>
        </div>
      </section>

      {/* Last 24 hours of activity */}
      <section>
        <h2 className="text-lg font-medium text-zinc-100 mb-4">
          Last 24 hours of agent activity
        </h2>
        <div className="space-y-2">
          <ActivityRow
            time="08:02"
            event="Read PostHog funnel. Identified 'you're using X wrong' hooks converted 4.1× baseline."
            kind="analytics"
          />
          <ActivityRow
            time="08:03"
            event="Updated prompt template to v4. Reasoning: 'you're using X wrong' hooks dominate retention curves."
            kind="prompt"
          />
          <ActivityRow
            time="08:08"
            event="Picked topic: 'You're using ChatGPT wrong — here's why' (trending in r/ChatGPT, 14k upvotes)"
            kind="topic"
          />
          <ActivityRow
            time="08:09"
            event="Drafted script v1 (412 words, ~90s target) with Claude"
            kind="script"
          />
          <ActivityRow
            time="08:11"
            event="Generated 4 thumbnail variants via Fal FLUX schnell"
            kind="asset"
          />
          <ActivityRow
            time="08:14"
            event="Rendered avatar video via HeyGen Avatar V (1080×1920)"
            kind="render"
          />
          <ActivityRow
            time="08:14"
            event="Translated to Hindi + Spanish via HeyGen Video Translate"
            kind="translate"
          />
          <ActivityRow
            time="08:15"
            event="Published. Now tracking views via PostHog — agent reads back tomorrow."
            kind="publish"
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  delta,
  deltaPositive,
  Icon,
}: {
  label: string;
  value: string;
  delta: string;
  deltaPositive?: boolean;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-zinc-500">
          {label}
        </span>
        <Icon className="h-4 w-4 text-zinc-500" />
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-zinc-50">
        {value}
      </div>
      <div
        className={`mt-1 text-xs ${
          deltaPositive ? "text-emerald-400" : "text-zinc-400"
        }`}
      >
        {delta}
      </div>
    </div>
  );
}

function Tag({
  children,
  color,
}: {
  children: React.ReactNode;
  color: "cyan" | "violet" | "fuchsia" | "amber";
}) {
  const colors: Record<typeof color, string> = {
    cyan: "bg-cyan-400/10 text-cyan-300 ring-cyan-400/20",
    violet: "bg-violet-400/10 text-violet-300 ring-violet-400/20",
    fuchsia: "bg-fuchsia-400/10 text-fuchsia-300 ring-fuchsia-400/20",
    amber: "bg-amber-400/10 text-amber-300 ring-amber-400/20",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ${colors[color]}`}
    >
      {children}
    </span>
  );
}

const kindStyles: Record<
  string,
  { label: string; cls: string }
> = {
  analytics: { label: "Analytics", cls: "bg-cyan-400/10 text-cyan-300" },
  prompt: { label: "Prompt", cls: "bg-violet-400/10 text-violet-300" },
  topic: { label: "Topic", cls: "bg-amber-400/10 text-amber-300" },
  script: { label: "Script", cls: "bg-emerald-400/10 text-emerald-300" },
  asset: { label: "Assets", cls: "bg-fuchsia-400/10 text-fuchsia-300" },
  render: { label: "Render", cls: "bg-sky-400/10 text-sky-300" },
  translate: { label: "Translate", cls: "bg-rose-400/10 text-rose-300" },
  publish: { label: "Publish", cls: "bg-zinc-50/10 text-zinc-200" },
};

function ActivityRow({
  time,
  event,
  kind,
}: {
  time: string;
  event: string;
  kind: keyof typeof kindStyles;
}) {
  const k = kindStyles[kind];
  return (
    <div className="flex items-start gap-4 rounded-lg border border-zinc-800/60 bg-zinc-900/20 px-4 py-3 transition-colors hover:bg-zinc-900/40">
      <span className="mt-0.5 font-mono text-xs text-zinc-500 tabular-nums">
        {time}
      </span>
      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${k.cls}`}
      >
        {k.label}
      </span>
      <span className="text-sm text-zinc-300">{event}</span>
    </div>
  );
}
