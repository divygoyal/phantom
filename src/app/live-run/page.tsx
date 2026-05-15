import { LiveRunPanel } from "@/components/live-run-panel";

export default function LiveRunPage() {
  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <header className="mb-8">
        <div className="text-xs font-medium uppercase tracking-wider text-cyan-300">
          Live Agent
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">
          Run Phantom now
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-400">
          Watch the agent read your PostHog analytics, rewrite its own prompt
          template, pick today&apos;s topic, draft a script, generate
          thumbnails, render an avatar video, and publish — all live.
        </p>
      </header>

      <LiveRunPanel />
    </div>
  );
}
