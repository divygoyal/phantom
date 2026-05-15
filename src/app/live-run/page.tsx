import { LiveRunPanel } from "@/components/live-run-panel";
import { ReelFromUrlPanel } from "@/components/reel-from-url-panel";
import { SiteNav } from "@/components/site-nav";
import { Badge } from "@/components/ui/badge";

export default function LiveRunPage() {
  const demoReelUrl = "/demo-reel.mp4";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-10">
          <Badge variant="outline" className="rounded-full">
            <span className="size-1.5 rounded-full bg-brand animate-pulse mr-1.5" />
            Live agent
          </Badge>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
            Run ReelForge from any URL
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Paste an X post or article. We ingest the source, write a 5-beat reel
            in @aisimplified&apos;s voice, generate avatar + B-roll, compose in
            HyperFrames, and render a 1080×1920 vertical reel.
          </p>
        </header>

        <ReelFromUrlPanel defaultDemoVideo={demoReelUrl} />

        <section className="mt-20 pt-12 border-t border-border/60">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Daily autonomous run
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The original 9-step agent loop: read PostHog → rewrite prompt → ship
            a video. Runs nightly without a URL input.
          </p>
          <div className="mt-6">
            <LiveRunPanel />
          </div>
        </section>
      </main>
    </div>
  );
}
