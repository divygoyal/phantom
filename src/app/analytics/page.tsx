import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-10">
          <Badge variant="outline" className="rounded-full">PostHog · last 7 days</Badge>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
            What ReelForge learned this week
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            The agent reads these funnels via HogQL each morning and rewrites its
            prompt template. The diff lives in{" "}
            <Link href="/prompts" className="text-brand hover:underline underline-offset-4">
              Prompts
            </Link>
            .
          </p>
        </header>

        {/* Top hooks */}
        <section className="mb-10">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Hook performance (10s retention)
          </h2>
          <Card className="overflow-hidden rounded-3xl border-border/60 shadow-[var(--shadow-card)]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/60 bg-secondary/40 text-left text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  <th className="px-6 py-3.5 font-medium">Hook type</th>
                  <th className="px-6 py-3.5 font-medium">Videos</th>
                  <th className="px-6 py-3.5 font-medium">10s retention</th>
                  <th className="px-6 py-3.5 font-medium">vs baseline</th>
                  <th className="px-6 py-3.5 font-medium">Agent&apos;s call</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                <HookRow
                  hook="“You're using X wrong”"
                  count={4}
                  retention="78%"
                  lift="+310%"
                  lifted
                  verdict="promote"
                />
                <HookRow
                  hook="“The truth about Y”"
                  count={3}
                  retention="61%"
                  lift="+130%"
                  lifted
                  verdict="keep"
                />
                <HookRow
                  hook="“I tried Z so you don't have to”"
                  count={2}
                  retention="42%"
                  lift="+60%"
                  lifted
                  verdict="keep"
                />
                <HookRow
                  hook="“In this video we'll cover…”"
                  count={1}
                  retention="18%"
                  lift="-31%"
                  verdict="kill"
                />
                <HookRow
                  hook="“Top 5 ways to…”"
                  count={2}
                  retention="22%"
                  lift="-22%"
                  verdict="kill"
                />
              </tbody>
            </table>
          </Card>
        </section>

        {/* Thumbnail A/B */}
        <section className="mb-10">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Thumbnail A/B test winners (CTR)
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { v: "A", ctr: "8.4%", win: true, style: "Close-up + arrow + bold" },
              { v: "B", ctr: "3.1%", style: "Wide shot + plain text" },
              { v: "C", ctr: "5.7%", style: "Three-panel split" },
              { v: "D", ctr: "2.2%", style: "Logo + tagline" },
            ].map((t) => (
              <Card
                key={t.v}
                className={`relative rounded-3xl p-5 ${
                  t.win
                    ? "border-foreground/50 shadow-[var(--shadow-glow)]"
                    : "border-border/60"
                }`}
              >
                {t.win && (
                  <Badge className="absolute -top-3 left-5 bg-hero text-white border-0">
                    Winner
                  </Badge>
                )}
                <div
                  className="aspect-video rounded-2xl mb-4"
                  style={{
                    background: "var(--gradient-hero)",
                    filter: `hue-rotate(${["A", "B", "C", "D"].indexOf(t.v) * 60}deg)`,
                    opacity: 0.85,
                  }}
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground">
                    Variant {t.v}
                  </span>
                  <span
                    className={`text-base font-semibold tabular-nums ${
                      t.win ? "text-brand" : "text-foreground"
                    }`}
                  >
                    {t.ctr}
                  </span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{t.style}</div>
              </Card>
            ))}
          </div>
        </section>

        {/* Watch curve */}
        <section>
          <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Audience retention curve · this morning&apos;s video
          </h2>
          <Card className="rounded-3xl border-border/60 shadow-[var(--shadow-card)] p-7">
            <div className="flex items-end gap-1 h-36">
              {[
                100, 96, 92, 88, 86, 84, 82, 80, 78, 76, 74, 72, 70, 68, 66, 64,
                62, 60, 58, 56, 54, 52, 50, 49, 48, 47, 46, 45, 44, 43, 42, 41,
                40, 40, 39, 39, 38, 38, 37, 37,
              ].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{
                    height: `${h}%`,
                    background: "var(--gradient-hero)",
                    opacity: 0.7,
                  }}
                  title={`${i * 2.25}s · ${h}%`}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>0:00</span>
              <span>0:45</span>
              <span>1:30</span>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Avg view duration
                </div>
                <div className="mt-1 text-2xl font-semibold tracking-tight">3:42</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  10s retention
                </div>
                <div className="mt-1 text-2xl font-semibold tracking-tight text-brand">
                  86%
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  CTR (overall)
                </div>
                <div className="mt-1 text-2xl font-semibold tracking-tight">8.4%</div>
              </div>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}

function HookRow({
  hook,
  count,
  retention,
  lift,
  lifted,
  verdict,
}: {
  hook: string;
  count: number;
  retention: string;
  lift: string;
  lifted?: boolean;
  verdict: "promote" | "keep" | "kill";
}) {
  const verdictStyles = {
    promote: "bg-hero text-white border-0",
    keep: "bg-secondary text-secondary-foreground border-0",
    kill: "bg-destructive/10 text-destructive border border-destructive/20",
  } as const;
  return (
    <tr className="hover:bg-secondary/40 transition">
      <td className="px-6 py-4 text-foreground">{hook}</td>
      <td className="px-6 py-4 text-muted-foreground tabular-nums">{count}</td>
      <td className="px-6 py-4 font-semibold tabular-nums">{retention}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1 tabular-nums font-medium ${
            lifted ? "text-emerald-600" : "text-destructive"
          }`}
        >
          {lifted ? (
            <TrendingUp className="size-3.5" />
          ) : (
            <TrendingDown className="size-3.5" />
          )}
          {lift}
        </span>
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${verdictStyles[verdict]}`}
        >
          {verdict}
        </span>
      </td>
    </tr>
  );
}
