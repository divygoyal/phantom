import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

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
    <div className="mx-auto max-w-4xl px-8 py-10">
      <header className="mb-8">
        <div className="text-xs font-medium uppercase tracking-wider text-cyan-300">
          Configuration
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">
          Settings
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-400">
          Phantom is local-only by default. Drop API keys into{" "}
          <code className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-xs text-zinc-300">
            .env.local
          </code>{" "}
          to switch any integration from scripted to live.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-zinc-500">
          Channel
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <Row label="Handle" value={process.env.CHANNEL_HANDLE ?? "@aisimplified"} mono />
          <Row label="Avatar look ID" value={process.env.HEYGEN_AVATAR_LOOK_ID ?? "—"} mono />
          <Row label="Voice ID" value={process.env.HEYGEN_VOICE_ID ?? "—"} mono />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-zinc-500">
          Integrations
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 divide-y divide-zinc-800/60">
          {integrations.map((i) => (
            <IntegrationRow key={i.name} {...i} />
          ))}
        </div>
      </section>
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
    <div className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
      <span className="text-sm text-zinc-400">{label}</span>
      <span
        className={`text-sm text-zinc-200 ${
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
      cls: "text-emerald-400 bg-emerald-500/10",
    },
    missing: {
      Icon: XCircle,
      text: "Not configured",
      cls: "text-red-400 bg-red-500/10",
    },
    scripted: {
      Icon: AlertCircle,
      text: "Scripted (demo-safe)",
      cls: "text-amber-400 bg-amber-500/10",
    },
  };
  const s = statusConfig[status];
  return (
    <div className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-medium text-zinc-100">{name}</span>
            <span className="font-mono text-[10px] text-zinc-500">
              {envKey}
            </span>
          </div>
          <div className="mt-0.5 text-xs text-zinc-400">{label}</div>
          <div className="mt-2 text-xs text-zinc-500">{note}</div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.cls}`}
        >
          <s.Icon className="h-3 w-3" />
          {s.text}
        </span>
      </div>
    </div>
  );
}
