import { LiveRunPanel } from "@/components/live-run-panel";
import { ReelFromUrlPanel } from "@/components/reel-from-url-panel";

export default function LiveRunPage() {
  // If a pre-rendered demo reel exists, fall back to it when live render isn't ready.
  // The agent run will overwrite videoUrl when it actually produces one.
  const demoReelUrl = "/demo-reel.mp4";

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <header className="mb-8">
        <div className="text-xs font-medium uppercase tracking-wider text-cyan-300">
          Live Agent
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">
          Run Phantom from any URL
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-400">
          Paste an X post or article. Phantom ingests it, writes a 5-beat reel
          in @aisimplified&apos;s voice, generates avatar + B-roll, composes in
          HyperFrames, and renders a 1080×1920 vertical reel.
        </p>
      </header>

      <ReelFromUrlPanel defaultDemoVideo={demoReelUrl} />

      <section className="mt-16 border-t border-zinc-800 pt-10">
        <h2 className="text-lg font-medium text-zinc-100">
          Daily autonomous run
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          The original 9-step agent loop: read PostHog → rewrite prompt → ship
          a video. Runs nightly without a URL input.
        </p>
        <div className="mt-5">
          <LiveRunPanel />
        </div>
      </section>
    </div>
  );
}
