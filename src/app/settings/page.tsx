import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  const integrations: Array<{
    name: string;
    label: string;
    envKey: string;
    status: "ok" | "missing" | "scripted";
    note: string;
  }> = [
    {
      name: "HeyGen",
      label: "Avatar V · Lipsync · Translate · Video Agent",
      envKey: "HEYGEN_API_KEY",
      status: process.env.HEYGEN_API_KEY ? "ok" : "missing",
      note: "Renders the avatar video, multilingual variants, and live host calls.",
    },
    {
      name: "ElevenLabs",
      label: "Voice clone (imported into HeyGen)",
      envKey: "HEYGEN_VOICE_ID",
      status: process.env.HEYGEN_VOICE_ID ? "ok" : "missing",
      note: "Cloned voice 'Raunak M' wired into HeyGen as a private voice.",
    },
    {
      name: "Fal",
      label: "FLUX schnell · thumbnails + B-roll",
      envKey: "FAL_KEY",
      status: process.env.FAL_KEY
        ? "ok"
        : process.env.GEMINI_API_KEY
        ? "scripted"
        : "missing",
      note: "Generates 4-variant thumbnails for A/B testing. Gemini configured as fallback.",
    },
    {
      name: "PostHog",
      label: "Events · HogQL read-back",
      envKey: "POSTHOG_API_KEY",
      status: process.env.POSTHOG_API_KEY ? "ok" : "missing",
      note: "Captures view + retention events; agent reads HogQL each morning.",
    },
    {
      name: "LLM brain",
      label: process.env.LLM_PROVIDER ?? "scripted",
      envKey: "LLM_PROVIDER",
      status:
        process.env.LLM_PROVIDER === "anthropic"
          ? process.env.ANTHROPIC_API_KEY
            ? "ok"
            : "missing"
          : "scripted",
      note: "scripted = canned reasoning (demo-safe). anthropic = real API. claude-code = shell to local CLI.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <header className="mb-10">
          <Badge variant="outline" className="rounded-full">Configuration</Badge>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
            Settings
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            ReelForge is local-only by default. Drop API keys into{" "}
            <code className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-xs">
              .env.local
            </code>{" "}
            to switch any integration from scripted to live.
          </p>
        </header>

        <section className="mb-10">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Channel
          </h2>
          <Card className="rounded-3xl border-border/60 shadow-[var(--shadow-card)] p-6">
            <Row label="Handle" value={process.env.CHANNEL_HANDLE ?? "@aisimplified"} mono />
            <Row label="Avatar look ID" value={process.env.HEYGEN_AVATAR_LOOK_ID ?? "—"} mono />
            <Row label="Voice ID" value={process.env.HEYGEN_VOICE_ID ?? "—"} mono />
          </Card>
        </section>

        <section>
          <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Integrations
          </h2>
          <Card className="rounded-3xl border-border/60 shadow-[var(--shadow-card)] divide-y divide-border/60 overflow-hidden">
            {integrations.map((i) => (
              <IntegrationRow key={i.name} {...i} />
            ))}
          </Card>
        </section>
      </main>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={`text-sm text-foreground ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function IntegrationRow({
  name,
  label,
  envKey,
  status,
  note,
}: {
  name: string;
  label: string;
  envKey: string;
  status: "ok" | "missing" | "scripted";
  note: string;
}) {
  const statusConfig = {
    ok: {
      Icon: CheckCircle2,
      text: "Live",
      cls: "text-emerald-700 bg-emerald-500/10 ring-emerald-500/20",
    },
    missing: {
      Icon: XCircle,
      text: "Not configured",
      cls: "text-destructive bg-destructive/10 ring-destructive/20",
    },
    scripted: {
      Icon: AlertCircle,
      text: "Scripted (demo-safe)",
      cls: "text-amber-700 bg-amber-500/10 ring-amber-500/30",
    },
  };
  const s = statusConfig[status];
  return (
    <div className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-semibold text-foreground">{name}</span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {envKey}
            </span>
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
          <div className="mt-2 text-xs text-muted-foreground">{note}</div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ${s.cls}`}
        >
          <s.Icon className="size-3" />
          {s.text}
        </span>
      </div>
    </div>
  );
}
